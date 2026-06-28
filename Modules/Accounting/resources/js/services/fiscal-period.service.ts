import apiClient from '@/scripts/api/client'

export interface FiscalPeriod {
  id: number
  company_id: number
  name: string
  start_date: string
  end_date: string
  is_closed: boolean
  closed_at: string | null
}

class FiscalPeriodService {
  async list() {
    const response = await apiClient.get('/api/v1/accounting/fiscal-periods')
    return response.data
  }

  async create(data: { name: string; start_date: string; end_date: string }) {
    const response = await apiClient.post('/api/v1/accounting/fiscal-periods', data)
    return response.data
  }

  async update(id: number, data: { name: string; start_date: string; end_date: string }) {
    const response = await apiClient.put(`/api/v1/accounting/fiscal-periods/${id}`, data)
    return response.data
  }

  async close(id: number) {
    const response = await apiClient.post(`/api/v1/accounting/fiscal-periods/${id}/close`)
    return response.data
  }

  async reopen(id: number) {
    const response = await apiClient.post(`/api/v1/accounting/fiscal-periods/${id}/reopen`)
    return response.data
  }
}

export const fiscalPeriodService = new FiscalPeriodService()
