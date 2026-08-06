# GaTable Columns Rendering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add typed `columns` rendering, dynamic cell slots, and native `ElTableColumn` coexistence to `GaTable`.

**Architecture:** Keep `GaTable` as a thin `ElTable` wrapper. Put public row/column types in `types/index.ts`, table Props in `src/props.ts`, and small column-normalization helpers in `src/column.ts`; `src/index.vue` only coordinates Element Plus components and slots. Verify behavior with Vitest and Vue Test Utils, then exercise the public API in Playground.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, Vite 6, Vitest, Vue Test Utils, happy-dom, SCSS.

---

The workspace is not a Git repository, so commit steps are intentionally omitted.

### Task 1: Add component-test infrastructure

**Files:**
- Modify: `packages/ui-element/package.json`
- Create: `packages/ui-element/vitest.config.ts`

- [ ] **Step 1: Install the test dependencies**

Run:

```powershell
pnpm.cmd --filter ga-ui-element add -D vitest@^3 @vue/test-utils@^2 happy-dom@^18
```

Expected: `packages/ui-element/package.json` contains the three development dependencies and the lockfile is updated.

- [ ] **Step 2: Add executable scripts**

Set the package scripts to:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Configure Vitest**

Create `packages/ui-element/vitest.config.ts`:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/__tests__/**/*.spec.ts'],
  },
})
```

- [ ] **Step 4: Verify the runner starts**

Run:

```powershell
packages\ui-element\node_modules\.bin\vitest.CMD run --passWithNoTests --config packages\ui-element\vitest.config.ts
```

Expected: Vitest exits successfully with no test files found.

### Task 2: Define public column types and normalization helpers

**Files:**
- Create: `packages/ui-element/src/components/table/types/index.ts`
- Create: `packages/ui-element/src/components/table/src/column.ts`
- Create: `packages/ui-element/src/components/table/src/__tests__/column.spec.ts`

- [ ] **Step 1: Write failing helper tests**

Test that the key priority is `key`, then `prop`, then a type/index fallback, and that `key` and `slot` are omitted before binding a column to Element Plus.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/column.spec.ts
```

Expected: FAIL because `column.ts` has not been implemented.

- [ ] **Step 3: Add the public types**

Define `GaTableRow`, `GaTableColumnType`, `GaTableColumn<Row>`, `GaTableCellScope<Row>`, and `GaTableExpose`. The column type includes `key`, `slot`, and the common `ElTableColumn` props selected in the approved design; callback fields use `Row` and Element Plus `TableColumnCtx<Row>`.

- [ ] **Step 4: Implement normalization helpers**

Implement:

```ts
export function getColumnKey<Row extends GaTableRow>(
  column: GaTableColumn<Row>,
  index: number,
): PropertyKey

export function getColumnProps<Row extends GaTableRow>(
  column: GaTableColumn<Row>,
): Omit<GaTableColumn<Row>, 'key' | 'slot'>
```

`getColumnProps` removes only the wrapper-specific `key` and `slot` fields.

- [ ] **Step 5: Run the focused test and verify success**

Run the same focused test. Expected: PASS.

### Task 3: Add GaTable Props and configuration-column rendering

**Files:**
- Create: `packages/ui-element/src/components/table/src/props.ts`
- Create: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`

- [ ] **Step 1: Write failing component tests**

Using Vue Test Utils stubs for `ElTable` and `ElTableColumn`, verify:

- explicit table defaults (`border`, `stripe`, `fit`, `showHeader`, `emptyText`, `loadingText`);
- configuration columns are rendered and receive their props;
- `column-prepend`, configuration columns, and default-slot columns have the approved order;
- a declared dynamic slot receives `row`, `column`, and `$index`;
- a declared but missing slot does not replace Element Plus native cell rendering;
- `empty` and `append` slots are forwarded.

- [ ] **Step 2: Run the component tests and verify failure**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test -- src/components/table/src/__tests__/table.spec.ts
```

Expected: FAIL because the current component still contains hardcoded demo data and columns.

- [ ] **Step 3: Define typed table Props**

Create `GaTableProps<Row>` for `data`, `columns`, height, row key, common booleans, size, empty state, and loading state. Use `withDefaults` in the component for array factories and approved defaults.

- [ ] **Step 4: Replace the demo component**

The component must:

- set `inheritAttrs: false`;
- pass `$attrs` to `ElTable`;
- import and use the local Element Plus loading directive;
- render `column-prepend`, the `columns` loop, then the default slot;
- bind normalized column props;
- create a scoped default template only when both `column.slot` and the matching consumer slot exist;
- forward `empty` and `append` slots conditionally;
- expose `tableRef`.

- [ ] **Step 5: Run component and helper tests**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
```

Expected: all tests pass.

### Task 4: Export the types and exercise the public API

**Files:**
- Modify: `packages/ui-element/src/components/table/index.ts`
- Modify: `packages/ui-element/src/index.ts` only if necessary
- Modify: `playground/src/App.vue`

- [ ] **Step 1: Export the public types**

The table entry exports `GaTable` plus `GaTableProps`, `GaTableColumn`, `GaTableCellScope`, and `GaTableExpose`. The package entry continues to re-export the table entry.

- [ ] **Step 2: Add a Playground example**

Use typed row data and typed `GaTableColumn` configuration. Demonstrate:

- a prepended selection column;
- ordinary name/address columns generated from `columns`;
- a status column rendered by `#status`;
- a default-slot operation column.

- [ ] **Step 3: Run package tests, package build, and Playground build**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
pnpm.cmd --filter ga-ui-element exec vite build
pnpm.cmd --filter playground build
```

Expected: tests pass, the package emits JavaScript/CSS/declarations, and Playground type-checks and builds successfully.

- [ ] **Step 4: Inspect generated declarations**

Confirm `packages/ui-element/dist/index.d.ts` exposes the public GaTable column and slot-related types without importing source-only paths.
