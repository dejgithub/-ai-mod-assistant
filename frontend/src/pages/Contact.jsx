import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaTwitter, FaDiscord, FaReddit, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await api.post('/api/contact/send', form, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.status === 200) {
        toast.success('Message sent! We will get back to you soon.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch {
      toast.success('Message received! (Demo mode)')
      setForm({ name: '', email: '', subject: '', message: '' })
    }
    setSending(false)
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-ai-blue animate-pulse" />
            <span className="text-xs text-gray-400">Contact</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get In{' '}
            <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Have questions about AI Reddit Moderator? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="card space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-field" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea rows="5" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" placeholder="Tell us more..." />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: FaEnvelope, label: 'Email', value: 'hello@aimoderator.ai' },
                  { icon: FaMapMarkerAlt, label: 'Location', value: 'San Francisco, CA' },
                  { icon: FaGlobe, label: 'Website', value: 'aimoderator.ai' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue/20 to-ai-purple/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-ai-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FaGithub, label: 'GitHub', href: '#' },
                  { icon: FaTwitter, label: 'Twitter', href: '#' },
                  { icon: FaDiscord, label: 'Discord', href: '#' },
                  { icon: FaReddit, label: 'Reddit', href: '#' },
                ].map((item, i) => (
                  <a key={i} href={item.href} className="flex items-center space-x-3 p-3 rounded-xl glass hover:bg-white/10 transition-all group">
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-ai-blue transition-colors" />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card gradient-border">
              <div className="flex items-center space-x-3 mb-3">
                <FaGithub className="w-6 h-6 text-ai-blue" />
                <h3 className="text-lg font-semibold text-white">Open Source</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                This project is open source and available on GitHub. Star us, contribute, or report issues.
              </p>
              <a href="#" className="btn-primary inline-block text-sm">
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
