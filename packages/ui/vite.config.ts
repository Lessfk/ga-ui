import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { rewriteDeclarationSpecifiers } from './scripts/rewrite-declaration-specifiers.mjs'

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
            afterBuild: rewriteDeclarationSpecifiers,
        }),
    ],

    build: {
        lib: {
            entry: {
                index: resolveFile('./src/index.ts'),
                'base/index': resolveFile('./src/base/index.ts'),
                'business/index': resolveFile('./src/business/index.ts'),
                'resolver/index': resolveFile('./src/resolver/index.ts'),
            },
            formats: ['es'],
            fileName: (_format, entryName) => `${entryName}.js`,
            cssFileName: 'style',
        },

        cssCodeSplit: false,
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
            output: {
                sourcemapExcludeSources: true,
            },
        },
    },
})
