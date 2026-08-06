import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const resolveWorkspaceFile = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url))

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
    alias: [
      {
        find: /^ga-ui\/base$/,
        replacement: resolveWorkspaceFile('../packages/ui-element/src/base/index.ts'),
      },
      {
        find: /^ga-ui\/business$/,
        replacement: resolveWorkspaceFile('../packages/ui-element/src/business/index.ts'),
      },
      {
        find: /^ga-ui$/,
        replacement: resolveWorkspaceFile('../packages/ui-element/src/index.ts'),
      },
    ],
  },
  server: {
    port: 5555,
  },
})
