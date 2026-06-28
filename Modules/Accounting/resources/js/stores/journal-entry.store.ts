import { defineStore } from 'pinia'
import { journalEntryService } from '../services/journal-entry.service'
import type { JournalEntry, JournalEntryFormData } from '../services/journal-entry.service'
import { useNotificationStore } from '@/scripts/stores/notification.store'

interface JournalEntryStoreState {
  entries: JournalEntry[]
  total: number
  currentPage: number
  lastPage: number
  loading: boolean
}

export const useJournalEntryStore = defineStore('accounting-journal-entry', {
  state: (): JournalEntryStoreState => ({
    entries: [],
    total: 0,
    currentPage: 1,
    lastPage: 1,
    loading: false,
  }),

  actions: {
    async fetchEntries(page = 1) {
      this.loading = true
      try {
        const response = await journalEntryService.list({ page, limit: 25 })
        this.entries = response.data
        this.total = response.meta.total
        this.currentPage = response.meta.current_page
        this.lastPage = response.meta.last_page
      } finally {
        this.loading = false
      }
    },

    async createEntry(data: JournalEntryFormData) {
      const response = await journalEntryService.create(data)
      this.entries.unshift(response.data)
      useNotificationStore().showNotification({ type: 'success', message: 'Journal entry created' })
      return response.data
    },

    async reverseEntry(id: number) {
      const response = await journalEntryService.reverse(id)
      this.entries.unshift(response.data)
      useNotificationStore().showNotification({ type: 'success', message: 'Journal entry reversed' })
      return response.data
    },
  },
})
