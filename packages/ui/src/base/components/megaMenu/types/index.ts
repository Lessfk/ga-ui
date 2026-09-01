import type { Component } from 'vue'

export type GaMegaMenuKey = string | number
export type GaMegaMenuTrigger = 'click' | 'hover'

export interface GaMegaMenuIconConfig {
  component: Component
  props?: Record<string, unknown>
}

export type GaMegaMenuIcon = Component | GaMegaMenuIconConfig

export interface GaMegaMenuItem {
  key: GaMegaMenuKey
  label: string
  description?: string
  icon?: GaMegaMenuIcon
  disabled?: boolean
}

export interface GaMegaMenuGroup {
  key: GaMegaMenuKey
  title?: string
  items: GaMegaMenuItem[]
}

export interface GaMegaMenuNavItem {
  key: GaMegaMenuKey
  label: string
  icon?: GaMegaMenuIcon
  disabled?: boolean
  groups?: GaMegaMenuGroup[]
}

export interface GaMegaMenuTheme {
  menuBackgroundColor?: string
  menuGap?: string | number
  menuItemTextColor?: string
  menuItemBackgroundColor?: string
  menuItemBorderColor?: string
  menuItemHoverTextColor?: string
  menuItemHoverBackgroundColor?: string
  menuItemHoverBorderColor?: string
  menuItemActiveTextColor?: string
  menuItemActiveBackgroundColor?: string
  menuItemActiveBorderColor?: string
  menuItemDisabledTextColor?: string
  menuItemDisabledBackgroundColor?: string
  menuItemDisabledBorderColor?: string
  menuItemFocusOutlineColor?: string
  menuItemFontSize?: string | number
  menuItemFontWeight?: string | number
  menuItemIconSize?: string | number
  menuItemGap?: string | number
  menuItemHorizontalPadding?: string | number
  menuItemVerticalSpace?: string | number
  menuItemBorderRadius?: string | number
  menuItemShadow?: string
  menuItemActiveShadow?: string
  panelBackgroundColor?: string
  panelBorderColor?: string
  panelTopBorderColor?: string
  panelShadow?: string
  panelPadding?: string | number
  panelGap?: string | number
  panelGroupTitleColor?: string
  panelGroupTitleFontSize?: string | number
  panelGroupTitleFontWeight?: string | number
  panelGroupTitleMarginBottom?: string | number
  panelGroupTitleHorizontalPadding?: string | number
  panelItemTextColor?: string
  panelItemBackgroundColor?: string
  panelItemBorderColor?: string
  panelItemHoverTextColor?: string
  panelItemHoverBackgroundColor?: string
  panelItemHoverBorderColor?: string
  panelItemActiveTextColor?: string
  panelItemActiveBackgroundColor?: string
  panelItemActiveBorderColor?: string
  panelItemDisabledTextColor?: string
  panelItemDisabledBackgroundColor?: string
  panelItemDisabledBorderColor?: string
  panelItemFocusOutlineColor?: string
  panelItemBorderRadius?: string | number
  panelItemMinHeight?: string | number
  panelItemPadding?: string | number
  panelItemGap?: string | number
  panelItemListGap?: string | number
  panelItemLabelFontSize?: string | number
  panelItemLabelFontWeight?: string | number
  panelItemDescriptionColor?: string
  panelItemDescriptionFontSize?: string | number
  panelItemDescriptionLineHeight?: string | number
  panelItemIconColor?: string
  panelItemIconSize?: string | number
  panelItemIconBoxSize?: string | number
  panelItemIconBackgroundColor?: string
  panelItemIconBorderRadius?: string | number
  panelEmptyTextColor?: string
  panelEmptyPadding?: string | number
}

export interface GaMegaMenuProps {
  menus?: GaMegaMenuNavItem[]
  activeKey?: GaMegaMenuKey
  openKey?: GaMegaMenuKey
  trigger?: GaMegaMenuTrigger
  openDelay?: number
  closeDelay?: number
  minColumnWidth?: number
  maxColumnWidth?: number
  maxHeight?: string | number
  closeOnSelect?: boolean
  theme?: GaMegaMenuTheme
  ariaLabel?: string
}

export interface GaMegaMenuSelectPayload {
  key: GaMegaMenuKey
  source: 'menu' | 'panel'
  menu: GaMegaMenuNavItem
  group?: GaMegaMenuGroup
  item?: GaMegaMenuItem
  nativeEvent: MouseEvent
}

export interface GaMegaMenuEmits {
  (event: 'update:activeKey', key: GaMegaMenuKey): void
  (event: 'update:openKey', key: GaMegaMenuKey | undefined): void
  (event: 'select', payload: GaMegaMenuSelectPayload): void
  (event: 'open', key: GaMegaMenuKey, menu: GaMegaMenuNavItem): void
  (event: 'close', key: GaMegaMenuKey, menu: GaMegaMenuNavItem): void
}

export interface GaMegaMenuMenuItemSlotProps {
  menu: GaMegaMenuNavItem
  active: boolean
  open: boolean
}

export interface GaMegaMenuGroupTitleSlotProps {
  menu: GaMegaMenuNavItem
  group: GaMegaMenuGroup
}

export interface GaMegaMenuPanelItemSlotProps {
  menu: GaMegaMenuNavItem
  group: GaMegaMenuGroup
  item: GaMegaMenuItem
  active: boolean
}

export interface GaMegaMenuEmptySlotProps {
  menu: GaMegaMenuNavItem
}

export interface GaMegaMenuExpose {
  open: (key: GaMegaMenuKey) => void
  close: () => void
  toggle: (key: GaMegaMenuKey) => void
}
