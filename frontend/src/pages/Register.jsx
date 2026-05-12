import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub, FaGoogle, FaReddit } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    const success = await register(form.username, form.email, form.password)
    if (success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
      <div className="absolute inset-0 bg-gradient-radial from-ai-blue/10 via-transparent to-transparent" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-ai-blue/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-ai-purple/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue to-reddit-orange flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-500 mt-2">Start moderating with AI power</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="input-field" placeholder="mod_user" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="mod@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
            <input type="password" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} className="input-field" placeholder="••••••••" />
          </div>

          <label className="flex items-start space-x-2 text-sm">
            <input type="checkbox" required className="mt-1 rounded border-white/10 bg-white/5 text-ai-blue focus:ring-ai-blue" />
            <span className="text-gray-500">I agree to the <a href="#" className="text-ai-blue">Terms of Service</a> and <a href="#" className="text-ai-blue">Privacy Policy</a></span>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-[#0B0B1A] text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[FaGithub, FaGoogle, FaReddit].map((Icon, i) => (
              <button key={i} className="flex items-center justify-center p-3 rounded-xl glass hover:bg-white/10 transition-all border border-white/5">
                <Icon className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ai-blue font-medium hover:text-ai-blue/80">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
