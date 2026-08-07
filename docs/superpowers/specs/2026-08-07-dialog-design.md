# GaDialog 通用弹窗组件设计

## 背景与目标

组件库需要在 Element Plus `ElDialog` 基础上提供统一的 `GaDialog`。该组件定位为通用弹窗容器，只负责显示、关闭、内容承载和 Element Plus 能力透传，不集成表单提交、确认、取消等业务逻辑。

目标如下：

- 保持 Element Plus Dialog 的默认视觉和交互习惯。
- 为高频能力提供稳定、明确的 TypeScript 接口。
- 允许使用方继续访问未显式封装的 Element Plus Dialog 能力。
- 通过插槽支持不同业务场景，不内置任何底部按钮。
- 遵循现有组件库的目录、导出、文档、示例和测试模式。

## 方案选择

采用“精选常用 Props + `$attrs` 透传”方案。

与完整继承 `DialogProps` 相比，该方案减少公共 API 随 Element Plus 版本变化而波动的问题；与纯 `$attrs` 包装相比，它能为常用能力提供更好的类型提示和清晰的组件契约。未被显式声明的 Element Plus 属性和监听器仍可通过 `$attrs` 使用。

## 组件职责与边界

`GaDialog` 是 `ElDialog` 的轻量受控包装：

- 通过 `modelValue` 和 `update:modelValue` 实现 `v-model`。
- 不维护额外的业务状态。
- 不处理表单校验、数据提交或请求状态。
- 不内置确认、取消或其他操作按钮。
- 点击遮罩关闭、按 Esc 关闭等行为沿用 Element Plus 默认值。
- `beforeClose` 直接使用 Element Plus 的关闭拦截机制，不增加额外异常转换。
- 内部样式不得修改全局 Element Plus 规则，也不得影响其他组件。

## 公共接口

### Props

组件显式声明以下常用属性，并复用 Element Plus 对应类型和默认语义：

| 属性 | 用途 |
| --- | --- |
| `modelValue` | 控制弹窗显示状态 |
| `title` | 默认头部标题 |
| `width` | 弹窗宽度 |
| `top` | 距离视口顶部的距离 |
| `fullscreen` | 是否全屏 |
| `appendToBody` | 是否挂载到 `body` |
| `destroyOnClose` | 关闭后是否销毁内容 |
| `center` | 是否居中显示头部和底部内容 |
| `alignCenter` | 是否在视口内水平、垂直居中 |
| `draggable` | 是否可拖拽 |
| `showClose` | 是否显示关闭按钮 |
| `closeOnClickModal` | 点击遮罩是否关闭 |
| `closeOnPressEscape` | 按 Esc 是否关闭 |
| `beforeClose` | 关闭前拦截函数 |

未显式声明的属性通过 `$attrs` 传给 `ElDialog`，包括但不限于 `modal`、`lock-scroll`、`z-index`、自定义 class 和其他兼容属性。

### 事件

组件显式转发以下 Element Plus Dialog 事件：

- `update:modelValue`
- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`

事件触发时机和参数保持 Element Plus 原始语义。其他监听器可通过 `$attrs` 继续透传。

### 插槽

组件提供以下插槽：

- `default`：弹窗主体内容。
- `header`：自定义头部；作用域参数原样传递自 Element Plus。
- `footer`：自定义底部；组件不提供默认底部内容或按钮。

### 暴露实例

组件暴露内部 `dialogRef`，使高级使用场景可以访问 Element Plus Dialog 实例能力，同时不把这些能力重复包装成新的公共方法。

## 数据流

1. 使用方通过 `v-model` 传入显示状态。
2. `GaDialog` 将状态和显式 Props 传给 `ElDialog`，并将剩余 `$attrs` 一并透传。
3. `ElDialog` 请求改变显示状态时，`GaDialog` 发出 `update:modelValue`。
4. `ElDialog` 生命周期事件由 `GaDialog` 使用相同名称向外转发。
5. 使用方通过三个插槽提供头部、主体和底部内容。

组件不捕获或改写 `beforeClose` 中的业务异常，相关错误处理由提供该函数的使用方负责。

## 文件与导出

实现沿用现有 Dialog 空目录骨架：

- `packages/ui/src/base/components/dialog/src/index.vue`：组件实现。
- `packages/ui/src/base/components/dialog/types/index.ts`：Props、Emits 和实例类型。
- `packages/ui/src/base/components/dialog/style/index.scss`：组件样式入口。
- `packages/ui/src/base/components/dialog/index.ts`：组件安装与局部导出入口。

同时更新 `base` 模块入口和组件库根入口，使 `GaDialog` 支持按需导入与全量安装。构建导出验证应包含新增组件。

## 样式设计

- 复用 Element Plus Dialog 的默认外观。
- 为组件增加 `ga-dialog` 命名空间，作为后续主题定制入口。
- 不覆盖全局 `.el-dialog` 样式。
- 不引入新的弹窗布局或按钮风格。
- 不修改现有分页组件及其样式。

## 文档与 Playground

Playground 增加可交互示例，至少展示：

- 基础 `v-model` 开关。
- 默认主体内容。
- 使用 `footer` 插槽自行提供操作按钮。
- 自定义 `header`。
- `beforeClose` 关闭拦截或自定义属性透传示例。

使用说明同步记录安装/导入方式、基础用法、插槽、Props、事件、实例暴露和属性透传规则，并明确组件不内置按钮。

## 测试与验收

单元测试覆盖：

- 常用 Props 正确传给 `ElDialog`。
- `v-model` 更新正确向外发出。
- Dialog 生命周期事件完整转发。
- `default`、`header`、`footer` 插槽正确渲染。
- 未显式声明的属性和监听器能够通过 `$attrs` 透传。
- 默认不渲染确认、取消或其他底部按钮。
- `dialogRef` 可被外部实例访问。

完成实现后运行与改动风险相匹配的验证：

- Dialog 组件单元测试和相关测试集。
- TypeScript 类型检查。
- 组件库构建。
- 包导出和 NodeNext 兼容性验证。
- Playground 构建。

## 非目标

本次不包含：

- 内置确认、取消按钮。
- 表单校验和提交逻辑。
- 请求 loading 状态管理。
- 命令式弹窗服务。
- 对 Element Plus Dialog 的全量 API 复制。
- 与 Dialog 无关的组件重构或样式调整。
