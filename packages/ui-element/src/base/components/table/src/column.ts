import type {
  GaTableColumn,
  GaTableRow,
} from '../types'

export function getColumnKey<Row extends GaTableRow>(
  column: GaTableColumn<Row>,
  index: number,
): PropertyKey {
  return column.key ?? column.prop ?? `${column.type ?? 'column'}-${index}`
}

export function getColumnProps<Row extends GaTableRow>(
  column: GaTableColumn<Row>,
): Omit<GaTableColumn<Row>, 'key' | 'slot'> {
  const { key: _key, slot: _slot, ...columnProps } = column

  return columnProps
}
