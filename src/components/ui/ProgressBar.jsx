import { motion } from 'framer-motion'

/**
 * Animated progress bar. `value` in 0–100.
 */
function ProgressBar({ value = 0, className = '', barClassName = '', showLabel = false, label }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-600">
          <span>{label ?? 'Progress'}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/8">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r from-moss-500 to-moss-400 ${barClassName}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 25 }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
