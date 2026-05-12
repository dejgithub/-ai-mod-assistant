import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import SectionTitle from '../components/SectionTitle'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started with AI moderation.',
    features: [
      'Up to 500 posts/month',
      '1 subreddit monitoring',
      'Basic toxicity detection',
      'Spam filtering',
      'Email support',
      'Community access',
    ],
    cta: 'Get Started Free',
    popular: false,
    color: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For serious moderators managing active communities.',
    features: [
      'Up to 10,000 posts/month',
      '10 subreddits monitoring',
      'Advanced AI detection',
      'Hate speech filtering',
      'Real-time moderation feed',
      'Dashboard analytics',
      'Priority support',
      'API access',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    color: 'from-ai-blue to-ai-purple',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    desc: 'For organizations managing multiple large communities.',
    features: [
      'Unlimited posts',
      'Unlimited subreddits',
      'Full AI suite',
      'Custom AI training',
      'White-label options',
      'Advanced analytics',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'Team accounts',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-yellow-400 to-orange-500',
  },
]

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No long-term contracts.' },
  { q: 'How accurate is the AI moderation?', a: 'Our AI achieves 97.8% accuracy across toxicity, spam, and hate speech detection.' },
  { q: 'Do I need Reddit API credentials?', a: 'Yes, you need a Reddit app with API credentials. We provide setup guides.' },
  { q: 'Is my data secure?', a: 'Yes, all data is encrypted in transit and at rest. We never share your data.' },
]

export default function Pricing() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-ai-blue animate-pulse" />
            <span className="text-xs text-gray-400">Pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Choose the plan that fits your community. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-ai-blue to-ai-purple text-white shadow-lg shadow-ai-blue/25">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`card h-full flex flex-col ${plan.popular ? 'border-ai-blue/40 ring-1 ring-ai-blue/20' : ''}`}>
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>

                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start space-x-3">
                      <CheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-400">{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <SectionTitle title="Frequently Asked Questions" subtitle="Everything you need to know" />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover"
            >
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
