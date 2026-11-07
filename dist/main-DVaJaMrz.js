const ce = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Q = ce;
function Te(e) {
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
}, B = {
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
function Ne() {
  window.SunriceCommerce = B;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(B);
      } catch (c) {
        console.error("SunriceCommerceQueue call failed", c);
      }
    }
  })(), e.push = ((...n) => (n.forEach((c) => c(B)), e.length)), window.SunriceCommerceQueue = e;
}
const i = globalThis.Sunrice?.modules?.react;
if (!i)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Ee = i.Activity, $e = i.Children, ke = i.Component, Pe = i.Fragment, De = i.Profiler, _e = i.PureComponent, Ie = i.StrictMode, Le = i.Suspense, Me = i.ViewTransition, Fe = i.act, Re = i.addTransitionType, Ae = i.cache, He = i.cacheSignal, Oe = i.captureOwnerStack, je = i.cloneElement, Ve = i.createContext, Be = i.createElement, Ue = i.createRef, ze = i.forwardRef, qe = i.isValidElement, We = i.lazy, Ke = i.memo, Qe = i.startTransition, Xe = i.unstable_useCacheRefresh, Ge = i.use, Je = i.useActionState, Ye = i.useCallback, Ze = i.useContext, et = i.useDebugValue, tt = i.useDeferredValue, nt = i.useEffect, rt = i.useEffectEvent, ct = i.useId, st = i.useImperativeHandle, ot = i.useInsertionEffect, at = i.useLayoutEffect, it = i.useMemo, lt = i.useOptimistic, mt = i.useReducer, dt = i.useRef, ut = i.useState, pt = i.useSyncExternalStore, gt = i.useTransition, ht = i.version, bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: Ee,
  Children: $e,
  Component: ke,
  Fragment: Pe,
  Profiler: De,
  PureComponent: _e,
  StrictMode: Ie,
  Suspense: Le,
  ViewTransition: Me,
  act: Fe,
  addTransitionType: Re,
  cache: Ae,
  cacheSignal: He,
  captureOwnerStack: Oe,
  cloneElement: je,
  createContext: Ve,
  createElement: Be,
  createRef: Ue,
  default: i,
  forwardRef: ze,
  isValidElement: qe,
  lazy: We,
  memo: Ke,
  startTransition: Qe,
  unstable_useCacheRefresh: Xe,
  use: Ge,
  useActionState: Je,
  useCallback: Ye,
  useContext: Ze,
  useDebugValue: et,
  useDeferredValue: tt,
  useEffect: nt,
  useEffectEvent: rt,
  useId: ct,
  useImperativeHandle: st,
  useInsertionEffect: ot,
  useLayoutEffect: at,
  useMemo: it,
  useOptimistic: lt,
  useReducer: mt,
  useRef: dt,
  useState: ut,
  useSyncExternalStore: pt,
  useTransition: gt,
  version: ht
}, Symbol.toStringTag, { value: "Module" })), y = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!y)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
y.App;
y.Deferred;
y.Form;
const ft = y.Head;
y.InfiniteScroll;
const yt = y.Link;
y.WhenMounted;
y.WhenVisible;
y.config;
y.createInertiaApp;
y.http;
y.progress;
y.resetLayoutProps;
const St = y.router;
y.setLayoutProps;
const vt = y.useForm;
y.useFormContext;
y.useHttp;
const Ct = y.usePage;
y.usePoll;
y.usePrefetch;
y.useRemember;
const r = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!r)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const xt = r.Badge, wt = r.Button, Tt = r.Card, Nt = r.CardContent, Et = r.CardDescription;
r.CardFooter;
const $t = r.CardHeader, kt = r.CardTitle, Pt = r.Checkbox;
r.CodeEditor;
const Dt = r.CollapsibleCard;
r.Command;
r.CommandEmpty;
r.CommandGroup;
r.CommandInput;
r.CommandItem;
r.CommandList;
r.CommandSeparator;
r.DatePicker;
r.DeveloperHelp;
const _t = r.Dialog, It = r.DialogContent, Lt = r.DialogDescription, Mt = r.DialogFooter, Ft = r.DialogHeader, Rt = r.DialogTitle;
r.DialogTrigger;
const At = r.DropdownMenu, Ht = r.DropdownMenuCheckboxItem, Ot = r.DropdownMenuContent;
r.DropdownMenuItem;
const jt = r.DropdownMenuLabel;
r.DropdownMenuSeparator;
const Vt = r.DropdownMenuTrigger;
r.FormSections;
const Bt = r.Input;
r.KeptEditsNotice;
const Ut = r.Label;
r.LanguageTabs;
r.LinkAttributes;
r.LinkSourcePicker;
const zt = r.MediaPickerInput;
r.moveItem;
const qt = r.PageHeader, Wt = r.Popover;
r.PopoverAnchor;
const Kt = r.PopoverContent, Qt = r.PopoverTrigger;
r.registerCommandSource;
const Xt = r.RichTextEditor, Gt = r.Select, Jt = r.SelectContent, Yt = r.SelectItem, Zt = r.SelectTrigger, en = r.SelectValue;
r.Separator;
const tn = r.SettingsLayout;
r.SettingsNav;
r.Skeleton;
r.SortableHandle;
r.SortableList;
const nn = r.Switch, rn = r.Table, cn = r.TableBody, sn = r.TableCell, on = r.TableHead, an = r.TableHeader, ln = r.TableRow, mn = r.Tabs, dn = r.TabsContent, un = r.TabsList, pn = r.TabsTrigger, gn = r.Textarea;
r.Tooltip;
r.TooltipContent;
r.TooltipTrigger;
const hn = r.toast;
r.TrashBanner;
r.TrashHint;
r.TrashTitle;
const ae = r.useBreadcrumbs;
r.useEditLock;
const bn = r.useTablePreferences, fn = r.useUnsavedChanges;
r.ViewingNotice;
const ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: xt,
  Button: wt,
  Card: Tt,
  CardContent: Nt,
  CardDescription: Et,
  CardHeader: $t,
  CardTitle: kt,
  Checkbox: Pt,
  CollapsibleCard: Dt,
  Dialog: _t,
  DialogContent: It,
  DialogDescription: Lt,
  DialogFooter: Mt,
  DialogHeader: Ft,
  DialogTitle: Rt,
  DropdownMenu: At,
  DropdownMenuCheckboxItem: Ht,
  DropdownMenuContent: Ot,
  DropdownMenuLabel: jt,
  DropdownMenuTrigger: Vt,
  Input: Bt,
  Label: Ut,
  MediaPickerInput: zt,
  PageHeader: qt,
  Popover: Wt,
  PopoverContent: Kt,
  PopoverTrigger: Qt,
  RichTextEditor: Xt,
  Select: Gt,
  SelectContent: Jt,
  SelectItem: Yt,
  SelectTrigger: Zt,
  SelectValue: en,
  SettingsLayout: tn,
  Switch: nn,
  Table: rn,
  TableBody: cn,
  TableCell: sn,
  TableHead: on,
  TableHeader: an,
  TableRow: ln,
  Tabs: mn,
  TabsContent: dn,
  TabsList: un,
  TabsTrigger: pn,
  Textarea: gn,
  toast: hn,
  useBreadcrumbs: ae,
  useTablePreferences: bn,
  useUnsavedChanges: fn
}, Symbol.toStringTag, { value: "Module" })), G = 3, le = () => window.Sunrice, N = bt, D = ie, A = {
  router: St,
  Link: yt,
  Head: ft,
  usePage: Ct,
  useForm: vt
}, Kn = D.toast, yn = ae;
function U(e = "") {
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
function Sn(e) {
  const t = le();
  if (t.version !== G)
    throw new Error(`[commerce] This bundle was built for admin runtime ${G}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, c] of Object.entries(e))
    t.registerPageLoader(n, c);
}
const vn = {
  "Commerce/Confirmations/Index": () => import("./Index-nQ52NM62.js"),
  "Commerce/Customers/Show": () => import("./Show-9hNPjAyU.js"),
  "Commerce/Dashboard": () => import("./Dashboard-xln9Jxw9.js"),
  "Commerce/Inventory/Index": () => import("./Index-CrnRmUck.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-CNHCkb3u.js"),
  "Commerce/Marketing/Report": () => import("./Report-IaTS3u7-.js"),
  "Commerce/Orders/Editor": () => import("./Editor-CmpvFB4R.js"),
  "Commerce/Orders/Show": () => import("./Show-BJO_ItlL.js"),
  "Commerce/Products/Index": () => import("./Index-BrVodfA6.js"),
  "Commerce/Products/Import": () => import("./Import-CJHKViTZ.js"),
  "Commerce/Reports/Show": () => import("./Show-Bn9q3l-W.js"),
  "Commerce/Settings/Section": () => import("./Section-Dj5wuwhN.js"),
  "Commerce/Settings/Emails": () => import("./Emails-BJ1Lvn5f.js"),
  "Commerce/Settings/Features": () => import("./Features-P_N2-DyS.js"),
  "Commerce/Settings/Payments": () => import("./Payments-CnVLBexR.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BEQstIUI.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-fQzazng_.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-B-qXM32Q.js")
};
function Cn() {
  Sn(vn);
}
const j = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!j)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const xn = j.Fragment, s = j.jsx, g = j.jsxs;
j.jsx;
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
        const k = S.target.value.trim() === "" ? o ? null : 0 : oe(S.target.value);
        (k !== null || S.target.value.trim() === "") && t(k);
      },
      onBlur: () => {
        w(!1), p(u(e));
      }
    }
  );
}
function pe() {
  const { props: e } = A.usePage(), t = e.commerce ?? {};
  return Te(t.currency), t;
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
], wn = { province: 1, city: 2, district: 3, village: 4 }, V = /* @__PURE__ */ new Map();
function Tn(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return V.has(n) || V.set(n, me(n).then((c) => c.data).catch(() => (V.delete(n), []))), V.get(n);
}
const ee = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function he({ field: e, value: t, onChange: n, id: c }) {
  const { Label: o } = D, l = e.config ?? {}, a = String(l.api ?? ""), u = wn[l.depth ?? "district"] ?? 3, d = l.country_options ?? [], p = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, T = Z.slice(0, u), [w, S] = N.useState({}), k = [null, p.province_code, p.city_code, p.district_code];
  N.useEffect(() => {
    p.country !== "ID" || !a || T.forEach((f, m) => {
      const b = k[m];
      m > 0 && !b || Tn(a, b).then(($) => S((F) => ({ ...F, [f.key]: $ })));
    });
  }, [a, p.country, p.province_code, p.city_code, p.district_code]);
  const L = (f, m) => {
    const b = { ...p };
    b[T[f].key] = m || null, Z.slice(f + 1).forEach(($) => {
      b[$.key] = null;
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
          disabled: m > 0 && !k[m],
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
  const { Input: o, Badge: l } = D, a = e.config ?? {}, u = Array.isArray(t) ? t : [], [d, p] = N.useState(""), [T, w] = N.useState([]), [S, k] = N.useState(!1);
  N.useEffect(() => {
    if (!S) return;
    const m = new URLSearchParams({ q: d });
    (a.types ?? []).forEach(($) => m.append("types[]", $)), (a.taxonomies ?? []).forEach(($) => m.append("taxonomies[]", $));
    const b = setTimeout(() => me(`${a.api}?${m}`).then(($) => w($.data)).catch(() => w([])), 200);
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
          onFocus: () => k(!0),
          onBlur: () => setTimeout(() => k(!1), 150),
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
const Nn = N.lazy(() => import("./ProductEditor-CuBpu0Ur.js")), En = (e) => N.createElement(N.Suspense, { fallback: null }, N.createElement(Nn, e)), $n = {
  commerce_money: ge,
  commerce_datetime_range: de,
  commerce_region: he,
  commerce_targets: be,
  commerce_product: En
};
function kn() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries($n).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Pn = N.lazy(() => import("./ChartImpl-BRcxYCXr.js"));
function Dn(e) {
  const t = /* @__PURE__ */ s("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ s(N.Suspense, { fallback: t, children: /* @__PURE__ */ s(Pn, { ...e }) });
}
function _n({ title: e, description: t, action: n }) {
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
function In() {
  for (var e, t, n = 0, c = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = fe(e)) && (c && (c += " "), c += t);
  return c;
}
function q(...e) {
  return In(e);
}
function Qn() {
  const { Card: e, CardContent: t } = D;
  return /* @__PURE__ */ s(e, { "aria-hidden": "true", children: /* @__PURE__ */ g(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:h-4" })
  ] }) });
}
function Ln({ kpi: e }) {
  const { Card: t, CardContent: n } = D, { Link: c } = A, o = e.change ?? null, l = /* @__PURE__ */ g(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
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
  return /* @__PURE__ */ s(t, { children: e.href ? /* @__PURE__ */ s(c, { href: U(e.href), className: "cm:block", children: l }) : l });
}
function ye({ title: e, description: t, actions: n, primary: c, menu: o, back: l, children: a }) {
  const { Head: u } = A, { PageHeader: d } = D;
  return /* @__PURE__ */ g(xn, { children: [
    /* @__PURE__ */ s(u, { title: e }),
    /* @__PURE__ */ s(d, { title: e, description: t, actions: n, primary: c, menu: o?.length ? o : void 0, back: l, children: a })
  ] });
}
const te = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function Mn(e, t) {
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
function Fn(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function Rn(e, t) {
  const n = {};
  for (const [c, o] of Object.entries(e))
    c === t ? n[""] = o : c.startsWith(`${t}.`) && (n[c.slice(t.length + 1)] = o);
  return n;
}
function An(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const z = "__none", Se = "__empty", ve = (e) => e === "" ? Se : e;
function Hn(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? z : ve(String(e));
}
function On(e, t) {
  return e === z ? null : e === Se ? "" : t ? Number(e) : e;
}
const Ce = ie, jn = {
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
};
function K({ fields: e, values: t, onChange: n, errors: c = {}, pathPrefix: o = "values", section: l }) {
  const a = e, u = c;
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((d) => Mn(d, t ?? {})).map((d) => /* @__PURE__ */ s("div", { className: q(
    "cm:min-w-0",
    ne[d.width ?? 100] ?? ne[100],
    // A switch beside an input sits level with the input, not its label.
    d.type === "toggle" && (d.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ s(
    Vn,
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
function Vn({ field: e, value: t, onChange: n, path: c, errors: o, hideLabel: l = !1 }) {
  const { Label: a } = Ce, u = c.replace(/[^A-Za-z0-9_-]+/g, "-"), d = o[c], p = e.instructions ? `${u}-help` : void 0, T = [p, d ? `${u}-error` : void 0].filter(Boolean).join(" ") || void 0, w = e.label ?? e.handle, S = e.type === "toggle";
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !S && !l && /* @__PURE__ */ g(a, { htmlFor: e.type === "group" || e.type === "repeater" ? void 0 : u, id: `${u}-label`, children: [
      w,
      e.required && /* @__PURE__ */ s("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ s(Bn, { field: e, value: t, onChange: n, id: u, path: c, errors: o, describedBy: T, label: w }),
    p && /* @__PURE__ */ s("p", { id: p, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    d && /* @__PURE__ */ s("p", { id: `${u}-error`, className: "cm:text-sm cm:text-destructive", children: d })
  ] });
}
function Bn({ field: e, value: t, onChange: n, id: c, path: o, errors: l, describedBy: a, label: u }) {
  const { Input: d, Textarea: p, Switch: T, Label: w, Button: S, MediaPickerInput: k, RichTextEditor: L, Checkbox: f, Select: m, SelectTrigger: b, SelectValue: $, SelectContent: F, SelectItem: x } = Ce, P = l[o] !== void 0, v = e.config ?? {}, H = jn[e.type];
  if (H)
    return /* @__PURE__ */ s(H, { field: e, value: t, onChange: n, errors: Rn(l, o), id: c, describedBy: a });
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
          min: v.min,
          max: v.max,
          step: v.step ?? "any",
          onChange: (h) => n(An(h.target.value))
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
      const h = Fn(e), M = e.type !== "select";
      if (v.multiple === !0) {
        const C = (Array.isArray(t) ? t : []).map(String), R = (E, O) => {
          const X = O ? [...C, E] : C.filter((we) => we !== E);
          n(M ? X.map(Number) : X);
        };
        return /* @__PURE__ */ s("div", { role: "group", "aria-labelledby": `${c}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: h.map((E) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ s(f, { checked: C.includes(E.value), onCheckedChange: (O) => R(E.value, O === !0) }),
          E.label
        ] }, E.value)) });
      }
      const W = Array.isArray(t) ? t[0] : t, _ = Hn(W, h);
      return /* @__PURE__ */ g(m, { value: _, onValueChange: (C) => n(On(C, M)), children: [
        /* @__PURE__ */ s(b, { id: c, className: "cm:w-full", "aria-invalid": P, "aria-describedby": a, children: /* @__PURE__ */ s($, { placeholder: "—" }) }),
        /* @__PURE__ */ g(F, { children: [
          (!e.required || _ === z) && /* @__PURE__ */ s(x, { value: z, children: "—" }),
          h.map((C) => /* @__PURE__ */ s(x, { value: ve(C.value), children: C.label }, C.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ s(
        k,
        {
          id: c,
          value: t ?? null,
          multiple: v.multiple === !0,
          max: v.max,
          invalid: P,
          types: Array.isArray(v.types) ? v.types : v.image_only ? ["image"] : void 0,
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
      const h = Array.isArray(t) ? t : [], M = (_) => n(_), W = () => Object.fromEntries((e.fields ?? []).map((_) => [_.handle, _.type === "toggle" ? !1 : null]));
      return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3", children: [
        h.map((_, C) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:rounded-lg cm:border cm:p-4", children: [
          /* @__PURE__ */ s(
            K,
            {
              fields: e.fields ?? [],
              values: _,
              errors: l,
              pathPrefix: `${o}.${C}`,
              onChange: (R) => M(h.map((E, O) => O === C ? R : E))
            }
          ),
          /* @__PURE__ */ g("div", { className: "cm:flex cm:gap-2", children: [
            /* @__PURE__ */ s(S, { type: "button", size: "sm", variant: "ghost", disabled: C === 0, onClick: () => M(h.map((R, E) => E === C - 1 ? h[C] : E === C ? h[C - 1] : R)), children: "Move up" }),
            /* @__PURE__ */ s(S, { type: "button", size: "sm", variant: "ghost", onClick: () => M(h.filter((R, E) => E !== C)), children: "Remove" })
          ] })
        ] }, C)),
        /* @__PURE__ */ s("div", { children: /* @__PURE__ */ g(S, { type: "button", size: "sm", variant: "outline", disabled: typeof v.max == "number" && h.length >= v.max, onClick: () => M([...h, W()]), children: [
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
          placeholder: v.placeholder,
          onChange: (h) => n(h.target.value)
        }
      );
  }
}
function Un({ form: e, id: t, storageKey: n, footer: c }) {
  const { Button: o, Card: l, CardContent: a, CollapsibleCard: u, useUnsavedChanges: d } = D, { data: p, setData: T, errors: w, processing: S, isDirty: k, ...L } = A.useForm({ values: e.values }), f = () => L[e.method](e.action, { preserveScroll: !0 });
  d(k, f);
  const m = e.fields, b = e.sections?.length ? e.sections : [{ title: null, description: null, fields: m.map((x) => x.handle) }], $ = Object.keys(w), F = (x, P = null) => /* @__PURE__ */ s(
    K,
    {
      fields: m.filter((v) => x.includes(v.handle)),
      values: p.values,
      errors: w,
      pathPrefix: "values",
      section: P,
      onChange: (v) => T("values", v)
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
        hasErrors: x.fields.some((v) => $.some((H) => H === `values.${v}` || H.startsWith(`values.${v}.`))),
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
function xe({ items: e, current: t, label: n = "Sections" }) {
  const { Link: c } = A;
  return /* @__PURE__ */ s("nav", { "aria-label": n, className: "cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: e.map((o) => /* @__PURE__ */ s(
    c,
    {
      href: U(o.href),
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
function zn({ sections: e, current: t, title: n, description: c, primary: o, children: l }) {
  const { SettingsLayout: a } = D;
  pe();
  const u = A.usePage().props.commerce?.settingsNav ?? [];
  return yn([{ label: "Settings", href: U("settings") }, { label: "Store", href: U("commerce/settings") }, { label: n }]), /* @__PURE__ */ s("div", { children: /* @__PURE__ */ s(a, { items: u, current: "commerce-settings", children: /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ s(ye, { title: n, description: c, primary: o }),
    /* @__PURE__ */ s(xe, { items: e, current: t, label: "Store settings" }),
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
function qn({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ s("span", { className: q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", re[e] ?? re.neutral), children: t });
}
function Wn() {
  Object.assign(B.components, { Chart: Dn, EmptyState: _n, KpiCard: Ln, MoneyInput: ue, PageHeader: ye, SchemaFormView: Un, SectionNav: xe, SettingsLayout: zn, StatusBadge: qn });
}
Ne();
Wn();
kn();
Cn();
export {
  bt as A,
  it as B,
  Dn as C,
  dt as D,
  _n as E,
  xn as F,
  Ye as G,
  nt as H,
  st as I,
  at as J,
  Qn as K,
  Ke as L,
  ue as M,
  Pe as N,
  $e as O,
  ye as P,
  ke as Q,
  N as R,
  qn as S,
  be as T,
  ie as U,
  _e as V,
  yn as a,
  U as b,
  s as c,
  D as d,
  B as e,
  Ln as f,
  se as g,
  me as h,
  A as i,
  g as j,
  K as k,
  he as l,
  q as m,
  zn as n,
  Un as o,
  ut as p,
  bn as q,
  qe as r,
  ze as s,
  Kn as t,
  pe as u,
  In as v,
  Be as w,
  Ze as x,
  Ve as y,
  je as z
};
