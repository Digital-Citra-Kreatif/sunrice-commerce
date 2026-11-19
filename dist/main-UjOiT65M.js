const ae = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let X = ae;
function Ee(e) {
  X = { ...ae, ...e ?? {} };
}
function ie(e, t = X) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${h}` : h;
}
function le(e, t = X) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, i = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(i) || o + i === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(i.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
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
const d = globalThis.Sunrice?.modules?.react;
if (!d)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const _e = d.Activity, De = d.Children, Le = d.Component, Ie = d.Fragment, Me = d.Profiler, Fe = d.PureComponent, Ae = d.StrictMode, Re = d.Suspense, He = d.ViewTransition, je = d.act, Oe = d.addTransitionType, Ve = d.cache, Be = d.cacheSignal, Ue = d.captureOwnerStack, ze = d.cloneElement, We = d.createContext, qe = d.createElement, Ke = d.createRef, Ge = d.forwardRef, Qe = d.isValidElement, Xe = d.lazy, Je = d.memo, Ye = d.startTransition, Ze = d.unstable_useCacheRefresh, et = d.use, tt = d.useActionState, nt = d.useCallback, rt = d.useContext, ct = d.useDebugValue, st = d.useDeferredValue, ot = d.useEffect, at = d.useEffectEvent, it = d.useId, lt = d.useImperativeHandle, mt = d.useInsertionEffect, dt = d.useLayoutEffect, ut = d.useMemo, pt = d.useOptimistic, gt = d.useReducer, Q = d.useRef, J = d.useState, ht = d.useSyncExternalStore, ft = d.useTransition, bt = d.version, yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  default: d,
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
}, Symbol.toStringTag, { value: "Module" })), Z = 3, ue = () => window.Sunrice, _ = yt, F = de, O = {
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
  "Commerce/Confirmations/Index": () => import("./Index-aEcPT6ts.js"),
  "Commerce/Customers/Show": () => import("./Show-C7kk5pOc.js"),
  "Commerce/Dashboard": () => import("./Dashboard-D4I4jqTi.js"),
  "Commerce/Inventory/Index": () => import("./Index-CvvsfFgs.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-D7hOtFCH.js"),
  "Commerce/Marketing/Report": () => import("./Report-B8jgprV1.js"),
  "Commerce/Orders/Editor": () => import("./Editor-tJv9eeqi.js"),
  "Commerce/Orders/Show": () => import("./Show-BSzBqv1_.js"),
  "Commerce/Products/Index": () => import("./Index-KvIJ4oZB.js"),
  "Commerce/Products/Import": () => import("./Import-DkIIXPN0.js"),
  "Commerce/Reports/Show": () => import("./Show-SZIg7vjH.js"),
  "Commerce/Settings/Section": () => import("./Section-Byzs9z5W.js"),
  "Commerce/Settings/Emails": () => import("./Emails-DC8zrFJB.js"),
  "Commerce/Settings/Features": () => import("./Features-CPrDEmhK.js"),
  "Commerce/Settings/Payments": () => import("./Payments-BMnA7ve4.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BW4kYzSn.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-Br7E-xSS.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-DT9zc7VY.js")
};
function or() {
  cr(sr);
}
const B = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!B)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ar = B.Fragment, c = B.jsx, g = B.jsxs;
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
  const { Input: r, Label: o } = F, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: ee(i.start),
          onChange: (a) => t({ ...i, start: te(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: ee(i.end),
          onChange: (a) => t({ ...i, end: te(a.target.value) })
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
  invalid: i
}) {
  const { Input: a } = F, l = (C) => C == null ? "" : ie(C).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = _.useState(l(e)), [$, w] = _.useState(!1);
  return _.useEffect(() => {
    $ || h(l(e));
  }, [e, $]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => w(!0),
      onChange: (C) => {
        h(C.target.value);
        const b = C.target.value.trim() === "" ? o ? null : 0 : le(C.target.value);
        (b !== null || C.target.value.trim() === "") && t(b);
      },
      onBlur: () => {
        w(!1), h(l(e));
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
  const o = r.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(ne).includes(ne(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
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
      const o = Se(n), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(i).join(", ") : r == null ? r : i(r)];
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
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: h } = F, $ = e.config ?? {}, w = String($.api ?? ""), C = pr[$.depth ?? "district"] ?? 3, b = $.country_options ?? [], f = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, D = re.slice(0, C), [T, S] = _.useState({}), u = [null, f.province_code, f.city_code, f.district_code];
  _.useEffect(() => {
    f.country !== "ID" || !w || D.forEach((p, x) => {
      const E = u[x];
      x > 0 && !E || gr(w, E).then((y) => S((k) => ({ ...k, [p.key]: y })));
    });
  }, [w, f.country, f.province_code, f.city_code, f.district_code]);
  const v = (p, x) => {
    const E = { ...f };
    E[D[p].key] = x || null, re.slice(p + 1).forEach((y) => {
      E[y.key] = null;
    }), n(E);
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    b.length > 0 && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ g(
        i,
        {
          value: f.country,
          onValueChange: (p) => n({ country: p, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ c(l, {}) }),
            /* @__PURE__ */ c(m, { children: b.map((p) => /* @__PURE__ */ c(h, { value: p.value, children: p.label }, p.value)) })
          ]
        }
      )
    ] }),
    f.country === "ID" && D.map((p, x) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${p.key}`, children: p.label }),
      /* @__PURE__ */ g(
        i,
        {
          value: f[p.key] ?? H,
          disabled: x > 0 && !u[x],
          onValueChange: (E) => v(x, E === H ? "" : E),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${p.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ g(m, { children: [
              /* @__PURE__ */ c(h, { value: H, children: "Choose…" }),
              (T[p.key] ?? []).map((E) => /* @__PURE__ */ c(h, { value: E.code, children: E.name }, E.code))
            ] })
          ]
        }
      )
    ] }, p.key))
  ] });
}
function we({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = F, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", h = Array.isArray(t) ? t : [], [$, w] = _.useState(""), [C, b] = _.useState([]), [f, D] = _.useState(!1);
  _.useEffect(() => {
    if (!f) return;
    const u = new URLSearchParams({ q: $ });
    (a.types ?? []).forEach((p) => u.append("types[]", p)), (a.taxonomies ?? []).forEach((p) => u.append("taxonomies[]", p));
    const v = setTimeout(() => pe(`${a.api}?${u}`).then((p) => b(p.data)).catch(() => b([])), 200);
    return () => clearTimeout(v);
  }, [$, f]);
  const T = (u) => h.some((v) => v.type === u.type && v.id === u.id), S = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    h.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: h.map((u) => /* @__PURE__ */ g(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ g("span", { className: "cm:text-muted-foreground", children: [
        S[u.type],
        ":"
      ] }),
      " ",
      u.label,
      /* @__PURE__ */ c("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n(h.filter((v) => !(v.type === u.type && v.id === u.id))), children: "×" })
    ] }, `${u.type}:${u.id}`)) }),
    /* @__PURE__ */ g("div", { className: "cm:relative", children: [
      /* @__PURE__ */ c(
        o,
        {
          id: r,
          value: $,
          placeholder: m ? "Search products…" : a.types && a.types.every((u) => u !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => D(!0),
          onBlur: () => setTimeout(() => D(!1), 150),
          onChange: (u) => w(u.target.value)
        }
      ),
      f && C.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((u) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          disabled: T(u),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (v) => v.preventDefault(),
          onClick: () => {
            const v = { type: u.type, id: u.id, label: u.label };
            n(l ? [v] : [...h, v]), w(""), l && D(!1);
          },
          children: [
            /* @__PURE__ */ c("span", { children: u.label }),
            /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: u.group })
          ]
        }
      ) }, `${u.type}:${u.id}`)) })
    ] })
  ] });
}
const hr = _.lazy(() => import("./ProductEditor-CmdUgGRU.js")), fr = (e) => _.createElement(_.Suspense, { fallback: null }, _.createElement(hr, e)), br = {
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we,
  commerce_product: fr
};
function yr() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(br).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Sr = _.lazy(() => import("./ChartImpl-BZwO8ucT.js"));
function vr(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(_.Suspense, { fallback: t, children: /* @__PURE__ */ c(Sr, { ...e }) });
}
function Cr({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ g("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
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
  return /* @__PURE__ */ c(e, { "aria-hidden": "true", children: /* @__PURE__ */ g(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function wr({ kpi: e }) {
  const { Card: t, CardContent: n } = F, { Link: r } = O, o = e.change ?? null, i = /* @__PURE__ */ g(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ g(
      "span",
      {
        className: j("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ c("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
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
    e.hint && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ c(t, { children: e.href ? /* @__PURE__ */ c(r, { href: K(e.href), className: "cm:block", children: i }) : i });
}
function Ne({ title: e, description: t, actions: n, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = O, { PageHeader: m } = F;
  return /* @__PURE__ */ g(ar, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
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
function G({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = r;
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
      errors: l,
      hideLabel: !!i && m.label === i,
      onChange: (h) => n({ ...t, [m.handle]: h })
    }
  ) }, m.handle)) });
}
function Nr({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = V, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${l}-help` : void 0, $ = [h, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, w = e.label ?? e.handle, C = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ g("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? w : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: w }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(se, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: $, label: w }),
    i && h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !C && /* @__PURE__ */ g(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      w,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(se, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: $, label: w }),
    h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function se({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: h, Switch: $, Label: w, MediaPickerInput: C, RichTextEditor: b, Checkbox: f, Select: D, SelectTrigger: T, SelectValue: S, SelectContent: u, SelectItem: v } = V, p = i[o] !== void 0, x = e.config ?? {}, E = Tr[e.type];
  if (E)
    return /* @__PURE__ */ c(E, { field: e, value: t, onChange: n, errors: ir(i, o), id: r, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ c(
        h,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": p,
          "aria-describedby": a,
          onChange: (y) => n(y.target.value)
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
          "aria-invalid": p,
          "aria-describedby": a,
          min: x.min,
          max: x.max,
          step: x.step ?? "any",
          onChange: (y) => n(lr(y.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": p,
          "aria-describedby": a,
          onChange: (y) => n(y.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c($, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (y) => n(y) }),
        /* @__PURE__ */ c(w, { htmlFor: r, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const y = Se(e), k = e.type !== "select";
      if (x.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), U = (P, M) => {
          const z = M ? [...I, P] : I.filter(($e) => $e !== P);
          n(k ? z.map(Number) : z);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: y.map((P) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(f, { checked: I.includes(P.value), onCheckedChange: (M) => U(P.value, M === !0) }),
          P.label
        ] }, P.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, L = mr(A, y);
      return /* @__PURE__ */ g(D, { value: L, onValueChange: (I) => n(dr(I, k)), children: [
        /* @__PURE__ */ c(T, { id: r, className: "cm:w-full", "aria-invalid": p, "aria-describedby": a, children: /* @__PURE__ */ c(S, { placeholder: "—" }) }),
        /* @__PURE__ */ g(u, { children: [
          (!e.required || L === H) && /* @__PURE__ */ c(v, { value: H, children: "—" }),
          y.map((I) => /* @__PURE__ */ c(v, { value: Ce(I.value), children: I.label }, I.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ c(
        C,
        {
          id: r,
          value: t ?? null,
          multiple: x.multiple === !0,
          max: x.max,
          invalid: p,
          types: Array.isArray(x.types) ? x.types : x.image_only ? ["image"] : void 0,
          onChange: (y) => n(y)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ c(
        b,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: p,
          labelledBy: `${r}-label`,
          onChange: (y) => n(y ?? "")
        }
      );
    case "group":
      return x.per_language === !0 ? /* @__PURE__ */ c($r, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(G, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (y) => n(y) });
    case "repeater":
      return /* @__PURE__ */ c(kr, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": p,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: x.placeholder,
          onChange: (y) => n(y.target.value)
        }
      );
  }
}
function kr({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = V, l = Array.isArray(t) ? t : [], m = Q([]), h = Q(0);
  for (; m.current.length < l.length; ) m.current.push(h.current++);
  m.current.length = l.length;
  const [$, w] = J(() => /* @__PURE__ */ new Set()), C = (T, S) => {
    m.current = S, n(T);
  }, b = () => Object.fromEntries((e.fields ?? []).map((T) => [T.handle, T.type === "toggle" ? !1 : null])), f = typeof e.config?.max == "number" ? e.config.max : null, D = (T, S) => T.map((u, v) => v === S - 1 ? T[S] : v === S ? T[S - 1] : u);
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    l.map((T, S) => {
      const u = m.current[S], v = `${r}.${S}`, p = Object.keys(o).some((P) => P === v || P.startsWith(`${v}.`)), x = e.config?.summary_targets, E = typeof x == "string" ? T[x] : null, y = Array.isArray(E) ? E.flatMap((P) => typeof P?.label == "string" && P.label ? [P.label] : []) : [], A = (y.length > 1 ? `${y[0]} +${y.length - 1}` : y[0]) ?? V.cardSummary(Y(e.fields ?? [], T)), L = p || $.has(u) || A === "", I = () => w((P) => {
        const M = new Set(P);
        return L ? M.delete(u) : M.add(u), M;
      }), U = `${v.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ g("div", { className: j("cm:rounded-lg cm:border cm:bg-card", p && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              "aria-expanded": L,
              "aria-controls": U,
              onClick: I,
              disabled: p || A === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: j("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !L && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ g("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  S + 1,
                  "."
                ] }),
                /* @__PURE__ */ c("span", { className: "cm:truncate cm:font-medium", children: A || `New ${i.toLowerCase()}` })
              ]
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              disabled: S === 0,
              "aria-label": `Move ${S + 1} up`,
              onClick: () => C(D(l, S), D(m.current, S)),
              children: "Move up"
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              "aria-label": `Remove ${S + 1}`,
              onClick: () => C(l.filter((P, M) => M !== S), m.current.filter((P, M) => M !== S)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: U, hidden: !L, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          G,
          {
            fields: e.fields ?? [],
            values: T,
            errors: o,
            pathPrefix: v,
            onChange: (P) => C(l.map((M, z) => z === S ? P : M), m.current)
          }
        ) })
      ] }, u);
    }),
    /* @__PURE__ */ c("div", { children: /* @__PURE__ */ g(
      a,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: f !== null && l.length >= f,
        onClick: () => {
          const T = h.current++;
          w((S) => new Set(S).add(T)), C([...l, b()], [...m.current, T]);
        },
        children: [
          "Add ",
          i.toLowerCase()
        ]
      }
    ) })
  ] });
}
function $r({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = V, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), h = (b) => Object.keys(o).some((f) => f === `${r}.${b}` || f.startsWith(`${r}.${b}.`)), [$, w] = J(() => l.find((b) => h(b.handle))?.handle ?? m), C = (b) => a[b] === null || a[b] === void 0 || a[b] === "";
  return /* @__PURE__ */ c(
    i,
    {
      value: $,
      onValueChange: w,
      label: e.label,
      languages: l.map((b) => ({
        code: b.handle,
        name: b.label,
        main: b.handle === m,
        missing: b.handle !== m && C(b.handle),
        status: h(b.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (b) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          G,
          {
            fields: l.filter((f) => f.handle === b),
            values: a,
            errors: o,
            pathPrefix: r,
            section: l.find((f) => f.handle === b)?.label ?? null,
            onChange: (f) => n(f)
          }
        )
      )
    }
  );
}
function Er({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: $ } = F, w = F.cardSummary, { data: C, setData: b, errors: f, processing: D, isDirty: T, ...S } = O.useForm({ values: e.values }), u = _.useRef(!1), v = () => {
    u.current || (u.current = !0, S[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      u.current = !1;
    } }));
  };
  _.useEffect(() => o?.(D), [D, o]), $(T, v);
  const p = e.fields, x = e.sections?.length ? e.sections : [{ title: null, description: null, fields: p.map((k) => k.handle) }], E = Object.keys(f), y = (k, A = null) => /* @__PURE__ */ c(
    G,
    {
      fields: p.filter((L) => k.includes(L.handle)),
      values: C.values,
      errors: f,
      pathPrefix: "values",
      section: A,
      onChange: (L) => b("values", L)
    }
  );
  return /* @__PURE__ */ g("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (k) => {
    k.preventDefault(), v();
  }, children: [
    f.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: f.section }),
    /* @__PURE__ */ c(h, { className: "cm:gap-6", children: x.map((k, A) => k.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(l, { children: y(k.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ c(
      m,
      {
        title: k.title,
        description: k.description ?? void 0,
        summary: w(Y(p.filter((L) => k.fields.includes(L.handle)), C.values)) || void 0,
        storageKey: n ? `${n}:${k.title}` : void 0,
        hasErrors: k.fields.some((L) => E.some((I) => I === `values.${L}` || I.startsWith(`values.${L}.`))),
        children: y(k.fields, k.title)
      },
      k.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(i, { type: "submit", disabled: D, children: e.submitLabel }),
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
function Pr({ sections: e, current: t, title: n, description: r, primary: o, children: i }) {
  const { SettingsLayout: a } = F;
  fe();
  const l = O.usePage().props.commerce?.settingsNav ?? [];
  return rr([{ label: "Settings", href: K("settings") }, { label: "Store", href: K("commerce/settings") }, { label: n }]), /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(a, { items: l, current: "commerce-settings", children: /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ c(Ne, { title: n, description: r, primary: o }),
    /* @__PURE__ */ c(ke, { items: e, current: t, label: "Store settings" }),
    i
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
  _ as R,
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
  g as j,
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
