import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const resolveFile = (path: string) => {
    return fileURLToPath(new URL(path, import.meta.url))
}

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
        dts({
            entryRoot: resolveFile('./src'),
            tsconfigPath: resolveFile('./tsconfig.json'),
            insertTypesEntry: true,
            exclude: [
                'src/**/*.spec.ts',
                'src/**/__tests__/**',
            ],
        }),
    ],

    build: {
        lib: {
            entry: resolveFile('./src/index.ts'),
            formats: ['es'],
            fileName: 'index',
            cssFileName: 'style',
        },

        sourcemap: true,
        emptyOutDir: true,

        rollupOptions: {
            external: (id) => {
                return (
                    id === 'vue' ||
                    id.startsWith('vue/') ||
                    id === 'element-plus' ||
                    id.startsWith('element-plus/')
                )
            },
        },
    },
})
