import type {
  GaMegaMenuEmits,
  GaMegaMenuEmptySlotProps,
  GaMegaMenuExpose,
  GaMegaMenuGroupTitleSlotProps,
  GaMegaMenuKey,
  GaMegaMenuMenuItemSlotProps,
  GaMegaMenuPanelItemSlotProps,
  GaMegaMenuProps,
} from '../../../../base/index'

export interface GaHeaderProps extends GaMegaMenuProps {
  height?: string | number
  padding?: string
  gap?: string | number
  backgroundColor?: string
}

export type GaHeaderEmits = GaMegaMenuEmits

export interface GaHeaderSlots {
  left?: () => unknown
  right?: () => unknown
  'menu-item'?: (scope: GaMegaMenuMenuItemSlotProps) => unknown
  'group-title'?: (scope: GaMegaMenuGroupTitleSlotProps) => unknown
  'panel-item'?: (scope: GaMegaMenuPanelItemSlotProps) => unknown
  empty?: (scope: GaMegaMenuEmptySlotProps) => unknown
}

export interface GaHeaderExpose {
  megaMenuRef: GaMegaMenuExpose | undefined
  open: (key: GaMegaMenuKey) => void
  close: () => void
  toggle: (key: GaMegaMenuKey) => void
}
