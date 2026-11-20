const ue = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let X = ue;
function _e(e) {
  X = { ...ue, ...e ?? {} };
}
function J(e, t = X) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${h}` : h;
}
const De = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 2 });
function Uc(e, t = X) {
  const n = Math.abs(e) / 10 ** t.decimals;
  if (n < 1e3)
    return J(e, t);
  const r = De.format(n), o = t.space ? " " : "";
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
const O = {
  orderPanels: {},
  dashboardWidgets: {},
  settingsSections: {},
  productTabs: {}
}, Q = {
  version: 1,
  registerOrderPanel: (e, t) => {
    O.orderPanels[e] = t;
  },
  registerDashboardWidget: (e, t) => {
    O.dashboardWidgets[e] = t;
  },
  registerSettingsSection: (e, t) => {
    O.settingsSections[e] = t;
  },
  registerProductTab: (e, t) => {
    O.productTabs[e] = t;
  },
  orderPanels: () => O.orderPanels,
  dashboardWidgets: () => O.dashboardWidgets,
  settingsSections: () => O.settingsSections,
  productTabs: () => O.productTabs,
  formatMoney: J,
  parseMoney: pe,
  components: {}
};
function Ie() {
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
const f = globalThis.Sunrice?.modules?.react;
if (!f)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Ae = f.Activity, Fe = f.Children, Re = f.Component, je = f.Fragment, Oe = f.Profiler, He = f.PureComponent, Ve = f.StrictMode, Ue = f.Suspense, ze = f.ViewTransition, Be = f.act, We = f.addTransitionType, qe = f.cache, Ke = f.cacheSignal, Ge = f.captureOwnerStack, Qe = f.cloneElement, Xe = f.createContext, Ye = f.createElement, Ze = f.createRef, Je = f.forwardRef, et = f.isValidElement, tt = f.lazy, nt = f.memo, ct = f.startTransition, rt = f.unstable_useCacheRefresh, st = f.use, ot = f.useActionState, at = f.useCallback, it = f.useContext, lt = f.useDebugValue, mt = f.useDeferredValue, dt = f.useEffect, ut = f.useEffectEvent, pt = f.useId, gt = f.useImperativeHandle, ht = f.useInsertionEffect, ft = f.useLayoutEffect, bt = f.useMemo, yt = f.useOptimistic, vt = f.useReducer, Z = f.useRef, ee = f.useState, St = f.useSyncExternalStore, Ct = f.useTransition, xt = f.version, wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  default: f,
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
  useSyncExternalStore: St,
  useTransition: Ct,
  version: xt
}, Symbol.toStringTag, { value: "Module" })), P = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!P)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
P.App;
P.Deferred;
P.Form;
const Nt = P.Head;
P.InfiniteScroll;
const Tt = P.Link;
P.WhenMounted;
P.WhenVisible;
P.config;
P.createInertiaApp;
P.http;
P.progress;
P.resetLayoutProps;
const kt = P.router;
P.setLayoutProps;
const $t = P.useForm;
P.useFormContext;
P.useHttp;
const Et = P.usePage;
P.usePoll;
P.usePrefetch;
P.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Lt = s.Badge, Mt = s.Button, Pt = s.Card, _t = s.CardContent, Dt = s.CardDescription, It = s.CardFooter, At = s.CardHeader, Ft = s.cardSummary, Rt = s.CardTitle, jt = s.Checkbox, Ot = s.CodeEditor, Ht = s.CollapsibleCard, Vt = s.CollapsibleCardGroup, Ut = s.Command, zt = s.CommandEmpty, Bt = s.CommandGroup, Wt = s.CommandInput, qt = s.CommandItem, Kt = s.CommandList, Gt = s.CommandSeparator, Qt = s.DatePicker, Xt = s.DeveloperHelp, Yt = s.Dialog, Zt = s.DialogContent, Jt = s.DialogDescription, en = s.DialogFooter, tn = s.DialogHeader, nn = s.DialogTitle, cn = s.DialogTrigger, rn = s.DropdownMenu, sn = s.DropdownMenuCheckboxItem, on = s.DropdownMenuContent, an = s.DropdownMenuItem, ln = s.DropdownMenuLabel, mn = s.DropdownMenuSeparator, dn = s.DropdownMenuTrigger, un = s.FormSections, pn = s.Input, gn = s.KeptEditsNotice, hn = s.Label, fn = s.LanguageTabs, bn = s.LinkAttributes, yn = s.LinkSourcePicker, vn = s.MediaPickerInput, Sn = s.moveItem, Cn = s.PageHeader, xn = s.Popover, wn = s.PopoverAnchor, Nn = s.PopoverContent, Tn = s.PopoverTrigger, kn = s.registerCommandSource, $n = s.RichTextEditor, En = s.Select, Ln = s.SelectContent, Mn = s.SelectItem, Pn = s.SelectTrigger, _n = s.SelectValue, Dn = s.Separator, In = s.SettingsLayout, An = s.SettingsNav, Fn = s.Skeleton, Rn = s.SortableHandle, jn = s.SortableList, On = s.Switch, Hn = s.Table, Vn = s.TableBody, Un = s.TableCell, zn = s.TableHead, Bn = s.TableHeader, Wn = s.TableRow, qn = s.Tabs, Kn = s.TabsContent, Gn = s.TabsList, Qn = s.TabsTrigger, Xn = s.Textarea, Yn = s.Tooltip, Zn = s.TooltipContent, Jn = s.TooltipTrigger, ec = s.toast, tc = s.TrashBanner, nc = s.TrashHint, cc = s.TrashTitle, ge = s.useBreadcrumbs, rc = s.useEditLock, sc = s.useTablePreferences, oc = s.useUnsavedChanges, ac = s.ViewingNotice, he = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: Lt,
  Button: Mt,
  Card: Pt,
  CardContent: _t,
  CardDescription: Dt,
  CardFooter: It,
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
  PageHeader: Cn,
  Popover: xn,
  PopoverAnchor: wn,
  PopoverContent: Nn,
  PopoverTrigger: Tn,
  RichTextEditor: $n,
  Select: En,
  SelectContent: Ln,
  SelectItem: Mn,
  SelectTrigger: Pn,
  SelectValue: _n,
  Separator: Dn,
  SettingsLayout: In,
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
  moveItem: Sn,
  registerCommandSource: kn,
  toast: ec,
  useBreadcrumbs: ge,
  useEditLock: rc,
  useTablePreferences: sc,
  useUnsavedChanges: oc
}, Symbol.toStringTag, { value: "Module" })), re = 3, fe = () => window.Sunrice, D = wt, F = he, q = {
  router: kt,
  Link: Tt,
  Head: Nt,
  usePage: Et,
  useForm: $t
}, zc = F.toast, ic = ge;
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
  "Commerce/Confirmations/Index": () => import("./Index-CLnXVaMN.js"),
  "Commerce/Customers/Show": () => import("./Show-B7YkY0y-.js"),
  "Commerce/Dashboard": () => import("./Dashboard-CWDlwYi7.js"),
  "Commerce/Inventory/Index": () => import("./Index-v3D9z_HV.js"),
  "Commerce/Loyalty/Show": () => import("./Show-XTfACT5-.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-Dg8i0fPx.js"),
  "Commerce/Marketing/Report": () => import("./Report-DEbj8573.js"),
  "Commerce/Orders/Editor": () => import("./Editor-2ozXibWa.js"),
  "Commerce/Orders/Show": () => import("./Show-BgSv_T3t.js"),
  "Commerce/Products/Index": () => import("./Index-DWzEea88.js"),
  "Commerce/Products/Import": () => import("./Import-C7T4zBC0.js"),
  "Commerce/Reports/Show": () => import("./Show-D5GaOc_I.js"),
  "Commerce/Settings/Section": () => import("./Section-jAscUyNT.js"),
  "Commerce/Settings/Emails": () => import("./Emails-C1UFwiIt.js"),
  "Commerce/Settings/Features": () => import("./Features-DmfxNN9e.js"),
  "Commerce/Settings/Payments": () => import("./Payments-BMRD7I-I.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BuRSmdux.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-oT286QXa.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-CG_ZOM1O.js")
};
function dc() {
  lc(mc);
}
const K = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!K)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const uc = K.Fragment, c = K.jsx, g = K.jsxs;
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
function Se(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Se(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function yc() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Se(e)) && (r && (r += " "), r += t);
  return r;
}
function H(...e) {
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
const Bc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), Wc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), Kc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Gc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Xc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Yc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), vc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), Zc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m14 6 4 4M4 20l4-.8L20 7l-4-4L4 15z" }) });
function Sc(e, t) {
  const n = e.trim();
  return t ? n.toUpperCase() : n;
}
function Cc(e) {
  return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).map((n) => String(n).trim()).filter((n) => n !== "");
}
function Ce({ field: e, value: t, onChange: n, errors: r, id: o, describedBy: i }) {
  const { Button: a, Popover: l, PopoverAnchor: m, PopoverContent: h, PopoverTrigger: T, Command: k, CommandEmpty: w, CommandInput: v, CommandItem: y, CommandList: L } = F, x = e.config ?? {}, d = ne(e), p = x.creatable !== !1, S = x.uppercase === !0, u = Cc(t), [N, M] = D.useState(!1), [C, $] = D.useState(""), A = (b) => d.find((R) => R.value === b)?.label ?? b, E = Sc(C, S), I = E === "" || d.some((b) => b.value.toLowerCase() === E.toLowerCase() || b.label.toLowerCase() === E.toLowerCase()), V = (b) => n(u.includes(b) ? u.filter((R) => R !== b) : [...u, b]), _ = () => {
    E !== "" && !u.includes(E) && n([...u, E]), $("");
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    /* @__PURE__ */ g(l, { open: N, onOpenChange: (b) => {
      M(b), b || $("");
    }, children: [
      /* @__PURE__ */ c(m, { asChild: !0, children: /* @__PURE__ */ g("div", { className: H(
        "cm:flex cm:min-h-9 cm:w-full cm:flex-wrap cm:items-center cm:gap-1.5 cm:rounded-md cm:border cm:border-input cm:bg-transparent cm:px-2 cm:py-1.5 cm:text-sm cm:shadow-xs",
        "cm:focus-within:ring-2 cm:focus-within:ring-ring",
        r?.[""] && "cm:border-destructive"
      ), children: [
        u.map((b) => /* @__PURE__ */ g("span", { className: "cm:inline-flex cm:items-center cm:gap-1 cm:rounded cm:bg-muted cm:py-0.5 cm:pr-1 cm:pl-2 cm:text-xs cm:font-medium", children: [
          A(b),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              "aria-label": `Remove ${A(b)}`,
              className: "cm:rounded cm:p-0.5 cm:hover:bg-background cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring",
              onClick: () => V(b),
              children: /* @__PURE__ */ c(vc, { className: "cm:size-3" })
            }
          )
        ] }, b)),
        /* @__PURE__ */ c(T, { asChild: !0, children: /* @__PURE__ */ g(
          "button",
          {
            id: o,
            type: "button",
            role: "combobox",
            "aria-expanded": N,
            "aria-invalid": !!r?.[""],
            "aria-describedby": i,
            className: "cm:flex cm:min-w-24 cm:flex-1 cm:items-center cm:justify-between cm:gap-2 cm:self-stretch cm:px-1 cm:text-left cm:focus-visible:outline-none",
            children: [
              /* @__PURE__ */ c("span", { className: "cm:text-muted-foreground", children: u.length === 0 ? String(x.placeholder ?? "Choose…") : "Add…" }),
              /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: "cm:size-4 cm:shrink-0 cm:opacity-50", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m7 15 5 5 5-5M7 9l5-5 5 5" }) })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ c(h, { className: "cm:w-(--radix-popover-trigger-width) cm:min-w-64 cm:p-0", align: "start", children: /* @__PURE__ */ g(k, { children: [
        /* @__PURE__ */ c(v, { placeholder: p ? "Search or add…" : "Search…", value: C, onValueChange: $ }),
        /* @__PURE__ */ g(L, { children: [
          /* @__PURE__ */ c(w, { children: p && E !== "" ? "Not in the list." : "Nothing found." }),
          p && !I && !u.includes(E) && /* @__PURE__ */ c(y, { value: `__add ${E}`, keywords: [C], onSelect: _, children: /* @__PURE__ */ g("span", { className: "cm:truncate", children: [
            "Add “",
            E,
            "”"
          ] }) }),
          [...d, ...u.filter((b) => !d.some((R) => R.value === b)).map((b) => ({ value: b, label: b }))].map((b) => /* @__PURE__ */ g(y, { value: `${b.label} ${b.value}`, onSelect: () => {
            V(b.value), $("");
          }, children: [
            /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4", u.includes(b.value) ? "cm:opacity-100" : "cm:opacity-0"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "M20 6 9 17l-5-5" }) }),
            /* @__PURE__ */ c("span", { className: "cm:truncate", children: b.label })
          ] }, b.value))
        ] })
      ] }) })
    ] }),
    u.length > 1 && /* @__PURE__ */ c("div", { children: /* @__PURE__ */ c(a, { type: "button", variant: "ghost", size: "sm", className: "cm:h-7 cm:px-2 cm:text-xs", onClick: () => n([]), children: "Clear all" }) })
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
function xe({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = F, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
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
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
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
function xc({ field: e, id: t, value: n, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = F, h = Array.isArray(n) ? n : [], [T, k] = D.useState({}), [w, v] = D.useState(!1), y = h.filter((d) => !T[d]).join(","), L = typeof e.config?.max == "number" ? e.config.max : null;
  D.useEffect(() => {
    if (!y) return;
    const d = new AbortController(), p = new URLSearchParams();
    return y.split(",").forEach((S) => p.append("ids[]", S)), te(`${B("media/picker")}?${p}`, { signal: d.signal }).then(({ items: S }) => {
      d.signal.aborted || (k((u) => ({ ...u, ...Object.fromEntries(S.map((N) => [N.id, N])) })), v(!1));
    }).catch(() => {
      d.signal.aborted || v(!0);
    }), () => d.abort();
  }, [y]);
  const x = (d) => T[d]?.title || T[d]?.filename || `Image #${d}`;
  return /* @__PURE__ */ g("div", { id: t, className: "cm:grid cm:gap-3", children: [
    h.length > 0 && /* @__PURE__ */ c(l, { items: h, getId: String, getLabel: x, onReorder: o, className: "cm:grid cm:gap-2", children: (d, { handle: p }) => /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2", children: [
      /* @__PURE__ */ c(m, { ...p, label: `Move ${x(d)}` }),
      T[d]?.thumbnail && /* @__PURE__ */ c("img", { src: T[d].thumbnail, alt: "", className: "cm:size-10 cm:rounded cm:object-cover" }),
      /* @__PURE__ */ c("span", { className: "cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm", children: x(d) }),
      h[0] === d && /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Cover" }),
      /* @__PURE__ */ c(
        i,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          "aria-label": `Remove ${x(d)}`,
          onClick: () => o(h.filter((S) => S !== d)),
          children: "Remove"
        }
      )
    ] }) }),
    (L === null || h.length < L) && /* @__PURE__ */ c(
      a,
      {
        id: t ? `${t}-picker` : void 0,
        value: null,
        multiple: !0,
        max: L === null ? null : L - h.length,
        types: ["image"],
        invalid: !!r?.[""],
        onChange: (d) => o(Array.from(/* @__PURE__ */ new Set([...h, ...d ?? []])))
      }
    ),
    w && /* @__PURE__ */ c("p", { role: "status", className: "cm:text-sm cm:text-muted-foreground", children: "Image previews could not be loaded." })
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
  const { Input: a } = F, l = (w) => w == null ? "" : J(w).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = D.useState(l(e)), [T, k] = D.useState(!1);
  return D.useEffect(() => {
    T || h(l(e));
  }, [e, T]), /* @__PURE__ */ c(
    a,
    {
      id: n,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => k(!0),
      onChange: (w) => {
        h(w.target.value);
        const v = w.target.value.trim() === "" ? o ? null : 0 : pe(w.target.value);
        (v !== null || w.target.value.trim() === "") && t(v);
      },
      onBlur: () => {
        k(!1), h(l(e));
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
const Jc = () => z.weight, er = () => z.dimension;
function tr(e, t) {
  return e === null ? "" : String(Number((e / Ne[t]).toFixed(6)));
}
function nr(e, t) {
  const n = e.trim().replace(",", ".");
  if (n === "") return null;
  const r = Number(n);
  return Number.isFinite(r) ? Math.max(0, Math.round(r * Ne[t])) : null;
}
function Te() {
  const { props: e } = q.usePage(), t = e.commerce ?? {};
  return _e(t.currency), wc(t.units), t;
}
function ke({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return Te(), /* @__PURE__ */ c(
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
function Tc(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return G.has(n) || G.set(n, te(n).then((r) => r.data).catch(() => (G.delete(n), []))), G.get(n);
}
function $e({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: h } = F, T = e.config ?? {}, k = String(T.api ?? ""), w = Nc[T.depth ?? "district"] ?? 3, v = T.country_options ?? [], y = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, L = ie.slice(0, w), [x, d] = D.useState({}), p = [null, y.province_code, y.city_code, y.district_code];
  D.useEffect(() => {
    y.country !== "ID" || !k || L.forEach((u, N) => {
      const M = p[N];
      N > 0 && !M || Tc(k, M).then((C) => d(($) => ({ ...$, [u.key]: C })));
    });
  }, [k, y.country, y.province_code, y.city_code, y.district_code]);
  const S = (u, N) => {
    const M = { ...y };
    M[L[u].key] = N || null, ie.slice(u + 1).forEach((C) => {
      M[C.key] = null;
    }), n(M);
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    v.length > 0 && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ g(
        i,
        {
          value: y.country,
          onValueChange: (u) => n({ country: u, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ c(l, {}) }),
            /* @__PURE__ */ c(m, { children: v.map((u) => /* @__PURE__ */ c(h, { value: u.value, children: u.label }, u.value)) })
          ]
        }
      )
    ] }),
    y.country === "ID" && L.map((u, N) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${r}-${u.key}`, children: u.label }),
      /* @__PURE__ */ g(
        i,
        {
          value: y[u.key] ?? U,
          disabled: N > 0 && !p[N],
          onValueChange: (M) => S(N, M === U ? "" : M),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${u.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ g(m, { children: [
              /* @__PURE__ */ c(h, { value: U, children: "Choose…" }),
              (x[u.key] ?? []).map((M) => /* @__PURE__ */ c(h, { value: M.code, children: M.name }, M.code))
            ] })
          ]
        }
      )
    ] }, u.key))
  ] });
}
function Ee({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = F, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", h = Array.isArray(t) ? t : [], [T, k] = D.useState(""), [w, v] = D.useState([]), [y, L] = D.useState(!1);
  D.useEffect(() => {
    if (!y) return;
    const p = new URLSearchParams({ q: T });
    (a.types ?? []).forEach((u) => p.append("types[]", u)), (a.taxonomies ?? []).forEach((u) => p.append("taxonomies[]", u));
    const S = setTimeout(() => te(`${a.api}?${p}`).then((u) => v(u.data)).catch(() => v([])), 200);
    return () => clearTimeout(S);
  }, [T, y]);
  const x = (p) => h.some((S) => S.type === p.type && S.id === p.id), d = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    h.length > 0 && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: h.map((p) => /* @__PURE__ */ g(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ g("span", { className: "cm:text-muted-foreground", children: [
        d[p.type],
        ":"
      ] }),
      " ",
      p.label,
      /* @__PURE__ */ c("button", { type: "button", "aria-label": `Remove ${p.label}`, onClick: () => n(h.filter((S) => !(S.type === p.type && S.id === p.id))), children: "×" })
    ] }, `${p.type}:${p.id}`)) }),
    /* @__PURE__ */ g("div", { className: "cm:relative", children: [
      /* @__PURE__ */ c(
        o,
        {
          id: r,
          value: T,
          placeholder: m ? "Search products…" : a.types && a.types.every((p) => p !== "term") ? "Search products, variants or SKUs…" : "Search products, SKUs, categories, brands…",
          onFocus: () => L(!0),
          onBlur: () => setTimeout(() => L(!1), 150),
          onChange: (p) => k(p.target.value)
        }
      ),
      y && w.length > 0 && /* @__PURE__ */ c("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: w.map((p) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          disabled: x(p),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (S) => S.preventDefault(),
          onClick: () => {
            const S = { type: p.type, id: p.id, label: p.label };
            n(l ? [S] : [...h, S]), k(""), l && L(!1);
          },
          children: [
            /* @__PURE__ */ c("span", { children: p.label }),
            /* @__PURE__ */ c("span", { className: "cm:text-xs cm:text-muted-foreground", children: p.group })
          ]
        }
      ) }, `${p.type}:${p.id}`)) })
    ] })
  ] });
}
const kc = D.lazy(() => import("./ProductEditor-OtbFtORf.js")), $c = (e) => D.createElement(D.Suspense, { fallback: null }, D.createElement(kc, e)), Ec = {
  commerce_money: ke,
  commerce_datetime_range: xe,
  commerce_region: $e,
  commerce_targets: Ee,
  commerce_product: $c,
  commerce_gallery: xc,
  commerce_choices: Ce
};
function Lc() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Ec).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const Mc = D.lazy(() => import("./ChartImpl-DLe51yaB.js"));
function Pc(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(D.Suspense, { fallback: t, children: /* @__PURE__ */ c(Mc, { ...e }) });
}
function _c({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ g("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ c("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ c("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ c("div", { className: "cm:mt-2", children: n })
  ] });
}
function cr({ className: e }) {
  const { Card: t, CardContent: n } = F;
  return /* @__PURE__ */ c(t, { "aria-hidden": "true", className: e, children: /* @__PURE__ */ g(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function Dc({ kpi: e, className: t }) {
  const { Card: n, CardContent: r } = F, { Link: o } = q, i = e.change ?? null, a = /* @__PURE__ */ g(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ c("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    i !== null && /* @__PURE__ */ g(
      "span",
      {
        className: H("cm:text-xs cm:font-medium", i > 0 ? "cm:text-emerald-600" : i < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ c("span", { "aria-hidden": !0, children: i > 0 ? "▲" : i < 0 ? "▼" : "•" }),
          " ",
          Math.abs(i).toLocaleString(void 0, { maximumFractionDigits: 1 }),
          "%",
          /* @__PURE__ */ g("span", { className: "cm:sr-only", children: [
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
  const { Head: l } = q, { PageHeader: m } = F;
  return /* @__PURE__ */ g(uc, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
const W = he, Ic = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: ke,
  commerce_datetime_range: xe,
  commerce_region: $e,
  commerce_targets: Ee,
  commerce_choices: Ce
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
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => be(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: H(
    "cm:min-w-0",
    le[m.width ?? 100] ?? le[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    Ac,
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
function Ac({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = W, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${l}-help` : void 0, T = [h, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, k = e.label ?? e.handle, w = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ g("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? k : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: k }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(me, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: k }),
    i && h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !w && /* @__PURE__ */ g(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      k,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(me, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: k }),
    h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function me({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: h, Switch: T, Label: k, MediaPickerInput: w, RichTextEditor: v, Checkbox: y, Select: L, SelectTrigger: x, SelectValue: d, SelectContent: p, SelectItem: S } = W, u = i[o] !== void 0, N = e.config ?? {}, M = Ic[e.type];
  if (M)
    return /* @__PURE__ */ c(M, { field: e, value: t, onChange: n, errors: pc(i, o), id: r, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ c(
        h,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": u,
          "aria-describedby": a,
          onChange: (C) => n(C.target.value)
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
          "aria-invalid": u,
          "aria-describedby": a,
          min: N.min,
          max: N.max,
          step: N.step ?? "any",
          onChange: (C) => n(gc(C.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": u,
          "aria-describedby": a,
          onChange: (C) => n(C.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c(T, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (C) => n(C) }),
        /* @__PURE__ */ c(k, { htmlFor: r, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const C = ne(e), $ = e.type !== "select";
      if (N.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), V = (_, b) => {
          const R = b ? [...I, _] : I.filter((Pe) => Pe !== _);
          n($ ? R.map(Number) : R);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: C.map((_) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(y, { checked: I.includes(_.value), onCheckedChange: (b) => V(_.value, b === !0) }),
          _.label
        ] }, _.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, E = hc(A, C);
      return /* @__PURE__ */ g(L, { value: E, onValueChange: (I) => n(fc(I, $)), children: [
        /* @__PURE__ */ c(x, { id: r, className: "cm:w-full", "aria-invalid": u, "aria-describedby": a, children: /* @__PURE__ */ c(d, { placeholder: "—" }) }),
        /* @__PURE__ */ g(p, { children: [
          (!e.required || E === U) && /* @__PURE__ */ c(S, { value: U, children: "—" }),
          C.map((I) => /* @__PURE__ */ c(S, { value: ve(I.value), children: I.label }, I.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ c(
        w,
        {
          id: r,
          value: t ?? null,
          multiple: N.multiple === !0,
          max: N.max,
          invalid: u,
          types: Array.isArray(N.types) ? N.types : N.image_only ? ["image"] : void 0,
          onChange: (C) => n(C)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ c(
        v,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: u,
          labelledBy: `${r}-label`,
          onChange: (C) => n(C ?? "")
        }
      );
    case "group":
      return N.per_language === !0 ? /* @__PURE__ */ c(Rc, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(Y, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (C) => n(C) });
    case "repeater":
      return /* @__PURE__ */ c(Fc, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ c(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": u,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: N.placeholder,
          onChange: (C) => n(C.target.value)
        }
      );
  }
}
function Fc({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = W, l = Array.isArray(t) ? t : [], m = Z([]), h = Z(0);
  for (; m.current.length < l.length; ) m.current.push(h.current++);
  m.current.length = l.length;
  const [T, k] = ee(() => /* @__PURE__ */ new Set()), w = (x, d) => {
    m.current = d, n(x);
  }, v = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), y = typeof e.config?.max == "number" ? e.config.max : null, L = (x, d) => x.map((p, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : p);
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const p = m.current[d], S = `${r}.${d}`, u = Object.keys(o).some((_) => _ === S || _.startsWith(`${S}.`)), N = e.config?.summary_targets, M = typeof N == "string" ? x[N] : null, C = Array.isArray(M) ? M.flatMap((_) => typeof _?.label == "string" && _.label ? [_.label] : []) : [], A = (C.length > 1 ? `${C[0]} +${C.length - 1}` : C[0]) ?? W.cardSummary(ce(e.fields ?? [], x)), E = u || T.has(p) || A === "", I = () => k((_) => {
        const b = new Set(_);
        return E ? b.delete(p) : b.add(p), b;
      }), V = `${S.replace(/[^A-Za-z0-9_-]+/g, "-")}-row`;
      return /* @__PURE__ */ g("div", { className: H("cm:rounded-lg cm:border cm:bg-card", u && "cm:border-destructive/50"), children: [
        /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-1 cm:pr-2", children: [
          /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              "aria-expanded": E,
              "aria-controls": V,
              onClick: I,
              disabled: u || A === "",
              className: "cm:flex cm:min-w-0 cm:flex-1 cm:items-center cm:gap-2 cm:rounded-lg cm:px-3 cm:py-2.5 cm:text-left cm:text-sm cm:disabled:cursor-default cm:focus-visible:ring-2 cm:focus-visible:ring-ring cm:focus-visible:outline-none",
              children: [
                /* @__PURE__ */ c("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !E && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ c("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ g("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
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
              onClick: () => w(L(l, d), L(m.current, d)),
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
              onClick: () => w(l.filter((_, b) => b !== d), m.current.filter((_, b) => b !== d)),
              children: "Remove"
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { id: V, hidden: !E, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ c(
          Y,
          {
            fields: e.fields ?? [],
            values: x,
            errors: o,
            pathPrefix: S,
            onChange: (_) => w(l.map((b, R) => R === d ? _ : b), m.current)
          }
        ) })
      ] }, p);
    }),
    /* @__PURE__ */ c("div", { children: /* @__PURE__ */ g(
      a,
      {
        type: "button",
        size: "sm",
        variant: "outline",
        disabled: y !== null && l.length >= y,
        onClick: () => {
          const x = h.current++;
          k((d) => new Set(d).add(x)), w([...l, v()], [...m.current, x]);
        },
        children: [
          "Add ",
          i.toLowerCase()
        ]
      }
    ) })
  ] });
}
function Rc({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = W, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), h = (v) => Object.keys(o).some((y) => y === `${r}.${v}` || y.startsWith(`${r}.${v}.`)), [T, k] = ee(() => l.find((v) => h(v.handle))?.handle ?? m), w = (v) => a[v] === null || a[v] === void 0 || a[v] === "";
  return /* @__PURE__ */ c(
    i,
    {
      value: T,
      onValueChange: k,
      label: e.label,
      languages: l.map((v) => ({
        code: v.handle,
        name: v.label,
        main: v.handle === m,
        missing: v.handle !== m && w(v.handle),
        status: h(v.handle) ? { tone: "warning", label: "Has an error" } : void 0
      })),
      children: (v) => (
        // The tab names the language, so its field doesn't.
        /* @__PURE__ */ c(
          Y,
          {
            fields: l.filter((y) => y.handle === v),
            values: a,
            errors: o,
            pathPrefix: r,
            section: l.find((y) => y.handle === v)?.label ?? null,
            onChange: (y) => n(y)
          }
        )
      )
    }
  );
}
function jc({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: T } = F, k = F.cardSummary, { data: w, setData: v, errors: y, processing: L, isDirty: x, ...d } = q.useForm({ values: e.values }), p = D.useRef(!1), S = () => {
    p.current || (p.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      p.current = !1;
    } }));
  };
  D.useEffect(() => o?.(L), [L, o]), T(x, S);
  const u = e.fields, N = e.sections?.length ? e.sections : [{ title: null, description: null, fields: u.map(($) => $.handle) }], M = Object.keys(y), C = ($, A = null) => /* @__PURE__ */ c(
    Y,
    {
      fields: u.filter((E) => $.includes(E.handle)),
      values: w.values,
      errors: y,
      pathPrefix: "values",
      section: A,
      onChange: (E) => v("values", E)
    }
  );
  return /* @__PURE__ */ g("form", { id: t, className: "cm:flex cm:flex-col cm:gap-6", onSubmit: ($) => {
    $.preventDefault(), S();
  }, children: [
    y.section && /* @__PURE__ */ c("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: y.section }),
    /* @__PURE__ */ c(h, { className: "cm:gap-6", children: N.map(($, A) => $.title === null ? /* @__PURE__ */ c(a, { children: /* @__PURE__ */ c(l, { children: C($.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ c(
      m,
      {
        title: $.title,
        description: $.description ?? void 0,
        summary: k(ce(u.filter((E) => $.fields.includes(E.handle)), w.values)) || void 0,
        storageKey: n ? `${n}:${$.title}` : void 0,
        hasErrors: $.fields.some((E) => M.some((I) => I === `values.${E}` || I.startsWith(`values.${E}.`))),
        children: C($.fields, $.title)
      },
      $.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ c(i, { type: "submit", disabled: L, children: e.submitLabel }),
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
      className: H(
        "cm:flex cm:min-h-10 cm:items-center cm:rounded-md cm:px-3 cm:py-2 cm:text-sm cm:text-muted-foreground cm:transition-colors cm:hover:bg-muted cm:hover:text-foreground",
        o.key === t && "cm:bg-muted cm:font-semibold cm:text-foreground"
      ),
      children: o.label
    },
    o.key
  )) });
}
function Oc({ sections: e, current: t, title: n, description: r, primary: o, parent: i, children: a }) {
  Te();
  const l = i ? { label: i.label, href: B(i.href) } : void 0;
  return ic([{ label: "Shop" }, { label: "Store settings", href: B("commerce/settings") }, ...l ? [l] : [], { label: n }]), /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ c(Me, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
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
function Hc({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", de[e] ?? de.neutral), children: t });
}
function Vc() {
  Object.assign(Q.components, { Chart: Pc, EmptyState: _c, KpiCard: Dc, MoneyInput: we, PageHeader: Le, SchemaFormView: jc, SectionNav: Me, SettingsLayout: Oc, StatusBadge: Hc });
}
Ie();
Vc();
Lc();
dc();
export {
  bt as $,
  Kc as A,
  Xc as B,
  Pc as C,
  Yc as D,
  _c as E,
  uc as F,
  sc as G,
  tr as H,
  nr as I,
  Jc as J,
  cr as K,
  er as L,
  we as M,
  et as N,
  Je as O,
  Le as P,
  yc as Q,
  D as R,
  Hc as S,
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
  F as c,
  Te as d,
  Q as e,
  Dc as f,
  J as g,
  Uc as h,
  q as i,
  g as j,
  Zc as k,
  te as l,
  jc as m,
  Y as n,
  $e as o,
  H as p,
  Oc as q,
  ee as r,
  Bc as s,
  zc as t,
  ic as u,
  qc as v,
  Wc as w,
  Gc as x,
  Qc as y,
  je as z
};
