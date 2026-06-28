<template>
  <BasePage>
    <BasePageHeader :title="isEdit ? 'Edit Account' : 'New Account'">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Chart of Accounts" to="modules.accounting.accounts.index" />
        <BaseBreadcrumbItem :title="isEdit ? 'Edit' : 'New'" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BaseInputGroup label="Account Name" :error="errors.name">
              <BaseInput v-model="form.name" required />
            </BaseInputGroup>
            <BaseInputGroup label="Account Code" :error="errors.code">
              <BaseInput v-model="form.code" required />
            </BaseInputGroup>
            <BaseInputGroup label="Account Type" :error="errors.type">
              <BaseSelectInput v-model="form.type" required :options="typeOptions" />
            </BaseInputGroup>
            <BaseInputGroup label="Parent Account" :error="errors.parent_id">
              <BaseSelectInput v-model="form.parent_id" :options="parentOptions" />
            </BaseInputGroup>
            <div class="md:col-span-2">
              <BaseInputGroup label="Description" :error="errors.description">
                <BaseTextarea v-model="form.description" />
              </BaseInputGroup>
            </div>
            <BaseInputGroup label="Active">
              <BaseSwitch v-model="form.is_active" />
            </BaseInputGroup>
          </div>

          <div class="mt-6 flex gap-3">
            <BaseButton type="submit" variant="primary" :loading="submitting">
              {{ isEdit ? 'Update' : 'Create' }}
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
import { useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '../../stores/account.store'
import type { AccountFormData } from '../../services/account.service'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = ref<AccountFormData>({
  name: '',
  code: '',
  type: 'asset',
  parent_id: null,
  description: null,
  is_active: true,
})

const typeOptions = [
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'expense', label: 'Expense' },
]

const parentOptions = computed(() => {
  return accountStore.accounts.map((a) => ({
    value: a.id,
    label: `[${a.code}] ${a.name}`,
  }))
})

async function handleSubmit() {
  submitting.value = true
  errors.value = {}

  try {
    if (isEdit.value) {
      await accountStore.updateAccount(Number(route.params.id), form.value)
    } else {
      await accountStore.createAccount(form.value)
    }
    router.push({ name: 'modules.accounting.accounts.index' })
  } catch (e: any) {
    if (e.response?.status === 422) {
      errors.value = e.response.data.errors || {}
    }
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (accountStore.accounts.length === 0) {
    await accountStore.fetchAccounts()
  }

  if (isEdit.value) {
    const account = accountStore.accounts.find((a) => a.id === Number(route.params.id))
    if (account) {
      form.value = {
        name: account.name,
        code: account.code,
        type: account.type,
        parent_id: account.parent_id,
        description: account.description || null,
        is_active: account.is_active,
      }
    }
  }
})
</script>
