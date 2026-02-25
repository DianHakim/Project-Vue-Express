import { defineStore } from 'pinia'
import api from '../lib/http'
import { useAuthStore } from './auth'

export const useReceiptsStore = defineStore('receipts', {
  state: () => ({
    items: [],
    deleted: [],
    loading: false,
    deletedLoading: false,
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
    async fetchDeleted() {
      this.deletedLoading = true
      this.error = null
      try {
        const { data } = await api.get('/transactions/trash/deleted')
        this.deleted = data.data
      } catch (e) {
        this.error = e.userMessage || 'Gagal memuat data terhapus'
      } finally {
        this.deletedLoading = false
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
      const auth = useAuthStore()
      if (!auth.isAdmin) {
        const err = new Error('Akses ditolak')
        err.userMessage = 'Hanya admin yang dapat menghapus transaksi'
        throw err
      }
      await api.delete(`/transactions/${id}`)
      this.items = this.items.filter(x => x.id !== Number(id))
    },
    async restore(id) {
      const { data } = await api.post(`/transactions/${id}/restore`)
      this.items.push(data.data)
      this.deleted = this.deleted.filter(x => x.id !== Number(id))
      return data.data
    }
  }
})
