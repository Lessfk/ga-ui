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
    :ariaLabel="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />

  <SearchSelectField
    v-else-if="props.field.type === 'select'"
    :model-value="props.modelValue"
    :field="props.field"
    :disabled="props.disabled"
    :placeholder="placeholder"
    :ariaLabel="ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />

  <SearchDateField
    v-else-if="dateField"
    :model-value="props.modelValue"
    :field="dateField"
    :disabled="props.disabled"
    :placeholder="placeholder"
    :ariaLabel="ariaLabel"
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
} from './props'

const props = defineProps<{
  modelValue?: unknown
  field: GaSearchField
  disabled: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
}>()

const slots = useSlots()
const placeholder = computed(() => resolveFieldPlaceholder(props.field))
const ariaLabel = computed(() => resolveFieldAriaLabel(props.field))
const dateField = computed(() =>
  isDateField(props.field) ? props.field : undefined,
)
let warnedMissingSlotKey: string | undefined

function isDateField(field: GaSearchField): field is GaSearchDateField {
  return (
    field.type === 'date' ||
    field.type === 'datetime' ||
    field.type === 'daterange' ||
    field.type === 'datetimerange'
  )
}

function updateCustomField(value: unknown) {
  emit('update:modelValue', value)
  emit('change', value)
}

watchEffect(() => {
  if (!import.meta.env.DEV) return

  const missingSlotKey =
    props.field.type === 'custom' && !slots.default
      ? props.field.key
      : undefined

  if (!missingSlotKey) {
    warnedMissingSlotKey = undefined
    return
  }

  if (warnedMissingSlotKey === missingSlotKey) return
  warnedMissingSlotKey = missingSlotKey
  console.warn(
    `[GaSearchBar] Missing slot "field-${missingSlotKey}" for custom field.`,
  )
})
</script>
