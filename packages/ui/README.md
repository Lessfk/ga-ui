# ga-ui-plus

ga-ui-plus 是一个基于 Vue 3 与 Element Plus 的 ESM 组件库，提供通用对话框、表格、分页以及表格分页组合组件。本文档面向通过 npm 包消费组件的项目，是当前公开 API 的使用指南。

## 特性

- 使用 Vue 3 `<script setup>` 与 TypeScript 类型构建。
- 在 Element Plus 之上提供常用默认值、配置式表格列和分页对齐能力。
- `GaDialog` 不内置按钮，保留 Element Plus 默认交互，并支持属性透传。
- 同时支持配置式 `GaTableColumn` 与手写 `ElTableColumn`。
- 提供 `GaTablePagination`，用扁平 Props 组合表格和分页。
- 按基础组件、业务组件和聚合入口导出，便于按需组织依赖。

## 兼容性

| 项目 | 支持范围 | 说明 |
| --- | --- | --- |
| Vue | `^3.3.7` | peer dependency，需由消费项目安装 |
| Element Plus | `^2.14.3` | peer dependency，需由消费项目安装 |
| 模块格式 | ESM | 包声明为 `type: module`，各入口提供 ESM 导出 |

## 安装

使用 pnpm 同时安装组件库及其 peer dependencies：

```bash
pnpm add ga-ui-plus vue element-plus
```

## 引入样式

Element Plus 与 ga-ui-plus 的样式都需要由消费项目加载。通常在应用入口中导入一次：

```ts
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'
```

## 导出入口

下表同时覆盖 JavaScript/TypeScript 模块入口与 CSS 样式入口：

| 导出路径 | 运行时导出 | 类型导出 |
| --- | --- | --- |
| `ga-ui-plus/base` | `GaDialog`、`GaTable`、`GaPagination` | 对应的对话框、表格、列、实例与分页类型 |
| `ga-ui-plus/business` | `GaTablePagination` | `GaTablePaginationProps` |
| `ga-ui-plus` | 上述四个组件 | 上述全部公开类型；这是聚合入口 |
| `ga-ui-plus/style.css` | 样式文件 | 不适用 |

按职责导入：

```ts
import { GaDialog, GaPagination, GaTable } from 'ga-ui-plus/base'
import { GaTablePagination } from 'ga-ui-plus/business'
```

也可以统一从聚合入口导入：

```ts
import {
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaTableColumn,
} from 'ga-ui-plus'
```

## 快速开始

先在应用入口引入样式，再在 Vue 单文件组件中直接导入所需组件：

```vue
<template>
  <GaTable :data="rows" :columns="columns" row-key="id" />
</template>

<script setup lang="ts">
import { GaTable, type GaTableColumn } from 'ga-ui-plus'

interface UserRow {
  id: number
  name: string
}

const rows: UserRow[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
]
</script>
```

## GaTable

`GaTable` 封装 Element Plus 的 `ElTable`，既可通过 `columns` 配置列，也可通过插槽直接编写 `ElTableColumn`。未声明的属性和 Element Plus 表格事件会经 `$attrs` 透传到底层 `ElTable`。

### 基础用法

```vue
<template>
  <GaTable
    :data="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  status: 'enabled' | 'disabled'
}

const loading = ref(false)

const rows: UserRow[] = [
  { id: 1, name: '张三', status: 'enabled' },
  { id: 2, name: '李四', status: 'disabled' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'selection', type: 'selection', width: 48 },
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
  { key: 'status', prop: 'status', label: '状态', width: 120 },
]

function handleSelectionChange(selection: UserRow[]) {
  console.info(selection)
}
</script>
```

### 配置式列与自定义单元格

在列配置中设置 `slot`，即可选择同名插槽渲染该列。插槽作用域保持 Element Plus 单元格作用域，包含 `row`、`column` 和 `$index`。

