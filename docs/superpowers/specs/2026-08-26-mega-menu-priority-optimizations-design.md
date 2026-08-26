# GaMegaMenu Priority Optimizations Design

## Goal

Improve GaMegaMenu's state behavior, theme inheritance, viewport panel
positioning, and parent-height adaptation without expanding the public API.

## State Control

Treat `activeKey` and `openKey` as controlled only when their corresponding
props are present on the component vnode. An `update:*` listener by itself
must not freeze internal state.

## Theme Inheritance

Keep the public theme override fields, but make derived colors inherit from
their semantic base colors:

- `panelBackgroundColor` falls back to `backgroundColor`.
- `groupTitleColor` and `descriptionColor` fall back to `mutedTextColor`.

The complete default appearance remains unchanged. Partial themes update all
dependent colors unless a more specific override is supplied.

## Panel Positioning

Teleport the panel to `body` and position it fixed below the navigation root.
The panel always spans the viewport width, so the `panelWidth` prop is removed.
Track the root bottom edge on open, resize, scroll, and observed size changes.
Outside-click and hover containment checks must include the teleported panel.

## Parent Height

Remove the component's fixed `64px` minimum heights. The root and menu use the
height supplied by their parent. Navigation items retain their own minimum
interactive height.

## Verification

Add regression tests for listener-only uncontrolled state, theme inheritance
and specific overrides, Teleport/fixed positioning, removed `panelWidth`, and
absence of fixed root/menu minimum heights. Run the focused test, type checks,
library build, Playground build, and browser verification.
