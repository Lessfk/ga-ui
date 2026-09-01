import { describe, expect, it } from 'vitest'

import { GaDialog as DialogBarrel } from '../base/components/dialog'
import { GaMegaMenu as MegaMenuBarrel } from '../base/components/megaMenu'
import { GaPagination as PaginationBarrel } from '../base/components/pagination'
import { GaTable as TableBarrel } from '../base/components/table'
import { GaAsideMenu as AsideMenuBarrel } from '../business/components/asideMenu'
import { GaSearchBar as SearchBarBarrel } from '../business/components/searchBar'
import { GaTablePagination as TablePaginationBarrel } from '../business/components/tablePagination'
import type {
  GaDialogEmits,
  GaDialogExpose,
  GaDialogHeaderSlotProps,
  GaDialogProps,
  GaMegaMenuEmits,
  GaMegaMenuExpose,
  GaMegaMenuMenuItemSlotProps,
  GaMegaMenuPanelItemSlotProps,
  GaMegaMenuProps,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
  GaPaginationProps,
  GaPaginationTheme,
  GaTableColumn,
  GaTableProps,
  GaTableTheme,
} from '../base'
// @ts-expect-error GaDialog public types are not exported from the business entry
import type { GaDialogProps as BusinessGaDialogProps } from '../business'
// @ts-expect-error GaSearchBar public types are not exported from the base entry
import type { GaSearchBarProps as BaseSearchBarProps } from '../base'
import type {
  GaAsideMenuEmits,
  GaAsideMenuExpose,
  GaAsideMenuProps,
  GaAsideMenuSlotProps,
  GaAsideMenuTheme,
  GaAsideMenuToggleSlotProps,
  GaSearchBarEmits,
  GaSearchBarExpose,
  GaSearchBarProps,
  GaSearchBaseField,
  GaSearchChangePayload,
  GaSearchCustomField,
  GaSearchDateField,
  GaSearchField,
  GaSearchInputField,
  GaSearchLabelMode,
  GaSearchModel,
  GaSearchOption,
  GaSearchSelectField,
  GaTablePaginationProps,
} from '../business'
import type {
  GaAsideMenuEmits as RootGaAsideMenuEmits,
  GaAsideMenuExpose as RootGaAsideMenuExpose,
  GaAsideMenuProps as RootGaAsideMenuProps,
  GaAsideMenuSlotProps as RootGaAsideMenuSlotProps,
  GaAsideMenuTheme as RootGaAsideMenuTheme,
  GaAsideMenuToggleSlotProps as RootGaAsideMenuToggleSlotProps,
  GaDialogEmits as RootGaDialogEmits,
  GaDialogExpose as RootGaDialogExpose,
  GaDialogHeaderSlotProps as RootGaDialogHeaderSlotProps,
  GaDialogProps as RootGaDialogProps,
  GaMegaMenuEmits as RootGaMegaMenuEmits,
  GaMegaMenuExpose as RootGaMegaMenuExpose,
  GaMegaMenuMenuItemSlotProps as RootGaMegaMenuMenuItemSlotProps,
  GaMegaMenuPanelItemSlotProps as RootGaMegaMenuPanelItemSlotProps,
  GaMegaMenuProps as RootGaMegaMenuProps,
  GaMegaMenuTheme as RootGaMegaMenuTheme,
  GaMegaMenuTrigger as RootGaMegaMenuTrigger,
  GaPaginationProps as RootGaPaginationProps,
  GaPaginationTheme as RootGaPaginationTheme,
  GaSearchBarEmits as RootGaSearchBarEmits,
  GaSearchBarExpose as RootGaSearchBarExpose,
  GaSearchBarProps as RootGaSearchBarProps,
  GaSearchBaseField as RootGaSearchBaseField,
  GaSearchChangePayload as RootGaSearchChangePayload,
  GaSearchCustomField as RootGaSearchCustomField,
  GaSearchDateField as RootGaSearchDateField,
  GaSearchField as RootGaSearchField,
  GaSearchInputField as RootGaSearchInputField,
  GaSearchLabelMode as RootGaSearchLabelMode,
  GaSearchModel as RootGaSearchModel,
  GaSearchOption as RootGaSearchOption,
  GaSearchSelectField as RootGaSearchSelectField,
  GaTableColumn as RootGaTableColumn,
  GaTablePaginationProps as RootGaTablePaginationProps,
  GaTableProps as RootGaTableProps,
  GaTableTheme as RootGaTableTheme,
} from '../index'

type BaseTypeContract = [
  GaDialogProps,
  GaDialogEmits,
  GaDialogExpose,
  GaDialogHeaderSlotProps,
  GaMegaMenuProps,
  GaMegaMenuTheme,
  GaMegaMenuTrigger,
  GaMegaMenuEmits,
  GaMegaMenuExpose,
  GaMegaMenuMenuItemSlotProps,
  GaMegaMenuPanelItemSlotProps,
  GaTableProps,
  GaTableColumn,
  GaTableTheme,
  GaPaginationProps,
  GaPaginationTheme,
]

