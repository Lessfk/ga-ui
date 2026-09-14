<script setup>
import BasicDemo from '../demos/aside-menu/BasicDemo.vue'
import ThemeDemo from '../demos/aside-menu/ThemeDemo.vue'
</script>

# AsideMenu 侧边菜单

`GaAsideMenu` 由 `ElAside`、`ElScrollbar` 和 `ElMenu` 组合而成，负责侧栏宽度、滚动、折叠状态和主题。菜单内容仍使用原生 `ElMenuItem`、`ElSubMenu` 与 `ElMenuItemGroup`。

## 插槽与折叠

父容器需要明确高度，内部滚动区域才能正确计算。`header`、`footer` 和 `collapse` 插槽都会获得当前折叠状态。

<DemoPreview title="完整侧边栏" description="展示头部、底部、自定义折叠控制和 select 事件。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/aside-menu/BasicDemo.vue
:::

## 主题配置

主题变量会同步应用到折叠后 Teleport 到 `body` 的子菜单弹层。

<DemoPreview title="实例级主题" description="背景、文字、激活态和悬停态可单独设置。">
  <ThemeDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/aside-menu/ThemeDemo.vue
:::

## API

### Props

`GaAsideMenuProps` 继承除 `mode` 和 `collapse` 外的 Element Plus `MenuPropsPublic`。菜单固定为纵向模式，以下属性由包装组件重点维护。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `collapse` | `boolean` | `false` | 是否折叠，支持 `v-model:collapse` |
| `width` | `string` | `'240px'` | 展开宽度 |
| `collapseWidth` | `string` | `'64px'` | 折叠宽度 |
| `theme` | `GaAsideMenuTheme` | 内置深色主题 | 侧栏和弹层主题 |
| `defaultActive` | `string` | `''` | 默认激活菜单 index |
| `defaultOpeneds` | `string[]` | `[]` | 默认展开的子菜单 |
| `uniqueOpened` | `boolean` | `false` | 是否只保持一个子菜单展开 |
| `router` | `boolean` | `false` | 是否启用 Vue Router 导航 |
| `collapseTransition` | `boolean` | `true` | 是否开启折叠动画 |
| `ellipsis` | `boolean` | `true` | 是否处理菜单文字溢出 |
| `persistent` | `boolean` | `true` | 收起后是否保留弹层 DOM |
| `menuTrigger` | `'hover' \| 'click'` | `'hover'` | 子菜单触发方式 |
| `showTimeout` / `hideTimeout` | `number` | Element Plus 默认值 | 展开与关闭延时 |
| `popperOffset` / `popperEffect` | Element Plus 类型 | Element Plus 默认值 | 折叠弹层偏移和效果 |
| `popperClass` / `popperStyle` | `string` / `CSSProperties` | `undefined` | 折叠弹层样式扩展 |

#### Theme

| 字段 | 说明 |
| --- | --- |
| `backgroundColor` | 侧栏、菜单和折叠弹层背景；支持颜色或 CSS 渐变 |
| `textColor` | 默认文字和图标颜色 |
| `activeTextColor` | 激活文字和图标颜色 |
| `activeBackgroundColor` | 激活背景 |
| `hoverBackgroundColor` | 菜单项和折叠按钮悬停背景 |
| `borderColor` | 侧栏分隔线和折叠弹层边框 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:collapse` | `(collapse: boolean)` | 折叠状态变化 |
| `toggle` | `(collapse: boolean)` | 执行一次折叠切换后 |
| `select` | `(index, indexPath, item, routerResult?)` | 菜单项被选择 |
| `open` | `(index, indexPath)` | 子菜单展开 |
| `close` | `(index, indexPath)` | 子菜单关闭 |

### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `header` | `{ collapse }` | Logo、系统名等头部内容 |
| `default` | 无 | 原生 Element Plus 菜单节点 |
| `footer` | `{ collapse }` | 侧栏底部内容 |
| `collapse` | `{ collapse, toggle }` | 自定义折叠控制；未提供时使用内置按钮 |

### Expose

| 属性或方法 | 类型 | 说明 |
| --- | --- | --- |
| `menuRef` | `MenuInstance \| undefined` | 内部菜单实例 |
| `toggle()` | `() => void` | 切换折叠状态，并触发模型更新和 `toggle` 事件 |

### 公开类型

可导入 `GaAsideMenuProps`、`GaAsideMenuTheme`、`GaAsideMenuEmits`、`GaAsideMenuSlotProps`、`GaAsideMenuToggleSlotProps` 和 `GaAsideMenuExpose`。
