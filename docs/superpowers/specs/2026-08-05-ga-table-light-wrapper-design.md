# GaTable 轻量封装设计

- 日期：2026-08-05
- 状态：设计已确认，等待实施计划
- 所属包：`packages/ui-element`
- 基础组件：Element Plus `ElTable`、`ElTableColumn`

## 1. 目标

`GaTable` 是对 Element Plus `ElTable` 的轻量封装，用于统一表格默认外观、加载状态、空状态和常用类型提示，同时最大程度保留 Element Plus 原有 Props、Events、Slots 和实例能力。

组件同时提供两种列定义方式：

1. 通过 `columns` 配置数组循环生成常用列。
2. 通过原生 `ElTableColumn` 处理选择列、复杂表头等特殊场景。

## 2. 非目标

首期不包含：

- `GaTableColumn` 二次封装组件。
- 配置对象中的 render、JSX 或 VNode 函数。
- 递归配置多级表头。
- 分页器。
- 接口请求和自动刷新。
- 查询表单。
- 列权限和自动生成操作按钮。
- 列持久化、拖拽排序或虚拟列表。
- 全局修改 Element Plus Table 样式。

复杂列仍可通过原生 `ElTableColumn` 实现，业务或高级能力由以后独立的组合组件提供。

## 3. 组件结构

```text
packages/ui-element/src/components/table/
├── src/
│   ├── index.vue
│   └── props.ts
├── style/
│   └── index.scss
├── types/
│   └── index.ts
├── __tests__/
│   └── table.spec.ts
└── index.ts
```

当前 `src/index.vue` 中的临时演示内容将替换为正式封装实现。组件继续通过 `packages/ui-element/src/index.ts` 对外导出。

## 4. Table Props 设计

采用“常用 Props 显式声明 + 低频 Props 通过 `$attrs` 透传”的混合策略。

| Prop | 类型 | 默认值 | 作用 |
|---|---|---|---|
| `data` | `Row[]` | `[]` | 表格数据 |
| `columns` | `GaTableColumn<Row>[]` | `[]` | 配置化列 |
| `height` | `string \| number` | 未设置 | 固定高度 |
| `maxHeight` | `string \| number` | 未设置 | 最大高度 |
| `rowKey` | `string \| function` | 未设置 | 行唯一键 |
| `border` | `boolean` | `true` | 显示纵向边框 |
| `stripe` | `boolean` | `true` | 显示斑马纹 |
| `size` | Element Plus 组件尺寸 | 未设置 | 表格尺寸 |
| `fit` | `boolean` | `true` | 列宽是否自动撑开 |
| `showHeader` | `boolean` | `true` | 显示表头 |
| `highlightCurrentRow` | `boolean` | `false` | 高亮当前行 |
| `emptyText` | `string` | `暂无数据` | 默认空状态文案 |
| `loading` | `boolean` | `false` | 表格加载状态 |
| `loadingText` | `string` | `加载中...` | 加载提示文案 |

行数据类型使用泛型 `Row` 表达。`columns`、`data` 和 `rowKey` 使用相同的 `Row` 类型，避免列字段、行数据和行键函数之间类型不一致。

低频 Table Props，例如 `table-layout`、`scrollbar-always-on`、`tooltip-options` 和 `flexible`，通过 `$attrs` 传给 `ElTable`。

## 5. Column 配置设计

`GaTableColumn<Row>` 负责描述一个配置化列。首期为常用 `ElTableColumn` 属性提供类型提示：

| 字段 | 作用 |
|---|---|
| `key` | 循环渲染使用的唯一标识 |
| `prop` | 对应行数据字段 |
| `label` | 表头名称 |
| `slot` | 自定义单元格具名插槽 |
| `type` | `selection`、`index` 或 `expand` |
| `width`、`minWidth` | 列宽配置 |
| `fixed` | 固定列方向 |
| `align`、`headerAlign` | 内容和表头对齐方式 |
| `sortable` | 排序能力 |
| `showOverflowTooltip` | 内容溢出提示 |
| 其他常用列属性 | 按 Element Plus 原有语义传递 |

`key` 和 `slot` 是 `GaTable` 自定义字段，不传给 `ElTableColumn`。其余列字段原样传给 `ElTableColumn`，封装层不改变其语义。

循环标识按以下顺序生成：

1. 优先使用 `column.key`。
2. 其次使用 `column.prop`。
3. 最后使用 `type + index` 或数组索引作为兜底。

## 6. 列渲染顺序

列按照固定顺序渲染：

```text
column-prepend 原生列
        ↓
columns 配置列
        ↓
默认插槽原生列
```

典型用途：

- `column-prepend` 放置选择列或序号列。
- `columns` 生成普通业务字段列。
- 默认插槽放置操作列或其他特殊原生列。

不传 `columns` 时，组件仍可完全通过原生 `ElTableColumn` 使用。

## 7. 单元格插槽设计

配置列通过显式 `slot` 字段关联具名插槽。例如 `slot: 'status'` 对应使用方的 `#status`。

自定义单元格插槽接收 Element Plus 原生作用域参数：

- `row`：当前行数据。
- `column`：当前 Element Plus 列上下文。
- `$index`：当前行索引。

只有同时满足“列配置了 `slot`”和“使用方提供了对应具名插槽”时，`GaTable` 才覆盖该列的默认单元格渲染。缺少对应插槽时，不创建自定义渲染模板，继续使用 `ElTableColumn` 原生字段或 formatter 渲染。