type RootTypeContract = [
  RootGaDialogProps,
  RootGaDialogEmits,
  RootGaDialogExpose,
  RootGaDialogHeaderSlotProps,
  RootGaMegaMenuProps,
  RootGaMegaMenuTheme,
  RootGaMegaMenuTrigger,
  RootGaMegaMenuEmits,
  RootGaMegaMenuExpose,
  RootGaMegaMenuMenuItemSlotProps,
  RootGaMegaMenuPanelItemSlotProps,
  RootGaTableProps,
  RootGaTableColumn,
  RootGaTableTheme,
  RootGaPaginationProps,
  RootGaPaginationTheme,
  RootGaTablePaginationProps,
  RootGaAsideMenuProps,
  RootGaAsideMenuEmits,
  RootGaAsideMenuExpose,
  RootGaAsideMenuSlotProps,
  RootGaAsideMenuTheme,
  RootGaAsideMenuToggleSlotProps,
  RootGaSearchBarProps,
  RootGaSearchBarEmits,
  RootGaSearchBarExpose,
  RootGaSearchBaseField,
  RootGaSearchChangePayload,
  RootGaSearchCustomField,
  RootGaSearchDateField,
  RootGaSearchField,
  RootGaSearchInputField,
  RootGaSearchLabelMode,
  RootGaSearchModel,
  RootGaSearchOption,
  RootGaSearchSelectField,
]

type BusinessSearchTypeContract = [
  GaSearchBaseField,
  GaSearchChangePayload,
  GaSearchCustomField,
  GaSearchDateField,
  GaSearchInputField,
  GaSearchLabelMode,
  GaSearchOption,
  GaSearchSelectField,
]

type BusinessDialogTypeContract = BusinessGaDialogProps
type BaseSearchBarTypeContract = BaseSearchBarProps

const baseTypeContract: BaseTypeContract | undefined = undefined
const rootTypeContract: RootTypeContract | undefined = undefined
const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
  undefined
const businessSearchTypeContract: BusinessSearchTypeContract | undefined =
  undefined
const baseSearchBarTypeContract: BaseSearchBarTypeContract | undefined =
  undefined

const tablePaginationProps: GaTablePaginationProps<{ id: number }> = {
  data: [{ id: 1 }],
  columns: [{ prop: 'id' }],
  currentPage: 1,
  pageSize: 10,
  total: 1,
  tableTheme: {
    headerBackgroundColor: '#f6f6f6',
  },
  paginationTheme: {
    activeBackgroundColor: '#409eff',
  },
}

const legacyTablePaginationProps: GaTablePaginationProps<{ id: number }> = {
  // @ts-expect-error GaTablePagination no longer accepts the legacy theme prop
  theme: {
    activeBackgroundColor: '#409eff',
  },
}

const paginationTheme: GaPaginationTheme = {
  backgroundColor: '#f8fafc',
  activeColor: '#ffffff',
  activeBackgroundColor: '#409eff',
}

const tableTheme: GaTableTheme = {
  backgroundColor: '#ffffff',
  headerBackgroundColor: '#f6f6f6',
  currentRowBackgroundColor: '#ecf5ff',
}

const megaMenuTheme: GaMegaMenuTheme = {
  menuBackgroundColor: '#2f436b',
  menuItemActiveBackgroundColor: '#315c96',
  menuItemBorderRadius: 14,
  panelBackgroundColor: '#f8fafc',
  panelItemTextColor: '#1e293b',
  panelItemBackgroundColor: '#ffffff',
}

const removedMegaMenuTheme: GaMegaMenuTheme = {
  // @ts-expect-error shared backgroundColor was removed by the split theme API
  backgroundColor: '#2f436b',
}

const megaMenuTrigger: GaMegaMenuTrigger = 'hover'

const megaMenuProps: GaMegaMenuProps = {
  menus: [
    { key: 'home', label: '工作台' },
    {
      key: 'system',
      label: '系统管理',
      groups: [
        {
          key: 'settings',
          title: '设置',
          items: [{ key: 'users', label: '用户管理' }],
        },
      ],
    },
  ],
  trigger: megaMenuTrigger,
  theme: megaMenuTheme,
}

function checkMegaMenuEmits(emit: GaMegaMenuEmits) {
  const menu = megaMenuProps.menus![0]
  emit('update:activeKey', 'home')
  emit('update:openKey', 'system')
  emit('select', {
    key: 'home',
    source: 'menu',
    menu,
    nativeEvent: {} as MouseEvent,
  })
  emit('open', 'system', megaMenuProps.menus![1])
  emit('close', 'system', megaMenuProps.menus![1])
}

function checkMegaMenuExpose(expose: GaMegaMenuExpose) {
  expose.open('system')
  expose.close()
  expose.toggle('system')
}

const asideMenuProps: GaAsideMenuProps = {
  collapse: false,
  width: '260px',
  collapseWidth: '68px',
  defaultActive: '1-1',
  defaultOpeneds: ['1'],
  uniqueOpened: true,
  theme: {
    backgroundColor: '#101828',
    activeBackgroundColor: '#155eef',
  },
}

