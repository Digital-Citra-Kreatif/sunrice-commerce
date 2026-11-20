import { i as x, a as r, R as g, d as N, u as _, j as t, b as a, P as k, c as S, m as j } from "./main-c7I67zru.js";
import { D as v } from "./DataTable-DTa1yoS_.js";
const i = "commerce-loyalty-adjust", n = new Intl.NumberFormat("id-ID"), l = new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" });
function T({ title: c, description: d, balance: o, form: u, history: h }) {
  const { Button: f } = S, { Link: p } = x, m = r("commerce/loyalty"), [b, y] = g.useState(!1);
  return N(), _([{ label: "Shop", href: r("commerce") }, { label: "Loyalty points", href: m }, { label: c }]), /* @__PURE__ */ t("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ a(k, { title: c, description: d, back: { href: m, label: "Back to loyalty points" } }),
    /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "adjust-points-title", children: [
      /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ a("h2", { className: "cm:text-lg cm:font-semibold", id: "adjust-points-title", children: "Adjust points" }),
        /* @__PURE__ */ a(f, { type: "submit", form: i, disabled: b, children: "Save adjustment" })
      ] }),
      /* @__PURE__ */ a(j, { form: u, id: i, onProcessing: y }, o)
    ] }),
    /* @__PURE__ */ t("section", { className: "cm:grid cm:gap-3", "aria-labelledby": "points-history-title", children: [
      /* @__PURE__ */ a("h2", { className: "cm:text-lg cm:font-semibold", id: "points-history-title", children: "Points history" }),
      /* @__PURE__ */ a(
        v,
        {
          ...h,
          searchPlaceholder: "Search reasons…",
          renderCell: (e, s) => {
            if (s.key === "created_at")
              return e.created_at ? /* @__PURE__ */ a("time", { dateTime: e.created_at, children: l.format(new Date(e.created_at)) }) : "—";
            if (s.key === "points") return /* @__PURE__ */ t("span", { className: "cm:font-medium cm:tabular-nums", children: [
              e.points > 0 ? "+" : "",
              n.format(e.points)
            ] });
            if (s.key === "balance_after") return /* @__PURE__ */ a("span", { className: "cm:tabular-nums", children: n.format(e.balance_after) });
            if (s.key === "kind") return /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a("span", { className: "cm:font-medium", children: e.kind }),
              e.order_url ? /* @__PURE__ */ a(p, { href: e.order_url, className: "cm:text-xs cm:underline cm:underline-offset-4", children: e.order_number }) : e.order_number && /* @__PURE__ */ a("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.order_number })
            ] });
            if (s.key === "actor") return /* @__PURE__ */ t("div", { className: "cm:grid cm:min-w-44 cm:max-w-80 cm:gap-1 cm:wrap-anywhere cm:whitespace-normal", children: [
              /* @__PURE__ */ a("span", { children: e.actor }),
              e.note && /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: e.note }),
              e.expires_at && /* @__PURE__ */ t("span", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Expires ",
                /* @__PURE__ */ a("time", { dateTime: e.expires_at, children: l.format(new Date(e.expires_at)) })
              ] })
            ] });
          }
        }
      )
    ] })
  ] });
}
export {
  T as default
};
