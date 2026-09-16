import AdvancedDemo from '../../demos/search-bar/AdvancedDemo.vue'
import advancedSource from '../../demos/search-bar/AdvancedDemo.vue?raw'
import BasicDemo from '../../demos/search-bar/BasicDemo.vue'
import basicSource from '../../demos/search-bar/BasicDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'search-bar')!

export default {
  ...summary,
  importCode: `import { GaSearchBar } from 'ga-ui-plus/business'
import 'ga-ui-plus/style.css'`,
  usage: `<GaSearchBar
  v-model="query"
  :fields="fields"
  @search="handleSearch"
  @reset="handleReset"
/>`,
  demos: [
    {
      id: 'basic',
      title: '字段、栅格与折叠',
      description: '包含输入、单选、多选、日期格式和查询结果。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'advanced',
      title: '校验、自定义字段与按钮',
      description: '只替换查询按钮，并在前后插入额外操作。',
      component: AdvancedDemo,
      source: advancedSource,
    },
  ],
  api: mergeComponentApi(
    'search-bar',
    generatedComponentApi['search-bar'],
    apiOverrides['search-bar'],
  ),
  notes: [
    '字段的 placeholder 由字段配置单独控制，labelMode 只决定 label 是否显示。',
    '表单禁用和操作按钮禁用分开配置，actionsLoading 只影响查询按钮。',
  ],
} satisfies ComponentDocDefinition
