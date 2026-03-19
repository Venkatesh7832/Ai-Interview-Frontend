import axios from 'axios'
import { API_BASE_URL } from '../config'
import { getToken, logout } from '../utils/auth'

const api = axios.create({
  baseURL: API_BASE_URL,   // ✅ dynamic (correct)
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
})

// ✅ Attach token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api