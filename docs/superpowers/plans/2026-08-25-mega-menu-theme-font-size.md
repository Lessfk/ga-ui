# GaMegaMenu Theme Font Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a configurable first-level menu font size and a complete merged default theme to GaMegaMenu.

**Architecture:** Extend `GaMegaMenuTheme`, resolve a complete `currentTheme` from internal defaults plus the optional consumer theme, and map it to CSS variables. Keep the change inside the existing component theme boundary and demonstrate it through the existing Playground themes.

**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vue Test Utils

---

### Task 1: Define Theme Behavior With Tests

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`

- [x] **Step 1: Write failing tests**

Add assertions showing that an omitted theme produces default background and font-size variables, and that a partial theme with `menuFontSize: 18` produces `--ga-mega-menu-font-size: 18px` while retaining the default background.

- [x] **Step 2: Run the focused test**

Run:

```bash
pnpm --filter ga-ui-plus exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
```

Expected: FAIL because the default variables and `menuFontSize` mapping do not exist yet.

### Task 2: Implement The Theme Merge

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/types/index.ts`
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [x] **Step 1: Extend the public theme type**

Add:

```ts
menuFontSize?: string | number
```

- [x] **Step 2: Add and merge the default theme**

Create `defaultTheme: Required<GaMegaMenuTheme>`, merge it with `props.theme`, and build CSS variables from the merged theme.

- [x] **Step 3: Apply the CSS variable**

Use:

```scss
font-size: var(--ga-mega-menu-font-size, 20px);
```

- [x] **Step 4: Run the focused test**

Run the Task 1 command. Expected: PASS.

### Task 3: Update Demo And Verify

**Files:**
- Modify: `playground/src/demos/MegaMenuDemo.vue`

- [x] **Step 1: Configure theme examples**

Set distinct `menuFontSize` values on the existing ocean, forest, and graphite themes.

- [x] **Step 2: Run complete verification**

```bash
pnpm --filter ga-ui-plus test
npm run build
pnpm exec vite build
```

Expected: component tests and builds pass; the Playground renders theme-specific first-level menu sizes.
