# GaPagination Color Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed, partially overridable color theme to `GaPagination`, forward it through `GaTablePagination`, and document/demo it without changing pagination behavior.

**Architecture:** Define `GaPaginationTheme` beside the pagination Props, merge it with a complete default theme, and map it to Element Plus plus `--ga-pagination-*` variables on the root pagination node. Keep visual state selectors in SCSS and pass the same object through the table-pagination composition component.

**Tech Stack:** Vue 3, TypeScript, Element Plus 2.14.3, SCSS, Vue Test Utils, Vitest, Vite.

---

## Files

- Modify `packages/ui/src/base/components/pagination/src/props.ts` for the public theme contract.
- Modify `packages/ui/src/base/components/pagination/src/index.vue` for default merging and style variables.
- Modify `packages/ui/src/base/components/pagination/style/index.scss` for themed states.
- Modify `packages/ui/src/base/components/pagination/src/__tests__/pagination.spec.ts` for TDD coverage.
- Modify pagination barrel files to export `GaPaginationTheme`.
- Modify `GaTablePagination` component/tests to forward `theme`.
- Modify `packages/ui/src/__tests__/exports.spec.ts` for type contracts.
- Modify `playground/src/demos/PaginationDemo.vue` and `packages/ui/README.md` for usage documentation.

## Task 1: Theme Prop And Variables

- [ ] Add failing tests that require default theme variables, partial overrides, reactive updates, preserved consumer `style`, and no `theme` forwarding to `ElPagination`.

```ts
expect(pagination.attributes('style')).toContain('--ga-pagination-text-color: #606266')
expect(pagination.attributes('style')).toContain('--ga-pagination-active-bg-color: #ffffff')
expect(pagination.attributes('style')).toContain('width: 75%')
expect(wrapper.findComponent(ElPaginationStub).props('theme')).toBeUndefined()
```

- [ ] Run the pagination test from `packages/ui` and confirm RED.

```powershell
.\node_modules\.bin\vitest.CMD run src/base/components/pagination/src/__tests__/pagination.spec.ts
```

- [ ] Add `GaPaginationTheme` and `theme?: GaPaginationTheme` in `src/props.ts`.

```ts
export interface GaPaginationTheme {
  textColor?: string
  buttonColor?: string
  buttonBackgroundColor?: string
  activeColor?: string
  activeBackgroundColor?: string
  hoverColor?: string
  hoverBackgroundColor?: string
  disabledColor?: string
  disabledBackgroundColor?: string
}
```

- [ ] In `index.vue`, merge the Prop with these defaults and create the style map.

```ts
const defaultTheme: Required<GaPaginationTheme> = {
  textColor: '#606266',
  buttonColor: '#2b3b5e',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#2b3b5e',
  activeBackgroundColor: '#ffffff',
  hoverColor: '#2b3b5e',
  hoverBackgroundColor: '#ffffff',
  disabledColor: '#2b3b5e',
  disabledBackgroundColor: '#ffffff',
}
```

```ts
const themeStyle = computed<CSSProperties>(() => ({
  '--ga-pagination-text-color': currentTheme.value.textColor,
  '--el-pagination-bg-color': currentTheme.value.buttonBackgroundColor,
  '--el-pagination-button-color': currentTheme.value.buttonColor,
  '--el-pagination-button-bg-color': currentTheme.value.buttonBackgroundColor,
  '--ga-pagination-active-color': currentTheme.value.activeColor,
  '--ga-pagination-active-bg-color': currentTheme.value.activeBackgroundColor,
  '--el-pagination-hover-color': currentTheme.value.hoverColor,
  '--ga-pagination-hover-bg-color': currentTheme.value.hoverBackgroundColor,
  '--el-pagination-button-disabled-color': currentTheme.value.disabledColor,
  '--el-pagination-button-disabled-bg-color': currentTheme.value.disabledBackgroundColor,
}))
```

- [ ] Merge `themeStyle` with `$attrs.style` once, bind it to `ElPagination`, and export `GaPaginationTheme` from both pagination type barrels.
- [ ] Re-run the pagination test and confirm GREEN.

## Task 2: SCSS State Mapping

- [ ] Add failing stylesheet assertions for themed text, active, hover, and disabled variables.

```ts
expect(paginationStyles).toContain('color: var(--ga-pagination-text-color)')
expect(paginationStyles).toContain('color: var(--ga-pagination-active-color)')
expect(paginationStyles).toContain('background-color: var(--ga-pagination-active-bg-color)')
expect(paginationStyles).toContain('background-color: var(--ga-pagination-hover-bg-color)')
```

- [ ] Run the pagination test and confirm the new assertions fail.
- [ ] Replace fixed state colors under `.el-pagination.ga-pagination` with the mapped variables.

```scss
.el-pagination__total,
.el-pagination__sizes,
.el-pagination__jump {
    color: var(--ga-pagination-text-color);
}

.btn-prev:hover:not(:disabled):not(.is-disabled),
.btn-next:hover:not(:disabled):not(.is-disabled),
.el-pager li:hover:not(.is-active):not(:disabled):not(.is-disabled) {
    color: var(--el-pagination-hover-color);
    background-color: var(--ga-pagination-hover-bg-color);
}

.btn-prev.is-active,
.btn-next.is-active,
.el-pager li.is-active {
    color: var(--ga-pagination-active-color);
    background-color: var(--ga-pagination-active-bg-color);
}
```

- [ ] Preserve the existing high-specificity `is-background` disabled compatibility selectors and re-run the pagination tests.

## Task 3: Composition And Type Exports

- [ ] Add a failing `GaTablePagination` test asserting that the exact `theme` object reaches its inner `GaPagination` and never reaches `GaTable`.
- [ ] Add `GaPaginationTheme` imports to the base/root contracts in `packages/ui/src/__tests__/exports.spec.ts`.
- [ ] Run targeted tests and confirm RED.

```powershell
.\node_modules\.bin\vitest.CMD run src/business/components/tablePagination/src/__tests__/table-pagination.spec.ts src/__tests__/exports.spec.ts
```

- [ ] Add `:theme="props.theme"` to the inner `GaPagination`; `GaTablePaginationProps` already inherits the type through `GaPaginationProps`.
- [ ] Re-run targeted tests and `pnpm.cmd run test:type`.

## Task 4: Demo And README

- [ ] Expand `PaginationDemo.vue` with one default example and one typed custom-theme example using `GaPaginationTheme`.
- [ ] Document the `theme` Prop, all nine fields, partial merge behavior, CSS variable compatibility, and `GaTablePagination` forwarding in README.
- [ ] Add `GaPaginationTheme` to the README public type table.
- [ ] Build the playground from the repository root.

```powershell
pnpm.cmd --filter playground build
```

## Task 5: Verification

- [ ] Run the full component-library tests from `packages/ui`.

```powershell
pnpm.cmd run test
```

- [ ] Build the package and verify exports.

```powershell
pnpm.cmd run build
pnpm.cmd run verify:exports
```

- [ ] Run `git diff --check` and inspect `git status --short`.
- [ ] Leave implementation unstaged because the shared worktree contains unrelated unstaged changes, including changes in README; report exact verification counts and untouched pre-existing changes.
