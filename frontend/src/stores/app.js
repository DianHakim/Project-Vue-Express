import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    clinic: {
      name: 'Klinik Ratnasari Sehat RSA',
      address: 'Alamat Klinik (ubah di Settings)',
      phone: '+62 811-2111-1570'
    }
  }),
  actions: {
    load() {
      const raw = localStorage.getItem('struk_app_settings')
      if (raw) this.clinic = JSON.parse(raw)
    },
    save() {
      localStorage.setItem('struk_app_settings', JSON.stringify(this.clinic))
    }
  }
})
