import { TOKEN_KEY, USER_KEY } from '../config'

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const getToken  = ()      => localStorage.getItem(TOKEN_KEY)
export const removeToken = ()    => localStorage.removeItem(TOKEN_KEY)

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const getUser  = ()     => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}
export const removeUser = () => localStorage.removeItem(USER_KEY)

export const isAuthenticated = () => !!getToken()

export const logout = () => {
  removeToken()
  removeUser()
}
