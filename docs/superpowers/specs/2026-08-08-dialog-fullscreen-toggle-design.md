# GaDialog 全屏切换按钮设计

## 背景与目标

`GaDialog` 已经透传 Element Plus `ElDialog` 的 `fullscreen` 属性，但目前只能由使用方预先指定是否全屏，缺少用户可直接操作的全屏/还原入口。

本次改动在 `GaDialog` 头部的原生关闭按钮左侧增加全屏切换按钮，并让该能力同时支持内部状态管理和 `v-model:fullscreen` 外部同步。组件继续保持通用弹窗定位，不增加确认、取消等底部业务按钮。

## 已确认的产品决策

- 全屏按钮默认显示。
- 新增 `showFullscreen` 属性，传入 `false` 时隐藏按钮。
- 点击按钮时组件立即切换全屏状态，并触发 `update:fullscreen`。
- 不绑定 `v-model:fullscreen` 时，组件内部仍可正常切换。
- 绑定 `v-model:fullscreen` 时，外部状态与内部状态双向同步。
- 弹窗完成关闭后，内部全屏状态恢复为当前外部 `fullscreen` 属性指定的状态。
- `GaDialog` 始终接管 Element Plus 的 `header` 插槽，以统一渲染默认标题、自定义头部和全屏按钮。
- 使用方提供自定义 `header` 插槽时，全屏按钮仍由 `GaDialog` 自动显示。
- Element Plus 原生关闭按钮和关闭逻辑继续保留。

## 方案选择

### 采用方案：始终使用 Element Plus `header` 插槽

`GaDialog` 内部始终向 `ElDialog` 提供 `header` 插槽：

1. 使用方提供 `header` 插槽时，原样渲染该插槽并透传 `close`、`titleId`、`titleClass`。
2. 使用方未提供 `header` 插槽时，使用 `titleId` 和 `titleClass` 渲染与 Element Plus 语义一致的默认标题。
3. 在标题或自定义头部之后渲染全屏按钮。
4. Element Plus 在插槽内容之后继续渲染原生关闭按钮。

最终视觉顺序为：

```text
默认标题或自定义头部 -> 全屏按钮 -> Element Plus 关闭按钮
```

该方案不依赖运行时查询或修改 Element Plus DOM，按钮位置、状态和无障碍属性均由 `GaDialog` 稳定控制。

### 未采用方案

- 通过 CSS 伪元素或运行时 DOM 操作插入按钮：过度依赖 Element Plus 内部结构，升级风险较高。
- 仅要求使用方在自定义 `header` 插槽中实现：会产生重复逻辑，无法形成组件库统一能力。
- 完全由外部控制全屏状态：未绑定 `v-model:fullscreen` 时按钮无法独立工作，不符合通用组件的易用性目标。

## 公共接口

### Props

保留现有 `fullscreen` 属性，并新增：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showFullscreen` | `boolean` | `true` | 是否显示头部全屏切换按钮 |

`fullscreen` 继续作为外部指定状态，同时也是内部状态初始化和关闭后恢复的来源。

### Events

新增：

```ts
(event: 'update:fullscreen', value: boolean): void
```

使用方可以选择仅使用组件内部状态：

```vue
<GaDialog v-model="visible" />
```

也可以同步全屏状态：

```vue
<GaDialog
  v-model="visible"
  v-model:fullscreen="fullscreen"
