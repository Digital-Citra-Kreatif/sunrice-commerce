import { o as P, j as l, c as t, U as O, i as K, p as q } from "./main-Bwk0AAzX.js";
const G = [10, 25, 50, 100, 200];
function I(c, u = {}) {
  const r = { ...c, ...u }, m = {};
  r.search && (m.search = r.search);
  const b = Object.fromEntries(Object.entries(r.filters ?? {}).filter(([, y]) => y !== ""));
  return Object.keys(b).length > 0 && (m.filters = b), r.sort && (m.sort = (r.direction === "desc" ? "-" : "") + r.sort), r.perPage && (m.per_page = r.perPage), u.page && u.page > 1 && (m.page = u.page), m;
}
function L(c) {
  return c == null || c === "" ? "—" : typeof c == "boolean" ? c ? "Yes" : "No" : String(c);
}
const { router: R, Link: M } = K, Q = O, Y = q;
function J(c) {
  const { Input: u, Button: r, Checkbox: m, Table: b, TableHeader: y, TableBody: z, TableRow: C, TableHead: T, TableCell: N } = Q, { meta: a, rows: n } = c, [_, A] = P(a.search ?? ""), [g, f] = P([]), j = c.visibleColumns !== void 0 && c.tableKey !== void 0, [p, U] = P(c.visibleColumns), $ = Y(c.tableKey ?? "commerce-table", j ? { columns: c.visibleColumns } : null), D = (e, i) => {
    const o = c.columns.map((s) => s.key).filter((s) => s === e ? i : (p ?? []).includes(s));
    o.length !== 0 && (U(o), $.setColumns(o));
  }, w = p ? c.columns.filter((e) => p.includes(e.key)) : c.columns, k = (c.bulkActions ?? []).length > 0 && c.bulkUrl !== void 0, S = n.data.map((e) => e.id).filter((e) => e !== void 0), h = (e) => {
    f([]), R.get(window.location.pathname, I(a, e), { preserveState: !0, preserveScroll: !0, replace: !0 });
  }, E = (e) => h({ sort: e.key, direction: a.sort === e.key && a.direction === "asc" ? "desc" : "asc" }), H = (e) => {
    e.confirm && !window.confirm(e.confirm) || R.post(c.bulkUrl, { action: e.key, ids: g }, { preserveScroll: !0, onSuccess: () => f([]) });
  };
  return /* @__PURE__ */ l("div", { className: "cm:grid cm:gap-3", children: [
    /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
      /* @__PURE__ */ t("form", { className: "cm:min-w-48 cm:flex-1", role: "search", onSubmit: (e) => {
        e.preventDefault(), h({ search: _ });
      }, children: /* @__PURE__ */ t(
        u,
        {
          type: "search",
          value: _,
          "aria-label": "Search",
          placeholder: c.searchPlaceholder ?? "Search…",
          onChange: (e) => A(e.target.value)
        }
      ) }),
      j && /* @__PURE__ */ l("details", { className: "cm:relative cm:text-sm", children: [
        /* @__PURE__ */ t("summary", { className: "cm:cursor-pointer cm:rounded-md cm:border cm:border-input cm:px-3 cm:py-1.5", children: "Columns" }),
        /* @__PURE__ */ t("div", { className: "cm:absolute cm:right-0 cm:z-10 cm:mt-1 cm:grid cm:min-w-48 cm:gap-1.5 cm:rounded-md cm:border cm:bg-background cm:p-3 cm:shadow-md", role: "group", "aria-label": "Columns", children: c.columns.map((e) => /* @__PURE__ */ l("label", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ t("input", { type: "checkbox", checked: (p ?? []).includes(e.key), onChange: (i) => D(e.key, i.target.checked) }),
          e.label
        ] }, e.key)) })
      ] }),
      (c.filters ?? []).map((e) => /* @__PURE__ */ l("label", { className: "cm:flex cm:items-center cm:gap-1.5 cm:text-sm", children: [
        /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: e.label }),
        /* @__PURE__ */ l(
          "select",
          {
            className: "cm:h-9 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2 cm:text-sm",
            value: a.filters?.[e.key] ?? "",
            onChange: (i) => h({ filters: { ...a.filters, [e.key]: i.target.value } }),
            children: [
              /* @__PURE__ */ t("option", { value: "", children: "All" }),
              e.options.map((i) => /* @__PURE__ */ t("option", { value: i.value, children: i.label }, i.value))
            ]
          }
        )
      ] }, e.key))
    ] }),
    k && g.length > 0 && /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:rounded-md cm:bg-muted/50 cm:px-3 cm:py-2 cm:text-sm", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ l("span", { children: [
        g.length,
        " selected"
      ] }),
      c.bulkActions.map((e) => /* @__PURE__ */ t(r, { type: "button", size: "sm", variant: e.variant === "destructive" ? "destructive" : "outline", onClick: () => H(e), children: e.label }, e.key))
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:overflow-x-auto cm:rounded-lg cm:border", children: /* @__PURE__ */ l(b, { children: [
      /* @__PURE__ */ t(y, { children: /* @__PURE__ */ l(C, { children: [
        k && /* @__PURE__ */ t(T, { className: "cm:w-10", children: /* @__PURE__ */ t(
          m,
          {
            "aria-label": "Select all",
            checked: S.length > 0 && g.length === S.length,
            onCheckedChange: (e) => f(e ? S : [])
          }
        ) }),
        w.map((e) => /* @__PURE__ */ t(T, { "aria-sort": a.sort === e.key ? a.direction === "asc" ? "ascending" : "descending" : void 0, children: e.sortable ? /* @__PURE__ */ l("button", { type: "button", className: "cm:inline-flex cm:items-center cm:gap-1 cm:font-medium cm:hover:text-foreground", onClick: () => E(e), children: [
          e.label,
          a.sort === e.key ? a.direction === "asc" ? " ↑" : " ↓" : ""
        ] }) : e.label }, e.key))
      ] }) }),
      /* @__PURE__ */ l(z, { children: [
        n.data.length === 0 && /* @__PURE__ */ t(C, { children: /* @__PURE__ */ t(N, { colSpan: w.length + (k ? 1 : 0), className: "cm:py-10 cm:text-center cm:text-muted-foreground", children: "Nothing here yet." }) }),
        n.data.map((e, i) => {
          const o = c.rowHref?.(e) ?? null, s = e.id;
          return /* @__PURE__ */ l(
            C,
            {
              className: o || c.onRowClick ? "cm:cursor-pointer cm:hover:bg-muted/40" : void 0,
              onClick: c.onRowClick ? () => c.onRowClick(e) : void 0,
              children: [
                k && /* @__PURE__ */ t(N, { onClick: (d) => d.stopPropagation(), children: s !== void 0 && /* @__PURE__ */ t(
                  m,
                  {
                    "aria-label": "Select row",
                    checked: g.includes(s),
                    onCheckedChange: (d) => f((v) => d ? [...v, s] : v.filter((x) => x !== s))
                  }
                ) }),
                w.map((d, v) => {
                  const x = c.renderCell?.(e, d), B = x === void 0 ? L(e[d.key]) : x;
                  return /* @__PURE__ */ t(N, { children: o && v === 0 ? /* @__PURE__ */ t(M, { href: o, className: "cm:font-medium cm:hover:underline", children: B }) : B }, d.key);
                })
              ]
            },
            String(s ?? i)
          );
        })
      ] })
    ] }) }),
    /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:text-sm cm:text-muted-foreground", children: [
      /* @__PURE__ */ t("span", { children: n.total === 0 ? "No results" : `${n.from}–${n.to} of ${n.total}` }),
      /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        /* @__PURE__ */ l("label", { className: "cm:flex cm:items-center cm:gap-1.5", children: [
          /* @__PURE__ */ t("span", { children: "Per page" }),
          /* @__PURE__ */ t("select", { className: "cm:h-8 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2", value: a.perPage, onChange: (e) => h({ perPage: Number(e.target.value) }), children: G.map((e) => /* @__PURE__ */ t("option", { value: e, children: e }, e)) })
        ] }),
        /* @__PURE__ */ t(r, { type: "button", size: "sm", variant: "outline", disabled: n.current_page <= 1, onClick: () => h({ page: n.current_page - 1 }), children: "Previous" }),
        /* @__PURE__ */ l("span", { children: [
          "Page ",
          n.current_page,
          " of ",
          Math.max(1, n.last_page)
        ] }),
        /* @__PURE__ */ t(r, { type: "button", size: "sm", variant: "outline", disabled: n.current_page >= n.last_page, onClick: () => h({ page: n.current_page + 1 }), children: "Next" })
      ] })
    ] })
  ] });
}
export {
  J as D
};
