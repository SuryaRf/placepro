import { motion } from 'framer-motion'
import Icon from './Icon'

/**
 * Reusable answer option button. Handles selected state with a clean,
 * accessible design.
 */
function OptionButton({ option, selected, onSelect, index }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={!selected ? { y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`group relative flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-moss-400 focus-visible:ring-offset-2 sm:px-5 ${
        selected
          ? 'border-moss-500 bg-moss-50 text-ink-950'
          : 'border-ink-900/10 bg-paper-50 hover:border-moss-300 hover:bg-moss-50/40'
      }`}
      aria-pressed={selected}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-200 ${
          selected ? 'bg-moss-600 text-white' : 'bg-ink-900/6 text-ink-700 group-hover:bg-moss-100'
        }`}
      >
        {selected ? <Icon name="check" size={16} strokeWidth={2.4} /> : String.fromCharCode(65 + index)}
      </span>
      <span className={`flex-1 font-medium leading-snug ${selected ? '' : 'text-ink-800'}`}>
        {option.text}
      </span>
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss-600 text-white"
        >
          <Icon name="check" size={12} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  )
}

export default OptionButton
