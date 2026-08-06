# GaTablePagination Composite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `GaTablePagination` component that fills its parent, gives the table all remaining width and height, keeps pagination at 50px, and manages table/pagination configuration objects.

**Architecture:** The component is a CSS Grid container with rows `minmax(0, 1fr) 50px`. It binds `tableProps` to `GaTable` but owns the final `height="100%"`, binds `paginationProps` to `GaPagination`, emits immutable `paginationProps` updates, and forwards every caller slot to the table.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, SCSS, Vite 6, Vitest, Vue Test Utils

---

## File map

- Create `packages/ui-element/src/components/tablePagination/src/props.ts`: public composite prop types.
- Create `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`: isolated composition, update, attribute, and slot tests.
- Modify `packages/ui-element/src/components/tablePagination/src/index.vue`: composite implementation.
- Modify `packages/ui-element/src/components/tablePagination/style/index.scss`: parent-filling Grid layout.
- Modify `packages/ui-element/src/components/tablePagination/index.ts`: component and type barrel.
- Modify `packages/ui-element/src/components/tablePagination/types/index.ts`: public type re-exports.
- Modify `packages/ui-element/src/__tests__/exports.spec.ts`: root runtime and type export contract.
- Modify `packages/ui-element/src/index.ts`: root component export.
- Modify `playground/src/App.vue`: demonstrate the composite component.

Work in the current checkout without creating commits, and preserve unrelated
working-tree changes.

## Task 1: Specify GaTablePagination behavior

**Files:**
- Create: `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`

- [ ] **Step 1: Create component stubs and mount helper**

Create a `GaTable` stub that declares common table props, receives attributes, and renders all received slots. Create a `GaPagination` stub that declares pagination props and emits `current-change` and `size-change`.

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import GaTablePagination from '../index.vue'

