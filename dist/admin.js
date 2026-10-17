const ae = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let V = ae;
function be(t) {
  V = { ...ae, ...t ?? {} };
}
function A(t, n = V) {
  const c = t < 0, r = Math.abs(Math.round(t)), i = 10 ** n.decimals, l = Math.floor(r / i).toString().replace(/\B(?=(\d{3})+(?!\d))/g, n.thousands), s = n.decimals > 0 ? n.decimal + String(r % i).padStart(n.decimals, "0") : "", o = l + s, f = n.space ? " " : "", m = n.position === "left" ? `${n.symbol}${f}${o}` : `${o}${f}${n.symbol}`;
  return c ? `-${m}` : m;
}
function oe(t, n = V) {
  let c = t.replace(n.symbol, "").replace(/\s/g, "");
  const r = c.startsWith("-");
  c = c.replace(/^-/, "").split(n.thousands).join("");
  const [i, l = ""] = c.split(n.decimal);
  if (!/^\d*$/.test(i) || !/^\d*$/.test(l) || i + l === "")
    return null;
  const s = Number(i || "0") * 10 ** n.decimals + Number(l.padEnd(n.decimals, "0").slice(0, n.decimals) || "0");
  return r ? -s : s;
}
const B = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, P = {
  version: 1,
  registerOrderPanel: (t, n) => {
    B.orderPanels[t] = n;
  },
  registerDashboardWidget: (t, n) => {
    B.dashboardWidgets[t] = n;
  },
  registerSettingsSection: (t, n) => {
    B.settingsSections[t] = n;
  },
  registerProductTab: (t, n) => {
    B.productTabs[t] = n;
  },
  orderPanels: () => B.orderPanels,
  dashboardWidgets: () => B.dashboardWidgets,
  settingsSections: () => B.settingsSections,
  productTabs: () => B.productTabs,
  formatMoney: A,
  parseMoney: oe,
  components: {}
};
function ve() {
  window.SunriceCommerce = P;
  const t = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; t.length > 0; ) {
      const c = t.shift();
      try {
        c?.(P);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), t.push = ((...c) => (c.forEach((r) => r(P)), t.length)), window.SunriceCommerceQueue = t;
}
const W = window.Sunrice, { React: w, ui: T, components: X, inertia: O, adminUrl: q, fetchJson: L, toast: ye } = W, de = window.Sunrice.React, me = de.Fragment;
function e(t, n, c) {
  return de.createElement(t, c === void 0 ? n : { ...n, key: c });
}
const a = e;
function ue({ title: t, description: n, action: c }) {
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ e("p", { className: "cm:font-medium", children: t }),
    n && /* @__PURE__ */ e("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: n }),
    c && /* @__PURE__ */ e("div", { className: "cm:mt-2", children: c })
  ] });
}
function J({ title: t, description: n, actions: c }) {
  const { Head: r } = O;
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ e(r, { title: t }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: t }),
      n && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: n })
    ] }),
    c && /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: c })
  ] });
}
function he(t) {
  var n, c, r = "";
  if (typeof t == "string" || typeof t == "number") r += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var i = t.length;
    for (n = 0; n < i; n++) t[n] && (c = he(t[n])) && (r && (r += " "), r += c);
  } else for (c in t) t[c] && (r && (r += " "), r += c);
  return r;
}
function ke() {
  for (var t, n, c = 0, r = "", i = arguments.length; c < i; c++) (t = arguments[c]) && (n = he(t)) && (r && (r += " "), r += n);
  return r;
}
function K(...t) {
  return ke(t);
}
const ne = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function R({ tone: t = "neutral", children: n }) {
  return /* @__PURE__ */ e("span", { className: K("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ne[t] ?? ne.neutral), children: n });
}
function H() {
  const { props: t } = O.usePage(), n = t.commerce ?? {};
  return be(n.currency), n;
}
function xe({ mode: t, setup: n, health: c, kpis: r, todo: i }) {
  const { Card: l, CardContent: s, CardHeader: o, CardTitle: f, CardDescription: m } = T, { Link: b } = O;
  H();
  const g = n.filter((h) => !h.done), p = c.filter((h) => h.status !== "ok"), d = Object.entries(P.dashboardWidgets());
  return /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(J, { title: "Store", description: /* @__PURE__ */ a(me, { children: [
      "Selling mode: ",
      t.label
    ] }) }),
    g.length > 0 && /* @__PURE__ */ a(l, { children: [
      /* @__PURE__ */ a(o, { children: [
        /* @__PURE__ */ e(f, { children: "Set up your store" }),
        /* @__PURE__ */ a(m, { children: [
          n.length - g.length,
          " of ",
          n.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-2", children: n.map((h) => /* @__PURE__ */ a(b, { href: q(h.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { "aria-hidden": !0, className: h.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: h.done ? "✓" : "○" }),
        /* @__PURE__ */ a("span", { className: "cm:grid", children: [
          /* @__PURE__ */ e("span", { className: h.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: h.label }),
          h.description && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: h.description })
        ] })
      ] }, h.key)) })
    ] }),
    p.length > 0 && /* @__PURE__ */ a(l, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(f, { children: "Needs attention" }) }),
      /* @__PURE__ */ e(s, { className: "cm:grid cm:gap-3", children: p.map((h) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ e(R, { tone: h.status, children: h.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ e("span", { className: "cm:font-medium", children: h.label })
        ] }),
        /* @__PURE__ */ e("p", { className: "cm:text-sm", children: h.message }),
        h.fix && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: h.fix })
      ] }, h.key)) })
    ] }),
    /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: r === void 0 ? [0, 1, 2, 3].map((h) => /* @__PURE__ */ e("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, h)) : r.map((h) => /* @__PURE__ */ e(l, { children: /* @__PURE__ */ a(s, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: h.label }),
      /* @__PURE__ */ e("span", { className: "cm:text-2xl cm:font-semibold", children: h.value }),
      h.hint && /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: h.hint })
    ] }) }, h.key)) }),
    /* @__PURE__ */ a(l, { children: [
      /* @__PURE__ */ e(o, { children: /* @__PURE__ */ e(f, { children: "To do" }) }),
      /* @__PURE__ */ e(s, { children: i === void 0 ? /* @__PURE__ */ e("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : i.length === 0 ? /* @__PURE__ */ e(ue, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: i.map((h) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(b, { href: q(h.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ e("span", { children: h.label }),
        /* @__PURE__ */ e("span", { className: "cm:font-semibold", children: h.count })
      ] }) }, h.key)) }) })
    ] }),
    d.map(([h, u]) => /* @__PURE__ */ e(u, {}, h))
  ] });
}
function ge({ items: t, current: n, label: c = "Sections" }) {
  const { Link: r } = O;
  return /* @__PURE__ */ e("nav", { "aria-label": c, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: t.map((i) => /* @__PURE__ */ e(
    r,
    {
      href: q(i.href),
      "aria-current": i.key === n ? "page" : void 0,
      className: K(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        i.key === n && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: i.label
    },
    i.key
  )) });
}
function Z({ sections: t, current: n, title: c, description: r, children: i }) {
  const { SettingsTabs: l } = X;
  return H(), W.useBreadcrumbs([{ label: "Settings", href: q("settings") }, { label: "Store", href: q("commerce/settings") }, { label: c }]), /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(l, { current: "store" }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ e(ge, { items: t, current: n, label: "Store settings" }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ e(J, { title: c, description: r }),
        i
      ] })
    ] })
  ] });
}
function _e({ sections: t, mode: n, groups: c, updateUrl: r }) {
  const { Card: i, CardContent: l, CardHeader: s, CardTitle: o, Switch: f, Button: m, Dialog: b, DialogContent: g, DialogDescription: p, DialogFooter: d, DialogHeader: h, DialogTitle: u } = T, { errors: x } = O.usePage().props, [_, N] = w.useState(null), [y, v] = w.useState(null), C = (S, $) => {
    v(S.key), O.router.put(r.replace("__key__", S.key), { on: $ }, { preserveScroll: !0, onFinish: () => v(null) });
  };
  return /* @__PURE__ */ a(
    Z,
    {
      sections: t,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ a(me, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ e("strong", { children: n.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        x.feature && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: x.feature }),
        c.map((S) => /* @__PURE__ */ a(i, { children: [
          /* @__PURE__ */ e(s, { children: /* @__PURE__ */ e(o, { children: S.label }) }),
          /* @__PURE__ */ e(l, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: S.features.map(($) => /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ a("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("label", { htmlFor: `feature-${$.key}`, className: "cm:font-medium", children: $.label }),
                $.core && /* @__PURE__ */ e(R, { children: "Always on" }),
                $.switched_on && !$.active && /* @__PURE__ */ a(R, { tone: "warning", children: [
                  "Off — ",
                  $.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                $.essential && /* @__PURE__ */ a(R, { tone: "info", children: [
                  "Needed by ",
                  n.label
                ] })
              ] }),
              /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: $.description }),
              $.requires.length > 0 && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                $.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ e(
              f,
              {
                id: `feature-${$.key}`,
                checked: $.switched_on,
                disabled: $.core || y === $.key,
                onCheckedChange: (G) => !G && $.dependents.length > 0 ? N($) : C($, G)
              }
            )
          ] }, $.key)) })
        ] }, S.key)),
        /* @__PURE__ */ e(b, { open: _ !== null, onOpenChange: (S) => !S && N(null), children: /* @__PURE__ */ a(g, { children: [
          /* @__PURE__ */ a(h, { children: [
            /* @__PURE__ */ a(u, { children: [
              "Switch off ",
              _?.label,
              "?"
            ] }),
            /* @__PURE__ */ a(p, { children: [
              "These are switched off with it: ",
              _?.dependents.map((S) => S.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ a(d, { children: [
            /* @__PURE__ */ e(m, { variant: "outline", onClick: () => N(null), children: "Cancel" }),
            /* @__PURE__ */ e(
              m,
              {
                variant: "destructive",
                onClick: () => {
                  _ && C(_, !1), N(null);
                },
                children: "Switch off"
              }
            )
          ] })
        ] }) })
      ]
    }
  );
}
function ee({ form: t, footer: n }) {
  const { FieldRenderer: c } = X, { Button: r } = T, { data: i, setData: l, errors: s, processing: o, isDirty: f, ...m } = O.useForm({ values: t.values });
  return /* @__PURE__ */ a(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (b) => {
        b.preventDefault(), m[t.method](t.action, { preserveScroll: !0 });
      },
      children: [
        s.section && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: s.section }),
        /* @__PURE__ */ e(
          c,
          {
            fields: t.fields,
            values: i.values,
            errors: s,
            pathPrefix: "values",
            onChange: (b) => l("values", b)
          }
        ),
        /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ e(r, { type: "submit", disabled: o, children: t.submitLabel }),
          f && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          n
        ] })
      ]
    }
  );
}
function $e({ section: t, sections: n, form: c }) {
  return /* @__PURE__ */ e(Z, { sections: n, current: t.key, title: `${t.label} settings`, children: /* @__PURE__ */ e(ee, { form: c }, t.key) });
}
function we({ title: t, description: n, form: c, breadcrumbs: r = [] }) {
  return H(), W.useBreadcrumbs([...r, { label: t }]), /* @__PURE__ */ a("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(J, { title: t, description: n }),
    /* @__PURE__ */ e(ee, { form: c })
  ] });
}
const Ne = {
  "Commerce/Dashboard": xe,
  "Commerce/Settings/Section": $e,
  "Commerce/Settings/Features": _e,
  "Commerce/Shared/SchemaForm": we
};
function Ce() {
  Object.entries(Ne).forEach(([t, n]) => W.registerPage(t, n));
}
function ce(t) {
  if (!t) return "";
  const n = new Date(t);
  if (Number.isNaN(n.getTime())) return "";
  const c = (r) => String(r).padStart(2, "0");
  return `${n.getFullYear()}-${c(n.getMonth() + 1)}-${c(n.getDate())}T${c(n.getHours())}:${c(n.getMinutes())}`;
}
function le(t) {
  return t ? new Date(t).toISOString() : null;
}
function Se({ value: t, onChange: n, pathPrefix: c }) {
  const { Input: r, Label: i } = T, l = { start: t?.start ?? null, end: t?.end ?? null };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ e(
        r,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: ce(l.start),
          onChange: (s) => n({ ...l, start: le(s.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ e(
        r,
        {
          id: `${c}-end`,
          type: "datetime-local",
          value: ce(l.end),
          onChange: (s) => n({ ...l, end: le(s.target.value) })
        }
      )
    ] })
  ] });
}
function te({
  value: t,
  onChange: n,
  id: c,
  placeholder: r,
  allowNull: i = !0,
  invalid: l
}) {
  const { Input: s } = T, o = (p) => p == null ? "" : A(p).replace(/^[^\d-]+|[^\d]+$/g, ""), [f, m] = w.useState(o(t)), [b, g] = w.useState(!1);
  return w.useEffect(() => {
    b || m(o(t));
  }, [t, b]), /* @__PURE__ */ e(
    s,
    {
      id: c,
      inputMode: "decimal",
      value: f,
      placeholder: r,
      "aria-invalid": l || void 0,
      onFocus: () => g(!0),
      onChange: (p) => {
        m(p.target.value);
        const d = p.target.value.trim() === "" ? i ? null : 0 : oe(p.target.value);
        (d !== null || p.target.value.trim() === "") && n(d);
      },
      onBlur: () => {
        g(!1), m(o(t));
      }
    }
  );
}
function Fe({ field: t, value: n, onChange: c, errors: r, pathPrefix: i }) {
  return H(), /* @__PURE__ */ e(
    te,
    {
      id: i,
      value: n,
      onChange: c,
      allowNull: t.config?.allow_null !== !1,
      invalid: !!(i && r?.[i])
    }
  );
}
const re = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Te = { province: 1, city: 2, district: 3, village: 4 }, Q = /* @__PURE__ */ new Map();
function De(t, n) {
  const c = n ? `${t}?parent=${encodeURIComponent(n)}` : t;
  return Q.has(c) || Q.set(c, L(c).then((r) => r.data).catch(() => (Q.delete(c), []))), Q.get(c);
}
const ie = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function qe({ field: t, value: n, onChange: c, pathPrefix: r }) {
  const { Label: i } = T, l = t.config ?? {}, s = String(l.api ?? ""), o = Te[l.depth ?? "district"] ?? 3, f = l.country_options ?? [], m = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...n ?? {} }, b = re.slice(0, o), [g, p] = w.useState({}), d = [null, m.province_code, m.city_code, m.district_code];
  w.useEffect(() => {
    m.country !== "ID" || !s || b.forEach((u, x) => {
      const _ = d[x];
      x > 0 && !_ || De(s, _).then((N) => p((y) => ({ ...y, [u.key]: N })));
    });
  }, [s, m.country, m.province_code, m.city_code, m.district_code]);
  const h = (u, x) => {
    const _ = { ...m };
    _[b[u].key] = x || null, re.slice(u + 1).forEach((N) => {
      _[N.key] = null;
    }), c(_);
  };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    f.length > 0 && /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ e(
        "select",
        {
          id: `${r}-country`,
          className: ie,
          value: m.country,
          onChange: (u) => c({ country: u.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: f.map((u) => /* @__PURE__ */ e("option", { value: u.value, children: u.label }, u.value))
        }
      )
    ] }),
    m.country === "ID" && b.map((u, x) => /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ e(i, { htmlFor: `${r}-${u.key}`, children: u.label }),
      /* @__PURE__ */ a(
        "select",
        {
          id: `${r}-${u.key}`,
          className: ie,
          value: m[u.key] ?? "",
          disabled: x > 0 && !d[x],
          onChange: (_) => h(x, _.target.value),
          children: [
            /* @__PURE__ */ e("option", { value: "", children: "Choose…" }),
            (g[u.key] ?? []).map((_) => /* @__PURE__ */ e("option", { value: _.code, children: _.name }, _.code))
          ]
        }
      )
    ] }, u.key))
  ] });
}
function I() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function se(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function Ee(t) {
  let n = [{}];
  for (const c of t) {
    if (c.values.length === 0) return [];
    const r = [];
    for (const i of n)
      for (const l of c.values)
        r.push({ ...i, [c.id]: l.id });
    n = r;
  }
  return t.length === 0 ? [] : n;
}
function Ie(t, n, c, r = 100) {
  const i = new Map(n.map((l) => [se(l.options), l]));
  return Ee(t).slice(0, r).map((l) => {
    const s = i.get(se(l));
    return s ? { ...s, options: l } : { ...c, id: I(), sku: null, options: l, active: !0, price: c.price ?? 0 };
  });
}
function pe(t, n, c = {}) {
  return t.map((r) => {
    const i = r.values.find((l) => l.id === n.options[r.id]);
    return i ? i.label ?? (i.term_id ? c[i.term_id] ?? `#${i.term_id}` : "?") : "?";
  }).join(" / ");
}
function k({ label: t, hint: n, children: c, htmlFor: r, className: i }) {
  const { Label: l } = T;
  return /* @__PURE__ */ a("div", { className: K("cm:grid cm:gap-1.5", i), children: [
    /* @__PURE__ */ e(l, { htmlFor: r, children: t }),
    c,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function U({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: K("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function F({ id: t, value: n, onChange: c, min: r = 0, placeholder: i }) {
  const { Input: l } = T;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: r,
      value: n ?? "",
      placeholder: i,
      onChange: (s) => c(s.target.value === "" ? null : Math.round(Number(s.target.value)))
    }
  );
}
function z({ id: t, value: n, onChange: c, placeholder: r, onBlur: i }) {
  const { Input: l } = T;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: r,
      onBlur: i,
      onChange: (s) => c(s.target.value === "" ? null : s.target.value)
    }
  );
}
function j({ id: t, value: n, onChange: c, nullable: r = !0 }) {
  return /* @__PURE__ */ e(te, { id: t, value: n, allowNull: r, onChange: c });
}
function M({ id: t, label: n, checked: c, onChange: r, hint: i }) {
  const { Switch: l, Label: s } = T;
  return /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: t, checked: c, onCheckedChange: r }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(s, { htmlFor: t, children: n }),
      i && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: i })
    ] })
  ] });
}
const Be = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function D({ id: t, value: n, onChange: c, options: r }) {
  return /* @__PURE__ */ e("select", { id: t, className: Be, value: n, onChange: (i) => c(i.target.value), children: r.map(([i, l]) => /* @__PURE__ */ e("option", { value: i, children: l }, i)) });
}
function E({ title: t, description: n, children: c, actions: r }) {
  return /* @__PURE__ */ a("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ a("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      r
    ] }),
    c
  ] });
}
function je({ value: t, update: n, path: c }) {
  const { Button: r, Input: i } = T, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [s, o] = w.useState({}), [f, m] = w.useState(""), [b, g] = w.useState([]), p = l.items.map((u) => u.variant_id).filter((u) => !!u);
  w.useEffect(() => {
    const u = p.filter((x) => !s[x]);
    u.length !== 0 && L(q(`commerce/api/variants?${u.map((x) => `ids[]=${x}`).join("&")}`)).then((x) => o((_) => ({ ..._, ...Object.fromEntries(x.data.map((N) => [N.id, N])) }))).catch(() => {
    });
  }, [p.join(",")]), w.useEffect(() => {
    if (f.trim().length < 2) return g([]);
    const u = setTimeout(() => L(q(`commerce/api/variants?q=${encodeURIComponent(f)}`)).then((x) => g(x.data)).catch(() => {
    }), 250);
    return () => clearTimeout(u);
  }, [f]);
  const d = (u) => n({ bundle: { ...l, ...u } }), h = l.items.reduce((u, x) => u + (s[x.variant_id ?? 0]?.price ?? 0) * x.quantity, 0);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(E, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((u, x) => /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: s[u.variant_id ?? 0]?.label ?? `#${u.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(F, { min: 1, value: u.quantity, onChange: (_) => d({ items: l.items.map((N, y) => y === x ? { ...N, quantity: _ ?? 1 } : N) }) }) }),
        /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => d({ items: l.items.filter((_, N) => N !== x) }), children: "Remove" })
      ] }, x)),
      /* @__PURE__ */ a("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(i, { value: f, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (u) => m(u.target.value) }),
        b.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: b.map((u) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((x) => ({ ...x, [u.id]: u })), d({ items: [...l.items, { variant_id: u.id, quantity: 1 }] }), m("");
            },
            children: [
              /* @__PURE__ */ a("span", { children: [
                u.label,
                u.sku && /* @__PURE__ */ a("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  u.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: A(u.price) })
            ]
          }
        ) }, u.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(E, { title: "Bundle price", description: `The products cost ${A(h)} together.`, children: /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(k, { label: "Price", htmlFor: `${c}-bundle-pricing`, children: /* @__PURE__ */ e(
        D,
        {
          id: `${c}-bundle-pricing`,
          value: l.pricing,
          onChange: (u) => d({ pricing: u, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(k, { label: "Percent off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(F, { id: `${c}-bundle-value`, value: l.value / 100, onChange: (u) => d({ value: Math.round((u ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(k, { label: "Amount off", htmlFor: `${c}-bundle-value`, children: /* @__PURE__ */ e(j, { id: `${c}-bundle-value`, value: l.value, nullable: !1, onChange: (u) => d({ value: u ?? 0 }) }) })
    ] }) })
  ] });
}
function Oe() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function Pe({ value: t, update: n, path: c }) {
  const { Button: r } = T, [i, l] = w.useState(!1), s = w.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, f = (g) => n({ delivery: { ...o, ...g } }), m = (g, p) => n({ downloads: t.downloads.map((d, h) => h === g ? { ...d, ...p } : d) }), b = async (g) => {
    if (g?.length) {
      l(!0);
      try {
        const p = [];
        for (const d of Array.from(g)) {
          const h = new FormData();
          h.append("file", d);
          const u = await fetch(q("commerce/api/downloads"), { method: "POST", body: h, headers: { "X-XSRF-TOKEN": Oe(), Accept: "application/json" }, credentials: "same-origin" }), x = await u.json();
          if (!u.ok) throw new Error(x.message ?? "Upload failed");
          p.push({ id: I(), type: "file", file_id: x.data.id, url: null, name: d.name.replace(/\.[^.]+$/, ""), file: x.data });
        }
        n({ downloads: [...t.downloads, ...p] });
      } catch (p) {
        ye.error(p instanceof Error ? p.message : "Upload failed");
      } finally {
        l(!1), s.current && (s.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(
      E,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ a("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", disabled: i, onClick: () => s.current?.click(), children: i ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: I(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: s, type: "file", multiple: !0, hidden: !0, onChange: (g) => b(g.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((g, p) => /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(k, { label: "Name", htmlFor: `${c}-dl-${p}`, children: /* @__PURE__ */ e(z, { id: `${c}-dl-${p}`, value: g.name, onChange: (d) => m(p, { name: d ?? "" }) }) }),
            g.type === "url" ? /* @__PURE__ */ e(k, { label: "Link", htmlFor: `${c}-dl-${p}-url`, children: /* @__PURE__ */ e(z, { id: `${c}-dl-${p}-url`, value: g.url, placeholder: "https://", onChange: (d) => m(p, { url: d }) }) }) : /* @__PURE__ */ e(k, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: g.file?.filename ?? `File #${g.file_id}` }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((d, h) => h !== p) }), children: "Remove" })
          ] }, g.id ?? p))
        ]
      }
    ),
    /* @__PURE__ */ a(E, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([g, p]) => /* @__PURE__ */ e(
        M,
        {
          id: `${c}-mode-${g}`,
          label: p,
          checked: o.modes.includes(g),
          onChange: (d) => f({ modes: d ? [...o.modes, g] : o.modes.filter((h) => h !== g) })
        },
        g
      )) }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(k, { label: "Downloads per file", htmlFor: `${c}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(F, { id: `${c}-limit`, min: 1, value: o.download_limit, onChange: (g) => f({ download_limit: g }) }) }),
        /* @__PURE__ */ e(k, { label: "Links expire after (days)", htmlFor: `${c}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(F, { id: `${c}-expiry`, min: 1, value: o.expiry_days, onChange: (g) => f({ expiry_days: g }) }) })
      ] })
    ] })
  ] });
}
function fe({ id: t, value: n, onChange: c, entryId: r }) {
  const [i, l] = w.useState(null);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(z, { id: t, value: n, onChange: (o) => {
      l(null), c(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(r ?? 0) });
      L(q(`commerce/api/sku-check?${o}`)).then((f) => l(f.available ? null : f.product ?? "another product")).catch(() => l(null));
    } }),
    i && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      i,
      "."
    ] })
  ] });
}
const Re = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function Me({ value: t, update: n, updateVariant: c, config: r, entryId: i, path: l }) {
  const { Button: s } = T, o = [["simple", "Simple product"]];
  (r.features.variants || t.type === "variable") && o.push(["variable", "Variable product (sizes, colors…)"]), (r.features.bundles || t.type === "bundle") && o.push(["bundle", "Bundle of other products"]);
  const f = t.variants[0];
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ a(U, { cols: 2, children: [
      /* @__PURE__ */ e(k, { label: "Product type", htmlFor: `${l}-type`, children: /* @__PURE__ */ e(D, { id: `${l}-type`, value: t.type, options: o, onChange: (m) => n({ type: m }) }) }),
      /* @__PURE__ */ e(k, { label: "Button on the product page", htmlFor: `${l}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(D, { id: `${l}-mode`, value: t.purchase_mode, options: Re, onChange: (m) => n({ purchase_mode: m }) }) })
    ] }),
    t.type !== "variable" && f && /* @__PURE__ */ e(E, { title: "Price", children: /* @__PURE__ */ a(U, { cols: 4, children: [
      /* @__PURE__ */ e(k, { label: "Price", htmlFor: `${l}-price`, children: /* @__PURE__ */ e(j, { id: `${l}-price`, value: f.price, nullable: !1, onChange: (m) => c(0, { price: m ?? 0 }) }) }),
      /* @__PURE__ */ e(k, { label: "Compare-at price", htmlFor: `${l}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(j, { id: `${l}-compare`, value: f.compare_at_price, onChange: (m) => c(0, { compare_at_price: m }) }) }),
      /* @__PURE__ */ e(k, { label: "Cost", htmlFor: `${l}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(j, { id: `${l}-cost`, value: f.cost, onChange: (m) => c(0, { cost: m }) }) }),
      /* @__PURE__ */ e(k, { label: "SKU", htmlFor: `${l}-sku`, children: /* @__PURE__ */ e(fe, { id: `${l}-sku`, value: f.sku, entryId: i, onChange: (m) => c(0, { sku: m }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      E,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((m, b) => {
          const g = (p) => n({ external_links: t.external_links.map((d, h) => h === b ? { ...d, ...p } : d) });
          return /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(k, { label: "Shop", htmlFor: `${l}-link-${b}-preset`, children: /* @__PURE__ */ e(
              D,
              {
                id: `${l}-link-${b}-preset`,
                value: m.preset ?? "",
                onChange: (p) => g({ preset: p || null }),
                options: [...Object.entries(r.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(k, { label: "Button label", htmlFor: `${l}-link-${b}-label`, children: /* @__PURE__ */ e(z, { id: `${l}-link-${b}-label`, value: m.label, placeholder: m.preset ? `Buy on ${r.link_presets[m.preset]}` : "", onChange: (p) => g({ label: p }) }) }),
            /* @__PURE__ */ e(k, { label: "Link", htmlFor: `${l}-link-${b}-url`, children: /* @__PURE__ */ e(z, { id: `${l}-link-${b}-url`, value: m.url, placeholder: "https://", onChange: (p) => g({ url: p }) }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((p, d) => d !== b) }), children: "Remove" })
          ] }, b);
        })
      }
    ),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(M, { id: `${l}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (m) => n({ requires_shipping: m }), hint: "Off for services and digital products." }),
      (r.features.digital || t.downloadable) && /* @__PURE__ */ e(M, { id: `${l}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (m) => n({ downloadable: m }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(M, { id: `${l}-featured`, label: "Featured", checked: t.featured, onChange: (m) => n({ featured: m }), hint: "Shown first when sorting by featured." })
    ] }),
    r.features.taxes && /* @__PURE__ */ e(k, { label: "Tax class", htmlFor: `${l}-tax`, children: /* @__PURE__ */ e(
      D,
      {
        id: `${l}-tax`,
        value: t.tax_class ?? "",
        onChange: (m) => n({ tax_class: m || null }),
        options: [["", "Standard"], ...r.tax_classes.filter((m) => m !== "standard").map((m) => [m, m])]
      }
    ) })
  ] });
}
function Ae({ value: t, updateVariant: n, live: c, path: r }) {
  const i = t.variants[0];
  if (!i) return null;
  const l = c?.variants[i.id];
  return /* @__PURE__ */ a(E, { title: "Stock", children: [
    /* @__PURE__ */ e(
      M,
      {
        id: `${r}-track`,
        label: "Track stock",
        checked: i.track_stock,
        onChange: (s) => n(0, { track_stock: s }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    i.track_stock ? /* @__PURE__ */ a(U, { cols: 3, children: [
      l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(k, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: l.stock_quantity }) }) : /* @__PURE__ */ e(k, { label: "Starting stock", htmlFor: `${r}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(F, { id: `${r}-initial`, value: i.initial_stock, onChange: (s) => n(0, { initial_stock: s }) }) }),
      /* @__PURE__ */ e(k, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        D,
        {
          id: `${r}-backorders`,
          value: i.backorders,
          onChange: (s) => n(0, { backorders: s }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(k, { label: "Low stock at", htmlFor: `${r}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(F, { id: `${r}-low`, value: i.low_stock_threshold, onChange: (s) => n(0, { low_stock_threshold: s }) }) })
    ] }) : /* @__PURE__ */ e(k, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
      D,
      {
        id: `${r}-status`,
        value: i.stock_status,
        onChange: (s) => n(0, { stock_status: s }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function Le({ value: t, update: n, path: c }) {
  const { Button: r } = T, i = (l, s) => n({ tiers: t.tiers.map((o, f) => f === l ? { ...o, ...s } : o) });
  return /* @__PURE__ */ a(
    E,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        r,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => n({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((l, s) => /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(k, { label: "From (units)", htmlFor: `${c}-tier-${s}-min`, children: /* @__PURE__ */ e(F, { id: `${c}-tier-${s}-min`, min: 2, value: l.min_qty, onChange: (o) => i(s, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(k, { label: "Price", htmlFor: `${c}-tier-${s}-type`, children: /* @__PURE__ */ e(
            D,
            {
              id: `${c}-tier-${s}-type`,
              value: l.type,
              onChange: (o) => i(s, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(k, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${c}-tier-${s}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(F, { id: `${c}-tier-${s}-value`, value: l.value / 100, onChange: (o) => i(s, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(j, { id: `${c}-tier-${s}-value`, value: l.value, nullable: !1, onChange: (o) => i(s, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(k, { label: "For", htmlFor: `${c}-tier-${s}-variant`, children: /* @__PURE__ */ e(
            D,
            {
              id: `${c}-tier-${s}-variant`,
              value: l.variant ?? "",
              onChange: (o) => i(s, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, pe(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, f) => f !== s) }), children: "Remove" })
        ] }, s))
      ]
    }
  );
}
function Ue({ value: t, update: n, updateVariant: c, path: r }) {
  const i = t.variants[0];
  if (!i) return null;
  const l = (s) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...s })) }) : c(0, s);
  return /* @__PURE__ */ e(E, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ a(U, { cols: 4, children: [
    /* @__PURE__ */ e(k, { label: "Weight (grams)", htmlFor: `${r}-weight`, children: /* @__PURE__ */ e(F, { id: `${r}-weight`, value: i.weight, onChange: (s) => l({ weight: s }) }) }),
    /* @__PURE__ */ e(k, { label: "Length (mm)", htmlFor: `${r}-length`, children: /* @__PURE__ */ e(F, { id: `${r}-length`, value: i.length, onChange: (s) => l({ length: s }) }) }),
    /* @__PURE__ */ e(k, { label: "Width (mm)", htmlFor: `${r}-width`, children: /* @__PURE__ */ e(F, { id: `${r}-width`, value: i.width, onChange: (s) => l({ width: s }) }) }),
    /* @__PURE__ */ e(k, { label: "Height (mm)", htmlFor: `${r}-height`, children: /* @__PURE__ */ e(F, { id: `${r}-height`, value: i.height, onChange: (s) => l({ height: s }) }) })
  ] }) });
}
const Y = {
  options: {},
  sku: null,
  barcode: null,
  price: 0,
  compare_at_price: null,
  cost: null,
  weight: null,
  length: null,
  width: null,
  height: null,
  image: null,
  requires_shipping: null,
  downloadable: null,
  track_stock: !1,
  initial_stock: null,
  backorders: "no",
  low_stock_threshold: null,
  stock_status: "in_stock",
  min_qty: 1,
  max_qty: null,
  qty_step: 1,
  active: !0,
  downloads: []
};
function ze(t) {
  const [n, c] = w.useState({}), r = t.filter((i) => !(i in n));
  return w.useEffect(() => {
    if (r.length === 0) return;
    const i = r.map((l) => `ids[]=${l}`).join("&");
    L(q(`api/terms?${i}`)).then((l) => c((s) => ({ ...s, ...Object.fromEntries(l.data.map((o) => [o.id, o.title])) }))).catch(() => {
    });
  }, [r.join(",")]), n;
}
function We({ option: t, onChange: n, onRemove: c, config: r, path: i }) {
  const { Button: l, Input: s, Badge: o } = T, { FieldRenderer: f } = X, [m, b] = w.useState(""), g = () => {
    const d = m.split(",").map((h) => h.trim()).filter(Boolean).filter((h) => !t.values.some((u) => (u.label ?? "").toLowerCase() === h.toLowerCase()));
    d.length && n({ ...t, values: [...t.values, ...d.map((h) => ({ id: I(), label: h }))] }), b("");
  }, p = t.values.map((d) => d.term_id).filter((d) => !!d);
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ a("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(k, { label: "Option name", htmlFor: `${i}-name`, children: /* @__PURE__ */ e(s, { id: `${i}-name`, value: t.name, placeholder: "Size", onChange: (d) => n({ ...t, name: d.target.value }) }) }),
      r.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(k, { label: "Values from", htmlFor: `${i}-source`, children: /* @__PURE__ */ e(
        D,
        {
          id: `${i}-source`,
          value: t.taxonomy ?? "",
          onChange: (d) => n({ ...t, taxonomy: d || null, values: [] }),
          options: [["", "Custom values"], ...r.attribute_taxonomies.map((d) => [d.handle, d.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: c, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      f,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: { taxonomy: t.taxonomy } }],
        values: { terms: p },
        pathPrefix: `${i}-terms`,
        onChange: (d) => {
          const h = d.terms ?? [], u = t.values.filter((_) => _.term_id && h.includes(_.term_id)), x = h.filter((_) => !u.some((N) => N.term_id === _)).map((_) => ({ id: I(), term_id: _ }));
          n({ ...t, values: [...u, ...x] });
        }
      }
    ) : /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((d) => /* @__PURE__ */ a(o, { variant: "secondary", className: "cm:gap-1", children: [
        d.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => n({ ...t, values: t.values.filter((h) => h.id !== d.id) }), children: "×" })
      ] }, d.id)) }),
      /* @__PURE__ */ a("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          s,
          {
            value: m,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (d) => b(d.target.value),
            onKeyDown: (d) => {
              d.key === "Enter" && (d.preventDefault(), g());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: g, children: "Add" })
      ] })
    ] })
  ] });
}
function Ke({ variant: t, index: n, updateVariant: c, tab: r }) {
  const { FieldRenderer: i } = X, l = `${r.path}-v${n}`, s = r.live?.variants[t.id];
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ a(U, { cols: 4, children: [
      /* @__PURE__ */ e(k, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(j, { id: `${l}-cost`, value: t.cost, onChange: (o) => c(n, { cost: o }) }) }),
      /* @__PURE__ */ e(k, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(z, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => c(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(k, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(F, { id: `${l}-weight`, value: t.weight, onChange: (o) => c(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(k, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(F, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => c(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(F, { min: 1, value: t.max_qty, onChange: (o) => c(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(F, { min: 1, value: t.qty_step, onChange: (o) => c(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    r.config.features.inventory && /* @__PURE__ */ a(U, { cols: 4, children: [
      /* @__PURE__ */ e(M, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => c(n, { track_stock: o }) }),
      t.track_stock && (s?.track_stock && s.stock_quantity !== null ? /* @__PURE__ */ e(k, { label: "In stock", children: /* @__PURE__ */ a("p", { className: "cm:text-sm", children: [
        s.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(k, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(F, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => c(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(k, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        D,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => c(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(k, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        D,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => c(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(
      i,
      {
        fields: [{ handle: "image", type: "asset", label: "Image", config: { image_only: !0 } }],
        values: { image: t.image },
        pathPrefix: `${l}-image`,
        onChange: (o) => c(n, { image: o.image ?? null })
      }
    )
  ] });
}
function He(t) {
  const { value: n, update: c, updateVariant: r, config: i, entryId: l, live: s } = t, { Button: o, Table: f, TableBody: m, TableCell: b, TableHead: g, TableHeader: p, TableRow: d, Switch: h } = T, [u, x] = w.useState(null), _ = ze(n.options.flatMap((v) => v.values.map((C) => C.term_id).filter((C) => !!C))), N = n.variants[0] ?? { ...Y, id: I() }, y = (v = n.options) => c({ options: v, variants: Ie(v, n.variants, { ...N, initial_stock: null, image: null }, i.max_variants) });
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      E,
      {
        title: "Options",
        description: `Up to ${i.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < i.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => c({ options: [...n.options, { id: I(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((v, C) => /* @__PURE__ */ e(
          We,
          {
            option: v,
            config: i,
            path: `${t.path}-o${C}`,
            onChange: (S) => y(n.options.map(($, G) => G === C ? S : $)),
            onRemove: () => y(n.options.filter((S, $) => $ !== C))
          },
          v.id
        ))
      }
    ),
    /* @__PURE__ */ a(
      E,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => y(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ a(f, { children: [
            /* @__PURE__ */ e(p, { children: /* @__PURE__ */ a(d, { children: [
              /* @__PURE__ */ e(g, { children: "Variant" }),
              /* @__PURE__ */ e(g, { children: "SKU" }),
              /* @__PURE__ */ e(g, { children: "Price" }),
              /* @__PURE__ */ e(g, { children: "Compare-at" }),
              i.features.inventory && /* @__PURE__ */ e(g, { children: "Stock" }),
              /* @__PURE__ */ e(g, { children: "On sale" }),
              /* @__PURE__ */ e(g, {})
            ] }) }),
            /* @__PURE__ */ e(m, { children: n.variants.map((v, C) => {
              const S = s?.variants[v.id];
              return /* @__PURE__ */ a(w.Fragment, { children: [
                /* @__PURE__ */ a(d, { className: v.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(b, { className: "cm:font-medium cm:whitespace-nowrap", children: pe(n.options, v, _) }),
                  /* @__PURE__ */ e(b, { className: "cm:min-w-36", children: /* @__PURE__ */ e(fe, { value: v.sku, entryId: l, onChange: ($) => r(C, { sku: $ }) }) }),
                  /* @__PURE__ */ e(b, { className: "cm:min-w-32", children: /* @__PURE__ */ e(j, { value: v.price, nullable: !1, onChange: ($) => r(C, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(b, { className: "cm:min-w-32", children: /* @__PURE__ */ e(j, { value: v.compare_at_price, onChange: ($) => r(C, { compare_at_price: $ }) }) }),
                  i.features.inventory && /* @__PURE__ */ e(b, { className: "cm:whitespace-nowrap cm:text-sm", children: v.track_stock ? S?.stock_quantity ?? v.initial_stock ?? 0 : /* @__PURE__ */ e(R, { children: v.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(b, { children: /* @__PURE__ */ e(h, { checked: v.active, "aria-label": "Sell this variant", onCheckedChange: ($) => r(C, { active: $ }) }) }),
                  /* @__PURE__ */ e(b, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": u === v.id, onClick: () => x(u === v.id ? null : v.id), children: u === v.id ? "Close" : "More" }) })
                ] }),
                u === v.id && /* @__PURE__ */ e(d, { children: /* @__PURE__ */ e(b, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(Ke, { variant: v, index: C, updateVariant: r, tab: t }) }) })
              ] }, v.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ a("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            A(Math.min(...n.variants.map((v) => v.price))),
            " to ",
            A(Math.max(...n.variants.map((v) => v.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function Ge(t) {
  const n = t ?? {}, c = (n.variants?.length ? n.variants : [{ ...Y, id: I() }]).map((r) => ({ ...Y, ...r, id: r.id ?? I() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: n.requires_shipping ?? !0,
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: c,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function Qe({ field: t, value: n, onChange: c, errors: r, pathPrefix: i = "data.product" }) {
  H();
  const l = t.config ?? {}, s = Ge(n), { props: o } = O.usePage(), f = o.entry?.id ?? null, [m, b] = w.useState(null);
  w.useEffect(() => {
    f && L(q(`commerce/api/products/${f}`)).then((y) => b(y.data)).catch(() => {
    });
  }, [f, o.entry]);
  const g = (y) => {
    const v = { ...s, ...y };
    y.type && y.type !== "variable" && (v.options = [], v.variants = [{ ...v.variants[0], options: {} }]), y.type === "bundle" && !v.bundle && (v.bundle = { pricing: "fixed", value: 0, items: [] }), c(v);
  }, p = (y, v) => g({ variants: s.variants.map((C, S) => S === y ? { ...C, ...v } : C) }), d = [{ key: "general", label: "General", render: (y) => /* @__PURE__ */ e(Me, { ...y }) }];
  s.type === "variable" && d.push({ key: "variants", label: "Variants", render: (y) => /* @__PURE__ */ e(He, { ...y }) }), s.type === "bundle" && d.push({ key: "bundle", label: "Bundle", render: (y) => /* @__PURE__ */ e(je, { ...y }) }), s.type !== "variable" && (l.features?.inventory ?? !0) && d.push({ key: "inventory", label: "Inventory", render: (y) => /* @__PURE__ */ e(Ae, { ...y }) }), s.requires_shipping && d.push({ key: "shipping", label: "Shipping", render: (y) => /* @__PURE__ */ e(Ue, { ...y }) }), d.push({ key: "pricing", label: "Bulk prices", render: (y) => /* @__PURE__ */ e(Le, { ...y }) }), s.downloadable && d.push({ key: "digital", label: "Digital", render: (y) => /* @__PURE__ */ e(Pe, { ...y }) });
  for (const [y, v] of Object.entries(P.productTabs()))
    d.push({ key: `ext-${y}`, label: v.label ?? y, render: (C) => /* @__PURE__ */ e(v, { ...C }) });
  const [h, u] = w.useState("general"), x = d.find((y) => y.key === h) ?? d[0], _ = r?.[i], N = { value: s, update: g, updateVariant: p, config: l, live: m, entryId: f, path: i.replace(/\W+/g, "-") };
  return /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    m?.sync_status === "failed" && /* @__PURE__ */ a("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      m.sync_error,
      ". Fix it and publish again."
    ] }),
    _ && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: _ }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: d.map((y) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": y.key === x.key,
        onClick: () => u(y.key),
        className: K("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", y.key === x.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: y.label
      },
      y.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: x.render(N) })
  ] });
}
const Xe = {
  commerce_money: Fe,
  commerce_datetime_range: Se,
  commerce_region: qe,
  commerce_product: Qe
};
function Je() {
  Object.entries(Xe).forEach(([t, n]) => W.registerField(t, n));
}
function Ye() {
  Object.assign(P.components, { EmptyState: ue, MoneyInput: te, PageHeader: J, SchemaFormView: ee, SectionNav: ge, SettingsLayout: Z, StatusBadge: R });
}
ve();
Ye();
Je();
Ce();
