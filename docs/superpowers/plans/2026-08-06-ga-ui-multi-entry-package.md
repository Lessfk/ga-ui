# ga-ui Multi-Entry Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish one `ga-ui` npm package with separate `ga-ui/base` and `ga-ui/business` entry points plus one shared `ga-ui/style.css` stylesheet.

**Architecture:** Keep one workspace package and one version, but reorganize implemented components into `src/base` and `src/business`. Vite builds root, base, and business ESM entries in one pass; a build verifier checks runtime exports and artifacts, while package `exports` exposes the three JavaScript/type entry points and shared stylesheet.

**Tech Stack:** Vue 3, TypeScript, Vite 6, Rollup, vite-plugin-dts, Vitest, pnpm workspace, npm package exports.

---

## File map

Files created:

- `packages/ui-element/src/base/index.ts` — public base-component entry.
- `packages/ui-element/src/business/index.ts` — public business-component entry.
- `packages/ui-element/scripts/verify-build.mjs` — verifies generated files, CSS, and relative dist entry exports.
- `packages/ui-element/scripts/verify-exports.mjs` — verifies `ga-ui`, `ga-ui/base`, and `ga-ui/business` self-referencing package exports.
- `packages/ui-element/README.md` — npm package usage documentation.
- `packages/ui-element/LICENSE` — MIT license shipped with the npm package.

Files moved without changing component behavior:

- `packages/ui-element/src/components/table` → `packages/ui-element/src/base/components/table`.
- `packages/ui-element/src/components/pagination` → `packages/ui-element/src/base/components/pagination`.
- `packages/ui-element/src/components/tablePagination` → `packages/ui-element/src/business/components/tablePagination`.

Files modified:

- `packages/ui-element/src/index.ts` — aggregates base/business exports.
- `packages/ui-element/src/__tests__/exports.spec.ts` — verifies public entry boundaries and type contracts.
- `packages/ui-element/src/business/components/tablePagination/src/index.vue` — imports base components through the public base entry.
- `packages/ui-element/src/business/components/tablePagination/src/props.ts` — imports base types through the public base entry.
- `packages/ui-element/vite.config.ts` — builds three ESM entries and one CSS file.
- `packages/ui-element/package.json` — renames package to `ga-ui`, adds subpath exports and verification scripts.
- `playground/package.json` — changes workspace dependency to `ga-ui`.
- `playground/vite.config.ts` — maps public package subpaths to workspace source files.
- `playground/src/App.vue` — imports base and business components from separate entry points.
- `playground/src/main.ts` — imports `ga-ui/style.css`.
- `pnpm-lock.yaml` — records the renamed workspace dependency.
- `README.md` — documents repository-level development and package usage.

Out of scope:

- Leave `packages/ui-element/src/components/dialog` unchanged and unexported.
- Do not add `GaDialog` implementation.
- Do not change existing component props, events, slots, defaults, or visual behavior.
- Do not publish to npm as part of implementation; publishing remains a separate explicitly authorized action.

---

### Task 1: Verify registry name and capture a baseline

**Files:**

- Read: `packages/ui-element/package.json`
- Read: `packages/ui-element/src/components/dialog/index.ts`
- Read: current Git worktree status

- [ ] **Step 1: Confirm the desired npm name can be used**

Run from `D:\ga-ui`:

```powershell
npm.cmd view ga-ui name version --registry=https://registry.npmjs.org/
```

Expected outcomes:

- If npm returns `E404`, the unscoped `ga-ui` name is currently unused; continue.
- If npm returns package metadata, run `npm.cmd owner ls ga-ui --registry=https://registry.npmjs.org/`. Continue only if the current npm account is an owner; otherwise stop and ask the user to select a scoped name.

- [ ] **Step 2: Record the dirty worktree before moving files**

Run:

```powershell
git status --short
```

Expected: existing component and Playground changes may be present. Do not reset, stash, discard, or overwrite them. Later `git add` commands must use explicit paths and must not stage unrelated files under `docs/superpowers`.

- [ ] **Step 3: Run the current package tests**

Run:

```powershell
pnpm.cmd --dir packages/ui-element test
```

Expected: type tests and Vitest pass before the directory migration. If they fail, stop and diagnose the baseline failure before changing packaging structure.

- [ ] **Step 4: Run the current library build**

Run:

```powershell
pnpm.cmd --dir packages/ui-element build
```

