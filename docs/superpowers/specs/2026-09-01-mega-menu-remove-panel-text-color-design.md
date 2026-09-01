# GaMegaMenu Remove panelTextColor Design

## Goal

Remove the ineffective `panelTextColor` theme field from `GaMegaMenu` so the
public theme API only exposes colors that have a clear visual owner.

## Scope

The removal is intentionally breaking and complete. Delete
`panelTextColor` and `--ga-mega-menu-panel-text-color` from:

- the public `GaMegaMenuTheme` type;
- the internal default theme and CSS variable mapping;
- the panel container SCSS;
- type and source-level tests;
- playground theme presets;
- README examples and API tables;
- the split-theme design and implementation plan.

No compatibility alias, deprecation period, or internal fallback remains.

## Resulting Color Ownership

The panel container will no longer set a base `color`. Visible panel content
continues to use its region-specific fields:

- `panelGroupTitleColor` for group titles;
- `panelItemTextColor` and state variants for item labels;
- `panelItemDescriptionColor` for descriptions;
- `panelItemIconColor` for icons;
- `panelEmptyTextColor` for the empty state.

Custom slot content that needs a color must inherit from one of these styled
regions or set its own color. This keeps the API explicit and avoids a theme
field whose effect is normally hidden by child selectors.

## User Workspace Preservation

`playground/src/demos/myMegaMenu.vue` already contains user changes. The
implementation will remove only its `panelTextColor` property and preserve all
other content. `playground/src/App.vue` remains untouched.

## Tests

Use test-driven coverage for the breaking contract:

1. Add a type assertion showing `panelTextColor` is rejected by
   `GaMegaMenuTheme`.
2. Add a source assertion showing the SCSS no longer contains
   `--ga-mega-menu-panel-text-color`.
3. Run focused GaMegaMenu and export tests.
4. Run the complete UI test suite, build, export verification, playground
   build, and `npm publish --dry-run`.

## Non-Goals

- Do not rename or change any remaining theme field.
- Do not change menu data, events, slots, triggers, positioning, or exposed
  methods.
- Do not introduce fallback relationships between panel color fields.
