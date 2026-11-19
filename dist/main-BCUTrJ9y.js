const ie = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let X = ie;
function Ee(e) {
  X = { ...ie, ...e ?? {} };
}
function le(e, t = X) {
  const n = e < 0, c = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(c / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(c % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", g = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${g}` : g;
}
function me(e, t = X) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const c = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, i = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(i) || o + i === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(i.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return c ? -a : a;
}
const R = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, K = {
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
  formatMoney: le,
  parseMoney: me,
  components: {}
};
function Pe() {
  window.SunriceCommerce = K;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(K);
      } catch (c) {
        console.error("SunriceCommerceQueue call failed", c);
      }
    }
  })(), e.push = ((...n) => (n.forEach((c) => c(K)), e.length)), window.SunriceCommerceQueue = e;
}
const p = globalThis.Sunrice?.modules?.react;
if (!p)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const _e = p.Activity, De = p.Children, Le = p.Component, Me = p.Fragment, Fe = p.Profiler, Ie = p.PureComponent, Ae = p.StrictMode, Re = p.Suspense, je = p.ViewTransition, He = p.act, Oe = p.addTransitionType, Ve = p.cache, Be = p.cacheSignal, Ue = p.captureOwnerStack, ze = p.cloneElement, We = p.createContext, qe = p.createElement, Ke = p.createRef, Ge = p.forwardRef, Qe = p.isValidElement, Xe = p.lazy, Je = p.memo, Ye = p.startTransition, Ze = p.unstable_useCacheRefresh, et = p.use, tt = p.useActionState, nt = p.useCallback, rt = p.useContext, ct = p.useDebugValue, st = p.useDeferredValue, ot = p.useEffect, at = p.useEffectEvent, it = p.useId, lt = p.useImperativeHandle, mt = p.useInsertionEffect, dt = p.useLayoutEffect, ut = p.useMemo, pt = p.useOptimistic, gt = p.useReducer, Q = p.useRef, J = p.useState, ht = p.useSyncExternalStore, ft = p.useTransition, bt = p.version, yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: _e,
  Children: De,
  Component: Le,
  Fragment: Me,
  Profiler: Fe,
  PureComponent: Ie,
  StrictMode: Ae,
  Suspense: Re,
  ViewTransition: je,
  act: He,
  addTransitionType: Oe,
  cache: Ve,
  cacheSignal: Be,
  captureOwnerStack: Ue,
  cloneElement: ze,
  createContext: We,
  createElement: qe,
  createRef: Ke,
  default: p,
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
}, Symbol.toStringTag, { value: "Module" })), $ = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!$)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
$.App;
$.Deferred;
$.Form;
const St = $.Head;
$.InfiniteScroll;
const vt = $.Link;
$.WhenMounted;
$.WhenVisible;
$.config;
$.createInertiaApp;
$.http;
$.progress;
$.resetLayoutProps;
const Ct = $.router;
$.setLayoutProps;
const xt = $.useForm;
$.useFormContext;
$.useHttp;
const wt = $.usePage;
$.usePoll;
$.usePrefetch;
$.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Tt = s.Badge, Nt = s.Button, $t = s.Card, kt = s.CardContent, Et = s.CardDescription, Pt = s.CardFooter, _t = s.CardHeader, Dt = s.cardSummary, Lt = s.CardTitle, Mt = s.Checkbox, Ft = s.CodeEditor, It = s.CollapsibleCard, At = s.CollapsibleCardGroup, Rt = s.Command, jt = s.CommandEmpty, Ht = s.CommandGroup, Ot = s.CommandInput, Vt = s.CommandItem, Bt = s.CommandList, Ut = s.CommandSeparator, zt = s.DatePicker, Wt = s.DeveloperHelp, qt = s.Dialog, Kt = s.DialogContent, Gt = s.DialogDescription, Qt = s.DialogFooter, Xt = s.DialogHeader, Jt = s.DialogTitle, Yt = s.DialogTrigger, Zt = s.DropdownMenu, en = s.DropdownMenuCheckboxItem, tn = s.DropdownMenuContent, nn = s.DropdownMenuItem, rn = s.DropdownMenuLabel, cn = s.DropdownMenuSeparator, sn = s.DropdownMenuTrigger, on = s.FormSections, an = s.Input, ln = s.KeptEditsNotice, mn = s.Label, dn = s.LanguageTabs, un = s.LinkAttributes, pn = s.LinkSourcePicker, gn = s.MediaPickerInput, hn = s.moveItem, fn = s.PageHeader, bn = s.Popover, yn = s.PopoverAnchor, Sn = s.PopoverContent, vn = s.PopoverTrigger, Cn = s.registerCommandSource, xn = s.RichTextEditor, wn = s.Select, Tn = s.SelectContent, Nn = s.SelectItem, $n = s.SelectTrigger, kn = s.SelectValue, En = s.Separator, Pn = s.SettingsLayout, _n = s.SettingsNav, Dn = s.Skeleton, Ln = s.SortableHandle, Mn = s.SortableList, Fn = s.Switch, In = s.Table, An = s.TableBody, Rn = s.TableCell, jn = s.TableHead, Hn = s.TableHeader, On = s.TableRow, Vn = s.Tabs, Bn = s.TabsContent, Un = s.TabsList, zn = s.TabsTrigger, Wn = s.Textarea, qn = s.Tooltip, Kn = s.TooltipContent, Gn = s.TooltipTrigger, Qn = s.toast, Xn = s.TrashBanner, Jn = s.TrashHint, Yn = s.TrashTitle, de = s.useBreadcrumbs, Zn = s.useEditLock, er = s.useTablePreferences, tr = s.useUnsavedChanges, nr = s.ViewingNotice, ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Tt,
  Button: Nt,
  Card: $t,
  CardContent: kt,
  CardDescription: Et,
  CardFooter: Pt,
  CardHeader: _t,
  CardTitle: Lt,
  Checkbox: Mt,
  CodeEditor: Ft,
  CollapsibleCard: It,
  CollapsibleCardGroup: At,
  Command: Rt,
  CommandEmpty: jt,
  CommandGroup: Ht,
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
  SelectTrigger: $n,
  SelectValue: kn,
  Separator: En,
  SettingsLayout: Pn,
  SettingsNav: _n,
  Skeleton: Dn,
  SortableHandle: Ln,
  SortableList: Mn,
  Switch: Fn,
  Table: In,
  TableBody: An,
  TableCell: Rn,
  TableHead: jn,
  TableHeader: Hn,
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
  useBreadcrumbs: de,
  useEditLock: Zn,
  useTablePreferences: er,
  useUnsavedChanges: tr
}, Symbol.toStringTag, { value: "Module" })), ee = 3, pe = () => window.Sunrice, D = yt, I = ue, O = {
  router: Ct,
  Link: vt,
  Head: St,
  usePage: wt,
  useForm: xt
}, Mr = I.toast, rr = de;
function V(e = "") {
  return e.startsWith("/") ? e : pe().adminUrl(e);
}
async function Y(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, c = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!c.ok)
    throw new Error(`${c.status} ${c.statusText}`);
  return await c.json();
}
function cr(e) {
  const t = pe();
  if (t.version !== ee)
    throw new Error(`[commerce] This bundle was built for admin runtime ${ee}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, c] of Object.entries(e))
    t.registerPageLoader(n, c);
}
const sr = {
  "Commerce/Confirmations/Index": () => import("./Index-Bn5ouRza.js"),
  "Commerce/Customers/Show": () => import("./Show-DXGpyD1h.js"),
  "Commerce/Dashboard": () => import("./Dashboard-DXzQy_p5.js"),
  "Commerce/Inventory/Index": () => import("./Index-yFxz5U2S.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-6L6aKaRh.js"),
  "Commerce/Marketing/Report": () => import("./Report-D3g4vNUp.js"),
  "Commerce/Orders/Editor": () => import("./Editor-BhMOmgzz.js"),
  "Commerce/Orders/Show": () => import("./Show-DpzB9vZU.js"),
  "Commerce/Products/Index": () => import("./Index-gYB4oWbZ.js"),
  "Commerce/Products/Import": () => import("./Import-Bn_aICvo.js"),
  "Commerce/Reports/Show": () => import("./Show-CQz3GKSG.js"),
  "Commerce/Settings/Section": () => import("./Section-B4CPTMUk.js"),
  "Commerce/Settings/Emails": () => import("./Emails-UnmyddX9.js"),
  "Commerce/Settings/Features": () => import("./Features-D91Os0OB.js"),
  "Commerce/Settings/Payments": () => import("./Payments-C4_XVnMK.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BSOQc1R1.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-BsUYWH5K.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-BILbXRj5.js")
};
function or() {
  cr(sr);
}
const U = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!U)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const ar = U.Fragment, r = U.jsx, f = U.jsxs;
U.jsx;
function te(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (c) => String(c).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function ne(e) {
  return e ? new Date(e).toISOString() : null;
}
function ge({ value: e, onChange: t, id: n }) {
  const { Input: c, Label: o } = I, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ r(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ r(
        c,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: te(i.start),
          onChange: (a) => t({ ...i, start: ne(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ r(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ r(
        c,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: te(i.end),
          onChange: (a) => t({ ...i, end: ne(a.target.value) })
        }
      )
    ] })
  ] });
}
function ir({ field: e, id: t, value: n, errors: c, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = I, g = Array.isArray(n) ? n : [], [T, N] = D.useState({}), [C, y] = D.useState(!1), b = g.filter((d) => !T[d]).join(","), E = typeof e.config?.max == "number" ? e.config.max : null;
  D.useEffect(() => {
    if (!b) return;
    const d = new AbortController(), u = new URLSearchParams();
    return b.split(",").forEach((S) => u.append("ids[]", S)), Y(`${V("media/picker")}?${u}`, { signal: d.signal }).then(({ items: S }) => {
      d.signal.aborted || (N((h) => ({ ...h, ...Object.fromEntries(S.map((w) => [w.id, w])) })), y(!1));
    }).catch(() => {
      d.signal.aborted || y(!0);
    }), () => d.abort();
  }, [b]);
  const x = (d) => T[d]?.title || T[d]?.filename || `Image #${d}`;
  return /* @__PURE__ */ f("div", { id: t, className: "cm:grid cm:gap-3", children: [
    g.length > 0 && /* @__PURE__ */ r(l, { items: g, getId: String, getLabel: x, onReorder: o, className: "cm:grid cm:gap-2", children: (d, { handle: u }) => /* @__PURE__ */ f("div", { className: "cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2", children: [
      /* @__PURE__ */ r(m, { ...u, label: `Move ${x(d)}` }),
      T[d]?.thumbnail && /* @__PURE__ */ r("img", { src: T[d].thumbnail, alt: "", className: "cm:size-10 cm:rounded cm:object-cover" }),
      /* @__PURE__ */ r("span", { className: "cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm", children: x(d) }),
      g[0] === d && /* @__PURE__ */ r("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Cover" }),
      /* @__PURE__ */ r(
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
    (E === null || g.length < E) && /* @__PURE__ */ r(
      a,
      {
        id: t ? `${t}-picker` : void 0,
        value: null,
        multiple: !0,
        max: E === null ? null : E - g.length,
        types: ["image"],
        invalid: !!c?.[""],
        onChange: (d) => o(Array.from(/* @__PURE__ */ new Set([...g, ...d ?? []])))
      }
    ),
    C && /* @__PURE__ */ r("p", { role: "status", className: "cm:text-sm cm:text-muted-foreground", children: "Image previews could not be loaded." })
  ] });
}
function he({
  value: e,
  onChange: t,
  id: n,
  placeholder: c,
  allowNull: o = !0,
  invalid: i
}) {
  const { Input: a } = I, l = (C) => C == null ? "" : le(C).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, g] = D.useState(l(e)), [T, N] = D.useState(!1);
  return D.useEffect(() => {
    T || g(l(e));
  }, [e, T]), /* @__PURE__ */ r(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: c,
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
  const { props: e } = O.usePage(), t = e.commerce ?? {};
  return Ee(t.currency), t;
}
function be({ field: e, value: t, onChange: n, errors: c, id: o }) {
  return fe(), /* @__PURE__ */ r(
    he,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!c?.[""]
    }
  );
}
const re = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function ye(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const c = "rules" in n ? n.rules : [n];
  if (c.length === 0) return !0;
  const o = c.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(re).includes(re(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function Se(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function lr(e, t) {
  const n = {};
  for (const [c, o] of Object.entries(e))
    c === t ? n[""] = o : c.startsWith(`${t}.`) && (n[c.slice(t.length + 1)] = o);
  return n;
}
function mr(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const j = "__none", ve = "__empty", Ce = (e) => e === "" ? ve : e;
function dr(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? j : Ce(String(e));
}
function ur(e, t) {
  return e === j ? null : e === ve ? "" : t ? Number(e) : e;
}
const pr = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function Z(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => ye(n, t) && !pr.has(n.type) && !n.config?.secret).flatMap((n) => {
    const c = t[n.handle];
    if (n.type === "group") return Z(n.fields ?? [], c);
    if (n.type === "select") {
      const o = Se(n), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(c) ? c.map(i).join(", ") : c == null ? c : i(c)];
    }
    return [c];
  });
}
const ce = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], gr = { province: 1, city: 2, district: 3, village: 4 }, q = /* @__PURE__ */ new Map();
function hr(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return q.has(n) || q.set(n, Y(n).then((c) => c.data).catch(() => (q.delete(n), []))), q.get(n);
}
function xe({ field: e, value: t, onChange: n, id: c }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: g } = I, T = e.config ?? {}, N = String(T.api ?? ""), C = gr[T.depth ?? "district"] ?? 3, y = T.country_options ?? [], b = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, E = ce.slice(0, C), [x, d] = D.useState({}), u = [null, b.province_code, b.city_code, b.district_code];
  D.useEffect(() => {
    b.country !== "ID" || !N || E.forEach((h, w) => {
      const P = u[w];
      w > 0 && !P || hr(N, P).then((v) => d((k) => ({ ...k, [h.key]: v })));
    });
  }, [N, b.country, b.province_code, b.city_code, b.district_code]);
  const S = (h, w) => {
    const P = { ...b };
    P[E[h].key] = w || null, ce.slice(h + 1).forEach((v) => {
      P[v.key] = null;
    }), n(P);
  };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    y.length > 0 && /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ r(o, { htmlFor: `${c}-country`, children: "Country" }),
      /* @__PURE__ */ f(
        i,
        {
          value: b.country,
          onValueChange: (h) => n({ country: h, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ r(a, { id: `${c}-country`, className: "cm:w-full", children: /* @__PURE__ */ r(l, {}) }),
            /* @__PURE__ */ r(m, { children: y.map((h) => /* @__PURE__ */ r(g, { value: h.value, children: h.label }, h.value)) })
          ]
        }
      )
    ] }),
    b.country === "ID" && E.map((h, w) => /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ r(o, { htmlFor: `${c}-${h.key}`, children: h.label }),
      /* @__PURE__ */ f(
        i,
        {
          value: b[h.key] ?? j,
          disabled: w > 0 && !u[w],
          onValueChange: (P) => S(w, P === j ? "" : P),
          children: [
            /* @__PURE__ */ r(a, { id: `${c}-${h.key}`, className: "cm:w-full", children: /* @__PURE__ */ r(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ f(m, { children: [
              /* @__PURE__ */ r(g, { value: j, children: "Choose…" }),
              (x[h.key] ?? []).map((P) => /* @__PURE__ */ r(g, { value: P.code, children: P.name }, P.code))
            ] })
          ]
        }
      )
    ] }, h.key))
  ] });
}
function we({ field: e, value: t, onChange: n, id: c }) {
  const { Input: o, Badge: i } = I, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", g = Array.isArray(t) ? t : [], [T, N] = D.useState(""), [C, y] = D.useState([]), [b, E] = D.useState(!1);
  D.useEffect(() => {
    if (!b) return;
    const u = new URLSearchParams({ q: T });
    (a.types ?? []).forEach((h) => u.append("types[]", h)), (a.taxonomies ?? []).forEach((h) => u.append("taxonomies[]", h));
    const S = setTimeout(() => Y(`${a.api}?${u}`).then((h) => y(h.data)).catch(() => y([])), 200);
    return () => clearTimeout(S);
  }, [T, b]);
  const x = (u) => g.some((S) => S.type === u.type && S.id === u.id), d = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-2", children: [
    g.length > 0 && /* @__PURE__ */ r("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: g.map((u) => /* @__PURE__ */ f(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ f("span", { className: "cm:text-muted-foreground", children: [
        d[u.type],
        ":"
      ] }),
      " ",
      u.label,
      /* @__PURE__ */ r("button", { type: "button", "aria-label": `Remove ${u.label}`, onClick: () => n(g.filter((S) => !(S.type === u.type && S.id === u.id))), children: "×" })
    ] }, `${u.type}:${u.id}`)) }),
    /* @__PURE__ */ f("div", { className: "cm:relative", children: [
      /* @__PURE__ */ r(
        o,
        {
          id: c,
          value: T,
          placeholder: m ? "Search products…" : a.types && a.types.every((u) => u !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => E(!0),
          onBlur: () => setTimeout(() => E(!1), 150),
          onChange: (u) => N(u.target.value)
        }
      ),
      b && C.length > 0 && /* @__PURE__ */ r("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: C.map((u) => /* @__PURE__ */ r("li", { children: /* @__PURE__ */ f(
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
            /* @__PURE__ */ r("span", { children: u.label }),
            /* @__PURE__ */ r("span", { className: "cm:text-xs cm:text-muted-foreground", children: u.group })
          ]
        }
      ) }, `${u.type}:${u.id}`)) })
    ] })
  ] });
}
const fr = D.lazy(() => import("./ProductEditor-Da8KjxMR.js")), br = (e) => D.createElement(D.Suspense, { fallback: null }, D.createElement(fr, e)), yr = {
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we,
  commerce_product: br,
  commerce_gallery: ir
};
function Sr() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(yr).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const vr = D.lazy(() => import("./ChartImpl-DPGxHQJw.js"));
function Cr(e) {
  const t = /* @__PURE__ */ r("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ r(D.Suspense, { fallback: t, children: /* @__PURE__ */ r(vr, { ...e }) });
}
function xr({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ f("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ r("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ r("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ r("div", { className: "cm:mt-2", children: n })
  ] });
}
function Te(e) {
  var t, n, c = "";
  if (typeof e == "string" || typeof e == "number") c += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Te(e[t])) && (c && (c += " "), c += n);
  } else for (n in e) e[n] && (c && (c += " "), c += n);
  return c;
}
function wr() {
  for (var e, t, n = 0, c = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Te(e)) && (c && (c += " "), c += t);
  return c;
}
function H(...e) {
  return wr(e);
}
function Fr() {
  const { Card: e, CardContent: t } = I;
  return /* @__PURE__ */ r(e, { "aria-hidden": "true", children: /* @__PURE__ */ f(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ r("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ r("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ r("span", { className: "cm:h-4" })
  ] }) });
}
function Tr({ kpi: e }) {
  const { Card: t, CardContent: n } = I, { Link: c } = O, o = e.change ?? null, i = /* @__PURE__ */ f(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ r("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ r("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ f(
      "span",
      {
        className: H("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ r("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
          " ",
          Math.abs(o).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ f("span", { className: "cm:sr-only", children: [
            o > 0 ? " up" : o < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ r("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ r(t, { children: e.href ? /* @__PURE__ */ r(c, { href: V(e.href), className: "cm:block", children: i }) : i });
}
function Ne({ title: e, description: t, actions: n, primary: c, menu: o, back: i, children: a }) {
  const { Head: l } = O, { PageHeader: m } = I;
  return /* @__PURE__ */ f(ar, { children: [
    /* @__PURE__ */ r(l, { title: e }),
    /* @__PURE__ */ r(m, { title: e, description: t, actions: n, primary: c, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
const B = ue, Nr = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: be,
  commerce_datetime_range: ge,
  commerce_region: xe,
  commerce_targets: we
}, se = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function G({ fields: e, values: t, onChange: n, errors: c = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = c;
  return /* @__PURE__ */ r("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => ye(m, t ?? {})).map((m) => /* @__PURE__ */ r("div", { className: H(
    "cm:min-w-0",
    se[m.width ?? 100] ?? se[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ r(
    $r,
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
function $r({ field: e, value: t, onChange: n, path: c, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = B, l = c.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[c], g = e.instructions ? `${l}-help` : void 0, T = [g, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, N = e.label ?? e.handle, C = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ f("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? N : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ r("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: N }),
        /* @__PURE__ */ r("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      g && /* @__PURE__ */ r("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ r(oe, { field: e, value: t, onChange: n, id: l, path: c, errors: o, describedBy: T, label: N }),
    i && g && /* @__PURE__ */ r("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ r("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !C && /* @__PURE__ */ f(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      N,
      e.required && /* @__PURE__ */ r("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ r(oe, { field: e, value: t, onChange: n, id: l, path: c, errors: o, describedBy: T, label: N }),
    g && /* @__PURE__ */ r("p", { id: g, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ r("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function oe({ field: e, value: t, onChange: n, id: c, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: g, Switch: T, Label: N, MediaPickerInput: C, RichTextEditor: y, Checkbox: b, Select: E, SelectTrigger: x, SelectValue: d, SelectContent: u, SelectItem: S } = B, h = i[o] !== void 0, w = e.config ?? {}, P = Nr[e.type];
  if (P)
    return /* @__PURE__ */ r(P, { field: e, value: t, onChange: n, errors: lr(i, o), id: c, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ r(
        g,
        {
          id: c,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
          "aria-describedby": a,
          onChange: (v) => n(v.target.value)
        }
      );
    case "number":
      return /* @__PURE__ */ r(
        m,
        {
          id: c,
          type: "number",
          inputMode: "decimal",
          value: t == null ? "" : String(t),
          "aria-invalid": h,
          "aria-describedby": a,
          min: w.min,
          max: w.max,
          step: w.step ?? "any",
          onChange: (v) => n(mr(v.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ r(
        m,
        {
          id: c,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": h,
          "aria-describedby": a,
          onChange: (v) => n(v.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ r(T, { id: c, checked: t === !0, "aria-describedby": a, onCheckedChange: (v) => n(v) }),
        /* @__PURE__ */ r(N, { htmlFor: c, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const v = Se(e), k = e.type !== "select";
      if (w.multiple === !0) {
        const M = (Array.isArray(t) ? t : []).map(String), z = (_, F) => {
          const W = F ? [...M, _] : M.filter((ke) => ke !== _);
          n(k ? W.map(Number) : W);
        };
        return /* @__PURE__ */ r("div", { role: "group", "aria-labelledby": `${c}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: v.map((_) => /* @__PURE__ */ f("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ r(b, { checked: M.includes(_.value), onCheckedChange: (F) => z(_.value, F === !0) }),
          _.label
        ] }, _.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, L = dr(A, v);
      return /* @__PURE__ */ f(E, { value: L, onValueChange: (M) => n(ur(M, k)), children: [
        /* @__PURE__ */ r(x, { id: c, className: "cm:w-full", "aria-invalid": h, "aria-describedby": a, children: /* @__PURE__ */ r(d, { placeholder: "—" }) }),
        /* @__PURE__ */ f(u, { children: [
          (!e.required || L === j) && /* @__PURE__ */ r(S, { value: j, children: "—" }),
          v.map((M) => /* @__PURE__ */ r(S, { value: Ce(M.value), children: M.label }, M.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ r(
        C,
        {
          id: c,
          value: t ?? null,
          multiple: w.multiple === !0,
          max: w.max,
          invalid: h,
          types: Array.isArray(w.types) ? w.types : w.image_only ? ["image"] : void 0,
          onChange: (v) => n(v)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ r(
        y,
        {
          id: c,
          value: typeof t == "string" ? t : "",
          invalid: h,
          labelledBy: `${c}-label`,
          onChange: (v) => n(v ?? "")
        }
      );
    case "group":
      return w.per_language === !0 ? /* @__PURE__ */ r(Er, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ r(G, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (v) => n(v) });
    case "repeater":
      return /* @__PURE__ */ r(kr, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ r(
        m,
        {
          id: c,
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
function kr({ field: e, value: t, onChange: n, path: c, errors: o, label: i }) {
  const { Button: a } = B, l = Array.isArray(t) ? t : [], m = Q([]), g = Q(0);
  for (; m.current.length < l.length; ) m.current.push(g.current++);
  m.current.length = l.length;
  const [T, N] = J(() => /* @__PURE__ */ new Set()), C = (x, d) => {
    m.current = d, n(x);
  }, y = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), b = typeof e.config?.max == "number" ? e.config.max : null, E = (x, d) => x.map((u, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : u);
  return /* @__PURE__ */ f("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const u = m.current[d], S = `${c}.${d}`, h = Object.keys(o).some((_) => _ === S || _.startsWith(`${S}.`)), w = e.config?.summary_targets, P = typeof w == "string" ? x[w] : null, v = Array.isArray(P) ? P.flatMap((_) => typeof _?.label == "string" && _.label ? [_.label] : []) : [], A = (v.length > 1 ? `${v[0]} +${v.length - 1}` : v[0]) ?? B.cardSummary(Z(e.fields ?? [], x)), L = h || T.has(u) || A === "", M = () => N((_) => {
        const F = new Set(_);
        return L ? F.delete(u) : F.add(u), F;
      }), z = `${S.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ f("div", { className: H("cm:rounded-lg cm:border cm:bg-card", h && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              "aria-expanded": L,
              "aria-controls": z,
              onClick: M,
              disabled: h || A === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ r("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !L && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ f("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  d + 1,
                  "."
                ] }),
                /* @__PURE__ */ r("span", { className: "cm:truncate cm:font-medium", children: A || `New ${i.toLowerCase()}` })
              ]
            }
          ),
          /* @__PURE__ */ r(
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
          /* @__PURE__ */ r(
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
        /* @__PURE__ */ r("div", { id: z, hidden: !L, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ r(
          G,
          {
            fields: e.fields ?? [],
            values: x,
            errors: o,
            pathPrefix: S,
            onChange: (_) => C(l.map((F, W) => W === d ? _ : F), m.current)
          }
        ) })
      ] }, u);
    }),
    /* @__PURE__ */ r("div", { children: /* @__PURE__ */ f(
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
function Er({ field: e, value: t, onChange: n, path: c, errors: o }) {
  const { LanguageTabs: i } = B, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), g = (y) => Object.keys(o).some((b) => b === `${c}.${y}` || b.startsWith(`${c}.${y}.`)), [T, N] = J(() => l.find((y) => g(y.handle))?.handle ?? m), C = (y) => a[y] === null || a[y] === void 0 || a[y] === "";
  return /* @__PURE__ */ r(
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
        /* @__PURE__ */ r(
          G,
          {
            fields: l.filter((b) => b.handle === y),
            values: a,
            errors: o,
            pathPrefix: c,
            section: l.find((b) => b.handle === y)?.label ?? null,
            onChange: (b) => n(b)
          }
        )
      )
    }
  );
}
function Pr({ form: e, id: t, storageKey: n, footer: c, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: g, useUnsavedChanges: T } = I, N = I.cardSummary, { data: C, setData: y, errors: b, processing: E, isDirty: x, ...d } = O.useForm({ values: e.values }), u = D.useRef(!1), S = () => {
    u.current || (u.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      u.current = !1;
    } }));
  };
  D.useEffect(() => o?.(E), [E, o]), T(x, S);
  const h = e.fields, w = e.sections?.length ? e.sections : [{ title: null, description: null, fields: h.map((k) => k.handle) }], P = Object.keys(b), v = (k, A = null) => /* @__PURE__ */ r(
    G,
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
    b.section && /* @__PURE__ */ r("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: b.section }),
    /* @__PURE__ */ r(g, { className: "cm:gap-6", children: w.map((k, A) => k.title === null ? /* @__PURE__ */ r(a, { children: /* @__PURE__ */ r(l, { children: v(k.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ r(
      m,
      {
        title: k.title,
        description: k.description ?? void 0,
        summary: N(Z(h.filter((L) => k.fields.includes(L.handle)), C.values)) || void 0,
        storageKey: n ? `${n}:${k.title}` : void 0,
        hasErrors: k.fields.some((L) => P.some((M) => M === `values.${L}` || M.startsWith(`values.${L}.`))),
        children: v(k.fields, k.title)
      },
      k.title
    )) }),
    (t === void 0 || c) && /* @__PURE__ */ f("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ r(i, { type: "submit", disabled: E, children: e.submitLabel }),
      c
    ] })
  ] });
}
function $e({ items: e, current: t, label: n = "Sections" }) {
  const { Link: c } = O;
  return /* @__PURE__ */ r("nav", { "aria-label": n, className: "cm:-mb-2 cm:flex cm:gap-1 cm:overflow-x-auto cm:border-b", children: e.map((o) => /* @__PURE__ */ r(
    c,
    {
      href: V(o.href),
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
function _r({ sections: e, current: t, title: n, description: c, primary: o, children: i }) {
  const { SettingsLayout: a } = I;
  fe();
  const l = O.usePage().props.commerce?.settingsNav ?? [];
  return rr([{ label: "Settings", href: V("settings") }, { label: "Store", href: V("commerce/settings") }, { label: n }]), /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(a, { items: l, current: "commerce-settings", children: /* @__PURE__ */ f("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ r(Ne, { title: n, description: c, primary: o }),
    /* @__PURE__ */ r($e, { items: e, current: t, label: "Store settings" }),
    i
  ] }) }) });
}
const ae = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Dr({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ r("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", ae[e] ?? ae.neutral), children: t });
}
function Lr() {
  Object.assign(K.components, { Chart: Cr, EmptyState: xr, KpiCard: Tr, MoneyInput: he, PageHeader: Ne, SchemaFormView: Pr, SectionNav: $e, SettingsLayout: _r, StatusBadge: Dr });
}
Pe();
Lr();
Sr();
or();
export {
  ze as A,
  yt as B,
  Cr as C,
  ut as D,
  xr as E,
  ar as F,
  Q as G,
  nt as H,
  ot as I,
  lt as J,
  Fr as K,
  dt as L,
  he as M,
  Je as N,
  De as O,
  Ne as P,
  Le as Q,
  D as R,
  Dr as S,
  we as T,
  ue as U,
  Ie as V,
  rr as a,
  V as b,
  r as c,
  I as d,
  K as e,
  Tr as f,
  le as g,
  Y as h,
  O as i,
  f as j,
  G as k,
  xe as l,
  H as m,
  _r as n,
  Pr as o,
  J as p,
  Me as q,
  er as r,
  Qe as s,
  Mr as t,
  fe as u,
  Ge as v,
  wr as w,
  qe as x,
  rt as y,
  We as z
};
