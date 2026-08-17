import type { ComponentSize } from 'element-plus'

import type {
  GaTableColumn,
  GaTableRow,
} from '../types'

export type GaTableRowKey<Row extends GaTableRow> =
  | string
  | ((row: Row) => string)

export interface GaTableTheme {
  backgroundColor?: string
  rowBackgroundColor?: string
  textColor?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  borderColor?: string
  stripeBackgroundColor?: string
  hoverBackgroundColor?: string
  currentRowBackgroundColor?: string
  expandedRowBackgroundColor?: string
}

export interface GaTableProps<Row extends GaTableRow = GaTableRow> {
  data?: Row[]
  columns?: GaTableColumn<Row>[]
  height?: string | number
  maxHeight?: string | number
  rowKey?: GaTableRowKey<Row>
  border?: boolean
  stripe?: boolean
  size?: ComponentSize
  fit?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  emptyText?: string
  loading?: boolean
  loadingText?: string
  theme?: GaTableTheme
}
