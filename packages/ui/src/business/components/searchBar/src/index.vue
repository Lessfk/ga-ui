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
          v-if="shouldShowActions()"
          v-bind="defaultColumnProps"
          class="ga-search-bar__actions-col"
        >
          <ElFormItem class="ga-search-bar__actions-item" :label-width="0">
            <slot
              name="actions"
              :search="search"
              :reset="reset"
              :validate="validate"
              :clearValidate="clearValidate"
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

<script setup lang="ts">
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
  getCurrentInstance,
  ref,
  useSlots,
  watch,
  watchEffect,
} from 'vue'

import SearchFieldRenderer from './field-renderer.vue'
import {
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
const instance = getCurrentInstance()
const formRef = ref<FormInstance>()
const draftModel = ref(cloneSearchModel(props.modelValue))
const initialValues = captureInitialValues(props.modelValue, props.fields)
const currentCollapsed = ref(props.collapsed)
const warnedDuplicateKeys = new Set<string>()

const defaultColumnProps = {
  span: 6,
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6,
}
const visibleFields = computed(() =>
  props.fields.filter((field) => !field.hidden),
)
const canCollapse = computed(
  () =>
    props.showCollapse &&
    visibleFields.value.length > props.collapsedCount,
)
const displayedFields = computed(() =>
  currentCollapsed.value && canCollapse.value
    ? visibleFields.value.slice(0, props.collapsedCount)
    : visibleFields.value,
)
function shouldShowActions() {
  return (
    Boolean(slots.actions) ||
    props.showSearch ||
    props.showReset ||
    canCollapse.value
  )
}

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

watchEffect(() => {
  if (!import.meta.env.DEV) return

  const seenKeys = new Set<string>()
  const duplicateKeys = new Set<string>()

  for (const field of props.fields) {
    if (seenKeys.has(field.key)) duplicateKeys.add(field.key)
    seenKeys.add(field.key)
  }

  for (const key of warnedDuplicateKeys) {
    if (!duplicateKeys.has(key)) warnedDuplicateKeys.delete(key)
  }

  for (const key of duplicateKeys) {
    if (warnedDuplicateKeys.has(key)) continue
    warnedDuplicateKeys.add(key)
    console.warn(`[GaSearchBar] Duplicate field key "${key}".`)
  }
})

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
  emit('change', {
    field,
    key: field.key,
    value,
    model: cloneSearchModel(model),
  })
}

function toggle() {
  const collapsed = !currentCollapsed.value
  const updateListener = instance?.vnode.props?.['onUpdate:collapsed']

  if (!updateListener) currentCollapsed.value = collapsed
  emit('update:collapsed', collapsed)
}

async function validate() {
  return true
}

async function search() {
  return false
}

function clearValidate() {}

function reset() {}
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
