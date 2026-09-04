import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'path'

function prismFixPlugin() {
  return {
    name: 'prismjs-import-fix',
    transform(code: string, id: string) {
      if (id.includes('prismjs') && id.includes('components') && !id.endsWith('index.js')) {
        return {
          code: `import Prism from 'prismjs';\nif (typeof window !== 'undefined') { window.Prism = Prism; }\nif (typeof globalThis !== 'undefined') { globalThis.Prism = Prism; }\n${code}`,
          map: null,
        }
      }
    },
  }
}

export default defineConfig(({ mode, command }) => {
  const isProd =
    mode === 'production' ||
    command === 'build' ||
    process.env.NODE_ENV === 'production'

  return {
    plugins: [react(), prismFixPlugin()],
    base: process.env.VITE_BASE || (isProd ? '/frontend-forge/' : '/'),
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      modulePreload: {
        polyfill: true,
      },
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/@monaco-editor') || id.includes('node_modules/monaco-editor')) {
              return 'monaco-vendor';
            }
            if (id.includes('node_modules/prismjs')) {
              return 'prism-vendor';
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
          if (id.includes('src/data/')) {
            return 'data-web-topics';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})

