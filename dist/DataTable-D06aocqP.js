import { o as T, j as r, c as t, U as z, i as D } from "./main-p2UnqZyH.js";
const E = [10, 25, 50, 100, 200];
function H(c, m = {}) {
  const l = { ...c, ...m }, i = {};
  l.search && (i.search = l.search);
  const g = Object.fromEntries(Object.entries(l.filters ?? {}).filter(([, v]) => v !== ""));
  return Object.keys(g).length > 0 && (i.filters = g), l.sort && (i.sort = (l.direction === "desc" ? "-" : "") + l.sort), l.perPage && (i.per_page = l.perPage), m.page && m.page > 1 && (i.page = m.page), i;
}
function O(c) {
  return c == null || c === "" ? "—" : typeof c == "boolean" ? c ? "Yes" : "No" : String(c);
}
const { router: j, Link: $ } = D, q = z;
function I(c) {
  const { Input: m, Button: l, Checkbox: i, Table: g, TableHeader: v, TableBody: B, TableRow: x, TableHead: S, TableCell: y } = q, { meta: n, rows: a } = c, [P, R] = T(n.search ?? ""), [u, b] = T([]), N = c.visibleColumns ? c.columns.filter((e) => c.visibleColumns.includes(e.key)) : c.columns, f = (c.bulkActions ?? []).length > 0 && c.bulkUrl !== void 0, C = a.data.map((e) => e.id).filter((e) => e !== void 0), d = (e) => {
    b([]), j.get(window.location.pathname, H(n, e), { preserveState: !0, preserveScroll: !0, replace: !0 });
  }, A = (e) => d({ sort: e.key, direction: n.sort === e.key && n.direction === "asc" ? "desc" : "asc" }), U = (e) => {
    e.confirm && !window.confirm(e.confirm) || j.post(c.bulkUrl, { action: e.key, ids: u }, { preserveScroll: !0, onSuccess: () => b([]) });
  };
  return /* @__PURE__ */ r("div", { className: "cm:grid cm:gap-3", children: [
    /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
      /* @__PURE__ */ t("form", { className: "cm:min-w-48 cm:flex-1", role: "search", onSubmit: (e) => {
        e.preventDefault(), d({ search: P });
      }, children: /* @__PURE__ */ t(
        m,
        {
          type: "search",
          value: P,
          "aria-label": "Search",
          placeholder: c.searchPlaceholder ?? "Search…",
          onChange: (e) => R(e.target.value)
        }
      ) }),
      (c.filters ?? []).map((e) => /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:gap-1.5 cm:text-sm", children: [
        /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: e.label }),
        /* @__PURE__ */ r(
          "select",
          {
            className: "cm:h-9 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2 cm:text-sm",
            value: n.filters?.[e.key] ?? "",
            onChange: (s) => d({ filters: { ...n.filters, [e.key]: s.target.value } }),
            children: [
              /* @__PURE__ */ t("option", { value: "", children: "All" }),
              e.options.map((s) => /* @__PURE__ */ t("option", { value: s.value, children: s.label }, s.value))
            ]
          }
        )
      ] }, e.key))
    ] }),
    f && u.length > 0 && /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:rounded-md cm:bg-muted/50 cm:px-3 cm:py-2 cm:text-sm", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ r("span", { children: [
        u.length,
        " selected"
      ] }),
      c.bulkActions.map((e) => /* @__PURE__ */ t(l, { type: "button", size: "sm", variant: e.variant === "destructive" ? "destructive" : "outline", onClick: () => U(e), children: e.label }, e.key))
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:overflow-x-auto cm:rounded-lg cm:border", children: /* @__PURE__ */ r(g, { children: [
      /* @__PURE__ */ t(v, { children: /* @__PURE__ */ r(x, { children: [
        f && /* @__PURE__ */ t(S, { className: "cm:w-10", children: /* @__PURE__ */ t(
          i,
          {
            "aria-label": "Select all",
            checked: C.length > 0 && u.length === C.length,
            onCheckedChange: (e) => b(e ? C : [])
          }
        ) }),
        N.map((e) => /* @__PURE__ */ t(S, { "aria-sort": n.sort === e.key ? n.direction === "asc" ? "ascending" : "descending" : void 0, children: e.sortable ? /* @__PURE__ */ r("button", { type: "button", className: "cm:inline-flex cm:items-center cm:gap-1 cm:font-medium cm:hover:text-foreground", onClick: () => A(e), children: [
          e.label,
          n.sort === e.key ? n.direction === "asc" ? " ↑" : " ↓" : ""
        ] }) : e.label }, e.key))
      ] }) }),
      /* @__PURE__ */ r(B, { children: [
        a.data.length === 0 && /* @__PURE__ */ t(x, { children: /* @__PURE__ */ t(y, { colSpan: N.length + (f ? 1 : 0), className: "cm:py-10 cm:text-center cm:text-muted-foreground", children: "Nothing here yet." }) }),
        a.data.map((e, s) => {
          const w = c.rowHref?.(e) ?? null, h = e.id;
          return /* @__PURE__ */ r(
            x,
            {
              className: w || c.onRowClick ? "cm:cursor-pointer cm:hover:bg-muted/40" : void 0,
              onClick: c.onRowClick ? () => c.onRowClick(e) : void 0,
              children: [
                f && /* @__PURE__ */ t(y, { onClick: (o) => o.stopPropagation(), children: h !== void 0 && /* @__PURE__ */ t(
                  i,
                  {
                    "aria-label": "Select row",
                    checked: u.includes(h),
                    onCheckedChange: (o) => b((p) => o ? [...p, h] : p.filter((k) => k !== h))
                  }
                ) }),
                N.map((o, p) => {
                  const k = c.renderCell?.(e, o), _ = k === void 0 ? O(e[o.key]) : k;
                  return /* @__PURE__ */ t(y, { children: w && p === 0 ? /* @__PURE__ */ t($, { href: w, className: "cm:font-medium cm:hover:underline", children: _ }) : _ }, o.key);
                })
              ]
            },
            String(h ?? s)
          );
        })
      ] })
    ] }) }),
    /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:text-sm cm:text-muted-foreground", children: [
      /* @__PURE__ */ t("span", { children: a.total === 0 ? "No results" : `${a.from}–${a.to} of ${a.total}` }),
      /* @__PURE__ */ r("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        /* @__PURE__ */ r("label", { className: "cm:flex cm:items-center cm:gap-1.5", children: [
          /* @__PURE__ */ t("span", { children: "Per page" }),
          /* @__PURE__ */ t("select", { className: "cm:h-8 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2", value: n.perPage, onChange: (e) => d({ perPage: Number(e.target.value) }), children: E.map((e) => /* @__PURE__ */ t("option", { value: e, children: e }, e)) })
        ] }),
        /* @__PURE__ */ t(l, { type: "button", size: "sm", variant: "outline", disabled: a.current_page <= 1, onClick: () => d({ page: a.current_page - 1 }), children: "Previous" }),
        /* @__PURE__ */ r("span", { children: [
          "Page ",
          a.current_page,
          " of ",
          Math.max(1, a.last_page)
        ] }),
        /* @__PURE__ */ t(l, { type: "button", size: "sm", variant: "outline", disabled: a.current_page >= a.last_page, onClick: () => d({ page: a.current_page + 1 }), children: "Next" })
      ] })
    ] })
  ] });
}
export {
  I as D
};
