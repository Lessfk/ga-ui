# GaSearchBar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable Element Plus search bar with data-driven input, select, and date fields, slot overrides, responsive layout, collapse behavior, validation, search/reset events, and public library exports.

**Architecture:** `GaSearchBar` is a business component built from `ElForm`, `ElRow`, and `ElCol`. Private field components isolate Element Plus input, select, and date-picker behavior; a private renderer chooses the correct field component while the public component owns the draft model, slots, actions, validation, collapse state, and reset semantics.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript 5.8, Element Plus 2.14, SCSS, Vitest 3, Vue Test Utils, Vite library mode, pnpm.

---

## File Map

Create these focused files:

- `packages/ui/src/business/components/searchBar/types/index.ts`: all public types.
- `packages/ui/src/business/components/searchBar/src/props.ts`: public type re-exports for the component implementation.
- `packages/ui/src/business/components/searchBar/src/field.ts`: pure placeholder, prop-sanitizing, cloning, and reset helpers.
- `packages/ui/src/business/components/searchBar/src/fields/input-field.vue`: `ElInput` adapter.
- `packages/ui/src/business/components/searchBar/src/fields/select-field.vue`: `ElSelect` adapter.
- `packages/ui/src/business/components/searchBar/src/fields/date-field.vue`: `ElDatePicker` adapter.
- `packages/ui/src/business/components/searchBar/src/field-renderer.vue`: private field dispatcher.
- `packages/ui/src/business/components/searchBar/src/index.vue`: form, layout, slots, collapse, actions, validation, events, and exposed API.
- `packages/ui/src/business/components/searchBar/style/index.scss`: component layout styles.
- `packages/ui/src/business/components/searchBar/index.ts`: public component entry.
- `packages/ui/src/business/components/searchBar/src/__tests__/*.spec.ts`: unit coverage.
- `playground/src/demos/SearchBarDemo.vue`: interactive examples.

Modify these existing files:

- `packages/ui/src/business/index.ts`: export `GaSearchBar` from the business entry.
- `packages/ui/src/__tests__/exports.spec.ts`: verify runtime and public type exports.
- `packages/ui/scripts/verify-exports.mjs`: verify built package entry exports.
- `packages/ui/scripts/verify-build.mjs`: verify the search bar CSS and runtime export lists.
- `packages/ui/scripts/fixtures/node-next-consumer/index.ts`: compile-test package types as a NodeNext consumer.
- `packages/ui/README.md`: document configuration, events, slots, and exposed methods.
- `playground/src/App.vue`: render the search bar demo.

Do not modify or revert the existing package version change or unrelated table/pagination test changes.

### Task 1: Public Field Types And Pure Helpers

**Files:**
- Create: `packages/ui/src/business/components/searchBar/types/index.ts`
- Create: `packages/ui/src/business/components/searchBar/src/props.ts`
- Create: `packages/ui/src/business/components/searchBar/src/field.ts`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/field.spec.ts`

- [ ] **Step 1: Write the failing helper tests**

Create `field.spec.ts` with tests for placeholder generation, controlled prop removal, deep value cloning, and reset precedence:

```ts
import { describe, expect, it } from 'vitest'

import {
  buildResetModel,
  captureInitialValues,
  cloneSearchModel,
  resolveFieldAriaLabel,
  resolveFieldPlaceholder,
  sanitizeComponentProps,
} from '../field'
import type { GaSearchField } from '../props'

const fields: GaSearchField[] = [
  { key: 'keyword', type: 'input', label: '关键词' },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    defaultValue: 'enabled',
    options: [],
  },
  { key: 'createdAt', type: 'date', label: '创建日期' },
]

describe('search field helpers', () => {
  it('generates placeholders by field family', () => {
    expect(resolveFieldPlaceholder(fields[0], 'placeholder')).toBe('请输入关键词')
    expect(resolveFieldPlaceholder(fields[1], 'placeholder')).toBe('请选择状态')
    expect(resolveFieldPlaceholder(fields[2], 'placeholder')).toBe('请选择创建日期')
    expect(resolveFieldPlaceholder(fields[0], 'none')).toBeUndefined()
  })

  it('keeps explicit placeholders and accessible labels', () => {
    const field: GaSearchField = {
      key: 'keyword',
      type: 'input',
      label: '关键词',
      placeholder: '姓名或手机号',
      ariaLabel: '用户关键词',
    }

    expect(resolveFieldPlaceholder(field, 'placeholder')).toBe('姓名或手机号')
    expect(resolveFieldAriaLabel(field)).toBe('用户关键词')
  })

  it('removes props controlled by the field adapters', () => {
    const result = sanitizeComponentProps({
      clearable: true,
      modelValue: 'ignored',
      type: 'month',
      disabled: true,
      placeholder: 'ignored',
      'aria-label': 'ignored',
      'onUpdate:modelValue': () => undefined,
      onChange: () => undefined,
    })

    expect(result).toEqual({ clearable: true })
  })

  it('clones nested query values without sharing arrays or dates', () => {
    const source = {
      range: ['2026-08-01', '2026-08-18'],
      meta: { enabled: true },
      date: new Date('2026-08-18T00:00:00.000Z'),
    }
    const cloned = cloneSearchModel(source)

    expect(cloned).toEqual(source)
    expect(cloned).not.toBe(source)
    expect(cloned.range).not.toBe(source.range)
    expect(cloned.meta).not.toBe(source.meta)
    expect(cloned.date).not.toBe(source.date)
  })

  it('uses field defaults, then initial values, and preserves unknown keys', () => {
    const initial = captureInitialValues(
      { keyword: 'initial', status: 'disabled', traceId: 'trace-1' },
      fields,
    )
    const reset = buildResetModel(
      { keyword: 'changed', status: 'pending', traceId: 'trace-2' },
      fields,
      initial,
    )

    expect(reset).toEqual({
      keyword: 'initial',
      status: 'enabled',
      traceId: 'trace-2',
      createdAt: undefined,
    })
  })
})
```

- [ ] **Step 2: Run the helper test and verify RED**

Run from `packages/ui`:

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__/field.spec.ts
```

Expected: FAIL because `../field` and `../props` do not exist.

- [ ] **Step 3: Add the public types**

Create `types/index.ts` with the exact public contracts from the design:

```ts
import type {
  ColProps,
  FormInstance,
  FormRules,
} from 'element-plus'

export type GaSearchModel = Record<string, unknown>
export type GaSearchLabelMode = 'label' | 'placeholder' | 'none'

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
  span?: ColProps['span']
  xs?: ColProps['xs']
  sm?: ColProps['sm']
  md?: ColProps['md']
  lg?: ColProps['lg']
  xl?: ColProps['xl']
  componentProps?: Record<string, unknown>
}

export interface GaSearchInputField extends GaSearchBaseField {
  type: 'input' | 'textarea'
}

export interface GaSearchOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface GaSearchSelectField extends GaSearchBaseField {
  type: 'select'
  options?: GaSearchOption[]
}

export interface GaSearchDateField extends GaSearchBaseField {
  type: 'date' | 'datetime' | 'daterange' | 'datetimerange'
  format?: string
  valueFormat?: string
}

export interface GaSearchCustomField extends GaSearchBaseField {
  type: 'custom'
}

export type GaSearchField =
  | GaSearchInputField
  | GaSearchSelectField
  | GaSearchDateField
  | GaSearchCustomField

export interface GaSearchBarProps {
  modelValue: GaSearchModel
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

export interface GaSearchChangePayload {
  key: string
  value: unknown
  model: GaSearchModel
  field: GaSearchField
}

export interface GaSearchBarEmits {
  (event: 'update:modelValue', model: GaSearchModel): void
  (event: 'update:collapsed', collapsed: boolean): void
  (event: 'search', model: GaSearchModel): void
  (event: 'reset', model: GaSearchModel): void
  (event: 'change', payload: GaSearchChangePayload): void
  (event: 'invalid', fields: unknown): void
}

export interface GaSearchBarExpose {
  formRef: FormInstance | undefined
  search: () => Promise<boolean>
  reset: () => void
  validate: () => Promise<boolean>
  clearValidate: () => void
  toggle: () => void
}
```

