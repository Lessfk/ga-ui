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
  'onKeydown',
])

function normalizeListenerKey(key: string) {
  return key.replace(/(?:Once|Capture|Passive)+$/, '')
}

export function sanitizeComponentProps(
  source: Record<string, unknown> = {},
  extraControlledKeys: string[] = [],
) {
  const extraKeys = new Set(extraControlledKeys)

  return Object.fromEntries(
    Object.entries(source).filter(
      ([key]) => {
        const normalizedKey = normalizeListenerKey(key)
        return (
          !controlledPropKeys.has(normalizedKey) &&
          !extraKeys.has(normalizedKey)
        )
      },
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

function isPlainObject(value: object): value is Record<string, unknown> {
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function cloneSearchValue(value: unknown): unknown {
  if (value instanceof Date) return new Date(value.getTime())
  if (Array.isArray(value)) return value.map(cloneSearchValue)
  if (value && typeof value === 'object' && isPlainObject(value)) {
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
  const resetModel = { ...currentModel }

  for (const field of fields) {
    const resetValue = Object.prototype.hasOwnProperty.call(field, 'defaultValue')
      ? field.defaultValue
      : initialValues[field.key]
    resetModel[field.key] = cloneSearchValue(resetValue)
  }

  return resetModel
}
