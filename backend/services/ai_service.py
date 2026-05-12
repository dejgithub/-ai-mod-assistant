import os
import json
import re
from typing import Dict, Any, Tuple, List
from backend.config import settings


class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        self.openai_client = None
        self.gemini_model = None
        self._initialize_ai()

    def _initialize_ai(self):
        if self.provider == "openai" and settings.openai_api_key:
            try:
                import openai
                self.openai_client = openai.OpenAI(api_key=settings.openai_api_key)
            except Exception:
                self.openai_client = None
        elif self.provider == "gemini" and settings.gemini_api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-pro')
            except Exception:
                self.gemini_model = None

    def is_configured(self) -> bool:
        return self.openai_client is not None or self.gemini_model is not None

    def analyze_content(self, title: str, content: str, author: str) -> Dict[str, Any]:
        if self.is_configured():
            return self._ai_analysis(title, content, author)
        return self._rule_based_analysis(title, content, author)

    def _ai_analysis(self, title: str, content: str, author: str) -> Dict[str, Any]:
        prompt = f"""Analyze this Reddit post for moderation purposes:

Title: {title}
Content: {content}
Author: {author}

Return a JSON object with these fields:
- toxicity_score (0.0 to 1.0)
- spam_score (0.0 to 1.0)
- hate_speech_score (0.0 to 1.0) 
- nsfw_score (0.0 to 1.0)
- risk_level (one of: SAFE, LOW, MEDIUM, HIGH, CRITICAL)
- suggested_action (one of: APPROVE, REMOVE, WARN, ESCALATE)
- ai_explanation (1-2 sentence explanation of the decision)
- reasons (array of strings, why this decision was made)
- ai_confidence (0.0 to 1.0)

Respond with ONLY valid JSON, no other text."""

        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.1,
                    max_tokens=500,
                )
                text = response.choices[0].message.content
                return self._parse_ai_response(text)
            except Exception:
                pass
        elif self.gemini_model:
            try:
                response = self.gemini_model.generate_content(prompt)
                text = response.text
                return self._parse_ai_response(text)
            except Exception:
                pass

        return self._rule_based_analysis(title, content, author)

    def _parse_ai_response(self, text: str) -> Dict[str, Any]:
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass
        return self._rule_based_analysis("", "", "")

    def _rule_based_analysis(self, title: str, content: str, author: str) -> Dict[str, Any]:
        text = f"{title} {content}".lower()

        spam_patterns = [
            r'free.*click', r'buy.*now', r'limited.*offer', r'click.*here',
            r'earn.*money', r'work.*home', r'sign.*up', r'exclusive.*deal',
            r'gift.*card', r'win.*free', r'get.*rich', r'check.*this.*out.*(website|link)',
            r'visit.*(my|our).*website', r'don\'t.*miss', r'act.*now',
            r'\b(free|win|prize|cash|bonus|earn)\b.*\b(now|today|click|limited)\b',
        ]
        toxicity_patterns = [
            r'\b(hate|kill|die|stupid|idiot|trash|garbage|useless)\b',
            r'\b(dumb|moron|loser|pathetic|disgusting|horrible)\b',
        ]
        hate_speech_patterns = [
            r'\b(racial|racist|sexist|homophobic|transphobic)\b.*\b(slur|hate|attack)\b',
        ]
        nsfw_keywords = [
            r'\b(nsfw|18\+|adult|porn|sex|nude|explicit)\b',
        ]

        spam_score = self._pattern_score(text, spam_patterns, 3)
        toxicity_score = self._pattern_score(text, toxicity_patterns, 2)
        hate_speech_score = self._pattern_score(text, hate_speech_patterns, 3)
        nsfw_score = self._pattern_score(text, nsfw_keywords, 2)

        try:
            from textblob import TextBlob
            blob = TextBlob(text)
            sentiment_score = abs(blob.sentiment.polarity)
            if sentiment_score > 0.8 and toxicity_score < 0.3:
                toxicity_score = min(1.0, toxicity_score + 0.2)
        except ImportError:
            pass

        scores = {
            "toxicity_score": round(toxicity_score, 2),
            "spam_score": round(spam_score, 2),
            "hate_speech_score": round(hate_speech_score, 2),
            "nsfw_score": round(nsfw_score, 2),
        }

        risk_level, suggested_action, reasons, confidence = self._calculate_risk(scores, title, content)

        return {
            **scores,
            "risk_level": risk_level,
            "suggested_action": suggested_action,
            "ai_explanation": f"Content flagged with {risk_level} risk. "
                              f"Toxicity: {toxicity_score:.2f}, Spam: {spam_score:.2f}, "
                              f"Hate Speech: {hate_speech_score:.2f}, NSFW: {nsfw_score:.2f}. "
                              f"Recommended action: {suggested_action}.",
            "reasons": reasons,
            "ai_confidence": round(confidence, 2),
        }

    def _pattern_score(self, text: str, patterns: list, weight: int) -> float:
        score = 0.0
        for pattern in patterns:
            matches = re.findall(pattern, text)
            score += len(matches) * (0.15 * weight)
        return min(1.0, score)

    def _calculate_risk(self, scores: Dict, title: str, content: str) -> Tuple[str, str, List[str], float]:
        text = f"{title} {content}".lower()
        reasons = []
        max_score = max(scores.values())
        avg_score = sum(scores.values()) / len(scores)

        all_caps_ratio = sum(1 for c in title if c.isupper()) / max(len(title), 1)
        exclamation_count = title.count("!") + content.count("!")
        has_url = bool(re.search(r'https?://\S+', content))

        if scores["spam_score"] > 0.5:
            reasons.append("High probability of spam content detected")
        if scores["toxicity_score"] > 0.5:
            reasons.append("Toxic language detected in post")
        if scores["hate_speech_score"] > 0.3:
            reasons.append("Potential hate speech detected")
        if scores["nsfw_score"] > 0.3:
            reasons.append("NSFW content detected")
        if all_caps_ratio > 0.7 and len(title) > 10:
            reasons.append("Excessive use of capital letters")
        if exclamation_count > 3:
            reasons.append("Multiple exclamation marks suggest spam")
        if has_url and scores["spam_score"] > 0.3:
            reasons.append("Suspicious URL detected in content")

        if max_score >= 0.8:
            risk_level = "CRITICAL"
            suggested_action = "REMOVE"
            confidence = 0.95
            if not reasons:
                reasons.append("Multiple high-risk indicators detected")
        elif max_score >= 0.6:
            risk_level = "HIGH"
            suggested_action = "REMOVE"
            confidence = 0.85
        elif max_score >= 0.4:
            risk_level = "MEDIUM"
            suggested_action = "WARN"
            confidence = 0.70
        elif max_score >= 0.2:
            risk_level = "LOW"
            suggested_action = "ESCALATE"
            confidence = 0.55
        else:
            risk_level = "SAFE"
            suggested_action = "APPROVE"
            confidence = 0.90
            reasons.append("Content appears safe")

        if avg_score > 0.5 and len(reasons) <= 1:
            reasons.append("Multiple risk factors detected")

        return risk_level, suggested_action, reasons, confidence

    def generate_moderation_explanation(self, result: Dict[str, Any]) -> str:
        return result.get("ai_explanation", "No explanation available.")


ai_service = AIService()
