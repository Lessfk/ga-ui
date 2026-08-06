# GaTable Default Empty State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `GaTable` render `ElEmpty` as its default empty state while preserving consumer `#empty` overrides and conditional `#append` forwarding.

**Architecture:** Keep the fallback inside the existing table-level `empty` slot. The consumer slot remains the outer extension point, and `ElEmpty` becomes only its fallback content; `emptyText` supplies the fallback description.

**Tech Stack:** Vue 3.5, TypeScript, Element Plus 2.14, Vitest, Vue Test Utils.

---

The workspace is not a Git repository, so commit steps are omitted.

### Task 1: Add the default ElEmpty behavior

**Files:**
- Modify: `packages/ui-element/src/components/table/src/__tests__/table.spec.ts`
- Modify: `packages/ui-element/src/components/table/src/index.vue`

- [ ] **Step 1: Write failing component tests**

Add an `ElEmpty` stub and tests that verify:

```ts
expect(wrapper.findComponent(ElEmptyStub).props('description')).toBe('暂无数据')
```

and:

```ts
const wrapper = mountTable({ props: { emptyText: '没有订单' } })
expect(wrapper.findComponent(ElEmptyStub).props('description')).toBe('没有订单')
```

Also verify a consumer `#empty` slot replaces the fallback and that `ElEmptyStub` is absent in that case.

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```powershell
packages\ui-element\node_modules\.bin\vitest.CMD run src/components/table/src/__tests__/table.spec.ts
```

from `packages/ui-element`.

Expected: the new assertions fail because `GaTable` does not render `ElEmpty` yet.

- [ ] **Step 3: Implement the slot fallback**

Import `ElEmpty`, always declare the `#empty` slot on `ElTable`, and render:

```vue
<slot name="empty">
  <ElEmpty :description="props.emptyText" />
</slot>
```

Keep `append` guarded by `v-if="slots.append"`.

- [ ] **Step 4: Run tests and builds**

Run:

```powershell
pnpm.cmd --filter ga-ui-element test
pnpm.cmd --filter playground build
```

Then run the ui-element Vite build from `packages/ui-element`:

```powershell
..\..\node_modules\.bin\vite.CMD build
```

Expected: all tests pass and both builds exit with code 0.
