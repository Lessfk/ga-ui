import type { GaPaginationProps } from '../../pagination/src/props'
import type { GaTableProps } from '../../table/src/props'
import type { GaTableRow } from '../../table/types'

export type GaTablePaginationProps<
  Row extends GaTableRow = GaTableRow,
> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps
