# GaPagination 颜色主题配置设计

## 背景与目标

当前 `GaPagination` 在 SCSS 中固定了按钮、激活、悬停和禁用状态的颜色。使用方只能通过覆盖选择器或 Element Plus CSS Variables 修改外观，而且 `background=true` 时部分禁用样式不会读取分页组件变量。

本次为 `GaPagination` 增加类型安全的颜色主题配置。组件不传主题时继续使用现有默认配色；传入部分主题字段时只覆盖对应颜色。尺寸、间距、圆角、字号、阴影和布局不在本次范围内。

## 方案选择

采用 `theme` 对象映射 CSS Variables：

- 相比增加多个独立颜色 Props，公共 API 更集中。
- 相比只开放 CSS Variables，使用方可获得 TypeScript 类型提示。
- 继续使用 Element Plus 已有变量，并用 `--ga-pagination-*` 补齐 Element Plus 未提供的激活背景和悬停背景变量。
- 保留现有 `is-background` 禁用状态兼容规则。

不采用纯 CSS 覆盖方案，因为它要求使用方了解组件内部选择器；不采用完整样式配置对象，因为会把尺寸和结构样式混入颜色主题职责。

## 公共类型

新增：

```ts
export interface GaPaginationTheme {
  textColor?: string
  buttonColor?: string
  buttonBackgroundColor?: string
  activeColor?: string
  activeBackgroundColor?: string
  hoverColor?: string
  hoverBackgroundColor?: string
  disabledColor?: string
  disabledBackgroundColor?: string
}
```

`GaPaginationProps` 新增：

```ts
theme?: GaPaginationTheme
```

字段含义：

- `textColor`：总数、跳转说明等普通文本颜色。
- `buttonColor`：普通上一页、下一页和页码文字颜色。
- `buttonBackgroundColor`：普通按钮和页码背景色。
- `activeColor`、`activeBackgroundColor`：当前页文字和背景色。
- `hoverColor`、`hoverBackgroundColor`：可交互分页项悬停时的文字和背景色。
- `disabledColor`、`disabledBackgroundColor`：禁用按钮和禁用页码的文字和背景色。

所有字段接受合法 CSS 颜色值，包括十六进制、RGB、CSS 变量和渐变允许的背景值。组件不在运行时解析或校验颜色字符串。

## 默认主题与合并规则

默认主题保持当前 `GaPagination` 视觉：

```ts
const defaultTheme: Required<GaPaginationTheme> = {
  textColor: '#606266',
  buttonColor: '#2b3b5e',
  buttonBackgroundColor: '#ffffff',
  activeColor: '#2b3b5e',
  activeBackgroundColor: '#ffffff',
  hoverColor: '#2b3b5e',
  hoverBackgroundColor: '#ffffff',
  disabledColor: '#2b3b5e',
  disabledBackgroundColor: '#ffffff',
}
```

组件按以下顺序计算当前主题：

```text
defaultTheme -> props.theme
```

未传 `theme` 时使用完整默认主题；只传部分字段时，其余字段继承默认值。主题对象变化后，组件应响应式更新颜色。

## CSS Variables 映射

组件将当前主题转换为根 `ElPagination` 上的内联 CSS Variables：

```ts
{
  '--ga-pagination-text-color': theme.textColor,
  '--el-pagination-button-color': theme.buttonColor,
  '--el-pagination-bg-color': theme.buttonBackgroundColor,
  '--el-pagination-button-bg-color': theme.buttonBackgroundColor,
  '--el-pagination-hover-color': theme.hoverColor,
  '--el-pagination-button-disabled-color': theme.disabledColor,
  '--el-pagination-button-disabled-bg-color': theme.disabledBackgroundColor,
  '--ga-pagination-active-color': theme.activeColor,
  '--ga-pagination-active-bg-color': theme.activeBackgroundColor,
  '--ga-pagination-hover-bg-color': theme.hoverBackgroundColor,
}
```

`theme` 属于 `GaPagination` 自有属性，不得继续透传给 `ElPagination`。普通 `$attrs` 继续透传。使用方传入的普通 `style` 需要与主题变量合并，不能被组件丢弃。

## 样式规则

SCSS 使用变量替换当前固定颜色：

- 总数、每页数量和跳转说明使用 `--ga-pagination-text-color`，避免修改 Element Plus 全局文本变量并影响内部选择器、输入框。
- 普通分页按钮使用 Element Plus 分页变量；`--el-pagination-bg-color` 覆盖普通模式，`--el-pagination-button-bg-color` 覆盖背景模式。
- 激活页使用 `--ga-pagination-active-color` 和 `--ga-pagination-active-bg-color`。
- 悬停页、上一页和下一页使用 `--el-pagination-hover-color` 与 `--ga-pagination-hover-bg-color`。
- 禁用页、上一页和下一页统一使用 `--el-pagination-button-disabled-color` 与 `--el-pagination-button-disabled-bg-color`。
- `background=true` 和 `background=false` 均应读取同一套主题字段。
- 所有新增选择器必须限定在 `.el-pagination.ga-pagination` 下，不能影响外部 `ElPagination`。

## 使用示例

```vue
<GaPagination
  v-model:current-page="page"
  :total="100"
  :theme="{
    activeColor: '#ffffff',
    activeBackgroundColor: '#409eff',
    hoverColor: '#409eff',
    hoverBackgroundColor: '#ecf5ff',
    disabledColor: '#a8abb2',
    disabledBackgroundColor: '#f5f7fa',
  }"
/>
```

## 测试策略

- 不传 `theme` 时生成完整默认主题变量。
- 部分主题覆盖时保留未传字段的默认值。
- `theme` 响应式变化后更新根节点样式。
- `theme` 不透传给底层 `ElPagination`，其他 Props 和 `$attrs` 保持现有行为。
- 激活、悬停和禁用样式引用对应 CSS Variables，不保留固定颜色。
- `background=true` 时禁用按钮和页码仍读取分页禁用变量。
- 公开入口导出 `GaPaginationTheme` 类型。
- 运行组件库类型检查、全量 Vitest、生产构建和导出验证。

## 文档与示例

README 增加 `theme` Prop、`GaPaginationTheme` 字段表和部分覆盖示例。Playground 的 `PaginationDemo` 增加一组可见的自定义主题示例，同时保留默认主题用于对比。

## 兼容性与非目标

这是向后兼容的增强：现有 Props、事件、组件名和导入路径保持不变，不传 `theme` 时视觉保持不变。

本次不包含：

- 按钮尺寸、间距、圆角、字号和阴影配置。
- 全局主题注册器或运行时主题切换服务。
- 预设主题名称。
- 对 Element Plus 下拉选择器、输入框等分页内部子组件做完整换肤。
- 修改分页数据、事件或布局行为。
