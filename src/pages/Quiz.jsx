import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import ProgressBar from '../components/ui/ProgressBar'
import QuestionCard from '../components/ui/QuestionCard'
import Stepper from '../components/ui/Stepper'
import Logo from '../components/layout/Logo'
import Background from '../components/layout/Background'
import { useQuiz } from '../context/QuizContext'
import { storage } from '../utils/storage'

function Quiz() {
  const navigate = useNavigate()
  const { questions, answers, user, currentIndex, selectAnswer, goTo, goNext, goPrev } = useQuiz()

  const [loading, setLoading] = useState(true)
  const [showSubmit, setShowSubmit] = useState(false)
  const [showNavigator, setShowNavigator] = useState(false)
  const [shake, setShake] = useState(false)
  const questionRef = useRef(null)

  const total = questions.length
  const current = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const percent = Math.round((answeredCount / total) * 100)
  const canSubmit = answeredCount === total

  // Redirect to landing if no profile.
  useEffect(() => {
    if (!user?.name) {
      navigate('/', { replace: true })
      return
    }
    // Simulate a short data-fetch loading state for realism/UX.
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [user, navigate])

  // Auto-advance to the next unanswered question after selecting one.
  const handleSelect = (key) => {
    selectAnswer(current.id, key)
    // Build the updated answer set to find the next unanswered question,
    // independent of the possibly-stale `currentIndex` closure.
    const nextAnswers = { ...answers, [current.id]: key }
    const nextIdx = questions.findIndex((q, i) => i !== currentIndex && !nextAnswers[q.id])
    const target =
      nextIdx !== -1
        ? nextIdx
        : currentIndex < total - 1
          ? currentIndex + 1
          : currentIndex
    setTimeout(() => {
      if (target !== currentIndex) goTo(target)
    }, 260)
  }

  // Scroll the question into view whenever the question changes (mobile friendliness).
  useEffect(() => {
    questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentIndex])

  const handleSubmitClick = () => {
    if (!canSubmit) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      // jump to first unanswered
      const firstUnanswered = questions.findIndex((q) => !answers[q.id])
      if (firstUnanswered !== -1) goTo(firstUnanswered)
      return
    }
    setShowSubmit(true)
  }

  if (loading) {
    return (
      <>
        <Background />
        <div className="noise flex min-h-svh flex-col items-center justify-center px-6">
          <Logo className="mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8 flex h-16 w-16 items-center justify-center">
              {/* slow rotating dashed ring */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-moss-300/60"
              />
              {/* segment progress ring */}
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="27" fill="none" strokeWidth="3" className="stroke-moss-200/50" />
                <motion.circle
                  cx="32" cy="32" r="27" fill="none" strokeWidth="3" strokeLinecap="round"
                  className="stroke-moss-600"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                />
              </svg>
              {/* bouncing icon */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-moss-800 text-paper-50"
              >
                <Icon name="laptop" size={22} strokeWidth={1.9} />
              </motion.div>
            </div>

            <h1 className="text-lg font-semibold text-ink-900">Menyiapkan soal ujian…</h1>
            <motion.p className="mt-1 text-sm text-ink-600">
              Terdapat {total} soal. Selamat mengerjakan!
            </motion.p>

            <div className="mt-6 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-moss-500"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <Background />
      <div className="noise relative mx-auto flex min-h-svh max-w-7xl flex-col px-5 pb-12 sm:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between py-5">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-ink-900/10 bg-paper-50/70 px-3.5 py-1.5 text-xs font-semibold text-ink-600 backdrop-blur sm:flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss-100 text-moss-700">
                <Icon name="user" size={13} />
              </span>
              {user?.name?.split(' ')[0]}
            </span>
            <button
              type="button"
              onClick={() => setShowNavigator((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-paper-50/70 px-3.5 py-2 text-xs font-semibold text-ink-700 backdrop-blur transition-colors hover:bg-paper-100 lg:hidden"
              aria-expanded={showNavigator}
            >
              <Icon name="grid" size={15} />
              <span className="rounded-full bg-ink-950 px-2 py-0.5 text-[11px] font-bold text-paper-50">
                {answeredCount}/{total}
              </span>
            </button>
            <span className="hidden rounded-full bg-ink-950 px-3.5 py-1.5 text-xs font-bold text-paper-50 sm:block">
              {answeredCount}/{total} terjawab
            </span>
          </div>
        </header>

        {/* Step indicator */}
        <div className="mt-2">
          <Stepper current="test" />
        </div>

        {/* Progress */}
        <div className="pt-3">
          <ProgressBar
            value={percent}
            showLabel
            label={`Progres pengerjaan · ${answeredCount} dari ${total} soal`}
          />
        </div>

        {/* Mobile navigator (collapsible) */}
        <AnimatePresence>
          {showNavigator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 rounded-2xl border border-ink-900/8 bg-paper-50 p-4 shadow-card">
                <NavigatorGrid
                  questions={questions}
                  answers={answers}
                  currentIndex={currentIndex}
                  onGo={(i) => {
                    goTo(i)
                    setShowNavigator(false)
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          {/* Question card */}
          <div ref={questionRef} className={`scroll-mt-24 ${shake ? 'animate-shake' : ''}`}>
            <AnimatePresence mode="wait">
              <QuestionCard
                question={current}
                index={currentIndex}
                total={total}
                selected={answers[current.id]}
                onSelect={handleSelect}
                onNext={goNext}
                onPrev={goPrev}
                canGoPrev={currentIndex > 0}
                showSubmit={currentIndex === total - 1}
                onSubmit={handleSubmitClick}
              />
            </AnimatePresence>
          </div>

          {/* Question navigator */}
          <aside className="hidden space-y-4 lg:sticky lg:top-6 lg:block">
            <div className="rounded-3xl border border-ink-900/8 bg-paper-50 p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink-900">
                <Icon name="grid" size={16} className="text-moss-600" />
                Navigasi soal
              </h3>
              <NavigatorGrid
                questions={questions}
                answers={answers}
                currentIndex={currentIndex}
                onGo={goTo}
              />
            </div>

            <div className="rounded-3xl border border-ink-900/8 bg-moss-800 p-5 text-paper-50">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Icon name="flag" size={16} className="text-sun-300" />
                Sudah selesai?
              </div>
              <p className="mt-2 text-xs leading-relaxed text-paper-200/90">
                {canSubmit
                  ? 'Semua soal sudah terjawab. Klik submit untuk melihat hasilmu.'
                  : `Masih ada ${total - answeredCount} soal belum terjawab. Progress tersimpan otomatis.`}
              </p>
              <Button
                variant={canSubmit ? 'whatsapp' : 'light'}
                size="sm"
                fullWidth
                className={`mt-4 ${
                  canSubmit
                    ? '!bg-sun-500 hover:!bg-sun-400 !text-ink-950'
                    : '!bg-paper-50/10 !text-paper-50 hover:!bg-paper-50/20'
                }`}
                onClick={handleSubmitClick}
              >
                <Icon name={canSubmit ? 'checkCircle' : 'warning'} size={16} />
                Submit Jawaban
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <AnimatePresence>
        {showSubmit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
              onClick={() => setShowSubmit(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative w-full max-w-md rounded-3xl border border-ink-900/8 bg-paper-50 p-7 shadow-float"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
                <Icon name="checkCircle" size={24} />
              </span>
              <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-ink-950">
                Konfirmasi Submit
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Kamu telah menjawab <strong className="text-ink-900">{answeredCount} dari {total}</strong>{' '}
                soal. Setelah disubmit, jawaban tidak dapat diubah lagi.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-paper-100 px-4 py-3 text-sm">
                <span className="font-medium text-ink-600">Jawaban siap dikirim</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-moss-700">
                  <Icon name="checkCircle" size={15} />
                  {answeredCount === total ? 'Lengkap' : `${total - answeredCount} belum`}
                </span>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="light" size="lg" fullWidth onClick={() => setShowSubmit(false)}>
                  Kembali
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    storage.set(storage.keys.submitted, true)
                    navigate('/result')
                  }}
                >
                  Ya, Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shake animation keyframe */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-10px)}
          40%{transform:translateX(10px)}
          60%{transform:translateX(-8px)}
          80%{transform:translateX(8px)}
        }
        .animate-shake{animation:shake 0.5s ease-in-out;}
      `}</style>

      {/* Mobile sticky submit bar */}
      <AnimatePresence>
        {!showNavigator && currentIndex === total - 1 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/8 bg-paper-50/95 p-4 backdrop-blur lg:hidden"
          >
            <Button fullWidth size="lg" onClick={handleSubmitClick} className="w-full">
              <Icon name="checkCircle" size={18} />
              {canSubmit ? 'Lihat Hasil Sekarang' : `Submit (${answeredCount}/${total})`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Reusable question navigation grid with legend. */
function NavigatorGrid({ questions, answers, currentIndex, onGo }) {
  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const answered = Boolean(answers[q.id])
          const isCurrent = i === currentIndex
          return (
            <motion.button
              key={q.id}
              type="button"
              onClick={() => onGo(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex h-11 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                isCurrent
                  ? 'bg-ink-950 text-paper-50'
                  : answered
                    ? 'bg-moss-100 text-moss-700 hover:bg-moss-200'
                    : 'bg-paper-100 text-ink-500 hover:bg-ink-900/10 hover:text-ink-800'
              }`}
              aria-label={`Soal ${i + 1}${answered ? ' (terjawab)' : ''}`}
            >
              {i + 1}
            </motion.button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-ink-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-moss-400" /> Terjawab
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-paper-200 border border-ink-900/10" /> Belum
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-ink-500">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-950" /> Sedang
        </span>
      </div>
    </>
  )
}

export default Quiz
