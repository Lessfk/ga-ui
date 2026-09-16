import BasicDemo from '../../demos/table-pagination/BasicDemo.vue'
import basicSource from '../../demos/table-pagination/BasicDemo.vue?raw'
import LoadingDemo from '../../demos/table-pagination/LoadingDemo.vue'
import loadingSource from '../../demos/table-pagination/LoadingDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find(
  (item) => item.slug === 'table-pagination',
)!

export default {
  ...summary,
  importCode: `import { GaTablePagination } from 'ga-ui-plus/business'
import 'ga-ui-plus/style.css'`,
  usage: `<GaTablePagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :data="rows"
  :columns="columns"
  :total="total"
/>`,
  demos: [
    {
      id: 'basic',
      title: '表格与分页联动',
      description: '切换页码和每页数量时由外部计算当前页数据。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'loading',
      title: '加载时禁用分页',
      description: '点击模拟加载，观察表格遮罩和分页按钮。',
      component: LoadingDemo,
      source: loadingSource,
    },
  ],
  api: mergeComponentApi(
    'table-pagination',
    generatedComponentApi['table-pagination'],
    apiOverrides['table-pagination'],
  ),
  notes: [
    'loading 同时控制表格加载遮罩和分页禁用状态，避免请求期间重复切页。',
    'tableTheme 和 paginationTheme 分别配置表格与分页样式，两者互不覆盖。',
  ],
} satisfies ComponentDocDefinition
