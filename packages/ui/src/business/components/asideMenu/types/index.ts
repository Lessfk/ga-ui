import type {
  MenuInstance,
  MenuItemClicked,
  MenuPropsPublic,
} from 'element-plus'

export type GaAsideMenuProps = Omit<
  MenuPropsPublic,
  'mode' | 'collapse'
> & {
  collapse?: boolean
  width?: string
  collapseWidth?: string
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

export interface GaAsideMenuSlotProps {
  collapse: boolean
}

export interface GaAsideMenuToggleSlotProps extends GaAsideMenuSlotProps {
  toggle: () => void
}

export interface GaAsideMenuExpose {
  menuRef: MenuInstance | undefined
  toggle: () => void
}
