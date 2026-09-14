<script setup>
import BasicDemo from '../demos/mega-menu/BasicDemo.vue'
import ThemeDemo from '../demos/mega-menu/ThemeDemo.vue'
</script>

# MegaMenu 大型菜单

`GaMegaMenu` 用数据驱动的一级导航和大型二级面板组合复杂系统菜单。一级菜单与面板样式分别配置，支持点击或悬停触发、自定义图标、受控激活值和实例方法。

## 基础用法

菜单图标接收 Vue 组件。把图标组件放入响应式菜单数据时建议使用 `markRaw`，避免 Vue 为组件定义创建不必要的深层代理。

<DemoPreview title="数据驱动菜单" description="切换点击与悬停触发方式，并观察 select 事件。">
  <BasicDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/mega-menu/BasicDemo.vue
:::

## 独立主题

一级菜单使用 `menu*` 字段，二级面板使用 `panel*` 字段，两部分不做旧字段兼容。

<DemoPreview title="独立配置菜单和面板" description="一级菜单使用深绿色，二级面板使用浅色表面。">
  <ThemeDemo />
</DemoPreview>

::: details 查看源代码
<<< ../demos/mega-menu/ThemeDemo.vue
:::

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `menus` | `GaMegaMenuNavItem[]` | `[]` | 一级菜单及面板数据 |
| `activeKey` | `string \| number` | `undefined` | 当前选中项，支持 `v-model:active-key` |
| `openKey` | `string \| number` | `undefined` | 当前打开的一级菜单，支持 `v-model:open-key` |
| `trigger` | `'click' \| 'hover'` | `'click'` | 面板触发方式 |
| `openDelay` | `number` | `100` | 悬停打开延时，单位 ms |
| `closeDelay` | `number` | `180` | 悬停关闭延时，单位 ms |
| `minColumnWidth` | `number` | `240` | 面板自适应列最小宽度 |
| `maxColumnWidth` | `number` | `420` | 面板单列最大宽度 |
| `maxHeight` | `string \| number` | `'auto'` | 面板最大高度；`auto` 时按内容自适应 |
| `closeOnSelect` | `boolean` | `true` | 选择面板菜单项后是否关闭 |
| `theme` | `GaMegaMenuTheme` | 内置主题 | 一级菜单和面板样式，支持局部覆盖 |
| `ariaLabel` | `string` | `'大型菜单导航'` | 导航区域无障碍名称 |

#### 菜单数据

| 类型 | 字段 | 说明 |
| --- | --- | --- |
| `GaMegaMenuNavItem` | `key`、`label`、`icon?`、`disabled?`、`groups?` | 一级菜单；没有 `groups` 时可直接选择 |
| `GaMegaMenuGroup` | `key`、`title?`、`items` | 面板分组 |
| `GaMegaMenuItem` | `key`、`label`、`description?`、`icon?`、`disabled?` | 面板菜单项；描述为空时标签居中显示 |
| `GaMegaMenuIconConfig` | `component`、`props?` | 图标组件及传给图标的 Props |

#### 一级菜单主题

| 字段 | 说明 |
| --- | --- |
| `menuBackgroundColor` | 一级导航背景 |
| `menuGap` | 一级菜单项间距 |
| `menuItemTextColor` / `menuItemBackgroundColor` / `menuItemBorderColor` | 默认文字、背景和边框 |
| `menuItemHoverTextColor` / `menuItemHoverBackgroundColor` / `menuItemHoverBorderColor` | 悬停状态 |
| `menuItemActiveTextColor` / `menuItemActiveBackgroundColor` / `menuItemActiveBorderColor` | 激活状态 |
| `menuItemDisabledTextColor` / `menuItemDisabledBackgroundColor` / `menuItemDisabledBorderColor` | 禁用状态 |
| `menuItemFocusOutlineColor` | 键盘聚焦轮廓 |
| `menuItemFontSize` / `menuItemFontWeight` | 字体大小和字重 |
| `menuItemIconSize` | 图标大小 |
| `menuItemGap` | 图标与文字间距 |
| `menuItemHorizontalPadding` / `menuItemVerticalSpace` | 水平内边距和垂直空间 |
| `menuItemBorderRadius` | 圆角 |
| `menuItemShadow` / `menuItemActiveShadow` | 默认和激活阴影 |

#### 二级面板主题

| 字段 | 说明 |
| --- | --- |
| `panelBackgroundColor` / `panelBorderColor` / `panelTopBorderColor` | 面板背景、边框和顶部边框 |
| `panelShadow` / `panelPadding` / `panelGap` | 面板阴影、内边距和列间距 |
| `panelGroupTitleColor` / `panelGroupTitleFontSize` / `panelGroupTitleFontWeight` | 分组标题文字样式 |
| `panelGroupTitleMarginBottom` / `panelGroupTitleHorizontalPadding` | 分组标题间距 |
| `panelItemTextColor` / `panelItemBackgroundColor` / `panelItemBorderColor` | 菜单项默认状态 |
| `panelItemHoverTextColor` / `panelItemHoverBackgroundColor` / `panelItemHoverBorderColor` | 菜单项悬停状态 |
| `panelItemActiveTextColor` / `panelItemActiveBackgroundColor` / `panelItemActiveBorderColor` | 菜单项激活状态 |
| `panelItemDisabledTextColor` / `panelItemDisabledBackgroundColor` / `panelItemDisabledBorderColor` | 菜单项禁用状态 |
| `panelItemFocusOutlineColor` | 键盘聚焦轮廓 |
| `panelItemBorderRadius` / `panelItemMinHeight` / `panelItemPadding` | 圆角、最小高度和内边距 |
| `panelItemGap` / `panelItemListGap` | 图标内容间距和同组菜单项间距 |
| `panelItemLabelFontSize` / `panelItemLabelFontWeight` | 标签文字样式 |
| `panelItemDescriptionColor` / `panelItemDescriptionFontSize` / `panelItemDescriptionLineHeight` | 描述文字样式 |
| `panelItemIconColor` / `panelItemIconSize` / `panelItemIconBoxSize` | 图标颜色、大小和容器尺寸 |
| `panelItemIconBackgroundColor` / `panelItemIconBorderRadius` | 图标容器背景和圆角 |
| `panelEmptyTextColor` / `panelEmptyPadding` | 空状态文字和内边距 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:activeKey` | `(key)` | 选中项变化 |
| `update:openKey` | `(key \| undefined)` | 打开面板变化 |
| `select` | `(payload: GaMegaMenuSelectPayload)` | 一级直达菜单或面板项被选择 |
| `open` | `(key, menu)` | 面板打开 |
| `close` | `(key, menu)` | 面板关闭 |

`select` 的 `payload` 包含 `key`、`source`、`menu`、可选的 `group`/`item` 和 `nativeEvent`。

### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `menu-item` | `{ menu, active, open }` | 自定义一级菜单项 |
| `group-title` | `{ menu, group }` | 自定义分组标题 |
| `panel-item` | `{ menu, group, item, active }` | 自定义面板项 |
| `empty` | `{ menu }` | 自定义空面板 |

### Expose

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| `open` | `(key)` | 打开指定一级菜单面板 |
| `close` | 无 | 关闭当前面板 |
| `toggle` | `(key)` | 切换指定面板 |

### 公开类型

主要类型包括 `GaMegaMenuProps`、`GaMegaMenuNavItem`、`GaMegaMenuGroup`、`GaMegaMenuItem`、`GaMegaMenuTheme`、`GaMegaMenuSelectPayload` 和 `GaMegaMenuExpose`。
