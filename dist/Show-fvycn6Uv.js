import { i as k, a as n, R as g, d as x, u as N, j as s, b as e, P as S, c as _, k as j } from "./main-BjsacfA0.js";
import { D as v } from "./DataTable-DpMDXAVx.js";
const m = "commerce-loyalty-adjust", l = new Intl.NumberFormat("id-ID"), D = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function F({ title: i, description: o, balance: d, form: u, history: f }) {
  const { Button: h } = _, { Link: b } = k, c = n("commerce/loyalty"), [y, p] = g.useState(!1);
  return x(), N([{ label: "Shop", href: n("commerce") }, { label: "Loyalty points", href: c }, { label: i }]), /* @__PURE__ */ s("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ e(S, { title: i, description: o, back: { href: c, label: "Back to loyalty points" } }),
    /* @__PURE__ */ s("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "adjust-points-title", children: [
      /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ e("h2", { className: "cm:text-lg cm:font-semibold", id: "adjust-points-title", children: "Adjust points" }),
        /* @__PURE__ */ e(h, { type: "submit", form: m, disabled: y, children: "Save adjustment" })
      ] }),
      /* @__PURE__ */ e(j, { form: u, id: m, onProcessing: p }, d)
    ] }),
    /* @__PURE__ */ s("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "points-history-title", children: [
      /* @__PURE__ */ e("h2", { className: "cm:text-lg cm:font-semibold", id: "points-history-title", children: "Points history" }),
      /* @__PURE__ */ e(
        v,
        {
          ...f,
          searchPlaceholder: "Search reasons…",
          renderCell: (a, t) => {
            if (t.key === "created_at" || t.key === "expires_at") {
              const r = a[t.key];
              return r ? /* @__PURE__ */ e("time", { dateTime: r, children: D.format(new Date(r)) }) : "—";
            }
            if (t.key === "points") return /* @__PURE__ */ s("span", { className: "cm:font-medium cm:tabular-nums", children: [
              a.points > 0 ? "+" : "",
              l.format(a.points)
            ] });
            if (t.key === "balance_after") return /* @__PURE__ */ e("span", { className: "cm:tabular-nums", children: l.format(a.balance_after) });
            if (t.key === "order_number") return a.order_url ? /* @__PURE__ */ e(b, { href: a.order_url, className: "cm:underline cm:underline-offset-4", children: a.order_number }) : a.order_number ?? "—";
            if (t.key === "note") return /* @__PURE__ */ e("span", { className: "cm:block cm:max-w-60 cm:wrap-anywhere cm:whitespace-normal", children: a.note ?? "—" });
          }
        }
      )
    ] })
  ] });
}
export {
  F as default
};