const asideMenuTheme: GaAsideMenuTheme = {
  textColor: '#d0d5dd',
  activeTextColor: '#ffffff',
}

const asideMenuSlot: GaAsideMenuSlotProps = {
  collapse: false,
}

const asideMenuToggleSlot: GaAsideMenuToggleSlotProps = {
  ...asideMenuSlot,
  toggle: () => undefined,
}

const searchFields: GaSearchField[] = [
  { key: 'keyword', type: 'input', label: '关键词' },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    options: [{ label: '启用', value: 1 }],
  },
  {
    key: 'createdAt',
    type: 'daterange',
    label: '创建日期',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
  },
]
const searchModel: GaSearchModel = {
  keyword: '',
  status: undefined,
}
const searchBarProps: GaSearchBarProps = {
  modelValue: searchModel,
  fields: searchFields,
}

function checkSearchBarEmits(emit: GaSearchBarEmits) {
  emit('update:modelValue', { keyword: 'alice' })
  emit('update:collapsed', false)
  emit('search', { keyword: 'alice' })
  emit('reset', { keyword: '' })
  emit('change', {
    key: 'keyword',
    value: 'alice',
    model: { keyword: 'alice' },
    field: searchFields[0],
  })
  emit('invalid', { keyword: [{ message: '必填' }] })
}

function checkSearchBarExpose(expose: GaSearchBarExpose) {
  void expose.search()
  expose.reset()
  void expose.validate()
  expose.clearValidate()
  expose.toggle()
}

function checkAsideMenuEmits(emit: GaAsideMenuEmits) {
  emit('update:collapse', true)
  emit('toggle', false)
  emit('select', '1-1', ['1', '1-1'], {
    index: '1-1',
    indexPath: ['1', '1-1'],
  })
  emit('open', '1', ['1'])
  emit('close', '1', ['1'])
}

function checkAsideMenuExpose(expose: GaAsideMenuExpose) {
  expose.menuRef?.open('1')
  expose.menuRef?.close('1')
  expose.menuRef?.updateActiveIndex('1-1')
  expose.toggle()
}

void baseTypeContract
void rootTypeContract
void businessDialogTypeContract
void businessSearchTypeContract
void baseSearchBarTypeContract
void tablePaginationProps
void legacyTablePaginationProps
void paginationTheme
void tableTheme
void megaMenuTheme
void removedMegaMenuTheme
void megaMenuTrigger
void megaMenuProps
void checkMegaMenuEmits
void checkMegaMenuExpose
void asideMenuProps
void asideMenuTheme
void asideMenuSlot
void asideMenuToggleSlot
void checkAsideMenuEmits
void checkAsideMenuExpose
void searchFields
void searchModel
void searchBarProps
void checkSearchBarEmits
void checkSearchBarExpose

describe('library exports', () => {
  it('exports GaMegaMenu from its component barrel, base entry, and root entry', async () => {
    const [barrel, base, root] = await Promise.all([
      import('../base/components/megaMenu'),
      import('../base'),
      import('../index'),
    ])

    expect(barrel).toHaveProperty('GaMegaMenu')
    expect(base.GaMegaMenu).toBe(barrel.GaMegaMenu)
    expect(root.GaMegaMenu).toBe(barrel.GaMegaMenu)
  })

  it('exports only base components from the base entry', async () => {
    const base = await import('../base')

    expect(base.GaDialog).toBe(DialogBarrel)
    expect(base.GaMegaMenu).toBe(MegaMenuBarrel)
    expect(base.GaTable).toBe(TableBarrel)
    expect(base.GaPagination).toBe(PaginationBarrel)
    expect(base).not.toHaveProperty('GaTablePagination')
    expect(base).not.toHaveProperty('GaAsideMenu')
    expect(base).not.toHaveProperty('GaSearchBar')
  })

  it('exports only business components from the business entry', async () => {
    const business = await import('../business')

    expect(business.GaTablePagination).toBe(TablePaginationBarrel)
    expect(business.GaAsideMenu).toBe(AsideMenuBarrel)
    expect(business.GaSearchBar).toBe(SearchBarBarrel)
    expect(business).not.toHaveProperty('GaDialog')
    expect(business).not.toHaveProperty('GaTable')
    expect(business).not.toHaveProperty('GaPagination')
  })

  it('exports base and business components from the root entry', async () => {
    const library = await import('../index')

    expect(library.GaDialog).toBe(DialogBarrel)
    expect(library.GaMegaMenu).toBe(MegaMenuBarrel)
    expect(library.GaTable).toBe(TableBarrel)
    expect(library.GaPagination).toBe(PaginationBarrel)
    expect(library.GaTablePagination).toBe(TablePaginationBarrel)
    expect(library.GaAsideMenu).toBe(AsideMenuBarrel)
    expect(library.GaSearchBar).toBe(SearchBarBarrel)
  })
})
