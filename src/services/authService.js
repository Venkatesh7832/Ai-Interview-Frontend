import api from './api'
import { ENDPOINTS } from '../config'
import { saveToken, saveUser } from '../utils/auth'

/**
 * POST /api/auth/login
 * Returns { token, tokenType, userId, name, email, role }
 */
export const login = async (email, password) => {
  const { data } = await api.post(ENDPOINTS.LOGIN, { email, password })
  saveToken(data.token)
  saveUser({ userId: data.userId, name: data.name, email: data.email, role: data.role })
  return data
}

/**
 * POST /api/auth/register
 * Returns same shape as login
 */
export const register = async (name, email, password) => {
  const { data } = await api.post(ENDPOINTS.REGISTER, { name, email, password })
  saveToken(data.token)
  saveUser({ userId: data.userId, name: data.name, email: data.email, role: data.role })
  return data
}

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("interviewai_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})