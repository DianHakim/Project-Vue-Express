import { defineStore } from 'pinia'
import api from '../lib/http'

export const useReceiptsStore = defineStore('receipts', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/transactions')
        this.items = data.data
      } catch (e) {
        this.error = e.userMessage || 'Gagal memuat data'
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const { data } = await api.post('/transactions', payload)
      return data.data
    },
    async fetchOne(id) {
      const { data } = await api.get(`/transactions/${id}`)
      return data.data
    },
    async remove(id) {
      await api.delete(`/transactions/${id}`)
      this.items = this.items.filter(x => x.id !== Number(id))
    }
  }
})
