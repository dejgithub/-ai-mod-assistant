import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./moderator.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class ModerationLog(Base):
    __tablename__ = "moderation_logs"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(String(50), index=True)
    title = Column(String(500))
    content = Column(Text)
    author = Column(String(100))
    subreddit = Column(String(100), index=True)
    toxicity_score = Column(Float)
    spam_score = Column(Float)
    hate_speech_score = Column(Float)
    nsfw_score = Column(Float)
    risk_level = Column(String(20))
    suggested_action = Column(String(20))
    ai_confidence = Column(Float)
    ai_explanation = Column(Text)
    reasons = Column(Text)
    moderated_at = Column(DateTime, default=datetime.utcnow)


class SubredditConfig(Base):
    __tablename__ = "subreddit_configs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    name = Column(String(100))
    is_monitored = Column(Boolean, default=True)
    auto_moderate = Column(Boolean, default=False)
    sensitivity = Column(Float, default=0.5)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
