import { defineStore } from 'pinia'
import { fiscalPeriodService } from '../services/fiscal-period.service'
import type { FiscalPeriod } from '../services/fiscal-period.service'
import { useNotificationStore } from '@/scripts/stores/notification.store'

export const useFiscalPeriodStore = defineStore('accounting-fiscal-period', {
  state: () => ({
    periods: [] as FiscalPeriod[],
    loading: false,
  }),

  actions: {
    async fetchPeriods() {
      this.loading = true
      try {
        const response = await fiscalPeriodService.list()
        this.periods = response.data
      } finally {
        this.loading = false
      }
    },

    async createPeriod(data: { name: string; start_date: string; end_date: string }) {
      const response = await fiscalPeriodService.create(data)
      this.periods.unshift(response.data)
      useNotificationStore().showNotification({ type: 'success', message: 'Fiscal period created' })
      return response.data
    },

    async updatePeriod(id: number, data: { name: string; start_date: string; end_date: string }) {
      const response = await fiscalPeriodService.update(id, data)
      const idx = this.periods.findIndex((p) => p.id === id)
      if (idx !== -1) this.periods[idx] = response.data
      useNotificationStore().showNotification({ type: 'success', message: 'Fiscal period updated' })
      return response.data
    },

    async closePeriod(id: number) {
      const response = await fiscalPeriodService.close(id)
      const idx = this.periods.findIndex((p) => p.id === id)
      if (idx !== -1) this.periods[idx] = response.data
      useNotificationStore().showNotification({ type: 'success', message: 'Fiscal period closed' })
    },

    async reopenPeriod(id: number) {
      const response = await fiscalPeriodService.reopen(id)
      const idx = this.periods.findIndex((p) => p.id === id)
      if (idx !== -1) this.periods[idx] = response.data
      useNotificationStore().showNotification({ type: 'success', message: 'Fiscal period reopened' })
    },
  },
})
