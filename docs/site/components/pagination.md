<script setup>
import BasicDemo from '../demos/pagination/BasicDemo.vue'
import ThemeDemo from '../demos/pagination/ThemeDemo.vue'
</script>

# Pagination 分页

`GaPagination` 在 `ElPagination` 基础上提供页码与每页数量双向绑定、左中右对齐、整体背景和实例级颜色主题。

## 基础用法

<DemoPreview title="分页状态" description="页码、每页数量和禁用状态都由外部控制。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/pagination/BasicDemo.vue
:::

## 主题配置

<DemoPreview title="独立分页主题" description="主题只影响当前分页实例。">
  <ThemeDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/pagination/ThemeDemo.vue
:::

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `currentPage` | `number` | `1` | 当前页，支持 `v-model:current-page` |
| `pageSize` | `number` | `10` | 每页数量，支持 `v-model:page-size` |
| `total` | `number` | `0` | 总条数 |
| `pageSizes` | `number[]` | `[10, 20, 30, 40, 50]` | 每页数量选项 |
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | 尺寸 |
| `layout` | `string` | `'total, sizes, prev, pager, next, jumper'` | Element Plus 分页布局 |
| `background` | `boolean` | `false` | 页码按钮是否显示背景 |
| `disabled` | `boolean` | `false` | 是否禁用整个分页控件 |
| `position` | `'left' \| 'center' \| 'right'` | `'right'` | 水平对齐 |
| `theme` | `GaPaginationTheme` | 内置主题 | 当前实例颜色配置 |

未声明的低频 Element Plus Pagination 属性通过 `$attrs` 透传。

#### Theme

| 字段 | 说明 |
| --- | --- |
| `backgroundColor` | 分页整体背景 |
| `textColor` | 总数、跳转等普通文字颜色 |
| `buttonColor` / `buttonBackgroundColor` | 普通页码按钮文字和背景 |
| `activeColor` / `activeBackgroundColor` | 当前页文字和背景 |
| `hoverColor` / `hoverBackgroundColor` | 悬停文字和背景 |
| `disabledColor` / `disabledBackgroundColor` | 禁用文字和背景 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:current-page` | `(page: number)` | 当前页变化 |
| `update:page-size` | `(size: number)` | 每页数量变化 |
| `current-change` | `(page: number)` | 当前页变化后的业务事件 |
| `size-change` | `(size: number)` | 每页数量变化后的业务事件 |

### Slots

当前组件不转发 `ElPagination` 插槽。需要分页插槽时直接使用 Element Plus，或在 `GaPagination` 外部组合内容。

### Expose

当前组件没有公开实例方法。

### 公开类型

```ts
import type { GaPaginationProps, GaPaginationTheme } from 'ga-ui-plus/base'
```
