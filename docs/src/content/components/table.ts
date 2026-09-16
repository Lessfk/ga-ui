import BasicDemo from '../../demos/table/BasicDemo.vue'
import basicSource from '../../demos/table/BasicDemo.vue?raw'
import SelectionDemo from '../../demos/table/SelectionDemo.vue'
import selectionSource from '../../demos/table/SelectionDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'table')!

export default {
  ...summary,
  importCode: `import { GaTable } from 'ga-ui-plus/base'
import 'ga-ui-plus/style.css'`,
  usage: `<GaTable :data="rows" :columns="columns" row-key="id" />`,
  demos: [
    {
      id: 'basic',
      title: '基础表格',
      description: '通过 columns 配置列，并用 slot 字段关联同名插槽。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'selection',
      title: '选择列和独立主题',
      description: 'selection-change 由底层 ElTable 通过 attrs 透传。',
      component: SelectionDemo,
      source: selectionSource,
    },
  ],
  api: mergeComponentApi(
    'table',
    generatedComponentApi.table,
    apiOverrides.table,
  ),
  notes: [
    'columns 中的 slot 名称与模板同名插槽对应，用于自定义单元格内容。',
    'ElTable 的事件和未显式声明的属性通过 attrs 透传。',
  ],
} satisfies ComponentDocDefinition
