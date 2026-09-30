export const propsRows = [
  ['menus', 'GaMegaMenuNavItem[]', '[]', '一级菜单数据'],
  ['activeKey', 'GaMegaMenuKey', 'undefined', '激活项 key；支持 v-model:active-key'],
  ['openKey', 'GaMegaMenuKey', 'undefined', '展开面板的一级菜单 key；支持 v-model:open-key'],
  ['trigger', "'click' | 'hover'", "'click'", '打开面板的触发方式'],
  ['openDelay', 'number', '100', '悬停打开延时，单位 ms'],
  ['closeDelay', 'number', '180', '悬停关闭延时，单位 ms'],
  ['minColumnWidth', 'number', '240', '面板分组列最小宽度，单位 px'],
  ['maxColumnWidth', 'number', '420', '面板分组列最大宽度，单位 px'],
  ['maxHeight', 'string | number', "'auto'", '面板内容最大滚动高度'],
  ['panelWidth', "'menu' | string | number", "'menu'", '面板宽度；默认跟随整个一级菜单导航区域，数字按 px 处理，字符串支持 %、px、vw 等 CSS 单位'],
  ['closeOnSelect', 'boolean', 'true', '选择二级项后是否关闭面板'],
  ['theme', 'GaMegaMenuTheme', '{}', '实例级主题，支持部分覆盖'],
  ['ariaLabel', 'string', "'大型菜单导航'", '导航容器无障碍标签'],
]

export const navItemRows = [
  ['key', 'GaMegaMenuKey', '必填；一级菜单唯一标识'],
  ['label', 'string', '必填；一级菜单文案'],
  ['icon', 'GaMegaMenuIcon', '可选图标组件或图标配置'],
  ['disabled', 'boolean', '是否禁用'],
  ['groups', 'GaMegaMenuGroup[]', '存在时点击或悬停打开面板；空数组显示空状态'],
]

export const groupRows = [
  ['key', 'GaMegaMenuKey', '必填；分组唯一标识'],
  ['title', 'string', '可选分组标题'],
  ['items', 'GaMegaMenuItem[]', '必填；分组内菜单项'],
]

export const itemRows = [
  ['key', 'GaMegaMenuKey', '必填；菜单项唯一标识'],
  ['label', 'string', '必填；菜单项文案'],
  ['description', 'string', '可选描述；为空时采用单行标签布局'],
  ['icon', 'GaMegaMenuIcon', '可选图标组件或图标配置'],
  ['disabled', 'boolean', '是否禁用'],
]

export const eventsRows = [
  ['update:activeKey', '(key: GaMegaMenuKey)', '激活项变化；用于 v-model:active-key'],
  ['update:openKey', '(key: GaMegaMenuKey | undefined)', '面板展开状态变化；用于 v-model:open-key'],
  ['select', '(payload: GaMegaMenuSelectPayload)', '选择一级或二级项'],
  ['open', '(key: GaMegaMenuKey, menu: GaMegaMenuNavItem)', '面板展开'],
  ['close', '(key: GaMegaMenuKey, menu: GaMegaMenuNavItem)', '面板关闭'],
]

export const selectPayloadRows = [
  ['key', 'GaMegaMenuKey', '被选择项的 key'],
  ['source', "'menu' | 'panel'", '选择来源'],
  ['menu', 'GaMegaMenuNavItem', '所属一级菜单'],
  ['group', 'GaMegaMenuGroup | undefined', '二级项所属分组'],
  ['item', 'GaMegaMenuItem | undefined', '选中的二级项'],
  ['nativeEvent', 'MouseEvent', '原生点击事件'],
]

export const slotsRows = [
  ['menu-item', '{ menu, active, open }', '替换一级菜单按钮内容'],
  ['group-title', '{ menu, group }', '替换面板分组标题'],
  ['panel-item', '{ menu, group, item, active }', '替换二级菜单按钮内容'],
  ['empty', '{ menu }', '替换空面板内容'],
]

export const exposeRows = [
  ['open', '(key: GaMegaMenuKey) => void', '展开指定一级菜单的面板'],
  ['close', '() => void', '关闭当前面板'],
  ['toggle', '(key: GaMegaMenuKey) => void', '切换指定一级菜单的面板'],
]