Create `src/props.ts`:

```ts
export type {
  GaSearchBarEmits,
  GaSearchBarExpose,
  GaSearchBarProps,
  GaSearchChangePayload,
  GaSearchCustomField,
  GaSearchDateField,
  GaSearchField,
  GaSearchInputField,
  GaSearchLabelMode,
  GaSearchModel,
  GaSearchOption,
  GaSearchSelectField,
} from '../types'
```

- [ ] **Step 4: Implement the pure helpers**

Create `src/field.ts`:

```ts
import type {
  GaSearchField,
  GaSearchLabelMode,
  GaSearchModel,
} from './props'

const controlledPropKeys = new Set([
  'modelValue',
  'type',
  'disabled',
  'placeholder',
  'aria-label',
  'onUpdate:modelValue',
  'onChange',
  'onKeyup',
])

export function sanitizeComponentProps(
  source: Record<string, unknown> = {},
  extraControlledKeys: string[] = [],
) {
  const extraKeys = new Set(extraControlledKeys)

  return Object.fromEntries(
    Object.entries(source).filter(
      ([key]) => !controlledPropKeys.has(key) && !extraKeys.has(key),
    ),
  )
}

export function resolveFieldPlaceholder(
  field: GaSearchField,
  labelMode: GaSearchLabelMode,
) {
  if (field.placeholder !== undefined) return field.placeholder

  const componentPlaceholder = field.componentProps?.placeholder
  if (typeof componentPlaceholder === 'string') return componentPlaceholder
  if (labelMode !== 'placeholder') return undefined

  return field.type === 'input' || field.type === 'textarea'
    ? `请输入${field.label}`
    : `请选择${field.label}`
}

export function resolveFieldAriaLabel(field: GaSearchField) {
  return field.ariaLabel ?? field.label
}

export function cloneSearchValue(value: unknown): unknown {
  if (value instanceof Date) return new Date(value.getTime())
  if (Array.isArray(value)) return value.map(cloneSearchValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        cloneSearchValue(nestedValue),
      ]),
    )
  }
  return value
}

export function cloneSearchModel(model: GaSearchModel): GaSearchModel {
  return cloneSearchValue(model) as GaSearchModel
}

export function captureInitialValues(
  model: GaSearchModel,
  fields: GaSearchField[],
) {
  return Object.fromEntries(
    fields.map((field) => [field.key, cloneSearchValue(model[field.key])]),
  )
}

export function buildResetModel(
  currentModel: GaSearchModel,
  fields: GaSearchField[],
  initialValues: GaSearchModel,
) {
  const resetModel = cloneSearchModel(currentModel)

  for (const field of fields) {
    const resetValue = Object.prototype.hasOwnProperty.call(field, 'defaultValue')
      ? field.defaultValue
      : initialValues[field.key]
    resetModel[field.key] = cloneSearchValue(resetValue)
  }

  return resetModel
}
```

- [ ] **Step 5: Run the helper test and verify GREEN**

Run the same Vitest command. Expected: 5 tests PASS.

- [ ] **Step 6: Commit Task 1**

```powershell
git add packages/ui/src/business/components/searchBar/types/index.ts packages/ui/src/business/components/searchBar/src/props.ts packages/ui/src/business/components/searchBar/src/field.ts packages/ui/src/business/components/searchBar/src/__tests__/field.spec.ts
git commit -m "feat: add search bar field contracts"
```

### Task 2: Input Field Adapter

**Files:**
- Create: `packages/ui/src/business/components/searchBar/src/fields/input-field.vue`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/input-field.spec.ts`

- [ ] **Step 1: Write failing input adapter tests**

Cover model updates, component prop forwarding, controlled prop protection, normal input Enter, and textarea Enter:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import SearchInputField from '../fields/input-field.vue'

const ElInputStub = defineComponent({
  name: 'ElInput',
  inheritAttrs: false,
  props: {
    modelValue: [String, Number],
    type: String,
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue', 'change'],
  setup(_, { attrs, emit }) {
    return () => h('input', {
      ...attrs,
      class: 'el-input-stub',
      onInput: (event: Event) =>
        emit('update:modelValue', (event.target as HTMLInputElement).value),
      onChange: (event: Event) =>
        emit('change', (event.target as HTMLInputElement).value),
    })
  },
})

describe('SearchInputField', () => {
  it('forwards safe props and protects controlled bindings', async () => {
    const wrapper = mount(SearchInputField, {
      props: {
        modelValue: 'alice',
        field: {
          key: 'keyword',
          type: 'input',
          label: '关键词',
          componentProps: {
            clearable: true,
            modelValue: 'ignored',
            disabled: false,
          },
        },
        disabled: true,
        placeholder: '姓名或手机号',
        ariaLabel: '用户关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    const input = wrapper.get('.el-input-stub')
    expect(input.attributes('clearable')).toBe('true')
    expect(wrapper.findComponent(ElInputStub).props()).toMatchObject({
      modelValue: 'alice',
      type: 'input',
      disabled: true,
      placeholder: '姓名或手机号',
    })
  })

  it('emits model and change values', async () => {
    const wrapper = mount(SearchInputField, {
      props: {
        modelValue: '',
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    await wrapper.findComponent(ElInputStub).vm.$emit('update:modelValue', 'bob')
    await wrapper.findComponent(ElInputStub).vm.$emit('change', 'bob')
    expect(wrapper.emitted('update:modelValue')).toEqual([['bob']])
    expect(wrapper.emitted('change')).toEqual([['bob']])
  })

  it('searches on Enter only for normal inputs', async () => {
    const input = mount(SearchInputField, {
      props: {
        field: { key: 'keyword', type: 'input', label: '关键词' },
        disabled: false,
        ariaLabel: '关键词',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })
    const textarea = mount(SearchInputField, {
      props: {
        field: { key: 'notes', type: 'textarea', label: '备注' },
        disabled: false,
        ariaLabel: '备注',
      },
      global: { stubs: { ElInput: ElInputStub } },
    })

    await input.get('.el-input-stub').trigger('keyup.enter')
    await textarea.get('.el-input-stub').trigger('keyup.enter')
    expect(input.emitted('search')).toHaveLength(1)
    expect(textarea.emitted('search')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the input test and verify RED**

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__/input-field.spec.ts
```

Expected: FAIL because `input-field.vue` does not exist.

- [ ] **Step 3: Implement `input-field.vue`**

```vue
<template>
  <ElInput
    v-bind="componentProps"
    :model-value="inputValue"
    :type="props.field.type"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :aria-label="props.ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @keyup.enter="handleEnter"
  />
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { computed } from 'vue'

import { sanitizeComponentProps } from '../field'
import type { GaSearchInputField } from '../props'

const props = defineProps<{
  modelValue?: unknown
  field: GaSearchInputField
  disabled: boolean
  placeholder?: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  search: []
}>()

const componentProps = computed(() =>
  sanitizeComponentProps(props.field.componentProps),
)
const inputValue = computed(() =>
  typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
    ? props.modelValue
    : '',
)

function handleEnter() {
  if (props.field.type === 'input') emit('search')
}
</script>
```

- [ ] **Step 4: Run the input test and verify GREEN**

Expected: 3 tests PASS.

- [ ] **Step 5: Commit Task 2**

