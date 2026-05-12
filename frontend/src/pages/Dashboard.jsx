import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import {
  ChartBarIcon, ShieldCheckIcon, ExclamationTriangleIcon,
  MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon,
  CheckCircleIcon, XCircleIcon, BellAlertIcon,
} from '@heroicons/react/24/outline'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import StatCard from '../components/StatCard'
import ModerationCard from '../components/ModerationCard'

const sampleModerations = [
  { post_id: "1", title: "New update just dropped!", content: "Check out this amazing new feature we've been working on!", author: "dev_user", subreddit: "r/programming", toxicity_score: 0.02, spam_score: 0.05, hate_speech_score: 0.0, nsfw_score: 0.0, risk_level: "SAFE", suggested_action: "APPROVE", ai_explanation: "Content appears safe. No policy violations.", ai_confidence: 0.95, moderated_at: new Date().toISOString(), reasons: ["Content appears safe"] },
  { post_id: "2", title: "CLICK HERE FOR FREE IPHONE!!!", content: "Get your free iPhone now! Limited time offer! Click here!", author: "spam_bot", subreddit: "r/all", toxicity_score: 0.1, spam_score: 0.95, hate_speech_score: 0.0, nsfw_score: 0.0, risk_level: "CRITICAL", suggested_action: "REMOVE", ai_explanation: "High spam probability. Known spam patterns detected.", ai_confidence: 0.98, moderated_at: new Date().toISOString(), reasons: ["High probability of spam"] },
  { post_id: "3", title: "Hot take: This needs discussion", content: "I think we really need to talk about this important issue.", author: "thinker_42", subreddit: "r/news", toxicity_score: 0.35, spam_score: 0.05, hate_speech_score: 0.1, nsfw_score: 0.0, risk_level: "MEDIUM", suggested_action: "WARN", ai_explanation: "Moderate toxicity detected. Monitor thread.", ai_confidence: 0.75, moderated_at: new Date().toISOString(), reasons: ["Toxic language detected"] },
  { post_id: "4", title: "Great community resource", content: "Here's a helpful guide I put together for newcomers.", author: "helper_user", subreddit: "r/learnprogramming", toxicity_score: 0.01, spam_score: 0.02, hate_speech_score: 0.0, nsfw_score: 0.0, risk_level: "SAFE", suggested_action: "APPROVE", ai_explanation: "Helpful content. No violations.", ai_confidence: 0.97, moderated_at: new Date().toISOString(), reasons: ["Content appears safe"] },
  { post_id: "5", title: "Buy cheap stuff now!", content: "Limited offer! Get 90% off on all products today only!", author: "marketer_99", subreddit: "r/deals", toxicity_score: 0.05, spam_score: 0.85, hate_speech_score: 0.0, nsfw_score: 0.0, risk_level: "HIGH", suggested_action: "REMOVE", ai_explanation: "Strong spam indicators and suspicious promotional content.", ai_confidence: 0.88, moderated_at: new Date().toISOString(), reasons: ["High spam probability"] },
  { post_id: "6", title: "NSFW content warning", content: "This post contains mature content that may not be suitable.", author: "adult_user", subreddit: "r/nsfw", toxicity_score: 0.1, spam_score: 0.05, hate_speech_score: 0.0, nsfw_score: 0.92, risk_level: "HIGH", suggested_action: "REMOVE", ai_explanation: "NSFW content detected. Flag for moderator review.", ai_confidence: 0.91, moderated_at: new Date().toISOString(), reasons: ["NSFW content detected"] },
  { post_id: "7", title: "Welcome to the community!", content: "Hi everyone, I'm new here and excited to join!", author: "newbie_001", subreddit: "r/introductions", toxicity_score: 0.0, spam_score: 0.01, hate_speech_score: 0.0, nsfw_score: 0.0, risk_level: "SAFE", suggested_action: "APPROVE", ai_explanation: "Friendly welcome post. No issues.", ai_confidence: 0.99, moderated_at: new Date().toISOString(), reasons: ["Content appears safe"] },
  { post_id: "8", title: "Hate speech warning sign", content: "This content contains potentially harmful language.", author: "reporter_01", subreddit: "r/truereddit", toxicity_score: 0.75, spam_score: 0.05, hate_speech_score: 0.85, nsfw_score: 0.0, risk_level: "CRITICAL", suggested_action: "REMOVE", ai_explanation: "Hate speech detected. Immediate removal recommended.", ai_confidence: 0.94, moderated_at: new Date().toISOString(), reasons: ["Hate speech detected", "Toxic language detected"] },
]

const activityData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  posts: Math.floor(Math.random() * 30) + 5,
  flagged: Math.floor(Math.random() * 10),
}))

