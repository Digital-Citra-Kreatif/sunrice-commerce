const de = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Q = de;
function Me(e) {
  Q = { ...de, ...e ?? {} };
}
function Z(e, t = Q) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", f = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${f}` : f;
}
const Pe = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 2 });
function Vc(e, t = Q) {
  const n = Math.abs(e) / 10 ** t.decimals;
  if (n < 1e3)
    return Z(e, t);
  const r = Pe.format(n), o = t.space ? " " : "";
  return (e < 0 ? "-" : "") + (t.position === "left" ? `${t.symbol}${o}${r}` : `${r}${o}${t.symbol}`);
}
function ue(e, t = Q) {
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
}, G = {
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
  formatMoney: Z,
  parseMoney: ue,
  components: {}
};
function _e() {
  window.SunriceCommerce = G;
  const e = window.SunriceCommerceQueue ?? [];
  (() => {
    for (; e.length > 0; ) {
      const n = e.shift();
      try {
        n?.(G);
      } catch (r) {
        console.error("SunriceCommerceQueue call failed", r);
      }
    }
  })(), e.push = ((...n) => (n.forEach((r) => r(G)), e.length)), window.SunriceCommerceQueue = e;
}
const y = globalThis.Sunrice?.modules?.react;
if (!y)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const Ie = y.Activity, De = y.Children, Ae = y.Component, Fe = y.Fragment, Re = y.Profiler, je = y.PureComponent, Oe = y.StrictMode, He = y.Suspense, Ve = y.ViewTransition, ze = y.act, Be = y.addTransitionType, Ue = y.cache, We = y.cacheSignal, qe = y.captureOwnerStack, Ke = y.cloneElement, Ge = y.createContext, Qe = y.createElement, Xe = y.createRef, Ye = y.forwardRef, Ze = y.isValidElement, Je = y.lazy, et = y.memo, tt = y.startTransition, nt = y.unstable_useCacheRefresh, ct = y.use, rt = y.useActionState, st = y.useCallback, ot = y.useContext, at = y.useDebugValue, it = y.useDeferredValue, lt = y.useEffect, mt = y.useEffectEvent, dt = y.useId, ut = y.useImperativeHandle, pt = y.useInsertionEffect, gt = y.useLayoutEffect, ht = y.useMemo, ft = y.useOptimistic, bt = y.useReducer, Y = y.useRef, J = y.useState, yt = y.useSyncExternalStore, vt = y.useTransition, xt = y.version, St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: Ie,
  Children: De,
  Component: Ae,
  Fragment: Fe,
  Profiler: Re,
  PureComponent: je,
  StrictMode: Oe,
  Suspense: He,
  ViewTransition: Ve,
  act: ze,
  addTransitionType: Be,
  cache: Ue,
  cacheSignal: We,
  captureOwnerStack: qe,
  cloneElement: Ke,
  createContext: Ge,
  createElement: Qe,
  createRef: Xe,
  default: y,
  forwardRef: Ye,
  isValidElement: Ze,
  lazy: Je,
  memo: et,
  startTransition: tt,
  unstable_useCacheRefresh: nt,
  use: ct,
  useActionState: rt,
  useCallback: st,
  useContext: ot,
  useDebugValue: at,
  useDeferredValue: it,
  useEffect: lt,
  useEffectEvent: mt,
  useId: dt,
  useImperativeHandle: ut,
  useInsertionEffect: pt,
  useLayoutEffect: gt,
  useMemo: ht,
  useOptimistic: ft,
  useReducer: bt,
  useRef: Y,
  useState: J,
  useSyncExternalStore: yt,
  useTransition: vt,
  version: xt
}, Symbol.toStringTag, { value: "Module" })), _ = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!_)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
_.App;
_.Deferred;
_.Form;
const Ct = _.Head;
_.InfiniteScroll;
const wt = _.Link;
_.WhenMounted;
_.WhenVisible;
_.config;
_.createInertiaApp;
_.http;
_.progress;
_.resetLayoutProps;
const Nt = _.router;
_.setLayoutProps;
const kt = _.useForm;
_.useFormContext;
_.useHttp;
const Tt = _.usePage;
_.usePoll;
_.usePrefetch;
_.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const $t = s.Badge, Et = s.Button, Lt = s.Card, Mt = s.CardContent, Pt = s.CardDescription, _t = s.CardFooter, It = s.CardHeader, Dt = s.cardSummary, At = s.CardTitle, Ft = s.Checkbox, Rt = s.CodeEditor, jt = s.CollapsibleCard, Ot = s.CollapsibleCardGroup, Ht = s.Command, Vt = s.CommandEmpty, zt = s.CommandGroup, Bt = s.CommandInput, Ut = s.CommandItem, Wt = s.CommandList, qt = s.CommandSeparator, Kt = s.DatePicker, Gt = s.DeveloperHelp, Qt = s.Dialog, Xt = s.DialogContent, Yt = s.DialogDescription, Zt = s.DialogFooter, Jt = s.DialogHeader, en = s.DialogTitle, tn = s.DialogTrigger, nn = s.DropdownMenu, cn = s.DropdownMenuCheckboxItem, rn = s.DropdownMenuContent, sn = s.DropdownMenuItem, on = s.DropdownMenuLabel, an = s.DropdownMenuSeparator, ln = s.DropdownMenuTrigger, mn = s.FormSections, dn = s.Input, un = s.KeptEditsNotice, pn = s.Label, gn = s.LanguageTabs, hn = s.LinkAttributes, fn = s.LinkSourcePicker, bn = s.MediaPickerInput, yn = s.moveItem, vn = s.PageHeader, xn = s.Popover, Sn = s.PopoverAnchor, Cn = s.PopoverContent, wn = s.PopoverTrigger, Nn = s.registerCommandSource, kn = s.RichTextEditor, Tn = s.Select, $n = s.SelectContent, En = s.SelectItem, Ln = s.SelectTrigger, Mn = s.SelectValue, Pn = s.Separator, _n = s.SettingsLayout, In = s.SettingsNav, Dn = s.Skeleton, An = s.SortableHandle, Fn = s.SortableList, Rn = s.Switch, jn = s.Table, On = s.TableBody, Hn = s.TableCell, Vn = s.TableHead, zn = s.TableHeader, Bn = s.TableRow, Un = s.Tabs, Wn = s.TabsContent, qn = s.TabsList, Kn = s.TabsTrigger, Gn = s.Textarea, Qn = s.Tooltip, Xn = s.TooltipContent, Yn = s.TooltipTrigger, Zn = s.toast, Jn = s.TrashBanner, ec = s.TrashHint, tc = s.TrashTitle, pe = s.useBreadcrumbs, nc = s.useEditLock, cc = s.useTablePreferences, rc = s.useUnsavedChanges, sc = s.ViewingNotice, ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: $t,
  Button: Et,
  Card: Lt,
  CardContent: Mt,
  CardDescription: Pt,
  CardFooter: _t,
  CardHeader: It,
  CardTitle: At,
  Checkbox: Ft,
  CodeEditor: Rt,
  CollapsibleCard: jt,
  CollapsibleCardGroup: Ot,
  Command: Ht,
  CommandEmpty: Vt,
  CommandGroup: zt,
  CommandInput: Bt,
  CommandItem: Ut,
  CommandList: Wt,
  CommandSeparator: qt,
  DatePicker: Kt,
  DeveloperHelp: Gt,
  Dialog: Qt,
  DialogContent: Xt,
  DialogDescription: Yt,
  DialogFooter: Zt,
  DialogHeader: Jt,
  DialogTitle: en,
  DialogTrigger: tn,
  DropdownMenu: nn,
  DropdownMenuCheckboxItem: cn,
  DropdownMenuContent: rn,
  DropdownMenuItem: sn,
  DropdownMenuLabel: on,
  DropdownMenuSeparator: an,
  DropdownMenuTrigger: ln,
  FormSections: mn,
  Input: dn,
  KeptEditsNotice: un,
  Label: pn,
  LanguageTabs: gn,
  LinkAttributes: hn,
  LinkSourcePicker: fn,
  MediaPickerInput: bn,
  PageHeader: vn,
  Popover: xn,
  PopoverAnchor: Sn,
  PopoverContent: Cn,
  PopoverTrigger: wn,
  RichTextEditor: kn,
  Select: Tn,
  SelectContent: $n,
  SelectItem: En,
  SelectTrigger: Ln,
  SelectValue: Mn,
  Separator: Pn,
  SettingsLayout: _n,
  SettingsNav: In,
  Skeleton: Dn,
  SortableHandle: An,
  SortableList: Fn,
  Switch: Rn,
  Table: jn,
  TableBody: On,
  TableCell: Hn,
  TableHead: Vn,
  TableHeader: zn,
  TableRow: Bn,
  Tabs: Un,
  TabsContent: Wn,
  TabsList: qn,
  TabsTrigger: Kn,
  Textarea: Gn,
  Tooltip: Qn,
  TooltipContent: Xn,
  TooltipTrigger: Yn,
  TrashBanner: Jn,
  TrashHint: ec,
  TrashTitle: tc,
  ViewingNotice: sc,
  cardSummary: Dt,
  moveItem: yn,
  registerCommandSource: Nn,
  toast: Zn,
  useBreadcrumbs: pe,
  useEditLock: nc,
  useTablePreferences: cc,
  useUnsavedChanges: rc
}, Symbol.toStringTag, { value: "Module" })), ce = 3, he = () => window.Sunrice, P = St, A = ge, W = {
  router: Nt,
  Link: wt,
  Head: Ct,
  usePage: Tt,
  useForm: kt
}, zc = A.toast, oc = pe;
function B(e = "") {
  return e.startsWith("/") ? e : he().adminUrl(e);
}
async function ee(e, t = {}) {
  const n = document.querySelector('meta[name="csrf-token"]')?.content, r = await fetch(e, {
    credentials: "same-origin",
    ...t,
    headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...n ? { "X-CSRF-TOKEN": n } : {}, ...t.headers }
  });
  if (!r.ok)
    throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}
