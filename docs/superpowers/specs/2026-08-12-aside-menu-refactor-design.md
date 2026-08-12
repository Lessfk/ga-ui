# GaAsideMenu 渐进式重构设计

## 背景与目标

当前 `GaAsideMenu` 是基于 Element Plus `ElAside`、`ElScrollbar` 和 `ElMenu` 的插槽透传型侧边栏组件，已经支持展开宽度、折叠状态、头部/底部/触发器插槽，以及 `select`、`open`、`close` 等菜单事件。

本次重构需要在不破坏现有插槽用法的前提下，增加数据配置驱动能力，并整理状态、类型、递归渲染、样式和测试边界。组件继续保持通用性：它只负责展示、折叠、激活状态和事件转发，不处理路由跳转、权限判断或业务错误。

成功标准如下：

- 现有默认插槽菜单继续可用，导入路径和组件名称不变。
- 新增 `items` 后可自动渲染菜单项、子菜单和分组。
- 新增 `v-model:active`，并兼容现有 `defaultActive`。
- `collapse`、`active`、布局和递归渲染职责相互隔离。
- 保持 Element Plus 默认视觉，只补齐布局、折叠、动画、焦点和可访问性。
- 清除组件及 Playground 示例中的调试输出、弹窗提示和未注册图标警告。

## 已确认的产品决策

- 采用渐进式兼容重构，不移除原有默认插槽方式。
- 默认插槽与 `items` 同时存在时，默认插槽优先。
- 菜单组件不集成 Vue Router，也不处理权限；业务方在传入前过滤节点，并在 `select` 回调中处理跳转。
- 第一版配置节点只覆盖菜单项、子菜单、分组、图标、禁用和隐藏。
- 第一版不加入徽标、提示文字、分割线、外链或节点级自定义渲染插槽。
- 激活状态新增 `v-model:active`，同时保留 `defaultActive`。
- 视觉继续沿用 Element Plus 默认风格，不内置管理后台主题。
- 保留当前 `v-model:collapse`、内部独立折叠和底层实例暴露能力。

## 方案比较

### 采用：分层渐进式重构

保留公共组件 `GaAsideMenu`，内部拆分侧栏布局、菜单递归渲染和状态逻辑。旧插槽用法与新 `items` 用法共存。

优点：

- 公共 API 兼容性最好。
- 迁移可以逐页进行，不要求业务项目一次性改造。
- 布局、状态和递归渲染可独立测试和维护。
- 后续增加节点能力时不会继续膨胀主组件。

代价：

- 内部文件数量增加。
- 需要同时维护插槽和配置两条渲染路径的契约测试。

### 未采用：单组件内递归渲染

将配置递归、布局、状态和事件全部保留在 `index.vue` 中。

该方案改动较少，但会继续把多个职责集中在单文件中，难以达到本次重构的可维护性目标。

### 未采用：拆成两个公共组件

新增独立 `GaMenu`，让 `GaAsideMenu` 只作为容器。

该方案边界最纯粹，但会扩大公共 API 和迁移成本。当前需求优先兼容和渐进升级，因此不在本次范围内。

## 组件架构

```text
GaAsideMenu
├── 侧栏布局：header / body / footer / trigger
├── useAsideMenuState：collapse、active 状态同步
└── GaMenuTree：根据 items 递归渲染菜单
    ├── item：普通菜单项
    ├── submenu：子菜单
    └── group：菜单分组
```

建议内部文件结构：

```text
packages/ui/src/business/components/asideMenu/
├── src/
│   ├── index.vue
│   ├── menu-tree.vue
│   ├── use-aside-menu-state.ts
│   └── __tests__/
├── types/index.ts
├── style/index.scss
└── index.ts
```

职责边界：

- `GaAsideMenu`：组合 `ElAside`、`ElScrollbar` 和 `ElMenu`，管理布局、插槽、宽度、事件入口和底层实例暴露。
- `GaMenuTree`：将已经过滤的 `items` 递归映射为 `ElMenuItem`、`ElSubMenu` 和 `ElMenuItemGroup`。
- `useAsideMenuState`：维护受控/非受控的 `collapse` 和 `active`，封装同步与事件发射。
- 类型模块：定义稳定的组件库节点类型，避免业务方依赖 Element Plus 的内部节点模型。

渲染优先级：

1. 使用方提供默认插槽时，渲染原生 Element Plus 菜单节点。
2. 未提供默认插槽且 `items` 有有效节点时，渲染 `GaMenuTree`。
3. 两者都不存在时，保留空 `ElMenu`，不抛异常。

## 公共数据模型

```ts
import type { Component } from 'vue'

export type GaAsideMenuNode =
  | GaAsideMenuItem
  | GaAsideSubMenu
  | GaAsideMenuGroup

export interface GaAsideMenuItem {
  type: 'item'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
}

export interface GaAsideSubMenu {
  type: 'submenu'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
  children: GaAsideMenuNode[]
}

export interface GaAsideMenuGroup {
  type: 'group'
  label: string
  hidden?: boolean
  children: Array<GaAsideMenuItem | GaAsideSubMenu>
}
```

