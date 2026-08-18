# GaTable Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add instance-level color themes to `GaTable`, expose separate table and pagination themes from `GaTablePagination`, and remove the ambiguous composite `theme` Prop.

**Architecture:** Define `GaTableTheme` beside `GaTableProps`, merge partial themes with the existing table colors, and map the result to Element Plus plus one Ga-specific stripe variable on the root `ElTable`. Keep striped-row state handling in scoped SCSS. In `GaTablePagination`, omit both child `theme` Props from the flattened intersection and add explicit `tableTheme` and `paginationTheme` routing.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript 5.8, Element Plus 2.14, SCSS, Vitest, Vue Test Utils, pnpm, Vite.

---

## File Map

- Modify `packages/ui/src/base/components/table/src/props.ts`: public `GaTableTheme` contract and `GaTableProps.theme`.
- Modify `packages/ui/src/base/components/table/src/index.vue`: default merging, CSS Variables, `$attrs.style` merging.
- Modify `packages/ui/src/base/components/table/style/index.scss`: remove fixed theme colors and add stripe state rule.
- Modify `packages/ui/src/base/components/table/src/__tests__/table.spec.ts`: table theme behavior and stripe regression coverage.
- Modify `packages/ui/src/base/components/table/index.ts`: export `GaTableTheme` before composite code imports it.
- Modify `packages/ui/src/business/components/tablePagination/src/props.ts`: explicit `tableTheme` and `paginationTheme` API, removed `theme`.
- Modify `packages/ui/src/business/components/tablePagination/src/index.vue`: route both themes to the correct child.
- Modify `packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts`: theme routing and removed legacy Prop coverage.
- Modify `packages/ui/src/__tests__/exports.spec.ts`: base/root type exports in Task 1 and composite type contract in Task 3.
- Modify `packages/ui/README.md`: GaTable theme documentation and GaTablePagination migration notes.
- Modify `playground/src/demos/TablePaginationDemo.vue`: visible dual-theme example.

---

### Task 1: Define and apply the GaTable theme

**Files:**
- Modify: `packages/ui/src/base/components/table/src/props.ts`
- Modify: `packages/ui/src/base/components/table/src/index.vue`
- Modify: `packages/ui/src/base/components/table/index.ts`
- Test: `packages/ui/src/base/components/table/src/__tests__/table.spec.ts`
- Test: `packages/ui/src/__tests__/exports.spec.ts`

- [ ] **Step 1: Write failing tests for the default and partial theme**

Add `theme: Object` to `ElTableStub.props`, then add these tests inside `describe('GaTable', ...)`:

```ts
it('applies the complete default color theme', () => {
  const wrapper = mountTable()
  const table = wrapper.get('.el-table-stub')
  const style = table.attributes('style') ?? ''

  expect(style).toContain('--el-table-bg-color: #ffffff')
  expect(style).toContain('--el-table-tr-bg-color: #ffffff')
  expect(style).toContain('--el-table-text-color: #303133')
  expect(style).toContain('--el-table-header-bg-color: #f6f6f6')
  expect(style).toContain('--el-table-header-text-color: #2b3b5e')
  expect(style).toContain('--el-table-border-color: #e5e7eb')
  expect(style).toContain(
    '--ga-table-stripe-bg-color: var(--el-fill-color-lighter)',
  )
  expect(style).toContain('--el-table-row-hover-bg-color: #f6f6f6')
  expect(style).toContain('--el-table-current-row-bg-color: #ecf5ff')
  expect(style).toContain('--el-table-expanded-cell-bg-color: #fafafa')
})

it('merges a partial theme, reacts to updates, and preserves consumer styles', async () => {
  const wrapper = mountTable({
    props: {
      theme: {
        headerBackgroundColor: '#101828',
        headerTextColor: '#ffffff',
      },
    },
    attrs: {
      style: {
        width: '75%',
      },
    },
  })
  const table = wrapper.get('.el-table-stub')

  expect(table.attributes('style')).toContain(
    '--el-table-header-bg-color: #101828',
  )
  expect(table.attributes('style')).toContain(
    '--el-table-header-text-color: #ffffff',
  )
  expect(table.attributes('style')).toContain(
    '--el-table-text-color: #303133',
  )
  expect(table.attributes('style')).toContain('width: 75%')
  expect(wrapper.findComponent(ElTableStub).props('theme')).toBeUndefined()

  await wrapper.setProps({
    theme: {
      hoverBackgroundColor: '#d1e9ff',
    },
  })

  expect(table.attributes('style')).toContain(
    '--el-table-row-hover-bg-color: #d1e9ff',
  )
  expect(table.attributes('style')).toContain(
    '--el-table-header-bg-color: #f6f6f6',
  )
})
```

