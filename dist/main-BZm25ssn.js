const oe = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let G = oe;
function Ee(e) {
  G = { ...oe, ...e ?? {} };
}
function ae(e, t = G) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, l = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", i = l + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${i}` : `${i}${m}${t.symbol}`;
  return n ? `-${h}` : h;
}
function ie(e, t = G) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, l = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(l) || o + l === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(l.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return r ? -a : a;
}
const F = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, U = {
  version: 1,
  registerOrderPanel: (e, t) => {
    F.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    F.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    F.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    F.productTabs[e] = t;
  },
  orderPanels: () => F.orderPanels,
  dashboardWidgets: () => F.dashboardWidgets,
  settingsSections: () => F.settingsSections,
  productTabs: () => F.productTabs,
  formatMoney: ae,
  parseMoney: ie,
  components: {}
};
function Pe() {
  window.SunriceCommerce = U;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(U);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r(U)), e.length)), window.SunriceCommerceQueue = e;
}
const u = globalThis.Sunrice?.modules?.react;
if (!u)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const De = u.Activity, _e = u.Children, Le = u.Component, Ie = u.Fragment, Me = u.Profiler, Fe = u.PureComponent, Re = u.StrictMode, Ae = u.Suspense, He = u.ViewTransition, je = u.act, Oe = u.addTransitionType, Ve = u.cache, Be = u.cacheSignal, Ue = u.captureOwnerStack, ze = u.cloneElement, We = u.createContext, qe = u.createElement, Ke = u.createRef, Ge = u.forwardRef, Qe = u.isValidElement, Xe = u.lazy, Je = u.memo, Ye = u.startTransition, Ze = u.unstable_useCacheRefresh, et = u.use, tt = u.useActionState, nt = u.useCallback, rt = u.useContext, ct = u.useDebugValue, st = u.useDeferredValue, ot = u.useEffect, at = u.useEffectEvent, it = u.useId, lt = u.useImperativeHandle, mt = u.useInsertionEffect, dt = u.useLayoutEffect, ut = u.useMemo, pt = u.useOptimistic, gt = u.useReducer, K = u.useRef, Q = u.useState, ht = u.useSyncExternalStore, ft = u.useTransition, bt = u.version, yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: De,
  Children: _e,
  Component: Le,
  Fragment: Ie,
  Profiler: Me,
  PureComponent: Fe,
  StrictMode: Re,
  Suspense: Ae,
  ViewTransition: He,
  act: je,
  addTransitionType: Oe,
  cache: Ve,
  cacheSignal: Be,
  captureOwnerStack: Ue,
  cloneElement: ze,
  createContext: We,
  createElement: qe,
  createRef: Ke,
  default: u,
  forwardRef: Ge,
  isValidElement: Qe,
  lazy: Xe,
  memo: Je,
  startTransition: Ye,
  unstable_useCacheRefresh: Ze,
  use: et,
  useActionState: tt,
  useCallback: nt,
  useContext: rt,
  useDebugValue: ct,
  useDeferredValue: st,
  useEffect: ot,
  useEffectEvent: at,
  useId: it,
  useImperativeHandle: lt,
  useInsertionEffect: mt,
  useLayoutEffect: dt,
  useMemo: ut,
  useOptimistic: pt,
  useReducer: gt,
  useRef: K,
  useState: Q,
  useSyncExternalStore: ht,
  useTransition: ft,
  version: bt
}, Symbol.toStringTag, { value: "Module" })), N = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!N)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
N.App;
N.Deferred;
N.Form;
const St = N.Head;
N.InfiniteScroll;
const vt = N.Link;
N.WhenMounted;
N.WhenVisible;
N.config;
N.createInertiaApp;
N.http;
N.progress;
N.resetLayoutProps;
const Ct = N.router;
N.setLayoutProps;
const xt = N.useForm;
N.useFormContext;
N.useHttp;
const wt = N.usePage;
N.usePoll;
N.usePrefetch;
N.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Tt = s.Badge, Nt = s.Button, kt = s.Card, $t = s.CardContent, Et = s.CardDescription, Pt = s.CardFooter, Dt = s.CardHeader, _t = s.cardSummary, Lt = s.CardTitle, It = s.Checkbox, Mt = s.CodeEditor, Ft = s.CollapsibleCard, Rt = s.CollapsibleCardGroup, At = s.Command, Ht = s.CommandEmpty, jt = s.CommandGroup, Ot = s.CommandInput, Vt = s.CommandItem, Bt = s.CommandList, Ut = s.CommandSeparator, zt = s.DatePicker, Wt = s.DeveloperHelp, qt = s.Dialog, Kt = s.DialogContent, Gt = s.DialogDescription, Qt = s.DialogFooter, Xt = s.DialogHeader, Jt = s.DialogTitle, Yt = s.DialogTrigger, Zt = s.DropdownMenu, en = s.DropdownMenuCheckboxItem, tn = s.DropdownMenuContent, nn = s.DropdownMenuItem, rn = s.DropdownMenuLabel, cn = s.DropdownMenuSeparator, sn = s.DropdownMenuTrigger, on = s.FormSections, an = s.Input, ln = s.KeptEditsNotice, mn = s.Label, dn = s.LanguageTabs, un = s.LinkAttributes, pn = s.LinkSourcePicker, gn = s.MediaPickerInput, hn = s.moveItem, fn = s.PageHeader, bn = s.Popover, yn = s.PopoverAnchor, Sn = s.PopoverContent, vn = s.PopoverTrigger, Cn = s.registerCommandSource, xn = s.RichTextEditor, wn = s.Select, Tn = s.SelectContent, Nn = s.SelectItem, kn = s.SelectTrigger, $n = s.SelectValue, En = s.Separator, Pn = s.SettingsLayout, Dn = s.SettingsNav, _n = s.Skeleton, Ln = s.SortableHandle, In = s.SortableList, Mn = s.Switch, Fn = s.Table, Rn = s.TableBody, An = s.TableCell, Hn = s.TableHead, jn = s.TableHeader, On = s.TableRow, Vn = s.Tabs, Bn = s.TabsContent, Un = s.TabsList, zn = s.TabsTrigger, Wn = s.Textarea, qn = s.Tooltip, Kn = s.TooltipContent, Gn = s.TooltipTrigger, Qn = s.toast, Xn = s.TrashBanner, Jn = s.TrashHint, Yn = s.TrashTitle, le = s.useBreadcrumbs, Zn = s.useEditLock, er = s.useTablePreferences, tr = s.useUnsavedChanges, nr = s.ViewingNotice, me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Tt,
  Button: Nt,
  Card: kt,
  CardContent: $t,
  CardDescription: Et,
  CardFooter: Pt,
  CardHeader: Dt,
  CardTitle: Lt,
  Checkbox: It,
  CodeEditor: Mt,
  CollapsibleCard: Ft,
  CollapsibleCardGroup: Rt,
  Command: At,
  CommandEmpty: Ht,
  CommandGroup: jt,
  CommandInput: Ot,
  CommandItem: Vt,
  CommandList: Bt,
  CommandSeparator: Ut,
  DatePicker: zt,
  DeveloperHelp: Wt,
  Dialog: qt,
  DialogContent: Kt,
  DialogDescription: Gt,
  DialogFooter: Qt,
  DialogHeader: Xt,
  DialogTitle: Jt,
  DialogTrigger: Yt,
  DropdownMenu: Zt,
  DropdownMenuCheckboxItem: en,
  DropdownMenuContent: tn,
  DropdownMenuItem: nn,
  DropdownMenuLabel: rn,
  DropdownMenuSeparator: cn,
  DropdownMenuTrigger: sn,
  FormSections: on,
  Input: an,
  KeptEditsNotice: ln,
  Label: mn,
  LanguageTabs: dn,
  LinkAttributes: un,
  LinkSourcePicker: pn,
  MediaPickerInput: gn,
  PageHeader: fn,
  Popover: bn,
  PopoverAnchor: yn,
  PopoverContent: Sn,
  PopoverTrigger: vn,
  RichTextEditor: xn,
  Select: wn,
  SelectContent: Tn,
  SelectItem: Nn,
  SelectTrigger: kn,
  SelectValue: $n,
  Separator: En,
  SettingsLayout: Pn,
  SettingsNav: Dn,
  Skeleton: _n,
  SortableHandle: Ln,
  SortableList: In,
  Switch: Mn,
  Table: Fn,
  TableBody: Rn,
  TableCell: An,
  TableHead: Hn,
  TableHeader: jn,
  TableRow: On,
  Tabs: Vn,
  TabsContent: Bn,
  TabsList: Un,
  TabsTrigger: zn,
  Textarea: Wn,
  Tooltip: qn,
  TooltipContent: Kn,
  TooltipTrigger: Gn,
  TrashBanner: Xn,
  TrashHint: Jn,
  TrashTitle: Yn,
  ViewingNotice: nr,
  cardSummary: _t,
  moveItem: hn,
  registerCommandSource: Cn,
  toast: Qn,
  useBreadcrumbs: le,
  useEditLock: Zn,
  useTablePreferences: er,
  useUnsavedChanges: tr
}, Symbol.toStringTag, { value: "Module" })), Y = 3, de = () => window.Sunrice, P = yt, M = me, j = {
  router: Ct,
  Link: vt,
  Head: St,
  usePage: wt,
  useForm: xt
}, Lr = M.toast, rr = le;
function z(e = "") {
  return e.startsWith("/") ? e : de().adminUrl(e);
}
async function ue(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function cr(e) {
  const t = de();
  if (t.version !== Y)
    throw new Error(`[commerce] This bundle was built for admin runtime ${Y}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const sr = {
  "Commerce/Confirmations/Index": () => import("./Index-jip1v0c8.js"),
  "Commerce/Customers/Show": () => import("./Show-CAxXrvhU.js"),
  "Commerce/Dashboard": () => import("./Dashboard-CYWl3R7i.js"),
  "Commerce/Inventory/Index": () => import("./Index-DM5bq_Hg.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-_xgK-EXo.js"),
  "Commerce/Marketing/Report": () => import("./Report-DCLan50s.js"),
  "Commerce/Orders/Editor": () => import("./Editor-D9RwdiZw.js"),
  "Commerce/Orders/Show": () => import("./Show-M1PtHLy5.js"),
  "Commerce/Products/Index": () => import("./Index-Brms5cZf.js"),
  "Commerce/Products/Import": () => import("./Import-Ch0CIYqa.js"),
  "Commerce/Reports/Show": () => import("./Show-CNn3ayJr.js"),
  "Commerce/Settings/Section": () => import("./Section-B_1LQV9S.js"),
  "Commerce/Settings/Emails": () => import("./Emails-D5gmyKsi.js"),
  "Commerce/Settings/Features": () => import("./Features-BwERn-Cz.js"),
  "Commerce/Settings/Payments": () => import("./Payments-BOXJ-N35.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-B0c-Tpi4.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-DV3B28y1.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-jCvGDZeA.js")
};
function or() {
  cr(sr);
}
const V = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!V)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ar = V.Fragment, c = V.jsx, p = V.jsxs;
V.jsx;
function Z(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function ee(e) {
  return e ? new Date(e).toISOString() : null;
}
function pe({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = M, l = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: Z(l.start),
          onChange: (a) => t({ ...l, start: ee(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: Z(l.end),
          onChange: (a) => t({ ...l, end: ee(a.target.value) })
        }
      )
    ] })
  ] });
}
function ge({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: o = !0,
  invalid: l
}) {
  const { Input: a } = M, i = (S) => S == null ? "" : ae(S).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = P.useState(i(e)), [E, x] = P.useState(!1);
  return P.useEffect(() => {
    E || h(i(e));
  }, [e, E]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": l || void 0,
      onFocus: () => x(!0),
      onChange: (S) => {
        h(S.target.value);
        const f = S.target.value.trim() === "" ? o ? null : 0 : ie(S.target.value);
        (f !== null || S.target.value.trim() === "") && t(f);
      },
      onBlur: () => {
        x(!1), h(i(e));
      }
    }
  );
}
function he() {
  const { props: e } = j.usePage(), t = e.commerce ?? {};
  return Ee(t.currency), t;
}
function fe({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return he(), /* @__PURE__ */ c(
    ge,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const te = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function be(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const r = "rules" in n ? n.rules : [n];
  if (r.length === 0) return !0;
  const o = r.map((l) => {
    const a = t?.[l.field], i = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(te).includes(te(l.value));
    return l.operator === "equals" ? m : l.operator === "not_equals" ? !m : l.operator === "filled" ? i : !i;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function ye(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function ir(e, t) {
  const n = {};
  for (const [r, o] of Object.entries(e))
    r === t ? n[""] = o : r.startsWith(`${t}.`) && (n[r.slice(t.length + 1)] = o);
  return n;
}
function lr(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const A = "__none", Se = "__empty", ve = (e) => e === "" ? Se : e;
function mr(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? A : ve(String(e));
}
function dr(e, t) {
  return e === A ? null : e === Se ? "" : t ? Number(e) : e;
}
const ur = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function X(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => be(n, t) && !ur.has(n.type) && !n.config?.secret).flatMap((n) => {
    const r = t[n.handle];
    if (n.type === "group") return X(n.fields ?? [], r);
    if (n.type === "select") {
      const o = ye(n), l = (a) => o.find((i) => i.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(l).join(", ") : r == null ? r : l(r)];
    }
    return [r];
  });
}
const ne = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], pr = { province: 1, city: 2, district: 3, village: 4 }, B = /* @__PURE__ */ new Map();
function gr(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return B.has(n) || B.set(n, ue(n).then((r) => r.data).catch(() => (B.delete(n), []))), B.get(n);
}
function Ce({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: l, SelectTrigger: a, SelectValue: i, SelectContent: m, SelectItem: h } = M, E = e.config ?? {}, x = String(E.api ?? ""), S = pr[E.depth ?? "district"] ?? 3, f = E.country_options ?? [], b = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, _ = ne.slice(0, S), [d, g] = P.useState({}), k = [null, b.province_code, b.city_code, b.district_code];
  P.useEffect(() => {
    b.country !== "ID" || !x || _.forEach((y, C) => {
      const T = k[C];
      C > 0 && !T || gr(x, T).then((v) => g((w) => ({ ...w, [y.key]: v })));
    });
  }, [x, b.country, b.province_code, b.city_code, b.district_code]);
  const D = (y, C) => {
    const T = { ...b };
    T[_[y].key] = C || null, ne.slice(y + 1).forEach((v) => {
      T[v.key] = null;
    }), n(T);
  };
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    f.length > 0 && /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ p(
        l,
        {
          value: b.country,
          onValueChange: (y) => n({ country: y, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ c(i, {}) }),
            /* @__PURE__ */ c(m, { children: f.map((y) => /* @__PURE__ */ c(h, { value: y.value, children: y.label }, y.value)) })
          ]
        }
      )
    ] }),
    b.country === "ID" && _.map((y, C) => /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${y.key}`, children: y.label }),
      /* @__PURE__ */ p(
        l,
        {
          value: b[y.key] ?? A,
          disabled: C > 0 && !k[C],
          onValueChange: (T) => D(C, T === A ? "" : T),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${y.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(i, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ p(m, { children: [
              /* @__PURE__ */ c(h, { value: A, children: "Choose…" }),
              (d[y.key] ?? []).map((T) => /* @__PURE__ */ c(h, { value: T.code, children: T.name }, T.code))
            ] })
          ]
        }
      )
    ] }, y.key))
  ] });
}
function xe({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: l } = M, a = e.config ?? {}, i = Array.isArray(t) ? t : [], [m, h] = P.useState(""), [E, x] = P.useState([]), [S, f] = P.useState(!1);
  P.useEffect(() => {
    if (!S) return;
    const d = new URLSearchParams({ q: m });
    (a.types ?? []).forEach((k) => d.append("types[]", k)), (a.taxonomies ?? []).forEach((k) => d.append("taxonomies[]", k));
    const g = setTimeout(() => ue(`${a.api}?${d}`).then((k) => x(k.data)).catch(() => x([])), 200);
    return () => clearTimeout(g);
  }, [m, S]);
  const b = (d) => i.some((g) => g.type === d.type && g.id === d.id), _ = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-2", children: [
    i.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: i.map((d) => /* @__PURE__ */ p(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ p("span", { className: "cm:text-muted-foreground", children: [
        _[d.type],
        ":"
      ] }),
      " ",
      d.label,
      /* @__PURE__ */ c("button", { type: "button", "aria-label": `Remove ${d.label}`, onClick: () => n(i.filter((g) => !(g.type === d.type && g.id === d.id))), children: "×" })
    ] }, `${d.type}:${d.id}`)) }),
    /* @__PURE__ */ p("div", { className: "cm:relative", children: [
      /* @__PURE__ */ c(
        o,
        {
          id: r,
          value: m,
          placeholder: "Search products, SKUs, categories, brands…",
          onFocus: () => f(!0),
          onBlur: () => setTimeout(() => f(!1), 150),
          onChange: (d) => h(d.target.value)
        }
      ),
      S && E.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: E.map((d) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          disabled: b(d),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (g) => g.preventDefault(),
          onClick: () => {
            n([...i, { type: d.type, id: d.id, label: d.label }]), h("");
          },
          children: [
            /* @__PURE__ */ c("span", { children: d.label }),
            /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: d.group })
          ]
        }
      ) }, `${d.type}:${d.id}`)) })
    ] })
  ] });
}
const hr = P.lazy(() => import("./ProductEditor-Dvk-iV2l.js")), fr = (e) => P.createElement(P.Suspense, { fallback: null }, P.createElement(hr, e)), br = {
  commerce_money: fe,
  commerce_datetime_range: pe,
  commerce_region: Ce,
  commerce_targets: xe,
  commerce_product: fr
};
function yr() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(br).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Sr = P.lazy(() => import("./ChartImpl-aOwcDrxv.js"));
function vr(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(P.Suspense, { fallback: t, children: /* @__PURE__ */ c(Sr, { ...e }) });
}
function Cr({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ p("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ c("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ c("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ c("div", { className: "cm:mt-2", children: n })
  ] });
}
function we(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = we(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function xr() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = we(e)) && (r && (r += " "), r += t);
  return r;
}
function H(...e) {
  return xr(e);
}
function Ir() {
  const { Card: e, CardContent: t } = M;
  return /* @__PURE__ */ c(e, { "aria-hidden": "true", children: /* @__PURE__ */ p(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function wr({ kpi: e }) {
  const { Card: t, CardContent: n } = M, { Link: r } = j, o = e.change ?? null, l = /* @__PURE__ */ p(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ p(
      "span",
      {
        className: H("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ c("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
          " ",
          Math.abs(o).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ p("span", { className: "cm:sr-only", children: [
            o > 0 ? " up" : o < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ c(t, { children: e.href ? /* @__PURE__ */ c(r, { href: z(e.href), className: "cm:block", children: l }) : l });
}
function Te({ title: e, description: t, actions: n, primary: r, menu: o, back: l, children: a }) {
  const { Head: i } = j, { PageHeader: m } = M;
  return /* @__PURE__ */ p(ar, { children: [
    /* @__PURE__ */ c(i, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: l, children: a })
  ] });
}
const O = me, Tr = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: fe,
  commerce_datetime_range: pe,
  commerce_region: Ce,
  commerce_targets: xe
}, re = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function W({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: l }) {
  const a = e, i = r;
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => be(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: H(
    "cm:min-w-0",
    re[m.width ?? 100] ?? re[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    Nr,
    {
      field: m,
      value: t?.[m.handle],
      path: `${o}.${m.handle}`,
      errors: i,
      hideLabel: !!l && m.label === l,
      onChange: (h) => n({ ...t, [m.handle]: h })
    }
  ) }, m.handle)) });
}
function Nr({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: l = !1 }) {
  const { Label: a } = O, i = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${i}-help` : void 0, E = [h, m ? `${i}-error` : void 0].filter(Boolean).join(" ") || void 0, x = e.label ?? e.handle, S = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ p("div", { role: "group", "aria-labelledby": l ? void 0 : `${i}-label`, "aria-label": l ? x : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !l && /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${i}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: x }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(ce, { field: e, value: t, onChange: n, id: i, path: r, errors: o, describedBy: E, label: x }),
    l && h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${i}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !S && /* @__PURE__ */ p(a, { htmlFor: e.type === "repeater" ? void 0 : i, id: `${i}-label`, className: l ? "cm:sr-only" : void 0, children: [
      x,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(ce, { field: e, value: t, onChange: n, id: i, path: r, errors: o, describedBy: E, label: x }),
    h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${i}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function ce({ field: e, value: t, onChange: n, id: r, path: o, errors: l, describedBy: a, label: i }) {
  const { Input: m, Textarea: h, Switch: E, Label: x, MediaPickerInput: S, RichTextEditor: f, Checkbox: b, Select: _, SelectTrigger: d, SelectValue: g, SelectContent: k, SelectItem: D } = O, y = l[o] !== void 0, C = e.config ?? {}, T = Tr[e.type];
  if (T)
    return /* @__PURE__ */ c(T, { field: e, value: t, onChange: n, errors: ir(l, o), id: r, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ c(
        h,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": y,
          "aria-describedby": a,
          onChange: (v) => n(v.target.value)
        }
      );
    case "number":
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          type: "number",
          inputMode: "decimal",
          value: t == null ? "" : String(t),
          "aria-invalid": y,
          "aria-describedby": a,
          min: C.min,
          max: C.max,
          step: C.step ?? "any",
          onChange: (v) => n(lr(v.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": y,
          "aria-describedby": a,
          onChange: (v) => n(v.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c(E, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (v) => n(v) }),
        /* @__PURE__ */ c(x, { htmlFor: r, children: i })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const v = ye(e), w = e.type !== "select";
      if (C.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), ke = (R, q) => {
          const J = q ? [...I, R] : I.filter(($e) => $e !== R);
          n(w ? J.map(Number) : J);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: v.map((R) => /* @__PURE__ */ p("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(b, { checked: I.includes(R.value), onCheckedChange: (q) => ke(R.value, q === !0) }),
          R.label
        ] }, R.value)) });
      }
      const L = Array.isArray(t) ? t[0] : t, $ = mr(L, v);
      return /* @__PURE__ */ p(_, { value: $, onValueChange: (I) => n(dr(I, w)), children: [
        /* @__PURE__ */ c(d, { id: r, className: "cm:w-full", "aria-invalid": y, "aria-describedby": a, children: /* @__PURE__ */ c(g, { placeholder: "—" }) }),
        /* @__PURE__ */ p(k, { children: [
          (!e.required || $ === A) && /* @__PURE__ */ c(D, { value: A, children: "—" }),
          v.map((I) => /* @__PURE__ */ c(D, { value: ve(I.value), children: I.label }, I.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ c(
        S,
        {
          id: r,
          value: t ?? null,
          multiple: C.multiple === !0,
          max: C.max,
          invalid: y,
          types: Array.isArray(C.types) ? C.types : C.image_only ? ["image"] : void 0,
          onChange: (v) => n(v)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ c(
        f,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: y,
          labelledBy: `${r}-label`,
          onChange: (v) => n(v ?? "")
        }
      );
    case "group":
      return C.per_language === !0 ? /* @__PURE__ */ c($r, { field: e, value: t, onChange: n, path: o, errors: l }) : /* @__PURE__ */ c(W, { fields: e.fields ?? [], values: t ?? {}, errors: l, pathPrefix: o, onChange: (v) => n(v) });
    case "repeater":
      return /* @__PURE__ */ c(kr, { field: e, value: t, onChange: n, path: o, errors: l, label: i });
    default:
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": y,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: C.placeholder,
          onChange: (v) => n(v.target.value)
        }
      );
  }
}
function kr({ field: e, value: t, onChange: n, path: r, errors: o, label: l }) {
  const { Button: a } = O, i = Array.isArray(t) ? t : [], m = K([]), h = K(0);
  for (; m.current.length < i.length; ) m.current.push(h.current++);
  m.current.length = i.length;
  const [E, x] = Q(() => /* @__PURE__ */ new Set()), S = (d, g) => {
    m.current = g, n(d);
  }, f = () => Object.fromEntries((e.fields ?? []).map((d) => [d.handle, d.type === "toggle" ? !1 : null])), b = typeof e.config?.max == "number" ? e.config.max : null, _ = (d, g) => d.map((k, D) => D === g - 1 ? d[g] : D === g ? d[g - 1] : k);
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-2", children: [
    i.map((d, g) => {
      const k = m.current[g], D = `${r}.${g}`, y = Object.keys(o).some((L) => L === D || L.startsWith(`${D}.`)), C = O.cardSummary(X(e.fields ?? [], d)), T = y || E.has(k) || C === "", v = () => x((L) => {
        const $ = new Set(L);
        return T ? $.delete(k) : $.add(k), $;
      }), w = `${D.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ p("div", { className: H("cm:rounded-lg cm:border cm:bg-card", y && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ p(
            "button",
            {
              type: "button",
              "aria-expanded": T,
              "aria-controls": w,
              onClick: v,
              disabled: y || C === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !T && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ p("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  g + 1,
                  "."
                ] }),
                /* @__PURE__ */ c("span", { className: "cm:truncate cm:font-medium", children: C || `New ${l.toLowerCase()}` })
              ]
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              disabled: g === 0,
              "aria-label": `Move ${g + 1} up`,
              onClick: () => S(_(i, g), _(m.current, g)),
              children: "Move up"
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              "aria-label": `Remove ${g + 1}`,
              onClick: () => S(i.filter((L, $) => $ !== g), m.current.filter((L, $) => $ !== g)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: w, hidden: !T, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          W,
          {
            fields: e.fields ?? [],
            values: d,
            errors: o,
            pathPrefix: D,
            onChange: (L) => S(i.map(($, I) => I === g ? L : $), m.current)
          }
        ) })
      ] }, k);
    }),
    /* @__PURE__ */ c("div", { children: /* @__PURE__ */ p(
      a,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: b !== null && i.length >= b,
        onClick: () => {
          const d = h.current++;
          x((g) => new Set(g).add(d)), S([...i, f()], [...m.current, d]);
        },
        children: [
          "Add ",
          l.toLowerCase()
        ]
      }
    ) })
  ] });
}
function $r({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: l } = O, a = t ?? {}, i = e.fields ?? [], m = String(e.config?.main ?? i[0]?.handle ?? ""), h = (f) => Object.keys(o).some((b) => b === `${r}.${f}` || b.startsWith(`${r}.${f}.`)), [E, x] = Q(() => i.find((f) => h(f.handle))?.handle ?? m), S = (f) => a[f] === null || a[f] === void 0 || a[f] === "";
  return /* @__PURE__ */ c(
    l,
    {
      value: E,
      onValueChange: x,
      label: e.label,
      languages: i.map((f) => ({
        code: f.handle,
        name: f.label,
        main: f.handle === m,
        missing: f.handle !== m && S(f.handle),
        status: h(f.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (f) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          W,
          {
            fields: i.filter((b) => b.handle === f),
            values: a,
            errors: o,
            pathPrefix: r,
            section: i.find((b) => b.handle === f)?.label ?? null,
            onChange: (b) => n(b)
          }
        )
      )
    }
  );
}
function Er({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: l, Card: a, CardContent: i, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: E } = M, x = M.cardSummary, { data: S, setData: f, errors: b, processing: _, isDirty: d, ...g } = j.useForm({ values: e.values }), k = P.useRef(!1), D = () => {
    k.current || (k.current = !0, g[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      k.current = !1;
    } }));
  };
  P.useEffect(() => o?.(_), [_, o]), E(d, D);
  const y = e.fields, C = e.sections?.length ? e.sections : [{ title: null, description: null, fields: y.map((w) => w.handle) }], T = Object.keys(b), v = (w, L = null) => /* @__PURE__ */ c(
    W,
    {
      fields: y.filter(($) => w.includes($.handle)),
      values: S.values,
      errors: b,
      pathPrefix: "values",
      section: L,
      onChange: ($) => f("values", $)
    }
  );
  return /* @__PURE__ */ p("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (w) => {
    w.preventDefault(), D();
  }, children: [
    b.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: b.section }),
    /* @__PURE__ */ c(h, { className: "cm:gap-6", children: C.map((w, L) => w.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(i, { children: v(w.fields) }) }, `untitled-${L}`) : /* @__PURE__ */ c(
      m,
      {
        title: w.title,
        description: w.description ?? void 0,
        summary: x(X(y.filter(($) => w.fields.includes($.handle)), S.values)) || void 0,
        storageKey: n ? `${n}:${w.title}` : void 0,
        hasErrors: w.fields.some(($) => T.some((I) => I === `values.${$}` || I.startsWith(`values.${$}.`))),
        children: v(w.fields, w.title)
      },
      w.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(l, { type: "submit", disabled: _, children: e.submitLabel }),
      r
    ] })
  ] });
}
function Ne({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = j;
  return /* @__PURE__ */ c("nav", { "aria-label": n, className: "cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: e.map((o) => /* @__PURE__ */ c(
    r,
    {
      href: z(o.href),
      "aria-current": o.key === t ? "page" : void 0,
      className: H(
        "cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:pb-2.5 cm:pt-1 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:text-foreground",
        o.key === t && "cm:border-foreground cm:font-medium cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function Pr({ sections: e, current: t, title: n, description: r, primary: o, children: l }) {
  const { SettingsLayout: a } = M;
  he();
  const i = j.usePage().props.commerce?.settingsNav ?? [];
  return rr([{ label: "Settings", href: z("settings") }, { label: "Store", href: z("commerce/settings") }, { label: n }]), /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(a, { items: i, current: "commerce-settings", children: /* @__PURE__ */ p("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ c(Te, { title: n, description: r, primary: o }),
    /* @__PURE__ */ c(Ne, { items: e, current: t, label: "Store settings" }),
    l
  ] }) }) });
}
const se = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Dr({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", se[e] ?? se.neutral), children: t });
}
function _r() {
  Object.assign(U.components, { Chart: vr, EmptyState: Cr, KpiCard: wr, MoneyInput: ge, PageHeader: Te, SchemaFormView: Er, SectionNav: Ne, SettingsLayout: Pr, StatusBadge: Dr });
}
Pe();
_r();
yr();
or();
export {
  yt as A,
  ut as B,
  vr as C,
  K as D,
  Cr as E,
  ar as F,
  nt as G,
  ot as H,
  lt as I,
  dt as J,
  Ir as K,
  Je as L,
  ge as M,
  Ie as N,
  _e as O,
  Te as P,
  Le as Q,
  P as R,
  Dr as S,
  xe as T,
  me as U,
  Fe as V,
  rr as a,
  z as b,
  c,
  M as d,
  U as e,
  wr as f,
  ae as g,
  ue as h,
  j as i,
  p as j,
  W as k,
  Ce as l,
  H as m,
  Pr as n,
  Er as o,
  Q as p,
  er as q,
  Qe as r,
  Ge as s,
  Lr as t,
  he as u,
  xr as v,
  qe as w,
  rt as x,
  We as y,
  ze as z
};
