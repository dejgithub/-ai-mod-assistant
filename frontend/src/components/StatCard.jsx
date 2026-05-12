import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, sub, color = 'blue', trend }) {
  const colors = {
    blue: 'from-ai-blue to-blue-600',
    purple: 'from-ai-purple to-purple-600',
    orange: 'from-reddit-orange to-orange-600',
    cyan: 'from-cyan-400 to-ai-blue',
    emerald: 'from-emerald-400 to-emerald-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-400 to-yellow-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-hover"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color] || colors.blue} bg-opacity-20 flex items-center justify-center`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
      </div>
    </motion.div>
  )
}
