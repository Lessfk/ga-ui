# Standalone Component Docs App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the VitePress documentation site with a standalone Vue 3 application that documents all seven public `ga-ui-plus` components through real previews, resettable demos, copyable source code, searchable navigation, and structured API reference data.

**Architecture:** Keep `docs` as a pnpm workspace package, but replace VitePress with Vite, Vue Router, and a registry-driven documentation shell. A TypeScript compiler API script generates the basic Props, Events, Slots, and Expose records; handwritten component definitions add Chinese descriptions, demos, defaults, and usage notes. Each demo is imported both as a Vue component and through `?raw`, so the live preview and displayed source remain identical.

**Tech Stack:** Vue 3, Vite 6, Vue Router 4, Element Plus, ga-ui-plus workspace source, TypeScript 5.8, Vitest, Vue Test Utils, happy-dom, Shiki, Playwright.

---

## Target File Map

### Project Runtime

- Create `docs/index.html`: standalone Vite HTML entry.
- Create `docs/src/main.ts`: application bootstrap, Element Plus CSS, locale providers, and router installation.
- Create `docs/src/App.vue`: root `DocsShell` host.
- Create `docs/src/router/index.ts`: routes generated from the component catalog.
- Create `docs/src/styles/index.css`: document-only design tokens, layout, and responsive rules.
- Modify `docs/package.json`: replace VitePress scripts and dependencies.
- Modify `docs/tsconfig.json`: include the standalone application, tests, generated API, and scripts.
- Create `docs/vite.config.ts`: Vue, resolvers, aliases, Vitest, and dev-server configuration.

### Content And API

- Create `docs/src/content/types.ts`: catalog, demo, API, guide, and component-document contracts.
- Create `docs/src/content/catalog.ts`: seven component summaries and category order.
- Create `docs/src/content/navigation.ts`: navigation groups and search entries derived from the catalog.
- Create `docs/src/content/api.ts`: generated/manual API merge and validation.
- Create `docs/src/content/components/*.ts`: one full document definition per public component.
- Create `docs/src/content/guides.ts`: home and usage-guide content.
- Create `docs/scripts/api-manifest.mjs`: public source files and exported type names.
- Create `docs/scripts/api-extractor.mjs`: TypeScript compiler API extraction helpers.
- Create `docs/scripts/generate-api.mjs`: deterministic `component-api.ts` generator.
- Create `docs/src/generated/component-api.ts`: committed generated API output.

### Documentation UI

- Create `docs/src/layout/DocsShell.vue`: top bar, left navigation, content, and outline grid.
- Create `docs/src/layout/DocsHeader.vue`: brand, primary navigation, search, theme toggle.
- Create `docs/src/layout/DocsSidebar.vue`: grouped component navigation.
- Create `docs/src/layout/PageOutline.vue`: page-section navigation.
- Create `docs/src/components/DemoBlock.vue`: preview, source expansion, copy, and remount reset.
- Create `docs/src/components/SourceCode.vue`: asynchronous Shiki highlighting with plain-text fallback.
- Create `docs/src/components/ApiTable.vue`: Props, Events, Slots, and Expose table renderer.
- Create `docs/src/components/CopyButton.vue`: reusable clipboard feedback.
- Create `docs/src/views/HomeView.vue`: installation, quick start, and component index.
- Create `docs/src/views/GuideView.vue`: registered guide content.
- Create `docs/src/views/ComponentView.vue`: generic registry-driven component page.
- Create `docs/src/views/NotFoundView.vue`: internal 404 page.

### Demos And Tests

- Move `docs/site/demos/**` to `docs/src/demos/**` without duplicating source.
- Replace `docs/tests/docs-content.spec.mjs` with standalone-project structure tests.
- Create `docs/src/**/*.spec.ts` beside registry, API, layout, and UI modules.
- Create `docs/tests/e2e/docs_app.py`: Playwright smoke and style-isolation checks.
- Delete `docs/.vitepress/**` and `docs/site/**` only after the standalone app passes tests and build.

---

### Task 1: Replace The VitePress Package Scaffold

**Files:**
- Modify: `docs/tests/docs-content.spec.mjs`
- Modify: `docs/package.json`
- Modify: `docs/tsconfig.json`
- Create: `docs/index.html`
- Create: `docs/vite.config.ts`
- Create: `docs/src/main.ts`
- Create: `docs/src/App.vue`
- Create: `docs/src/styles/index.css`
- Modify: `package.json`

- [ ] **Step 1: Write the failing standalone-project structure test**

Replace `docs/tests/docs-content.spec.mjs` with checks that define the new runtime boundary:

```js
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const docsFile = (path) => new URL(`../${path}`, import.meta.url)

test('docs is a standalone Vue and Vite application', async () => {
  const packageJson = JSON.parse(
    await readFile(docsFile('package.json'), 'utf8'),
  )

  assert.equal(packageJson.scripts.dev.includes('vite'), true)
  assert.equal(packageJson.scripts.build.includes('vite build'), true)
  assert.equal(packageJson.dependencies['vue-router'].startsWith('^4.'), true)
  assert.equal('vitepress' in packageJson.devDependencies, false)

  await access(docsFile('index.html'))
  await access(docsFile('vite.config.ts'))
  await access(docsFile('src/main.ts'))
  await access(docsFile('src/App.vue'))
})

test('root scripts continue to expose the docs project', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
  )

  assert.equal(packageJson.scripts['docs:dev'], 'pnpm --filter ga-ui-docs dev')
  assert.equal(packageJson.scripts['docs:test'], 'pnpm --filter ga-ui-docs test')
  assert.equal(packageJson.scripts['docs:build'], 'pnpm --filter ga-ui-docs build')
})
```

- [ ] **Step 2: Run the structure test and verify RED**

Run:

```powershell
node --test docs/tests/docs-content.spec.mjs
```

Expected: FAIL because `vue-router`, `docs/index.html`, and `docs/vite.config.ts` do not exist and VitePress remains installed.

- [ ] **Step 3: Replace the docs package scripts and dependencies**

Set `docs/package.json` to:

```json
{
  "name": "ga-ui-docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm run generate:api && vite --host 0.0.0.0 --port 5557",
    "build": "pnpm run generate:api && pnpm run typecheck && vite build",
    "preview": "vite preview --host 0.0.0.0 --port 5557",
    "test": "vitest run && node --test tests/*.spec.mjs scripts/*.spec.mjs",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json",
    "generate:api": "node scripts/generate-api.mjs"
  },
  "dependencies": {
    "@element-plus/icons-vue": "^2.3.2",
    "element-plus": "^2.14.3",
    "ga-ui-plus": "workspace:*",
    "shiki": "^3.13.0",
    "vue": "^3.5.40",
    "vue-router": "^4.5.1"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^18.0.1",
    "typescript": "5.8.3",
    "unplugin-auto-import": "^21.0.0",
    "unplugin-vue-components": "^32.1.0",
    "vite": "^6.4.3",
    "vitest": "^3.2.7",
    "vue-tsc": "^3.3.9"
  }
}
```

Keep the root `docs:*` scripts unchanged.

- [ ] **Step 4: Create the standalone Vite configuration**

Create `docs/vite.config.ts`:

```ts
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
  },
})
```

- [ ] **Step 5: Create the minimum application shell**

