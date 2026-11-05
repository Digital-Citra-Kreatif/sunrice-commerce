const Q = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let H = Q;
function ue(e) {
  H = { ...Q, ...e ?? {} };
}
function X(e, t = H) {
  const n = e < 0, r = Math.abs(Math.round(e)), a = 10 ** t.decimals, d = Math.floor(r / a).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), l = t.decimals > 0 ? t.decimal + String(r % a).padStart(t.decimals, "0") : "", g = d + l, f = t.space ? " " : "", p = t.position === "left" ? `${t.symbol}${f}${g}` : `${g}${f}${t.symbol}`;
  return n ? `-${p}` : p;
}
function G(e, t = H) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [a, d = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(a) || !/^\d*$/.test(d) || a + d === "")
    return null;
  const l = Number(a || "0") * 10 ** t.decimals + Number(d.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return r ? -l : l;
}
const D = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, A = {
  version: 1,
  registerOrderPanel: (e, t) => {
    D.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    D.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    D.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    D.productTabs[e] = t;
  },
  orderPanels: () => D.orderPanels,
  dashboardWidgets: () => D.dashboardWidgets,
  settingsSections: () => D.settingsSections,
  productTabs: () => D.productTabs,
  formatMoney: X,
  parseMoney: G,
  components: {}
};
function pe() {
  window.SunriceCommerce = A;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(A);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r(A)), e.length)), window.SunriceCommerceQueue = e;
}
const i = globalThis.Sunrice?.modules?.react;
if (!i)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ge = i.Activity, he = i.Children, be = i.Component, fe = i.Fragment, ye = i.Profiler, ve = i.PureComponent, Se = i.StrictMode, xe = i.Suspense, Ce = i.ViewTransition, we = i.act, Te = i.addTransitionType, Ne = i.cache, ke = i.cacheSignal, $e = i.captureOwnerStack, Ee = i.cloneElement, Pe = i.createContext, De = i.createElement, _e = i.createRef, Ie = i.forwardRef, Le = i.isValidElement, Fe = i.lazy, Me = i.memo, Re = i.startTransition, Ae = i.unstable_useCacheRefresh, je = i.use, Oe = i.useActionState, He = i.useCallback, Ve = i.useContext, Be = i.useDebugValue, ze = i.useDeferredValue, Ue = i.useEffect, We = i.useEffectEvent, qe = i.useId, Ke = i.useImperativeHandle, Qe = i.useInsertionEffect, Xe = i.useLayoutEffect, Ge = i.useMemo, Je = i.useOptimistic, Ye = i.useReducer, Ze = i.useRef, et = i.useState, tt = i.useSyncExternalStore, nt = i.useTransition, ct = i.version, rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: ge,
  Children: he,
  Component: be,
  Fragment: fe,
  Profiler: ye,
  PureComponent: ve,
  StrictMode: Se,
  Suspense: xe,
  ViewTransition: Ce,
  act: we,
  addTransitionType: Te,
  cache: Ne,
  cacheSignal: ke,
  captureOwnerStack: $e,
  cloneElement: Ee,
  createContext: Pe,
  createElement: De,
  createRef: _e,
  default: i,
  forwardRef: Ie,
  isValidElement: Le,
  lazy: Fe,
  memo: Me,
  startTransition: Re,
  unstable_useCacheRefresh: Ae,
  use: je,
  useActionState: Oe,
  useCallback: He,
  useContext: Ve,
  useDebugValue: Be,
  useDeferredValue: ze,
  useEffect: Ue,
  useEffectEvent: We,
  useId: qe,
  useImperativeHandle: Ke,
  useInsertionEffect: Qe,
  useLayoutEffect: Xe,
  useMemo: Ge,
  useOptimistic: Je,
  useReducer: Ye,
  useRef: Ze,
  useState: et,
  useSyncExternalStore: tt,
  useTransition: nt,
  version: ct
}, Symbol.toStringTag, { value: "Module" })), y = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!y)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
y.App;
y.Deferred;
y.Form;
const st = y.Head;
y.InfiniteScroll;
const at = y.Link;
y.WhenMounted;
y.WhenVisible;
y.config;
y.createInertiaApp;
y.http;
y.progress;
y.resetLayoutProps;
const ot = y.router;
y.setLayoutProps;
const it = y.useForm;
y.useFormContext;
y.useHttp;
const lt = y.usePage;
y.usePoll;
y.usePrefetch;
y.useRemember;
const c = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!c)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const mt = c.Badge, dt = c.Button, ut = c.Card, pt = c.CardContent, gt = c.CardDescription;
c.CardFooter;
const ht = c.CardHeader, bt = c.CardTitle, ft = c.Checkbox;
c.CodeEditor;
c.CollapsibleCard;
c.Command;
c.CommandEmpty;
c.CommandGroup;
c.CommandInput;
c.CommandItem;
c.CommandList;
c.CommandSeparator;
c.DatePicker;
c.DeveloperHelp;
const yt = c.Dialog, vt = c.DialogContent, St = c.DialogDescription, xt = c.DialogFooter, Ct = c.DialogHeader, wt = c.DialogTitle;
c.DialogTrigger;
c.DropdownMenu;
c.DropdownMenuCheckboxItem;
c.DropdownMenuContent;
c.DropdownMenuItem;
c.DropdownMenuLabel;
c.DropdownMenuSeparator;
c.DropdownMenuTrigger;
c.FormSections;
const Tt = c.Input;
c.KeptEditsNotice;
const Nt = c.Label;
c.LanguageTabs;
c.LinkAttributes;
c.LinkSourcePicker;
const kt = c.MediaPickerInput;
c.moveItem;
c.PageHeader;
c.Popover;
c.PopoverAnchor;
c.PopoverContent;
c.PopoverTrigger;
c.registerCommandSource;
const $t = c.RichTextEditor, Et = c.Select, Pt = c.SelectContent, Dt = c.SelectItem, _t = c.SelectTrigger, It = c.SelectValue;
c.Separator;
const Lt = c.SettingsLayout;
c.SettingsNav;
c.Skeleton;
c.SortableHandle;
c.SortableList;
const Ft = c.Switch, Mt = c.Table, Rt = c.TableBody, At = c.TableCell, jt = c.TableHead, Ot = c.TableHeader, Ht = c.TableRow, Vt = c.Tabs, Bt = c.TabsContent, zt = c.TabsList, Ut = c.TabsTrigger, Wt = c.Textarea;
c.Tooltip;
c.TooltipContent;
c.TooltipTrigger;
const qt = c.toast;
c.TrashBanner;
c.TrashHint;
c.TrashTitle;
const J = c.useBreadcrumbs;
c.useEditLock;
c.useTablePreferences;
c.useUnsavedChanges;
c.ViewingNotice;
const Y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: mt,
  Button: dt,
  Card: ut,
  CardContent: pt,
  CardDescription: gt,
  CardHeader: ht,
  CardTitle: bt,
  Checkbox: ft,
  Dialog: yt,
  DialogContent: vt,
  DialogDescription: St,
  DialogFooter: xt,
  DialogHeader: Ct,
  DialogTitle: wt,
  Input: Tt,
  Label: Nt,
  MediaPickerInput: kt,
  RichTextEditor: $t,
  Select: Et,
  SelectContent: Pt,
  SelectItem: Dt,
  SelectTrigger: _t,
  SelectValue: It,
  SettingsLayout: Lt,
  Switch: Ft,
  Table: Mt,
  TableBody: Rt,
  TableCell: At,
  TableHead: jt,
  TableHeader: Ot,
  TableRow: Ht,
  Tabs: Vt,
  TabsContent: Bt,
  TabsList: zt,
  TabsTrigger: Ut,
  Textarea: Wt,
  toast: qt,
  useBreadcrumbs: J
}, Symbol.toStringTag, { value: "Module" })), B = 3, Z = () => window.Sunrice, x = rt, _ = Y, I = {
  router: ot,
  Link: at,
  Head: st,
  usePage: lt,
  useForm: it
}, Sn = _.toast, Kt = J;
function j(e = "") {
  return e.startsWith("/") ? e : Z().adminUrl(e);
}
async function ee(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function Qt(e) {
  const t = Z();
  if (t.version !== B)
    throw new Error(`[commerce] This bundle was built for admin runtime ${B}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const Xt = {
  "Commerce/Confirmations/Index": () => import("./Index-C1qMIupz.js"),
  "Commerce/Customers/Show": () => import("./Show-CqJRH9px.js"),
  "Commerce/Dashboard": () => import("./Dashboard-BzIS1xXQ.js"),
  "Commerce/Inventory/Index": () => import("./Index-C1ALMWkS.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-l3jBgWwM.js"),
  "Commerce/Marketing/Report": () => import("./Report-BR9oF6vV.js"),
  "Commerce/Orders/Editor": () => import("./Editor-Bmqm5WSr.js"),
  "Commerce/Orders/Show": () => import("./Show-Cb1d4QG5.js"),
  "Commerce/Products/Index": () => import("./Index-DnPmHvbc.js"),
  "Commerce/Reports/Show": () => import("./Show-2XeyuhO0.js"),
  "Commerce/Settings/Section": () => import("./Section-CsWmq0o9.js"),
  "Commerce/Settings/Emails": () => import("./Emails-BXM8olUg.js"),
  "Commerce/Settings/Features": () => import("./Features-Bo1ZSyii.js"),
  "Commerce/Settings/Payments": () => import("./Payments-XdmpH7NI.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BI5RugaP.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-Bke6XlVa.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-Cfbe_Wkw.js")
};
function Gt() {
  Qt(Xt);
}
const F = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!F)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const xn = F.Fragment, s = F.jsx, u = F.jsxs;
F.jsx;
function z(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function U(e) {
  return e ? new Date(e).toISOString() : null;
}
function te({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: a } = _, d = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(a, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ s(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: z(d.start),
          onChange: (l) => t({ ...d, start: U(l.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(a, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ s(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: z(d.end),
          onChange: (l) => t({ ...d, end: U(l.target.value) })
        }
      )
    ] })
  ] });
}
function ne({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: a = !0,
  invalid: d
}) {
  const { Input: l } = _, g = (v) => v == null ? "" : X(v).replace(/^[^\d-]+|[^\d]+$/g, ""), [f, p] = x.useState(g(e)), [C, T] = x.useState(!1);
  return x.useEffect(() => {
    C || p(g(e));
  }, [e, C]), /* @__PURE__ */ s(
    l,
    {
      id: n,
      inputMode: "decimal",
      value: f,
      placeholder: r,
      "aria-invalid": d || void 0,
      onFocus: () => T(!0),
      onChange: (v) => {
        p(v.target.value);
        const k = v.target.value.trim() === "" ? a ? null : 0 : G(v.target.value);
        (k !== null || v.target.value.trim() === "") && t(k);
      },
      onBlur: () => {
        T(!1), p(g(e));
      }
    }
  );
}
function ce() {
  const { props: e } = I.usePage(), t = e.commerce ?? {};
  return ue(t.currency), t;
}
function re({ field: e, value: t, onChange: n, errors: r, id: a }) {
  return ce(), /* @__PURE__ */ s(
    ne,
    {
      id: a,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const W = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Jt = { province: 1, city: 2, district: 3, village: 4 }, R = /* @__PURE__ */ new Map();
function Yt(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return R.has(n) || R.set(n, ee(n).then((r) => r.data).catch(() => (R.delete(n), []))), R.get(n);
}
const q = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function se({ field: e, value: t, onChange: n, id: r }) {
  const { Label: a } = _, d = e.config ?? {}, l = String(d.api ?? ""), g = Jt[d.depth ?? "district"] ?? 3, f = d.country_options ?? [], p = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, C = W.slice(0, g), [T, v] = x.useState({}), k = [null, p.province_code, p.city_code, p.district_code];
  x.useEffect(() => {
    p.country !== "ID" || !l || C.forEach((h, o) => {
      const b = k[o];
      o > 0 && !b || Yt(l, b).then((m) => v((E) => ({ ...E, [h.key]: m })));
    });
  }, [l, p.country, p.province_code, p.city_code, p.district_code]);
  const L = (h, o) => {
    const b = { ...p };
    b[C[h].key] = o || null, W.slice(h + 1).forEach((m) => {
      b[m.key] = null;
    }), n(b);
  };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    f.length > 0 && /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(a, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ s(
        "select",
        {
          id: `${r}-country`,
          className: q,
          value: p.country,
          onChange: (h) => n({ country: h.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: f.map((h) => /* @__PURE__ */ s("option", { value: h.value, children: h.label }, h.value))
        }
      )
    ] }),
    p.country === "ID" && C.map((h, o) => /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(a, { htmlFor: `${r}-${h.key}`, children: h.label }),
      /* @__PURE__ */ u(
        "select",
        {
          id: `${r}-${h.key}`,
          className: q,
          value: p[h.key] ?? "",
          disabled: o > 0 && !k[o],
          onChange: (b) => L(o, b.target.value),
          children: [
            /* @__PURE__ */ s("option", { value: "", children: "Choose…" }),
            (T[h.key] ?? []).map((b) => /* @__PURE__ */ s("option", { value: b.code, children: b.name }, b.code))
          ]
        }
      )
    ] }, h.key))
  ] });
}
function ae({ field: e, value: t, onChange: n, id: r }) {
  const { Input: a, Badge: d } = _, l = e.config ?? {}, g = Array.isArray(t) ? t : [], [f, p] = x.useState(""), [C, T] = x.useState([]), [v, k] = x.useState(!1);
  x.useEffect(() => {
    if (!v) return;
    const o = new URLSearchParams({ q: f });
    (l.types ?? []).forEach((m) => o.append("types[]", m)), (l.taxonomies ?? []).forEach((m) => o.append("taxonomies[]", m));
    const b = setTimeout(() => ee(`${l.api}?${o}`).then((m) => T(m.data)).catch(() => T([])), 200);
    return () => clearTimeout(b);
  }, [f, v]);
  const L = (o) => g.some((b) => b.type === o.type && b.id === o.id), h = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    g.length > 0 && /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: g.map((o) => /* @__PURE__ */ u(d, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ u("span", { className: "cm:text-muted-foreground", children: [
        h[o.type],
        ":"
      ] }),
      " ",
      o.label,
      /* @__PURE__ */ s("button", { type: "button", "aria-label": `Remove ${o.label}`, onClick: () => n(g.filter((b) => !(b.type === o.type && b.id === o.id))), children: "×" })
    ] }, `${o.type}:${o.id}`)) }),
    /* @__PURE__ */ u("div", { className: "cm:relative", children: [
      /* @__PURE__ */ s(
        a,
        {
          id: r,
          value: f,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => k(!0),
          onBlur: () => setTimeout(() => k(!1), 150),
          onChange: (o) => p(o.target.value)
        }
      ),
      v && C.length > 0 && /* @__PURE__ */ s("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((o) => /* @__PURE__ */ s("li", { children: /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          disabled: L(o),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (b) => b.preventDefault(),
          onClick: () => {
            n([...g, { type: o.type, id: o.id, label: o.label }]), p("");
          },
          children: [
            /* @__PURE__ */ s("span", { children: o.label }),
            /* @__PURE__ */ s("span", { className: "cm:text-xs cm:text-muted-foreground", children: o.group })
          ]
        }
      ) }, `${o.type}:${o.id}`)) })
    ] })
  ] });
}
const Zt = x.lazy(() => import("./ProductEditor-BZmy401f.js")), en = (e) => x.createElement(x.Suspense, { fallback: null }, x.createElement(Zt, e)), tn = {
  commerce_money: re,
  commerce_datetime_range: te,
  commerce_region: se,
  commerce_targets: ae,
  commerce_product: en
};
function nn() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(tn).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const cn = x.lazy(() => import("./ChartImpl-CvHXrpNT.js"));
function rn(e) {
  const t = /* @__PURE__ */ s("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ s(x.Suspense, { fallback: t, children: /* @__PURE__ */ s(cn, { ...e }) });
}
function sn({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ u("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ s("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ s("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ s("div", { className: "cm:mt-2", children: n })
  ] });
}
function oe(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (t = 0; t < a; t++) e[t] && (n = oe(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function an() {
  for (var e, t, n = 0, r = "", a = arguments.length; n < a; n++) (e = arguments[n]) && (t = oe(e)) && (r && (r += " "), r += t);
  return r;
}
function V(...e) {
  return an(e);
}
function on({ kpi: e }) {
  const { Card: t, CardContent: n } = _, { Link: r } = I, a = e.change ?? null, d = /* @__PURE__ */ u(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ s("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    a !== null && /* @__PURE__ */ u(
      "span",
      {
        className: V("cm:text-xs cm:font-medium", a > 0 ? "cm:text-emerald-600" : a < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ s("span", { "aria-hidden": !0, children: a > 0 ? "▲" : a < 0 ? "▼" : "•" }),
          " ",
          Math.abs(a).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ u("span", { className: "cm:sr-only", children: [
            a > 0 ? " up" : a < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ s("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ s(t, { children: e.href ? /* @__PURE__ */ s(r, { href: j(e.href), className: "cm:block", children: d }) : d });
}
function ie({ title: e, description: t, actions: n }) {
  const { Head: r } = I;
  return /* @__PURE__ */ u("div", { className: "cm:flex cm:flex-wrap cm:items-start cm:justify-between cm:gap-4", children: [
    /* @__PURE__ */ s(r, { title: e }),
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s("h1", { className: "cm:text-xl cm:font-semibold cm:tracking-tight", children: e }),
      t && /* @__PURE__ */ s("p", { className: "cm:text-sm cm:text-muted-foreground", children: t })
    ] }),
    n && /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: n })
  ] });
}
function ln(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function mn(e, t) {
  const n = {};
  for (const [r, a] of Object.entries(e))
    r === t ? n[""] = a : r.startsWith(`${t}.`) && (n[r.slice(t.length + 1)] = a);
  return n;
}
function dn(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const le = Y, un = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: re,
  commerce_datetime_range: te,
  commerce_region: se,
  commerce_targets: ae
}, pn = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-3 cm:text-sm";
function O({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: a = "values" }) {
  const d = e, l = r;
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-5", children: d.map((g) => /* @__PURE__ */ s(
    gn,
    {
      field: g,
      value: t?.[g.handle],
      path: `${a}.${g.handle}`,
      errors: l,
      onChange: (f) => n({ ...t, [g.handle]: f })
    },
    g.handle
  )) });
}
function gn({ field: e, value: t, onChange: n, path: r, errors: a }) {
  const { Label: d } = le, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), g = a[r], f = e.instructions ? `${l}-help` : void 0, p = [f, g ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, C = e.label ?? e.handle, T = e.type === "toggle";
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !T && /* @__PURE__ */ u(d, { htmlFor: e.type === "group" || e.type === "repeater" ? void 0 : l, id: `${l}-label`, children: [
      C,
      e.required && /* @__PURE__ */ s("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ s(hn, { field: e, value: t, onChange: n, id: l, path: r, errors: a, describedBy: p, label: C }),
    f && /* @__PURE__ */ s("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    g && /* @__PURE__ */ s("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: g })
  ] });
}
function hn({ field: e, value: t, onChange: n, id: r, path: a, errors: d, describedBy: l, label: g }) {
  const { Input: f, Textarea: p, Switch: C, Label: T, Button: v, MediaPickerInput: k, RichTextEditor: L } = le, h = d[a] !== void 0, o = e.config ?? {}, b = un[e.type];
  if (b)
    return /* @__PURE__ */ s(b, { field: e, value: t, onChange: n, errors: mn(d, a), id: r, describedBy: l });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ s(
        p,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
          "aria-describedby": l,
          onChange: (m) => n(m.target.value)
        }
      );
    case "number":
      return /* @__PURE__ */ s(
        f,
        {
          id: r,
          type: "number",
          inputMode: "decimal",
          value: t == null ? "" : String(t),
          "aria-invalid": h,
          "aria-describedby": l,
          min: o.min,
          max: o.max,
          step: o.step ?? "any",
          onChange: (m) => n(dn(m.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ s(
        f,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
          "aria-describedby": l,
          onChange: (m) => n(m.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ s(C, { id: r, checked: t === !0, "aria-describedby": l, onCheckedChange: (m) => n(m) }),
        /* @__PURE__ */ s(T, { htmlFor: r, children: g })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const m = ln(e), E = e.type !== "select";
      if (o.multiple === !0) {
        const S = (Array.isArray(t) ? t : []).map(String), N = (w, $) => {
          const M = $ ? [...S, w] : S.filter((de) => de !== w);
          n(E ? M.map(Number) : M);
        };
        return /* @__PURE__ */ s("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": l, className: "cm:grid cm:gap-1.5 cm:sm:grid-cols-2", children: m.map((w) => /* @__PURE__ */ u("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ s("input", { type: "checkbox", checked: S.includes(w.value), onChange: ($) => N(w.value, $.target.checked) }),
          w.label
        ] }, w.value)) });
      }
      const P = Array.isArray(t) ? t[0] : t;
      return /* @__PURE__ */ u(
        "select",
        {
          id: r,
          className: pn,
          value: P == null ? "" : String(P),
          "aria-invalid": h,
          "aria-describedby": l,
          onChange: (S) => n(S.target.value === "" ? null : E ? Number(S.target.value) : S.target.value),
          children: [
            (!e.required || P === null || P === void 0 || P === "") && /* @__PURE__ */ s("option", { value: "", children: "—" }),
            m.map((S) => /* @__PURE__ */ s("option", { value: S.value, children: S.label }, S.value))
          ]
        }
      );
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ s(
        k,
        {
          id: r,
          value: t ?? null,
          multiple: o.multiple === !0,
          max: o.max,
          invalid: h,
          types: Array.isArray(o.types) ? o.types : o.image_only ? ["image"] : void 0,
          onChange: (m) => n(m)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ s(
        L,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: h,
          labelledBy: `${r}-label`,
          onChange: (m) => n(m ?? "")
        }
      );
    case "group":
      return /* @__PURE__ */ s("div", { className: "cm:rounded-lg cm:border cm:p-4", children: /* @__PURE__ */ s(O, { fields: e.fields ?? [], values: t ?? {}, errors: d, pathPrefix: a, onChange: (m) => n(m) }) });
    case "repeater": {
      const m = Array.isArray(t) ? t : [], E = (S) => n(S), P = () => Object.fromEntries((e.fields ?? []).map((S) => [S.handle, S.type === "toggle" ? !1 : null]));
      return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3", children: [
        m.map((S, N) => /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3 cm:rounded-lg cm:border cm:p-4", children: [
          /* @__PURE__ */ s(
            O,
            {
              fields: e.fields ?? [],
              values: S,
              errors: d,
              pathPrefix: `${a}.${N}`,
              onChange: (w) => E(m.map(($, M) => M === N ? w : $))
            }
          ),
          /* @__PURE__ */ u("div", { className: "cm:flex cm:gap-2", children: [
            /* @__PURE__ */ s(v, { type: "button", size: "sm", variant: "ghost", disabled: N === 0, onClick: () => E(m.map((w, $) => $ === N - 1 ? m[N] : $ === N ? m[N - 1] : w)), children: "Move up" }),
            /* @__PURE__ */ s(v, { type: "button", size: "sm", variant: "ghost", onClick: () => E(m.filter((w, $) => $ !== N)), children: "Remove" })
          ] })
        ] }, N)),
        /* @__PURE__ */ s("div", { children: /* @__PURE__ */ u(v, { type: "button", size: "sm", variant: "outline", disabled: typeof o.max == "number" && m.length >= o.max, onClick: () => E([...m, P()]), children: [
          "Add ",
          g.toLowerCase()
        ] }) })
      ] });
    }
    default:
      return /* @__PURE__ */ s(
        f,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": h,
          "aria-describedby": l,
          maxLength: void 0,
          placeholder: o.placeholder,
          onChange: (m) => n(m.target.value)
        }
      );
  }
}
function bn({ form: e, footer: t }) {
  const { Button: n } = _, { data: r, setData: a, errors: d, processing: l, isDirty: g, ...f } = I.useForm({ values: e.values });
  return /* @__PURE__ */ u(
    "form",
    {
      className: "cm:grid cm:gap-6",
      onSubmit: (p) => {
        p.preventDefault(), f[e.method](e.action, { preserveScroll: !0 });
      },
      children: [
        d.section && /* @__PURE__ */ s("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: d.section }),
        /* @__PURE__ */ s(
          O,
          {
            fields: e.fields,
            values: r.values,
            errors: d,
            pathPrefix: "values",
            onChange: (p) => a("values", p)
          }
        ),
        /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
          /* @__PURE__ */ s(n, { type: "submit", disabled: l, children: e.submitLabel }),
          g && /* @__PURE__ */ s("span", { className: "cm:text-sm cm:text-muted-foreground", children: "Unsaved changes" }),
          t
        ] })
      ]
    }
  );
}
function me({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = I;
  return /* @__PURE__ */ s("nav", { "aria-label": n, className: "cm:flex cm:gap-1 cm:overflow-x-auto cm:md:flex-col", children: e.map((a) => /* @__PURE__ */ s(
    r,
    {
      href: j(a.href),
      "aria-current": a.key === t ? "page" : void 0,
      className: V(
        "cm:whitespace-nowrap cm:rounded-md cm:px-3 cm:py-1.5 cm:text-sm cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground",
        a.key === t && "cm:bg-muted cm:font-medium cm:text-foreground"
      ),
      children: a.label
    },
    a.key
  )) });
}
function fn({ sections: e, current: t, title: n, description: r, children: a }) {
  const { SettingsLayout: d } = _;
  ce();
  const l = I.usePage().props.commerce?.settingsNav ?? [];
  return Kt([{ label: "Settings", href: j("settings") }, { label: "Store", href: j("commerce/settings") }, { label: n }]), /* @__PURE__ */ s("div", { className: "cm:p-4 cm:md:p-6", children: /* @__PURE__ */ s(d, { items: l, current: "commerce-settings", children: /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-6 cm:md:grid-cols-[12rem_1fr]", children: [
    /* @__PURE__ */ s(me, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ u("div", { className: "cm:grid cm:min-w-0 cm:content-start cm:gap-6", children: [
      /* @__PURE__ */ s(ie, { title: n, description: r }),
      a
    ] })
  ] }) }) });
}
const K = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function yn({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ s("span", { className: V("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", K[e] ?? K.neutral), children: t });
}
function vn() {
  Object.assign(A.components, { Chart: rn, EmptyState: sn, KpiCard: on, MoneyInput: ne, PageHeader: ie, SchemaFormView: bn, SectionNav: me, SettingsLayout: fn, StatusBadge: yn });
}
pe();
vn();
nn();
Gt();
export {
  Ze as A,
  He as B,
  rn as C,
  Ue as D,
  sn as E,
  xn as F,
  Ke as G,
  Xe as H,
  Me as I,
  fe as J,
  on as K,
  he as L,
  ne as M,
  be as N,
  ve as O,
  ie as P,
  x as R,
  yn as S,
  ae as T,
  Y as U,
  Kt as a,
  j as b,
  s as c,
  _ as d,
  A as e,
  X as f,
  ee as g,
  O as h,
  I as i,
  u as j,
  se as k,
  V as l,
  fn as m,
  bn as n,
  et as o,
  Le as p,
  Ie as q,
  an as r,
  De as s,
  Sn as t,
  ce as u,
  Ve as v,
  Pe as w,
  Ee as x,
  rt as y,
  Ge as z
};
