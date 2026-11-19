const ae = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let X = ae;
function Ee(e) {
  X = { ...ae, ...e ?? {} };
}
function ie(e, t = X) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, l = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", i = l + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${i}` : `${i}${m}${t.symbol}`;
  return n ? `-${h}` : h;
}
function le(e, t = X) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, l = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(l) || o + l === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(l.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return r ? -a : a;
}
const R = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, q = {
  version: 1,
  registerOrderPanel: (e, t) => {
    R.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    R.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    R.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    R.productTabs[e] = t;
  },
  orderPanels: () => R.orderPanels,
  dashboardWidgets: () => R.dashboardWidgets,
  settingsSections: () => R.settingsSections,
  productTabs: () => R.productTabs,
  formatMoney: ie,
  parseMoney: le,
  components: {}
};
function Pe() {
  window.SunriceCommerce = q;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(q);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r(q)), e.length)), window.SunriceCommerceQueue = e;
}
const u = globalThis.Sunrice?.modules?.react;
if (!u)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const _e = u.Activity, De = u.Children, Le = u.Component, Ie = u.Fragment, Me = u.Profiler, Fe = u.PureComponent, Ae = u.StrictMode, Re = u.Suspense, He = u.ViewTransition, je = u.act, Oe = u.addTransitionType, Ve = u.cache, Be = u.cacheSignal, Ue = u.captureOwnerStack, ze = u.cloneElement, We = u.createContext, qe = u.createElement, Ke = u.createRef, Ge = u.forwardRef, Qe = u.isValidElement, Xe = u.lazy, Je = u.memo, Ye = u.startTransition, Ze = u.unstable_useCacheRefresh, et = u.use, tt = u.useActionState, nt = u.useCallback, rt = u.useContext, ct = u.useDebugValue, st = u.useDeferredValue, ot = u.useEffect, at = u.useEffectEvent, it = u.useId, lt = u.useImperativeHandle, mt = u.useInsertionEffect, dt = u.useLayoutEffect, ut = u.useMemo, pt = u.useOptimistic, gt = u.useReducer, Q = u.useRef, J = u.useState, ht = u.useSyncExternalStore, ft = u.useTransition, bt = u.version, yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: _e,
  Children: De,
  Component: Le,
  Fragment: Ie,
  Profiler: Me,
  PureComponent: Fe,
  StrictMode: Ae,
  Suspense: Re,
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
  useRef: Q,
  useState: J,
  useSyncExternalStore: ht,
  useTransition: ft,
  version: bt
}, Symbol.toStringTag, { value: "Module" })), w = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!w)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
w.App;
w.Deferred;
w.Form;
const St = w.Head;
w.InfiniteScroll;
const vt = w.Link;
w.WhenMounted;
w.WhenVisible;
w.config;
w.createInertiaApp;
w.http;
w.progress;
w.resetLayoutProps;
const Ct = w.router;
w.setLayoutProps;
const xt = w.useForm;
w.useFormContext;
w.useHttp;
const wt = w.usePage;
w.usePoll;
w.usePrefetch;
w.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Tt = s.Badge, Nt = s.Button, kt = s.Card, $t = s.CardContent, Et = s.CardDescription, Pt = s.CardFooter, _t = s.CardHeader, Dt = s.cardSummary, Lt = s.CardTitle, It = s.Checkbox, Mt = s.CodeEditor, Ft = s.CollapsibleCard, At = s.CollapsibleCardGroup, Rt = s.Command, Ht = s.CommandEmpty, jt = s.CommandGroup, Ot = s.CommandInput, Vt = s.CommandItem, Bt = s.CommandList, Ut = s.CommandSeparator, zt = s.DatePicker, Wt = s.DeveloperHelp, qt = s.Dialog, Kt = s.DialogContent, Gt = s.DialogDescription, Qt = s.DialogFooter, Xt = s.DialogHeader, Jt = s.DialogTitle, Yt = s.DialogTrigger, Zt = s.DropdownMenu, en = s.DropdownMenuCheckboxItem, tn = s.DropdownMenuContent, nn = s.DropdownMenuItem, rn = s.DropdownMenuLabel, cn = s.DropdownMenuSeparator, sn = s.DropdownMenuTrigger, on = s.FormSections, an = s.Input, ln = s.KeptEditsNotice, mn = s.Label, dn = s.LanguageTabs, un = s.LinkAttributes, pn = s.LinkSourcePicker, gn = s.MediaPickerInput, hn = s.moveItem, fn = s.PageHeader, bn = s.Popover, yn = s.PopoverAnchor, Sn = s.PopoverContent, vn = s.PopoverTrigger, Cn = s.registerCommandSource, xn = s.RichTextEditor, wn = s.Select, Tn = s.SelectContent, Nn = s.SelectItem, kn = s.SelectTrigger, $n = s.SelectValue, En = s.Separator, Pn = s.SettingsLayout, _n = s.SettingsNav, Dn = s.Skeleton, Ln = s.SortableHandle, In = s.SortableList, Mn = s.Switch, Fn = s.Table, An = s.TableBody, Rn = s.TableCell, Hn = s.TableHead, jn = s.TableHeader, On = s.TableRow, Vn = s.Tabs, Bn = s.TabsContent, Un = s.TabsList, zn = s.TabsTrigger, Wn = s.Textarea, qn = s.Tooltip, Kn = s.TooltipContent, Gn = s.TooltipTrigger, Qn = s.toast, Xn = s.TrashBanner, Jn = s.TrashHint, Yn = s.TrashTitle, me = s.useBreadcrumbs, Zn = s.useEditLock, er = s.useTablePreferences, tr = s.useUnsavedChanges, nr = s.ViewingNotice, de = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Tt,
  Button: Nt,
  Card: kt,
  CardContent: $t,
  CardDescription: Et,
  CardFooter: Pt,
  CardHeader: _t,
  CardTitle: Lt,
  Checkbox: It,
  CodeEditor: Mt,
  CollapsibleCard: Ft,
  CollapsibleCardGroup: At,
  Command: Rt,
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
  SettingsNav: _n,
  Skeleton: Dn,
  SortableHandle: Ln,
  SortableList: In,
  Switch: Mn,
  Table: Fn,
  TableBody: An,
  TableCell: Rn,
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
  cardSummary: Dt,
  moveItem: hn,
  registerCommandSource: Cn,
  toast: Qn,
  useBreadcrumbs: me,
  useEditLock: Zn,
  useTablePreferences: er,
  useUnsavedChanges: tr
}, Symbol.toStringTag, { value: "Module" })), Z = 3, ue = () => window.Sunrice, P = yt, F = de, O = {
  router: Ct,
  Link: vt,
  Head: St,
  usePage: wt,
  useForm: xt
}, Lr = F.toast, rr = me;
function K(e = "") {
  return e.startsWith("/") ? e : ue().adminUrl(e);
}
async function pe(e, t = {}) {
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
  const t = ue();
  if (t.version !== Z)
    throw new Error(`[commerce] This bundle was built for admin runtime ${Z}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const sr = {
  "Commerce/Confirmations/Index": () => import("./Index-BERAyM1P.js"),
  "Commerce/Customers/Show": () => import("./Show-BPc3mITQ.js"),
  "Commerce/Dashboard": () => import("./Dashboard-D5EvIzWE.js"),
  "Commerce/Inventory/Index": () => import("./Index-CUq8iP8T.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-CmFftVwc.js"),
  "Commerce/Marketing/Report": () => import("./Report-DUSErjND.js"),
  "Commerce/Orders/Editor": () => import("./Editor-GuTkj_zz.js"),
  "Commerce/Orders/Show": () => import("./Show-C6S_bFGG.js"),
  "Commerce/Products/Index": () => import("./Index-DNA6Qknf.js"),
  "Commerce/Products/Import": () => import("./Import-DaSJIMDP.js"),
  "Commerce/Reports/Show": () => import("./Show-B-ToGvCI.js"),
  "Commerce/Settings/Section": () => import("./Section-Frzsscd2.js"),
  "Commerce/Settings/Emails": () => import("./Emails-Bk17suKi.js"),
  "Commerce/Settings/Features": () => import("./Features-BIipJsxx.js"),
  "Commerce/Settings/Payments": () => import("./Payments-DvTEp0O3.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-DQxLUZh2.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-DO1560mJ.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-1DMKjFNp.js")
};
function or() {
  cr(sr);
}
const B = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!B)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ar = B.Fragment, c = B.jsx, p = B.jsxs;
B.jsx;
function ee(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function te(e) {
  return e ? new Date(e).toISOString() : null;
}
function ge({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = F, l = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: ee(l.start),
          onChange: (a) => t({ ...l, start: te(a.target.value) })
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
          value: ee(l.end),
          onChange: (a) => t({ ...l, end: te(a.target.value) })
        }
      )
    ] })
  ] });
}
function he({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: o = !0,
  invalid: l
}) {
  const { Input: a } = F, i = (v) => v == null ? "" : ie(v).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = P.useState(i(e)), [$, x] = P.useState(!1);
  return P.useEffect(() => {
    $ || h(i(e));
  }, [e, $]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": l || void 0,
      onFocus: () => x(!0),
      onChange: (v) => {
        h(v.target.value);
        const f = v.target.value.trim() === "" ? o ? null : 0 : le(v.target.value);
        (f !== null || v.target.value.trim() === "") && t(f);
      },
      onBlur: () => {
        x(!1), h(i(e));
      }
    }
  );
}
function fe() {
  const { props: e } = O.usePage(), t = e.commerce ?? {};
  return Ee(t.currency), t;
}
function be({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return fe(), /* @__PURE__ */ c(
    he,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const ne = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function ye(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const r = "rules" in n ? n.rules : [n];
  if (r.length === 0) return !0;
  const o = r.map((l) => {
    const a = t?.[l.field], i = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(ne).includes(ne(l.value));
    return l.operator === "equals" ? m : l.operator === "not_equals" ? !m : l.operator === "filled" ? i : !i;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function Se(e) {
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
const H = "__none", ve = "__empty", Ce = (e) => e === "" ? ve : e;
function mr(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? H : Ce(String(e));
}
function dr(e, t) {
  return e === H ? null : e === ve ? "" : t ? Number(e) : e;
}
const ur = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function Y(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => ye(n, t) && !ur.has(n.type) && !n.config?.secret).flatMap((n) => {
    const r = t[n.handle];
    if (n.type === "group") return Y(n.fields ?? [], r);
    if (n.type === "select") {
      const o = Se(n), l = (a) => o.find((i) => i.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(l).join(", ") : r == null ? r : l(r)];
    }
    return [r];
  });
}
const re = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], pr = { province: 1, city: 2, district: 3, village: 4 }, W = /* @__PURE__ */ new Map();
function gr(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return W.has(n) || W.set(n, pe(n).then((r) => r.data).catch(() => (W.delete(n), []))), W.get(n);
}
function xe({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: l, SelectTrigger: a, SelectValue: i, SelectContent: m, SelectItem: h } = F, $ = e.config ?? {}, x = String($.api ?? ""), v = pr[$.depth ?? "district"] ?? 3, f = $.country_options ?? [], b = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, L = re.slice(0, v), [d, g] = P.useState({}), N = [null, b.province_code, b.city_code, b.district_code];
  P.useEffect(() => {
    b.country !== "ID" || !x || L.forEach((y, C) => {
      const k = N[C];
      C > 0 && !k || gr(x, k).then((S) => g((T) => ({ ...T, [y.key]: S })));
    });
  }, [x, b.country, b.province_code, b.city_code, b.district_code]);
  const D = (y, C) => {
    const k = { ...b };
    k[L[y].key] = C || null, re.slice(y + 1).forEach((S) => {
      k[S.key] = null;
    }), n(k);
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
    b.country === "ID" && L.map((y, C) => /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${y.key}`, children: y.label }),
      /* @__PURE__ */ p(
        l,
        {
          value: b[y.key] ?? H,
          disabled: C > 0 && !N[C],
          onValueChange: (k) => D(C, k === H ? "" : k),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${y.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(i, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ p(m, { children: [
              /* @__PURE__ */ c(h, { value: H, children: "Choose…" }),
              (d[y.key] ?? []).map((k) => /* @__PURE__ */ c(h, { value: k.code, children: k.name }, k.code))
            ] })
          ]
        }
      )
    ] }, y.key))
  ] });
}
function we({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: l } = F, a = e.config ?? {}, i = Array.isArray(t) ? t : [], [m, h] = P.useState(""), [$, x] = P.useState([]), [v, f] = P.useState(!1);
  P.useEffect(() => {
    if (!v) return;
    const d = new URLSearchParams({ q: m });
    (a.types ?? []).forEach((N) => d.append("types[]", N)), (a.taxonomies ?? []).forEach((N) => d.append("taxonomies[]", N));
    const g = setTimeout(() => pe(`${a.api}?${d}`).then((N) => x(N.data)).catch(() => x([])), 200);
    return () => clearTimeout(g);
  }, [m, v]);
  const b = (d) => i.some((g) => g.type === d.type && g.id === d.id), L = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-2", children: [
    i.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: i.map((d) => /* @__PURE__ */ p(l, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ p("span", { className: "cm:text-muted-foreground", children: [
        L[d.type],
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
          placeholder: a.types && a.types.every((d) => d !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => f(!0),
          onBlur: () => setTimeout(() => f(!1), 150),
          onChange: (d) => h(d.target.value)
        }
      ),
      v && $.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: $.map((d) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ p(
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
const hr = P.lazy(() => import("./ProductEditor-DS-eAWzz.js")), fr = (e) => P.createElement(P.Suspense, { fallback: null }, P.createElement(hr, e)), br = {
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we,
  commerce_product: fr
};
function yr() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(br).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Sr = P.lazy(() => import("./ChartImpl-x60PxwBV.js"));
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
function Te(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Te(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function xr() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Te(e)) && (r && (r += " "), r += t);
  return r;
}
function j(...e) {
  return xr(e);
}
function Ir() {
  const { Card: e, CardContent: t } = F;
  return /* @__PURE__ */ c(e, { "aria-hidden": "true", children: /* @__PURE__ */ p(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function wr({ kpi: e }) {
  const { Card: t, CardContent: n } = F, { Link: r } = O, o = e.change ?? null, l = /* @__PURE__ */ p(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ p(
      "span",
      {
        className: j("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
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
  return /* @__PURE__ */ c(t, { children: e.href ? /* @__PURE__ */ c(r, { href: K(e.href), className: "cm:block", children: l }) : l });
}
function Ne({ title: e, description: t, actions: n, primary: r, menu: o, back: l, children: a }) {
  const { Head: i } = O, { PageHeader: m } = F;
  return /* @__PURE__ */ p(ar, { children: [
    /* @__PURE__ */ c(i, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: l, children: a })
  ] });
}
const V = de, Tr = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we
}, ce = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function G({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: l }) {
  const a = e, i = r;
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => ye(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: j(
    "cm:min-w-0",
    ce[m.width ?? 100] ?? ce[100],
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
  const { Label: a } = V, i = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${i}-help` : void 0, $ = [h, m ? `${i}-error` : void 0].filter(Boolean).join(" ") || void 0, x = e.label ?? e.handle, v = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ p("div", { role: "group", "aria-labelledby": l ? void 0 : `${i}-label`, "aria-label": l ? x : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !l && /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${i}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: x }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(se, { field: e, value: t, onChange: n, id: i, path: r, errors: o, describedBy: $, label: x }),
    l && h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${i}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !v && /* @__PURE__ */ p(a, { htmlFor: e.type === "repeater" ? void 0 : i, id: `${i}-label`, className: l ? "cm:sr-only" : void 0, children: [
      x,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(se, { field: e, value: t, onChange: n, id: i, path: r, errors: o, describedBy: $, label: x }),
    h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${i}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function se({ field: e, value: t, onChange: n, id: r, path: o, errors: l, describedBy: a, label: i }) {
  const { Input: m, Textarea: h, Switch: $, Label: x, MediaPickerInput: v, RichTextEditor: f, Checkbox: b, Select: L, SelectTrigger: d, SelectValue: g, SelectContent: N, SelectItem: D } = V, y = l[o] !== void 0, C = e.config ?? {}, k = Tr[e.type];
  if (k)
    return /* @__PURE__ */ c(k, { field: e, value: t, onChange: n, errors: ir(l, o), id: r, describedBy: a });
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
          onChange: (S) => n(S.target.value)
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
          onChange: (S) => n(lr(S.target.value))
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
          onChange: (S) => n(S.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c($, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (S) => n(S) }),
        /* @__PURE__ */ c(x, { htmlFor: r, children: i })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const S = Se(e), T = e.type !== "select";
      if (C.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), U = (E, M) => {
          const z = M ? [...I, E] : I.filter(($e) => $e !== E);
          n(T ? z.map(Number) : z);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: S.map((E) => /* @__PURE__ */ p("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(b, { checked: I.includes(E.value), onCheckedChange: (M) => U(E.value, M === !0) }),
          E.label
        ] }, E.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, _ = mr(A, S);
      return /* @__PURE__ */ p(L, { value: _, onValueChange: (I) => n(dr(I, T)), children: [
        /* @__PURE__ */ c(d, { id: r, className: "cm:w-full", "aria-invalid": y, "aria-describedby": a, children: /* @__PURE__ */ c(g, { placeholder: "—" }) }),
        /* @__PURE__ */ p(N, { children: [
          (!e.required || _ === H) && /* @__PURE__ */ c(D, { value: H, children: "—" }),
          S.map((I) => /* @__PURE__ */ c(D, { value: Ce(I.value), children: I.label }, I.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ c(
        v,
        {
          id: r,
          value: t ?? null,
          multiple: C.multiple === !0,
          max: C.max,
          invalid: y,
          types: Array.isArray(C.types) ? C.types : C.image_only ? ["image"] : void 0,
          onChange: (S) => n(S)
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
          onChange: (S) => n(S ?? "")
        }
      );
    case "group":
      return C.per_language === !0 ? /* @__PURE__ */ c($r, { field: e, value: t, onChange: n, path: o, errors: l }) : /* @__PURE__ */ c(G, { fields: e.fields ?? [], values: t ?? {}, errors: l, pathPrefix: o, onChange: (S) => n(S) });
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
          onChange: (S) => n(S.target.value)
        }
      );
  }
}
function kr({ field: e, value: t, onChange: n, path: r, errors: o, label: l }) {
  const { Button: a } = V, i = Array.isArray(t) ? t : [], m = Q([]), h = Q(0);
  for (; m.current.length < i.length; ) m.current.push(h.current++);
  m.current.length = i.length;
  const [$, x] = J(() => /* @__PURE__ */ new Set()), v = (d, g) => {
    m.current = g, n(d);
  }, f = () => Object.fromEntries((e.fields ?? []).map((d) => [d.handle, d.type === "toggle" ? !1 : null])), b = typeof e.config?.max == "number" ? e.config.max : null, L = (d, g) => d.map((N, D) => D === g - 1 ? d[g] : D === g ? d[g - 1] : N);
  return /* @__PURE__ */ p("div", { className: "cm:grid cm:gap-2", children: [
    i.map((d, g) => {
      const N = m.current[g], D = `${r}.${g}`, y = Object.keys(o).some((E) => E === D || E.startsWith(`${D}.`)), C = e.config?.summary_targets, k = typeof C == "string" ? d[C] : null, S = Array.isArray(k) ? k.flatMap((E) => typeof E?.label == "string" && E.label ? [E.label] : []) : [], A = (S.length > 1 ? `${S[0]} +${S.length - 1}` : S[0]) ?? V.cardSummary(Y(e.fields ?? [], d)), _ = y || $.has(N) || A === "", I = () => x((E) => {
        const M = new Set(E);
        return _ ? M.delete(N) : M.add(N), M;
      }), U = `${D.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ p("div", { className: j("cm:rounded-lg cm:border cm:bg-card", y && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ p(
            "button",
            {
              type: "button",
              "aria-expanded": _,
              "aria-controls": U,
              onClick: I,
              disabled: y || A === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: j("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !_ && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ p("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  g + 1,
                  "."
                ] }),
                /* @__PURE__ */ c("span", { className: "cm:truncate cm:font-medium", children: A || `New ${l.toLowerCase()}` })
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
              onClick: () => v(L(i, g), L(m.current, g)),
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
              onClick: () => v(i.filter((E, M) => M !== g), m.current.filter((E, M) => M !== g)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: U, hidden: !_, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          G,
          {
            fields: e.fields ?? [],
            values: d,
            errors: o,
            pathPrefix: D,
            onChange: (E) => v(i.map((M, z) => z === g ? E : M), m.current)
          }
        ) })
      ] }, N);
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
          x((g) => new Set(g).add(d)), v([...i, f()], [...m.current, d]);
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
  const { LanguageTabs: l } = V, a = t ?? {}, i = e.fields ?? [], m = String(e.config?.main ?? i[0]?.handle ?? ""), h = (f) => Object.keys(o).some((b) => b === `${r}.${f}` || b.startsWith(`${r}.${f}.`)), [$, x] = J(() => i.find((f) => h(f.handle))?.handle ?? m), v = (f) => a[f] === null || a[f] === void 0 || a[f] === "";
  return /* @__PURE__ */ c(
    l,
    {
      value: $,
      onValueChange: x,
      label: e.label,
      languages: i.map((f) => ({
        code: f.handle,
        name: f.label,
        main: f.handle === m,
        missing: f.handle !== m && v(f.handle),
        status: h(f.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (f) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          G,
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
  const { Button: l, Card: a, CardContent: i, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: $ } = F, x = F.cardSummary, { data: v, setData: f, errors: b, processing: L, isDirty: d, ...g } = O.useForm({ values: e.values }), N = P.useRef(!1), D = () => {
    N.current || (N.current = !0, g[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      N.current = !1;
    } }));
  };
  P.useEffect(() => o?.(L), [L, o]), $(d, D);
  const y = e.fields, C = e.sections?.length ? e.sections : [{ title: null, description: null, fields: y.map((T) => T.handle) }], k = Object.keys(b), S = (T, A = null) => /* @__PURE__ */ c(
    G,
    {
      fields: y.filter((_) => T.includes(_.handle)),
      values: v.values,
      errors: b,
      pathPrefix: "values",
      section: A,
      onChange: (_) => f("values", _)
    }
  );
  return /* @__PURE__ */ p("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (T) => {
    T.preventDefault(), D();
  }, children: [
    b.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: b.section }),
    /* @__PURE__ */ c(h, { className: "cm:gap-6", children: C.map((T, A) => T.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(i, { children: S(T.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ c(
      m,
      {
        title: T.title,
        description: T.description ?? void 0,
        summary: x(Y(y.filter((_) => T.fields.includes(_.handle)), v.values)) || void 0,
        storageKey: n ? `${n}:${T.title}` : void 0,
        hasErrors: T.fields.some((_) => k.some((I) => I === `values.${_}` || I.startsWith(`values.${_}.`))),
        children: S(T.fields, T.title)
      },
      T.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ p("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(l, { type: "submit", disabled: L, children: e.submitLabel }),
      r
    ] })
  ] });
}
function ke({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = O;
  return /* @__PURE__ */ c("nav", { "aria-label": n, className: "cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: e.map((o) => /* @__PURE__ */ c(
    r,
    {
      href: K(o.href),
      "aria-current": o.key === t ? "page" : void 0,
      className: j(
        "cm:-mb-px cm:whitespace-nowrap cm:border-b-2 cm:border-transparent cm:px-3 cm:pb-2.5 cm:pt-1 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:text-foreground",
        o.key === t && "cm:border-foreground cm:font-medium cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function Pr({ sections: e, current: t, title: n, description: r, primary: o, children: l }) {
  const { SettingsLayout: a } = F;
  fe();
  const i = O.usePage().props.commerce?.settingsNav ?? [];
  return rr([{ label: "Settings", href: K("settings") }, { label: "Store", href: K("commerce/settings") }, { label: n }]), /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(a, { items: i, current: "commerce-settings", children: /* @__PURE__ */ p("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ c(Ne, { title: n, description: r, primary: o }),
    /* @__PURE__ */ c(ke, { items: e, current: t, label: "Store settings" }),
    l
  ] }) }) });
}
const oe = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function _r({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: j("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", oe[e] ?? oe.neutral), children: t });
}
function Dr() {
  Object.assign(q.components, { Chart: vr, EmptyState: Cr, KpiCard: wr, MoneyInput: he, PageHeader: Ne, SchemaFormView: Er, SectionNav: ke, SettingsLayout: Pr, StatusBadge: _r });
}
Pe();
Dr();
yr();
or();
export {
  ze as A,
  yt as B,
  vr as C,
  ut as D,
  Cr as E,
  ar as F,
  Q as G,
  nt as H,
  ot as I,
  lt as J,
  Ir as K,
  dt as L,
  he as M,
  Je as N,
  De as O,
  Ne as P,
  Le as Q,
  P as R,
  _r as S,
  we as T,
  de as U,
  Fe as V,
  rr as a,
  K as b,
  c,
  F as d,
  q as e,
  wr as f,
  ie as g,
  pe as h,
  O as i,
  p as j,
  G as k,
  xe as l,
  j as m,
  Pr as n,
  Er as o,
  J as p,
  Ie as q,
  er as r,
  Qe as s,
  Lr as t,
  fe as u,
  Ge as v,
  xr as w,
  qe as x,
  rt as y,
  We as z
};
