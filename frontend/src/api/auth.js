import api from './axiosInstance'

export const register = (data) => api.post('/auth/register', data).then(r => r.data.data)
export const login = (data) => api.post('/auth/login', data).then(r => r.data.data)
export const refresh = () => api.post('/auth/refresh').then(r => r.data.data)
export const logout = () => api.post('/auth/logout').then(r => r.data)
