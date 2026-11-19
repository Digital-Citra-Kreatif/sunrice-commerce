import { j as n, c, p as D, U as fe, i as ve, q as be, r as ke } from "./main-fyJJTcG1.js";
const W = [10, 25, 50, 100, 200];
function ye(t, h = {}) {
  const r = { ...t, ...h }, u = {};
  r.search && (u.search = r.search);
  const v = Object.fromEntries(Object.entries(r.filters ?? {}).filter(([, C]) => C !== ""));
  return Object.keys(v).length > 0 && (u.filters = v), r.sort && (u.sort = (r.direction === "desc" ? "-" : "") + r.sort), r.perPage && (u.per_page = r.perPage), h.page && h.page > 1 && (u.page = h.page), u;
}
function X(t) {
  return t == null || t === "" ? "—" : typeof t == "boolean" ? t ? "Yes" : "No" : String(t);
}
function d({ className: t, children: h }) {
  return /* @__PURE__ */ c(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: t ?? "cm:size-4",
      "aria-hidden": "true",
      children: h
    }
  );
}
const xe = (t) => /* @__PURE__ */ n(d, { ...t, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), we = (t) => /* @__PURE__ */ n(d, { ...t, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), Ne = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), Ce = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Se = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Me = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Ie = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Pe = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), Te = (t) => /* @__PURE__ */ c(d, { ...t, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), { router: L, Link: _e } = ve, ze = fe, De = ke, j = "__all", Y = 3;
function je(t) {
  const {
    Input: h,
    Button: r,
    Card: u,
    Checkbox: v,
    Table: C,
    TableHeader: J,
    TableBody: Z,
    TableRow: S,
    TableHead: A,
    TableCell: M,
    Select: B,
    SelectTrigger: R,
    SelectValue: U,
    SelectContent: V,
    SelectItem: I,
    DropdownMenu: ee,
    DropdownMenuTrigger: ce,
    DropdownMenuContent: te,
    DropdownMenuLabel: ne,
    DropdownMenuCheckboxItem: le,
    Popover: ae,
    PopoverTrigger: re,
    PopoverContent: ie
  } = ze, { meta: i, rows: l } = t, [E, $] = D(i.search ?? ""), [f, k] = D([]), F = t.visibleColumns !== void 0 && t.tableKey !== void 0, [y, se] = D(t.visibleColumns), oe = De(t.tableKey ?? "commerce-table", F ? { columns: t.visibleColumns } : null), me = (e, s) => {
    const a = t.columns.map((o) => o.key).filter((o) => o === e ? s : (y ?? []).includes(o));
    a.length !== 0 && (se(a), oe.setColumns(a));
  }, x = y ? t.columns.filter((e) => y.includes(e.key)) : t.columns, H = x.filter((e) => e.type === "badge" && t.mobileBadgeColumns?.includes(e.key)), w = (t.bulkActions ?? []).length > 0 && t.bulkUrl !== void 0, P = l.data.map((e) => e.id).filter((e) => e !== void 0), T = t.filters ?? [], de = T.slice(0, Y), _ = T.slice(Y), O = (e) => (i.filters?.[e] ?? "") !== "", q = _.filter((e) => O(e.key)).length, K = T.some((e) => O(e.key)) || !!i.search, p = (e) => {
    k([]), L.get(window.location.pathname, ye(i, e), { preserveState: !0, preserveScroll: !0, replace: !0 });
  }, he = (e, s) => p({ filters: { ...i.filters, [e]: s === j ? "" : s } }), ue = (e) => p({ sort: e.key, direction: i.sort === e.key && i.direction === "asc" ? "desc" : "asc" }), ge = (e) => {
    e.confirm && !window.confirm(e.confirm) || L.post(t.bulkUrl, { action: e.key, ids: f }, { preserveScroll: !0, onSuccess: () => k([]) });
  }, G = (e, s) => /* @__PURE__ */ n(B, { value: i.filters?.[e.key] || j, onValueChange: (a) => he(e.key, a), children: [
    /* @__PURE__ */ c(R, { className: s, "aria-label": e.label, children: /* @__PURE__ */ c(U, {}) }),
    /* @__PURE__ */ n(V, { children: [
      /* @__PURE__ */ n(I, { value: j, children: [
        e.label,
        ": all"
      ] }),
      e.options.filter((a) => a.value !== "").map((a) => /* @__PURE__ */ c(I, { value: a.value, children: a.label }, a.value))
    ] })
  ] }, e.key), pe = x.length + (w ? 1 : 0);
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-4", children: [
    /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
      /* @__PURE__ */ n("form", { className: "cm:relative cm:w-full cm:max-w-xs", role: "search", onSubmit: (e) => {
        e.preventDefault(), p({ search: E });
      }, children: [
        /* @__PURE__ */ c(xe, { className: "cm:pointer-events-none cm:absolute cm:top-1/2 cm:left-2.5 cm:size-4 cm:-translate-y-1/2 cm:text-muted-foreground" }),
        /* @__PURE__ */ c(
          h,
          {
            type: "search",
            className: "cm:pl-9",
            value: E,
            "aria-label": "Search",
            placeholder: t.searchPlaceholder ?? "Search…",
            onChange: (e) => $(e.target.value)
          }
        )
      ] }),
      de.map((e) => G(e, "cm:w-40")),
      _.length > 0 && /* @__PURE__ */ n(ae, { children: [
        /* @__PURE__ */ c(re, { asChild: !0, children: /* @__PURE__ */ n(r, { variant: "outline", children: [
          /* @__PURE__ */ c(Ne, {}),
          " More filters",
          q > 0 ? ` (${q})` : ""
        ] }) }),
        /* @__PURE__ */ c(ie, { align: "start", className: "cm:grid cm:w-80 cm:gap-2", children: _.map((e) => /* @__PURE__ */ n("label", { className: "cm:grid cm:gap-1 cm:text-sm", children: [
          /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: e.label }),
          G(e, "cm:w-full")
        ] }, e.key)) })
      ] }),
      K && /* @__PURE__ */ n(r, { variant: "ghost", onClick: () => {
        $(""), p({ search: "", filters: {} });
      }, children: [
        /* @__PURE__ */ c(Te, {}),
        " Clear"
      ] }),
      F && /* @__PURE__ */ n(ee, { children: [
        /* @__PURE__ */ c(ce, { asChild: !0, children: /* @__PURE__ */ n(r, { variant: "outline", className: "cm:ml-auto", children: [
          /* @__PURE__ */ c(we, {}),
          " Columns"
        ] }) }),
        /* @__PURE__ */ n(te, { align: "end", children: [
          /* @__PURE__ */ c(ne, { children: "Show columns" }),
          t.columns.map((e) => /* @__PURE__ */ c(
            le,
            {
              checked: (y ?? []).includes(e.key),
              onSelect: (s) => s.preventDefault(),
              onCheckedChange: (s) => me(e.key, s),
              children: e.label
            },
            e.key
          ))
        ] })
      ] })
    ] }),
    w && f.length > 0 && /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:text-sm", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        f.length,
        " selected"
      ] }),
      t.bulkActions.map((e) => /* @__PURE__ */ c(r, { type: "button", size: "sm", variant: e.variant === "destructive" ? "destructive" : "outline", onClick: () => ge(e), children: e.label }, e.key))
    ] }),
    /* @__PURE__ */ n(u, { className: "cm:gap-0 cm:overflow-hidden cm:py-0", children: [
      /* @__PURE__ */ c("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ n(C, { children: [
        /* @__PURE__ */ c(J, { className: "cm:bg-muted/60", children: /* @__PURE__ */ n(S, { className: "cm:hover:bg-transparent", children: [
          w && /* @__PURE__ */ c(A, { className: "cm:w-8", children: /* @__PURE__ */ c(
            v,
            {
              "aria-label": "Select all rows",
              checked: P.length > 0 && f.length === P.length,
              onCheckedChange: (e) => k(e ? P : [])
            }
          ) }),
          x.map((e) => /* @__PURE__ */ c(A, { "aria-sort": i.sort === e.key ? i.direction === "asc" ? "ascending" : "descending" : void 0, children: e.sortable ? /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => ue(e),
              className: "cm:-ml-2 cm:inline-flex cm:h-8 cm:items-center cm:gap-1 cm:rounded-md cm:px-2 cm:hover:bg-accent cm:hover:text-accent-foreground",
              children: [
                e.label,
                i.sort === e.key ? i.direction === "asc" ? /* @__PURE__ */ c(Ce, { className: "cm:size-3" }) : /* @__PURE__ */ c(Se, { className: "cm:size-3" }) : /* @__PURE__ */ c(Me, { className: "cm:size-3 cm:opacity-40" })
              ]
            }
          ) : e.label }, e.key))
        ] }) }),
        /* @__PURE__ */ n(Z, { children: [
          l.data.length === 0 && /* @__PURE__ */ c(S, { className: "cm:hover:bg-transparent", children: /* @__PURE__ */ c(M, { colSpan: pe, className: "cm:h-24 cm:text-center cm:text-muted-foreground", children: K ? "Nothing matches." : "Nothing here yet." }) }),
          l.data.map((e, s) => {
            const a = t.rowHref?.(e) ?? null, o = e.id, z = t.onRowClick ? () => t.onRowClick(e) : a ? () => L.visit(a) : void 0;
            return /* @__PURE__ */ n(
              S,
              {
                "data-state": o !== void 0 && f.includes(o) ? "selected" : void 0,
                className: z ? "cm:cursor-pointer" : void 0,
                onClick: z ? (m) => {
                  m.target.closest('a, button, input, label, [role="checkbox"]') || z();
                } : void 0,
                children: [
                  w && /* @__PURE__ */ c(M, { children: o !== void 0 && /* @__PURE__ */ c(
                    v,
                    {
                      "aria-label": "Select row",
                      checked: f.includes(o),
                      onCheckedChange: (m) => k((b) => m ? [...b, o] : b.filter((N) => N !== o))
                    }
                  ) }),
                  x.map((m, b) => {
                    const N = t.renderCell?.(e, m), Q = N === void 0 ? X(e[m.key]) : N;
                    return /* @__PURE__ */ n(M, { className: "cm:whitespace-nowrap", children: [
                      a && b === 0 ? /* @__PURE__ */ c(_e, { href: a, className: "cm:font-medium cm:underline-offset-4 cm:hover:underline", children: Q }) : Q,
                      b === 0 && H.some((g) => g.key !== m.key && e[g.key] != null) && /* @__PURE__ */ c("div", { "aria-hidden": "true", "data-mobile-badges": !0, className: "cm:mt-1 cm:flex cm:max-w-48 cm:flex-wrap cm:gap-1 cm:md:hidden", children: H.map((g) => g.key !== m.key && e[g.key] != null && /* @__PURE__ */ c(be, { children: t.renderCell?.(e, g) ?? X(e[g.key]) }, g.key)) })
                    ] }, m.key);
                  })
                ]
              },
              String(o ?? s)
            );
          })
        ] })
      ] }) }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-4 cm:border-t cm:px-6 cm:py-3 cm:text-sm cm:text-muted-foreground", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-4", children: [
          /* @__PURE__ */ c("span", { children: l.total === 0 ? "No rows" : `${l.from}–${l.to} of ${l.total}` }),
          l.total > W[0] && /* @__PURE__ */ n(B, { value: String(i.perPage), onValueChange: (e) => p({ perPage: Number(e) }), children: [
            /* @__PURE__ */ c(R, { className: "cm:h-8 cm:w-auto", "aria-label": "Rows per page", children: /* @__PURE__ */ c(U, {}) }),
            /* @__PURE__ */ c(V, { children: W.map((e) => /* @__PURE__ */ n(I, { value: String(e), children: [
              e,
              " per page"
            ] }, e)) })
          ] })
        ] }),
        l.last_page > 1 && /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ n("span", { children: [
            "Page ",
            l.current_page,
            " of ",
            l.last_page
          ] }),
          /* @__PURE__ */ c(
            r,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "cm:size-8",
              "aria-label": "Previous page",
              disabled: l.current_page <= 1,
              onClick: () => p({ page: l.current_page - 1 }),
              children: /* @__PURE__ */ c(Ie, {})
            }
          ),
          /* @__PURE__ */ c(
            r,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "cm:size-8",
              "aria-label": "Next page",
              disabled: l.current_page >= l.last_page,
              onClick: () => p({ page: l.current_page + 1 }),
              children: /* @__PURE__ */ c(Pe, {})
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  je as D
};
