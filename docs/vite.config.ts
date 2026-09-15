/// <reference types="vitest/config" />

import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'

import { GaUiResolver } from '../packages/ui/src/resolver/index'

const resolveWorkspaceFile = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url))

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
      dts: false,
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
    Components({
      dts: resolveWorkspaceFile('./components.d.ts'),
      resolvers: [
        ElementPlusResolver({ importStyle: false }),
        GaUiResolver({ importStyle: false, elementPlusStyle: false }),
      ],
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
    port: 5557,
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
  },
})
