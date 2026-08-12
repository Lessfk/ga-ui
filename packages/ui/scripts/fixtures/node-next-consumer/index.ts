import {
  GaAsideMenu,
  GaDialog,
  GaPagination,
  GaTable,
  GaTablePagination,
  type GaAsideMenuEmits,
  type GaAsideMenuExpose,
  type GaAsideMenuNode,
  type GaAsideMenuProps,
  type GaAsideMenuStateSlotProps,
  type GaAsideMenuTriggerSlotProps,
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
// @ts-expect-error GaAsideMenu public types are not exported from the base entry
import type { GaAsideMenuProps as BaseAsideMenuProps } from 'ga-ui-plus/base'
// @ts-expect-error GaDialog public types are not exported from the business entry
import type { GaDialogProps as BusinessDialogProps } from 'ga-ui-plus/business'
import {
  GaAsideMenu as BusinessAsideMenu,
  type GaAsideMenuEmits as BusinessAsideMenuEmits,
  type GaAsideMenuNode as BusinessAsideMenuNode,
  type GaAsideMenuProps as BusinessAsideMenuProps,
  type GaAsideMenuStateSlotProps as BusinessAsideMenuStateSlotProps,
  type GaAsideMenuTriggerSlotProps as BusinessAsideMenuTriggerSlotProps,
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
  showFullscreen: true,
}
const baseDialogProps: BaseDialogProps = {
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showFullscreen: false,
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
  emit('update:fullscreen', true)
  emit('open')
  emit('opened')
  emit('close')
  emit('closed')
  emit('open-auto-focus')
  emit('close-auto-focus')
}

function checkBaseDialogEmits(emit: BaseDialogEmits) {
  emit('update:modelValue', false)
  emit('update:fullscreen', true)
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

const rootAsideMenuNodes: GaAsideMenuNode[] = [
  {
    type: 'submenu',
    index: 'system',
    label: 'System',
    children: [
      { type: 'item', index: 'users', label: 'Users' },
      { type: 'item', index: 'roles', label: 'Roles', disabled: true },
    ],
  },
]

const rootAsideMenuProps: GaAsideMenuProps = {
  collapse: false,
  active: 'users',
  items: rootAsideMenuNodes,
  width: '260px',
  defaultActive: 'system',
  uniqueOpened: true,
}
const businessAsideMenuProps: BusinessAsideMenuProps = {
  collapse: true,
  active: 'roles',
  items: rootAsideMenuNodes,
}

const rootAsideMenuStateSlot: GaAsideMenuStateSlotProps = {
  collapse: false,
  active: 'users',
}
const rootAsideMenuTriggerSlot: GaAsideMenuTriggerSlotProps = {
  ...rootAsideMenuStateSlot,
  toggle: () => undefined,
}
const businessAsideMenuNode: BusinessAsideMenuNode = {
  type: 'item',
  index: 'business',
  label: 'Business',
}
const businessAsideMenuStateSlot: BusinessAsideMenuStateSlotProps = {
  collapse: true,
  active: 'business',
}
const businessAsideMenuTriggerSlot: BusinessAsideMenuTriggerSlotProps = {
  ...businessAsideMenuStateSlot,
  toggle: () => undefined,
}

function checkRootAsideMenuEmits(emit: GaAsideMenuEmits) {
  emit('update:collapse', true)
  emit('update:active', 'users')
  emit('toggle', false)
  emit('select', 'users', ['system', 'users'], {
    index: 'users',
    indexPath: ['system', 'users'],
  })
  emit('open', 'system', ['system'])
  emit('close', 'system', ['system'])
}

function checkBusinessAsideMenuEmits(emit: BusinessAsideMenuEmits) {
  emit('update:collapse', false)
  emit('update:active', 'business')
  emit('toggle', true)
}

function checkRootAsideMenuExpose(expose: GaAsideMenuExpose) {
  expose.menuRef?.open('1')
  expose.menuRef?.close('1')
  expose.menuRef?.handleResize()
  expose.menuRef?.updateActiveIndex('1-1')
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
  rootProps,
  businessProps,
  rootDialogProps,
  baseDialogProps,
  rootDialogHeaderScope,
  baseDialogHeaderScope,
  rootAsideMenuNodes,
  rootAsideMenuProps,
  businessAsideMenuProps,
  rootAsideMenuStateSlot,
  rootAsideMenuTriggerSlot,
  businessAsideMenuNode,
  businessAsideMenuStateSlot,
  businessAsideMenuTriggerSlot,
  checkRootDialogEmits,
  checkBaseDialogEmits,
  checkRootDialogExpose,
  checkBaseDialogExpose,
  checkRootAsideMenuEmits,
  checkBusinessAsideMenuEmits,
  checkRootAsideMenuExpose,
  businessDialogTypeContract,
  baseAsideMenuTypeContract,
]
