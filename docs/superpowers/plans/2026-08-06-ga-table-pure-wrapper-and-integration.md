# GaTable Pure Wrapper and Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove `autoHeight` and the outer table container so `GaTable` becomes a direct `ElTable` wrapper, then publicly export and demonstrate the separated `GaTable` and `GaPagination` components.

**Architecture:** `GaTable` renders `ElTable` as its single root and only forwards explicit height values; it no longer owns layout behavior. The library root exports both independent components, while Playground owns a two-row grid and passes `height="100%"` to the table explicitly.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, SCSS, Vite 6, Vitest, Vue Test Utils

---

## Current state

The previous tasks have already completed and reviewed these changes:

- `GaPagination` exists with double `v-model`, defaults, events, attributes, styles, and local exports.
- `GaTable` no longer renders or configures pagination.
- `GaTable` native `current-change(currentRow, oldCurrentRow)` passthrough has a regression test.
- The current component test baseline is 34 passing tests.

The workspace is not a Git repository, so worktree and commit steps are unavailable. Do not initialize Git.

## File map

- Modify `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`: specify direct-root behavior, explicit height forwarding, and removal of the auto-height API.
- Modify `packages/ui-element/src/components/table/src/index.vue`: make `ElTable` the root and remove all auto-height calculations and watchers.
- Modify `packages/ui-element/src/components/table/src/props.ts`: remove `autoHeight` while retaining `height` and `maxHeight`.
- Modify `packages/ui-element/src/components/table/style/index.scss`: remove the obsolete container rules.
- Create `packages/ui-element/src/__tests__/exports.spec.ts`: verify both components are available from the package source entry.
- Modify `packages/ui-element/src/index.ts`: export `GaPagination` from the package root.
- Modify `playground/src/App.vue`: compose the two independent components and own the height layout.

## Task 1: Make GaTable a direct ElTable wrapper

