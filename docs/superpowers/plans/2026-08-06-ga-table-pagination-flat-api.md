# GaTablePagination Flat API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `tableProps`/`paginationProps` object API with flat table and pagination props plus independent page v-models.

**Architecture:** `GaTablePagination` remains a CSS Grid composition of `GaTable` and `GaPagination`. The wrapper declares one flat intersection prop type, explicitly routes each supported prop to the correct child, shares `size` between both children, owns the table height, and forwards pagination changes as two standard v-model updates.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, SCSS, Vite 6, Vitest, Vue Test Utils

---

## File map

- Modify `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`: replace object-API tests with flat routing and independent v-model tests.
- Modify `packages/ui-element/src/components/tablePagination/src/props.ts`: define the flat public prop type.
- Modify `packages/ui-element/src/components/tablePagination/src/index.vue`: explicitly route flat props and emit independent pagination updates.
- Modify `packages/ui-element/src/components/tablePagination/index.ts`: remove obsolete grouped type exports.
- Modify `packages/ui-element/src/components/tablePagination/types/index.ts`: remove obsolete grouped type exports.
- Modify `packages/ui-element/src/__tests__/exports.spec.ts`: update the public type contract.
- Modify `playground/src/App.vue`: demonstrate the flat API.
- Rebuild `packages/ui-element/dist`: publish the new runtime, CSS, and declarations.

The current checkout contains existing working-tree changes. Preserve unrelated changes, especially `packages/ui-element/src/components/pagination/style/index.scss`. Do not create implementation commits unless the user explicitly requests them.

## Task 1: Specify the flat public behavior

**Files:**
- Modify: `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`

- [ ] **Step 1: Replace the child stubs with complete routing stubs**

Replace the existing `GaTableStub` and `GaPaginationStub` declarations with:

```ts
const GaTableStub = defineComponent({
  name: 'GaTable',
  inheritAttrs: false,
  props: {
    data: Array,
    columns: Array,
    height: [String, Number],
    rowKey: [String, Function],
    border: Boolean,
    stripe: Boolean,
    size: String,
    fit: Boolean,
    showHeader: Boolean,
    highlightCurrentRow: Boolean,
    emptyText: String,
    loading: Boolean,
    loadingText: String,
  },
  setup(_, { attrs, slots }) {
    return () => h(
      'div',
      {
        ...attrs,
        class: ['ga-table-stub', attrs.class],
      },
      Object.entries(slots).flatMap(([name, slot]) =>
        slot?.({
          row: { status: 'enabled' },
          $index: 0,
          slotName: name,
        }) ?? [],
      ),
    )
  },
})

const GaPaginationStub = defineComponent({
  name: 'GaPagination',
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
    return () => h('div', {
      ...attrs,
      class: ['ga-pagination-stub', attrs.class],
    })
  },
})
```

- [ ] **Step 2: Replace the configuration-object test with flat routing tests**

Replace `renders and configures the table and pagination components` with:

