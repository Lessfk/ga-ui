# ga-ui-plus

ga-ui-plus 是一个基于 Vue 3 与 Element Plus 的 ESM 组件库，提供通用对话框、表格、分页、侧边栏菜单以及表格分页组合组件。本文档面向通过 npm 包消费组件的项目，是当前公开 API 的使用指南。

## 特性

- 使用 Vue 3 `<script setup>` 与 TypeScript 类型构建。
- 在 Element Plus 之上提供常用默认值、配置式表格列和分页对齐能力。
- `GaDialog` 默认提供自绘的全屏/还原与关闭按钮；确认、取消等 footer 业务按钮仍由使用方提供，并支持属性透传。
- 同时支持配置式 `GaTableColumn` 与手写 `ElTableColumn`。
- 提供 `GaTablePagination`，用扁平 Props 组合表格和分页。
- 提供 `GaAsideMenu`，由 `ElAside`、`ElScrollbar`、`ElMenu` 组合的侧边栏菜单，支持头部/底部插槽、折叠与自定义宽度。
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
| `ga-ui-plus/business` | `GaTablePagination`、`GaAsideMenu` | 对应的表格分页与侧边栏菜单类型 |
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
  void selection
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
  void row
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
  // 在这里重新加载数据。
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

### 颜色主题

`theme` 用于配置当前 `GaTable` 实例的颜色。主题支持部分覆盖，未传字段继续使用默认颜色主题，不会影响其他表格实例。

```vue
<script setup lang="ts">
import {
  GaTable,
  type GaTableColumn,
  type GaTableTheme,
} from 'ga-ui-plus/base'

interface UserRow {
  id: number
  name: string
}

const rows: UserRow[] = [{ id: 1, name: '张三' }]
const columns: GaTableColumn<UserRow>[] = [
  { key: 'name', prop: 'name', label: '姓名' },
]

const tableTheme: GaTableTheme = {
  headerBackgroundColor: '#101828',
  headerTextColor: '#f9fafb',
  stripeBackgroundColor: '#f8fafc',
  hoverBackgroundColor: '#eff8ff',
  currentRowBackgroundColor: '#d1e9ff',
}
</script>

<template>
  <GaTable
    :data="rows"
    :columns="columns"
    :theme="tableTheme"
    row-key="id"
    highlight-current-row
  />
</template>
```

| 主题字段 | 说明 |
| --- | --- |
| `backgroundColor` | 表格整体背景色 |
| `rowBackgroundColor` | 普通数据行背景色 |
| `textColor` | 表格正文文字颜色 |
| `headerBackgroundColor` | 表头背景色 |
| `headerTextColor` | 表头文字颜色 |
| `borderColor` | 表格边框颜色 |
| `stripeBackgroundColor` | 斑马纹行背景色 |
| `hoverBackgroundColor` | 行悬停背景色 |
| `currentRowBackgroundColor` | 当前行高亮背景色 |
| `expandedRowBackgroundColor` | 展开行背景色 |

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
| `theme` | `GaTableTheme` | 默认颜色主题 | 当前表格实例颜色配置，支持部分覆盖 |

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

`GaDialog` 是一个由 `v-model` 控制的 `ElDialog` 包装器。组件关闭了 Element Plus 原生关闭按钮，并在默认标题栏中渲染自己的全屏/还原按钮和关闭按钮。组件不内置确认、取消或 footer 业务按钮；底部操作及其业务行为均由使用方提供。

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

### 全屏切换

默认标题栏会显示全屏/还原按钮。无需绑定即可使用，组件会在内部维护全屏状态；需要读取或主动控制该状态时，使用 `v-model:fullscreen`。

```vue
<template>
  <ElButton type="primary" @click="dialogVisible = true">
    打开对话框
  </ElButton>

  <GaDialog
    v-model="dialogVisible"
    v-model:fullscreen="dialogFullscreen"
    title="全屏切换示例"
  >
    <p>{{ dialogFullscreen ? '当前为全屏状态' : '当前为普通状态' }}</p>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const dialogVisible = ref(false)
const dialogFullscreen = ref(false)
</script>
```

