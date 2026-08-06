import { TableColumnCtx, TableInstance } from 'element-plus';
import { VNode } from 'vue';
export type GaTableRow = Record<string, any>;
export type GaTableColumnType = 'default' | 'selection' | 'index' | 'expand' | (string & {});
export type GaTableColumnAlign = 'left' | 'center' | 'right';
export type GaTableColumnFixed = boolean | 'left' | 'right';
export interface GaTableColumn<Row extends GaTableRow = GaTableRow> {
    key?: PropertyKey;
    slot?: string;
    type?: GaTableColumnType;
    label?: string;
    className?: string;
    labelClassName?: string;
    property?: string;
    prop?: Extract<keyof Row, string> | (string & {});
    width?: string | number;
    minWidth?: string | number;
    sortable?: boolean | 'custom';
    sortMethod?: (a: Row, b: Row) => number;
    sortBy?: string | string[] | ((row: Row, index: number) => string);
    resizable?: boolean;
    columnKey?: string;
    align?: GaTableColumnAlign;
    headerAlign?: GaTableColumnAlign;
    showOverflowTooltip?: boolean;
    fixed?: GaTableColumnFixed;
    formatter?: (row: Row, column: TableColumnCtx<Row>, cellValue: unknown, index: number) => VNode | string;
    selectable?: (row: Row, index: number) => boolean;
    reserveSelection?: boolean;
    filters?: Array<{
        text: string;
        value: string;
    }>;
    filterMethod?: (value: string, row: Row, column: TableColumnCtx<Row>) => void;
    filteredValue?: string[];
    filterPlacement?: string;
    filterMultiple?: boolean;
    index?: number | ((index: number) => number);
}
export interface GaTableCellScope<Row extends GaTableRow = GaTableRow> {
    row: Row;
    column: TableColumnCtx<Row>;
    $index: number;
}
export interface GaTableExpose {
    tableRef: TableInstance | undefined;
}
export interface GaPagination {
    currentPage?: number;
    pageSize?: number;
    total?: number;
    pageSizes?: number[];
    size?: 'default' | 'small' | 'large';
    layout?: string;
    background?: boolean;
}
//# sourceMappingURL=index.d.ts.map