<template>
  <div class="doc-page">
    <h1>MegaMenu 大型菜单</h1>
    <p class="doc-lead">
      <code>GaMegaMenu</code> 是面向 PC 端头部导航的大型菜单组件。一级菜单使用原生按钮渲染，
      包含分组数据的菜单可以通过 <code>click</code> 或 <code>hover</code> 打开 Teleport 到
      <code>body</code> 的二级面板。一级菜单和二级面板使用完全独立的主题字段。从
      <code>ga-ui-plus/base</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>
      <code>menus</code> 中没有 <code>groups</code> 的一级菜单会直接触发选择；包含 <code>groups</code>
      的菜单用于打开面板。<code>select</code> 事件统一返回
      <code>{ key, source, menu, group?, item?, nativeEvent }</code>，其中 <code>source</code> 为
      <code>menu</code> 或 <code>panel</code>。
    </p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>分区主题</h2>
    <p>
      一级菜单使用 <code>menu*</code>、<code>menuItem*</code> 字段，二级面板使用 <code>panel*</code>、
      <code>panelGroupTitle*</code>、<code>panelItem*</code>、<code>panelEmpty*</code> 字段。
      两部分不会互相回退，可以组合成深色导航与浅色面板。所有主题字段均为可选；尺寸、间距、圆角和行高字段接收
      <code>string | number</code>，数字会转换为 <code>px</code>。
    </p>
    <DemoBlock :source="themeSource">
      <ThemeDemo />
    </DemoBlock>
    <p>
      二级面板通过 Teleport 渲染到 <code>body</code>，组件会把当前实例解析后的完整主题变量同时绑定到导航根节点和弹出面板，
      因此不需要在全局样式中重复声明变量，多个 <code>GaMegaMenu</code> 实例也可以使用不同主题。
    </p>

    <h2>API</h2>

    <h3>Props</h3>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>数据结构</h3>
    <h4>GaMegaMenuNavItem（一级菜单）</h4>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="navItemRows" />
    <h4>GaMegaMenuGroup（分组）</h4>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="groupRows" />
    <h4>GaMegaMenuItem（二级菜单项）</h4>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="itemRows" />

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h3>Slots</h3>
    <ApiTable :headers="['插槽名', '说明', '作用域']" :rows="slotsRows" />

    <h3>Exposes</h3>
    <ApiTable :headers="['名称', '说明', '类型']" :rows="exposesRows" />

    <h2>样式配置</h2>
    <p><code>GaMegaMenuTheme</code> 全部字段可选，按区域分组如下：</p>

    <h4>一级菜单容器</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="menuThemeRows" />

    <h4>一级菜单项</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="menuItemThemeRows" />

    <h4>二级面板容器</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="panelThemeRows" />

    <h4>二级分组标题</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="groupTitleThemeRows" />

    <h4>二级菜单项</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="panelItemThemeRows" />

    <h4>空状态</h4>
    <ApiTable :headers="['字段', '说明', '类型', '默认值']" :rows="emptyThemeRows" />
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/mega-menu/BasicDemo.vue'
import basicSource from '../../demos/mega-menu/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/mega-menu/ThemeDemo.vue'
import themeSource from '../../demos/mega-menu/ThemeDemo.vue?raw'

const propsRows = [
  ['menus', '一级菜单数据', 'GaMegaMenuNavItem[]', '[]'],
  ['activeKey', '当前激活项 key，支持 v-model:active-key', 'GaMegaMenuKey', '—'],
  ['openKey', '当前展开面板的一级菜单 key，支持 v-model:open-key', 'GaMegaMenuKey', '—'],
  ['trigger', '面板打开触发方式', "'click' | 'hover'", "'click'"],
  ['openDelay', 'hover 触发时的打开延时（ms）', 'number', '100'],
  ['closeDelay', 'hover 触发时的关闭延时（ms）', 'number', '180'],
  ['minColumnWidth', '面板分组列最小宽度（px）', 'number', '240'],
  ['maxColumnWidth', '面板分组列最大宽度（px）', 'number', '420'],
  ['maxHeight', '面板最大高度', 'string | number', "'auto'"],
  ['closeOnSelect', '选择面板菜单项后是否关闭面板', 'boolean', 'true'],
  ['theme', '分区主题配置，支持部分覆盖', 'GaMegaMenuTheme', '{}'],
  ['ariaLabel', '导航容器无障碍标签', 'string', "'大型菜单导航'"],
]

