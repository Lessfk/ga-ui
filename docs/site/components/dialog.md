<script setup>
import BasicDemo from '../demos/dialog/BasicDemo.vue'
import LifecycleDemo from '../demos/dialog/LifecycleDemo.vue'
</script>

# Dialog 对话框

`GaDialog` 封装 `ElDialog`，默认提供自绘的全屏、还原和关闭按钮。组件负责对话框容器行为，确认、取消、保存等业务操作由 `footer` 插槽提供。

## 基础用法

通过 `v-model` 控制显示状态，通过 `v-model:fullscreen` 读取或控制全屏状态。

<DemoPreview title="基础对话框" description="包含全屏切换、表单内容和自定义底部操作。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/dialog/BasicDemo.vue
:::

## 关闭流程与生命周期

配置 `before-close` 后必须调用参数中的 `done()` 才会继续关闭。标题栏关闭按钮、遮罩层和 Escape 关闭都遵循 Element Plus 的关闭流程。

<DemoPreview title="关闭流程" description="打开和关闭弹窗，观察事件触发顺序。">
  <LifecycleDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/dialog/LifecycleDemo.vue
:::

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否显示，支持 `v-model` |
| `title` | `string` | `''` | 默认标题 |
| `width` | `string \| number` | Element Plus 默认值 | 对话框宽度 |
| `top` | `string` | Element Plus 默认值 | 距离视口顶部的值 |
| `fullscreen` | `boolean` | `false` | 全屏状态，支持 `v-model:fullscreen` |
| `showFullscreen` | `boolean` | `true` | 是否显示自绘全屏按钮 |
| `showClose` | `boolean` | `true` | 是否显示自绘关闭按钮 |
| `appendToBody` | `boolean` | `true` | 是否挂载到 `body` |
| `destroyOnClose` | `boolean` | `true` | 关闭后是否销毁默认插槽内容 |
| `center` | `boolean` | `false` | 头部和底部是否居中 |
| `alignCenter` | `boolean` | `true` | 对话框是否在视口中垂直居中 |
| `draggable` | `boolean` | `true` | 是否允许拖动 |
| `closeOnClickModal` | `boolean` | `false` | 点击遮罩是否关闭 |
| `closeOnPressEscape` | `boolean` | `false` | 按 Escape 是否关闭 |
| `beforeClose` | `(done: () => void) => void` | `undefined` | 关闭前拦截；调用 `done()` 后继续 |

未声明的属性通过 `$attrs` 传给内部 `ElDialog`。组件会固定关闭 Element Plus 原生关闭按钮，改用自己的标题栏按钮。

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `(visible: boolean)` | 显示状态变化 |
| `update:fullscreen` | `(fullscreen: boolean)` | 全屏状态变化 |
| `open` | 无 | 开始打开 |
| `opened` | 无 | 打开动画结束 |
| `close` | 无 | 开始关闭 |
| `closed` | 无 | 关闭动画结束，并恢复受控全屏值 |
| `open-auto-focus` | 无 | 内容获得焦点后 |
| `close-auto-focus` | 无 | 焦点恢复后 |

### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `default` | 无 | 对话框正文 |
| `header` | `{ close, titleId, titleClass }` | 完全替换默认标题栏；需自行提供关闭按钮和可访问标题 |
| `footer` | 无 | 底部业务操作区；组件不自动添加按钮 |

### Expose

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `dialogRef` | `DialogInstance \| undefined` | 内部 Element Plus Dialog 实例 |

### 公开类型

可导入 `GaDialogProps`、`GaDialogEmits`、`GaDialogHeaderSlotProps` 和 `GaDialogExpose`。

```ts
import type { GaDialogExpose, GaDialogProps } from 'ga-ui-plus/base'
```
