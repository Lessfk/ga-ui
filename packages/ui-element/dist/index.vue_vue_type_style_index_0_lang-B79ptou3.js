import { defineComponent as u, openBlock as d, createElementBlock as c, mergeProps as h, createVNode as r, unref as n, createSlots as m, renderList as z, withCtx as f, renderSlot as y, normalizeProps as w, guardReactiveProps as _ } from "vue";
import { a as b, _ as C } from "./index.vue_vue_type_style_index_0_lang-DBF5NRsV.js";
const P = /* @__PURE__ */ u({
  name: "GaTablePagination",
  inheritAttrs: !1,
  __name: "index",
  props: {
    data: {},
    columns: {},
    rowKey: {},
    border: { type: Boolean, default: !0 },
    stripe: { type: Boolean, default: !0 },
    size: {},
    fit: { type: Boolean, default: !0 },
    showHeader: { type: Boolean, default: !0 },
    highlightCurrentRow: { type: Boolean },
    emptyText: {},
    loading: { type: Boolean },
    loadingText: {},
    currentPage: {},
    pageSize: {},
    total: {},
    pageSizes: {},
    layout: {},
    background: { type: Boolean, default: !0 },
    position: {}
  },
  emits: ["update:current-page", "update:page-size", "current-change", "size-change"],
  setup(i, { emit: s }) {
    const e = i, a = s;
    function l(t) {
      a("update:current-page", t), a("current-change", t);
    }
    function p(t) {
      a("update:page-size", t), a("size-change", t);
    }
    return (t, x) => (d(), c("div", h(t.$attrs, { class: "ga-table-pagination" }), [
      r(n(b), {
        data: e.data,
        columns: e.columns,
        "row-key": e.rowKey,
        border: e.border,
        stripe: e.stripe,
        size: e.size,
        fit: e.fit,
        "show-header": e.showHeader,
        "highlight-current-row": e.highlightCurrentRow,
        "empty-text": e.emptyText,
        loading: e.loading,
        "loading-text": e.loadingText,
        height: "100%"
      }, m({ _: 2 }, [
        z(t.$slots, (B, o) => ({
          name: o,
          fn: f((g) => [
            y(t.$slots, o, w(_(g ?? {})))
          ])
        }))
      ]), 1032, ["data", "columns", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "loading", "loading-text"]),
      r(n(C), {
        "current-page": e.currentPage,
        "page-size": e.pageSize,
        total: e.total,
        "page-sizes": e.pageSizes,
        size: e.size,
        layout: e.layout,
        background: e.background,
        position: e.position,
        onCurrentChange: l,
        onSizeChange: p
      }, null, 8, ["current-page", "page-size", "total", "page-sizes", "size", "layout", "background", "position"])
    ], 16));
  }
});
export {
  P as _
};
//# sourceMappingURL=index.vue_vue_type_style_index_0_lang-B79ptou3.js.map
