import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Stepper from '../components/ui/Stepper'
import ScoreCard from '../components/ui/ScoreCard'
import ResultCard from '../components/ui/ResultCard'
import Logo from '../components/layout/Logo'
import Background from '../components/layout/Background'
import { useQuiz } from '../context/QuizContext'
import { QUESTIONS, PROGRAMS } from '../data/quizData'
import { getLevel, buildWhatsAppLink, toPercent } from '../utils/quiz'

const LEVEL_META = {
  beginner: {
    label: 'Beginner',
    tagline: 'Memulai perjalanan — langkah kecil untuk lompatan besar.',
    range: 'Skor 0–40%',
  },
  intermediate: {
    label: 'Intermediate',
    tagline: 'Fondasi kuat — saatnya bicara lebih percaya diri.',
    range: 'Skor 41–75%',
  },
  advanced: {
    label: 'Advanced',
    tagline: 'Lancar dan presisi — siap menembus level profesional.',
    range: 'Skor 76–100%',
  },
}

function Result() {
  const navigate = useNavigate()
  const { user, answers, resetTest, resetAll } = useQuiz()

  const [ready, setReady] = useState(false)

  // Guard: no profile -> landing; profile but unfinished -> back to test.
  useEffect(() => {
    if (!user?.name) {
      navigate('/', { replace: true })
      return
    }
    if (Object.keys(answers).length < QUESTIONS.length) {
      navigate('/test', { replace: true })
      return
    }
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [user, answers, navigate])

  const result = useMemo(() => {
    const score = QUESTIONS.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0)
    const percent = toPercent(score, QUESTIONS.length)
    const level = getLevel(percent)
    const program = PROGRAMS[level]
    const waLink = buildWhatsAppLink({
      phone: user?.phone,
      name: user?.name,
      level,
      score,
      total: QUESTIONS.length,
      programTitle: program.title,
    })
    const difficulties = { easy: 0, medium: 0, hard: 0 }
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.answer) difficulties[q.difficulty] += 1
    })
    return { score, percent, level, program, waLink, difficulties }
  }, [answers, user])

  if (!ready || !user) {
    return (
      <>
        <Background />
        <div className="noise flex min-h-svh items-center justify-center px-6">
          <Logo />
        </div>
      </>
    )
  }

  const meta = LEVEL_META[result.level]

  return (
    <>
      <Background />
      <div className="noise mx-auto min-h-svh max-w-5xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between py-5">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetAll()
              navigate('/')
            }}
          >
            <Icon name="home" size={16} />
            Beranda
          </Button>
        </header>

        {/* Step indicator */}
        <div className="pt-2">
          <Stepper current="result" />
        </div>

        {/* Score / level hero */}
        <ScoreCard
          percent={result.percent}
          score={result.score}
          total={QUESTIONS.length}
          levelLabel={meta.label}
          tagline={meta.tagline}
          range={meta.range}
          difficulties={result.difficulties}
        />

        {/* Recommended program card */}
        <ResultCard
          program={result.program}
          waLink={result.waLink}
          onRetake={() => {
            resetTest()
            navigate('/test')
          }}
        />
      </div>
    </>
  )
}

export default Result
