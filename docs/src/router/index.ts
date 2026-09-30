import { createRouter, createWebHashHistory } from 'vue-router'

import { navGroups } from '../nav'
import DocsLayout from '../layout/DocsLayout.vue'
import ComponentPlaceholderPage from '../pages/components/ComponentPlaceholderPage.vue'
import DialogPage from '../pages/components/DialogPage.vue'
import UsagePage from '../pages/guide/UsagePage.vue'

const componentRoutes = navGroups
  .filter((group) => group.key !== 'guide')
  .flatMap((group) =>
    group.items.filter((item) => !['/components/dialog', '/components/table', '/components/pagination', '/components/mega-menu', '/components/table-pagination', '/components/search-bar', '/components/aside-menu', '/components/header'].includes(item.path)).map((item) => ({
      path: item.path.slice(1),
      component: ComponentPlaceholderPage,
      props: { title: item.title, category: group.title },
      meta: { title: item.title },
    })),
  )

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: DocsLayout,
      children: [
        { path: '', redirect: '/guide/usage' },
        {
          path: 'guide/usage',
          component: UsagePage,
          meta: { title: '在项目中使用 ga-ui' },
        },
        {
          path: 'components/dialog',
          component: DialogPage,
          meta: { title: 'Dialog 对话框' },
        },
        {
          path: 'components/table',
          component: () => import('../pages/components/TablePage.vue'),
          meta: { title: 'Table 表格' },
        },
        {
          path: 'components/pagination',
          component: () => import('../pages/components/PaginationPage.vue'),
          meta: { title: 'Pagination 分页' },
        },
        {
          path: 'components/mega-menu',
          component: () => import('../pages/components/MegaMenuPage.vue'),
          meta: { title: 'MegaMenu 大型菜单' },
        },
        {
          path: 'components/table-pagination',
          component: () => import('../pages/components/TablePaginationPage.vue'),
          meta: { title: 'TablePagination 表格分页' },
        },
        {
          path: 'components/search-bar',
          component: () => import('../pages/components/SearchBarPage.vue'),
          meta: { title: 'SearchBar 搜索栏' },
        },
        {
          path: 'components/aside-menu',
          component: () => import('../pages/components/AsideMenuPage.vue'),
          meta: { title: 'AsideMenu 侧边栏菜单' },
        },
        {
          path: 'components/header',
          component: () => import('../pages/components/HeaderPage.vue'),
          meta: { title: 'Header 头部导航' },
        },
        ...componentRoutes,
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/guide/usage' },
  ],
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? '组件文档')} | ga-ui-plus`
})

export default router