```powershell
git add packages/ui/src/business/components/searchBar/src/fields/input-field.vue packages/ui/src/business/components/searchBar/src/__tests__/input-field.spec.ts
git commit -m "feat: add search input field adapter"
```

### Task 3: Select Field Adapter

**Files:**
- Create: `packages/ui/src/business/components/searchBar/src/fields/select-field.vue`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/select-field.spec.ts`

- [ ] **Step 1: Write failing select tests**

Use Element Plus stubs and assert option labels, values, disabled state, safe prop forwarding, model updates, and change events:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import SearchSelectField from '../fields/select-field.vue'

const ElSelectStub = defineComponent({
  name: 'ElSelect',
  inheritAttrs: false,
  props: { modelValue: null, disabled: Boolean, placeholder: String },
  emits: ['update:modelValue', 'change'],
  setup(_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'el-select-stub' }, slots.default?.())
  },
})
const ElOptionStub = defineComponent({
  name: 'ElOption',
  props: { label: String, value: null, disabled: Boolean },
  setup(props) {
    return () => h('div', {
      class: 'el-option-stub',
      'data-label': props.label,
      'data-value': String(props.value),
      'data-disabled': String(props.disabled),
    })
  },
})

describe('SearchSelectField', () => {
  it('renders configured options and forwards select props', () => {
    const wrapper = mount(SearchSelectField, {
      props: {
        modelValue: 'enabled',
        field: {
          key: 'status',
          type: 'select',
          label: '状态',
          options: [
            { label: '启用', value: 'enabled' },
            { label: '禁用', value: 'disabled', disabled: true },
          ],
          componentProps: { clearable: true, multiple: true },
        },
        disabled: false,
        placeholder: '请选择状态',
        ariaLabel: '状态',
      },
      global: { stubs: { ElSelect: ElSelectStub, ElOption: ElOptionStub } },
    })

    expect(wrapper.findAll('.el-option-stub')).toHaveLength(2)
    expect(wrapper.findAll('.el-option-stub')[1].attributes('data-disabled')).toBe('true')
    expect(wrapper.get('.el-select-stub').attributes('clearable')).toBe('true')
    expect(wrapper.get('.el-select-stub').attributes('multiple')).toBe('true')
  })

  it('emits select model and change values', () => {
    const wrapper = mount(SearchSelectField, {
      props: {
        field: { key: 'status', type: 'select', label: '状态', options: [] },
        disabled: false,
        ariaLabel: '状态',
      },
      global: { stubs: { ElSelect: ElSelectStub, ElOption: ElOptionStub } },
    })

    wrapper.findComponent(ElSelectStub).vm.$emit('update:modelValue', ['enabled'])
    wrapper.findComponent(ElSelectStub).vm.$emit('change', ['enabled'])
    expect(wrapper.emitted('update:modelValue')).toEqual([[['enabled']]])
    expect(wrapper.emitted('change')).toEqual([[['enabled']]])
  })
})
```

- [ ] **Step 2: Run the select test and verify RED**

Run the select spec directly. Expected: FAIL because the component is missing.

- [ ] **Step 3: Implement `select-field.vue`**

```vue
<template>
  <ElSelect
    v-bind="componentProps"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :aria-label="props.ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  >
    <ElOption
      v-for="option in props.field.options ?? []"
      :key="String(option.value)"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
    />
  </ElSelect>
</template>

<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { computed } from 'vue'

import { sanitizeComponentProps } from '../field'
import type { GaSearchSelectField } from '../props'

const props = defineProps<{
  modelValue?: unknown
  field: GaSearchSelectField
  disabled: boolean
  placeholder?: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

const componentProps = computed(() =>
  sanitizeComponentProps(props.field.componentProps),
)
</script>
```

- [ ] **Step 4: Run the select test and verify GREEN**

Expected: 2 tests PASS.

- [ ] **Step 5: Commit Task 3**

```powershell
git add packages/ui/src/business/components/searchBar/src/fields/select-field.vue packages/ui/src/business/components/searchBar/src/__tests__/select-field.spec.ts
git commit -m "feat: add search select field adapter"
```

### Task 4: Date Field Adapter

**Files:**
- Create: `packages/ui/src/business/components/searchBar/src/fields/date-field.vue`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/date-field.spec.ts`

- [ ] **Step 1: Write failing date adapter tests**

Assert date type, display format, value format, placeholders, safe passthrough, model update, and change:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

import SearchDateField from '../fields/date-field.vue'

const ElDatePickerStub = defineComponent({
  name: 'ElDatePicker',
  inheritAttrs: false,
  props: {
    modelValue: null,
    type: String,
    format: String,
    valueFormat: String,
    disabled: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue', 'change'],
  setup(_, { attrs }) {
    return () => h('div', { ...attrs, class: 'el-date-picker-stub' })
  },
})

describe('SearchDateField', () => {
  it('forwards the configured date formats and safe component props', () => {
    const wrapper = mount(SearchDateField, {
      props: {
        modelValue: ['2026-08-01', '2026-08-18'],
        field: {
          key: 'createdAt',
          type: 'daterange',
          label: '创建日期',
          format: 'YYYY年MM月DD日',
          valueFormat: 'YYYY-MM-DD',
          componentProps: {
            unlinkPanels: true,
            type: 'monthrange',
            format: 'ignored',
          },
        },
        disabled: false,
        placeholder: '请选择创建日期',
        ariaLabel: '创建日期',
      },
      global: { stubs: { ElDatePicker: ElDatePickerStub } },
    })

    expect(wrapper.findComponent(ElDatePickerStub).props()).toMatchObject({
      type: 'daterange',
      format: 'YYYY年MM月DD日',
      valueFormat: 'YYYY-MM-DD',
    })
    expect(wrapper.get('.el-date-picker-stub').attributes('unlinkpanels')).toBe('true')
  })

  it('emits date model and change values', () => {
    const wrapper = mount(SearchDateField, {
      props: {
        field: { key: 'createdAt', type: 'date', label: '创建日期' },
        disabled: false,
        ariaLabel: '创建日期',
      },
      global: { stubs: { ElDatePicker: ElDatePickerStub } },
    })

    wrapper.findComponent(ElDatePickerStub).vm.$emit('update:modelValue', '2026-08-18')
    wrapper.findComponent(ElDatePickerStub).vm.$emit('change', '2026-08-18')
    expect(wrapper.emitted('update:modelValue')).toEqual([['2026-08-18']])
    expect(wrapper.emitted('change')).toEqual([['2026-08-18']])
  })
})
```

- [ ] **Step 2: Run the date test and verify RED**

Run the date spec directly. Expected: FAIL because the component is missing.

- [ ] **Step 3: Implement `date-field.vue`**

```vue
<template>
  <ElDatePicker
    v-bind="componentProps"
    :model-value="props.modelValue"
    :type="props.field.type"
    :format="props.field.format"
    :value-format="props.field.valueFormat"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :aria-label="props.ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import { computed } from 'vue'

import { sanitizeComponentProps } from '../field'
import type { GaSearchDateField } from '../props'

const props = defineProps<{
  modelValue?: unknown
  field: GaSearchDateField
  disabled: boolean
  placeholder?: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

const componentProps = computed(() =>
  sanitizeComponentProps(props.field.componentProps, ['format', 'valueFormat']),
)
</script>
```

- [ ] **Step 4: Run the date test and verify GREEN**

Expected: 2 tests PASS.

- [ ] **Step 5: Commit Task 4**

```powershell
git add packages/ui/src/business/components/searchBar/src/fields/date-field.vue packages/ui/src/business/components/searchBar/src/__tests__/date-field.spec.ts
git commit -m "feat: add search date field adapter"
```

### Task 5: Private Field Renderer

