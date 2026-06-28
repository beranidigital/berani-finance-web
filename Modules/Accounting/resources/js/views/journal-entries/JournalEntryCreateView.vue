<template>
  <BasePage>
    <BasePageHeader title="New Journal Entry">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Journal Entries" to="modules.accounting.journal-entries.index" />
        <BaseBreadcrumbItem title="New" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BaseInputGroup label="Date" required>
              <BaseDatePicker v-model="form.date" required />
            </BaseInputGroup>
            <div></div>
            <div class="md:col-span-2">
              <BaseInputGroup label="Description" required>
                <BaseInput v-model="form.description" required />
              </BaseInputGroup>
            </div>
          </div>

          <h3 class="mt-6 text-sm font-semibold text-heading">Entry Lines</h3>
          <div class="mt-3 overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-line-default">
                  <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Account</th>
                  <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Type</th>
                  <th class="py-2 pr-4 text-right text-xs font-medium text-muted uppercase">Amount</th>
                  <th class="py-2 pr-4 text-left text-xs font-medium text-muted uppercase">Description</th>
                  <th class="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(line, index) in form.lines" :key="index" class="border-b border-line-light">
                  <td class="py-2 pr-4">
                    <BaseSelectInput v-model="line.account_id" :options="accountOptions" placeholder="Select account" required />
                  </td>
                  <td class="py-2 pr-4">
                    <BaseSelectInput v-model="line.type" :options="typeOptions" required />
                  </td>
                  <td class="py-2 pr-4">
                    <BaseInput v-model="inputAmounts[index]" type="number" min="0" step="0.01" class="text-right" @update:model-value="setLineAmount(index, $event)" required />
                  </td>
                  <td class="py-2 pr-4">
                    <BaseInput v-model="line.description" placeholder="Optional" />
                  </td>
                  <td class="py-2">
                    <BaseButton size="sm" variant="danger" @click="removeLine(index)" v-if="form.lines.length > 2">
                      <BaseIcon name="XMarkIcon" class="h-4 w-4" />
                    </BaseButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <BaseButton size="sm" variant="secondary" class="mt-3" @click="addLine">
            + Add Line
          </BaseButton>

          <div class="mt-4 flex gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-muted">Total Debits:</span>
              <span class="font-semibold text-heading font-mono">{{ formatMoney(totalDebits) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted">Total Credits:</span>
              <span class="font-semibold text-heading font-mono">{{ formatMoney(totalCredits) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted">Difference:</span>
              <span class="font-semibold font-mono" :class="difference === 0 ? 'text-status-green' : 'text-status-red'">
                {{ formatMoney(difference) }}
              </span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <BaseButton type="submit" variant="primary" :disabled="difference !== 0 || submitting" :loading="submitting">
              Create Entry
            </BaseButton>
            <BaseButton variant="secondary" @click="router.back()">Cancel</BaseButton>
          </div>
        </form>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJournalEntryStore } from '../../stores/journal-entry.store'
import { useAccountStore } from '../../stores/account.store'
import { useCurrency } from '@/scripts/composables/use-currency'

const router = useRouter()
const store = useJournalEntryStore()
const accountStore = useAccountStore()
const { formatMoney } = useCurrency()

const submitting = ref(false)

const form = ref({
  date: new Date().toISOString().split('T')[0],
  description: '',
  lines: [
    { account_id: null as number | null, type: 'debit', amount: 0, description: '' },
    { account_id: null as number | null, type: 'credit', amount: 0, description: '' },
  ],
})

const inputAmounts = ref(['', ''])

const typeOptions = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Credit' },
]

const accountOptions = computed(() => {
  return accountStore.accounts.map((a) => ({
    value: a.id,
    label: `[${a.code}] ${a.name}`,
  }))
})

const totalDebits = computed(() => form.value.lines.filter((l) => l.type === 'debit').reduce((s, l) => s + l.amount, 0))
const totalCredits = computed(() => form.value.lines.filter((l) => l.type === 'credit').reduce((s, l) => s + l.amount, 0))
const difference = computed(() => totalDebits.value - totalCredits.value)

function setLineAmount(index: number, value: string) {
  form.value.lines[index].amount = Math.round(parseFloat(value || '0') * 100)
}

function addLine() {
  const idx = form.value.lines.length
  form.value.lines.push({ account_id: null, type: 'debit', amount: 0, description: '' })
  inputAmounts.value.push('')
}

function removeLine(index: number) {
  form.value.lines.splice(index, 1)
  inputAmounts.value.splice(index, 1)
}

async function handleSubmit() {
  submitting.value = true
  try {
    await store.createEntry({
      date: form.value.date,
      description: form.value.description,
      lines: form.value.lines.map((l) => ({
        account_id: l.account_id!,
        type: l.type,
        amount: l.amount,
        description: l.description || null,
      })),
    })
    router.push({ name: 'modules.accounting.journal-entries.index' })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (accountStore.accounts.length === 0) {
    await accountStore.fetchAccounts()
  }
})
</script>
