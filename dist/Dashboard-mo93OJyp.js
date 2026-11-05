import { i as k, u as B, e as K, j as a, c, P as E, F, d as H, b as s, S as w, K as L, C as W, f as z, E as C } from "./main-Bwk0AAzX.js";
const A = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "neutral", refunded: "neutral", failed: "error" }, M = (t) => (/* @__PURE__ */ new Date(`${t}T00:00:00`)).toLocaleDateString(void 0, { day: "numeric", month: "short" });
function R({ mode: t, setup: n, health: S, period: o, analytics: f, canReports: T, kpis: N, sales: v, topProducts: h, todo: u, widgets: g, recentOrders: p }) {
  const { Card: r, CardContent: m, CardHeader: l, CardTitle: d, CardDescription: b, Button: j } = H, { Link: i } = k;
  B();
  const x = n.filter((e) => !e.done), y = S.filter((e) => e.status !== "ok"), _ = Object.entries(K.dashboardWidgets()).filter(([e]) => g !== void 0 && e in g);
  return /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ c(E, { title: "Store", description: /* @__PURE__ */ a(F, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    x.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ a(l, { children: [
        /* @__PURE__ */ c(d, { children: "Set up your store" }),
        /* @__PURE__ */ a(b, { children: [
          n.length - x.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ c(m, { className: "cm:grid cm:gap-2", children: n.map((e) => /* @__PURE__ */ a(i, { href: s(e.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ c("span", { "aria-hidden": !0, className: e.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: e.done ? "✓" : "○" }),
        /* @__PURE__ */ a("span", { className: "cm:grid", children: [
          /* @__PURE__ */ c("span", { className: e.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: e.label }),
          e.description && /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.description })
        ] })
      ] }, e.key)) })
    ] }),
    y.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(d, { children: "Needs attention" }) }),
      /* @__PURE__ */ c(m, { className: "cm:grid cm:gap-3", children: y.map((e) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ c(w, { tone: e.status, children: e.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ c("span", { className: "cm:font-medium", children: e.label })
        ] }),
        /* @__PURE__ */ c("p", { className: "cm:text-sm", children: e.message }),
        e.fix && /* @__PURE__ */ c("p", { className: "cm:text-sm cm:text-muted-foreground", children: e.fix })
      ] }, e.key)) })
    ] }),
    f && /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
      /* @__PURE__ */ c("div", { role: "group", "aria-label": "Period", className: "cm:flex cm:gap-1", children: o.options.map((e) => /* @__PURE__ */ c(
        j,
        {
          size: "sm",
          variant: e.value === o.key ? "default" : "outline",
          "aria-pressed": e.value === o.key,
          onClick: () => k.router.get(s("commerce"), { period: e.value }, { preserveScroll: !0, preserveState: !0 }),
          children: e.label
        },
        e.value
      )) }),
      T && /* @__PURE__ */ c(i, { href: s("commerce/reports/sales"), className: "cm:text-sm cm:underline", children: "All reports" })
    ] }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: N === void 0 ? [0, 1, 2, 3, 4].map((e) => /* @__PURE__ */ c("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, e)) : N.map((e) => /* @__PURE__ */ c(L, { kpi: e }, e.key)) }),
    f && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:lg:grid-cols-3", children: [
      /* @__PURE__ */ a(r, { className: "cm:lg:col-span-2", children: [
        /* @__PURE__ */ a(l, { children: [
          /* @__PURE__ */ c(d, { children: "Sales" }),
          /* @__PURE__ */ c(b, { children: "Total sales per day, against the previous period" })
        ] }),
        /* @__PURE__ */ c(m, { children: v === void 0 ? /* @__PURE__ */ c("div", { className: "cm:h-64 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : /* @__PURE__ */ c(
          W,
          {
            label: "Total sales per day",
            data: v,
            xKey: "date",
            formatX: M,
            format: (e) => z(e),
            series: [{ key: "total", label: "This period" }, { key: "previous", label: "Previous period", dashed: !0 }]
          }
        ) })
      ] }),
      /* @__PURE__ */ a(r, { children: [
        /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(d, { children: "Top products" }) }),
        /* @__PURE__ */ c(m, { children: h === void 0 ? /* @__PURE__ */ c("div", { className: "cm:h-40 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : h.length === 0 ? /* @__PURE__ */ c(C, { title: "No sales yet", description: "Best sellers in this period show up here." }) : /* @__PURE__ */ c("ol", { className: "cm:grid cm:gap-2", children: h.map((e) => /* @__PURE__ */ a("li", { className: "cm:flex cm:justify-between cm:gap-2 cm:text-sm", children: [
          e.href ? /* @__PURE__ */ c(i, { href: s(e.href), className: "cm:truncate cm:hover:underline", children: e.title }) : /* @__PURE__ */ c("span", { className: "cm:truncate", children: e.title }),
          /* @__PURE__ */ a("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
            e.units,
            " · ",
            e.revenue
          ] })
        ] }, e.product_id)) }) })
      ] })
    ] }),
    /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(d, { children: "To do" }) }),
      /* @__PURE__ */ c(m, { children: u === void 0 ? /* @__PURE__ */ c("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : u.length === 0 ? /* @__PURE__ */ c(C, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ c("ul", { className: "cm:grid cm:gap-1", children: u.map((e) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ a(i, { href: s(e.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ c("span", { children: e.label }),
        /* @__PURE__ */ c("span", { className: "cm:font-semibold", children: e.count })
      ] }) }, e.key)) }) })
    ] }),
    p !== void 0 && p.length > 0 && /* @__PURE__ */ a(r, { children: [
      /* @__PURE__ */ c(l, { children: /* @__PURE__ */ c(d, { children: "Recent orders" }) }),
      /* @__PURE__ */ c(m, { children: /* @__PURE__ */ c("ul", { className: "cm:grid cm:gap-1", children: p.map((e) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ a(i, { href: s(e.href), className: "cm:grid cm:grid-cols-[1fr_auto] cm:items-center cm:gap-x-3 cm:rounded-md cm:p-2 cm:hover:bg-muted cm:sm:grid-cols-[8rem_1fr_auto_auto]", children: [
        /* @__PURE__ */ c("span", { className: "cm:font-medium", children: e.number }),
        /* @__PURE__ */ c("span", { className: "cm:truncate cm:text-muted-foreground", children: e.customer }),
        /* @__PURE__ */ c(w, { tone: A[e.status_key], children: e.status }),
        /* @__PURE__ */ c("span", { className: "cm:tabular-nums", children: e.total })
      ] }) }, e.id)) }) })
    ] }),
    _.map(([e, D]) => /* @__PURE__ */ c(D, { ...g?.[e] }, e))
  ] });
}
export {
  R as default
};
