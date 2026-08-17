import { describe, expect, it } from 'vitest'

import { GaDialog as DialogBarrel } from '../base/components/dialog'
import { GaPagination as PaginationBarrel } from '../base/components/pagination'
import { GaTable as TableBarrel } from '../base/components/table'
import { GaAsideMenu as AsideMenuBarrel } from '../business/components/asideMenu'
import { GaTablePagination as TablePaginationBarrel } from '../business/components/tablePagination'
import type {
  GaDialogEmits,
  GaDialogExpose,
  GaDialogHeaderSlotProps,
  GaDialogProps,
  GaPaginationProps,
  GaPaginationTheme,
  GaTableColumn,
  GaTableProps,
  GaTableTheme,
} from '../base'
// @ts-expect-error GaDialog public types are not exported from the business entry
import type { GaDialogProps as BusinessGaDialogProps } from '../business'
import type {
  GaAsideMenuEmits,
  GaAsideMenuExpose,
  GaAsideMenuProps,
  GaAsideMenuSlotProps,
  GaAsideMenuTheme,
  GaAsideMenuToggleSlotProps,
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
  GaPaginationProps as RootGaPaginationProps,
  GaPaginationTheme as RootGaPaginationTheme,
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
]

type BusinessDialogTypeContract = BusinessGaDialogProps

const baseTypeContract: BaseTypeContract | undefined = undefined
const rootTypeContract: RootTypeContract | undefined = undefined
const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
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
void tablePaginationProps
void legacyTablePaginationProps
void paginationTheme
void tableTheme
void asideMenuProps
void asideMenuTheme
void asideMenuSlot
void asideMenuToggleSlot
void checkAsideMenuEmits
void checkAsideMenuExpose

describe('library exports', () => {
  it('exports only base components from the base entry', async () => {
    const base = await import('../base')

    expect(base.GaDialog).toBe(DialogBarrel)
    expect(base.GaTable).toBe(TableBarrel)
    expect(base.GaPagination).toBe(PaginationBarrel)
    expect(base).not.toHaveProperty('GaTablePagination')
    expect(base).not.toHaveProperty('GaAsideMenu')
  })

  it('exports only business components from the business entry', async () => {
    const business = await import('../business')

    expect(business.GaTablePagination).toBe(TablePaginationBarrel)
    expect(business.GaAsideMenu).toBe(AsideMenuBarrel)
    expect(business).not.toHaveProperty('GaDialog')
    expect(business).not.toHaveProperty('GaTable')
    expect(business).not.toHaveProperty('GaPagination')
  })

  it('exports base and business components from the root entry', async () => {
    const library = await import('../index')

    expect(library.GaDialog).toBe(DialogBarrel)
    expect(library.GaTable).toBe(TableBarrel)
    expect(library.GaPagination).toBe(PaginationBarrel)
    expect(library.GaTablePagination).toBe(TablePaginationBarrel)
    expect(library.GaAsideMenu).toBe(AsideMenuBarrel)
  })
})
