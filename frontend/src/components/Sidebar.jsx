import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon, ChartBarIcon, ShieldCheckIcon, Cog6ToothIcon,
  ArrowRightOnRectangleIcon, BellIcon,
} from '@heroicons/react/24/outline'

const sidebarLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { path: '/dashboard?tab=queue', label: 'Mod Queue', icon: ShieldCheckIcon },
  { path: '/dashboard?tab=analytics', label: 'Analytics', icon: HomeIcon },
  { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/5 hidden md:flex flex-col z-40">
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-dark">
        <div className="px-3 mb-6">
          <div className="flex items-center space-x-3 glass rounded-2xl p-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center">
              <span className="text-white font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500">Moderator</p>
            </div>
          </div>
        </div>

        {sidebarLinks.map(link => {
          const Icon = link.icon
          const isActive = location.pathname + location.search === link.path ||
            (link.path === '/dashboard' && location.pathname === '/dashboard' && !location.search)

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.label === 'Mod Queue' && (
                <span className="ml-auto w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center">3</span>
              )}
            </Link>
          )
        })}

        <div className="px-3 pt-6 mt-6 border-t border-white/5">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/5 transition-all cursor-pointer" onClick={logout}>
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <BellIcon className="w-4 h-4 text-ai-blue" />
            <span>AI Mod Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
          </div>
        </div>
      </div>
    </aside>
  )
}
