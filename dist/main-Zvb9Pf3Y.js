const ce = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Q = ce;
function xe(e) {
  Q = { ...ce, ...e ?? {} };
}
function se(e, t = Q) {
  const n = e < 0, c = Math.abs(Math.round(e)), o = 10 ** t.decimals, l = Math.floor(c / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(c % o).padStart(t.decimals, "0") : "", u = l + a, d = t.space ? " " : "", p = t.position === "left" ? `${t.symbol}${d}${u}` : `${u}${d}${t.symbol}`;
  return n ? `-${p}` : p;
}
function oe(e, t = Q) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const c = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, l = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(l) || o + l === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(l.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return c ? -a : a;
}
const I = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, U = {
  version: 1,
  registerOrderPanel: (e, t) => {
    I.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    I.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    I.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    I.productTabs[e] = t;
  },
  orderPanels: () => I.orderPanels,
  dashboardWidgets: () => I.dashboardWidgets,
  settingsSections: () => I.settingsSections,
  productTabs: () => I.productTabs,
  formatMoney: se,
  parseMoney: oe,
  components: {}
};
function we() {
  window.SunriceCommerce = U;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(U);
      } catch (c) {
        console.error("SunriceCommerceQueue call failed", c);
      }
    }
  })(), e.push = ((...n) => (n.forEach((c) => c(U)), e.length)), window.SunriceCommerceQueue = e;
}
const i = globalThis.Sunrice?.modules?.react;
if (!i)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Te = i.Activity, Ne = i.Children, $e = i.Component, ke = i.Fragment, Ee = i.Profiler, Pe = i.PureComponent, De = i.StrictMode, _e = i.Suspense, Ie = i.ViewTransition, Le = i.act, Me = i.addTransitionType, Fe = i.cache, Re = i.cacheSignal, Ae = i.captureOwnerStack, He = i.cloneElement, Oe = i.createContext, je = i.createElement, Ve = i.createRef, Be = i.forwardRef, Ue = i.isValidElement, ze = i.lazy, qe = i.memo, We = i.startTransition, Ke = i.unstable_useCacheRefresh, Qe = i.use, Xe = i.useActionState, Ge = i.useCallback, Je = i.useContext, Ye = i.useDebugValue, Ze = i.useDeferredValue, et = i.useEffect, tt = i.useEffectEvent, nt = i.useId, rt = i.useImperativeHandle, ct = i.useInsertionEffect, st = i.useLayoutEffect, ot = i.useMemo, at = i.useOptimistic, it = i.useReducer, lt = i.useRef, mt = i.useState, dt = i.useSyncExternalStore, ut = i.useTransition, pt = i.version, gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: Te,
  Children: Ne,
  Component: $e,
  Fragment: ke,
  Profiler: Ee,
  PureComponent: Pe,
  StrictMode: De,
  Suspense: _e,
  ViewTransition: Ie,
  act: Le,
  addTransitionType: Me,
  cache: Fe,
  cacheSignal: Re,
  captureOwnerStack: Ae,
  cloneElement: He,
  createContext: Oe,
  createElement: je,
  createRef: Ve,
  default: i,
  forwardRef: Be,
  isValidElement: Ue,
  lazy: ze,
  memo: qe,
  startTransition: We,
  unstable_useCacheRefresh: Ke,
  use: Qe,
  useActionState: Xe,
  useCallback: Ge,
  useContext: Je,
  useDebugValue: Ye,
  useDeferredValue: Ze,
  useEffect: et,
  useEffectEvent: tt,
  useId: nt,
  useImperativeHandle: rt,
  useInsertionEffect: ct,
  useLayoutEffect: st,
  useMemo: ot,
  useOptimistic: at,
  useReducer: it,
  useRef: lt,
  useState: mt,
  useSyncExternalStore: dt,
  useTransition: ut,
  version: pt
}, Symbol.toStringTag, { value: "Module" })), y = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!y)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
y.App;
y.Deferred;
y.Form;
const ht = y.Head;
y.InfiniteScroll;
const bt = y.Link;
y.WhenMounted;
y.WhenVisible;
y.config;
y.createInertiaApp;
y.http;
y.progress;
y.resetLayoutProps;
const ft = y.router;
y.setLayoutProps;
const yt = y.useForm;
y.useFormContext;
y.useHttp;
const St = y.usePage;
y.usePoll;
y.usePrefetch;
y.useRemember;
const r = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!r)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const vt = r.Badge, Ct = r.Button, xt = r.Card, wt = r.CardContent, Tt = r.CardDescription;
r.CardFooter;
const Nt = r.CardHeader, $t = r.CardTitle, kt = r.Checkbox;
r.CodeEditor;
const Et = r.CollapsibleCard;
r.Command;
r.CommandEmpty;
r.CommandGroup;
r.CommandInput;
r.CommandItem;
r.CommandList;
r.CommandSeparator;
r.DatePicker;
r.DeveloperHelp;
const Pt = r.Dialog, Dt = r.DialogContent, _t = r.DialogDescription, It = r.DialogFooter, Lt = r.DialogHeader, Mt = r.DialogTitle;
r.DialogTrigger;
const Ft = r.DropdownMenu, Rt = r.DropdownMenuCheckboxItem, At = r.DropdownMenuContent;
r.DropdownMenuItem;
const Ht = r.DropdownMenuLabel;
r.DropdownMenuSeparator;
const Ot = r.DropdownMenuTrigger;
r.FormSections;
const jt = r.Input;
r.KeptEditsNotice;
const Vt = r.Label;
r.LanguageTabs;
r.LinkAttributes;
r.LinkSourcePicker;
const Bt = r.MediaPickerInput;
r.moveItem;
const Ut = r.PageHeader, zt = r.Popover;
r.PopoverAnchor;
const qt = r.PopoverContent, Wt = r.PopoverTrigger;
r.registerCommandSource;
const Kt = r.RichTextEditor, Qt = r.Select, Xt = r.SelectContent, Gt = r.SelectItem, Jt = r.SelectTrigger, Yt = r.SelectValue;
r.Separator;
const Zt = r.SettingsLayout;
r.SettingsNav;
r.Skeleton;
r.SortableHandle;
r.SortableList;
const en = r.Switch, tn = r.Table, nn = r.TableBody, rn = r.TableCell, cn = r.TableHead, sn = r.TableHeader, on = r.TableRow, an = r.Tabs, ln = r.TabsContent, mn = r.TabsList, dn = r.TabsTrigger, un = r.Textarea;
r.Tooltip;
r.TooltipContent;
r.TooltipTrigger;
const pn = r.toast;
r.TrashBanner;
r.TrashHint;
r.TrashTitle;
const ae = r.useBreadcrumbs;
r.useEditLock;
const gn = r.useTablePreferences, hn = r.useUnsavedChanges;
r.ViewingNotice;
const ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: vt,
  Button: Ct,
  Card: xt,
  CardContent: wt,
  CardDescription: Tt,
  CardHeader: Nt,
  CardTitle: $t,
  Checkbox: kt,
  CollapsibleCard: Et,
  Dialog: Pt,
  DialogContent: Dt,
  DialogDescription: _t,
  DialogFooter: It,
  DialogHeader: Lt,
  DialogTitle: Mt,
  DropdownMenu: Ft,
  DropdownMenuCheckboxItem: Rt,
  DropdownMenuContent: At,
  DropdownMenuLabel: Ht,
  DropdownMenuTrigger: Ot,
  Input: jt,
  Label: Vt,
  MediaPickerInput: Bt,
  PageHeader: Ut,
  Popover: zt,
  PopoverContent: qt,
  PopoverTrigger: Wt,
  RichTextEditor: Kt,
  Select: Qt,
  SelectContent: Xt,
  SelectItem: Gt,
  SelectTrigger: Jt,
  SelectValue: Yt,
  SettingsLayout: Zt,
  Switch: en,
  Table: tn,
  TableBody: nn,
  TableCell: rn,
  TableHead: cn,
  TableHeader: sn,
  TableRow: on,
  Tabs: an,
  TabsContent: ln,
  TabsList: mn,
  TabsTrigger: dn,
  Textarea: un,
  toast: pn,
  useBreadcrumbs: ae,
  useTablePreferences: gn,
  useUnsavedChanges: hn
}, Symbol.toStringTag, { value: "Module" })), G = 3, le = () => window.Sunrice, N = gt, D = ie, H = {
  router: ft,
  Link: bt,
  Head: ht,
  usePage: St,
  useForm: yt
}, Un = D.toast, bn = ae;
function z(e = "") {
  return e.startsWith("/") ? e : le().adminUrl(e);
}
async function me(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, c = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!c.ok)
    throw new Error(`${c.status} ${c.statusText}`);
  return await c.json();
}
function fn(e) {
  const t = le();
  if (t.version !== G)
    throw new Error(`[commerce] This bundle was built for admin runtime ${G}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, c] of Object.entries(e))
    t.registerPageLoader(n, c);
}
const yn = {
  "Commerce/Confirmations/Index": () => import("./Index-1ZCKz-qZ.js"),
  "Commerce/Customers/Show": () => import("./Show-DMdzw4ol.js"),
  "Commerce/Dashboard": () => import("./Dashboard-BR4rXin7.js"),
  "Commerce/Inventory/Index": () => import("./Index-hUTxRXUY.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-DPuvm1S1.js"),
  "Commerce/Marketing/Report": () => import("./Report-BEHyf5DE.js"),
  "Commerce/Orders/Editor": () => import("./Editor-jpK6b5bZ.js"),
  "Commerce/Orders/Show": () => import("./Show-DpXJLYZr.js"),
  "Commerce/Products/Index": () => import("./Index-krC663is.js"),
  "Commerce/Products/Import": () => import("./Import-C3l-Wm7x.js"),
  "Commerce/Reports/Show": () => import("./Show-0bTszmxz.js"),
  "Commerce/Settings/Section": () => import("./Section-CzNZGmxq.js"),
  "Commerce/Settings/Emails": () => import("./Emails-CRqjIK9G.js"),
  "Commerce/Settings/Features": () => import("./Features-FvmZN_YX.js"),
  "Commerce/Settings/Payments": () => import("./Payments-zvJnlqAC.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-CS8eEZML.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-CHKqegeR.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-B1V_tpxI.js")
};
function Sn() {
  fn(yn);
}
const V = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!V)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const vn = V.Fragment, s = V.jsx, g = V.jsxs;
V.jsx;
function J(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (c) => String(c).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function Y(e) {
  return e ? new Date(e).toISOString() : null;
}
function de({ value: e, onChange: t, id: n }) {
  const { Input: c, Label: o } = D, l = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ s(
        c,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: J(l.start),
          onChange: (a) => t({ ...l, start: Y(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ s(
        c,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: J(l.end),
          onChange: (a) => t({ ...l, end: Y(a.target.value) })
        }
      )
    ] })
  ] });
}
function ue({
  value: e,
  onChange: t,
  id: n,
  placeholder: c,
  allowNull: o = !0,
  invalid: l
}) {
  const { Input: a } = D, u = (S) => S == null ? "" : se(S).replace(/^[^\d-]+|[^\d]+$/g, ""), [d, p] = N.useState(u(e)), [T, w] = N.useState(!1);
  return N.useEffect(() => {
    T || p(u(e));
  }, [e, T]), /* @__PURE__ */ s(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: d,
      placeholder: c,
      "aria-invalid": l || void 0,
      onFocus: () => w(!0),
      onChange: (S) => {
        p(S.target.value);
        const E = S.target.value.trim() === "" ? o ? null : 0 : oe(S.target.value);
        (E !== null || S.target.value.trim() === "") && t(E);
      },
      onBlur: () => {
        w(!1), p(u(e));
      }
    }
  );
}
function pe() {
  const { props: e } = H.usePage(), t = e.commerce ?? {};
  return xe(t.currency), t;
}
function ge({ field: e, value: t, onChange: n, errors: c, id: o }) {
  return pe(), /* @__PURE__ */ s(
    ue,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!c?.[""]
    }
  );
}
const Z = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Cn = { province: 1, city: 2, district: 3, village: 4 }, B = /* @__PURE__ */ new Map();
function xn(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return B.has(n) || B.set(n, me(n).then((c) => c.data).catch(() => (B.delete(n), []))), B.get(n);
}
const ee = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function he({ field: e, value: t, onChange: n, id: c }) {
  const { Label: o } = D, l = e.config ?? {}, a = String(l.api ?? ""), u = Cn[l.depth ?? "district"] ?? 3, d = l.country_options ?? [], p = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, T = Z.slice(0, u), [w, S] = N.useState({}), E = [null, p.province_code, p.city_code, p.district_code];
  N.useEffect(() => {
    p.country !== "ID" || !a || T.forEach((f, m) => {
      const b = E[m];
      m > 0 && !b || xn(a, b).then((k) => S((F) => ({ ...F, [f.key]: k })));
    });
  }, [a, p.country, p.province_code, p.city_code, p.district_code]);
  const L = (f, m) => {
    const b = { ...p };
    b[T[f].key] = m || null, Z.slice(f + 1).forEach((k) => {
      b[k.key] = null;
    }), n(b);
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    d.length > 0 && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${c}-country`, children: "Country" }),
      /* @__PURE__ */ s(
        "select",
        {
          id: `${c}-country`,
          className: ee,
          value: p.country,
          onChange: (f) => n({ country: f.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: d.map((f) => /* @__PURE__ */ s("option", { value: f.value, children: f.label }, f.value))
        }
      )
    ] }),
    p.country === "ID" && T.map((f, m) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${c}-${f.key}`, children: f.label }),
      /* @__PURE__ */ g(
        "select",
        {
          id: `${c}-${f.key}`,
          className: ee,
          value: p[f.key] ?? "",
          disabled: m > 0 && !E[m],
          onChange: (b) => L(m, b.target.value),
          children: [
            /* @__PURE__ */ s("option", { value: "", children: "Choose…" }),
            (w[f.key] ?? []).map((b) => /* @__PURE__ */ s("option", { value: b.code, children: b.name }, b.code))
          ]
        }
      )
    ] }, f.key))
  ] });
}
function be({ field: e, value: t, onChange: n, id: c }) {
  const { Input: o, Badge: l } = D, a = e.config ?? {}, u = Array.isArray(t) ? t : [], [d, p] = N.useState(""), [T, w] = N.useState([]), [S, E] = N.useState(!1);
  N.useEffect(() => {
    if (!S) return;
    const m = new URLSearchParams({ q: d });
    (a.types ?? []).forEach((k) => m.append("types[]", k)), (a.taxonomies ?? []).forEach((k) => m.append("taxonomies[]", k));
    const b = setTimeout(() => me(`${a.api}?${m}`).then((k) => w(k.data)).catch(() => w([])), 200);
    return () => clearTimeout(b);
  }, [d, S]);
  const L = (m) => u.some((b) => b.type === m.type && b.id === m.id), f = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    u.length > 0 && /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: u.map((m) => /* @__PURE__ */ g(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ g("span", { className: "cm:text-muted-foreground", children: [
        f[m.type],
        ":"
      ] }),
      " ",
      m.label,
      /* @__PURE__ */ s("button", { type: "button", "aria-label": `Remove ${m.label}`, onClick: () => n(u.filter((b) => !(b.type === m.type && b.id === m.id))), children: "×" })
    ] }, `${m.type}:${m.id}`)) }),
    /* @__PURE__ */ g("div", { className: "cm:relative", children: [
      /* @__PURE__ */ s(
        o,
        {
          id: c,
          value: d,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => E(!0),
          onBlur: () => setTimeout(() => E(!1), 150),
          onChange: (m) => p(m.target.value)
        }
      ),
      S && T.length > 0 && /* @__PURE__ */ s("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: T.map((m) => /* @__PURE__ */ s("li", { children: /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          disabled: L(m),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (b) => b.preventDefault(),
          onClick: () => {
            n([...u, { type: m.type, id: m.id, label: m.label }]), p("");
          },
          children: [
            /* @__PURE__ */ s("span", { children: m.label }),
            /* @__PURE__ */ s("span", { className: "cm:text-xs cm:text-muted-foreground", children: m.group })
          ]
        }
      ) }, `${m.type}:${m.id}`)) })
    ] })
  ] });
}
const wn = N.lazy(() => import("./ProductEditor-CqT0U4uV.js")), Tn = (e) => N.createElement(N.Suspense, { fallback: null }, N.createElement(wn, e)), Nn = {
  commerce_money: ge,
  commerce_datetime_range: de,
  commerce_region: he,
  commerce_targets: be,
  commerce_product: Tn
};
function $n() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Nn).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const kn = N.lazy(() => import("./ChartImpl-Berv4jdy.js"));
function En(e) {
  const t = /* @__PURE__ */ s("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ s(N.Suspense, { fallback: t, children: /* @__PURE__ */ s(kn, { ...e }) });
}
function Pn({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ g("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ s("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ s("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ s("div", { className: "cm:mt-2", children: n })
  ] });
}
function fe(e) {
  var t, n, c = "";
  if (typeof e == "string" || typeof e == "number") c += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = fe(e[t])) && (c && (c += " "), c += n);
  } else for (n in e) e[n] && (c && (c += " "), c += n);
  return c;
}
function Dn() {
  for (var e, t, n = 0, c = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = fe(e)) && (c && (c += " "), c += t);
  return c;
}
function q(...e) {
  return Dn(e);
}
function zn() {
  const { Card: e, CardContent: t } = D;
  return /* @__PURE__ */ s(e, { "aria-hidden": "true", children: /* @__PURE__ */ g(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:h-4" })
  ] }) });
}
function _n({ kpi: e }) {
  const { Card: t, CardContent: n } = D, { Link: c } = H, o = e.change ?? null, l = /* @__PURE__ */ g(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ s("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ g(
      "span",
      {
        className: q("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ s("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
          " ",
          Math.abs(o).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ g("span", { className: "cm:sr-only", children: [
            o > 0 ? " up" : o < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ s("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ s(t, { children: e.href ? /* @__PURE__ */ s(c, { href: z(e.href), className: "cm:block", children: l }) : l });
}
function ye({ title: e, description: t, actions: n, primary: c, menu: o, back: l, children: a }) {
  const { Head: u } = H, { PageHeader: d } = D;
  return /* @__PURE__ */ g(vn, { children: [
    /* @__PURE__ */ s(u, { title: e }),
    /* @__PURE__ */ s(d, { title: e, description: t, actions: n, primary: c, menu: o?.length ? o : void 0, back: l, children: a })
  ] });
}
const te = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function In(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const c = "rules" in n ? n.rules : [n];
  if (c.length === 0) return !0;
  const o = c.map((l) => {
    const a = t?.[l.field], u = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), d = (Array.isArray(a) ? a : [a]).map(te).includes(te(l.value));
    return l.operator === "equals" ? d : l.operator === "not_equals" ? !d : l.operator === "filled" ? u : !u;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function Ln(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function Mn(e, t) {
  const n = {};
  for (const [c, o] of Object.entries(e))
    c === t ? n[""] = o : c.startsWith(`${t}.`) && (n[c.slice(t.length + 1)] = o);
  return n;
}
function Fn(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const Se = ie, Rn = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: ge,
  commerce_datetime_range: de,
  commerce_region: he,
  commerce_targets: be
}, ne = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
}, W = "__none";
function K({ fields: e, values: t, onChange: n, errors: c = {}, pathPrefix: o = "values", section: l }) {
  const a = e, u = c;
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((d) => In(d, t ?? {})).map((d) => /* @__PURE__ */ s("div", { className: q(
    "cm:min-w-0",
    ne[d.width ?? 100] ?? ne[100],
    // A switch beside an input sits level with the input, not its label.
    d.type === "toggle" && (d.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ s(
    An,
    {
      field: d,
      value: t?.[d.handle],
      path: `${o}.${d.handle}`,
      errors: u,
      hideLabel: !!l && d.label === l,
      onChange: (p) => n({ ...t, [d.handle]: p })
    }
  ) }, d.handle)) });
}
function An({ field: e, value: t, onChange: n, path: c, errors: o, hideLabel: l = !1 }) {
  const { Label: a } = Se, u = c.replace(/[^A-Za-z0-9_-]+/g, "-"), d = o[c], p = e.instructions ? `${u}-help` : void 0, T = [p, d ? `${u}-error` : void 0].filter(Boolean).join(" ") || void 0, w = e.label ?? e.handle, S = e.type === "toggle";
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !S && !l && /* @__PURE__ */ g(a, { htmlFor: e.type === "group" || e.type === "repeater" ? void 0 : u, id: `${u}-label`, children: [
      w,
      e.required && /* @__PURE__ */ s("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ s(Hn, { field: e, value: t, onChange: n, id: u, path: c, errors: o, describedBy: T, label: w }),
    p && /* @__PURE__ */ s("p", { id: p, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    d && /* @__PURE__ */ s("p", { id: `${u}-error`, className: "cm:text-sm cm:text-destructive", children: d })
  ] });
}
function Hn({ field: e, value: t, onChange: n, id: c, path: o, errors: l, describedBy: a, label: u }) {
  const { Input: d, Textarea: p, Switch: T, Label: w, Button: S, MediaPickerInput: E, RichTextEditor: L, Checkbox: f, Select: m, SelectTrigger: b, SelectValue: k, SelectContent: F, SelectItem: x } = Se, P = l[o] !== void 0, C = e.config ?? {}, O = Rn[e.type];
  if (O)
    return /* @__PURE__ */ s(O, { field: e, value: t, onChange: n, errors: Mn(l, o), id: c, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ s(
        p,
        {
          id: c,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": P,
          "aria-describedby": a,
          onChange: (h) => n(h.target.value)
        }
      );
    case "number":
      return /* @__PURE__ */ s(
        d,
        {
          id: c,
          type: "number",
          inputMode: "decimal",
          value: t == null ? "" : String(t),
          "aria-invalid": P,
          "aria-describedby": a,
          min: C.min,
          max: C.max,
          step: C.step ?? "any",
          onChange: (h) => n(Fn(h.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ s(
        d,
        {
          id: c,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": P,
          "aria-describedby": a,
          onChange: (h) => n(h.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ s(T, { id: c, checked: t === !0, "aria-describedby": a, onCheckedChange: (h) => n(h) }),
        /* @__PURE__ */ s(w, { htmlFor: c, children: u })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const h = Ln(e), M = e.type !== "select";
      if (C.multiple === !0) {
        const v = (Array.isArray(t) ? t : []).map(String), A = ($, j) => {
          const X = j ? [...v, $] : v.filter((Ce) => Ce !== $);
          n(M ? X.map(Number) : X);
        };
        return /* @__PURE__ */ s("div", { role: "group", "aria-labelledby": `${c}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: h.map(($) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ s(f, { checked: v.includes($.value), onCheckedChange: (j) => A($.value, j === !0) }),
          $.label
        ] }, $.value)) });
      }
      const R = Array.isArray(t) ? t[0] : t, _ = R == null || R === "";
      return /* @__PURE__ */ g(m, { value: _ ? W : String(R), onValueChange: (v) => n(v === W ? null : M ? Number(v) : v), children: [
        /* @__PURE__ */ s(b, { id: c, className: "cm:w-full", "aria-invalid": P, "aria-describedby": a, children: /* @__PURE__ */ s(k, { placeholder: "—" }) }),
        /* @__PURE__ */ g(F, { children: [
          (!e.required || _) && /* @__PURE__ */ s(x, { value: W, children: "—" }),
          h.map((v) => /* @__PURE__ */ s(x, { value: v.value, children: v.label }, v.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ s(
        E,
        {
          id: c,
          value: t ?? null,
          multiple: C.multiple === !0,
          max: C.max,
          invalid: P,
          types: Array.isArray(C.types) ? C.types : C.image_only ? ["image"] : void 0,
          onChange: (h) => n(h)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ s(
        L,
        {
          id: c,
          value: typeof t == "string" ? t : "",
          invalid: P,
          labelledBy: `${c}-label`,
          onChange: (h) => n(h ?? "")
        }
      );
    case "group":
      return /* @__PURE__ */ s(K, { fields: e.fields ?? [], values: t ?? {}, errors: l, pathPrefix: o, onChange: (h) => n(h) });
    case "repeater": {
      const h = Array.isArray(t) ? t : [], M = (_) => n(_), R = () => Object.fromEntries((e.fields ?? []).map((_) => [_.handle, _.type === "toggle" ? !1 : null]));
      return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3", children: [
        h.map((_, v) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:rounded-lg cm:border cm:p-4", children: [
          /* @__PURE__ */ s(
            K,
            {
              fields: e.fields ?? [],
              values: _,
              errors: l,
              pathPrefix: `${o}.${v}`,
              onChange: (A) => M(h.map(($, j) => j === v ? A : $))
            }
          ),
          /* @__PURE__ */ g("div", { className: "cm:flex cm:gap-2", children: [
            /* @__PURE__ */ s(S, { type: "button", size: "sm", variant: "ghost", disabled: v === 0, onClick: () => M(h.map((A, $) => $ === v - 1 ? h[v] : $ === v ? h[v - 1] : A)), children: "Move up" }),
            /* @__PURE__ */ s(S, { type: "button", size: "sm", variant: "ghost", onClick: () => M(h.filter((A, $) => $ !== v)), children: "Remove" })
          ] })
        ] }, v)),
        /* @__PURE__ */ s("div", { children: /* @__PURE__ */ g(S, { type: "button", size: "sm", variant: "outline", disabled: typeof C.max == "number" && h.length >= C.max, onClick: () => M([...h, R()]), children: [
          "Add ",
          u.toLowerCase()
        ] }) })
      ] });
    }
    default:
      return /* @__PURE__ */ s(
        d,
        {
          id: c,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": P,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: C.placeholder,
          onChange: (h) => n(h.target.value)
        }
      );
  }
}
function On({ form: e, id: t, storageKey: n, footer: c }) {
  const { Button: o, Card: l, CardContent: a, CollapsibleCard: u, useUnsavedChanges: d } = D, { data: p, setData: T, errors: w, processing: S, isDirty: E, ...L } = H.useForm({ values: e.values }), f = () => L[e.method](e.action, { preserveScroll: !0 });
  d(E, f);
  const m = e.fields, b = e.sections?.length ? e.sections : [{ title: null, description: null, fields: m.map((x) => x.handle) }], k = Object.keys(w), F = (x, P = null) => /* @__PURE__ */ s(
    K,
    {
      fields: m.filter((C) => x.includes(C.handle)),
      values: p.values,
      errors: w,
      pathPrefix: "values",
      section: P,
      onChange: (C) => T("values", C)
    }
  );
  return /* @__PURE__ */ g("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (x) => {
    x.preventDefault(), f();
  }, children: [
    w.section && /* @__PURE__ */ s("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: w.section }),
    b.map((x, P) => x.title === null ? /* @__PURE__ */ s(l, { children: /* @__PURE__ */ s(a, { children: F(x.fields) }) }, `untitled-${P}`) : /* @__PURE__ */ s(
      u,
      {
        title: x.title,
        description: x.description ?? void 0,
        storageKey: n ? `${n}:${x.title}` : void 0,
        hasErrors: x.fields.some((C) => k.some((O) => O === `values.${C}` || O.startsWith(`values.${C}.`))),
        children: F(x.fields, x.title)
      },
      x.title
    )),
    (t === void 0 || c) && /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ s(o, { type: "submit", disabled: S, children: e.submitLabel }),
      c
    ] })
  ] });
}
function ve({ items: e, current: t, label: n = "Sections" }) {
  const { Link: c } = H;
  return /* @__PURE__ */ s("nav", { "aria-label": n, className: "cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: e.map((o) => /* @__PURE__ */ s(
    c,
    {
      href: z(o.href),
      "aria-current": o.key === t ? "page" : void 0,
      className: q(
        "cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:pb-2.5 cm:pt-1 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:text-foreground",
        o.key === t && "cm:border-foreground cm:font-medium cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function jn({ sections: e, current: t, title: n, description: c, primary: o, children: l }) {
  const { SettingsLayout: a } = D;
  pe();
  const u = H.usePage().props.commerce?.settingsNav ?? [];
  return bn([{ label: "Settings", href: z("settings") }, { label: "Store", href: z("commerce/settings") }, { label: n }]), /* @__PURE__ */ s("div", { children: /* @__PURE__ */ s(a, { items: u, current: "commerce-settings", children: /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ s(ye, { title: n, description: c, primary: o }),
    /* @__PURE__ */ s(ve, { items: e, current: t, label: "Store settings" }),
    l
  ] }) }) });
}
const re = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Vn({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ s("span", { className: q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", re[e] ?? re.neutral), children: t });
}
function Bn() {
  Object.assign(U.components, { Chart: En, EmptyState: Pn, KpiCard: _n, MoneyInput: ue, PageHeader: ye, SchemaFormView: On, SectionNav: ve, SettingsLayout: jn, StatusBadge: Vn });
}
we();
Bn();
$n();
Sn();
export {
  gt as A,
  ot as B,
  En as C,
  lt as D,
  Pn as E,
  vn as F,
  Ge as G,
  et as H,
  rt as I,
  st as J,
  zn as K,
  qe as L,
  ue as M,
  ke as N,
  Ne as O,
  ye as P,
  $e as Q,
  N as R,
  Vn as S,
  be as T,
  ie as U,
  Pe as V,
  bn as a,
  z as b,
  s as c,
  D as d,
  U as e,
  _n as f,
  se as g,
  me as h,
  H as i,
  g as j,
  K as k,
  he as l,
  q as m,
  jn as n,
  On as o,
  mt as p,
  gn as q,
  Ue as r,
  Be as s,
  Un as t,
  pe as u,
  Dn as v,
  je as w,
  Je as x,
  Oe as y,
  He as z
};