```vue
<template>
  <GaTable :data="rows" :columns="columns">
    <template #status="{ row, column, $index }">
      <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
        {{ column.label }}：{{ row.status === 'enabled' ? '启用' : '停用' }}
        （第 {{ $index + 1 }} 行）
      </ElTag>
    </template>
  </GaTable>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus'
import { GaTable, type GaTableColumn } from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
  status: 'enabled' | 'disabled'
}

const rows: UserRow[] = [
  { id: 1, name: '张三', status: 'enabled' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名' },
  {
    key: 'status',
    prop: 'status',
    label: '状态',
    width: 180,
    align: 'center',
    slot: 'status',
  },
]
</script>
```

如果列声明了 `slot`，但组件上没有提供对应的命名插槽，该列仍使用 `ElTableColumn` 的原生单元格渲染。

### 混合使用配置列与 ElTableColumn

`column-prepend` 插槽位于所有配置列之前；默认插槽位于所有配置列之后。可以用它们增加选择列、展开列或包含复杂模板的操作列。

以下模板片段接续上一节“配置式列与自定义单元格”的完整 SFC 示例。需要新增导入 `ElTableColumn`、`ElButton`，并定义 `viewUser` 处理函数。

```vue
<GaTable :data="rows" :columns="columns">
  <template #column-prepend>
    <ElTableColumn type="selection" width="48" />
  </template>

  <ElTableColumn label="操作" width="100" fixed="right">
    <template #default="{ row }">
      <ElButton link type="primary" @click="viewUser(row)">
        查看
      </ElButton>
    </template>
  </ElTableColumn>
</GaTable>
```

将下面的导入与函数合并到上一节示例已有的 `<script setup lang="ts">` 中：

```ts
import { ElButton, ElTableColumn } from 'element-plus'

function viewUser(row: UserRow) {
  console.info('查看用户', row)
}
```

最终列顺序为：`column-prepend` 插槽内容、`columns` 配置列、默认插槽内容。

### 空状态和追加内容

未提供 `empty` 插槽时，`GaTable` 会渲染一个描述文本来自 `emptyText` 的 `ElEmpty`。`append` 插槽对应 Element Plus 表格的追加内容区域。

以下模板片段同样接续“配置式列与自定义单元格”的完整 SFC 示例。需要新增导入 `ElEmpty`、`ElButton`，并定义 `reload` 处理函数。

```vue
<GaTable :data="rows" :columns="columns" empty-text="暂无用户数据">
  <template #empty>
    <ElEmpty description="暂无用户数据" :image-size="80">
      <ElButton type="primary" @click="reload">重新加载</ElButton>
    </ElEmpty>
  </template>

  <template #append>
    <div>已加载 {{ rows.length }} 条数据</div>
  </template>
</GaTable>
```

将下面的导入与函数合并到该完整示例已有的 `<script setup lang="ts">` 中：

```ts
import { ElButton, ElEmpty } from 'element-plus'

function reload() {
  console.info('重新加载用户数据')
}
```

### 访问底层表格实例

组件通过 `GaTableExpose` 暴露底层 Element Plus `TableInstance`。Vue 会解包暴露的 ref，因此可直接通过 `tableRef` 调用实例方法：

```vue
<template>
  <ElButton @click="clearSelection">清空选择</ElButton>
  <GaTable ref="gaTableRef" :data="rows" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import {
  GaTable,
  type GaTableColumn,
  type GaTableExpose,
} from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
}

const gaTableRef = ref<GaTableExpose>()
const rows: UserRow[] = [{ id: 1, name: '张三' }]
const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名' },
]

function clearSelection() {
  gaTableRef.value?.tableRef?.clearSelection()
}
</script>
```

