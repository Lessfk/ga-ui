# GaMegaMenu Split Theme Design

## Goal

Replace the current shared `GaMegaMenuTheme` fields with a breaking, flat,
region-prefixed theme API. First-level navigation and second-level panel items
must be independently configurable across colors, interaction states,
typography, icons, spacing, borders, radii, and shadows.

The component keeps its current default visual appearance when no theme is
provided. Menu data, events, slots, trigger behavior, positioning, and exposed
methods are outside this change.

## Current Problem

The current theme uses shared fields such as `itemBackgroundColor`,
`itemHoverBackgroundColor`, and `itemActiveBackgroundColor` for both the
first-level navigation buttons and second-level panel items. Changing one
region therefore changes the other. Several commonly customized values are
also hard-coded in SCSS, including disabled colors, focus outlines, shadows,
panel spacing, group title typography, panel item typography, and panel icon
styling.

## Compatibility Decision

This is an intentional breaking change. The old theme fields will be removed
instead of retained as aliases or fallbacks. TypeScript consumers using the old
API must migrate to the new region-prefixed fields.

There is no runtime compatibility layer. This keeps theme resolution direct,
avoids ambiguous precedence rules, and prevents the new API from carrying two
parallel naming systems.

## Public Theme API

`GaMegaMenuTheme` remains a flat interface. Fields are grouped by prefixes so
IDE completion keeps related options together.

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
  panelTextColor?: string
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

## Theme Resolution

The component defines a complete internal
`defaultTheme: Required<GaMegaMenuTheme>`. A consumer theme is a partial
override:

```ts
const currentTheme = computed<Required<GaMegaMenuTheme>>(() => ({
  ...defaultTheme,
  ...props.theme,
}))
```

There are no cross-field semantic fallbacks. For example,
`panelBackgroundColor` does not inherit from `menuBackgroundColor`, and
`panelItemTextColor` does not inherit from `menuItemTextColor`. Each region has
an explicit default so changing one region cannot affect another.

Numeric values for size-like fields are converted to pixel values. String
values are passed through unchanged so consumers can use `rem`, `vh`, `calc()`,
or CSS custom properties. Color, shadow, and font-weight strings are passed
through without modification.

## CSS Variable Mapping

Every public theme field maps to one component CSS variable. Variables follow
the same region prefixes as the public API:

```text
menuBackgroundColor
  -> --ga-mega-menu-menu-bg-color

menuItemBackgroundColor
  -> --ga-mega-menu-menu-item-bg-color

panelBackgroundColor
  -> --ga-mega-menu-panel-bg-color

panelItemBackgroundColor
  -> --ga-mega-menu-panel-item-bg-color
```

The remaining fields use the same camelCase-to-semantic-variable convention.
SCSS selectors for `.ga-mega-menu__nav-item` only consume `menu-item`
variables. Selectors for `.ga-mega-menu__item` only consume `panel-item`
variables. Shared item variables from the old implementation are removed.

Focus, disabled, hover, active, border, and shadow declarations must all use
their corresponding variables instead of hard-coded values.

## Teleported Panel

The panel is teleported to `body`, so it cannot rely on inheriting variables
from the navigation root. The complete resolved theme style and column width
variables continue to be applied to both:

- the `.ga-mega-menu` navigation root;
- the `.ga-mega-menu__panel` teleported element.

This preserves per-instance themes and prevents panel styling from being lost
after teleportation.

## Default Visual Behavior

The new default values reproduce the current deep-blue theme. Existing visual
values are assigned to the equivalent first-level and second-level fields.
Hard-coded SCSS values become explicit defaults, including:

- menu and panel item disabled colors;
- focus outline colors;
- menu item normal and active shadows;
- panel padding and group gap;
- group title typography and spacing;
- panel item minimum height, padding, and content gap;
- label and description typography;
- panel icon box size, color, background, and radius;
- empty-state color and padding.

The API changes, but rendering without a `theme` prop remains visually stable.

## Demo Changes

`MegaMenuDemo.vue` migrates all three theme presets to the new fields. At least
one preset must deliberately contrast the first-level navigation and panel so
the demo proves independent configuration. For example, a dark navigation bar
may open a light panel with white panel items and dark text.

The demo continues to cover click and hover triggers, adaptive parent height,
column sizing, events, and exposed methods. This change does not add a theme
editor UI.

## Documentation And Migration

The package README receives a complete `GaMegaMenuTheme` field table grouped by
prefix. A migration section explains that shared fields must be split:

```ts
// Before
const theme: GaMegaMenuTheme = {
  itemBackgroundColor: '#334155',
  itemActiveBackgroundColor: '#2563eb',
}

// After
const theme: GaMegaMenuTheme = {
  menuItemBackgroundColor: '#334155',
  menuItemActiveBackgroundColor: '#2563eb',
  panelItemBackgroundColor: '#334155',
  panelItemActiveBackgroundColor: '#2563eb',
}
```

The documentation explicitly identifies this as a breaking theme API change.

## Testing

Tests will be written before implementation and will verify:

1. First-level and second-level fields produce different CSS variables.
2. Overriding first-level values does not alter panel item defaults.
3. Overriding panel item values does not alter first-level defaults.
4. A partial theme retains every unrelated default.
5. Numeric size fields become `px`; string values are preserved.
6. The teleported panel receives the complete resolved theme.
7. Hover, active, disabled, and focus SCSS rules consume their own variables.
8. Typography, icon, spacing, border, radius, shadow, and empty-state rules use
   the new variables.
9. Old shared CSS variables and old public theme fields are absent.
10. Component tests, type tests, build verification, exports verification, and
    the npm publish dry run pass.

## Out Of Scope

- Changing menu data structures or icon configuration.
- Changing `select`, `open`, or `close` events.
- Changing scoped slots or exposed methods.
- Changing click and hover trigger behavior.
- Adding runtime theme validation.
- Adding a visual theme builder or editor.
- Retaining deprecated aliases for old theme fields.
