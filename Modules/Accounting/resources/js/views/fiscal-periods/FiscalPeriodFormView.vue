<template>
  <BasePage>
    <BasePageHeader :title="isEdit ? 'Edit Fiscal Period' : 'New Fiscal Period'">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="modules.accounting.dashboard" />
        <BaseBreadcrumbItem title="Fiscal Periods" to="modules.accounting.fiscal-periods.index" />
        <BaseBreadcrumbItem :title="isEdit ? 'Edit' : 'New'" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <form @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BaseInputGroup label="Period Name" required>
              <BaseInput v-model="form.name" required />
            </BaseInputGroup>
            <div></div>
            <BaseInputGroup label="Start Date" required>
              <BaseDatePicker v-model="form.start_date" required />
            </BaseInputGroup>
            <BaseInputGroup label="End Date" required>
              <BaseDatePicker v-model="form.end_date" required />
            </BaseInputGroup>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFiscalPeriodStore } from '../../stores/fiscal-period.store'

const router = useRouter()
const route = useRoute()
const store = useFiscalPeriodStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)

const form = ref({
  name: '',
  start_date: '',
  end_date: '',
})

async function handleSubmit() {
  submitting.value = true
  try {
    if (isEdit.value) {
      await store.updatePeriod(Number(route.params.id), form.value)
    } else {
      await store.createPeriod(form.value)
    }
    router.push({ name: 'modules.accounting.fiscal-periods.index' })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (store.periods.length === 0) await store.fetchPeriods()
  if (isEdit.value) {
    const p = store.periods.find((x) => x.id === Number(route.params.id))
    if (p) { form.value = { name: p.name, start_date: p.start_date, end_date: p.end_date } }
  }
})
</script>
