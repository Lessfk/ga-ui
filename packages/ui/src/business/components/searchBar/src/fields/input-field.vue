<template>
  <ElInput
    v-bind="componentProps"
    :model-value="inputValue"
    :type="inputType"
    :disabled="props.disabled"
    :placeholder="props.placeholder"
    :aria-label="props.ariaLabel"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @keydown.enter="handleEnter"
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
  'update:modelValue': [value: string | number]
  change: [value: string | number]
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
const inputType = computed(() =>
  props.field.type === 'input' ? 'text' : 'textarea',
)

function handleEnter(event: Event) {
  const keyboardEvent = event as KeyboardEvent

  if (
    props.field.type === 'input' &&
    !keyboardEvent.isComposing &&
    keyboardEvent.keyCode !== 229
  ) {
    keyboardEvent.preventDefault()
    emit('search')
  }
}
</script>
