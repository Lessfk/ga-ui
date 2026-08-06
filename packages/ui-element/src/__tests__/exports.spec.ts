import { GaPagination as PaginationBarrel } from '../components/pagination'
import { GaTable as TableBarrel } from '../components/table'
import {
  GaTablePagination as TablePaginationBarrel,
} from '../components/tablePagination'
import type {
  GaPaginationProps,
  GaTableColumn,
  GaTablePaginationProps,
  GaTableProps,
} from '../index'
import { describe, expect, it } from 'vitest'

type RootTypeContract = [
  GaTableProps,
  GaTableColumn,
  GaPaginationProps,
  GaTablePaginationProps,
]

const rootTypeContract: RootTypeContract | undefined = undefined

void rootTypeContract

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
  it('exports the table, pagination, and composite barrel components', async () => {
    const library = await import('../index')

    expect(library.GaTable).toBe(TableBarrel)
    expect(library.GaPagination).toBe(PaginationBarrel)
    expect(library.GaTablePagination).toBe(TablePaginationBarrel)
  })
})
