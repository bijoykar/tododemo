import api from './axiosInstance'

export const getAuthStatus = () => api.get('/auth/status').then(r => r.data.data)
export const setupPin = (pin) => api.post('/auth/setup', { pin }).then(r => r.data)
export const login = (pin) => api.post('/auth/login', { pin }).then(r => r.data.data)
export const refresh = () => api.post('/auth/refresh').then(r => r.data.data)
export const logout = () => api.post('/auth/logout').then(r => r.data)
