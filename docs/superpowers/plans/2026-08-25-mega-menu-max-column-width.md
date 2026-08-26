# GaMegaMenu Max Column Width Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a configurable maximum width for second-level menu groups and vertically center panel icons beside wrapped descriptions.

**Architecture:** Keep width configuration as component props and expose normalized values through root CSS variables. Change only the panel group layout and icon alignment styles; preserve data, slots, events, and panel behavior.

**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vue Test Utils, Element Plus

---

### Task 1: Add Failing Regression Tests

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`

- [x] **Step 1: Add tests for the new width variable and icon alignment**

```ts
it('exposes default and normalized panel column widths', async () => {
  const defaultWrapper = await mountMegaMenu()
  const defaultStyle =
    defaultWrapper?.get('.ga-mega-menu').attributes('style') ?? ''

  expect(defaultStyle).toContain('--ga-mega-menu-min-column-width: 240px')
  expect(defaultStyle).toContain('--ga-mega-menu-max-column-width: 420px')

  const normalizedWrapper = await mountMegaMenu({
    props: {
      minColumnWidth: 360,
      maxColumnWidth: 320,
    },
  })
  const normalizedStyle =
    normalizedWrapper?.get('.ga-mega-menu').attributes('style') ?? ''

  expect(normalizedStyle).toContain('--ga-mega-menu-min-column-width: 360px')
  expect(normalizedStyle).toContain('--ga-mega-menu-max-column-width: 360px')
})

it('centers a panel icon beside description content', async () => {
  const wrapper = await mountMegaMenu({ props: { openKey: 'system' } })
  if (!wrapper) return

  const icon = wrapper.get('.ga-mega-menu__item-icon').element
  expect(window.getComputedStyle(icon).alignSelf).toBe('center')
})
```

- [x] **Step 2: Run the tests and verify RED**

Run:

```bash
pnpm --filter ga-ui-plus exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
```

Expected: the maximum-width CSS variable is absent and icon `align-self` is not `center`.

### Task 2: Implement The Public API And Layout

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/types/index.ts`
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [x] **Step 1: Add the prop type and default**

Add `maxColumnWidth?: number` beside `minColumnWidth` and default it to `420`.

- [x] **Step 2: Normalize and expose both width variables**

Use the following root style calculation so the maximum cannot be smaller than the minimum:

```ts
const rootStyle = computed<CSSProperties>(() => {
  const minColumnWidth = Math.max(props.minColumnWidth, 1)
  const maxColumnWidth = Math.max(props.maxColumnWidth, minColumnWidth)

  return {
    ...themeStyle.value,
    '--ga-mega-menu-panel-width': formatSize(props.panelWidth),
    '--ga-mega-menu-min-column-width': `${minColumnWidth}px`,
    '--ga-mega-menu-max-column-width': `${maxColumnWidth}px`,
  }
})
```

- [x] **Step 3: Make panel groups wrap between the configured bounds**

```scss
&__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px;
}

&__group {
  min-width: 0;
  max-width: var(--ga-mega-menu-max-column-width, 420px);
  flex: 1 1 var(--ga-mega-menu-min-column-width, 240px);
}
```

- [x] **Step 4: Center panel item icons vertically**

Add `align-self: center` to `.ga-mega-menu__item-icon`.

- [x] **Step 5: Run the tests and verify GREEN**

Run the Task 1 command. Expected: all GaMegaMenu tests pass.

### Task 3: Demonstrate And Verify The API

**Files:**
- Modify: `playground/src/demos/MegaMenuDemo.vue`

- [x] **Step 1: Add the explicit Demo binding**

```vue
<GaMegaMenu
  :min-column-width="350"
  :max-column-width="420"
/>
```

- [x] **Step 2: Run focused tests and package type checks**

```bash
pnpm --filter ga-ui-plus exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
pnpm --filter ga-ui-plus run test:type
```

Expected: both commands pass.

- [x] **Step 3: Build the Playground**

```bash
pnpm --filter playground exec vite build
```

Expected: Vite exits with code 0.

- [x] **Step 4: Verify the running Demo**

Open the menu containing a single group and verify its group width is at most
420px. Verify the computed `align-self` of an icon beside a wrapped description
is `center`, with no horizontal overflow or overlapping content.

- [x] **Step 5: Check the final diff**

```bash
git diff --check
```

Expected: exit code 0 with no whitespace errors.
