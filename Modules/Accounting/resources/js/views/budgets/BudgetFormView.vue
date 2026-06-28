<template>
  <BasePage>
    <BasePageHeader :title="isEdit ? 'Edit Budget' : 'New Budget'">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Budgets" to="modules.accounting.budgets.index" />
        <BaseBreadcrumbItem :title="isEdit ? 'Edit' : 'New'" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BaseSelectInput v-model="form.fiscal_period_id" label="Fiscal Period" :options="periodOptions" required />
            <BaseSelectInput v-model="form.account_id" label="Account" :options="accountOptions" required />
            <BaseInput v-model.number="form.amount" label="Budget Amount (in cents)" type="number" min="0" required />
          </div>
          <div class="mt-6 flex gap-3">
            <BaseButton type="submit" variant="primary" :loading="submitting">{{ isEdit ? 'Update' : 'Create' }}</BaseButton>
            <BaseButton variant="secondary" @click="router.back()">Cancel</BaseButton>
          </div>
        </form>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBudgetStore } from '../../stores/budget.store'
import { useAccountStore } from '../../stores/account.store'
import { useFiscalPeriodStore } from '../../stores/fiscal-period.store'

const router = useRouter()
const route = useRoute()
const store = useBudgetStore()
const accountStore = useAccountStore()
const periodStore = useFiscalPeriodStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)

const form = ref({
  fiscal_period_id: null,
  account_id: null,
  amount: 0,
})

const periodOptions = computed(() => periodStore.periods.map((p) => ({ value: p.id, label: p.name })))
const accountOptions = computed(() => accountStore.accounts.map((a) => ({ value: a.id, label: `[${a.code}] ${a.name}` })))

async function handleSubmit() {
  submitting.value = true
  try {
    const payload = { ...form.value, amount: Math.round(Number(form.value.amount)) }
    if (isEdit.value) {
      await store.updateBudget(Number(route.params.id), payload)
    } else {
      await store.createBudget(payload)
    }
    router.push({ name: 'modules.accounting.budgets.index' })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    accountStore.accounts.length === 0 ? accountStore.fetchAccounts() : Promise.resolve(),
    periodStore.periods.length === 0 ? periodStore.fetchPeriods() : Promise.resolve(),
  ])
  if (isEdit.value) {
    const b = store.budgets.find((x) => x.id === Number(route.params.id))
    if (b) {
      form.value = { fiscal_period_id: b.fiscal_period_id, account_id: b.account_id, amount: b.amount }
    }
  }
})
</script>
