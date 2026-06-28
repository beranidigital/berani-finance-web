<template>
  <BasePage>
    <BasePageHeader title="Financial Reports">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Reports" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <BaseTabGroup :tabs="tabs" :active-tab="activeTab" @change="activeTab = $event" />

      <div class="p-6">
        <!-- Trial Balance -->
        <div v-if="activeTab === 'trial-balance'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="tbDate" label="As of Date" />
          </div>
          <div v-if="tbLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <template v-else-if="tbData">
            <BaseTable :columns="tbColumns" :data="tbData.rows">
              <template #cell-debit="{ row }"><span class="font-mono">{{ formatMoney(row.debit) }}</span></template>
              <template #cell-credit="{ row }"><span class="font-mono">{{ formatMoney(row.credit) }}</span></template>
            </BaseTable>
            <div class="mt-4 flex gap-6 text-sm font-semibold">
              <span>Total Debits: <span class="font-mono">{{ formatMoney(tbData.total_debits) }}</span></span>
              <span>Total Credits: <span class="font-mono">{{ formatMoney(tbData.total_credits) }}</span></span>
              <span :class="tbData.difference === 0 ? 'text-status-green' : 'text-status-red'">
                Difference: <span class="font-mono">{{ formatMoney(tbData.difference) }}</span>
              </span>
            </div>
          </template>
        </div>

        <!-- Balance Sheet -->
        <div v-if="activeTab === 'balance-sheet'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="bsDate" label="As of Date" />
          </div>
          <div v-if="bsLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <template v-else-if="bsData">
            <section v-for="section in ['assets', 'liabilities', 'equity']" :key="section" class="mb-6">
              <h3 class="text-sm font-semibold text-heading uppercase mb-2">{{ section }}</h3>
              <table class="w-full text-sm">
                <tr v-for="item in bsData[section]?.items" :key="item.code" class="border-b border-line-light">
                  <td class="py-1 pr-4 font-mono text-muted">{{ item.code }}</td>
                  <td class="py-1 pr-4 text-heading">{{ item.name }}</td>
                  <td class="py-1 text-right font-mono">{{ formatMoney(item.balance) }}</td>
                </tr>
                <tr class="font-semibold border-t-2 border-line-default">
                  <td class="py-2 pr-4" colspan="2">Total {{ section }}</td>
                  <td class="py-2 text-right font-mono">{{ formatMoney(bsData[section]?.total) }}</td>
                </tr>
              </table>
            </section>
          </template>
        </div>

        <!-- Income Statement -->
        <div v-if="activeTab === 'income-statement'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="isStartDate" label="From" />
            <BaseDatePicker v-model="isEndDate" label="To" />
          </div>
          <div v-if="isLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <template v-else-if="isData">
            <section class="mb-6">
              <h3 class="text-sm font-semibold text-heading uppercase mb-2">Revenue</h3>
              <table class="w-full text-sm">
                <tr v-for="item in isData.revenues?.items" :key="item.code" class="border-b border-line-light">
                  <td class="py-1 pr-4 font-mono text-muted">{{ item.code }}</td>
                  <td class="py-1 pr-4 text-heading">{{ item.name }}</td>
                  <td class="py-1 text-right font-mono">{{ formatMoney(item.amount) }}</td>
                </tr>
                <tr class="font-semibold border-t-2 border-line-default">
                  <td class="py-2 pr-4" colspan="2">Total Revenue</td>
                  <td class="py-2 text-right font-mono">{{ formatMoney(isData.revenues?.total) }}</td>
                </tr>
              </table>
            </section>
            <section class="mb-6">
              <h3 class="text-sm font-semibold text-heading uppercase mb-2">Expenses</h3>
              <table class="w-full text-sm">
                <tr v-for="item in isData.expenses?.items" :key="item.code" class="border-b border-line-light">
                  <td class="py-1 pr-4 font-mono text-muted">{{ item.code }}</td>
                  <td class="py-1 pr-4 text-heading">{{ item.name }}</td>
                  <td class="py-1 text-right font-mono">{{ formatMoney(item.amount) }}</td>
                </tr>
                <tr class="font-semibold border-t-2 border-line-default">
                  <td class="py-2 pr-4" colspan="2">Total Expenses</td>
                  <td class="py-2 text-right font-mono">{{ formatMoney(isData.expenses?.total) }}</td>
                </tr>
              </table>
            </section>
            <div class="text-sm font-semibold">
              <span>Net Income: <span class="font-mono" :class="isData.net_income >= 0 ? 'text-status-green' : 'text-status-red'">{{ formatMoney(isData.net_income) }}</span></span>
            </div>
          </template>
        </div>

        <!-- Cash Flow -->
        <div v-if="activeTab === 'cash-flow'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="cfStartDate" label="From" />
            <BaseDatePicker v-model="cfEndDate" label="To" />
          </div>
          <div v-if="cfLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <div v-else-if="cfData" class="text-sm space-y-2">
            <p>Operating: <span class="font-mono font-semibold">{{ formatMoney(cfData.operating?.total) }}</span></p>
            <p>Net Change: <span class="font-mono font-semibold" :class="cfData.net_change >= 0 ? 'text-status-green' : 'text-status-red'">{{ formatMoney(cfData.net_change) }}</span></p>
          </div>
        </div>

        <!-- AR Aging -->
        <div v-if="activeTab === 'ar-aging'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="arDate" label="As of Date" />
          </div>
          <div v-if="arLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <div v-else-if="arData" class="text-sm">
            <p>Total AR: <span class="font-mono font-semibold">{{ formatMoney(arData.total_ar) }}</span></p>
            <p class="mt-2 text-muted">{{ arData.rows.length }} outstanding entries</p>
          </div>
        </div>

        <!-- AP Aging -->
        <div v-if="activeTab === 'ap-aging'">
          <div class="mb-4 flex items-center gap-4">
            <BaseDatePicker v-model="apDate" label="As of Date" />
          </div>
          <div v-if="apLoading" class="flex justify-center py-8"><BaseSpinner /></div>
          <div v-else-if="apData" class="text-sm">
            <p>Total AP: <span class="font-mono font-semibold">{{ formatMoney(apData.total_ap) }}</span></p>
            <p class="mt-2 text-muted">{{ apData.rows.length }} outstanding entries</p>
          </div>
        </div>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCurrency } from '@/scripts/composables/use-currency'
