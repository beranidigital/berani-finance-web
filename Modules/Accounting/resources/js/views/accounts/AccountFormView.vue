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
            <BaseInput v-model="form.name" label="Account Name" required :error="errors.name" />
            <BaseInput v-model="form.code" label="Account Code" required :error="errors.code" />
            <BaseSelectInput v-model="form.type" label="Account Type" required :options="typeOptions" :error="errors.type" />
            <BaseSelectInput v-model="form.parent_id" label="Parent Account" :options="parentOptions" :error="errors.parent_id" />
            <div class="md:col-span-2">
              <BaseTextarea v-model="form.description" label="Description" :error="errors.description" />
            </div>
            <BaseSwitch v-model="form.is_active" label="Active" />
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccountStore } from '../../stores/account.store'

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  code: '',
  type: 'asset',
  parent_id: null,
  description: '',
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
  } catch (e) {
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
        description: account.description || '',
        is_active: account.is_active,
      }
    }
  }
})
</script>
