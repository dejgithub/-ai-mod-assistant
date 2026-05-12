from typing import List, Dict, Any, Optional
from backend.config import settings

try:
    import praw
    HAS_PRAW = True
except ImportError:
    HAS_PRAW = False


class RedditService:
    def __init__(self):
        self.reddit = None
        self._initialize()

    def _initialize(self):
        if HAS_PRAW and settings.reddit_client_id and settings.reddit_client_secret:
            self.reddit = praw.Reddit(
                client_id=settings.reddit_client_id,
                client_secret=settings.reddit_client_secret,
                user_agent=settings.reddit_user_agent,
            )

    def is_configured(self) -> bool:
        return self.reddit is not None

    def get_hot_posts(self, subreddit: str, limit: int = 25) -> List[Dict[str, Any]]:
        if not self.reddit:
            return self._sample_posts(subreddit, limit)
        try:
            sub = self.reddit.subreddit(subreddit)
            posts = []
            for post in sub.hot(limit=limit):
                posts.append({
                    "id": post.id,
                    "title": post.title,
                    "content": post.selftext,
                    "author": str(post.author),
                    "subreddit": str(post.subreddit),
                    "score": post.score,
                    "upvote_ratio": post.upvote_ratio,
                    "num_comments": post.num_comments,
                    "created_utc": post.created_utc,
                    "over_18": post.over_18,
                    "url": post.url,
                })
            return posts
        except Exception as e:
            return self._sample_posts(subreddit, limit)

    def get_new_posts(self, subreddit: str, limit: int = 25) -> List[Dict[str, Any]]:
        if not self.reddit:
            return self._sample_posts(subreddit, limit)
        try:
            sub = self.reddit.subreddit(subreddit)
            posts = []
            for post in sub.new(limit=limit):
                posts.append({
                    "id": post.id,
                    "title": post.title,
                    "content": post.selftext,
                    "author": str(post.author),
                    "subreddit": str(post.subreddit),
                    "score": post.score,
                    "upvote_ratio": post.upvote_ratio,
                    "num_comments": post.num_comments,
                    "created_utc": post.created_utc,
                    "over_18": post.over_18,
                    "url": post.url,
                })
            return posts
        except Exception as e:
            return self._sample_posts(subreddit, limit)

    def _sample_posts(self, subreddit: str, limit: int = 25) -> List[Dict[str, Any]]:
        import random
        import time

        sample_titles = [
            "New update just dropped! Check it out",
            "What are your thoughts on the latest announcement?",
            "🔥 Hot take: This is the best thing ever",
            "CLICK HERE FOR FREE GIFT CARDS!!!",
            "Buy cheap stuff now! Limited offer!",
            "Looking for recommendations on good books",
            "🚨 BREAKING NEWS: Major breakthrough in tech",
            "How to get started with machine learning?",
            "Win a FREE iPhone! Enter now!",
            "Get rich quick with this one weird trick!",
            "Just joined the community, hello everyone!",
            "Does anyone else think this is a scam?",
            "Visit my website for exclusive deals!",
            "What's your favorite programming language?",
            "Make money from home - no experience needed!",
        ]

        sample_contents = [
            "I've been working on this for months and I'm excited to share it with you all!",
            "This is a legitimate discussion about recent events in our community.",
            "Limited time only! Get your exclusive access now before it's too late!",
            "FREE FREE FREE!!! Click this link to claim your prize!",
            "Looking for feedback on my new project. Any thoughts?",
            "BUY NOW! 90% OFF! Don't miss this amazing opportunity!!!",
            "I think we should discuss the implications of this new policy.",
            "Spread this message to everyone you know! Share share share!",
            "Can someone explain how this technology works?",
            "EARN $5000 PER WEEK!! Work from anywhere! Sign up now!",
        ]

        posts = []
        for i in range(min(limit, len(sample_titles))):
            is_spam = random.random() < 0.2
            posts.append({
                "id": f"sample_{int(time.time())}_{i}",
                "title": sample_titles[i % len(sample_titles)],
                "content": sample_contents[i % len(sample_contents)],
                "author": f"user_{random.randint(1000, 9999)}",
                "subreddit": subreddit,
                "score": random.randint(-5, 500) if not is_spam else random.randint(-50, 10),
                "upvote_ratio": round(random.uniform(0.3, 0.99), 2),
                "num_comments": random.randint(0, 200),
                "created_utc": time.time() - random.randint(0, 86400),
                "over_18": random.random() < 0.05,
                "url": f"https://reddit.com/r/{subreddit}/comments/{i}",
            })
        return posts

    def get_subreddit_info(self, subreddit: str) -> Dict[str, Any]:
        if not self.reddit:
            return {
                "name": subreddit,
                "subscribers": 150000,
                "active_users": 2500,
                "description": f"A community for {subreddit} enthusiasts",
                "created_utc": 1600000000,
            }
        try:
            sub = self.reddit.subreddit(subreddit)
            return {
                "name": sub.display_name,
                "subscribers": sub.subscribers,
                "active_users": sub.active_user_count,
                "description": sub.public_description,
                "created_utc": sub.created_utc,
            }
        except Exception:
            return {"name": subreddit, "subscribers": 0, "active_users": 0}


reddit_service = RedditService()
