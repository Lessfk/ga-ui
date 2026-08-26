# GaMegaMenu Auto Max Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GaMegaMenu panels use content-driven height by default while retaining configured numeric and CSS maximum heights.

**Architecture:** Resolve the public `maxHeight` prop before passing it to Element Plus. Map only the sentinel value `'auto'` to `undefined`; keep every other supported value unchanged so existing callers retain the same scrolling behavior.

**Tech Stack:** Vue 3, TypeScript, Element Plus, Vue Test Utils, Vitest, Vite

---

### Task 1: Add Failing Max Height Tests

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`

- [x] **Step 1: Give the ElScrollbar stub a maxHeight prop**

```ts
const ElScrollbarStub = defineComponent({
  name: 'ElScrollbar',
  props: {
    maxHeight: [String, Number],
  },
  setup(_, { attrs, slots }) {
    return () => h('div', { ...attrs }, slots.default?.())
  },
})
```

- [x] **Step 2: Add tests for adaptive and constrained heights**

```ts
it('uses adaptive panel height by default and for explicit auto', async () => {
  const defaultWrapper = await mountMegaMenu()
  const explicitWrapper = await mountMegaMenu({
    props: { maxHeight: 'auto' },
  })

  expect(
    defaultWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
  ).toBeUndefined()
  expect(
    explicitWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
  ).toBeUndefined()
})

it('passes configured panel maximum heights to ElScrollbar', async () => {
  const numericWrapper = await mountMegaMenu({
    props: { maxHeight: 460 },
  })
  const cssWrapper = await mountMegaMenu({
    props: { maxHeight: '50vh' },
  })

  expect(
    numericWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
  ).toBe(460)
  expect(
    cssWrapper?.findComponent({ name: 'ElScrollbar' }).props('maxHeight'),
  ).toBe('50vh')
})
```

- [x] **Step 3: Run the focused test and verify RED**

Run:

```bash
pnpm --filter ga-ui-plus exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
```

Expected: the default case receives `480` and explicit `'auto'` receives
`'auto'`, so the adaptive-height test fails.

### Task 2: Resolve Auto Height In GaMegaMenu

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`

- [x] **Step 1: Change the public default**

```ts
const props = withDefaults(defineProps<GaMegaMenuProps>(), {
  maxHeight: 'auto',
})
```

- [x] **Step 2: Add the resolved scrollbar height**

```ts
const scrollbarMaxHeight = computed(() =>
  props.maxHeight === 'auto' ? undefined : props.maxHeight,
)
```

- [x] **Step 3: Bind the resolved value**

```vue
<ElScrollbar :max-height="scrollbarMaxHeight">
```

- [x] **Step 4: Run the focused test and verify GREEN**

Run the Task 1 command. Expected: all GaMegaMenu tests pass.

### Task 3: Update The Demo And Verify Builds

**Files:**
- Modify: `playground/src/demos/MegaMenuDemo.vue`

- [x] **Step 1: Remove the fixed Demo height**

Remove:

```vue
:max-height="460"
```

- [x] **Step 2: Run type and build verification**

```bash
pnpm --filter ga-ui-plus run test:type
pnpm --filter ga-ui-plus run build
pnpm --filter playground exec vite build
```

Expected: all commands exit with code 0 and the generated declaration default
for `maxHeight` remains `string | number`.

- [x] **Step 3: Verify the Playground behavior**

Open a panel with the default prop and verify the scrollbar wrapper has no
maximum-height style. Then temporarily provide a constrained height through a
test fixture or component props and verify internal scrolling remains active.

- [x] **Step 4: Check the final diff**

```bash
git diff --check
```

Expected: exit code 0 with no whitespace errors.
