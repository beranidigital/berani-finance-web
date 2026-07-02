import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

function vueGlobalPlugin() {
  return {
    name: 'invoiceshelf-vue-global',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'vue') {
        return { id: 'vue', external: true }
      }
    },
    renderChunk(code) {
      return code.replace(
        /import\s*(\{[^}]+\})\s*from\s*"vue"\s*;?/g,
        'const $1 = window.__invoiceshelf_vue;'
      )
    },
  }
}

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'resources/dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'resources/js/init.ts'),
      formats: ['es'],
      fileName: () => 'init.js',
    },
  },
  plugins: [
    vueGlobalPlugin(),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../../resources'),
    },
  },
})
