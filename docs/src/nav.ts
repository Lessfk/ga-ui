export interface DocNavItem {
  path: string
  title: string
}

export interface DocNavGroup {
  key: string
  title: string
  items: DocNavItem[]
}

export const navGroups: DocNavGroup[] = [
  {
    key: 'guide',
    title: '指南',
    items: [{ path: '/guide/usage', title: '在项目中使用 ga-ui' }],
  },
  {
    key: 'base',
    title: '基础组件',
    items: [
      { path: '/components/dialog', title: 'Dialog 对话框' },
      { path: '/components/table', title: 'Table 表格' },
      { path: '/components/pagination', title: 'Pagination 分页' },
      { path: '/components/mega-menu', title: 'MegaMenu 大型菜单' },
    ],
  },
  {
    key: 'business',
    title: '业务组件',
    items: [
      { path: '/components/table-pagination', title: 'TablePagination 表格分页' },
      { path: '/components/search-bar', title: 'SearchBar 搜索栏' },
      { path: '/components/aside-menu', title: 'AsideMenu 侧边栏菜单' },
      { path: '/components/header', title: 'Header 头部导航' },
    ],
  },
]
