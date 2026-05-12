from fastapi import APIRouter, Query
from typing import List, Optional
from backend.models import PostSubmission, ModerationResult, ModerationAction
from backend.services.moderation_service import moderation_service
from backend.services.reddit_service import reddit_service

router = APIRouter(prefix="/api/moderation", tags=["Moderation"])


@router.post("/analyze", response_model=ModerationResult)
def analyze_post(post: PostSubmission):
    result = moderation_service.moderate_post(
        title=post.title,
        content=post.content,
        author=post.author,
        subreddit=post.subreddit,
        post_id=post.post_id,
    )
    return result


@router.post("/analyze-batch")
def analyze_batch(posts: List[PostSubmission]):
    post_dicts = [p.model_dump() for p in posts]
    results = moderation_service.moderate_posts_batch(post_dicts)
    return {"results": results, "count": len(results)}


@router.get("/subreddit/{subreddit}")
def moderate_subreddit(subreddit: str, limit: int = Query(25, ge=1, le=100)):
    posts = reddit_service.get_hot_posts(subreddit, limit=limit)
    results = moderation_service.moderate_posts_batch(posts)
    return {"subreddit": subreddit, "results": results, "count": len(results)}


@router.get("/history")
def get_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    subreddit: Optional[str] = None,
    risk_level: Optional[str] = None,
    action: Optional[str] = None,
):
    logs = moderation_service.get_moderation_history(
        limit=limit, offset=offset,
        subreddit=subreddit, risk_level=risk_level, action=action,
    )
    return {"logs": logs, "count": len(logs)}


@router.get("/dashboard/{subreddit}")
def get_dashboard(subreddit: str = "all", limit: int = Query(50, ge=1, le=100)):
    data = moderation_service.get_dashboard_data(subreddit, limit)
    return data


@router.post("/analyze-devvit")
def analyze_devvit(post: PostSubmission):
    result = moderation_service.moderate_post(
        title=post.title,
        content=post.content,
        author=post.author,
        subreddit=post.subreddit,
        post_id=post.post_id,
    )
    return {
        "toxicity_score": result["toxicity_score"],
        "spam_score": result["spam_score"],
        "hate_speech_score": result["hate_speech_score"],
        "nsfw_score": result["nsfw_score"],
        "risk_level": result["risk_level"],
        "suggested_action": result["suggested_action"],
        "ai_explanation": result["ai_explanation"],
        "reasons": result["reasons"],
        "ai_confidence": result["ai_confidence"],
    }
