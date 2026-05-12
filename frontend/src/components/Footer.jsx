import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter, FaDiscord, FaReddit } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="glass border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-blue to-reddit-orange flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-lg gradient-text">Moderator</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-md">
              AI-powered Reddit moderation assistant that keeps your community safe, 
              clean, and engaging with real-time monitoring and smart automation.
            </p>
            <div className="flex space-x-4 mt-6">
              {[FaGithub, FaTwitter, FaDiscord, FaReddit].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-ai-blue hover:border-ai-blue/30 transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <div className="space-y-2">
              {['Features', 'Pricing', 'About', 'Contact'].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <div className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <a key={item} href="#" className="block text-sm text-gray-500 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">&copy; 2026 AI Reddit Moderator. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-2 md:mt-0">Made with <span className="text-red-500">&hearts;</span> for the Reddit Mod Tools Hackathon</p>
        </div>
      </div>
    </footer>
  )
}
