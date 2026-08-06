import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        fs: {
          fileExists: fs.existsSync,
          readFile: (file) => fs.readFileSync(file, 'utf8'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      'ga-ui-element': fileURLToPath(
        new URL(
          '../packages/ui-element/src/index.ts',
          import.meta.url,
        ),
      ),
    },
  },
  server: {
    port: 5555,
  },
})
