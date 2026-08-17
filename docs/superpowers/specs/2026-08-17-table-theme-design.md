# GaTable 颜色主题配置设计

## 背景与目标

当前 `GaTable` 在 SCSS 中固定了表格、数据行、表头、边框、悬停行、当前行和展开行的颜色。使用方只能覆盖 Element Plus CSS Variables 或内部选择器，缺少类型提示，也无法像 `GaPagination` 一样通过实例级主题对象完成部分配置。

本次为 `GaTable` 增加类型安全、支持部分覆盖的颜色主题配置，并让 `GaTablePagination` 可以分别配置表格主题和分页主题。未传主题时保持现有视觉与行为，不调整行高、字号、圆角、间距、阴影、列定义、数据事件或插槽。

## 方案选择

采用 `theme` 对象映射 CSS Variables：

- `GaTable` 使用与 `GaPagination` 一致的实例级 `theme` API。
- 主题字段集中描述颜色，不把结构样式混入主题职责。
- 优先复用 Element Plus 表格变量，仅为斑马纹补充 `--ga-table-*` 变量和局部选择器。
- 主题支持部分覆盖，未传字段继承当前默认配色。
- 使用方传入的普通 `style` 与主题变量合并，并保持最终覆盖能力。

`GaTablePagination` 已有 `theme` 表示分页主题，不能直接同时表示表格主题。组合组件将移除含义不明确的 `theme`，改为显式的 `tableTheme` 和 `paginationTheme`。

## 公共类型

新增：

```ts
export interface GaTableTheme {
  backgroundColor?: string
  rowBackgroundColor?: string
  textColor?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  borderColor?: string
  stripeBackgroundColor?: string
  hoverBackgroundColor?: string
  currentRowBackgroundColor?: string
  expandedRowBackgroundColor?: string
}
```

`GaTableProps<Row>` 新增：

```ts
theme?: GaTableTheme
```

字段含义：

- `backgroundColor`：表格根容器与空状态区域背景色。
- `rowBackgroundColor`：普通数据行背景色。
- `textColor`：普通单元格文字颜色。
- `headerBackgroundColor`：表头背景色。
- `headerTextColor`：表头文字颜色。
- `borderColor`：表格与单元格边框颜色。
- `stripeBackgroundColor`：开启 `stripe` 时斑马纹行背景色。
- `hoverBackgroundColor`：可交互行悬停背景色。
- `currentRowBackgroundColor`：开启 `highlight-current-row` 时当前行背景色。
- `expandedRowBackgroundColor`：展开行内容区域背景色。

所有字段接受合法 CSS 颜色值，包括十六进制、RGB、HSL 和 CSS 变量。组件不在运行时解析或校验颜色字符串；非法值由浏览器忽略。第一版不承诺渐变背景支持。

## 默认主题与合并规则

默认主题保持当前 `GaTable` 视觉：

```ts
const defaultTheme: Required<GaTableTheme> = {
  backgroundColor: '#ffffff',
  rowBackgroundColor: '#ffffff',
  textColor: '#303133',
  headerBackgroundColor: '#f6f6f6',
  headerTextColor: '#2b3b5e',
  borderColor: '#e5e7eb',
  stripeBackgroundColor: 'var(--el-fill-color-lighter)',
  hoverBackgroundColor: '#f6f6f6',
  currentRowBackgroundColor: '#ecf5ff',
  expandedRowBackgroundColor: '#fafafa',
}
```

组件按以下顺序计算当前主题：

```text
defaultTheme -> props.theme
```

未传 `theme` 时使用完整默认主题；传入部分字段时仅覆盖对应颜色。`theme` 对象变化后，根节点上的 CSS Variables 响应式更新。

## CSS Variables 映射

当前主题转换为根 `ElTable` 上的内联变量：

```ts
{
  '--el-table-bg-color': theme.backgroundColor,
  '--el-table-tr-bg-color': theme.rowBackgroundColor,
  '--el-table-text-color': theme.textColor,
  '--el-table-header-bg-color': theme.headerBackgroundColor,
  '--el-table-header-text-color': theme.headerTextColor,
  '--el-table-border-color': theme.borderColor,
  '--ga-table-stripe-bg-color': theme.stripeBackgroundColor,
  '--el-table-row-hover-bg-color': theme.hoverBackgroundColor,
  '--el-table-current-row-bg-color': theme.currentRowBackgroundColor,
  '--el-table-expanded-cell-bg-color': theme.expandedRowBackgroundColor,
}
```

现有 `--el-table-border`、固定列左右阴影、表头字号和字重继续保留在 SCSS 中，不进入主题对象。