约束：

- 所有可激活节点的 `index` 在整棵树中必须唯一且非空。
- `group` 本身没有 `index`，不可激活。
- `hidden: true` 会隐藏该节点及其整个子树。
- `icon` 接受任意 Vue `Component`，不绑定具体图标库。
- `label` 第一版只支持文本。
- `items` 不包含路径、权限码或业务元数据；这些由业务层保存或通过 `index` 映射。

## Props 与兼容策略

在现有 `GaAsideMenuProps` 基础上新增：

```ts
interface GaAsideMenuAdditionalProps {
  items?: GaAsideMenuNode[]
  active?: string
}
```

保留现有：

- `collapse?: boolean`
- `width?: string`
- `defaultActive` 及其他除 `mode`、`collapse` 外的 Element Plus 菜单 Props。

组件继续固定 `mode="vertical"`，继续接管 `items`、`active`、`collapse` 与侧栏 `width`，这些属性不会误透传给内部 `ElMenu`。其他菜单 Props 透传给内部 `ElMenu`；普通 `$attrs` 继续绑定到根部 `ElAside`。

使用示例：

```vue
<GaAsideMenu
  v-model:collapse="collapsed"
  v-model:active="active"
  :items="menuItems"
  width="260px"
  unique-opened
/>
```

旧用法继续有效：

```vue
<GaAsideMenu v-model:collapse="collapsed">
  <ElMenuItem index="dashboard">仪表盘</ElMenuItem>
</GaAsideMenu>
```

## 状态模型

### 折叠状态

`currentCollapse` 初始化为 `props.collapse`。

内部切换流程：

```text
点击默认 trigger 或调用暴露的 toggle()
→ 更新 currentCollapse
→ 更新 ElAside 宽度与 ElMenu collapse
→ emit('update:collapse', value)
→ emit('toggle', value)
```

外部 `collapse` 更新时同步到内部。未绑定 `v-model:collapse` 时，内部切换仍然立即生效。

展开宽度来自 `width`，默认 `240px`；折叠时继续使用 `auto`，由 Element Plus 折叠菜单决定实际宽度，通常为 `64px`。

### 激活状态

`currentActive` 初始化优先级：

```text
active → defaultActive → ''
```

选择菜单项时：

```text
ElMenu select
→ 更新 currentActive
→ emit('update:active', index)
→ emit('select', index, indexPath, item, routerResult)
```

外部 `active` 更新时同步 `currentActive`，并通过底层 `menuRef.updateActiveIndex(index)` 保证配置菜单和默认插槽菜单的表现一致。

未绑定 `active` 时，组件内部保持最后一次选择的 index。绑定 `v-model:active` 时，父组件可以读取或主动修改激活项。

`defaultActive` 只参与初始值选择，不作为后续受控状态源。

## 节点预处理与校验

渲染前对 `items` 做纯数据派生，不修改使用方数组：

- 过滤 `hidden: true` 节点。
- 递归过滤隐藏子节点。
- 子节点全部被过滤后，不渲染空 `submenu` 或空 `group`。
- 保留原节点顺序。
- `items` 或其响应式节点变化后自动重新计算。

开发环境校验：

- 检查 `item`、`submenu` 的 `index` 是否为空或重复。
- 检查 `submenu`、`group` 是否缺少有效子节点。
- 默认插槽和 `items` 同时存在时，提示默认插槽优先。

校验只产生一次性开发警告，不在生产环境抛错，也不阻止可渲染的有效节点显示。

## Events

保留：

```ts
(event: 'update:collapse', collapse: boolean): void
(event: 'toggle', collapse: boolean): void
(event: 'select', index, indexPath, item, routerResult?): void
(event: 'open', index: string, indexPath: string[]): void
(event: 'close', index: string, indexPath: string[]): void
```

新增：

```ts
(event: 'update:active', active: string): void
```

不新增 `item-click`、`active-change` 等语义重复事件。路由和业务异常由使用方的 `select` 回调处理。

## Slots

默认插槽保持现有含义：直接传入原生 `ElSubMenu`、`ElMenuItem`、`ElMenuItemGroup`，不增加新的作用域参数。

状态插槽统一提供：

```ts
interface GaAsideMenuStateSlotProps {
  collapse: boolean
  active: string
}

interface GaAsideMenuTriggerSlotProps extends GaAsideMenuStateSlotProps {
  toggle: () => void
}
```

- `header`: `{ collapse, active }`
- `footer`: `{ collapse, active }`
- `trigger`: `{ collapse, active, toggle }`

旧的无参数插槽写法继续有效。自定义 trigger 的按钮语义和键盘交互由使用方负责，文档需要明确说明。

## Expose

继续暴露：

```ts
interface GaAsideMenuExpose {
  menuRef: MenuInstance | undefined
  toggle: () => void
}
```

`menuRef` 继续允许调用 Element Plus 的 `open()`、`close()`、`handleResize()` 和 `updateActiveIndex()`。本次不增加额外的业务方法。

## 样式设计

