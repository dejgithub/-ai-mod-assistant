import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon, SparklesIcon, ChartBarIcon, BellAlertIcon,
  MagnifyingGlassIcon, ExclamationTriangleIcon, GlobeAltIcon,
  ArrowTrendingUpIcon, BoltIcon, UserGroupIcon,
} from '@heroicons/react/24/outline'
import { FaReddit, FaRobot, FaShieldAlt, FaBrain, FaBolt, FaChartLine } from 'react-icons/fa'
import StatCard from '../components/StatCard'
import LivePreview from '../components/LivePreview'
import SectionTitle from '../components/SectionTitle'
import AnimatedCounter from '../components/AnimatedCounter'

const features = [
  { icon: FaRobot, title: 'AI Toxicity Detection', desc: 'Advanced AI models detect toxic content with 97.8% accuracy in real-time.' },
  { icon: FaShieldAlt, title: 'Spam & Scam Filtering', desc: 'Automatically identify and filter spam, scams, and malicious content.' },
  { icon: FaBrain, title: 'Smart Recommendations', desc: 'Get intelligent moderation suggestions: APPROVE, REMOVE, WARN, or ESCALATE.' },
  { icon: FaBolt, title: 'Real-time Monitoring', desc: 'Monitor multiple subreddits simultaneously with live moderation feeds.' },
  { icon: FaChartLine, title: 'Advanced Analytics', desc: 'Comprehensive dashboards with risk distribution and activity trends.' },
  { icon: FaReddit, title: 'Reddit API Integration', desc: 'Seamless integration with Reddit via PRAW for automated moderation.' },
]

const stats = [
  { value: 15420, label: 'Posts Moderated', suffix: '+' },
  { value: 48, label: 'Active Subreddits', suffix: '+' },
  { value: 97.8, label: 'Accuracy Rate', suffix: '%' },
  { value: 0.3, label: 'Avg Response', suffix: 's' },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-ai-blue/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-ai-blue/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-purple/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6 border border-ai-blue/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-gray-400">AI-Powered Moderation</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Intelligent{' '}
                <span className="gradient-text">Reddit</span>{' '}
                Moderation
                <br />
                <span className="text-gray-400">Powered by AI</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-lg">
                Protect your community with advanced AI moderation. Real-time toxicity detection,
                spam filtering, and smart recommendations for Reddit moderators.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  <SparklesIcon className="w-5 h-5 inline mr-2 -mt-0.5" />
                  Start Free Trial
                </Link>
                <Link to="/about" className="btn-secondary text-lg px-8 py-4">
                  Learn More
                </Link>
              </div>
              <div className="flex items-center space-x-8 mt-12">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple border-2 border-[#0B0B1A] flex items-center justify-center text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Trusted by</p>
                  <p className="text-sm text-gray-500">500+ moderators</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative">
                <div className="card-3d">
                  <LivePreview />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center glass rounded-2xl p-6">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
                <p className="text-sm text-gray-500 mt-2">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Powerful AI Moderation Features"
            subtitle="Everything you need to keep your Reddit community safe, clean, and engaging."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ai-blue/20 to-ai-purple/20 border border-ai-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-ai-blue" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="How AI Moderation Works"
            subtitle="Three simple steps to protect your community."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: MagnifyingGlassIcon, title: 'Monitor', desc: 'Our AI continuously monitors your subreddits for new posts and comments in real-time.' },
              { step: '02', icon: FaBrain, title: 'Analyze', desc: 'Advanced ML models analyze content for toxicity, spam, hate speech, and NSFW material.' },
              { step: '03', icon: ShieldCheckIcon, title: 'Act', desc: 'Get instant moderation recommendations with confidence scores and AI explanations.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold text-white/5 absolute top-0 right-0">{item.step}</div>
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-ai-blue/20 to-ai-purple/20 border border-ai-blue/10 flex items-center justify-center mb-6">
                  <item.icon className="w-10 h-10 text-ai-blue" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 text-ai-blue/30">
                    <ArrowTrendingUpIcon className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ai-blue/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card gradient-border p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Community Moderation?
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Join 500+ moderators who trust AI Reddit Moderator to keep their communities safe.
              Start your free trial today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-10 py-4">
                <BoltIcon className="w-5 h-5 inline mr-2 -mt-0.5" />
                Get Started Free
              </Link>
              <Link to="/pricing" className="btn-secondary text-lg px-10 py-4">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