Create `docs/index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="GA UI Plus 组件文档" />
    <title>GA UI Plus</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `docs/src/main.ts`:

```ts
import { createApp } from 'vue'
import {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import './styles/index.css'

const app = createApp(App)

app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
app.mount('#app')
```

Create `docs/src/App.vue`:

```vue
<template>
  <main class="ga-docs-app">
    <h1>GA UI Plus</h1>
  </main>
</template>
```

Create `docs/src/styles/index.css` with only the initial document tokens:

```css
:root {
  color-scheme: light;
  --ga-docs-bg: #f5f7fa;
  --ga-docs-surface: #ffffff;
  --ga-docs-text: #20242c;
  --ga-docs-muted: #687386;
  --ga-docs-border: #dfe4eb;
  --ga-docs-accent: #1769e0;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-width: 960px;
  min-height: 100%;
  margin: 0;
}

body {
  color: var(--ga-docs-text);
  background: var(--ga-docs-bg);
}

.ga-docs-app {
  min-height: 100vh;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}
```

- [ ] **Step 6: Update TypeScript scope**

Change `docs/tsconfig.json` so `include` is:

```json
[
  "src/**/*.ts",
  "src/**/*.vue",
  "scripts/**/*.mjs",
  "components.d.ts",
  "vite.config.ts"
]
```

Keep the existing workspace `paths`, strict compiler settings, and exclusions for generated build/cache directories.

- [ ] **Step 7: Install the frozen workspace dependencies and run GREEN checks**

Run:

```powershell
pnpm install
node --test docs/tests/docs-content.spec.mjs
pnpm --filter ga-ui-docs typecheck
```

Expected: dependency installation succeeds, both structure tests pass, and the minimal app type-checks.

- [ ] **Step 8: Commit the scaffold**

```powershell
git add package.json pnpm-lock.yaml docs/package.json docs/tsconfig.json docs/index.html docs/vite.config.ts docs/src/main.ts docs/src/App.vue docs/src/styles/index.css docs/tests/docs-content.spec.mjs
git commit -m "refactor(docs): replace VitePress runtime with Vue app"
```

---

### Task 2: Add The Component Catalog, Navigation, And Routes

**Files:**
- Create: `docs/src/content/types.ts`
- Create: `docs/src/content/catalog.ts`
- Create: `docs/src/content/navigation.ts`
- Create: `docs/src/content/navigation.spec.ts`
- Create: `docs/src/router/index.ts`
- Create: `docs/src/views/HomeView.vue`
- Create: `docs/src/views/GuideView.vue`
- Create: `docs/src/views/ComponentView.vue`
- Create: `docs/src/views/NotFoundView.vue`
- Modify: `docs/src/main.ts`

- [ ] **Step 1: Write failing catalog and navigation tests**

Create `docs/src/content/navigation.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { componentCatalog } from './catalog'
import { buildComponentGroups, buildSearchEntries } from './navigation'

describe('component documentation catalog', () => {
  it('registers every public component with unique names and slugs', () => {
    expect(componentCatalog.map((item) => item.name)).toEqual([
      'GaDialog',
      'GaMegaMenu',
      'GaPagination',
      'GaTable',
      'GaAsideMenu',
      'GaSearchBar',
      'GaTablePagination',
    ])
    expect(new Set(componentCatalog.map((item) => item.slug)).size).toBe(7)
  })

  it('groups base and business components in stable order', () => {
    const groups = buildComponentGroups(componentCatalog)

    expect(groups.map((group) => group.key)).toEqual(['base', 'business'])
    expect(groups[0].items.map((item) => item.slug)).toEqual([
      'dialog',
      'mega-menu',
      'pagination',
      'table',
    ])
    expect(groups[1].items.map((item) => item.slug)).toEqual([
      'aside-menu',
      'search-bar',
      'table-pagination',
    ])
  })

  it('creates searchable component entries with route targets', () => {
    const entries = buildSearchEntries(componentCatalog)

    expect(entries[0]).toMatchObject({
      label: 'Dialog 对话框',
      path: '/components/dialog',
    })
    expect(entries.some((entry) => entry.keywords.includes('GaSearchBar'))).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/navigation.spec.ts
```

Expected: FAIL because `catalog.ts` and `navigation.ts` do not exist.

- [ ] **Step 3: Define the content contracts and seven catalog records**

Create `docs/src/content/types.ts`:

```ts
import type { Component } from 'vue'

export type ComponentCategory = 'base' | 'business'
export type ApiSectionName = 'props' | 'events' | 'slots' | 'expose'

export interface ComponentCatalogItem {
  name: string
  slug: string
  title: string
  category: ComponentCategory
  description: string
}

export interface DemoDefinition {
  id: string
  title: string
  description: string
  component: Component
  source: string
}

export interface ApiEntry {
  name: string
  type: string
  required?: boolean
  default?: string
  description?: string
  parameters?: string
}

export interface ComponentApiDefinition {
  props: ApiEntry[]
  events: ApiEntry[]
  slots: ApiEntry[]
  expose: ApiEntry[]
}

export type ReadonlyComponentApiDefinition = {
  readonly [Section in ApiSectionName]: readonly ApiEntry[]
}

export interface ComponentDocDefinition extends ComponentCatalogItem {
  importCode: string
  usage: string
  demos: DemoDefinition[]
  api: ComponentApiDefinition
  notes: string[]
}

export interface NavigationGroup {
  key: ComponentCategory
  label: string
  items: ComponentCatalogItem[]
}

export interface SearchEntry {
  label: string
  description: string
  path: string
  keywords: string[]
  meta?: string
}

export interface GuideSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  code?: string
  language?: string
}

export interface GuideDefinition {
  slug: string
  title: string
  description: string
  sections: GuideSection[]
}
```

Create `docs/src/content/catalog.ts` with this exact order:

```ts
import type { ComponentCatalogItem } from './types'

export const componentCatalog: ComponentCatalogItem[] = [
  { name: 'GaDialog', slug: 'dialog', title: 'Dialog 对话框', category: 'base', description: '封装 Element Plus 对话框，提供全屏切换、关闭控制和实例访问。' },
  { name: 'GaMegaMenu', slug: 'mega-menu', title: 'MegaMenu 大型菜单', category: 'base', description: '用于桌面端一级导航和自适应多列大型菜单面板。' },
  { name: 'GaPagination', slug: 'pagination', title: 'Pagination 分页', category: 'base', description: '提供位置、禁用状态和独立主题配置的分页组件。' },
  { name: 'GaTable', slug: 'table', title: 'Table 表格', category: 'base', description: '使用列配置驱动 Element Plus 表格并支持完整表格主题。' },
  { name: 'GaAsideMenu', slug: 'aside-menu', title: 'AsideMenu 侧边菜单', category: 'business', description: '带头部、底部、滚动区域和折叠控制的业务侧边栏。' },
  { name: 'GaSearchBar', slug: 'search-bar', title: 'SearchBar 搜索栏', category: 'business', description: '使用字段配置组织查询表单、校验、折叠和操作按钮。' },
  { name: 'GaTablePagination', slug: 'table-pagination', title: 'TablePagination 表格分页', category: 'business', description: '组合 GaTable 和 GaPagination，并用 loading 统一管理交互状态。' },
]
```

- [ ] **Step 4: Implement deterministic navigation and search builders**

Create `docs/src/content/navigation.ts`:

```ts
import type {
  ComponentCatalogItem,
  NavigationGroup,
  SearchEntry,
} from './types'

const categoryLabels = {
  base: '基础组件',
  business: '业务组件',
} as const

export function buildComponentGroups(
  catalog: ComponentCatalogItem[],
): NavigationGroup[] {
  return (['base', 'business'] as const).map((key) => ({
    key,
    label: categoryLabels[key],
    items: catalog.filter((item) => item.category === key),
  }))
}

export function buildSearchEntries(
  catalog: ComponentCatalogItem[],
): SearchEntry[] {
  return catalog.map((item) => ({
    label: item.title,
    description: item.description,
    path: `/components/${item.slug}`,
    keywords: [item.name, item.slug, item.title],
  }))
}
```

- [ ] **Step 5: Create generated component routes and temporary views**

Create `docs/src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'

import { componentCatalog } from '../content/catalog'
import ComponentView from '../views/ComponentView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => (to.hash ? { el: to.hash, top: 88 } : { top: 0 }),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/guide/:slug', name: 'guide', component: () => import('../views/GuideView.vue'), props: true },
    ...componentCatalog.map((item) => ({
      path: `/components/${item.slug}`,
      name: `component-${item.slug}`,
      component: ComponentView,
      props: { slug: item.slug },
    })),
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
})
```

Create `ComponentView.vue`:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { componentCatalog } from '../content/catalog'

const props = defineProps<{ slug: string }>()
const component = computed(() =>
  componentCatalog.find((item) => item.slug === props.slug),
)
</script>

<template>
  <main v-if="component" class="ga-docs-page">
    <h1>{{ component.title }}</h1>
    <p>{{ component.description }}</p>
  </main>
</template>
```

Create `HomeView.vue`:

```vue
<template>
  <main class="ga-docs-page">
    <h1>GA UI Plus</h1>
    <p>基于 Element Plus 二次封装的 Vue 3 组件库。</p>
    <RouterLink to="/guide/quick-start">快速开始</RouterLink>
  </main>
</template>
```

Create `GuideView.vue`:

```vue
<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <main class="ga-docs-page">
    <h1>使用指南</h1>
    <p>当前指南：{{ slug }}</p>
  </main>
</template>
```

Create `NotFoundView.vue`:

```vue
<template>
  <main class="ga-docs-page">
    <h1>页面不存在</h1>
    <RouterLink to="/">返回文档首页</RouterLink>
  </main>
</template>
```

Install the router in `docs/src/main.ts` before mounting:

```ts
import { router } from './router'

app.use(router)
```

- [ ] **Step 6: Run GREEN tests and type checking**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/navigation.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: three catalog/navigation tests pass and the router type-checks.

- [ ] **Step 7: Commit the catalog foundation**

```powershell
git add docs/src/content docs/src/router docs/src/views docs/src/main.ts
git commit -m "feat(docs): add registry-driven component navigation"
```

---

### Task 3: Generate Basic API Data From Public TypeScript Types

**Files:**
- Create: `docs/scripts/api-manifest.mjs`
- Create: `docs/scripts/api-extractor.mjs`
- Create: `docs/scripts/api-extractor.spec.mjs`
- Create: `docs/scripts/generate-api.mjs`
- Create: `docs/src/generated/component-api.ts`

- [ ] **Step 1: Write failing extraction tests against real public types**

Create `docs/scripts/api-extractor.spec.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'

import { extractComponentApi } from './api-extractor.mjs'

test('extracts required and optional search bar props', () => {
  const api = extractComponentApi('search-bar')
  const modelValue = api.props.find((item) => item.name === 'modelValue')
  const actionsLoading = api.props.find((item) => item.name === 'actionsLoading')

  assert.equal(modelValue.required, true)
  assert.equal(actionsLoading.required, false)
  assert.match(actionsLoading.type, /boolean/)
})

test('extracts literal event names and expose methods', () => {
  const dialog = extractComponentApi('dialog')
  const searchBar = extractComponentApi('search-bar')

  assert.equal(dialog.events.some((item) => item.name === 'closed'), true)
  assert.equal(searchBar.events.some((item) => item.name === 'search'), true)
  assert.equal(searchBar.expose.some((item) => item.name === 'reset'), true)
})

test('extracts named slot scope types', () => {
  const megaMenu = extractComponentApi('mega-menu')

  assert.equal(megaMenu.slots.some((item) => item.name === 'menu-item'), true)
  assert.match(
    megaMenu.slots.find((item) => item.name === 'panel-item').type,
    /GaMegaMenuPanelItemSlotProps/,
  )
})
```

- [ ] **Step 2: Run the extractor tests and verify RED**

Run:

```powershell
node --test docs/scripts/api-extractor.spec.mjs
```

Expected: FAIL because the manifest and extractor do not exist.

- [ ] **Step 3: Define the public API manifest**

Create `docs/scripts/api-manifest.mjs` with absolute paths resolved from `import.meta.url`. Each record must use these exports:

```js
export const apiManifest = {
  dialog: {
    source: '../packages/ui/src/base/components/dialog/types/index.ts',
    props: 'GaDialogProps',
    emits: 'GaDialogEmits',
    expose: 'GaDialogExpose',
    slots: {
      header: 'GaDialogHeaderSlotProps',
      default: null,
      footer: null,
    },
  },
  'mega-menu': {
    source: '../packages/ui/src/base/components/megaMenu/types/index.ts',
    props: 'GaMegaMenuProps',
    emits: 'GaMegaMenuEmits',
    expose: 'GaMegaMenuExpose',
    slots: {
      'menu-item': 'GaMegaMenuMenuItemSlotProps',
      'group-title': 'GaMegaMenuGroupTitleSlotProps',
      'panel-item': 'GaMegaMenuPanelItemSlotProps',
      empty: 'GaMegaMenuEmptySlotProps',
    },
  },
  pagination: {
    source: '../packages/ui/src/base/components/pagination/src/props.ts',
    props: 'GaPaginationProps', emits: null, expose: null, slots: {},
  },
  table: {
    source: '../packages/ui/src/base/components/table/src/props.ts',
    secondarySource: '../packages/ui/src/base/components/table/types/index.ts',
    props: 'GaTableProps', emits: null, expose: 'GaTableExpose',
    slots: { default: null, empty: null, append: null },
  },
  'aside-menu': {
    source: '../packages/ui/src/business/components/asideMenu/types/index.ts',
    props: 'GaAsideMenuProps', emits: 'GaAsideMenuEmits', expose: 'GaAsideMenuExpose',
    slots: {
      header: 'GaAsideMenuSlotProps',
      default: 'GaAsideMenuSlotProps',
      footer: 'GaAsideMenuSlotProps',
      collapse: 'GaAsideMenuToggleSlotProps',
    },
  },
  'search-bar': {
    source: '../packages/ui/src/business/components/searchBar/types/index.ts',
    props: 'GaSearchBarProps', emits: 'GaSearchBarEmits', expose: 'GaSearchBarExpose',
    slots: {},
  },
  'table-pagination': {
    source: '../packages/ui/src/business/components/tablePagination/src/props.ts',
    props: 'GaTablePaginationProps', emits: null, expose: null,
    slots: { default: null, empty: null, append: null },
  },
}
```

The extractor must add SearchBar dynamic slots manually from this stable list: `field-{key}`, `prepend`, `append`, `actions`, `actions-prepend`, `actions-append`, `action-search`, `action-reset`, and `action-collapse`.

- [ ] **Step 4: Implement compiler-backed extraction helpers**

Create `docs/scripts/api-extractor.mjs` using `typescript`:

```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

import { apiManifest } from './api-manifest.mjs'

const docsRoot = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))

function resolveSource(source) {
  return path.resolve(docsRoot, source)
}

function createChecker(entry) {
  const rootNames = [entry.source, entry.secondarySource]
    .filter(Boolean)
    .map(resolveSource)
  const program = ts.createProgram(rootNames, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
  })
  return { program, checker: program.getTypeChecker() }
}

function exportedSymbol(checker, sourceFile, name) {
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
  const symbol = checker
    .getExportsOfModule(moduleSymbol)
    .find((candidate) => candidate.name === name)
  if (!symbol) throw new Error(`Cannot find exported type ${name}`)
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
}

function symbolType(checker, symbol) {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
  return checker.getTypeOfSymbolAtLocation(symbol, declaration)
}

function objectEntries(checker, sourceFile, typeName) {
  if (!typeName) return []
  const symbol = exportedSymbol(checker, sourceFile, typeName)
  const type = checker.getDeclaredTypeOfSymbol(symbol)
  return checker.getPropertiesOfType(type).map((property) => ({
    name: property.name,
    type: checker.typeToString(symbolType(checker, property), undefined, ts.TypeFormatFlags.NoTruncation),
    required: (property.flags & ts.SymbolFlags.Optional) === 0,
  }))
}

function literalEventNames(type) {
  if (type.isUnion()) return type.types.flatMap(literalEventNames)
  return type.isStringLiteral() ? [type.value] : []
}

function eventEntries(checker, sourceFile, typeName) {
  if (!typeName) return []
  const symbol = exportedSymbol(checker, sourceFile, typeName)
  const type = checker.getDeclaredTypeOfSymbol(symbol)
  return type.getCallSignatures().flatMap((signature) => {
    const parameters = signature.getParameters()
    const eventType = symbolType(checker, parameters[0])
    const parameterText = parameters.slice(1).map((parameter) =>
      `${parameter.name}: ${checker.typeToString(symbolType(checker, parameter), undefined, ts.TypeFormatFlags.NoTruncation)}`,
    ).join(', ')
    return literalEventNames(eventType).map((name) => ({
      name,
      type: 'event',
      required: false,
      parameters: parameterText,
    }))
  })
}

function slotEntries(entry) {
  const slots = Object.entries(entry.slots ?? {}).map(([name, type]) => ({
    name,
    type: type ?? '无作用域参数',
    required: false,
  }))
  if (entry === apiManifest['search-bar']) {
    slots.push(...[
      ['field-{key}', '{ field, value, disabled, update }'],
      ['prepend', '无作用域参数'],
      ['append', '无作用域参数'],
      ['actions', 'GaSearchBarActionSlotProps'],
      ['actions-prepend', 'GaSearchBarActionSlotProps'],
      ['actions-append', 'GaSearchBarActionSlotProps'],
      ['action-search', 'GaSearchBarActionSlotProps'],
      ['action-reset', 'GaSearchBarActionSlotProps'],
      ['action-collapse', 'GaSearchBarActionSlotProps'],
    ].map(([name, type]) => ({ name, type, required: false })))
  }
  return slots
}

export function extractComponentApi(slug) {
  const entry = apiManifest[slug]
  if (!entry) throw new Error(`Unknown component API manifest: ${slug}`)
  const { program, checker } = createChecker(entry)
  const sourceFile = program.getSourceFile(resolveSource(entry.source))
  const secondaryFile = entry.secondarySource
    ? program.getSourceFile(resolveSource(entry.secondarySource))
    : sourceFile
  if (!sourceFile || !secondaryFile) throw new Error(`Cannot load API source for ${slug}`)

  return {
    props: objectEntries(checker, sourceFile, entry.props),
    events: eventEntries(checker, sourceFile, entry.emits),
    slots: slotEntries(entry),
    expose: objectEntries(checker, secondaryFile, entry.expose),
  }
}
```

- [ ] **Step 5: Generate deterministic TypeScript output**

Create `docs/scripts/generate-api.mjs`:

```js
import { writeFile } from 'node:fs/promises'

import { apiManifest } from './api-manifest.mjs'
import { extractComponentApi } from './api-extractor.mjs'

const api = Object.fromEntries(
  Object.keys(apiManifest).map((slug) => [slug, extractComponentApi(slug)]),
)
const output = `// Generated by scripts/generate-api.mjs. Do not edit directly.\n` +
  `export const generatedComponentApi = ${JSON.stringify(api, null, 2)} as const\n`

await writeFile(
  new URL('../src/generated/component-api.ts', import.meta.url),
  output,
  'utf8',
)
```

Create the directory, run the generator, and commit its deterministic output.

- [ ] **Step 6: Run RED-to-GREEN verification**

Run:

```powershell
node --test docs/scripts/api-extractor.spec.mjs
pnpm --filter ga-ui-docs generate:api
pnpm --filter ga-ui-docs typecheck
```

Expected: all extractor tests pass, generation exits zero, and rerunning generation leaves `component-api.ts` unchanged.

- [ ] **Step 7: Commit API generation**

```powershell
git add docs/scripts docs/src/generated docs/package.json
git commit -m "feat(docs): generate component API from public types"
```

---

### Task 4: Merge Generated API With Handwritten Documentation

**Files:**
- Create: `docs/src/content/api.ts`
- Create: `docs/src/content/api.spec.ts`
- Create: `docs/src/content/api-overrides.ts`
- Create: `docs/scripts/migrate-api-overrides.mjs`

- [ ] **Step 1: Write failing merge and validation tests**

Create `docs/src/content/api.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { mergeComponentApi } from './api'

const generated = {
  props: [{ name: 'disabled', type: 'boolean', required: false }],
  events: [{ name: 'change', type: 'event', required: false, parameters: 'value: number' }],
  slots: [],
  expose: [],
}

describe('mergeComponentApi', () => {
  it('adds descriptions and defaults without losing generated types', () => {
    const result = mergeComponentApi('sample', generated, {
      props: {
        disabled: { description: '是否禁用组件', default: 'false' },
      },
    })

    expect(result.props[0]).toEqual({
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: '是否禁用组件',
      default: 'false',
    })
  })

  it('rejects overrides for API names that are not generated', () => {
    expect(() => mergeComponentApi('sample', generated, {
      props: { missing: { description: '无效字段' } },
    })).toThrow('sample.props.missing')
  })

  it('allows manual events and slots for wrapper passthrough APIs', () => {
    const result = mergeComponentApi('sample', generated, {
      extra: {
        events: [{ name: 'select', type: 'event', description: '选择发生变化' }],
        slots: [{ name: 'empty', type: '无作用域参数', description: '空状态内容' }],
      },
    })

    expect(result.events.at(-1)?.name).toBe('select')
    expect(result.slots.at(-1)?.name).toBe('empty')
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/api.spec.ts
```

Expected: FAIL because `mergeComponentApi` does not exist.

- [ ] **Step 3: Implement strict generated/manual merging**

Create `docs/src/content/api.ts`:

```ts
import type {
  ApiEntry,
  ApiSectionName,
  ComponentApiDefinition,
  ReadonlyComponentApiDefinition,
} from './types'

type EntryPatch = Pick<ApiEntry, 'description' | 'default' | 'parameters'>
type SectionOverrides = Partial<Record<string, EntryPatch>>

export interface ApiOverrides {
  props?: SectionOverrides
  events?: SectionOverrides
  slots?: SectionOverrides
  expose?: SectionOverrides
  extra?: Partial<Record<ApiSectionName, ApiEntry[]>>
}

export function mergeComponentApi(
  slug: string,
  generated: ReadonlyComponentApiDefinition,
  overrides: ApiOverrides,
): ComponentApiDefinition {
  const sections: ApiSectionName[] = ['props', 'events', 'slots', 'expose']
  return Object.fromEntries(sections.map((section) => {
    const entries = generated[section].map((entry) => ({ ...entry }))
    const patches = overrides[section] ?? {}
    for (const [name, patch] of Object.entries(patches)) {
      const entry = entries.find((candidate) => candidate.name === name)
      if (!entry) throw new Error(`Unknown API override: ${slug}.${section}.${name}`)
      Object.assign(entry, patch)
    }
    const extras = overrides.extra?.[section] ?? []
    const duplicate = extras.find((extra) =>
      entries.some((entry) => entry.name === extra.name),
    )
    if (duplicate) throw new Error(`Duplicate manual API: ${slug}.${section}.${duplicate.name}`)
    return [section, [...entries, ...extras]]
  })) as unknown as ComponentApiDefinition
}

export function assertApiDescriptions(
  slug: string,
  api: ComponentApiDefinition,
): void {
  for (const [section, entries] of Object.entries(api)) {
    for (const entry of entries) {
      if (!entry.description?.trim()) {
        throw new Error(`Missing API description: ${slug}.${section}.${entry.name}`)
      }
    }
  }
}
```

- [ ] **Step 4: Write a one-time deterministic Markdown table migration**

Create `docs/scripts/migrate-api-overrides.mjs`. It reads the seven current component pages before Task 10 deletes them, parses the first table below `### Props`, `### Events`, `### Slots`, and `### Expose`, expands cells such as ``showTimeout / hideTimeout``, and separates generated entries from manual passthrough entries:

```js
import { readFile, writeFile } from 'node:fs/promises'

const slugs = [
  'dialog',
  'mega-menu',
  'pagination',
  'table',
  'aside-menu',
  'search-bar',
  'table-pagination',
]
const sectionHeadings = {
  props: /^### Props$/m,
  events: /^### Events$/m,
  slots: /^### Slots$/m,
  expose: /^### Expose(?: API)?$/m,
}

function cleanCell(value) {
  return value.trim().replace(/^`|`$/g, '').replaceAll('\\|', '|')
}

function splitRow(line) {
  return line.slice(1, -1).split(/(?<!\\)\|/).map(cleanCell)
}

function splitNames(value) {
  return value.split(/\s+\/\s+/).map(cleanCell)
}

function collectTableLines(lines, start) {
  const table = []
  for (let index = start; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith('|')) break
    table.push(lines[index])
  }
  return table
}

function sectionTable(markdown, heading) {
  const match = heading.exec(markdown)
  if (!match) return []
  const section = markdown.slice(match.index + match[0].length).split(/^### /m)[0]
  const lines = section.split(/\r?\n/)
  const start = lines.findIndex((line) => line.trim().startsWith('|'))
  if (start < 0) return []
  const table = collectTableLines(lines, start)
  const rows = table.filter((line) => line.trim().startsWith('|')).map(splitRow)
  return rows.slice(2).map((cells) => Object.fromEntries(
    rows[0].map((header, index) => [header, cells[index] ?? '']),
  ))
}

function parseGeneratedSource(source) {
  const json = source
    .replace(/^.*?=\s*/s, '')
    .replace(/\s+as const\s*$/s, '')
  return JSON.parse(json)
}

function entryNames(api, section) {
  return new Set(api[section].map((entry) => entry.name))
}

const generatedSource = await readFile(
  new URL('../src/generated/component-api.ts', import.meta.url),
  'utf8',
)
const generated = parseGeneratedSource(generatedSource)
const allOverrides = {}

for (const slug of slugs) {
  const markdown = await readFile(
    new URL(`../site/components/${slug}.md`, import.meta.url),
    'utf8',
  )
  const result = { extra: {} }

  for (const [section, heading] of Object.entries(sectionHeadings)) {
    const known = entryNames(generated[slug], section)
    for (const row of sectionTable(markdown, heading)) {
      const nameCell = row['属性'] ?? row['属性或方法'] ?? row['方法'] ??
        row['事件'] ?? row['插槽'] ?? ''
      for (const name of splitNames(nameCell)) {
        if (!name) continue
        const patch = {
          description: row['说明'] || '参见组件公开类型定义',
          ...(row['默认值'] ? { default: row['默认值'] } : {}),
          ...((row['参数'] || row['作用域'])
            ? { parameters: row['参数'] || row['作用域'] }
            : {}),
        }
        if (known.has(name)) {
          result[section] ??= {}
          result[section][name] = patch
        } else {
          result.extra[section] ??= []
          result.extra[section].push({
            name,
            type: section === 'events' ? 'event' : row['类型'] || '未声明',
            ...patch,
          })
        }
      }
    }

    for (const entry of generated[slug][section]) {
      result[section] ??= {}
      result[section][entry.name] ??= {
        description: `${entry.name} 配置，类型以组件公开声明为准。`,
      }
    }
  }
  if (Object.keys(result.extra).length === 0) delete result.extra
  allOverrides[slug] = result
}

const output = `import type { ApiOverrides } from './api'\n\n` +
  `export const apiOverrides = ${JSON.stringify(allOverrides, null, 2)} satisfies Record<string, ApiOverrides>\n`
await writeFile(
  new URL('../src/content/api-overrides.ts', import.meta.url),
  output,
  'utf8',
)
```

- [ ] **Step 5: Generate and validate all seven override records**

Run:

```powershell
node docs/scripts/migrate-api-overrides.mjs
```

Extend `api.spec.ts` to import `generatedComponentApi`, `apiOverrides`, and `assertApiDescriptions`, merge every slug, call the validator, and expect no throw. Temporarily remove one generated description from the migrated object and run the test to confirm it reports the exact `slug.section.name`; restore the generated line and rerun for GREEN.

- [ ] **Step 6: Run GREEN checks**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/api.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: merge, invalid override, passthrough, and description coverage tests all pass.

- [ ] **Step 7: Commit API documentation merging**

```powershell
git add docs/scripts/migrate-api-overrides.mjs docs/src/content/api.ts docs/src/content/api.spec.ts docs/src/content/api-overrides.ts
git commit -m "feat(docs): merge generated and handwritten API docs"
```

---

### Task 5: Build Resettable Demo And Source Components

**Files:**
- Create: `docs/src/components/CopyButton.vue`
- Create: `docs/src/components/SourceCode.vue`
- Create: `docs/src/components/DemoBlock.vue`
- Create: `docs/src/components/DemoBlock.spec.ts`

- [ ] **Step 1: Write failing preview interaction tests**

Create `docs/src/components/DemoBlock.spec.ts` with a local counter component and clipboard stub:

```ts
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import DemoBlock from './DemoBlock.vue'

const CounterDemo = defineComponent({
  setup() {
    const count = ref(0)
    return () => h('button', {
      class: 'counter-demo',
      onClick: () => count.value++,
    }, String(count.value))
  },
})

describe('DemoBlock', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('expands the exact source passed to the live demo', async () => {
    const wrapper = mount(DemoBlock, {
      props: { title: '计数器', description: '测试案例', demo: CounterDemo, source: '<template>counter</template>' },
    })
    await wrapper.get('[data-action="toggle-source"]').trigger('click')
    expect(wrapper.get('[data-testid="source-code"]').text()).toContain('<template>counter</template>')
  })

  it('copies source code', async () => {
    const wrapper = mount(DemoBlock, {
      props: { title: '计数器', description: '', demo: CounterDemo, source: '<template>counter</template>' },
    })
    await wrapper.get('[data-action="copy-source"]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('<template>counter</template>')
  })

  it('remounts the demo to restore its initial state', async () => {
    const wrapper = mount(DemoBlock, {
      props: { title: '计数器', description: '', demo: CounterDemo, source: 'source' },
    })
    await wrapper.get('.counter-demo').trigger('click')
    expect(wrapper.get('.counter-demo').text()).toBe('1')
    await wrapper.get('[data-action="reset-demo"]').trigger('click')
    expect(wrapper.get('.counter-demo').text()).toBe('0')
  })
})
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/components/DemoBlock.spec.ts
```

Expected: FAIL because `DemoBlock.vue` does not exist.

- [ ] **Step 3: Implement clipboard feedback**

Create `docs/src/components/CopyButton.vue`:

```vue
<script setup lang="ts">
import { Check, CopyDocument, WarningFilled } from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  action?: string
  ariaLabel?: string
}>(), {
  action: 'copy-source',
  ariaLabel: '复制代码',
})
const emit = defineEmits<{ copied: [] }>()
const state = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

const label = computed(() => ({
  idle: props.ariaLabel,
  copied: '已复制',
  failed: '复制失败',
})[state.value])
const icon = computed(() => ({
  idle: CopyDocument,
  copied: Check,
  failed: WarningFilled,
})[state.value])

async function copy() {
  if (resetTimer) clearTimeout(resetTimer)
  try {
    await navigator.clipboard.writeText(props.text)
    state.value = 'copied'
    emit('copied')
  } catch {
    state.value = 'failed'
  }
  resetTimer = setTimeout(() => { state.value = 'idle' }, 1500)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <ElTooltip :content="label">
    <ElButton
      text
      circle
      :data-action="props.action"
      :aria-label="label"
      @click="copy"
    >
      <ElIcon><component :is="icon" /></ElIcon>
    </ElButton>
  </ElTooltip>
</template>
```

- [ ] **Step 4: Implement Shiki highlighting with fallback**

Create `docs/src/components/SourceCode.vue`:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  code: string
  language?: string
}>(), {
  language: 'vue',
})
const highlighted = ref('')
let requestId = 0

watch(
  () => [props.code, props.language] as const,
  async ([code, language]) => {
    const currentRequest = ++requestId
    highlighted.value = ''
    try {
      const { codeToHtml } = await import('shiki')
      const html = await codeToHtml(code, {
        lang: language,
        themes: { light: 'github-light', dark: 'github-dark' },
      })
      if (currentRequest === requestId) highlighted.value = html
    } catch {
      if (currentRequest === requestId) highlighted.value = ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    v-if="highlighted"
    class="ga-docs-source-code"
    data-testid="source-code"
    v-html="highlighted"
  />
  <pre v-else class="ga-docs-source-code" data-testid="source-code"><code>{{ code }}</code></pre>
</template>
```

- [ ] **Step 5: Implement resettable DemoBlock**

Create `docs/src/components/DemoBlock.vue`:

```vue
<script setup lang="ts">
import { ArrowDown, ArrowUp, Refresh } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { ref } from 'vue'

import CopyButton from './CopyButton.vue'
import SourceCode from './SourceCode.vue'

const props = defineProps<{
  title: string
  description: string
  demo: Component
  source: string
}>()
const sourceOpen = ref(false)
const renderKey = ref(0)

function resetDemo() {
  renderKey.value += 1
}
</script>

<template>
  <section class="ga-docs-demo">
    <header class="ga-docs-demo__header">
      <div>
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="ga-docs-demo__actions">
        <ElTooltip content="恢复案例">
          <ElButton
            text
            circle
            data-action="reset-demo"
            aria-label="恢复案例"
            @click="resetDemo"
          >
            <ElIcon><Refresh /></ElIcon>
          </ElButton>
        </ElTooltip>
        <CopyButton :text="source" />
        <ElTooltip :content="sourceOpen ? '收起代码' : '展开代码'">
          <ElButton
            text
            circle
            data-action="toggle-source"
            :aria-label="sourceOpen ? '收起代码' : '展开代码'"
            @click="sourceOpen = !sourceOpen"
          >
            <ElIcon><component :is="sourceOpen ? ArrowUp : ArrowDown" /></ElIcon>
          </ElButton>
        </ElTooltip>
      </div>
    </header>

    <div class="ga-docs-demo__surface">
      <component :is="demo" :key="renderKey" />
    </div>

    <div v-show="sourceOpen" class="ga-docs-demo__source">
      <SourceCode :code="source" language="vue" />
    </div>
  </section>
</template>
```

- [ ] **Step 6: Run GREEN tests and type checking**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/components/DemoBlock.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: source, copy, and reset tests pass.

- [ ] **Step 7: Commit preview components**

```powershell
git add docs/src/components
git commit -m "feat(docs): add resettable live code previews"
```

---

### Task 6: Build The Documentation Shell, Theme, And Search

**Files:**
- Create: `docs/src/layout/DocsShell.vue`
- Create: `docs/src/layout/DocsHeader.vue`
- Create: `docs/src/layout/DocsSidebar.vue`
- Create: `docs/src/layout/PageOutline.vue`
- Create: `docs/src/layout/DocsShell.spec.ts`
- Create: `docs/src/composables/useDocsTheme.ts`
- Create: `docs/src/composables/useDocsTheme.spec.ts`
- Create: `docs/src/composables/usePageOutline.ts`
- Modify: `docs/src/App.vue`
- Modify: `docs/src/styles/index.css`

- [ ] **Step 1: Write failing theme persistence tests**

Create `docs/src/composables/useDocsTheme.spec.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest'

import { useDocsTheme } from './useDocsTheme'

describe('useDocsTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('toggles only the docs theme class and persists it', () => {
    const theme = useDocsTheme()
    theme.setTheme('dark')
    expect(document.documentElement.classList.contains('ga-docs-dark')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('ga-ui-docs-theme')).toBe('dark')
  })

  it('restores the light theme explicitly', () => {
    const theme = useDocsTheme()
    theme.setTheme('dark')
    theme.setTheme('light')
    expect(document.documentElement.classList.contains('ga-docs-dark')).toBe(false)
  })
})
```

The dedicated `ga-docs-dark` class is required so Element Plus and `ga-ui-plus` demos do not inherit Element Plus dark-theme variables.

- [ ] **Step 2: Write failing shell navigation and search tests**

Create `docs/src/layout/DocsShell.spec.ts`:

```ts
import ElementPlus from 'element-plus'
import { defineComponent, h, nextTick, onMounted } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'

import { usePageOutline } from '../composables/usePageOutline'
import DocsShell from './DocsShell.vue'

const RoutePage = defineComponent({
  setup() {
    const outline = usePageOutline()
    onMounted(() => outline.setItems([{ id: 'usage', label: '基础用法', level: 2 }]))
    return () => h('section', { id: 'usage' }, '页面内容')
  },
})

async function mountShell() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: RoutePage },
      { path: '/components/search-bar', component: RoutePage },
    ],
  })
  await router.push('/components/search-bar')
  await router.isReady()
  const wrapper = mount(DocsShell, {
    attachTo: document.body,
    global: { plugins: [router, ElementPlus] },
  })
  await nextTick()
  return wrapper
}

