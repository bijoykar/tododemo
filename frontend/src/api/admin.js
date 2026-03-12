import api from './axiosInstance'

export const getAllUsers = () => api.get('/admin/users').then(r => r.data.data)
export const getPendingUsers = () => api.get('/admin/users/pending').then(r => r.data.data)
export const approveUser = (id) => api.patch(`/admin/users/${id}/approve`).then(r => r.data.data)
export const rejectUser = (id) => api.patch(`/admin/users/${id}/reject`).then(r => r.data.data)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(r => r.data)
