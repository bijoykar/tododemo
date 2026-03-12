import { create } from 'zustand'

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setToken: (token) => {
    localStorage.setItem('accessToken', token)
    set({ accessToken: token, isAuthenticated: true })
  },
  clearToken: () => {
    localStorage.removeItem('accessToken')
    set({ accessToken: null, isAuthenticated: false })
  },
}))

export default useAuthStore
