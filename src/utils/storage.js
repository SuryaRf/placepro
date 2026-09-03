const KEYS = {
  user: 'placepro.user',
  answers: 'placepro.answers',
  currentQuestion: 'placepro.current',
  submitted: 'placepro.submitted',
  result: 'placepro.result',
}

export const storage = {
  keys: KEYS,

  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — fail silently */
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* noop */
    }
  },

  /** Clear all test-related progress but keep the user profile. */
  clearTestProgress() {
    this.remove(KEYS.answers)
    this.remove(KEYS.currentQuestion)
    this.remove(KEYS.submitted)
    this.remove(KEYS.result)
  },
}