```ts
it('routes flat table and pagination props to the correct child', () => {
  const data = [{ id: 1 }]
  const columns = [{ key: 'id', prop: 'id' }]
  const rowKey = (row: { id: number }) => String(row.id)
  const wrapper = mountComposite({
    props: {
      data,
      columns,
      rowKey,
      border: false,
      stripe: false,
      fit: false,
      showHeader: false,
      highlightCurrentRow: true,
      emptyText: 'No rows',
      loading: true,
      loadingText: 'Loading rows',
      currentPage: 2,
      pageSize: 20,
      total: 86,
      pageSizes: [10, 20, 40],
      layout: 'prev, pager, next',
      background: false,
    },
  })

  const table = wrapper.findComponent(GaTableStub)
  const pagination = wrapper.findComponent(GaPaginationStub)

  expect(wrapper.findAllComponents(GaTableStub)).toHaveLength(1)
  expect(wrapper.findAllComponents(GaPaginationStub)).toHaveLength(1)
  expect(table.props()).toMatchObject({
    data,
    columns,
    rowKey,
    border: false,
    stripe: false,
    fit: false,
    showHeader: false,
    highlightCurrentRow: true,
    emptyText: 'No rows',
    loading: true,
    loadingText: 'Loading rows',
    height: '100%',
  })
  expect(pagination.props()).toMatchObject({
    currentPage: 2,
    pageSize: 20,
    total: 86,
    pageSizes: [10, 20, 40],
    layout: 'prev, pager, next',
    background: false,
  })
  expect(table.attributes()).not.toHaveProperty('total')
  expect(table.attributes()).not.toHaveProperty('layout')
  expect(pagination.attributes()).not.toHaveProperty('data')
  expect(pagination.attributes()).not.toHaveProperty('columns')
})

it('uses one size prop for both table and pagination', () => {
  const wrapper = mountComposite({
    props: {
      size: 'small',
    },
  })

  expect(wrapper.findComponent(GaTableStub).props('size')).toBe('small')
  expect(wrapper.findComponent(GaPaginationStub).props('size')).toBe('small')
})
```

- [ ] **Step 3: Replace the table-height test with the flat runtime contract**

Replace `owns the final table height at runtime` with:

```ts
it('owns the final table height and removes the legacy object props', () => {
  const wrapper = mountComposite({
    attrs: {
      height: 320,
      maxHeight: 500,
    },
  })
  const runtimeProps = (
    GaTablePagination as unknown as {
      props?: Record<string, unknown>
    }
  ).props ?? {}

  expect(wrapper.findComponent(GaTableStub).props('height')).toBe('100%')
  expect(runtimeProps).not.toHaveProperty('height')
  expect(runtimeProps).not.toHaveProperty('maxHeight')
  expect(runtimeProps).not.toHaveProperty('tableProps')
  expect(runtimeProps).not.toHaveProperty('paginationProps')
})
```

- [ ] **Step 4: Replace the current-page object update test**

Replace `emits an immutable pagination update on current-page change` with:

```ts
it('emits the current-page v-model update and change event', () => {
  const wrapper = mountComposite({
    props: {
      currentPage: 2,
      pageSize: 20,
      total: 86,
    },
  })

  wrapper.findComponent(GaPaginationStub).vm.$emit('current-change', 3)

  expect(wrapper.emitted('update:current-page')).toEqual([[3]])
  expect(wrapper.emitted('current-change')).toEqual([[3]])
  expect(wrapper.emitted('update:pagination-props')).toBeUndefined()
})
```

- [ ] **Step 5: Replace the page-size object update test**

Replace `emits an immutable pagination update on page-size change` with:

```ts
it('emits the page-size v-model update and change event', () => {
  const wrapper = mountComposite({
    props: {
      currentPage: 2,
      pageSize: 20,
      total: 86,
    },
  })

  wrapper.findComponent(GaPaginationStub).vm.$emit('size-change', 40)

  expect(wrapper.emitted('update:page-size')).toEqual([[40]])
  expect(wrapper.emitted('size-change')).toEqual([[40]])
  expect(wrapper.emitted('update:pagination-props')).toBeUndefined()
})
```

Keep the existing root `class/style` test, slot forwarding test, imports, and `mountComposite` helper unchanged.

- [ ] **Step 6: Run the focused test and verify RED**

Run:

```powershell
.\node_modules\.bin\vitest.CMD run src/components/tablePagination/src/__tests__/table-pagination.spec.ts
```

from `packages/ui-element`.

Expected: the new flat-routing, shared-size, runtime-prop, and v-model tests fail because the component still consumes `tableProps`/`paginationProps` and emits `update:pagination-props`. The retained root-attribute and slot tests continue to pass.

## Task 2: Implement the flat props and independent v-models