describe('DocsShell', () => {
  it('renders brand, component groups, active route, and page outline', async () => {
    const wrapper = await mountShell()
    expect(wrapper.text()).toContain('GA UI Plus')
    expect(wrapper.text()).toContain('基础组件')
    expect(wrapper.text()).toContain('业务组件')
    expect(wrapper.get('[aria-current="page"]').attributes('href')).toBe('/components/search-bar')
    expect(wrapper.get('a[href="#usage"]').text()).toBe('基础用法')
    wrapper.unmount()
  })

  it('shows matching component search results', async () => {
    const wrapper = await mountShell()
    await wrapper.get('input[placeholder="搜索组件或 API"]').setValue('SearchBar')
    await nextTick()
    expect(document.body.textContent).toContain('SearchBar 搜索栏')
    wrapper.unmount()
  })
})
```

Set `teleported="false"` on the header autocomplete result panel so the unit test and keyboard focus remain inside the header subtree.

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/composables/useDocsTheme.spec.ts src/layout/DocsShell.spec.ts
```

Expected: FAIL because theme and shell modules do not exist.

- [ ] **Step 4: Implement isolated documentation theme state**

Create `docs/src/composables/useDocsTheme.ts`:

```ts
import { readonly, ref } from 'vue'

export type DocsTheme = 'light' | 'dark'

const storageKey = 'ga-ui-docs-theme'
const currentTheme = ref<DocsTheme>('light')

function applyTheme(theme: DocsTheme) {
  currentTheme.value = theme
  document.documentElement.classList.toggle('ga-docs-dark', theme === 'dark')
  localStorage.setItem(storageKey, theme)
}

export function useDocsTheme() {
  const stored = localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') applyTheme(stored)

  return {
    theme: readonly(currentTheme),
    setTheme: applyTheme,
    toggleTheme: () => applyTheme(currentTheme.value === 'light' ? 'dark' : 'light'),
  }
}
```