Expected: Vite completes and generates the existing single-entry `dist/index.js`, `dist/index.d.ts`, and `dist/style.css` files.

---

### Task 2: Establish source-layer boundaries with failing export tests

**Files:**

- Modify: `packages/ui-element/src/__tests__/exports.spec.ts`
- Create: `packages/ui-element/src/base/index.ts`
- Create: `packages/ui-element/src/business/index.ts`
- Modify: `packages/ui-element/src/index.ts`
- Move: `packages/ui-element/src/components/table`
- Move: `packages/ui-element/src/components/pagination`
- Move: `packages/ui-element/src/components/tablePagination`
- Modify after move: `packages/ui-element/src/business/components/tablePagination/src/index.vue`
- Modify after move: `packages/ui-element/src/business/components/tablePagination/src/props.ts`

- [ ] **Step 1: Replace the export contract test with the final boundary expectations**

Replace `packages/ui-element/src/__tests__/exports.spec.ts` with:

```ts
import { describe, expect, it } from 'vitest'

import { GaPagination as PaginationBarrel } from '../base/components/pagination'
import { GaTable as TableBarrel } from '../base/components/table'
import {
  GaTablePagination as TablePaginationBarrel,
} from '../business/components/tablePagination'
import type {
  GaPaginationProps,
  GaTableColumn,
  GaTableProps,
} from '../base'
import type { GaTablePaginationProps } from '../business'
import type {
  GaPaginationProps as RootGaPaginationProps,
  GaTableColumn as RootGaTableColumn,
  GaTablePaginationProps as RootGaTablePaginationProps,
  GaTableProps as RootGaTableProps,
} from '../index'

type BaseTypeContract = [
  GaTableProps,
  GaTableColumn,
  GaPaginationProps,
]

type RootTypeContract = [
  RootGaTableProps,
  RootGaTableColumn,
  RootGaPaginationProps,
  RootGaTablePaginationProps,
]

const baseTypeContract: BaseTypeContract | undefined = undefined
const rootTypeContract: RootTypeContract | undefined = undefined

void baseTypeContract
void rootTypeContract

const flatTablePaginationProps: GaTablePaginationProps<{ id: number }> = {
  data: [{ id: 1 }],
  columns: [{ prop: 'id' }],
  currentPage: 1,
  pageSize: 10,
  total: 1,
  size: 'default',
}

void flatTablePaginationProps

const legacyTableProps: GaTablePaginationProps = {
  // @ts-expect-error tableProps is not part of the flat public API
  tableProps: {},
}

const legacyPaginationProps: GaTablePaginationProps = {
  // @ts-expect-error paginationProps is not part of the flat public API
  paginationProps: {},
}

const legacyHeight: GaTablePaginationProps = {
  // @ts-expect-error height is intentionally omitted from the composite API
  height: 100,
}

const legacyMaxHeight: GaTablePaginationProps = {
  // @ts-expect-error maxHeight is intentionally omitted from the composite API
  maxHeight: 100,
}

void legacyTableProps
void legacyPaginationProps
void legacyHeight
void legacyMaxHeight

describe('library exports', () => {
  it('exports only base components from the base entry', async () => {
    const base = await import('../base')

    expect(base.GaTable).toBe(TableBarrel)
    expect(base.GaPagination).toBe(PaginationBarrel)
    expect(base).not.toHaveProperty('GaTablePagination')
  })

  it('exports only business components from the business entry', async () => {
    const business = await import('../business')

    expect(business.GaTablePagination).toBe(TablePaginationBarrel)
    expect(business).not.toHaveProperty('GaTable')
    expect(business).not.toHaveProperty('GaPagination')
  })

  it('exports base and business components from the root entry', async () => {
    const library = await import('../index')

    expect(library.GaTable).toBe(TableBarrel)
    expect(library.GaPagination).toBe(PaginationBarrel)
    expect(library.GaTablePagination).toBe(TablePaginationBarrel)
  })
})
```

- [ ] **Step 2: Run the new contract test and verify it fails**

Run:

```powershell
pnpm.cmd --dir packages/ui-element exec vitest run src/__tests__/exports.spec.ts
```

Expected: FAIL because `src/base`, `src/business`, and their component paths do not exist yet.

- [ ] **Step 3: Create and validate the destination directories**

Run:

```powershell
New-Item -ItemType Directory -Force packages/ui-element/src/base/components
New-Item -ItemType Directory -Force packages/ui-element/src/business/components
$gaSourceRoot = (Resolve-Path 'packages/ui-element/src').Path
$gaBaseTarget = (Resolve-Path 'packages/ui-element/src/base/components').Path
$gaBusinessTarget = (Resolve-Path 'packages/ui-element/src/business/components').Path
if (-not $gaBaseTarget.StartsWith($gaSourceRoot) -or -not $gaBusinessTarget.StartsWith($gaSourceRoot)) { throw 'Component move target escaped packages/ui-element/src' }
```

Expected: both resolved targets are descendants of `D:\ga-ui\packages\ui-element\src`.

- [ ] **Step 4: Move the three implemented component directories**

Run:

```powershell
Move-Item -LiteralPath packages/ui-element/src/components/table -Destination packages/ui-element/src/base/components/table
Move-Item -LiteralPath packages/ui-element/src/components/pagination -Destination packages/ui-element/src/base/components/pagination
Move-Item -LiteralPath packages/ui-element/src/components/tablePagination -Destination packages/ui-element/src/business/components/tablePagination
```

Expected: the existing modified and untracked files inside those directories move with them. `packages/ui-element/src/components/dialog` remains untouched.

- [ ] **Step 5: Add the base, business, and root entries**

Create `packages/ui-element/src/base/index.ts`:

```ts
export * from './components/table'
export * from './components/pagination'
```

Create `packages/ui-element/src/business/index.ts`:

```ts
export * from './components/tablePagination'
```

Replace `packages/ui-element/src/index.ts` with:

```ts
export * from './base'
export * from './business'
```

- [ ] **Step 6: Make the business component consume only the public base entry**

In `packages/ui-element/src/business/components/tablePagination/src/index.vue`, replace the imports from `../../pagination` and `../../table` with:

```ts
import {
  GaPagination,
  GaTable,
} from '../../../../base'
import type {
  GaTableCellScope,
  GaTableRow,
} from '../../../../base'
```

Replace `packages/ui-element/src/business/components/tablePagination/src/props.ts` with:

```ts
import type {
  GaPaginationProps,
  GaTableProps,
  GaTableRow,
} from '../../../../base'

export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps
```

- [ ] **Step 7: Run all component and type tests**

Run:

```powershell
pnpm.cmd --dir packages/ui-element test
```

Expected: type tests and all moved Vitest suites pass. The export tests prove base/business boundaries and root aggregation.

- [ ] **Step 8: Commit the source-boundary migration**

Stage only the moved component directories, new entries, old removed paths, and export test:

```powershell
git add -A -- packages/ui-element/src/__tests__/exports.spec.ts packages/ui-element/src/index.ts packages/ui-element/src/base packages/ui-element/src/business packages/ui-element/src/components/table packages/ui-element/src/components/pagination packages/ui-element/src/components/tablePagination
git diff --cached --name-status
git commit -m "refactor: separate base and business component entries"
```

Expected: no Dialog files and no unrelated documentation files are staged.

---

### Task 3: Build three ESM entries and one shared stylesheet

**Files:**

- Create: `packages/ui-element/scripts/verify-build.mjs`
- Modify: `packages/ui-element/vite.config.ts`
- Modify: `packages/ui-element/package.json`

- [ ] **Step 1: Write the build-artifact verifier before changing the build**

Create `packages/ui-element/scripts/verify-build.mjs`:

```js
import assert from 'node:assert/strict'
import { access, readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = fileURLToPath(new URL('..', import.meta.url))
const distRoot = resolve(packageRoot, 'dist')

const expectedFiles = [
  'index.js',
  'index.d.ts',
  'base/index.js',
  'base/index.d.ts',
  'business/index.js',
  'business/index.d.ts',
  'style.css',
]

await Promise.all(
  expectedFiles.map((file) => access(resolve(distRoot, file))),
)

const stylePath = resolve(distRoot, 'style.css')
const styleStat = await stat(stylePath)
const style = await readFile(stylePath, 'utf8')

assert.ok(styleStat.size > 0, 'dist/style.css must not be empty')
assert.match(style, /\.el-table\.ga-table/)
assert.match(style, /\.el-pagination\.ga-pagination/)
assert.match(style, /\.ga-table-pagination/)

const root = await import(pathToFileURL(resolve(distRoot, 'index.js')).href)
const base = await import(pathToFileURL(resolve(distRoot, 'base/index.js')).href)
const business = await import(
  pathToFileURL(resolve(distRoot, 'business/index.js')).href
)

assert.ok('GaTable' in base)
assert.ok('GaPagination' in base)
assert.ok(!('GaTablePagination' in base))

assert.ok('GaTablePagination' in business)
assert.ok(!('GaTable' in business))
assert.ok(!('GaPagination' in business))

assert.ok('GaTable' in root)
assert.ok('GaPagination' in root)
assert.ok('GaTablePagination' in root)

console.info('Verified ga-ui multi-entry build artifacts')
```

