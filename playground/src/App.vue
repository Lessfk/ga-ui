<template>
  <main class="playground-page">
    <h1>GaTable 配置列示例</h1>

    <section class="table-area">
      <GaTablePagination
        :data="rows"
        :columns="columns"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="100"
        position="left"
      >
        <template #column-prepend>
          <ElTableColumn
            type="selection"
            width="48"
          />
        </template>

        <template #empty>
          <ElEmpty
            description="暂无用户数据"
            :image-size="80"
          >
            <ElButton
              type="primary"
            >
              重新加载
            </ElButton>
          </ElEmpty>
        </template>

        <template #append>
          <div class="table-append">
            已加载 {{ rows.length }} 条数据
          </div>
        </template>

        <template #status="{ row }">
          <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
            {{ row.status === 'enabled' ? '启用' : '停用' }}
          </ElTag>
        </template>

        <ElTableColumn
          label="操作"
          width="100"
          fixed="right"
        >
          <template #default="{ row }">
            <ElButton
              link
              type="primary"
              @click="viewUser(row)"
            >
              查看
            </ElButton>
          </template>
        </ElTableColumn>
      </GaTablePagination>
    </section>

    <section class="dialog-area">
      <h1>GaDialog 通用弹窗示例</h1>

      <ElButton
        type="primary"
        @click="dialogVisible = true"
      >
        打开通用弹窗
      </ElButton>

      <GaDialog
        v-model="dialogVisible"
        width="520px"
        destroy-on-close
        modal-class="ga-dialog-demo-modal"
        :before-close="handleDialogBeforeClose"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="dialog-header">
            <span
              :id="titleId"
              :class="titleClass"
            >
              通用弹窗标题
            </span>
            <ElButton
              link
              @click="close"
            >
              关闭
            </ElButton>
          </div>
        </template>

        <p>
          GaDialog 组件不内置任何按钮，footer 插槽中的操作按钮完全由使用方提供。
        </p>

        <template #footer>
          <ElButton @click="dialogVisible = false">
            取消
          </ElButton>
          <ElButton
            type="primary"
            @click="handleDialogConfirm"
          >
            确认
          </ElButton>
        </template>
      </GaDialog>
    </section>

     <h1>GaTable 配置列示例</h1>

     <GaPagination position="center"></GaPagination>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  type DialogBeforeCloseFn,
  ElButton,
  ElTableColumn,
  ElTag,
  ElEmpty,
} from 'element-plus'

import { GaDialog, GaPagination, type GaTableColumn } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'

interface UserRow {
  id: number
  name: string
  address: string
  status: 'enabled' | 'disabled'
}

const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)

const columns: GaTableColumn<UserRow>[] = [
  {
    key: 'name',
    prop: 'name',
    label: '姓名',
    minWidth: 140,
  },
  {
    key: 'address',
    prop: 'address',
    label: '地址',
    minWidth: 260,
    showOverflowTooltip: true,
  },
  {
    key: 'status',
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slot: 'status',
  },
]

const rows: UserRow[] = [
  {
    id: 1,
    name: '张三',
    address: '上海市浦东新区世纪大道 100 号',
    status: 'enabled',
  },
  {
    id: 2,
    name: '李四',
    address: '杭州市西湖区文三路 88 号',
    status: 'disabled',
  },
  {
    id: 2,
    name: '李四',
    address: '杭州市西湖区文三路 88 号',
    status: 'disabled',
  },
]

function viewUser(row: Record<string, unknown>) {
  console.info('查看用户', row)
}

const handleDialogBeforeClose: DialogBeforeCloseFn = (done) => {
  if (window.confirm('确定关闭通用弹窗吗？')) done()
}

function handleDialogConfirm() {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.playground-page {
  display: flex;
  flex-direction: column;
  width: 80vw;
  height: 80vh;
  min-height: 0;
}

.table-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.dialog-area {
  flex: none;
  padding-block: 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h1 {
  flex: none;
  font-size: 24px;
}
</style>