const navItemRows = [
  ['key', '菜单唯一标识', 'GaMegaMenuKey'],
  ['label', '菜单文案', 'string'],
  ['icon', '图标，可传组件或 { component, props } 配置', 'GaMegaMenuIcon'],
  ['disabled', '是否禁用', 'boolean'],
  ['groups', '分组数据；存在时该菜单用于打开二级面板', 'GaMegaMenuGroup[]'],
]

const groupRows = [
  ['key', '分组唯一标识', 'GaMegaMenuKey'],
  ['title', '分组标题', 'string'],
  ['items', '分组内菜单项', 'GaMegaMenuItem[]'],
]

const itemRows = [
  ['key', '菜单项唯一标识', 'GaMegaMenuKey'],
  ['label', '菜单项文案', 'string'],
  ['description', '描述文字', 'string'],
  ['icon', '图标，可传组件或 { component, props } 配置', 'GaMegaMenuIcon'],
  ['disabled', '是否禁用', 'boolean'],
]

const eventsRows = [
  ['update:activeKey', '激活项变化；用于 v-model:active-key', '(key: GaMegaMenuKey)'],
  ['update:openKey', '展开面板变化；用于 v-model:open-key', '(key: GaMegaMenuKey | undefined)'],
  ['select', '菜单选择，统一返回菜单或面板来源', '(payload: GaMegaMenuSelectPayload)'],
  ['open', '面板展开', '(key: GaMegaMenuKey, menu: GaMegaMenuNavItem)'],
  ['close', '面板关闭', '(key: GaMegaMenuKey, menu: GaMegaMenuNavItem)'],
]

const slotsRows = [
  ['menu-item', '自定义一级菜单项内容', '{ menu, active, open }'],
  ['group-title', '自定义面板分组标题', '{ menu, group }'],
  ['panel-item', '自定义面板菜单项内容', '{ menu, group, item, active }'],
  ['empty', '自定义面板空状态', '{ menu }'],
]

const exposesRows = [
  ['open', '展开指定一级菜单的面板', '(key: GaMegaMenuKey) => void'],
  ['close', '关闭当前面板', '() => void'],
  ['toggle', '切换指定一级菜单的面板', '(key: GaMegaMenuKey) => void'],
]

const menuThemeRows = [
  ['menuBackgroundColor', '一级菜单容器背景色', 'string', "'#2f436b'"],
  ['menuGap', '一级菜单项之间的间距', 'string | number', "'8px'"],
]

const menuItemThemeRows = [
  ['menuItemTextColor', '默认文字颜色', 'string', "'#ffffff'"],
  ['menuItemBackgroundColor', '默认背景色', 'string', "'#3d527c'"],
  ['menuItemBorderColor', '默认边框颜色', 'string', "'transparent'"],
  ['menuItemHoverTextColor', '悬停文字颜色', 'string', "'#ffffff'"],
  ['menuItemHoverBackgroundColor', '悬停背景色', 'string', "'#465d89'"],
  ['menuItemHoverBorderColor', '悬停边框颜色', 'string', "'rgb(255 255 255 / 12%)'"],
  ['menuItemActiveTextColor', '激活文字颜色', 'string', "'#ffffff'"],
  ['menuItemActiveBackgroundColor', '激活背景色', 'string', "'#315c96'"],
  ['menuItemActiveBorderColor', '激活边框颜色', 'string', "'#4c78b1'"],
  ['menuItemDisabledTextColor', '禁用文字颜色', 'string', "'rgb(255 255 255 / 45%)'"],
  ['menuItemDisabledBackgroundColor', '禁用背景色', 'string', "'rgb(255 255 255 / 8%)'"],
  ['menuItemDisabledBorderColor', '禁用边框颜色', 'string', "'transparent'"],
  ['menuItemFocusOutlineColor', '键盘聚焦轮廓颜色', 'string', "'#8db7f0'"],
  ['menuItemFontSize', '字体大小', 'string | number', "'20px'"],
  ['menuItemFontWeight', '字重', 'string | number', '700'],
  ['menuItemIconSize', '图标大小', 'string | number', "'26px'"],
  ['menuItemGap', '图标与文字间距', 'string | number', "'10px'"],
  ['menuItemHorizontalPadding', '水平内边距', 'string | number', "'24px'"],
  ['menuItemVerticalSpace', '菜单项相对容器高度预留的垂直空间', 'string | number', "'32px'"],
  ['menuItemBorderRadius', '圆角', 'string | number', "'14px'"],
  ['menuItemShadow', '默认阴影', 'string', "'0 1px 1px rgb(15 31 58 / 18%)'"],
  ['menuItemActiveShadow', '激活阴影', 'string', "'inset 0 1px 0 rgb(255 255 255 / 6%), 0 1px 2px rgb(13 29 55 / 22%)'"],
]