In `packages/ui/src/__tests__/exports.spec.ts`, add `GaTableTheme` to the type import from `../base`, add `RootGaTableTheme` to the type import from `../index`, and add them to `BaseTypeContract` and `RootTypeContract`. Add:

```ts
const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#ffffff',
  stripeBackgroundColor: '#f8fafc',
}

void tableTheme
```

- [ ] **Step 2: Run the table test and verify RED**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/table/src/__tests__/table.spec.ts
pnpm.cmd run test:type
```

Expected: the table test FAILS because `GaTable` does not emit theme CSS Variables, and the type test FAILS because `GaTableTheme` is not publicly exported.

- [ ] **Step 3: Add the public theme type**

In `packages/ui/src/base/components/table/src/props.ts`, add before `GaTableProps`:

```ts
export interface GaTableTheme {
  backgroundColor?: string
  rowBackgroundColor?: string
  textColor?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  borderColor?: string
  stripeBackgroundColor?: string
  hoverBackgroundColor?: string
  currentRowBackgroundColor?: string
  expandedRowBackgroundColor?: string
}
```

Add this field to `GaTableProps<Row>`:

```ts
theme?: GaTableTheme
```

Update `packages/ui/src/base/components/table/index.ts`:

```ts
export type {
  GaTableProps,
  GaTableRowKey,
  GaTableTheme,
} from './src/props'
```

- [ ] **Step 4: Implement theme merging and style forwarding**

In `packages/ui/src/base/components/table/src/index.vue`, change the root binding to:

```vue
<ElTable
  ref="tableRef"
  v-loading="props.loading"
  v-bind="tableAttrs"
  class="ga-table"
  :style="tableStyle"
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

Update imports and add the theme state below `withDefaults`:

```ts
import { computed, ref, useAttrs, useSlots } from 'vue'
import type { CSSProperties, Slots } from 'vue'

import type { GaTableProps, GaTableTheme } from './props'

const attrs = useAttrs()

const defaultTheme: Required<GaTableTheme> = {
  backgroundColor: '#ffffff',
  rowBackgroundColor: '#ffffff',
  textColor: '#303133',
  headerBackgroundColor: '#f6f6f6',
  headerTextColor: '#2b3b5e',
  borderColor: '#e5e7eb',
  stripeBackgroundColor: 'var(--el-fill-color-lighter)',
  hoverBackgroundColor: '#f6f6f6',
  currentRowBackgroundColor: '#ecf5ff',
  expandedRowBackgroundColor: '#fafafa',
}

const currentTheme = computed<Required<GaTableTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))

const themeStyle = computed<CSSProperties>(() => ({
  '--el-table-bg-color': currentTheme.value.backgroundColor,
  '--el-table-tr-bg-color': currentTheme.value.rowBackgroundColor,
  '--el-table-text-color': currentTheme.value.textColor,
  '--el-table-header-bg-color': currentTheme.value.headerBackgroundColor,
  '--el-table-header-text-color': currentTheme.value.headerTextColor,
  '--el-table-border-color': currentTheme.value.borderColor,
  '--ga-table-stripe-bg-color': currentTheme.value.stripeBackgroundColor,
  '--el-table-row-hover-bg-color': currentTheme.value.hoverBackgroundColor,
  '--el-table-current-row-bg-color':
    currentTheme.value.currentRowBackgroundColor,
  '--el-table-expanded-cell-bg-color':
    currentTheme.value.expandedRowBackgroundColor,
}))

const tableAttrs = computed(() => {
  const { style: _style, ...forwardedAttrs } = attrs
  return forwardedAttrs
})

const tableStyle = computed(() => [themeStyle.value, attrs.style])
```

