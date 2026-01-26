import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/gameroom/dist' : '/',
  publicDir: process.env.NODE_ENV === 'production' ? '/gameroom/dist' : 'public',
  plugins: [vue(), vueDevTools()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@emerald': fileURLToPath(new URL('./src/assets/emerald', import.meta.url)),
    },
    preserveSymlinks: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})
