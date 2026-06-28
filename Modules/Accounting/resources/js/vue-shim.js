function getVue() {
  const vue = window.__invoiceshelf_vue
  if (!vue) {
    throw new Error(
      '[InvoiceShelf Module] Host Vue runtime not available. ' +
      'Ensure the module script loads after the host app.'
    )
  }
  return vue
}

const vueProxy = new Proxy({}, {
  get(_, key) {
    return getVue()[key]
  },
  has(_, key) {
    return key in getVue()
  },
})

export default vueProxy
