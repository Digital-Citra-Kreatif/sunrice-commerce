import { q as z, j as l, b as c, r as fe, U as be, s as ve, X as pe, v as ke, A as ye, w as xe, x as Ne, i as Ce, y as we, z as Se, B as Ie, D as Pe } from "./main-My8PzgVe.js";
const G = [10, 25, 50, 100, 200];
function Te(t, g = {}) {
  const r = { ...t, ...g }, d = {};
  r.search && (d.search = r.search);
  const b = Object.fromEntries(Object.entries(r.filters ?? {}).filter(([, C]) => C !== ""));
  return Object.keys(b).length > 0 && (d.filters = b), r.sort && (d.sort = (r.direction === "desc" ? "-" : "") + r.sort), r.perPage && (d.per_page = r.perPage), g.page && g.page > 1 && (d.page = g.page), d;
}
function Q(t) {
  return t == null || t === "" ? "—" : typeof t == "boolean" ? t ? "Yes" : "No" : String(t);
}
const { router: A, Link: _e } = Ce, De = be, ze = Pe, B = "__all", Y = 3;
function Be(t) {
  const {
    Input: g,
    Button: r,
    Card: d,
    Checkbox: b,
    Table: C,
    TableHeader: J,
    TableBody: W,
    TableRow: w,
    TableHead: j,
    TableCell: S,
    Select: L,
    SelectTrigger: M,
    SelectValue: R,
    SelectContent: U,
    SelectItem: I,
    DropdownMenu: Z,
    DropdownMenuTrigger: ee,
    DropdownMenuContent: ce,
    DropdownMenuLabel: te,
    DropdownMenuCheckboxItem: le,
    Popover: ae,
    PopoverTrigger: ne,
    PopoverContent: re
  } = De, { meta: s, rows: a } = t, [E, $] = z(s.search ?? ""), [f, p] = z([]), F = t.visibleColumns !== void 0 && t.tableKey !== void 0, [k, se] = z(t.visibleColumns), ie = ze(t.tableKey ?? "commerce-table", F ? { columns: t.visibleColumns } : null), oe = (e, i) => {
    const n = t.columns.map((o) => o.key).filter((o) => o === e ? i : (k ?? []).includes(o));
    n.length !== 0 && (se(n), ie.setColumns(n));
  }, y = k ? t.columns.filter((e) => k.includes(e.key)) : t.columns, H = y.filter((e) => e.type === "badge" && t.mobileBadgeColumns?.includes(e.key)), x = (t.bulkActions ?? []).length > 0 && t.bulkUrl !== void 0, P = a.data.map((e) => e.id).filter((e) => e !== void 0), T = t.filters ?? [], me = T.slice(0, Y), _ = T.slice(Y), O = (e) => (s.filters?.[e] ?? "") !== "", V = _.filter((e) => O(e.key)).length, q = T.some((e) => O(e.key)) || !!s.search, u = (e) => {
    p([]), A.get(window.location.pathname, Te(s, e), { preserveState: !0, preserveScroll: !0, replace: !0 });
  }, de = (e, i) => u({ filters: { ...s.filters, [e]: i === B ? "" : i } }), he = (e) => u({ sort: e.key, direction: s.sort === e.key && s.direction === "asc" ? "desc" : "asc" }), ue = (e) => {
    e.confirm && !window.confirm(e.confirm) || A.post(t.bulkUrl, { action: e.key, ids: f }, { preserveScroll: !0, onSuccess: () => p([]) });
  }, K = (e, i) => /* @__PURE__ */ l(L, { value: s.filters?.[e.key] || B, onValueChange: (n) => de(e.key, n), children: [
    /* @__PURE__ */ c(M, { className: i, "aria-label": e.label, children: /* @__PURE__ */ c(R, {}) }),
    /* @__PURE__ */ l(U, { children: [
      /* @__PURE__ */ l(I, { value: B, children: [
        e.label,
        ": all"
      ] }),
      e.options.filter((n) => n.value !== "").map((n) => /* @__PURE__ */ c(I, { value: n.value, children: n.label }, n.value))
    ] })
  ] }, e.key), ge = y.length + (x ? 1 : 0);
  return /* @__PURE__ */ l("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-4", children: [
    /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
      /* @__PURE__ */ l("form", { className: "cm:relative cm:w-full cm:max-w-xs", role: "search", onSubmit: (e) => {
        e.preventDefault(), u({ search: E });
      }, children: [
        /* @__PURE__ */ c(fe, { className: "cm:pointer-events-none cm:absolute cm:top-1/2 cm:left-2.5 cm:size-4 cm:-translate-y-1/2 cm:text-muted-foreground" }),
        /* @__PURE__ */ c(
          g,
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
      me.map((e) => K(e, "cm:w-40")),
      _.length > 0 && /* @__PURE__ */ l(ae, { children: [
        /* @__PURE__ */ c(ne, { asChild: !0, children: /* @__PURE__ */ l(r, { variant: "outline", children: [
          /* @__PURE__ */ c(ve, {}),
          " More filters",
          V > 0 ? ` (${V})` : ""
        ] }) }),
        /* @__PURE__ */ c(re, { align: "start", className: "cm:grid cm:w-80 cm:gap-2", children: _.map((e) => /* @__PURE__ */ l("label", { className: "cm:grid cm:gap-1 cm:text-sm", children: [
          /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: e.label }),
          K(e, "cm:w-full")
        ] }, e.key)) })
      ] }),
      q && /* @__PURE__ */ l(r, { variant: "ghost", onClick: () => {
        $(""), u({ search: "", filters: {} });
      }, children: [
        /* @__PURE__ */ c(pe, {}),
        " Clear"
      ] }),
      F && /* @__PURE__ */ l(Z, { children: [
        /* @__PURE__ */ c(ee, { asChild: !0, children: /* @__PURE__ */ l(r, { variant: "outline", className: "cm:ml-auto", children: [
          /* @__PURE__ */ c(ke, {}),
          " Columns"
        ] }) }),
        /* @__PURE__ */ l(ce, { align: "end", children: [
          /* @__PURE__ */ c(te, { children: "Show columns" }),
          t.columns.map((e) => /* @__PURE__ */ c(
            le,
            {
              checked: (k ?? []).includes(e.key),
              onSelect: (i) => i.preventDefault(),
              onCheckedChange: (i) => oe(e.key, i),
              children: e.label
            },
            e.key
          ))
        ] })
      ] })
    ] }),
    x && f.length > 0 && /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:text-sm", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ l("span", { className: "cm:text-muted-foreground", children: [
        f.length,
        " selected"
      ] }),
      t.bulkActions.map((e) => /* @__PURE__ */ c(r, { type: "button", size: "sm", variant: e.variant === "destructive" ? "destructive" : "outline", onClick: () => ue(e), children: e.label }, e.key))
    ] }),
    /* @__PURE__ */ l(d, { className: "cm:gap-0 cm:overflow-hidden cm:py-0", children: [
      /* @__PURE__ */ c("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ l(C, { children: [
        /* @__PURE__ */ c(J, { className: "cm:bg-muted/60", children: /* @__PURE__ */ l(w, { className: "cm:hover:bg-transparent", children: [
          x && /* @__PURE__ */ c(j, { className: "cm:w-8", children: /* @__PURE__ */ c(
            b,
            {
              "aria-label": "Select all rows",
              checked: P.length > 0 && f.length === P.length,
              onCheckedChange: (e) => p(e ? P : [])
            }
          ) }),
          y.map((e) => /* @__PURE__ */ c(j, { "aria-sort": s.sort === e.key ? s.direction === "asc" ? "ascending" : "descending" : void 0, children: e.sortable ? /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              onClick: () => he(e),
              className: "cm:-ml-2 cm:inline-flex cm:h-8 cm:items-center cm:gap-1 cm:rounded-md cm:px-2 cm:hover:bg-accent cm:hover:text-accent-foreground",
              children: [
                e.label,
                s.sort === e.key ? s.direction === "asc" ? /* @__PURE__ */ c(ye, { className: "cm:size-3" }) : /* @__PURE__ */ c(xe, { className: "cm:size-3" }) : /* @__PURE__ */ c(Ne, { className: "cm:size-3 cm:opacity-40" })
              ]
            }
          ) : e.label }, e.key))
        ] }) }),
        /* @__PURE__ */ l(W, { children: [
          a.data.length === 0 && /* @__PURE__ */ c(w, { className: "cm:hover:bg-transparent", children: /* @__PURE__ */ c(S, { colSpan: ge, className: "cm:h-24 cm:text-center cm:text-muted-foreground", children: q ? "Nothing matches." : "Nothing here yet." }) }),
          a.data.map((e, i) => {
            const n = t.rowHref?.(e) ?? null, o = e.id, D = t.onRowClick ? () => t.onRowClick(e) : n ? () => A.visit(n) : void 0;
            return /* @__PURE__ */ l(
              w,
              {
                "data-state": o !== void 0 && f.includes(o) ? "selected" : void 0,
                className: D ? "cm:cursor-pointer" : void 0,
                onClick: D ? (m) => {
                  m.target.closest('a, button, input, label, [role="checkbox"]') || D();
                } : void 0,
                children: [
                  x && /* @__PURE__ */ c(S, { children: o !== void 0 && /* @__PURE__ */ c(
                    b,
                    {
                      "aria-label": "Select row",
                      checked: f.includes(o),
                      onCheckedChange: (m) => p((v) => m ? [...v, o] : v.filter((N) => N !== o))
                    }
                  ) }),
                  y.map((m, v) => {
                    const N = t.renderCell?.(e, m), X = N === void 0 ? Q(e[m.key]) : N;
                    return /* @__PURE__ */ l(S, { className: "cm:whitespace-nowrap", children: [
                      n && v === 0 ? /* @__PURE__ */ c(_e, { href: n, className: "cm:font-medium cm:underline-offset-4 cm:hover:underline", children: X }) : X,
                      v === 0 && H.some((h) => h.key !== m.key && e[h.key] != null) && /* @__PURE__ */ c("div", { "aria-hidden": "true", "data-mobile-badges": !0, className: "cm:mt-1 cm:flex cm:max-w-48 cm:flex-wrap cm:gap-1 cm:md:hidden", children: H.map((h) => h.key !== m.key && e[h.key] != null && /* @__PURE__ */ c(we, { children: t.renderCell?.(e, h) ?? Q(e[h.key]) }, h.key)) })
                    ] }, m.key);
                  })
                ]
              },
              String(o ?? i)
            );
          })
        ] })
      ] }) }),
      /* @__PURE__ */ l("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-4 cm:border-t cm:px-6 cm:py-3 cm:text-sm cm:text-muted-foreground", children: [
        /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-4", children: [
          /* @__PURE__ */ c("span", { children: a.total === 0 ? "No rows" : `${a.from}–${a.to} of ${a.total}` }),
          a.total > G[0] && /* @__PURE__ */ l(L, { value: String(s.perPage), onValueChange: (e) => u({ perPage: Number(e) }), children: [
            /* @__PURE__ */ c(M, { className: "cm:h-8 cm:w-auto", "aria-label": "Rows per page", children: /* @__PURE__ */ c(R, {}) }),
            /* @__PURE__ */ c(U, { children: G.map((e) => /* @__PURE__ */ l(I, { value: String(e), children: [
              e,
              " per page"
            ] }, e)) })
          ] })
        ] }),
        a.last_page > 1 && /* @__PURE__ */ l("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ l("span", { children: [
            "Page ",
            a.current_page,
            " of ",
            a.last_page
          ] }),
          /* @__PURE__ */ c(
            r,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "cm:size-8",
              "aria-label": "Previous page",
              disabled: a.current_page <= 1,
              onClick: () => u({ page: a.current_page - 1 }),
              children: /* @__PURE__ */ c(Se, {})
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
              disabled: a.current_page >= a.last_page,
              onClick: () => u({ page: a.current_page + 1 }),
              children: /* @__PURE__ */ c(Ie, {})
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  Be as D
};
