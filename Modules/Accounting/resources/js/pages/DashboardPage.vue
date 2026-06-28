<template>
  <BasePage>
    <BasePageHeader title="Accounting">
      <BaseBreadcrumb>
        <BaseBreadcrumbItem title="Home" to="dashboard" />
        <BaseBreadcrumbItem title="Accounting" to="#" active />
      </BaseBreadcrumb>
    </BasePageHeader>

    <BaseCard class="mt-6">
      <div class="p-6">
        <div class="flex items-center gap-3">
          <BaseIcon name="CalculatorIcon" class="h-8 w-8 text-primary-500" />
          <h2 class="text-xl font-semibold text-heading">Accounting Module</h2>
        </div>
        <p class="mt-3 text-sm text-muted leading-relaxed">
          Double-entry accounting module for InvoiceShelf.
          Manage your chart of accounts, journal entries, fiscal periods,
          and financial reports.
        </p>
      </div>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
</script>
