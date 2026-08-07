import {
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaTableColumn,
  type GaTablePaginationProps,
} from 'ga-ui'
import {
  GaPagination as BasePagination,
  GaTable as BaseTable,
  type GaTableColumn as BaseTableColumn,
} from 'ga-ui/base'
import {
  GaTablePagination as BusinessTablePagination,
  type GaTablePaginationProps as BusinessTablePaginationProps,
} from 'ga-ui/business'

type Row = {
  id: number
}

const rootColumn: GaTableColumn<Row> = { prop: 'id' }
const baseColumn: BaseTableColumn<Row> = { prop: 'id' }
const rootProps: GaTablePaginationProps<Row> = { data: [] }
const businessProps: BusinessTablePaginationProps<Row> = { data: [] }

void [
  GaPagination,
  GaTable,
  GaTablePagination,
  BasePagination,
  BaseTable,
  BusinessTablePagination,
  rootColumn,
  baseColumn,
  rootProps,
  businessProps,
]
