# GaTable Light Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `GaTable` demonstration markup with a tested, typed, lightweight wrapper around Element Plus `ElTable` that standardizes common defaults while forwarding low-frequency Props, Events, and native table slots.

**Architecture:** `GaTable` explicitly declares common table and loading Props, then forwards remaining attributes and event listeners to `ElTable` through `$attrs`. Consumers continue declaring columns with `ElTableColumn`; the wrapper exposes the internal Element Plus table instance as `tableRef` and adds no pagination, request, query, or permission behavior.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, SCSS, Vite 6 Library Mode, Vitest, Vue Test Utils, jsdom

---

## Current State

- `packages/ui-element/src/components/table/src/index.vue` currently renders `<h1>123</h1>`.
- `packages/ui-element/src/components/table/index.ts` already exports `GaTable`.
- `packages/ui-element/src/index.ts` already re-exports the Table directory.
- `packages/ui-element/package.json` does not yet provide build, type-check, or real test scripts.
- The workspace does not currently contain Vitest or Vue Test Utils.
- `D:\ga-ui` is not currently a Git repository. Run `git init` before the commit steps if version control is desired.

## File Map

- Modify: `package.json` — add the workspace test command and test dependencies.
- Create: `vitest.config.ts` — configure Vue component tests in jsdom.
- Modify: `packages/ui-element/package.json` — normalize package name and add build/type-check scripts.
- Create: `packages/ui-element/src/components/table/src/props.ts` — public generic Props types.
- Create: `packages/ui-element/src/components/table/types/index.ts` — exposed Element Plus table instance type.
- Create: `packages/ui-element/src/components/table/__tests__/table.spec.ts` — defaults, forwarding, slots, loading, exposed ref, and type tests.
- Modify: `packages/ui-element/src/components/table/src/index.vue` — `ElTable` wrapper implementation.
- Modify: `packages/ui-element/src/components/table/index.ts` — component and type exports.
- Create: `packages/ui-element/src/components/table/style/index.scss` — scoped Table wrapper style.
- Create: `packages/ui-element/src/style/index.scss` — aggregate package SCSS entry.
- Modify: `packages/ui-element/src/index.ts` — load aggregate styles and export Table.
- Create or modify: `playground/src/App.vue` — manual usage example.
- Create or modify: `playground/src/main.ts` — Element Plus and GA UI setup.

---

### Task 1: Add the Component Test Harness and Package Scripts

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Modify: `packages/ui-element/package.json`
- Create or modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install the test dependencies from the workspace root**

Run from `D:\ga-ui`:

```powershell
pnpm.cmd add -Dw vitest @vue/test-utils jsdom
```

Expected: root `package.json` receives `vitest`, `@vue/test-utils`, and `jsdom` in `devDependencies`; Vue and Element Plus versions remain unchanged.

- [ ] **Step 2: Replace the root test script**

In `D:\ga-ui\package.json`, replace the failing test script with:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Preserve the existing root metadata and `devDependencies`. Only replace the `scripts` object.

- [ ] **Step 3: Create the Vitest configuration**

Create `D:\ga-ui\vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: [
      'packages/ui-element/src/**/*.spec.ts',
    ],
    clearMocks: true,
  },
})
```

- [ ] **Step 4: Normalize the public package metadata**

Set `D:\ga-ui\packages\ui-element\package.json` to:

```json
{
  "name": "@ga/ui-element",
  "version": "0.1.0",
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
      "import": "./dist/index.js"
    },
    "./style.css": "./dist/style.css"
  },
  "scripts": {
    "build": "vite build",
    "typecheck": "vue-tsc --noEmit -p tsconfig.json"
  },
  "peerDependencies": {
    "vue": "^3.5.40",
    "element-plus": "^2.14.3"
  },
  "license": "ISC"
}
```

- [ ] **Step 5: Relink the workspace after changing the package name**

Run:

```powershell
pnpm.cmd install
```