将 `:show-fullscreen="false"` 传给组件可隐藏全屏按钮。关闭完成时，组件会把内部全屏状态恢复为当前 `fullscreen` Prop，并在状态变化时触发 `update:fullscreen`。

### 自定义标题和底部操作

`header` 插槽提供 `close`、`titleId` 和 `titleClass`。使用 `titleId` 与 `titleClass` 可保留 Element Plus 为标题建立的可访问性关联。传入 `header` 插槽后，默认标题栏会被完整替换，因此默认的全屏按钮和关闭按钮也不会渲染，需要由使用方自行提供。

`footer` 插槽只渲染使用方传入的内容，不会自动补充确认、取消等业务按钮。

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
  editorVisible.value = false
}
</script>
```

### 关闭行为、beforeClose 与属性透传

`GaDialog` 将未声明的 `$attrs` 绑定到内部 `ElDialog`，因此可以继续使用 `lock-scroll`、`modal-class` 等 Element Plus 属性。`beforeClose` 也会原样传给 Element Plus。

默认标题栏中的关闭按钮、`header` 插槽作用域中的 `close()`、暴露实例的 `dialogRef.handleClose()`、点击遮罩和按 Escape 都会进入 Element Plus 的关闭流程，因此会执行 `beforeClose(done)`。点击遮罩或按 Escape 还需要分别启用 `closeOnClickModal` 和 `closeOnPressEscape`。

直接将 `v-model` 修改为 `false` 不属于关闭请求，而是外部状态同步，因此和 Element Plus 原生行为一样，不会执行 `beforeClose`。需要在 footer 等业务按钮中触发关闭确认时，请调用 `dialogRef.handleClose()`。

```vue
<template>
  <GaDialog
    ref="dialogInstance"
    v-model="dialogVisible"
    title="有未保存的修改"
    :show-close="false"
    :before-close="handleBeforeClose"
    :lock-scroll="false"
    modal-class="editor-dialog-modal"
  >
    <p>关闭前会由业务代码确认。</p>

    <template #footer>
      <ElButton @click="requestClose">关闭</ElButton>
    </template>
  </GaDialog>
</template>

<script setup lang="ts">
import { ElButton, type DialogBeforeCloseFn } from 'element-plus'
import { ref } from 'vue'
import { GaDialog, type GaDialogExpose } from 'ga-ui-plus/base'

const dialogVisible = ref(true)
const dialogInstance = ref<GaDialogExpose>()

const handleBeforeClose: DialogBeforeCloseFn = (done) => {
  try {
    if (window.confirm('确定放弃未保存的修改吗？')) {
      done()
    }
  } catch (error) {
    console.error('关闭确认失败', error)
  }
}

