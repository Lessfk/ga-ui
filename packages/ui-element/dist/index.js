import { defineComponent as P, computed as l, useAttrs as $, useSlots as _, ref as E, watch as R, nextTick as A, openBlock as s, createElementBlock as b, normalizeClass as K, withDirectives as L, createBlock as h, unref as a, mergeProps as c, createSlots as k, withCtx as p, renderSlot as u, Fragment as j, renderList as G, createVNode as N, createCommentVNode as V } from "vue";
import { ElTable as D, ElTableColumn as F, ElEmpty as q, vLoading as I, ElPagination as J } from "element-plus";
function M(n, g) {
  return n.key ?? n.prop ?? `${n.type ?? "column"}-${g}`;
}
function O(n) {
  const { key: g, slot: f, ...e } = n;
  return e;
}
const W = /* @__PURE__ */ P({
  name: "GaTable",
  inheritAttrs: !1,
  __name: "index",
  props: {
    data: { default: () => [] },
    columns: { default: () => [] },
    pagination: { type: Boolean, default: void 0 },
    autoHeight: { type: Boolean, default: !1 },
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
  emits: ["size-change", "current-change"],
  setup(n, { expose: g, emit: f }) {
    const e = n, y = l(() => e.pagination !== !1), r = l(
      () => e.autoHeight && e.height === void 0 && e.maxHeight === void 0
    ), w = l(
      () => e.height ?? (r.value ? "100%" : void 0)
    ), C = $(), x = l(() => {
      if (!(r.value || e.height !== void 0))
        return [
          { height: void 0 },
          C.style
        ];
    }), i = l(() => {
      const t = typeof e.pagination == "object" ? e.pagination : {};
      return {
        currentPage: t.currentPage ?? 1,
        pageSize: t.pageSize ?? 10,
        pageSizes: t.pageSizes ?? [10, 20, 30, 40, 50],
        total: t.total ?? 100,
        size: t.size ?? "default",
        background: t.background ?? !0,
        layout: t.layout ?? "total, sizes, prev, pager, next, jumper"
      };
    }), m = _(), d = E();
    R(r, async (t, z) => {
      var o;
      !z || t || e.height !== void 0 || (await A(), !(r.value || e.height !== void 0) && ((o = d.value) == null || o.doLayout()));
    });
    const v = f, S = (t) => {
      v("current-change", t);
    }, B = (t) => {
      v("size-change", t);
    };
    return g({
      tableRef: d
    }), (t, z) => (s(), b("div", {
      class: K(["ga-table-container", {
        "is-auto-height": r.value,
        "is-without-pagination": !y.value
      }])
    }, [
      L((s(), h(a(D), c({
        ref_key: "tableRef",
        ref: d
      }, t.$attrs, {
        class: "ga-table",
        style: x.value,
        data: e.data,
        height: w.value,
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
      }), k({
        empty: p(() => [
          u(t.$slots, "empty", {}, () => [
            N(a(q), {
              description: e.emptyText
            }, null, 8, ["description"])
          ])
        ]),
        default: p(() => [
          u(t.$slots, "column-prepend"),
          (s(!0), b(j, null, G(e.columns, (o, T) => (s(), h(a(F), c({
            key: a(M)(o, T)
          }, { ref_for: !0 }, a(O)(o)), k({ _: 2 }, [
            o.slot && a(m)[o.slot] ? {
              name: "default",
              fn: p((H) => [
                u(t.$slots, o.slot, c({ ref_for: !0 }, H))
              ]),
              key: "0"
            } : void 0
          ]), 1040))), 128)),
          u(t.$slots, "default")
        ]),
        _: 2
      }, [
        a(m).append ? {
          name: "append",
          fn: p(() => [
            u(t.$slots, "append")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["style", "data", "height", "max-height", "row-key", "border", "stripe", "size", "fit", "show-header", "highlight-current-row", "empty-text", "element-loading-text"])), [
        [a(I), e.loading]
      ]),
      y.value ? (s(), h(a(J), {
        key: 0,
        class: "ga-pagination",
        "current-page": i.value.currentPage,
        "page-size": i.value.pageSize,
        "page-sizes": i.value.pageSizes,
        size: i.value.size,
        background: i.value.background,
        layout: i.value.layout,
        total: i.value.total,
        onSizeChange: B,
        onCurrentChange: S
      }, null, 8, ["current-page", "page-size", "page-sizes", "size", "background", "layout", "total"])) : V("", !0)
    ], 2));
  }
});
export {
  W as GaTable
};
//# sourceMappingURL=index.js.map
