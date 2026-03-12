import { create } from 'zustand'
import * as todosApi from '../api/todos'
import toast from 'react-hot-toast'

const useTodosStore = create((set, get) => ({
  todos: [],
  loading: false,

  fetch: async (params = {}) => {
    set({ loading: true })
    try {
      const todos = await todosApi.getTodos(params)
      set({ todos })
    } catch {
      toast.error('Failed to load todos')
    } finally {
      set({ loading: false })
    }
  },

  create: async (data) => {
    const todo = await todosApi.createTodo(data)
    set(s => ({ todos: [...s.todos, todo] }))
    return todo
  },

  update: async (id, data) => {
    const todo = await todosApi.updateTodo(id, data)
    set(s => ({ todos: s.todos.map(x => x.id === id ? todo : x) }))
    return todo
  },

  updateStatus: async (id, status) => {
    set(s => ({ todos: s.todos.map(x => x.id === id ? { ...x, status } : x) }))
    try {
      const todo = await todosApi.updateTodoStatus(id, status)
      set(s => ({ todos: s.todos.map(x => x.id === id ? todo : x) }))
    } catch {
      get().fetch()
    }
  },

  updatePlannedDate: async (id, plannedDate) => {
    set(s => ({ todos: s.todos.map(x => x.id === id ? { ...x, plannedDate } : x) }))
    try {
      const todo = await todosApi.updateTodoPlannedDate(id, plannedDate)
      set(s => ({ todos: s.todos.map(x => x.id === id ? todo : x) }))
    } catch {
      get().fetch()
    }
  },

  delete: async (id) => {
    set(s => ({ todos: s.todos.filter(x => x.id !== id) }))
    try {
      await todosApi.deleteTodo(id)
    } catch {
      get().fetch()
    }
  },
}))

export default useTodosStore
