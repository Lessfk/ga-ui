<template>
  <GaSearchBar
    ref="searchBarRef"
    v-model="query"
    size="default"
    :fields="fields"
    :rules="{}"
    label-mode="label"
    label-position="right"
    label-width="110px"
    :gutter="16"
    :collapsed="false"
    :collapsed-count="3"
    :disabled="false"
    :actions-loading="actionsLoading"
    :actions-disabled="actionsDisabled"
    :validate-on-search="false"
    :actions-show-search="true"
    :actions-show-reset="true"
    :actions-show-collapse="true"
    @search="handleSearch"
    @reset="handleReset"
    @change="handleChange"
  >
    <template
      #action-search="{
        search,
        actionsLoading: actionLoading,
        actionsDisabled: actionDisabled,
      }"
    >
      <ElButton
        type="primary"
        :loading="actionLoading"
        :disabled="actionDisabled || actionLoading"
        @click="mySearch(search)"
      >
        查询
      </ElButton>
    </template>

    <template #actions-append="{ actionsDisabled: actionDisabled,  actionsLoading: actionLoading, }">
      <ElButton
        native-type="button"
        :disabled="actionDisabled"
        :loading="actionLoading"
        @click="handleExport"
      >
        导出
      </ElButton>
    </template>
  </GaSearchBar>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import {
  GaSearchBar,
  type GaSearchBarExpose,
  type GaSearchChangePayload,
  type GaSearchField,
  type GaSearchLabelMode,
  type GaSearchLabelPosition,
  type GaSearchModel,
  type GaSearchOption,
} from "ga-ui-plus/business";
import { ref, computed } from "vue";

const searchBarRef = ref<GaSearchBarExpose>();
const actionsLoading = ref<boolean>(false);
const actionsDisabled = ref<boolean>(false);
const query = ref<GaSearchModel>({
  keyword: "",
});

const fields = computed<GaSearchField[]>(() => [
  {
    key: "keyword",
    type: "input",
    label: "名称",
    labelWidth: "100px",
    labelMode: "label",
    placeholder: "请输入名称、编号或联系人",
    defaultValue: "GA",
    span: 12,
    componentProps: { clearable: true, maxlength: 40 },
  },
    {
    key: "keyword1",
    type: "input",
    label: "名称",
    labelWidth: "100px",
    labelMode: "label",
    placeholder: "请输入名称、编号或联系人",
    defaultValue: "GA",
    span: 12,
    componentProps: { clearable: true, maxlength: 40 },
  },
    {
    key: "keyword2",
    type: "input",
    label: "名称",
    labelWidth: "100px",
    labelMode: "label",
    placeholder: "请输入名称、编号或联系人",
    defaultValue: "GA",
    span: 12,
    componentProps: { clearable: true, maxlength: 40 },
  },
    {
    key: "keyword3",
    type: "input",
    label: "名称",
    labelWidth: "100px",
    labelMode: "label",
    placeholder: "请输入名称、编号或联系人",
    defaultValue: "GA",
    span: 12,
    componentProps: { clearable: true, maxlength: 40 },
  },
]);

const handleSearch = (model: GaSearchModel) => {
  console.log(model, "modelmodel");
  console.log(query.value, "queryquery");
};

const handleReset = (model: GaSearchModel) => {
  console.log(model, "modelmodel");
  console.log(query.value, "queryquery");
};

const handleChange = (payload: GaSearchChangePayload) => {
  console.log(payload, "payloadpayload");
};

const mySearch = async (search: () => Promise<boolean>) => {
  console.log(123);
  let asd = await search();

  console.log(asd, "search");
  //   alert("123");
};

const myReset = async (reset: () => void) => {
  let asd = reset();
  console.log(asd, "reset");
  //   alert("123");
};

const handleExport = () => {
  actionsLoading.value = true
    actionsDisabled.value = true
      alert("导出");


};
</script>

<style lang="sass" scoped></style>
