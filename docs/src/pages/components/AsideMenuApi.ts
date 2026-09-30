export const propsRows = [
  ['collapse', 'boolean', 'false', '是否折叠；支持 v-model:collapse'],
  ['width', 'string', "'240px'", '展开时的侧栏宽度'],
  ['collapseWidth', 'string', "'64px'", '折叠时的侧栏宽度'],
  ['theme', 'GaAsideMenuTheme', '内置深蓝主题', '侧栏与弹出子菜单的实例级配色，支持部分覆盖'],
  ['defaultActive', 'string', "''", '初始激活的菜单 index'],
  ['defaultOpeneds', 'string[]', '[]', '初始展开的子菜单 index 列表'],
  ['uniqueOpened', 'boolean', 'false', '是否只允许一个子菜单展开'],
  ['router', 'boolean', 'false', '启用 ElMenu 路由模式；应用须已安装 Vue Router'],
  ['menuTrigger', "'hover' | 'click'", "'hover'", '子菜单触发方式'],
  ['backgroundColor', 'string', 'undefined', '透传给 ElMenu 的背景色；主题配色优先使用 theme'],
  ['textColor', 'string', 'undefined', '透传给 ElMenu 的文字颜色'],
  ['activeTextColor', 'string', 'undefined', '透传给 ElMenu 的激活文字颜色'],
  ['collapseTransition', 'boolean', 'true', '是否启用菜单折叠动画'],
  ['ellipsis', 'boolean', 'true', 'Element Plus 的横向溢出省略设置；纵向菜单通常用不到'],
  ['popperOffset', 'number', '6', '折叠后子菜单弹层偏移量'],
  ['popperEffect', "'dark' | 'light'", "'dark'", '弹层效果'],
  ['popperClass', 'string', 'undefined', '弹层自定义类名；与组件类名合并'],
  ['popperStyle', 'string | CSSProperties', 'undefined', '弹层自定义样式；会合并主题变量'],
  ['showTimeout', 'number', '300', '子菜单显示延时，单位 ms'],
  ['hideTimeout', 'number', '300', '子菜单隐藏延时，单位 ms'],
  ['closeOnClickOutside', 'boolean', 'false', '点击外部是否关闭弹出的子菜单'],
  ['ellipsisIcon', 'string | Component', 'Element Plus 默认图标', 'Element Plus 的省略图标设置'],
  ['persistent', 'boolean', 'true', '关闭弹层时是否保留 DOM'],
]

export const eventsRows = [
  ['update:collapse', '(collapse: boolean)', '折叠状态更新；用于 v-model:collapse'],
  ['toggle', '(collapse: boolean)', '内置按钮或 toggle() 切换状态后触发'],
  ['select', '(index: string, indexPath: string[], item: MenuItemClicked, routerResult?: Promise<unknown>)', '选择菜单项；透传 Element Plus 参数'],
  ['open', '(index: string, indexPath: string[])', '子菜单展开'],
  ['close', '(index: string, indexPath: string[])', '子菜单收起'],
]

export const slotsRows = [
  ['default', '无', '原生菜单内容：ElMenuItem、ElSubMenu、ElMenuItemGroup'],
  ['header', '{ collapse: boolean }', '侧栏顶部区域；未提供时不渲染'],
  ['footer', '{ collapse: boolean }', '侧栏菜单与折叠按钮之间的底部区域'],
  ['collapse', '{ collapse: boolean, toggle: () => void }', '替换底部折叠按钮'],
]

export const exposeRows = [
  ['menuRef', 'MenuInstance | undefined', '内部 ElMenu 实例'],
  ['toggle', '() => void', '切换侧栏折叠状态'],
]

export const themeRows = [
  ['backgroundColor', '深蓝渐变', '侧栏、菜单及弹出子菜单背景'],
  ['textColor', '#d0d5dd', '普通菜单文字和图标颜色'],
  ['activeTextColor', '#ffffff', '激活菜单文字和图标颜色'],
  ['activeBackgroundColor', '蓝紫渐变', '激活菜单项背景'],
  ['hoverBackgroundColor', 'rgba(59, 130, 246, 0.16)', '菜单项悬停背景'],
  ['borderColor', '#344054', '头部、底部区域分隔线与弹层边框'],
]