Only toggle `ga-docs-dark`; never set Element Plus's `dark` class.

- [ ] **Step 5: Implement the three-column shell**

`DocsShell.vue` owns this stable grid:

```vue
<script setup lang="ts">
import { providePageOutline } from '../composables/usePageOutline'
import DocsHeader from './DocsHeader.vue'
import DocsSidebar from './DocsSidebar.vue'
import PageOutline from './PageOutline.vue'

providePageOutline()
</script>

<template>
  <div class="ga-docs-shell">
    <DocsHeader />
    <div class="ga-docs-shell__body">
      <DocsSidebar />
      <section class="ga-docs-shell__content">
        <RouterView />
      </section>
      <PageOutline />
    </div>
  </div>
</template>
```

Use a 64 px fixed header, a 248 px left sidebar, a content track of `minmax(0, 1fr)`, and a 208 px outline. At widths below 1180 px hide only the outline; keep the left navigation because the documentation is desktop-focused.

- [ ] **Step 6: Implement header search and navigation**

`DocsHeader.vue` uses `ElAutocomplete` with `buildSearchEntries(componentCatalog)`. Search matching is case-insensitive across label, description, and keywords. Selecting a result calls `router.push(entry.path)`. Add icon-only theme and reset-to-light controls with tooltips; the reset control calls `setTheme('light')`.

