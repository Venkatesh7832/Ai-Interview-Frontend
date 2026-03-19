import api from './api'
import { saveToken, clearAuth } from '../utils/auth'

// REGISTER
export const register = async ({ name, email, password }) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password
  })

  if (res.data.token) {
    saveToken(res.data.token)
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
    saveToken(res.data.token)
  }

  return res.data
}

// LOGOUT
export const logout = async () => {
  try {
    await api.post("/auth/logout")
  } catch (e) {
    console.warn("Logout API failed")
  }

  clearAuth()
}

// GET USER
export const getCurrentUser = async () => {
  const res = await api.get("/auth/user")
  return res.data
}