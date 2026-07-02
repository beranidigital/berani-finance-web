import { client as apiClient } from '@/scripts/api/client'

export interface TrialBalanceRow {
  account_code: string
  account_name: string
  account_type: string
  debit: number
  credit: number
}

export interface BalanceSheetSection {
  items: Array<{ code: string; name: string; balance: number }>
  total: number
}

export interface IncomeStatementSection {
  items: Array<{ code: string; name: string; amount: number }>
  total: number
}

class ReportService {
  async trialBalance(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/trial-balance', { params })
    return response.data
  }

  async balanceSheet(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/balance-sheet', { params })
    return response.data
  }

  async incomeStatement(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/income-statement', { params })
    return response.data
  }

  async cashFlow(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/cash-flow', { params })
    return response.data
  }

  async arAging(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/ar-aging', { params })
    return response.data
  }

  async apAging(params?: Record<string, unknown>) {
    const response = await apiClient.get('/api/v1/accounting/reports/ap-aging', { params })
    return response.data
  }
}

export const reportService = new ReportService()
