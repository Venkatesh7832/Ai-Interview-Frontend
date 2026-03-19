import api from './api'
import { saveToken } from '../utils/auth'

// REGISTER
export const register = async ({ name, email, password }) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password
  })

  if (res.data.token) {
    saveToken(res.data.token)   // ✅ FIXED
  }

  return res.data
}

// LOGIN
export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", {
    email,
    password
  })

  if (res.data.token) {
    saveToken(res.data.token)   // ✅ FIXED
  }

  return res.data
}

// auth check interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("interviewai_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// LOGOUT
export const logout = async () => {
  await api.post("/auth/logout")
  localStorage.removeItem("interviewai_token")
}

// GET CURRENT USER
export const getCurrentUser = async () => {
  const res = await api.get("/auth/user")
  return res.data
} 