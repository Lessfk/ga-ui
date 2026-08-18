<template>
  <h1>GaTable 配置列示例</h1>

  <section class="table-area">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="100"
      :table-theme="tableTheme"
      :pagination-theme="paginationTheme"
      highlight-current-row
      row-key="id"
      position="left"
    >
      <template #column-prepend>
        <ElTableColumn type="selection" width="48" />
      </template>

      <template #empty>
        <ElEmpty description="暂无用户数据" :image-size="80">
          <ElButton type="primary"> 重新加载 </ElButton>
        </ElEmpty>
      </template>

      <template #append>
        <div class="table-append">已加载 {{ rows.length }} 条数据</div>
      </template>

      <template #status="{ row }">
        <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
          {{ row.status === "enabled" ? "启用" : "停用" }}
        </ElTag>
      </template>

      <ElTableColumn label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <ElButton link type="primary" @click="viewUser(row)"> 查看 </ElButton>
        </template>
      </ElTableColumn>
    </GaTablePagination>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { ElButton, ElEmpty, ElTableColumn, ElTag } from "element-plus";

import {
  type GaPaginationTheme,
  type GaTableColumn,
  type GaTableTheme,
} from "ga-ui-plus/base";
import { GaTablePagination } from "ga-ui-plus/business";

interface UserRow {
  id: number;
  name: string;
  address: string;
  status: "enabled" | "disabled";
}

const currentPage = ref(1);
const pageSize = ref(10);

const tableTheme: GaTableTheme = {
  backgroundColor: "#ffffff",
  rowBackgroundColor: "#ffffff",
  textColor: "#344054",
  headerBackgroundColor: "#4F7DB2",
  headerTextColor: "#f9fafb",
  borderColor: "#d0d5dd",
  stripeBackgroundColor: "#f8fafc",
  hoverBackgroundColor: "#eff8ff",
  currentRowBackgroundColor: "#d1e9ff",
  expandedRowBackgroundColor: "#f2f4f7",
};

const paginationTheme: GaPaginationTheme = {
  backgroundColor: "#EEEEEF",
  textColor: "#606266",
  buttonColor: "#7A7475",
  buttonBackgroundColor: "#ffffff",
  activeColor: "#ffffff",
  activeBackgroundColor: "#4F7DB2",
  hoverColor: "#ffffff",
  hoverBackgroundColor: "#4f7db299",
  disabledColor: "#606266",
  disabledBackgroundColor: "#fafafa",

  // backgroundColor: "#EEEEEF",
  //  textColor: '#606266',
  // buttonColor: "#7A7475",
  // buttonBackgroundColor: "#ffffff",
  // activeColor: "#ffffff",
  // activeBackgroundColor: "#4F7DB2",//539ED7
  // hoverColor: "#ffffff",
  // hoverBackgroundColor: "#9CB5D1",
  //    disabledColor: '#606266',
  //  disabledBackgroundColor: '#fafafa',

  //   backgroundColor: '#fafafa',
  // textColor: '#606266',
  // buttonColor: '#606266',
  // buttonBackgroundColor: '#fafafa',
  // activeColor: '#fff',
  // activeBackgroundColor: 'linear-gradient(135deg,#4b4b52, #1d1d22)',
  // hoverColor: '#1c1c1a',
  // hoverBackgroundColor: '#EDEDED',
  // disabledColor: '#606266',
  // disabledBackgroundColor: '#fafafa',
};

const columns: GaTableColumn<UserRow>[] = [
  {
    key: "name",
    prop: "name",
    label: "姓名",
    minWidth: 140,
  },
  {
    key: "address",
    prop: "address",
    label: "地址",
    minWidth: 260,
    showOverflowTooltip: true,
  },
  {
    key: "status",
    prop: "status",
    label: "状态",
    width: 100,
    align: "center",
    slot: "status",
  },
];

const rows: UserRow[] = [
  {
    id: 1,
    name: "张三",
    address: "上海市浦东新区世纪大道 100 号",
    status: "enabled",
  },
  {
    id: 3,
    name: "李四",
    address: "杭州市西湖区文三路 88 号",
    status: "disabled",
  },
  {
    id: 2,
    name: "李四",
    address: "杭州市西湖区文三路 88 号",
    status: "disabled",
  },
];

function viewUser(row: Record<string, unknown>) {
  console.info("查看用户", row);
}
</script>

<style scoped lang="scss">
.table-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

h1 {
  flex: none;
  font-size: 24px;
}
</style>
