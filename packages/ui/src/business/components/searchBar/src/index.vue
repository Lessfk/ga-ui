<template>
  <div v-bind="$attrs" class="ga-search-bar">
    <ElForm
      ref="formRef"
      class="ga-search-bar__form"
      :model="draftModel"
      :rules="props.rules"
      :label-position="props.labelPosition"
      :label-width="props.labelWidth"
      :size="props.size"
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
              @update:model-value="updateField(field, $event)"
              @change="emitFieldChange(field, $event)"
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
              v-bind="actionSlotProps"
            >
              <div class="ga-search-bar__actions">
                <slot name="actions-prepend" v-bind="actionSlotProps" />

                <slot
                  v-if="props.actionsShowSearch"
                  name="action-search"
                  v-bind="actionSlotProps"
                >
                  <ElButton
                    data-action="search"
                    type="primary"
                    native-type="submit"
                    :loading="searchLoading"
                    :disabled="props.actionsDisabled || searching"
                  >
                    查询
                  </ElButton>
                </slot>

                <slot
                  v-if="props.actionsShowReset"
                  name="action-reset"
                  v-bind="actionSlotProps"
                >
                  <ElButton
                    data-action="reset"
                    native-type="button"
                    :disabled="props.actionsDisabled"
                    @click="reset"
                  >
                    重置
                  </ElButton>
                </slot>

                <slot
                  v-if="props.actionsShowCollapse && hasCollapsibleFields"
                  name="action-collapse"
                  v-bind="actionSlotProps"
                >
                  <ElButton
                    data-action="toggle"
                    type="primary"
                    link
                    native-type="button"
                    :disabled="props.actionsDisabled"
                    @click="toggle"
                  >
                    {{ currentCollapsed ? '展开' : '收起' }}
                  </ElButton>
                </slot>

                <slot name="actions-append" v-bind="actionSlotProps" />
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

const props = withDefaults(defineProps<GaSearchBarProps>(), {
  labelMode: 'label',
  labelPosition: 'right',
  labelWidth: 'auto',
  size: 'default',
  gutter: 16,
  collapsed: true,
  collapsedCount: 3,
  disabled: false,
  actionsLoading: false,
  actionsDisabled: false,
  validateOnSearch: false,
  actionsShowSearch: true,
  actionsShowReset: true,
  actionsShowCollapse: true,
})

const emit = defineEmits<GaSearchBarEmits>()
const slots = useSlots()
const instance = getCurrentInstance()
const formRef = ref<FormInstance>()
const draftModel = ref(cloneSearchModel(props.modelValue))
const initialValues = captureInitialValues(props.modelValue, props.fields)
const currentCollapsed = ref(props.collapsed)
const searching = ref(false)
const warnedDuplicateKeys = new Set<string>()

const defaultColumnProps = {
  span: 6,
}
const visibleFields = computed(() =>
  props.fields.filter((field) => !field.hidden),
)
const hasCollapsibleFields = computed(
  () => visibleFields.value.length > props.collapsedCount,
)
const searchLoading = computed(
  () => props.actionsLoading || searching.value,
)
const displayedFields = computed(() =>
  currentCollapsed.value && hasCollapsibleFields.value
    ? visibleFields.value.slice(0, props.collapsedCount)
    : visibleFields.value,
)
const actionSlotProps = computed(() => ({
  search,
  reset,
  validate,
  clearValidate,
  collapsed: currentCollapsed.value,
  toggle,
  actionsLoading: searchLoading.value,
  actionsDisabled: props.actionsDisabled,
}))
function shouldShowActions() {
  return (
    Boolean(slots.actions) ||
    Boolean(slots['actions-prepend']) ||
    Boolean(slots['actions-append']) ||
    props.actionsShowSearch ||
    props.actionsShowReset ||
    (props.actionsShowCollapse && hasCollapsibleFields.value)
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

watch(
  () => props.fields,
  (fields) => {
    const values = captureInitialValues(props.modelValue, fields)

    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(initialValues, field.key)) {
        continue
      }
      initialValues[field.key] = values[field.key]
    }
  },
  { deep: true },
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
  return getFieldLabelMode(field) === 'label'
    ? field.labelWidth ?? props.labelWidth
    : 0
}

function getColumnProps(field: GaSearchField) {
  return {
    span: field.span ?? defaultColumnProps.span,
    xs: field.xs,
    sm: field.sm,
    md: field.md,
    lg: field.lg,
    xl: field.xl,
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
  if (!formRef.value) return true

  try {
    return await formRef.value.validate()
  } catch (error) {
    if (error instanceof Error) throw error
    return false
  }
}

async function search() {
  if (
    props.actionsLoading ||
    props.actionsDisabled ||
    searching.value
  ) return false

  const model = cloneSearchModel(draftModel.value)
  searching.value = true
  try {
    if (props.validateOnSearch && formRef.value) {
      const valid = await formRef.value.validate()
      if (!valid) return false
    }

    emit('search', model)
    return true
  } catch (error) {
    if (error instanceof Error) throw error
    emit('invalid', error)
    return false
  } finally {
    // searching.value = false
  }
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
</script>

<style lang="scss">
@use '../style/index.scss';
</style>
