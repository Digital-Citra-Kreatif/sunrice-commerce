import { i as X, u as q, a as z, b as o, R as K, f as L, j as t, c as a, P as J, d as Q, l as C, K as U, C as Y, E as Z } from "./main-Bwk0AAzX.js";
const V = (r) => r.toLocaleString(void 0, { maximumFractionDigits: 0 });
function i(r, d) {
  return r == null || r === "" ? "—" : typeof r != "number" ? d === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(r)) ? (/* @__PURE__ */ new Date(`${r}T00:00:00`)).toLocaleDateString() : String(r) : d === "money" ? L(r) : d === "percent" ? `${r.toLocaleString(void 0, { maximumFractionDigits: 1 })}%` : V(r);
}
const S = (r) => r === "money" || r === "count" || r === "percent";
function ee({ report: r, reports: d, period: m, result: c, exportUrl: w }) {
  const {
    Card: h,
    CardContent: p,
    CardHeader: j,
    CardTitle: H,
    CardDescription: P,
    Button: T,
    Input: D,
    Label: s,
    Select: u,
    SelectContent: g,
    SelectItem: n,
    SelectTrigger: f,
    SelectValue: y,
    Table: B,
    TableBody: E,
    TableCell: F,
    TableHead: I,
    TableHeader: M,
    TableRow: v
  } = Q, { Link: R, router: $ } = X;
  q(), z([{ label: "Shop", href: o("commerce") }, { label: "Reports", href: o("commerce/reports") }, { label: r.label }]);
  const [b, A] = K.useState(m.from), [k, G] = K.useState(m.to), x = (e) => $.get(o(`commerce/reports/${r.key}`), { from: m.from, to: m.to, interval: m.interval, compare: m.compare, ...e }, { preserveScroll: !0 }), O = c.chart && c.columns.find((e) => e.key === c.chart?.series[0]?.key)?.kind === "money" ? (e) => L(e) : V;
  return /* @__PURE__ */ t("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:grid-cols-1 cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ a(
      J,
      {
        title: "Reports",
        description: r.description || void 0,
        actions: w ? /* @__PURE__ */ a(T, { asChild: !0, variant: "outline", children: /* @__PURE__ */ a("a", { href: w, children: "Export CSV" }) }) : void 0
      }
    ),
    /* @__PURE__ */ a("nav", { "aria-label": "Reports", className: "cm:flex cm:flex-wrap cm:gap-1", children: d.map((e) => /* @__PURE__ */ a(
      R,
      {
        href: o(`commerce/reports/${e.key}`),
        "aria-current": e.key === r.key ? "page" : void 0,
        className: C("cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm", e.key === r.key ? "cm:bg-primary cm:text-primary-foreground" : "cm:hover:bg-muted"),
        children: e.label
      },
      e.key
    )) }),
    r.usesDates && /* @__PURE__ */ a(h, { children: /* @__PURE__ */ t(p, { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3 cm:pt-6", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a(s, { htmlFor: "report-preset", children: "Period" }),
        /* @__PURE__ */ t(u, { value: m.preset ?? "custom", onValueChange: (e) => e !== "custom" && $.get(o(`commerce/reports/${r.key}`), { period: e, compare: m.compare }, { preserveScroll: !0 }), children: [
          /* @__PURE__ */ a(f, { id: "report-preset", className: "cm:w-44", children: /* @__PURE__ */ a(y, {}) }),
          /* @__PURE__ */ t(g, { children: [
            Object.entries(m.presets).map(([e, N]) => /* @__PURE__ */ a(n, { value: e, children: N }, e)),
            /* @__PURE__ */ a(n, { value: "custom", children: "Custom" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t("form", { className: "cm:flex cm:flex-wrap cm:items-end cm:gap-3", onSubmit: (e) => {
        e.preventDefault(), x({ from: b, to: k });
      }, children: [
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ a(s, { htmlFor: "report-from", children: "From" }),
          /* @__PURE__ */ a(D, { id: "report-from", type: "date", value: b, max: k, onChange: (e) => A(e.target.value) })
        ] }),
        /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ a(s, { htmlFor: "report-to", children: "To" }),
          /* @__PURE__ */ a(D, { id: "report-to", type: "date", value: k, min: b, onChange: (e) => G(e.target.value) })
        ] }),
        /* @__PURE__ */ a(T, { type: "submit", variant: "outline", children: "Apply" })
      ] }),
      /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a(s, { htmlFor: "report-compare", children: "Compare with" }),
        /* @__PURE__ */ t(u, { value: m.compare, onValueChange: (e) => x({ compare: e }), children: [
          /* @__PURE__ */ a(f, { id: "report-compare", className: "cm:w-44", children: /* @__PURE__ */ a(y, {}) }),
          /* @__PURE__ */ t(g, { children: [
            /* @__PURE__ */ a(n, { value: "previous", children: "Previous period" }),
            /* @__PURE__ */ a(n, { value: "year", children: "Same period last year" }),
            /* @__PURE__ */ a(n, { value: "none", children: "Nothing" })
          ] })
        ] })
      ] }),
      r.key === "sales" && /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a(s, { htmlFor: "report-interval", children: "Group by" }),
        /* @__PURE__ */ t(u, { value: m.interval, onValueChange: (e) => x({ interval: e }), children: [
          /* @__PURE__ */ a(f, { id: "report-interval", className: "cm:w-32", children: /* @__PURE__ */ a(y, {}) }),
          /* @__PURE__ */ t(g, { children: [
            /* @__PURE__ */ a(n, { value: "day", children: "Day" }),
            /* @__PURE__ */ a(n, { value: "week", children: "Week" }),
            /* @__PURE__ */ a(n, { value: "month", children: "Month" })
          ] })
        ] })
      ] })
    ] }) }),
    c.summary.length > 0 && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: c.summary.map((e) => /* @__PURE__ */ a(U, { kpi: { key: e.key, label: e.label, value: i(e.value, e.kind), change: e.change } }, e.key)) }),
    c.chart && c.chart.data.length > 0 && /* @__PURE__ */ t(h, { children: [
      /* @__PURE__ */ t(j, { children: [
        /* @__PURE__ */ a(H, { children: r.label }),
        r.usesDates && /* @__PURE__ */ t(P, { children: [
          i(m.from, "date"),
          " – ",
          i(m.to, "date")
        ] })
      ] }),
      /* @__PURE__ */ a(p, { children: /* @__PURE__ */ a(
        Y,
        {
          label: r.label,
          kind: c.chart.kind,
          data: c.chart.data,
          xKey: c.chart.xKey,
          series: c.chart.series,
          format: O,
          formatX: c.chart.xKey === "date" ? (e) => i(e, "date") : void 0
        }
      ) })
    ] }),
    /* @__PURE__ */ a(h, { children: /* @__PURE__ */ a(p, { className: "cm:pt-6", children: c.rows.length === 0 ? /* @__PURE__ */ a(Z, { title: "Nothing to show", description: r.usesDates ? "There is no data for this period." : "Nothing needs attention." }) : /* @__PURE__ */ a("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ t(B, { children: [
      /* @__PURE__ */ a(M, { children: /* @__PURE__ */ a(v, { children: c.columns.map((e) => /* @__PURE__ */ a(I, { className: S(e.kind) ? "cm:text-right" : void 0, children: e.label }, e.key)) }) }),
      /* @__PURE__ */ t(E, { children: [
        c.rows.map((e, N) => /* @__PURE__ */ a(v, { children: c.columns.map((l, W) => /* @__PURE__ */ a(F, { className: C(S(l.kind) && "cm:text-right cm:tabular-nums"), children: W === 0 && e.href ? /* @__PURE__ */ a(R, { href: o(e.href), className: "cm:underline-offset-2 cm:hover:underline", children: i(e[l.key], l.kind) }) : i(e[l.key], l.kind) }, l.key)) }, N)),
        c.totals && /* @__PURE__ */ a(v, { className: "cm:font-semibold", children: c.columns.map((e) => /* @__PURE__ */ a(F, { className: C(S(e.kind) && "cm:text-right cm:tabular-nums"), children: i(c.totals?.[e.key], e.kind) }, e.key)) })
      ] })
    ] }) }) }) })
  ] });
}
export {
  ee as default
};
