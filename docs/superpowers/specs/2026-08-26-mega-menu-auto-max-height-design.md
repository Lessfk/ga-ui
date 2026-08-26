# GaMegaMenu Auto Max Height Design

## Goal

Make the second-level panel height adapt to its content by default, while
preserving the existing ability to configure a numeric or CSS maximum height.

## Public API

Keep `maxHeight?: string | number` unchanged for backward compatibility.

- The component default changes from `480` to `'auto'`.
- `max-height="auto"` means no maximum-height constraint.
- Numeric values such as `460` continue to use pixel units through Element
  Plus.
- CSS values such as `'50vh'` and `'30rem'` continue to pass through unchanged.

## Component Behavior

Add a computed value used only for the `ElScrollbar` binding:

- Return `undefined` when `maxHeight === 'auto'`.
- Return the configured value for every other string or number.

The component continues rendering one `ElScrollbar`; only its `max-height`
input changes. When the computed value is `undefined`, Element Plus does not
apply a maximum height and the panel grows naturally with its content.

## Demo

Remove the fixed `:max-height="460"` binding from `MegaMenuDemo.vue` so the Demo
shows the new default adaptive behavior.

## Verification

- Add tests proving the default and explicit `'auto'` values do not reach the
  `ElScrollbar` as `max-height`.
- Add tests proving numeric and CSS string values still pass through.
- Run the complete GaMegaMenu test file and component-library type checks.
- Build the UI package and Playground.
- Verify in the browser that the default panel follows content height and a
  configured maximum height still enables internal scrolling.
