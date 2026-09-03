import { motion } from 'framer-motion'
import Icon from './Icon'

const STEPS = [
  { key: 'register', label: 'Biodata', icon: 'user' },
  { key: 'test', label: 'Tes', icon: 'keyboard' },
  { key: 'result', label: 'Hasil', icon: 'trophy' },
]

/**
 * Horizontal step indicator grounding the user in the multi-step flow.
 * Each item is an icon + label; current step is highlighted.
 */
function Stepper({ current }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current)

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const state = i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'upcoming'
        return (
          <li key={step.key} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <motion.span
                animate={{
                  scale: state === 'current' ? 1 : 0.96,
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors sm:h-11 sm:w-11 ${
                  state === 'current'
                    ? 'border-moss-500 bg-moss-600 text-white shadow-soft'
                    : state === 'done'
                      ? 'border-moss-300 bg-moss-100 text-moss-700'
                      : 'border-ink-900/10 bg-paper-50 text-ink-400'
                }`}
              >
                {state === 'done' ? (
                  <Icon name="check" size={17} strokeWidth={2.6} />
                ) : (
                  <Icon name={step.icon} size={17} />
                )}
              </motion.span>
              <span
                className={`mt-1.5 hidden text-[11px] font-semibold sm:block ${
                  state === 'current' ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mb-0 flex items-start">
                <span className="h-px w-6 bg-ink-900/15 sm:w-10" />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default Stepper
