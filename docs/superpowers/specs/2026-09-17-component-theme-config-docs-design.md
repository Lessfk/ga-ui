# Component Theme Configuration Documentation Design

## Goal

Add a dedicated style configuration section to the standalone GA UI Plus documentation so readers can inspect every public theme field, its Chinese description, TypeScript type, and built-in default value.

The section covers theme object APIs only. Ordinary appearance-related props and internal CSS variables remain documented through the existing Props API and source code.

## Scope

Theme groups shown in component pages:

- `GaMegaMenu.theme` using `GaMegaMenuTheme`
- `GaPagination.theme` using `GaPaginationTheme`
- `GaTable.theme` using `GaTableTheme`
- `GaAsideMenu.theme` using `GaAsideMenuTheme`
- `GaTablePagination.tableTheme` using `GaTableTheme`
- `GaTablePagination.paginationTheme` using `GaPaginationTheme`

Components without a public theme object, including `GaDialog` and `GaSearchBar`, do not render an empty style section.

## Data Model

Extend component documentation with style configuration groups. Each group contains:

- The component prop name, such as `theme` or `tableTheme`
- The public interface name, such as `GaTableTheme`
- A short group description
- Theme field entries using the existing API entry shape: name, description, type, required state, and default value

The generated API representation gains style groups alongside Props, Events, Slots, and Expose. Component document definitions receive the merged, reader-facing style groups.

## Extraction And Metadata

The API manifest declares the theme interfaces used by each component. The TypeScript extractor reads interface property names, optional state, and exact public types from source files.

Chinese descriptions and default values remain explicit documentation metadata because they are product documentation rather than type information. A merge helper combines generated fields with this metadata and rejects:

- Metadata for an unknown field
- Missing descriptions
- Missing default values
- Duplicate style groups or fields

This hybrid approach prevents field and type drift without relying on brittle parsing of Vue component implementation objects.

`GaTablePagination` reuses the generated `GaTableTheme` and `GaPaginationTheme` field definitions while supplying its own `tableTheme` and `paginationTheme` group descriptions.

## Page Presentation

Component pages render a `样式配置` section after examples and before Props. Each theme group contains:

- A heading combining the prop name and interface name
- A short explanation of the scope of that theme object
- A table with `名称`, `说明`, `类型`, and `默认值`

The section is omitted when no style groups exist. When present, it is included in the right-side page outline with the anchor `#styles`.

The existing API table presentation is extended to support style entries so copy controls, horizontal scrolling, accessibility labels, and visual treatment remain consistent.

## Search

Every theme field becomes a documentation search entry. Search results include the component and theme prop context and navigate to `/components/<slug>#styles`.

For reused names such as `backgroundColor`, search metadata distinguishes `GaTable.theme`, `GaPagination.theme`, and other groups.

## Testing

Use test-first development for each behavior:

1. Extractor tests verify theme interfaces and multiple groups for `GaTablePagination`.
2. Metadata merge tests verify complete descriptions/defaults and reject unknown or incomplete fields.
3. Component page tests verify section visibility, group headings, tables, and outline order.
4. Component documentation tests verify every themed component exposes complete style groups and non-themed components do not.
5. Search tests verify theme fields resolve to `#styles` with useful context.
6. Run the full documentation test suite, documentation production build, and Git whitespace check.

## Non-Goals

- Listing internal CSS variable names
- Duplicating `width`, `size`, `maxHeight`, and other ordinary Props
- Adding new component theme capabilities
- Changing component defaults or runtime styling
