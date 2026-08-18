# GaSearchBar Design

## Overview

`GaSearchBar` is a business component for building consistent query toolbars on
top of Element Plus. It uses data configuration for common fields and named
slots for business-specific controls. The component owns form presentation,
field rendering, validation, collapse behavior, search, and reset behavior. It
does not own table data, pagination, or remote requests.

The component lives at:

```text
packages/ui/src/business/components/searchBar
```

Only `GaSearchBar` and its public types are exported. Internal field renderer
components remain private so their implementation can change without affecting
consumers.

## Goals

- Provide a data-driven API for common search fields.
- Allow field-level and action-level customization through slots.
- Use Element Plus form and layout components consistently.
- Support responsive layouts and compact, label-free search bars.
- Keep date display formats and submitted value formats configurable.
- Provide predictable search, validation, reset, and collapse behavior.
- Preserve strong TypeScript guidance through discriminated field types.

## Non-Goals

- Fetch select options or table data.
- Manage or reset pagination.
- Include built-in cascader or tree-select fields in the first version.
- Export internal field components as public APIs.
- Introduce a separate search bar theme system.
- Provide a public component registration mechanism in the first version.

## Component Structure

```text
searchBar/
├─ index.ts
├─ types/
│  └─ index.ts
├─ src/
│  ├─ index.vue
│  ├─ props.ts
│  ├─ field-renderer.vue
│  ├─ fields/
│  │  ├─ input-field.vue
│  │  ├─ select-field.vue
│  │  └─ date-field.vue
│  └─ __tests__/
│     ├─ search-bar.spec.ts
│     ├─ input-field.spec.ts
│     ├─ select-field.spec.ts
│     └─ date-field.spec.ts
└─ style/
   └─ index.scss
```

Responsibilities:

- `index.vue` renders `ElForm`, `ElRow`, `ElCol`, collapse behavior, and actions.
- `field-renderer.vue` selects a built-in renderer or a field slot.
- `input-field.vue` handles input, textarea, and Enter-to-search behavior.
- `select-field.vue` handles single-select, multiple-select, and options.
- `date-field.vue` handles all supported `ElDatePicker` modes.

## Public Model

The component uses an object-based `v-model`:

```vue
<GaSearchBar
  v-model="query"
  :fields="fields"
  @search="handleSearch"
  @reset="handleReset"
  @change="handleChange"
/>
```

The component never mutates `modelValue` directly. Field updates create a new
object and emit it:

```ts
emit('update:modelValue', {
  ...props.modelValue,
  [field.key]: value,
})
```

## Props

```ts
export type GaSearchLabelMode = 'label' | 'placeholder' | 'none'

export interface GaSearchBarProps {
  modelValue: Record<string, unknown>
  fields: GaSearchField[]
  labelMode?: GaSearchLabelMode
  labelWidth?: string | number
  gutter?: number
  collapsed?: boolean
  collapsedCount?: number
  loading?: boolean
  disabled?: boolean
  rules?: FormRules
  validateOnSearch?: boolean
  showSearch?: boolean
  showReset?: boolean
  showCollapse?: boolean
}
```

Recommended defaults:

```ts
{
  labelMode: 'label',
  gutter: 16,
  collapsed: true,
  collapsedCount: 3,
  loading: false,
  disabled: false,
  validateOnSearch: false,
  showSearch: true,
  showReset: true,
  showCollapse: true,
}
```

Label width is resolved per `ElFormItem`. A visible label uses the component
`labelWidth`; placeholder and none modes use an item label width of `0`. This
allows a field to opt back into a visible label even when the component default
is label-free.

## Field Types

All field configurations share a common base:

```ts
export interface GaSearchBaseField {
  key: string
  type: string
  label: string
  labelMode?: GaSearchLabelMode
  placeholder?: string
  ariaLabel?: string
  defaultValue?: unknown
  disabled?: boolean
  hidden?: boolean
  span?: number
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  componentProps?: Record<string, unknown>
}
```

