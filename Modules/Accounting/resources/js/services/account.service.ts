import apiClient from '@/scripts/api/client'
import type { PaginationMeta } from '@/scripts/types/domain/pagination'

export interface Account {
  id: number
  company_id: number
  parent_id: number | null
  parent_name: string | null
  name: string
  code: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  description: string | null
  is_active: boolean
  is_system: boolean
  net_balance: number
  children_count: number
  created_at: string
  updated_at: string
}

export interface AccountFormData {
  name: string
  code: string
  type: string
  parent_id: number | null
  description: string | null
  is_active: boolean
}

class AccountService {
  async list(): Promise<{ data: Account[] }> {
    const response = await apiClient.get('/api/v1/accounting/accounts')
    return response.data
  }

  async get(id: number): Promise<{ data: Account }> {
    const response = await apiClient.get(`/api/v1/accounting/accounts/${id}`)
    return response.data
  }

  async create(data: AccountFormData): Promise<{ data: Account }> {
    const response = await apiClient.post('/api/v1/accounting/accounts', data)
    return response.data
  }

  async update(id: number, data: AccountFormData): Promise<{ data: Account }> {
    const response = await apiClient.put(`/api/v1/accounting/accounts/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/accounting/accounts/${id}`)
  }
}

export const accountService = new AccountService()