Keep the existing `slots`, `tableRef`, `defineExpose`, columns, and slots behavior unchanged.

- [ ] **Step 5: Run the table test and verify GREEN**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/table/src/__tests__/table.spec.ts
pnpm.cmd run test:type
```

Expected: all table tests and the public type test PASS.

- [ ] **Step 6: Commit the table theme contract and runtime mapping**

```powershell
git add packages/ui/src/base/components/table/src/props.ts packages/ui/src/base/components/table/src/index.vue packages/ui/src/base/components/table/index.ts packages/ui/src/base/components/table/src/__tests__/table.spec.ts packages/ui/src/__tests__/exports.spec.ts
git commit -m "feat: add table color theme"
```

---

### Task 2: Move fixed colors to variables and add stripe state styling

**Files:**
- Modify: `packages/ui/src/base/components/table/style/index.scss`
- Test: `packages/ui/src/base/components/table/src/__tests__/table.spec.ts`

- [ ] **Step 1: Write a failing stripe selector test**

At the top of `table.spec.ts`, add:

```ts
import { readFileSync } from 'node:fs'

const tableStyles = readFileSync(
  'src/base/components/table/style/index.scss',
  'utf8',
)
```

Add this test:

```ts
it('uses the stripe theme without overriding hover or current rows', () => {
  expect(tableStyles).toContain('var(--ga-table-stripe-bg-color)')
  expect(tableStyles).toContain(':not(.hover-row)')
  expect(tableStyles).toContain(':not(.current-row)')
})
```

- [ ] **Step 2: Run the table test and verify RED**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/table/src/__tests__/table.spec.ts
```

Expected: FAIL because the stripe variable is not referenced by SCSS.

- [ ] **Step 3: Replace fixed theme colors and add the stripe rule**

Replace the color declarations in `packages/ui/src/base/components/table/style/index.scss` with:

```scss
.el-table.ga-table {
    --el-table-border: 1px solid var(--el-table-border-color);

    --el-table-fixed-left-column:
        inset 10px 0 10px -10px rgb(0 0 0 / 15%);

    --el-table-fixed-right-column:
        inset -10px 0 10px -10px rgb(0 0 0 / 15%);

    .el-table__header-wrapper {
        th.el-table__cell {
            .cell {
                font-size: 14px;
                font-weight: 600;
            }
        }
    }
}

.el-table.ga-table.el-table--striped {
    .el-table__body {
        tr.el-table__row--striped:not(.hover-row):not(.current-row) {
            td.el-table__cell {
                background-color: var(--ga-table-stripe-bg-color);
            }
        }
    }
}
```

Do not change the fixed-column shadows, header typography, or table layout.