function ac(e) {
  const t = he();
  if (t.version !== ce)
    throw new Error(`[commerce] This bundle was built for admin runtime ${ce}, but the panel runs ${t.version}. Update sunrice/commerce.`);
  for (const [n, r] of Object.entries(e))
    t.registerPageLoader(n, r);
}
const ic = {
  "Commerce/Confirmations/Index": () => import("./Index-D3fQLz1x.js"),
  "Commerce/Customers/Show": () => import("./Show-DqDa8TE9.js"),
  "Commerce/Dashboard": () => import("./Dashboard-DOGYR9R9.js"),
  "Commerce/Inventory/Index": () => import("./Index-hH8slOeB.js"),
  "Commerce/Loyalty/Show": () => import("./Show-DAP0WW87.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-DTJNATIR.js"),
  "Commerce/Marketing/Report": () => import("./Report-D_ICPtVt.js"),
  "Commerce/Orders/Editor": () => import("./Editor-CE4bEect.js"),
  "Commerce/Orders/Show": () => import("./Show-B9UfEzCN.js"),
  "Commerce/Products/Index": () => import("./Index-Dkuj1ICh.js"),
  "Commerce/Products/Import": () => import("./Import-DaEf58Ud.js"),
  "Commerce/Reports/Show": () => import("./Show-BlFq-Wdf.js"),
  "Commerce/Settings/Section": () => import("./Section-Dty__AP6.js"),
  "Commerce/Settings/Emails": () => import("./Emails-BbGxv8y4.js"),
  "Commerce/Settings/Features": () => import("./Features-D9Qp-iIc.js"),
  "Commerce/Settings/Payments": () => import("./Payments-D3xuty73.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-uxIymaDZ.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-g-Jgi_pi.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-B6Z5k8z1.js")
};
function lc() {
  ac(ic);
}
const q = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!q)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const mc = q.Fragment, c = q.jsx, u = q.jsxs;
q.jsx;
const re = (e) => e === !0 ? "true" : e === !1 ? "false" : e == null || typeof e == "object" ? "" : String(e);
function fe(e, t) {
  const n = e.condition;
  if (!n) return !0;
  const r = "rules" in n ? n.rules : [n];
  if (r.length === 0) return !0;
  const o = r.map((i) => {
    const a = t?.[i.field], l = a != null && a !== "" && a !== !1 && !(Array.isArray(a) && a.length === 0), m = (Array.isArray(a) ? a : [a]).map(re).includes(re(i.value));
    return i.operator === "equals" ? m : i.operator === "not_equals" ? !m : i.operator === "filled" ? l : !l;
  });
  return "rules" in n && n.match === "any" ? o.includes(!0) : !o.includes(!1);
}
function te(e) {
  const t = e.config?.options;
  return Array.isArray(t) ? t.map((n) => typeof n == "object" && n !== null ? { value: String(n.value), label: String(n.label ?? n.value) } : { value: String(n), label: String(n) }) : [];
}
function dc(e, t) {
  const n = {};
  for (const [r, o] of Object.entries(e))
    r === t ? n[""] = o : r.startsWith(`${t}.`) && (n[r.slice(t.length + 1)] = o);
  return n;
}
function uc(e) {
  if (e.trim() === "") return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
const z = "__none", be = "__empty", ye = (e) => e === "" ? be : e;
function pc(e, t) {
  return e == null || e === "" && !t.some((n) => n.value === "") ? z : ye(String(e));
}
function gc(e, t) {
  return e === z ? null : e === be ? "" : t ? Number(e) : e;
}
const hc = /* @__PURE__ */ new Set(["toggle", "password", "secret", "commerce_region", "commerce_targets", "entries", "terms", "media", "asset"]);
function ne(e, t) {
  return !t || typeof t != "object" || Array.isArray(t) ? [] : e.filter((n) => fe(n, t) && !hc.has(n.type) && !n.config?.secret).flatMap((n) => {
    const r = t[n.handle];
    if (n.type === "group") return ne(n.fields ?? [], r);
    if (n.type === "select" || n.type === "commerce_choices") {
      const o = te(n), i = (a) => o.find((l) => l.value === String(a))?.label ?? a;
      return [Array.isArray(r) ? r.map(i).join(", ") : r == null ? r : i(r)];
    }
    return [r];
  });
}
function ve(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = ve(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function fc() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = ve(e)) && (r && (r += " "), r += t);
  return r;
}
function O(...e) {
  return fc(e);
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
const Bc = (e) => /* @__PURE__ */ u(j, { ...e, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), Uc = (e) => /* @__PURE__ */ u(j, { ...e, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), Wc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Kc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), Gc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Xc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), bc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), Yc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m14 6 4 4M4 20l4-.8L20 7l-4-4L4 15z" }) });
function yc(e, t) {
  const n = e.trim();
  return t ? n.toUpperCase() : n;
}
function vc(e) {
  return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).map((n) => String(n).trim()).filter((n) => n !== "");
}
function xe({ field: e, value: t, onChange: n, errors: r, id: o, describedBy: i }) {
  const { Button: a, Popover: l, PopoverAnchor: m, PopoverContent: f, PopoverTrigger: N, Command: T, CommandEmpty: k, CommandInput: b, CommandItem: h, CommandList: $ } = A, x = e.config ?? {}, d = te(e), g = x.creatable !== !1, S = x.uppercase === !0, p = vc(t), [C, M] = P.useState(!1), [w, E] = P.useState(""), F = (v) => d.find((R) => R.value === v)?.label ?? v, L = yc(w, S), D = L === "" || d.some((v) => v.value.toLowerCase() === L.toLowerCase() || v.label.toLowerCase() === L.toLowerCase()), V = (v) => n(p.includes(v) ? p.filter((R) => R !== v) : [...p, v]), I = () => {
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
              children: /* @__PURE__ */ c(bc, { className: "cm:size-3" })
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
function se(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime())) return "";
  const n = (r) => String(r).padStart(2, "0");
  return `${t.getFullYear()}-${n(t.getMonth() + 1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`;
}
function oe(e) {
  return e ? new Date(e).toISOString() : null;
}
function Se({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = A, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ c(o, { htmlFor: `${n}-start`, children: "Starts" }),
      /* @__PURE__ */ c(
        r,
        {
          id: `${n}-start`,
          type: "datetime-local",
          value: se(i.start),
          onChange: (a) => t({ ...i, start: oe(a.target.value) })
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
          value: se(i.end),
          onChange: (a) => t({ ...i, end: oe(a.target.value) })
        }
      )
    ] })
  ] });
}
function xc({ field: e, id: t, value: n, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = A, f = Array.isArray(n) ? n : [], [N, T] = P.useState({}), [k, b] = P.useState(!1), h = f.filter((d) => !N[d]).join(","), $ = typeof e.config?.max == "number" ? e.config.max : null;
  P.useEffect(() => {
    if (!h) return;
    const d = new AbortController(), g = new URLSearchParams();
    return h.split(",").forEach((S) => g.append("ids[]", S)), ee(`${B("media/picker")}?${g}`, { signal: d.signal }).then(({ items: S }) => {
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
function Ce({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: o = !0,
  invalid: i
}) {
  const { Input: a } = A, l = (k) => k == null ? "" : Z(k).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, f] = P.useState(l(e)), [N, T] = P.useState(!1);
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
        const b = k.target.value.trim() === "" ? o ? null : 0 : ue(k.target.value);
        (b !== null || k.target.value.trim() === "") && t(b);
      },
      onBlur: () => {
        T(!1), f(l(e));
      }
    }
  );
}
function we() {
  const { props: e } = W.usePage(), t = e.commerce ?? {};
  return Me(t.currency), t;
}
function Ne({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return we(), /* @__PURE__ */ c(
    Ce,
    {
      id: o,
      value: t,
      onChange: n,
      allowNull: e.config?.allow_null !== !1,
      invalid: !!r?.[""]
    }
  );
}
const ae = [
  { key: "province_code", label: "Province" },
  { key: "city_code", label: "City / regency" },
  { key: "district_code", label: "District" },
  { key: "village_code", label: "Village" }
], Sc = { province: 1, city: 2, district: 3, village: 4 }, K = /* @__PURE__ */ new Map();
function Cc(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return K.has(n) || K.set(n, ee(n).then((r) => r.data).catch(() => (K.delete(n), []))), K.get(n);
}
function ke({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: f } = A, N = e.config ?? {}, T = String(N.api ?? ""), k = Sc[N.depth ?? "district"] ?? 3, b = N.country_options ?? [], h = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, $ = ae.slice(0, k), [x, d] = P.useState({}), g = [null, h.province_code, h.city_code, h.district_code];
  P.useEffect(() => {
    h.country !== "ID" || !T || $.forEach((p, C) => {
      const M = g[C];
      C > 0 && !M || Cc(T, M).then((w) => d((E) => ({ ...E, [p.key]: w })));
    });
  }, [T, h.country, h.province_code, h.city_code, h.district_code]);
  const S = (p, C) => {
    const M = { ...h };
    M[$[p].key] = C || null, ae.slice(p + 1).forEach((w) => {
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
          value: h[p.key] ?? z,
          disabled: C > 0 && !g[C],
          onValueChange: (M) => S(C, M === z ? "" : M),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${p.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ u(m, { children: [
              /* @__PURE__ */ c(f, { value: z, children: "Choose…" }),
              (x[p.key] ?? []).map((M) => /* @__PURE__ */ c(f, { value: M.code, children: M.name }, M.code))
            ] })
          ]
        }
      )
    ] }, p.key))
  ] });
}
function Te({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = A, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", f = Array.isArray(t) ? t : [], [N, T] = P.useState(""), [k, b] = P.useState([]), [h, $] = P.useState(!1);
  P.useEffect(() => {
    if (!h) return;
    const g = new URLSearchParams({ q: N });
    (a.types ?? []).forEach((p) => g.append("types[]", p)), (a.taxonomies ?? []).forEach((p) => g.append("taxonomies[]", p));
    const S = setTimeout(() => ee(`${a.api}?${g}`).then((p) => b(p.data)).catch(() => b([])), 200);
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
const wc = P.lazy(() => import("./ProductEditor-wKecUdWD.js")), Nc = (e) => P.createElement(P.Suspense, { fallback: null }, P.createElement(wc, e)), kc = {
  commerce_money: Ne,
  commerce_datetime_range: Se,
  commerce_region: ke,
  commerce_targets: Te,
  commerce_product: Nc,
  commerce_gallery: xc,
  commerce_choices: xe
};
function Tc() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(kc).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const $c = P.lazy(() => import("./ChartImpl-CAsAV8V5.js"));
function Ec(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(P.Suspense, { fallback: t, children: /* @__PURE__ */ c($c, { ...e }) });
}
function Lc({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ u("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ c("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ c("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ c("div", { className: "cm:mt-2", children: n })
  ] });
}
function Zc({ className: e }) {
  const { Card: t, CardContent: n } = A;
  return /* @__PURE__ */ c(t, { "aria-hidden": "true", className: e, children: /* @__PURE__ */ u(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function Mc({ kpi: e, className: t }) {
  const { Card: n, CardContent: r } = A, { Link: o } = W, i = e.change ?? null, a = /* @__PURE__ */ u(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
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
function $e({ title: e, description: t, actions: n, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = W, { PageHeader: m } = A;
  return /* @__PURE__ */ u(mc, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
function Pc(e, t, n, r) {
  const o = e.slice(0, n), i = e.slice(r), a = o !== "" && !/\s$/.test(o) ? " " : "", l = i !== "" && !/^[\s.,!?;:)]/.test(i) ? " " : "", m = `${a}${t}${l}`;
  return { text: o + m + i, caret: o.length + m.length };
}
function _c({ id: e, value: t, onChange: n, tokens: r, multiline: o, invalid: i, describedBy: a, maxLength: l }) {
  const { Input: m, Textarea: f } = A, N = P.useRef(null), T = (b) => {
    const h = N.current, $ = h?.selectionStart ?? t.length, x = h?.selectionEnd ?? t.length, d = Pc(t, b, $, x);
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
const U = ge, Ic = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: Ne,
  commerce_datetime_range: Se,
  commerce_region: ke,
  commerce_targets: Te,
  commerce_choices: xe
}, ie = {
  25: "cm:md:col-span-3",
  33: "cm:md:col-span-4",
  50: "cm:md:col-span-6",
  66: "cm:md:col-span-8",
  75: "cm:md:col-span-9",
  100: "cm:md:col-span-12"
};
function X({ fields: e, values: t, onChange: n, errors: r = {}, pathPrefix: o = "values", section: i }) {
  const a = e, l = r;
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => fe(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: O(
    "cm:min-w-0",
    ie[m.width ?? 100] ?? ie[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    Dc,
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
function Dc({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = U, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], f = e.instructions ? `${l}-help` : void 0, N = [f, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, T = e.label ?? e.handle, k = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ u("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? T : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ u("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: T }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(le, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: N, label: T }),
    i && f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !k && /* @__PURE__ */ u(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      T,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(le, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: N, label: T }),
    f && /* @__PURE__ */ c("p", { id: f, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function le({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: f, Switch: N, Label: T, MediaPickerInput: k, RichTextEditor: b, Checkbox: h, Select: $, SelectTrigger: x, SelectValue: d, SelectContent: g, SelectItem: S } = U, p = i[o] !== void 0, C = e.config ?? {}, M = Ic[e.type];
  if (M)
    return /* @__PURE__ */ c(M, { field: e, value: t, onChange: n, errors: dc(i, o), id: r, describedBy: a });
  if (Array.isArray(C.tokens) && C.tokens.length > 0 && (e.type === "text" || e.type === "textarea"))
    return /* @__PURE__ */ c(
      _c,
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
          onChange: (w) => n(uc(w.target.value))
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
      const w = te(e), E = e.type !== "select";
      if (C.multiple === !0) {
        const D = (Array.isArray(t) ? t : []).map(String), V = (I, v) => {
          const R = v ? [...D, I] : D.filter((Le) => Le !== I);
          n(E ? R.map(Number) : R);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: w.map((I) => /* @__PURE__ */ u("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(h, { checked: D.includes(I.value), onCheckedChange: (v) => V(I.value, v === !0) }),
          I.label
        ] }, I.value)) });
      }
      const F = Array.isArray(t) ? t[0] : t, L = pc(F, w);
      return /* @__PURE__ */ u($, { value: L, onValueChange: (D) => n(gc(D, E)), children: [
        /* @__PURE__ */ c(x, { id: r, className: "cm:w-full", "aria-invalid": p, "aria-describedby": a, children: /* @__PURE__ */ c(d, { placeholder: "—" }) }),
        /* @__PURE__ */ u(g, { children: [
          (!e.required || L === z) && /* @__PURE__ */ c(S, { value: z, children: "—" }),
          w.map((D) => /* @__PURE__ */ c(S, { value: ye(D.value), children: D.label }, D.value))
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
      return C.per_language === !0 ? /* @__PURE__ */ c(Fc, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(X, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (w) => n(w) });
    case "repeater":
      return /* @__PURE__ */ c(Ac, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
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
function Ac({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = U, l = Array.isArray(t) ? t : [], m = Y([]), f = Y(0);
  for (; m.current.length < l.length; ) m.current.push(f.current++);
  m.current.length = l.length;
  const [N, T] = J(() => /* @__PURE__ */ new Set()), k = (x, d) => {
    m.current = d, n(x);
  }, b = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), h = typeof e.config?.max == "number" ? e.config.max : null, $ = (x, d) => x.map((g, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : g);
  return /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const g = m.current[d], S = `${r}.${d}`, p = Object.keys(o).some((I) => I === S || I.startsWith(`${S}.`)), C = e.config?.summary_targets, M = typeof C == "string" ? x[C] : null, w = Array.isArray(M) ? M.flatMap((I) => typeof I?.label == "string" && I.label ? [I.label] : []) : [], F = (w.length > 1 ? `${w[0]} +${w.length - 1}` : w[0]) ?? U.cardSummary(ne(e.fields ?? [], x)), L = p || N.has(g) || F === "", D = () => T((I) => {
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
          X,
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
function Fc({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = U, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), f = (b) => Object.keys(o).some((h) => h === `${r}.${b}` || h.startsWith(`${r}.${b}.`)), [N, T] = J(() => l.find((b) => f(b.handle))?.handle ?? m), k = (b) => a[b] === null || a[b] === void 0 || a[b] === "";
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
          X,
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
function Rc({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: f, useUnsavedChanges: N } = A, T = A.cardSummary, { data: k, setData: b, errors: h, processing: $, isDirty: x, ...d } = W.useForm({ values: e.values }), g = P.useRef(!1), S = () => {
    g.current || (g.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      g.current = !1;
    } }));
  };
  P.useEffect(() => o?.($), [$, o]), N(x, S);
  const p = e.fields, C = e.sections?.length ? e.sections : [{ title: null, description: null, fields: p.map((E) => E.handle) }], M = Object.keys(h), w = (E, F = null) => /* @__PURE__ */ c(
    X,
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
        summary: T(ne(p.filter((L) => E.fields.includes(L.handle)), k.values)) || void 0,
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
function Ee({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = W;
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
function jc({ sections: e, current: t, title: n, description: r, primary: o, parent: i, children: a }) {
  we();
  const l = i ? { label: i.label, href: B(i.href) } : void 0;
  return oc([{ label: "Shop" }, { label: "Store settings", href: B("commerce/settings") }, ...l ? [l] : [], { label: n }]), /* @__PURE__ */ u("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ c(Ee, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ u("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
      /* @__PURE__ */ c($e, { title: n, description: r, primary: o, back: l }),
      a
    ] })
  ] });
}
const me = {
  ok: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  success: "cm:bg-emerald-500/10 cm:text-emerald-700 cm:dark:text-emerald-400",
  warning: "cm:bg-amber-500/10 cm:text-amber-700 cm:dark:text-amber-400",
  error: "cm:bg-red-500/10 cm:text-red-700 cm:dark:text-red-400",
  info: "cm:bg-sky-500/10 cm:text-sky-700 cm:dark:text-sky-400",
  neutral: "cm:bg-muted cm:text-muted-foreground"
};
function Oc({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: O("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", me[e] ?? me.neutral), children: t });
}
function Hc() {
  Object.assign(G.components, { Chart: Ec, EmptyState: Lc, KpiCard: Mc, MoneyInput: Ce, PageHeader: $e, SchemaFormView: Rc, SectionNav: Ee, SettingsLayout: jc, StatusBadge: Oc });
}
_e();
Hc();
Tc();
lc();
export {
  ut as $,
  qc as A,
  Qc as B,
  Ec as C,
  Xc as D,
  Lc as E,
  mc as F,
  cc as G,
  Ze as H,
  Ye as I,
  fc as J,
  Zc as K,
  Qe as L,
  Ce as M,
  ot as N,
  Ge as O,
  $e as P,
  Ke as Q,
  P as R,
  Oc as S,
  Te as T,
  ge as U,
  St as V,
  ht as W,
  bc as X,
  Y,
  st as Z,
  lt as _,
  B as a,
  gt as a0,
  et as a1,
  De as a2,
  Ae as a3,
  je as a4,
  c as b,
  A as c,
  we as d,
  G as e,
  Mc as f,
  Z as g,
  Vc as h,
  W as i,
  u as j,
  Yc as k,
  ee as l,
  Rc as m,
  X as n,
  ke as o,
  O as p,
  jc as q,
  J as r,
  Bc as s,
  zc as t,
  oc as u,
  Wc as v,
  Uc as w,
  Kc as x,
  Gc as y,
  Fe as z
};
