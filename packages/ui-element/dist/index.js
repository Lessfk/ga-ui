import { defineComponent as z, useSlots as C, ref as x, withDirectives as B, openBlock as g, createBlock as f, unref as n, mergeProps as d, createSlots as m, withCtx as p, renderSlot as u, createElementBlock as b, Fragment as _, renderList as w, createVNode as y, computed as T, normalizeProps as $, guardReactiveProps as S } from "vue";
import { ElTable as P, ElTableColumn as v, ElEmpty as R, vLoading as E, ElPagination as G } from "element-plus";
function H(o, l) {
  return o.key ?? o.prop ?? `${o.type ?? "column"}-${l}`;
}
function K(o) {
  const { key: l, slot: e, ...r } = o;
  return r;
}
const A = /* @__PURE__ */ z({
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
  setup(o, { expose: l }) {
    const e = o, r = C(), s = x();
    return l({
      tableRef: s
    }), (i, a) => B((g(), f(n(P), d({
      ref_key: "tableRef",
      ref: s
    }, i.$attrs, {
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
    }), m({
      empty: p(() => [
        u(i.$slots, "empty", {}, () => [
          y(n(R), {
            description: e.emptyText
          }, null, 8, ["description"])
        ])
      ]),
      default: p(() => [
        u(i.$slots, "column-prepend"),
        (g(!0), b(_, null, w(e.columns, (t, c) => (g(), f(n(v), d({
          key: n(H)(t, c)
        }, { ref_for: !0 }, n(K)(t)), m({ _: 2 }, [
          t.slot && n(r)[t.slot] ? {
            name: "default",
            fn: p((h) => [
              u(i.$slots, t.slot, d({ ref_for: !0 }, h))
            ]),
            key: "0"
          } : void 0
        ]), 1040))), 128)),
        u(i.$slots, "default")
      ]),
      _: 2
    }, [
      n(r).append ? {
        name: "append",
        fn: p(() => [
          u(i.$slots, "append")
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["data", "height", "max-height", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "element-loading-text"])), [
      [n(E), e.loading]
    ]);
  }
}), L = /* @__PURE__ */ z({
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
    background: { type: Boolean, default: !0 },
    position: { default: "right" }
  },
  emits: ["update:current-page", "update:page-size", "current-change", "size-change"],
  setup(o, { emit: l }) {
    const e = o, r = T(() => {
      let t = `is-${e.position}`;
      return t || "";
    }), s = l, i = (t) => {
      s("update:current-page", t), s("current-change", t);
    }, a = (t) => {
      s("update:page-size", t), s("size-change", t);
    };
    return (t, c) => (g(), f(n(G), d(t.$attrs, {
      class: ["ga-pagination", [r.value]],
      "current-page": e.currentPage,
      "page-size": e.pageSize,
      total: e.total,
      "page-sizes": e.pageSizes,
      size: e.size,
      layout: e.layout,
      background: e.background,
      onCurrentChange: i,
      onSizeChange: a
    }), null, 16, ["class", "current-page", "page-size", "total", "page-sizes", "size", "layout", "background"]));
  }
}), F = /* @__PURE__ */ z({
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
  setup(o, { emit: l }) {
    const e = o, r = l;
    function s(a) {
      r("update:current-page", a), r("current-change", a);
    }
    function i(a) {
      r("update:page-size", a), r("size-change", a);
    }
    return (a, t) => (g(), b("div", d(a.$attrs, { class: "ga-table-pagination" }), [
      y(n(A), {
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
        w(a.$slots, (c, h) => ({
          name: h,
          fn: p((k) => [
            u(a.$slots, h, $(S(k ?? {})))
          ])
        }))
      ]), 1032, ["data", "columns", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "loading", "loading-text"]),
      y(n(L), {
        "current-page": e.currentPage,
        "page-size": e.pageSize,
        total: e.total,
        "page-sizes": e.pageSizes,
        size: e.size,
        layout: e.layout,
        background: e.background,
        position: e.position,
        onCurrentChange: s,
        onSizeChange: i
      }, null, 8, ["current-page", "page-size", "total", "page-sizes", "size", "layout", "background", "position"])
    ], 16));
  }
});
export {
  L as GaPagination,
  A as GaTable,
  F as GaTablePagination
};
//# sourceMappingURL=index.js.map
