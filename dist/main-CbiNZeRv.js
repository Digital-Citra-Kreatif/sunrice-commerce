const le = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let K = le;
function Ee(e) {
  K = { ...le, ...e ?? {} };
}
function J(e, t = K) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", g = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${g}` : g;
}
const Pe = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 2 });
function Fr(e, t = K) {
  const n = Math.abs(e) / 10 ** t.decimals;
  if (n < 1e3)
    return J(e, t);
  const r = Pe.format(n), o = t.space ? " " : "";
  return (e < 0 ? "-" : "") + (t.position === "left" ? `${t.symbol}${o}${r}` : `${r}${o}${t.symbol}`);
}
function me(e, t = K) {
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
  formatMoney: J,
  parseMoney: me,
  components: {}
};
function _e() {
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
const p = globalThis.Sunrice?.modules?.react;
if (!p)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const De = p.Activity, Le = p.Children, Me = p.Component, Fe = p.Fragment, Ie = p.Profiler, Ae = p.PureComponent, Re = p.StrictMode, je = p.Suspense, He = p.ViewTransition, Oe = p.act, Ve = p.addTransitionType, Be = p.cache, Ue = p.cacheSignal, ze = p.captureOwnerStack, We = p.cloneElement, qe = p.createContext, Ke = p.createElement, Ge = p.createRef, Qe = p.forwardRef, Xe = p.isValidElement, Je = p.lazy, Ye = p.memo, Ze = p.startTransition, et = p.unstable_useCacheRefresh, tt = p.use, nt = p.useActionState, rt = p.useCallback, ct = p.useContext, st = p.useDebugValue, ot = p.useDeferredValue, at = p.useEffect, it = p.useEffectEvent, lt = p.useId, mt = p.useImperativeHandle, dt = p.useInsertionEffect, ut = p.useLayoutEffect, pt = p.useMemo, gt = p.useOptimistic, ht = p.useReducer, X = p.useRef, Y = p.useState, ft = p.useSyncExternalStore, bt = p.useTransition, yt = p.version, St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: De,
  Children: Le,
  Component: Me,
  Fragment: Fe,
  Profiler: Ie,
  PureComponent: Ae,
  StrictMode: Re,
  Suspense: je,
  ViewTransition: He,
  act: Oe,
  addTransitionType: Ve,
  cache: Be,
  cacheSignal: Ue,
  captureOwnerStack: ze,
  cloneElement: We,
  createContext: qe,
  createElement: Ke,
  createRef: Ge,
  default: p,
  forwardRef: Qe,
  isValidElement: Xe,
  lazy: Je,
  memo: Ye,
  startTransition: Ze,
  unstable_useCacheRefresh: et,
  use: tt,
  useActionState: nt,
  useCallback: rt,
  useContext: ct,
  useDebugValue: st,
  useDeferredValue: ot,
  useEffect: at,
  useEffectEvent: it,
  useId: lt,
  useImperativeHandle: mt,
  useInsertionEffect: dt,
  useLayoutEffect: ut,
  useMemo: pt,
  useOptimistic: gt,
  useReducer: ht,
  useRef: X,
  useState: Y,
  useSyncExternalStore: ft,
  useTransition: bt,
  version: yt
}, Symbol.toStringTag, { value: "Module" })), $ = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!$)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
$.App;
$.Deferred;
$.Form;
const vt = $.Head;
$.InfiniteScroll;
const Ct = $.Link;
$.WhenMounted;
$.WhenVisible;
$.config;
$.createInertiaApp;
$.http;
$.progress;
$.resetLayoutProps;
const xt = $.router;
$.setLayoutProps;
const wt = $.useForm;
$.useFormContext;
$.useHttp;
const Tt = $.usePage;
$.usePoll;
$.usePrefetch;
$.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Nt = s.Badge, $t = s.Button, kt = s.Card, Et = s.CardContent, Pt = s.CardDescription, _t = s.CardFooter, Dt = s.CardHeader, Lt = s.cardSummary, Mt = s.CardTitle, Ft = s.Checkbox, It = s.CodeEditor, At = s.CollapsibleCard, Rt = s.CollapsibleCardGroup, jt = s.Command, Ht = s.CommandEmpty, Ot = s.CommandGroup, Vt = s.CommandInput, Bt = s.CommandItem, Ut = s.CommandList, zt = s.CommandSeparator, Wt = s.DatePicker, qt = s.DeveloperHelp, Kt = s.Dialog, Gt = s.DialogContent, Qt = s.DialogDescription, Xt = s.DialogFooter, Jt = s.DialogHeader, Yt = s.DialogTitle, Zt = s.DialogTrigger, en = s.DropdownMenu, tn = s.DropdownMenuCheckboxItem, nn = s.DropdownMenuContent, rn = s.DropdownMenuItem, cn = s.DropdownMenuLabel, sn = s.DropdownMenuSeparator, on = s.DropdownMenuTrigger, an = s.FormSections, ln = s.Input, mn = s.KeptEditsNotice, dn = s.Label, un = s.LanguageTabs, pn = s.LinkAttributes, gn = s.LinkSourcePicker, hn = s.MediaPickerInput, fn = s.moveItem, bn = s.PageHeader, yn = s.Popover, Sn = s.PopoverAnchor, vn = s.PopoverContent, Cn = s.PopoverTrigger, xn = s.registerCommandSource, wn = s.RichTextEditor, Tn = s.Select, Nn = s.SelectContent, $n = s.SelectItem, kn = s.SelectTrigger, En = s.SelectValue, Pn = s.Separator, _n = s.SettingsLayout, Dn = s.SettingsNav, Ln = s.Skeleton, Mn = s.SortableHandle, Fn = s.SortableList, In = s.Switch, An = s.Table, Rn = s.TableBody, jn = s.TableCell, Hn = s.TableHead, On = s.TableHeader, Vn = s.TableRow, Bn = s.Tabs, Un = s.TabsContent, zn = s.TabsList, Wn = s.TabsTrigger, qn = s.Textarea, Kn = s.Tooltip, Gn = s.TooltipContent, Qn = s.TooltipTrigger, Xn = s.toast, Jn = s.TrashBanner, Yn = s.TrashHint, Zn = s.TrashTitle, de = s.useBreadcrumbs, er = s.useEditLock, tr = s.useTablePreferences, nr = s.useUnsavedChanges, rr = s.ViewingNotice, ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Nt,
  Button: $t,
  Card: kt,
  CardContent: Et,
  CardDescription: Pt,
  CardFooter: _t,
  CardHeader: Dt,
  CardTitle: Mt,
  Checkbox: Ft,
  CodeEditor: It,
  CollapsibleCard: At,
  CollapsibleCardGroup: Rt,
  Command: jt,
  CommandEmpty: Ht,
  CommandGroup: Ot,
  CommandInput: Vt,
  CommandItem: Bt,
  CommandList: Ut,
  CommandSeparator: zt,
  DatePicker: Wt,
  DeveloperHelp: qt,
  Dialog: Kt,
  DialogContent: Gt,
  DialogDescription: Qt,
  DialogFooter: Xt,
  DialogHeader: Jt,
  DialogTitle: Yt,
  DialogTrigger: Zt,
  DropdownMenu: en,
  DropdownMenuCheckboxItem: tn,
  DropdownMenuContent: nn,
  DropdownMenuItem: rn,
  DropdownMenuLabel: cn,
  DropdownMenuSeparator: sn,
  DropdownMenuTrigger: on,
  FormSections: an,
  Input: ln,
  KeptEditsNotice: mn,
  Label: dn,
  LanguageTabs: un,
  LinkAttributes: pn,
  LinkSourcePicker: gn,
  MediaPickerInput: hn,
  PageHeader: bn,
  Popover: yn,
  PopoverAnchor: Sn,
  PopoverContent: vn,
  PopoverTrigger: Cn,
  RichTextEditor: wn,
  Select: Tn,
  SelectContent: Nn,
  SelectItem: $n,
  SelectTrigger: kn,
  SelectValue: En,
  Separator: Pn,
  SettingsLayout: _n,
  SettingsNav: Dn,
  Skeleton: Ln,
  SortableHandle: Mn,
  SortableList: Fn,
  Switch: In,
  Table: An,
  TableBody: Rn,
  TableCell: jn,
  TableHead: Hn,
  TableHeader: On,
  TableRow: Vn,
  Tabs: Bn,
  TabsContent: Un,
  TabsList: zn,
  TabsTrigger: Wn,
  Textarea: qn,
  Tooltip: Kn,
  TooltipContent: Gn,
  TooltipTrigger: Qn,
  TrashBanner: Jn,
  TrashHint: Yn,
  TrashTitle: Zn,
  ViewingNotice: rr,
  cardSummary: Lt,
  moveItem: fn,
  registerCommandSource: xn,
  toast: Xn,
  useBreadcrumbs: de,
  useEditLock: er,
  useTablePreferences: tr,
  useUnsavedChanges: nr
}, Symbol.toStringTag, { value: "Module" })), te = 3, pe = () => window.Sunrice, D = St, I = ue, V = {
  router: xt,
  Link: Ct,
  Head: vt,
  usePage: Tt,
  useForm: wt
}, Ir = I.toast, cr = de;
function G(e = "") {
  return e.startsWith("/") ? e : pe().adminUrl(e);
}
async function Z(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function sr(e) {
  const t = pe();
  if (t.version !== te)
    throw new Error(`[commerce] This bundle was built for admin runtime ${te}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const or = {
  "Commerce/Confirmations/Index": () => import("./Index-CZVxzIzA.js"),
  "Commerce/Customers/Show": () => import("./Show-DQeTrJg6.js"),
  "Commerce/Dashboard": () => import("./Dashboard-B0m65AoC.js"),
  "Commerce/Inventory/Index": () => import("./Index-DlnJGguw.js"),
  "Commerce/Loyalty/Show": () => import("./Show-rtI46KL3.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-CP3tST0A.js"),
  "Commerce/Marketing/Report": () => import("./Report-DRyHsS13.js"),
  "Commerce/Orders/Editor": () => import("./Editor-BVHHG8rG.js"),
  "Commerce/Orders/Show": () => import("./Show-CczmtK1S.js"),
  "Commerce/Products/Index": () => import("./Index-CtkMuJuJ.js"),
  "Commerce/Products/Import": () => import("./Import-DoFCZ2lv.js"),
  "Commerce/Reports/Show": () => import("./Show-CrMhDPjl.js"),
  "Commerce/Settings/Section": () => import("./Section-R_u3M9YR.js"),
  "Commerce/Settings/Emails": () => import("./Emails-D3etNwg5.js"),
  "Commerce/Settings/Features": () => import("./Features-C6Rf9pfr.js"),
  "Commerce/Settings/Payments": () => import("./Payments-BjEfwzCP.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-DwgqsaPQ.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-_md4Rtt7.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-B0eEk3_z.js")
};
function ar() {
  sr(or);
}
const B = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!B)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ir = B.Fragment, c = B.jsx, f = B.jsxs;
B.jsx;
function ne(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function re(e) {
  return e ? new Date(e).toISOString() : null;
}
function ge({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = I, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: ne(i.start),
          onChange: (a) => t({ ...i, start: re(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: ne(i.end),
          onChange: (a) => t({ ...i, end: re(a.target.value) })
        }
      )
    ] })
  ] });
}
function lr({ field: e, id: t, value: n, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = I, g = Array.isArray(n) ? n : [], [T, N] = D.useState({}), [C, y] = D.useState(!1), b = g.filter((d) => !T[d]).join(","), E = typeof e.config?.max == "number" ? e.config.max : null;
  D.useEffect(() => {
    if (!b) return;
    const d = new AbortController(), u = new URLSearchParams();
    return b.split(",").forEach((S) => u.append("ids[]", S)), Z(`${G("media/picker")}?${u}`, { signal: d.signal }).then(({ items: S }) => {
      d.signal.aborted || (N((h) => ({ ...h, ...Object.fromEntries(S.map((w) => [w.id, w])) })), y(!1));
    }).catch(() => {
      d.signal.aborted || y(!0);
    }), () => d.abort();
  }, [b]);
  const x = (d) => T[d]?.title || T[d]?.filename || `Image #${d}`;
  return /* @__PURE__ */ f("div", { id: t, className: "cm:grid cm:gap-3", children: [
    g.length > 0 && /* @__PURE__ */ c(l, { items: g, getId: String, getLabel: x, onReorder: o, className: "cm:grid cm:gap-2", children: (d, { handle: u }) => /* @__PURE__ */ f("div", { className: "cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2", children: [
      /* @__PURE__ */ c(m, { ...u, label: `Move ${x(d)}` }),
      T[d]?.thumbnail && /* @__PURE__ */ c("img", { src: T[d].thumbnail, alt: "", className: "cm:size-10 cm:rounded cm:object-cover" }),
      /* @__PURE__ */ c("span", { className: "cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm", children: x(d) }),
      g[0] === d && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Cover" }),
      /* @__PURE__ */ c(
        i,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-label": `Remove ${x(d)}`,
          onClick: () => o(g.filter((S) => S !== d)),
          children: "Remove"
        }
      )
    ] }) }),
    (E === null || g.length < E) && /* @__PURE__ */ c(
      a,
      {
        id: t ? `${t}-picker` : void 0,
        value: null,
        multiple: !0,
        max: E === null ? null : E - g.length,
        types: ["image"],
        invalid: !!r?.[""],
        onChange: (d) => o(Array.from(/* @__PURE__ */ new Set([...g, ...d ?? []])))
      }
    ),
    C && /* @__PURE__ */ c("p", { role: "status", className: "cm:text-sm cm:text-muted-foreground", children: "Image previews could not be loaded." })
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
  const { Input: a } = I, l = (C) => C == null ? "" : J(C).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, g] = D.useState(l(e)), [T, N] = D.useState(!1);
  return D.useEffect(() => {
    T || g(l(e));
  }, [e, T]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => N(!0),
      onChange: (C) => {
        g(C.target.value);
        const y = C.target.value.trim() === "" ? o ? null : 0 : me(C.target.value);
        (y !== null || C.target.value.trim() === "") && t(y);
      },
      onBlur: () => {
        N(!1), g(l(e));
      }
    }
  );
}
function fe() {
  const { props: e } = V.usePage(), t = e.commerce ?? {};
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
const ce = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function ye(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const r = "rules" in n ? n.rules : [n];
  if (r.length === 0) return !0;
  const o = r.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(ce).includes(ce(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function Se(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function mr(e, t) {
  const n = {};
  for (const [r, o] of Object.entries(e))
    r === t ? n[""] = o : r.startsWith(`${t}.`) && (n[r.slice(t.length + 1)] = o);
  return n;
}
function dr(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const j = "__none", ve = "__empty", Ce = (e) => e === "" ? ve : e;
function ur(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? j : Ce(String(e));
}
function pr(e, t) {
  return e === j ? null : e === ve ? "" : t ? Number(e) : e;
}
const gr = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function ee(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => ye(n, t) && !gr.has(n.type) && !n.config?.secret).flatMap((n) => {
    const r = t[n.handle];
    if (n.type === "group") return ee(n.fields ?? [], r);
    if (n.type === "select") {
      const o = Se(n), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(i).join(", ") : r == null ? r : i(r)];
    }
    return [r];
  });
}
const se = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], hr = { province: 1, city: 2, district: 3, village: 4 }, W = /* @__PURE__ */ new Map();
function fr(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return W.has(n) || W.set(n, Z(n).then((r) => r.data).catch(() => (W.delete(n), []))), W.get(n);
}
function xe({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: g } = I, T = e.config ?? {}, N = String(T.api ?? ""), C = hr[T.depth ?? "district"] ?? 3, y = T.country_options ?? [], b = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, E = se.slice(0, C), [x, d] = D.useState({}), u = [null, b.province_code, b.city_code, b.district_code];
  D.useEffect(() => {
    b.country !== "ID" || !N || E.forEach((h, w) => {
      const P = u[w];
      w > 0 && !P || fr(N, P).then((v) => d((k) => ({ ...k, [h.key]: v })));
    });
  }, [N, b.country, b.province_code, b.city_code, b.district_code]);
  const S = (h, w) => {
    const P = { ...b };
    P[E[h].key] = w || null, se.slice(h + 1).forEach((v) => {
      P[v.key] = null;
    }), n(P);
  };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    y.length > 0 && /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ f(
        i,
        {
          value: b.country,
          onValueChange: (h) => n({ country: h, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ c(l, {}) }),
            /* @__PURE__ */ c(m, { children: y.map((h) => /* @__PURE__ */ c(g, { value: h.value, children: h.label }, h.value)) })
          ]
        }
      )
    ] }),
    b.country === "ID" && E.map((h, w) => /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${h.key}`, children: h.label }),
      /* @__PURE__ */ f(
        i,
        {
          value: b[h.key] ?? j,
          disabled: w > 0 && !u[w],
          onValueChange: (P) => S(w, P === j ? "" : P),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${h.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ f(m, { children: [
              /* @__PURE__ */ c(g, { value: j, children: "Choose…" }),
              (x[h.key] ?? []).map((P) => /* @__PURE__ */ c(g, { value: P.code, children: P.name }, P.code))
            ] })
          ]
        }
      )
    ] }, h.key))
  ] });
}
function we({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = I, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", g = Array.isArray(t) ? t : [], [T, N] = D.useState(""), [C, y] = D.useState([]), [b, E] = D.useState(!1);
  D.useEffect(() => {
    if (!b) return;
    const u = new URLSearchParams({ q: T });
    (a.types ?? []).forEach((h) => u.append("types[]", h)), (a.taxonomies ?? []).forEach((h) => u.append("taxonomies[]", h));
    const S = setTimeout(() => Z(`${a.api}?${u}`).then((h) => y(h.data)).catch(() => y([])), 200);
    return () => clearTimeout(S);
  }, [T, b]);
  const x = (u) => g.some((S) => S.type === u.type && S.id === u.id), d = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-2", children: [
    g.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: g.map((u) => /* @__PURE__ */ f(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ f("span", { className: "cm:text-muted-foreground", children: [
        d[u.type],
        ":"
      ] }),
      " ",
      u.label,
      /* @__PURE__ */ c("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n(g.filter((S) => !(S.type === u.type && S.id === u.id))), children: "×" })
    ] }, `${u.type}:${u.id}`)) }),
    /* @__PURE__ */ f("div", { className: "cm:relative", children: [
      /* @__PURE__ */ c(
        o,
        {
          id: r,
          value: T,
          placeholder: m ? "Search products…" : a.types && a.types.every((u) => u !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => E(!0),
          onBlur: () => setTimeout(() => E(!1), 150),
          onChange: (u) => N(u.target.value)
        }
      ),
      b && C.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((u) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          disabled: x(u),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (S) => S.preventDefault(),
          onClick: () => {
            const S = { type: u.type, id: u.id, label: u.label };
            n(l ? [S] : [...g, S]), N(""), l && E(!1);
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
const br = D.lazy(() => import("./ProductEditor-vgmoohcK.js")), yr = (e) => D.createElement(D.Suspense, { fallback: null }, D.createElement(br, e)), Sr = {
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we,
  commerce_product: yr,
  commerce_gallery: lr
};
function vr() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Sr).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Cr = D.lazy(() => import("./ChartImpl-DXOTNgOA.js"));
function xr(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(D.Suspense, { fallback: t, children: /* @__PURE__ */ c(Cr, { ...e }) });
}
function wr({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ f("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
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
function Tr() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Te(e)) && (r && (r += " "), r += t);
  return r;
}
function H(...e) {
  return Tr(e);
}
function Ar({ className: e }) {
  const { Card: t, CardContent: n } = I;
  return /* @__PURE__ */ c(t, { "aria-hidden": "true", className: e, children: /* @__PURE__ */ f(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function Nr({ kpi: e, className: t }) {
  const { Card: n, CardContent: r } = I, { Link: o } = V, i = e.change ?? null, a = /* @__PURE__ */ f(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    i !== null && /* @__PURE__ */ f(
      "span",
      {
        className: H("cm:text-xs cm:font-medium", i > 0 ? "cm:text-emerald-600" : i < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ c("span", { "aria-hidden": !0, children: i > 0 ? "▲" : i < 0 ? "▼" : "•" }),
          " ",
          Math.abs(i).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ f("span", { className: "cm:sr-only", children: [
            i > 0 ? " up" : i < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ c(n, { className: t, children: e.href ? /* @__PURE__ */ c(o, { href: G(e.href), className: "cm:block", children: a }) : a });
}
function Ne({ title: e, description: t, actions: n, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = V, { PageHeader: m } = I;
  return /* @__PURE__ */ f(ir, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
const O = ue, $r = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we
}, oe = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function Q({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = r;
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => ye(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: H(
    "cm:min-w-0",
    oe[m.width ?? 100] ?? oe[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    kr,
    {
      field: m,
      value: t?.[m.handle],
      path: `${o}.${m.handle}`,
      errors: l,
      hideLabel: !!i && m.label === i,
      onChange: (g) => n({ ...t, [m.handle]: g })
    }
  ) }, m.handle)) });
}
function kr({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = O, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], g = e.instructions ? `${l}-help` : void 0, T = [g, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, N = e.label ?? e.handle, C = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ f("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? N : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: N }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      g && /* @__PURE__ */ c("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(ae, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: N }),
    i && g && /* @__PURE__ */ c("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !C && /* @__PURE__ */ f(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      N,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(ae, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: N }),
    g && /* @__PURE__ */ c("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function ae({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: g, Switch: T, Label: N, MediaPickerInput: C, RichTextEditor: y, Checkbox: b, Select: E, SelectTrigger: x, SelectValue: d, SelectContent: u, SelectItem: S } = O, h = i[o] !== void 0, w = e.config ?? {}, P = $r[e.type];
  if (P)
    return /* @__PURE__ */ c(P, { field: e, value: t, onChange: n, errors: mr(i, o), id: r, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ c(
        g,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
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
          "aria-invalid": h,
          "aria-describedby": a,
          min: w.min,
          max: w.max,
          step: w.step ?? "any",
          onChange: (v) => n(dr(v.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
          "aria-describedby": a,
          onChange: (v) => n(v.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c(T, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (v) => n(v) }),
        /* @__PURE__ */ c(N, { htmlFor: r, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const v = Se(e), k = e.type !== "select";
      if (w.multiple === !0) {
        const M = (Array.isArray(t) ? t : []).map(String), U = (_, F) => {
          const z = F ? [...M, _] : M.filter((ke) => ke !== _);
          n(k ? z.map(Number) : z);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: v.map((_) => /* @__PURE__ */ f("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(b, { checked: M.includes(_.value), onCheckedChange: (F) => U(_.value, F === !0) }),
          _.label
        ] }, _.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, L = ur(A, v);
      return /* @__PURE__ */ f(E, { value: L, onValueChange: (M) => n(pr(M, k)), children: [
        /* @__PURE__ */ c(x, { id: r, className: "cm:w-full", "aria-invalid": h, "aria-describedby": a, children: /* @__PURE__ */ c(d, { placeholder: "—" }) }),
        /* @__PURE__ */ f(u, { children: [
          (!e.required || L === j) && /* @__PURE__ */ c(S, { value: j, children: "—" }),
          v.map((M) => /* @__PURE__ */ c(S, { value: Ce(M.value), children: M.label }, M.value))
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
          multiple: w.multiple === !0,
          max: w.max,
          invalid: h,
          types: Array.isArray(w.types) ? w.types : w.image_only ? ["image"] : void 0,
          onChange: (v) => n(v)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ c(
        y,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: h,
          labelledBy: `${r}-label`,
          onChange: (v) => n(v ?? "")
        }
      );
    case "group":
      return w.per_language === !0 ? /* @__PURE__ */ c(Pr, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(Q, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (v) => n(v) });
    case "repeater":
      return /* @__PURE__ */ c(Er, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": h,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: w.placeholder,
          onChange: (v) => n(v.target.value)
        }
      );
  }
}
function Er({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = O, l = Array.isArray(t) ? t : [], m = X([]), g = X(0);
  for (; m.current.length < l.length; ) m.current.push(g.current++);
  m.current.length = l.length;
  const [T, N] = Y(() => /* @__PURE__ */ new Set()), C = (x, d) => {
    m.current = d, n(x);
  }, y = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), b = typeof e.config?.max == "number" ? e.config.max : null, E = (x, d) => x.map((u, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : u);
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const u = m.current[d], S = `${r}.${d}`, h = Object.keys(o).some((_) => _ === S || _.startsWith(`${S}.`)), w = e.config?.summary_targets, P = typeof w == "string" ? x[w] : null, v = Array.isArray(P) ? P.flatMap((_) => typeof _?.label == "string" && _.label ? [_.label] : []) : [], A = (v.length > 1 ? `${v[0]} +${v.length - 1}` : v[0]) ?? O.cardSummary(ee(e.fields ?? [], x)), L = h || T.has(u) || A === "", M = () => N((_) => {
        const F = new Set(_);
        return L ? F.delete(u) : F.add(u), F;
      }), U = `${S.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ f("div", { className: H("cm:rounded-lg cm:border cm:bg-card", h && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              "aria-expanded": L,
              "aria-controls": U,
              onClick: M,
              disabled: h || A === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !L && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ f("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  d + 1,
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
              disabled: d === 0,
              "aria-label": `Move ${d + 1} up`,
              onClick: () => C(E(l, d), E(m.current, d)),
              children: "Move up"
            }
          ),
          /* @__PURE__ */ c(
            a,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              "aria-label": `Remove ${d + 1}`,
              onClick: () => C(l.filter((_, F) => F !== d), m.current.filter((_, F) => F !== d)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: U, hidden: !L, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          Q,
          {
            fields: e.fields ?? [],
            values: x,
            errors: o,
            pathPrefix: S,
            onChange: (_) => C(l.map((F, z) => z === d ? _ : F), m.current)
          }
        ) })
      ] }, u);
    }),
    /* @__PURE__ */ c("div", { children: /* @__PURE__ */ f(
      a,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: b !== null && l.length >= b,
        onClick: () => {
          const x = g.current++;
          N((d) => new Set(d).add(x)), C([...l, y()], [...m.current, x]);
        },
        children: [
          "Add ",
          i.toLowerCase()
        ]
      }
    ) })
  ] });
}
function Pr({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = O, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), g = (y) => Object.keys(o).some((b) => b === `${r}.${y}` || b.startsWith(`${r}.${y}.`)), [T, N] = Y(() => l.find((y) => g(y.handle))?.handle ?? m), C = (y) => a[y] === null || a[y] === void 0 || a[y] === "";
  return /* @__PURE__ */ c(
    i,
    {
      value: T,
      onValueChange: N,
      label: e.label,
      languages: l.map((y) => ({
        code: y.handle,
        name: y.label,
        main: y.handle === m,
        missing: y.handle !== m && C(y.handle),
        status: g(y.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (y) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          Q,
          {
            fields: l.filter((b) => b.handle === y),
            values: a,
            errors: o,
            pathPrefix: r,
            section: l.find((b) => b.handle === y)?.label ?? null,
            onChange: (b) => n(b)
          }
        )
      )
    }
  );
}
function _r({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: g, useUnsavedChanges: T } = I, N = I.cardSummary, { data: C, setData: y, errors: b, processing: E, isDirty: x, ...d } = V.useForm({ values: e.values }), u = D.useRef(!1), S = () => {
    u.current || (u.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      u.current = !1;
    } }));
  };
  D.useEffect(() => o?.(E), [E, o]), T(x, S);
  const h = e.fields, w = e.sections?.length ? e.sections : [{ title: null, description: null, fields: h.map((k) => k.handle) }], P = Object.keys(b), v = (k, A = null) => /* @__PURE__ */ c(
    Q,
    {
      fields: h.filter((L) => k.includes(L.handle)),
      values: C.values,
      errors: b,
      pathPrefix: "values",
      section: A,
      onChange: (L) => y("values", L)
    }
  );
  return /* @__PURE__ */ f("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (k) => {
    k.preventDefault(), S();
  }, children: [
    b.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: b.section }),
    /* @__PURE__ */ c(g, { className: "cm:gap-6", children: w.map((k, A) => k.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(l, { children: v(k.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ c(
      m,
      {
        title: k.title,
        description: k.description ?? void 0,
        summary: N(ee(h.filter((L) => k.fields.includes(L.handle)), C.values)) || void 0,
        storageKey: n ? `${n}:${k.title}` : void 0,
        hasErrors: k.fields.some((L) => P.some((M) => M === `values.${L}` || M.startsWith(`values.${L}.`))),
        children: v(k.fields, k.title)
      },
      k.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(i, { type: "submit", disabled: E, children: e.submitLabel }),
      r
    ] })
  ] });
}
function $e({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = V;
  return /* @__PURE__ */ c("nav", { "aria-label": n, className: "cm:grid cm:gap-1 cm:max-lg:grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))]", children: e.map((o) => /* @__PURE__ */ c(
    r,
    {
      href: G(o.href),
      "aria-current": o.key === t ? "page" : void 0,
      className: H(
        "cm:flex cm:min-h-10 cm:items-center cm:rounded-md cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:bg-muted cm:hover:text-foreground",
        o.key === t && "cm:bg-muted cm:font-semibold cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function Dr({ sections: e, current: t, title: n, description: r, primary: o, children: i }) {
  return fe(), cr([{ label: "Shop" }, { label: "Store settings", href: G("commerce/settings") }, { label: n }]), /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ c($e, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ f("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
      /* @__PURE__ */ c(Ne, { title: n, description: r, primary: o }),
      i
    ] })
  ] });
}
const ie = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Lr({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ie[e] ?? ie.neutral), children: t });
}
function Mr() {
  Object.assign(q.components, { Chart: xr, EmptyState: wr, KpiCard: Nr, MoneyInput: he, PageHeader: Ne, SchemaFormView: _r, SectionNav: $e, SettingsLayout: Dr, StatusBadge: Lr });
}
_e();
Mr();
vr();
ar();
export {
  qe as A,
  We as B,
  xr as C,
  St as D,
  wr as E,
  ir as F,
  pt as G,
  X as H,
  rt as I,
  at as J,
  Ar as K,
  mt as L,
  he as M,
  ut as N,
  Ye as O,
  Ne as P,
  Le as Q,
  D as R,
  Lr as S,
  we as T,
  ue as U,
  Me as V,
  Ae as W,
  G as a,
  c as b,
  I as c,
  fe as d,
  q as e,
  Nr as f,
  J as g,
  Fr as h,
  V as i,
  f as j,
  Z as k,
  _r as l,
  Q as m,
  xe as n,
  H as o,
  Dr as p,
  Y as q,
  Fe as r,
  tr as s,
  Ir as t,
  cr as u,
  Xe as v,
  Qe as w,
  Tr as x,
  Ke as y,
  ct as z
};
