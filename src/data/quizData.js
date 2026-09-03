import rawData from './questions.json'

/**
 * Structured mock data loader.
 * Data source: local JSON (src/data/questions.json).
 *
 * QUESTIONS: array of { id, prompt, options[], answer, difficulty, category }
 * PROGRAMS:  map of level -> program recommendation
 */
export const QUESTIONS = rawData.questions
export const PROGRAMS = rawData.programs

export default rawData
