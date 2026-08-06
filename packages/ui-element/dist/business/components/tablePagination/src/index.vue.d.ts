import { GaTableCellScope, GaTableRow } from '../../../../base/index';
import { GaTablePaginationProps } from './props';
declare const _default: <Row extends GaTableRow = GaTableRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onCurrent-change"?: ((currentPage: number) => any) | undefined;
        readonly "onUpdate:current-page"?: ((currentPage: number) => any) | undefined;
        readonly "onUpdate:page-size"?: ((pageSize: number) => any) | undefined;
        readonly "onSize-change"?: ((pageSize: number) => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "onCurrent-change" | "onUpdate:current-page" | "onUpdate:page-size" | "onSize-change"> & GaTablePaginationProps<Row> & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<Record<string, (scope: GaTableCellScope<Row>) => unknown>> & Record<string, (scope: GaTableCellScope<Row>) => unknown>;
    emit: ((evt: "current-change", currentPage: number) => void) & ((evt: "update:current-page", currentPage: number) => void) & ((evt: "update:page-size", pageSize: number) => void) & ((evt: "size-change", pageSize: number) => void);
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
//# sourceMappingURL=index.vue.d.ts.map