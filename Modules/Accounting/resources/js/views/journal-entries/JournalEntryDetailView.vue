<template>
  <BasePage>
    <BasePageHeader :title="'Entry ' + entry?.entry_number">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Journal Entries" to="modules.accounting.journal-entries.index" />
        <BaseBreadcrumbItem :title="'Entry ' + entry?.entry_number" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="secondary" @click="confirmReverse" :disabled="!entry">
          Reverse Entry
        </BaseButton>
      </template>
    </BasePageHeader>

    <div v-if="!entry" class="mt-6 flex justify-center py-8">
      <BaseSpinner />
    </div>

    <template v-else>
      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <BaseCard>
          <div class="p-4">
            <p class="text-sm text-muted">Entry Number</p>
            <p class="mt-1 text-lg font-semibold text-heading font-mono">{{ entry.entry_number }}</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="p-4">
            <p class="text-sm text-muted">Date</p>
            <p class="mt-1 text-lg font-semibold text-heading">{{ entry.date }}</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="p-4">
            <p class="text-sm text-muted">Status</p>
            <p class="mt-1">
              <span class="px-2 py-1 text-sm font-normal uppercase rounded" :class="entry.is_balanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ entry.is_balanced ? 'Balanced' : 'Unbalanced' }}
              </span>
            </p>
          </div>
        </BaseCard>
      </div>

      <BaseCard class="mt-6">
        <div class="p-4">
          <p class="text-sm text-muted mb-1">Description</p>
          <p class="text-sm text-heading">{{ entry.description }}</p>
        </div>
      </BaseCard>

      <BaseCard class="mt-6">
        <div class="p-4">
          <h3 class="text-sm font-semibold text-heading mb-4">Lines</h3>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-line-default">
                <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Account</th>
                <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Code</th>
                <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Type</th>
                <th class="py-2 pr-4 text-right text-xs font-medium text-muted uppercase">Amount</th>
                <th class="py-2 text-left text-xs font-medium text-muted uppercase">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in entry.lines" :key="line.id" class="border-b border-line-light">
                <td class="py-2 pr-4 text-heading">{{ line.account_name }}</td>
                <td class="py-2 pr-4 font-mono text-muted">{{ line.account_code }}</td>
                <td class="py-2 pr-4">
                  <span class="px-2 py-1 text-sm font-normal uppercase rounded" :class="line.type === 'debit' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">{{ line.type }}</span>
                </td>
                <td class="py-2 pr-4 text-right font-mono">{{ formatMoney(line.amount) }}</td>
                <td class="py-2 text-muted">{{ line.description || '-' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-line-default font-semibold">
                <td class="py-2 pr-4 text-heading" colspan="2">Totals</td>
                <td class="py-2 pr-4"></td>
                <td class="py-2 pr-4 text-right font-mono text-heading">
                  Debits: {{ formatMoney(entry.debits_total) }}
                  <br />
                  Credits: {{ formatMoney(entry.credits_total) }}
                </td>
                <td class="py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </BaseCard>
    </template>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { journalEntryService } from '../../services/journal-entry.service'
import { useJournalEntryStore } from '../../stores/journal-entry.store'
import { useDialogStore } from '@/scripts/stores/dialog.store'
import { useNotificationStore } from '@/scripts/stores/notification.store'
import { useCurrency } from '@/scripts/composables/use-currency'

const route = useRoute()
const router = useRouter()
const store = useJournalEntryStore()
const dialogStore = useDialogStore()
const notificationStore = useNotificationStore()
const { formatMoney } = useCurrency()

const entry = ref<any>(null)

async function confirmReverse() {
  const confirmed = await dialogStore.openDialog({
    title: 'Reverse Entry',
    message: 'This will create a reversing journal entry. Continue?',
    variant: 'warning',
  })
  if (confirmed) {
    try {
      await store.reverseEntry(Number(route.params.id))
      await loadEntry()
      notificationStore.showNotification({ type: 'success', message: 'Entry reversed' })
    } catch (e: any) {
      notificationStore.showNotification({ type: 'error', message: e.response?.data?.message || 'Reverse failed' })
    }
  }
}

async function loadEntry() {
  const response = await journalEntryService.get(Number(route.params.id))
  entry.value = response.data
}

onMounted(loadEntry)
</script>
