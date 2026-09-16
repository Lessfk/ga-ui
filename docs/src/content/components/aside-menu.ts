import BasicDemo from '../../demos/aside-menu/BasicDemo.vue'
import basicSource from '../../demos/aside-menu/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/aside-menu/ThemeDemo.vue'
import themeSource from '../../demos/aside-menu/ThemeDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'aside-menu')!

export default {
  ...summary,
  importCode: `import { GaAsideMenu } from 'ga-ui-plus/business'
import 'ga-ui-plus/style.css'`,
  usage: `<GaAsideMenu v-model:collapse="collapsed" @select="handleSelect">
  <ElMenuItem index="dashboard">工作台</ElMenuItem>
</GaAsideMenu>`,
  demos: [
    {
      id: 'basic',
      title: '完整侧边栏',
      description: '展示头部、底部、自定义折叠控制和 select 事件。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'theme',
      title: '实例级主题',
      description: '背景、文字、激活态和悬停态可单独设置。',
      component: ThemeDemo,
      source: themeSource,
    },
  ],
  api: mergeComponentApi(
    'aside-menu',
    generatedComponentApi['aside-menu'],
    apiOverrides['aside-menu'],
  ),
  notes: [
    '默认插槽直接放置 ElMenuItem 和 ElSubMenu，便于完整使用 Element Plus 菜单插槽。',
    'collapse 支持 v-model，也可以通过折叠插槽中的 toggle 方法切换。',
  ],
} satisfies ComponentDocDefinition
