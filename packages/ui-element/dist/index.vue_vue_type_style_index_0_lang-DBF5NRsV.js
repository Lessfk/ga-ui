import { defineComponent as m, useSlots as z, ref as k, withDirectives as b, openBlock as p, createBlock as g, unref as r, mergeProps as d, createSlots as c, withCtx as u, renderSlot as i, createElementBlock as w, Fragment as x, renderList as C, createVNode as _, computed as $ } from "vue";
import { ElTable as B, ElTableColumn as S, ElEmpty as T, vLoading as v, ElPagination as E } from "element-plus";
function P(a, s) {
  return a.key ?? a.prop ?? `${a.type ?? "column"}-${s}`;
}
function H(a) {
  const { key: s, slot: e, ...l } = a;
  return l;
}
const A = /* @__PURE__ */ m({
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
  setup(a, { expose: s }) {
    const e = a, l = z(), n = k();
    return s({
      tableRef: n
    }), (o, f) => b((p(), g(r(B), d({
      ref_key: "tableRef",
      ref: n
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
    }), c({
      empty: u(() => [
        i(o.$slots, "empty", {}, () => [
          _(r(T), {
            description: e.emptyText
          }, null, 8, ["description"])
        ])
      ]),
      default: u(() => [
        i(o.$slots, "column-prepend"),
        (p(!0), w(x, null, C(e.columns, (t, h) => (p(), g(r(S), d({
          key: r(P)(t, h)
        }, { ref_for: !0 }, r(H)(t)), c({ _: 2 }, [
          t.slot && r(l)[t.slot] ? {
            name: "default",
            fn: u((y) => [
              i(o.$slots, t.slot, d({ ref_for: !0 }, y))
            ]),
            key: "0"
          } : void 0
        ]), 1040))), 128)),
        i(o.$slots, "default")
      ]),
      _: 2
    }, [
      r(l).append ? {
        name: "append",
        fn: u(() => [
          i(o.$slots, "append")
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["data", "height", "max-height", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "element-loading-text"])), [
      [r(v), e.loading]
    ]);
  }
}), G = /* @__PURE__ */ m({
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
  setup(a, { emit: s }) {
    const e = a, l = $(() => {
      let t = `is-${e.position}`;
      return t || "";
    }), n = s, o = (t) => {
      n("update:current-page", t), n("current-change", t);
    }, f = (t) => {
      n("update:page-size", t), n("size-change", t);
    };
    return (t, h) => (p(), g(r(E), d(t.$attrs, {
      class: ["ga-pagination", [l.value]],
      "current-page": e.currentPage,
      "page-size": e.pageSize,
      total: e.total,
      "page-sizes": e.pageSizes,
      size: e.size,
      layout: e.layout,
      background: e.background,
      onCurrentChange: o,
      onSizeChange: f
    }), null, 16, ["class", "current-page", "page-size", "total", "page-sizes", "size", "layout", "background"]));
  }
});
export {
  G as _,
  A as a
};
//# sourceMappingURL=index.vue_vue_type_style_index_0_lang-DBF5NRsV.js.map