- [ ] **Step 4: Run the table test and verify GREEN**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/table/src/__tests__/table.spec.ts
```

Expected: all table tests PASS.

- [ ] **Step 5: Commit stripe theming**

```powershell
git add packages/ui/src/base/components/table/style/index.scss packages/ui/src/base/components/table/src/__tests__/table.spec.ts
git commit -m "feat: theme striped table rows"
```

---

### Task 3: Split GaTablePagination theme Props

**Files:**
- Modify: `packages/ui/src/business/components/tablePagination/src/props.ts`
- Modify: `packages/ui/src/business/components/tablePagination/src/index.vue`
- Test: `packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts`
- Test: `packages/ui/src/__tests__/exports.spec.ts`

- [ ] **Step 1: Write failing theme routing tests**

Add `theme: Object` to both the `GaTableStub` and `GaPaginationStub` Props. Replace the theme setup in the routing test with:

```ts
const tableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#ffffff',
}
const paginationTheme = {
  activeColor: '#ffffff',
  activeBackgroundColor: '#409eff',
}
```

Pass both Props:

```ts
tableTheme,
paginationTheme,
```

Assert the routes:

```ts
expect(table.props('theme')).toEqual(tableTheme)
expect(pagination.props('theme')).toEqual(paginationTheme)
expect(table.vm.$attrs).not.toHaveProperty('paginationTheme')
expect(table.vm.$attrs).not.toHaveProperty('pagination-theme')
expect(pagination.vm.$attrs).not.toHaveProperty('tableTheme')
expect(pagination.vm.$attrs).not.toHaveProperty('table-theme')
```

Update the runtime Props test:

```ts
expect(runtimeProps).toHaveProperty('tableTheme')
expect(runtimeProps).toHaveProperty('paginationTheme')
expect(runtimeProps).not.toHaveProperty('theme')
```

In `packages/ui/src/__tests__/exports.spec.ts`, update the existing `tablePaginationProps` to include:

```ts
tableTheme,
paginationTheme,
```

Add a compile-time removal check:

```ts
const legacyTablePaginationThemeProps: GaTablePaginationProps = {
  // @ts-expect-error GaTablePagination no longer accepts the ambiguous theme Prop
  theme: paginationTheme,
}

void legacyTablePaginationThemeProps
```

- [ ] **Step 2: Run the composite test and verify RED**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
pnpm.cmd run test:type
```

Expected: the runtime test FAILS because the composite still declares and forwards `theme`, and the type test FAILS because `tableTheme`/`paginationTheme` are not accepted while the `@ts-expect-error` for legacy `theme` is unused.

- [ ] **Step 3: Define the explicit composite Props**

Replace `packages/ui/src/business/components/tablePagination/src/props.ts` with:

```ts
import type {
  GaPaginationProps,
  GaPaginationTheme,
  GaTableProps,
  GaTableRow,
  GaTableTheme,
} from '../../../../base/index'

export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight' | 'theme'>
  & Omit<GaPaginationProps, 'theme'>
  & {
    tableTheme?: GaTableTheme
    paginationTheme?: GaPaginationTheme
  }
```

- [ ] **Step 4: Route themes to the correct child**

In `packages/ui/src/business/components/tablePagination/src/index.vue`, add to `GaTable`:

```vue
:theme="props.tableTheme"
```

Replace the existing pagination theme binding with:

```vue
:theme="props.paginationTheme"
```

Do not add a compatibility alias or runtime warning for `theme`.

- [ ] **Step 5: Run the composite test and verify GREEN**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
pnpm.cmd run test:type
```

Expected: all composite tests and type-contract checks PASS.

- [ ] **Step 6: Commit the composite API split**

```powershell
git add packages/ui/src/business/components/tablePagination/src/props.ts packages/ui/src/business/components/tablePagination/src/index.vue packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts packages/ui/src/__tests__/exports.spec.ts
git commit -m "feat: split table pagination themes"
```

---

### Task 4: Document and demonstrate dual themes

**Files:**
- Modify: `packages/ui/README.md`
- Modify: `playground/src/demos/TablePaginationDemo.vue`

- [ ] **Step 1: Add GaTable theme documentation**

Before `### GaTable Props` in `packages/ui/README.md`, add a `### 颜色主题` section containing:

```vue
<script setup lang="ts">
import {
  GaTable,
  type GaTableTheme,
} from 'ga-ui-plus/base'

const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#ffffff',
  stripeBackgroundColor: '#f8fafc',
  hoverBackgroundColor: '#eff8ff',
  currentRowBackgroundColor: '#d1e9ff',
}
</script>

<template>
  <GaTable
    :data="rows"
    :columns="columns"
    :theme="tableTheme"
  />
</template>
```