function requestClose() {
  dialogInstance.value?.dialogRef?.handleClose()
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
| `showFullscreen` | `boolean` | `true` | 是否显示右上角全屏/还原按钮 |
| `appendToBody` | `boolean` | `true` | 是否将对话框挂载到 `body` |
| `destroyOnClose` | `boolean` | `true` | 关闭时是否销毁插槽内容 |
| `center` | `boolean` | `false` | 是否让标题和底部区域居中 |
| `alignCenter` | `boolean` | `true` | 是否让对话框水平、垂直居中 |
| `draggable` | `boolean` | `true` | 是否允许拖动对话框 |
| `showClose` | `boolean` | `true` | 是否显示默认标题栏中的自定义关闭按钮；底层 Element Plus 原生关闭按钮始终关闭 |
| `closeOnClickModal` | `boolean` | `false` | 是否允许点击遮罩关闭 |
| `closeOnPressEscape` | `boolean` | `false` | 是否允许按 Escape 关闭 |
| `beforeClose` | `DialogBeforeCloseFn` | `undefined` | 传给底层 Element Plus 的关闭前回调；默认关闭按钮会触发，直接修改 `v-model` 不触发 |

### GaDialog Events

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:modelValue` | `(value: boolean)` | 底层模型变化时触发；用于 `v-model` |
| `update:fullscreen` | `(value: boolean)` | 点击全屏/还原按钮，或关闭时恢复内部全屏状态；用于 `v-model:fullscreen` |
| `open` | 无 | 对话框开始打开 |
| `opened` | 无 | 对话框打开动画结束 |
| `close` | 无 | 对话框开始关闭 |
| `closed` | 无 | 底层关闭动画结束后触发 |
| `open-auto-focus` | 无 | 打开后完成自动聚焦 |
| `close-auto-focus` | 无 | 关闭后完成自动聚焦恢复 |

### GaDialog Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `default` | 无 | 对话框主体内容 |
| `header` | `{ close, titleId, titleClass }` | 完整替换默认标题栏；可调用 `close()` 并复用标题的可访问性属性，但需要自行提供全屏与关闭操作 |
| `footer` | 无 | 自定义底部内容；组件不提供默认确认、取消等 footer 业务按钮 |

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
  void page
}

function handleSizeChange(size: number) {
  void size
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

### 颜色主题

`theme` 用于配置当前分页实例的颜色。主题支持部分覆盖，未传字段继续使用 `GaPagination` 默认值；配置会同时作用于普通模式和 `background` 模式。背景类字段同时支持普通颜色、CSS 变量和渐变等合法的 CSS `background` 值。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  GaPagination,
  type GaPaginationTheme,
} from 'ga-ui-plus/base'

const currentPage = ref(1)
const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f8fafc',
  activeColor: '#ffffff',
  activeBackgroundColor: '#0f766e',
  hoverColor: '#0f766e',
  hoverBackgroundColor: '#ccfbf1',
  disabledColor: '#98a2b3',
  disabledBackgroundColor: '#f2f4f7',
}
</script>

<template>
  <GaPagination
    v-model:current-page="currentPage"
    :total="100"
    :theme="paginationTheme"
  />
</template>
```

| 主题字段 | 说明 |
| --- | --- |
| `backgroundColor` | 整个分页容器背景，默认 `#EEEEEF`；组合组件可通过 `paginationTheme` 覆盖 |
| `textColor` | 总数、每页数量和跳转说明文字颜色 |
| `buttonColor` | 普通分页按钮和页码文字颜色 |
| `buttonBackgroundColor` | 普通分页按钮和页码背景色 |
| `activeColor` | 当前页文字颜色 |
| `activeBackgroundColor` | 当前页背景色 |
| `hoverColor` | 可交互分页项悬停文字颜色 |
| `hoverBackgroundColor` | 可交互分页项悬停背景色 |
| `disabledColor` | 禁用分页项文字颜色 |
| `disabledBackgroundColor` | 禁用分页项背景色 |

### GaPagination Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentPage` | `number` | `1` | 当前页，支持 `v-model:current-page` |
| `pageSize` | `number` | `10` | 每页条数，支持 `v-model:page-size` |
| `total` | `number` | `100` | 总条目数 |
| `pageSizes` | `number[]` | `[10, 20, 30, 40, 50]` | 可选的每页条数 |
| `size` | `ComponentSize` | `'default'` | 分页尺寸 |
| `layout` | `string` | `'total, sizes, prev, pager, next, jumper'` | 分页布局 |
| `background` | `boolean` | `false` | 是否为分页按钮添加背景 |
| `position` | `'left' \| 'center' \| 'right'` | `'right'` | 水平对齐方式 |
| `theme` | `GaPaginationTheme` | 默认颜色主题 | 当前分页实例的颜色配置，支持部分覆盖 |

未声明的属性与监听器经 `$attrs` 透传到底层 `ElPagination`，例如 `disabled`、`hide-on-single-page`。更多低频能力参见 [Element Plus Pagination 文档](https://element-plus.org/zh-CN/component/pagination.html)。

### GaPagination Events

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:current-page` | `(currentPage: number)` | 当前页变化；用于 `v-model:current-page` |
| `update:page-size` | `(pageSize: number)` | 每页条数变化；用于 `v-model:page-size` |
| `current-change` | `(currentPage: number)` | 底层分页当前页变化后同步触发 |
| `size-change` | `(pageSize: number)` | 底层分页每页条数变化后同步触发 |

## GaTablePagination

`GaTablePagination` 将 `GaTable` 与 `GaPagination` 组合为一个两行 Grid。它使用扁平 Props：排除 `height`、`maxHeight` 与两侧 `theme` 后组合表格和分页 Props，并通过 `tableTheme`、`paginationTheme` 分别配置内部组件，不需要 `tableProps` 或 `paginationProps` 对象。

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
  void page
}

function handlePageSizeChange(size: number) {
  currentPage.value = 1
  loadUsers(1)
  void size
}

function viewUser(row: UserRow) {
  void row
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

`GaTablePaginationProps<Row>` 是 `Omit<GaTableProps<Row>, 'height' | 'maxHeight' | 'theme'> & Omit<GaPaginationProps, 'theme'>`，并另外提供 `tableTheme` 与 `paginationTheme`。表格和分页共享同一个 `size`，因此 `size` 同时控制两者。

| 属性组 | 属性 | 默认行为 |
| --- | --- | --- |
| 表格数据与列 | `data`、`columns`、`rowKey` | 与 `GaTable` 相同：`[]`、`[]`、`undefined` |
| 表格外观 | `border`、`stripe`、`fit`、`showHeader` | 均为 `true` |
| 表格状态 | `highlightCurrentRow`、`emptyText`、`loading`、`loadingText` | 与 `GaTable` 相同：`false`、`'暂无数据'`、`false`、`'加载中...'` |
| 主题配置 | `tableTheme` | 传给内部 `GaTable` 的实例级颜色主题，支持部分覆盖 |
| 主题配置 | `paginationTheme` | 传给内部 `GaPagination` 的实例级颜色主题，支持部分覆盖 |
| 共享尺寸 | `size` | 同时传给 `GaTable` 与 `GaPagination`；未传时使用子组件默认行为 |
| 分页模型 | `currentPage`、`pageSize` | 与 `GaPagination` 相同：`1`、`10` |
| 分页数据 | `total`、`pageSizes` | 与 `GaPagination` 相同：`100`、`[10, 20, 30, 40, 50]` |
| 分页外观 | `layout`、`background`、`position` | `layout`、`position` 与 `GaPagination` 相同；`background` 默认为 `true` |

`height` 和 `maxHeight` 被有意排除，不能用于控制内部表格；请通过父容器高度控制整个组合组件。

> 迁移提示：`GaTablePagination` 不再接受含义不明确的 `theme`。原来的 `:theme="paginationTheme"` 需要改为 `:pagination-theme="paginationTheme"`；表格主题使用 `:table-theme="tableTheme"`。

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

## GaAsideMenu

`GaAsideMenu` 由 Element Plus 的 `ElAside`、`ElScrollbar` 与 `ElMenu` 组合而成。菜单固定为纵向模式，默认插槽可以直接放置原生 `ElSubMenu`、`ElMenuItem` 与 `ElMenuItemGroup`，因此 Element Plus 菜单的插槽、图标和路由能力都可以继续使用。`theme` 可统一配置侧栏、菜单项及折叠弹出层的主题颜色。

### 基础用法

`collapse` 驱动内部 `ElMenu` 和外层 `ElAside` 同步折叠，支持 `v-model:collapse`。`width` 控制展开宽度，`collapseWidth` 控制折叠宽度，默认分别为 `240px` 和 `64px`。父容器需要提供明确高度，内部 `ElScrollbar` 才能正确滚动。

`header`、`footer` 插槽可读取当前 `collapse` 状态。`collapse` 插槽用于自定义折叠控制，并提供 `toggle()`；未提供时组件使用内置的可访问按钮。

### 主题配置

通过 `theme` 设置背景、文字、激活态、悬停态与边框颜色。主题会同步应用到折叠后 Teleport 到 `body` 的子菜单弹层，并与消费方传入的 `popperClass`、`popperStyle` 合并：

```vue
<GaAsideMenu
  v-model:collapse="collapsed"
  :theme="{
    backgroundColor: '#101828',
    textColor: '#d0d5dd',
    activeTextColor: '#ffffff',
    activeBackgroundColor: '#155eef',
    hoverBackgroundColor: '#1d2939',
    borderColor: '#344054',
  }"
>
  <ElMenuItem index="dashboard">工作台</ElMenuItem>
</GaAsideMenu>
```

```vue
<template>
  <el-container class="layout">
    <GaAsideMenu
      v-model:collapse="collapsed"
      width="240px"
      default-active="1-1"
      unique-opened
      @toggle="handleToggle"
      @select="handleSelect"
    >
      <template #header="{ collapse }">
        <div class="layout-logo">
          <ElIcon><Grid /></ElIcon>
          <span v-if="!collapse">Ga Admin</span>
        </div>
      </template>

      <ElSubMenu index="1">
        <template #title>
          <ElIcon><Setting /></ElIcon>
          <span>系统管理</span>
        </template>
        <ElMenuItem index="1-1">
          <ElIcon><User /></ElIcon>
          <template #title>用户管理</template>
        </ElMenuItem>
        <ElMenuItem index="1-2">
          <template #title>权限管理</template>
        </ElMenuItem>
      </ElSubMenu>

      <ElMenuItemGroup title="看板">
        <ElMenuItem index="2-1">
          <template #title>数据概览</template>
        </ElMenuItem>
      </ElMenuItemGroup>
    </GaAsideMenu>

    <el-main>内容区</el-main>
  </el-container>
</template>

<script setup lang="ts">
import { Grid, Setting, User } from '@element-plus/icons-vue'
import { ElIcon, ElMenuItem, ElMenuItemGroup, ElSubMenu } from 'element-plus'
import { ref } from 'vue'
import { GaAsideMenu } from 'ga-ui-plus/business'

const collapsed = ref(false)

function handleToggle(_collapse: boolean) {
  // 可在这里持久化折叠状态。
}

function handleSelect(index: string) {
  // 可在这里执行路由跳转。
  void index
}
</script>

<style scoped>
.layout {
  height: 100vh;
}

.layout-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding-inline: 16px;
  font-weight: 600;
}
</style>
```

未提供 `collapse` 插槽时使用内置切换按钮。需要完全自定义切换区域时，通过作用域拿到 `collapse` 与 `toggle`。消费方需要为自定义触发器提供按钮语义和键盘交互：

```vue
<template>
  <GaAsideMenu v-model:collapse="collapsed">
    <template #collapse="{ collapse, toggle }">
      <ElButton
        :aria-label="collapse ? '展开菜单' : '折叠菜单'"
        @click="toggle"
      >
        {{ collapse ? '展开菜单' : '折叠菜单' }}
      </ElButton>
    </template>

    <ElMenuItem index="1-1">
      <template #title>用户管理</template>
    </ElMenuItem>
  </GaAsideMenu>
