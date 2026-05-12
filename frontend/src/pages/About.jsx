import { motion } from 'framer-motion'
import { FaReddit, FaRobot, FaShieldAlt, FaBrain, FaGithub, FaRocket } from 'react-icons/fa'
import SectionTitle from '../components/SectionTitle'

const milestones = [
  { year: '2024', title: 'Project Conception', desc: 'Identified the need for AI-powered Reddit moderation tools' },
  { year: '2024', title: 'MVP Development', desc: 'Built core AI moderation engine with PRAW integration' },
  { year: '2025', title: 'Beta Launch', desc: 'Released beta version to 100+ moderators for testing' },
  { year: '2026', title: 'Full Launch', desc: 'Production release with advanced analytics and real-time monitoring' },
]

const team = [
  { name: 'AI Engine', role: 'Core Moderation', icon: FaBrain, color: 'from-ai-blue to-blue-600' },
  { name: 'PRAW Integration', role: 'Reddit API Layer', icon: FaReddit, color: 'from-reddit-orange to-orange-600' },
  { name: 'Security Suite', role: 'Threat Detection', icon: FaShieldAlt, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Analytics', role: 'Data & Insights', icon: FaRocket, color: 'from-ai-purple to-purple-600' },
]

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-ai-blue animate-pulse" />
            <span className="text-xs text-gray-400">About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building a Safer{' '}
            <span className="gradient-text">Reddit</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            AI Reddit Moderator is a cutting-edge moderation assistant that combines artificial intelligence
            with Reddit's API to help moderators keep their communities safe, clean, and engaging.
          </p>
        </motion.div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-500 mb-4">
              We believe that every online community deserves effective, unbiased, and tireless moderation.
              Our mission is to empower Reddit moderators with AI tools that handle the grunt work of
              content moderation, freeing them to focus on building thriving communities.
            </p>
            <p className="text-gray-500">
              By combining state-of-the-art natural language processing with Reddit's powerful API,
              we've created a moderation assistant that's accurate, fast, and always available.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-white mb-4">Why AI Moderation?</h2>
            <div className="space-y-4">
              {[
                '24/7 automated monitoring across multiple subreddits',
                '97.8% accuracy in detecting toxic and spam content',
                'Real-time analysis with sub-second response times',
                'Consistent, unbiased moderation decisions',
                'Detailed AI explanations for every moderation action',
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* How AI Moderation Works */}
        <SectionTitle title="How AI Moderation Works" subtitle="Our technology stack and methodology" />
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { title: '1. Content Ingestion', desc: 'Posts and comments are fetched via the Reddit API (PRAW) and queued for analysis.', icon: FaReddit },
            { title: '2. Multi-Model Analysis', desc: 'Content is analyzed by multiple AI models for toxicity, spam, hate speech, and NSFW detection.', icon: FaBrain },
            { title: '3. Risk Scoring', desc: 'Each piece of content receives a comprehensive risk score across all moderation dimensions.', icon: FaRobot },
            { title: '4. Action Recommendations', desc: 'The system recommends specific actions: APPROVE, REMOVE, WARN, or ESCALATE with explanations.', icon: FaShieldAlt },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-hover flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ai-blue/20 to-ai-purple/20 border border-ai-blue/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-ai-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration */}
        <SectionTitle title="Reddit API Integration" subtitle="Powered by PRAW (Python Reddit API Wrapper)" />
        <div className="glass rounded-3xl p-8 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'Subreddit Monitoring', value: 'Real-time' },
              { label: 'Posts Analyzed', value: '15K+' },
              { label: 'API Uptime', value: '99.9%' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold gradient-text">{item.value}</p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <SectionTitle title="Our Journey" subtitle="From concept to production" />
        <div className="relative mb-20">
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-ai-blue via-ai-purple to-transparent" />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'} hidden md:block`}>
                  <h3 className="text-white font-semibold">{m.title}</h3>
                  <p className="text-sm text-gray-500">{m.desc}</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-ai-blue border-4 border-[#0B0B1A] flex-shrink-0 relative z-10" />
                <div className={`flex-1 md:hidden`}>
                  <h3 className="text-white font-semibold">{m.title}</h3>
                  <p className="text-sm text-gray-500">{m.desc}</p>
                </div>
                <div className={`flex-1 text-${i % 2 === 0 ? 'left' : 'right'} hidden md:block`}>
                  <span className="text-sm font-medium text-ai-blue">{m.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <SectionTitle title="Powered By" subtitle="The technology behind the scenes" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {team.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card text-center group hover:border-ai-blue/30">
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${t.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <t.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
