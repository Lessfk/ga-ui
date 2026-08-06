import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { GaPagination as PaginationBarrel } from '../components/pagination'
import { GaTable as TableBarrel } from '../components/table'
import type {
  GaPaginationProps,
  GaTableColumn,
  GaTableProps,
} from '../index'
import { describe, expect, it } from 'vitest'

type RootTypeContract = [GaTableProps, GaTableColumn, GaPaginationProps]

const rootTypeContract: RootTypeContract | undefined = undefined

void rootTypeContract

describe('library exports', () => {
  it('does not keep the legacy tablePagination source entry', () => {
    const legacyRelativePath = '../components/tablePagination'
    const legacyTablePagination = fileURLToPath(
      new URL(legacyRelativePath, import.meta.url),
    )

    expect(existsSync(legacyTablePagination)).toBe(false)
  })

  it('exports the table and pagination barrel components', async () => {
    const library = await import('../index')

    expect(library.GaTable).toBe(TableBarrel)
    expect(library.GaPagination).toBe(PaginationBarrel)
  })
})