</template>

<script setup lang="ts">
import { ElButton, ElMenuItem } from 'element-plus'
import { ref } from 'vue'
import { GaAsideMenu } from 'ga-ui-plus/business'

const collapsed = ref(false)
</script>
```

### GaAsideMenu Props

`GaAsideMenuProps` 在 Element Plus Menu Props 基础上增加了 `collapse`、`width`、`collapseWidth` 与 `theme`。`mode` 固定为 `vertical`，`collapse` 由组件接管用于宽度联动；其余属性为除 `mode`/`collapse` 外的全部 Element Plus Menu Props。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `collapse` | `boolean` | `false` | 是否折叠，支持 `v-model:collapse` |
| `width` | `string` | `'240px'` | 展开时侧边栏宽度 |
| `collapseWidth` | `string` | `'64px'` | 折叠时侧边栏宽度 |
| `theme` | `GaAsideMenuTheme` | 内置蓝色渐变主题 | 配置侧栏、菜单项与折叠弹层的主题颜色，支持局部覆盖默认值 |
| `defaultActive` | `string` | `''` | 默认激活菜单 index |
| `defaultOpeneds` | `string[]` | `[]` | 默认展开的 SubMenu index 集合 |
| `uniqueOpened` | `boolean` | `false` | 是否只保持一个子菜单展开 |
| `router` | `boolean` | `false` | 是否启用路由模式；仅当值为 `true` 且应用实际安装并提供 Vue Router 实例时，选择菜单项才会调用 `router.push` 并提供 `routerResult`，否则仍是普通选择且 `routerResult` 为 `undefined`。配置节点使用 `index`，原生 `ElMenuItem` 可传 `route`，未传时使用该菜单项的 `index` |
| `menuTrigger` | `'hover' \| 'click'` | `'hover'` | 子菜单触发方式 |
| `backgroundColor` | `string` | `undefined` | 菜单背景色 |
| `textColor` | `string` | `undefined` | 菜单文字颜色 |
| `activeTextColor` | `string` | `undefined` | 激活菜单文字颜色 |
| `collapseTransition` | `boolean` | `true` | 是否开启折叠动画 |
| `ellipsis` | `boolean` | `true` | 文字溢出时是否省略 |
| `popperOffset` | `number` | `6` | 弹出层偏移 |
| `popperEffect` | `PopperEffect` | `'dark'` | 弹出层主题 |
| `popperClass` | `string` | `undefined` | 弹出层自定义类名 |
| `popperStyle` | `string \| CSSProperties` | `undefined` | 弹出层自定义样式 |
| `showTimeout` | `number` | `300` | 子菜单展开延时 |
| `hideTimeout` | `number` | `300` | 子菜单收起延时 |
| `closeOnClickOutside` | `boolean` | `false` | 点击外部是否收起弹出菜单 |
| `ellipsisIcon` | `string \| Component` | Element Plus 默认图标 | 省略图标 |
| `persistent` | `boolean` | `true` | 菜单收起时是否保留弹出层 DOM |

完整行为以 [Element Plus Menu 文档](https://element-plus.org/zh-CN/component/menu.html) 为准。

`GaAsideMenuTheme` 支持以下字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `backgroundColor` | `string` | 侧栏、菜单与折叠弹层背景色 |
| `textColor` | `string` | 默认文字与图标颜色 |
| `activeTextColor` | `string` | 激活菜单项文字与图标颜色 |
| `activeBackgroundColor` | `string` | 激活菜单项背景色 |
| `hoverBackgroundColor` | `string` | 菜单项和折叠按钮悬停背景色 |
| `borderColor` | `string` | 侧栏分隔线和折叠弹层边框颜色 |

### GaAsideMenu Events

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `update:collapse` | `(collapse: boolean)` | 折叠状态变化；用于 `v-model:collapse` |
| `toggle` | `(collapse: boolean)` | 折叠/展开切换动作执行后触发；外部处理方法通过 `@toggle` 传入 |
| `select` | `(index: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<unknown>)` | 原样转发 Element Plus 菜单选择事件 |
| `open` | `(index: string, indexPath: string[])` | 子菜单展开 |
| `close` | `(index: string, indexPath: string[])` | 子菜单收起 |

### GaAsideMenu Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `header` | `{ collapse: boolean }` | 侧边栏头部区域，通常放 logo 或产品名；未提供时不渲染 |
| `default` | 无 | 原生菜单内容，可直接使用 `ElSubMenu`、`ElMenuItem`、`ElMenuItemGroup` |
| `footer` | `{ collapse: boolean }` | 侧边栏底部区域；未提供时不渲染 |
| `collapse` | `{ collapse: boolean, toggle: () => void }` | 折叠/展开控制区域；未提供时使用内置按钮 |

### 访问底层菜单实例

`GaAsideMenuExpose` 的 `menuRef` 类型为 `MenuInstance | undefined`，可调用 Element Plus 菜单实例的 `open(index)`、`close(index)`、`handleResize()` 与 `updateActiveIndex(index)` 方法；`toggle()` 方法可在组件外触发与内置切换一致的折叠/展开动作（同样触发 `update:collapse` 与 `toggle` 事件）：

```vue
<template>
  <ElButton @click="openSystemMenu">展开系统管理</ElButton>
  <GaAsideMenu ref="asideMenuInstance" default-active="1-1">
    <ElSubMenu index="1">
      <template #title>系统管理</template>
      <ElMenuItem index="1-1">用户管理</ElMenuItem>
    </ElSubMenu>
  </GaAsideMenu>
