import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon'

/**
 * Reusable TextInput with label, icon, error and focus states.
 */
function TextInput({
  label,
  htmlFor,
  icon,
  error,
  hint,
  className = '',
  trailing,
  ...rest
}) {
  return (
    <div className={`group ${className}`}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-ink-800"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/70 transition-colors group-focus-within:text-moss-600">
            <Icon name={icon} size={18} />
          </span>
        )}
        <input
          id={htmlFor}
          className={`h-13 w-full rounded-2xl border bg-paper-50 px-4 py-3.5 text-ink-900 transition-all outline-none placeholder:text-ink-500/50 ${
            icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
              : 'border-ink-900/10 hover:border-ink-900/20 focus:border-moss-500 focus:ring-4 focus:ring-moss-100'
          } pr-4`}
          {...rest}
        />
        {trailing && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>

      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          >
            <Icon name="warning" size={13} />
            {error}
          </motion.p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-500/70">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default TextInput
