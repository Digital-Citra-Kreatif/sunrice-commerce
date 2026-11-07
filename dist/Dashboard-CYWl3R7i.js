import { i as k, u as B, e as A, j as a, c, P as E, F, d as H, b as d, S, K as L, f as R, C as W, g as z, E as C } from "./main-BZm25ssn.js";
const M = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "neutral", refunded: "neutral", failed: "error" }, P = (n) => (/* @__PURE__ */ new Date(`${n}T00:00:00`)).toLocaleDateString(void 0, { day: "numeric", month: "short" });
function X({ mode: n, setup: i, health: h, period: u, analytics: N, canReports: T, kpis: v, sales: x, topProducts: g, todo: p, widgets: f, recentOrders: o }) {
  const { Card: r, CardContent: m, CardHeader: l, CardTitle: s, CardDescription: b, Button: _ } = H, { Link: t } = k;
  B();
  const y = i.filter((e) => !e.done), w = h.filter((e) => e.status !== "ok"), D = Object.entries(A.dashboardWidgets()).filter(([e]) => f !== void 0 && e in f);
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ c(E, { title: "Store", description: /* @__PURE__ */ a(F, { children: [
      "Selling mode: ",
      n.label
    ] }) }),
    y.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ a(l, { children: [
        /* @__PURE__ */ c(s, { children: "Set up your store" }),
        /* @__PURE__ */ a(b, { children: [
          i.length - y.length,
          " of ",
          i.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ c(m, { className: "cm:grid cm:gap-2", children: i.map((e) => /* @__PURE__ */ a(t, { href: d(e.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ c("span", { "aria-hidden": !0, className: e.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: e.done ? "✓" : "○" }),
        /* @__PURE__ */ a("span", { className: "cm:grid", children: [
          /* @__PURE__ */ c("span", { className: e.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: e.label }),
          e.description && /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.description })
        ] })
      ] }, e.key)) })
    ] }),
    w.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(s, { children: "Needs attention" }) }),
      /* @__PURE__ */ c(m, { className: "cm:grid cm:gap-3", children: w.map((e) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ c(S, { tone: e.status, children: e.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ c("span", { className: "cm:font-medium", children: e.label })
        ] }),
        /* @__PURE__ */ c("p", { className: "cm:text-sm", children: e.message }),
        e.fix && /* @__PURE__ */ c("p", { className: "cm:text-sm cm:text-muted-foreground", children: e.fix })
      ] }, e.key)) })
    ] }),
    N && /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
      /* @__PURE__ */ c("div", { role: "group", "aria-label": "Period", className: "cm:flex cm:gap-1", children: u.options.map((e) => /* @__PURE__ */ c(
        _,
        {
          size: "sm",
          variant: e.value === u.key ? "default" : "outline",
          "aria-pressed": e.value === u.key,
          onClick: () => k.router.get(d("commerce"), { period: e.value }, { preserveScroll: !0, preserveState: !0 }),
          children: e.label
        },
        e.value
      )) }),
      T && /* @__PURE__ */ c(t, { href: d("commerce/reports/sales"), className: "cm:text-sm cm:underline", children: "All reports" })
    ] }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: v === void 0 ? [0, 1, 2, 3, 4].map((e) => /* @__PURE__ */ c(L, {}, e)) : v.map((e) => /* @__PURE__ */ c(R, { kpi: e }, e.key)) }),
    N && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:lg:grid-cols-3", children: [
      /* @__PURE__ */ a(r, { className: "cm:lg:col-span-2", children: [
        /* @__PURE__ */ a(l, { children: [
          /* @__PURE__ */ c(s, { children: "Sales" }),
          /* @__PURE__ */ c(b, { children: "Total sales per day, against the previous period" })
        ] }),
        /* @__PURE__ */ c(m, { children: x === void 0 ? /* @__PURE__ */ c("div", { className: "cm:h-[260px] cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ c(
          W,
          {
            label: "Total sales per day",
            data: x,
            xKey: "date",
            formatX: P,
            format: (e) => z(e),
            series: [{ key: "total", label: "This period" }, { key: "previous", label: "Previous period", dashed: !0 }]
          }
        ) })
      ] }),
      /* @__PURE__ */ a(r, { children: [
        /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(s, { children: "Top products" }) }),
        /* @__PURE__ */ c(m, { children: g === void 0 ? /* @__PURE__ */ c("div", { className: "cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : g.length === 0 ? /* @__PURE__ */ c(C, { title: "No sales yet", description: "Best sellers in this period show up here." }) : /* @__PURE__ */ c("ol", { className: "cm:grid cm:gap-2", children: g.map((e) => /* @__PURE__ */ a("li", { className: "cm:flex cm:justify-between cm:gap-2 cm:text-sm", children: [
          e.href ? /* @__PURE__ */ c(t, { href: d(e.href), className: "cm:truncate cm:hover:underline", children: e.title }) : /* @__PURE__ */ c("span", { className: "cm:truncate", children: e.title }),
          /* @__PURE__ */ a("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
            e.units,
            " · ",
            e.revenue
          ] })
        ] }, e.product_id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(s, { children: "To do" }) }),
      /* @__PURE__ */ c(m, { children: p === void 0 ? /* @__PURE__ */ c(j, { rows: 2 }) : p.length === 0 ? /* @__PURE__ */ c(C, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ c("ul", { className: "cm:-mx-2 cm:grid cm:gap-1", children: p.map((e) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ a(t, { href: d(e.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ c("span", { children: e.label }),
        /* @__PURE__ */ c("span", { className: "cm:font-semibold", children: e.count })
      ] }) }, e.key)) }) })
    ] }),
    (o === void 0 || o.length > 0) && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(s, { children: "Recent orders" }) }),
      /* @__PURE__ */ c(m, { children: o === void 0 ? /* @__PURE__ */ c(j, { rows: 5 }) : /* @__PURE__ */ c("ul", { className: "cm:-mx-2 cm:grid cm:gap-1", children: o.map((e) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ a(t, { href: d(e.href), className: "cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-4 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[auto_1fr_auto_auto]", children: [
        /* @__PURE__ */ c("span", { className: "cm:whitespace-nowrap cm:font-medium", children: e.number }),
        /* @__PURE__ */ c("span", { className: "cm:truncate cm:text-muted-foreground", children: e.customer }),
        /* @__PURE__ */ c(S, { tone: M[e.status_key], children: e.status }),
        /* @__PURE__ */ c("span", { className: "cm:tabular-nums", children: e.total })
      ] }) }, e.id)) }) })
    ] }),
    D.map(([e, K]) => /* @__PURE__ */ c(K, { ...f?.[e] }, e))
  ] });
}
function j({ rows: n }) {
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", "aria-hidden": "true", children: Array.from({ length: n }, (i, h) => /* @__PURE__ */ a("div", { className: "cm:flex cm:h-10 cm:items-center cm:justify-between", children: [
    /* @__PURE__ */ c("span", { className: "cm:h-4 cm:w-40 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4 cm:w-12 cm:animate-pulse cm:rounded cm:bg-muted" })
  ] }, h)) });
}
export {
  X as default
};
