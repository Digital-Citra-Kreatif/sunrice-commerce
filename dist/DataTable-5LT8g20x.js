import { j as n, c, p as z, U as ue, i as ge, q as pe } from "./main-Zvb9Pf3Y.js";
const G = [10, 25, 50, 100, 200];
function fe(t, d = {}) {
  const a = { ...t, ...d }, h = {};
  a.search && (h.search = a.search);
  const f = Object.fromEntries(Object.entries(a.filters ?? {}).filter(([, x]) => x !== ""));
  return Object.keys(f).length > 0 && (h.filters = f), a.sort && (h.sort = (a.direction === "desc" ? "-" : "") + a.sort), a.perPage && (h.per_page = a.perPage), d.page && d.page > 1 && (h.page = d.page), h;
}
function ve(t) {
  return t == null || t === "" ? "—" : typeof t == "boolean" ? t ? "Yes" : "No" : String(t);
}
function m({ className: t, children: d }) {
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
      children: d
    }
  );
}
const be = (t) => /* @__PURE__ */ n(m, { ...t, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), ke = (t) => /* @__PURE__ */ n(m, { ...t, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), we = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), ye = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), xe = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Ne = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Ce = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Se = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), Me = (t) => /* @__PURE__ */ c(m, { ...t, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), { router: D, Link: Ie } = ge, Pe = ue, Te = pe, L = "__all", Q = 3;
function ze(t) {
  const {
    Input: d,
    Button: a,
    Card: h,
    Checkbox: f,
    Table: x,
    TableHeader: W,
    TableBody: X,
    TableRow: N,
    TableHead: j,
    TableCell: C,
    Select: A,
    SelectTrigger: R,
    SelectValue: B,
    SelectContent: U,
    SelectItem: S,
    DropdownMenu: Y,
    DropdownMenuTrigger: J,
    DropdownMenuContent: Z,
    DropdownMenuLabel: ee,
    DropdownMenuCheckboxItem: ce,
    Popover: te,
    PopoverTrigger: ne,
    PopoverContent: le
  } = Pe, { meta: s, rows: l } = t, [V, E] = z(s.search ?? ""), [p, v] = z([]), $ = t.visibleColumns !== void 0 && t.tableKey !== void 0, [b, ae] = z(t.visibleColumns), re = Te(t.tableKey ?? "commerce-table", $ ? { columns: t.visibleColumns } : null), se = (e, i) => {
    const r = t.columns.map((o) => o.key).filter((o) => o === e ? i : (b ?? []).includes(o));
    r.length !== 0 && (ae(r), re.setColumns(r));
  }, M = b ? t.columns.filter((e) => b.includes(e.key)) : t.columns, k = (t.bulkActions ?? []).length > 0 && t.bulkUrl !== void 0, I = l.data.map((e) => e.id).filter((e) => e !== void 0), P = t.filters ?? [], ie = P.slice(0, Q), T = P.slice(Q), H = (e) => (s.filters?.[e] ?? "") !== "", F = T.filter((e) => H(e.key)).length, O = P.some((e) => H(e.key)) || !!s.search, u = (e) => {
    v([]), D.get(window.location.pathname, fe(s, e), { preserveState: !0, preserveScroll: !0, replace: !0 });
  }, oe = (e, i) => u({ filters: { ...s.filters, [e]: i === L ? "" : i } }), me = (e) => u({ sort: e.key, direction: s.sort === e.key && s.direction === "asc" ? "desc" : "asc" }), de = (e) => {
    e.confirm && !window.confirm(e.confirm) || D.post(t.bulkUrl, { action: e.key, ids: p }, { preserveScroll: !0, onSuccess: () => v([]) });
  }, q = (e, i) => /* @__PURE__ */ n(A, { value: s.filters?.[e.key] || L, onValueChange: (r) => oe(e.key, r), children: [
    /* @__PURE__ */ c(R, { className: i, "aria-label": e.label, children: /* @__PURE__ */ c(B, {}) }),
    /* @__PURE__ */ n(U, { children: [
      /* @__PURE__ */ n(S, { value: L, children: [
        e.label,
        ": all"
      ] }),
      e.options.map((r) => /* @__PURE__ */ c(S, { value: r.value, children: r.label }, r.value))
    ] })
  ] }, e.key), he = M.length + (k ? 1 : 0);
  return /* @__PURE__ */ n("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-4", children: [
    /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
      /* @__PURE__ */ n("form", { className: "cm:relative cm:w-full cm:max-w-xs", role: "search", onSubmit: (e) => {
        e.preventDefault(), u({ search: V });
      }, children: [
        /* @__PURE__ */ c(be, { className: "cm:pointer-events-none cm:absolute cm:top-1/2 cm:left-2.5 cm:size-4 cm:-translate-y-1/2 cm:text-muted-foreground" }),
        /* @__PURE__ */ c(
          d,
          {
            type: "search",
            className: "cm:pl-9",
            value: V,
            "aria-label": "Search",
            placeholder: t.searchPlaceholder ?? "Search…",
            onChange: (e) => E(e.target.value)
          }
        )
      ] }),
      ie.map((e) => q(e, "cm:w-40")),
      T.length > 0 && /* @__PURE__ */ n(te, { children: [
        /* @__PURE__ */ c(ne, { asChild: !0, children: /* @__PURE__ */ n(a, { variant: "outline", children: [
          /* @__PURE__ */ c(we, {}),
          " More filters",
          F > 0 ? ` (${F})` : ""
        ] }) }),
        /* @__PURE__ */ c(le, { align: "start", className: "cm:grid cm:w-80 cm:gap-2", children: T.map((e) => /* @__PURE__ */ n("label", { className: "cm:grid cm:gap-1 cm:text-sm", children: [
          /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: e.label }),
          q(e, "cm:w-full")
        ] }, e.key)) })
      ] }),
      O && /* @__PURE__ */ n(a, { variant: "ghost", onClick: () => {
        E(""), u({ search: "", filters: {} });
      }, children: [
        /* @__PURE__ */ c(Me, {}),
        " Clear"
      ] }),
      $ && /* @__PURE__ */ n(Y, { children: [
        /* @__PURE__ */ c(J, { asChild: !0, children: /* @__PURE__ */ n(a, { variant: "outline", className: "cm:ml-auto", children: [
          /* @__PURE__ */ c(ke, {}),
          " Columns"
        ] }) }),
        /* @__PURE__ */ n(Z, { align: "end", children: [
          /* @__PURE__ */ c(ee, { children: "Show columns" }),
          t.columns.map((e) => /* @__PURE__ */ c(
            ce,
            {
              checked: (b ?? []).includes(e.key),
              onSelect: (i) => i.preventDefault(),
              onCheckedChange: (i) => se(e.key, i),
              children: e.label
            },
            e.key
          ))
        ] })
      ] })
    ] }),
    k && p.length > 0 && /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:text-sm", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: [
        p.length,
        " selected"
      ] }),
      t.bulkActions.map((e) => /* @__PURE__ */ c(a, { type: "button", size: "sm", variant: e.variant === "destructive" ? "destructive" : "outline", onClick: () => de(e), children: e.label }, e.key))
    ] }),
    /* @__PURE__ */ n(h, { className: "cm:gap-0 cm:overflow-hidden cm:py-0", children: [
      /* @__PURE__ */ c("div", { className: "cm:overflow-x-auto", children: /* @__PURE__ */ n(x, { children: [
        /* @__PURE__ */ c(W, { className: "cm:bg-muted/60", children: /* @__PURE__ */ n(N, { className: "cm:hover:bg-transparent", children: [
          k && /* @__PURE__ */ c(j, { className: "cm:w-8", children: /* @__PURE__ */ c(
            f,
            {
              "aria-label": "Select all rows",
              checked: I.length > 0 && p.length === I.length,
              onCheckedChange: (e) => v(e ? I : [])
            }
          ) }),
          M.map((e) => /* @__PURE__ */ c(j, { "aria-sort": s.sort === e.key ? s.direction === "asc" ? "ascending" : "descending" : void 0, children: e.sortable ? /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => me(e),
              className: "cm:-ml-2 cm:inline-flex cm:h-8 cm:items-center cm:gap-1 cm:rounded-md cm:px-2 cm:hover:bg-accent cm:hover:text-accent-foreground",
              children: [
                e.label,
                s.sort === e.key ? s.direction === "asc" ? /* @__PURE__ */ c(ye, { className: "cm:size-3" }) : /* @__PURE__ */ c(xe, { className: "cm:size-3" }) : /* @__PURE__ */ c(Ne, { className: "cm:size-3 cm:opacity-40" })
              ]
            }
          ) : e.label }, e.key))
        ] }) }),
        /* @__PURE__ */ n(X, { children: [
          l.data.length === 0 && /* @__PURE__ */ c(N, { className: "cm:hover:bg-transparent", children: /* @__PURE__ */ c(C, { colSpan: he, className: "cm:h-24 cm:text-center cm:text-muted-foreground", children: O ? "Nothing matches." : "Nothing here yet." }) }),
          l.data.map((e, i) => {
            const r = t.rowHref?.(e) ?? null, o = e.id, _ = t.onRowClick ? () => t.onRowClick(e) : r ? () => D.visit(r) : void 0;
            return /* @__PURE__ */ n(
              N,
              {
                "data-state": o !== void 0 && p.includes(o) ? "selected" : void 0,
                className: _ ? "cm:cursor-pointer" : void 0,
                onClick: _ ? (g) => {
                  g.target.closest('a, button, input, label, [role="checkbox"]') || _();
                } : void 0,
                children: [
                  k && /* @__PURE__ */ c(C, { children: o !== void 0 && /* @__PURE__ */ c(
                    f,
                    {
                      "aria-label": "Select row",
                      checked: p.includes(o),
                      onCheckedChange: (g) => v((w) => g ? [...w, o] : w.filter((y) => y !== o))
                    }
                  ) }),
                  M.map((g, w) => {
                    const y = t.renderCell?.(e, g), K = y === void 0 ? ve(e[g.key]) : y;
                    return /* @__PURE__ */ c(C, { className: "cm:whitespace-nowrap", children: r && w === 0 ? /* @__PURE__ */ c(Ie, { href: r, className: "cm:font-medium cm:underline-offset-4 cm:hover:underline", children: K }) : K }, g.key);
                  })
                ]
              },
              String(o ?? i)
            );
          })
        ] })
      ] }) }),
      /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-4 cm:border-t cm:px-6 cm:py-3 cm:text-sm cm:text-muted-foreground", children: [
        /* @__PURE__ */ n("div", { className: "cm:flex cm:items-center cm:gap-4", children: [
          /* @__PURE__ */ c("span", { children: l.total === 0 ? "No rows" : `${l.from}–${l.to} of ${l.total}` }),
          l.total > G[0] && /* @__PURE__ */ n(A, { value: String(s.perPage), onValueChange: (e) => u({ perPage: Number(e) }), children: [
            /* @__PURE__ */ c(R, { className: "cm:h-8 cm:w-auto", "aria-label": "Rows per page", children: /* @__PURE__ */ c(B, {}) }),
            /* @__PURE__ */ c(U, { children: G.map((e) => /* @__PURE__ */ n(S, { value: String(e), children: [
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
            a,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "cm:size-8",
              "aria-label": "Previous page",
              disabled: l.current_page <= 1,
              onClick: () => u({ page: l.current_page - 1 }),
              children: /* @__PURE__ */ c(Ce, {})
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              variant: "outline",
              size: "icon",
              className: "cm:size-8",
              "aria-label": "Next page",
              disabled: l.current_page >= l.last_page,
              onClick: () => u({ page: l.current_page + 1 }),
              children: /* @__PURE__ */ c(Se, {})
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  ze as D
};