**Files:**
- Modify: `packages/ui-element/src/components/tablePagination/src/props.ts`
- Modify: `packages/ui-element/src/components/tablePagination/src/index.vue`
- Test: `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`

- [ ] **Step 1: Replace the grouped public prop types**

Replace `src/props.ts` with:

```ts
import type { GaPaginationProps } from '../../pagination'
import type {
  GaTableProps,
  GaTableRow,
} from '../../table'

export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps
```

- [ ] **Step 2: Explicitly route every flat table prop**

Replace the current `GaTable` opening tag with:

```vue
<GaTable
  :data="props.data"
  :columns="props.columns"
  :row-key="props.rowKey"
  :border="props.border"
  :stripe="props.stripe"
  :size="props.size"
  :fit="props.fit"
  :show-header="props.showHeader"
  :highlight-current-row="props.highlightCurrentRow"
  :empty-text="props.emptyText"
  :loading="props.loading"
  :loading-text="props.loadingText"
  height="100%"
>
```

Keep the dynamic slot forwarding block unchanged.

- [ ] **Step 3: Explicitly route every flat pagination prop**

Replace the current `GaPagination` block with:

```vue
<GaPagination
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
```

- [ ] **Step 4: Replace the prop and event declarations**

Remove the `GaTablePaginationPaginationProps` import and replace the existing `withDefaults` plus `defineEmits` declarations with:

```ts
const props = defineProps<GaTablePaginationProps<Row>>()

const emit = defineEmits<{
  'update:current-page': [currentPage: number]
  'update:page-size': [pageSize: number]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()
```

- [ ] **Step 5: Replace the pagination handlers**

Replace both handlers with:

```ts
function handleCurrentChange(currentPage: number) {
  emit('update:current-page', currentPage)
  emit('current-change', currentPage)
}

function handleSizeChange(pageSize: number) {
  emit('update:page-size', pageSize)
  emit('size-change', pageSize)
}
```

- [ ] **Step 6: Run the focused test and verify GREEN**

Run the focused Vitest command from Task 1.

Expected: every `GaTablePagination` component test passes with no Vue warnings.

- [ ] **Step 7: Run declaration generation with TypeScript-error detection**

From `packages/ui-element`, run:

```powershell
$buildOutput = (& ..\..\node_modules\.bin\vite.CMD build 2>&1 | Out-String)
$buildOutput
if ($buildOutput -match 'error\s*TS\d+|TS7022|TS7024') { exit 1 }
exit $LASTEXITCODE
```

Expected: exit 0 with no `error TS...` output. Confirm the generated component declaration contains the flat props and the existing string-keyed slot declaration.

## Task 3: Remove obsolete type exports and migrate Playground

**Files:**
- Modify: `packages/ui-element/src/components/tablePagination/index.ts`
- Modify: `packages/ui-element/src/components/tablePagination/types/index.ts`
- Modify: `packages/ui-element/src/__tests__/exports.spec.ts`
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Remove grouped types from the component barrel**

Set the type export in `tablePagination/index.ts` to:

```ts
export type { GaTablePaginationProps } from './src/props'
```

Keep the `GaTablePagination` runtime/default exports unchanged.

- [ ] **Step 2: Remove grouped types from the type barrel**

Replace `tablePagination/types/index.ts` with:

```ts
export type { GaTablePaginationProps } from '../src/props'
```

- [ ] **Step 3: Update the root export type contract**

In `packages/ui-element/src/__tests__/exports.spec.ts`, remove:

```ts
GaTablePaginationPaginationProps,
GaTablePaginationTableProps,
```

from the import and `RootTypeContract` tuple. Keep `GaTablePaginationProps` in both places.

Add this compile-time example below `rootTypeContract`:

```ts
const flatTablePaginationProps: GaTablePaginationProps<{ id: number }> = {
  data: [{ id: 1 }],
  columns: [{ prop: 'id' }],
  currentPage: 1,
  pageSize: 10,
  total: 1,
  size: 'default',
}

void flatTablePaginationProps
```

