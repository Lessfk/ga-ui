# GaMegaMenu Remove panelTextColor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely remove the ineffective `panelTextColor` field and its CSS variable from GaMegaMenu without changing any remaining theme behavior.

**Architecture:** Enforce the breaking API at the type and SCSS source-test layers, then remove the field from the public type, resolved default theme, CSS variable mapping, and panel selector. Migrate examples and documentation while preserving unrelated user changes in the active playground files.

**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vue Test Utils, Vite, pnpm

---

### Task 1: Add breaking-contract regression tests

**Files:**
- Modify: `packages/ui/src/__tests__/exports.spec.ts`
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`

- [ ] **Step 1: Add a type rejection for `panelTextColor`**

Add this contract beside the existing removed-field theme assertion:

```ts
const removedPanelTextColorTheme: GaMegaMenuTheme = {
  // @ts-expect-error panelTextColor was removed because panel regions own their colors
  panelTextColor: '#ffffff',
}
```

Add the corresponding type-use statement:

```ts
void removedPanelTextColorTheme
```

- [ ] **Step 2: Add a SCSS source assertion**

Extend `styles menu and panel regions with independent CSS variables` with:

```ts
expect(megaMenuStyles).not.toContain('--ga-mega-menu-panel-text-color')
```

- [ ] **Step 3: Run tests and verify RED**

Run from `packages/ui`:

```powershell
pnpm run test:type
pnpm exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
```

Expected:

- `test:type` fails because the `@ts-expect-error` directive is unused while
  `panelTextColor` still exists;
- the focused Vitest file fails because the SCSS still contains
  `--ga-mega-menu-panel-text-color`.

### Task 2: Remove the public field and runtime styling

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/types/index.ts`
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`
- Test: `packages/ui/src/__tests__/exports.spec.ts`
- Test: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`

- [ ] **Step 1: Remove the public type field**

Delete this line from `GaMegaMenuTheme`:

```ts
panelTextColor?: string
```

- [ ] **Step 2: Remove the default and CSS variable mapping**

Delete both entries from `src/index.vue`:

```ts
panelTextColor: '#ffffff',
'--ga-mega-menu-panel-text-color': theme.panelTextColor,
```

- [ ] **Step 3: Remove the panel container color declaration**

Delete this declaration from `.ga-mega-menu__panel`:

```scss
color: var(--ga-mega-menu-panel-text-color, #ffffff);
```

Do not add a replacement base color or fallback relationship. Child regions
continue to consume their existing dedicated variables.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run from `packages/ui`:

```powershell
pnpm run test:type
pnpm exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts src/__tests__/exports.spec.ts
```

Expected: type tests pass and both Vitest files pass.

- [ ] **Step 5: Commit the API removal**

Stage only the library implementation and test files:

```powershell
git add -- packages/ui/src/__tests__/exports.spec.ts packages/ui/src/base/components/megaMenu/types/index.ts packages/ui/src/base/components/megaMenu/src/index.vue packages/ui/src/base/components/megaMenu/style/index.scss packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
git commit -m "refactor: remove mega menu panel text color"
```

### Task 3: Migrate demos and documentation

**Files:**
- Modify: `playground/src/demos/MegaMenuDemo.vue`
- Modify without staging unrelated user changes: `playground/src/demos/myMegaMenu.vue`
- Modify: `packages/ui/README.md`
- Modify: `docs/superpowers/specs/2026-09-01-mega-menu-split-theme-design.md`
- Modify: `docs/superpowers/plans/2026-09-01-mega-menu-split-theme.md`

- [ ] **Step 1: Remove demo theme fields**

Delete `panelTextColor` from the `ocean`, `forest`, and `graphite` theme
presets in `MegaMenuDemo.vue`.

In `myMegaMenu.vue`, delete only:

```ts
panelTextColor: 'red', // 面板文字颜色
```

Preserve every other user-owned change and do not stage this file in a commit.

- [ ] **Step 2: Remove README references**

Delete `panelTextColor` from the split-theme example and remove its API table
row. Keep the explanation that the remaining panel regions have independent
color ownership.

- [ ] **Step 3: Update the original split-theme documents**

Remove the field, default, mapping, SCSS declaration, and demo example from:

```text
docs/superpowers/specs/2026-09-01-mega-menu-split-theme-design.md
docs/superpowers/plans/2026-09-01-mega-menu-split-theme.md
```

- [ ] **Step 4: Verify there are no remaining references**

Run from the repository root:

```powershell
rg --line-number 'panelTextColor|panel-text-color' packages/ui playground docs
```

Expected: no matches outside the new removal design and implementation plan,
which intentionally describe the removed identifier.

- [ ] **Step 5: Build the playground**

Run:

```powershell
pnpm --filter playground exec vite build
```

Expected: the playground build passes with the user's active `App.vue` and
`myMegaMenu.vue` changes preserved.

- [ ] **Step 6: Commit tracked demo and documentation migrations**

```powershell
git add -- playground/src/demos/MegaMenuDemo.vue packages/ui/README.md docs/superpowers/specs/2026-09-01-mega-menu-split-theme-design.md docs/superpowers/plans/2026-09-01-mega-menu-split-theme.md docs/superpowers/plans/2026-09-01-mega-menu-remove-panel-text-color.md
git commit -m "docs: remove mega menu panel text color"
```

Do not stage `playground/src/App.vue` or
`playground/src/demos/myMegaMenu.vue`.

### Task 4: Run complete release verification

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run the complete UI test suite**

Run from `packages/ui`:

```powershell
pnpm run test
```

Expected: all type and Vitest tests pass.

- [ ] **Step 2: Build and verify exports**

Run from `packages/ui`:

```powershell
pnpm run build
pnpm run verify:exports
```

Expected: the multi-entry build, declarations, runtime exports, and NodeNext
type verification pass.

- [ ] **Step 3: Run the npm publish dry run**

Run from `packages/ui`:

```powershell
npm publish --dry-run
```

Expected: `prepublishOnly` passes and npm prints the tarball contents without
publishing the package.

- [ ] **Step 4: Check final workspace state**

Run:

```powershell
git diff --check
git status --short --branch
```

Expected: no whitespace errors. The only remaining uncommitted files are the
user-owned `playground/src/App.vue` and
`playground/src/demos/myMegaMenu.vue`.
