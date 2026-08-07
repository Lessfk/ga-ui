import {
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaDialogEmits,
  type GaDialogExpose,
  type GaDialogHeaderSlotProps,
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
  type GaDialogHeaderSlotProps as BaseDialogHeaderSlotProps,
  type GaDialogProps as BaseDialogProps,
  type GaTableColumn as BaseTableColumn,
} from 'ga-ui-plus/base'
// @ts-expect-error GaDialog public types are not exported from the business entry
import type { GaDialogProps as BusinessDialogProps } from 'ga-ui-plus/business'
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
const rootDialogHeaderScope: GaDialogHeaderSlotProps = {
  close: () => undefined,
  titleId: 'root-dialog-title',
  titleClass: 'root-dialog-title-class',
}
const baseDialogHeaderScope: BaseDialogHeaderSlotProps = {
  close: () => undefined,
  titleId: 'base-dialog-title',
  titleClass: 'base-dialog-title-class',
}

function checkRootDialogEmits(emit: GaDialogEmits) {
  emit('update:modelValue', false)
  emit('open')
  emit('opened')
  emit('close')
  emit('closed')
  emit('open-auto-focus')
  emit('close-auto-focus')
}

function checkBaseDialogEmits(emit: BaseDialogEmits) {
  emit('update:modelValue', false)
  emit('open')
  emit('opened')
  emit('close')
  emit('closed')
  emit('open-auto-focus')
  emit('close-auto-focus')
}

function checkRootDialogExpose(expose: GaDialogExpose) {
  expose.dialogRef?.handleClose()
  expose.dialogRef?.resetPosition()
}

function checkBaseDialogExpose(expose: BaseDialogExpose) {
  expose.dialogRef?.handleClose()
  expose.dialogRef?.resetPosition()
}

type BusinessDialogTypeContract = BusinessDialogProps

const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
  undefined

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
  rootDialogHeaderScope,
  baseDialogHeaderScope,
  checkRootDialogEmits,
  checkBaseDialogEmits,
  checkRootDialogExpose,
  checkBaseDialogExpose,
  businessDialogTypeContract,
]
