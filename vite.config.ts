import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || (process.env.NODE_ENV === 'production' ? '/frontend-forge/' : '/'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/@monaco-editor') || id.includes('node_modules/monaco-editor')) {
            return 'monaco-vendor';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('src/data/coding')) {
            return 'data-coding';
          }
          if (id.includes('src/data/machine-coding')) {
            return 'data-machine-coding';
          }
          if (id.includes('src/data/system-design')) {
            return 'data-system-design';
          }
          if (id.includes('src/data/javascript') || id.includes('src/data/react') || id.includes('src/data/typescript')) {
            return 'data-core-topics';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