- [ ] **Step 7: Implement grouped sidebar and outline**

`DocsSidebar.vue` renders `buildComponentGroups(componentCatalog)` and RouterLinks. Group headings are buttons with `aria-expanded`; collapsed state is local and does not remove the active route from the DOM until the transition completes.

Create `docs/src/composables/usePageOutline.ts`:

```ts
import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'

export interface PageOutlineItem {
  id: string
  label: string
  level: 2 | 3
}

interface PageOutlineContext {
  items: Ref<PageOutlineItem[]>
  setItems: (items: PageOutlineItem[]) => void
}

const pageOutlineKey: InjectionKey<PageOutlineContext> = Symbol('page-outline')

export function providePageOutline(): PageOutlineContext {
  const items = ref<PageOutlineItem[]>([])
  const context = {
    items,
    setItems: (value: PageOutlineItem[]) => { items.value = value },
  }
  provide(pageOutlineKey, context)
  return context
}

export function usePageOutline(): PageOutlineContext {
  const context = inject(pageOutlineKey)
  if (!context) throw new Error('Page outline provider is missing')
  return context
}
```

Call `providePageOutline()` in `DocsShell.vue` setup. `PageOutline.vue` reads the service and renders `<a :href="\`#${item.id}\`">`; `ComponentView` populates it in Task 7.

