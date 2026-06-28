import apiClient from '@/scripts/api/client'

export interface Budget {
  id: number
  company_id: number
  fiscal_period_id: number
  fiscal_period_name: string
  account_id: number
  account_name: string
  account_code: string
  amount: number
  spent_amount: number
  remaining: number
  percentage: number
}

class BudgetService {
  async list() {
    const response = await apiClient.get('/api/v1/accounting/budgets')
    return response.data
  }

  async create(data: { fiscal_period_id: number; account_id: number; amount: number }) {
    const response = await apiClient.post('/api/v1/accounting/budgets', data)
    return response.data
  }

  async update(id: number, data: { fiscal_period_id: number; account_id: number; amount: number }) {
    const response = await apiClient.put(`/api/v1/accounting/budgets/${id}`, data)
    return response.data
  }
}

export const budgetService = new BudgetService()
