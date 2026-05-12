import { motion } from 'framer-motion'

export default function SectionTitle({ title, subtitle, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : ''}`}>
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
