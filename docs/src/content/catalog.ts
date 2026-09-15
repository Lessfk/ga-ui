import type { ComponentCatalogItem } from './types'

export const componentCatalog: ComponentCatalogItem[] = [
  {
    name: 'GaDialog',
    slug: 'dialog',
    title: 'Dialog 对话框',
    category: 'base',
    description: '封装 Element Plus 对话框，提供全屏切换、关闭控制和实例访问。',
  },
  {
    name: 'GaMegaMenu',
    slug: 'mega-menu',
    title: 'MegaMenu 大型菜单',
    category: 'base',
    description: '用于桌面端一级导航和自适应多列大型菜单面板。',
  },
  {
    name: 'GaPagination',
    slug: 'pagination',
    title: 'Pagination 分页',
    category: 'base',
    description: '提供位置、禁用状态和独立主题配置的分页组件。',
  },
  {
    name: 'GaTable',
    slug: 'table',
    title: 'Table 表格',
    category: 'base',
    description: '使用列配置驱动 Element Plus 表格并支持完整表格主题。',
  },
  {
    name: 'GaAsideMenu',
    slug: 'aside-menu',
    title: 'AsideMenu 侧边菜单',
    category: 'business',
    description: '带头部、底部、滚动区域和折叠控制的业务侧边栏。',
  },
  {
    name: 'GaSearchBar',
    slug: 'search-bar',
    title: 'SearchBar 搜索栏',
    category: 'business',
    description: '使用字段配置组织查询表单、校验、折叠和操作按钮。',
  },
  {
    name: 'GaTablePagination',
    slug: 'table-pagination',
    title: 'TablePagination 表格分页',
    category: 'business',
    description: '组合 GaTable 和 GaPagination，并用 loading 统一管理交互状态。',
  },
]