**Files:**
- Create: `packages/ui/src/business/components/searchBar/src/field-renderer.vue`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/field-renderer.spec.ts`

- [ ] **Step 1: Write failing renderer tests**

Test dispatch for input/select/date, custom slot priority over built-ins, event forwarding, and a development warning for a custom field without a slot. Stub the three adapters by component name and assert which stub renders.

```ts
it('prioritizes a custom slot over a built-in renderer', () => {
  const wrapper = mount(SearchFieldRenderer, {
    props: {
      modelValue: 'alice',
      field: { key: 'keyword', type: 'input', label: '关键词' },
      disabled: false,
      labelMode: 'placeholder',
    },
    slots: {
      default: ({ value, update }) =>
        h('button', {
          class: 'custom-field',
          onClick: () => update(`${value}-custom`),
        }),
    },
  })

  expect(wrapper.find('.custom-field').exists()).toBe(true)
  expect(wrapper.findComponent({ name: 'SearchInputField' }).exists()).toBe(false)
})
```

Add this table-driven dispatch test:

```ts
it.each([
  ['input', { key: 'keyword', type: 'input', label: '关键词' }, 'SearchInputField'],
  ['select', { key: 'status', type: 'select', label: '状态', options: [] }, 'SearchSelectField'],
  ['daterange', { key: 'createdAt', type: 'daterange', label: '创建日期' }, 'SearchDateField'],
] as const)('dispatches %s fields', (_, field, componentName) => {
  const wrapper = mount(SearchFieldRenderer, {
    props: {
      modelValue: undefined,
      field,
      disabled: false,
      labelMode: 'label',
    },
  })

  expect(wrapper.findComponent({ name: componentName }).exists()).toBe(true)
})
```

Add this event-forwarding test:

```ts
it('forwards built-in field events', () => {
  const wrapper = mount(SearchFieldRenderer, {
    props: {
      modelValue: '',
      field: { key: 'keyword', type: 'input', label: '关键词' },
      disabled: false,
      labelMode: 'label',
    },
  })
  const input = wrapper.findComponent({ name: 'SearchInputField' })

  input.vm.$emit('update:modelValue', 'alice')
  input.vm.$emit('change', 'alice')
  input.vm.$emit('search')

  expect(wrapper.emitted('update:modelValue')).toEqual([['alice']])
  expect(wrapper.emitted('change')).toEqual([['alice']])
  expect(wrapper.emitted('search')).toHaveLength(1)
})
```

- [ ] **Step 2: Run the renderer test and verify RED**

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__/field-renderer.spec.ts
```

Expected: FAIL because `field-renderer.vue` does not exist.

- [ ] **Step 3: Implement `field-renderer.vue`**

```vue
<template>
  <slot
    v-if="slots.default"
    :field="props.field"
    :value="props.modelValue"
    :disabled="props.disabled"
    :update="updateCustomField"
  />

  <SearchInputField
    v-else-if="props.field.type === 'input' || props.field.type === 'textarea'"
    :model-value="props.modelValue"
    :field="props.field"
    :disabled="props.disabled"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @search="emit('search')"
  />

  <SearchSelectField
    v-else-if="props.field.type === 'select'"
    :model-value="props.modelValue"
    :field="props.field"
    :disabled="props.disabled"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />

  <SearchDateField
    v-else-if="dateTypes.has(props.field.type)"
    :model-value="props.modelValue"
    :field="props.field as GaSearchDateField"
    :disabled="props.disabled"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>

<script setup lang="ts">
import { computed, useSlots, watchEffect } from 'vue'

import SearchDateField from './fields/date-field.vue'
import SearchInputField from './fields/input-field.vue'
import SearchSelectField from './fields/select-field.vue'
import {
  resolveFieldAriaLabel,
  resolveFieldPlaceholder,
} from './field'
import type {
  GaSearchDateField,
  GaSearchField,
  GaSearchLabelMode,
} from './props'

const props = defineProps<{
  modelValue?: unknown
  field: GaSearchField
  disabled: boolean
  labelMode: GaSearchLabelMode
}>()
const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  search: []
}>()
const slots = useSlots()
const dateTypes = new Set(['date', 'datetime', 'daterange', 'datetimerange'])
const placeholder = computed(() =>
  resolveFieldPlaceholder(props.field, props.labelMode),
)
const ariaLabel = computed(() => resolveFieldAriaLabel(props.field))

function updateCustomField(value: unknown) {
  emit('update:modelValue', value)
  emit('change', value)
}

watchEffect(() => {
  if (import.meta.env.DEV && props.field.type === 'custom' && !slots.default) {
    console.warn(
      `[GaSearchBar] Missing slot "field-${props.field.key}" for custom field.`,
    )
  }
})
</script>
```

- [ ] **Step 4: Run all field tests and verify GREEN**

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__/field.spec.ts src/business/components/searchBar/src/__tests__/input-field.spec.ts src/business/components/searchBar/src/__tests__/select-field.spec.ts src/business/components/searchBar/src/__tests__/date-field.spec.ts src/business/components/searchBar/src/__tests__/field-renderer.spec.ts
```

Expected: all field test files PASS.

- [ ] **Step 5: Commit Task 5**

```powershell
git add packages/ui/src/business/components/searchBar/src/field-renderer.vue packages/ui/src/business/components/searchBar/src/__tests__/field-renderer.spec.ts
git commit -m "feat: add search field renderer"
```

### Task 6: Search Bar Layout, Model, Labels, Slots, And Collapse

**Files:**
- Create: `packages/ui/src/business/components/searchBar/src/index.vue`
- Create: `packages/ui/src/business/components/searchBar/style/index.scss`
- Test: `packages/ui/src/business/components/searchBar/src/__tests__/search-bar.spec.ts`

- [ ] **Step 1: Write failing layout and model tests**

Start `search-bar.spec.ts` with this reusable test scaffold:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import GaSearchBar from '../index.vue'
import type { GaSearchBarExpose } from '../props'

const clearValidateSpy = vi.fn()
const ElFormStub = defineComponent({
  name: 'ElForm',
  inheritAttrs: false,
  props: {
    model: Object,
    rules: Object,
    labelWidth: [String, Number],
    disabled: Boolean,
  },
  setup(_, { attrs, slots, expose }) {
    const validationFailure = inject<unknown>('formValidationFailure', undefined)
    expose({
      validate: () =>
        validationFailure
          ? Promise.reject(validationFailure)
          : Promise.resolve(true),
      clearValidate: clearValidateSpy,
    })
    return () => h('form', { ...attrs, class: 'el-form-stub' }, slots.default?.())
  },
})
const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  props: {
    prop: String,
    label: String,
    labelWidth: [String, Number],
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'el-form-item-stub' }, [
      props.label ? h('label', props.label) : null,
      slots.default?.(),
    ])
  },
})
const ElRowStub = defineComponent({
  name: 'ElRow',
  props: { gutter: Number },
  setup(_, { slots }) {
    return () => h('div', { class: 'el-row-stub' }, slots.default?.())
  },
})
const ElColStub = defineComponent({
  name: 'ElCol',
  props: {
    span: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object],
  },
  setup(_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'el-col-stub' }, slots.default?.())
  },
})
const ElButtonStub = defineComponent({
  name: 'ElButton',
  inheritAttrs: false,
  props: {
    type: String,
    nativeType: String,
    loading: Boolean,
    disabled: Boolean,
    link: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () => h('button', {
      ...attrs,
      class: 'el-button-stub',
      type: props.nativeType ?? 'button',
      disabled: props.disabled,
    }, slots.default?.())
  },
})
const SearchFieldRendererStub = defineComponent({
  name: 'SearchFieldRenderer',
  props: {
    modelValue: null,
    field: { type: Object, required: true },
    disabled: Boolean,
    labelMode: String,
  },
  emits: ['update:modelValue', 'change', 'search'],
  setup(props, { emit, slots }) {
    return () => h('div', {
      class: 'search-field-renderer-stub',
      'data-key': (props.field as { key: string }).key,
    }, slots.default?.({
      field: props.field,
      value: props.modelValue,
      disabled: props.disabled,
      update: (value: unknown) => {
        emit('update:modelValue', value)
        emit('change', value)
      },
    }))
  },
})

function mountSearchBar(options: NonNullable<Parameters<typeof mount>[1]>) {
  return mount(GaSearchBar, {
    ...options,
    global: {
      ...options?.global,
      stubs: {
        ElForm: ElFormStub,
        ElFormItem: ElFormItemStub,
        ElRow: ElRowStub,
        ElCol: ElColStub,
        ElButton: ElButtonStub,
        SearchFieldRenderer: SearchFieldRendererStub,
        ...options?.global?.stubs,
      },
    },
  })
}

beforeEach(() => {
  clearValidateSpy.mockClear()
})
```

