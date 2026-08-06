import { defineComponent as c, useSlots as z, ref as k, withDirectives as b, openBlock as d, createBlock as f, unref as r, mergeProps as g, createSlots as h, withCtx as p, renderSlot as i, createElementBlock as w, Fragment as x, renderList as C, createVNode as _ } from "vue";
import { ElTable as B, ElTableColumn as $, ElEmpty as T, vLoading as S, ElPagination as P } from "element-plus";
function E(t, l) {
  return t.key ?? t.prop ?? `${t.type ?? "column"}-${l}`;
}
function v(t) {
  const { key: l, slot: e, ...a } = t;
  return a;
}
const R = /* @__PURE__ */ c({
  name: "GaTable",
  inheritAttrs: !1,
  __name: "index",
  props: {
    data: { default: () => [] },
    columns: { default: () => [] },
    height: {},
    maxHeight: {},
    rowKey: {},
    border: { type: Boolean, default: !0 },
    stripe: { type: Boolean, default: !0 },
    size: {},
    fit: { type: Boolean, default: !0 },
    showHeader: { type: Boolean, default: !0 },
    highlightCurrentRow: { type: Boolean, default: !1 },
    emptyText: { default: "暂无数据" },
    loading: { type: Boolean, default: !1 },
    loadingText: { default: "加载中..." }
  },
  setup(t, { expose: l }) {
    const e = t, a = z(), u = k();
    return l({
      tableRef: u
    }), (o, n) => b((d(), f(r(B), g({
      ref_key: "tableRef",
      ref: u
    }, o.$attrs, {
      class: "ga-table",
      data: e.data,
      height: e.height,
      "max-height": e.maxHeight,
      "row-key": e.rowKey,
      border: e.border,
      stripe: e.stripe,
      size: e.size,
      fit: e.fit,
      "show-header": e.showHeader,
      "highlight-current-row": e.highlightCurrentRow,
      "empty-text": e.emptyText,
      "element-loading-text": e.loadingText
    }), h({
      empty: p(() => [
        i(o.$slots, "empty", {}, () => [
          _(r(T), {
            description: e.emptyText
          }, null, 8, ["description"])
        ])
      ]),
      default: p(() => [
        i(o.$slots, "column-prepend"),
        (d(!0), w(x, null, C(e.columns, (s, m) => (d(), f(r($), g({
          key: r(E)(s, m)
        }, { ref_for: !0 }, r(v)(s)), h({ _: 2 }, [
          s.slot && r(a)[s.slot] ? {
            name: "default",
            fn: p((y) => [
              i(o.$slots, s.slot, g({ ref_for: !0 }, y))
            ]),
            key: "0"
          } : void 0
        ]), 1040))), 128)),
        i(o.$slots, "default")
      ]),
      _: 2
    }, [
      r(a).append ? {
        name: "append",
        fn: p(() => [
          i(o.$slots, "append")
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["data", "height", "max-height", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "element-loading-text"])), [
      [r(S), e.loading]
    ]);
  }
}), K = /* @__PURE__ */ c({
  name: "GaPagination",
  inheritAttrs: !1,
  __name: "index",
  props: {
    currentPage: { default: 1 },
    pageSize: { default: 10 },
    total: { default: 100 },
    pageSizes: { default: () => [10, 20, 30, 40, 50] },
    size: { default: "default" },
    layout: { default: "total, sizes, prev, pager, next, jumper" },
    background: { type: Boolean, default: !0 }
  },
  emits: ["update:current-page", "update:page-size", "current-change", "size-change"],
  setup(t, { emit: l }) {
    const e = t, a = l, u = (n) => {
      a("update:current-page", n), a("current-change", n);
    }, o = (n) => {
      a("update:page-size", n), a("size-change", n);
    };
    return (n, s) => (d(), f(r(P), g(n.$attrs, {
      class: "ga-pagination",
      "current-page": e.currentPage,
      "page-size": e.pageSize,
      total: e.total,
      "page-sizes": e.pageSizes,
      size: e.size,
      layout: e.layout,
      background: e.background,
      onCurrentChange: u,
      onSizeChange: o
    }), null, 16, ["current-page", "page-size", "total", "page-sizes", "size", "layout", "background"]));
  }
});
export {
  K as GaPagination,
  R as GaTable
};
//# sourceMappingURL=index.js.map
