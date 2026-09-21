<template>
  <div class="doc-page">
    <h1>AsideMenu 侧边栏菜单</h1>
    <p class="doc-lead">
      <code>GaAsideMenu</code> 由 Element Plus 的 <code>ElAside</code>、<code>ElScrollbar</code> 与
      <code>ElMenu</code> 组合而成。菜单固定为纵向模式，默认插槽可以直接放置原生
      <code>ElSubMenu</code>、<code>ElMenuItem</code> 与 <code>ElMenuItemGroup</code>；<code>theme</code>
      可统一配置侧栏、菜单项及折叠弹出层的主题颜色。从 <code>ga-ui-plus/business</code> 导入。
    </p>

    <h2>基础用法</h2>
    <p>
      <code>collapse</code> 驱动内部 <code>ElMenu</code> 和外层 <code>ElAside</code> 同步折叠，支持
      <code>v-model:collapse</code>。<code>width</code> 控制展开宽度，<code>collapse-width</code>
      控制折叠宽度，默认分别为 <code>240px</code> 和 <code>64px</code>。
      父容器需要提供明确高度，内部 <code>ElScrollbar</code> 才能正确滚动。
    </p>
    <DemoBlock :source="basicSource">
      <BasicDemo />
    </DemoBlock>

    <h2>主题配置</h2>
    <p>
      通过 <code>theme</code> 设置背景、文字、激活态、悬停态与边框颜色，支持局部覆盖默认值。
      主题会同步应用到折叠后 Teleport 到 <code>body</code> 的子菜单弹层，并与传入的
      <code>popper-class</code>、<code>popper-style</code> 合并。
    </p>
    <DemoBlock :source="themeSource">
      <ThemeDemo />
    </DemoBlock>

    <h2>API</h2>

    <h3>Props</h3>
    <p>
      <code>GaAsideMenuProps</code> 在 Element Plus Menu Props 基础上增加了 <code>collapse</code>、
      <code>width</code>、<code>collapseWidth</code> 与 <code>theme</code>；<code>mode</code> 固定为
      <code>vertical</code>，<code>collapse</code> 由组件接管用于宽度联动。
    </p>
    <ApiTable :headers="['属性名', '说明', '类型', '默认值']" :rows="propsRows" />

    <h3>Events</h3>
    <ApiTable :headers="['事件名', '说明', '回调参数']" :rows="eventsRows" />

    <h3>Slots</h3>
    <ApiTable :headers="['插槽名', '说明', '作用域']" :rows="slotsRows" />

    <h3>Exposes</h3>
    <ApiTable :headers="['名称', '说明', '类型']" :rows="exposesRows" />

    <h2>样式配置</h2>
    <p><code>GaAsideMenuTheme</code> 支持以下字段，均可部分覆盖：</p>
    <ApiTable :headers="['字段', '说明', '类型']" :rows="themeRows" />

    <p>
      完整行为以
      <a href="https://element-plus.org/zh-CN/component/menu.html" target="_blank" rel="noreferrer">Element Plus Menu 文档</a>
      为准。
    </p>
  </div>
</template>

<script setup lang="ts">
import ApiTable from '../../components/ApiTable.vue'
import DemoBlock from '../../components/DemoBlock.vue'
import BasicDemo from '../../demos/aside-menu/BasicDemo.vue'
import basicSource from '../../demos/aside-menu/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/aside-menu/ThemeDemo.vue'
import themeSource from '../../demos/aside-menu/ThemeDemo.vue?raw'

const propsRows = [
  ['collapse', '是否折叠，支持 v-model:collapse', 'boolean', 'false'],
  ['width', '展开时侧边栏宽度', 'string', "'240px'"],
  ['collapseWidth', '折叠时侧边栏宽度', 'string', "'64px'"],
  ['theme', '侧栏、菜单项与折叠弹层的主题颜色，支持局部覆盖', 'GaAsideMenuTheme', '内置蓝色渐变主题'],
  ['defaultActive', '默认激活菜单 index', 'string', "''"],
  ['defaultOpeneds', '默认展开的 SubMenu index 集合', 'string[]', '[]'],
  ['uniqueOpened', '是否只保持一个子菜单展开', 'boolean', 'false'],
  ['router', '是否启用路由模式；需要应用实际安装 Vue Router 才会执行跳转', 'boolean', 'false'],
  ['menuTrigger', '子菜单触发方式', "'hover' | 'click'", "'hover'"],
  ['backgroundColor', '菜单背景色', 'string', '—'],
  ['textColor', '菜单文字颜色', 'string', '—'],
  ['activeTextColor', '激活菜单文字颜色', 'string', '—'],
  ['collapseTransition', '是否开启折叠动画', 'boolean', 'true'],
  ['ellipsis', '文字溢出时是否省略', 'boolean', 'true'],
  ['popperOffset', '弹出层偏移', 'number', '6'],
  ['popperEffect', '弹出层主题', 'PopperEffect', "'dark'"],
  ['popperClass', '弹出层自定义类名', 'string', '—'],
  ['popperStyle', '弹出层自定义样式', 'string | CSSProperties', '—'],
  ['showTimeout', '子菜单展开延时', 'number', '300'],
  ['hideTimeout', '子菜单收起延时', 'number', '300'],
  ['closeOnClickOutside', '点击外部是否收起弹出菜单', 'boolean', 'false'],
  ['ellipsisIcon', '省略图标', 'string | Component', 'Element Plus 默认图标'],
  ['persistent', '菜单收起时是否保留弹出层 DOM', 'boolean', 'true'],
]

const eventsRows = [
  ['update:collapse', '折叠状态变化；用于 v-model:collapse', '(collapse: boolean)'],
  ['toggle', '折叠/展开切换动作执行后触发', '(collapse: boolean)'],
  ['select', '原样转发 Element Plus 菜单选择事件', '(index: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<unknown>)'],
  ['open', '子菜单展开', '(index: string, indexPath: string[])'],
  ['close', '子菜单收起', '(index: string, indexPath: string[])'],
]

const slotsRows = [
  ['header', '侧边栏头部区域，通常放 logo 或产品名；未提供时不渲染', '{ collapse }'],
  ['default', '原生菜单内容，可直接使用 ElSubMenu、ElMenuItem、ElMenuItemGroup', '—'],
  ['footer', '侧边栏底部区域；未提供时不渲染', '{ collapse }'],
  ['collapse', '折叠/展开控制区域；未提供时使用内置按钮', '{ collapse, toggle }'],
]

const exposesRows = [
  ['menuRef', "底层 ElMenu 实例，可调用 open(index)、close(index)、handleResize()、updateActiveIndex(index)", 'MenuInstance | undefined'],
  ['toggle', '组件外触发与内置切换一致的折叠/展开动作', '() => void'],
]

const themeRows = [
  ['backgroundColor', '侧栏、菜单与折叠弹层背景色', 'string'],
  ['textColor', '默认文字与图标颜色', 'string'],
  ['activeTextColor', '激活菜单项文字与图标颜色', 'string'],
  ['activeBackgroundColor', '激活菜单项背景色', 'string'],
  ['hoverBackgroundColor', '菜单项和折叠按钮悬停背景色', 'string'],
  ['borderColor', '侧栏分隔线和折叠弹层边框颜色', 'string'],
]
</script>