Expected: pnpm recognizes `@ga/ui-element` as the package name and updates the lockfile without changing Vue or Element Plus versions.

- [ ] **Step 6: Verify Vitest starts**

Run:

```powershell
pnpm.cmd exec vitest --version
```

Expected: Vitest prints its installed version and exits successfully.

- [ ] **Step 7: Commit the test harness if Git is initialized**

Run:

```powershell
git add package.json pnpm-lock.yaml vitest.config.ts packages/ui-element/package.json
git commit -m "test: configure ui element component tests"
```

---

### Task 2: Define and Test the GaTable Public Contract

**Files:**
- Create: `packages/ui-element/src/components/table/src/props.ts`
- Create: `packages/ui-element/src/components/table/types/index.ts`
- Create: `packages/ui-element/src/components/table/__tests__/table.spec.ts`

- [ ] **Step 1: Create the public Props and instance types**

Create `D:\ga-ui\packages\ui-element\src\components\table\src\props.ts`:

```ts
import type { ComponentSize } from 'element-plus'

export type GaTableRow = object

export type GaTableRowKey<Row extends GaTableRow> =
  | string
  | ((row: Row) => string)

export interface GaTableProps<
  Row extends GaTableRow = GaTableRow,
> {
  data?: Row[]
  height?: string | number
  maxHeight?: string | number
  rowKey?: GaTableRowKey<Row>
  border?: boolean
  stripe?: boolean
  size?: ComponentSize
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  emptyText?: string
  loading?: boolean
  loadingText?: string
}
```

Create `D:\ga-ui\packages\ui-element\src\components\table\types\index.ts`:

```ts
import type { TableInstance } from 'element-plus'

export interface GaTableExpose {
  tableRef: TableInstance | undefined
}
```

- [ ] **Step 2: Write the failing component and type tests**

Create `D:\ga-ui\packages\ui-element\src\components\table\__tests__\table.spec.ts`:

