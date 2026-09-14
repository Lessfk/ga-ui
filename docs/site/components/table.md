<script setup>
import BasicDemo from '../demos/table/BasicDemo.vue'
import SelectionDemo from '../demos/table/SelectionDemo.vue'
</script>

# Table 表格

`GaTable` 封装 `ElTable`，主要增加配置式 `columns`、动态单元格插槽、默认空状态、加载状态和实例级颜色主题。复杂列仍可直接通过插槽使用 `ElTableColumn`。

## 配置式列

<DemoPreview title="基础表格" description="通过 columns 配置列，并用 slot 字段关联同名插槽。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/table/BasicDemo.vue
:::

## 选择与主题

<DemoPreview title="选择列和独立主题" description="selection-change 由底层 ElTable 通过 attrs 透传。">
  <SelectionDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/table/SelectionDemo.vue
:::

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Row[]` | `[]` | 表格数据 |
| `columns` | `GaTableColumn<Row>[]` | `[]` | 配置式列 |
| `height` | `string \| number` | `undefined` | 固定表格高度 |
| `maxHeight` | `string \| number` | `undefined` | 最大高度 |
| `rowKey` | `string \| ((row) => string)` | `undefined` | 行主键 |
| `border` | `boolean` | `true` | 是否显示纵向边框 |
| `stripe` | `boolean` | `true` | 是否显示斑马纹 |
| `size` | `ComponentSize` | `undefined` | 尺寸 |
| `fit` | `boolean` | `true` | 列宽是否自动撑开 |
| `showHeader` | `boolean` | `true` | 是否显示表头 |
| `highlightCurrentRow` | `boolean` | `false` | 是否高亮当前行 |
| `emptyText` | `string` | `'暂无数据'` | 默认空状态描述 |
| `loading` | `boolean` | `false` | 是否显示 Element Plus Loading |
| `loadingText` | `string` | `'加载中...'` | 加载文字 |
| `theme` | `GaTableTheme` | 内置主题 | 当前实例颜色配置 |

其他 `ElTable` 属性和监听器通过 `$attrs` 绑定到内部表格。

#### Columns

| 字段 | 说明 |
| --- | --- |
| `key` | 配置列的 Vue key，不传给 `ElTableColumn` |
| `slot` | 选择用于单元格渲染的命名插槽，不传给 `ElTableColumn` |
| `type` | `default`、`selection`、`index`、`expand` 等列类型 |
| `prop` / `property` / `label` | 字段名和列标题 |
| `width` / `minWidth` / `fixed` | 宽度和固定方向 |
| `align` / `headerAlign` | 单元格和表头对齐 |
| `sortable` / `sortMethod` / `sortBy` | 排序配置 |
| `filters` / `filterMethod` / `filteredValue` | 筛选配置 |
| `formatter` | 单元格格式化函数 |
| `selectable` / `reserveSelection` | 选择列行为 |
| `showOverflowTooltip` | 溢出提示 |
| `className` / `labelClassName` | 单元格和表头类名 |
| `resizable` / `columnKey` / `filterPlacement` / `filterMultiple` / `index` | 其他已声明列配置 |

#### Theme

| 字段 | 说明 |
| --- | --- |
| `backgroundColor` | 表格整体背景 |
| `rowBackgroundColor` | 普通数据行背景 |
| `textColor` | 正文文字颜色 |
| `headerBackgroundColor` / `headerTextColor` | 表头背景和文字 |
| `borderColor` | 边框颜色 |
| `stripeBackgroundColor` | 斑马纹背景 |
| `hoverBackgroundColor` | 行悬停背景 |
| `currentRowBackgroundColor` | 当前行背景 |
| `expandedRowBackgroundColor` | 展开行背景 |

### Events

组件没有重新声明完整的表格事件，未声明监听器会随 `$attrs` 透传到 `ElTable`。常用事件包括 `selection-change`、`current-change`、`row-click`、`sort-change` 和 `filter-change`，参数行为以 Element Plus Table 为准。

### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `column-prepend` | 无 | 放在配置列之前，适合手写选择列或展开列 |
| `default` | 无 | 放在配置列之后，适合手写操作列 |
| `[column.slot]` | `{ row, column, $index }` | 配置列的动态命名插槽 |
| `empty` | 无 | 替换默认 `ElEmpty` |
| `append` | 无 | 表格末尾追加区域 |

### Expose

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `tableRef` | `TableInstance \| undefined` | 内部 Element Plus Table 实例，可调用 `clearSelection`、`doLayout` 等方法 |

### 公开类型

可导入 `GaTableProps`、`GaTableColumn`、`GaTableCellScope`、`GaTableTheme`、`GaTableExpose` 和 `GaTableRowKey`。
