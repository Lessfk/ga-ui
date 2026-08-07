import { TableInstance } from 'element-plus';
import { GaTableProps } from './props.js';
import { GaTableRow } from '../types/index.js';
declare const _default: <Row extends GaTableRow = GaTableRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{} & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, never> & GaTableProps<Row> & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{
        tableRef: import('vue').Ref<TableInstance | undefined, TableInstance | undefined>;
    }>): void;
    attrs: any;
    slots: Partial<Record<string, (_: {
        row: Row;
        column: import('element-plus').TableColumnCtx<Row>;
        $index: number;
    }) => any>> & {
        'column-prepend'?(_: {}): any;
        default?(_: {}): any;
        append?(_: {}): any;
        empty?(_: {}): any;
    };
    emit: {};
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
//# sourceMappingURL=index.vue.d.ts.map