import type { ComponentSize } from 'element-plus'

import type {
  GaTableColumn,
  GaTableRow,
} from '../types'

export type GaTableRowKey<Row extends GaTableRow> =
  | string
  | ((row: Row) => string)

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
}