```ts
import {
  defineComponent,
  h,
  nextTick,
  type PropType,
} from 'vue'
import { mount } from '@vue/test-utils'
import {
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from 'vitest'

import GaTable from '../src/index.vue'
import type { GaTableProps } from '../src/props'
import type { GaTableExpose } from '../types'

const clearSelection = vi.fn()

const ElTableStub = defineComponent({
  name: 'ElTable',
  inheritAttrs: false,
  props: {
    data: {
      type: Array as PropType<unknown[]>,
      default: () => [],
    },
    border: Boolean,
    stripe: Boolean,
    fit: Boolean,
    showHeader: Boolean,
    highlightCurrentRow: Boolean,
    emptyText: String,
  },
  emits: ['row-click'],
  setup(props, { attrs, emit, expose, slots }) {
    expose({ clearSelection })

    return () =>
      h(
        'div',
        {
          ...attrs,
          class: 'el-table-stub',
          'data-border': String(props.border),
          'data-stripe': String(props.stripe),
          'data-fit': String(props.fit),
          'data-show-header': String(props.showHeader),
          'data-highlight-current-row': String(
            props.highlightCurrentRow,
          ),
          'data-empty-text': props.emptyText,
          onClick: () => emit('row-click', { id: 1 }),
        },
        [
          slots.default?.(),
          slots.empty?.(),
          slots.append?.(),
        ],
      )
  },
})

function mountTable(options = {}) {
  return mount(GaTable, {
    ...options,
    global: {
      stubs: {
        ElTable: ElTableStub,
      },
    },
  })
}

describe('GaTable', () => {
  it('uses the approved common defaults', () => {
    const wrapper = mountTable()
    const table = wrapper.get('.el-table-stub')

    expect(table.attributes('data-border')).toBe('true')
    expect(table.attributes('data-stripe')).toBe('true')
    expect(table.attributes('data-fit')).toBe('true')
    expect(table.attributes('data-show-header')).toBe('true')
    expect(table.attributes('data-highlight-current-row')).toBe(
      'false',
    )
    expect(table.attributes('data-empty-text')).toBe('暂无数据')
  })

  it('passes data and low-frequency attributes to ElTable', () => {
    const rows = [{ id: 1, name: '张三' }]
    const wrapper = mountTable({
      props: {
        data: rows,
        tableLayout: 'auto',
      },
    })
    const table = wrapper.findComponent(ElTableStub)

    expect(table.props('data')).toEqual(rows)
    expect(wrapper.get('.el-table-stub').attributes('tablelayout'))
      .toBe('auto')
  })

  it('forwards native ElTable event listeners', async () => {
    const onRowClick = vi.fn()
    const wrapper = mountTable({
      props: { onRowClick },
    })

    await wrapper.get('.el-table-stub').trigger('click')

    expect(onRowClick).toHaveBeenCalledWith({ id: 1 })
  })

  it('forwards default, empty, and append slots', () => {
    const wrapper = mountTable({
      slots: {
        default: '<span class="column-slot">列</span>',
        empty: '<span class="empty-slot">没有数据</span>',
        append: '<span class="append-slot">表格尾部</span>',
      },
    })

    expect(wrapper.get('.column-slot').text()).toBe('列')
    expect(wrapper.get('.empty-slot').text()).toBe('没有数据')
    expect(wrapper.get('.append-slot').text()).toBe('表格尾部')
  })

  it('renders the Element Plus loading mask and text', async () => {
    const wrapper = mountTable({
      props: {
        loading: true,
        loadingText: '正在加载',
      },
    })

    await nextTick()

    expect(wrapper.find('.el-loading-mask').exists()).toBe(true)
    expect(wrapper.get('.el-loading-text').text()).toBe('正在加载')
  })

  it('exposes the underlying Element Plus table instance', () => {
    const wrapper = mountTable()
    const exposed = wrapper.vm as unknown as GaTableExpose

    expect(exposed.tableRef).toBeDefined()

    exposed.tableRef?.clearSelection()

    expect(clearSelection).toHaveBeenCalledTimes(1)
  })
})

interface UserRow {
  id: number
  name: string
}

type UserRowKey = Exclude<
  NonNullable<GaTableProps<UserRow>['rowKey']>,
  string
>

expectTypeOf<
  NonNullable<GaTableProps<UserRow>['data']>[number]
>().toEqualTypeOf<UserRow>()

expectTypeOf<Parameters<UserRowKey>[0]>().toEqualTypeOf<UserRow>()
```

- [ ] **Step 3: Run the tests and verify the current placeholder fails**

Run from `D:\ga-ui`:

```powershell
pnpm.cmd test -- packages/ui-element/src/components/table/__tests__/table.spec.ts
```

Expected: FAIL because the current component renders `<h1>123</h1>` and does not render `ElTable`.

- [ ] **Step 4: Commit the public contract and failing tests if Git is initialized**

Run:

```powershell
git add packages/ui-element/src/components/table/src/props.ts packages/ui-element/src/components/table/types/index.ts packages/ui-element/src/components/table/__tests__/table.spec.ts
git commit -m "test(table): define lightweight table contract"
```

---

### Task 3: Implement the Lightweight ElTable Wrapper

**Files:**
- Modify: `packages/ui-element/src/components/table/src/index.vue`
- Modify: `packages/ui-element/src/components/table/index.ts`
- Create: `packages/ui-element/src/components/table/style/index.scss`
- Create: `packages/ui-element/src/style/index.scss`
- Modify: `packages/ui-element/src/index.ts`

- [ ] **Step 1: Replace the temporary component with the wrapper implementation**

Set `D:\ga-ui\packages\ui-element\src\components\table\src\index.vue` to:

```vue
<script
  setup
  lang="ts"
  generic="Row extends GaTableRow = GaTableRow"
>
import { ref } from 'vue'
import {
  ElTable,
  vLoading,
  type TableInstance,
} from 'element-plus'

import type {
  GaTableProps,
  GaTableRow,
} from './props'

defineOptions({
  name: 'GaTable',
  inheritAttrs: false,
})

const {
  data = [],
  height,
  maxHeight,
  rowKey,
  border = true,
  stripe = true,
  size,
  fit = true,
  showHeader = true,
  highlightCurrentRow = false,
  emptyText = '暂无数据',
  loading = false,
  loadingText = '加载中...',
} = defineProps<GaTableProps<Row>>()

const tableRef = ref<TableInstance>()

defineExpose({
  tableRef,
})
</script>

<template>
  <ElTable
    ref="tableRef"
    v-loading="loading"
    v-bind="$attrs"
    class="ga-table"
    :data="data"
    :height="height"
    :max-height="maxHeight"
    :row-key="rowKey"
    :border="border"
    :stripe="stripe"
    :size="size"
    :fit="fit"
    :show-header="showHeader"
    :highlight-current-row="highlightCurrentRow"
    :empty-text="emptyText"
    :element-loading-text="loadingText"
  >
    <slot />

    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>

    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </ElTable>
</template>
```

The explicit Props appear after `v-bind="$attrs"`, so declared GA defaults remain authoritative while undeclared Element Plus options and listeners still pass through.

- [ ] **Step 2: Add the scoped package style**

Set `D:\ga-ui\packages\ui-element\src\components\table\style\index.scss` to:

```scss
.ga-table {
  width: 100%;
}
```

Create `D:\ga-ui\packages\ui-element\src\style\index.scss`:

```scss
@use '../components/table/style/index.scss';
```

- [ ] **Step 3: Export the component and public types**

Set `D:\ga-ui\packages\ui-element\src\components\table\index.ts` to:

```ts
import GaTable from './src/index.vue'

export { GaTable }
export type {
  GaTableProps,
  GaTableRow,
  GaTableRowKey,
} from './src/props'
export type { GaTableExpose } from './types'

export default GaTable
```

Set `D:\ga-ui\packages\ui-element\src\index.ts` to:

```ts
import './style/index.scss'

export * from './components/table'
```

- [ ] **Step 4: Run the component tests**

Run:

```powershell
pnpm.cmd test -- packages/ui-element/src/components/table/__tests__/table.spec.ts
```

Expected: all runtime and type tests in `table.spec.ts` pass.

- [ ] **Step 5: Run package type checking**

Run:

```powershell
pnpm.cmd --filter @ga/ui-element typecheck
```

Expected: `vue-tsc` exits successfully with no errors in generic Props, templates, or exports.

- [ ] **Step 6: Commit the wrapper implementation if Git is initialized**

Run:

```powershell
git add packages/ui-element/src/components/table packages/ui-element/src/style packages/ui-element/src/index.ts
git commit -m "feat(table): add lightweight element plus wrapper"
```

---

### Task 4: Build the Package and Verify Playground Consumption

**Files:**
- Generated: `packages/ui-element/dist/**`
- Create or modify: `playground/package.json`
- Create or modify: `playground/src/main.ts`
- Create or modify: `playground/src/App.vue`

- [ ] **Step 1: Build the public package**

Run from `D:\ga-ui`:

```powershell
pnpm.cmd --filter @ga/ui-element build
```

Expected files include:

```text
packages/ui-element/dist/index.js
packages/ui-element/dist/index.d.ts
packages/ui-element/dist/style.css
```

- [ ] **Step 2: Inspect the build output**

Run:

```powershell
Get-ChildItem -Recurse packages/ui-element/dist
rg -n "element-plus" packages/ui-element/dist
rg -n "ga-table" packages/ui-element/dist/style.css
```

Expected:

- Declarations and `style.css` exist.
- The JavaScript retains imports from `element-plus`, proving it remains external.
- `style.css` contains `.ga-table`.

- [ ] **Step 3: Create a Playground if it does not exist**

