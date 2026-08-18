<template>
  <ElDatePicker
    v-bind="componentProps"
    :model-value="dateValue"
    :type="props.field.type"
    :format="props.field.format"
    :value-format="props.field.valueFormat"
    :disabled="props.disabled"
    :placeholder="isRange ? undefined : props.placeholder"
    :start-placeholder="isRange ? props.placeholder : undefined"
    :end-placeholder="isRange ? props.placeholder : undefined"
    :aria-label="props.ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  />
</template>

<script setup lang="ts">
import { ElDatePicker } from 'element-plus'
import type { DatePickerProps } from 'element-plus'
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
  sanitizeComponentProps(props.field.componentProps, [
    'format',
    'valueFormat',
    'startPlaceholder',
    'endPlaceholder',
  ]),
)
const dateValue = computed(
  () => asElementDateValue(props.modelValue),
)
const isRange = computed(
  () =>
    props.field.type === 'daterange' ||
    props.field.type === 'datetimerange',
)

function asElementDateValue(value: unknown): DatePickerProps['modelValue'] {
  return value as DatePickerProps['modelValue']
}
</script>
