# GaTablePagination 组合组件设计

## 背景

`GaTable` 和 `GaPagination` 已拆分为两个独立组件。业务页面仍需要一种标准组合方式：组件整体填满父容器的宽度和高度，表格占据扣除分页后的剩余空间，分页固定为 50px。

本次在 `components/tablePagination` 中实现 `GaTablePagination`。该组件只负责组合、布局、分页配置对象更新和表格插槽转发，不把布局职责重新放回 `GaTable`。

## 目标

- 在 `tablePagination` 目录实现并导出 `GaTablePagination`。
- 内部组合现有 `GaTable` 和 `GaPagination`。
- 组件宽度、高度均为父容器的 100%。
- 表格占据剩余高度和全部可用宽度。
- 分页固定高度为 50px。
- 使用 `tableProps` 和 `paginationProps` 两个配置对象。
- 支持 `v-model:pagination-props` 更新整个分页配置对象。
- 转发 `GaTable` 的全部插槽。
- 从 UI 组件库根入口导出组件和公开类型。

## 非目标

- 不使用 `ResizeObserver` 或 JavaScript 计算父容器尺寸。
- 不修改 `GaTable` 或 `GaPagination` 的职责和公开 API。
- 不在组合组件中请求表格数据或管理服务端查询。
- 不提供可配置分页高度；本次固定为 50px。
- 不增加分页显示/隐藏功能。

## 方案选择

使用 CSS Grid：

```scss
grid-template-rows: minmax(0, 1fr) 50px;
```

父容器尺寸变化时由浏览器自动重新计算布局。相比 Flex，该方案明确表达表格剩余空间与固定分页行的关系；相比 `ResizeObserver`，无需额外状态、监听器和尺寸计算。

## 目录结构

```text
packages/ui-element/src/components/tablePagination/
├─ index.ts
├─ src/
│  ├─ __tests__/
│  │  └─ table-pagination.spec.ts
│  ├─ index.vue
│  └─ props.ts
├─ style/
│  └─ index.scss
└─ types/
   └─ index.ts
```

## 公开类型

```ts
import type {
  GaTableProps,
  GaTableRow,
} from '../../table'
import type { GaPaginationProps } from '../../pagination'

export type GaTablePaginationTableProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'>

export type GaTablePaginationPaginationProps = GaPaginationProps

export interface GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> {
  tableProps?: GaTablePaginationTableProps<Row>
  paginationProps?: GaTablePaginationPaginationProps
}
```

`tableProps` 不暴露 `height` 和 `maxHeight`，因为组合组件统一为内部表格设置 `height="100%"`。分页配置保持 `GaPaginationProps` 的现有类型。

## 组件 API

```vue
<GaTablePagination
  :table-props="tableProps"
  v-model:pagination-props="paginationProps"
  class="user-table"
>
  <template #status="scope">
    <!-- 表格列插槽 -->
  </template>
</GaTablePagination>
```

默认值：

```ts
tableProps: () => ({})
paginationProps: () => ({})
```

根节点设置 `inheritAttrs: false`，并通过 `v-bind="$attrs"` 接收使用方的 `class`、`style` 和普通 DOM 属性。这些属性作用于组合组件容器，不传给内部表格。

## 模板结构

```vue
<div
  class="ga-table-pagination"
  v-bind="$attrs"
>
  <GaTable
    v-bind="props.tableProps"
    height="100%"
  >
    <!-- 动态转发全部调用方插槽 -->
  </GaTable>

  <GaPagination
    v-bind="props.paginationProps"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</div>
```

`height="100%"` 写在 `v-bind="props.tableProps"` 之后，确保组合组件拥有最终高度控制权。

## 分页数据流

组件声明事件：

```ts
const emit = defineEmits<{
  'update:pagination-props': [
    paginationProps: GaTablePaginationPaginationProps,
  ]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
}>()
```

当前页变化：

```ts
function handleCurrentChange(currentPage: number) {
  emit('update:pagination-props', {
    ...props.paginationProps,
    currentPage,
  })
  emit('current-change', currentPage)
}
```

每页数量变化：

```ts
function handleSizeChange(pageSize: number) {
  emit('update:pagination-props', {
    ...props.paginationProps,
    pageSize,
  })
  emit('size-change', pageSize)
}
```

每次变化都创建新对象，不直接修改传入的 `paginationProps`。

## 插槽转发

组合组件把调用方提供的全部插槽转发给内部 `GaTable`：

```vue
<template
  v-for="(_, name) in $slots"
  #[name]="scope"
>
  <slot
    :name="name"
    v-bind="scope ?? {}"
  />
</template>
```

该方式覆盖：

- 默认列插槽。
- `column-prepend`。
- `empty`。
- `append`。
- 配置列使用的任意动态命名插槽。

## 样式

```scss
.ga-table-pagination {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  > .ga-table {
    width: 100%;
    min-width: 0;
    min-height: 0;
  }

  > .ga-pagination {
    width: 100%;
    height: 50px;
    min-height: 50px;
  }
}
```

组合组件依赖父容器具有可计算高度。如果父容器没有明确高度，`height: 100%` 无法产生可用的剩余空间，这是使用方布局的责任。

## 导出

`tablePagination/index.ts` 导出：

- `GaTablePagination`。
- `GaTablePaginationProps`。
- `GaTablePaginationTableProps`。
- `GaTablePaginationPaginationProps`。

组件库根入口增加：

```ts
export * from './components/tablePagination'
```

## Playground

Playground 改为使用 `GaTablePagination`，外层只负责提供明确尺寸：

```vue
<section class="table-area">
  <GaTablePagination
    :table-props="tableProps"
    v-model:pagination-props="paginationProps"
  >
    <!-- 保留现有表格插槽 -->
  </GaTablePagination>
</section>
```

```scss
.table-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
}
```

## 测试策略

### 组件测试

- 渲染一个 `GaTable` 和一个 `GaPagination`。
- `tableProps` 正确传递给 `GaTable`。
- `paginationProps` 正确传递给 `GaPagination`。
- 内部 `GaTable` 始终收到 `height="100%"`。
- `tableProps` 的公开类型不允许 `height/maxHeight`。
- 当前页变化产生新的分页配置对象并转发 `current-change`。
- 每页数量变化产生新的分页配置对象并转发 `size-change`。
- 原始 `paginationProps` 对象不被修改。
- 默认、`empty`、`append`、`column-prepend` 和动态命名插槽均转发到 `GaTable`。
- 调用方 `class/style` 作用于组合组件根节点。

### 导出与构建

- 根入口导出的 `GaTablePagination` 与组件 barrel 引用一致。
- 根入口可导入全部公开类型。
- UI 组件库单元测试通过。
- UI 组件库 Vite 和声明文件构建通过。
- Playground 类型检查和构建通过。

### 浏览器验收

- 组合组件宽高等于父容器。
- `GaTable` 与 `GaPagination` 是组合组件的直接子节点。
- 分页高度始终为 50px。
- 常规视口下表格占据剩余高度和全部宽度。
- 短视口下表体内部滚动，页面外层不产生纵向滚动。
- 调整父容器或浏览器宽度后，表格和分页宽度随父容器变化。
- 分页交互能够更新 `paginationProps`。
- 浏览器控制台无新增错误或警告。

## 兼容性

这是新增组件，不改变 `GaTable` 和 `GaPagination` 的现有 API。原来手动组合两个组件的页面仍可继续使用；需要标准自适应布局的页面可以迁移到 `GaTablePagination`。