- [ ] **Step 8: Replace the root App**

Set `App.vue` to:

```vue
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import DocsShell from './layout/DocsShell.vue'
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <DocsShell />
  </ElConfigProvider>
</template>
```

- [ ] **Step 9: Add document-only CSS**

Extend `styles/index.css` using `.ga-docs-*` selectors only. Add light/dark semantic variables, fixed header, three-column grid, navigation focus states, page width, tables, source code, and DemoBlock framing. Scan the file with:

```powershell
rg -n "(^|[,{ ])(\.el-|\.ga-(?!docs)|button\s*\{|table\s*\{|input\s*\{)" docs/src/styles/index.css
```

Expected: no matches that target Element Plus, ga-ui-plus components, or unscoped controls.

- [ ] **Step 10: Run GREEN checks and commit**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/composables/useDocsTheme.spec.ts src/layout/DocsShell.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: theme, search, active navigation, and outline tests pass.

Commit:

```powershell
git add docs/src/App.vue docs/src/layout docs/src/composables docs/src/styles/index.css
git commit -m "feat(docs): add searchable documentation shell"
```

---

### Task 7: Build Generic Component Pages And API Tables

**Files:**
- Create: `docs/src/components/ApiTable.vue`
- Create: `docs/src/components/ApiTable.spec.ts`
- Create: `docs/src/content/component-docs.ts`
- Create: `docs/src/views/ComponentView.spec.ts`
- Modify: `docs/src/views/ComponentView.vue`

- [ ] **Step 1: Write failing API table tests**

Assert that `ApiTable`:

- renders columns `名称`, `说明`, `类型`, and `默认值` for Props;
- renders `参数` instead of `默认值` for Events;
- displays `—` for absent defaults and parameters;
- keeps long type text intact and provides a copy button.

- [ ] **Step 2: Write failing generic page tests**

Mock a `ComponentDocDefinition` with two demos and four API sections. Mount `ComponentView` at `/components/sample` and assert the page renders:

- title and description;
- import and usage code;
- two `DemoBlock` instances;
- Props, Events, Slots, and Expose headings;
- notes;
- outline IDs `usage`, `examples`, `props`, `events`, `slots`, and `expose`.

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/components/ApiTable.spec.ts src/views/ComponentView.spec.ts
```

Expected: FAIL because the generic documentation renderer does not exist.

- [ ] **Step 4: Implement ApiTable**

Use a native semantic table inside `.ga-docs-api-table__scroll`; the table is documentation UI, so every selector stays under `.ga-docs-api-table`. Render type text in `<code>`, use `CopyButton` beside it, and choose the fourth column from the `section` prop.

- [ ] **Step 5: Implement document loading**

Create `component-docs.ts` with Vite lazy module discovery so adding a component document file does not require a second loader registry:

```ts
import type { ComponentDocDefinition } from './types'

type ComponentDocModule = { default: ComponentDocDefinition }
type ComponentDocModules = Record<string, () => Promise<ComponentDocModule>>

const defaultModules = import.meta.glob<ComponentDocModule>('./components/*.ts')

export function createComponentDocLoader(modules: ComponentDocModules = defaultModules) {
  return async (slug: string): Promise<ComponentDocDefinition> => {
    const loader = modules[`./components/${slug}.ts`]
    if (!loader) throw new Error(`Unknown component document: ${slug}`)
    return (await loader()).default
  }
}

