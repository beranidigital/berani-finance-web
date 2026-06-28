<template>
  <BasePage>
    <BasePageHeader title="Journal Entries">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Journal Entries" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="primary" @click="router.push({ name: 'modules.accounting.journal-entries.create' })">
          New Entry
        </BaseButton>
      </template>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <BaseTable ref="tableRef" :columns="columns" :data="fetchData">
          <template #cell-entry_number="{ row }">
            <router-link
              :to="{ name: 'modules.accounting.journal-entries.show', params: { id: row.id } }"
              class="font-mono text-sm text-primary-600 hover:text-primary-700"
            >
              {{ row.entry_number }}
            </router-link>
          </template>
          <template #cell-date="{ row }">{{ row.date }}</template>
          <template #cell-description="{ row }">
            <span class="text-sm text-heading">{{ row.description }}</span>
          </template>
          <template #cell-balanced="{ row }">
            <span class="px-2 py-1 text-sm font-normal uppercase rounded" :class="row.is_balanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ row.is_balanced ? 'Balanced' : 'Unbalanced' }}
            </span>
          </template>
          <template #cell-debits="{ row }">
            <span class="font-mono text-sm">{{ formatMoney(row.debits_total) }}</span>
          </template>
          <template #cell-credits="{ row }">
            <span class="font-mono text-sm">{{ formatMoney(row.credits_total) }}</span>
          </template>
        </BaseTable>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJournalEntryStore } from '../../stores/journal-entry.store'
import { useCurrency } from '@/scripts/composables/use-currency'
import type { JournalEntry } from '../../services/journal-entry.service'

const router = useRouter()
const store = useJournalEntryStore()
const { formatMoney } = useCurrency()

const tableRef = ref<{ refresh: () => void } | null>(null)

const columns = [
  { key: 'entry_number', label: 'Entry #', sortable: false },
  { key: 'date', label: 'Date', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'balanced', label: 'Status', sortable: false },
  { key: 'debits', label: 'Total Debits', sortable: false },
  { key: 'credits', label: 'Total Credits', sortable: false },
]

async function fetchData({ page, sort }: { page: number; sort: { fieldName: string; order: string } }) {
  const response = await store.fetchEntries(page)
  return {
    data: store.entries,
    pagination: {
      totalPages: store.lastPage,
      currentPage: store.currentPage,
      totalCount: store.total,
      limit: 25,
    },
  }
}
</script>