The public `GaSearchField` type is a discriminated union:

```ts
export type GaSearchField =
  | GaSearchInputField
  | GaSearchSelectField
  | GaSearchDateField
  | GaSearchCustomField
```

### Input Fields

```ts
export interface GaSearchInputField extends GaSearchBaseField {
  type: 'input' | 'textarea'
}
```

An `input` submits the search when Enter is pressed. A `textarea` keeps normal
newline behavior and does not submit on Enter.

### Select Fields

```ts
export interface GaSearchOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface GaSearchSelectField extends GaSearchBaseField {
  type: 'select'
  options?: GaSearchOption[]
}
```

Single-select and multiple-select behavior is configured through
`componentProps`. Async option loading belongs to the consumer; updating a
reactive `options` array updates the rendered field.

### Date Fields

```ts
export interface GaSearchDateField extends GaSearchBaseField {
  type: 'date' | 'datetime' | 'daterange' | 'datetimerange'
  format?: string
  valueFormat?: string
}
```

`format` controls the displayed date format. `valueFormat` controls the value
stored in the search model and sent to consumer search handlers. Less common
Element Plus date picker options pass through `componentProps`.

### Custom Fields

```ts
export interface GaSearchCustomField extends GaSearchBaseField {
  type: 'custom'
}
```

Custom fields require a matching named slot. This supports controls such as
`ElTreeSelect` without making them built-in field types.

In development, a custom field without a matching slot logs a warning and
renders an empty field body instead of throwing. Duplicate field keys also log
a development warning because they make model updates and named slots
ambiguous.

## Controlled Prop Precedence

`componentProps` is applied before controlled bindings. Consumers cannot
override these internal responsibilities through `componentProps`:

- `modelValue`
- `type` for date fields
- `disabled` after global and field state are resolved
- `aria-label` after accessibility fallbacks are resolved
- `update:modelValue` and internal change handlers

Typed top-level field properties such as `format`, `valueFormat`, and
`placeholder` take precedence over matching values in `componentProps`.

## Labels And Accessibility

Label behavior has three modes:

- `label`: render the field label through `ElFormItem`.
- `placeholder`: omit the visible label and derive a placeholder from `label`.
- `none`: omit the visible label and automatic placeholder text.

Fields may override the component-level label mode. A label is not hidden with
CSS; it is omitted so no empty label width remains.

Even when no text is visible, each control receives an accessible name using:

```text
field.ariaLabel -> field.label
```

For placeholder mode, explicit `field.placeholder` takes precedence over the
placeholder generated from `field.label`. Inputs use `请输入${label}` while
select and date fields use `请选择${label}`.

## Layout And Collapse

The component uses `ElRow` and `ElCol`. Each field can provide a default `span`
and responsive `xs`, `sm`, `md`, `lg`, and `xl` column widths. Controls fill
their column width.

Collapse behavior uses `collapsedCount`, not row measurement. This remains
deterministic when responsive column widths change. Hidden fields do not count
toward the collapsed field limit. The action area remains visible in both
states.

The default collapse control is shown only when all conditions are true:

- `showCollapse` is true.
- The number of visible fields exceeds `collapsedCount`.

When the `actions` slot replaces the default controls, it receives `toggle` and
decides whether to render a collapse control. Field visibility still follows
the current collapsed state.

`collapsed` supports `v-model:collapsed` and defaults to `true`. The component
maintains the current value while emitting `update:collapsed` whenever it is
toggled.

## Search And Validation

A search can be triggered by:

- The default search button.
- Enter in a normal input field.
- The exposed `search()` method.
- A custom action slot calling its provided `search` method.

When `validateOnSearch` is false, search emits immediately. When it is true,
the component validates the Element Plus form first. Successful validation
emits `search` with a shallow snapshot of the current model. Failed validation
does not emit `search`; it emits `invalid` with Element Plus validation fields.

While `loading` is true, repeated search actions are ignored and the default
search button shows its loading state. Search loading does not lock fields.
`disabled` disables all fields and default actions.

