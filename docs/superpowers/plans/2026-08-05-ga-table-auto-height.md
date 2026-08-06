# GaTable Auto Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in `autoHeight` mode that makes GaTable fill its parent, reserves a fixed 50px pagination row, and lets the Element Plus table scroll inside the remaining space.

**Architecture:** Wrap the existing table and pagination roots in `.ga-table-container`. When `autoHeight` is enabled and neither `height` nor `maxHeight` is explicitly supplied, add an auto-height state class, use a two-row CSS Grid, and pass `height="100%"` to `ElTable`; otherwise preserve the current sizing behavior.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Element Plus 2.14.3, SCSS, Vitest, Vue Test Utils, Vite 6.

**Workspace note:** `D:\ga-ui` is not a Git repository, so commit steps cannot be executed. Keep all verified changes in the local workspace.

---

## File map

- Modify `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`: specify and verify auto-height activation, explicit-size precedence, and the no-pagination state.
- Modify `packages/ui-element/src/components/table/src/props.ts`: expose the new `autoHeight` prop.
- Modify `packages/ui-element/src/components/table/src/index.vue`: add the wrapper, computed sizing state, and effective table height.
- Modify `packages/ui-element/src/components/table/style/index.scss`: implement the Grid rows and fixed pagination height.
- Modify `playground/src/App.vue`: provide a parent with a definite height and demonstrate `<GaTable auto-height>`.

### Task 1: Add failing auto-height component tests

**Files:**
- Modify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Test: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`

- [ ] **Step 1: Add tests for the default and active states**

Add these tests inside the current `GaTable` test suite:

```ts
it('does not enable auto height by default', () => {
  const wrapper = mountTable()

  expect(wrapper.find('.ga-table-container').classes()).not.toContain(
    'is-auto-height',
  )
  expect(wrapper.findComponent(ElTableStub).props('height')).toBeUndefined()
})

it('fills the parent when autoHeight is enabled', () => {
  const wrapper = mountTable({
    props: {
      autoHeight: true,
    },
  })

  expect(wrapper.find('.ga-table-container').classes()).toContain(
    'is-auto-height',
  )
  expect(wrapper.findComponent(ElTableStub).props('height')).toBe('100%')
})
```

- [ ] **Step 2: Add tests for explicit sizing precedence**

```ts
it('lets an explicit height override autoHeight', () => {
  const wrapper = mountTable({
    props: {
      autoHeight: true,
      height: 420,
    },
  })

  expect(wrapper.find('.ga-table-container').classes()).not.toContain(
    'is-auto-height',
  )
  expect(wrapper.findComponent(ElTableStub).props('height')).toBe(420)
})

it('lets an explicit maxHeight override autoHeight', () => {
  const wrapper = mountTable({
    props: {
      autoHeight: true,
      maxHeight: 520,
    },
  })

  expect(wrapper.find('.ga-table-container').classes()).not.toContain(
    'is-auto-height',
  )
  expect(wrapper.findComponent(ElTableStub).props('height')).toBeUndefined()
  expect(wrapper.findComponent(ElTableStub).props('maxHeight')).toBe(520)
})
```

- [ ] **Step 3: Extend the hidden-pagination test with layout state**

Change the existing hidden-pagination test to mount `autoHeight: true` and verify both conditions:

```ts
it('lets an auto-height table fill the pagination row when pagination is false', () => {
  const wrapper = mountTable({
    props: {
      autoHeight: true,
      pagination: false,
    },
  })

  expect(wrapper.find('.ga-table-container').classes()).toContain(
    'is-without-pagination',
  )
  expect(wrapper.findComponent(ElPaginationStub).exists()).toBe(false)
})
```

- [ ] **Step 4: Run the focused test and verify the new assertions fail**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- table.spec.ts
```

Expected: FAIL because `.ga-table-container` does not exist, `autoHeight` is not implemented, and the table does not receive `height="100%"`.

### Task 2: Implement the auto-height API and template state