### GaTable Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Row[]` | `[]` | 表格数据 |
| `columns` | `GaTableColumn<Row>[]` | `[]` | 配置式列 |
| `height` | `string \| number` | `undefined` | 透传为 `ElTable` 的 `height` |
| `maxHeight` | `string \| number` | `undefined` | 透传为 `ElTable` 的 `max-height` |
| `rowKey` | `string \| ((row: Row) => string)` | `undefined` | 行数据主键 |
| `border` | `boolean` | `true` | 是否显示纵向边框 |
| `stripe` | `boolean` | `true` | 是否显示斑马纹 |
| `size` | `ComponentSize` | `undefined` | 表格尺寸 |
| `fit` | `boolean` | `true` | 列宽是否自动撑开 |
| `showHeader` | `boolean` | `true` | 是否显示表头 |
| `highlightCurrentRow` | `boolean` | `false` | 是否高亮当前行 |
| `emptyText` | `string` | `'暂无数据'` | 空数据文本，也是默认 `ElEmpty` 的描述 |
| `loading` | `boolean` | `false` | 是否启用 Element Plus loading 指令 |
| `loadingText` | `string` | `'加载中...'` | 透传为 `element-loading-text` |

未在上表声明的低频 `ElTable` 属性可直接写在 `GaTable` 上；未由 `GaTable` 声明的 Element Plus 表格事件监听器也会通过 `$attrs` 绑定到底层表格。例如 `table-layout="fixed"`、`scrollbar-always-on` 和 `@selection-change`。完整行为以 [Element Plus Table 文档](https://element-plus.org/zh-CN/component/table.html) 为准。

### GaTableColumn

`GaTableColumn<Row>` 中除 `key`、`slot` 外的字段都会绑定到对应的 `ElTableColumn`。当前公开类型声明的全部字段如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `PropertyKey` | 仅控制配置列的 Vue `key`；不透传给 `ElTableColumn` |
| `slot` | `string` | 选择用于单元格渲染的命名插槽；不透传给 `ElTableColumn` |
| `type` | `GaTableColumnType` | 列类型，如 `default`、`selection`、`index`、`expand` |
| `label` | `string` | 列标题 |
| `className` | `string` | 列单元格类名 |
| `labelClassName` | `string` | 表头单元格类名 |
| `property` | `string` | Element Plus 列的 `property` |
| `prop` | `Extract<keyof Row, string> \| (string & {})` | 行字段名；传入 `Row` 泛型可获得已知字段提示 |
| `width` | `string \| number` | 固定列宽 |
| `minWidth` | `string \| number` | 最小列宽 |
| `sortable` | `boolean \| 'custom'` | 是否排序或使用远程排序 |
| `sortMethod` | `(a: Row, b: Row) => number` | 自定义排序方法 |
| `sortBy` | `string \| string[] \| ((row: Row, index: number) => string)` | 指定排序依据 |
| `resizable` | `boolean` | 列宽是否可拖动 |
| `columnKey` | `string` | Element Plus 列标识 |
| `align` | `'left' \| 'center' \| 'right'` | 单元格对齐方式 |
| `headerAlign` | `'left' \| 'center' \| 'right'` | 表头对齐方式 |
| `showOverflowTooltip` | `boolean` | 内容溢出时是否显示 tooltip |
| `fixed` | `boolean \| 'left' \| 'right'` | 是否固定列及固定方向 |
| `formatter` | `(row, column, cellValue, index) => VNode \| string` | 单元格格式化函数 |
| `selectable` | `(row: Row, index: number) => boolean` | 选择列的可选判断函数 |
| `reserveSelection` | `boolean` | 数据刷新后是否保留选择 |
| `filters` | `Array<{ text: string; value: string }>` | 筛选选项 |
| `filterMethod` | `(value: string, row: Row, column: TableColumnCtx<Row>) => void` | 当前公开类型中的筛选方法签名 |
| `filteredValue` | `string[]` | 已选筛选值 |
| `filterPlacement` | `string` | 筛选弹层位置 |
| `filterMultiple` | `boolean` | 是否允许多选筛选 |
| `index` | `number \| ((index: number) => number)` | 索引列起始值或索引计算函数 |

`filterMethod` 需要特别说明：当前源码中的公开类型签名返回 `void`，该函数会原样透传给 Element Plus。实际筛选判断应按照 Element Plus `filter-method` 的用法，提供返回布尔值的谓词。TypeScript 允许把有返回值的函数赋给返回 `void` 的回调类型，但这里的 `void` 是当前公共类型表达的限制，并不表示实际筛选谓词不需要布尔返回值。

配置列的 Vue key 按 `key`、`prop`、最后是 `type + index` 的顺序生成。其他列能力可通过默认插槽手写 `ElTableColumn`，无需在 `GaTableColumn` 中复制完整 Element Plus API。

### GaTable Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `column-prepend` | 无 | 插入在所有配置列之前 |
| `default` | 无 | 插入在所有配置列之后，通常用于手写 `ElTableColumn` |
| `[column.slot]` | `GaTableCellScope<Row>` | 配置列的动态命名插槽，含 `row`、`column`、`$index` |
| `empty` | 无 | 替换默认的 `ElEmpty` |
| `append` | 无 | 转发到 `ElTable` 的 `append` 插槽 |

## GaDialog

`GaDialog` 是一个由 `v-model` 控制的轻量 `ElDialog` 包装器，明确提供常用 Props、全部对话框生命周期事件，以及默认、`header`、`footer` 插槽。组件不内置确认或取消按钮，底部操作及其业务行为均由消费方提供。

### 基础用法

```vue
<template>
  <ElButton type="primary" @click="dialogVisible = true">
    打开对话框
  </ElButton>

  <GaDialog
    v-model="dialogVisible"
    title="编辑用户"
    width="520px"
  >
    <p>在这里放置对话框内容。</p>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const dialogVisible = ref(false)
</script>
```

### 自定义标题和底部操作

`header` 插槽提供 `close`、`titleId` 和 `titleClass`。使用 `titleId` 与 `titleClass` 可保留 Element Plus 为标题建立的可访问性关联；`footer` 插槽只渲染消费方传入的内容，不会补充默认按钮。

```vue
<template>
  <GaDialog v-model="editorVisible" width="640px">
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <span :id="titleId" :class="titleClass">编辑用户</span>
        <ElButton link @click="close">关闭</ElButton>
      </div>
    </template>

    <p>用户表单由业务组件自行渲染。</p>

    <template #footer>
      <ElButton @click="cancelEdit">取消</ElButton>
      <ElButton type="primary" @click="saveUser">保存</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const editorVisible = ref(true)

function cancelEdit() {
  editorVisible.value = false
}

function saveUser() {
  console.info('保存用户')
  editorVisible.value = false
}
</script>
```

### beforeClose 与属性透传

`GaDialog` 将未声明的 `$attrs` 绑定到内部 `ElDialog`，因此可以继续使用 `lock-scroll`、`modal-class` 等 Element Plus 属性。`beforeClose` 会原样交给 Element Plus；`GaDialog` 不捕获回调抛出的异常，也不会代替消费方调用 `done`。消费方需要自行处理异常，并只在允许关闭时调用 `done()`。

```vue
<template>
  <GaDialog
    v-model="dialogVisible"
    title="有未保存的修改"
    :before-close="handleBeforeClose"
    :lock-scroll="false"
    modal-class="editor-dialog-modal"
  >
    <p>关闭前会由业务代码确认。</p>
  </GaDialog>
</template>

<script setup lang="ts">
import type { DialogBeforeCloseFn } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const dialogVisible = ref(true)

const handleBeforeClose: DialogBeforeCloseFn = (done) => {
  try {
    if (window.confirm('确定放弃未保存的修改吗？')) {
      done()
    }
  } catch (error) {
    console.error('关闭确认失败', error)
  }
}
</script>
```

### GaDialog Props

`GaDialogProps` 只声明下表中的常用属性，不表示继承完整的 Element Plus `DialogProps`。其他受底层支持的属性可以通过 `$attrs` 透传。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 对话框是否可见；支持 `v-model` |
| `title` | `string` | `''` | 对话框标题 |
| `width` | `string \| number` | Element Plus 默认行为（`50%`） | 对话框宽度 |
| `top` | `string` | Element Plus 默认行为（`15vh`） | 对话框上边距 |
| `fullscreen` | `boolean` | `false` | 是否全屏显示 |
| `appendToBody` | `boolean` | `false` | 是否将对话框挂载到 `body` |
| `destroyOnClose` | `boolean` | `false` | 关闭时是否销毁插槽内容 |
| `center` | `boolean` | `false` | 是否让标题和底部区域居中 |
| `alignCenter` | `boolean` | `undefined`，遵循 Element Plus 配置 | 是否让对话框水平、垂直居中 |
| `draggable` | `boolean` | `undefined`，遵循 Element Plus 配置 | 是否允许拖动对话框 |
| `showClose` | `boolean` | `true` | 是否显示右上角关闭按钮 |
| `closeOnClickModal` | `boolean` | `true` | 是否允许点击遮罩关闭 |
| `closeOnPressEscape` | `boolean` | `true` | 是否允许按 Escape 关闭 |
| `beforeClose` | `DialogBeforeCloseFn` | `undefined` | 关闭前回调；消费方调用 `done()` 后才继续关闭 |

### GaDialog Events

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 可见状态变化；用于 `v-model` |
| `open` | 无 | 对话框开始打开 |
| `opened` | 无 | 对话框打开动画结束 |
| `close` | 无 | 对话框开始关闭 |
| `closed` | 无 | 对话框关闭动画结束 |
| `open-auto-focus` | 无 | 打开后完成自动聚焦 |
| `close-auto-focus` | 无 | 关闭后完成自动聚焦恢复 |

### GaDialog Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `default` | 无 | 对话框主体内容 |
| `header` | `{ close, titleId, titleClass }` | 自定义标题；可调用 `close()` 并复用标题的可访问性属性 |
| `footer` | 无 | 自定义底部内容；组件不提供默认按钮 |

### 访问底层对话框实例

`GaDialogExpose` 的 `dialogRef` 类型为 `DialogInstance | undefined`。高级消费方可以在组件挂载后调用 Element Plus 实例的 `handleClose()`、`resetPosition()` 等方法。

```vue
<template>
  <ElButton @click="closeDialog">通过实例关闭</ElButton>
  <ElButton @click="resetDialogPosition">重置位置</ElButton>
  <GaDialog
    ref="dialogInstance"
    v-model="dialogVisible"
    title="实例方法"
    draggable
  />
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaDialog, type GaDialogExpose } from 'ga-ui-plus/base'

const dialogVisible = ref(true)
const dialogInstance = ref<GaDialogExpose>()

function closeDialog() {
  dialogInstance.value?.dialogRef?.handleClose()
}

function resetDialogPosition() {
  dialogInstance.value?.dialogRef?.resetPosition()
}
</script>
```

更多底层行为与透传属性请参见 [Element Plus Dialog 中文文档](https://element-plus.org/zh-CN/component/dialog.html)。

## GaPagination

`GaPagination` 封装 Element Plus 的 `ElPagination`，增加 `position` 对齐属性，并显式支持当前页与页大小的双向绑定。

### 基础用法

```vue
<template>
  <GaPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    position="right"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GaPagination } from 'ga-ui-plus/base'

const currentPage = ref(1)
const pageSize = ref(10)
const total = 86

function handleCurrentChange(page: number) {
  console.info('当前页', page)
}

function handleSizeChange(size: number) {
  console.info('每页条数', size)
}
</script>
```

### 对齐方式

`position` 接受 `left`、`center`、`right`，分别将分页内容左对齐、居中或右对齐；默认值为 `right`。

```vue
<GaPagination :total="100" position="left" />
<GaPagination :total="100" position="center" />
<GaPagination :total="100" position="right" />
```

### GaPagination Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentPage` | `number` | `1` | 当前页，支持 `v-model:current-page` |
| `pageSize` | `number` | `10` | 每页条数，支持 `v-model:page-size` |
| `total` | `number` | `100` | 总条目数 |
| `pageSizes` | `number[]` | `[10, 20, 30, 40, 50]` | 可选的每页条数 |
| `size` | `ComponentSize` | `'default'` | 分页尺寸 |
| `layout` | `string` | `'total, sizes, prev, pager, next, jumper'` | 分页布局 |
| `background` | `boolean` | `true` | 是否为分页按钮添加背景 |
| `position` | `'left' \| 'center' \| 'right'` | `'right'` | 水平对齐方式 |

未声明的属性与监听器经 `$attrs` 透传到底层 `ElPagination`，例如 `disabled`、`hide-on-single-page`。更多低频能力参见 [Element Plus Pagination 文档](https://element-plus.org/zh-CN/component/pagination.html)。

### GaPagination Events

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:current-page` | `(currentPage: number)` | 当前页变化；用于 `v-model:current-page` |
| `update:page-size` | `(pageSize: number)` | 每页条数变化；用于 `v-model:page-size` |
| `current-change` | `(currentPage: number)` | 底层分页当前页变化后同步触发 |
| `size-change` | `(pageSize: number)` | 底层分页每页条数变化后同步触发 |

## GaTablePagination

`GaTablePagination` 将 `GaTable` 与 `GaPagination` 组合为一个两行 Grid。它使用扁平 Props：`GaTableProps<Row>`（排除 `height`、`maxHeight`）与 `GaPaginationProps` 的交集，不需要 `tableProps` 或 `paginationProps` 对象。

### 基础用法

父容器需要提供明确高度，组件才能将剩余空间分配给内部表格：

```vue
<template>
  <section class="table-pagination-basic">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      row-key="id"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  GaTablePagination,
  type GaTableColumn,
} from 'ga-ui-plus'

interface UserRow {
  id: number
  name: string
}

const currentPage = ref(1)
const pageSize = ref(10)
const total = 2

const rows: UserRow[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 160 },
]
</script>

<style scoped>
.table-pagination-basic {
  height: 400px;
  min-height: 0;
}
</style>
```

### 完整用法

下面的示例包含配置列、选择列、空状态、追加内容、手写操作列、页码与页大小模型及事件。承载组件的父容器提供了明确高度。

示例保留选择列用于展示选择 UI；`GaTablePagination` 当前不会透传 `selection-change` 等表格事件，也不暴露 `tableRef`。如果业务需要读取选择结果或访问表格实例，请改用 `GaTable` 与 `GaPagination` 组合。

```vue
<template>
  <section class="table-pagination-area">
    <GaTablePagination
      :data="rows"
      :columns="columns"
      row-key="id"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="100"
      position="left"
      @current-change="loadUsers"
      @size-change="handlePageSizeChange"
    >
      <template #column-prepend>
        <ElTableColumn type="selection" width="48" />
      </template>

      <template #empty>
        <ElEmpty description="暂无用户数据" :image-size="80">
          <ElButton type="primary" @click="loadUsers(currentPage)">
            重新加载
          </ElButton>
        </ElEmpty>
      </template>

      <template #append>
        <div class="table-append">已加载 {{ rows.length }} 条数据</div>
      </template>

      <template #status="{ row }">
        <ElTag :type="row.status === 'enabled' ? 'success' : 'info'">
          {{ row.status === 'enabled' ? '启用' : '停用' }}
        </ElTag>
      </template>

      <ElTableColumn label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <ElButton link type="primary" @click="viewUser(row)">
            查看
          </ElButton>
        </template>
      </ElTableColumn>
    </GaTablePagination>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElButton,
  ElEmpty,
  ElTableColumn,
  ElTag,
} from 'element-plus'
import {
  GaTablePagination,
  type GaTableColumn,
} from 'ga-ui-plus'

