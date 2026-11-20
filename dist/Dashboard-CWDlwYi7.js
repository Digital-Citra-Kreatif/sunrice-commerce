import { i as F, d as A, e as B, j as c, b as e, P as E, F as H, c as M, a as l, S as L, K as P, f as U, E as S, C as V, g as W, h as Y } from "./main-DK8N8XXM.js";
const $ = { pending: "warning", on_hold: "warning", processing: "info", completed: "ok", cancelled: "error", refunded: "neutral", failed: "error" }, k = (m) => /* @__PURE__ */ new Date(`${m}T00:00:00`), I = (m) => k(m).toLocaleDateString(void 0, { day: "numeric", month: "short" }), X = new Intl.DateTimeFormat(void 0, { day: "numeric", month: "short", year: "numeric" }), R = (m, d) => X.formatRange(k(m), k(d));
function G({ mode: m, setup: d, health: f, period: r, analytics: u, canReports: K, kpis: g, sales: v, topProducts: N, todo: x, widgets: y, recentOrders: s }) {
  const { Card: t, CardContent: n, CardHeader: o, CardTitle: i, CardDescription: T, Button: w } = M, { Link: h } = F;
  A();
  const D = d.filter((a) => !a.done), _ = f.filter((a) => a.status !== "ok"), p = r.key === "today", j = r.compareFrom && r.compareTo ? R(r.compareFrom, r.compareTo) : null, z = Object.entries(B.dashboardWidgets()).filter(([a]) => y !== void 0 && a in y);
  return /* @__PURE__ */ c("div", { className: "commerce-dashboard cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ e(E, { title: "Store", description: /* @__PURE__ */ c(H, { children: [
      "Selling mode: ",
      m.label
    ] }) }),
    D.length > 0 && /* @__PURE__ */ c(t, { children: [
      /* @__PURE__ */ c(o, { children: [
        /* @__PURE__ */ e(i, { children: "Set up your store" }),
        /* @__PURE__ */ c(T, { children: [
          d.length - D.length,
          " of ",
          d.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(n, { className: "cm:grid cm:gap-2", children: d.map((a) => /* @__PURE__ */ c(h, { href: l(a.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: a.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: a.done ? "✓" : "○" }),
        /* @__PURE__ */ c("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: a.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: a.label }),
          a.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: a.description })
        ] })
      ] }, a.key)) })
    ] }),
    _.length > 0 && /* @__PURE__ */ c(t, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(i, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(n, { className: "cm:grid cm:gap-3", children: _.map((a) => /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(L, { tone: a.status, children: a.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: a.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: a.message }),
        a.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: a.fix })
      ] }, a.key)) })
    ] }),
    (u || g === void 0 || g.length > 0) && /* @__PURE__ */ c("section", { className: "cm:grid cm:gap-4", "aria-labelledby": "dashboard-overview", children: [
      /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:items-end cm:justify-between cm:gap-x-6 cm:gap-y-3", children: [
        /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ e("h2", { id: "dashboard-overview", className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: "Sales overview" }),
          u && /* @__PURE__ */ e("p", { className: "cm:mt-1 cm:text-sm cm:text-muted-foreground", children: R(r.from, r.to) })
        ] }),
        u && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e("div", { role: "group", "aria-label": "Reporting period", className: "commerce-dashboard-period", children: r.options.map((a) => /* @__PURE__ */ e(
            w,
            {
              type: "button",
              size: "sm",
              variant: a.value === r.key ? "default" : "ghost",
              "aria-pressed": a.value === r.key,
              onClick: () => F.router.get(l("commerce"), { period: a.value }, { preserveScroll: !0, preserveState: !0 }),
              children: a.label
            },
            a.value
          )) }),
          K && /* @__PURE__ */ e(w, { asChild: !0, variant: "outline", size: "sm", children: /* @__PURE__ */ e(h, { href: l(`commerce/reports/sales?period=${r.key}`), children: "View reports" }) })
        ] })
      ] }),
      /* @__PURE__ */ e("div", { className: "commerce-dashboard-kpis", children: g === void 0 ? Array.from({ length: 5 }, (a, b) => /* @__PURE__ */ e(P, { className: u && b === 0 ? "commerce-dashboard-sales-kpi" : void 0 }, b)) : g.map((a) => /* @__PURE__ */ e(U, { kpi: a, className: a.key === "total_sales" ? "commerce-dashboard-sales-kpi" : void 0 }, a.key)) }),
      u && /* @__PURE__ */ c("div", { className: "commerce-dashboard-grid", children: [
        /* @__PURE__ */ c(t, { className: "cm:min-w-0", children: [
          /* @__PURE__ */ c(o, { children: [
            /* @__PURE__ */ e(i, { children: "Sales trend" }),
            j && /* @__PURE__ */ c(T, { children: [
              "Compared with ",
              j
            ] })
          ] }),
          /* @__PURE__ */ e(n, { children: v === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-[280px] cm:animate-pulse cm:rounded-md cm:bg-muted" }) : v.some((a) => a.total !== 0 || (a.previous ?? 0) !== 0) ? /* @__PURE__ */ e(
            V,
            {
              label: p ? "Sales today and yesterday" : "Daily sales this period and the previous period",
              kind: p ? "bar" : "line",
              data: v,
              xKey: "date",
              height: 280,
              interpolation: "linear",
              formatX: I,
              format: W,
              formatAxis: (a) => Y(a),
              series: [
                { key: "total", label: p ? "Today" : "Current period", color: "var(--commerce-dashboard-current)" },
                { key: "previous", label: p ? "Yesterday" : "Previous period", color: "var(--commerce-dashboard-previous)", dashed: !0 }
              ]
            }
          ) : /* @__PURE__ */ e("div", { className: "cm:grid cm:min-h-[280px] cm:content-center", children: /* @__PURE__ */ e(S, { title: "No sales in these periods" }) }) })
        ] }),
        /* @__PURE__ */ c(t, { className: "cm:min-w-0", children: [
          /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(i, { children: "Top products" }) }),
          /* @__PURE__ */ e(n, { children: N === void 0 ? /* @__PURE__ */ e(C, { rows: 5 }) : N.length === 0 ? /* @__PURE__ */ e(S, { title: "No products sold this period" }) : /* @__PURE__ */ c("table", { className: "commerce-dashboard-table", children: [
            /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ c("tr", { children: [
              /* @__PURE__ */ e("th", { scope: "col", children: "Product" }),
              /* @__PURE__ */ e("th", { scope: "col", className: "commerce-dashboard-number", children: "Units" }),
              /* @__PURE__ */ e("th", { scope: "col", className: "commerce-dashboard-number", children: "Sales" })
            ] }) }),
            /* @__PURE__ */ e("tbody", { children: N.map((a) => /* @__PURE__ */ c("tr", { children: [
              /* @__PURE__ */ e("th", { scope: "row", children: a.href ? /* @__PURE__ */ e(h, { href: l(a.href), children: a.title }) : a.title }),
              /* @__PURE__ */ e("td", { className: "commerce-dashboard-number", children: a.units.toLocaleString() }),
              /* @__PURE__ */ e("td", { className: "commerce-dashboard-number cm:font-medium", children: a.revenue })
            ] }, a.product_id)) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ c("div", { className: "commerce-dashboard-grid commerce-dashboard-activity", "data-has-orders": s === void 0 || s.length > 0, children: [
      (s === void 0 || s.length > 0) && /* @__PURE__ */ c(t, { className: "cm:min-w-0", children: [
        /* @__PURE__ */ c(o, { className: "cm:flex cm:flex-row cm:flex-wrap cm:items-center cm:justify-between cm:gap-2", children: [
          /* @__PURE__ */ e(i, { children: "Recent orders" }),
          s && /* @__PURE__ */ e(w, { asChild: !0, size: "sm", variant: "outline", children: /* @__PURE__ */ e(h, { href: l("commerce/orders"), children: "View orders" }) })
        ] }),
        /* @__PURE__ */ e(n, { children: s === void 0 ? /* @__PURE__ */ e(C, { rows: 5 }) : /* @__PURE__ */ c("table", { className: "commerce-dashboard-table commerce-dashboard-orders", children: [
          /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ e("th", { scope: "col", children: "Order" }),
            /* @__PURE__ */ e("th", { scope: "col", className: "commerce-dashboard-order-customer", children: "Customer" }),
            /* @__PURE__ */ e("th", { scope: "col", className: "commerce-dashboard-order-date", children: "Placed" }),
            /* @__PURE__ */ e("th", { scope: "col", children: "Status" }),
            /* @__PURE__ */ e("th", { scope: "col", className: "commerce-dashboard-number", children: "Total" })
          ] }) }),
          /* @__PURE__ */ e("tbody", { children: s.map((a) => /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ c("th", { scope: "row", children: [
              /* @__PURE__ */ e(h, { href: l(a.href), children: a.number }),
              /* @__PURE__ */ e("span", { className: "commerce-dashboard-mobile-customer cm:text-xs cm:text-muted-foreground", children: a.customer })
            ] }),
            /* @__PURE__ */ e("td", { className: "commerce-dashboard-order-customer cm:text-muted-foreground", children: a.customer ?? "—" }),
            /* @__PURE__ */ e("td", { className: "commerce-dashboard-order-date cm:whitespace-nowrap cm:text-muted-foreground", children: a.placed_at ? new Date(a.placed_at).toLocaleDateString(void 0, { day: "numeric", month: "short" }) : "—" }),
            /* @__PURE__ */ e("td", { children: /* @__PURE__ */ e(L, { tone: $[a.status_key], children: a.status }) }),
            /* @__PURE__ */ e("td", { className: "commerce-dashboard-number cm:font-medium", children: a.total })
          ] }, a.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ c(t, { className: "cm:min-w-0", children: [
        /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(i, { children: "To do" }) }),
        /* @__PURE__ */ e(n, { children: x === void 0 ? /* @__PURE__ */ e(C, { rows: 2 }) : x.length === 0 ? /* @__PURE__ */ e(S, { title: "You’re caught up" }) : /* @__PURE__ */ e("ul", { className: "commerce-dashboard-tasks", children: x.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ c(h, { href: l(a.href), children: [
          /* @__PURE__ */ e("span", { children: a.label }),
          /* @__PURE__ */ e("strong", { children: a.count.toLocaleString() })
        ] }) }, a.key)) }) })
      ] })
    ] }),
    z.map(([a, b]) => /* @__PURE__ */ e(b, { ...y?.[a] }, a))
  ] });
}
function C({ rows: m }) {
  return /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-1", "aria-hidden": "true", children: Array.from({ length: m }, (d, f) => /* @__PURE__ */ c("div", { className: "cm:flex cm:h-10 cm:items-center cm:justify-between", children: [
    /* @__PURE__ */ e("span", { className: "cm:h-4 cm:w-40 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ e("span", { className: "cm:h-4 cm:w-12 cm:animate-pulse cm:rounded cm:bg-muted" })
  ] }, f)) });
}
export {
  G as default
};
