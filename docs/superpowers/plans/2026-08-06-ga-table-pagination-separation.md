# GaTable and GaPagination Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every pagination responsibility from `GaTable` and provide a separately exported `GaPagination` component with two-way current-page and page-size models.

**Architecture:** `GaTable` remains a focused `ElTable` wrapper and keeps its existing table API, slots, height behavior, and exposed instance. `GaPagination` becomes a thin `ElPagination` wrapper with explicit common props, defaults, double `v-model`, native change events, attribute forwarding, and its own styles; consumers own the layout that combines both components.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, SCSS, Vite 6, Vitest, Vue Test Utils

---

## File map

- Create `packages/ui-element/src/components/pagination/src/props.ts`: public pagination property types.
- Create `packages/ui-element/src/components/pagination/src/__tests__/pagination.spec.ts`: isolated `GaPagination` behavior tests.
- Modify `packages/ui-element/src/components/pagination/src/index.vue`: render and control `ElPagination`.
- Modify `packages/ui-element/src/components/pagination/index.ts`: export component and public props.
- Modify `packages/ui-element/src/components/pagination/types/index.ts`: re-export the public props type for the component-local type entry.
- Modify `packages/ui-element/src/components/pagination/style/index.scss`: own all pagination styles.
- Modify `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`: assert that `GaTable` does not render pagination and remove pagination behavior tests.
- Modify `packages/ui-element/src/components/table/src/index.vue`: remove pagination rendering, state, imports, and events.
- Modify `packages/ui-element/src/components/table/src/props.ts`: remove the `pagination` prop and pagination type dependency.
- Modify `packages/ui-element/src/components/table/types/index.ts`: remove the old `GaPagination` configuration interface.
- Modify `packages/ui-element/src/components/table/style/index.scss`: remove pagination styles and two-row table/pagination layout.
- Modify `packages/ui-element/src/index.ts`: export the independent pagination component.
- Modify `playground/src/App.vue`: compose `GaTable` and `GaPagination` as siblings in a consumer-owned grid.

## Task 1: Specify the standalone GaPagination behavior

**Files:**
- Create: `packages/ui-element/src/components/pagination/src/__tests__/pagination.spec.ts`
- Test: `packages/ui-element/src/components/pagination/src/__tests__/pagination.spec.ts`

- [ ] **Step 1: Write the failing component tests**

Create the test file with an `ElPagination` stub that exposes received props and attributes:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaPagination from '../index.vue'

const ElPaginationStub = defineComponent({
  name: 'ElPagination',
  inheritAttrs: false,
  props: {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    pageSizes: Array,
    size: String,
    layout: String,
    background: Boolean,
  },
  emits: ['current-change', 'size-change'],
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, class: ['el-pagination-stub', attrs.class] })
  },
})

function mountPagination(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaPagination, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        ElPagination: ElPaginationStub,
        ...options.global?.stubs,
      },
    },
  })
}

describe('GaPagination', () => {
  it('passes the approved defaults to ElPagination', () => {
    const wrapper = mountPagination()

    expect(wrapper.findComponent(ElPaginationStub).props()).toMatchObject({
      currentPage: 1,
      pageSize: 10,
      total: 100,
      pageSizes: [10, 20, 30, 40, 50],
      size: 'default',
      background: true,
      layout: 'total, sizes, prev, pager, next, jumper',
    })
  })

  it('lets consumer props override the defaults', () => {
    const wrapper = mountPagination({
      props: {
        currentPage: 3,
        pageSize: 20,
        total: 86,
        pageSizes: [20, 40],
        size: 'small',
        background: false,
        layout: 'prev, pager, next',
      },
    })

    expect(wrapper.findComponent(ElPaginationStub).props()).toMatchObject({
      currentPage: 3,
      pageSize: 20,
      total: 86,
      pageSizes: [20, 40],
      size: 'small',
      background: false,
      layout: 'prev, pager, next',
    })
  })

  it('forwards additional ElPagination attributes', () => {
    const wrapper = mountPagination({
      attrs: {
        disabled: true,
        'hide-on-single-page': true,
      },
    })
    const pagination = wrapper.find('.el-pagination-stub')

    expect(pagination.attributes('disabled')).toBe('true')
    expect(pagination.attributes('hide-on-single-page')).toBe('true')
  })

  it('updates the current-page model and forwards current-change', () => {
    const wrapper = mountPagination()
    wrapper.findComponent(ElPaginationStub).vm.$emit('current-change', 4)

    expect(wrapper.emitted('update:current-page')).toEqual([[4]])
    expect(wrapper.emitted('current-change')).toEqual([[4]])
  })

  it('updates the page-size model and forwards size-change', () => {
    const wrapper = mountPagination()
    wrapper.findComponent(ElPaginationStub).vm.$emit('size-change', 20)

    expect(wrapper.emitted('update:page-size')).toEqual([[20]])
    expect(wrapper.emitted('size-change')).toEqual([[20]])
  })
})
```

- [ ] **Step 2: Run the pagination test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/pagination/src/__tests__/pagination.spec.ts
```

