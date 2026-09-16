import BasicDemo from '../../demos/dialog/BasicDemo.vue'
import basicSource from '../../demos/dialog/BasicDemo.vue?raw'
import LifecycleDemo from '../../demos/dialog/LifecycleDemo.vue'
import lifecycleSource from '../../demos/dialog/LifecycleDemo.vue?raw'
import { generatedComponentApi } from '../../generated/component-api'
import { mergeComponentApi } from '../api'
import { apiOverrides } from '../api-overrides'
import { componentCatalog } from '../catalog'
import type { ComponentDocDefinition } from '../types'

const summary = componentCatalog.find((item) => item.slug === 'dialog')!

export default {
  ...summary,
  importCode: `import { GaDialog } from 'ga-ui-plus/base'
import 'ga-ui-plus/style.css'`,
  usage: `<GaDialog v-model="visible" title="编辑资料">
  对话框内容
</GaDialog>`,
  demos: [
    {
      id: 'basic',
      title: '基础对话框',
      description: '包含全屏切换、表单内容和自定义底部操作。',
      component: BasicDemo,
      source: basicSource,
    },
    {
      id: 'lifecycle',
      title: '关闭流程',
      description: '观察打开、关闭、自动聚焦和 before-close 的执行顺序。',
      component: LifecycleDemo,
      source: lifecycleSource,
    },
  ],
  api: mergeComponentApi(
    'dialog',
    generatedComponentApi.dialog,
    apiOverrides.dialog,
  ),
  notes: [
    'before-close 只有在回调调用 done 后才会继续关闭。',
    'footer 业务按钮由使用方提供，组件只管理对话框容器行为。',
  ],
} satisfies ComponentDocDefinition
