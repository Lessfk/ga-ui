import {
  GaAsideMenu,
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaAsideMenuEmits,
  type GaAsideMenuExpose,
  type GaAsideMenuProps,
  type GaAsideMenuSlotProps,
  type GaAsideMenuToggleSlotProps,
  type GaDialogProps,
  type GaTableColumn,
  type GaTablePaginationProps,
} from 'ga-ui-plus'
import {
  GaDialog as BaseDialog,
  GaPagination as BasePagination,
  GaTable as BaseTable,
  type GaDialogProps as BaseDialogProps,
  type GaTableColumn as BaseTableColumn,
} from 'ga-ui-plus/base'
// @ts-expect-error AsideMenu types are not exported from the base entry
import type { GaAsideMenuProps as BaseAsideMenuProps } from 'ga-ui-plus/base'
// @ts-expect-error Dialog types are not exported from the business entry
import type { GaDialogProps as BusinessDialogProps } from 'ga-ui-plus/business'
import {
  GaAsideMenu as BusinessAsideMenu,
  GaTablePagination as BusinessTablePagination,
  type GaAsideMenuEmits as BusinessAsideMenuEmits,
  type GaAsideMenuProps as BusinessAsideMenuProps,
  type GaAsideMenuSlotProps as BusinessAsideMenuSlotProps,
  type GaAsideMenuToggleSlotProps as BusinessAsideMenuToggleSlotProps,
  type GaTablePaginationProps as BusinessTablePaginationProps,
} from 'ga-ui-plus/business'

type Row = { id: number }

const rootColumn: GaTableColumn<Row> = { prop: 'id' }
const baseColumn: BaseTableColumn<Row> = { prop: 'id' }
const rootTablePaginationProps: GaTablePaginationProps<Row> = { data: [] }
const businessTablePaginationProps: BusinessTablePaginationProps<Row> = {
  data: [],
}
const rootDialogProps: GaDialogProps = { modelValue: false }
const baseDialogProps: BaseDialogProps = { showFullscreen: false }

const rootAsideMenuProps: GaAsideMenuProps = {
  collapse: false,
  width: '260px',
  collapseWidth: '68px',
  defaultActive: 'users',
  uniqueOpened: true,
}
const businessAsideMenuProps: BusinessAsideMenuProps = {
  collapse: true,
  collapseWidth: '72px',
}
const rootAsideMenuSlot: GaAsideMenuSlotProps = { collapse: false }
const rootAsideMenuToggleSlot: GaAsideMenuToggleSlotProps = {
  ...rootAsideMenuSlot,
  toggle: () => undefined,
}
const businessAsideMenuSlot: BusinessAsideMenuSlotProps = { collapse: true }
const businessAsideMenuToggleSlot: BusinessAsideMenuToggleSlotProps = {
  ...businessAsideMenuSlot,
  toggle: () => undefined,
}

function checkRootAsideMenuEmits(emit: GaAsideMenuEmits) {
  emit('update:collapse', true)
  emit('toggle', false)
  emit('open', 'system', ['system'])
}

function checkBusinessAsideMenuEmits(emit: BusinessAsideMenuEmits) {
  emit('update:collapse', false)
  emit('toggle', true)
}

function checkRootAsideMenuExpose(expose: GaAsideMenuExpose) {
  expose.menuRef?.open('system')
  expose.menuRef?.close('system')
  expose.menuRef?.updateActiveIndex('users')
  expose.toggle()
}

type BusinessDialogTypeContract = BusinessDialogProps
type BaseAsideMenuTypeContract = BaseAsideMenuProps

const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
  undefined
const baseAsideMenuTypeContract: BaseAsideMenuTypeContract | undefined =
  undefined

void [
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  GaAsideMenu,
  BaseDialog,
  BasePagination,
  BaseTable,
  BusinessTablePagination,
  BusinessAsideMenu,
  rootColumn,
  baseColumn,
  rootTablePaginationProps,
  businessTablePaginationProps,
  rootDialogProps,
  baseDialogProps,
  rootAsideMenuProps,
  businessAsideMenuProps,
  rootAsideMenuSlot,
  rootAsideMenuToggleSlot,
  businessAsideMenuSlot,
  businessAsideMenuToggleSlot,
  checkRootAsideMenuEmits,
  checkBusinessAsideMenuEmits,
  checkRootAsideMenuExpose,
  businessDialogTypeContract,
  baseAsideMenuTypeContract,
]