视觉继续沿用 Element Plus，不增加固定后台主题。

样式职责：

- 根容器使用纵向 flex，正文滚动区占据剩余空间。
- header、footer、trigger 保持固定高度区域。
- 菜单移除与侧栏重复的右边框。
- 展开/折叠宽度动画保持稳定，避免内容区域抖动。
- 补齐折叠时分组标题、分组直属菜单项文本隐藏和图标对齐。
- 默认 trigger 提供 hover 和 `focus-visible` 反馈。
- 所有选择器限定在 `.el-aside.ga-aside-menu` 命名空间内，不污染外部 `ElMenu`。

建议提供以下可覆盖变量：

```scss
--ga-aside-menu-width: 240px;
--ga-aside-menu-trigger-height: 40px;
--ga-aside-menu-border-color: var(--el-border-color-light);
--ga-aside-menu-transition-duration: 0.3s;
```

`width` Prop 仍是展开宽度的权威来源，组件可以通过内联 CSS 变量将该值传递给样式层。

## 可访问性

- 默认折叠触发器继续使用原生 `button type="button"`。
- `aria-label` 和 `title` 随展开/折叠状态切换。
- trigger SVG 使用 `aria-hidden="true"`。
- 默认 trigger 支持键盘聚焦和清晰的 `focus-visible` 样式。
- 配置节点继续使用 Element Plus 的菜单语义与键盘行为。
- 禁用节点不可激活。
- 图标只作为装饰，菜单项始终保留文本 label；折叠后的文字提示交由 Element Plus tooltip 处理。

## 路由与权限边界

组件不引入 `vue-router`，也不读取权限上下文。

业务方负责：

- 根据权限提前过滤或标记节点。
- 在 `select` 回调中根据 `index` 跳转。
- 处理外链、路由失败、权限变更和业务提示。

这保持组件包的依赖边界稳定，也避免节点类型被特定业务路由模型绑死。

## 测试策略

### 状态与兼容性

- 默认展开宽度、自定义宽度和折叠 `auto` 宽度。
- `collapse` 的内部切换、外部同步、`update:collapse` 和 `toggle`。
- `active` 的初始化优先级、内部选择、外部同步和 `update:active`。
- 默认插槽优先于 `items`，旧插槽用法保持可用。
- 两种渲染路径共享相同的 `select/open/close` 事件契约。

### 配置渲染

- 普通 item、嵌套 submenu、group 的递归渲染。
- 图标、禁用和隐藏节点。
- 隐藏子节点过滤及空 submenu/group 移除。
- 不修改原始 `items`。
- 配置变化触发重新渲染。

### 类型、插槽与实例

- 节点联合类型、`items`、`active` 和 `update:active` 的公开类型契约。
- header/footer/trigger 新作用域。
- `menuRef` 与 `toggle()` 暴露接口。
- 根 `$attrs` 与 Element Plus 菜单 Props 的透传边界。

### 校验、样式与可访问性

- 重复/空 index、空容器节点和插槽冲突的开发警告。
- 默认 trigger 的按钮类型、动态标签和图标隐藏语义。
- 折叠分组补偿样式及命名空间隔离。
- 组件中不存在调试 `console.log`，Playground 不存在 `alert` 或未注册图标组件警告。

### 发布验证

- `packages/ui` 全量类型检查和 Vitest。
- 组件库构建及多入口声明验证。
- 根入口与 business 入口的公开导出检查。
- NodeNext 类型消费验证。
- Playground 生产构建与浏览器交互验收。
- `git diff --check` 与变更范围审计。

## Playground 与文档

Playground 同时展示两种方式：

1. 配置驱动示例：包含子菜单、分组、图标、禁用、隐藏、折叠和 `v-model:active`。
2. 原生插槽示例：证明旧用法继续兼容。

示例中使用已正确导入的图标组件，移除 `alert` 和调试输出，使用页面可见状态或普通文本展示选中项和折叠状态。

README 增加：

- `items` 节点类型与完整配置示例。
- `v-model:active` 和初始化优先级。
- 默认插槽与 `items` 的优先级。
- 路由、权限和自定义 trigger 的职责边界。
- 新增 Props、Events、Slots 和节点类型表。

## 迁移与兼容

这是向后兼容的增强：

- 组件名、导入路径、默认插槽、现有 Props、Events 和 Expose 保持不变。
- 原有代码无需修改即可继续使用。
- 业务项目可以逐个菜单迁移到 `items`。
- `defaultActive` 继续支持，但推荐需要读取或控制状态的新代码使用 `v-model:active`。

潜在行为变化仅限修复项：移除调试输出、补齐折叠分组样式、统一插槽状态作用域和焦点反馈。

## 非目标

本次不包含：

- Vue Router 集成。
- 权限服务、角色判断或动态路由生成。
- 徽标、计数、说明文字、分割线和外链节点。
- 节点级自定义渲染插槽。
- 横向菜单模式。
- 独立公共 `GaMenu` 组件。
- 内置管理后台主题或主题切换器。
- 拖拽排序、菜单搜索、收藏或持久化折叠状态。
