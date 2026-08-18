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
      :key="getOptionKey(option.value)"
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
import type { GaSearchOption, GaSearchSelectField } from '../props'

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

function getOptionKey(value: GaSearchOption['value']) {
  return `${typeof value}:${String(value)}`
}
</script>