interface UserRow {
  id: number
  name: string
  address: string
  status: 'enabled' | 'disabled'
}

const currentPage = ref(1)
const pageSize = ref(10)

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名', minWidth: 140 },
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

const rows = ref<UserRow[]>([
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
    id: 3,
    name: '王五',
    address: '北京市海淀区中关村大街 66 号',
    status: 'enabled',
  },
])

function loadUsers(page: number) {
  console.info('加载第几页', page)
}

function handlePageSizeChange(size: number) {
  currentPage.value = 1
  loadUsers(1)
  console.info('新的每页条数', size)
}

function viewUser(row: UserRow) {
  console.info('查看用户', row)
}
</script>

<style scoped>
.table-pagination-area {
  height: 600px;
  min-height: 0;
}

.table-append {
  padding: 12px;
  text-align: center;
}
</style>
```

### 布局与高度要求

组件根节点使用两行 Grid：第一行 `minmax(0, 1fr)` 放置表格，第二行固定为 `50px` 放置分页。内部 `GaTable` 固定使用 `height="100%"`，组合组件自身也使用 `height: 100%`。

因此父容器必须有明确高度，例如 `height: 600px`，并建议在 Flex 或 Grid 收缩链路上设置 `min-height: 0`。只有内容高度、没有可解析高度的父容器不能为内部 `100%` 高度提供可靠基准。

### GaTablePagination Props

`GaTablePaginationProps<Row>` 是 `Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps`。表格和分页共享同一个 `size`，因此 `size` 同时控制两者。

| 属性组 | 属性 | 默认行为 |
| --- | --- | --- |
| 表格数据与列 | `data`、`columns`、`rowKey` | 与 `GaTable` 相同：`[]`、`[]`、`undefined` |
| 表格外观 | `border`、`stripe`、`fit`、`showHeader` | 均为 `true` |
| 表格状态 | `highlightCurrentRow`、`emptyText`、`loading`、`loadingText` | 与 `GaTable` 相同：`false`、`'暂无数据'`、`false`、`'加载中...'` |
| 共享尺寸 | `size` | 同时传给 `GaTable` 与 `GaPagination`；未传时使用子组件默认行为 |
| 分页模型 | `currentPage`、`pageSize` | 与 `GaPagination` 相同：`1`、`10` |
| 分页数据 | `total`、`pageSizes` | 与 `GaPagination` 相同：`100`、`[10, 20, 30, 40, 50]` |
| 分页外观 | `layout`、`background`、`position` | 与 `GaPagination` 相同；分别为默认布局、`true`、`'right'` |

`height` 和 `maxHeight` 被有意排除，不能用于控制内部表格；请通过父容器高度控制整个组合组件。

### GaTablePagination Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:current-page` | `(currentPage: number)` | 转发页码模型更新 |
| `update:page-size` | `(pageSize: number)` | 转发页大小模型更新 |
| `current-change` | `(currentPage: number)` | 当前页变化事件 |
| `size-change` | `(pageSize: number)` | 每页条数变化事件 |