export const loadComponentDoc = createComponentDocLoader()
```

In `ComponentView.spec.ts`, use `createComponentDocLoader` with `{ './components/sample.ts': async () => ({ default: sampleDefinition }) }`, and mock `loadComponentDoc` with the returned function before mounting. Add a focused unit test that an absent slug rejects with `Unknown component document: missing`.

- [ ] **Step 6: Implement ComponentView loading, error state, and sections**

Watch the `slug` prop, clear the current definition, load it, and ignore stale async results using an incrementing request ID. On failure, render an `ElResult` with the slug and a back-to-components action. On success, render demos and non-empty API sections through `DemoBlock` and `ApiTable`, then publish the visible section IDs to the outline service.

- [ ] **Step 7: Run GREEN checks and commit**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/components/ApiTable.spec.ts src/views/ComponentView.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: API table and generic page tests pass.

Commit:

```powershell
git add docs/src/components/ApiTable.vue docs/src/components/ApiTable.spec.ts docs/src/content/component-docs.ts docs/src/views/ComponentView.vue docs/src/views/ComponentView.spec.ts
git commit -m "feat(docs): render registry-driven component pages"
```

---

### Task 8: Migrate All Seven Components And Fourteen Demos

**Files:**
- Move: `docs/site/demos/**` to `docs/src/demos/**`
- Create: `docs/src/content/components/dialog.ts`
- Create: `docs/src/content/components/mega-menu.ts`
- Create: `docs/src/content/components/pagination.ts`
- Create: `docs/src/content/components/table.ts`
- Create: `docs/src/content/components/aside-menu.ts`
- Create: `docs/src/content/components/search-bar.ts`
- Create: `docs/src/content/components/table-pagination.ts`
- Create: `docs/src/content/components/components.spec.ts`

- [ ] **Step 1: Write failing complete-content tests**

Create `components.spec.ts` that loads every catalog slug and asserts:

```ts
for (const item of componentCatalog) {
  it(`${item.name} has complete standalone documentation`, async () => {
    const doc = await loadComponentDoc(item.slug)
    expect(doc.name).toBe(item.name)
    expect(doc.description.trim()).not.toBe('')
    expect(doc.importCode).toContain(item.name)
    expect(doc.usage).toContain(`<${item.name}`)
    expect(doc.demos.length).toBeGreaterThan(0)
    expect(new Set(doc.demos.map((demo) => demo.id)).size).toBe(doc.demos.length)
    expect(doc.demos.every((demo) => demo.source.includes('<template'))).toBe(true)
    expect(doc.api.props.length).toBeGreaterThan(0)
  })
}
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/components/components.spec.ts
```

Expected: FAIL because the seven component modules do not exist.

- [ ] **Step 3: Move existing demo SFCs without rewriting behavior**

Move these directories intact:

```text
docs/site/demos/dialog            -> docs/src/demos/dialog
docs/site/demos/mega-menu         -> docs/src/demos/mega-menu
docs/site/demos/pagination        -> docs/src/demos/pagination
docs/site/demos/table             -> docs/src/demos/table
docs/site/demos/aside-menu        -> docs/src/demos/aside-menu
docs/site/demos/search-bar        -> docs/src/demos/search-bar
docs/site/demos/table-pagination  -> docs/src/demos/table-pagination
```

Preserve the fourteen filenames and their runtime behavior. Change imports only when the new directory depth requires it.

- [ ] **Step 4: Create document definitions using live and raw imports**

Each file follows this exact pattern, shown for Dialog:

```ts
import BasicDemo from '../../demos/dialog/BasicDemo.vue'
import basicSource from '../../demos/dialog/BasicDemo.vue?raw'
import LifecycleDemo from '../../demos/dialog/LifecycleDemo.vue'
import lifecycleSource from '../../demos/dialog/LifecycleDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'dialog')!

export default {
  ...summary,
  importCode: `import { GaDialog } from 'ga-ui-plus/base'\nimport 'ga-ui-plus/style.css'`,
  usage: `<GaDialog v-model="visible" title="编辑资料">\n  对话框内容\n</GaDialog>`,
  demos: [
    { id: 'basic', title: '基础对话框', description: '包含全屏切换、表单内容和自定义底部操作。', component: BasicDemo, source: basicSource },
    { id: 'lifecycle', title: '关闭流程', description: '观察打开、关闭、自动聚焦和 before-close 的执行顺序。', component: LifecycleDemo, source: lifecycleSource },
  ],
  api: mergeComponentApi('dialog', generatedComponentApi.dialog, apiOverrides.dialog),
  notes: [
    'before-close 只有在回调调用 done 后才会继续关闭。',
    'footer 业务按钮由使用方提供，组件只管理对话框容器行为。',
  ],
} satisfies ComponentDocDefinition
```

Create the other six definitions with these exact demo records:

| Component | Demo ID | File | Title | Description |
| --- | --- | --- | --- | --- |
| MegaMenu | `basic` | `BasicDemo.vue` | 数据驱动菜单 | 切换点击与悬停触发方式，并观察 select 事件。 |
| MegaMenu | `theme` | `ThemeDemo.vue` | 独立配置菜单和面板 | 一级菜单使用深绿色，二级面板使用浅色表面。 |
| Pagination | `basic` | `BasicDemo.vue` | 分页状态 | 页码、每页数量和禁用状态都由外部控制。 |
| Pagination | `theme` | `ThemeDemo.vue` | 独立分页主题 | 主题只影响当前分页实例。 |
| Table | `basic` | `BasicDemo.vue` | 基础表格 | 通过 columns 配置列，并用 slot 字段关联同名插槽。 |
| Table | `selection` | `SelectionDemo.vue` | 选择列和独立主题 | selection-change 由底层 ElTable 通过 attrs 透传。 |
| AsideMenu | `basic` | `BasicDemo.vue` | 完整侧边栏 | 展示头部、底部、自定义折叠控制和 select 事件。 |
| AsideMenu | `theme` | `ThemeDemo.vue` | 实例级主题 | 背景、文字、激活态和悬停态可单独设置。 |
| SearchBar | `basic` | `BasicDemo.vue` | 字段、栅格与折叠 | 包含输入、单选、多选、日期格式和查询结果。 |
| SearchBar | `advanced` | `AdvancedDemo.vue` | 校验、自定义字段与按钮 | 只替换查询按钮，并在前后插入额外操作。 |
| TablePagination | `basic` | `BasicDemo.vue` | 表格与分页联动 | 切换页码和每页数量时由外部计算当前页数据。 |
| TablePagination | `loading` | `LoadingDemo.vue` | 加载时禁用分页 | 点击模拟加载，观察表格遮罩和分页按钮。 |

Use these public import paths:

- Base: `GaDialog`, `GaMegaMenu`, `GaPagination`, `GaTable` from `ga-ui-plus/base`.
- Business: `GaAsideMenu`, `GaSearchBar`, `GaTablePagination` from `ga-ui-plus/business`.

Every usage string must be a syntactically complete Vue template fragment and every definition must include `import 'ga-ui-plus/style.css'` in `importCode`.

Vite discovers these seven files through `import.meta.glob`, so no router, navigation, or loader table changes are required beyond the catalog record and component document file.

- [ ] **Step 5: Verify all demos use real ga-ui-plus components**

Run:

```powershell
rg -L "<Ga(Dialog|MegaMenu|Pagination|Table|AsideMenu|SearchBar|TablePagination)" docs/src/demos -g "*.vue"
```

Inspect any output. Helper-only demos may omit a top-level `Ga*` tag only when imported by another demo; no current migrated file should require that exception.

- [ ] **Step 6: Run GREEN checks and commit**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/components/components.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: all seven complete-content tests pass and all fourteen demos type-check.

Commit:

```powershell
git add docs/src/demos docs/src/content/components docs/site/demos
git commit -m "docs: migrate component demos into standalone app"
```

---

### Task 9: Add Home, Guides, And API-Aware Search

**Files:**
- Create: `docs/src/content/guides.ts`
- Create: `docs/src/content/search.ts`
- Create: `docs/src/content/search.spec.ts`
- Modify: `docs/src/views/HomeView.vue`
- Modify: `docs/src/views/GuideView.vue`
- Modify: `docs/src/layout/DocsHeader.vue`

- [ ] **Step 1: Write failing API search tests**

Create `docs/src/content/search.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { createSearchEntries, searchDocs } from './search'

const entries = createSearchEntries()

describe('documentation search', () => {
  it('finds components by title', () => {
    expect(searchDocs('Dialog', entries)[0].path).toBe('/components/dialog')
  })

  it('finds props and links to their sections', () => {
    expect(searchDocs('beforeClose', entries)[0].path).toBe('/components/dialog#props')
    expect(searchDocs('actionsLoading', entries)[0].path).toBe('/components/search-bar#props')
  })

  it('returns all matching public events', () => {
    const paths = searchDocs('select', entries).map((entry) => entry.path)
    expect(paths).toContain('/components/mega-menu#events')
    expect(paths).toContain('/components/aside-menu#events')
  })

  it('returns an empty array for an unknown query', () => {
    expect(searchDocs('not-a-ga-ui-api', entries)).toEqual([])
  })
})
```

- [ ] **Step 2: Run the search test and verify RED**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/search.spec.ts
```

Expected: FAIL because API-aware indexing does not exist.

- [ ] **Step 3: Implement guide records**

Create `docs/src/content/guides.ts`:

```ts
import type { GuideDefinition } from './types'

export const guides: Record<string, GuideDefinition> = {
  introduction: {
    slug: 'introduction',
    title: '介绍',
    description: '了解 GA UI Plus 的定位、组件分层和文档用途。',
    sections: [
      {
        id: 'purpose',
        title: '组件库定位',
        paragraphs: ['GA UI Plus 是一个基于 Vue 3 和 Element Plus 的业务组件库，为表格、分页、搜索、菜单和对话框场景提供稳定默认行为。'],
      },
      {
        id: 'layers',
        title: '组件分层',
        bullets: [
          '基础组件：GaDialog、GaMegaMenu、GaPagination、GaTable。',
          '业务组件：GaAsideMenu、GaSearchBar、GaTablePagination。',
        ],
      },
      {
        id: 'workflow',
        title: '文档与 Playground',
        paragraphs: ['Playground 用于快速试验和排查问题；文档项目只收录行为稳定、API 清晰并且源码可复制的案例。'],
      },
    ],
  },
  'quick-start': {
    slug: 'quick-start',
    title: '快速开始',
    description: '安装依赖、引入样式并在 Vue 页面中使用组件。',
    sections: [
      {
        id: 'install',
        title: '安装',
        paragraphs: ['vue 和 element-plus 是 peer dependencies，需要由业务项目直接安装。'],
        code: 'pnpm add ga-ui-plus vue element-plus',
        language: 'bash',
      },
      {
        id: 'styles',
        title: '全量样式与按组件导入',
        code: `import { createApp } from 'vue'\nimport ElementPlus from 'element-plus'\nimport 'element-plus/dist/index.css'\nimport 'ga-ui-plus/style.css'\n\nimport App from './App.vue'\n\ncreateApp(App).use(ElementPlus).mount('#app')`,
        language: 'ts',
      },
      {
        id: 'component',
        title: '页面中使用组件',
        code: `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { GaDialog } from 'ga-ui-plus/base'\n\nconst visible = ref(false)\n<\/script>\n\n<template>\n  <ElButton @click="visible = true">打开</ElButton>\n  <GaDialog v-model="visible" title="示例对话框">\n    对话框内容\n  </GaDialog>\n</template>`,
        language: 'vue',
      },
      {
        id: 'entries',
        title: '导入入口',
        code: `import { GaDialog, GaSearchBar, GaTable } from 'ga-ui-plus'\nimport { GaDialog, GaPagination, GaTable } from 'ga-ui-plus/base'\nimport { GaAsideMenu, GaSearchBar } from 'ga-ui-plus/business'`,
        language: 'ts',
      },
    ],
  },
  resolver: {
    slug: 'resolver',
    title: '按需引入',
    description: '使用 GaUiResolver 自动解析组件和所需样式。',
    sections: [
      {
        id: 'install',
        title: '安装插件',
        code: 'pnpm add -D unplugin-vue-components unplugin-auto-import',
        language: 'bash',
      },
      {
        id: 'default',
        title: '默认配置',
        code: `import vue from '@vitejs/plugin-vue'\nimport { defineConfig } from 'vite'\nimport AutoImport from 'unplugin-auto-import/vite'\nimport Components from 'unplugin-vue-components/vite'\nimport { ElementPlusResolver } from 'unplugin-vue-components/resolvers'\nimport { GaUiResolver } from 'ga-ui-plus/resolver'\n\nexport default defineConfig({\n  plugins: [\n    vue(),\n    AutoImport({ resolvers: [ElementPlusResolver()] }),\n    Components({ resolvers: [ElementPlusResolver(), GaUiResolver()] }),\n  ],\n})`,
        language: 'ts',
      },
      {
        id: 'full-element-plus',
        title: '业务项目已全量引入 Element Plus 样式',
        code: `import 'element-plus/dist/index.css'\n\nComponents({\n  resolvers: [\n    ElementPlusResolver({ importStyle: false }),\n    GaUiResolver({ elementPlusStyle: false }),\n  ],\n})`,
        language: 'ts',
      },
      {
        id: 'options',
        title: 'Resolver 配置',
        bullets: [
          'importStyle 默认为 true，控制 ga-ui-plus/style.css。',
          'elementPlusStyle 默认为 true，控制 GA 组件内部需要的 Element Plus 按需样式。',
          '显式 JavaScript 导入不会触发 Resolver，需要手动引入样式。',
        ],
      },
    ],
  },
  development: {
    slug: 'development',
    title: '本地开发',
    description: '在 pnpm workspace 中开发、预览和验证组件文档。',
    sections: [
      { id: 'install', title: '安装依赖', code: 'pnpm install', language: 'bash' },
      { id: 'docs', title: '启动文档项目', paragraphs: ['文档项目默认使用 5557 端口。'], code: 'pnpm docs:dev', language: 'bash' },
      { id: 'playground', title: '启动 Playground', code: 'pnpm --filter playground dev', language: 'bash' },
      { id: 'verify', title: '常用验证', code: 'pnpm docs:test\npnpm docs:build\npnpm --filter ga-ui-plus test\npnpm --filter ga-ui-plus build', language: 'bash' },
      {
        id: 'new-component',
        title: '新增组件文档',
        bullets: [
          '在 docs/src/demos/<component> 创建独立案例。',
          '在 docs/src/content/components 创建组件文档定义。',
          '在 catalog.ts 注册组件，路由、导航和搜索会自动生成。',
          '运行 API 生成、文档测试和生产构建。',
        ],
      },
    ],
  },
}
```

- [ ] **Step 4: Implement API-aware search**

Create `docs/src/content/search.ts`:

```ts
import { generatedComponentApi } from '../generated/component-api'
import { mergeComponentApi } from './api'
import { apiOverrides } from './api-overrides'
import { componentCatalog } from './catalog'
import type { ApiSectionName, SearchEntry } from './types'

const sectionLabels: Record<ApiSectionName, string> = {
  props: 'Props', events: 'Events', slots: 'Slots', expose: 'Expose',
}

export function createSearchEntries(): SearchEntry[] {
  return componentCatalog.flatMap((component) => {
    const api = mergeComponentApi(
      component.slug,
      generatedComponentApi[component.slug as keyof typeof generatedComponentApi],
      apiOverrides[component.slug],
    )
    const componentEntry: SearchEntry = {
      label: component.title,
      description: component.description,
      path: `/components/${component.slug}`,
      keywords: [component.name, component.slug, component.title],
      meta: '组件',
    }
    const apiEntries = (Object.keys(api) as ApiSectionName[]).flatMap((section) =>
      api[section].map((entry) => ({
        label: entry.name,
        description: entry.description ?? '',
        path: `/components/${component.slug}#${section}`,
        keywords: [entry.name, component.name, component.title, sectionLabels[section]],
        meta: `${component.title} · ${sectionLabels[section]}`,
      })),
    )
    return [componentEntry, ...apiEntries]
  })
}

function scoreEntry(query: string, entry: SearchEntry): number {
  const values = [entry.label, ...entry.keywords].map((value) =>
    value.toLocaleLowerCase('zh-CN'),
  )
  if (values.some((value) => value === query)) return 0
  if (values.some((value) => value.startsWith(query))) return 10
  if (values.some((value) => value.includes(query))) return 20
  if (entry.description.toLocaleLowerCase('zh-CN').includes(query)) return 30
  return Number.POSITIVE_INFINITY
}

export function searchDocs(query: string, entries: SearchEntry[]): SearchEntry[] {
  const normalized = query.trim().toLocaleLowerCase('zh-CN')
  if (!normalized) return []
  return entries
    .map((entry) => ({ entry, score: scoreEntry(normalized, entry) }))
    .filter((result) => Number.isFinite(result.score))
    .sort((left, right) => left.score - right.score || left.entry.label.localeCompare(right.entry.label, 'zh-CN'))
    .slice(0, 12)
    .map((result) => result.entry)
}
```

- [ ] **Step 5: Complete HomeView and GuideView**

`HomeView` must show:

- literal brand heading `GA UI Plus`;
- install command `pnpm add ga-ui-plus element-plus`;
- minimal Vue setup snippet;
- base/business component index generated from the catalog.

`GuideView` selects a registered guide by slug, renders semantic sections and `SourceCode`, and uses the same 404 error state for unknown slugs.

- [ ] **Step 6: Connect header autocomplete to the full search index**

Replace catalog-only search with the API-aware search function. Search results display component title as primary text and `Props · beforeClose` style metadata as secondary text.

- [ ] **Step 7: Run GREEN checks and commit**

Run:

```powershell
pnpm --filter ga-ui-docs vitest run src/content/search.spec.ts
pnpm --filter ga-ui-docs typecheck
```

Expected: component and API searches pass and all guide routes type-check.

Commit:

```powershell
git add docs/src/content/guides.ts docs/src/content/search.ts docs/src/content/search.spec.ts docs/src/views/HomeView.vue docs/src/views/GuideView.vue docs/src/layout/DocsHeader.vue
git commit -m "feat(docs): add guides and API-aware search"
```

---

### Task 10: Remove VitePress, Verify Style Isolation, And Finish Migration

**Files:**
- Delete: `docs/.vitepress/**`
- Delete: `docs/site/**`
- Delete: `docs/.gitignore` VitePress-only entries or replace them with Vite entries.
- Modify: `docs/tests/docs-content.spec.mjs`
- Create: `docs/tests/e2e/docs_app.py`
- Delete: `docs/scripts/migrate-api-overrides.mjs` after its committed output is verified.
- Modify: `docs/package.json`

- [ ] **Step 1: Extend structural tests before deleting the old runtime**

Add assertions that:

```js
await assert.rejects(access(docsFile('.vitepress/config.mts')))
await assert.rejects(access(docsFile('site/index.md')))

const docsStyles = await readFile(docsFile('src/styles/index.css'), 'utf8')
const unsafeSelectors = docsStyles
  .split(/\r?\n/)
  .filter((line) => /(^|[,{ ])(\.el-|\.ga-(?!docs-))/.test(line))
assert.deepEqual(unsafeSelectors, [])
```

- [ ] **Step 2: Run the structural test and verify RED**

Run:

```powershell
node --test docs/tests/docs-content.spec.mjs
```

Expected: FAIL because VitePress files still exist.

- [ ] **Step 3: Delete the retired VitePress runtime and source pages**

Remove `.vitepress` and the remaining `site` directory after confirming all fourteen demos already live under `src/demos`. Update `.gitignore` to ignore only:

```text
dist
.vite
tests/test-results
```

Do not delete `docs/superpowers`; design and implementation records remain part of the repository.
Delete `docs/scripts/migrate-api-overrides.mjs` in the same step because its Markdown source pages no longer exist; keep the generated and reviewed `src/content/api-overrides.ts`.

- [ ] **Step 4: Add a Playwright smoke script**

Create `docs/tests/e2e/docs_app.py`:

```python
from pathlib import Path
from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:5557"
OUTPUT = Path(__file__).resolve().parents[1] / "test-results"


def expect_text(page, selector: str, expected: str) -> None:
    actual = page.locator(selector).first.inner_text()
    assert expected in actual, f"Expected {expected!r} in {actual!r}"


def assert_no_page_overflow(page) -> None:
    state = page.evaluate("""() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    })""")
    assert state["scrollWidth"] == state["clientWidth"], state


OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})

    page.goto(f"{BASE_URL}/components/dialog")
    page.wait_for_load_state("networkidle")
    expect_text(page, "h1", "Dialog 对话框")
    page.locator('[data-action="toggle-source"]').first.click()
    page.locator('[data-testid="source-code"]').first.wait_for()
    assert_no_page_overflow(page)
    page.screenshot(path=OUTPUT / "dialog-1440.png", full_page=True)

    page.goto(f"{BASE_URL}/components/mega-menu")
    page.wait_for_load_state("networkidle")
    page.get_by_role("button", name="恢复案例").first.click()
    expect_text(page, "h1", "MegaMenu 大型菜单")
    assert_no_page_overflow(page)

    page.get_by_role("button", name="切换深色模式").click()
    state = page.evaluate("""() => ({
      docsDark: document.documentElement.classList.contains('ga-docs-dark'),
      elementDark: document.documentElement.classList.contains('dark'),
    })""")
    assert state == {"docsDark": True, "elementDark": False}, state

    page.set_viewport_size({"width": 1024, "height": 900})
    page.goto(f"{BASE_URL}/components/search-bar")
    page.wait_for_load_state("networkidle")
    expect_text(page, "h1", "SearchBar 搜索栏")
    assert_no_page_overflow(page)
    page.screenshot(path=OUTPUT / "search-bar-1024.png", full_page=True)

    browser.close()
```

- [ ] **Step 5: Run the complete documentation verification**

Run:

```powershell
pnpm docs:test
pnpm docs:build
```

Expected: all Vitest and Node structure tests pass; API generation, Vue type checking, and Vite production build exit zero.

- [ ] **Step 6: Run the existing component-library regression suite**

Run:

```powershell
pnpm --filter ga-ui-plus test
```

Expected: all existing component-library tests pass with no regression.

- [ ] **Step 7: Start the standalone docs project and run Playwright**

First inspect the webapp-testing helper:

```powershell
python C:\Users\22138\.codex\skills\webapp-testing\scripts\with_server.py --help
```

Run:

```powershell
python C:\Users\22138\.codex\skills\webapp-testing\scripts\with_server.py --server "pnpm docs:dev" --port 5557 -- python docs\tests\e2e\docs_app.py
```

Expected: the Dialog, MegaMenu, SearchBar, source expansion, reset, responsive layout, and theme isolation checks pass; both screenshots contain rendered component content.

- [ ] **Step 8: Check the final diff and commit**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors and only intended migration files are modified or deleted.

Commit:

```powershell
git add docs package.json pnpm-lock.yaml
git commit -m "feat(docs): complete standalone component documentation app"
```

- [ ] **Step 9: Leave a usable preview running**

Run from `D:\ga-ui`:

```powershell
pnpm docs:dev
```

Expected: the standalone application is available at `http://localhost:5557/` from the main workspace, not from a temporary worktree.

---

## Final Verification Checklist

- [ ] `docs/package.json` no longer depends on VitePress.
- [ ] `docs/.vitepress` and `docs/site` are removed after successful migration.
- [ ] All seven public components appear in navigation, routes, home index, and search.
- [ ] All fourteen demos run from `docs/src/demos` and expose their exact source through `?raw`.
- [ ] Demo reset remounts the component and restores initial local state.
- [ ] Document dark mode uses only `ga-docs-dark` and does not apply Element Plus dark variables to demos.
- [ ] API generation is deterministic and manual overrides fail on stale names.
- [ ] Every public API entry shown in the site has a Chinese description.
- [ ] `pnpm docs:test` passes.
- [ ] `pnpm docs:build` passes.
- [ ] `pnpm --filter ga-ui-plus test` passes.
- [ ] Playwright desktop screenshots show no blank previews, overlap, or page-level horizontal overflow.
- [ ] Preview is running at `http://localhost:5557/`.
