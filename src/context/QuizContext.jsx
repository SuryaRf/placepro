import { createContext, useCallback, useEffect, useMemo, useState, useContext } from 'react'
import { QUESTIONS } from '../data/quizData'
import { storage } from '../utils/storage'

const QuizContext = createContext(null)

/**
 * Central state for the whole placement flow.
 * - user: biodata profile
 * - answers: questionId -> chosen key
 * - currentIndex: active question index
 * - Isolates re-renders by keeping frequently-changing state
 *   (answers, currentIndex) in one place.
 */
export function QuizProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(storage.keys.user))
  const [answers, setAnswers] = useState(() => storage.get(storage.keys.answers, {}))
  const [currentIndex, setCurrentIndex] = useState(() =>
    storage.get(storage.keys.currentQuestion, 0)
  )

  // Auto-save answers & current index to localStorage.
  useEffect(() => {
    storage.set(storage.keys.answers, answers)
  }, [answers])

  useEffect(() => {
    storage.set(storage.keys.currentQuestion, currentIndex)
  }, [currentIndex])

  const setUserProfile = useCallback(
    (profile) => {
      const next = { ...(user ?? {}), ...profile }
      setUser(next)
      storage.set(storage.keys.user, next)
    },
    [user]
  )

  const selectAnswer = useCallback((questionId, key) => {
    setAnswers((prev) => ({ ...prev, [questionId]: key }))
  }, [])

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(QUESTIONS.length - 1, index))
    setCurrentIndex(clamped)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))
  }, [])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }, [])

  const resetTest = useCallback(() => {
    setAnswers({})
    setCurrentIndex(0)
    storage.clearTestProgress()
  }, [])

  /** Full reset: clear test progress AND the user profile for a fresh start. */
  const resetAll = useCallback(() => {
    setAnswers({})
    setCurrentIndex(0)
    setUser(null)
    storage.remove(storage.keys.user)
    storage.clearTestProgress()
  }, [])

  const value = useMemo(
    () => ({
      questions: QUESTIONS,
      user,
      answers,
      currentIndex,
      setUserProfile,
      selectAnswer,
      goTo,
      goNext,
      goPrev,
      resetTest,
      resetAll,
    }),
    [user, answers, currentIndex, setUserProfile, selectAnswer, goTo, goNext, goPrev, resetTest, resetAll]
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

// The context provider and its consuming hook are intentionally co-located.
// eslint-disable-next-line react/only-export-components
export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider')
  return ctx
}