import { reportService } from '../../services/report.service'

const { formatMoney } = useCurrency()
const activeTab = ref('trial-balance')

const tabs = [
  { key: 'trial-balance', label: 'Trial Balance' },
  { key: 'balance-sheet', label: 'Balance Sheet' },
  { key: 'income-statement', label: 'Income Statement' },
  { key: 'cash-flow', label: 'Cash Flow' },
  { key: 'ar-aging', label: 'AR Aging' },
  { key: 'ap-aging', label: 'AP Aging' },
]

const tbDate = ref(new Date().toISOString().split('T')[0])
const tbData = ref<any>(null)
const tbLoading = ref(false)

const bsDate = ref(new Date().toISOString().split('T')[0])
const bsData = ref<any>(null)
const bsLoading = ref(false)

const isStartDate = ref(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
const isEndDate = ref(new Date().toISOString().split('T')[0])
const isData = ref<any>(null)
const isLoading = ref(false)

const cfStartDate = ref(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
const cfEndDate = ref(new Date().toISOString().split('T')[0])
const cfData = ref<any>(null)
const cfLoading = ref(false)

const arDate = ref(new Date().toISOString().split('T')[0])
const arData = ref<any>(null)
const arLoading = ref(false)

const apDate = ref(new Date().toISOString().split('T')[0])
const apData = ref<any>(null)
const apLoading = ref(false)

const tbColumns = [
  { key: 'account_code', label: 'Code' },
  { key: 'account_name', label: 'Account' },
  { key: 'debit', label: 'Debit' },
  { key: 'credit', label: 'Credit' },
]

async function loadTrialBalance() {
  tbLoading.value = true
  try {
    const res = await reportService.trialBalance({ as_of_date: tbDate.value })
    tbData.value = res.data
  } finally { tbLoading.value = false }
}

async function loadBalanceSheet() {
  bsLoading.value = true
  try {
    const res = await reportService.balanceSheet({ as_of_date: bsDate.value })
    bsData.value = res.data
  } finally { bsLoading.value = false }
}

async function loadIncomeStatement() {
  isLoading.value = true
  try {
    const res = await reportService.incomeStatement({ start_date: isStartDate.value, end_date: isEndDate.value })
    isData.value = res.data
  } finally { isLoading.value = false }
}

async function loadCashFlow() {
  cfLoading.value = true
  try {
    const res = await reportService.cashFlow({ start_date: cfStartDate.value, end_date: cfEndDate.value })
    cfData.value = res.data
  } finally { cfLoading.value = false }
}

async function loadArAging() {
  arLoading.value = true
  try {
    const res = await reportService.arAging({ as_of_date: arDate.value })
    arData.value = res.data
  } finally { arLoading.value = false }
}

async function loadApAging() {
  apLoading.value = true
  try {
    const res = await reportService.apAging({ as_of_date: apDate.value })
    apData.value = res.data
  } finally { apLoading.value = false }
}

watch(activeTab, (tab) => {
  if (tab === 'trial-balance') loadTrialBalance()
  else if (tab === 'balance-sheet') loadBalanceSheet()
  else if (tab === 'income-statement') loadIncomeStatement()
  else if (tab === 'cash-flow') loadCashFlow()
  else if (tab === 'ar-aging') loadArAging()
  else if (tab === 'ap-aging') loadApAging()
})

watch(tbDate, loadTrialBalance)
watch(bsDate, loadBalanceSheet)
watch([isStartDate, isEndDate], loadIncomeStatement)
watch([cfStartDate, cfEndDate], loadCashFlow)
watch(arDate, loadArAging)
watch(apDate, loadApAging)

onMounted(loadTrialBalance)
</script>
