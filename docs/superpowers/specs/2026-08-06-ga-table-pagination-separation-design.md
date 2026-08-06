# GaTable 与 GaPagination 拆分设计

## 背景

当前 `GaTable` 同时封装了 Element Plus 的 `ElTable` 和 `ElPagination`。表格组件内部负责分页配置、分页事件、分页样式以及表格与分页的两行高度布局，导致表格职责不单一，也限制了分页在其他业务场景中的复用。

本次调整将两个 Element Plus 组件拆成独立的 `GaTable` 和 `GaPagination`。`GaTable` 不再包含任何分页能力，也不再实现自动填充父容器高度的 `autoHeight` 功能。分页与整体高度布局均由使用方组合和控制。

## 目标

- `GaTable` 只封装 `ElTable`，保留列配置、插槽、加载状态、显式高度和 `tableRef`。
- `GaTable` 根节点直接是 `ElTable`，删除 `.ga-table-container` 外层节点。
- 删除 `autoHeight` 属性、计算逻辑、动态高度恢复逻辑和相关样式。
- 新增可独立使用的 `GaPagination`，封装 `ElPagination`。
- `GaPagination` 支持 `v-model:current-page` 和 `v-model:page-size`。
- `GaPagination` 保留现有分页默认值和 50px 高度样式。
- UI 组件库根入口同时导出 `GaTable`、`GaPagination` 及其公开类型。
- Playground 展示表格和分页由外层布局组合的用法。

## 非目标

- 不在 `GaTable` 中保留兼容性的 `pagination` 属性。
- 不由 `GaTable` 转发分页事件。
- 不由 `GaTable` 推导或自动计算父容器剩余高度。
- 不引入请求数据、分页查询或服务端状态管理逻辑。
- 不修改 Element Plus 的全局主题配置。

## 公开 API

### GaTable

从 `GaTableProps` 中删除：

- `pagination`
- `autoHeight`

从 `GaTable` 自定义的分页事件声明中删除：

- `size-change`
- `current-change`

这里删除的是旧分页语义。`ElTable` 原生的 `current-change(currentRow, oldCurrentRow)` 仍通过 `$attrs` 原样透传。

`height` 和 `maxHeight` 属性继续保留并直接传给 `ElTable`，包括值为 `0` 的情况。其余表格属性、插槽、原生 `ElTable` 属性和事件透传方式保持不变。

### GaPagination

`GaPagination` 明确定义以下常用属性：

```ts
export interface GaPaginationProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  size?: ComponentSize
  layout?: string
  background?: boolean
}
```

默认值沿用当前 `GaTable` 内的分页默认值：

```ts
currentPage: 1
pageSize: 10
total: 100
pageSizes: [10, 20, 30, 40, 50]
size: 'default'
background: true
layout: 'total, sizes, prev, pager, next, jumper'
```

组件支持：

```vue
<GaPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="total"
/>
```

事件定义：

- `update:current-page`：更新 `v-model:current-page`。
- `update:page-size`：更新 `v-model:page-size`。
- `current-change`：保留 Element Plus 当前页变化事件。
- `size-change`：保留 Element Plus 每页数量变化事件。

未显式封装的 Element Plus 分页属性和监听器通过 `$attrs` 传递给 `ElPagination`。

## 目录结构

```text
packages/ui-element/src/components/
├─ table/
│  ├─ index.ts
│  ├─ src/index.vue
│  ├─ src/props.ts
│  ├─ style/index.scss
│  └─ types/index.ts
└─ pagination/
   ├─ index.ts
   ├─ src/index.vue
   ├─ src/props.ts
   ├─ style/index.scss
   └─ types/index.ts
```

## 组件职责与数据流

### GaTable

`GaTable` 模板根节点直接使用 `ElTable`，并添加 `.ga-table` 类。组件不增加额外包装节点，也不读取父容器尺寸。

`height` 和 `maxHeight` 直接绑定到 `ElTable`。如果使用方需要让表格填满布局区域，应显式传入 `height="100%"`，并由使用方保证父级布局具有明确高度。

删除此前仅服务于 `autoHeight` 的 `isAutoHeight`、`tableHeight`、`tableStyle`、`watch`、`nextTick`、`useAttrs` 和 `doLayout()` 恢复逻辑。`tableRef` 仍通过 `defineExpose` 暴露。

### GaPagination

`GaPagination` 接收外部模型值，将其传给 `ElPagination`。当 Element Plus 触发当前页或每页数量变化时，组件同时触发对应的 `update:*` 事件和原生变化事件。

`GaPagination` 设置 `inheritAttrs: false`，并将 `$attrs` 绑定到 `ElPagination`，避免属性落到额外 DOM 节点上。组件模板不增加包装元素，根节点就是 `ElPagination`。

## 样式职责

- `.el-table.ga-table` 的表格视觉变量和表头样式保留在 `table/style/index.scss`。
- `.el-pagination.ga-pagination` 的全部样式迁移到 `pagination/style/index.scss`。
- `GaPagination` 保持 `height` 和 `min-height` 均为 `50px`。
- 表格与分页的两行布局不属于任何单个组件，由使用方的父容器控制。

Playground 使用：

```scss
.table-layout {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 50px;
  flex: 1;
  min-height: 0;
}
```

Playground 中的 `GaTable` 显式传入 `height="100%"`，不再使用 `auto-height`。

## 导出

组件库入口增加：

```ts
export * from './components/pagination'
```

`pagination/index.ts` 导出：

- `GaPagination`
- `GaPaginationProps`

本次没有额外的分页类型别名或公开实例能力需求，因此只导出组件和属性类型。

## 兼容性

这是一次明确的破坏性调整：原有 `GaTable` 的 `pagination`、`autoHeight` 属性以及分页变化事件将被删除，`.ga-table-container` DOM 节点也将不再存在。现有调用方需要把分页配置迁移到独立的 `GaPagination`，并自行控制表格高度布局。

迁移前：

```vue
<GaTable
  :data="rows"
  :pagination="pagination"
  @current-change="handleCurrentChange"
/>
```

迁移后：

```vue
<div class="table-layout">
  <GaTable
    height="100%"
    :data="rows"
  />
  <GaPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    @current-change="handleCurrentChange"
  />
</div>
```

## 测试策略

### GaPagination 测试

- 使用批准的默认分页配置渲染 `ElPagination`。
- 自定义属性覆盖默认值。
- 其他属性透传给 `ElPagination`。
- 当前页变化同时触发 `update:current-page` 和 `current-change`。
- 每页数量变化同时触发 `update:page-size` 和 `size-change`。

### GaTable 回归测试

- 不再渲染 `ElPagination`。
- 不再接受或处理分页配置。
- 根节点直接是 `ElTable`，不再渲染 `.ga-table-container`。
- 不再接受或处理 `autoHeight`。
- `height`、`maxHeight` 及其 `0` 值直接传给 `ElTable`。
- 原生 `ElTable` 的 `current-change` 保持当前行、旧当前行双参数透传。
- 表格默认值、列配置、插槽、原生事件和实例暴露继续通过。

### 集成验证

- UI 组件库单元测试全部通过。
- UI 组件库 Vite 与声明文件构建通过。
- Playground 类型检查和 Vite 构建通过。
- Playground 通过外层 Grid 和 `height="100%"` 让表格占据剩余高度，分页固定 50px，表体内部滚动。
