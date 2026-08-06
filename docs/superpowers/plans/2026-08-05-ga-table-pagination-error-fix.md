# GaTable Pagination Error Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix GaTable pagination compilation errors and make boolean/object pagination configuration behave consistently without regressing loading support.

**Architecture:** Normalize `pagination` only after narrowing it to an object. Render the Element Plus pagination for `undefined`, `true`, or an object, hide it for `false`, and keep pagination as a controlled view that emits change events to the consumer.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, Vitest, Vue Test Utils, Vite 6.

---

The workspace is not a Git repository, so commit steps are omitted.

### Task 1: Reproduce pagination behavior with tests

**Files:**
- Modify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`

- [ ] Add an `ElPagination` stub that exposes `currentPage`, `pageSize`, `pageSizes`, `size`, `background`, `layout`, and `total`.
- [ ] Test the default pagination values: page 1, size 10, total 100, default page-size options, default size, background, and layout.
- [ ] Test `pagination=false` hides the pagination.
- [ ] Test an object configuration overrides the defaults.
- [ ] Test Element Plus `size-change` and `current-change` are re-emitted by GaTable.
- [ ] Run `pnpm.cmd --filter ga-ui-element test` and confirm the pagination tests fail before implementation.

### Task 2: Fix types and component behavior

**Files:**
- Modify: `packages/ui-element/src/components/table/types/index.ts`
- Modify: `packages/ui-element/src/components/table/src/props.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`

- [ ] Make GaPagination configuration fields optional because the component supplies defaults.
- [ ] Narrow `props.pagination` with `typeof props.pagination === 'object'` before reading configuration fields.
- [ ] Add `v-if="props.pagination !== false"` to `ElPagination`.
- [ ] Remove the unused selection handler and selection emit declaration so native selection listeners continue through `$attrs`.
- [ ] Restore `v-loading`, `element-loading-text`, `loading`, and `loadingText` support removed during pagination editing.
- [ ] Run the focused component test and confirm all assertions pass.

### Task 3: Verify the package

**Files:**
- Verify: `packages/ui-element/dist/**`
- Verify: `playground/dist/**`

- [ ] Run `pnpm.cmd --filter ga-ui-element test`.
- [ ] Run `..\..\node_modules\.bin\vite.CMD build` from `packages/ui-element`.
- [ ] Run `pnpm.cmd --filter playground build`.
- [ ] Confirm all commands exit with code 0 and declarations include the pagination types.