- [ ] **Step 2: Run the verifier and confirm the old build fails**

Run:

```powershell
node.exe packages/ui-element/scripts/verify-build.mjs
```

Expected: FAIL with `ENOENT` for `dist/base/index.js` or `dist/business/index.js`.

- [ ] **Step 3: Preserve component-local style sources**

Do not remove or duplicate the existing `<style lang="scss">` blocks in `GaTable`, `GaPagination`, or `GaTablePagination`. The three Vite entries already reach all three SFC modules; `cssCodeSplit: false` will collect their CSS into one `dist/style.css` without adding stylesheet imports to generated declaration files.

- [ ] **Step 4: Replace the Vite library configuration with the multi-entry build**

Replace `packages/ui-element/vite.config.ts` with:

```ts
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
      entry: {
        index: resolveFile('./src/index.ts'),
        'base/index': resolveFile('./src/base/index.ts'),
        'business/index': resolveFile('./src/business/index.ts'),
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
    },
  },
})
```

- [ ] **Step 5: Make the package build run the artifact verifier**

In `packages/ui-element/package.json`, change only these scripts at this stage:

```json
{
  "scripts": {
    "build": "vite build && pnpm run verify:build",
    "verify:build": "node ./scripts/verify-build.mjs",
    "test": "pnpm run test:type && vitest run",
    "test:type": "vue-tsc --noEmit -p tsconfig.type-tests.json",
    "test:watch": "vitest",
    "prepublishOnly": "pnpm run test && pnpm run build"
  }
}
```

- [ ] **Step 6: Build and verify all artifacts**

Run:

```powershell
pnpm.cmd --dir packages/ui-element build
```

Expected: Vite emits all seven required files, then the verifier prints `Verified ga-ui multi-entry build artifacts`.

- [ ] **Step 7: Re-run tests after centralizing styles**

Run:

```powershell
pnpm.cmd --dir packages/ui-element test
```

Expected: all type and component tests pass; no component behavior changed.

- [ ] **Step 8: Commit the build changes**

```powershell
git add -- packages/ui-element/scripts/verify-build.mjs packages/ui-element/vite.config.ts packages/ui-element/package.json packages/ui-element/dist
git diff --cached --name-status
git commit -m "build: add ga-ui multi-entry output"
```

Expected: the commit contains the build configuration, verifier, and regenerated dist only. Existing SFC style blocks remain unchanged.

---

### Task 4: Expose npm subpaths and integrate the Playground

**Files:**

- Create: `packages/ui-element/scripts/verify-exports.mjs`
- Modify: `packages/ui-element/package.json`
- Modify: `playground/package.json`
- Modify: `playground/vite.config.ts`
- Modify: `playground/src/App.vue`
- Modify: `playground/src/main.ts`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Write the package self-reference verifier**

Create `packages/ui-element/scripts/verify-exports.mjs`:

```js
import assert from 'node:assert/strict'

const root = await import('ga-ui')
const base = await import('ga-ui/base')
const business = await import('ga-ui/business')

assert.ok('GaTable' in base)
assert.ok('GaPagination' in base)
assert.ok(!('GaTablePagination' in base))

assert.ok('GaTablePagination' in business)
assert.ok(!('GaTable' in business))
assert.ok(!('GaPagination' in business))

assert.ok('GaTable' in root)
assert.ok('GaPagination' in root)
assert.ok('GaTablePagination' in root)

console.info('Verified ga-ui package exports')
```

- [ ] **Step 2: Run the self-reference verifier and confirm it fails before manifest changes**

Run:

