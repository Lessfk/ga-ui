import type {
  MenuInstance,
  MenuItemClicked,
  MenuPropsPublic,
} from 'element-plus'

export type GaAsideMenuProps = Omit<MenuPropsPublic, 'mode' | 'collapse'> & {
  collapse?: boolean
  width?: string
}

export interface GaAsideMenuEmits {
  (event: 'update:collapse', collapse: boolean): void
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

export interface GaAsideMenuExpose {
  menuRef: MenuInstance | undefined
  toggle: () => void
}