Document all ten `GaTableTheme` fields from the design spec. Add this row to `GaTable Props`:

```markdown
| `theme` | `GaTableTheme` | 默认颜色主题 | 当前表格实例的颜色配置，支持部分覆盖 |
```

- [ ] **Step 2: Update GaTablePagination documentation**

In the `GaTablePagination` appearance/Props documentation:

- Add `tableTheme` as the internal table theme.
- Add `paginationTheme` as the internal pagination theme.
- Remove any statement that `theme` is forwarded to pagination.
- Add the migration note:

```markdown
`GaTablePagination` 不再接受含义不明确的 `theme`。原来的 `:theme="paginationTheme"` 需要改为 `:pagination-theme="paginationTheme"`。
```

- [ ] **Step 3: Add a visible Playground example**

In `playground/src/demos/TablePaginationDemo.vue`, update imports:

```ts
import {
  type GaPaginationTheme,
  type GaTableColumn,
  type GaTableTheme,
} from 'ga-ui-plus/base'
```

Define both themes:

```ts
const tableTheme: GaTableTheme = {
  backgroundColor: '#ffffff',
  rowBackgroundColor: '#ffffff',
  textColor: '#344054',
  headerBackgroundColor: '#101828',
  headerTextColor: '#f9fafb',
  borderColor: '#d0d5dd',
  stripeBackgroundColor: '#f8fafc',
  hoverBackgroundColor: '#eff8ff',
  currentRowBackgroundColor: '#d1e9ff',
  expandedRowBackgroundColor: '#f2f4f7',
}

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f8fafc',
  buttonColor: '#344054',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#ffffff',
  activeBackgroundColor: '#155eef',
  hoverColor: '#155eef',
  hoverBackgroundColor: '#d1e9ff',
}
```

Pass them to `GaTablePagination`:

```vue
:table-theme="tableTheme"
:pagination-theme="paginationTheme"
highlight-current-row
row-key="id"
```

- [ ] **Step 4: Build the Playground**

Run from `playground`:

```powershell
pnpm.cmd run build
```

Expected: `vue-tsc -b` and `vite build` PASS.

- [ ] **Step 5: Commit documentation and demo**

```powershell
git add packages/ui/README.md playground/src/demos/TablePaginationDemo.vue
git commit -m "docs: add table theme examples"
```

---

### Task 5: Run release-level verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run focused tests**

Run from `packages/ui`:

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/table/src/__tests__/table.spec.ts src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts src/__tests__/exports.spec.ts
```

Expected: all focused test files PASS.

- [ ] **Step 2: Run the complete component test suite**

```powershell
pnpm.cmd run test
```

Expected: type tests and all Vitest files PASS.

- [ ] **Step 3: Build and verify the UI package**

```powershell
pnpm.cmd run build
pnpm.cmd run verify:exports
```

Expected: Vite library build, declaration verification, package export verification, and NodeNext type verification PASS.

- [ ] **Step 4: Rebuild the Playground**

Run from `playground`:

```powershell
pnpm.cmd run build
```

Expected: Playground type-check and production build PASS.

- [ ] **Step 5: Inspect the generated CSS and working tree**

Run from the repository root:

```powershell
rg -n "ga-table-stripe-bg-color" packages/ui/dist/style.css
rg -n "el-table-header-bg-color|el-table-current-row-bg-color" packages/ui/dist
git diff --check
git status --short
```

Expected: generated CSS contains the stripe variable, generated JavaScript contains the inline Element Plus theme mappings, `git diff --check` reports no whitespace errors, and status contains only the intended implementation files.

- [ ] **Step 6: Commit any final verification-only corrections**

If verification required a source correction, stage only those corrected source/test files and commit them with:

```powershell
git commit -m "fix: finalize table theme integration"
```

If no correction was needed, do not create an empty commit.