const GaTableStub = defineComponent({
  name: 'GaTable',
  inheritAttrs: false,
  props: {
    data: Array,
    columns: Array,
    border: Boolean,
    height: [String, Number],
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
  props: {
    currentPage: Number,
    pageSize: Number,
    total: Number,
    background: Boolean,
  },
  emits: ['current-change', 'size-change'],
  setup() {
    return () => h('div', { class: 'ga-pagination-stub' })
  },
})

function mountComposite(options: Parameters<typeof mount>[1] = {}) {
  return mount(GaTablePagination, {
    ...options,
    global: {
      ...options.global,
      stubs: {
        GaTable: GaTableStub,
        GaPagination: GaPaginationStub,
        ...options.global?.stubs,
      },
    },
  })
}
```

- [ ] **Step 2: Write the six public behavior tests**

Add these tests:

```ts
describe('GaTablePagination', () => {
  it('renders and configures the table and pagination components', () => {
    const data = [{ id: 1 }]
    const columns = [{ key: 'id', prop: 'id' }]
    const wrapper = mountComposite({
      props: {
        tableProps: {
          data,
          columns,
          border: false,
        },
        paginationProps: {
          currentPage: 2,
          pageSize: 20,
          total: 86,
          background: false,
        },
      },
    })

    expect(wrapper.findAllComponents(GaTableStub)).toHaveLength(1)
    expect(wrapper.findAllComponents(GaPaginationStub)).toHaveLength(1)
    expect(wrapper.findComponent(GaTableStub).props()).toMatchObject({
      data,
      columns,
      border: false,
      height: '100%',
    })
    expect(wrapper.findComponent(GaPaginationStub).props()).toMatchObject({
      currentPage: 2,
      pageSize: 20,
      total: 86,
      background: false,
    })
  })

  it('owns the final table height at runtime', () => {
    const runtimeTableProps = {
      data: [],
      height: 320,
    }
    const wrapper = mountComposite({
      props: {
        tableProps: runtimeTableProps,
      },
    })

    expect(wrapper.findComponent(GaTableStub).props('height')).toBe('100%')
  })

  it('merges consumer class and style onto the root container', () => {
    const wrapper = mountComposite({
      attrs: {
        class: 'consumer-table',
        style: {
          width: '75%',
        },
      },
    })
    const root = wrapper.find('.ga-table-pagination')

    expect(root.classes()).toContain('consumer-table')
    expect(root.attributes('style')).toContain('width: 75%')
  })

  it('emits an immutable pagination update on current-page change', () => {
    const originalPaginationProps = {
      currentPage: 2,
      pageSize: 20,
      total: 86,
    }
    const wrapper = mountComposite({
      props: {
        paginationProps: originalPaginationProps,
      },
    })

    wrapper.findComponent(GaPaginationStub).vm.$emit('current-change', 3)

    const update = wrapper.emitted('update:pagination-props')?.[0]?.[0]
    expect(update).toEqual({
      currentPage: 3,
      pageSize: 20,
      total: 86,
    })
    expect(update).not.toBe(originalPaginationProps)
    expect(originalPaginationProps).toEqual({
      currentPage: 2,
      pageSize: 20,
      total: 86,
    })
    expect(wrapper.emitted('current-change')).toEqual([[3]])
  })

  it('emits an immutable pagination update on page-size change', () => {
    const originalPaginationProps = {
      currentPage: 2,
      pageSize: 20,
      total: 86,
    }
    const wrapper = mountComposite({
      props: {
        paginationProps: originalPaginationProps,
      },
    })

    wrapper.findComponent(GaPaginationStub).vm.$emit('size-change', 40)

    const update = wrapper.emitted('update:pagination-props')?.[0]?.[0]
    expect(update).toEqual({
      currentPage: 2,
      pageSize: 40,
      total: 86,
    })
    expect(update).not.toBe(originalPaginationProps)
    expect(originalPaginationProps).toEqual({
      currentPage: 2,
      pageSize: 20,
      total: 86,
    })
    expect(wrapper.emitted('size-change')).toEqual([[40]])
  })

  it('forwards every table slot and its scope', () => {
    const wrapper = mountComposite({
      slots: {
        default: (scope) => h('span', { class: 'slot-default' }, scope.slotName),
        'column-prepend': (scope) => h(
          'span',
          { class: 'slot-column-prepend' },
          scope.slotName,
        ),
        empty: (scope) => h('span', { class: 'slot-empty' }, scope.slotName),
        append: (scope) => h('span', { class: 'slot-append' }, scope.slotName),
        status: (scope) => h('span', { class: 'slot-status' }, scope.row.status),
      },
    })

    expect(wrapper.find('.slot-default').text()).toBe('default')
    expect(wrapper.find('.slot-column-prepend').text()).toBe('column-prepend')
    expect(wrapper.find('.slot-empty').text()).toBe('empty')
    expect(wrapper.find('.slot-append').text()).toBe('append')
    expect(wrapper.find('.slot-status').text()).toBe('enabled')
  })
})
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/tablePagination/src/__tests__/table-pagination.spec.ts
```

Expected: the six tests fail because `tablePagination/src/index.vue` is empty. Failures must be missing components, props, events, attributes, or slot content rather than syntax/path errors.

## Task 2: Implement the composite component

**Files:**
- Create: `packages/ui-element/src/components/tablePagination/src/props.ts`
- Modify: `packages/ui-element/src/components/tablePagination/src/index.vue`
- Modify: `packages/ui-element/src/components/tablePagination/style/index.scss`
- Modify: `packages/ui-element/src/components/tablePagination/index.ts`
- Modify: `packages/ui-element/src/components/tablePagination/types/index.ts`
- Test: `packages/ui-element/src/components/tablePagination/src/__tests__/table-pagination.spec.ts`

- [ ] **Step 1: Define the public types**

Create `src/props.ts`:

```ts
import type { GaPaginationProps } from '../../pagination'
import type {
  GaTableProps,
  GaTableRow,
} from '../../table'

export type GaTablePaginationTableProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'>

export type GaTablePaginationPaginationProps = GaPaginationProps

export interface GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> {
  tableProps?: GaTablePaginationTableProps<Row>
  paginationProps?: GaTablePaginationPaginationProps
}
```

- [ ] **Step 2: Implement the template**

Replace `src/index.vue` with a generic Vue component whose root is:

```vue
<div
  v-bind="$attrs"
  class="ga-table-pagination"
>
  <GaTable
    v-bind="props.tableProps"
    height="100%"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="scope"
    >
      <slot
        :name="name"
        v-bind="scope ?? {}"
      />
    </template>
  </GaTable>

  <GaPagination
    v-bind="props.paginationProps"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</div>
```

Use:

```ts
<script setup lang="ts" generic="Row extends GaTableRow = GaTableRow">
import { GaPagination } from '../../pagination'
import { GaTable } from '../../table'
import type { GaTableRow } from '../../table'

import type {
  GaTablePaginationPaginationProps,
  GaTablePaginationProps,
} from './props'
```

Set `name: 'GaTablePagination'` and `inheritAttrs: false`.

- [ ] **Step 3: Implement immutable pagination updates**

Use defaults:

```ts
const props = withDefaults(
  defineProps<GaTablePaginationProps<Row>>(),
  {
    tableProps: () => ({}),
    paginationProps: () => ({}),
  },
)
```

Declare and implement:

```ts
const emit = defineEmits<{
  'update:pagination-props': [
    paginationProps: GaTablePaginationPaginationProps,
  ]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()

function handleCurrentChange(currentPage: number) {
  emit('update:pagination-props', {
    ...props.paginationProps,
    currentPage,
  })
  emit('current-change', currentPage)
}

function handleSizeChange(pageSize: number) {
  emit('update:pagination-props', {
    ...props.paginationProps,
    pageSize,
  })
  emit('size-change', pageSize)
}
```

- [ ] **Step 4: Implement the Grid styles**

Set `style/index.scss` to:

```scss
.ga-table-pagination {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  > .ga-table {
    width: 100%;
    min-width: 0;
    min-height: 0;
  }

  > .ga-pagination {
    width: 100%;
    height: 50px;
    min-height: 50px;
  }
}
```

Import it from `src/index.vue` using `@use '../style/index.scss';`.

- [ ] **Step 5: Add local exports**

Set `tablePagination/index.ts` to:

```ts
import GaTablePagination from './src/index.vue'

export { GaTablePagination }
export default GaTablePagination

export type {
  GaTablePaginationPaginationProps,
  GaTablePaginationProps,
  GaTablePaginationTableProps,
} from './src/props'
```

Set `types/index.ts` to:

```ts
export type {
  GaTablePaginationPaginationProps,
  GaTablePaginationProps,
  GaTablePaginationTableProps,
} from '../src/props'
```

- [ ] **Step 6: Verify GREEN**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/tablePagination/src/__tests__/table-pagination.spec.ts
pnpm.cmd --filter ga-ui-element test
```

Expected: the six composite tests and the complete library suite pass.

## Task 3: Export and demonstrate GaTablePagination

**Files:**
- Modify: `packages/ui-element/src/__tests__/exports.spec.ts`
- Modify: `packages/ui-element/src/index.ts`
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Add the failing root-export assertion**

Remove the obsolete `does not keep the legacy tablePagination source entry`
test first. It conflicts with the new public component. Remove its now-unused
`node:fs` and `node:url` imports as part of this test migration.

Import the component barrel reference:

```ts
import {
  GaTablePagination as TablePaginationBarrel,
} from '../components/tablePagination'
```

Add this assertion to the root export test:

```ts
expect(library.GaTablePagination).toBe(TablePaginationBarrel)
```

Do not export the component from the root yet.

- [ ] **Step 2: Run the export test and verify RED**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/__tests__/exports.spec.ts
```

Expected: FAIL because `GaTablePagination` is not present on the root source entry.

- [ ] **Step 3: Add the root runtime and type exports**

Append:

```ts
export * from './components/tablePagination'
```

Add type-only imports from the root entry for:

- `GaTablePaginationProps`
- `GaTablePaginationTableProps`
- `GaTablePaginationPaginationProps`

Include them in the existing compile-time public type tuple in `exports.spec.ts`.

- [ ] **Step 4: Run the export test and verify GREEN**

Run the focused export test and the complete UI library suite.

- [ ] **Step 5: Migrate Playground to the composite component**

In `playground/src/App.vue`:

- Replace `GaTable` and `GaPagination` imports with `GaTablePagination`.
- Keep `GaTableColumn` type import and existing Element Plus imports.
- Replace separate `currentPage`, `pageSize`, and `total` refs with:

```ts
const paginationProps = ref({
  currentPage: 1,
  pageSize: 10,
  total: 100,
})
```

- After `rows` and `columns` are declared, create:

```ts
const tableProps = {
  data: rows,
  columns,
}
```

- Replace the separate sibling components with:

```vue
<section class="table-area">
  <GaTablePagination
    :table-props="tableProps"
    v-model:pagination-props="paginationProps"
  >
  </GaTablePagination>
</section>
```

Move the existing `column-prepend`, `empty`, `append`, `status`, and default `ElTableColumn` markup between the `GaTablePagination` tags without changing their contents.

- Replace `.table-layout` and its child rule with:

```scss
.table-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
}
```

- [ ] **Step 6: Verify integration**

Run:

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc -b` and Vite build exit 0. Existing VueUse annotation and chunk-size warnings may remain.

## Task 4: Full build and browser acceptance

- [ ] **Step 1: Run all library tests**

```powershell
pnpm.cmd --filter ga-ui-element test
```

- [ ] **Step 2: Build library JS, CSS, and declarations**

From `packages/ui-element`:

```powershell
..\..\node_modules\.bin\vite.CMD build
```

Confirm `dist` exports `GaTablePagination`, emits its declaration files, and contains the Grid styles.

- [ ] **Step 3: Build Playground**

```powershell
pnpm.cmd --filter playground build
```

- [ ] **Step 4: Run production residual checks**

Confirm:

- The source and `dist` contain the new `tablePagination` implementation and no empty legacy declarations.
- The built root exports all three components.
- `GaTable` and `GaPagination` remain independently exportable.

- [ ] **Step 5: Verify in a real browser**

At normal and short viewport heights, verify:

- `.ga-table-pagination` width and height equal `.table-area`.
- `.ga-table` and `.ga-pagination` are direct children.
- Grid rows equal the available table height plus exactly 50px.
- Table and pagination widths equal the composite width.
- Table body scrolls internally in the short viewport.
- The page has no outer vertical scrolling.
- Clicking another page updates the Playground `paginationProps` model and active page.
- Fresh browser logs contain no warnings or errors.
