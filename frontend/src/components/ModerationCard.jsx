import { motion } from 'framer-motion'
import { ShieldCheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

const riskConfig = {
  SAFE: { badge: 'badge-safe', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  LOW: { badge: 'badge-low', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  MEDIUM: { badge: 'badge-medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  HIGH: { badge: 'badge-high', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  CRITICAL: { badge: 'badge-critical', color: 'text-red-400', bg: 'bg-red-500/10' },
}

const actionConfig = {
  APPROVE: { badge: 'badge-approved', label: 'Approved', icon: ShieldCheckIcon },
  REMOVE: { badge: 'badge-removed', label: 'Removed', icon: ExclamationTriangleIcon },
  WARN: { badge: 'badge-warned', label: 'Warning', icon: InformationCircleIcon },
  ESCALATE: { badge: 'badge-escalated', label: 'Escalated', icon: ExclamationTriangleIcon },
}

export default function ModerationCard({ post, index = 0 }) {
  const risk = riskConfig[post.risk_level] || riskConfig.SAFE
  const action = actionConfig[post.suggested_action] || actionConfig.APPROVE
  const ActionIcon = action.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${risk.badge}`}>
              {post.risk_level}
            </span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${action.badge}`}>
              <ActionIcon className="w-3 h-3 inline mr-1 -mt-0.5" />
              {action.label}
            </span>
          </div>
          <h4 className="text-sm font-medium text-white truncate">{post.title}</h4>
        </div>
        <span className="text-xs text-gray-500 ml-2">{post.subreddit}</span>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.content}</p>

      <div className="flex items-center space-x-4 text-xs text-gray-500">
        <span>{post.author}</span>
        <span className={`font-medium ${risk.color}`}>{post.toxicity_score.toFixed(2)} tox</span>
        <span className={`font-medium ${risk.color}`}>{post.spam_score.toFixed(2)} spam</span>
        {post.ai_confidence && (
          <span className="text-ai-blue">{(post.ai_confidence * 100).toFixed(0)}% confidence</span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-xs text-gray-600 italic">{post.ai_explanation}</p>
      </div>
    </motion.div>
  )
}
