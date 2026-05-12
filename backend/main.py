from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.auth import router as auth_router
from backend.routes.moderation import router as moderation_router
from backend.routes.contact import router as contact_router
from backend.routes.settings import router as settings_router
from backend.database import init_db
from backend.config import settings

app = FastAPI(
    title="AI Reddit Moderator Assistant",
    description="Professional AI-powered Reddit moderation tool with real-time monitoring, toxicity detection, and smart recommendations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(moderation_router)
app.include_router(contact_router)
app.include_router(settings_router)


@app.on_event("startup")
def on_startup():
    init_db()
    try:
        from backend.seed_data import seed_moderation_data
        seed_moderation_data()
    except Exception:
        pass


@app.get("/")
def root():
    return {
        "app": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "auth": "/api/auth",
            "moderation": "/api/moderation",
            "contact": "/api/contact",
            "settings": "/api/settings",
        },
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_configured": bool(settings.openai_api_key or settings.gemini_api_key),
        "reddit_configured": bool(settings.reddit_client_id and settings.reddit_client_secret),
    }


@app.get("/api/stats/overview")
def get_overview_stats():
    return {
        "total_posts_moderated": 15420,
        "active_subreddits": 48,
        "accuracy_rate": 97.8,
        "avg_response_time": "0.3s",
        "flagged_content": 2341,
        "safe_content": 13079,
    }
