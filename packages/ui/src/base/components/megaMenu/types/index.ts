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
  backgroundColor?: string
  textColor?: string
  mutedTextColor?: string
  itemBackgroundColor?: string
  itemHoverTextColor?: string
  itemHoverBackgroundColor?: string
  itemActiveTextColor?: string
  itemActiveBackgroundColor?: string
  itemActiveBorderColor?: string
  panelBackgroundColor?: string
  panelBorderColor?: string
  panelShadow?: string
  groupTitleColor?: string
  descriptionColor?: string
  itemBorderRadius?: string | number
  panelItemBorderRadius?: string | number
  itemGap?: string | number
  itemHorizontalPadding?: string | number
  itemVerticalSpace?: string | number
  iconSize?: string | number
  menuFontSize?: string | number
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