Add tests that assert:

```ts
it('renders only the collapsed visible field count and keeps hidden values', () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: '', status: '', hiddenValue: 'keep' },
      fields: [
        { key: 'keyword', type: 'input', label: '关键词' },
        { key: 'status', type: 'select', label: '状态', options: [] },
        { key: 'createdAt', type: 'date', label: '日期' },
        { key: 'hiddenValue', type: 'input', label: '隐藏', hidden: true },
      ],
      collapsed: true,
      collapsedCount: 2,
    },
  })

  expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
  expect(wrapper.text()).not.toContain('隐藏')
})

it('uses per-field label mode and responsive columns', () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: {},
      labelMode: 'placeholder',
      labelWidth: 96,
      fields: [
        {
          key: 'keyword',
          type: 'input',
          label: '关键词',
          labelMode: 'label',
          span: 6,
          xs: 24,
          sm: 12,
          md: 8,
          lg: 6,
        },
        { key: 'status', type: 'select', label: '状态', options: [] },
      ],
    },
  })

  const items = wrapper.findAllComponents({ name: 'ElFormItem' })
  expect(items[0].props()).toMatchObject({ label: '关键词', labelWidth: 96 })
  expect(items[1].props()).toMatchObject({ labelWidth: 0 })
  expect(wrapper.findAllComponents({ name: 'ElCol' })[0].props()).toMatchObject({
    span: 6,
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
  })
})

it('emits immutable model and change payloads', async () => {
  const model = { keyword: '', traceId: 'trace-1' }
  const wrapper = mountSearchBar({
    props: {
      modelValue: model,
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
    },
  })
  const field = wrapper.findComponent({ name: 'SearchFieldRenderer' })

  field.vm.$emit('update:modelValue', 'alice')
  field.vm.$emit('change', 'alice')
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual({
    keyword: 'alice',
    traceId: 'trace-1',
  })
  expect(wrapper.emitted('update:modelValue')?.[0][0]).not.toBe(model)
  expect(wrapper.emitted('change')?.[0][0]).toMatchObject({
    key: 'keyword',
    value: 'alice',
  })
})
```

Add the following slot, collapse, and warning tests:

```ts
it('renders structural and field override slots', () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: '' },
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
    },
    slots: {
      prepend: '<div class="prepend-slot">前置</div>',
      append: '<div class="append-slot">后置</div>',
      'field-keyword': '<div class="keyword-slot">自定义关键词</div>',
      actions: '<div class="actions-slot">自定义操作</div>',
    },
  })

  expect(wrapper.find('.prepend-slot').exists()).toBe(true)
  expect(wrapper.find('.append-slot').exists()).toBe(true)
  expect(wrapper.find('.keyword-slot').exists()).toBe(true)
  expect(wrapper.find('.actions-slot').exists()).toBe(true)
})

it('toggles collapsed state and emits its model update', async () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: {},
      collapsed: true,
      collapsedCount: 1,
      fields: [
        { key: 'keyword', type: 'input', label: '关键词' },
        { key: 'status', type: 'select', label: '状态', options: [] },
      ],
    },
  })

  await wrapper.get('[data-action="toggle"]').trigger('click')
  expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  expect(wrapper.findAll('.search-field-renderer-stub')).toHaveLength(2)
})

it('warns about duplicate field keys in development', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  mountSearchBar({
    props: {
      modelValue: {},
      fields: [
        { key: 'keyword', type: 'input', label: '关键词' },
        { key: 'keyword', type: 'input', label: '重复关键词' },
      ],
    },
  })

  expect(warn).toHaveBeenCalledWith(
    '[GaSearchBar] Duplicate field key "keyword".',
  )
  warn.mockRestore()
})
```

Give the default collapse button `data-action="toggle"` so the test targets a stable command rather than button text.

- [ ] **Step 2: Run the search bar spec and verify RED**

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__/search-bar.spec.ts
```

Expected: FAIL because `index.vue` does not exist.

- [ ] **Step 3: Implement the search bar shell**

Create `src/index.vue` with this structure and behavior:

```vue
<template>
  <div v-bind="$attrs" class="ga-search-bar">
    <ElForm
      ref="formRef"
      class="ga-search-bar__form"
      :model="draftModel"
      :rules="props.rules"
      :label-width="props.labelWidth"
      :disabled="props.disabled"
      @submit.prevent="search"
    >
      <ElRow :gutter="props.gutter">
        <slot name="prepend" />

        <ElCol
          v-for="field in displayedFields"
          :key="field.key"
          v-bind="getColumnProps(field)"
          class="ga-search-bar__field-col"
        >
          <ElFormItem
            class="ga-search-bar__item"
            :prop="field.key"
            :label="getFieldLabel(field)"
            :label-width="getFieldLabelWidth(field)"
          >
            <SearchFieldRenderer
              :model-value="draftModel[field.key]"
              :field="field"
              :disabled="props.disabled || field.disabled === true"
              :label-mode="getFieldLabelMode(field)"
              @update:model-value="updateField(field, $event)"
              @change="emitFieldChange(field, $event)"
              @search="search"
            >
              <template v-if="hasFieldSlot(field)" #default="slotProps">
                <slot
                  :name="getFieldSlotName(field)"
                  v-bind="slotProps"
                />
              </template>
            </SearchFieldRenderer>
          </ElFormItem>
        </ElCol>

        <slot name="append" />

        <ElCol
          v-if="showActions"
          v-bind="defaultColumnProps"
          class="ga-search-bar__actions-col"
        >
          <ElFormItem class="ga-search-bar__actions-item" :label-width="0">
            <slot
              name="actions"
              :search="search"
              :reset="reset"
              :validate="validate"
              :clear-validate="clearValidate"
              :collapsed="currentCollapsed"
              :toggle="toggle"
              :loading="props.loading"
              :disabled="props.disabled"
            >
              <div class="ga-search-bar__actions">
                <ElButton
                  v-if="props.showSearch"
                  type="primary"
                  native-type="submit"
                  :loading="props.loading"
                  :disabled="props.disabled"
                >
                  查询
                </ElButton>
                <ElButton
                  v-if="props.showReset"
                  native-type="button"
                  :disabled="props.disabled"
                  @click="reset"
                >
                  重置
                </ElButton>
                <ElButton
                  v-if="canCollapse"
                  data-action="toggle"
                  type="primary"
                  link
                  native-type="button"
                  :disabled="props.disabled"
                  @click="toggle"
                >
                  {{ currentCollapsed ? '展开' : '收起' }}
                </ElButton>
              </div>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>
```

Begin the component script with these imports and options:

```ts
import {
  ElButton,
  ElCol,
  ElForm,
  ElFormItem,
  ElRow,
} from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  computed,
  ref,
  useSlots,
  watch,
  watchEffect,
} from 'vue'

