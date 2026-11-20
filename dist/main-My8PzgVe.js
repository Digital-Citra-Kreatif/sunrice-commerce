const me = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Y = me;
function Pe(e) {
  Y = { ...me, ...e ?? {} };
}
function de(e, t = Y) {
  const c = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return c ? `-${h}` : h;
}
function ue(e, t = Y) {
  let c = e.replace(t.symbol, "").replace(/\s/g, "");
  const r = c.startsWith("-");
  c = c.replace(/^-/, "").split(t.thousands).join("");
  const [o, i = ""] = c.split(t.decimal);
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
}, G = {
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
  formatMoney: de,
  parseMoney: ue,
  components: {}
};
function Me() {
  window.SunriceCommerce = G;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const c = e.shift();
      try {
        c?.(G);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...c) => (c.forEach((r) => r(G)), e.length)), window.SunriceCommerceQueue = e;
}
const f = globalThis.Sunrice?.modules?.react;
if (!f)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const _e = f.Activity, De = f.Children, Ie = f.Component, Ae = f.Fragment, Fe = f.Profiler, Re = f.PureComponent, je = f.StrictMode, Oe = f.Suspense, He = f.ViewTransition, Ve = f.act, ze = f.addTransitionType, Be = f.cache, Ue = f.cacheSignal, We = f.captureOwnerStack, qe = f.cloneElement, Ke = f.createContext, Ge = f.createElement, Qe = f.createRef, Xe = f.forwardRef, Ye = f.isValidElement, Ze = f.lazy, Je = f.memo, et = f.startTransition, tt = f.unstable_useCacheRefresh, nt = f.use, ct = f.useActionState, rt = f.useCallback, st = f.useContext, ot = f.useDebugValue, at = f.useDeferredValue, it = f.useEffect, lt = f.useEffectEvent, mt = f.useId, dt = f.useImperativeHandle, ut = f.useInsertionEffect, pt = f.useLayoutEffect, gt = f.useMemo, ht = f.useOptimistic, ft = f.useReducer, X = f.useRef, Z = f.useState, bt = f.useSyncExternalStore, yt = f.useTransition, vt = f.version, St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: _e,
  Children: De,
  Component: Ie,
  Fragment: Ae,
  Profiler: Fe,
  PureComponent: Re,
  StrictMode: je,
  Suspense: Oe,
  ViewTransition: He,
  act: Ve,
  addTransitionType: ze,
  cache: Be,
  cacheSignal: Ue,
  captureOwnerStack: We,
  cloneElement: qe,
  createContext: Ke,
  createElement: Ge,
  createRef: Qe,
  default: f,
  forwardRef: Xe,
  isValidElement: Ye,
  lazy: Ze,
  memo: Je,
  startTransition: et,
  unstable_useCacheRefresh: tt,
  use: nt,
  useActionState: ct,
  useCallback: rt,
  useContext: st,
  useDebugValue: ot,
  useDeferredValue: at,
  useEffect: it,
  useEffectEvent: lt,
  useId: mt,
  useImperativeHandle: dt,
  useInsertionEffect: ut,
  useLayoutEffect: pt,
  useMemo: gt,
  useOptimistic: ht,
  useReducer: ft,
  useRef: X,
  useState: Z,
  useSyncExternalStore: bt,
  useTransition: yt,
  version: vt
}, Symbol.toStringTag, { value: "Module" })), M = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!M)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
M.App;
M.Deferred;
M.Form;
const Ct = M.Head;
M.InfiniteScroll;
const xt = M.Link;
M.WhenMounted;
M.WhenVisible;
M.config;
M.createInertiaApp;
M.http;
M.progress;
M.resetLayoutProps;
const wt = M.router;
M.setLayoutProps;
const Nt = M.useForm;
M.useFormContext;
M.useHttp;
const Tt = M.usePage;
M.usePoll;
M.usePrefetch;
M.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const kt = s.Badge, $t = s.Button, Et = s.Card, Lt = s.CardContent, Pt = s.CardDescription, Mt = s.CardFooter, _t = s.CardHeader, Dt = s.cardSummary, It = s.CardTitle, At = s.Checkbox, Ft = s.CodeEditor, Rt = s.CollapsibleCard, jt = s.CollapsibleCardGroup, Ot = s.Command, Ht = s.CommandEmpty, Vt = s.CommandGroup, zt = s.CommandInput, Bt = s.CommandItem, Ut = s.CommandList, Wt = s.CommandSeparator, qt = s.DatePicker, Kt = s.DeveloperHelp, Gt = s.Dialog, Qt = s.DialogContent, Xt = s.DialogDescription, Yt = s.DialogFooter, Zt = s.DialogHeader, Jt = s.DialogTitle, en = s.DialogTrigger, tn = s.DropdownMenu, nn = s.DropdownMenuCheckboxItem, cn = s.DropdownMenuContent, rn = s.DropdownMenuItem, sn = s.DropdownMenuLabel, on = s.DropdownMenuSeparator, an = s.DropdownMenuTrigger, ln = s.FormSections, mn = s.Input, dn = s.KeptEditsNotice, un = s.Label, pn = s.LanguageTabs, gn = s.LinkAttributes, hn = s.LinkSourcePicker, fn = s.MediaPickerInput, bn = s.moveItem, yn = s.PageHeader, vn = s.Popover, Sn = s.PopoverAnchor, Cn = s.PopoverContent, xn = s.PopoverTrigger, wn = s.registerCommandSource, Nn = s.RichTextEditor, Tn = s.Select, kn = s.SelectContent, $n = s.SelectItem, En = s.SelectTrigger, Ln = s.SelectValue, Pn = s.Separator, Mn = s.SettingsLayout, _n = s.SettingsNav, Dn = s.Skeleton, In = s.SortableHandle, An = s.SortableList, Fn = s.Switch, Rn = s.Table, jn = s.TableBody, On = s.TableCell, Hn = s.TableHead, Vn = s.TableHeader, zn = s.TableRow, Bn = s.Tabs, Un = s.TabsContent, Wn = s.TabsList, qn = s.TabsTrigger, Kn = s.Textarea, Gn = s.Tooltip, Qn = s.TooltipContent, Xn = s.TooltipTrigger, Yn = s.toast, Zn = s.TrashBanner, Jn = s.TrashHint, ec = s.TrashTitle, pe = s.useBreadcrumbs, tc = s.useEditLock, nc = s.useTablePreferences, cc = s.useUnsavedChanges, rc = s.ViewingNotice, ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: kt,
  Button: $t,
  Card: Et,
  CardContent: Lt,
  CardDescription: Pt,
  CardFooter: Mt,
  CardHeader: _t,
  CardTitle: It,
  Checkbox: At,
  CodeEditor: Ft,
  CollapsibleCard: Rt,
  CollapsibleCardGroup: jt,
  Command: Ot,
  CommandEmpty: Ht,
  CommandGroup: Vt,
  CommandInput: zt,
  CommandItem: Bt,
  CommandList: Ut,
  CommandSeparator: Wt,
  DatePicker: qt,
  DeveloperHelp: Kt,
  Dialog: Gt,
  DialogContent: Qt,
  DialogDescription: Xt,
  DialogFooter: Yt,
  DialogHeader: Zt,
  DialogTitle: Jt,
  DialogTrigger: en,
  DropdownMenu: tn,
  DropdownMenuCheckboxItem: nn,
  DropdownMenuContent: cn,
  DropdownMenuItem: rn,
  DropdownMenuLabel: sn,
  DropdownMenuSeparator: on,
  DropdownMenuTrigger: an,
  FormSections: ln,
  Input: mn,
  KeptEditsNotice: dn,
  Label: un,
  LanguageTabs: pn,
  LinkAttributes: gn,
  LinkSourcePicker: hn,
  MediaPickerInput: fn,
  PageHeader: yn,
  Popover: vn,
  PopoverAnchor: Sn,
  PopoverContent: Cn,
  PopoverTrigger: xn,
  RichTextEditor: Nn,
  Select: Tn,
  SelectContent: kn,
  SelectItem: $n,
  SelectTrigger: En,
  SelectValue: Ln,
  Separator: Pn,
  SettingsLayout: Mn,
  SettingsNav: _n,
  Skeleton: Dn,
  SortableHandle: In,
  SortableList: An,
  Switch: Fn,
  Table: Rn,
  TableBody: jn,
  TableCell: On,
  TableHead: Hn,
  TableHeader: Vn,
  TableRow: zn,
  Tabs: Bn,
  TabsContent: Un,
  TabsList: Wn,
  TabsTrigger: qn,
  Textarea: Kn,
  Tooltip: Gn,
  TooltipContent: Qn,
  TooltipTrigger: Xn,
  TrashBanner: Zn,
  TrashHint: Jn,
  TrashTitle: ec,
  ViewingNotice: rc,
  cardSummary: Dt,
  moveItem: bn,
  registerCommandSource: wn,
  toast: Yn,
  useBreadcrumbs: pe,
  useEditLock: tc,
  useTablePreferences: nc,
  useUnsavedChanges: cc
}, Symbol.toStringTag, { value: "Module" })), ne = 3, he = () => window.Sunrice, D = St, F = ge, W = {
  router: wt,
  Link: xt,
  Head: Ct,
  usePage: Tt,
  useForm: Nt
}, jc = F.toast, sc = pe;
function B(e = "") {
  return e.startsWith("/") ? e : he().adminUrl(e);
}
async function J(e, t = {}) {
  const c = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...c ? { "X-CSRF-TOKEN": c } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function oc(e) {
  const t = he();
  if (t.version !== ne)
    throw new Error(`[commerce] This bundle was built for admin runtime ${ne}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [c, r] of Object.entries(e))
    t.registerPageLoader(c, r);
}
const ac = {
  "Commerce/Confirmations/Index": () => import("./Index-omXw-dvq.js"),
  "Commerce/Customers/Show": () => import("./Show-BCHyBznJ.js"),
  "Commerce/Dashboard": () => import("./Dashboard-DjbwHC-e.js"),
  "Commerce/Inventory/Index": () => import("./Index-CGz0Mzdk.js"),
  "Commerce/Loyalty/Show": () => import("./Show-BspVmlb3.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-s2WE2Grd.js"),
  "Commerce/Marketing/Report": () => import("./Report-Yo1_upwu.js"),
  "Commerce/Orders/Editor": () => import("./Editor-D5SNFDww.js"),
  "Commerce/Orders/Show": () => import("./Show-DDak-Rsl.js"),
  "Commerce/Products/Index": () => import("./Index-DTfW172U.js"),
  "Commerce/Products/Import": () => import("./Import-lei5Qhus.js"),
  "Commerce/Reports/Show": () => import("./Show-Ba8Z18sr.js"),
  "Commerce/Settings/Section": () => import("./Section-DC6mKih4.js"),
  "Commerce/Settings/Emails": () => import("./Emails-DwaYpy7b.js"),
  "Commerce/Settings/Features": () => import("./Features-DhAr10jT.js"),
  "Commerce/Settings/Payments": () => import("./Payments-Bw74h7E-.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-BbIQHkzC.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-DJv-3d3N.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-BXoJA9sr.js")
};
function ic() {
  oc(ac);
}
const q = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!q)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const lc = q.Fragment, n = q.jsx, g = q.jsxs;
q.jsx;
const ce = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function fe(e, t) {
  const c = e.condition;
  if (!c) return !0;
  const r = "rules" in c ? c.rules : [c];
  if (r.length === 0) return !0;
  const o = r.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(ce).includes(ce(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
  });
  return "rules" in c && c.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function ee(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((c) => typeof c == "object" && c !== null ? { value: String(c.value), label: String(c.label ?? c.value) } : { value: String(c), label: String(c) }) : [];
}
function mc(e, t) {
  const c = {};
  for (const [r, o] of Object.entries(e))
    r === t ? c[""] = o : r.startsWith(`${t}.`) && (c[r.slice(t.length + 1)] = o);
  return c;
}
function dc(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const z = "__none", be = "__empty", ye = (e) => e === "" ? be : e;
function uc(e, t) {
  return e == null || e === "" && !t.some((c) => c.value === "") ? z : ye(String(e));
}
function pc(e, t) {
  return e === z ? null : e === be ? "" : t ? Number(e) : e;
}
const gc = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function te(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((c) => fe(c, t) && !gc.has(c.type) && !c.config?.secret).flatMap((c) => {
    const r = t[c.handle];
    if (c.type === "group") return te(c.fields ?? [], r);
    if (c.type === "select" || c.type === "commerce_choices") {
      const o = ee(c), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(i).join(", ") : r == null ? r : i(r)];
    }
    return [r];
  });
}
function ve(e) {
  var t, c, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (c = ve(e[t])) && (r && (r += " "), r += c);
  } else for (c in e) e[c] && (r && (r += " "), r += c);
  return r;
}
function hc() {
  for (var e, t, c = 0, r = "", o = arguments.length; c < o; c++) (e = arguments[c]) && (t = ve(e)) && (r && (r += " "), r += t);
  return r;
}
function H(...e) {
  return hc(e);
}
function j({ className: e, children: t }) {
  return /* @__PURE__ */ n(
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
const Oc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ n("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ n("path", { d: "m21 21-4.3-4.3" })
] }), Hc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ n("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ n("path", { d: "M9 3v18M15 3v18" })
] }), Vc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), zc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Bc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Uc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Wc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "m15 18-6-6 6-6" }) }), qc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "m9 18 6-6-6-6" }) }), fc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "M18 6 6 18M6 6l12 12" }) }), Kc = (e) => /* @__PURE__ */ n(j, { ...e, children: /* @__PURE__ */ n("path", { d: "m14 6 4 4M4 20l4-.8L20 7l-4-4L4 15z" }) });
function bc(e, t) {
  const c = e.trim();
  return t ? c.toUpperCase() : c;
}
function yc(e) {
  return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).map((c) => String(c).trim()).filter((c) => c !== "");
}
function Se({ field: e, value: t, onChange: c, errors: r, id: o, describedBy: i }) {
  const { Button: a, Popover: l, PopoverAnchor: m, PopoverContent: h, PopoverTrigger: T, Command: k, CommandEmpty: w, CommandInput: v, CommandItem: y, CommandList: L } = F, x = e.config ?? {}, d = ee(e), p = x.creatable !== !1, S = x.uppercase === !0, u = yc(t), [N, P] = D.useState(!1), [C, $] = D.useState(""), A = (b) => d.find((R) => R.value === b)?.label ?? b, E = bc(C, S), I = E === "" || d.some((b) => b.value.toLowerCase() === E.toLowerCase() || b.label.toLowerCase() === E.toLowerCase()), V = (b) => c(u.includes(b) ? u.filter((R) => R !== b) : [...u, b]), _ = () => {
    E !== "" && !u.includes(E) && c([...u, E]), $("");
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    /* @__PURE__ */ g(l, { open: N, onOpenChange: (b) => {
      P(b), b || $("");
    }, children: [
      /* @__PURE__ */ n(m, { asChild: !0, children: /* @__PURE__ */ g("div", { className: H(
        "cm:flex cm:min-h-9 cm:w-full cm:flex-wrap cm:items-center cm:gap-1.5 cm:rounded-md cm:border cm:border-input cm:bg-transparent cm:px-2 cm:py-1.5 cm:text-sm cm:shadow-xs",
        "cm:focus-within:ring-2 cm:focus-within:ring-ring",
        r?.[""] && "cm:border-destructive"
      ), children: [
        u.map((b) => /* @__PURE__ */ g("span", { className: "cm:inline-flex cm:items-center cm:gap-1 cm:rounded cm:bg-muted cm:py-0.5 cm:pr-1 cm:pl-2 cm:text-xs cm:font-medium", children: [
          A(b),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": `Remove ${A(b)}`,
              className: "cm:rounded cm:p-0.5 cm:hover:bg-background cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring",
              onClick: () => V(b),
              children: /* @__PURE__ */ n(fc, { className: "cm:size-3" })
            }
          )
        ] }, b)),
        /* @__PURE__ */ n(T, { asChild: !0, children: /* @__PURE__ */ g(
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
              /* @__PURE__ */ n("span", { className: "cm:text-muted-foreground", children: u.length === 0 ? String(x.placeholder ?? "Choose…") : "Add…" }),
              /* @__PURE__ */ n("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: "cm:size-4 cm:shrink-0 cm:opacity-50", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ n("path", { d: "m7 15 5 5 5-5M7 9l5-5 5 5" }) })
            ]
          }
        ) })
      ] }) }),
      /* @__PURE__ */ n(h, { className: "cm:w-(--radix-popover-trigger-width) cm:min-w-64 cm:p-0", align: "start", children: /* @__PURE__ */ g(k, { children: [
        /* @__PURE__ */ n(v, { placeholder: p ? "Search or add…" : "Search…", value: C, onValueChange: $ }),
        /* @__PURE__ */ g(L, { children: [
          /* @__PURE__ */ n(w, { children: p && E !== "" ? "Not in the list." : "Nothing found." }),
          p && !I && !u.includes(E) && /* @__PURE__ */ n(y, { value: `__add ${E}`, keywords: [C], onSelect: _, children: /* @__PURE__ */ g("span", { className: "cm:truncate", children: [
            "Add “",
            E,
            "”"
          ] }) }),
          [...d, ...u.filter((b) => !d.some((R) => R.value === b)).map((b) => ({ value: b, label: b }))].map((b) => /* @__PURE__ */ g(y, { value: `${b.label} ${b.value}`, onSelect: () => {
            V(b.value), $("");
          }, children: [
            /* @__PURE__ */ n("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4", u.includes(b.value) ? "cm:opacity-100" : "cm:opacity-0"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ n("path", { d: "M20 6 9 17l-5-5" }) }),
            /* @__PURE__ */ n("span", { className: "cm:truncate", children: b.label })
          ] }, b.value))
        ] })
      ] }) })
    ] }),
    u.length > 1 && /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(a, { type: "button", variant: "ghost", size: "sm", className: "cm:h-7 cm:px-2 cm:text-xs", onClick: () => c([]), children: "Clear all" }) })
  ] });
}
function re(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const c = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${c(t.getMonth() + 1)}-${c(t.getDate())}T${c(t.getHours())}:${c(t.getMinutes())}`;
}
function se(e) {
  return e ? new Date(e).toISOString() : null;
}
function Ce({ value: e, onChange: t, id: c }) {
  const { Input: r, Label: o } = F, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ n(o, { htmlFor: `${c}-start`, children: "Starts" }),
      /* @__PURE__ */ n(
        r,
        {
          id: `${c}-start`,
          type: "datetime-local",
          value: re(i.start),
          onChange: (a) => t({ ...i, start: se(a.target.value) })
        }
      )
    ] }),
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ n(o, { htmlFor: `${c}-end`, children: "Ends" }),
      /* @__PURE__ */ n(
        r,
        {
          id: `${c}-end`,
          type: "datetime-local",
          value: re(i.end),
          onChange: (a) => t({ ...i, end: se(a.target.value) })
        }
      )
    ] })
  ] });
}
function vc({ field: e, id: t, value: c, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = F, h = Array.isArray(c) ? c : [], [T, k] = D.useState({}), [w, v] = D.useState(!1), y = h.filter((d) => !T[d]).join(","), L = typeof e.config?.max == "number" ? e.config.max : null;
  D.useEffect(() => {
    if (!y) return;
    const d = new AbortController(), p = new URLSearchParams();
    return y.split(",").forEach((S) => p.append("ids[]", S)), J(`${B("media/picker")}?${p}`, { signal: d.signal }).then(({ items: S }) => {
      d.signal.aborted || (k((u) => ({ ...u, ...Object.fromEntries(S.map((N) => [N.id, N])) })), v(!1));
    }).catch(() => {
      d.signal.aborted || v(!0);
    }), () => d.abort();
  }, [y]);
  const x = (d) => T[d]?.title || T[d]?.filename || `Image #${d}`;
  return /* @__PURE__ */ g("div", { id: t, className: "cm:grid cm:gap-3", children: [
    h.length > 0 && /* @__PURE__ */ n(l, { items: h, getId: String, getLabel: x, onReorder: o, className: "cm:grid cm:gap-2", children: (d, { handle: p }) => /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2", children: [
      /* @__PURE__ */ n(m, { ...p, label: `Move ${x(d)}` }),
      T[d]?.thumbnail && /* @__PURE__ */ n("img", { src: T[d].thumbnail, alt: "", className: "cm:size-10 cm:rounded cm:object-cover" }),
      /* @__PURE__ */ n("span", { className: "cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm", children: x(d) }),
      h[0] === d && /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: "Cover" }),
      /* @__PURE__ */ n(
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
    (L === null || h.length < L) && /* @__PURE__ */ n(
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
    w && /* @__PURE__ */ n("p", { role: "status", className: "cm:text-sm cm:text-muted-foreground", children: "Image previews could not be loaded." })
  ] });
}
function xe({
  value: e,
  onChange: t,
  id: c,
  placeholder: r,
  allowNull: o = !0,
  invalid: i
}) {
  const { Input: a } = F, l = (w) => w == null ? "" : de(w).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = D.useState(l(e)), [T, k] = D.useState(!1);
  return D.useEffect(() => {
    T || h(l(e));
  }, [e, T]), /* @__PURE__ */ n(
    a,
    {
      id: c,
      inputMode: "decimal",
      value: m,
      placeholder: r,
      "aria-invalid": i || void 0,
      onFocus: () => k(!0),
      onChange: (w) => {
        h(w.target.value);
        const v = w.target.value.trim() === "" ? o ? null : 0 : ue(w.target.value);
        (v !== null || w.target.value.trim() === "") && t(v);
      },
      onBlur: () => {
        k(!1), h(l(e));
      }
    }
  );
}
function we() {
  const { props: e } = W.usePage(), t = e.commerce ?? {};
  return Pe(t.currency), t;
}
function Ne({ field: e, value: t, onChange: c, errors: r, id: o }) {
  return we(), /* @__PURE__ */ n(
    xe,
    {
      id: o,
      value: t,
      onChange: c,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const oe = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Sc = { province: 1, city: 2, district: 3, village: 4 }, K = /* @__PURE__ */ new Map();
function Cc(e, t) {
  const c = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return K.has(c) || K.set(c, J(c).then((r) => r.data).catch(() => (K.delete(c), []))), K.get(c);
}
function Te({ field: e, value: t, onChange: c, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: h } = F, T = e.config ?? {}, k = String(T.api ?? ""), w = Sc[T.depth ?? "district"] ?? 3, v = T.country_options ?? [], y = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, L = oe.slice(0, w), [x, d] = D.useState({}), p = [null, y.province_code, y.city_code, y.district_code];
  D.useEffect(() => {
    y.country !== "ID" || !k || L.forEach((u, N) => {
      const P = p[N];
      N > 0 && !P || Cc(k, P).then((C) => d(($) => ({ ...$, [u.key]: C })));
    });
  }, [k, y.country, y.province_code, y.city_code, y.district_code]);
  const S = (u, N) => {
    const P = { ...y };
    P[L[u].key] = N || null, oe.slice(u + 1).forEach((C) => {
      P[C.key] = null;
    }), c(P);
  };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-x-5 cm:gap-y-4 cm:sm:grid-cols-2", children: [
    v.length > 0 && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ n(o, { htmlFor: `${r}-country`, children: "Country" }),
      /* @__PURE__ */ g(
        i,
        {
          value: y.country,
          onValueChange: (u) => c({ country: u, province_code: null, city_code: null, district_code: null, village_code: null }),
          children: [
            /* @__PURE__ */ n(a, { id: `${r}-country`, className: "cm:w-full", children: /* @__PURE__ */ n(l, {}) }),
            /* @__PURE__ */ n(m, { children: v.map((u) => /* @__PURE__ */ n(h, { value: u.value, children: u.label }, u.value)) })
          ]
        }
      )
    ] }),
    y.country === "ID" && L.map((u, N) => /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ n(o, { htmlFor: `${r}-${u.key}`, children: u.label }),
      /* @__PURE__ */ g(
        i,
        {
          value: y[u.key] ?? z,
          disabled: N > 0 && !p[N],
          onValueChange: (P) => S(N, P === z ? "" : P),
          children: [
            /* @__PURE__ */ n(a, { id: `${r}-${u.key}`, className: "cm:w-full", children: /* @__PURE__ */ n(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ g(m, { children: [
              /* @__PURE__ */ n(h, { value: z, children: "Choose…" }),
              (x[u.key] ?? []).map((P) => /* @__PURE__ */ n(h, { value: P.code, children: P.name }, P.code))
            ] })
          ]
        }
      )
    ] }, u.key))
  ] });
}
function ke({ field: e, value: t, onChange: c, id: r }) {
  const { Input: o, Badge: i } = F, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", h = Array.isArray(t) ? t : [], [T, k] = D.useState(""), [w, v] = D.useState([]), [y, L] = D.useState(!1);
  D.useEffect(() => {
    if (!y) return;
    const p = new URLSearchParams({ q: T });
    (a.types ?? []).forEach((u) => p.append("types[]", u)), (a.taxonomies ?? []).forEach((u) => p.append("taxonomies[]", u));
    const S = setTimeout(() => J(`${a.api}?${p}`).then((u) => v(u.data)).catch(() => v([])), 200);
    return () => clearTimeout(S);
  }, [T, y]);
  const x = (p) => h.some((S) => S.type === p.type && S.id === p.id), d = { product: "Product", variant: "Variant", term: "Category/brand" };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    h.length > 0 && /* @__PURE__ */ n("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: h.map((p) => /* @__PURE__ */ g(i, { variant: "secondary", className: "cm:gap-1", children: [
      /* @__PURE__ */ g("span", { className: "cm:text-muted-foreground", children: [
        d[p.type],
        ":"
      ] }),
      " ",
      p.label,
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `Remove ${p.label}`, onClick: () => c(h.filter((S) => !(S.type === p.type && S.id === p.id))), children: "×" })
    ] }, `${p.type}:${p.id}`)) }),
    /* @__PURE__ */ g("div", { className: "cm:relative", children: [
      /* @__PURE__ */ n(
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
      y && w.length > 0 && /* @__PURE__ */ n("ul", { className: "cm:absolute cm:z-20 cm:mt-1 cm:max-h-72 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: w.map((p) => /* @__PURE__ */ n("li", { children: /* @__PURE__ */ g(
        "button",
        {
          type: "button",
          disabled: x(p),
          className: "cm:flex cm:w-full cm:justify-between cm:gap-3 cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted cm:disabled:opacity-50",
          onMouseDown: (S) => S.preventDefault(),
          onClick: () => {
            const S = { type: p.type, id: p.id, label: p.label };
            c(l ? [S] : [...h, S]), k(""), l && L(!1);
          },
          children: [
            /* @__PURE__ */ n("span", { children: p.label }),
            /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: p.group })
          ]
        }
      ) }, `${p.type}:${p.id}`)) })
    ] })
  ] });
}
const xc = D.lazy(() => import("./ProductEditor-CG1ibcbm.js")), wc = (e) => D.createElement(D.Suspense, { fallback: null }, D.createElement(xc, e)), Nc = {
  commerce_money: Ne,
  commerce_datetime_range: Ce,
  commerce_region: Te,
  commerce_targets: ke,
  commerce_product: wc,
  commerce_gallery: vc,
  commerce_choices: Se
};
function Tc() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Nc).forEach(([t, c]) => e.registerFieldInput(t, c)));
}
const kc = D.lazy(() => import("./ChartImpl-KoCFzGpx.js"));
function $c(e) {
  const t = /* @__PURE__ */ n("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ n(D.Suspense, { fallback: t, children: /* @__PURE__ */ n(kc, { ...e }) });
}
function Ec({ title: e, description: t, action: c }) {
  return /* @__PURE__ */ g("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ n("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ n("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    c && /* @__PURE__ */ n("div", { className: "cm:mt-2", children: c })
  ] });
}
function Gc() {
  const { Card: e, CardContent: t } = F;
  return /* @__PURE__ */ n(e, { "aria-hidden": "true", children: /* @__PURE__ */ g(t, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ n("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ n("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ n("span", { className: "cm:h-4" })
  ] }) });
}
function Lc({ kpi: e }) {
  const { Card: t, CardContent: c } = F, { Link: r } = W, o = e.change ?? null, i = /* @__PURE__ */ g(c, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ n("span", { className: "cm:text-sm cm:text-muted-foreground", children: e.label }),
    /* @__PURE__ */ n("span", { className: "cm:text-2xl cm:font-semibold cm:tabular-nums", children: e.value }),
    o !== null && /* @__PURE__ */ g(
      "span",
      {
        className: H("cm:text-xs cm:font-medium", o > 0 ? "cm:text-emerald-600" : o < 0 ? "cm:text-red-600" : "cm:text-muted-foreground"),
        title: "Compared with the previous period",
        children: [
          /* @__PURE__ */ n("span", { "aria-hidden": !0, children: o > 0 ? "▲" : o < 0 ? "▼" : "•" }),
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
    e.hint && /* @__PURE__ */ n("span", { className: "cm:text-xs cm:text-muted-foreground", children: e.hint })
  ] });
  return /* @__PURE__ */ n(t, { children: e.href ? /* @__PURE__ */ n(r, { href: B(e.href), className: "cm:block", children: i }) : i });
}
function $e({ title: e, description: t, actions: c, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = W, { PageHeader: m } = F;
  return /* @__PURE__ */ g(lc, { children: [
    /* @__PURE__ */ n(l, { title: e }),
    /* @__PURE__ */ n(m, { title: e, description: t, actions: c, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
const U = ge, Pc = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: Ne,
  commerce_datetime_range: Ce,
  commerce_region: Te,
  commerce_targets: ke,
  commerce_choices: Se
}, ae = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function Q({ fields: e, values: t, onChange: c, errors: r = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = r;
  return /* @__PURE__ */ n("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => fe(m, t ?? {})).map((m) => /* @__PURE__ */ n("div", { className: H(
    "cm:min-w-0",
    ae[m.width ?? 100] ?? ae[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ n(
    Mc,
    {
      field: m,
      value: t?.[m.handle],
      path: `${o}.${m.handle}`,
      errors: l,
      hideLabel: !!i && m.label === i,
      onChange: (h) => c({ ...t, [m.handle]: h })
    }
  ) }, m.handle)) });
}
function Mc({ field: e, value: t, onChange: c, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = U, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${l}-help` : void 0, T = [h, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, k = e.label ?? e.handle, w = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ g("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? k : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ n("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: k }),
        /* @__PURE__ */ n("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ n("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ n(ie, { field: e, value: t, onChange: c, id: l, path: r, errors: o, describedBy: T, label: k }),
    i && h && /* @__PURE__ */ n("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ n("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !w && /* @__PURE__ */ g(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      k,
      e.required && /* @__PURE__ */ n("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ n(ie, { field: e, value: t, onChange: c, id: l, path: r, errors: o, describedBy: T, label: k }),
    h && /* @__PURE__ */ n("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ n("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function ie({ field: e, value: t, onChange: c, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: h, Switch: T, Label: k, MediaPickerInput: w, RichTextEditor: v, Checkbox: y, Select: L, SelectTrigger: x, SelectValue: d, SelectContent: p, SelectItem: S } = U, u = i[o] !== void 0, N = e.config ?? {}, P = Pc[e.type];
  if (P)
    return /* @__PURE__ */ n(P, { field: e, value: t, onChange: c, errors: mc(i, o), id: r, describedBy: a });
  switch (e.type) {
    case "textarea":
      return /* @__PURE__ */ n(
        h,
        {
          id: r,
          rows: 4,
          value: typeof t == "string" ? t : "",
          "aria-invalid": u,
          "aria-describedby": a,
          onChange: (C) => c(C.target.value)
        }
      );
    case "number":
      return /* @__PURE__ */ n(
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
          onChange: (C) => c(dc(C.target.value))
        }
      );
    case "date":
      return /* @__PURE__ */ n(
        m,
        {
          id: r,
          type: "date",
          value: typeof t == "string" ? t : "",
          "aria-invalid": u,
          "aria-describedby": a,
          onChange: (C) => c(C.target.value || null)
        }
      );
    case "toggle":
      return /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ n(T, { id: r, checked: t === !0, "aria-describedby": a, onCheckedChange: (C) => c(C) }),
        /* @__PURE__ */ n(k, { htmlFor: r, children: l })
      ] });
    case "select":
    case "entries":
    case "terms": {
      const C = ee(e), $ = e.type !== "select";
      if (N.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), V = (_, b) => {
          const R = b ? [...I, _] : I.filter((Le) => Le !== _);
          c($ ? R.map(Number) : R);
        };
        return /* @__PURE__ */ n("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: C.map((_) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ n(y, { checked: I.includes(_.value), onCheckedChange: (b) => V(_.value, b === !0) }),
          _.label
        ] }, _.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, E = uc(A, C);
      return /* @__PURE__ */ g(L, { value: E, onValueChange: (I) => c(pc(I, $)), children: [
        /* @__PURE__ */ n(x, { id: r, className: "cm:w-full", "aria-invalid": u, "aria-describedby": a, children: /* @__PURE__ */ n(d, { placeholder: "—" }) }),
        /* @__PURE__ */ g(p, { children: [
          (!e.required || E === z) && /* @__PURE__ */ n(S, { value: z, children: "—" }),
          C.map((I) => /* @__PURE__ */ n(S, { value: ye(I.value), children: I.label }, I.value))
        ] })
      ] });
    }
    case "media":
    case "asset":
      return /* @__PURE__ */ n(
        w,
        {
          id: r,
          value: t ?? null,
          multiple: N.multiple === !0,
          max: N.max,
          invalid: u,
          types: Array.isArray(N.types) ? N.types : N.image_only ? ["image"] : void 0,
          onChange: (C) => c(C)
        }
      );
    case "rich_text":
      return /* @__PURE__ */ n(
        v,
        {
          id: r,
          value: typeof t == "string" ? t : "",
          invalid: u,
          labelledBy: `${r}-label`,
          onChange: (C) => c(C ?? "")
        }
      );
    case "group":
      return N.per_language === !0 ? /* @__PURE__ */ n(Dc, { field: e, value: t, onChange: c, path: o, errors: i }) : /* @__PURE__ */ n(Q, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (C) => c(C) });
    case "repeater":
      return /* @__PURE__ */ n(_c, { field: e, value: t, onChange: c, path: o, errors: i, label: l });
    default:
      return /* @__PURE__ */ n(
        m,
        {
          id: r,
          value: typeof t == "string" || typeof t == "number" ? String(t) : "",
          "aria-invalid": u,
          "aria-describedby": a,
          maxLength: void 0,
          placeholder: N.placeholder,
          onChange: (C) => c(C.target.value)
        }
      );
  }
}
function _c({ field: e, value: t, onChange: c, path: r, errors: o, label: i }) {
  const { Button: a } = U, l = Array.isArray(t) ? t : [], m = X([]), h = X(0);
  for (; m.current.length < l.length; ) m.current.push(h.current++);
  m.current.length = l.length;
  const [T, k] = Z(() => /* @__PURE__ */ new Set()), w = (x, d) => {
    m.current = d, c(x);
  }, v = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), y = typeof e.config?.max == "number" ? e.config.max : null, L = (x, d) => x.map((p, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : p);
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const p = m.current[d], S = `${r}.${d}`, u = Object.keys(o).some((_) => _ === S || _.startsWith(`${S}.`)), N = e.config?.summary_targets, P = typeof N == "string" ? x[N] : null, C = Array.isArray(P) ? P.flatMap((_) => typeof _?.label == "string" && _.label ? [_.label] : []) : [], A = (C.length > 1 ? `${C[0]} +${C.length - 1}` : C[0]) ?? U.cardSummary(te(e.fields ?? [], x)), E = u || T.has(p) || A === "", I = () => k((_) => {
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
                /* @__PURE__ */ n("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", className: H("cm:size-4 cm:shrink-0 cm:text-muted-foreground cm:transition-transform", !E && "cm:-rotate-90"), fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ n("path", { d: "m6 9 6 6 6-6" }) }),
                /* @__PURE__ */ g("span", { className: "cm:shrink-0 cm:tabular-nums cm:text-muted-foreground", children: [
                  d + 1,
                  "."
                ] }),
                /* @__PURE__ */ n("span", { className: "cm:truncate cm:font-medium", children: A || `New ${i.toLowerCase()}` })
              ]
            }
          ),
          /* @__PURE__ */ n(
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
          /* @__PURE__ */ n(
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
        /* @__PURE__ */ n("div", { id: V, hidden: !E, className: "cm:border-t cm:p-4", children: /* @__PURE__ */ n(
          Q,
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
    /* @__PURE__ */ n("div", { children: /* @__PURE__ */ g(
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
function Dc({ field: e, value: t, onChange: c, path: r, errors: o }) {
  const { LanguageTabs: i } = U, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), h = (v) => Object.keys(o).some((y) => y === `${r}.${v}` || y.startsWith(`${r}.${v}.`)), [T, k] = Z(() => l.find((v) => h(v.handle))?.handle ?? m), w = (v) => a[v] === null || a[v] === void 0 || a[v] === "";
  return /* @__PURE__ */ n(
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
        /* @__PURE__ */ n(
          Q,
          {
            fields: l.filter((y) => y.handle === v),
            values: a,
            errors: o,
            pathPrefix: r,
            section: l.find((y) => y.handle === v)?.label ?? null,
            onChange: (y) => c(y)
          }
        )
      )
    }
  );
}
function Ic({ form: e, id: t, storageKey: c, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: T } = F, k = F.cardSummary, { data: w, setData: v, errors: y, processing: L, isDirty: x, ...d } = W.useForm({ values: e.values }), p = D.useRef(!1), S = () => {
    p.current || (p.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      p.current = !1;
    } }));
  };
  D.useEffect(() => o?.(L), [L, o]), T(x, S);
  const u = e.fields, N = e.sections?.length ? e.sections : [{ title: null, description: null, fields: u.map(($) => $.handle) }], P = Object.keys(y), C = ($, A = null) => /* @__PURE__ */ n(
    Q,
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
    y.section && /* @__PURE__ */ n("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: y.section }),
    /* @__PURE__ */ n(h, { className: "cm:gap-6", children: N.map(($, A) => $.title === null ? /* @__PURE__ */ n(a, { children: /* @__PURE__ */ n(l, { children: C($.fields) }) }, `untitled-${A}`) : /* @__PURE__ */ n(
      m,
      {
        title: $.title,
        description: $.description ?? void 0,
        summary: k(te(u.filter((E) => $.fields.includes(E.handle)), w.values)) || void 0,
        storageKey: c ? `${c}:${$.title}` : void 0,
        hasErrors: $.fields.some((E) => P.some((I) => I === `values.${E}` || I.startsWith(`values.${E}.`))),
        children: C($.fields, $.title)
      },
      $.title
    )) }),
    (t === void 0 || r) && /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
      t === void 0 && /* @__PURE__ */ n(i, { type: "submit", disabled: L, children: e.submitLabel }),
      r
    ] })
  ] });
}
function Ee({ items: e, current: t, label: c = "Sections" }) {
  const { Link: r } = W;
  return /* @__PURE__ */ n("nav", { "aria-label": c, className: "cm:grid cm:gap-1 cm:max-lg:grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))]", children: e.map((o) => /* @__PURE__ */ n(
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
function Ac({ sections: e, current: t, title: c, description: r, primary: o, parent: i, children: a }) {
  we();
  const l = i ? { label: i.label, href: B(i.href) } : void 0;
  return sc([{ label: "Shop" }, { label: "Store settings", href: B("commerce/settings") }, ...l ? [l] : [], { label: c }]), /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ n(Ee, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
      /* @__PURE__ */ n($e, { title: c, description: r, primary: o, back: l }),
      a
    ] })
  ] });
}
const le = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Fc({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ n("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", le[e] ?? le.neutral), children: t });
}
function Rc() {
  Object.assign(G.components, { Chart: $c, EmptyState: Ec, KpiCard: Lc, MoneyInput: xe, PageHeader: $e, SchemaFormView: Ic, SectionNav: Ee, SettingsLayout: Ac, StatusBadge: Fc });
}
Me();
Rc();
Tc();
ic();
export {
  pt as $,
  zc as A,
  qc as B,
  $c as C,
  nc as D,
  Ec as E,
  lc as F,
  Ye as G,
  Xe as H,
  hc as I,
  Ge as J,
  Gc as K,
  st as L,
  xe as M,
  Ke as N,
  qe as O,
  $e as P,
  St as Q,
  D as R,
  Fc as S,
  ke as T,
  ge as U,
  gt as V,
  X as W,
  fc as X,
  rt as Y,
  it as Z,
  dt as _,
  B as a,
  Je as a0,
  De as a1,
  Ie as a2,
  Re as a3,
  n as b,
  F as c,
  we as d,
  G as e,
  Lc as f,
  de as g,
  Kc as h,
  W as i,
  g as j,
  J as k,
  Ic as l,
  Q as m,
  Te as n,
  H as o,
  Ac as p,
  Z as q,
  Oc as r,
  Vc as s,
  jc as t,
  sc as u,
  Hc as v,
  Bc as w,
  Uc as x,
  Ae as y,
  Wc as z
};