- [ ] **Step 4: Migrate Playground state**

Replace:

```ts
const paginationProps = ref({
  currentPage: 1,
  pageSize: 10,
  total: 100,
})
```

with:

```ts
const currentPage = ref(1)
const pageSize = ref(10)
```

Delete the `tableProps` object completely.

- [ ] **Step 5: Migrate the Playground component usage**

Replace the current opening tag with:

```vue
<GaTablePagination
  :data="rows"
  :columns="columns"
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="100"
>
```

Keep all existing slots and layout styles unchanged.

- [ ] **Step 6: Verify source export residuals**

Run:

```powershell
rg -n "GaTablePaginationTableProps|GaTablePaginationPaginationProps|tableProps|paginationProps|update:pagination-props" packages/ui-element/src/components/tablePagination packages/ui-element/src/__tests__/exports.spec.ts playground/src/App.vue
```

Expected: no matches.

- [ ] **Step 7: Run the library suite and Playground build**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
pnpm.cmd --filter playground build
```

Expected: all UI tests pass; `vue-tsc -b` and the Playground Vite build exit 0. Existing VueUse annotation and chunk-size warnings may remain.

## Task 4: Rebuild artifacts and perform browser acceptance

**Files:**
- Rebuild: `packages/ui-element/dist/**`

- [ ] **Step 1: Run fresh full verification**

From the repository root, run:

```powershell
pnpm.cmd --filter ga-ui-element test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Push-Location packages\ui-element
$libraryBuildOutput = (& ..\..\node_modules\.bin\vite.CMD build 2>&1 | Out-String)
$libraryBuildExit = $LASTEXITCODE
Pop-Location

$libraryBuildOutput
if ($libraryBuildExit -ne 0 -or $libraryBuildOutput -match 'error\s*TS\d+|TS7022|TS7024') {
  exit 1
}

pnpm.cmd --filter playground build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git diff --check
```

Expected: all commands exit 0. The Playground may retain only the known dependency annotation and chunk-size warnings.

- [ ] **Step 2: Verify source and published API residuals**

Run:

```powershell
rg -n "GaTablePaginationTableProps|GaTablePaginationPaginationProps|tableProps|paginationProps|update:pagination-props" packages/ui-element/src/components/tablePagination packages/ui-element/dist/components/tablePagination packages/ui-element/dist/index.d.ts playground/src/App.vue
```

Expected: no matches.

Run:

```powershell
rg -n "GaTablePagination|update:current-page|update:page-size|currentPage|pageSize" packages/ui-element/dist/index.js packages/ui-element/dist/index.d.ts packages/ui-element/dist/components/tablePagination
```

Expected: the runtime and declarations export `GaTablePagination`, contain both independent model updates, and expose flat page props.

- [ ] **Step 3: Verify the normal browser viewport**

Reload `http://localhost:5555/` after the source changes. Confirm:

- `.ga-table-pagination` equals `.table-area` in width and height.
- Direct children remain `.ga-table` and `.ga-pagination`.
- Computed Grid rows equal the available table height plus exactly `50px`.
- Table and pagination widths equal the composite width.
- The active page initially equals `1`.
- Browser warning/error logs are empty.

- [ ] **Step 4: Verify both independent pagination models**

Click page `2` and confirm both the active pager item and jump input show `2`. Change the page-size selector from `10/page` to `20/page` and confirm the visible selection changes to `20/page`. These two interactions prove the independent `currentPage` and `pageSize` models update through the wrapper.

Restore page `1` and `10/page` before finishing.

- [ ] **Step 5: Verify the short viewport**

Set the browser viewport to `900x320` and confirm:

- Pagination height remains exactly `50px`.
- The table occupies the remaining Grid row.
- The Element Plus table body has `scrollHeight > clientHeight` and `overflow-y: auto`.
- The document has no outer vertical scrollbar.

Reset the viewport before ending browser control.
