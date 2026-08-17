import type { ComponentSize } from 'element-plus'

export interface GaPaginationTheme {
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
  buttonBackgroundColor?: string
  activeColor?: string
  activeBackgroundColor?: string
  hoverColor?: string
  hoverBackgroundColor?: string
  disabledColor?: string
  disabledBackgroundColor?: string
}

export interface GaPaginationProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  size?: ComponentSize
  layout?: string
  background?: boolean
  position?: 'left' | 'center' | 'right'
  theme?: GaPaginationTheme
}
