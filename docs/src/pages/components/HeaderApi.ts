export const headerPropsRows = [
  ['height', 'string | number', '64', '头部高度；数字按 px 处理'],
  ['padding', 'string', "'0 20px'", '头部左右区域的内边距，使用 CSS padding 语法'],
  ['gap', 'string | number', '16', '左侧、菜单、右侧三个区域之间的间距；数字按 px 处理'],
  ['backgroundColor', 'string', 'undefined', '头部背景；设置后优先于 theme.menuBackgroundColor，并同步到菜单导航'],
]

export const slotsRows = [
  ['left', '无', '头部左侧区域，适合放品牌标识'],
  ['right', '无', '头部右侧区域，适合放操作与用户信息'],
  ['menu-item', '{ menu, active, open }', '替换一级菜单按钮内容'],
  ['group-title', '{ menu, group }', '替换面板分组标题'],
  ['panel-item', '{ menu, group, item, active }', '替换二级菜单按钮内容'],
  ['empty', '{ menu }', '替换空面板内容'],
]

export const exposeRows = [
  ['megaMenuRef', 'GaMegaMenuExpose | undefined', '内部 GaMegaMenu 实例'],
  ['open', '(key: GaMegaMenuKey) => void', '展开指定一级菜单的面板'],
  ['close', '() => void', '关闭当前面板'],
  ['toggle', '(key: GaMegaMenuKey) => void', '切换指定一级菜单的面板'],
]