</template>

<script setup lang="ts">
import { ElButton, ElMenuItem, ElSubMenu } from 'element-plus'
import { ref } from 'vue'
import {
  GaAsideMenu,
  type GaAsideMenuExpose,
} from 'ga-ui-plus/business'

const asideMenuInstance = ref<GaAsideMenuExpose>()

function openSystemMenu() {
  asideMenuInstance.value?.menuRef?.open('1')
}
</script>
```

## TypeScript 类型

所有公开类型均可从聚合入口导入，也可从所属的 `base` 或 `business` 入口导入。

| 类型 | 用途 |
| --- | --- |
| `GaDialogProps` | `GaDialog` 明确声明的常用 Props 子集 |
| `GaPaginationTheme` | `GaPagination` 的实例级颜色主题配置 |
| `GaDialogEmits` | `GaDialog` 的模型更新与生命周期事件签名 |
| `GaDialogHeaderSlotProps` | `header` 插槽作用域，包含 `close`、`titleId`、`titleClass` |
| `GaDialogExpose` | `GaDialog` 暴露实例类型，包含 `DialogInstance \| undefined` 的 `dialogRef` |
| `GaTableProps<Row>` | `GaTable` Props |
| `GaTableTheme` | `GaTable` 的实例级颜色主题配置 |
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
| `GaAsideMenuSlotProps` | `header`/`footer` 插槽作用域，包含 `collapse` |
| `GaAsideMenuTheme` | `GaAsideMenu` 主题颜色配置 |
| `GaAsideMenuToggleSlotProps` | `collapse` 插槽作用域，包含 `collapse` 与 `toggle()` |
| `GaAsideMenuProps` | `GaAsideMenu` Props；在 Element Plus Menu Props 上增加折叠、宽度与主题控制 |
| `GaAsideMenuEmits` | `GaAsideMenu` 的折叠更新、切换与 `select`/`open`/`close` 事件签名 |
| `GaAsideMenuExpose` | `GaAsideMenu` 暴露实例类型，包含 `menuRef` 与 `toggle()` |

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

- `GaDialog` 显式转发 `v-model`、全屏状态更新与对话框生命周期事件，并将其他 `$attrs` 绑定到内部 `ElDialog`。底层原生关闭按钮始终关闭，默认标题栏使用自绘全屏和关闭按钮；自绘关闭按钮通过 Element Plus 的 `handleClose` 流程执行 `beforeClose`。传入 `header` 插槽会替换整套默认标题栏。组件不内置 `footer` 内容或确认、取消等业务按钮。
- `GaTable` 使用 `inheritAttrs: false`，并将普通 `$attrs` 直接绑定到内部 `ElTable`；未声明的 Element Plus 表格事件也随监听器一起透传。
- `GaPagination` 使用相同策略，将普通 `$attrs` 绑定到内部 `ElPagination`。组件当前不转发分页插槽。
- `GaAsideMenu` 固定菜单 `mode="vertical"`，菜单内容通过默认插槽直接使用 Element Plus 菜单节点。`collapse`、`width`、`collapseWidth` 与 `theme` 由组件接管，其余菜单 Props 传给内部 `ElMenu`；主题变量会同时传给折叠子菜单弹层，并与 `popperClass`、`popperStyle` 合并。普通 `$attrs` 绑定在根部 `ElAside`。`select`/`open`/`close` 事件原样转发，其中 `routerResult` 使用 `Promise<unknown>` 表达。父容器需要提供明确高度，内部 `ElScrollbar` 才能正确滚动。
- `GaTablePagination` 的普通 `$attrs` 绑定在根 `<div>`，包括 `class`、`style`、`id` 和普通监听器；它们不会自动分发给内部表格或分页。组件只转发明确声明的四个分页事件，不会透传 `selection-change` 等表格事件；选择列只展示选择 UI。需要读取选择结果时，请使用 `GaTable` 与 `GaPagination` 组合。
- `GaTablePagination` 当前不暴露底层 `tableRef`。需要调用 `clearSelection`、`doLayout` 等表格实例方法时，请使用 `GaTable` 与 `GaPagination` 组合。
- `GaTablePagination` 不接受 `height`、`maxHeight`、`tableProps` 或 `paginationProps`；内部表格高度由组件固定，其他能力通过扁平 Props 和表格插槽提供。
- `GaTableColumn` 只覆盖当前类型文件声明的列字段。需要其他 Element Plus 列能力时，可在 `column-prepend` 或默认插槽中直接使用 `ElTableColumn`。