import SearchFieldRenderer from './field-renderer.vue'
import {
  buildResetModel,
  captureInitialValues,
  cloneSearchModel,
} from './field'
import type {
  GaSearchBarEmits,
  GaSearchBarProps,
  GaSearchField,
} from './props'

defineOptions({
  name: 'GaSearchBar',
  inheritAttrs: false,
})
```

The script must use a private cloned draft model so a field update never mutates `modelValue` and a same-tick search sees the latest value:

```ts
const props = withDefaults(defineProps<GaSearchBarProps>(), {
  labelMode: 'label',
  labelWidth: 'auto',
  gutter: 16,
  collapsed: true,
  collapsedCount: 3,
  loading: false,
  disabled: false,
  validateOnSearch: false,
  showSearch: true,
  showReset: true,
  showCollapse: true,
})
const emit = defineEmits<GaSearchBarEmits>()
const slots = useSlots()
const formRef = ref<FormInstance>()
const draftModel = ref(cloneSearchModel(props.modelValue))
const initialValues = captureInitialValues(props.modelValue, props.fields)
const currentCollapsed = ref(props.collapsed)

watch(
  () => props.modelValue,
  (model) => {
    draftModel.value = cloneSearchModel(model)
  },
  { deep: true },
)
watch(
  () => props.collapsed,
  (collapsed) => {
    currentCollapsed.value = collapsed
  },
)
```

Implement the computed state and methods with these exact rules:

```ts
const defaultColumnProps = {
  span: 6,
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6,
}
const visibleFields = computed(() => props.fields.filter((field) => !field.hidden))
const canCollapse = computed(
  () => props.showCollapse && visibleFields.value.length > props.collapsedCount,
)
const displayedFields = computed(() =>
  currentCollapsed.value && canCollapse.value
    ? visibleFields.value.slice(0, props.collapsedCount)
    : visibleFields.value,
)
const showActions = computed(
  () => Boolean(slots.actions) || props.showSearch || props.showReset || canCollapse.value,
)

function getFieldLabelMode(field: GaSearchField) {
  return field.labelMode ?? props.labelMode
}
function getFieldLabel(field: GaSearchField) {
  return getFieldLabelMode(field) === 'label' ? field.label : undefined
}
function getFieldLabelWidth(field: GaSearchField) {
  return getFieldLabelMode(field) === 'label' ? props.labelWidth : 0
}
function getColumnProps(field: GaSearchField) {
  return {
    span: field.span ?? defaultColumnProps.span,
    xs: field.xs ?? defaultColumnProps.xs,
    sm: field.sm ?? defaultColumnProps.sm,
    md: field.md ?? defaultColumnProps.md,
    lg: field.lg ?? defaultColumnProps.lg,
    xl: field.xl ?? defaultColumnProps.xl,
  }
}
function getFieldSlotName(field: GaSearchField) {
  return `field-${field.key}`
}
function hasFieldSlot(field: GaSearchField) {
  return Boolean(slots[getFieldSlotName(field)])
}
function updateField(field: GaSearchField, value: unknown) {
  const model = { ...draftModel.value, [field.key]: value }
  draftModel.value = model
  emit('update:modelValue', cloneSearchModel(model))
}
function emitFieldChange(field: GaSearchField, value: unknown) {
  const model = { ...draftModel.value, [field.key]: value }
  emit('change', { field, key: field.key, value, model: cloneSearchModel(model) })
}
function toggle() {
  currentCollapsed.value = !currentCollapsed.value
  emit('update:collapsed', currentCollapsed.value)
}
```

Add this development-only duplicate-key check:

```ts
watchEffect(() => {
  if (!import.meta.env.DEV) return

  const keys = new Set<string>()
  for (const field of props.fields) {
    if (keys.has(field.key)) {
      console.warn(`[GaSearchBar] Duplicate field key "${field.key}".`)
    }
    keys.add(field.key)
  }
})
```

Task 7 supplies the final `search`, `reset`, `validate`, `clearValidate`, and
`defineExpose` method bodies. For Task 6, use these compiling temporary methods
so the behavior tests added in Task 7 fail for the intended reason:

```ts
async function validate() {
  return true
}
async function search() {
  return false
}
function clearValidate() {}
function reset() {}
```

- [ ] **Step 4: Add initial layout styles**

Create `style/index.scss`:

```scss
.ga-search-bar {
  width: 100%;

  &__form {
    width: 100%;
  }

  &__item,
  &__actions-item {
    width: 100%;
  }

  &__item {
    .el-input,
    .el-select,
    .el-date-editor {
      width: 100%;
    }
  }

  &__actions-item {
    .el-form-item__content {
      justify-content: flex-end;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;

    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
```

Import it from `index.vue`:

```vue
<style lang="scss">
@use '../style/index.scss';
</style>
```

- [ ] **Step 5: Run the search bar spec and verify GREEN for layout tests**

Run the direct search bar spec. Expected: layout, model, label, slot, collapse, and warning tests PASS.

- [ ] **Step 6: Commit Task 6**

```powershell
git add packages/ui/src/business/components/searchBar/src/index.vue packages/ui/src/business/components/searchBar/style/index.scss packages/ui/src/business/components/searchBar/src/__tests__/search-bar.spec.ts
git commit -m "feat: add search bar layout and slots"
```

### Task 7: Search, Validation, Reset, Loading, And Exposed Methods

**Files:**
- Modify: `packages/ui/src/business/components/searchBar/src/index.vue`
- Modify: `packages/ui/src/business/components/searchBar/src/__tests__/search-bar.spec.ts`

- [ ] **Step 1: Add failing behavior tests**

Add tests with an `ElForm` stub that exposes `validate` and `clearValidate`. Cover:

```ts
it('validates before search and emits a cloned draft model', async () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: 'alice' },
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      validateOnSearch: true,
    },
  })

  const searched = await (wrapper.vm as unknown as GaSearchBarExpose).search()
  expect(searched).toBe(true)
  expect(wrapper.emitted('search')).toEqual([[{ keyword: 'alice' }]])
  expect(wrapper.emitted('search')?.[0][0]).not.toBe(wrapper.props('modelValue'))
})

it('emits invalid and blocks search after failed validation', async () => {
  const invalidFields = { keyword: [{ message: '必填' }] }
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: '' },
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
      validateOnSearch: true,
    },
    global: {
      provide: { formValidationFailure: invalidFields },
    },
  })

  const searched = await (wrapper.vm as unknown as GaSearchBarExpose).search()
  expect(searched).toBe(false)
  expect(wrapper.emitted('search')).toBeUndefined()
  expect(wrapper.emitted('invalid')).toEqual([[invalidFields]])
})

it('blocks repeated searches while loading or disabled', async () => {
  const loading = mountSearchBar({
    props: {
      modelValue: {},
      fields: [],
      loading: true,
    },
  })
  const disabled = mountSearchBar({
    props: {
      modelValue: {},
      fields: [],
      disabled: true,
    },
  })

  expect(await (loading.vm as unknown as GaSearchBarExpose).search()).toBe(false)
  expect(await (disabled.vm as unknown as GaSearchBarExpose).search()).toBe(false)
})