以下名称属于组件保留插槽，不用于 `column.slot`：

- `default`
- `empty`
- `append`
- `column-prepend`

## 8. Table Slots 设计

支持以下表格级插槽：

- `column-prepend`：放置在配置列之前的原生 `ElTableColumn`。
- 默认插槽：放置在配置列之后的原生 `ElTableColumn`。
- `empty`：覆盖默认空状态内容。
- `append`：在表格最后一行之后追加内容。
- 动态具名插槽：用于 `columns` 中声明了 `slot` 的自定义单元格。

原生列的 Props、Slots 和事件原样交给 Element Plus 处理。

## 9. Events 设计

`GaTable` 首期不重新声明 Element Plus 的全部事件。未被组件消费的事件监听器随 `$attrs` 透传给 `ElTable`，包括：

- `selection-change`
- `current-change`
- `cell-click`
- `row-click`
- `sort-change`
- `filter-change`
- `header-click`

封装层不改变事件名称、参数或业务语义。

## 10. 加载与空状态

加载状态使用 Element Plus `v-loading` 指令，并在组件内部局部导入指令能力，避免要求消费项目为了 `GaTable` 必须全量安装 Element Plus 插件。

- `loading=true` 时显示遮罩。
- 遮罩文案来自 `loadingText`。
- `GaTable` 始终向 `ElTable` 提供 `empty` 插槽。
- 使用方提供 `empty` 插槽时优先渲染使用方内容。
- 没有提供 `empty` 插槽时，默认渲染 Element Plus `ElEmpty`。
- 默认 `ElEmpty` 的描述来自 `emptyText`，默认值为“暂无数据”。
- `append` 插槽继续按需转发；没有提供时不创建空的 append 区域。
- 加载状态不清空已有数据。

## 11. 降级与错误边界

- `columns` 默认是空数组。
- 列没有 `prop` 和 `slot` 时交给 Element Plus 按原生行为处理。
- 列声明了 `slot` 但使用方没有提供时，回退到 Element Plus 原生单元格渲染。
- 不主动吞掉 Element Plus 的错误、事件或警告。
- 重复 `key`、无效 `prop` 和无效 Element Plus 列属性由开发期类型提示、Vue 警告和 Element Plus 原生行为共同暴露，不增加业务异常处理。

## 12. 实例 API

首期不代理 `ElTable` 的全部实例方法，只通过 `defineExpose` 暴露内部 `tableRef`：

```ts
const table = ref()

table.value.tableRef.clearSelection()
table.value.tableRef.doLayout()
```

这样可以使用 Element Plus 的原生表格实例能力，同时避免 `GaTable` 重复维护一套方法签名。

## 13. 样式边界

组件根节点使用 `.ga-table` 类名。样式定制采用两级策略：

1. 优先在 `.ga-table` 根节点覆盖 Element Plus 已公开的 `--el-table-*` CSS Variables。
2. CSS Variables 无法表达的行高、内边距和字体细节，使用 `.ga-table` 限定的内部选择器补充。

规则如下：

- 不全局覆盖 `.el-table`。
- 如需覆盖内部样式，必须限定在 `.ga-table` 根节点下。
- 不使用 `!important` 解决普通优先级问题。
- 使用 Element Plus 内部 DOM 类名的样式需要在升级 Element Plus 时进行回归检查。
- 不创建主题变量，继续使用 Element Plus 默认主题。
- 样式加入 `ui-element` 的聚合 SCSS 入口。

## 14. 导出方式

组件目录导出：

```ts
export { GaTable }
export type { GaTableProps, GaTableColumn, GaTableExpose }
```

包入口继续导出：

```ts
export * from './components/table'
```

Playground 可以通过包入口导入：

```ts
import { GaTable } from '@ga/ui-element'
```

组件实现命名为 `GaTable`，并保留以后增加 `install()` 支持的空间。

## 15. 测试要求

至少覆盖：

- 默认 `border` 和 `stripe` 为 `true`。
- `data` 正确传给 `ElTable`。
- `columns` 生成对应数量的 `ElTableColumn`。
- 常用列属性正确传递。
- 普通字段列使用 Element Plus 原生方式显示数据。
- 具名插槽收到 `row`、`column` 和 `$index`。
- 缺少具名插槽时回退到原生单元格渲染。
- `column-prepend` 原生列位于配置列之前。
- 默认插槽原生列位于配置列之后。
- `selection` 等原生列可以正常工作。
- `empty` 和 `append` 插槽不受配置列影响。
- 低频 Props 和原生事件通过 `$attrs` 透传。
- `loading` 和 `loadingText` 正确传给加载指令。
- `tableRef` 能通过公开实例访问。
- 类型检查能关联行数据、列字段和 `rowKey` 函数参数。

## 16. 验收标准

- Playground 能通过 `@ga/ui-element` 使用 `GaTable`。
- 普通列可以通过 `columns` 循环生成。
- 状态、图片和操作内容可以通过显式具名插槽渲染。
- 配置列可以与原生 `ElTableColumn` 共存，并保持约定顺序。
- 常用 Props 有类型提示和确定的默认值。
- 低频 Props 和原生事件无需重复声明即可使用。
- loading、空状态和 append 插槽可运行。
- Element Plus Table 的实例方法可通过 `tableRef` 访问。
- 组件不包含分页、请求、查询、权限或 render/JSX 逻辑。
- 类型检查和组件测试通过。
