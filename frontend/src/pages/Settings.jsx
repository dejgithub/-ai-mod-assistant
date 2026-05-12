import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { Cog6ToothIcon, KeyIcon, GlobeAltIcon, AdjustmentsHorizontalIcon, SwatchIcon } from '@heroicons/react/24/outline'

const settingsSections = [
  { id: 'api', label: 'API Keys', icon: KeyIcon },
  { id: 'subreddits', label: 'Subreddits', icon: GlobeAltIcon },
  { id: 'ai', label: 'AI Sensitivity', icon: AdjustmentsHorizontalIcon },
  { id: 'theme', label: 'Theme', icon: SwatchIcon },
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('api')
  const { darkMode, toggleTheme } = useTheme()
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    gemini: '',
    reddit_client: '',
    reddit_secret: '',
  })
  const [subreddits, setSubreddits] = useState(['programming', 'python', 'webdev'])
  const [newSub, setNewSub] = useState('')
  const [sensitivity, setSensitivity] = useState(0.5)
  const [autoModerate, setAutoModerate] = useState(false)

  const saveApiKeys = () => {
    toast.success('API keys saved successfully!')
  }

  const addSubreddit = () => {
    if (newSub && !subreddits.includes(newSub)) {
      setSubreddits([...subreddits, newSub])
      setNewSub('')
      toast.success(`r/${newSub} added`)
    }
  }

  const removeSubreddit = (sub) => {
    setSubreddits(subreddits.filter(s => s !== sub))
    toast.success(`r/${sub} removed`)
  }

  const saveSensitivity = () => {
    toast.success('AI settings updated')
  }

  const SectionButton = ({ section }) => {
    const Icon = section.icon
    const isActive = activeSection === section.id
    return (
      <button
        onClick={() => setActiveSection(section.id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{section.label}</span>
      </button>
    )
  }

  return (
    <div className="p-4 md:p-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center space-x-3 mb-8">
          <Cog6ToothIcon className="w-8 h-8 text-ai-blue" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-500 mt-1">Configure your moderation assistant</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <nav className="card space-y-2 sticky top-24">
              {settingsSections.map(section => (
                <SectionButton key={section.id} section={section} />
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            {/* API Keys */}
            {activeSection === 'api' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h2 className="text-xl font-semibold text-white mb-1">API Key Management</h2>
                <p className="text-sm text-gray-500 mb-6">Configure your API keys for AI and Reddit integration.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">OpenAI API Key</label>
                    <input type="password" value={apiKeys.openai} onChange={e => setApiKeys({...apiKeys, openai: e.target.value})} className="input-field" placeholder="sk-..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Gemini API Key</label>
                    <input type="password" value={apiKeys.gemini} onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})} className="input-field" placeholder="AIza..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Reddit Client ID</label>
                      <input type="text" value={apiKeys.reddit_client} onChange={e => setApiKeys({...apiKeys, reddit_client: e.target.value})} className="input-field" placeholder="client_id" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Reddit Client Secret</label>
                      <input type="password" value={apiKeys.reddit_secret} onChange={e => setApiKeys({...apiKeys, reddit_secret: e.target.value})} className="input-field" placeholder="secret" />
                    </div>
                  </div>
                  <button onClick={saveApiKeys} className="btn-primary">Save Keys</button>
                </div>
              </motion.div>
            )}

            {/* Subreddits */}
            {activeSection === 'subreddits' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h2 className="text-xl font-semibold text-white mb-1">Subreddit Configuration</h2>
                <p className="text-sm text-gray-500 mb-6">Manage which subreddits to monitor.</p>
                <div className="flex space-x-2 mb-6">
                  <input type="text" value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubreddit()} className="input-field" placeholder="subreddit name" />
                  <button onClick={addSubreddit} className="btn-primary whitespace-nowrap">Add</button>
                </div>
                <div className="space-y-2">
                  {subreddits.map(sub => (
                    <div key={sub} className="flex items-center justify-between p-3 rounded-xl glass hover:bg-white/5 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-reddit-orange/20 to-orange-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-reddit-orange">r/</span>
                        </div>
                        <span className="text-white text-sm">{sub}</span>
                      </div>
                      <button onClick={() => removeSubreddit(sub)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">Remove</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Sensitivity */}
            {activeSection === 'ai' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h2 className="text-xl font-semibold text-white mb-1">AI Moderation Sensitivity</h2>
                <p className="text-sm text-gray-500 mb-6">Adjust how aggressive the AI moderation should be.</p>
                <div className="space-y-8">
                  <div>
                    <label className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <span>Sensitivity Level</span>
                      <span className="text-ai-blue font-medium">{(sensitivity * 100).toFixed(0)}%</span>
                    </label>
                    <input type="range" min="0" max="1" step="0.05" value={sensitivity} onChange={e => setSensitivity(parseFloat(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-white/5 cursor-pointer accent-ai-blue" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Lenient</span>
                      <span>Balanced</span>
                      <span>Strict</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl glass">
                    <div>
                      <p className="text-white font-medium text-sm">Auto Moderate</p>
                      <p className="text-xs text-gray-500 mt-1">Automatically take action on high-risk content</p>
                    </div>
                    <button
                      onClick={() => setAutoModerate(!autoModerate)}
                      className={`relative w-12 h-6 rounded-full transition-all ${autoModerate ? 'bg-ai-blue' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoModerate ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>

                  <button onClick={saveSensitivity} className="btn-primary">Save Settings</button>
                </div>
              </motion.div>
            )}

            {/* Theme */}
            {activeSection === 'theme' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                <h2 className="text-xl font-semibold text-white mb-1">Theme Settings</h2>
                <p className="text-sm text-gray-500 mb-6">Customize the appearance of your dashboard.</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => { if (!darkMode) toggleTheme() }}
                    className={`p-6 rounded-xl text-center transition-all border-2 ${
                      darkMode ? 'glass border-ai-blue/30' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#0B0B1A] border border-white/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white">Dark Mode</p>
                    {darkMode && <p className="text-xs text-ai-blue mt-1">Active</p>}
                  </button>
                  <button
                    onClick={() => { if (darkMode) toggleTheme() }}
                    className={`p-6 rounded-xl text-center transition-all border-2 ${
                      !darkMode ? 'glass border-ai-blue/30' : 'glass'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white">Light Mode</p>
                    {!darkMode && <p className="text-xs text-ai-blue mt-1">Active</p>}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