Expected: FAIL because the existing pagination component renders no `ElPagination`, has no props, and emits no model events.

## Task 2: Implement and export GaPagination

**Files:**
- Create: `packages/ui-element/src/components/pagination/src/props.ts`
- Modify: `packages/ui-element/src/components/pagination/src/index.vue`
- Modify: `packages/ui-element/src/components/pagination/index.ts`
- Modify: `packages/ui-element/src/components/pagination/types/index.ts`
- Modify: `packages/ui-element/src/components/pagination/style/index.scss`
- Test: `packages/ui-element/src/components/pagination/src/__tests__/pagination.spec.ts`

- [ ] **Step 1: Define the public props**

Create `src/props.ts`:

```ts
import type { ComponentSize } from 'element-plus'

export interface GaPaginationProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  size?: ComponentSize
  layout?: string
  background?: boolean
}
```

- [ ] **Step 2: Implement the minimal wrapper**

Replace `pagination/src/index.vue` with:

```vue
<template>
  <ElPagination
    class="ga-pagination"
    v-bind="$attrs"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    :page-sizes="props.pageSizes"
    :size="props.size"
    :layout="props.layout"
    :background="props.background"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus'

import type { GaPaginationProps } from './props'

defineOptions({
  name: 'GaPagination',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<GaPaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 100,
  pageSizes: () => [10, 20, 30, 40, 50],
  size: 'default',
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
})

const emit = defineEmits<{
  'update:current-page': [currentPage: number]
  'update:page-size': [pageSize: number]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()

function handleCurrentChange(currentPage: number) {
  emit('update:current-page', currentPage)
  emit('current-change', currentPage)
}

function handleSizeChange(pageSize: number) {
  emit('update:page-size', pageSize)
  emit('size-change', pageSize)
}
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
```

- [ ] **Step 3: Move the pagination styles**

Move the complete `.el-pagination.ga-pagination` rule from `table/style/index.scss` to `pagination/style/index.scss`. Preserve the current variables, background, padding, active pager, previous/next button, and disabled button rules exactly. The root rule must continue to include:

```scss
.el-pagination.ga-pagination {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 50px;
  min-height: 50px;
  justify-content: flex-end;
}
```

- [ ] **Step 4: Add component exports**

Set `pagination/index.ts` to:

```ts
import GaPagination from './src/index.vue'

export { GaPagination }
export default GaPagination

export type { GaPaginationProps } from './src/props'
```

Set `pagination/types/index.ts` to:

```ts
export type { GaPaginationProps } from '../src/props'
```

- [ ] **Step 5: Run the focused pagination test and verify GREEN**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/pagination/src/__tests__/pagination.spec.ts
```

Expected: 1 test file and 5 tests pass.

## Task 3: Remove all pagination behavior from GaTable

**Files:**
- Modify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`
- Modify: `packages/ui-element/src/components/table/src/props.ts`
- Modify: `packages/ui-element/src/components/table/types/index.ts`
- Modify: `packages/ui-element/src/components/table/style/index.scss`

- [ ] **Step 1: Add the failing separation test**

Add this test before changing production code:

```ts
it('does not render pagination', () => {
  const wrapper = mountTable()

  expect(wrapper.findComponent(ElPaginationStub).exists()).toBe(false)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/table.spec.ts -t "does not render pagination"
```

Expected: FAIL because the current `GaTable` renders `ElPagination` by default.

- [ ] **Step 3: Remove pagination from the GaTable template and script**

In `table/src/index.vue`:

- Remove `'is-without-pagination': !showPagination` from the container classes.
- Remove the `<ElPagination ... />` node.
- Remove `ElPagination` from imports.
- Remove the `pagination` default.
- Remove `showPagination` and `paginationConfig` computed values.
- Remove the pagination `defineEmits`, `handleCurrentChange`, and `handleSizeChange` code.

The root container becomes:

```vue
<div
  class="ga-table-container"
  :class="{
    'is-auto-height': isAutoHeight,
  }"
>
```

- [ ] **Step 4: Remove pagination from GaTable types**

In `table/src/props.ts`, remove `GaPagination` from the type import and remove:

```ts
pagination?: GaPagination | boolean
```

In `table/types/index.ts`, delete the old `GaPagination` interface.

- [ ] **Step 5: Simplify table-only auto-height styles**

In `table/style/index.scss`, change the auto-height block to:

```scss
.ga-table-container {
  width: 100%;

  &.is-auto-height {
    height: 100%;
    min-height: 0;
    overflow: hidden;

    > .ga-table {
      min-height: 0;
    }
  }
}
```

Delete the `is-without-pagination` rule and the complete `.el-pagination.ga-pagination` rule.

- [ ] **Step 6: Remove obsolete pagination tests and verify table GREEN**

Delete these old `GaTable` test cases:

- `shows pagination with the approved defaults`
- `lets an auto-height table fill the pagination row when pagination is false`
- `merges pagination object values with the defaults`
- `forwards pagination change events`

Keep the new `does not render pagination` regression test. Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/table.spec.ts
```

Expected: the table test file passes with all table-only behavior retained.

## Task 4: Export and demonstrate the separated components

**Files:**
- Modify: `packages/ui-element/src/index.ts`
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Export GaPagination from the library root**

Set the root exports to:

```ts
export * from './components/table'
export * from './components/pagination'
```

- [ ] **Step 2: Update Playground imports and state**

Import `ref` and `GaPagination`:

```ts
import { ref } from 'vue'
import {
  GaPagination,
  GaTable,
  type GaTableColumn,
} from 'ga-ui-element'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
```

- [ ] **Step 3: Compose the components as siblings**

Change the table section to this structure while preserving all existing `GaTable` slots:

```vue
<section class="table-layout">
  <GaTable
    auto-height
    :data="rows"
    :columns="columns"
  >
    <!-- Keep the current column-prepend, empty, append, status, and default column content. -->
  </GaTable>

  <GaPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
  />
</section>
```

- [ ] **Step 4: Move the combined height layout to the consumer**

Replace `.table-area` with:

```scss
.table-layout {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  flex: 1;
  min-height: 0;
}
```

- [ ] **Step 5: Run type and build verification for the integration**

Run:

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc -b` and Vite build both exit with code 0.

## Task 5: Full verification and manual layout check

**Files:**
- Verify: `packages/ui-element/src/components/table/**`
- Verify: `packages/ui-element/src/components/pagination/**`
- Verify: `playground/src/App.vue`

- [ ] **Step 1: Run all component-library tests**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
```

Expected: all test files and all tests pass with zero failures.

- [ ] **Step 2: Build the component library and declaration files**

Run from `packages/ui-element`:

```powershell
..\..\node_modules\.bin\vite.CMD build
```

Expected: Vite exits with code 0 and `vite-plugin-dts` generates declarations without TypeScript errors.

- [ ] **Step 3: Rebuild Playground**

Run:

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc` and Vite exit with code 0. Existing dependency annotation and chunk-size warnings may remain, but there must be no compilation error.

- [ ] **Step 4: Verify the browser layout**

Start Playground at a fixed local port and inspect the rendered page:

```powershell
pnpm.cmd --filter playground dev --host 127.0.0.1 --port 4173 --strictPort
```

Verify:

- `.table-layout` owns the two rows.
- `.ga-table-container.is-auto-height` fills the first row.
- `.ga-pagination` is a sibling of `.ga-table-container`, not its descendant.
- `.ga-pagination` is exactly 50px high.
- A short viewport causes the Element Plus table body to scroll without adding outer-page vertical scrolling.
- Browser logs contain no error-level messages.

- [ ] **Step 5: Record the repository limitation**

`D:\ga-ui` is not a Git working tree, so the commit steps normally required between tasks cannot be performed. Do not initialize a repository or create commits unless the user explicitly requests it.
