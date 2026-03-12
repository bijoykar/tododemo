import { create } from 'zustand'

const parseToken = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) return {}
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { userId: payload.sub, username: payload.username, role: payload.role }
  } catch { return {} }
}

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  ...parseToken(),

  setToken: (token, extra = {}) => {
    localStorage.setItem('accessToken', token)
    const payload = (() => {
      try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
    })()
    set({
      accessToken: token,
      isAuthenticated: true,
      userId: payload.sub,
      username: payload.username || extra.username,
      role: payload.role || extra.role,
    })
  },

  clearToken: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, isAuthenticated: false, userId: null, username: null, role: null })
  },
}))

export default useAuthStore