/>
```

不额外增加 `fullscreen-change` 事件，避免两个事件表达相同状态变化。

### Slots

现有 `header` 插槽作用域保持不变：

```ts
interface GaDialogHeaderSlotProps {
  close: () => void
  titleId: string
  titleClass: string
}
```

全屏按钮不进入消费方插槽内容，也不改变这些作用域参数。

## 状态与事件流

组件维护内部 `currentFullscreen` 状态：

1. 初始化为 `props.fullscreen`。
2. 外部 `fullscreen` 变化时，同步更新 `currentFullscreen`。
3. 点击全屏按钮时取反 `currentFullscreen`，立即更新 `ElDialog`，并发出 `update:fullscreen`。
4. Element Plus `closed` 事件触发后，将内部状态恢复为当前 `props.fullscreen`。
5. 如果恢复操作实际改变了内部状态，同步发出对应的 `update:fullscreen`，保证状态监听方获得完整变化。
6. 原有 `closed` 生命周期事件继续向外转发。

选择在 `closed` 而不是 `close` 阶段恢复，可以避免弹窗关闭动画进行中突然从全屏缩回普通尺寸。

## 头部渲染

内部头部渲染规则：

- 有消费方 `header` 插槽：渲染插槽内容。
- 无消费方 `header` 插槽：渲染标题元素，并使用 Element Plus 提供的 `titleId` 和 `titleClass` 保持无障碍关系及默认样式。
- `showFullscreen` 为 `true`：渲染全屏按钮。
- Element Plus 的 `showClose` 继续控制原生关闭按钮。
- `showClose` 为 `false` 时，全屏按钮移动到头部最右侧。

全屏按钮不会调用关闭逻辑，因此不涉及 `beforeClose`。原生关闭按钮、自定义头部中的 `close()` 以及已暴露的 `dialogRef.handleClose()` 行为保持不变。

## 视觉与无障碍设计

- 全屏按钮使用 `48px × 48px` 点击区域，与 Element Plus 原生关闭按钮保持一致。
- 有关闭按钮时定位在 `right: 48px`；无关闭按钮时定位在 `right: 0`。
- 标题区域按头部操作按钮数量预留右侧空间，防止长标题覆盖按钮。
- 按钮采用 `type="button"`，避免在表单弹窗中触发表单提交。
- 普通状态显示全屏图标，使用 `title="全屏"` 和 `aria-label="全屏"`。
- 全屏状态显示还原图标，使用 `title="退出全屏"` 和 `aria-label="退出全屏"`。
- 图标使用基于 `currentColor` 的内联 SVG，避免增加新的运行时依赖。
- hover 和 focus-visible 反馈沿用当前 Dialog 头部按钮的浅蓝色交互风格。
- 样式限定在 `.el-dialog.ga-dialog` 命名空间内，不影响其他 Element Plus Dialog。

## 兼容性与现有改动保护

实现需要在当前主工作区已有未提交改动上进行，并保留：

- `GaDialog` 当前调整后的默认属性。
- 当前关闭图标样式。
- Playground 中使用方正在编辑的内容。
- Pagination 样式修改；本功能不得修改该文件。

组件继续透传未声明的 `$attrs`，继续暴露底层 `dialogRef`，继续不内置 `footer` 内容或业务按钮。

## 测试与验收

单元测试至少覆盖：

- 默认渲染全屏按钮。
- `showFullscreen=false` 时不渲染按钮。
- 点击按钮后切换传给 `ElDialog` 的 `fullscreen` 状态。
- 每次用户切换发出正确的 `update:fullscreen`。
- 外部更新 `fullscreen` 时内部状态同步。
- `closed` 后恢复为外部属性状态，并避免在 `close` 阶段提前恢复。
- 图标、`title` 和 `aria-label` 随状态切换。
- 使用自定义 `header` 插槽时，全屏按钮仍存在，原作用域参数不变。
- `showClose=false` 时应用无关闭按钮的定位状态。
- 默认标题保持 Element Plus 的 `titleId` 和 `titleClass`。
- 原有 Props、事件、插槽、`$attrs` 和实例暴露测试继续通过。

完整验收命令包括：

- Dialog 单元测试的红灯和绿灯验证。
- `packages/ui` 全量测试和类型检查。
- 组件库构建。
- 包导出及 NodeNext 声明验证。
- Playground 构建。
- `git diff --check`。

## 文档与示例

README 需要增加：

- `showFullscreen` Props 说明。
- `update:fullscreen` 事件说明。
- 内部切换与 `v-model:fullscreen` 两种用法。
- 关闭后状态恢复语义。

Playground 示例需要展示全屏/还原按钮及 `v-model:fullscreen` 状态同步，同时保持现有 Dialog 示例的业务按钮由 `footer` 插槽提供。

## 非目标

本次不包含：

- 浏览器原生 Fullscreen API。
- 将整个网页切换为浏览器全屏。
- Dialog 窗口最大化后的拖拽或尺寸调整。
- 保存用户上一次关闭时的全屏状态。
- 新增确认、取消等底部业务按钮。
- 修改 Pagination 或其他无关组件。
