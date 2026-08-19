# Pagination Disabled Design

## Goal

Add an explicit disabled state to `GaPagination` and make
`GaTablePagination` disable pagination while its table is loading.

## Public API

- Add `disabled?: boolean` to `GaPaginationProps`.
- Default `GaPagination.disabled` to `false`.
- Pass the declared value directly to Element Plus `ElPagination`.
- Do not expose an independent pagination `disabled` prop from
  `GaTablePagination`.
- Use `GaTablePagination.loading` as the single state controlling both the
  table loading overlay and pagination disabled state.

## Component Flow

`GaPagination` receives `disabled`, applies its default, and binds it to
`ElPagination`. Other undeclared Element Plus pagination options continue to
flow through `$attrs`.

`GaTablePagination` keeps passing `loading` to `GaTable` and additionally
passes the same value to `GaPagination.disabled`. When `loading` is omitted or
false, pagination remains enabled.

## Compatibility

Existing consumers that pass `disabled` to `GaPagination` keep the same
runtime behavior and gain an explicit TypeScript API. `GaTablePagination`
consumers do not gain a second disabled state, avoiding conflicting sources of
truth.

## Testing

- Verify `GaPagination` defaults `disabled` to false.
- Verify `GaPagination` passes `disabled=true` to `ElPagination`.
- Keep coverage for forwarding undeclared attributes such as
  `hide-on-single-page`.
- Verify `GaTablePagination.loading=true` loads the table and disables the
  pagination.
- Verify the omitted/default loading state leaves pagination enabled.
- Verify the composite runtime props do not expose an independent `disabled`
  property.

## Documentation

Document the new `GaPagination.disabled` prop and clarify that
`GaTablePagination.loading` also disables pagination interaction.
