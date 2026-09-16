import BasicDemo from '../../demos/mega-menu/BasicDemo.vue'
import basicSource from '../../demos/mega-menu/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/mega-menu/ThemeDemo.vue'
import themeSource from '../../demos/mega-menu/ThemeDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'mega-menu')!

export default {
  ...summary,
  importCode: `import { GaMegaMenu } from 'ga-ui-plus/base'
import 'ga-ui-plus/style.css'`,
  usage: `<GaMegaMenu
  v-model:active-key="activeKey"
  :menus="menus"
  @select="handleSelect"
/>`,
  demos: [
    {
      id: 'basic',
      title: '数据驱动菜单',
      description: '切换点击与悬停触发方式，并观察 select 事件。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'theme',
      title: '独立配置菜单和面板',
      description: '一级菜单使用深绿色，二级面板使用浅色表面。',
      component: ThemeDemo,
      source: themeSource,
    },
  ],
  api: mergeComponentApi(
    'mega-menu',
    generatedComponentApi['mega-menu'],
    apiOverrides['mega-menu'],
  ),
  notes: [
    '点击或悬停触发只负责面板交互，页面跳转由 select 事件的使用方处理。',
    '传入组件图标时可以使用 markRaw，避免 Vue 将图标组件转为深层响应式对象。',
  ],
} satisfies ComponentDocDefinition
