import { defineStore } from 'pinia'
import api from '../lib/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('struk_token') || null,
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(username, password) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', { username, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('struk_token', this.token)
        localStorage.setItem('struk_user', JSON.stringify(this.user))
        return response.data
      } catch (err) {
        this.error = err.userMessage || 'Login gagal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchMe() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.user
        localStorage.setItem('struk_user', JSON.stringify(this.user))
        return response.data.user
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.error('Logout error:', err)
      }
      this.token = null
      this.user = null
      localStorage.removeItem('struk_token')
      localStorage.removeItem('struk_user')
    },

    restoreSession() {
      const token = localStorage.getItem('struk_token')
      const user = localStorage.getItem('struk_user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        return true
      }
      return false
    }
  }
})
