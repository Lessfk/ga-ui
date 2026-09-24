# GaHeader Detailed Demo Design

## Goal

Expand `playground/src/demos/HeaderDemo.vue` into one comprehensive, interactive example that explains how to use `GaHeader` in a realistic desktop management system header.

The demo must make the component's important props, slots, events, exposed methods, menu data structure, and theme configuration observable without changing the public `GaHeader` API.

## Scope

This change updates only the playground demo. It does not change `GaHeader`, `GaMegaMenu`, package exports, or component behavior.

The demo remains a single self-contained Vue file so users can inspect one complete usage example without following dependencies across multiple demo components.

## Page Structure

The page uses a control-console layout:

1. A live `GaHeader` preview at the top.
2. A configuration area for layout and menu behavior.
3. A theme preset area.
4. An exposed-method area.
5. A live state summary.
6. A chronological event log.

The live header contains:

- A left slot with a logo, system name, and environment badge.
- A center `GaMegaMenu` managed by `GaHeader`.
- A right slot with notifications, a fullscreen command, and a user dropdown.

## Menu Coverage

The menu data demonstrates:

- A direct first-level menu without a panel.
- A first-level menu with multiple groups.
- A first-level menu with a single group.
- Disabled first-level and panel items.
- A menu with no usable panel content for the `empty` slot.
- Plain component icons created with `markRaw`.
- Icon configuration objects containing a component and custom props.

## Props And State

The demo controls these values reactively:

- `activeKey`
- `openKey`
- `trigger`
- `height`
- `padding`
- `gap`
- `closeOnSelect`
- `minColumnWidth`
- `maxColumnWidth`
- `maxHeight`
- `theme`
- `ariaLabel`

The form controls use Element Plus components appropriate to each value: segmented or radio controls for modes, switches for booleans, numeric inputs for dimensions, and preset buttons for themes.

## Slots

The example customizes every public `GaHeader` slot:

- `left`: product identity and environment.
- `right`: user operations.
- `menu-item`: first-level icon, label, open indicator, and active indicator.
- `group-title`: group icon or accent plus title.
- `panel-item`: icon, label, description, active state, and disabled state.
- `empty`: a clear empty-panel message.

Slot implementations use the provided scope values so the example documents how those values are consumed in practice.

## Events

The demo handles the complete event contract:

- `update:activeKey`
- `update:openKey`
- `select`
- `open`
- `close`

Each handler updates a bounded event log containing the event name, readable details, and time. The newest entry appears first. The log has a clear command and an empty state.

The `select` handler also updates a human-readable latest-selection summary.

## Exposed Methods

A typed `ref<GaHeaderExpose>` demonstrates:

- `open(key)`
- `close()`
- `toggle(key)`

Method controls target known panel menu keys so every command has an immediately visible result.

## Theme Demonstration

The demo provides three presets:

- Default dark blue.
- Dark graphite.
- Light business.

Each preset supplies a complete, typed `GaMegaMenuTheme` object covering first-level menu, panel, group title, panel item, icon, disabled, focus, and empty-state styling. The selected header background remains visually consistent with the center menu.

## Layout And Styling

The demo targets desktop use, matching `GaHeader` and `GaMegaMenu` requirements. Controls remain usable at narrower desktop widths without introducing a mobile navigation mode.

The page avoids nested decorative cards. Full-width sections separate preview, controls, state, and event output. Compact control groups use restrained borders and an operational-tool visual style.

Stable dimensions are used for header controls, state values, and event rows so dynamic content does not shift the layout unexpectedly.

## Error And Edge Handling

- Numeric controls receive practical minimum and maximum values.
- The demo prevents the minimum panel column width from exceeding the maximum width.
- Empty or undefined `openKey` values are displayed explicitly.
- Event log payloads are converted to readable strings instead of rendering raw objects.
- Browser-only fullscreen behavior checks API availability before calling it.

## Verification

Implementation verification will include:

1. Type-check the playground or the narrowest available Header demo scope.
2. Build the playground with Vite.
3. Run the existing `GaHeader` and package tests if the demo change affects shared type resolution.
4. Open the local playground and verify theme switching, trigger switching, menu selection, disabled states, all exposed methods, and event logging.
5. Check normal and narrow desktop viewport widths for overlap, clipping, and panel placement.

## Non-Goals

- No new `GaHeader` API.
- No changes to `GaMegaMenu` behavior.
- No mobile navigation or drawer mode.
- No documentation-site page in this change.
- No routing dependency; selection remains observable through local demo state.
