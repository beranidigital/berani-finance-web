import { defineStore } from 'pinia'
import { budgetService } from '../services/budget.service'
import type { Budget } from '../services/budget.service'
import { useNotificationStore } from '@/scripts/stores/notification.store'

export const useBudgetStore = defineStore('accounting-budget', {
  state: () => ({
    budgets: [] as Budget[],
    loading: false,
  }),

  actions: {
    async fetchBudgets() {
      this.loading = true
      try {
        const response = await budgetService.list()
        this.budgets = response.data
      } finally { this.loading = false }
    },

    async createBudget(data: { fiscal_period_id: number; account_id: number; amount: number }) {
      const response = await budgetService.create(data)
      this.budgets.unshift(response.data)
      useNotificationStore().showNotification({ type: 'success', message: 'Budget created' })
      return response.data
    },

    async updateBudget(id: number, data: { fiscal_period_id: number; account_id: number; amount: number }) {
      const response = await budgetService.update(id, data)
      const idx = this.budgets.findIndex((b) => b.id === id)
      if (idx !== -1) this.budgets[idx] = response.data
      useNotificationStore().showNotification({ type: 'success', message: 'Budget updated' })
      return response.data
    },
  },
})
