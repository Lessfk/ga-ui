# GaAsideMenu Active Ancestor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure every ancestor `ElSubMenu` is highlighted immediately when a descendant menu item is active, in both configuration and default-slot modes.

**Architecture:** Derive ancestor-active state from the current active index instead of relying on Element Plus lazy popup mounting. Configuration nodes use recursive data traversal; default-slot VNodes use an internal recursive renderer that clones submenu VNodes with a private class. Scoped SCSS maps that class to the Element Plus active color.

**Tech Stack:** Vue 3 SFC/render functions, Element Plus 2.14.3, TypeScript, Vitest, Vue Test Utils, SCSS.

---

### Task 1: Lock the ancestor-active contract with failing tests

**Files:**
- Modify: `packages/ui/src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts`
- Modify: `packages/ui/src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts`

- [ ] Add a configuration-tree test that passes an active nested item and expects each containing `ElSubMenu` to receive `ga-aside-menu__submenu--active`.
- [ ] Add a real Element Plus default-slot test with `collapse=true` and an active nested item; expect the parent submenu to have the private class before its popup is opened.
- [ ] Run the two focused specs and confirm they fail because the class is absent.

Run:

```powershell
pnpm.cmd --dir packages/ui exec vitest run src/business/components/asideMenu/src/__tests__/menu-tree.spec.ts src/business/components/asideMenu/src/__tests__/aside-menu.spec.ts
```

Expected: the new ancestor-active assertions fail.

### Task 2: Implement recursive active ancestry

**Files:**
- Create: `packages/ui/src/business/components/asideMenu/src/menu-slot-tree.ts`
- Modify: `packages/ui/src/business/components/asideMenu/src/menu-tree.vue`
- Modify: `packages/ui/src/business/components/asideMenu/src/index.vue`
- Modify: `packages/ui/src/business/components/asideMenu/style/index.scss`

- [ ] Add a recursive node helper in `menu-tree.vue` so a submenu receives `ga-aside-menu__submenu--active` when its descendants contain `props.active`.
- [ ] Add an internal render component in `menu-slot-tree.ts` that invokes the default slot during render, recursively processes Fragment/component slot children, recognizes Element Plus menu components, and clones active ancestor `ElSubMenu` VNodes with the private class while preserving existing props, keys, refs and slots.
- [ ] Replace the direct default `<slot>` with the internal renderer and pass `currentActive`; pass `currentActive` to `GaMenuTree` in configuration mode.
- [ ] Add scoped SCSS:

```scss
.el-sub-menu.ga-aside-menu__submenu--active > .el-sub-menu__title {
    color: var(--el-menu-active-color);
}
```

- [ ] Run the focused tests and confirm they pass.

### Task 3: Verify integration and preview

**Files:**
- Verify all changed AsideMenu files and Playground behavior.

- [ ] Run all GaAsideMenu tests and type checking.
- [ ] Run the component-library build and direct Playground Vite build.
- [ ] Reload the fresh Playground and verify configuration/Legacy parent icons highlight immediately in collapsed mode, active changes move the highlight, and console logs stay clean.
- [ ] Run `git diff --check`, scope/debug scans, request code review, fix Critical/Important findings, and commit the implementation.
