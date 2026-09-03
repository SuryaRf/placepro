import { motion } from 'framer-motion'

/**
 * ScoreCard — reusable banner showing the achieved level, percent ring,
 * score, percentile range, and per-difficulty breakdown.
 *
 * Props:
 * - percent: 0–100 score
 * - score, total: correct out of total
 * - levelLabel, tagline, range: level text
 * - difficulties: { easy, medium, hard } counts
 */
function ScoreCard({ percent, score, total, levelLabel, tagline, range, difficulties }) {
  const rows = [
    { d: 'easy', label: 'Dasar', count: difficulties.easy },
    { d: 'medium', label: 'Menengah', count: difficulties.medium },
    { d: 'hard', label: 'Tingkat Lanjut', count: difficulties.hard },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 16 }}
      className="relative mt-6 overflow-hidden rounded-[2rem] bg-moss-800 px-6 py-10 text-center text-paper-50 sm:px-12"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-moss-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-sun-400/20 blur-3xl" />

      {/* Animated score ring */}
      <div className="relative mx-auto h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#f0b84f"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percent / 100) }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 14 }}
            className="font-display text-4xl font-bold text-sun-300"
          >
            {percent}%
          </motion.span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-paper-200/70">
            Skor
          </span>
        </div>
      </div>

      <p className="relative mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sun-300">
        Hasil Placement Test
      </p>
      <h1 className="font-display relative mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
        {levelLabel}
      </h1>
      <p className="relative mx-auto mt-2 max-w-md text-sm text-paper-200/90 sm:text-base">
        {tagline}
      </p>

      <div className="relative mt-7 flex items-center justify-center gap-5 sm:gap-8">
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-sun-300 sm:text-4xl">
            {score}
            <span className="text-lg text-paper-200/60">/{total}</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-paper-200/70">
            Benar
          </p>
        </div>
        <div className="h-12 w-px bg-paper-50/15" />
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-sun-300 sm:text-4xl">
            {range.replace('Skor ', '')}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-paper-200/70">
            Rentang Skor
          </p>
        </div>
      </div>

      {/* Strengths by difficulty */}
      <div className="relative mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
        {rows.map((row) => (
          <motion.div
            key={row.d}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: row.d === 'easy' ? 0.5 : row.d === 'medium' ? 0.6 : 0.7 }}
            className="rounded-2xl bg-paper-50/8 border border-paper-50/10 px-3 py-3"
          >
            <p className="text-lg font-bold text-paper-50">{row.count}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-paper-200/60">
              {row.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default ScoreCard
