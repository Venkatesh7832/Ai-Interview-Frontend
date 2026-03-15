import api from './api'
import { ENDPOINTS } from '../config'

// ---------------- Questions ----------------
export const getAllQuestions = () =>
  api.get(ENDPOINTS.QUESTIONS).then(r => r.data)

export const getRandomQuestions = (n = 5) =>
  api.get(ENDPOINTS.QUESTIONS_RANDOM, { params: { count: n } }).then(r => r.data)

export const getQuestionsByCategory = (cat) =>
  api.get(ENDPOINTS.QUESTIONS_CATEGORY(cat)).then(r => r.data)

export const getQuestionById = (id) =>
  api.get(ENDPOINTS.QUESTION_BY_ID(id)).then(r => r.data)


// ---------------- Submit Answer ----------------
export const submitAnswer = (questionId, answer) =>
  api.post(ENDPOINTS.SUBMIT_ANSWER, { questionId, answer }).then(r => r.data)


// ---------------- Results ----------------
export const getMyResults = () =>
  api.get(ENDPOINTS.RESULTS).then(r => r.data)

export const getResultById = (id) =>
  api.get(ENDPOINTS.RESULT_BY_ID(id)).then(r => r.data)

export const getSessionSummary = () =>
  api.get(ENDPOINTS.SUMMARY).then(r => r.data)


// ---------------- AI ----------------
export const getAIFollowUp = (question, answer) =>
  api.post(ENDPOINTS.AI_FOLLOWUP, { question, answer }).then(r => r.data)


// ---------------- Dashboard ----------------
export const getDashboardStats = async () => {

  const res = await api.get("/interview/questions")

  return {
    totalInterviews: res.data.length,
    averageScore: 0,
    bestScore: 0,
    totalTime: "0m"
  }
}

export const getInterviews = async () => {

  const res = await api.get("/interview/questions")

  return {
    interviews: res.data
  }
}

export const deleteInterview = async () => {
  return true
}


// ---------------- Constants ----------------
export const CATEGORIES = [
  'TECHNICAL',
  'BEHAVIORAL',
  'SYSTEM_DESIGN',
  'DATA_STRUCTURES',
  'ALGORITHMS',
  'DATABASE',
  'JAVA',
  'SPRING',
  'MICROSERVICES',
  'GENERAL'
]

export const DIFFICULTIES = [
  'EASY',
  'MEDIUM',
  'HARD'
]