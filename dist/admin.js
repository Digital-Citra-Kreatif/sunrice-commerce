const V = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let O = V;
function ne(e) {
  O = { ...V, ...e ?? {} };
}
function J(e, c = O) {
  const n = e < 0, r = Math.abs(Math.round(e)), a = 10 ** c.decimals, i = Math.floor(r / a).toString().replace(/\B(?=(\d{3})+(?!\d))/g, c.thousands), d = c.decimals > 0 ? c.decimal + String(r % a).padStart(c.decimals, "0") : "", h = i + d, p = c.space ? " " : "", m = c.position === "left" ? `${c.symbol}${p}${h}` : `${h}${p}${c.symbol}`;
  return n ? `-${m}` : m;
}
function Y(e, c = O) {
  let n = e.replace(c.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(c.thousands).join("");
  const [a, i = ""] = n.split(c.decimal);
  if (!/^\d*$/.test(a) || !/^\d*$/.test(i) || a + i === "")
    return null;
  const d = Number(a || "0") * 10 ** c.decimals + Number(i.padEnd(c.decimals, "0").slice(0, c.decimals) || "0");
  return r ? -d : d;
}
const w = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, $ = {
  version: 1,
  registerOrderPanel: (e, c) => {
    w.orderPanels[e] = c;
  },
  registerDashboardWidget: (e, c) => {
    w.dashboardWidgets[e] = c;
  },
  registerSettingsSection: (e, c) => {
    w.settingsSections[e] = c;
  },
  registerProductTab: (e, c) => {
    w.productTabs[e] = c;
  },
  orderPanels: () => w.orderPanels,
  dashboardWidgets: () => w.dashboardWidgets,
  settingsSections: () => w.settingsSections,
  productTabs: () => w.productTabs,
  formatMoney: J,
  parseMoney: Y,
  components: {}
};
function re() {
  window.SunriceCommerce = $;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.($);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r($)), e.length)), window.SunriceCommerceQueue = e;
}
const T = window.Sunrice, { React: k, ui: _, components: z, inertia: C, adminUrl: D, fetchJson: se, toast: Ne } = T, G = window.Sunrice.React, K = G.Fragment;
function t(e, c, n) {
  return G.createElement(e, n === void 0 ? c : { ...c, key: n });
}
const s = t;
function X({ title: e, description: c, action: n }) {
  return /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ t("p", { className: "cm:font-medium", children: e }),
    c && /* @__PURE__ */ t("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: c }),
    n && /* @__PURE__ */ t("div", { className: "cm:mt-2", children: n })
  ] });
}
function E({ title: e, description: c, actions: n }) {
  const { Head: r } = C;
  return /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ t(r, { title: e }),
    /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ t("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: e }),
      c && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-muted-foreground", children: c })
    ] }),
    n && /* @__PURE__ */ t("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: n })
  ] });
}
function Z(e) {
  var c, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (c = 0; c < a; c++) e[c] && (n = Z(e[c])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function le() {
  for (var e, c, n = 0, r = "", a = arguments.length; n < a; n++) (e = arguments[n]) && (c = Z(e)) && (r && (r += " "), r += c);
  return r;
}
function ee(...e) {
  return le(e);
}
const P = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function F({ tone: e = "neutral", children: c }) {
  return /* @__PURE__ */ t("span", { className: ee("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", P[e] ?? P.neutral), children: c });
}
function M() {
  const { props: e } = C.usePage(), c = e.commerce ?? {};
  return ne(c.currency), c;
}
function ae({ mode: e, setup: c, health: n, kpis: r, todo: a }) {
  const { Card: i, CardContent: d, CardHeader: h, CardTitle: p, CardDescription: m } = _, { Link: f } = C;
  M();
  const x = c.filter((l) => !l.done), b = n.filter((l) => l.status !== "ok"), N = Object.entries($.dashboardWidgets());
  return /* @__PURE__ */ s("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(E, { title: "Store", description: /* @__PURE__ */ s(K, { children: [
      "Selling mode: ",
      e.label
    ] }) }),
    x.length > 0 && /* @__PURE__ */ s(i, { children: [
      /* @__PURE__ */ s(h, { children: [
        /* @__PURE__ */ t(p, { children: "Set up your store" }),
        /* @__PURE__ */ s(m, { children: [
          c.length - x.length,
          " of ",
          c.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-2", children: c.map((l) => /* @__PURE__ */ s(f, { href: D(l.href), className: "cm:flex cm:items-start cm:gap-3 cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ t("span", { "aria-hidden": !0, className: l.done ? "cm:text-emerald-600" : "cm:text-muted-foreground", children: l.done ? "✓" : "○" }),
        /* @__PURE__ */ s("span", { className: "cm:grid", children: [
          /* @__PURE__ */ t("span", { className: l.done ? "cm:text-muted-foreground cm:line-through" : "cm:font-medium", children: l.label }),
          l.description && /* @__PURE__ */ t("span", { className: "cm:text-sm cm:text-muted-foreground", children: l.description })
        ] })
      ] }, l.key)) })
    ] }),
    b.length > 0 && /* @__PURE__ */ s(i, { children: [
      /* @__PURE__ */ t(h, { children: /* @__PURE__ */ t(p, { children: "Needs attention" }) }),
      /* @__PURE__ */ t(d, { className: "cm:grid cm:gap-3", children: b.map((l) => /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
        /* @__PURE__ */ s("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          /* @__PURE__ */ t(F, { tone: l.status, children: l.status === "error" ? "Problem" : "Warning" }),
          /* @__PURE__ */ t("span", { className: "cm:font-medium", children: l.label })
        ] }),
        /* @__PURE__ */ t("p", { className: "cm:text-sm", children: l.message }),
        l.fix && /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-muted-foreground", children: l.fix })
      ] }, l.key)) })
    ] }),
    /* @__PURE__ */ t("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-4", children: r === void 0 ? [0, 1, 2, 3].map((l) => /* @__PURE__ */ t("div", { className: "cm:h-24 cm:animate-pulse cm:rounded-lg cm:bg-muted" }, l)) : r.map((l) => /* @__PURE__ */ t(i, { children: /* @__PURE__ */ s(d, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
      /* @__PURE__ */ t("span", { className: "cm:text-sm cm:text-muted-foreground", children: l.label }),
      /* @__PURE__ */ t("span", { className: "cm:text-2xl cm:font-semibold", children: l.value }),
      l.hint && /* @__PURE__ */ t("span", { className: "cm:text-xs cm:text-muted-foreground", children: l.hint })
    ] }) }, l.key)) }),
    /* @__PURE__ */ s(i, { children: [
      /* @__PURE__ */ t(h, { children: /* @__PURE__ */ t(p, { children: "To do" }) }),
      /* @__PURE__ */ t(d, { children: a === void 0 ? /* @__PURE__ */ t("div", { className: "cm:h-16 cm:animate-pulse cm:rounded-md cm:bg-muted" }) : a.length === 0 ? /* @__PURE__ */ t(X, { title: "Nothing to do", description: "Orders to process and payments to verify show up here." }) : /* @__PURE__ */ t("ul", { className: "cm:grid cm:gap-1", children: a.map((l) => /* @__PURE__ */ t("li", { children: /* @__PURE__ */ s(f, { href: D(l.href), className: "cm:flex cm:justify-between cm:rounded-md cm:p-2 cm:hover:bg-muted", children: [
        /* @__PURE__ */ t("span", { children: l.label }),
        /* @__PURE__ */ t("span", { className: "cm:font-semibold", children: l.count })
      ] }) }, l.key)) }) })
    ] }),
    N.map(([l, o]) => /* @__PURE__ */ t(o, {}, l))
  ] });
}
function ce({ items: e, current: c, label: n = "Sections" }) {
  const { Link: r } = C;
  return /* @__PURE__ */ t("nav", { "aria-label": n, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: e.map((a) => /* @__PURE__ */ t(
    r,
    {
      href: D(a.href),
      "aria-current": a.key === c ? "page" : void 0,
      className: ee(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        a.key === c && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: a.label
    },
    a.key
  )) });
}
function R({ sections: e, current: c, title: n, description: r, children: a }) {
  const { SettingsTabs: i } = z;
  return M(), T.useBreadcrumbs([{ label: "Settings", href: D("settings") }, { label: "Store", href: D("commerce/settings") }, { label: n }]), /* @__PURE__ */ s("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(i, { current: "store" }),
    /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
      /* @__PURE__ */ t(ce, { items: e, current: c, label: "Store settings" }),
      /* @__PURE__ */ s("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ t(E, { title: n, description: r }),
        a
      ] })
    ] })
  ] });
}
function ie({ sections: e, mode: c, groups: n, updateUrl: r }) {
  const { Card: a, CardContent: i, CardHeader: d, CardTitle: h, Switch: p, Button: m, Dialog: f, DialogContent: x, DialogDescription: b, DialogFooter: N, DialogHeader: l, DialogTitle: o } = _, { errors: v } = C.usePage().props, [g, S] = k.useState(null), [L, I] = k.useState(null), W = (y, u) => {
    I(y.key), C.router.put(r.replace("__key__", y.key), { on: u }, { preserveScroll: !0, onFinish: () => I(null) });
  };
  return /* @__PURE__ */ s(
    R,
    {
      sections: e,
      current: "features",
      title: "Features",
      description: /* @__PURE__ */ s(K, { children: [
        "Switch store modules on or off. Selling mode: ",
        /* @__PURE__ */ t("strong", { children: c.label }),
        ". Switching off never deletes data."
      ] }),
      children: [
        v.feature && /* @__PURE__ */ t("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: v.feature }),
        n.map((y) => /* @__PURE__ */ s(a, { children: [
          /* @__PURE__ */ t(d, { children: /* @__PURE__ */ t(h, { children: y.label }) }),
          /* @__PURE__ */ t(i, { className: "cm:grid cm:gap-0 cm:divide-y cm:divide-border", children: y.features.map((u) => /* @__PURE__ */ s("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-4 cm:py-3 cm:first:pt-0 cm:last:pb-0", children: [
            /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
              /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ t("label", { htmlFor: `feature-${u.key}`, className: "cm:font-medium", children: u.label }),
                u.core && /* @__PURE__ */ t(F, { children: "Always on" }),
                u.switched_on && !u.active && /* @__PURE__ */ s(F, { tone: "warning", children: [
                  "Off — ",
                  u.reasons.join("; ").replace(/^Needs /, "needs ")
                ] }),
                u.essential && /* @__PURE__ */ s(F, { tone: "info", children: [
                  "Needed by ",
                  c.label
                ] })
              ] }),
              /* @__PURE__ */ t("p", { className: "cm:text-sm cm:text-muted-foreground", children: u.description }),
              u.requires.length > 0 && /* @__PURE__ */ s("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Needs: ",
                u.requires.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ t(
              p,
              {
                id: `feature-${u.key}`,
                checked: u.switched_on,
                disabled: u.core || L === u.key,
                onCheckedChange: (H) => !H && u.dependents.length > 0 ? S(u) : W(u, H)
              }
            )
          ] }, u.key)) })
        ] }, y.key)),
        /* @__PURE__ */ t(f, { open: g !== null, onOpenChange: (y) => !y && S(null), children: /* @__PURE__ */ s(x, { children: [
          /* @__PURE__ */ s(l, { children: [
            /* @__PURE__ */ s(o, { children: [
              "Switch off ",
              g?.label,
              "?"
            ] }),
            /* @__PURE__ */ s(b, { children: [
              "These are switched off with it: ",
              g?.dependents.map((y) => y.label).join(", "),
              ". Their data is kept."
            ] })
          ] }),
          /* @__PURE__ */ s(N, { children: [
            /* @__PURE__ */ t(m, { variant: "outline", onClick: () => S(null), children: "Cancel" }),
            /* @__PURE__ */ t(
              m,
              {
                variant: "destructive",
                onClick: () => {
                  g && W(g, !1), S(null);
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
function B({ form: e, footer: c }) {
  const { FieldRenderer: n } = z, { Button: r } = _, { data: a, setData: i, errors: d, processing: h, isDirty: p, ...m } = C.useForm({ values: e.values });
  return /* @__PURE__ */ s(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (f) => {
        f.preventDefault(), m[e.method](e.action, { preserveScroll: !0 });
      },
      children: [
        d.section && /* @__PURE__ */ t("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.section }),
        /* @__PURE__ */ t(
          n,
          {
            fields: e.fields,
            values: a.values,
            errors: d,
            pathPrefix: "values",
            onChange: (f) => i("values", f)
          }
        ),
        /* @__PURE__ */ s("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ t(r, { type: "submit", disabled: h, children: e.submitLabel }),
          p && /* @__PURE__ */ t("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          c
        ] })
      ]
    }
  );
}
function me({ section: e, sections: c, form: n }) {
  return /* @__PURE__ */ t(R, { sections: c, current: e.key, title: `${e.label} settings`, children: /* @__PURE__ */ t(B, { form: n }, e.key) });
}
function de({ title: e, description: c, form: n, breadcrumbs: r = [] }) {
  return M(), T.useBreadcrumbs([...r, { label: e }]), /* @__PURE__ */ s("div", { className: "cm:mx-auto cm:grid cm:w-full cm:max-w-3xl cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ t(E, { title: e, description: c }),
    /* @__PURE__ */ t(B, { form: n })
  ] });
}
const oe = {
  "Commerce/Dashboard": ae,
  "Commerce/Settings/Section": me,
  "Commerce/Settings/Features": ie,
  "Commerce/Shared/SchemaForm": de
};
function ue() {
  Object.entries(oe).forEach(([e, c]) => T.registerPage(e, c));
}
function A(e) {
  if (!e) return "";
  const c = new Date(e);
  if (Number.isNaN(c.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${c.getFullYear()}-${n(c.getMonth() + 1)}-${n(c.getDate())}T${n(c.getHours())}:${n(c.getMinutes())}`;
}
function q(e) {
  return e ? new Date(e).toISOString() : null;
}
function ge({ value: e, onChange: c, pathPrefix: n }) {
  const { Input: r, Label: a } = _, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ t(a, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ t(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: A(i.start),
          onChange: (d) => c({ ...i, start: q(d.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ t(a, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ t(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: A(i.end),
          onChange: (d) => c({ ...i, end: q(d.target.value) })
        }
      )
    ] })
  ] });
}
function te({
  value: e,
  onChange: c,
  id: n,
  placeholder: r,
  allowNull: a = !0,
  invalid: i
}) {
  const { Input: d } = _, h = (b) => b == null ? "" : J(b).replace(/^[^\d-]+|[^\d]+$/g, ""), [p, m] = k.useState(h(e)), [f, x] = k.useState(!1);
  return k.useEffect(() => {
    f || m(h(e));
  }, [e, f]), /* @__PURE__ */ t(
    d,
    {
      id: n,
      inputMode: "decimal",
      value: p,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => x(!0),
      onChange: (b) => {
        m(b.target.value);
        const N = b.target.value.trim() === "" ? a ? null : 0 : Y(b.target.value);
        (N !== null || b.target.value.trim() === "") && c(N);
      },
      onBlur: () => {
        x(!1), m(h(e));
      }
    }
  );
}
function he({ field: e, value: c, onChange: n, errors: r, pathPrefix: a }) {
  return M(), /* @__PURE__ */ t(
    te,
    {
      id: a,
      value: c,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!(a && r?.[a])
    }
  );
}
const Q = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], pe = { province: 1, city: 2, district: 3, village: 4 }, j = /* @__PURE__ */ new Map();
function fe(e, c) {
  const n = c ? `${e}?parent=${encodeURIComponent(c)}` : e;
  return j.has(n) || j.set(n, se(n).then((r) => r.data).catch(() => (j.delete(n), []))), j.get(n);
}
const U = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function be({ field: e, value: c, onChange: n, pathPrefix: r }) {
  const { Label: a } = _, i = e.config ?? {}, d = String(i.api ?? ""), h = pe[i.depth ?? "district"] ?? 3, p = i.country_options ?? [], m = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...c ?? {} }, f = Q.slice(0, h), [x, b] = k.useState({}), N = [null, m.province_code, m.city_code, m.district_code];
  k.useEffect(() => {
    m.country !== "ID" || !d || f.forEach((o, v) => {
      const g = N[v];
      v > 0 && !g || fe(d, g).then((S) => b((L) => ({ ...L, [o.key]: S })));
    });
  }, [d, m.country, m.province_code, m.city_code, m.district_code]);
  const l = (o, v) => {
    const g = { ...m };
    g[f[o].key] = v || null, Q.slice(o + 1).forEach((S) => {
      g[S.key] = null;
    }), n(g);
  };
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    p.length > 0 && /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ t(a, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ t(
        "select",
        {
          id: `${r}-country`,
          className: U,
          value: m.country,
          onChange: (o) => n({ country: o.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: p.map((o) => /* @__PURE__ */ t("option", { value: o.value, children: o.label }, o.value))
        }
      )
    ] }),
    m.country === "ID" && f.map((o, v) => /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ t(a, { htmlFor: `${r}-${o.key}`, children: o.label }),
      /* @__PURE__ */ s(
        "select",
        {
          id: `${r}-${o.key}`,
          className: U,
          value: m[o.key] ?? "",
          disabled: v > 0 && !N[v],
          onChange: (g) => l(v, g.target.value),
          children: [
            /* @__PURE__ */ t("option", { value: "", children: "Choose…" }),
            (x[o.key] ?? []).map((g) => /* @__PURE__ */ t("option", { value: g.code, children: g.name }, g.code))
          ]
        }
      )
    ] }, o.key))
  ] });
}
const ve = {
  commerce_money: he,
  commerce_datetime_range: ge,
  commerce_region: be
};
function ye() {
  Object.entries(ve).forEach(([e, c]) => T.registerField(e, c));
}
function xe() {
  Object.assign($.components, { EmptyState: X, MoneyInput: te, PageHeader: E, SchemaFormView: B, SectionNav: ce, SettingsLayout: R, StatusBadge: F });
}
re();
xe();
ye();
ue();
