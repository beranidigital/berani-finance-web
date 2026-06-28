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

        <DataTable v-else :columns="columns" :data="periods">
          <template #cell-name="{ row }">
            <span class="text-sm font-medium text-heading">{{ row.name }}</span>
          </template>
          <template #cell-dates="{ row }">
            <span class="text-sm text-muted">{{ row.start_date }} — {{ row.end_date }}</span>
          </template>
          <template #cell-status="{ row }">
            <BaseBadge :variant="row.is_closed ? 'yellow' : 'green'">
              {{ row.is_closed ? 'Closed' : 'Open' }}
            </BaseBadge>
          </template>
          <template #cell-actions="{ row }">
            <div class="flex gap-2">
              <BaseButton size="sm" variant="secondary" @click="editPeriod(row)">Edit</BaseButton>
              <BaseButton v-if="!row.is_closed" size="sm" variant="warning" @click="confirmClose(row)">Close</BaseButton>
              <BaseButton v-if="row.is_closed" size="sm" variant="secondary" @click="confirmReopen(row)">Reopen</BaseButton>
            </div>
          </template>
        </DataTable>
      </div>
    </BaseCard>

    <BaseDialog />
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFiscalPeriodStore } from '../../stores/fiscal-period.store'
import { useDialogStore } from '@/scripts/stores/dialog.store'

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

function editPeriod(period) {
  router.push({ name: 'modules.accounting.fiscal-periods.edit', params: { id: period.id } })
}

async function confirmClose(period) {
  const ok = await dialogStore.openDialog({ title: 'Close Period', message: `Close "${period.name}"? No new entries can be posted.`, variant: 'warning' })
  if (ok) await store.closePeriod(period.id)
}

async function confirmReopen(period) {
  const ok = await dialogStore.openDialog({ title: 'Reopen Period', message: `Reopen "${period.name}"?`, variant: 'warning' })
  if (ok) await store.reopenPeriod(period.id)
}

onMounted(async () => {
  await store.fetchPeriods()
  loading.value = false
})
</script>
