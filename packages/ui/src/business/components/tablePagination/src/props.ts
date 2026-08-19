import type {
  GaPaginationProps,
  GaPaginationTheme,
  GaTableProps,
  GaTableRow,
  GaTableTheme,
} from '../../../../base/index'

export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight' | 'theme'>
  & Omit<GaPaginationProps, 'theme' | 'disabled'>
  & {
    tableTheme?: GaTableTheme
    paginationTheme?: GaPaginationTheme
  }
