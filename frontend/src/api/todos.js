import api from './axiosInstance'

export const getTodos = (params = {}) => api.get('/todos', { params }).then(r => r.data.data)
export const createTodo = (data) => api.post('/todos', data).then(r => r.data.data)
export const getTodo = (id) => api.get(`/todos/${id}`).then(r => r.data.data)
export const updateTodo = (id, data) => api.put(`/todos/${id}`, data).then(r => r.data.data)
export const deleteTodo = (id) => api.delete(`/todos/${id}`).then(r => r.data)
export const updateTodoStatus = (id, status) => api.patch(`/todos/${id}/status`, { status }).then(r => r.data.data)
export const updateTodoPlannedDate = (id, plannedDate) => api.patch(`/todos/${id}/planned-date`, { plannedDate }).then(r => r.data.data)