it('resets defaults and initial values while preserving unknown keys', () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: 'initial', status: 'disabled', traceId: 'trace-1' },
      fields: [
        { key: 'keyword', type: 'input', label: '关键词' },
        {
          key: 'status',
          type: 'select',
          label: '状态',
          defaultValue: 'enabled',
          options: [],
        },
      ],
    },
  })

  wrapper.findComponent({ name: 'SearchFieldRenderer' }).vm.$emit(
    'update:modelValue',
    'changed',
  )
  ;(wrapper.vm as unknown as GaSearchBarExpose).reset()

  expect(wrapper.emitted('reset')?.[0][0]).toEqual({
    keyword: 'initial',
    status: 'enabled',
    traceId: 'trace-1',
  })
})
```

Add this exposed API test:

```ts
it('exposes form methods and routes input search through the same guard', async () => {
  const wrapper = mountSearchBar({
    props: {
      modelValue: { keyword: '' },
      fields: [{ key: 'keyword', type: 'input', label: '关键词' }],
    },
  })
  const exposed = wrapper.vm as unknown as GaSearchBarExpose

  expect(exposed.formRef).toBeDefined()
  expect(await exposed.validate()).toBe(true)
  exposed.clearValidate()
  exposed.toggle()
  wrapper.findComponent({ name: 'SearchFieldRenderer' }).vm.$emit('search')
  await wrapper.vm.$nextTick()

  expect(wrapper.emitted('update:collapsed')).toHaveLength(1)
  expect(wrapper.emitted('search')).toEqual([[{ keyword: '' }]])
})
```

- [ ] **Step 2: Run the search bar test and verify RED**

Expected: the new validation, loading, reset, and expose assertions FAIL against the temporary Task 6 methods.

- [ ] **Step 3: Replace the temporary methods with final implementations**

```ts
async function validate() {
  if (!formRef.value) return true
  try {
    return await formRef.value.validate()
  } catch {
    return false
  }
}

async function search() {
  if (props.loading || props.disabled) return false

  if (props.validateOnSearch && formRef.value) {
    try {
      const valid = await formRef.value.validate()
      if (!valid) return false
    } catch (fields) {
      emit('invalid', fields)
      return false
    }
  }

  emit('search', cloneSearchModel(draftModel.value))
  return true
}

function clearValidate() {
  formRef.value?.clearValidate()
}

function reset() {
  const model = buildResetModel(
    draftModel.value,
    props.fields,
    initialValues,
  )
  draftModel.value = model
  emit('update:modelValue', cloneSearchModel(model))
  clearValidate()
  emit('reset', cloneSearchModel(model))
}

defineExpose({
  formRef,
  search,
  reset,
  validate,
  clearValidate,
  toggle,
})
```

Vue unwraps exposed refs on the public component instance, matching
`GaSearchBarExpose.formRef: FormInstance | undefined`. Task 8 verifies the
generated declaration through the NodeNext consumer fixture.

- [ ] **Step 4: Run the complete search bar test and verify GREEN**

Expected: every `search-bar.spec.ts` test PASS.

- [ ] **Step 5: Run every new search bar test**

```powershell
pnpm.cmd exec vitest run src/business/components/searchBar/src/__tests__
```

Expected: all search bar test files PASS with no unhandled promise warnings.

- [ ] **Step 6: Commit Task 7**

```powershell
git add packages/ui/src/business/components/searchBar/src/index.vue packages/ui/src/business/components/searchBar/src/__tests__/search-bar.spec.ts
git commit -m "feat: add search bar actions and validation"
```

### Task 8: Public Entries And Package Verification

**Files:**
- Create: `packages/ui/src/business/components/searchBar/index.ts`
- Modify: `packages/ui/src/business/index.ts`
- Modify: `packages/ui/src/__tests__/exports.spec.ts`
- Modify: `packages/ui/scripts/verify-exports.mjs`
- Modify: `packages/ui/scripts/verify-build.mjs`
- Modify: `packages/ui/scripts/fixtures/node-next-consumer/index.ts`

- [ ] **Step 1: Add failing source export tests and type contracts**

Import `GaSearchBar` from its component barrel, business entry, and root entry. Add `GaSearchBarProps`, `GaSearchBarExpose`, `GaSearchField`, and the concrete field types to the business and root type contracts. Add runtime assertions:

```ts
expect(business.GaSearchBar).toBe(SearchBarBarrel)
expect(library.GaSearchBar).toBe(SearchBarBarrel)
expect(base).not.toHaveProperty('GaSearchBar')
```

Add a compile-time configuration:

```ts
const searchBarProps: GaSearchBarProps = {
  modelValue: { keyword: '', status: undefined },
  fields: [
    { key: 'keyword', type: 'input', label: '关键词' },
    {
      key: 'status',
      type: 'select',
      label: '状态',
      options: [{ label: '启用', value: 1 }],
    },
    {
      key: 'createdAt',
      type: 'daterange',
      label: '创建日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  ],
}
```

Add a `@ts-expect-error` proving `GaSearchBarProps` is not exported from `../base`.

- [ ] **Step 2: Run source type and runtime tests and verify RED**

```powershell
pnpm.cmd run test:type
pnpm.cmd exec vitest run src/__tests__/exports.spec.ts
```

Expected: FAIL because the search bar public entry does not exist.

- [ ] **Step 3: Create the component barrel and business export**

Create `searchBar/index.ts`:

```ts
import GaSearchBar from './src/index.vue'

export { GaSearchBar }
export default GaSearchBar

export type {
  GaSearchBarEmits,
  GaSearchBarExpose,
  GaSearchBarProps,
  GaSearchChangePayload,
  GaSearchCustomField,
  GaSearchDateField,
  GaSearchField,
  GaSearchInputField,
  GaSearchLabelMode,
  GaSearchModel,
  GaSearchOption,
  GaSearchSelectField,
} from './types'
```

Append to `packages/ui/src/business/index.ts`:

```ts
export * from './components/searchBar/index'
```

The root entry already re-exports the complete business entry.

- [ ] **Step 4: Update built export verification**

In `verify-exports.mjs`, add these assertions:

```js
assert.ok(!('GaSearchBar' in base))
assert.ok('GaSearchBar' in business)
assert.ok('GaSearchBar' in root)
```

In `verify-build.mjs`:

- Add `/\.ga-search-bar/` to the required CSS selector list.
- Change the expected business keys to `['GaAsideMenu', 'GaSearchBar', 'GaTablePagination']`.
- Add `GaSearchBar` to the sorted root key list.

In the NodeNext consumer fixture, extend the root import with:

```ts
GaSearchBar,
type GaSearchBarEmits,
type GaSearchBarExpose,
type GaSearchBarProps,
type GaSearchField,
type GaSearchModel,
```

Extend the business import with the aliased contracts:

```ts
GaSearchBar as BusinessSearchBar,
type GaSearchBarProps as BusinessSearchBarProps,
type GaSearchField as BusinessSearchField,
```

Add the base-entry boundary check:

```ts
// @ts-expect-error SearchBar types are not exported from the base entry
import type { GaSearchBarProps as BaseSearchBarProps } from 'ga-ui-plus/base'
```

Add these consumer contracts:

```ts
const rootSearchFields: GaSearchField[] = [
  { key: 'keyword', type: 'input', label: '关键词' },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [{ label: '启用', value: 1 }],
  },
  {
    key: 'createdAt',
    type: 'daterange',
    label: '创建日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
  },
]
const rootSearchModel: GaSearchModel = { keyword: '' }
const rootSearchBarProps: GaSearchBarProps = {
  modelValue: rootSearchModel,
  fields: rootSearchFields,
}
const businessSearchFields: BusinessSearchField[] = rootSearchFields
const businessSearchBarProps: BusinessSearchBarProps = rootSearchBarProps

function checkSearchBarEmits(emit: GaSearchBarEmits) {
  emit('update:modelValue', { keyword: 'alice' })
  emit('update:collapsed', false)
  emit('search', { keyword: 'alice' })
  emit('reset', { keyword: '' })
}

function checkSearchBarExpose(expose: GaSearchBarExpose) {
  void expose.search()
  expose.reset()
  void expose.validate()
  expose.clearValidate()
  expose.toggle()
}

type BaseSearchBarTypeContract = BaseSearchBarProps
const baseSearchBarTypeContract: BaseSearchBarTypeContract | undefined = undefined
```

Add `GaSearchBar`, `BusinessSearchBar`, both field arrays, both props objects,
the two contract functions, and `baseSearchBarTypeContract` to the fixture's
final `void` array.

- [ ] **Step 5: Run source export tests and verify GREEN**

```powershell
pnpm.cmd run test:type
pnpm.cmd exec vitest run src/__tests__/exports.spec.ts
```

Expected: type test and 3 runtime export tests PASS.

- [ ] **Step 6: Build and verify package entries**

```powershell
pnpm.cmd run build
pnpm.cmd run verify:exports
```

Expected: build CSS contains `.ga-search-bar`; build output and NodeNext declarations verify successfully.

- [ ] **Step 7: Commit Task 8**

```powershell
git add packages/ui/src/business/components/searchBar/index.ts packages/ui/src/business/index.ts packages/ui/src/__tests__/exports.spec.ts packages/ui/scripts/verify-exports.mjs packages/ui/scripts/verify-build.mjs packages/ui/scripts/fixtures/node-next-consumer/index.ts
git commit -m "feat: export search bar component"
```

### Task 9: README And Playground Examples

**Files:**
- Create: `playground/src/demos/SearchBarDemo.vue`
- Modify: `playground/src/App.vue`
- Modify: `packages/ui/README.md`

- [ ] **Step 1: Add the Playground demo**

Create `SearchBarDemo.vue` with this complete example. It demonstrates reactive
external options, separate date display/value formats, compact labels, custom
fields, collapse, and event-registered handlers without pagination behavior:

```vue
<template>
  <main class="search-bar-demo">
    <section class="search-bar-demo__section">
      <h2>标准搜索栏</h2>
      <GaSearchBar
        v-model="query"
        v-model:collapsed="collapsed"
        :fields="fields"
        :collapsed-count="3"
        label-width="88px"
        @search="handleSearch"
        @reset="handleReset"
      >
        <template #field-departmentId="{ value, update, disabled }">
          <ElTreeSelect
            :model-value="value"
            :data="departmentTree"
            :disabled="disabled"
            clearable
            check-strictly
            placeholder="请选择部门"
            @update:model-value="update"
          />
        </template>
      </GaSearchBar>
    </section>

    <section class="search-bar-demo__section">
      <h2>紧凑搜索栏</h2>
      <GaSearchBar
        v-model="compactQuery"
        :fields="compactFields"
        label-mode="placeholder"
        :show-collapse="false"
        @search="handleCompactSearch"
        @reset="handleCompactReset"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElTreeSelect } from 'element-plus'
