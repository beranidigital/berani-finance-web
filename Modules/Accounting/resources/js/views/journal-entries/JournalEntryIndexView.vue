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
        <div v-if="loading" class="flex justify-center py-8">
          <BaseSpinner />
        </div>

        <DataTable v-else :columns="columns" :data="entries">
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
            <BaseBadge :variant="row.is_balanced ? 'green' : 'red'">
              {{ row.is_balanced ? 'Balanced' : 'Unbalanced' }}
            </BaseBadge>
          </template>
          <template #cell-debits="{ row }">
            <span class="font-mono text-sm">{{ formatMoney(row.debits_total) }}</span>
          </template>
          <template #cell-credits="{ row }">
            <span class="font-mono text-sm">{{ formatMoney(row.credits_total) }}</span>
          </template>
        </DataTable>

        <TablePagination
          v-if="lastPage > 1"
          :current-page="currentPage"
          :last-page="lastPage"
          :total="total"
          @page-changed="changePage"
          class="mt-4"
        />
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJournalEntryStore } from '../../stores/journal-entry.store'
import { useCurrency } from '@/scripts/composables/use-currency'

const router = useRouter()
const store = useJournalEntryStore()
const { formatMoney } = useCurrency()

const loading = ref(true)
const entries = computed(() => store.entries)
const currentPage = computed(() => store.currentPage)
const lastPage = computed(() => store.lastPage)
const total = computed(() => store.total)

const columns = [
  { key: 'entry_number', label: 'Entry #', sortable: false },
  { key: 'date', label: 'Date', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'balanced', label: 'Status', sortable: false },
  { key: 'debits', label: 'Total Debits', sortable: false },
  { key: 'credits', label: 'Total Credits', sortable: false },
]

function changePage(page) {
  store.fetchEntries(page)
}

onMounted(async () => {
  await store.fetchEntries()
  loading.value = false
})
</script>
