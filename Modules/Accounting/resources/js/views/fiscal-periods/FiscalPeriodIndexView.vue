<template>
  <BasePage>
    <BasePageHeader title="Fiscal Periods">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Fiscal Periods" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="primary" @click="router.push({ name: 'modules.accounting.fiscal-periods.create' })">
          Add Period
        </BaseButton>
      </template>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8"><BaseSpinner /></div>

        <BaseTable v-else :columns="columns" :data="periods">
          <template #cell-name="{ row }">
            <span class="text-sm font-medium text-heading">{{ row.name }}</span>
          </template>
          <template #cell-dates="{ row }">
            <span class="text-sm text-muted">{{ row.start_date }} — {{ row.end_date }}</span>
          </template>
          <template #cell-status="{ row }">
            <span class="px-2 py-1 text-sm font-normal uppercase rounded" :class="row.is_closed ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
              {{ row.is_closed ? 'Closed' : 'Open' }}
            </span>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-2">
              <BaseButton size="sm" variant="secondary" @click="editPeriod(row)">Edit</BaseButton>
              <BaseButton v-if="!row.is_closed" size="sm" variant="warning" @click="confirmClose(row)">Close</BaseButton>
              <BaseButton v-if="row.is_closed" size="sm" variant="secondary" @click="confirmReopen(row)">Reopen</BaseButton>
            </div>
          </template>
        </BaseTable>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFiscalPeriodStore } from '../../stores/fiscal-period.store'
import { useDialogStore } from '@/scripts/stores/dialog.store'
import type { FiscalPeriod } from '../../services/fiscal-period.service'

const router = useRouter()
const store = useFiscalPeriodStore()
const dialogStore = useDialogStore()

const loading = ref(true)
const periods = computed(() => store.periods)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'dates', label: 'Period' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

function editPeriod(period: FiscalPeriod) {
  router.push({ name: 'modules.accounting.fiscal-periods.edit', params: { id: period.id } })
}

async function confirmClose(period: FiscalPeriod) {
  const ok = await dialogStore.openDialog({ title: 'Close Period', message: `Close "${period.name}"? No new entries can be posted.`, variant: 'warning' })
  if (ok) await store.closePeriod(period.id)
}

async function confirmReopen(period: FiscalPeriod) {
  const ok = await dialogStore.openDialog({ title: 'Reopen Period', message: `Reopen "${period.name}"?`, variant: 'warning' })
  if (ok) await store.reopenPeriod(period.id)
}

onMounted(async () => {
  await store.fetchPeriods()
  loading.value = false
})
</script>
