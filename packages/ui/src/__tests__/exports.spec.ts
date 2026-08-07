import { describe, expect, it } from 'vitest'

import { GaDialog as DialogBarrel } from '../base/components/dialog'
import { GaPagination as PaginationBarrel } from '../base/components/pagination'
import { GaTable as TableBarrel } from '../base/components/table'
import {
  GaTablePagination as TablePaginationBarrel,
} from '../business/components/tablePagination'
import type {
  GaDialogEmits,
  GaDialogExpose,
  GaDialogHeaderSlotProps,
  GaDialogProps,
  GaPaginationProps,
  GaTableColumn,
  GaTableProps,
} from '../base'
// @ts-expect-error GaDialog public types are not exported from the business entry
import type { GaDialogProps as BusinessGaDialogProps } from '../business'
import type { GaTablePaginationProps } from '../business'
import type {
  GaDialogEmits as RootGaDialogEmits,
  GaDialogExpose as RootGaDialogExpose,
  GaDialogHeaderSlotProps as RootGaDialogHeaderSlotProps,
  GaDialogProps as RootGaDialogProps,
  GaPaginationProps as RootGaPaginationProps,
  GaTableColumn as RootGaTableColumn,
  GaTablePaginationProps as RootGaTablePaginationProps,
  GaTableProps as RootGaTableProps,
} from '../index'

type BaseTypeContract = [
  GaDialogProps,
  GaDialogEmits,
  GaDialogExpose,
  GaDialogHeaderSlotProps,
  GaTableProps,
  GaTableColumn,
  GaPaginationProps,
]

type RootTypeContract = [
  RootGaDialogProps,
  RootGaDialogEmits,
  RootGaDialogExpose,
  RootGaDialogHeaderSlotProps,
  RootGaTableProps,
  RootGaTableColumn,
  RootGaPaginationProps,
  RootGaTablePaginationProps,
]

type BusinessDialogTypeContract = BusinessGaDialogProps

const baseTypeContract: BaseTypeContract | undefined = undefined
const rootTypeContract: RootTypeContract | undefined = undefined
const businessDialogTypeContract: BusinessDialogTypeContract | undefined =
  undefined

void baseTypeContract
void rootTypeContract
void businessDialogTypeContract

const flatTablePaginationProps: GaTablePaginationProps<{ id: number }> = {
  data: [{ id: 1 }],
  columns: [{ prop: 'id' }],
  currentPage: 1,
  pageSize: 10,
  total: 1,
  size: 'default',
}

void flatTablePaginationProps

const legacyTableProps: GaTablePaginationProps = {
  // @ts-expect-error tableProps is not part of the flat public API
  tableProps: {},
}

const legacyPaginationProps: GaTablePaginationProps = {
  // @ts-expect-error paginationProps is not part of the flat public API
  paginationProps: {},
}

const legacyHeight: GaTablePaginationProps = {
  // @ts-expect-error height is intentionally omitted from the composite API
  height: 100,
}

const legacyMaxHeight: GaTablePaginationProps = {
  // @ts-expect-error maxHeight is intentionally omitted from the composite API
  maxHeight: 100,
}

void legacyTableProps
void legacyPaginationProps
void legacyHeight
void legacyMaxHeight

describe('library exports', () => {
  it('exports only base components from the base entry', async () => {
    const base = await import('../base')

    expect(base.GaDialog).toBe(DialogBarrel)
    expect(base.GaTable).toBe(TableBarrel)
    expect(base.GaPagination).toBe(PaginationBarrel)
    expect(base).not.toHaveProperty('GaTablePagination')
  })

  it('exports only business components from the business entry', async () => {
    const business = await import('../business')

    expect(business.GaTablePagination).toBe(TablePaginationBarrel)
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
  })
})
