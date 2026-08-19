# Pagination Disabled Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an explicit disabled state to `GaPagination` and make `GaTablePagination.loading` disable pagination interaction.

**Architecture:** `GaPagination` owns the public `disabled` prop and binds it directly to Element Plus. `GaTablePagination` excludes that prop from its composite API and maps its existing `loading` state to both the table loading overlay and pagination disabled state.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Element Plus, Vitest, Vue Test Utils, pnpm.

---

## File Map

- `packages/ui/src/base/components/pagination/src/props.ts`: declare the public pagination prop.
- `packages/ui/src/base/components/pagination/src/index.vue`: apply the default and bind it to `ElPagination`.
- `packages/ui/src/base/components/pagination/src/__tests__/pagination.spec.ts`: cover the declared prop, default, and attribute forwarding.
- `packages/ui/src/business/components/tablePagination/src/props.ts`: keep pagination disabled out of the composite API.
- `packages/ui/src/business/components/tablePagination/src/index.vue`: derive pagination disabled from `loading`.
- `packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts`: cover loading-to-disabled behavior and runtime props.
- `packages/ui/README.md`: document both public behaviors.

### Task 1: Add `GaPagination.disabled`

**Files:**
- Modify: `packages/ui/src/base/components/pagination/src/__tests__/pagination.spec.ts`
- Modify: `packages/ui/src/base/components/pagination/src/props.ts`
- Modify: `packages/ui/src/base/components/pagination/src/index.vue`

- [ ] **Step 1: Write the failing pagination tests**

Declare `disabled` on `ElPaginationStub` with an undefined default so the test can distinguish an omitted binding from an explicit false value:

```ts
disabled: {
  type: Boolean,
  default: undefined,
},
```

Replace the existing disabled attribute-forwarding test with explicit API coverage:

```ts
it('declares disabled with a false default and passes it to ElPagination', () => {
  const wrapper = mountPagination()
  const runtimeProps = (
    GaPagination as unknown as { props?: Record<string, unknown> }
  ).props ?? {}

  expect(runtimeProps).toHaveProperty('disabled')
  expect(wrapper.findComponent(ElPaginationStub).props('disabled')).toBe(false)
})

it('passes disabled and keeps forwarding hide-on-single-page', () => {
  const wrapper = mountPagination({
    props: {
      disabled: true,
    },
    attrs: {
      'hide-on-single-page': true,
    },
  })

  const pagination = wrapper.findComponent(ElPaginationStub)

  expect(pagination.props('disabled')).toBe(true)
  expect(pagination.attributes('hide-on-single-page')).toBe('true')
})
```

- [ ] **Step 2: Run the test to verify RED**

Run from `packages/ui`:

```powershell
pnpm.cmd exec vitest run src/base/components/pagination/src/__tests__/pagination.spec.ts
```

Expected: FAIL because `GaPagination` has no declared `disabled` prop and does not bind an explicit false default.

- [ ] **Step 3: Implement the minimal pagination prop**

Add the prop to `GaPaginationProps`:

```ts
disabled?: boolean
```

Add its default in `index.vue`:

```ts
disabled: false,
```

Bind it to `ElPagination`:

```vue
:disabled="props.disabled"
```

- [ ] **Step 4: Run the pagination test to verify GREEN**

```powershell
pnpm.cmd exec vitest run src/base/components/pagination/src/__tests__/pagination.spec.ts
```

Expected: PASS with all pagination tests green.

- [ ] **Step 5: Commit the pagination API change**

```powershell
git add -- packages/ui/src/base/components/pagination/src/props.ts packages/ui/src/base/components/pagination/src/index.vue packages/ui/src/base/components/pagination/src/__tests__/pagination.spec.ts
git commit -m "feat: add pagination disabled prop"
```

### Task 2: Drive composite pagination disabled state from loading

**Files:**
- Modify: `packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts`
- Modify: `packages/ui/src/business/components/tablePagination/src/props.ts`
- Modify: `packages/ui/src/business/components/tablePagination/src/index.vue`

- [ ] **Step 1: Write the failing composite tests**

Declare `disabled` on `GaPaginationStub`:

```ts
disabled: {
  type: Boolean,
  default: undefined,
},
```

In the existing flat-props test, assert that `loading: true` reaches both children:

```ts
expect(pagination.props('disabled')).toBe(true)
```

In the defaults test, assert that omitted loading keeps pagination enabled:

```ts
expect(wrapper.findComponent(GaPaginationStub).props('disabled')).toBe(false)
```

In the runtime props test, assert that the composite does not expose an independent state:

```ts
expect(runtimeProps).not.toHaveProperty('disabled')
```

- [ ] **Step 2: Run the test to verify RED**

```powershell
pnpm.cmd exec vitest run src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
```

Expected: FAIL because pagination does not receive `loading`, and after Task 1 the composite type would otherwise inherit `disabled`.

- [ ] **Step 3: Implement the loading mapping**

Exclude the standalone pagination prop from `GaTablePaginationProps`:

```ts
& Omit<GaPaginationProps, 'theme' | 'disabled'>
```

Bind the existing loading value to pagination:

```vue
:disabled="props.loading"
```

- [ ] **Step 4: Run the composite test to verify GREEN**

```powershell
pnpm.cmd exec vitest run src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
```

Expected: PASS with loading true disabling pagination and the default state remaining enabled.

- [ ] **Step 5: Commit the composite behavior**

```powershell
git add -- packages/ui/src/business/components/tablePagination/src/props.ts packages/ui/src/business/components/tablePagination/src/index.vue packages/ui/src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
git commit -m "feat: disable table pagination while loading"
```

### Task 3: Document and verify the feature

**Files:**
- Modify: `packages/ui/README.md`

- [ ] **Step 1: Update `GaPagination` documentation**

Add this row to the Props table:

```md
| `disabled` | `boolean` | `false` | 是否禁用分页交互 |
```

Update the `$attrs` note so only undeclared options are listed:

```md
未声明的属性与监听器经 `$attrs` 透传到底层 `ElPagination`，例如 `hide-on-single-page`。更多低频能力参见 [Element Plus Pagination 文档](https://element-plus.org/zh-CN/component/pagination.html)。
```

- [ ] **Step 2: Update `GaTablePagination` documentation**

Document the exact composite type:

```md
`GaTablePaginationProps<Row>` 是 `Omit<GaTableProps<Row>, 'height' | 'maxHeight' | 'theme'> & Omit<GaPaginationProps, 'theme' | 'disabled'>`，并另外提供 `tableTheme` 与 `paginationTheme`。表格和分页共享同一个 `size`，因此 `size` 同时控制两者；`loading` 同时控制表格加载状态和分页禁用状态。
```

Update the table-state description to include the behavior:

```md
| 表格状态 | `highlightCurrentRow`、`emptyText`、`loading`、`loadingText` | 与 `GaTable` 相同：`false`、`'暂无数据'`、`false`、`'加载中...'`；`loading=true` 时分页同时禁用 |
```

- [ ] **Step 3: Run targeted tests together**

```powershell
pnpm.cmd exec vitest run src/base/components/pagination/src/__tests__/pagination.spec.ts src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts
```

Expected: both test files PASS.

- [ ] **Step 4: Run package verification**

```powershell
pnpm.cmd run test
pnpm.cmd run build
pnpm.cmd run verify:exports
npm.cmd publish --dry-run
```

Expected: every command exits with code 0. If a pre-existing failure occurs, record it without changing unrelated files.

- [ ] **Step 5: Commit documentation**

```powershell
git add -- packages/ui/README.md
git commit -m "docs: document pagination disabled state"
```
