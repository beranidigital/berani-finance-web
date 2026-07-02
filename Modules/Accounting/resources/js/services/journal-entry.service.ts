import { client as apiClient } from '@/scripts/api/client'

export interface JournalEntryLine {
  account_id: number
  type: 'debit' | 'credit'
  amount: number
  description: string | null
}

export interface JournalEntry {
  id: number
  company_id: number
  entry_number: string
  date: string
  description: string
  reference_type: string | null
  reference_id: number | null
  is_balanced: boolean
  posted_at: string | null
  lines: JournalEntryLine[]
  debits_total: number
  credits_total: number
  created_at: string
  updated_at: string
}

export interface JournalEntryFormData {
  date: string
  description: string
  lines: JournalEntryLine[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

class JournalEntryService {
  async list(params?: Record<string, unknown>): Promise<PaginatedResponse<JournalEntry>> {
    const response = await apiClient.get('/api/v1/accounting/journal-entries', { params })
    return response.data
  }

  async get(id: number): Promise<{ data: JournalEntry }> {
    const response = await apiClient.get(`/api/v1/accounting/journal-entries/${id}`)
    return response.data
  }

  async create(data: JournalEntryFormData): Promise<{ data: JournalEntry }> {
    const response = await apiClient.post('/api/v1/accounting/journal-entries', data)
    return response.data
  }

  async reverse(id: number): Promise<{ data: JournalEntry }> {
    const response = await apiClient.post(`/api/v1/accounting/journal-entries/${id}/reverse`)
    return response.data
  }
}

export const journalEntryService = new JournalEntryService()
