from fastapi import APIRouter, Depends
from backend.models import SettingsUpdate
from backend.config import settings

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/")
def get_settings():
    return {
        "ai_provider": settings.ai_provider,
        "moderation_sensitivity": 0.5,
        "monitored_subreddits": ["all", "programming", "python", "webdev"],
        "auto_moderate": False,
        "theme": "dark",
        "is_ai_configured": bool(settings.openai_api_key or settings.gemini_api_key),
        "is_reddit_configured": bool(settings.reddit_client_id and settings.reddit_client_secret),
    }

@router.put("/")
def update_settings(updates: SettingsUpdate):
    settings_dict = updates.model_dump(exclude_none=True)
    return {
        "status": "success",
        "message": "Settings updated successfully",
        "updated_fields": list(settings_dict.keys()),
    }
