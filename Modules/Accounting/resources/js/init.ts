import DashboardPage from './pages/DashboardPage.vue'
import AccountIndexView from './views/accounts/AccountIndexView.vue'
import AccountFormView from './views/accounts/AccountFormView.vue'
import AccountDetailView from './views/accounts/AccountDetailView.vue'
import JournalEntryIndexView from './views/journal-entries/JournalEntryIndexView.vue'
import JournalEntryCreateView from './views/journal-entries/JournalEntryCreateView.vue'
import JournalEntryDetailView from './views/journal-entries/JournalEntryDetailView.vue'
import ReportLayout from './views/reports/ReportLayout.vue'
import FiscalPeriodIndexView from './views/fiscal-periods/FiscalPeriodIndexView.vue'
import FiscalPeriodFormView from './views/fiscal-periods/FiscalPeriodFormView.vue'
import BudgetIndexView from './views/budgets/BudgetIndexView.vue'
import BudgetFormView from './views/budgets/BudgetFormView.vue'

window.InvoiceShelf.booting((_app, router) => {
  const meta = { requiresAuth: true }

  router.addRoute('admin', {
    path: 'modules/accounting/dashboard',
    name: 'modules.accounting.dashboard',
    component: DashboardPage,
    meta,
  })

  // Chart of Accounts
  router.addRoute('admin', {
    path: 'modules/accounting/accounts',
    name: 'modules.accounting.accounts.index',
    component: AccountIndexView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/accounts/create',
    name: 'modules.accounting.accounts.create',
    component: AccountFormView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/accounts/:id',
    name: 'modules.accounting.accounts.show',
    component: AccountDetailView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/accounts/:id/edit',
    name: 'modules.accounting.accounts.edit',
    component: AccountFormView,
    meta,
  })

  // Journal Entries
  router.addRoute('admin', {
    path: 'modules/accounting/journal-entries',
    name: 'modules.accounting.journal-entries.index',
    component: JournalEntryIndexView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/journal-entries/create',
    name: 'modules.accounting.journal-entries.create',
    component: JournalEntryCreateView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/journal-entries/:id',
    name: 'modules.accounting.journal-entries.show',
    component: JournalEntryDetailView,
    meta,
  })

  // Reports
  router.addRoute('admin', {
    path: 'modules/accounting/reports',
    name: 'modules.accounting.reports',
    component: ReportLayout,
    meta,
  })

  // Fiscal Periods
  router.addRoute('admin', {
    path: 'modules/accounting/fiscal-periods',
    name: 'modules.accounting.fiscal-periods.index',
    component: FiscalPeriodIndexView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/fiscal-periods/create',
    name: 'modules.accounting.fiscal-periods.create',
    component: FiscalPeriodFormView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/fiscal-periods/:id/edit',
    name: 'modules.accounting.fiscal-periods.edit',
    component: FiscalPeriodFormView,
    meta,
  })

  // Budgets
  router.addRoute('admin', {
    path: 'modules/accounting/budgets',
    name: 'modules.accounting.budgets.index',
    component: BudgetIndexView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/budgets/create',
    name: 'modules.accounting.budgets.create',
    component: BudgetFormView,
    meta,
  })
  router.addRoute('admin', {
    path: 'modules/accounting/budgets/:id/edit',
    name: 'modules.accounting.budgets.edit',
    component: BudgetFormView,
    meta,
  })
})
