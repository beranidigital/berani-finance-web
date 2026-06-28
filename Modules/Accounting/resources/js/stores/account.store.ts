import { defineStore } from 'pinia'
import { accountService } from '../services/account.service'
import type { Account, AccountFormData } from '../services/account.service'
import { useNotificationStore } from '@/scripts/stores/notification.store'

interface AccountStoreState {
  accounts: Account[]
  loading: boolean
}

export const useAccountStore = defineStore('accounting-account', {
  state: (): AccountStoreState => ({
    accounts: [],
    loading: false,
  }),

  getters: {
    accountsByType: (state) => {
      const grouped: Record<string, Account[]> = {}
      for (const account of state.accounts) {
        if (!grouped[account.type]) {
          grouped[account.type] = []
        }
        grouped[account.type].push(account)
      }
      return grouped
    },
  },

  actions: {
    async fetchAccounts() {
      this.loading = true
      try {
        const response = await accountService.list()
        this.accounts = response.data
      } finally {
        this.loading = false
      }
    },

    async createAccount(data: AccountFormData) {
      const response = await accountService.create(data)
      this.accounts.push(response.data)
      useNotificationStore().showNotification({ type: 'success', message: 'Account created' })
      return response.data
    },

    async updateAccount(id: number, data: AccountFormData) {
      const response = await accountService.update(id, data)
      const index = this.accounts.findIndex((a) => a.id === id)
      if (index !== -1) {
        this.accounts[index] = response.data
      }
      useNotificationStore().showNotification({ type: 'success', message: 'Account updated' })
      return response.data
    },

    async deleteAccount(id: number) {
      await accountService.delete(id)
      this.accounts = this.accounts.filter((a) => a.id !== id)
      useNotificationStore().showNotification({ type: 'success', message: 'Account deleted' })
    },
  },
})
