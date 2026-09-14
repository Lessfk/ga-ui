import {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus'
import 'element-plus/dist/index.css'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import DemoPreview from './components/DemoPreview.vue'
import DocsLayout from './components/DocsLayout.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  Layout: DocsLayout,
  enhanceApp({ app }) {
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
    app.component('DemoPreview', DemoPreview)
  },
} satisfies Theme
