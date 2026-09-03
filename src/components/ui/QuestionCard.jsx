import { motion } from 'framer-motion'
import Button from './Button'
import Icon from './Icon'
import OptionButton from './OptionButton'

/**
 * QuestionCard — reusable card rendering a single quiz question,
 * its options, and the previous/next navigation footer.
 *
 * Props:
 * - question: { id, prompt, category, options }
 * - index, total: 1-based position of the question
 * - selected:    the chosen option key (or undefined)
 * - onSelect(key): callback when an option is chosen
 * - onNext / onPrev: navigation callbacks
 * - showSubmit:   when true the footer shows "Lihat Hasil" instead of next
 * - onSubmit:     callback for the "Lihat Hasil" button
 * - canGoPrev:    whether the previous button is enabled
 */
function QuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
  onNext,
  onPrev,
  showSubmit,
  onSubmit,
  canGoPrev = true,
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className="rounded-3xl border border-ink-900/8 bg-paper-50 p-6 shadow-card sm:p-8"
    >
      {/* Question meta */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-moss-600">
          Soal {index + 1} / {total}
        </span>
        <span className="rounded-full bg-paper-100 px-3 py-1 text-xs font-semibold text-ink-500">
          {question.category}
        </span>
      </div>

      <h2 className="font-display mt-4 text-2xl font-semibold leading-snug tracking-tight text-ink-950 sm:text-[1.7rem]">
        {question.prompt}
      </h2>

      <div className="mt-7 space-y-3">
        {question.options.map((opt, i) => (
          <OptionButton
            key={opt.key}
            option={opt}
            index={i}
            selected={selected === opt.key}
            onSelect={() => onSelect(opt.key)}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-900/8 pt-5">
        <Button
          variant="ghost"
          size="md"
          onClick={onPrev}
          disabled={!canGoPrev}
          iconLeft={<Icon name="arrowLeft" size={17} />}
          className={!canGoPrev ? 'opacity-40 pointer-events-none' : ''}
        >
          Sebelumnya
        </Button>

        {showSubmit ? (
          <Button variant="light" size="md" onClick={onSubmit}>
            Lihat Hasil
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={onNext} icon={<Icon name="arrowRight" size={17} />}>
            Soal {index + 2}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default QuestionCard
