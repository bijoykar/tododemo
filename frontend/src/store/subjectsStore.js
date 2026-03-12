import { create } from 'zustand'
import * as subjectsApi from '../api/subjects'
import toast from 'react-hot-toast'

const useSubjectsStore = create((set) => ({
  subjects: [],
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const subjects = await subjectsApi.getSubjects()
      set({ subjects })
    } catch {
      toast.error('Failed to load subjects')
    } finally {
      set({ loading: false })
    }
  },

  create: async (data) => {
    const subject = await subjectsApi.createSubject(data)
    set(s => ({ subjects: [...s.subjects, subject] }))
    return subject
  },

  update: async (id, data) => {
    const subject = await subjectsApi.updateSubject(id, data)
    set(s => ({ subjects: s.subjects.map(x => x.id === id ? subject : x) }))
    return subject
  },

  delete: async (id) => {
    await subjectsApi.deleteSubject(id)
    set(s => ({ subjects: s.subjects.filter(x => x.id !== id) }))
  },
}))

export default useSubjectsStore
