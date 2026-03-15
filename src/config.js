// Central configuration — all API calls go through this base URL.
// Vite's proxy forwards /api/* → http://localhost:8080/api/*
export const API_BASE_URL = 'http://localhost:8080/api'

export const ENDPOINTS = {
  // Auth
  LOGIN:    '/auth/login',
  REGISTER: '/auth/register',

  // Interview
  QUESTIONS:         '/interview/questions',
  QUESTIONS_RANDOM:  '/interview/questions/random',
  QUESTIONS_CATEGORY: (cat) => `/interview/questions/category/${cat}`,
  QUESTION_BY_ID:    (id)  => `/interview/questions/${id}`,
  SUBMIT_ANSWER:     '/interview/submit',
  RESULTS:           '/interview/results',
  RESULT_BY_ID:      (id)  => `/interview/results/${id}`,
  SUMMARY:           '/interview/summary',

  // AI
  AI_HEALTH:  '/ai/health',
  AI_FOLLOWUP: '/ai/followup',
}

export const TOKEN_KEY = 'ai_interview_token'
export const USER_KEY  = 'ai_interview_user'
