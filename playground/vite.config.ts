import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { GaUiResolver } from '../packages/ui/src/resolver/index'

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
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), GaUiResolver()],
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^ga-ui-plus\/base$/,
        replacement: resolveWorkspaceFile('../packages/ui/src/base/index.ts'),
      },
      {
        find: /^ga-ui-plus\/business$/,
        replacement: resolveWorkspaceFile('../packages/ui/src/business/index.ts'),
      },
      {
        find: /^ga-ui-plus$/,
        replacement: resolveWorkspaceFile('../packages/ui/src/index.ts'),
      },
    ],
  },
  server: {
    port: 5555,
  },
})
