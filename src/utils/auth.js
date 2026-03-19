import { TOKEN_KEY, USER_KEY } from '../config'

// TOKEN
export const saveToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// USER
export const saveUser = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

// AUTH
export const isAuthenticated = () => !!getToken()

// ✅ IMPORTANT: renamed logout → clearAuth
export const clearAuth = () => {
  removeToken()
  removeUser()
}