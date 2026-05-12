from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
from backend.services.reddit_service import reddit_service
from backend.services.ai_service import ai_service
from backend.database import SessionLocal, ModerationLog
import json


class ModerationService:
    def moderate_post(self, title: str, content: str, author: str, subreddit: str, post_id: Optional[str] = None) -> Dict[str, Any]:
        analysis = ai_service.analyze_content(title, content, author)

        result = {
            "post_id": post_id or f"mod_{datetime.utcnow().timestamp():.0f}",
            "title": title,
            "content": content,
            "author": author,
            "subreddit": subreddit,
            **analysis,
            "moderated_at": datetime.utcnow().isoformat(),
        }

        self._save_moderation(result)
        return result

    def moderate_posts_batch(self, posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for post in posts:
            result = self.moderate_post(
                title=post.get("title", ""),
                content=post.get("content", ""),
                author=post.get("author", "unknown"),
                subreddit=post.get("subreddit", "unknown"),
                post_id=post.get("id"),
            )
            results.append(result)
        return results

    def get_dashboard_data(self, subreddit: str = "all", limit: int = 50) -> Dict[str, Any]:
        posts = reddit_service.get_hot_posts(subreddit, limit=limit)
        moderations = self.moderate_posts_batch(posts)

        stats = self._calculate_stats(moderations)
        risk_distribution = self._calculate_risk_distribution(moderations)
        activity_timeline = self._generate_activity_timeline(moderations)
        top_subreddits = self._get_top_flagged_subreddits(moderations)

        return {
            "stats": stats,
            "recent_moderations": moderations[:20],
            "risk_distribution": risk_distribution,
            "activity_timeline": activity_timeline,
            "top_flagged_subreddits": top_subreddits,
        }

    def _calculate_stats(self, moderations: List[Dict]) -> Dict[str, Any]:
        total = len(moderations)
        if total == 0:
            return {
                "total_posts": 0, "approved": 0, "removed": 0,
                "warned": 0, "escalated": 0,
                "average_toxicity": 0, "average_spam": 0,
                "posts_by_risk": {},
                "recent_activity": [],
            }

        actions = {"APPROVE": 0, "REMOVE": 0, "WARN": 0, "ESCALATE": 0}
        risk_counts = {"SAFE": 0, "LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        total_toxicity = 0
        total_spam = 0

        for m in moderations:
            action = m.get("suggested_action", "APPROVE")
            risk = m.get("risk_level", "SAFE")
            if action in actions:
                actions[action] += 1
            if risk in risk_counts:
                risk_counts[risk] += 1
            total_toxicity += m.get("toxicity_score", 0)
            total_spam += m.get("spam_score", 0)

        return {
            "total_posts": total,
            "approved": actions["APPROVE"],
            "removed": actions["REMOVE"],
            "warned": actions["WARN"],
            "escalated": actions["ESCALATE"],
            "average_toxicity": round(total_toxicity / total, 3),
            "average_spam": round(total_spam / total, 3),
            "posts_by_risk": risk_counts,
            "recent_activity": moderations[:10],
        }

    def _calculate_risk_distribution(self, moderations: List[Dict]) -> Dict[str, int]:
        distribution = {"SAFE": 0, "LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        for m in moderations:
            risk = m.get("risk_level", "SAFE")
            if risk in distribution:
                distribution[risk] += 1
        return distribution

    def _generate_activity_timeline(self, moderations: List[Dict]) -> List[Dict[str, Any]]:
        timeline = []
        now = datetime.utcnow()
        for i in range(24):
            hour_ago = now - timedelta(hours=i)
            count = sum(
                1 for m in moderations
                if abs(datetime.fromisoformat(m["moderated_at"]) - hour_ago).total_seconds() < 3600
            )
            timeline.append({
                "hour": hour_ago.strftime("%H:00"),
                "count": count,
            })
        return list(reversed(timeline))

    def _get_top_flagged_subreddits(self, moderations: List[Dict]) -> List[Dict[str, Any]]:
        sub_counts = {}
        for m in moderations:
            sub = m.get("subreddit", "unknown")
            if sub not in sub_counts:
                sub_counts[sub] = {"name": sub, "flagged": 0, "total": 0}
            sub_counts[sub]["total"] += 1
            if m.get("risk_level") in ("HIGH", "CRITICAL"):
                sub_counts[sub]["flagged"] += 1

        sorted_subs = sorted(sub_counts.values(), key=lambda x: x["flagged"], reverse=True)
        for s in sorted_subs:
            s["risk_percentage"] = round((s["flagged"] / max(s["total"], 1)) * 100, 1)
        return sorted_subs[:10]

    def _save_moderation(self, result: Dict[str, Any]):
        try:
            db = SessionLocal()
            log = ModerationLog(
                post_id=result.get("post_id", ""),
                title=result.get("title", ""),
                content=result.get("content", ""),
                author=result.get("author", ""),
                subreddit=result.get("subreddit", ""),
                toxicity_score=result.get("toxicity_score", 0),
                spam_score=result.get("spam_score", 0),
                hate_speech_score=result.get("hate_speech_score", 0),
                nsfw_score=result.get("nsfw_score", 0),
                risk_level=result.get("risk_level", "SAFE"),
                suggested_action=result.get("suggested_action", "APPROVE"),
                ai_confidence=result.get("ai_confidence", 0),
                ai_explanation=result.get("ai_explanation", ""),
                reasons=json.dumps(result.get("reasons", [])),
            )
            db.add(log)
            db.commit()
            db.close()
        except Exception:
            pass

    def get_moderation_history(self, limit: int = 50, offset: int = 0,
                               subreddit: Optional[str] = None,
                               risk_level: Optional[str] = None,
                               action: Optional[str] = None) -> List[Dict[str, Any]]:
        try:
            db = SessionLocal()
            query = db.query(ModerationLog)

            if subreddit:
                query = query.filter(ModerationLog.subreddit == subreddit)
            if risk_level:
                query = query.filter(ModerationLog.risk_level == risk_level.upper())
            if action:
                query = query.filter(ModerationLog.suggested_action == action.upper())

            logs = query.order_by(ModerationLog.moderated_at.desc()).offset(offset).limit(limit).all()
            db.close()

            return [
                {
                    "id": log.id,
                    "post_id": log.post_id,
                    "title": log.title,
                    "content": log.content[:200] + "..." if len(log.content) > 200 else log.content,
                    "author": log.author,
                    "subreddit": log.subreddit,
                    "toxicity_score": log.toxicity_score,
                    "spam_score": log.spam_score,
                    "hate_speech_score": log.hate_speech_score,
                    "nsfw_score": log.nsfw_score,
                    "risk_level": log.risk_level,
                    "suggested_action": log.suggested_action,
                    "ai_confidence": log.ai_confidence,
                    "ai_explanation": log.ai_explanation,
                    "reasons": json.loads(log.reasons) if log.reasons else [],
                    "moderated_at": log.moderated_at.isoformat(),
                }
                for log in logs
            ]
        except Exception:
            return []


moderation_service = ModerationService()
