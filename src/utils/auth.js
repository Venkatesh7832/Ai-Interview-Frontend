import { TOKEN_KEY, USER_KEY } from '../config'

// ==================== TOKEN ====================

// Save token
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

// Get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// Remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}


// ==================== USER ====================

// Save user (optional)
export const saveUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

// Get user
export const getUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Remove user
export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}


// ==================== AUTH ====================

// Check login
export const isAuthenticated = () => {
  return !!getToken()
}


// ==================== LOGOUT ====================

// Local logout only (fast + safe)
export const clearAuth = () => {
  removeToken()
  removeUser()
}