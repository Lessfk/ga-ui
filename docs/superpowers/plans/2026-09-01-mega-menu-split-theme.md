# GaMegaMenu Split Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace GaMegaMenu's shared theme fields with a breaking flat API that styles the first-level menu, panel container, group titles, second-level items, icons, descriptions, and empty state independently.

**Architecture:** Keep one complete internal default theme and merge partial consumer overrides into it. Map every public field to a region-prefixed CSS variable, apply the resolved variables to both the navigation root and teleported panel, and make each SCSS region consume only its own variables.

**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vue Test Utils, Element Plus, Vite

---

### Task 1: Define the breaking theme API and variable mapping

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`
- Modify: `packages/ui/src/base/components/megaMenu/types/index.ts`
- Modify: `packages/ui/src/base/components/megaMenu/src/index.vue`

- [ ] **Step 1: Replace the existing theme mapping test with independent region assertions**

Add a test that passes values from every major region and asserts distinct CSS variables:

```ts
it('maps independent menu and panel theme values to region variables', async () => {
  const wrapper = await mountMegaMenu({
    props: {
      openKey: 'system',
      theme: {
        menuBackgroundColor: '#10233f',
        menuItemBackgroundColor: '#18385f',
        menuItemHoverBackgroundColor: '#24517f',
        menuItemActiveBackgroundColor: '#2563eb',
        menuItemDisabledBackgroundColor: '#24364f',
        menuItemFocusOutlineColor: '#93c5fd',
        menuItemFontSize: 18,
        menuItemFontWeight: 600,
        menuItemIconSize: '1.5rem',
        panelBackgroundColor: '#f8fafc',
        panelGroupTitleColor: '#475569',
        panelItemTextColor: '#1e293b',
        panelItemBackgroundColor: '#ffffff',
        panelItemHoverBackgroundColor: '#eff6ff',
        panelItemActiveBackgroundColor: '#dbeafe',
        panelItemDisabledBackgroundColor: '#f1f5f9',
        panelItemFocusOutlineColor: '#2563eb',
        panelItemLabelFontSize: 15,
        panelItemDescriptionColor: '#64748b',
        panelItemIconBackgroundColor: '#e2e8f0',
        panelEmptyTextColor: '#64748b',
      },
    },
  })
  if (!wrapper) return

  const rootStyle = wrapper.get('.ga-mega-menu').attributes('style')
  const panelStyle = wrapper.get('.ga-mega-menu__panel').attributes('style')

  expect(rootStyle).toContain('--ga-mega-menu-menu-bg-color: #10233f')
  expect(rootStyle).toContain('--ga-mega-menu-menu-item-bg-color: #18385f')
  expect(rootStyle).toContain('--ga-mega-menu-menu-item-font-size: 18px')
  expect(rootStyle).toContain('--ga-mega-menu-menu-item-font-weight: 600')
  expect(rootStyle).toContain('--ga-mega-menu-menu-item-icon-size: 1.5rem')
  expect(panelStyle).toContain('--ga-mega-menu-panel-bg-color: #f8fafc')
  expect(panelStyle).toContain('--ga-mega-menu-panel-item-text-color: #1e293b')
  expect(panelStyle).toContain('--ga-mega-menu-panel-item-bg-color: #ffffff')
  expect(panelStyle).toContain('--ga-mega-menu-panel-item-label-font-size: 15px')
  expect(panelStyle).toContain('--ga-mega-menu-panel-item-description-color: #64748b')
})
```

- [ ] **Step 2: Add an independence test for partial themes**

```ts
it('keeps panel defaults when only menu values are overridden', async () => {
  const wrapper = await mountMegaMenu({
    props: {
      theme: {
        menuBackgroundColor: '#111827',
        menuItemBackgroundColor: '#1f2937',
      },
    },
  })
  if (!wrapper) return

  const style = wrapper.get('.ga-mega-menu').attributes('style')
  expect(style).toContain('--ga-mega-menu-menu-bg-color: #111827')
  expect(style).toContain('--ga-mega-menu-menu-item-bg-color: #1f2937')
  expect(style).toContain('--ga-mega-menu-panel-bg-color: #2f436b')
  expect(style).toContain('--ga-mega-menu-panel-item-bg-color: #3d527c')
})

