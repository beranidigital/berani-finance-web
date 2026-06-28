<template>
  <BasePage>
    <BasePageHeader title="Budgets">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Budgets" to="#" active />
      </BaseBreadcrumb>
      <template #actions>
        <BaseButton variant="primary" @click="router.push({ name: 'modules.accounting.budgets.create' })">
          Add Budget
        </BaseButton>
      </template>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8"><BaseSpinner /></div>

        <BaseEmptyPlaceholder
          v-else-if="budgets.length === 0"
          title="No budgets yet"
          description="Create a budget to track spending against targets."
        />

        <div v-else class="space-y-6">
          <div v-for="budget in budgets" :key="budget.id" class="rounded-lg border border-line-default p-4">
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="font-medium text-heading">{{ budget.account_code }} — {{ budget.account_name }}</span>
                <span class="ml-2 text-sm text-muted">({{ budget.fiscal_period_name }})</span>
              </div>
              <BaseButton size="sm" variant="secondary" @click="editBudget(budget)">Edit</BaseButton>
            </div>
            <div class="w-full bg-surface-secondary rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-300"
                :class="budget.percentage > 100 ? 'bg-status-red' : budget.percentage > 80 ? 'bg-status-yellow' : 'bg-primary-500'"
                :style="{ width: Math.min(budget.percentage, 100) + '%' }"
              ></div>
            </div>
            <div class="mt-1 flex justify-between text-sm text-muted">
              <span>{{ formatMoney(budget.spent_amount) }} spent</span>
              <span>{{ formatMoney(budget.amount) }} budgeted</span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBudgetStore } from '../../stores/budget.store'
import { useCurrency } from '@/scripts/composables/use-currency'
import type { Budget } from '../../services/budget.service'

const router = useRouter()
const store = useBudgetStore()
const { formatMoney } = useCurrency()

const loading = ref(true)
const budgets = computed(() => store.budgets)

function editBudget(budget: Budget) {
  router.push({ name: 'modules.accounting.budgets.edit', params: { id: budget.id } })
}

onMounted(async () => {
  await store.fetchBudgets()
  loading.value = false
})
</script>