以上四项是组合组件当前明确声明的全部事件。`selection-change`、`row-click`、`sort-change` 等表格事件不会从内部 `GaTable` 透传；选择列可以显示并交互，但业务无法通过 `GaTablePagination` 读取选择结果。需要这些事件时，请使用 `GaTable` 与 `GaPagination` 组合。

### GaTablePagination Slots

组合组件会把收到的所有插槽及其作用域转发给内部 `GaTable`，因此可使用 `GaTable` 的 `column-prepend`、默认插槽、配置列命名插槽、`empty` 和 `append`。这些插槽不会转发给分页组件。

## TypeScript 类型

所有公开类型均可从聚合入口导入，也可从所属的 `base` 或 `business` 入口导入。

| 类型 | 用途 |
| --- | --- |
| `GaDialogProps` | `GaDialog` 明确声明的常用 Props 子集 |
| `GaDialogEmits` | `GaDialog` 的模型更新与生命周期事件签名 |
| `GaDialogHeaderSlotProps` | `header` 插槽作用域，包含 `close`、`titleId`、`titleClass` |
| `GaDialogExpose` | `GaDialog` 暴露实例类型，包含 `DialogInstance \| undefined` 的 `dialogRef` |
| `GaTableProps<Row>` | `GaTable` Props |
| `GaTableRowKey<Row>` | `rowKey` 的字符串或函数类型 |
| `GaTableColumn<Row>` | 配置式列定义 |
| `GaTableCellScope<Row>` | 配置列命名插槽的作用域 |
| `GaTableExpose` | `GaTable` 暴露实例类型，包含 `tableRef` |
| `GaTableRow` | 默认行数据基类型 `Record<string, any>` |
| `GaTableColumnType` | 配置列 `type` 类型 |
| `GaTableColumnAlign` | 列对齐类型 |
| `GaTableColumnFixed` | 固定列类型 |
| `GaPaginationProps` | `GaPagination` Props |
| `GaTablePaginationProps<Row>` | 扁平的表格分页组合 Props |