Run only when `D:\ga-ui\playground` is absent:

```powershell
pnpm.cmd create vite playground --template vue-ts
pnpm.cmd install
```

Expected: a Vue 3 + TypeScript Vite application under `playground`.

- [ ] **Step 4: Add the workspace package to the Playground**

Ensure `D:\ga-ui\playground\package.json` contains:

```json
{
  "name": "playground",
  "private": true,
  "dependencies": {
    "@ga/ui-element": "workspace:*",
    "element-plus": "^2.14.3",
    "vue": "^3.5.40"
  }
}
```

Preserve the create-vite scripts and development dependencies when merging these fields. Then run:

```powershell
pnpm.cmd install
```

- [ ] **Step 5: Configure Playground package consumption**

Set `D:\ga-ui\playground\src\main.ts` to:

```ts
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@ga/ui-element/style.css'

import App from './App.vue'

createApp(App)
  .use(ElementPlus)
  .mount('#app')
```

Set `D:\ga-ui\playground\src\App.vue` to:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTableColumn } from 'element-plus'

import {
  GaTable,
  type GaTableExpose,
} from '@ga/ui-element'

interface UserRow {
  id: number
  name: string
  status: string
}

const loading = ref(false)
const table = ref<GaTableExpose>()
const rows = ref<UserRow[]>([
  { id: 1, name: '张三', status: '启用' },
  { id: 2, name: '李四', status: '禁用' },
])

function clearSelection() {
  table.value?.tableRef?.clearSelection()
}
</script>

<template>
  <main class="preview-page">
    <button type="button" @click="clearSelection">
      清除选择
    </button>

    <GaTable
      ref="table"
      :data="rows"
      :loading="loading"
      row-key="id"
      table-layout="auto"
    >
      <ElTableColumn type="selection" width="48" />
      <ElTableColumn prop="name" label="姓名" />
      <ElTableColumn prop="status" label="状态" />

      <template #empty>
        暂无用户数据
      </template>
    </GaTable>
  </main>
</template>

<style scoped lang="scss">
.preview-page {
  width: min(960px, calc(100% - 48px));
  margin: 48px auto;

  button {
    margin-bottom: 16px;
  }
}
</style>
```

- [ ] **Step 6: Start the Playground**

Run:

```powershell
pnpm.cmd --filter playground dev
```

Expected: the browser shows a bordered, striped table with selection, name, and status columns. Editing `GaTable` requires rebuilding when the Playground consumes `dist`; use a Vite source alias during active component development if immediate HMR is required.

- [ ] **Step 7: Run final verification**

Run:

```powershell
pnpm.cmd test
pnpm.cmd --filter @ga/ui-element typecheck
pnpm.cmd --filter @ga/ui-element build
pnpm.cmd --filter playground build
```

Expected: tests, type checking, library build, and Playground build all pass.

- [ ] **Step 8: Commit the verified example if Git is initialized**

Run:

```powershell
git add playground packages/ui-element
git commit -m "docs(table): add playground usage example"
```

---

## Final Acceptance Checklist

- [ ] `GaTable` defaults to `border=true`, `stripe=true`, `fit=true`, and `showHeader=true`.
- [ ] `GaTable` displays `暂无数据` when no custom empty slot exists.
- [ ] Low-frequency Element Plus Props and native event listeners pass through `$attrs`.
- [ ] Consumers declare columns with `ElTableColumn`.
- [ ] Default, empty, and append slots work.
- [ ] `loading` and `loadingText` control the Element Plus loading mask.
- [ ] Consumers can access `tableRef.clearSelection()` and other Element Plus instance methods.
- [ ] Package declarations export `GaTableProps`, `GaTableRow`, `GaTableRowKey`, and `GaTableExpose`.
- [ ] `style.css` contains only scoped `.ga-table` wrapper styles.
- [ ] Vue and Element Plus remain external to the library bundle.
- [ ] Component tests, type checking, library build, and Playground build all pass.
