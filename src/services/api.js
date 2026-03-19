import axios from 'axios'
import { API_BASE_URL } from '../config'
import { getToken, clearAuth } from '../utils/auth'

const api = axios.create({
  baseURL: API_BASE_URL,
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

// ✅ Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()  // ✅ FIXED
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api