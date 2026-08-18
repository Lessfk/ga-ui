import {
  GaAsideMenu,
  GaDialog,
  GaPagination,
  GaSearchBar,
  GaTable,
  GaTablePagination,
  type GaAsideMenuEmits,
  type GaAsideMenuExpose,
  type GaAsideMenuProps,
  type GaAsideMenuSlotProps,
  type GaAsideMenuTheme,
  type GaAsideMenuToggleSlotProps,
  type GaDialogProps,
  type GaSearchBarEmits,
  type GaSearchBarExpose,
  type GaSearchBarProps,
  type GaSearchBaseField,
  type GaSearchChangePayload,
  type GaSearchCustomField,
  type GaSearchDateField,
  type GaSearchField,
  type GaSearchInputField,
  type GaSearchLabelMode,
  type GaSearchModel,
  type GaSearchOption,
  type GaSearchSelectField,
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
// @ts-expect-error SearchBar types are not exported from the base entry
import type { GaSearchBarProps as BaseSearchBarProps } from 'ga-ui-plus/base'
// @ts-expect-error Dialog types are not exported from the business entry
import type { GaDialogProps as BusinessDialogProps } from 'ga-ui-plus/business'
import {
  GaAsideMenu as BusinessAsideMenu,
  GaSearchBar as BusinessSearchBar,
  GaTablePagination as BusinessTablePagination,
  type GaAsideMenuEmits as BusinessAsideMenuEmits,
  type GaAsideMenuProps as BusinessAsideMenuProps,
  type GaAsideMenuSlotProps as BusinessAsideMenuSlotProps,
  type GaAsideMenuTheme as BusinessAsideMenuTheme,
  type GaAsideMenuToggleSlotProps as BusinessAsideMenuToggleSlotProps,
  type GaSearchBarEmits as BusinessSearchBarEmits,
  type GaSearchBarExpose as BusinessSearchBarExpose,
  type GaSearchBarProps as BusinessSearchBarProps,
  type GaSearchBaseField as BusinessSearchBaseField,
  type GaSearchChangePayload as BusinessSearchChangePayload,
  type GaSearchCustomField as BusinessSearchCustomField,
  type GaSearchDateField as BusinessSearchDateField,
  type GaSearchField as BusinessSearchField,
  type GaSearchInputField as BusinessSearchInputField,
  type GaSearchLabelMode as BusinessSearchLabelMode,
  type GaSearchModel as BusinessSearchModel,
  type GaSearchOption as BusinessSearchOption,
  type GaSearchSelectField as BusinessSearchSelectField,
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

const rootSearchOption: GaSearchOption = { label: '启用', value: 1 }
const rootSearchInputField: GaSearchInputField = {
  key: 'keyword',
  type: 'input',
  label: '关键词',
}
const rootSearchSelectField: GaSearchSelectField = {
  key: 'status',
  type: 'select',
  label: '状态',
  options: [rootSearchOption],
}
const rootSearchDateField: GaSearchDateField = {
  key: 'createdAt',
  type: 'daterange',
  label: '创建日期',
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD',
}
const rootSearchCustomField: GaSearchCustomField = {
  key: 'departmentId',
  type: 'custom',
  label: '部门',
}
const rootSearchFields: GaSearchField[] = [
  rootSearchInputField,
  rootSearchSelectField,
  rootSearchDateField,
  rootSearchCustomField,
]
const rootSearchBaseField: GaSearchBaseField = rootSearchFields[0]
const rootSearchLabelMode: GaSearchLabelMode = 'placeholder'
const rootSearchModel: GaSearchModel = { keyword: '' }
const rootSearchBarProps: GaSearchBarProps = {
  modelValue: rootSearchModel,
  fields: rootSearchFields,
}
const businessSearchFields: BusinessSearchField[] = rootSearchFields
const businessSearchBaseField: BusinessSearchBaseField = rootSearchBaseField
const businessSearchOption: BusinessSearchOption = rootSearchOption
const businessSearchInputField: BusinessSearchInputField = rootSearchInputField
const businessSearchSelectField: BusinessSearchSelectField =
  rootSearchSelectField
const businessSearchDateField: BusinessSearchDateField = rootSearchDateField
const businessSearchCustomField: BusinessSearchCustomField =
  rootSearchCustomField
const businessSearchLabelMode: BusinessSearchLabelMode = rootSearchLabelMode
const businessSearchModel: BusinessSearchModel = rootSearchModel
const businessSearchBarProps: BusinessSearchBarProps = rootSearchBarProps
const rootSearchChangePayload: GaSearchChangePayload = {
  key: 'keyword',
  value: 'alice',
  model: { keyword: 'alice' },
  field: rootSearchInputField,
}
const businessSearchChangePayload: BusinessSearchChangePayload =
  rootSearchChangePayload

function checkSearchBarEmits(emit: GaSearchBarEmits) {
  emit('update:modelValue', { keyword: 'alice' })
  emit('update:collapsed', false)
  emit('search', { keyword: 'alice' })
  emit('reset', { keyword: '' })
  emit('change', rootSearchChangePayload)
  emit('invalid', { keyword: [{ message: '必填' }] })
}

function checkSearchBarExpose(expose: GaSearchBarExpose) {
  void expose.formRef?.validate()
  expose.formRef?.clearValidate()
  void expose.search()
  expose.reset()
  void expose.validate()
  expose.clearValidate()
  expose.toggle()
}

function checkBusinessSearchBarEmits(emit: BusinessSearchBarEmits) {
  emit('update:modelValue', { keyword: 'alice' })
  emit('update:collapsed', true)
  emit('search', businessSearchModel)
  emit('reset', {})
  emit('change', businessSearchChangePayload)
  emit('invalid', { keyword: [{ message: '必填' }] })
}

function checkBusinessSearchBarExpose(expose: BusinessSearchBarExpose) {
  void expose.formRef?.validate()
  expose.formRef?.clearValidate()
  void expose.search()
  expose.reset()
  void expose.validate()
  expose.clearValidate()
  expose.toggle()
}

const rootAsideMenuProps: GaAsideMenuProps = {
  collapse: false,
  width: '260px',
  collapseWidth: '68px',
  defaultActive: 'users',
  uniqueOpened: true,
  theme: {
    backgroundColor: '#101828',
    activeBackgroundColor: '#155eef',
  },
}
const businessAsideMenuProps: BusinessAsideMenuProps = {
  collapse: true,
  collapseWidth: '72px',
}
const rootAsideMenuSlot: GaAsideMenuSlotProps = { collapse: false }
const rootAsideMenuTheme: GaAsideMenuTheme = {
  textColor: '#d0d5dd',
  activeTextColor: '#ffffff',
}
const businessAsideMenuTheme: BusinessAsideMenuTheme = {
  hoverBackgroundColor: '#1d2939',
  borderColor: '#344054',
}
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
type BaseSearchBarTypeContract = BaseSearchBarProps

const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
  undefined
const baseAsideMenuTypeContract: BaseAsideMenuTypeContract | undefined =
  undefined
const baseSearchBarTypeContract: BaseSearchBarTypeContract | undefined =
  undefined

void [
  GaDialog,
  GaPagination,
  GaSearchBar,
  GaTable,
  GaTablePagination,
  GaAsideMenu,
  BaseDialog,
  BasePagination,
  BaseTable,
  BusinessTablePagination,
  BusinessAsideMenu,
  BusinessSearchBar,
  rootColumn,
  baseColumn,
  rootTablePaginationProps,
  businessTablePaginationProps,
  rootDialogProps,
  baseDialogProps,
  rootSearchFields,
  rootSearchBaseField,
  rootSearchOption,
  rootSearchInputField,
  rootSearchSelectField,
  rootSearchDateField,
  rootSearchCustomField,
  rootSearchLabelMode,
  rootSearchModel,
  rootSearchBarProps,
  rootSearchChangePayload,
  businessSearchFields,
  businessSearchBaseField,
  businessSearchOption,
  businessSearchInputField,
  businessSearchSelectField,
  businessSearchDateField,
  businessSearchCustomField,
  businessSearchLabelMode,
  businessSearchModel,
  businessSearchBarProps,
  businessSearchChangePayload,
  checkSearchBarEmits,
  checkSearchBarExpose,
  checkBusinessSearchBarEmits,
  checkBusinessSearchBarExpose,
  rootAsideMenuProps,
  businessAsideMenuProps,
  rootAsideMenuSlot,
  rootAsideMenuTheme,
  businessAsideMenuTheme,
  rootAsideMenuToggleSlot,
  businessAsideMenuSlot,
  businessAsideMenuToggleSlot,
  checkRootAsideMenuEmits,
  checkBusinessAsideMenuEmits,
  checkRootAsideMenuExpose,
  businessDialogTypeContract,
  baseAsideMenuTypeContract,
  baseSearchBarTypeContract,
]
