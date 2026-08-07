import { GaTableColumn, GaTableRow } from '../types/index.js';
export declare function getColumnKey<Row extends GaTableRow>(column: GaTableColumn<Row>, index: number): PropertyKey;
export declare function getColumnProps<Row extends GaTableRow>(column: GaTableColumn<Row>): Omit<GaTableColumn<Row>, 'key' | 'slot'>;
//# sourceMappingURL=column.d.ts.map