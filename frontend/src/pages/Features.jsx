import { motion } from 'framer-motion'
import { FaRobot, FaShieldAlt, FaBrain, FaBolt, FaChartLine, FaReddit, FaSearch, FaBell, FaCogs, FaLock, FaGlobe } from 'react-icons/fa'
import SectionTitle from '../components/SectionTitle'

const features = [
  {
    icon: FaRobot, title: 'AI Toxicity Detection',
    desc: 'Advanced NLP models analyze every post and comment for toxic language, harassment, and offensive content with 97.8% accuracy.',
    color: 'from-ai-blue to-blue-600',
    details: ['Sentiment analysis', 'Contextual understanding', 'Multi-language support', 'Custom sensitivity levels'],
  },
  {
    icon: FaShieldAlt, title: 'Spam & Scam Detection',
    desc: 'Identify and filter spam, scams, phishing attempts, and promotional content before they reach your community.',
    color: 'from-emerald-400 to-emerald-600',
    details: ['URL reputation checking', 'Pattern recognition', 'Bot detection', 'Promotional content filtering'],
  },
  {
    icon: FaBrain, title: 'Hate Speech Filtering',
    desc: 'Advanced hate speech detection that understands context and nuance, reducing false positives while catching real issues.',
    color: 'from-red-500 to-red-600',
    details: ['Contextual hate detection', 'Slur identification', 'Dog whistle detection', 'Historical pattern analysis'],
  },
  {
    icon: FaBolt, title: 'Real-Time Moderation',
    desc: 'Monitor multiple subreddits simultaneously with sub-second analysis times and instant moderation recommendations.',
    color: 'from-yellow-400 to-yellow-600',
    details: ['Live feed monitoring', 'Instant alerts', 'Batch processing', 'Webhook integration'],
  },
  {
    icon: FaChartLine, title: 'AI Explanations',
    desc: 'Every moderation decision comes with a clear, natural language explanation so you understand why content was flagged.',
    color: 'from-ai-purple to-purple-600',
    details: ['Natural language reasons', 'Confidence scores', 'Risk breakdowns', 'Evidence highlighting'],
  },
  {
    icon: FaCogs, title: 'Smart Recommendations',
    desc: 'Get intelligent action recommendations: APPROVE, REMOVE, WARN, or ESCALATE based on comprehensive risk analysis.',
    color: 'from-orange-400 to-orange-600',
    details: ['Multi-factor analysis', 'Historical learning', 'Custom thresholds', 'Action prioritization'],
  },
]

const comparisonData = [
  { feature: 'Accuracy', manual: '75%', ai: '97.8%', winner: 'ai' },
  { feature: 'Response Time', manual: '5-30 min', ai: '< 1 sec', winner: 'ai' },
  { feature: 'Coverage', manual: 'Limited', ai: '24/7', winner: 'ai' },
  { feature: 'Consistency', manual: 'Variable', ai: 'Uniform', winner: 'ai' },
  { feature: 'Scalability', manual: '1 subreddit', ai: 'Unlimited', winner: 'ai' },
  { feature: 'Cost Efficiency', manual: 'High', ai: 'Low', winner: 'ai' },
]

export default function Features() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-ai-blue animate-pulse" />
            <span className="text-xs text-gray-400">Features</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Moderate</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Comprehensive AI-powered tools designed to keep your Reddit community safe, engaging, and well-moderated.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="space-y-8 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`card-hover flex flex-col md:flex-row gap-8 p-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                <f.icon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                </div>
                <p className="text-gray-500 mb-4">{f.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {f.details.map((d, j) => (
                    <div key={j} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-ai-blue" />
                      <span className="text-gray-400">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <SectionTitle title="AI vs Traditional Moderation" subtitle="See the difference AI makes" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Feature</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">Traditional Moderation</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium">AI Moderation</th>
                  <th className="text-left py-4 px-4 text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-white font-medium">{item.feature}</td>
                    <td className="py-4 px-4 text-gray-500">{item.manual}</td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${item.winner === 'ai' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.ai}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {item.winner === 'ai' ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">Better</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Equal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