**Files:**
- Modify: `packages/ui-element/src/components/table/src/props.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`
- Test: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`

- [ ] **Step 1: Add the prop type**

Add `autoHeight` to `GaTableProps`:

```ts
export interface GaTableProps<Row extends GaTableRow = GaTableRow> {
  data?: Row[]
  columns?: GaTableColumn<Row>[]
  pagination?: GaPagination | boolean
  autoHeight?: boolean
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

- [ ] **Step 2: Add the default and computed layout state**

Add the default to `withDefaults`:

```ts
autoHeight: false,
```

Add these computed values after the props declaration:

```ts
const showPagination = computed(() => props.pagination !== false)

const isAutoHeight = computed(
  () =>
    props.autoHeight
    && props.height === undefined
    && props.maxHeight === undefined,
)

const tableHeight = computed(() =>
  props.height ?? (isAutoHeight.value ? '100%' : undefined),
)
```

The explicit `height` and `maxHeight` checks must use `=== undefined` so valid values such as `height={0}` still count as explicit sizing.

- [ ] **Step 3: Add the root container and bind the effective height**

Change the template root to this structure while keeping all current slots, props, attributes, loading behavior, and event handlers inside their existing components:

```vue
<template>
  <div
    class="ga-table-container"
    :class="{
      'is-auto-height': isAutoHeight,
      'is-without-pagination': !showPagination,
    }"
  >
    <ElTable
      ref="tableRef"
      v-loading="props.loading"
      v-bind="$attrs"
      class="ga-table"
      :data="props.data"
      :height="tableHeight"
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
      <!-- 列前置内容 -->
      <slot name="column-prepend" />

      <!-- 自定义列内容 -->
      <ElTableColumn
        v-for="(column, index) in props.columns"
        :key="getColumnKey(column, index)"
        v-bind="getColumnProps(column)"
      >
        <template
          v-if="column.slot && slots[column.slot]"
          #default="scope"
        >
          <slot
            :name="column.slot"
            v-bind="scope"
          />
        </template>
      </ElTableColumn>

      <!-- 自定义表格内容 -->
      <slot />

      <!-- 插入至表格最后一行之后的内容 -->
      <template
        v-if="slots.append"
        #append
      >
        <slot name="append" />
      </template>

      <!-- 当数据为空时自定义的内容 -->
      <template #empty>
        <slot name="empty">
          <ElEmpty :description="props.emptyText" />
        </slot>
      </template>
    </ElTable>

    <ElPagination
      v-if="showPagination"
      class="ga-pagination"
      :current-page="paginationConfig.currentPage"
      :page-size="paginationConfig.pageSize"
      :page-sizes="paginationConfig.pageSizes"
      :size="paginationConfig.size"
      :background="paginationConfig.background"
      :layout="paginationConfig.layout"
      :total="paginationConfig.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
```

Do not move `$attrs` to the wrapper. It must remain on `ElTable` so native Element Plus table props and listeners continue to pass through.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- table.spec.ts
```

Expected: all tests in `table.spec.ts` PASS.

### Task 3: Add the Grid layout and fixed pagination row

**Files:**
- Modify: `packages/ui-element/src/components/table/style/index.scss`

- [ ] **Step 1: Add the container layout styles**

Add before the existing `.el-table.ga-table` block:

```scss
.ga-table-container {
  width: 100%;

  &.is-auto-height {
    display: grid;
    grid-template-rows: minmax(0, 1fr) 50px;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    > .ga-table {
      min-height: 0;
    }
  }

  &.is-auto-height.is-without-pagination {
    grid-template-rows: minmax(0, 1fr);
  }
}
```

- [ ] **Step 2: Make the existing pagination height non-shrinkable**

In the existing `.el-pagination.ga-pagination` declaration, insert the following line immediately after `height: 50px`:

```scss
min-height: 50px;
```

- [ ] **Step 3: Run the full component test suite**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
```

Expected: all component tests PASS with zero failures.

### Task 4: Demonstrate the parent-height contract in playground

**Files:**
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Wrap the table in a definite-height flex child**

Insert `<section class="table-area">` immediately before the GaTable opening tag, add the `auto-height` attribute, and insert the section closing tag immediately after the GaTable closing tag. The affected opening and closing fragments must be:

```vue
<section class="table-area">
  <GaTable
    auto-height
    :data="rows"
    :columns="columns"
  >
```

```vue
  </GaTable>
</section>
```

- [ ] **Step 2: Give the parent chain a computable height**

Replace the current page sizing rules with:

```scss
.playground-page {
  display: flex;
  flex-direction: column;
  width: 80vw;
  height: 80vh;
  min-height: 0;
}

.table-area {
  flex: 1;
  min-height: 0;
}

h1 {
  flex: none;
  font-size: 24px;
}
```

- [ ] **Step 3: Build the component library**

Run from `packages/ui-element`:

```powershell
..\..\node_modules\.bin\vite.CMD build
```

Expected: Vite exits with code 0 and `vite-plugin-dts` generates declarations containing `autoHeight?: boolean`.

- [ ] **Step 4: Build the playground**

Run from the workspace root:

```powershell
pnpm.cmd --filter playground build
```

Expected: `vue-tsc -b` and Vite both exit with code 0. Existing third-party pure-annotation and chunk-size warnings are acceptable; TypeScript or Vue template errors are not.

### Task 5: Final regression verification

**Files:**
- Verify: `packages/ui-element/src/components/table/src/index.vue`
- Verify: `packages/ui-element/src/components/table/src/props.ts`
- Verify: `packages/ui-element/src/components/table/style/index.scss`
- Verify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Verify: `playground/src/App.vue`

- [ ] **Step 1: Run all required verification commands in sequence**

Run from `D:\ga-ui`:

```powershell
pnpm.cmd --filter ga-ui-element test
Push-Location packages/ui-element
..\..\node_modules\.bin\vite.CMD build
Pop-Location
pnpm.cmd --filter playground build
```

Expected:

- Vitest reports zero failed tests.
- The component library build exits with code 0.
- The playground type check and build exit with code 0.

- [ ] **Step 2: Check the implementation against the approved behavior**

Verify all of the following directly in the code and test output:

- `autoHeight` defaults to `false`.
- Auto height only activates without explicit `height` or `maxHeight`.
- The table receives `height="100%"` only in active auto-height mode.
- The Grid uses `minmax(0, 1fr)` plus a fixed `50px` pagination row.
- `pagination=false` removes the pagination row.
- Existing loading, slots, column rendering, pagination defaults, pagination events, and native table event passthrough tests still pass.