```vue
<template>
  <ElButton @click="clearSelection">清空选择</ElButton>
  <GaTable ref="tableInstance" v-bind="tableProps" />
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import {
  GaTable,
  type GaPaginationProps,
  type GaTableCellScope,
  type GaTableColumn,
  type GaTableExpose,
  type GaTablePaginationProps,
  type GaTableProps,
} from 'ga-ui-plus'

interface UserRow {
  id: number
  name: string
  status: 'enabled' | 'disabled'
}

const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名' },
]

const tableProps: GaTableProps<UserRow> = {
  data: [{ id: 1, name: '张三', status: 'enabled' }],
  columns,
  rowKey: 'id',
}

const paginationProps: GaPaginationProps = {
  currentPage: 1,
  pageSize: 10,
  total: 100,
}

const combinedProps: GaTablePaginationProps<UserRow> = {
  ...tableProps,
  ...paginationProps,
}

function getStatusText(scope: GaTableCellScope<UserRow>) {
  return `${scope.$index + 1}: ${scope.row.status}`
}

const tableInstance = ref<GaTableExpose>()

function clearSelection() {
  tableInstance.value?.tableRef?.clearSelection()
}

void combinedProps
void getStatusText
</script>
```

`tableInstance` 只有在 `GaTable` 挂载后才可用，因此应像示例一样通过按钮或其他用户事件调用 `clearSelection`，不要在 `<script setup>` 初始化的顶层直接调用实例方法。