import {
  GaSearchBar,
  type GaSearchField,
  type GaSearchModel,
} from 'ga-ui-plus/business'

const query = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
  createdAt: [],
  departmentId: undefined,
})
const compactQuery = ref<GaSearchModel>({
  keyword: '',
  status: undefined,
})
const collapsed = ref(true)
const statusOptions = ref<{ label: string; value: string }[]>([])
const departmentTree = [
  {
    value: 'product',
    label: '产品中心',
    children: [
      { value: 'design', label: '设计部' },
      { value: 'development', label: '研发部' },
    ],
  },
  {
    value: 'operation',
    label: '运营中心',
    children: [
      { value: 'marketing', label: '市场部' },
      { value: 'customer', label: '客户成功部' },
    ],
  },
]

const fields = computed<GaSearchField[]>(() => [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    componentProps: { clearable: true },
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: statusOptions.value,
    componentProps: { clearable: true },
  },
  {
    key: 'createdAt',
    type: 'daterange',
    label: '创建日期',
    format: 'YYYY年MM月DD日',
    valueFormat: 'YYYY-MM-DD',
    componentProps: { unlinkPanels: true },
  },
  {
    key: 'departmentId',
    type: 'custom',
    label: '部门',
  },
])
const compactFields = computed<GaSearchField[]>(() => [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    componentProps: { clearable: true },
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: statusOptions.value,
    componentProps: { clearable: true },
  },
])

onMounted(async () => {
  await Promise.resolve()
  statusOptions.value = [
    { label: '启用', value: 'enabled' },
    { label: '禁用', value: 'disabled' },
  ]
})

function showPayload(prefix: string, model: GaSearchModel) {
  ElMessage.success(`${prefix}: ${JSON.stringify(model)}`)
}
function handleSearch(model: GaSearchModel) {
  showPayload('查询', model)
}
function handleReset(model: GaSearchModel) {
  showPayload('重置', model)
}
function handleCompactSearch(model: GaSearchModel) {
  showPayload('紧凑查询', model)
}
function handleCompactReset(model: GaSearchModel) {
  showPayload('紧凑重置', model)
}
</script>

<style scoped>
.search-bar-demo {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.search-bar-demo__section {
  padding: 20px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.search-bar-demo__section h2 {
  margin: 0 0 16px;
  font-size: 18px;
  letter-spacing: 0;
}
</style>
```

- [ ] **Step 2: Render the demo from `App.vue`**

Keep the existing demos and add:

```vue
<template>
  <SearchBarDemo />
  <TablePaginationDemo />
  <PaginationDemo />
</template>

<script setup lang="ts">
import PaginationDemo from './demos/PaginationDemo.vue'
import SearchBarDemo from './demos/SearchBarDemo.vue'
import TablePaginationDemo from './demos/TablePaginationDemo.vue'
</script>
```

- [ ] **Step 3: Add README documentation**

Insert a `## GaSearchBar` section before `GaAsideMenu`. Include:

- Import from `ga-ui-plus/business` or package root.
- A basic `v-model` and `fields` example.
- The four built-in field categories.
- `labelMode` values.
- Date `format` versus `valueFormat`.
- Responsive column properties.
- Props, events, field slot, structural slots, and exposed methods tables.
- Reset order: `defaultValue`, then captured initial value.
- Explicit statements that async options, remote search, and pagination belong to the consumer.

Use this event example:

```vue
<GaSearchBar
  ref="searchBarRef"
  v-model="query"
  v-model:collapsed="collapsed"
  :fields="fields"
  label-mode="placeholder"
  @search="handleSearch"
  @reset="handleReset"
/>
```

- [ ] **Step 4: Build the Playground**

Run from `playground`:

```powershell
pnpm.cmd run build
```

Expected: `vue-tsc -b` and Vite build PASS.

- [ ] **Step 5: Commit Task 9**

```powershell
git add playground/src/demos/SearchBarDemo.vue playground/src/App.vue packages/ui/README.md
git commit -m "docs: add search bar examples"
```

### Task 10: Full Release Verification

**Files:**
- Verify only; do not change unrelated files.

- [ ] **Step 1: Run the full UI test suite**

From `packages/ui`:

```powershell
pnpm.cmd run test
```

Expected: type tests and every Vitest file PASS with zero failed tests.

- [ ] **Step 2: Run the production build**

```powershell
pnpm.cmd run build
```

Expected: Vite build, declaration generation, CSS selector checks, runtime export checks, and declaration specifier checks PASS.

- [ ] **Step 3: Verify package exports and consumer types**

```powershell
pnpm.cmd run verify:exports
```

Expected: runtime package exports and TypeScript 5.8 NodeNext fixture PASS.

- [ ] **Step 4: Verify the Playground build again after package output changes**

From `playground`:

```powershell
pnpm.cmd run build
```

Expected: Vue type checking and Vite build PASS.

- [ ] **Step 5: Run an npm publish dry-run**

From `packages/ui`:

```powershell
npm.cmd publish --dry-run
```

Expected: `prepublishOnly` runs the full test/build/export lifecycle and npm reports `+ ga-ui-plus@0.1.4` without publishing.

- [ ] **Step 6: Inspect the final worktree**

```powershell
git status --short
git diff --check
```

Expected: no whitespace errors. Preserve any pre-existing unrelated modifications; report them separately rather than staging or reverting them.
