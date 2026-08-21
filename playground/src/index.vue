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
                <slot :name="getFieldSlotName(field)" v-bind="slotProps" />
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
            <slot name="actions" v-bind="actionSlotProps">
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

                <slot name="actions-append" v-bind="actionSlotProps" />

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
                    {{ currentCollapsed ? "展开" : "收起" }}
                  </ElButton>
                </slot>
              </div>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>
<script setup lang="ts">
import { ElDialog } from "element-plus";
import type { DialogInstance } from "element-plus";
import { computed, ref, useAttrs, useSlots, watch } from "vue";
import type { Slots } from "vue";

// import type { GaDialogEmits, GaDialogProps } from '../types/index'

defineOptions({
  name: "GaDialog",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<GaDialogProps>(), {
  modelValue: false,
  title: "",
  fullscreen: false,
  showFullscreen: true,
  appendToBody: true,
  destroyOnClose: true,
  center: false,
  alignCenter: true,
  draggable: true,
  showClose: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
});

const attrs = useAttrs();
const headerAriaLevel = computed(() => {
  const value = attrs["header-aria-level"] ?? attrs.headerAriaLevel;
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "2";
});

const emit = defineEmits<GaDialogEmits>();
const slots: Slots = useSlots();
const dialogRef = ref<DialogInstance>();
const currentFullscreen = ref(props.fullscreen);
const fullscreenLabel = computed(() =>
  currentFullscreen.value ? "退出全屏" : "全屏",
);

watch(
  () => props.fullscreen,
  (value) => {
    currentFullscreen.value = value;
  },
);

const setFullscreen = (value: boolean) => {
  if (currentFullscreen.value === value) return;

  currentFullscreen.value = value;
  emit("update:fullscreen", value);
};

const toggleFullscreen = () => {
  setFullscreen(!currentFullscreen.value);
};

const handleClosed = () => {
  setFullscreen(props.fullscreen);
  emit("closed");
};

defineExpose({
  dialogRef,
});
</script>

<style lang="scss">
@use "../style/index.scss";
</style>