it('keeps menu defaults when only panel values are overridden', async () => {
  const wrapper = await mountMegaMenu({
    props: {
      theme: {
        panelBackgroundColor: '#ffffff',
        panelItemBackgroundColor: '#f8fafc',
      },
    },
  })
  if (!wrapper) return

  const style = wrapper.get('.ga-mega-menu').attributes('style')
  expect(style).toContain('--ga-mega-menu-menu-bg-color: #2f436b')
  expect(style).toContain('--ga-mega-menu-menu-item-bg-color: #3d527c')
  expect(style).toContain('--ga-mega-menu-panel-bg-color: #ffffff')
  expect(style).toContain('--ga-mega-menu-panel-item-bg-color: #f8fafc')
})
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```powershell
pnpm exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
```

Working directory: `packages/ui`

Expected: FAIL because the new theme fields do not produce the new region CSS variables.

- [ ] **Step 4: Replace `GaMegaMenuTheme` with the approved flat interface**

In `packages/ui/src/base/components/megaMenu/types/index.ts`, replace the old
interface with:

```ts
export interface GaMegaMenuTheme {
  menuBackgroundColor?: string
  menuGap?: string | number
  menuItemTextColor?: string
  menuItemBackgroundColor?: string
  menuItemBorderColor?: string
  menuItemHoverTextColor?: string
  menuItemHoverBackgroundColor?: string
  menuItemHoverBorderColor?: string
  menuItemActiveTextColor?: string
  menuItemActiveBackgroundColor?: string
  menuItemActiveBorderColor?: string
  menuItemDisabledTextColor?: string
  menuItemDisabledBackgroundColor?: string
  menuItemDisabledBorderColor?: string
  menuItemFocusOutlineColor?: string
  menuItemFontSize?: string | number
  menuItemFontWeight?: string | number
  menuItemIconSize?: string | number
  menuItemGap?: string | number
  menuItemHorizontalPadding?: string | number
  menuItemVerticalSpace?: string | number
  menuItemBorderRadius?: string | number
  menuItemShadow?: string
  menuItemActiveShadow?: string
  panelBackgroundColor?: string
  panelBorderColor?: string
  panelTopBorderColor?: string
  panelShadow?: string
  panelPadding?: string | number
  panelGap?: string | number
  panelGroupTitleColor?: string
  panelGroupTitleFontSize?: string | number
  panelGroupTitleFontWeight?: string | number
  panelGroupTitleMarginBottom?: string | number
  panelGroupTitleHorizontalPadding?: string | number
  panelItemTextColor?: string
  panelItemBackgroundColor?: string
  panelItemBorderColor?: string
  panelItemHoverTextColor?: string
  panelItemHoverBackgroundColor?: string
  panelItemHoverBorderColor?: string
  panelItemActiveTextColor?: string
  panelItemActiveBackgroundColor?: string
  panelItemActiveBorderColor?: string
  panelItemDisabledTextColor?: string
  panelItemDisabledBackgroundColor?: string
  panelItemDisabledBorderColor?: string
  panelItemFocusOutlineColor?: string
  panelItemBorderRadius?: string | number
  panelItemMinHeight?: string | number
  panelItemPadding?: string | number
  panelItemGap?: string | number
  panelItemListGap?: string | number
  panelItemLabelFontSize?: string | number
  panelItemLabelFontWeight?: string | number
  panelItemDescriptionColor?: string
  panelItemDescriptionFontSize?: string | number
  panelItemDescriptionLineHeight?: string | number
  panelItemIconColor?: string
  panelItemIconSize?: string | number
  panelItemIconBoxSize?: string | number
  panelItemIconBackgroundColor?: string
  panelItemIconBorderRadius?: string | number
  panelEmptyTextColor?: string
  panelEmptyPadding?: string | number
}
```

- [ ] **Step 5: Replace `defaultTheme` with explicit region defaults**

Use these defaults in `packages/ui/src/base/components/megaMenu/src/index.vue`:

```ts
const defaultTheme: Required<GaMegaMenuTheme> = {
  menuBackgroundColor: '#2f436b',
  menuGap: 8,
  menuItemTextColor: '#ffffff',
  menuItemBackgroundColor: '#3d527c',
  menuItemBorderColor: 'transparent',
  menuItemHoverTextColor: '#ffffff',
  menuItemHoverBackgroundColor: '#465d89',
  menuItemHoverBorderColor: 'rgb(255 255 255 / 12%)',
  menuItemActiveTextColor: '#ffffff',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemActiveBorderColor: '#4c78b1',
  menuItemDisabledTextColor: 'rgb(255 255 255 / 45%)',
  menuItemDisabledBackgroundColor: 'rgb(255 255 255 / 8%)',
  menuItemDisabledBorderColor: 'transparent',
  menuItemFocusOutlineColor: '#8db7f0',
  menuItemFontSize: 20,
  menuItemFontWeight: 700,
  menuItemIconSize: 26,
  menuItemGap: 10,
  menuItemHorizontalPadding: 24,
  menuItemVerticalSpace: 32,
  menuItemBorderRadius: 14,
  menuItemShadow: '0 1px 1px rgb(15 31 58 / 18%)',
  menuItemActiveShadow:
    'inset 0 1px 0 rgb(255 255 255 / 6%), 0 1px 2px rgb(13 29 55 / 22%)',
  panelBackgroundColor: '#2f436b',
  panelBorderColor: '#415a86',
  panelTopBorderColor: 'rgb(255 255 255 / 8%)',
  panelShadow: '0 18px 40px rgb(15 31 58 / 28%)',
  panelPadding: 24,
  panelGap: 24,
  panelGroupTitleColor: '#b7c4da',
  panelGroupTitleFontSize: 13,
  panelGroupTitleFontWeight: 600,
  panelGroupTitleMarginBottom: 10,
  panelGroupTitleHorizontalPadding: 12,
  panelItemTextColor: '#ffffff',
  panelItemBackgroundColor: '#3d527c',
  panelItemBorderColor: 'transparent',
  panelItemHoverTextColor: '#ffffff',
  panelItemHoverBackgroundColor: '#465d89',
  panelItemHoverBorderColor: 'rgb(255 255 255 / 12%)',
  panelItemActiveTextColor: '#ffffff',
  panelItemActiveBackgroundColor: '#315c96',
  panelItemActiveBorderColor: '#4c78b1',
  panelItemDisabledTextColor: 'rgb(255 255 255 / 42%)',
  panelItemDisabledBackgroundColor: 'rgb(255 255 255 / 6%)',
  panelItemDisabledBorderColor: 'transparent',
  panelItemFocusOutlineColor: '#8db7f0',
  panelItemBorderRadius: 10,
  panelItemMinHeight: 64,
  panelItemPadding: 12,
  panelItemGap: 12,
  panelItemListGap: 8,
  panelItemLabelFontSize: 14,
  panelItemLabelFontWeight: 700,
  panelItemDescriptionColor: '#b7c4da',
  panelItemDescriptionFontSize: 12,
  panelItemDescriptionLineHeight: 18,
  panelItemIconColor: '#ffffff',
  panelItemIconSize: 20,
  panelItemIconBoxSize: 38,
  panelItemIconBackgroundColor: 'rgb(255 255 255 / 8%)',
  panelItemIconBorderRadius: 8,
  panelEmptyTextColor: '#b7c4da',
  panelEmptyPadding: '48px 24px',
}
```

Resolve themes with a direct merge and no dependent fallbacks:

```ts
const currentTheme = computed<Required<GaMegaMenuTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))
```

- [ ] **Step 6: Replace `createThemeStyle` with the complete mapping**

Map each public field to a matching region variable. Use `optionalSize` for
sizes, spacing, radii, and line heights; pass colors, shadows, and font weights
directly. The mapping must include all fields and use names such as:

```ts
function createThemeStyle(theme: GaMegaMenuTheme): CSSProperties {
  return {
    '--ga-mega-menu-menu-bg-color': theme.menuBackgroundColor,
    '--ga-mega-menu-menu-gap': optionalSize(theme.menuGap),
    '--ga-mega-menu-menu-item-text-color': theme.menuItemTextColor,
    '--ga-mega-menu-menu-item-bg-color': theme.menuItemBackgroundColor,
    '--ga-mega-menu-menu-item-border-color': theme.menuItemBorderColor,
    '--ga-mega-menu-menu-item-hover-text-color': theme.menuItemHoverTextColor,
    '--ga-mega-menu-menu-item-hover-bg-color': theme.menuItemHoverBackgroundColor,
    '--ga-mega-menu-menu-item-hover-border-color': theme.menuItemHoverBorderColor,
    '--ga-mega-menu-menu-item-active-text-color': theme.menuItemActiveTextColor,
    '--ga-mega-menu-menu-item-active-bg-color': theme.menuItemActiveBackgroundColor,
    '--ga-mega-menu-menu-item-active-border-color': theme.menuItemActiveBorderColor,
    '--ga-mega-menu-menu-item-disabled-text-color': theme.menuItemDisabledTextColor,
    '--ga-mega-menu-menu-item-disabled-bg-color': theme.menuItemDisabledBackgroundColor,
    '--ga-mega-menu-menu-item-disabled-border-color': theme.menuItemDisabledBorderColor,
    '--ga-mega-menu-menu-item-focus-outline-color': theme.menuItemFocusOutlineColor,
    '--ga-mega-menu-menu-item-font-size': optionalSize(theme.menuItemFontSize),
    '--ga-mega-menu-menu-item-font-weight': theme.menuItemFontWeight,
    '--ga-mega-menu-menu-item-icon-size': optionalSize(theme.menuItemIconSize),
    '--ga-mega-menu-menu-item-gap': optionalSize(theme.menuItemGap),
    '--ga-mega-menu-menu-item-horizontal-padding': optionalSize(theme.menuItemHorizontalPadding),
    '--ga-mega-menu-menu-item-vertical-space': optionalSize(theme.menuItemVerticalSpace),
    '--ga-mega-menu-menu-item-radius': optionalSize(theme.menuItemBorderRadius),
    '--ga-mega-menu-menu-item-shadow': theme.menuItemShadow,
    '--ga-mega-menu-menu-item-active-shadow': theme.menuItemActiveShadow,
    '--ga-mega-menu-panel-bg-color': theme.panelBackgroundColor,
    '--ga-mega-menu-panel-border-color': theme.panelBorderColor,
    '--ga-mega-menu-panel-top-border-color': theme.panelTopBorderColor,
    '--ga-mega-menu-panel-shadow': theme.panelShadow,
    '--ga-mega-menu-panel-padding': optionalSize(theme.panelPadding),
    '--ga-mega-menu-panel-gap': optionalSize(theme.panelGap),
    '--ga-mega-menu-panel-group-title-color': theme.panelGroupTitleColor,
    '--ga-mega-menu-panel-group-title-font-size': optionalSize(theme.panelGroupTitleFontSize),
    '--ga-mega-menu-panel-group-title-font-weight': theme.panelGroupTitleFontWeight,
    '--ga-mega-menu-panel-group-title-margin-bottom': optionalSize(theme.panelGroupTitleMarginBottom),
    '--ga-mega-menu-panel-group-title-horizontal-padding': optionalSize(theme.panelGroupTitleHorizontalPadding),
    '--ga-mega-menu-panel-item-text-color': theme.panelItemTextColor,
    '--ga-mega-menu-panel-item-bg-color': theme.panelItemBackgroundColor,
    '--ga-mega-menu-panel-item-border-color': theme.panelItemBorderColor,
    '--ga-mega-menu-panel-item-hover-text-color': theme.panelItemHoverTextColor,
    '--ga-mega-menu-panel-item-hover-bg-color': theme.panelItemHoverBackgroundColor,
    '--ga-mega-menu-panel-item-hover-border-color': theme.panelItemHoverBorderColor,
    '--ga-mega-menu-panel-item-active-text-color': theme.panelItemActiveTextColor,
    '--ga-mega-menu-panel-item-active-bg-color': theme.panelItemActiveBackgroundColor,
    '--ga-mega-menu-panel-item-active-border-color': theme.panelItemActiveBorderColor,
    '--ga-mega-menu-panel-item-disabled-text-color': theme.panelItemDisabledTextColor,
    '--ga-mega-menu-panel-item-disabled-bg-color': theme.panelItemDisabledBackgroundColor,
    '--ga-mega-menu-panel-item-disabled-border-color': theme.panelItemDisabledBorderColor,
    '--ga-mega-menu-panel-item-focus-outline-color': theme.panelItemFocusOutlineColor,
    '--ga-mega-menu-panel-item-radius': optionalSize(theme.panelItemBorderRadius),
    '--ga-mega-menu-panel-item-min-height': optionalSize(theme.panelItemMinHeight),
    '--ga-mega-menu-panel-item-padding': optionalSize(theme.panelItemPadding),
    '--ga-mega-menu-panel-item-gap': optionalSize(theme.panelItemGap),
    '--ga-mega-menu-panel-item-list-gap': optionalSize(theme.panelItemListGap),
    '--ga-mega-menu-panel-item-label-font-size': optionalSize(theme.panelItemLabelFontSize),
    '--ga-mega-menu-panel-item-label-font-weight': theme.panelItemLabelFontWeight,
    '--ga-mega-menu-panel-item-description-color': theme.panelItemDescriptionColor,
    '--ga-mega-menu-panel-item-description-font-size': optionalSize(theme.panelItemDescriptionFontSize),
    '--ga-mega-menu-panel-item-description-line-height': optionalSize(theme.panelItemDescriptionLineHeight),
    '--ga-mega-menu-panel-item-icon-color': theme.panelItemIconColor,
    '--ga-mega-menu-panel-item-icon-size': optionalSize(theme.panelItemIconSize),
    '--ga-mega-menu-panel-item-icon-box-size': optionalSize(theme.panelItemIconBoxSize),
    '--ga-mega-menu-panel-item-icon-bg-color': theme.panelItemIconBackgroundColor,
    '--ga-mega-menu-panel-item-icon-radius': optionalSize(theme.panelItemIconBorderRadius),
    '--ga-mega-menu-panel-empty-text-color': theme.panelEmptyTextColor,
    '--ga-mega-menu-panel-empty-padding': optionalSize(theme.panelEmptyPadding),
  }
}
```