```powershell
node.exe packages/ui-element/scripts/verify-exports.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `ga-ui`, because the package is still named `ga-ui-element` and has no base/business exports.

- [ ] **Step 3: Replace the component package manifest with the final public contract**

Replace `packages/ui-element/package.json` with:

```json
{
  "name": "ga-ui",
  "version": "0.1.0",
  "author": "lemonmon",
  "license": "MIT",
  "description": "基于 Element Plus 二次封装的 Vue 3 组件库",
  "type": "module",
  "files": [
    "dist"
  ],
  "sideEffects": [
    "**/*.css"
  ],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./base": {
      "types": "./dist/base/index.d.ts",
      "import": "./dist/base/index.js",
      "default": "./dist/base/index.js"
    },
    "./business": {
      "types": "./dist/business/index.d.ts",
      "import": "./dist/business/index.js",
      "default": "./dist/business/index.js"
    },
    "./style.css": "./dist/style.css"
  },
  "scripts": {
    "build": "vite build && pnpm run verify:build",
    "verify:build": "node ./scripts/verify-build.mjs",
    "verify:exports": "node ./scripts/verify-exports.mjs",
    "test": "pnpm run test:type && vitest run",
    "test:type": "vue-tsc --noEmit -p tsconfig.type-tests.json",
    "test:watch": "vitest",
    "prepublishOnly": "pnpm run test && pnpm run build && pnpm run verify:exports"
  },
  "peerDependencies": {
    "element-plus": "^2.14.3",
    "vue": "^3.5.40"
  },
  "keywords": [
    "vue",
    "vue3",
    "element-plus",
    "components",
    "ui"
  ],
  "devDependencies": {
    "@vue/test-utils": "^2.4.11",
    "happy-dom": "^18.0.1",
    "vitest": "^3.2.7"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

- [ ] **Step 4: Change the Playground workspace dependency**

In `playground/package.json`, replace:

```json
"ga-ui-element": "workspace:*"
```

with:

```json
"ga-ui": "workspace:*"
```

- [ ] **Step 5: Replace the Playground source aliases with exact public subpath aliases**

Replace `playground/vite.config.ts` with:

```ts
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const resolveWorkspaceFile = (path: string) => {
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
  ],
  resolve: {
    alias: [
      {
        find: /^ga-ui\/base$/,
        replacement: resolveWorkspaceFile(
          '../packages/ui-element/src/base/index.ts',
        ),
      },
      {
        find: /^ga-ui\/business$/,
        replacement: resolveWorkspaceFile(
          '../packages/ui-element/src/business/index.ts',
        ),
      },
      {
        find: /^ga-ui$/,
        replacement: resolveWorkspaceFile(
          '../packages/ui-element/src/index.ts',
        ),
      },
    ],
  },
  server: {
    port: 5555,
  },
})
```

- [ ] **Step 6: Import the two public component entries in the Playground**

In `playground/src/App.vue`, replace the existing `ga-ui-element` import with:

```ts
import {
  GaPagination,
  type GaTableColumn,
} from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
```

Do not change the template, props, sample rows, or event handlers in this task.

Replace `playground/src/main.ts` with:

```ts
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import 'ga-ui/style.css'

import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 7: Refresh workspace links and the lockfile**

Run:

```powershell
pnpm.cmd install
```

Expected: `pnpm-lock.yaml` changes the Playground dependency key from `ga-ui-element` to `ga-ui`, and the workspace link resolves successfully.

- [ ] **Step 8: Verify package exports and Playground consumption**

Run:

```powershell
pnpm.cmd --dir packages/ui-element build
pnpm.cmd --dir packages/ui-element verify:exports
pnpm.cmd --dir playground build
```

Expected:

- Build verifier passes.
- Export verifier prints `Verified ga-ui package exports`.
- Playground type checking and Vite production build pass with imports from both subpaths and the shared stylesheet.

- [ ] **Step 9: Commit the package contract and Playground integration**

```powershell
git add -- packages/ui-element/package.json packages/ui-element/scripts/verify-exports.mjs playground/package.json playground/vite.config.ts playground/src/App.vue playground/src/main.ts pnpm-lock.yaml packages/ui-element/dist
git diff --cached --name-status
git commit -m "feat: expose ga-ui base and business subpaths"
```

Expected: only the manifest, export verifier, Playground integration, lockfile, and rebuilt dist are committed.

---

### Task 5: Add npm-facing documentation and license files

**Files:**

- Create: `packages/ui-element/README.md`
- Create: `packages/ui-element/LICENSE`
- Modify: `README.md`

- [ ] **Step 1: Write the package README**

Create `packages/ui-element/README.md`:

````markdown
# ga-ui

基于 Vue 3 和 Element Plus 二次封装的组件库，提供基础组件和业务组件两个公开入口。

## 安装

```bash
pnpm add ga-ui vue element-plus
```

## 基础组件

```ts
import {
  GaPagination,
  GaTable,
  type GaTableColumn,
} from 'ga-ui/base'
```

## 业务组件

```ts
import { GaTablePagination } from 'ga-ui/business'
```

## 全量入口

```ts
import {
  GaPagination,
  GaTable,
  GaTablePagination,
} from 'ga-ui'
```

## 样式

```ts
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```

当前公开组件：

- 基础组件：`GaTable`、`GaPagination`
- 业务组件：`GaTablePagination`
````

- [ ] **Step 2: Add the MIT license**

Create `packages/ui-element/LICENSE`:

```text
MIT License

Copyright (c) 2026 lemonmon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Replace the repository README with workspace instructions**

Replace `README.md` with:

````markdown
# ga-ui

基于 Vue 3 和 Element Plus 的组件库工作区。

## 包结构

- `ga-ui/base`：`GaTable`、`GaPagination`
- `ga-ui/business`：`GaTablePagination`
- `ga-ui/style.css`：统一组件样式

## 本地开发

```bash
pnpm install
pnpm --dir packages/ui-element test
pnpm --dir packages/ui-element build
pnpm --dir playground dev
```

## 使用

```ts
import { GaTable } from 'ga-ui/base'
import { GaTablePagination } from 'ga-ui/business'
import 'element-plus/dist/index.css'
import 'ga-ui/style.css'
```
````

- [ ] **Step 4: Verify npm includes README and LICENSE**

Run from `packages/ui-element`:

```powershell
$gaPack = npm.cmd pack --dry-run --json --cache "$env:TEMP\ga-ui-npm-cache" | ConvertFrom-Json
$gaPack.files.path
```

Expected output includes:

```text
README.md
LICENSE
package.json
dist/index.js
dist/index.d.ts
dist/base/index.js
dist/base/index.d.ts
dist/business/index.js
dist/business/index.d.ts
dist/style.css
```

Expected output does not include `src`, `scripts`, component tests, or Playground files.

- [ ] **Step 5: Commit package documentation**

```powershell
git add -- README.md packages/ui-element/README.md packages/ui-element/LICENSE
git diff --cached --name-status
git commit -m "docs: document ga-ui package entry points"
```

---

### Task 6: Run the complete release-readiness verification

**Files:**

- Verify: `packages/ui-element/package.json`
- Verify: `packages/ui-element/dist/**`
- Verify: `playground/dist/**`
- Verify: npm dry-run file list

- [ ] **Step 1: Run all library tests**

```powershell
pnpm.cmd --dir packages/ui-element test
```

Expected: type tests and all Vitest tests pass.

- [ ] **Step 2: Rebuild and verify the library**

```powershell
pnpm.cmd --dir packages/ui-element build
pnpm.cmd --dir packages/ui-element verify:exports
```

Expected: Vite build succeeds; both verification scripts print their success messages.

- [ ] **Step 3: Build the Playground as a real consumer**

```powershell
pnpm.cmd --dir playground build
```

Expected: `vue-tsc -b` and Vite production build pass with no unresolved `ga-ui/base`, `ga-ui/business`, or `ga-ui/style.css` imports. The JavaScript subpaths resolve to workspace source aliases, while `ga-ui/style.css` resolves through the built package export.

- [ ] **Step 4: Inspect the exact npm payload one final time**

```powershell
$gaPack = npm.cmd pack --dry-run --json --cache "$env:TEMP\ga-ui-npm-cache" | ConvertFrom-Json
$gaPack | Select-Object name,version,size,unpackedSize
$gaPack.files.path
```

Run this step with working directory `D:\ga-ui\packages\ui-element`.

Expected:

- Package identity is `ga-ui@0.1.0`.
- Every path referenced by `exports` is present.
- README and LICENSE are present.
- No source tests or Playground files are present.

- [ ] **Step 5: Confirm no unrelated changes were staged or lost**

```powershell
git status --short
git log -5 --oneline
```

Expected: implementation commits are visible; unrelated pre-existing files remain unchanged or untracked exactly as intended.

- [ ] **Step 6: Hand off publishing without executing it**

Do not run `npm publish` in this task. Report that release readiness passed and provide the separately authorized publish command:

```powershell
cd D:\ga-ui\packages\ui-element
npm.cmd login --registry=https://registry.npmjs.org/
npm.cmd publish --access public --registry=https://registry.npmjs.org/
```

Expected: the user decides when to perform the external npm publish action.
