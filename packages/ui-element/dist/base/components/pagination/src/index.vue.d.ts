import { GaPaginationProps } from './props.js';
declare const _default: import('vue').DefineComponent<GaPaginationProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "current-change": (currentPage: number) => any;
    "update:current-page": (currentPage: number) => any;
    "update:page-size": (pageSize: number) => any;
    "size-change": (pageSize: number) => any;
}, string, import('vue').PublicProps, Readonly<GaPaginationProps> & Readonly<{
    "onCurrent-change"?: ((currentPage: number) => any) | undefined;
    "onUpdate:current-page"?: ((currentPage: number) => any) | undefined;
    "onUpdate:page-size"?: ((pageSize: number) => any) | undefined;
    "onSize-change"?: ((pageSize: number) => any) | undefined;
}>, {
    size: import('element-plus').ComponentSize;
    layout: string;
    background: boolean;
    currentPage: number;
    pageSize: number;
    total: number;
    pageSizes: number[];
    position: "left" | "center" | "right";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=index.vue.d.ts.map