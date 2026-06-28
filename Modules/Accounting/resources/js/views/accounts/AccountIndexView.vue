<template>
  <BasePage>
    <BasePageHeader title="Chart of Accounts">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Chart of Accounts" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="primary" @click="router.push({ name: 'modules.accounting.accounts.create' })">
          Add Account
        </BaseButton>
      </template>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8">
          <BaseSpinner />
        </div>

        <div v-else-if="accounts.length === 0" class="text-center py-8">
          <BaseIcon name="BanknotesIcon" class="mx-auto h-12 w-12 text-muted" />
          <p class="mt-4 text-sm text-muted">No accounts yet. Create your first account to get started.</p>
        </div>

        <DataTable v-else :columns="columns" :data="accounts">
          <template #cell-code="{ row }">
            <span class="font-mono text-sm text-heading">{{ row.code }}</span>
          </template>
          <template #cell-name="{ row }">
            <router-link
              :to="{ name: 'modules.accounting.accounts.show', params: { id: row.id } }"
              class="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {{ row.name }}
            </router-link>
          </template>
          <template #cell-type="{ row }">
            <span class="px-2 py-1 text-sm font-normal uppercase rounded" :class="typeClass(row.type)">{{ row.type }}</span>
          </template>
          <template #cell-balance="{ row }">
            <span class="text-sm" :class="row.net_balance >= 0 ? 'text-status-green' : 'text-status-red'">
              {{ formatMoney(row.net_balance) }}
            </span>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-2">
              <BaseButton size="sm" variant="secondary" @click="editAccount(row)">Edit</BaseButton>
              <BaseButton v-if="!row.is_system" size="sm" variant="danger" @click="confirmDelete(row)">Delete</BaseButton>
            </div>
          </template>
        </BaseTable>
      </div>
    </BaseCard>

  </BasePage>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '../../stores/account.store'
import { useDialogStore } from '@/scripts/stores/dialog.store'
import { useNotificationStore } from '@/scripts/stores/notification.store'
import { useCurrency } from '@/scripts/composables/use-currency'
import type { Account } from '../../services/account.service'

const router = useRouter()
const accountStore = useAccountStore()
const dialogStore = useDialogStore()
const notificationStore = useNotificationStore()
const { formatMoney } = useCurrency()

const loading = ref(true)
const accounts = computed(() => accountStore.accounts)

const columns = [
  { key: 'code', label: 'Code', sortable: false },
  { key: 'name', label: 'Name', sortable: false },
  { key: 'type', label: 'Type', sortable: false },
  { key: 'balance', label: 'Balance', sortable: false },
  { key: 'actions', label: '', sortable: false },
]

const typeClass = (type: Account['type']): string => {
  const variants: Record<string, string> = { asset: 'bg-blue-100 text-blue-800', liability: 'bg-yellow-100 text-yellow-800', equity: 'bg-purple-100 text-purple-800', revenue: 'bg-green-100 text-green-800', expense: 'bg-red-100 text-red-800' }
  return variants[type] || 'bg-gray-100 text-gray-800'
}

function editAccount(account) {
  router.push({ name: 'modules.accounting.accounts.edit', params: { id: account.id } })
}

async function confirmDelete(account: Account) {
  const confirmed = await dialogStore.openDialog({
    title: 'Delete Account',
    message: `Are you sure you want to delete "${account.name}"?`,
    variant: 'danger',
  })
  if (confirmed) {
    try {
      await accountStore.deleteAccount(account.id)
    } catch (e) {
      notificationStore.showNotification({ type: 'error', message: e.response?.data?.message || 'Delete failed' })
    }
  }
}

onMounted(async () => {
  await accountStore.fetchAccounts()
  loading.value = false
})
</script>
