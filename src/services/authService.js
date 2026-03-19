import API  from './api'

const TOKEN_KEY = "interviewai_token"

// ✅ REGISTER
export const register = async ({ name, email, password }) => {
  const res = await API.post("/auth/register", {
    name,
    email,
    password
  })

  // If backend returns token after register
  if (res.data.token) {
    localStorage.setItem(TOKEN_KEY, res.data.token)
  }

  return res.data
}


// ✅ LOGIN
export const login = async ({ email, password }) => {
  const res = await API.post("/auth/login", {
    email,
    password
  })

  const token = res.data.token

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)   // ✅ FIXED
  }

  return res.data
}


// ✅ AXIOS INTERCEPTOR (attach token)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ✅ LOGOUT
export const logout = async () => {
  await API.post("/auth/logout")
  localStorage.removeItem(TOKEN_KEY)
}

// ✅ GET CURRENT USER
export const getCurrentUser = async () => {
  const res = await API.get("/auth/user")
  return res.data
}

