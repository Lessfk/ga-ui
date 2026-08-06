# GaTablePagination 平铺属性 API 设计

## 背景

`GaTablePagination` 当前使用 `tableProps` 和 `paginationProps` 两个配置对象，分页还通过 `v-model:pagination-props` 更新整个对象。该 API 在业务页面中需要额外声明和维护配置对象，使用成本高于直接传递表格与分页属性。

本次将组合组件调整为完全平铺的属性 API，同时保留现有自适应布局、固定分页高度和表格插槽转发能力。

## 目标

- 删除 `tableProps` 和 `paginationProps` 两个对象属性。
- 删除 `v-model:pagination-props` 和 `update:pagination-props`。
- 将 `GaTable` 与 `GaPagination` 当前支持的属性直接暴露在 `GaTablePagination` 上。
- 使用 `v-model:current-page` 和 `v-model:page-size` 管理分页状态。
- 一个 `size` 属性同时控制内部表格和分页尺寸。
- 保持表格高度自适应、分页固定 50px、根属性合并和全部表格插槽转发。

## 非目标

- 不兼容旧的对象属性 API。
- 不修改独立的 `GaTable` 和 `GaPagination` API。
- 不增加属性前缀，例如 `table-*` 或 `pagination-*`。
- 不开放 `height`、`maxHeight` 或分页高度配置。
- 不增加分页显示或隐藏功能。

## 使用方式

新的推荐用法：

```vue
<GaTablePagination
  :data="rows"
  :columns="columns"
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="100"
  :border="false"
  :background="true"
  size="default"
>
  <template #status="{ row }">
    {{ row.status }}
  </template>
</GaTablePagination>
```

旧用法将不再支持：

```vue
<GaTablePagination
  :table-props="tableProps"
  v-model:pagination-props="paginationProps"
/>
```

## 属性 API

### 表格属性

以下属性传给内部 `GaTable`：

- `data`
- `columns`
- `rowKey`
- `border`
- `stripe`
- `size`
- `fit`
- `showHeader`
- `highlightCurrentRow`
- `emptyText`
- `loading`
- `loadingText`

不暴露 `height` 和 `maxHeight`。组合组件始终向内部表格传入 `height="100%"`，保证表格占据 Grid 第一行的全部可用高度。

### 分页属性

以下属性传给内部 `GaPagination`：

- `currentPage`
- `pageSize`
- `total`
- `pageSizes`
- `size`
- `layout`
- `background`

`size` 同时传给 `GaTable` 和 `GaPagination`，从而用一个属性统一组合组件的尺寸规格。

### 根节点属性

组件继续设置 `inheritAttrs: false`，并把 `$attrs` 绑定到 `.ga-table-pagination` 根节点。调用方的 `class`、`style` 和普通 DOM 属性不会泄漏到内部表格或分页组件。

## 公开类型

只保留一个公开组合组件类型：

```ts
export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps
```

`GaTableProps` 和 `GaPaginationProps` 中重名的 `size` 类型都是 Element Plus 的 `ComponentSize`，交叉后仍为同一个可选属性。

删除以下旧类型导出：

- `GaTablePaginationTableProps`
- `GaTablePaginationPaginationProps`

`tablePagination/index.ts`、`tablePagination/types/index.ts` 和组件库根入口继续导出 `GaTablePaginationProps`。

## 内部属性分发

组合组件不把全部 props 整体透传给两个子组件，避免分页属性进入表格 DOM 或表格属性进入分页 DOM。模板显式绑定每个子组件支持的属性。

表格结构：

```vue
<GaTable
  :data="props.data"
  :columns="props.columns"
  :row-key="props.rowKey"
  :border="props.border"
  :stripe="props.stripe"
  :size="props.size"
  :fit="props.fit"
  :show-header="props.showHeader"
  :highlight-current-row="props.highlightCurrentRow"
  :empty-text="props.emptyText"
  :loading="props.loading"
  :loading-text="props.loadingText"
  height="100%"
>
  <!-- 转发表格插槽 -->
</GaTable>
```

分页结构：

```vue
<GaPagination
  :current-page="props.currentPage"
  :page-size="props.pageSize"
  :total="props.total"
  :page-sizes="props.pageSizes"
  :size="props.size"
  :layout="props.layout"
  :background="props.background"
  @current-change="handleCurrentChange"
  @size-change="handleSizeChange"
/>
```

子组件继续负责自身默认值。组合组件传递 `undefined` 时，Vue 会使用 `GaTable` 或 `GaPagination` 已声明的默认值，避免在组合组件中维护重复默认配置。

## 分页数据流

组合组件声明四个事件：

```ts
const emit = defineEmits<{
  'update:current-page': [currentPage: number]
  'update:page-size': [pageSize: number]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()
```

当前页变化：

```ts
function handleCurrentChange(currentPage: number) {
  emit('update:current-page', currentPage)
  emit('current-change', currentPage)
}
```

每页数量变化：

```ts
function handleSizeChange(pageSize: number) {
  emit('update:page-size', pageSize)
  emit('size-change', pageSize)
}
```

组合组件不再创建或修改分页配置对象。

## 保持不变的行为

- 根容器仍使用两行 CSS Grid：`minmax(0, 1fr) 50px`。
- 宽度和高度仍为父容器的 `100%`。
- 分页高度仍固定为 50px。
- 表格仍占据剩余空间，并在短视口内部滚动。
- 所有调用方插槽仍动态转发给 `GaTable`。
- `GaTable` 和 `GaPagination` 仍可独立导入和使用。

## Playground 迁移

Playground 删除 `tableProps` 和 `paginationProps` 对象，改为：

```ts
const currentPage = ref(1)
const pageSize = ref(10)
```

```vue
<GaTablePagination
  :data="rows"
  :columns="columns"
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="100"
>
  <!-- 保留现有插槽 -->
</GaTablePagination>
```

## 测试策略

### 组件测试

- 平铺表格属性只传给 `GaTable`。
- 平铺分页属性只传给 `GaPagination`。
- `size` 同时传给两个子组件。
- 内部表格始终收到 `height="100%"`。
- 组件运行时 props 不再包含 `tableProps` 和 `paginationProps`。
- 当前页变化发出 `update:current-page` 和 `current-change`。
- 每页数量变化发出 `update:page-size` 和 `size-change`。
- 根节点 `class`、`style` 和表格插槽行为保持不变。

### 类型与导出测试

- 根入口可以导入 `GaTablePaginationProps`。
- 根入口不再导出两个旧配置对象类型。
- `GaTablePaginationProps` 不允许 `height` 和 `maxHeight`。

### 构建与浏览器验收

- UI 组件库测试、Vite 构建和声明生成通过，声明生成无 TypeScript 错误。
- Playground 类型检查和构建通过。
- 正常和短视口下布局尺寸、50px 分页和内部滚动保持不变。
- 页码和每页数量交互可以更新两个独立 v-model。
- 浏览器控制台无新增错误或警告。

## 兼容性

这是一次明确的破坏式 API 变更。所有使用 `tableProps`、`paginationProps` 或 `v-model:pagination-props` 的调用方都必须迁移到平铺属性和两个独立 v-model。独立组件 `GaTable`、`GaPagination` 不受影响。
