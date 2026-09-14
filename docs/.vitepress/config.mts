import { fileURLToPath, URL } from 'node:url'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vitepress'

import { GaUiResolver } from '../../packages/ui/src/resolver/index'

const resolveWorkspaceFile = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  srcDir: './site',
  lang: 'zh-CN',
  title: 'GA UI Plus',
  description: 'GA UI Plus 内部组件文档与案例',
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    siteTitle: 'GA UI Plus',
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/dialog' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '本地开发', link: '/guide/development' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '按需引入', link: '/guide/resolver' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'MegaMenu 大型菜单', link: '/components/mega-menu' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Table 表格', link: '/components/table' },
          ],
        },
        {
          text: '业务组件',
          items: [
            { text: 'AsideMenu 侧边菜单', link: '/components/aside-menu' },
            { text: 'SearchBar 搜索栏', link: '/components/search-bar' },
            {
              text: 'TablePagination 表格分页',
              link: '/components/table-pagination',
            },
          ],
        },
      ],
    },
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    darkModeSwitchLabel: '切换深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
  },
  vite: {
    plugins: [
      AutoImport({
        dts: false,
        resolvers: [ElementPlusResolver({ importStyle: false })],
      }),
      Components({
        dts: resolveWorkspaceFile('../components.d.ts'),
        resolvers: [
          ElementPlusResolver({ importStyle: false }),
          GaUiResolver({ importStyle: false, elementPlusStyle: false }),
        ],
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^ga-ui-plus\/base$/,
          replacement: resolveWorkspaceFile('../../packages/ui/src/base/index.ts'),
        },
        {
          find: /^ga-ui-plus\/business$/,
          replacement: resolveWorkspaceFile(
            '../../packages/ui/src/business/index.ts',
          ),
        },
        {
          find: /^ga-ui-plus$/,
          replacement: resolveWorkspaceFile('../../packages/ui/src/index.ts'),
        },
      ],
    },
  },
})
