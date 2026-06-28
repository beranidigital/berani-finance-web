import DashboardPage from './pages/DashboardPage.vue'

window.InvoiceShelf.booting((_app, router) => {
  router.addRoute('admin', {
    path: 'modules/accounting/dashboard',
    name: 'modules.accounting.dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: true,
    },
  })
})