**Files:**
- Modify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`
- Modify: `packages/ui-element/src/components/table/src/props.ts`
- Modify: `packages/ui-element/src/components/table/style/index.scss`

- [ ] **Step 1: Add the failing root/API test**

Add this test before changing production code:

```ts
it('renders ElTable as its root without an autoHeight API', () => {
  const wrapper = mountTable()
  const table = wrapper.findComponent(ElTableStub)
  const runtimeProps = (
    GaTable as unknown as {
      props?: Record<string, unknown>
    }
  ).props ?? {}

  expect(wrapper.element).toBe(table.element)
  expect(runtimeProps).not.toHaveProperty('autoHeight')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/table.spec.ts -t "renders ElTable as its root without an autoHeight API"
```

Expected: FAIL because the current root is `.ga-table-container` and the current runtime props still contain `autoHeight`.

- [ ] **Step 3: Add the explicit-height regression test**

Add:

```ts
it('forwards explicit height and maxHeight values to ElTable', () => {
  const wrapper = mountTable({
    props: {
      height: 0,
      maxHeight: 0,
    },
  })

  expect(wrapper.findComponent(ElTableStub).props()).toMatchObject({
    height: 0,
    maxHeight: 0,
  })
})
```

This preserves the approved explicit-height API, including zero values.

- [ ] **Step 4: Replace the GaTable outer template with ElTable root**

Remove the `.ga-table-container` opening and closing nodes. The template root must be:

```vue
<ElTable
  ref="tableRef"
  v-loading="props.loading"
  v-bind="$attrs"
  class="ga-table"
  :data="props.data"
  :height="props.height"
  :max-height="props.maxHeight"
  :row-key="props.rowKey"
  :border="props.border"
  :stripe="props.stripe"
  :size="props.size"
  :fit="props.fit"
  :show-header="props.showHeader"
  :highlight-current-row="props.highlightCurrentRow"
  :empty-text="props.emptyText"
  :element-loading-text="props.loadingText"
>
```

Keep all existing column, default, append, and empty slot content inside this root and close with `</ElTable>`.

- [ ] **Step 5: Remove the auto-height script implementation**

In `table/src/index.vue`:

- Remove `computed`, `nextTick`, `useAttrs`, and `watch` from Vue imports.
- Remove the `StyleValue` import.
- Remove `autoHeight: false` from `withDefaults`.
- Delete `isAutoHeight`, `tableHeight`, `attrs`, `tableStyle`, and the complete `watch(isAutoHeight, ...)` block.
- Keep `ref`, `useSlots`, `Slots`, `tableRef`, columns, slots, loading directive, and `defineExpose`.

The Vue imports become:

```ts
import { ref, useSlots } from 'vue'
import type { Slots } from 'vue'
```

- [ ] **Step 6: Remove autoHeight from public props and styles**

Delete this line from `table/src/props.ts`:

```ts
autoHeight?: boolean
```

Delete the complete `.ga-table-container` rule from `table/style/index.scss`. Preserve `.el-table.ga-table` and all of its visual variables and header styles.

- [ ] **Step 7: Remove obsolete auto-height tests and helpers**

Delete `RealElTable` from Element Plus imports, delete `nextTick` from Vue imports, and delete `mountRealElementPlusTable`.

Delete the old tests whose behavior depends on `autoHeight`:

- `does not enable auto height by default`
- `fills the parent when autoHeight is enabled`
- `lets an explicit height override autoHeight`
- `treats height zero as an explicit height that overrides autoHeight`
- `lets an explicit maxHeight override autoHeight`
- `treats maxHeight zero as an explicit maxHeight that overrides autoHeight`
- `clears the real ElTable inline height when autoHeight is disabled at runtime`
- `restores the consumer ElTable height when autoHeight is disabled at runtime`
- `preserves a consumer 100% ElTable height when autoHeight is disabled at runtime`
- `clears the real ElTable inline height when maxHeight is set at runtime`
- `preserves an explicit real ElTable height set after autoHeight`

Keep the new root/API test, the explicit-height regression test, pagination separation tests, column/slot tests, native event passthrough tests, and `tableRef` test.

- [ ] **Step 8: Verify GREEN**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/table.spec.ts
pnpm.cmd --filter ga-ui-element test
```

Expected: the table test and complete component suite pass with zero failures.

## Task 2: Export both components and migrate Playground

**Files:**
- Create: `packages/ui-element/src/__tests__/exports.spec.ts`
- Modify: `packages/ui-element/src/index.ts`
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Add the failing root-export test**

Create:

```ts
import { describe, expect, it } from 'vitest'

describe('ui-element source entry', () => {
  it('exports the independent table and pagination components', async () => {
    const library = await import('../index')

    expect(library).toHaveProperty('GaTable')
    expect(library).toHaveProperty('GaPagination')
  })
})
```

- [ ] **Step 2: Run the export test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/__tests__/exports.spec.ts
```

Expected: FAIL because `packages/ui-element/src/index.ts` currently exports only the table component.

- [ ] **Step 3: Export pagination from the package source entry**

Set `packages/ui-element/src/index.ts` to:

```ts
export * from './components/table'
export * from './components/pagination'
```

- [ ] **Step 4: Run the export test and verify GREEN**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/__tests__/exports.spec.ts
```

Expected: the export test passes.

- [ ] **Step 5: Update Playground imports and state**

Add:

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

Keep all existing Element Plus imports, table columns, rows, slots, and `viewUser` behavior.

- [ ] **Step 6: Compose GaTable and GaPagination as siblings**

Rename the existing table section class from `table-area` to `table-layout`. Remove the `auto-height` attribute and add `height="100%"` to `GaTable`:

```vue
<GaTable
  height="100%"
  :data="rows"
  :columns="columns"
>
```

Immediately after the closing `</GaTable>`, insert:

```vue
<GaPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
/>
```

- [ ] **Step 7: Move combined height ownership to Playground**

Replace `.table-area` with:

```scss
.table-layout {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  flex: 1;
  min-height: 0;
}

.table-layout > .ga-table {
  min-height: 0;
}
```

- [ ] **Step 8: Verify Playground integration**

Run:

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc -b` and Vite build exit with code 0.

## Task 3: Full verification and browser acceptance

**Files:**
- Verify: `packages/ui-element/src/components/table/**`
- Verify: `packages/ui-element/src/components/pagination/**`
- Verify: `packages/ui-element/src/index.ts`
- Verify: `playground/src/App.vue`

- [ ] **Step 1: Run all library tests**

```powershell
pnpm.cmd --filter ga-ui-element test
```

Expected: all test files and tests pass with zero failures.

- [ ] **Step 2: Build the component library and declarations**

Run from `packages/ui-element`:

```powershell
..\..\node_modules\.bin\vite.CMD build
```

Expected: Vite and `vite-plugin-dts` finish with code 0; the built JS and declarations export both `GaTable` and `GaPagination`.

- [ ] **Step 3: Build Playground**

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc` and Vite finish with code 0. Existing dependency annotation and chunk-size warnings may remain.

- [ ] **Step 4: Verify the browser DOM and layout**

Start Playground on a fixed port and verify:

- `.ga-table-container` does not exist.
- `.ga-table` and `.ga-pagination` are sibling children of `.table-layout`.
- `.ga-table` receives an explicit `height: 100%` from Element Plus.
- `.ga-pagination` is exactly 50px high.
- The table occupies the first Grid row and its body scrolls internally in a short viewport.
- The outer page has no vertical scrolling and browser logs contain no error-level messages.

- [ ] **Step 5: Final repository-wide search**

Run:

```powershell
rg -n "autoHeight|auto-height|is-auto-height|ga-table-container|pagination\?:" packages/ui-element/src playground/src
```

Expected: no production-code matches. Test descriptions may mention removed APIs only when asserting their absence.
