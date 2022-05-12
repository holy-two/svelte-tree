import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from "path"
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    compilerOptions: {
      customElement: true,
    },
  }), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'MowTree',
      fileName: (fmt) => `mow-tree.${fmt}.js`
    }
  },
})
