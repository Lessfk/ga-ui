export interface NavItem {
  path: string
  title: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: '指南',
    items: [
      { path: '/guide/installation', title: '安装与样式引入' },
      { path: '/guide/quickstart', title: '快速上手' },
    ],
  },
  {
    title: '基础组件',
    items: [
      { path: '/components/dialog', title: 'Dialog 对话框' },
      { path: '/components/table', title: 'Table 表格' },
      { path: '/components/pagination', title: 'Pagination 分页' },
      { path: '/components/mega-menu', title: 'MegaMenu 大型菜单' },
    ],
  },
  {
    title: '业务组件',
    items: [
      { path: '/components/aside-menu', title: 'AsideMenu 侧边栏菜单' },
      { path: '/components/search-bar', title: 'SearchBar 搜索栏' },
      { path: '/components/table-pagination', title: 'TablePagination 表格分页' },
    ],
  },
]