## 属性透传与样式合并

`theme` 是 `GaTable` 自有 Prop，不透传给底层 `ElTable`。其余低频 Props、监听器、`class` 和普通属性继续通过 `$attrs` 透传。

根节点样式按以下顺序合并：

```text
theme CSS Variables -> attrs.style
```

因此使用方仍可通过内联 CSS Variables 或普通样式覆盖主题结果。`attrs.style` 支持对象、字符串和数组形式，不改变现有属性透传行为。

## 斑马纹状态规则

Element Plus 没有独立的表格斑马纹变量，默认读取全局 `--el-fill-color-lighter`。组件新增 `--ga-table-stripe-bg-color`，并通过限定在 `.el-table.ga-table` 下的选择器设置斑马纹单元格背景。

状态优先级必须保持：

```text
current row / hover row > striped row > normal row
```

斑马纹选择器应排除 `.hover-row` 和 `.current-row`，避免较高选择器优先级覆盖悬停与当前行主题。

## GaTablePagination API

组合组件 Props 调整为等价结构：

```ts
export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight' | 'theme'>
  & Omit<GaPaginationProps, 'theme'>
  & {
    tableTheme?: GaTableTheme
    paginationTheme?: GaPaginationTheme
  }
```

运行时路由规则：

- `tableTheme` 传给内部 `GaTable.theme`。
- `paginationTheme` 传给内部 `GaPagination.theme`。
- 组合组件不再声明或接受 `theme`，避免共享字段名称产生意外联动。

## 使用示例

独立表格：

```vue
<GaTable
  :data="rows"
  :columns="columns"
  :theme="{
    headerBackgroundColor: '#101828',
    headerTextColor: '#ffffff',
    stripeBackgroundColor: '#f8fafc',
    hoverBackgroundColor: '#eff8ff',
    currentRowBackgroundColor: '#d1e9ff',
  }"
/>
```

表格分页组合：

```vue
<GaTablePagination
  :data="rows"
  :columns="columns"
  :table-theme="tableTheme"
  :pagination-theme="paginationTheme"
/>
```

原分页主题用法需要迁移：

```vue
<!-- before -->
<GaTablePagination :theme="paginationTheme" />

<!-- after -->
<GaTablePagination :pagination-theme="paginationTheme" />
```

## 测试策略

### GaTable

- 不传 `theme` 时生成完整默认变量。
- 部分主题覆盖时保留未传字段默认值。
- 更新 `theme` 后响应式更新根节点变量。
- `theme` 不透传给底层 `ElTable`。
- 使用方 `style` 与主题变量合并且可最终覆盖。
- 斑马纹使用 `--ga-table-stripe-bg-color`，并排除悬停行和当前行。
- 现有 Props、插槽、事件与实例暴露测试继续通过。

### GaTablePagination

- `tableTheme` 只传给 `GaTable`。
- `paginationTheme` 只传给 `GaPagination`。
- 组合组件运行时 Props 中不再包含 `theme`。
- 主题 Props 不泄漏到错误的子组件 `$attrs`。

### 发布验证

- 基础入口与根入口导出 `GaTableTheme`。
- `GaTablePaginationProps` 只暴露 `tableTheme` 和 `paginationTheme` 两个主题入口。
- 运行类型测试、完整 Vitest、组件库构建、导出验证和 Playground 构建。

## 文档与示例

README 增加：

- `GaTableTheme` 字段表和部分覆盖示例。
- `GaTable.theme` Prop 说明。
- `GaTablePagination.tableTheme`、`paginationTheme` 的用途及 `theme` 迁移说明。

Playground 在现有表格分页示例中增加表格主题与分页主题同时配置的可见示例，不创建与实际组件脱节的静态概念页面。

## 兼容性与非目标

`GaTable` 本身是向后兼容的增强，现有 Props、插槽、事件、实例暴露和默认视觉保持不变。

`GaTablePagination` 包含一项明确的破坏性调整：移除原分页主题入口 `theme`。使用方需要将 `:theme="paginationTheme"` 改为 `:pagination-theme="paginationTheme"`。由于当前组件库仍处于 `0.x` 阶段，本次直接收敛 API，不保留废弃别名。

本次不包含：

- 行高、列宽、字号、字重、圆角、间距和阴影配置。
- 单元格级、列级或行级动态主题函数。
- 加载遮罩、空状态插画和下拉菜单完整换肤。
- 全局主题注册器、预设主题名称或运行时主题服务。
- 修改表格数据、列配置、选择逻辑、排序、筛选和分页行为。