const riskData = [
  { name: 'SAFE', value: 45, color: '#10B981' },
  { name: 'LOW', value: 20, color: '#3B82F6' },
  { name: 'MEDIUM', value: 18, color: '#F59E0B' },
  { name: 'HIGH', value: 12, color: '#F97316' },
  { name: 'CRITICAL', value: 5, color: '#EF4444' },
]

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'overview'
  const [search, setSearch] = useState('')
  const [filterRisk, setFilterRisk] = useState('ALL')
  const [moderations, setModerations] = useState(sampleModerations)

  const filteredMods = useMemo(() => {
    return moderations.filter(m => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.content.toLowerCase().includes(search.toLowerCase())) return false
      if (filterRisk !== 'ALL' && m.risk_level !== filterRisk) return false
      return true
    })
  }, [search, filterRisk, moderations])

  const stats = useMemo(() => ({
    total: moderations.length,
    approved: moderations.filter(m => m.suggested_action === 'APPROVE').length,
    removed: moderations.filter(m => m.suggested_action === 'REMOVE').length,
    warned: moderations.filter(m => m.suggested_action === 'WARN').length,
    escalated: moderations.filter(m => m.suggested_action === 'ESCALATE').length,
    avgToxicity: moderations.reduce((a, m) => a + m.toxicity_score, 0) / moderations.length,
  }), [moderations])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl text-sm">
          <p className="text-gray-400">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-4 md:p-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Moderation Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time AI-powered content moderation overview</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10 py-2 text-sm w-48 md:w-64"
              />
            </div>
            <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="input-field py-2 text-sm w-32">
              <option value="ALL">All Risk</option>
              <option value="SAFE">Safe</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <button className="p-2 rounded-xl hover:bg-white/5 transition-all" onClick={() => setModerations([...sampleModerations])}>
              <ArrowPathIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 glass rounded-xl p-1 mb-8 overflow-x-auto">
          {['overview', 'queue', 'analytics', 'history'].map(t => (
            <button
              key={t}
              onClick={() => { const p = new URLSearchParams(); p.set('tab', t); window.history.pushState({}, '', `?${p}`); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                tab === t ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t === 'overview' && <ChartBarIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
              {t === 'queue' && <ShieldCheckIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
              {t === 'analytics' && <ExclamationTriangleIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
              {t === 'history' && <BellAlertIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              <StatCard icon={ChartBarIcon} label="Total Posts" value={stats.total} color="blue" trend={12} />
              <StatCard icon={CheckCircleIcon} label="Approved" value={stats.approved} color="emerald" trend={8} />
              <StatCard icon={XCircleIcon} label="Removed" value={stats.removed} color="red" trend={-5} />
              <StatCard icon={ExclamationTriangleIcon} label="Warnings" value={stats.warned} color="yellow" trend={3} />
              <StatCard icon={ShieldCheckIcon} label="Avg Toxicity" value={(stats.avgToxicity * 100).toFixed(1) + '%'} color="purple" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 card">
                <h3 className="text-lg font-semibold text-white mb-4">24-Hour Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="flaggedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="posts" stroke="#4F46E5" fill="url(#postsGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="flagged" stroke="#EF4444" fill="url(#flaggedGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {riskData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskData.map((r, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-gray-500">{r.name}: {r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Moderation Activity</h3>
              <div className="space-y-3">
                {filteredMods.slice(0, 5).map((post, i) => (
                  <ModerationCard key={post.post_id} post={post} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Queue Tab */}
        {tab === 'queue' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Moderation Queue</h3>
              <span className="text-sm text-gray-500">{filteredMods.length} items</span>
            </div>
            <div className="space-y-3">
              {filteredMods.filter(m => m.risk_level !== 'SAFE').map((post, i) => (
                <ModerationCard key={post.post_id} post={post} index={i} />
              ))}
              {filteredMods.filter(m => m.risk_level !== 'SAFE').length === 0 && (
                <p className="text-center text-gray-500 py-8">No flagged items in queue</p>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Toxicity Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="flagged" stroke="#EF4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="posts" stroke="#4F46E5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Action Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { action: 'APPROVE', count: stats.approved },
                    { action: 'REMOVE', count: stats.removed },
                    { action: 'WARN', count: stats.warned },
                    { action: 'ESCALATE', count: stats.escalated },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="action" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Moderation History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Post</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Subreddit</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Risk</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Action</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Toxicity</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMods.map((m, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 text-white truncate max-w-[200px]">{m.title}</td>
                      <td className="py-3 px-2 text-gray-400">{m.subreddit}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          m.risk_level === 'SAFE' ? 'badge-safe' : m.risk_level === 'LOW' ? 'badge-low' : m.risk_level === 'MEDIUM' ? 'badge-medium' : m.risk_level === 'HIGH' ? 'badge-high' : 'badge-critical'
                        }`}>{m.risk_level}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          m.suggested_action === 'APPROVE' ? 'badge-approved' : m.suggested_action === 'REMOVE' ? 'badge-removed' : m.suggested_action === 'WARN' ? 'badge-warned' : 'badge-escalated'
                        }`}>{m.suggested_action}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500" style={{ width: `${m.toxicity_score * 100}%` }} />
                          </div>
                          <span className="text-gray-400">{(m.toxicity_score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-400">{(m.ai_confidence * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
