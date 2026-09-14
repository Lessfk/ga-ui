<script setup>
import BasicDemo from '../demos/search-bar/BasicDemo.vue'
import AdvancedDemo from '../demos/search-bar/AdvancedDemo.vue'
</script>

# SearchBar 搜索栏

`GaSearchBar` 使用 `ElForm`、`ElRow` 和 `ElCol` 组织数据驱动的搜索条件。内置 input、textarea、select、date、datetime、daterange 和 datetimerange 字段，同时保留字段和按钮插槽。

## 数据驱动搜索

每个字段可以使用 `span` 指定一行 24 栅格中的占比，也可以按需传入 `xs`、`sm`、`md`、`lg`、`xl`。响应式字段没有默认值，`span` 默认使用 6。

<DemoPreview title="字段、栅格与折叠" description="包含输入、单选、多选、日期格式和查询结果。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/search-bar/BasicDemo.vue
:::

## 校验和局部按钮插槽

`actions-*` Props 和插槽只控制按钮区域；`disabled` 只控制表单字段。自定义字段插槽获得 `value`、`update`、`field` 和 `disabled`。

<DemoPreview title="校验、自定义字段与按钮" description="只替换查询按钮，并在前后插入额外操作。">
  <AdvancedDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/search-bar/AdvancedDemo.vue
:::

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Record<string, unknown>` | 必填 | 最新搜索值，支持 `v-model` |
| `fields` | `GaSearchField[]` | 必填 | 搜索字段配置 |
| `labelMode` | `'label' \| 'none'` | `'label'` | 是否显示字段 label，不控制 placeholder |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | 表单标签位置 |
| `labelWidth` | `string \| number` | `'auto'` | 全局标签宽度 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 表单和内置控件尺寸 |
| `gutter` | `number` | `16` | 栅格间距 |
| `collapsed` | `boolean` | `true` | 是否收起，支持 `v-model:collapsed` |
| `collapsedCount` | `number` | `3` | 收起时显示的字段数量 |
| `disabled` | `boolean` | `false` | 是否禁用表单字段，不影响按钮 |
| `actionsLoading` | `boolean` | `false` | 查询按钮外部 loading |
| `actionsDisabled` | `boolean` | `false` | 是否禁用操作按钮，不影响表单 |
| `rules` | `FormRules` | `undefined` | Element Plus 表单校验规则 |
| `validateOnSearch` | `boolean` | `false` | 查询前是否执行表单校验 |
| `actionsShowSearch` | `boolean` | `true` | 是否显示内置查询按钮 |
| `actionsShowReset` | `boolean` | `true` | 是否显示内置重置按钮 |
| `actionsShowCollapse` | `boolean` | `true` | 是否显示内置展开/收起按钮 |

#### Field 公共配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string` | 模型字段名和表单校验 prop，必须唯一 |
| `type` | `string` | `input`、`textarea`、`select`、`date`、`datetime`、`daterange`、`datetimerange` 或 `custom` |
| `label` | `string` | 字段标签 |
| `labelMode` / `labelWidth` | 字段级配置 | 覆盖全局标签设置 |
| `placeholder` / `ariaLabel` | `string` | 占位文本和无障碍名称 |
| `defaultValue` | `unknown` | reset 时使用的默认值；未传时使用初始模型值 |
| `disabled` / `hidden` | `boolean` | 禁用或隐藏当前字段 |
| `span` | `ColProps['span']` | 栅格占比，默认 6 |
| `xs` / `sm` / `md` / `lg` / `xl` | `ColProps` 响应值 | 按断点覆盖栅格；组件不设置默认值 |
| `componentProps` | `Record<string, unknown>` | 传给内部输入、选择或日期组件 |

#### Select 与日期字段

| 字段 | 适用类型 | 说明 |
| --- | --- | --- |
| `options` | `select` | `{ label, value, disabled? }[]`；多选通过 `componentProps.multiple` 开启 |
| `format` | 日期类型 | 输入框显示格式 |
| `valueFormat` | 日期类型 | 绑定到模型的值格式 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(model)` | 任一字段输入时同步最新模型 |
| `update:collapsed` | `(collapsed)` | 展开/收起状态变化 |
| `search` | `(model)` | 点击查询或调用实例 `search()`；组件不会自动重置页码 |
| `reset` | `(model)` | 重置完成后的新模型 |
| `change` | `({ key, value, model, field })` | 内置字段 change 事件 |
| `invalid` | `(fields)` | 查询校验未通过 |

组件把 `ElForm` 的 submit 事件绑定到 `search()`。在输入框中按 Enter 可能提交表单并触发查询，也可以点击查询按钮或调用实例方法执行查询。

### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `field-{key}` | `{ field, value, disabled, update }` | 覆盖某个字段的渲染 |
| `prepend` / `append` | 无 | 在字段列表前后插入栅格内容，建议自行使用 `ElCol` |
| `actions` | 操作作用域 | 完全替换整个按钮区域 |
| `actions-prepend` / `actions-append` | 操作作用域 | 在内置按钮前后插入一个或多个按钮 |
| `action-search` | 操作作用域 | 只替换查询按钮 |
| `action-reset` | 操作作用域 | 只替换重置按钮 |
| `action-collapse` | 操作作用域 | 只替换展开/收起按钮 |

操作作用域包含 `search`、`reset`、`validate`、`clearValidate`、`collapsed`、`toggle`、`actionsLoading` 和 `actionsDisabled`。

### Expose

| 属性或方法 | 说明 |
| --- | --- |
| `formRef` | 内部 `FormInstance` |
| `search()` | 执行查询，返回 `Promise<boolean>` |
| `reset()` | 恢复默认或初始值并触发 `reset` |
| `validate()` | 执行表单校验 |
| `clearValidate()` | 清除校验结果 |
| `toggle()` | 切换展开和收起 |

### 公开类型

可导入 `GaSearchBarProps`、`GaSearchField`、各字段细分类型、`GaSearchModel`、`GaSearchChangePayload`、`GaSearchBarEmits` 和 `GaSearchBarExpose`。