The component does not fetch data or change pagination.

## Reset Behavior

The component captures the initial values of configured fields when it is
created. Reset values are resolved in this order:

1. A field's explicit `defaultValue`.
2. The field's captured initial value.

Reset performs these steps:

1. Build a new model for all configured field keys.
2. Emit `update:modelValue` with the reset model.
3. Clear Element Plus validation state after the model update.
4. Emit `reset` with the reset model.

Values belonging to configured hidden fields are reset normally. Keys not
represented by a configured field are preserved so consumers can keep related
query metadata in the same model.

## Events

```ts
export interface GaSearchBarEmits {
  'update:modelValue': [model: Record<string, unknown>]
  'update:collapsed': [collapsed: boolean]
  search: [model: Record<string, unknown>]
  reset: [model: Record<string, unknown>]
  change: [payload: {
    key: string
    value: unknown
    model: Record<string, unknown>
    field: GaSearchField
  }]
  invalid: [fields: unknown]
}
```

Consumer methods are registered through standard Vue event listeners. Function
props are not added for search, reset, or change.

## Slots

### Field Slots

A field named `departmentId` can be overridden with
`#field-departmentId`. The slot receives:

```ts
{
  field: GaSearchField
  value: unknown
  disabled: boolean
  update(value: unknown): void
}
```

The same slot contract applies to `custom` fields and built-in field overrides.

### Structural Slots

- `prepend`: content before configured fields.
- `append`: content after configured fields and before actions.
- `actions`: replaces the default action controls.

The `actions` slot receives:

```ts
{
  search(): Promise<boolean>
  reset(): void
  validate(): Promise<boolean>
  clearValidate(): void
  collapsed: boolean
  toggle(): void
  loading: boolean
  disabled: boolean
}
```

## Exposed API

```ts
export interface GaSearchBarExpose {
  formRef: FormInstance | undefined
  search(): Promise<boolean>
  reset(): void
  validate(): Promise<boolean>
  clearValidate(): void
  toggle(): void
}
```

`search()` returns `true` when a search event is emitted and `false` when it is
blocked by loading, disabled state, or failed validation.

## Styling

The search bar is a full-width business toolbar rather than a card. It uses
Element Plus spacing and color variables. Input controls fill their grid
columns, actions align to the end of the row, and narrow viewports allow the
layout to wrap naturally.

The component forwards root `class` and `style` attributes and does not define
a separate theme prop in the first version.

## Public Exports

The business entry and package root export:

```ts
export {
  GaSearchBar,
  type GaSearchBarProps,
  type GaSearchBarEmits,
  type GaSearchBarExpose,
  type GaSearchLabelMode,
  type GaSearchField,
  type GaSearchInputField,
  type GaSearchSelectField,
  type GaSearchDateField,
  type GaSearchCustomField,
  type GaSearchOption,
}
```

Internal field components are not exported.

## Testing Strategy

Unit tests cover:

- Input and textarea model updates and Enter behavior.
- Select options, single-select, multiple-select, and disabled options.
- Date picker types and `format`/`valueFormat` forwarding.
- Controlled bindings taking precedence over `componentProps`.
- Label, placeholder, and none modes.
- Accessible names in label-free modes.
- Responsive `ElCol` properties.
- Hidden fields and collapsed field limits.
- Search events, validation success, validation failure, disabled state, and
  loading duplicate prevention.
- Reset defaults, captured initial values, hidden fields, and unconfigured model
  keys.
- Field slots, custom fields, structural slots, and action slot methods.
- Exposed methods.
- Business entry and package root exports.

The Playground adds `SearchBarDemo.vue` with:

- A standard labeled query toolbar.
- A compact placeholder-only toolbar.
- Date display and value format examples.
- A custom field slot.
- Reactive select options.
- Collapse and expand behavior.

## Documentation

The package README documents installation imports, field configuration, label
modes, date formats, events, slots, exposed methods, reset semantics, and the
fact that pagination and remote loading remain consumer responsibilities.
