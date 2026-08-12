import type {
  MenuInstance,
  MenuItemClicked,
  MenuPropsPublic,
} from 'element-plus'
import type { Component } from 'vue'

export type GaAsideMenuNode =
  | GaAsideMenuItem
  | GaAsideSubMenu
  | GaAsideMenuGroup

export interface GaAsideMenuItem {
  type: 'item'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
}

export interface GaAsideSubMenu {
  type: 'submenu'
  index: string
  label: string
  icon?: Component
  disabled?: boolean
  hidden?: boolean
  children: GaAsideMenuNode[]
}

export interface GaAsideMenuGroup {
  type: 'group'
  label: string
  hidden?: boolean
  children: Array<GaAsideMenuItem | GaAsideSubMenu>
}

export type GaAsideMenuProps = Omit<MenuPropsPublic, 'mode' | 'collapse'> & {
  collapse?: boolean
  width?: string
  items?: readonly GaAsideMenuNode[]
  active?: string
}

export interface GaAsideMenuEmits {
  (event: 'update:collapse', collapse: boolean): void
  (event: 'update:active', active: string): void
  (event: 'toggle', collapse: boolean): void
  (
    event: 'select',
    index: string,
    indexPath: string[],
    item: MenuItemClicked,
    routerResult?: Promise<unknown>,
  ): void
  (event: 'open', index: string, indexPath: string[]): void
  (event: 'close', index: string, indexPath: string[]): void
}

export interface GaAsideMenuStateSlotProps {
  collapse: boolean
  active: string
}

export interface GaAsideMenuTriggerSlotProps
  extends GaAsideMenuStateSlotProps {
  toggle: () => void
}

export interface GaAsideMenuExpose {
  menuRef: MenuInstance | undefined
  toggle: () => void
}
