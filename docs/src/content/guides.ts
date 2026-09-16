import type { GuideDefinition } from './types'

export const guides: Record<string, GuideDefinition> = {
  introduction: {
    slug: 'introduction',
    title: '介绍',
    description: '了解 GA UI Plus 的定位、组件分层和文档用途。',
    sections: [
      {
        id: 'purpose',
        title: '组件库定位',
        paragraphs: [
          'GA UI Plus 是一个基于 Vue 3 和 Element Plus 的业务组件库，为表格、分页、搜索、菜单和对话框场景提供稳定默认行为。',
        ],
      },
      {
        id: 'layers',
        title: '组件分层',
        bullets: [
          '基础组件：GaDialog、GaMegaMenu、GaPagination、GaTable。',
          '业务组件：GaAsideMenu、GaSearchBar、GaTablePagination。',
        ],
      },
      {
        id: 'workflow',
        title: '文档与 Playground',
        paragraphs: [
          'Playground 用于快速试验和排查问题；文档项目只收录行为稳定、API 清晰并且源码可复制的案例。',
        ],
      },
    ],
  },
  'quick-start': {
    slug: 'quick-start',
    title: '快速开始',
    description: '安装依赖、引入样式并在 Vue 页面中使用组件。',
    sections: [
      {
        id: 'install',
        title: '安装',
        paragraphs: [
          'vue 和 element-plus 是 peer dependencies，需要由业务项目直接安装。',
        ],
        code: 'pnpm add ga-ui-plus vue element-plus',
        language: 'bash',
      },
      {
        id: 'styles',
        title: '全量样式与按组件导入',
        code: `import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'ga-ui-plus/style.css'

import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')`,
        language: 'ts',
      },
      {
        id: 'component',
        title: '页面中使用组件',
        code: `<script setup lang="ts">
import { ref } from 'vue'
import { GaDialog } from 'ga-ui-plus/base'

const visible = ref(false)
<\/script>

<template>
  <ElButton @click="visible = true">打开</ElButton>
  <GaDialog v-model="visible" title="示例对话框">
    对话框内容
  </GaDialog>
</template>`,
        language: 'vue',
      },
      {
        id: 'entries',
        title: '导入入口',
        code: `import { GaDialog, GaSearchBar, GaTable } from 'ga-ui-plus'

// 按分层入口导入时，只选择当前页面需要的组件
import { GaPagination } from 'ga-ui-plus/base'
import { GaAsideMenu } from 'ga-ui-plus/business'`,
        language: 'ts',
      },
    ],
  },
  resolver: {
    slug: 'resolver',
    title: '按需引入',
    description: '使用 GaUiResolver 自动解析组件和所需样式。',
    sections: [
      {
        id: 'install',
        title: '安装插件',
        code: 'pnpm add -D unplugin-vue-components unplugin-auto-import',
        language: 'bash',
      },
      {
        id: 'default',
        title: '默认配置',
        code: `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { GaUiResolver } from 'ga-ui-plus/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver(), GaUiResolver()] }),
  ],
})`,
        language: 'ts',
      },
      {
        id: 'full-element-plus',
        title: '业务项目已全量引入 Element Plus 样式',
        code: `import 'element-plus/dist/index.css'

Components({
  resolvers: [
    ElementPlusResolver({ importStyle: false }),
    GaUiResolver({ elementPlusStyle: false }),
  ],
})`,
        language: 'ts',
      },
      {
        id: 'options',
        title: 'Resolver 配置',
        bullets: [
          'importStyle 默认为 true，控制 ga-ui-plus/style.css。',
          'elementPlusStyle 默认为 true，控制 GA 组件内部需要的 Element Plus 按需样式。',
          '显式 JavaScript 导入不会触发 Resolver，需要手动引入样式。',
        ],
      },
    ],
  },
  development: {
    slug: 'development',
    title: '本地开发',
    description: '在 pnpm workspace 中开发、预览和验证组件文档。',
    sections: [
      {
        id: 'install',
        title: '安装依赖',
        code: 'pnpm install',
        language: 'bash',
      },
      {
        id: 'docs',
        title: '启动文档项目',
        paragraphs: ['文档项目默认使用 5557 端口。'],
        code: 'pnpm docs:dev',
        language: 'bash',
      },
      {
        id: 'playground',
        title: '启动 Playground',
        code: 'pnpm --filter playground dev',
        language: 'bash',
      },
      {
        id: 'verify',
        title: '常用验证',
        code: 'pnpm docs:test\npnpm docs:build\npnpm --filter ga-ui-plus test\npnpm --filter ga-ui-plus build',
        language: 'bash',
      },
      {
        id: 'new-component',
        title: '新增组件文档',
        bullets: [
          '在 docs/src/demos/<component> 创建独立案例。',
          '在 docs/src/content/components 创建组件文档定义。',
          '在 catalog.ts 注册组件，路由、导航和搜索会自动生成。',
          '运行 API 生成、文档测试和生产构建。',
        ],
      },
    ],
  },
}
