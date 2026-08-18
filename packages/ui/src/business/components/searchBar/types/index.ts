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
