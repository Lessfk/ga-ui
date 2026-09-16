import BasicDemo from '../../demos/pagination/BasicDemo.vue'
import basicSource from '../../demos/pagination/BasicDemo.vue?raw'
import ThemeDemo from '../../demos/pagination/ThemeDemo.vue'
import themeSource from '../../demos/pagination/ThemeDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'pagination')!

export default {
  ...summary,
  importCode: `import { GaPagination } from 'ga-ui-plus/base'
import 'ga-ui-plus/style.css'`,
  usage: `<GaPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="126"
/>`,
  demos: [
    {
      id: 'basic',
      title: '分页状态',
      description: '页码、每页数量和禁用状态都由外部控制。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'theme',
      title: '独立分页主题',
      description: '主题只影响当前分页实例。',
      component: ThemeDemo,
      source: themeSource,
    },
  ],
  api: mergeComponentApi(
    'pagination',
    generatedComponentApi.pagination,
    apiOverrides.pagination,
  ),
  notes: [
    'disabled 只禁用分页交互，不会改变外部的页码和每页数量。',
    'theme 通过实例级 CSS 变量生效，不会覆盖其他分页组件。',
  ],
} satisfies ComponentDocDefinition
