const ce = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Q = ce;
function Te(e) {
  Q = { ...ce, ...e ?? {} };
}
function se(e, t = Q) {
  const n = e < 0, c = Math.abs(Math.round(e)), o = 10 ** t.decimals, l = Math.floor(c / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(c % o).padStart(t.decimals, "0") : "", u = l + a, d = t.space ? " " : "", g = t.position === "left" ? `${t.symbol}${d}${u}` : `${u}${d}${t.symbol}`;
  return n ? `-${g}` : g;
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
const Ee = i.Activity, $e = i.Children, ke = i.Component, Pe = i.Fragment, De = i.Profiler, _e = i.PureComponent, Ie = i.StrictMode, Le = i.Suspense, Me = i.ViewTransition, Fe = i.act, Re = i.addTransitionType, Ae = i.cache, He = i.cacheSignal, Oe = i.captureOwnerStack, je = i.cloneElement, Ve = i.createContext, Be = i.createElement, Ue = i.createRef, ze = i.forwardRef, qe = i.isValidElement, We = i.lazy, Ke = i.memo, Qe = i.startTransition, Xe = i.unstable_useCacheRefresh, Ge = i.use, Je = i.useActionState, Ye = i.useCallback, Ze = i.useContext, et = i.useDebugValue, tt = i.useDeferredValue, nt = i.useEffect, rt = i.useEffectEvent, ct = i.useId, st = i.useImperativeHandle, ot = i.useInsertionEffect, at = i.useLayoutEffect, it = i.useMemo, lt = i.useOptimistic, mt = i.useReducer, dt = i.useRef, ut = i.useState, pt = i.useSyncExternalStore, gt = i.useTransition, ht = i.version, ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
}, Symbol.toStringTag, { value: "Module" })), v = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!v)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
v.App;
v.Deferred;
v.Form;
const bt = v.Head;
v.InfiniteScroll;
const yt = v.Link;
v.WhenMounted;
v.WhenVisible;
v.config;
v.createInertiaApp;
v.http;
v.progress;
v.resetLayoutProps;
const St = v.router;
v.setLayoutProps;
const vt = v.useForm;
v.useFormContext;
v.useHttp;
const Ct = v.usePage;
v.usePoll;
v.usePrefetch;
v.useRemember;
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
const At = r.DropdownMenu, Ht = r.DropdownMenuCheckboxItem, Ot = r.DropdownMenuContent, jt = r.DropdownMenuItem, Vt = r.DropdownMenuLabel;
r.DropdownMenuSeparator;
const Bt = r.DropdownMenuTrigger;
r.FormSections;
const Ut = r.Input;
r.KeptEditsNotice;
const zt = r.Label;
r.LanguageTabs;
r.LinkAttributes;
r.LinkSourcePicker;
const qt = r.MediaPickerInput;
r.moveItem;
const Wt = r.PageHeader, Kt = r.Popover;
r.PopoverAnchor;
const Qt = r.PopoverContent, Xt = r.PopoverTrigger;
r.registerCommandSource;
const Gt = r.RichTextEditor, Jt = r.Select, Yt = r.SelectContent, Zt = r.SelectItem, en = r.SelectTrigger, tn = r.SelectValue;
r.Separator;
const nn = r.SettingsLayout;
r.SettingsNav;
r.Skeleton;
r.SortableHandle;
r.SortableList;
const rn = r.Switch, cn = r.Table, sn = r.TableBody, on = r.TableCell, an = r.TableHead, ln = r.TableHeader, mn = r.TableRow, dn = r.Tabs, un = r.TabsContent, pn = r.TabsList, gn = r.TabsTrigger, hn = r.Textarea;
r.Tooltip;
r.TooltipContent;
r.TooltipTrigger;
const fn = r.toast;
r.TrashBanner;
r.TrashHint;
r.TrashTitle;
const ae = r.useBreadcrumbs;
r.useEditLock;
const bn = r.useTablePreferences, yn = r.useUnsavedChanges;
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
  DropdownMenuItem: jt,
  DropdownMenuLabel: Vt,
  DropdownMenuTrigger: Bt,
  Input: Ut,
  Label: zt,
  MediaPickerInput: qt,
  PageHeader: Wt,
  Popover: Kt,
  PopoverContent: Qt,
  PopoverTrigger: Xt,
  RichTextEditor: Gt,
  Select: Jt,
  SelectContent: Yt,
  SelectItem: Zt,
  SelectTrigger: en,
  SelectValue: tn,
  SettingsLayout: nn,
  Switch: rn,
  Table: cn,
  TableBody: sn,
  TableCell: on,
  TableHead: an,
  TableHeader: ln,
  TableRow: mn,
  Tabs: dn,
  TabsContent: un,
  TabsList: pn,
  TabsTrigger: gn,
  Textarea: hn,
  toast: fn,
  useBreadcrumbs: ae,
  useTablePreferences: bn,
  useUnsavedChanges: yn
}, Symbol.toStringTag, { value: "Module" })), G = 3, le = () => window.Sunrice, x = ft, D = ie, R = {
  router: St,
  Link: yt,
  Head: bt,
  usePage: Ct,
  useForm: vt
}, Qn = D.toast, Sn = ae;
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
function vn(e) {
  const t = le();
  if (t.version !== G)
    throw new Error(`[commerce] This bundle was built for admin runtime ${G}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, c] of Object.entries(e))
    t.registerPageLoader(n, c);
}
const Cn = {
  "Commerce/Confirmations/Index": () => import("./Index-LWVY0ogr.js"),
  "Commerce/Customers/Show": () => import("./Show-C4RWT-Qm.js"),
  "Commerce/Dashboard": () => import("./Dashboard-ISrJwqpe.js"),
  "Commerce/Inventory/Index": () => import("./Index-CXf-c4Oa.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-CBJvg_hf.js"),
  "Commerce/Marketing/Report": () => import("./Report-DAvnqwjc.js"),
  "Commerce/Orders/Editor": () => import("./Editor-CIZiIGGU.js"),
  "Commerce/Orders/Show": () => import("./Show-CzwQpNTL.js"),
  "Commerce/Products/Index": () => import("./Index-SmacusQe.js"),
  "Commerce/Products/Import": () => import("./Import-DeArKYtv.js"),
  "Commerce/Reports/Show": () => import("./Show-BiS_sqMy.js"),
  "Commerce/Settings/Section": () => import("./Section-DIiuAisR.js"),
  "Commerce/Settings/Emails": () => import("./Emails-BCRRcwOm.js"),
  "Commerce/Settings/Features": () => import("./Features-DaZERS-z.js"),
  "Commerce/Settings/Payments": () => import("./Payments-hML2Ivbe.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-DkrdRnEf.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-Cfb5ISe_.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-BKzqXLPa.js")
};
function xn() {
  vn(Cn);
}
const O = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!O)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const wn = O.Fragment, s = O.jsx, h = O.jsxs;
O.jsx;
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
  return /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-1", children: [
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
    /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-1", children: [
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
  const { Input: a } = D, u = (y) => y == null ? "" : se(y).replace(/^[^\d-]+|[^\d]+$/g, ""), [d, g] = x.useState(u(e)), [w, T] = x.useState(!1);
  return x.useEffect(() => {
    w || g(u(e));
  }, [e, w]), /* @__PURE__ */ s(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: d,
      placeholder: c,
      "aria-invalid": l || void 0,
      onFocus: () => T(!0),
      onChange: (y) => {
        g(y.target.value);
        const N = y.target.value.trim() === "" ? o ? null : 0 : oe(y.target.value);
        (N !== null || y.target.value.trim() === "") && t(N);
      },
      onBlur: () => {
        T(!1), g(u(e));
      }
    }
  );
}
function pe() {
  const { props: e } = R.usePage(), t = e.commerce ?? {};
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
], Tn = { province: 1, city: 2, district: 3, village: 4 }, V = /* @__PURE__ */ new Map();
function Nn(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return V.has(n) || V.set(n, me(n).then((c) => c.data).catch(() => (V.delete(n), []))), V.get(n);
}
const ee = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm cm:disabled:opacity-50";
function he({ field: e, value: t, onChange: n, id: c }) {
  const { Label: o } = D, l = e.config ?? {}, a = String(l.api ?? ""), u = Tn[l.depth ?? "district"] ?? 3, d = l.country_options ?? [], g = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, w = Z.slice(0, u), [T, y] = x.useState({}), N = [null, g.province_code, g.city_code, g.district_code];
  x.useEffect(() => {
    g.country !== "ID" || !a || w.forEach((S, m) => {
      const b = N[m];
      m > 0 && !b || Nn(a, b).then((E) => y((A) => ({ ...A, [S.key]: E })));
    });
  }, [a, g.country, g.province_code, g.city_code, g.district_code]);
  const L = (S, m) => {
    const b = { ...g };
    b[w[S].key] = m || null, Z.slice(S + 1).forEach((E) => {
      b[E.key] = null;
    }), n(b);
  };
  return /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    d.length > 0 && /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${c}-country`, children: "Country" }),
      /* @__PURE__ */ s(
        "select",
        {
          id: `${c}-country`,
          className: ee,
          value: g.country,
          onChange: (S) => n({ country: S.target.value, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: d.map((S) => /* @__PURE__ */ s("option", { value: S.value, children: S.label }, S.value))
        }
      )
    ] }),
    g.country === "ID" && w.map((S, m) => /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ s(o, { htmlFor: `${c}-${S.key}`, children: S.label }),
      /* @__PURE__ */ h(
        "select",
        {
          id: `${c}-${S.key}`,
          className: ee,
          value: g[S.key] ?? "",
          disabled: m > 0 && !N[m],
          onChange: (b) => L(m, b.target.value),
          children: [
            /* @__PURE__ */ s("option", { value: "", children: "Choose…" }),
            (T[S.key] ?? []).map((b) => /* @__PURE__ */ s("option", { value: b.code, children: b.name }, b.code))
          ]
        }
      )
    ] }, S.key))
  ] });
}
function fe({ field: e, value: t, onChange: n, id: c }) {
  const { Input: o, Badge: l } = D, a = e.config ?? {}, u = Array.isArray(t) ? t : [], [d, g] = x.useState(""), [w, T] = x.useState([]), [y, N] = x.useState(!1);
  x.useEffect(() => {
    if (!y) return;
    const m = new URLSearchParams({ q: d });
    (a.types ?? []).forEach((E) => m.append("types[]", E)), (a.taxonomies ?? []).forEach((E) => m.append("taxonomies[]", E));
    const b = setTimeout(() => me(`${a.api}?${m}`).then((E) => T(E.data)).catch(() => T([])), 200);
    return () => clearTimeout(b);
  }, [d, y]);
  const L = (m) => u.some((b) => b.type === m.type && b.id === m.id), S = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-2", children: [
    u.length > 0 && /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: u.map((m) => /* @__PURE__ */ h(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ h("span", { className: "cm:text-muted-foreground", children: [
        S[m.type],
        ":"
      ] }),
      " ",
      m.label,
      /* @__PURE__ */ s("button", { type: "button", "aria-label": `Remove ${m.label}`, onClick: () => n(u.filter((b) => !(b.type === m.type && b.id === m.id))), children: "×" })
    ] }, `${m.type}:${m.id}`)) }),
    /* @__PURE__ */ h("div", { className: "cm:relative", children: [
      /* @__PURE__ */ s(
        o,
        {
          id: c,
          value: d,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => N(!0),
          onBlur: () => setTimeout(() => N(!1), 150),
          onChange: (m) => g(m.target.value)
        }
      ),
      y && w.length > 0 && /* @__PURE__ */ s("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: w.map((m) => /* @__PURE__ */ s("li", { children: /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          disabled: L(m),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (b) => b.preventDefault(),
          onClick: () => {
            n([...u, { type: m.type, id: m.id, label: m.label }]), g("");
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
const En = x.lazy(() => import("./ProductEditor-C4M9ocF_.js")), $n = (e) => x.createElement(x.Suspense, { fallback: null }, x.createElement(En, e)), kn = {
  commerce_money: ge,
  commerce_datetime_range: de,
  commerce_region: he,
  commerce_targets: fe,
  commerce_product: $n
};
function Pn() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(kn).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Dn = x.lazy(() => import("./ChartImpl-aQZn0BIB.js"));
function _n(e) {
  const t = /* @__PURE__ */ s("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ s(x.Suspense, { fallback: t, children: /* @__PURE__ */ s(Dn, { ...e }) });
}
function In({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ h("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ s("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ s("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ s("div", { className: "cm:mt-2", children: n })
  ] });
}
function be(e) {
  var t, n, c = "";
  if (typeof e == "string" || typeof e == "number") c += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = be(e[t])) && (c && (c += " "), c += n);
  } else for (n in e) e[n] && (c && (c += " "), c += n);
  return c;
}
function Ln() {
  for (var e, t, n = 0, c = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = be(e)) && (c && (c += " "), c += t);
  return c;
}
function q(...e) {
  return Ln(e);
}
function Xn() {
  const { Card: e, CardContent: t } = D;
  return /* @__PURE__ */ s(e, { "aria-hidden": "true", children: /* @__PURE__ */ h(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ s("span", { className: "cm:h-4" })
  ] }) });
}
function Mn({ kpi: e }) {
  const { Card: t, CardContent: n } = D, { Link: c } = R, o = e.change ?? null, l = /* @__PURE__ */ h(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ s("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ s("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ h(
      "span",
      {
        className: q("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ s("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
          " ",
          Math.abs(o).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ h("span", { className: "cm:sr-only", children: [
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
  const { Head: u } = R, { PageHeader: d } = D;
  return /* @__PURE__ */ h(wn, { children: [
    /* @__PURE__ */ s(u, { title: e }),
    /* @__PURE__ */ s(d, { title: e, description: t, actions: n, primary: c, menu: o?.length ? o : void 0, back: l, children: a })
  ] });
}
const te = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function Fn(e, t) {
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
function Rn(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function An(e, t) {
  const n = {};
  for (const [c, o] of Object.entries(e))
    c === t ? n[""] = o : c.startsWith(`${t}.`) && (n[c.slice(t.length + 1)] = o);
  return n;
}
function Hn(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const z = "__none", Se = "__empty", ve = (e) => e === "" ? Se : e;
function On(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? z : ve(String(e));
}
function jn(e, t) {
  return e === z ? null : e === Se ? "" : t ? Number(e) : e;
}
const Ce = ie, Vn = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: ge,
  commerce_datetime_range: de,
  commerce_region: he,
  commerce_targets: fe
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
  return /* @__PURE__ */ s("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((d) => Fn(d, t ?? {})).map((d) => /* @__PURE__ */ s("div", { className: q(
    "cm:min-w-0",
    ne[d.width ?? 100] ?? ne[100],
    // A switch beside an input sits level with the input, not its label.
    d.type === "toggle" && (d.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ s(
    Bn,
    {
      field: d,
      value: t?.[d.handle],
      path: `${o}.${d.handle}`,
      errors: u,
      hideLabel: !!l && d.label === l,
      onChange: (g) => n({ ...t, [d.handle]: g })
    }
  ) }, d.handle)) });
}
function Bn({ field: e, value: t, onChange: n, path: c, errors: o, hideLabel: l = !1 }) {
  const { Label: a } = Ce, u = c.replace(/[^A-Za-z0-9_-]+/g, "-"), d = o[c], g = e.instructions ? `${u}-help` : void 0, w = [g, d ? `${u}-error` : void 0].filter(Boolean).join(" ") || void 0, T = e.label ?? e.handle, y = e.type === "toggle";
  return /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !y && !l && /* @__PURE__ */ h(a, { htmlFor: e.type === "group" || e.type === "repeater" ? void 0 : u, id: `${u}-label`, children: [
      T,
      e.required && /* @__PURE__ */ s("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ s(Un, { field: e, value: t, onChange: n, id: u, path: c, errors: o, describedBy: w, label: T }),
    g && /* @__PURE__ */ s("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    d && /* @__PURE__ */ s("p", { id: `${u}-error`, className: "cm:text-sm cm:text-destructive", children: d })
  ] });
}
function Un({ field: e, value: t, onChange: n, id: c, path: o, errors: l, describedBy: a, label: u }) {
  const { Input: d, Textarea: g, Switch: w, Label: T, Button: y, MediaPickerInput: N, RichTextEditor: L, Checkbox: S, Select: m, SelectTrigger: b, SelectValue: E, SelectContent: A, SelectItem: j } = Ce, k = l[o] !== void 0, f = e.config ?? {}, M = Vn[e.type];
  if (M)
    return /* @__PURE__ */ s(M, { field: e, value: t, onChange: n, errors: An(l, o), id: c, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ s(
        g,
        {
          id: c,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": k,
          "aria-describedby": a,
          onChange: (p) => n(p.target.value)
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
          "aria-invalid": k,
          "aria-describedby": a,
          min: f.min,
          max: f.max,
          step: f.step ?? "any",
          onChange: (p) => n(Hn(p.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ s(
        d,
        {
          id: c,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": k,
          "aria-describedby": a,
          onChange: (p) => n(p.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ h("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ s(w, { id: c, checked: t === !0, "aria-describedby": a, onCheckedChange: (p) => n(p) }),
        /* @__PURE__ */ s(T, { htmlFor: c, children: u })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const p = Rn(e), P = e.type !== "select";
      if (f.multiple === !0) {
        const C = (Array.isArray(t) ? t : []).map(String), F = ($, H) => {
          const X = H ? [...C, $] : C.filter((we) => we !== $);
          n(P ? X.map(Number) : X);
        };
        return /* @__PURE__ */ s("div", { role: "group", "aria-labelledby": `${c}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: p.map(($) => /* @__PURE__ */ h("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ s(S, { checked: C.includes($.value), onCheckedChange: (H) => F($.value, H === !0) }),
          $.label
        ] }, $.value)) });
      }
      const W = Array.isArray(t) ? t[0] : t, _ = On(W, p);
      return /* @__PURE__ */ h(m, { value: _, onValueChange: (C) => n(jn(C, P)), children: [
        /* @__PURE__ */ s(b, { id: c, className: "cm:w-full", "aria-invalid": k, "aria-describedby": a, children: /* @__PURE__ */ s(E, { placeholder: "—" }) }),
        /* @__PURE__ */ h(A, { children: [
          (!e.required || _ === z) && /* @__PURE__ */ s(j, { value: z, children: "—" }),
          p.map((C) => /* @__PURE__ */ s(j, { value: ve(C.value), children: C.label }, C.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ s(
        N,
        {
          id: c,
          value: t ?? null,
          multiple: f.multiple === !0,
          max: f.max,
          invalid: k,
          types: Array.isArray(f.types) ? f.types : f.image_only ? ["image"] : void 0,
          onChange: (p) => n(p)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ s(
        L,
        {
          id: c,
          value: typeof t == "string" ? t : "",
          invalid: k,
          labelledBy: `${c}-label`,
          onChange: (p) => n(p ?? "")
        }
      );
    case "group":
      return /* @__PURE__ */ s(K, { fields: e.fields ?? [], values: t ?? {}, errors: l, pathPrefix: o, onChange: (p) => n(p) });
    case "repeater": {
      const p = Array.isArray(t) ? t : [], P = (_) => n(_), W = () => Object.fromEntries((e.fields ?? []).map((_) => [_.handle, _.type === "toggle" ? !1 : null]));
      return /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-3", children: [
        p.map((_, C) => /* @__PURE__ */ h("div", { className: "cm:grid cm:gap-3 cm:rounded-lg cm:border cm:p-4", children: [
          /* @__PURE__ */ s(
            K,
            {
              fields: e.fields ?? [],
              values: _,
              errors: l,
              pathPrefix: `${o}.${C}`,
              onChange: (F) => P(p.map(($, H) => H === C ? F : $))
            }
          ),
          /* @__PURE__ */ h("div", { className: "cm:flex cm:gap-2", children: [
            /* @__PURE__ */ s(y, { type: "button", size: "sm", variant: "ghost", disabled: C === 0, onClick: () => P(p.map((F, $) => $ === C - 1 ? p[C] : $ === C ? p[C - 1] : F)), children: "Move up" }),
            /* @__PURE__ */ s(y, { type: "button", size: "sm", variant: "ghost", onClick: () => P(p.filter((F, $) => $ !== C)), children: "Remove" })
          ] })
        ] }, C)),
        /* @__PURE__ */ s("div", { children: /* @__PURE__ */ h(y, { type: "button", size: "sm", variant: "outline", disabled: typeof f.max == "number" && p.length >= f.max, onClick: () => P([...p, W()]), children: [
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
          "aria-invalid": k,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: f.placeholder,
          onChange: (p) => n(p.target.value)
        }
      );
  }
}
function zn({ form: e, id: t, storageKey: n, footer: c, onProcessing: o }) {
  const { Button: l, Card: a, CardContent: u, CollapsibleCard: d, useUnsavedChanges: g } = D, { data: w, setData: T, errors: y, processing: N, isDirty: L, ...S } = R.useForm({ values: e.values }), m = x.useRef(!1), b = () => {
    m.current || (m.current = !0, S[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      m.current = !1;
    } }));
  };
  x.useEffect(() => o?.(N), [N, o]), g(L, b);
  const E = e.fields, A = e.sections?.length ? e.sections : [{ title: null, description: null, fields: E.map((f) => f.handle) }], j = Object.keys(y), k = (f, M = null) => /* @__PURE__ */ s(
    K,
    {
      fields: E.filter((p) => f.includes(p.handle)),
      values: w.values,
      errors: y,
      pathPrefix: "values",
      section: M,
      onChange: (p) => T("values", p)
    }
  );
  return /* @__PURE__ */ h("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (f) => {
    f.preventDefault(), b();
  }, children: [
    y.section && /* @__PURE__ */ s("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: y.section }),
    A.map((f, M) => f.title === null ? /* @__PURE__ */ s(a, { children: /* @__PURE__ */ s(u, { children: k(f.fields) }) }, `untitled-${M}`) : /* @__PURE__ */ s(
      d,
      {
        title: f.title,
        description: f.description ?? void 0,
        storageKey: n ? `${n}:${f.title}` : void 0,
        hasErrors: f.fields.some((p) => j.some((P) => P === `values.${p}` || P.startsWith(`values.${p}.`))),
        children: k(f.fields, f.title)
      },
      f.title
    )),
    (t === void 0 || c) && /* @__PURE__ */ h("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ s(l, { type: "submit", disabled: N, children: e.submitLabel }),
      c
    ] })
  ] });
}
function xe({ items: e, current: t, label: n = "Sections" }) {
  const { Link: c } = R;
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
function qn({ sections: e, current: t, title: n, description: c, primary: o, children: l }) {
  const { SettingsLayout: a } = D;
  pe();
  const u = R.usePage().props.commerce?.settingsNav ?? [];
  return Sn([{ label: "Settings", href: U("settings") }, { label: "Store", href: U("commerce/settings") }, { label: n }]), /* @__PURE__ */ s("div", { children: /* @__PURE__ */ s(a, { items: u, current: "commerce-settings", children: /* @__PURE__ */ h("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
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
function Wn({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ s("span", { className: q("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", re[e] ?? re.neutral), children: t });
}
function Kn() {
  Object.assign(B.components, { Chart: _n, EmptyState: In, KpiCard: Mn, MoneyInput: ue, PageHeader: ye, SchemaFormView: zn, SectionNav: xe, SettingsLayout: qn, StatusBadge: Wn });
}
Ne();
Kn();
Pn();
xn();
export {
  ft as A,
  it as B,
  _n as C,
  dt as D,
  In as E,
  wn as F,
  Ye as G,
  nt as H,
  st as I,
  at as J,
  Xn as K,
  Ke as L,
  ue as M,
  Pe as N,
  $e as O,
  ye as P,
  ke as Q,
  x as R,
  Wn as S,
  fe as T,
  ie as U,
  _e as V,
  Sn as a,
  U as b,
  s as c,
  D as d,
  B as e,
  Mn as f,
  se as g,
  me as h,
  R as i,
  h as j,
  K as k,
  he as l,
  q as m,
  qn as n,
  zn as o,
  ut as p,
  bn as q,
  qe as r,
  ze as s,
  Qn as t,
  pe as u,
  Ln as v,
  Be as w,
  Ze as x,
  Ve as y,
  je as z
};