## 属性透传与当前限制

- `GaDialog` 显式转发 `v-model` 更新与对话框生命周期事件，并将其他 `$attrs` 绑定到内部 `ElDialog`；组件不内置 `footer` 内容或确认、取消按钮，`beforeClose` 的异常处理与 `done` 回调调用由消费方负责。
- `GaTable` 使用 `inheritAttrs: false`，并将普通 `$attrs` 直接绑定到内部 `ElTable`；未声明的 Element Plus 表格事件也随监听器一起透传。
- `GaPagination` 使用相同策略，将普通 `$attrs` 绑定到内部 `ElPagination`。组件当前不转发分页插槽。
- `GaTablePagination` 的普通 `$attrs` 绑定在根 `<div>`，包括 `class`、`style`、`id` 和普通监听器；它们不会自动分发给内部表格或分页。组件只转发明确声明的四个分页事件，不会透传 `selection-change` 等表格事件；选择列只展示选择 UI。需要读取选择结果时，请使用 `GaTable` 与 `GaPagination` 组合。
- `GaTablePagination` 当前不暴露底层 `tableRef`。需要调用 `clearSelection`、`doLayout` 等表格实例方法时，请使用 `GaTable` 与 `GaPagination` 组合。
- `GaTablePagination` 不接受 `height`、`maxHeight`、`tableProps` 或 `paginationProps`；内部表格高度由组件固定，其他能力通过扁平 Props 和表格插槽提供。
- `GaTableColumn` 只覆盖当前类型文件声明的列字段。需要其他 Element Plus 列能力时，可在 `column-prepend` 或默认插槽中直接使用 `ElTableColumn`。
