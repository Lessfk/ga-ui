import {
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaDialogEmits,
  type GaDialogExpose,
  type GaDialogProps,
  type GaTableColumn,
  type GaTablePaginationProps,
} from 'ga-ui-plus'
import {
  GaDialog as BaseDialog,
  GaPagination as BasePagination,
  GaTable as BaseTable,
  type GaDialogEmits as BaseDialogEmits,
  type GaDialogExpose as BaseDialogExpose,
  type GaDialogProps as BaseDialogProps,
  type GaTableColumn as BaseTableColumn,
} from 'ga-ui-plus/base'
import {
  GaTablePagination as BusinessTablePagination,
  type GaTablePaginationProps as BusinessTablePaginationProps,
} from 'ga-ui-plus/business'

type Row = {
  id: number
}

const rootColumn: GaTableColumn<Row> = { prop: 'id' }
const baseColumn: BaseTableColumn<Row> = { prop: 'id' }
const rootProps: GaTablePaginationProps<Row> = { data: [] }
const businessProps: BusinessTablePaginationProps<Row> = { data: [] }
const rootDialogProps: GaDialogProps = {
  modelValue: false,
  title: 'NodeNext Dialog',
  width: 480,
}
const baseDialogProps: BaseDialogProps = {
  closeOnClickModal: true,
  closeOnPressEscape: true,
}

type RootDialogTypeContract = [GaDialogEmits, GaDialogExpose]
type BaseDialogTypeContract = [BaseDialogEmits, BaseDialogExpose]

const rootDialogTypeContract: RootDialogTypeContract | undefined = undefined
const baseDialogTypeContract: BaseDialogTypeContract | undefined = undefined

void [
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  BaseDialog,
  BasePagination,
  BaseTable,
  BusinessTablePagination,
  rootColumn,
  baseColumn,
  rootProps,
  businessProps,
  rootDialogProps,
  baseDialogProps,
  rootDialogTypeContract,
  baseDialogTypeContract,
]
