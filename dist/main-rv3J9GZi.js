const ue = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let X = ue;
function _e(e) {
  X = { ...ue, ...e ?? {} };
}
function J(e, t = X) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", f = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${f}` : f;
}
const Ie = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 2 });
function Bc(e, t = X) {
  const n = Math.abs(e) / 10 ** t.decimals;
  if (n < 1e3)
    return J(e, t);
  const r = Ie.format(n), o = t.space ? " " : "";
  return (e < 0 ? "-" : "") + (t.position === "left" ? `${t.symbol}${o}${r}` : `${r}${o}${t.symbol}`);
}
function pe(e, t = X) {
  let n = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = n.startsWith("-");
  n = n.replace(/^-/, "").split(t.thousands).join("");
  const [o, i = ""] = n.split(t.decimal);
  if (!/^\d*$/.test(o) || !/^\d*$/.test(i) || o + i === "")
    return null;
  const a = Number(o || "0") * 10 ** t.decimals + Number(i.padEnd(t.decimals, "0").slice(0, t.decimals) || "0");
  return r ? -a : a;
}
const H = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, Q = {
  version: 1,
  registerOrderPanel: (e, t) => {
    H.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    H.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    H.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    H.productTabs[e] = t;
  },
  orderPanels: () => H.orderPanels,
  dashboardWidgets: () => H.dashboardWidgets,
  settingsSections: () => H.settingsSections,
  productTabs: () => H.productTabs,
  formatMoney: J,
  parseMoney: pe,
  components: {}
};
function De() {
  window.SunriceCommerce = Q;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(Q);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r(Q)), e.length)), window.SunriceCommerceQueue = e;
}
const y = globalThis.Sunrice?.modules?.react;
if (!y)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Ae = y.Activity, Fe = y.Children, Re = y.Component, je = y.Fragment, Oe = y.Profiler, He = y.PureComponent, Ve = y.StrictMode, Ue = y.Suspense, ze = y.ViewTransition, Be = y.act, We = y.addTransitionType, qe = y.cache, Ke = y.cacheSignal, Ge = y.captureOwnerStack, Qe = y.cloneElement, Xe = y.createContext, Ye = y.createElement, Ze = y.createRef, Je = y.forwardRef, et = y.isValidElement, tt = y.lazy, nt = y.memo, ct = y.startTransition, rt = y.unstable_useCacheRefresh, st = y.use, ot = y.useActionState, at = y.useCallback, it = y.useContext, lt = y.useDebugValue, mt = y.useDeferredValue, dt = y.useEffect, ut = y.useEffectEvent, pt = y.useId, gt = y.useImperativeHandle, ht = y.useInsertionEffect, ft = y.useLayoutEffect, bt = y.useMemo, yt = y.useOptimistic, vt = y.useReducer, Z = y.useRef, ee = y.useState, xt = y.useSyncExternalStore, St = y.useTransition, Ct = y.version, wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: Ae,
  Children: Fe,
  Component: Re,
  Fragment: je,
  Profiler: Oe,
  PureComponent: He,
  StrictMode: Ve,
  Suspense: Ue,
  ViewTransition: ze,
  act: Be,
  addTransitionType: We,
  cache: qe,
  cacheSignal: Ke,
  captureOwnerStack: Ge,
  cloneElement: Qe,
  createContext: Xe,
  createElement: Ye,
  createRef: Ze,
  default: y,
  forwardRef: Je,
  isValidElement: et,
  lazy: tt,
  memo: nt,
  startTransition: ct,
  unstable_useCacheRefresh: rt,
  use: st,
  useActionState: ot,
  useCallback: at,
  useContext: it,
  useDebugValue: lt,
  useDeferredValue: mt,
  useEffect: dt,
  useEffectEvent: ut,
  useId: pt,
  useImperativeHandle: gt,
  useInsertionEffect: ht,
  useLayoutEffect: ft,
  useMemo: bt,
  useOptimistic: yt,
  useReducer: vt,
  useRef: Z,
  useState: ee,
  useSyncExternalStore: xt,
  useTransition: St,
  version: Ct
}, Symbol.toStringTag, { value: "Module" })), _ = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!_)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
_.App;
_.Deferred;
_.Form;
const Nt = _.Head;
_.InfiniteScroll;
const kt = _.Link;
_.WhenMounted;
_.WhenVisible;
_.config;
_.createInertiaApp;
_.http;
_.progress;
_.resetLayoutProps;
const Tt = _.router;
_.setLayoutProps;
const $t = _.useForm;
_.useFormContext;
_.useHttp;
const Et = _.usePage;
_.usePoll;
_.usePrefetch;
_.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Lt = s.Badge, Mt = s.Button, Pt = s.Card, _t = s.CardContent, It = s.CardDescription, Dt = s.CardFooter, At = s.CardHeader, Ft = s.cardSummary, Rt = s.CardTitle, jt = s.Checkbox, Ot = s.CodeEditor, Ht = s.CollapsibleCard, Vt = s.CollapsibleCardGroup, Ut = s.Command, zt = s.CommandEmpty, Bt = s.CommandGroup, Wt = s.CommandInput, qt = s.CommandItem, Kt = s.CommandList, Gt = s.CommandSeparator, Qt = s.DatePicker, Xt = s.DeveloperHelp, Yt = s.Dialog, Zt = s.DialogContent, Jt = s.DialogDescription, en = s.DialogFooter, tn = s.DialogHeader, nn = s.DialogTitle, cn = s.DialogTrigger, rn = s.DropdownMenu, sn = s.DropdownMenuCheckboxItem, on = s.DropdownMenuContent, an = s.DropdownMenuItem, ln = s.DropdownMenuLabel, mn = s.DropdownMenuSeparator, dn = s.DropdownMenuTrigger, un = s.FormSections, pn = s.Input, gn = s.KeptEditsNotice, hn = s.Label, fn = s.LanguageTabs, bn = s.LinkAttributes, yn = s.LinkSourcePicker, vn = s.MediaPickerInput, xn = s.moveItem, Sn = s.PageHeader, Cn = s.Popover, wn = s.PopoverAnchor, Nn = s.PopoverContent, kn = s.PopoverTrigger, Tn = s.registerCommandSource, $n = s.RichTextEditor, En = s.Select, Ln = s.SelectContent, Mn = s.SelectItem, Pn = s.SelectTrigger, _n = s.SelectValue, In = s.Separator, Dn = s.SettingsLayout, An = s.SettingsNav, Fn = s.Skeleton, Rn = s.SortableHandle, jn = s.SortableList, On = s.Switch, Hn = s.Table, Vn = s.TableBody, Un = s.TableCell, zn = s.TableHead, Bn = s.TableHeader, Wn = s.TableRow, qn = s.Tabs, Kn = s.TabsContent, Gn = s.TabsList, Qn = s.TabsTrigger, Xn = s.Textarea, Yn = s.Tooltip, Zn = s.TooltipContent, Jn = s.TooltipTrigger, ec = s.toast, tc = s.TrashBanner, nc = s.TrashHint, cc = s.TrashTitle, ge = s.useBreadcrumbs, rc = s.useEditLock, sc = s.useTablePreferences, oc = s.useUnsavedChanges, ac = s.ViewingNotice, he = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Lt,
  Button: Mt,
  Card: Pt,
  CardContent: _t,
  CardDescription: It,
  CardFooter: Dt,
  CardHeader: At,
  CardTitle: Rt,
  Checkbox: jt,
  CodeEditor: Ot,
  CollapsibleCard: Ht,
  CollapsibleCardGroup: Vt,
  Command: Ut,
  CommandEmpty: zt,
  CommandGroup: Bt,
  CommandInput: Wt,
  CommandItem: qt,
  CommandList: Kt,
  CommandSeparator: Gt,
  DatePicker: Qt,
  DeveloperHelp: Xt,
  Dialog: Yt,
  DialogContent: Zt,
  DialogDescription: Jt,
  DialogFooter: en,
  DialogHeader: tn,
  DialogTitle: nn,
  DialogTrigger: cn,
  DropdownMenu: rn,
  DropdownMenuCheckboxItem: sn,
  DropdownMenuContent: on,
  DropdownMenuItem: an,
  DropdownMenuLabel: ln,
  DropdownMenuSeparator: mn,
  DropdownMenuTrigger: dn,
  FormSections: un,
  Input: pn,
  KeptEditsNotice: gn,
  Label: hn,
  LanguageTabs: fn,
  LinkAttributes: bn,
  LinkSourcePicker: yn,
  MediaPickerInput: vn,
  PageHeader: Sn,
  Popover: Cn,
  PopoverAnchor: wn,
  PopoverContent: Nn,
  PopoverTrigger: kn,
  RichTextEditor: $n,
  Select: En,
  SelectContent: Ln,
  SelectItem: Mn,
  SelectTrigger: Pn,
  SelectValue: _n,
  Separator: In,
  SettingsLayout: Dn,
  SettingsNav: An,
  Skeleton: Fn,
  SortableHandle: Rn,
  SortableList: jn,
  Switch: On,
  Table: Hn,
  TableBody: Vn,
  TableCell: Un,
  TableHead: zn,
  TableHeader: Bn,
  TableRow: Wn,
  Tabs: qn,
  TabsContent: Kn,
  TabsList: Gn,
  TabsTrigger: Qn,
  Textarea: Xn,
  Tooltip: Yn,
  TooltipContent: Zn,
  TooltipTrigger: Jn,
  TrashBanner: tc,
  TrashHint: nc,
  TrashTitle: cc,
  ViewingNotice: ac,
  cardSummary: Ft,
  moveItem: xn,
  registerCommandSource: Tn,
  toast: ec,
  useBreadcrumbs: ge,
  useEditLock: rc,
  useTablePreferences: sc,
  useUnsavedChanges: oc
}, Symbol.toStringTag, { value: "Module" })), re = 3, fe = () => window.Sunrice, P = wt, A = he, q = {
  router: Tt,
  Link: kt,
  Head: Nt,
  usePage: Et,
  useForm: $t
}, Wc = A.toast, ic = ge;
function B(e = "") {
  return e.startsWith("/") ? e : fe().adminUrl(e);
}
async function te(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function lc(e) {
  const t = fe();
  if (t.version !== re)
    throw new Error(`[commerce] This bundle was built for admin runtime ${re}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const mc = {
  "Commerce/Confirmations/Index": () => import("./Index-CryabNwD.js"),
  "Commerce/Customers/Show": () => import("./Show-m39O9zT_.js"),
  "Commerce/Dashboard": () => import("./Dashboard-DVrA5df3.js"),
  "Commerce/Inventory/Index": () => import("./Index-XniZ-gM8.js"),
  "Commerce/Loyalty/Show": () => import("./Show-pAdtxZWg.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-efol1sTC.js"),
  "Commerce/Marketing/Report": () => import("./Report-Bz8n3XZG.js"),
  "Commerce/Orders/Editor": () => import("./Editor-CQewu7S_.js"),
  "Commerce/Orders/Show": () => import("./Show-C4tIW2HW.js"),
  "Commerce/Products/Index": () => import("./Index-BBzj3cH4.js"),
  "Commerce/Products/Import": () => import("./Import-BrIG5ebO.js"),
  "Commerce/Reports/Show": () => import("./Show-Abq8b3WK.js"),
  "Commerce/Settings/Section": () => import("./Section-BJ_wDoir.js"),
  "Commerce/Settings/Emails": () => import("./Emails-CB17VgeT.js"),
  "Commerce/Settings/Features": () => import("./Features-DaW9pf8T.js"),
  "Commerce/Settings/Payments": () => import("./Payments-211i8EPv.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-Ca6AEXiO.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-DHHxx_VD.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-hFwSFe1r.js")
};
function dc() {
  lc(mc);
}
const K = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!K)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const uc = K.Fragment, c = K.jsx, u = K.jsxs;
K.jsx;
const se = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function be(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const r = "rules" in n ? n.rules : [n];
  if (r.length === 0) return !0;
  const o = r.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(se).includes(se(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function ne(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function pc(e, t) {
  const n = {};
  for (const [r, o] of Object.entries(e))
    r === t ? n[""] = o : r.startsWith(`${t}.`) && (n[r.slice(t.length + 1)] = o);
  return n;
}
function gc(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const U = "__none", ye = "__empty", ve = (e) => e === "" ? ye : e;
function hc(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? U : ve(String(e));
}
function fc(e, t) {
  return e === U ? null : e === ye ? "" : t ? Number(e) : e;
}
const bc = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function ce(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => be(n, t) && !bc.has(n.type) && !n.config?.secret).flatMap((n) => {
    const r = t[n.handle];
    if (n.type === "group") return ce(n.fields ?? [], r);
    if (n.type === "select" || n.type === "commerce_choices") {
      const o = ne(n), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(i).join(", ") : r == null ? r : i(r)];
    }
    return [r];
  });
}
function xe(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = xe(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function yc() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = xe(e)) && (r && (r += " "), r += t);
  return r;
}
function O(...e) {
  return yc(e);
}
function j({ className: e, children: t }) {
  return /* @__PURE__ */ c(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: e ?? "cm:size-4",
      "aria-hidden": "true",
      children: t
    }
  );
}
const qc = (e) => /* @__PURE__ */ u(j, { ...e, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), Kc = (e) => /* @__PURE__ */ u(j, { ...e, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), Gc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), Qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Xc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Yc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Zc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Jc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), vc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), er = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m14 6 4 4M4 20l4-.8L20 7l-4-4L4 15z" }) });
function xc(e, t) {
  const n = e.trim();
  return t ? n.toUpperCase() : n;
}
function Sc(e) {
  return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).map((n) => String(n).trim()).filter((n) => n !== "");
}
function Se({ field: e, value: t, onChange: n, errors: r, id: o, describedBy: i }) {
  const { Button: a, Popover: l, PopoverAnchor: m, PopoverContent: f, PopoverTrigger: N, Command: T, CommandEmpty: k, CommandInput: b, CommandItem: h, CommandList: $ } = A, x = e.config ?? {}, d = ne(e), g = x.creatable !== !1, S = x.uppercase === !0, p = Sc(t), [C, M] = P.useState(!1), [w, E] = P.useState(""), F = (v) => d.find((R) => R.value === v)?.label ?? v, L = xc(w, S), D = L === "" || d.some((v) => v.value.toLowerCase() === L.toLowerCase() || v.label.toLowerCase() === L.toLowerCase()), V = (v) => n(p.includes(v) ? p.filter((R) => R !== v) : [...p, v]), I = () => {
    L !== "" && !p.includes(L) && n([...p, L]), E("");
  };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    /* @__PURE__ */ u(l, { open: C, onOpenChange: (v) => {
      M(v), v || E("");
    }, children: [
      /* @__PURE__ */ c(m, { asChild: !0, children: /* @__PURE__ */ u("div", { className: O(
        "cm:flex cm:min-h-10 cm:w-full cm:flex-wrap cm:items-center cm:gap-1.5 cm:rounded-md cm:border cm:border-input/80 cm:bg-card cm:px-2 cm:py-1.5 cm:text-sm cm:shadow-xs",
        "cm:focus-within:ring-2 cm:focus-within:ring-ring",
        r?.[""] && "cm:border-destructive"
      ), children: [
        p.map((v) => /* @__PURE__ */ u("span", { className: "cm:inline-flex cm:items-center cm:gap-1 cm:rounded cm:bg-muted cm:py-0.5 cm:pr-1 cm:pl-2 cm:text-xs cm:font-medium", children: [
          F(v),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              "aria-label": `Remove ${F(v)}`,
              className: "cm:rounded cm:p-0.5 cm:hover:bg-background cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring",
              onClick: () => V(v),
              children: /* @__PURE__ */ c(vc, { className: "cm:size-3" })
            }
          )
        ] }, v)),
        /* @__PURE__ */ c(N, { asChild: !0, children: /* @__PURE__ */ u(
          "button",
          {
            id: o,
            type: "button",
            role: "combobox",
            "aria-expanded": C,
            "aria-invalid": !!r?.[""],
            "aria-describedby": i,
            className: "cm:flex cm:min-w-24 cm:flex-1 cm:items-center cm:justify-between cm:gap-2 cm:self-stretch cm:px-1 cm:text-left cm:focus-visible:outline-none",
            children: [
              /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: p.length === 0 ? String(x.placeholder ?? "Choose…") : "Add…" }),
              /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: "cm:size-4 cm:shrink-0 cm:opacity-50", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m7 15 5 5 5-5M7 9l5-5 5 5" }) })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ c(f, { className: "cm:w-(--radix-popover-trigger-width) cm:min-w-64 cm:p-0", align: "start", children: /* @__PURE__ */ u(T, { children: [
        /* @__PURE__ */ c(b, { placeholder: typeof x.input_placeholder == "string" ? x.input_placeholder : g ? "Search or add…" : "Search…", value: w, onValueChange: E }),
        /* @__PURE__ */ u($, { children: [
          /* @__PURE__ */ c(k, { children: g && d.length === 0 ? "Type to add." : g && L !== "" ? "Not in the list." : "Nothing found." }),
          g && !D && !p.includes(L) && /* @__PURE__ */ c(h, { value: `__add ${L}`, keywords: [w], onSelect: I, children: /* @__PURE__ */ u("span", { className: "cm:truncate", children: [
            "Add “",
            L,
            "”"
          ] }) }),
          [...d, ...p.filter((v) => !d.some((R) => R.value === v)).map((v) => ({ value: v, label: v }))].map((v) => /* @__PURE__ */ u(h, { value: `${v.label} ${v.value}`, onSelect: () => {
            V(v.value), E("");
          }, children: [
            /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: O("cm:size-4", p.includes(v.value) ? "cm:opacity-100" : "cm:opacity-0"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "M20 6 9 17l-5-5" }) }),
            /* @__PURE__ */ c("span", { className: "cm:truncate", children: v.label })
          ] }, v.value))
        ] })
      ] }) })
    ] }),
    p.length > 1 && /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(a, { type: "button", variant: "ghost", size: "sm", className: "cm:h-7 cm:px-2 cm:text-xs", onClick: () => n([]), children: "Clear all" }) })
  ] });
}
function oe(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function ae(e) {
  return e ? new Date(e).toISOString() : null;
}
function Ce({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = A, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: oe(i.start),
          onChange: (a) => t({ ...i, start: ae(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-end`, children: "Ends" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-end`,
          type: "datetime-local",
          value: oe(i.end),
          onChange: (a) => t({ ...i, end: ae(a.target.value) })
        }
      )
    ] })
  ] });
}
function Cc({ field: e, id: t, value: n, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = A, f = Array.isArray(n) ? n : [], [N, T] = P.useState({}), [k, b] = P.useState(!1), h = f.filter((d) => !N[d]).join(","), $ = typeof e.config?.max == "number" ? e.config.max : null;
  P.useEffect(() => {
    if (!h) return;
    const d = new AbortController(), g = new URLSearchParams();
    return h.split(",").forEach((S) => g.append("ids[]", S)), te(`${B("media/picker")}?${g}`, { signal: d.signal }).then(({ items: S }) => {
      d.signal.aborted || (T((p) => ({ ...p, ...Object.fromEntries(S.map((C) => [C.id, C])) })), b(!1));
    }).catch(() => {
      d.signal.aborted || b(!0);
    }), () => d.abort();
  }, [h]);
  const x = (d) => N[d]?.title || N[d]?.filename || `Image #${d}`;
  return /* @__PURE__ */ u("div", { id: t, className: "cm:grid cm:gap-3", children: [
    f.length > 0 && /* @__PURE__ */ c(l, { items: f, getId: String, getLabel: x, onReorder: o, className: "cm:grid cm:gap-2", children: (d, { handle: g }) => /* @__PURE__ */ u("div", { className: "cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2", children: [
      /* @__PURE__ */ c(m, { ...g, label: `Move ${x(d)}` }),
      N[d]?.thumbnail && /* @__PURE__ */ c("img", { src: N[d].thumbnail, alt: "", className: "cm:size-10 cm:rounded cm:object-cover" }),
      /* @__PURE__ */ c("span", { className: "cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm", children: x(d) }),
      f[0] === d && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Cover" }),
      /* @__PURE__ */ c(
        i,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-label": `Remove ${x(d)}`,
          onClick: () => o(f.filter((S) => S !== d)),
          children: "Remove"
        }
      )
    ] }) }),
    ($ === null || f.length < $) && /* @__PURE__ */ c(
      a,
      {
        id: t ? `${t}-picker` : void 0,
        value: null,
        multiple: !0,
        max: $ === null ? null : $ - f.length,
        types: ["image"],
        invalid: !!r?.[""],
        onChange: (d) => o(Array.from(/* @__PURE__ */ new Set([...f, ...d ?? []])))
      }
    ),
    k && /* @__PURE__ */ c("p", { role: "status", className: "cm:text-sm cm:text-muted-foreground", children: "Image previews could not be loaded." })
  ] });
}
function we({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: o = !0,
  invalid: i
}) {
  const { Input: a } = A, l = (k) => k == null ? "" : J(k).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, f] = P.useState(l(e)), [N, T] = P.useState(!1);
  return P.useEffect(() => {
    N || f(l(e));
  }, [e, N]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => T(!0),
      onChange: (k) => {
        f(k.target.value);
        const b = k.target.value.trim() === "" ? o ? null : 0 : pe(k.target.value);
        (b !== null || k.target.value.trim() === "") && t(b);
      },
      onBlur: () => {
        T(!1), f(l(e));
      }
    }
  );
}
const Ne = { g: 1, kg: 1e3, mm: 1, cm: 10, m: 1e3 };
let z = { weight: "g", dimension: "mm" };
function wc(e) {
  z = {
    weight: e?.weight === "kg" ? "kg" : e?.weight === "g" ? "g" : z.weight,
    dimension: e?.dimension === "cm" || e?.dimension === "m" || e?.dimension === "mm" ? e.dimension : z.dimension
  };
}
const tr = () => z.weight, nr = () => z.dimension;
function cr(e, t) {
  return e === null ? "" : String(Number((e / Ne[t]).toFixed(6)));
}
function rr(e, t) {
  const n = e.trim().replace(",", ".");
  if (n === "") return null;
  const r = Number(n);
  return Number.isFinite(r) ? Math.max(0, Math.round(r * Ne[t])) : null;
}
function ke() {
  const { props: e } = q.usePage(), t = e.commerce ?? {};
  return _e(t.currency), wc(t.units), t;
}
function Te({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return ke(), /* @__PURE__ */ c(
    we,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const ie = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Nc = { province: 1, city: 2, district: 3, village: 4 }, G = /* @__PURE__ */ new Map();
function kc(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return G.has(n) || G.set(n, te(n).then((r) => r.data).catch(() => (G.delete(n), []))), G.get(n);
}
function $e({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: f } = A, N = e.config ?? {}, T = String(N.api ?? ""), k = Nc[N.depth ?? "district"] ?? 3, b = N.country_options ?? [], h = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, $ = ie.slice(0, k), [x, d] = P.useState({}), g = [null, h.province_code, h.city_code, h.district_code];
  P.useEffect(() => {
    h.country !== "ID" || !T || $.forEach((p, C) => {
      const M = g[C];
      C > 0 && !M || kc(T, M).then((w) => d((E) => ({ ...E, [p.key]: w })));
    });
  }, [T, h.country, h.province_code, h.city_code, h.district_code]);
  const S = (p, C) => {
    const M = { ...h };
    M[$[p].key] = C || null, ie.slice(p + 1).forEach((w) => {
      M[w.key] = null;
    }), n(M);
  };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    b.length > 0 && /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ u(
        i,
        {
          value: h.country,
          onValueChange: (p) => n({ country: p, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ c(l, {}) }),
            /* @__PURE__ */ c(m, { children: b.map((p) => /* @__PURE__ */ c(f, { value: p.value, children: p.label }, p.value)) })
          ]
        }
      )
    ] }),
    h.country === "ID" && $.map((p, C) => /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${p.key}`, children: p.label }),
      /* @__PURE__ */ u(
        i,
        {
          value: h[p.key] ?? U,
          disabled: C > 0 && !g[C],
          onValueChange: (M) => S(C, M === U ? "" : M),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${p.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ u(m, { children: [
              /* @__PURE__ */ c(f, { value: U, children: "Choose…" }),
              (x[p.key] ?? []).map((M) => /* @__PURE__ */ c(f, { value: M.code, children: M.name }, M.code))
            ] })
          ]
        }
      )
    ] }, p.key))
  ] });
}
function Ee({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = A, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", f = Array.isArray(t) ? t : [], [N, T] = P.useState(""), [k, b] = P.useState([]), [h, $] = P.useState(!1);
  P.useEffect(() => {
    if (!h) return;
    const g = new URLSearchParams({ q: N });
    (a.types ?? []).forEach((p) => g.append("types[]", p)), (a.taxonomies ?? []).forEach((p) => g.append("taxonomies[]", p));
    const S = setTimeout(() => te(`${a.api}?${g}`).then((p) => b(p.data)).catch(() => b([])), 200);
    return () => clearTimeout(S);
  }, [N, h]);
  const x = (g) => f.some((S) => S.type === g.type && S.id === g.id), d = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    f.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: f.map((g) => /* @__PURE__ */ u(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ u("span", { className: "cm:text-muted-foreground", children: [
        d[g.type],
        ":"
      ] }),
      " ",
      g.label,
      /* @__PURE__ */ c("button", { type: "button", "aria-label": `Remove ${g.label}`, onClick: () => n(f.filter((S) => !(S.type === g.type && S.id === g.id))), children: "×" })
    ] }, `${g.type}:${g.id}`)) }),
    /* @__PURE__ */ u("div", { className: "cm:relative", children: [
      /* @__PURE__ */ c(
        o,
        {
          id: r,
          value: N,
          placeholder: m ? "Search products…" : a.types && a.types.every((g) => g !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => $(!0),
          onBlur: () => setTimeout(() => $(!1), 150),
          onChange: (g) => T(g.target.value)
        }
      ),
      h && k.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: k.map((g) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          disabled: x(g),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (S) => S.preventDefault(),
          onClick: () => {
            const S = { type: g.type, id: g.id, label: g.label };
            n(l ? [S] : [...f, S]), T(""), l && $(!1);
          },
          children: [
            /* @__PURE__ */ c("span", { children: g.label }),
            /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: g.group })
          ]
        }
      ) }, `${g.type}:${g.id}`)) })
    ] })
  ] });
}
const Tc = P.lazy(() => import("./ProductEditor-BvirnGP1.js")), $c = (e) => P.createElement(P.Suspense, { fallback: null }, P.createElement(Tc, e)), Ec = {
  commerce_money: Te,
  commerce_datetime_range: Ce,
  commerce_region: $e,
  commerce_targets: Ee,
  commerce_product: $c,
  commerce_gallery: Cc,
  commerce_choices: Se
};
function Lc() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Ec).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Mc = P.lazy(() => import("./ChartImpl-BYaWIkyX.js"));
function Pc(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(P.Suspense, { fallback: t, children: /* @__PURE__ */ c(Mc, { ...e }) });
}
function _c({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ u("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ c("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ c("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ c("div", { className: "cm:mt-2", children: n })
  ] });
}
function sr({ className: e }) {
  const { Card: t, CardContent: n } = A;
  return /* @__PURE__ */ c(t, { "aria-hidden": "true", className: e, children: /* @__PURE__ */ u(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function Ic({ kpi: e, className: t }) {
  const { Card: n, CardContent: r } = A, { Link: o } = q, i = e.change ?? null, a = /* @__PURE__ */ u(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    i !== null && /* @__PURE__ */ u(
      "span",
      {
        className: O("cm:text-xs cm:font-medium", i > 0 ? "cm:text-emerald-600" : i < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ c("span", { "aria-hidden": !0, children: i > 0 ? "▲" : i < 0 ? "▼" : "•" }),
          " ",
          Math.abs(i).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ u("span", { className: "cm:sr-only", children: [
            i > 0 ? " up" : i < 0 ? " down" : "",
            " from the previous period"
          ] })
        ]
      }
    ),
    e.hint && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ c(n, { className: t, children: e.href ? /* @__PURE__ */ c(o, { href: B(e.href), className: "cm:block", children: a }) : a });
}
function Le({ title: e, description: t, actions: n, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = q, { PageHeader: m } = A;
  return /* @__PURE__ */ u(uc, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
function Dc(e, t, n, r) {
  const o = e.slice(0, n), i = e.slice(r), a = o !== "" && !/\s$/.test(o) ? " " : "", l = i !== "" && !/^[\s.,!?;:)]/.test(i) ? " " : "", m = `${a}${t}${l}`;
  return { text: o + m + i, caret: o.length + m.length };
}
function Ac({ id: e, value: t, onChange: n, tokens: r, multiline: o, invalid: i, describedBy: a, maxLength: l }) {
  const { Input: m, Textarea: f } = A, N = P.useRef(null), T = (b) => {
    const h = N.current, $ = h?.selectionStart ?? t.length, x = h?.selectionEnd ?? t.length, d = Dc(t, b, $, x);
    n(d.text), requestAnimationFrame(() => {
      h?.focus(), h?.setSelectionRange(d.caret, d.caret);
    });
  };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    /* @__PURE__ */ c(
      o ? f : m,
      {
        ref: N,
        id: e,
        value: t,
        rows: o ? 4 : void 0,
        maxLength: l,
        "aria-invalid": i,
        "aria-describedby": a,
        onChange: (b) => n(b.target.value)
      }
    ),
    /* @__PURE__ */ u("div", { role: "group", "aria-label": "Insert a placeholder", className: "cm:flex cm:flex-wrap cm:items-center cm:gap-1.5", children: [
      /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Insert:" }),
      r.map((b) => {
        const h = t.includes(b.value);
        return /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            title: b.value,
            "aria-pressed": h,
            onMouseDown: ($) => $.preventDefault(),
            onClick: () => T(b.value),
            className: O(
              "cm:inline-flex cm:items-center cm:gap-1 cm:rounded-full cm:border cm:px-2.5 cm:py-0.5 cm:text-xs cm:transition-colors cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring",
              h ? "cm:border-foreground/20 cm:bg-muted cm:font-medium" : "cm:border-dashed cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground"
            ),
            children: [
              h && /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: "cm:size-3", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "M20 6 9 17l-5-5" }) }),
              b.label
            ]
          },
          b.value
        );
      })
    ] })
  ] });
}
const W = he, Fc = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: Te,
  commerce_datetime_range: Ce,
  commerce_region: $e,
  commerce_targets: Ee,
  commerce_choices: Se
}, le = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function Y({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = r;
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => be(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: O(
    "cm:min-w-0",
    le[m.width ?? 100] ?? le[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    Rc,
    {
      field: m,
      value: t?.[m.handle],
      path: `${o}.${m.handle}`,
      errors: l,
      hideLabel: !!i && m.label === i,
      onChange: (f) => n({ ...t, [m.handle]: f })
    }
  ) }, m.handle)) });
}
function Rc({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = W, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], f = e.instructions ? `${l}-help` : void 0, N = [f, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, T = e.label ?? e.handle, k = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ u("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? T : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: T }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(me, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: N, label: T }),
    i && f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !k && /* @__PURE__ */ u(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      T,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(me, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: N, label: T }),
    f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function me({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: f, Switch: N, Label: T, MediaPickerInput: k, RichTextEditor: b, Checkbox: h, Select: $, SelectTrigger: x, SelectValue: d, SelectContent: g, SelectItem: S } = W, p = i[o] !== void 0, C = e.config ?? {}, M = Fc[e.type];
  if (M)
    return /* @__PURE__ */ c(M, { field: e, value: t, onChange: n, errors: pc(i, o), id: r, describedBy: a });
  if (Array.isArray(C.tokens) && C.tokens.length > 0 && (e.type === "text" || e.type === "textarea"))
    return /* @__PURE__ */ c(
      Ac,
      {
        id: r,
        value: typeof t == "string" ? t : "",
        onChange: n,
        tokens: C.tokens,
        multiline: e.type === "textarea",
        invalid: p,
        describedBy: a,
        maxLength: typeof C.max == "number" ? C.max : void 0
      }
    );
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ c(
        f,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": p,
          "aria-describedby": a,
          onChange: (w) => n(w.target.value)
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
          min: C.min,
          max: C.max,
          step: C.step ?? "any",
          onChange: (w) => n(gc(w.target.value))
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
          onChange: (w) => n(w.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c(N, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (w) => n(w) }),
        /* @__PURE__ */ c(T, { htmlFor: r, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const w = ne(e), E = e.type !== "select";
      if (C.multiple === !0) {
        const D = (Array.isArray(t) ? t : []).map(String), V = (I, v) => {
          const R = v ? [...D, I] : D.filter((Pe) => Pe !== I);
          n(E ? R.map(Number) : R);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: w.map((I) => /* @__PURE__ */ u("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(h, { checked: D.includes(I.value), onCheckedChange: (v) => V(I.value, v === !0) }),
          I.label
        ] }, I.value)) });
      }
      const F = Array.isArray(t) ? t[0] : t, L = hc(F, w);
      return /* @__PURE__ */ u($, { value: L, onValueChange: (D) => n(fc(D, E)), children: [
        /* @__PURE__ */ c(x, { id: r, className: "cm:w-full", "aria-invalid": p, "aria-describedby": a, children: /* @__PURE__ */ c(d, { placeholder: "—" }) }),
        /* @__PURE__ */ u(g, { children: [
          (!e.required || L === U) && /* @__PURE__ */ c(S, { value: U, children: "—" }),
          w.map((D) => /* @__PURE__ */ c(S, { value: ve(D.value), children: D.label }, D.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ c(
        k,
        {
          id: r,
          value: t ?? null,
          multiple: C.multiple === !0,
          max: C.max,
          invalid: p,
          types: Array.isArray(C.types) ? C.types : C.image_only ? ["image"] : void 0,
          onChange: (w) => n(w)
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
          onChange: (w) => n(w ?? "")
        }
      );
    case "group":
      return C.per_language === !0 ? /* @__PURE__ */ c(Oc, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(Y, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (w) => n(w) });
    case "repeater":
      return /* @__PURE__ */ c(jc, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": p,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: C.placeholder,
          onChange: (w) => n(w.target.value)
        }
      );
  }
}
function jc({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = W, l = Array.isArray(t) ? t : [], m = Z([]), f = Z(0);
  for (; m.current.length < l.length; ) m.current.push(f.current++);
  m.current.length = l.length;
  const [N, T] = ee(() => /* @__PURE__ */ new Set()), k = (x, d) => {
    m.current = d, n(x);
  }, b = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), h = typeof e.config?.max == "number" ? e.config.max : null, $ = (x, d) => x.map((g, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : g);
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const g = m.current[d], S = `${r}.${d}`, p = Object.keys(o).some((I) => I === S || I.startsWith(`${S}.`)), C = e.config?.summary_targets, M = typeof C == "string" ? x[C] : null, w = Array.isArray(M) ? M.flatMap((I) => typeof I?.label == "string" && I.label ? [I.label] : []) : [], F = (w.length > 1 ? `${w[0]} +${w.length - 1}` : w[0]) ?? W.cardSummary(ce(e.fields ?? [], x)), L = p || N.has(g) || F === "", D = () => T((I) => {
        const v = new Set(I);
        return L ? v.delete(g) : v.add(g), v;
      }), V = `${S.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ u("div", { className: O("cm:rounded-lg cm:border cm:bg-card", p && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              "aria-expanded": L,
              "aria-controls": V,
              onClick: D,
              disabled: p || F === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: O("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !L && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ u("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  d + 1,
                  "."
                ] }),
                /* @__PURE__ */ c("span", { className: "cm:truncate cm:font-medium", children: F || `New ${i.toLowerCase()}` })
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
              onClick: () => k($(l, d), $(m.current, d)),
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
              onClick: () => k(l.filter((I, v) => v !== d), m.current.filter((I, v) => v !== d)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: V, hidden: !L, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          Y,
          {
            fields: e.fields ?? [],
            values: x,
            errors: o,
            pathPrefix: S,
            onChange: (I) => k(l.map((v, R) => R === d ? I : v), m.current)
          }
        ) })
      ] }, g);
    }),
    /* @__PURE__ */ c("div", { children: /* @__PURE__ */ u(
      a,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: h !== null && l.length >= h,
        onClick: () => {
          const x = f.current++;
          T((d) => new Set(d).add(x)), k([...l, b()], [...m.current, x]);
        },
        children: [
          "Add ",
          i.toLowerCase()
        ]
      }
    ) })
  ] });
}
function Oc({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = W, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), f = (b) => Object.keys(o).some((h) => h === `${r}.${b}` || h.startsWith(`${r}.${b}.`)), [N, T] = ee(() => l.find((b) => f(b.handle))?.handle ?? m), k = (b) => a[b] === null || a[b] === void 0 || a[b] === "";
  return /* @__PURE__ */ c(
    i,
    {
      value: N,
      onValueChange: T,
      label: e.label,
      languages: l.map((b) => ({
        code: b.handle,
        name: b.label,
        main: b.handle === m,
        missing: b.handle !== m && k(b.handle),
        status: f(b.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (b) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          Y,
          {
            fields: l.filter((h) => h.handle === b),
            values: a,
            errors: o,
            pathPrefix: r,
            section: l.find((h) => h.handle === b)?.label ?? null,
            onChange: (h) => n(h)
          }
        )
      )
    }
  );
}
function Hc({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: f, useUnsavedChanges: N } = A, T = A.cardSummary, { data: k, setData: b, errors: h, processing: $, isDirty: x, ...d } = q.useForm({ values: e.values }), g = P.useRef(!1), S = () => {
    g.current || (g.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      g.current = !1;
    } }));
  };
  P.useEffect(() => o?.($), [$, o]), N(x, S);
  const p = e.fields, C = e.sections?.length ? e.sections : [{ title: null, description: null, fields: p.map((E) => E.handle) }], M = Object.keys(h), w = (E, F = null) => /* @__PURE__ */ c(
    Y,
    {
      fields: p.filter((L) => E.includes(L.handle)),
      values: k.values,
      errors: h,
      pathPrefix: "values",
      section: F,
      onChange: (L) => b("values", L)
    }
  );
  return /* @__PURE__ */ u("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: (E) => {
    E.preventDefault(), S();
  }, children: [
    h.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: h.section }),
    /* @__PURE__ */ c(f, { className: "cm:gap-6", children: C.map((E, F) => E.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(l, { children: w(E.fields) }) }, `untitled-${F}`) : /* @__PURE__ */ c(
      m,
      {
        title: E.title,
        description: E.description ?? void 0,
        summary: T(ce(p.filter((L) => E.fields.includes(L.handle)), k.values)) || void 0,
        storageKey: n ? `${n}:${E.title}` : void 0,
        hasErrors: E.fields.some((L) => M.some((D) => D === `values.${L}` || D.startsWith(`values.${L}.`))),
        children: w(E.fields, E.title)
      },
      E.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(i, { type: "submit", disabled: $, children: e.submitLabel }),
      r
    ] })
  ] });
}
function Me({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = q;
  return /* @__PURE__ */ c("nav", { "aria-label": n, className: "cm:grid cm:gap-1 cm:max-lg:grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))]", children: e.map((o) => /* @__PURE__ */ c(
    r,
    {
      href: B(o.href),
      "aria-current": o.key === t ? "page" : void 0,
      className: O(
        "cm:flex cm:min-h-10 cm:items-center cm:rounded-md cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:bg-muted cm:hover:text-foreground",
        o.key === t && "cm:bg-muted cm:font-semibold cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function Vc({ sections: e, current: t, title: n, description: r, primary: o, parent: i, children: a }) {
  ke();
  const l = i ? { label: i.label, href: B(i.href) } : void 0;
  return ic([{ label: "Shop" }, { label: "Store settings", href: B("commerce/settings") }, ...l ? [l] : [], { label: n }]), /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ c(Me, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ u("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
      /* @__PURE__ */ c(Le, { title: n, description: r, primary: o, back: l }),
      a
    ] })
  ] });
}
const de = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Uc({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: O("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", de[e] ?? de.neutral), children: t });
}
function zc() {
  Object.assign(Q.components, { Chart: Pc, EmptyState: _c, KpiCard: Ic, MoneyInput: we, PageHeader: Le, SchemaFormView: Hc, SectionNav: Me, SettingsLayout: Vc, StatusBadge: Uc });
}
De();
zc();
Lc();
dc();
export {
  bt as $,
  Qc as A,
  Zc as B,
  Pc as C,
  Jc as D,
  _c as E,
  uc as F,
  sc as G,
  cr as H,
  rr as I,
  tr as J,
  sr as K,
  nr as L,
  we as M,
  et as N,
  Je as O,
  Le as P,
  yc as Q,
  P as R,
  Uc as S,
  Ee as T,
  he as U,
  Ye as V,
  it as W,
  vc as X,
  Xe as Y,
  Qe as Z,
  wt as _,
  B as a,
  Z as a0,
  at as a1,
  dt as a2,
  gt as a3,
  ft as a4,
  nt as a5,
  Fe as a6,
  Re as a7,
  He as a8,
  c as b,
  A as c,
  ke as d,
  Q as e,
  Ic as f,
  J as g,
  Bc as h,
  q as i,
  u as j,
  er as k,
  te as l,
  Hc as m,
  Y as n,
  $e as o,
  O as p,
  Vc as q,
  ee as r,
  qc as s,
  Wc as t,
  ic as u,
  Gc as v,
  Kc as w,
  Xc as x,
  Yc as y,
  je as z
};