- [ ] **Step 7: Run the focused tests and verify GREEN**

Run the Task 1 Vitest command again.

Expected: the new variable mapping and independence tests pass; existing CSS
source assertions may still fail until Task 2.

- [ ] **Step 8: Commit the theme API and resolver**

```powershell
git add -- packages/ui/src/base/components/megaMenu/types/index.ts packages/ui/src/base/components/megaMenu/src/index.vue packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
git commit -m "feat: split mega menu theme API"
```

### Task 2: Make SCSS consume independent theme variables

**Files:**
- Modify: `packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts`
- Modify: `packages/ui/src/base/components/megaMenu/style/index.scss`

- [ ] **Step 1: Add failing SCSS assertions**

Add source assertions for representative normal, hover, active, disabled,
focus, typography, icon, panel spacing, and empty-state variables:

```ts
it('styles menu and panel regions with independent CSS variables', () => {
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-item-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-item-hover-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-item-active-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-item-disabled-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-menu-item-focus-outline-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-hover-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-active-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-disabled-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-focus-outline-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-item-icon-bg-color')
  expect(megaMenuStyles).toContain('var(--ga-mega-menu-panel-empty-padding')
  expect(megaMenuStyles).not.toContain('--ga-mega-menu-item-bg-color')
  expect(megaMenuStyles).not.toContain('--ga-mega-menu-text-color')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run the Task 1 Vitest command.

Expected: FAIL because SCSS still consumes the old shared variables and
hard-coded state values.

- [ ] **Step 3: Replace menu container and first-level item styles**

Use the new variables in the existing selectors:

```scss
.ga-mega-menu {
  color: var(--ga-mega-menu-menu-item-text-color, #ffffff);
  background: var(--ga-mega-menu-menu-bg-color, #2f436b);

  &__menu {
    gap: var(--ga-mega-menu-menu-gap, 8px);
  }

  &__nav-item {
    gap: var(--ga-mega-menu-menu-item-gap, 10px);
    height: calc(100% - var(--ga-mega-menu-menu-item-vertical-space, 32px));
    padding: 0 var(--ga-mega-menu-menu-item-horizontal-padding, 24px);
    color: var(--ga-mega-menu-menu-item-text-color, #ffffff);
    font-size: var(--ga-mega-menu-menu-item-font-size, 20px);
    font-weight: var(--ga-mega-menu-menu-item-font-weight, 700);
    background: var(--ga-mega-menu-menu-item-bg-color, #3d527c);
    border-color: var(--ga-mega-menu-menu-item-border-color, transparent);
    border-radius: var(--ga-mega-menu-menu-item-radius, 14px);
    box-shadow: var(
      --ga-mega-menu-menu-item-shadow,
      0 1px 1px rgb(15 31 58 / 18%)
    );
  }

  &__nav-item:hover,
  &__nav-item:focus-visible {
    color: var(--ga-mega-menu-menu-item-hover-text-color, #ffffff);
    background: var(--ga-mega-menu-menu-item-hover-bg-color, #465d89);
    border-color: var(--ga-mega-menu-menu-item-hover-border-color, rgb(255 255 255 / 12%));
  }

  &__nav-item:focus-visible {
    outline-color: var(--ga-mega-menu-menu-item-focus-outline-color, #8db7f0);
  }

  &__nav-item.is-active,
  &__nav-item.is-panel-open {
    color: var(--ga-mega-menu-menu-item-active-text-color, #ffffff);
    background: var(--ga-mega-menu-menu-item-active-bg-color, #315c96);
    border-color: var(--ga-mega-menu-menu-item-active-border-color, #4c78b1);
    box-shadow: var(--ga-mega-menu-menu-item-active-shadow);
  }

  &__nav-item:disabled {
    color: var(--ga-mega-menu-menu-item-disabled-text-color, rgb(255 255 255 / 45%));
    background: var(--ga-mega-menu-menu-item-disabled-bg-color, rgb(255 255 255 / 8%));
    border-color: var(--ga-mega-menu-menu-item-disabled-border-color, transparent);
  }

  &__icon {
    font-size: var(--ga-mega-menu-menu-item-icon-size, 26px);
  }
}
```

- [ ] **Step 4: Replace panel, group title, and second-level item styles**

Keep the existing positioning and layout declarations, but replace visual
values with these declarations:

```scss
&__panel {
  background: var(--ga-mega-menu-panel-bg-color, #2f436b);
  border-color: var(--ga-mega-menu-panel-border-color, #415a86);
  border-top-color: var(--ga-mega-menu-panel-top-border-color, rgb(255 255 255 / 8%));
  box-shadow: var(--ga-mega-menu-panel-shadow);
}

&__grid {
  gap: var(--ga-mega-menu-panel-gap, 24px);
  padding: var(--ga-mega-menu-panel-padding, 24px);
}

&__group-title {
  margin-bottom: var(--ga-mega-menu-panel-group-title-margin-bottom, 10px);
  padding-inline: var(--ga-mega-menu-panel-group-title-horizontal-padding, 12px);
  color: var(--ga-mega-menu-panel-group-title-color, #b7c4da);
  font-size: var(--ga-mega-menu-panel-group-title-font-size, 13px);
  font-weight: var(--ga-mega-menu-panel-group-title-font-weight, 600);
}

&__list {
  gap: var(--ga-mega-menu-panel-item-list-gap, 8px);
}

&__item {
  gap: var(--ga-mega-menu-panel-item-gap, 12px);
  min-height: var(--ga-mega-menu-panel-item-min-height, 64px);
  padding: var(--ga-mega-menu-panel-item-padding, 12px);
  color: var(--ga-mega-menu-panel-item-text-color, #ffffff);
  background: var(--ga-mega-menu-panel-item-bg-color, #3d527c);
  border-color: var(--ga-mega-menu-panel-item-border-color, transparent);
  border-radius: var(--ga-mega-menu-panel-item-radius, 10px);
}

&__item:hover,
&__item:focus-visible {
  color: var(--ga-mega-menu-panel-item-hover-text-color, #ffffff);
  background: var(--ga-mega-menu-panel-item-hover-bg-color, #465d89);
  border-color: var(--ga-mega-menu-panel-item-hover-border-color, rgb(255 255 255 / 12%));
}

&__item:focus-visible {
  outline-color: var(--ga-mega-menu-panel-item-focus-outline-color, #8db7f0);
}

&__item.is-active {
  color: var(--ga-mega-menu-panel-item-active-text-color, #ffffff);
  background: var(--ga-mega-menu-panel-item-active-bg-color, #315c96);
  border-color: var(--ga-mega-menu-panel-item-active-border-color, #4c78b1);
}

&__item:disabled,
&__item.is-disabled {
  color: var(--ga-mega-menu-panel-item-disabled-text-color, rgb(255 255 255 / 42%));
  background: var(--ga-mega-menu-panel-item-disabled-bg-color, rgb(255 255 255 / 6%));
  border-color: var(--ga-mega-menu-panel-item-disabled-border-color, transparent);
}

&__item-label {
  font-size: var(--ga-mega-menu-panel-item-label-font-size, 14px);
  font-weight: var(--ga-mega-menu-panel-item-label-font-weight, 700);
}

&__item-description {
  color: var(--ga-mega-menu-panel-item-description-color, #b7c4da);
  font-size: var(--ga-mega-menu-panel-item-description-font-size, 12px);
  line-height: var(--ga-mega-menu-panel-item-description-line-height, 18px);
}

&__item-icon {
  width: var(--ga-mega-menu-panel-item-icon-box-size, 38px);
  height: var(--ga-mega-menu-panel-item-icon-box-size, 38px);
  color: var(--ga-mega-menu-panel-item-icon-color, #ffffff);
  font-size: var(--ga-mega-menu-panel-item-icon-size, 20px);
  background: var(--ga-mega-menu-panel-item-icon-bg-color, rgb(255 255 255 / 8%));
  border-radius: var(--ga-mega-menu-panel-item-icon-radius, 8px);
}

&__empty {
  padding: var(--ga-mega-menu-panel-empty-padding, 48px 24px);
  color: var(--ga-mega-menu-panel-empty-text-color, #b7c4da);
}
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run the Task 1 Vitest command.

Expected: all GaMegaMenu tests pass.

- [ ] **Step 6: Commit the SCSS migration**

```powershell
git add -- packages/ui/src/base/components/megaMenu/style/index.scss packages/ui/src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts
git commit -m "style: separate mega menu regions"
```

### Task 3: Migrate type coverage, playground presets, and documentation

**Files:**
- Modify: `packages/ui/src/__tests__/exports.spec.ts`
- Modify: `playground/src/demos/MegaMenuDemo.vue`
- Modify: `playground/src/demos/myMegaMenu.vue`
- Modify: `packages/ui/README.md`

- [ ] **Step 1: Add type-level breaking-change coverage**

Replace `megaMenuTheme` with new fields and add an intentional old-field
rejection:

```ts
const megaMenuTheme: GaMegaMenuTheme = {
  menuBackgroundColor: '#2f436b',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemBorderRadius: 14,
  panelBackgroundColor: '#f8fafc',
  panelItemTextColor: '#1e293b',
  panelItemBackgroundColor: '#ffffff',
}

const removedMegaMenuTheme: GaMegaMenuTheme = {
  // @ts-expect-error shared backgroundColor was removed by the split theme API
  backgroundColor: '#2f436b',
}
```

Add `void removedMegaMenuTheme` beside the existing type-use statements.

- [ ] **Step 2: Run type tests and verify RED before the type implementation is present**

If Task 1 has already updated the type, use `git show HEAD^` or the Task 1 RED
run as the required evidence. The expected pre-implementation failure is an
unknown new field or an unused `@ts-expect-error` for `backgroundColor`.

- [ ] **Step 3: Migrate all playground presets**

Replace old fields in `themes.ocean`, `themes.forest`, and `themes.graphite`.
Make `ocean` demonstrate a dark menu with a light panel:

```ts
ocean: {
  menuBackgroundColor: '#2f436b',
  menuGap: 8,
  menuItemTextColor: '#ffffff',
  menuItemBackgroundColor: '#3d527c',
  menuItemHoverBackgroundColor: '#465d89',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemActiveBorderColor: '#4c78b1',
  menuItemBorderRadius: 8,
  menuItemHorizontalPadding: 22,
  menuItemVerticalSpace: 22,
  menuItemIconSize: 25,
  menuItemFontSize: 16,
  panelBackgroundColor: '#f4f7fb',
  panelBorderColor: '#d8e1ed',
  panelTopBorderColor: '#d8e1ed',
  panelGroupTitleColor: '#52657d',
  panelItemTextColor: '#253858',
  panelItemBackgroundColor: '#ffffff',
  panelItemBorderColor: '#d8e1ed',
  panelItemHoverTextColor: '#1d4f91',
  panelItemHoverBackgroundColor: '#eaf2ff',
  panelItemHoverBorderColor: '#b8d0ee',
  panelItemActiveTextColor: '#173f73',
  panelItemActiveBackgroundColor: '#dceaff',
  panelItemActiveBorderColor: '#8eb3df',
  panelItemDescriptionColor: '#66788e',
  panelItemIconColor: '#315c96',
  panelItemIconBackgroundColor: '#e6eef8',
  panelItemBorderRadius: 6,
}
```

Update `headerStyle` to read `currentTheme.value.menuBackgroundColor`.

Migrate only the `themes` object in `playground/src/demos/myMegaMenu.vue` to
the new fields because the user's current `App.vue` imports that demo. Preserve
its menu data, component markup, and local layout styles.

- [ ] **Step 4: Add the GaMegaMenu README section**

Insert a `## GaMegaMenu` section before `## GaAsideMenu`. Include:

- a basic data-driven usage example;
- a split theme example;
- the complete field table grouped by `menu`, `menuItem`, `panel`,
  `panelGroupTitle`, `panelItem`, and `panelEmpty` prefixes;
- a breaking migration example from shared fields to region fields;
- a note that the teleported panel receives the same instance theme.

- [ ] **Step 5: Run type tests and the focused component tests**

Run:

```powershell
pnpm run test:type
pnpm exec vitest run src/base/components/megaMenu/src/__tests__/mega-menu.spec.ts src/__tests__/exports.spec.ts
```

Working directory: `packages/ui`

Expected: type tests and both test files pass.

- [ ] **Step 6: Build the playground and inspect the demo**

Run:

```powershell
pnpm --filter playground exec vite build
```

Then verify the existing local playground in the in-app browser:

- each theme changes both regions without missing styles;
- the ocean theme shows a dark first-level menu and light panel;
- hover, active, disabled, focus, descriptions, icons, and group titles remain
  readable;
- click and hover triggers still work;
- panel columns and maximum height remain unchanged.

- [ ] **Step 7: Commit the migration and documentation**

```powershell
git add -- packages/ui/src/__tests__/exports.spec.ts playground/src/demos/MegaMenuDemo.vue playground/src/demos/myMegaMenu.vue packages/ui/README.md
git commit -m "docs: migrate mega menu split themes"
```

### Task 4: Run complete release verification

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run all UI library tests**

```powershell
pnpm run test
```

Working directory: `packages/ui`

Expected: type tests and the complete Vitest suite pass.

- [ ] **Step 2: Build and verify package output**

```powershell
pnpm run build
pnpm run verify:exports
```

Working directory: `packages/ui`

Expected: Vite build, declaration verification, runtime exports, and NodeNext
type verification pass.

- [ ] **Step 3: Run the npm publish dry run**

```powershell
npm publish --dry-run
```

Working directory: `packages/ui`

Expected: `prepublishOnly` completes and npm prints the `ga-ui-plus` tarball
contents without publishing it.

- [ ] **Step 4: Check the final diff**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors. Existing user changes in
`playground/src/App.vue` and `playground/src/demos/myMegaMenu.vue` remain
untouched.
