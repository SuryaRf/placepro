import { motion } from 'framer-motion'
import Button from './Button'
import Icon from './Icon'

const colorMap = {
  sun: 'bg-sun-500',
  moss: 'bg-moss-600',
  ink: 'bg-ink-800',
}

const softMap = {
  sun: 'bg-sun-100 text-sun-500',
  moss: 'bg-moss-100 text-moss-700',
  ink: 'bg-ink-900/6 text-ink-700',
}

/**
 * ResultCard — reusable card showing the recommended program for a
 * achieved level, with goals, modules, and the WhatsApp CTA.
 *
 * Props:
 * - program:   the { title, description, duration, goals, modules, icon, accent } object
 * - waLink:    generated WhatsApp URL
 * - onRetake:  callback for the "Ulangi Tes" button
 */
function ResultCard({ program, waLink, onRetake }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 80, damping: 16 }}
      className="mt-8 rounded-[2rem] border border-ink-900/8 bg-paper-50 p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${colorMap[program.accent]}`}>
          <Icon name={program.icon} size={22} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
            Program yang direkomendasikan
          </p>
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink-950">
            {program.title}
          </h2>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-600">
        <Icon name="clock" size={15} className="text-moss-600" />
        {program.duration}
      </p>

      <p className="mt-3 leading-relaxed text-ink-700">{program.description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {program.goals.map((g, i) => (
          <motion.div
            key={g}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-2xl border border-ink-900/8 bg-paper-100/60 p-4"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${softMap[program.accent]}`}>
              <Icon name="check" size={13} strokeWidth={2.6} />
            </span>
            <p className="mt-2.5 text-sm font-semibold leading-snug text-ink-800">{g}</p>
          </motion.div>
        ))}
      </div>

      {/* Modules */}
      <div className="mt-6 rounded-2xl border border-ink-900/8 p-4 sm:p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">
          Modul pembelajaran
        </p>
        <ul className="space-y-2">
          {program.modules.map((m, i) => (
            <li key={m} className="flex items-center gap-3 text-sm font-medium text-ink-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-moss-100 text-xs font-bold text-moss-700">
                {i + 1}
              </span>
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1fb958] shadow-soft"
        >
          <Icon name="whatsapp" size={20} />
          Konsultasi via WhatsApp
        </a>
        <Button variant="light" size="lg" fullWidth onClick={onRetake}>
          <Icon name="refresh" size={17} />
          Ulangi Tes
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-ink-500/70">
        Pesan WhatsApp ter-generate otomatis berisi hasil dan level kamu.
      </p>
    </motion.section>
  )
}

export default ResultCard
