<template>
  <BasePage>
    <BasePageHeader :title="account?.name || 'Account'">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Chart of Accounts" to="modules.accounting.accounts.index" />
        <BaseBreadcrumbItem :title="account?.name || ''" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="secondary" @click="router.push({ name: 'modules.accounting.accounts.edit', params: { id: account?.id } })">
          Edit
        </BaseButton>
      </template>
    </BasePageHeader>

    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <BaseCard>
        <div class="p-4">
          <p class="text-sm text-muted">Account Code</p>
          <p class="mt-1 text-lg font-semibold text-heading font-mono">{{ account?.code }}</p>
        </div>
      </BaseCard>
      <BaseCard>
        <div class="p-4">
          <p class="text-sm text-muted">Type</p>
          <p class="mt-1">
            <BaseBadge :variant="typeVariant(account?.type)">{{ account?.type }}</BaseBadge>
          </p>
        </div>
      </BaseCard>
      <BaseCard>
        <div class="p-4">
          <p class="text-sm text-muted">Net Balance</p>
          <p class="mt-1 text-lg font-semibold" :class="(account?.net_balance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ account ? formatMoney(account.net_balance) : '-' }}
          </p>
        </div>
      </BaseCard>
    </div>

    <BaseCard class="mt-6">
      <div class="p-4">
        <h3 class="text-sm font-semibold text-heading mb-4">Ledger Entries</h3>
        <div v-if="loadingLedger" class="flex justify-center py-4">
          <BaseSpinner />
        </div>
        <DataTable v-else :columns="ledgerColumns" :data="ledgerEntries">
          <template #cell-date="{ row }">{{ row.date }}</template>
          <template #cell-type="{ row }">
            <BaseBadge :variant="row.type === 'debit' ? 'red' : 'green'">{{ row.type }}</BaseBadge>
          </template>
          <template #cell-amount="{ row }">
            <span class="font-mono">{{ formatMoney(row.amount) }}</span>
          </template>
          <template #cell-balance="{ row }">
            <span class="font-mono">{{ formatMoney(row.running_balance) }}</span>
          </template>
        </DataTable>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '../../stores/account.store'
import { useCurrency } from '@/scripts/composables/use-currency'
import apiClient from '@/scripts/api/client'

const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()
const { formatMoney } = useCurrency()

const account = computed(() => accountStore.accounts.find((a) => a.id === Number(route.params.id)))
const ledgerEntries = ref([])
const loadingLedger = ref(true)

const ledgerColumns = [
  { key: 'date', label: 'Date', sortable: false },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'amount', label: 'Amount', sortable: false },
  { key: 'balance', label: 'Running Balance', sortable: false },
]

function typeVariant(type) {
  const variants = { asset: 'blue', liability: 'yellow', equity: 'purple', revenue: 'green', expense: 'red' }
  return variants[type] || 'gray'
}

onMounted(async () => {
  if (accountStore.accounts.length === 0) {
    await accountStore.fetchAccounts()
  }

  try {
    const response = await apiClient.get('/api/v1/accounting/ledger', {
      params: { account_id: route.params.id, limit: 50 },
    })
    ledgerEntries.value = response.data.data
  } finally {
    loadingLedger.value = false
  }
})
</script>
