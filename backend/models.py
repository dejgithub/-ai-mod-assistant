from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ModerationAction(str, Enum):
    APPROVE = "APPROVE"
    REMOVE = "REMOVE"
    WARN = "WARN"
    ESCALATE = "ESCALATE"


class RiskLevel(str, Enum):
    SAFE = "SAFE"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class PostSubmission(BaseModel):
    subreddit: str
    title: str
    content: str
    author: str
    post_id: Optional[str] = None


class ModerationResult(BaseModel):
    post_id: str
    title: str
    content: str
    author: str
    subreddit: str
    toxicity_score: float
    spam_score: float
    hate_speech_score: float
    nsfw_score: float
    risk_level: RiskLevel
    suggested_action: ModerationAction
    ai_explanation: str
    reasons: List[str]
    moderated_at: str
    ai_confidence: float


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: str


class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ModerationStats(BaseModel):
    total_posts: int
    approved: int
    removed: int
    warned: int
    escalated: int
    average_toxicity: float
    average_spam: float
    posts_by_risk: Dict[str, int]
    recent_activity: List[Dict[str, Any]]


class DashboardData(BaseModel):
    stats: ModerationStats
    recent_moderations: List[ModerationResult]
    risk_distribution: Dict[str, int]
    activity_timeline: List[Dict[str, Any]]
    top_flagged_subreddits: List[Dict[str, Any]]


class SettingsUpdate(BaseModel):
    api_key: Optional[str] = None
    ai_provider: Optional[str] = None
    moderation_sensitivity: Optional[float] = None
    monitored_subreddits: Optional[List[str]] = None
    auto_moderate: Optional[bool] = None
    theme: Optional[str] = None
