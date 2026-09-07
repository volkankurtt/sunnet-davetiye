import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { eventConfig } from './src/config/eventConfig.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'event-html-title',
      transformIndexHtml(html) {
        return html.replaceAll('%PAGE_TITLE%', eventConfig.pageTitle)
      },
    },
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 400,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
