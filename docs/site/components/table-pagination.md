<script setup>
import BasicDemo from '../demos/table-pagination/BasicDemo.vue'
import LoadingDemo from '../demos/table-pagination/LoadingDemo.vue'
</script>

# TablePagination 表格分页

`GaTablePagination` 使用两行 Grid 组合 `GaTable` 和 `GaPagination`。它适合具有固定内容高度的列表页，并用一层扁平 Props 同时配置表格和分页。

## 基础用法

组件内部表格高度固定为 `100%`，因此外层容器必须提供明确高度。

<DemoPreview title="表格与分页联动" description="切换页码和每页数量时由外部计算当前页数据。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/table-pagination/BasicDemo.vue
:::

## Loading 与主题

`loading` 同时控制表格加载遮罩和分页禁用状态。表格与分页主题分别使用 `tableTheme` 和 `paginationTheme`。

<DemoPreview title="加载时禁用分页" description="点击模拟加载，观察表格遮罩和分页按钮。">
  <LoadingDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/table-pagination/LoadingDemo.vue
:::

## API

### Props

组件组合 `GaTableProps` 和 `GaPaginationProps`，但不接受 `height`、`maxHeight`、`theme` 和分页 `disabled`。以下是组合组件使用时最重要的字段。

| 分类 | 属性 | 默认值 | 说明 |
| --- | --- | --- | --- |
| 表格 | `data` / `columns` / `rowKey` | 与 `GaTable` 一致 | 表格数据、配置列和行主键 |
| 表格 | `border` / `stripe` / `fit` / `showHeader` | `true` | 表格显示行为 |
| 表格 | `highlightCurrentRow` / `emptyText` | 与 `GaTable` 一致 | 当前行和空状态 |
| 表格 | `loading` / `loadingText` | `false` / `'加载中...'` | 加载状态；`loading` 同时禁用分页 |
| 共享 | `size` | `'default'` | 同时控制表格和分页尺寸 |
| 分页 | `currentPage` / `pageSize` / `total` | `1` / `10` / `0` | 分页模型与总数 |
| 分页 | `pageSizes` / `layout` / `background` | 与 `GaPagination` 一致 | 分页选项和布局；`background` 默认为 `true` |
| 分页 | `position` | `'right'` | 分页对齐 |
| 主题 | `tableTheme` | `undefined` | `GaTableTheme` |
| 主题 | `paginationTheme` | `undefined` | `GaPaginationTheme` |

普通 `$attrs` 绑定在组合组件根元素，不会自动分发给内部表格或分页。因此 `selection-change` 等表格监听器不能直接写在 `GaTablePagination` 上。

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:current-page` | `(page: number)` | 当前页变化 |
| `update:page-size` | `(size: number)` | 每页数量变化 |
| `current-change` | `(page: number)` | 当前页业务事件 |
| `size-change` | `(size: number)` | 每页数量业务事件 |

### Slots

组件把收到的插槽统一转发给内部 `GaTable`，可使用 `column-prepend`、默认插槽、配置列命名插槽、`empty` 和 `append`。分页插槽不支持。

### Expose

当前组件没有公开底层 `tableRef` 或分页实例。需要调用 `clearSelection()`、`doLayout()` 等表格实例方法时，请单独组合 `GaTable` 和 `GaPagination`。

### 公开类型

```ts
import type { GaTablePaginationProps } from 'ga-ui-plus/business'
```

`GaTablePaginationProps<Row>` 保留行泛型，可继续为 `columns` 和命名插槽提供行类型提示。
