# GaMegaMenu Max Column Width Design

## Goal

Prevent a small number of second-level menu groups from stretching across the
entire panel, while preserving responsive column wrapping. Vertically center a
panel item icon when its description wraps to multiple lines.

## Public API

Add `maxColumnWidth?: number` to `GaMegaMenuProps`.

- Vue template name: `max-column-width`
- Unit: pixels
- Default: `420`
- Invalid values are normalized so the effective maximum is never smaller than
  `minColumnWidth` and both values remain positive.

## Layout

Expose the effective value through
`--ga-mega-menu-max-column-width`. The panel group container keeps wrapping
groups according to available panel width. Each group can grow from
`minColumnWidth` up to `maxColumnWidth`; one group therefore stays compact
instead of filling the viewport.

The existing full-width panel, scrolling behavior, group data structure, menu
events, slots, and theme API remain unchanged.

## Icon Alignment

Apply vertical self-alignment to `.ga-mega-menu__item-icon`. This centers the
fixed-size icon against the complete label and description block without
changing text alignment or the existing label-only state.

## Verification

- Add a component test proving the default and custom maximum widths are
  exposed as CSS variables.
- Run the complete GaMegaMenu test file.
- Build the UI package or run its type/build verification.
- Verify in the Playground that a single group does not exceed 420px and an
  icon remains vertically centered beside a two-line description.