const panelThemeRows = [
  ['panelBackgroundColor', '面板背景色', 'string', "'#2f436b'"],
  ['panelBorderColor', '面板边框颜色', 'string', "'#415a86'"],
  ['panelTopBorderColor', '面板顶部边框颜色', 'string', "'rgb(255 255 255 / 8%)'"],
  ['panelShadow', '面板阴影', 'string', "'0 18px 40px rgb(15 31 58 / 28%)'"],
  ['panelPadding', '面板内容内边距', 'string | number', "'24px'"],
  ['panelGap', '分组列之间的间距', 'string | number', "'24px'"],
]

const groupTitleThemeRows = [
  ['panelGroupTitleColor', '分组标题颜色', 'string', "'#b7c4da'"],
  ['panelGroupTitleFontSize', '分组标题字体大小', 'string | number', "'13px'"],
  ['panelGroupTitleFontWeight', '分组标题字重', 'string | number', '600'],
  ['panelGroupTitleMarginBottom', '分组标题下外边距', 'string | number', "'10px'"],
  ['panelGroupTitleHorizontalPadding', '分组标题水平内边距', 'string | number', "'12px'"],
]

const panelItemThemeRows = [
  ['panelItemTextColor', '默认文字颜色', 'string', "'#ffffff'"],
  ['panelItemBackgroundColor', '默认背景色', 'string', "'#3d527c'"],
  ['panelItemBorderColor', '默认边框颜色', 'string', "'transparent'"],
  ['panelItemHoverTextColor', '悬停文字颜色', 'string', "'#ffffff'"],
  ['panelItemHoverBackgroundColor', '悬停背景色', 'string', "'#465d89'"],
  ['panelItemHoverBorderColor', '悬停边框颜色', 'string', "'rgb(255 255 255 / 12%)'"],
  ['panelItemActiveTextColor', '激活文字颜色', 'string', "'#ffffff'"],
  ['panelItemActiveBackgroundColor', '激活背景色', 'string', "'#315c96'"],
  ['panelItemActiveBorderColor', '激活边框颜色', 'string', "'#4c78b1'"],
  ['panelItemDisabledTextColor', '禁用文字颜色', 'string', "'rgb(255 255 255 / 42%)'"],
  ['panelItemDisabledBackgroundColor', '禁用背景色', 'string', "'rgb(255 255 255 / 6%)'"],
  ['panelItemDisabledBorderColor', '禁用边框颜色', 'string', "'transparent'"],
  ['panelItemFocusOutlineColor', '键盘聚焦轮廓颜色', 'string', "'#8db7f0'"],
  ['panelItemBorderRadius', '菜单项圆角', 'string | number', "'10px'"],
  ['panelItemMinHeight', '菜单项最小高度', 'string | number', "'64px'"],
  ['panelItemPadding', '菜单项内边距', 'string | number', "'12px'"],
  ['panelItemGap', '图标与内容间距', 'string | number', "'12px'"],
  ['panelItemListGap', '同一分组内菜单项间距', 'string | number', "'8px'"],
  ['panelItemLabelFontSize', '标签字体大小', 'string | number', "'14px'"],
  ['panelItemLabelFontWeight', '标签字重', 'string | number', '700'],
  ['panelItemDescriptionColor', '描述文字颜色', 'string', "'#b7c4da'"],
  ['panelItemDescriptionFontSize', '描述字体大小', 'string | number', "'12px'"],
  ['panelItemDescriptionLineHeight', '描述行高', 'string | number', "'18px'"],
  ['panelItemIconColor', '图标颜色', 'string', "'#ffffff'"],
  ['panelItemIconSize', '图标大小', 'string | number', "'20px'"],
  ['panelItemIconBoxSize', '图标容器宽高', 'string | number', "'38px'"],
  ['panelItemIconBackgroundColor', '图标容器背景色', 'string', "'rgb(255 255 255 / 8%)'"],
  ['panelItemIconBorderRadius', '图标容器圆角', 'string | number', "'8px'"],
]

const emptyThemeRows = [
  ['panelEmptyTextColor', '空状态文字颜色', 'string', "'#b7c4da'"],
  ['panelEmptyPadding', '空状态内边距', 'string | number', "'48px 24px'"],
]
</script>