export const themeSections: Array<{ title: string; rows: string[][] }> = [
  {
    title: '一级菜单容器',
    rows: [
      ['menuBackgroundColor', 'string', '#2f436b', '导航背景色'],
      ['menuGap', 'string | number', '8px', '一级菜单项间距'],
    ],
  },
  {
    title: '一级菜单项',
    rows: [
      ['menuItemTextColor', 'string', '#ffffff', '默认文字颜色'],
      ['menuItemBackgroundColor', 'string', '#3d527c', '默认背景色'],
      ['menuItemBorderColor', 'string', 'transparent', '默认边框颜色'],
      ['menuItemHoverTextColor', 'string', '#ffffff', '悬停文字颜色'],
      ['menuItemHoverBackgroundColor', 'string', '#465d89', '悬停背景色'],
      ['menuItemHoverBorderColor', 'string', 'rgb(255 255 255 / 12%)', '悬停边框颜色'],
      ['menuItemActiveTextColor', 'string', '#ffffff', '激活文字颜色'],
      ['menuItemActiveBackgroundColor', 'string', '#315c96', '激活背景色'],
      ['menuItemActiveBorderColor', 'string', '#4c78b1', '激活边框颜色'],
      ['menuItemDisabledTextColor', 'string', 'rgb(255 255 255 / 45%)', '禁用文字颜色'],
      ['menuItemDisabledBackgroundColor', 'string', 'rgb(255 255 255 / 8%)', '禁用背景色'],
      ['menuItemDisabledBorderColor', 'string', 'transparent', '禁用边框颜色'],
      ['menuItemFocusOutlineColor', 'string', '#8db7f0', '键盘聚焦轮廓颜色'],
      ['menuItemFontSize', 'string | number', '20px', '字体大小'],
      ['menuItemFontWeight', 'string | number', '700', '字重'],
      ['menuItemIconSize', 'string | number', '26px', '图标大小'],
      ['menuItemGap', 'string | number', '10px', '图标与文字间距'],
      ['menuItemHorizontalPadding', 'string | number', '24px', '水平内边距'],
      ['menuItemVerticalSpace', 'string | number', '32px', '相对导航容器预留的垂直空间'],
      ['menuItemBorderRadius', 'string | number', '14px', '圆角'],
      ['menuItemShadow', 'string', '0 1px 1px rgb(15 31 58 / 18%)', '默认阴影'],
      ['menuItemActiveShadow', 'string', 'inset 0 1px 0 rgb(255 255 255 / 6%), 0 1px 2px rgb(13 29 55 / 22%)', '激活阴影'],
    ],
  },
  {
    title: '二级面板容器',
    rows: [
      ['panelBackgroundColor', 'string', '#2f436b', '面板背景色'],
      ['panelBorderColor', 'string', '#415a86', '面板边框颜色'],
      ['panelTopBorderColor', 'string', 'rgb(255 255 255 / 8%)', '面板顶部边框颜色'],
      ['panelShadow', 'string', '0 18px 40px rgb(15 31 58 / 28%)', '面板阴影'],
      ['panelPadding', 'string | number', '24px', '面板内容内边距'],
      ['panelGap', 'string | number', '24px', '分组列间距'],
    ],
  },
  {
    title: '二级分组标题',
    rows: [
      ['panelGroupTitleColor', 'string', '#b7c4da', '标题颜色'],
      ['panelGroupTitleFontSize', 'string | number', '13px', '字体大小'],
      ['panelGroupTitleFontWeight', 'string | number', '600', '字重'],
      ['panelGroupTitleMarginBottom', 'string | number', '10px', '下外边距'],
      ['panelGroupTitleHorizontalPadding', 'string | number', '12px', '水平内边距'],
    ],
  },
  {
    title: '二级菜单项',
    rows: [
      ['panelItemTextColor', 'string', '#ffffff', '默认文字颜色'],
      ['panelItemBackgroundColor', 'string', '#3d527c', '默认背景色'],
      ['panelItemBorderColor', 'string', 'transparent', '默认边框颜色'],
      ['panelItemHoverTextColor', 'string', '#ffffff', '悬停文字颜色'],
      ['panelItemHoverBackgroundColor', 'string', '#465d89', '悬停背景色'],
      ['panelItemHoverBorderColor', 'string', 'rgb(255 255 255 / 12%)', '悬停边框颜色'],
      ['panelItemActiveTextColor', 'string', '#ffffff', '激活文字颜色'],
      ['panelItemActiveBackgroundColor', 'string', '#315c96', '激活背景色'],
      ['panelItemActiveBorderColor', 'string', '#4c78b1', '激活边框颜色'],
      ['panelItemDisabledTextColor', 'string', 'rgb(255 255 255 / 42%)', '禁用文字颜色'],
      ['panelItemDisabledBackgroundColor', 'string', 'rgb(255 255 255 / 6%)', '禁用背景色'],
      ['panelItemDisabledBorderColor', 'string', 'transparent', '禁用边框颜色'],
      ['panelItemFocusOutlineColor', 'string', '#8db7f0', '键盘聚焦轮廓颜色'],
      ['panelItemBorderRadius', 'string | number', '10px', '圆角'],
      ['panelItemMinHeight', 'string | number', '64px', '最小高度'],
      ['panelItemPadding', 'string | number', '12px', '内边距'],
      ['panelItemGap', 'string | number', '12px', '图标与内容间距'],
      ['panelItemListGap', 'string | number', '8px', '同组菜单项间距'],
      ['panelItemLabelFontSize', 'string | number', '14px', '标签字体大小'],
      ['panelItemLabelFontWeight', 'string | number', '700', '标签字重'],
      ['panelItemDescriptionColor', 'string', '#b7c4da', '描述文字颜色'],
      ['panelItemDescriptionFontSize', 'string | number', '12px', '描述字体大小'],
      ['panelItemDescriptionLineHeight', 'string | number', '18px', '描述行高'],
      ['panelItemIconColor', 'string', '#ffffff', '图标颜色'],
      ['panelItemIconSize', 'string | number', '20px', '图标大小'],
      ['panelItemIconBoxSize', 'string | number', '38px', '图标容器宽高'],
      ['panelItemIconBackgroundColor', 'string', 'rgb(255 255 255 / 8%)', '图标容器背景色'],
      ['panelItemIconBorderRadius', 'string | number', '8px', '图标容器圆角'],
    ],
  },
  {
    title: '空状态',
    rows: [
      ['panelEmptyTextColor', 'string', '#b7c4da', '空状态文字颜色'],
      ['panelEmptyPadding', 'string | number', '48px 24px', '空状态内边距'],
    ],
  },
]
