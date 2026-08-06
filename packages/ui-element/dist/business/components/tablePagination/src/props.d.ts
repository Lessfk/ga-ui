import { GaPaginationProps, GaTableProps, GaTableRow } from '../../../../base/index';
export type GaTablePaginationProps<Row extends GaTableRow = GaTableRow> = Omit<GaTableProps<Row>, 'height' | 'maxHeight'> & GaPaginationProps;
//# sourceMappingURL=props.d.ts.map