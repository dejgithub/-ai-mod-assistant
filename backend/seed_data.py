from backend.database import SessionLocal, ModerationLog, init_db
from datetime import datetime, timedelta
import random
import json

def seed_moderation_data():
    init_db()
    db = SessionLocal()

    existing = db.query(ModerationLog).count()
    if existing > 10:
        print(f"Database already has {existing} records. Skipping seed.")
        db.close()
        return

    sample_posts = [
        {"title": "New update just dropped!", "content": "Check out this amazing new feature we've been working on for months!", "author": "dev_user", "subreddit": "programming", "toxicity": 0.02, "spam": 0.05, "hate": 0.0, "nsfw": 0.0, "risk": "SAFE", "action": "APPROVE", "confidence": 0.95, "reasons": ["Content appears safe"]},
        {"title": "CLICK HERE FOR FREE IPHONE!!!", "content": "Get your free iPhone now! Limited time offer! Click this link!", "author": "spam_bot_99", "subreddit": "all", "toxicity": 0.1, "spam": 0.95, "hate": 0.0, "nsfw": 0.0, "risk": "CRITICAL", "action": "REMOVE", "confidence": 0.98, "reasons": ["High probability of spam content detected", "Suspicious URL detected"]},
        {"title": "What are your thoughts on this?", "content": "Looking for recommendations on good books to read this summer.", "author": "bookworm42", "subreddit": "books", "toxicity": 0.01, "spam": 0.02, "hate": 0.0, "nsfw": 0.0, "risk": "SAFE", "action": "APPROVE", "confidence": 0.97, "reasons": ["Content appears safe"]},
        {"title": "Buy cheap stuff now!", "content": "Limited time only! Get your exclusive access now before it's too late!", "author": "marketing_guru", "subreddit": "deals", "toxicity": 0.05, "spam": 0.82, "hate": 0.0, "nsfw": 0.0, "risk": "HIGH", "action": "REMOVE", "confidence": 0.88, "reasons": ["High probability of spam content detected"]},
        {"title": "Hot take: controversial opinion", "content": "I think we should discuss the implications of this new policy change.", "author": "bold_thinker", "subreddit": "news", "toxicity": 0.45, "spam": 0.1, "hate": 0.15, "nsfw": 0.0, "risk": "MEDIUM", "action": "WARN", "confidence": 0.72, "reasons": ["Toxic language detected"]},
        {"title": "Help with Python code", "content": "Can someone help me understand how decorators work in Python?", "author": "python_newbie", "subreddit": "learnpython", "toxicity": 0.0, "spam": 0.01, "hate": 0.0, "nsfw": 0.0, "risk": "SAFE", "action": "APPROVE", "confidence": 0.99, "reasons": ["Content appears safe"]},
        {"title": "Make money from home!", "content": "Earn $5000 per week working from home! No experience needed! Sign up now!", "author": "hustle_bro", "subreddit": "all", "toxicity": 0.05, "spam": 0.91, "hate": 0.0, "nsfw": 0.0, "risk": "CRITICAL", "action": "REMOVE", "confidence": 0.96, "reasons": ["High probability of spam content detected", "Suspicious promotional content"]},
        {"title": "NSFW content warning", "content": "This post contains mature content that may not be suitable for all audiences.", "author": "adult_user", "subreddit": "modclub", "toxicity": 0.1, "spam": 0.05, "hate": 0.0, "nsfw": 0.92, "risk": "HIGH", "action": "REMOVE", "confidence": 0.91, "reasons": ["NSFW content detected"]},
        {"title": "Welcome to the community!", "content": "Hi everyone, I'm new here and excited to be part of this community!", "author": "fresh_account", "subreddit": "introductions", "toxicity": 0.0, "spam": 0.01, "hate": 0.0, "nsfw": 0.0, "risk": "SAFE", "action": "APPROVE", "confidence": 0.99, "reasons": ["Content appears safe"]},
        {"title": "Great programming resource", "content": "Here's a comprehensive guide I put together for learning system design.", "author": "senior_dev", "subreddit": "programming", "toxicity": 0.0, "spam": 0.02, "hate": 0.0, "nsfw": 0.0, "risk": "SAFE", "action": "APPROVE", "confidence": 0.98, "reasons": ["Content appears safe"]},
        {"title": "Why you should buy my product", "content": "Visit my website for exclusive deals on the best products you'll ever find!", "author": "seller_001", "subreddit": "shopping", "toxicity": 0.02, "spam": 0.75, "hate": 0.0, "nsfw": 0.0, "risk": "HIGH", "action": "WARN", "confidence": 0.82, "reasons": ["High probability of spam content detected"]},
        {"title": "Hate speech needs to stop", "content": "We need to address the rising hate speech in our community. This is unacceptable.", "author": "concerned_mod", "subreddit": "modclub", "toxicity": 0.65, "spam": 0.02, "hate": 0.78, "nsfw": 0.0, "risk": "CRITICAL", "action": "REMOVE", "confidence": 0.93, "reasons": ["Hate speech detected", "Toxic language detected"]},
    ]

    for post in sample_posts:
        for hours_ago in range(0, 48, random.randint(1, 4)):
            log = ModerationLog(
                post_id=f"seed_{random.randint(10000, 99999)}",
                title=post["title"],
                content=post["content"],
                author=post["author"],
                subreddit=post["subreddit"],
                toxicity_score=post["toxicity"] + random.uniform(-0.05, 0.05),
                spam_score=post["spam"] + random.uniform(-0.05, 0.05),
                hate_speech_score=post["hate"] + random.uniform(-0.03, 0.03),
                nsfw_score=post["nsfw"] + random.uniform(-0.03, 0.03),
                risk_level=post["risk"],
                suggested_action=post["action"],
                ai_confidence=post["confidence"],
                ai_explanation=f"Content analyzed. Risk level: {post['risk']}. Recommended action: {post['action']}.",
                reasons=json.dumps(post["reasons"]),
                moderated_at=datetime.utcnow() - timedelta(hours=hours_ago),
            )
            db.add(log)

    db.commit()
    db.close()
    print(f"Seeded {len(sample_posts)} sample moderation records.")

if __name__ == "__main__":
    seed_moderation_data()
