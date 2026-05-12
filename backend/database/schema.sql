-- AI Reddit Moderator Assistant Database Schema (PostgreSQL-compatible)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS moderation_logs (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(50),
    title VARCHAR(500),
    content TEXT,
    author VARCHAR(100),
    subreddit VARCHAR(100),
    toxicity_score DOUBLE PRECISION,
    spam_score DOUBLE PRECISION,
    hate_speech_score DOUBLE PRECISION,
    nsfw_score DOUBLE PRECISION,
    risk_level VARCHAR(20),
    suggested_action VARCHAR(20),
    ai_confidence DOUBLE PRECISION,
    ai_explanation TEXT,
    reasons TEXT,
    moderated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_moderation_subreddit ON moderation_logs(subreddit);
CREATE INDEX IF NOT EXISTS idx_moderation_post_id ON moderation_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_moderation_risk ON moderation_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_moderation_action ON moderation_logs(suggested_action);
CREATE INDEX IF NOT EXISTS idx_moderation_date ON moderation_logs(moderated_at);

CREATE TABLE IF NOT EXISTS subreddit_configs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(100),
    is_monitored BOOLEAN DEFAULT TRUE,
    auto_moderate BOOLEAN DEFAULT FALSE,
    sensitivity DOUBLE PRECISION DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    provider VARCHAR(20),
    encrypted_key TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
