<template>
  <div class="table-demo-toolbar">
    <div class="table-demo-toolbar__actions">
      <ElButton :disabled="rows.length === 0" @click="rows = []">清空数据</ElButton>
      <ElButton :disabled="rows.length > 0" @click="rows = [...initialRows]">恢复数据</ElButton>
    </div>
    <ElSwitch v-model="loading" active-text="加载中" inactive-text="未加载" />
  </div>
  <GaTable
    :data="rows"
    :columns="columns"
    :loading="loading"
    empty-text="暂无成员数据"
    loading-text="正在加载成员..."
  />
</template>

<script setup lang="ts">
import { ElButton, ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  department: string
}

const initialRows: UserRow[] = [
  { id: 1, name: '张三', department: '产品设计' },
  { id: 2, name: '李四', department: '研发中心' },
]

const rows = ref<UserRow[]>([...initialRows])
const loading = ref(false)
const columns: GaTableColumn<UserRow>[] = [
  { prop: 'name', label: '姓名', minWidth: 160 },
  { prop: 'department', label: '部门', minWidth: 180 },
]
</script>

<style scoped>
.table-demo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.table-demo-toolbar__actions {
  display: flex;
  gap: 8px;
}

.table-demo-toolbar__actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (max-width: 720px) {
  .table-demo-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
