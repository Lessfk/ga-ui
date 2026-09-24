# GaHeader Design

## Goal

Add a desktop header business component that combines a left slot, a built-in `GaMegaMenu`, and a right slot in a stable three-column layout.

The component should remove repetitive application-shell wiring while preserving the full public behavior of `GaMegaMenu`.

## Location And Export

The component is named `GaHeader` and lives under:

`packages/ui/src/business/components/header`

It is exported from `ga-ui-plus/business`, the package root, and `GaUiResolver`. The resolver includes Element Plus container styles required by `ElHeader` together with the Element Plus scrollbar styles required by `GaMegaMenu`.

## Layout

`GaHeader` uses `ElHeader` as its semantic outer container and CSS Grid for layout:

`max-content minmax(0, 1fr) max-content`

- The left and right regions size to their slot content.
- The center region consumes the remaining width and keeps `min-width: 0`.
- `GaMegaMenu` fills the center region's width and height.
- If the center becomes narrow, `GaMegaMenu` keeps its existing horizontal scrolling behavior.
- The component targets desktop application headers and does not add mobile navigation or drawer behavior.

The default height is `64px`, default horizontal padding is `20px`, and default region gap is `16px`.

## Props

`GaHeaderProps` extends `GaMegaMenuProps` so consumers can configure the menu directly on `GaHeader`.

Header-specific props:

- `height?: string | number`, default `64`
- `padding?: string`, default `'0 20px'`
- `gap?: string | number`, default `16`
- `backgroundColor?: string`

The header background resolves in this order:

1. `backgroundColor`
2. `theme.menuBackgroundColor`
3. the built-in MegaMenu background `#2f436b`

All remaining `GaMegaMenuProps` are forwarded to the internal menu. `activeKey` and `openKey` support both controlled and uncontrolled usage. `GaHeader` keeps internal values when the corresponding props are not supplied, preventing the wrapper from accidentally forcing `GaMegaMenu` into controlled mode with `undefined` values.

## Events

`GaHeader` re-emits the complete menu event contract:

- `update:activeKey`
- `update:openKey`
- `select`
- `open`
- `close`

Update events first synchronize the wrapper's internal uncontrolled state, then notify the consumer.

## Slots

Header slots:

- `left`: system name, logo, tenant switcher, or other product identity content
- `right`: user information, actions, notifications, or account controls

Forwarded `GaMegaMenu` slots:

- `menu-item`
- `group-title`
- `panel-item`
- `empty`

Forwarded slots preserve the same scope types as `GaMegaMenu`.

## Expose

`GaHeaderExpose` provides:

- `megaMenuRef`: the internal `GaMegaMenu` public instance
- `open(key)`
- `close()`
- `toggle(key)`

The three methods delegate directly to the internal menu instance.

## Styling

Component styles are kept in `style/index.scss` and use the existing GA component naming convention:

- `.ga-header`
- `.ga-header__left`
- `.ga-header__center`
- `.ga-header__right`

The outer component uses `box-sizing: border-box`, aligns all regions vertically, and does not place the header or its regions inside decorative cards. Consumer classes, styles, and accessibility attributes are forwarded to `ElHeader`.

## Playground Demo

Add `playground/src/demos/HeaderDemo.vue` showing:

- A system logo and name in the left slot
- Data-driven `GaMegaMenu` navigation in the center
- Notifications, avatar, and a user dropdown in the right slot
- Active menu state and a visible display of the latest selection
- A custom menu item slot to prove slot forwarding

The demo becomes the active playground view without deleting existing demo imports or files.

## Testing

Use test-first development and cover:

1. `ElHeader` and three-column regions render with left and right slot content.
2. Header sizing, padding, gap, and background resolution are applied.
3. All `GaMegaMenuProps` reach the internal menu.
4. Controlled and uncontrolled `activeKey` and `openKey` behavior remains correct.
5. Menu update and selection events are re-emitted with unchanged payloads.
6. All four MegaMenu slots are forwarded with their original scopes.
7. Exposed `open`, `close`, and `toggle` methods delegate to the menu instance.
8. Business/root exports and `GaUiResolver` include `GaHeader` and required Element Plus styles.
9. The playground demo type-checks and the package test/build suites pass.

## Non-Goals

- Mobile navigation, drawers, or responsive menu replacement
- Breadcrumbs or a secondary header row
- A header footer region
- Reimplementing `GaMegaMenu` behavior
- Adding a second header theme object that duplicates `GaMegaMenuTheme`
