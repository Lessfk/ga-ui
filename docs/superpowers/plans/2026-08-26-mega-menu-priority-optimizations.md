# GaMegaMenu Priority Optimizations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GaMegaMenu state handling, theme inheritance, panel positioning, and parent-height behavior more robust while removing the redundant `panelWidth` prop.

**Architecture:** Preserve the existing data-driven menu and v-model APIs. Resolve semantic theme fallbacks in computed state, render the panel through Teleport with fixed viewport geometry, and distinguish controlled props from update listeners by vnode prop presence only.

**Tech Stack:** Vue 3, TypeScript, Element Plus, SCSS, Vue Test Utils, Vitest, Vite

---

### Task 1: Add regression coverage

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [x] Add a listener-only test proving internal active and open state still changes.
- [x] Add partial-theme tests proving semantic colors inherit and explicit overrides win.
- [x] Add panel tests proving Teleport targets body and fixed top/width styles are exposed.
- [x] Add API and stylesheet assertions proving `panelWidth` and fixed `64px` root/menu heights are removed.
- [x] Run the focused test and verify the new assertions fail for the expected reasons.

### Task 2: Fix controlled state and theme resolution

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`

- [x] Remove `onUpdate:*` listeners from `isControlled` detection.
- [x] Resolve base theme values before applying dependent color fallbacks.
- [x] Resolve panel, group-title, and description colors from specific overrides or semantic base colors.
- [x] Run the focused test and verify the state and theme tests pass.

### Task 3: Teleport and position the viewport panel

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`
- Modify: `packages/ui/src/base/components/megaMenu/types/index.ts`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [x] Wrap the panel transition in `Teleport to="body"` and add a panel element ref.
- [x] Replace horizontal offset state with the root bottom coordinate.
- [x] Include the teleported panel in hover and outside-click containment checks.
- [x] Remove `panelWidth` from props, defaults, CSS variables, and public types.
- [x] Use fixed positioning with viewport width in SCSS.
- [x] Run the focused test and verify the positioning tests pass.

### Task 4: Remove fixed component minimum heights

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [x] Remove the root and menu `min-height: 64px` declarations.
- [x] Keep the navigation button's existing minimum interactive height.
- [x] Run the focused test and verify all GaMegaMenu tests pass.

### Task 5: Final verification

**Files:**
- Modify: `playground/src/demos/MegaMenuDemo.vue` only if the removed prop is referenced.

- [x] Run `pnpm --filter ga-ui-plus run test:type`.
- [x] Run `pnpm --filter ga-ui-plus run build`.
- [x] Run `pnpm --filter playground exec vite build`.
- [x] Verify click and hover panels in the browser at multiple header heights.
- [x] Run `git diff --check` and inspect the focused diff.
