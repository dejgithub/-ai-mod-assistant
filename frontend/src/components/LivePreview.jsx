import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ModerationCard from './ModerationCard'

const samplePosts = [
  { title: "New update just dropped! Check it out", content: "I've been working on this for months and I'm excited to share it with you all!", author: "dev_user", subreddit: "r/programming", risk_level: "SAFE", suggested_action: "APPROVE", toxicity_score: 0.02, spam_score: 0.05, ai_explanation: "Content appears safe. No policy violations detected.", ai_confidence: 0.92 },
  { title: "CLICK HERE FOR FREE GIFT CARDS!!!", content: "FREE FREE FREE!!! Click this link to claim your prize!", author: "spam_bot_99", subreddit: "r/all", risk_level: "CRITICAL", suggested_action: "REMOVE", toxicity_score: 0.12, spam_score: 0.95, ai_explanation: "High probability of spam content detected. Multiple spam indicators match known patterns.", ai_confidence: 0.97 },
  { title: "What are your thoughts on this?", content: "Looking for recommendations on good books to read this summer", author: "bookworm42", subreddit: "r/books", risk_level: "SAFE", suggested_action: "APPROVE", toxicity_score: 0.01, spam_score: 0.02, ai_explanation: "Content appears safe. No policy violations detected.", ai_confidence: 0.95 },
  { title: "Buy cheap stuff now! Limited offer!", content: "Limited time only! Get your exclusive access now before it's too late!", author: "marketing_guru", subreddit: "r/deals", risk_level: "HIGH", suggested_action: "REMOVE", toxicity_score: 0.05, spam_score: 0.82, ai_explanation: "Strong spam indicators detected. Suspicious promotional content.", ai_confidence: 0.88 },
  { title: "🔥 Hot take: This is controversial", content: "I think we should discuss the implications of this new policy.", author: "bold_thinker", subreddit: "r/news", risk_level: "MEDIUM", suggested_action: "WARN", toxicity_score: 0.45, spam_score: 0.10, ai_explanation: "Moderate toxicity detected. Monitor for potential escalation.", ai_confidence: 0.72 },
]

export default function LivePreview() {
  const [posts, setPosts] = useState(samplePosts.slice(0, 3))
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      setPosts(prev => {
        const newPost = samplePosts[Math.floor(Math.random() * samplePosts.length)]
        return [newPost, ...prev.slice(0, 2)]
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Live Moderation Feed</h3>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-gray-500">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
            isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isLive ? 'Stop' : 'Resume'}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.map((post, i) => (
          <motion.div
            key={`${post.title}-${i}`}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <ModerationCard post={post} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
