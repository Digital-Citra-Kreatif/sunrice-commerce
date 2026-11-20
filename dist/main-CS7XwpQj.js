const de = { symbol: "Rp", position: "left", space: !1, thousands: ".", decimal: ",", decimals: 0 };
let Q = de;
function Me(e) {
  Q = { ...de, ...e ?? {} };
}
function Z(e, t = Q) {
  const n = e < 0, r = Math.abs(Math.round(e)), o = 10 ** t.decimals, i = Math.floor(r / o).toString().replace(/\B(?=(\d{3})+(?!\d))/g, t.thousands), a = t.decimals > 0 ? t.decimal + String(r % o).padStart(t.decimals, "0") : "", l = i + a, m = t.space ? " " : "", h = t.position === "left" ? `${t.symbol}${m}${l}` : `${l}${m}${t.symbol}`;
  return n ? `-${h}` : h;
}
const Pe = new Intl.NumberFormat(void 0, { notation: "compact", maximumFractionDigits: 2 });
function Oc(e, t = Q) {
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
const f = globalThis.Sunrice?.modules?.react;
if (!f)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const De = f.Activity, Ie = f.Children, Ae = f.Component, Fe = f.Fragment, Re = f.Profiler, je = f.PureComponent, Oe = f.StrictMode, He = f.Suspense, Ve = f.ViewTransition, ze = f.act, Be = f.addTransitionType, Ue = f.cache, We = f.cacheSignal, qe = f.captureOwnerStack, Ke = f.cloneElement, Ge = f.createContext, Qe = f.createElement, Xe = f.createRef, Ye = f.forwardRef, Ze = f.isValidElement, Je = f.lazy, et = f.memo, tt = f.startTransition, nt = f.unstable_useCacheRefresh, ct = f.use, rt = f.useActionState, st = f.useCallback, ot = f.useContext, at = f.useDebugValue, it = f.useDeferredValue, lt = f.useEffect, mt = f.useEffectEvent, dt = f.useId, ut = f.useImperativeHandle, pt = f.useInsertionEffect, gt = f.useLayoutEffect, ht = f.useMemo, ft = f.useOptimistic, bt = f.useReducer, Y = f.useRef, J = f.useState, yt = f.useSyncExternalStore, vt = f.useTransition, St = f.version, Ct = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Activity: De,
  Children: Ie,
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
  default: f,
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
  version: St
}, Symbol.toStringTag, { value: "Module" })), P = globalThis.Sunrice?.modules?.["@inertiajs/react"];
if (!P)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
P.App;
P.Deferred;
P.Form;
const xt = P.Head;
P.InfiniteScroll;
const wt = P.Link;
P.WhenMounted;
P.WhenVisible;
P.config;
P.createInertiaApp;
P.http;
P.progress;
P.resetLayoutProps;
const Nt = P.router;
P.setLayoutProps;
const Tt = P.useForm;
P.useFormContext;
P.useHttp;
const kt = P.usePage;
P.usePoll;
P.usePrefetch;
P.useRemember;
const s = globalThis.Sunrice?.modules?.["@imajiner/admin-sdk/ui"];
if (!s)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const $t = s.Badge, Et = s.Button, Lt = s.Card, Mt = s.CardContent, Pt = s.CardDescription, _t = s.CardFooter, Dt = s.CardHeader, It = s.cardSummary, At = s.CardTitle, Ft = s.Checkbox, Rt = s.CodeEditor, jt = s.CollapsibleCard, Ot = s.CollapsibleCardGroup, Ht = s.Command, Vt = s.CommandEmpty, zt = s.CommandGroup, Bt = s.CommandInput, Ut = s.CommandItem, Wt = s.CommandList, qt = s.CommandSeparator, Kt = s.DatePicker, Gt = s.DeveloperHelp, Qt = s.Dialog, Xt = s.DialogContent, Yt = s.DialogDescription, Zt = s.DialogFooter, Jt = s.DialogHeader, en = s.DialogTitle, tn = s.DialogTrigger, nn = s.DropdownMenu, cn = s.DropdownMenuCheckboxItem, rn = s.DropdownMenuContent, sn = s.DropdownMenuItem, on = s.DropdownMenuLabel, an = s.DropdownMenuSeparator, ln = s.DropdownMenuTrigger, mn = s.FormSections, dn = s.Input, un = s.KeptEditsNotice, pn = s.Label, gn = s.LanguageTabs, hn = s.LinkAttributes, fn = s.LinkSourcePicker, bn = s.MediaPickerInput, yn = s.moveItem, vn = s.PageHeader, Sn = s.Popover, Cn = s.PopoverAnchor, xn = s.PopoverContent, wn = s.PopoverTrigger, Nn = s.registerCommandSource, Tn = s.RichTextEditor, kn = s.Select, $n = s.SelectContent, En = s.SelectItem, Ln = s.SelectTrigger, Mn = s.SelectValue, Pn = s.Separator, _n = s.SettingsLayout, Dn = s.SettingsNav, In = s.Skeleton, An = s.SortableHandle, Fn = s.SortableList, Rn = s.Switch, jn = s.Table, On = s.TableBody, Hn = s.TableCell, Vn = s.TableHead, zn = s.TableHeader, Bn = s.TableRow, Un = s.Tabs, Wn = s.TabsContent, qn = s.TabsList, Kn = s.TabsTrigger, Gn = s.Textarea, Qn = s.Tooltip, Xn = s.TooltipContent, Yn = s.TooltipTrigger, Zn = s.toast, Jn = s.TrashBanner, ec = s.TrashHint, tc = s.TrashTitle, pe = s.useBreadcrumbs, nc = s.useEditLock, cc = s.useTablePreferences, rc = s.useUnsavedChanges, sc = s.ViewingNotice, ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Badge: $t,
  Button: Et,
  Card: Lt,
  CardContent: Mt,
  CardDescription: Pt,
  CardFooter: _t,
  CardHeader: Dt,
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
  Popover: Sn,
  PopoverAnchor: Cn,
  PopoverContent: xn,
  PopoverTrigger: wn,
  RichTextEditor: Tn,
  Select: kn,
  SelectContent: $n,
  SelectItem: En,
  SelectTrigger: Ln,
  SelectValue: Mn,
  Separator: Pn,
  SettingsLayout: _n,
  SettingsNav: Dn,
  Skeleton: In,
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
  cardSummary: It,
  moveItem: yn,
  registerCommandSource: Nn,
  toast: Zn,
  useBreadcrumbs: pe,
  useEditLock: nc,
  useTablePreferences: cc,
  useUnsavedChanges: rc
}, Symbol.toStringTag, { value: "Module" })), ce = 3, he = () => window.Sunrice, D = Ct, F = ge, W = {
  router: Nt,
  Link: wt,
  Head: xt,
  usePage: kt,
  useForm: Tt
}, Hc = F.toast, oc = pe;
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
  "Commerce/Confirmations/Index": () => import("./Index-B-JaiFao.js"),
  "Commerce/Customers/Show": () => import("./Show-ClcTwIjK.js"),
  "Commerce/Dashboard": () => import("./Dashboard-CPFO1ptW.js"),
  "Commerce/Inventory/Index": () => import("./Index-Cec4vpqD.js"),
  "Commerce/Loyalty/Show": () => import("./Show-DjCj-G2-.js"),
  "Commerce/Marketing/Editor": () => import("./Editor-BYeP4_vh.js"),
  "Commerce/Marketing/Report": () => import("./Report-CLMw6KbS.js"),
  "Commerce/Orders/Editor": () => import("./Editor-7aZEloLS.js"),
  "Commerce/Orders/Show": () => import("./Show-B2Q3Bq_d.js"),
  "Commerce/Products/Index": () => import("./Index-B_4xzmbp.js"),
  "Commerce/Products/Import": () => import("./Import-S-O3ed5u.js"),
  "Commerce/Reports/Show": () => import("./Show-BgxSZfpN.js"),
  "Commerce/Settings/Section": () => import("./Section-Z_squqc0.js"),
  "Commerce/Settings/Emails": () => import("./Emails-C8ENW4-l.js"),
  "Commerce/Settings/Features": () => import("./Features-B1MUBLoj.js"),
  "Commerce/Settings/Payments": () => import("./Payments-BL0LjRPe.js"),
  "Commerce/Settings/Shipping": () => import("./Shipping-Dt8d_3s5.js"),
  "Commerce/Shared/SchemaForm": () => import("./SchemaForm-DlqLPf3H.js"),
  "Commerce/Shared/ResourceIndex": () => import("./ResourceIndex-f8LWI48_.js")
};
function lc() {
  ac(ic);
}
const q = globalThis.Sunrice?.modules?.["react/jsx-runtime"];
if (!q)
  throw new Error("[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).");
const mc = q.Fragment, c = q.jsx, g = q.jsxs;
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
function H(...e) {
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
const Vc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ c("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ c("path", { d: "m21 21-4.3-4.3" })
] }), zc = (e) => /* @__PURE__ */ g(j, { ...e, children: [
  /* @__PURE__ */ c("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
  /* @__PURE__ */ c("path", { d: "M9 3v18M15 3v18" })
] }), Bc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z" }) }), Uc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m5 12 7-7 7 7M12 19V5" }) }), Wc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }), qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16" }) }), Kc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m15 18-6-6 6-6" }) }), Gc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m9 18 6-6-6-6" }) }), bc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "M18 6 6 18M6 6l12 12" }) }), Qc = (e) => /* @__PURE__ */ c(j, { ...e, children: /* @__PURE__ */ c("path", { d: "m14 6 4 4M4 20l4-.8L20 7l-4-4L4 15z" }) });
function yc(e, t) {
  const n = e.trim();
  return t ? n.toUpperCase() : n;
}
function vc(e) {
  return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).map((n) => String(n).trim()).filter((n) => n !== "");
}
function Se({ field: e, value: t, onChange: n, errors: r, id: o, describedBy: i }) {
  const { Button: a, Popover: l, PopoverAnchor: m, PopoverContent: h, PopoverTrigger: T, Command: k, CommandEmpty: w, CommandInput: v, CommandItem: y, CommandList: L } = F, x = e.config ?? {}, d = te(e), p = x.creatable !== !1, S = x.uppercase === !0, u = vc(t), [N, M] = D.useState(!1), [C, $] = D.useState(""), A = (b) => d.find((R) => R.value === b)?.label ?? b, E = yc(C, S), I = E === "" || d.some((b) => b.value.toLowerCase() === E.toLowerCase() || b.label.toLowerCase() === E.toLowerCase()), V = (b) => n(u.includes(b) ? u.filter((R) => R !== b) : [...u, b]), _ = () => {
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
              children: /* @__PURE__ */ c(bc, { className: "cm:size-3" })
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
function Ce({ value: e, onChange: t, id: n }) {
  const { Input: r, Label: o } = F, i = { start: e?.start ?? null, end: e?.end ?? null };
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
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
    /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
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
function Sc({ field: e, id: t, value: n, errors: r, onChange: o }) {
  const { Button: i, MediaPickerInput: a, SortableList: l, SortableHandle: m } = F, h = Array.isArray(n) ? n : [], [T, k] = D.useState({}), [w, v] = D.useState(!1), y = h.filter((d) => !T[d]).join(","), L = typeof e.config?.max == "number" ? e.config.max : null;
  D.useEffect(() => {
    if (!y) return;
    const d = new AbortController(), p = new URLSearchParams();
    return y.split(",").forEach((S) => p.append("ids[]", S)), ee(`${B("media/picker")}?${p}`, { signal: d.signal }).then(({ items: S }) => {
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
function xe({
  value: e,
  onChange: t,
  id: n,
  placeholder: r,
  allowNull: o = !0,
  invalid: i
}) {
  const { Input: a } = F, l = (w) => w == null ? "" : Z(w).replace(/^[^\d-]+|[^\d]+$/g, ""), [m, h] = D.useState(l(e)), [T, k] = D.useState(!1);
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
  return Me(t.currency), t;
}
function Ne({ field: e, value: t, onChange: n, errors: r, id: o }) {
  return we(), /* @__PURE__ */ c(
    xe,
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
], Cc = { province: 1, city: 2, district: 3, village: 4 }, K = /* @__PURE__ */ new Map();
function xc(e, t) {
  const n = t ? `${e}?parent=${encodeURIComponent(t)}` : e;
  return K.has(n) || K.set(n, ee(n).then((r) => r.data).catch(() => (K.delete(n), []))), K.get(n);
}
function Te({ field: e, value: t, onChange: n, id: r }) {
  const { Label: o, Select: i, SelectTrigger: a, SelectValue: l, SelectContent: m, SelectItem: h } = F, T = e.config ?? {}, k = String(T.api ?? ""), w = Cc[T.depth ?? "district"] ?? 3, v = T.country_options ?? [], y = { country: "ID", province_code: null, city_code: null, district_code: null, village_code: null, ...t ?? {} }, L = ae.slice(0, w), [x, d] = D.useState({}), p = [null, y.province_code, y.city_code, y.district_code];
  D.useEffect(() => {
    y.country !== "ID" || !k || L.forEach((u, N) => {
      const M = p[N];
      N > 0 && !M || xc(k, M).then((C) => d(($) => ({ ...$, [u.key]: C })));
    });
  }, [k, y.country, y.province_code, y.city_code, y.district_code]);
  const S = (u, N) => {
    const M = { ...y };
    M[L[u].key] = N || null, ae.slice(u + 1).forEach((C) => {
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
          value: y[u.key] ?? z,
          disabled: N > 0 && !p[N],
          onValueChange: (M) => S(N, M === z ? "" : M),
          children: [
            /* @__PURE__ */ c(a, { id: `${r}-${u.key}`, className: "cm:w-full", children: /* @__PURE__ */ c(l, { placeholder: "Choose…" }) }),
            /* @__PURE__ */ g(m, { children: [
              /* @__PURE__ */ c(h, { value: z, children: "Choose…" }),
              (x[u.key] ?? []).map((M) => /* @__PURE__ */ c(h, { value: M.code, children: M.name }, M.code))
            ] })
          ]
        }
      )
    ] }, u.key))
  ] });
}
function ke({ field: e, value: t, onChange: n, id: r }) {
  const { Input: o, Badge: i } = F, a = e.config ?? {}, l = a.single === !0, m = Array.isArray(a.types) && a.types.length === 1 && a.types[0] === "product", h = Array.isArray(t) ? t : [], [T, k] = D.useState(""), [w, v] = D.useState([]), [y, L] = D.useState(!1);
  D.useEffect(() => {
    if (!y) return;
    const p = new URLSearchParams({ q: T });
    (a.types ?? []).forEach((u) => p.append("types[]", u)), (a.taxonomies ?? []).forEach((u) => p.append("taxonomies[]", u));
    const S = setTimeout(() => ee(`${a.api}?${p}`).then((u) => v(u.data)).catch(() => v([])), 200);
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
const wc = D.lazy(() => import("./ProductEditor-Bx9Trzgd.js")), Nc = (e) => D.createElement(D.Suspense, { fallback: null }, D.createElement(wc, e)), Tc = {
  commerce_money: Ne,
  commerce_datetime_range: Ce,
  commerce_region: Te,
  commerce_targets: ke,
  commerce_product: Nc,
  commerce_gallery: Sc,
  commerce_choices: Se
};
function kc() {
  (window.SunriceCmsQueue ??= []).push((e) => Object.entries(Tc).forEach(([t, n]) => e.registerFieldInput(t, n)));
}
const $c = D.lazy(() => import("./ChartImpl-CAVsfB9i.js"));
function Ec(e) {
  const t = /* @__PURE__ */ c("div", { className: "cm:animate-pulse cm:rounded-md cm:bg-muted", style: { height: e.height ?? 260 } });
  return /* @__PURE__ */ c(D.Suspense, { fallback: t, children: /* @__PURE__ */ c($c, { ...e }) });
}
function Lc({ title: e, description: t, action: n }) {
  return /* @__PURE__ */ g("div", { className: "cm:flex cm:flex-col cm:items-center cm:gap-2 cm:rounded-lg cm:border cm:border-dashed cm:px-6 cm:py-10 cm:text-center", children: [
    /* @__PURE__ */ c("p", { className: "cm:font-medium", children: e }),
    t && /* @__PURE__ */ c("p", { className: "cm:max-w-md cm:text-sm cm:text-muted-foreground", children: t }),
    n && /* @__PURE__ */ c("div", { className: "cm:mt-2", children: n })
  ] });
}
function Xc({ className: e }) {
  const { Card: t, CardContent: n } = F;
  return /* @__PURE__ */ c(t, { "aria-hidden": "true", className: e, children: /* @__PURE__ */ g(n, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
    /* @__PURE__ */ c("span", { className: "cm:my-0.5 cm:h-4 cm:w-24 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:my-1 cm:h-6 cm:w-20 cm:animate-pulse cm:rounded cm:bg-muted" }),
    /* @__PURE__ */ c("span", { className: "cm:h-4" })
  ] }) });
}
function Mc({ kpi: e, className: t }) {
  const { Card: n, CardContent: r } = F, { Link: o } = W, i = e.change ?? null, a = /* @__PURE__ */ g(r, { className: "cm:grid cm:gap-1 cm:pt-6", children: [
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
function $e({ title: e, description: t, actions: n, primary: r, menu: o, back: i, children: a }) {
  const { Head: l } = W, { PageHeader: m } = F;
  return /* @__PURE__ */ g(mc, { children: [
    /* @__PURE__ */ c(l, { title: e }),
    /* @__PURE__ */ c(m, { title: e, description: t, actions: n, primary: r, menu: o?.length ? o : void 0, back: i, children: a })
  ] });
}
const U = ge, Pc = {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  commerce_money: Ne,
  commerce_datetime_range: Ce,
  commerce_region: Te,
  commerce_targets: ke,
  commerce_choices: Se
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
  return /* @__PURE__ */ c("div", { className: "cm:grid cm:grid-cols-1 cm:gap-x-5 cm:gap-y-6 cm:md:grid-cols-12", children: a.filter((m) => fe(m, t ?? {})).map((m) => /* @__PURE__ */ c("div", { className: H(
    "cm:min-w-0",
    ie[m.width ?? 100] ?? ie[100],
    // A switch beside an input sits level with the input, not its label.
    m.type === "toggle" && (m.width ?? 100) < 100 && "cm:md:self-end cm:md:pb-2.5"
  ), children: /* @__PURE__ */ c(
    _c,
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
function _c({ field: e, value: t, onChange: n, path: r, errors: o, hideLabel: i = !1 }) {
  const { Label: a } = U, l = r.replace(/[^A-Za-z0-9_-]+/g, "-"), m = o[r], h = e.instructions ? `${l}-help` : void 0, T = [h, m ? `${l}-error` : void 0].filter(Boolean).join(" ") || void 0, k = e.label ?? e.handle, w = e.type === "toggle";
  return e.type === "group" || e.type === "commerce_region" ? /* @__PURE__ */ g("div", { role: "group", "aria-labelledby": i ? void 0 : `${l}-label`, "aria-label": i ? k : void 0, className: "cm:grid cm:gap-4", "data-field": e.handle, children: [
    !i && /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1", children: [
      /* @__PURE__ */ g("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ c("h3", { id: `${l}-label`, className: "cm:text-sm cm:font-medium cm:text-foreground", children: k }),
        /* @__PURE__ */ c("div", { "aria-hidden": "true", className: "cm:h-px cm:flex-1 cm:bg-border" })
      ] }),
      h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions })
    ] }),
    /* @__PURE__ */ c(le, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: k }),
    i && h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] }) : /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-1.5", "data-field": e.handle, children: [
    !w && /* @__PURE__ */ g(a, { htmlFor: e.type === "repeater" ? void 0 : l, id: `${l}-label`, className: i ? "cm:sr-only" : void 0, children: [
      k,
      e.required && /* @__PURE__ */ c("span", { className: "cm:text-destructive", children: " *" })
    ] }),
    /* @__PURE__ */ c(le, { field: e, value: t, onChange: n, id: l, path: r, errors: o, describedBy: T, label: k }),
    h && /* @__PURE__ */ c("p", { id: h, className: "cm:text-sm cm:text-muted-foreground", children: e.instructions }),
    m && /* @__PURE__ */ c("p", { id: `${l}-error`, className: "cm:text-sm cm:text-destructive", children: m })
  ] });
}
function le({ field: e, value: t, onChange: n, id: r, path: o, errors: i, describedBy: a, label: l }) {
  const { Input: m, Textarea: h, Switch: T, Label: k, MediaPickerInput: w, RichTextEditor: v, Checkbox: y, Select: L, SelectTrigger: x, SelectValue: d, SelectContent: p, SelectItem: S } = U, u = i[o] !== void 0, N = e.config ?? {}, M = Pc[e.type];
  if (M)
    return /* @__PURE__ */ c(M, { field: e, value: t, onChange: n, errors: dc(i, o), id: r, describedBy: a });
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
          onChange: (C) => n(uc(C.target.value))
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
      const C = te(e), $ = e.type !== "select";
      if (N.multiple === !0) {
        const I = (Array.isArray(t) ? t : []).map(String), V = (_, b) => {
          const R = b ? [...I, _] : I.filter((Le) => Le !== _);
          n($ ? R.map(Number) : R);
        };
        return /* @__PURE__ */ c("div", { role: "group", "aria-labelledby": `${r}-label`, "aria-describedby": a, className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: C.map((_) => /* @__PURE__ */ g("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
          /* @__PURE__ */ c(y, { checked: I.includes(_.value), onCheckedChange: (b) => V(_.value, b === !0) }),
          _.label
        ] }, _.value)) });
      }
      const A = Array.isArray(t) ? t[0] : t, E = pc(A, C);
      return /* @__PURE__ */ g(L, { value: E, onValueChange: (I) => n(gc(I, $)), children: [
        /* @__PURE__ */ c(x, { id: r, className: "cm:w-full", "aria-invalid": u, "aria-describedby": a, children: /* @__PURE__ */ c(d, { placeholder: "—" }) }),
        /* @__PURE__ */ g(p, { children: [
          (!e.required || E === z) && /* @__PURE__ */ c(S, { value: z, children: "—" }),
          C.map((I) => /* @__PURE__ */ c(S, { value: ye(I.value), children: I.label }, I.value))
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
      return N.per_language === !0 ? /* @__PURE__ */ c(Ic, { field: e, value: t, onChange: n, path: o, errors: i }) : /* @__PURE__ */ c(X, { fields: e.fields ?? [], values: t ?? {}, errors: i, pathPrefix: o, onChange: (C) => n(C) });
    case "repeater":
      return /* @__PURE__ */ c(Dc, { field: e, value: t, onChange: n, path: o, errors: i, label: l });
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
function Dc({ field: e, value: t, onChange: n, path: r, errors: o, label: i }) {
  const { Button: a } = U, l = Array.isArray(t) ? t : [], m = Y([]), h = Y(0);
  for (; m.current.length < l.length; ) m.current.push(h.current++);
  m.current.length = l.length;
  const [T, k] = J(() => /* @__PURE__ */ new Set()), w = (x, d) => {
    m.current = d, n(x);
  }, v = () => Object.fromEntries((e.fields ?? []).map((x) => [x.handle, x.type === "toggle" ? !1 : null])), y = typeof e.config?.max == "number" ? e.config.max : null, L = (x, d) => x.map((p, S) => S === d - 1 ? x[d] : S === d ? x[d - 1] : p);
  return /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-2", children: [
    l.map((x, d) => {
      const p = m.current[d], S = `${r}.${d}`, u = Object.keys(o).some((_) => _ === S || _.startsWith(`${S}.`)), N = e.config?.summary_targets, M = typeof N == "string" ? x[N] : null, C = Array.isArray(M) ? M.flatMap((_) => typeof _?.label == "string" && _.label ? [_.label] : []) : [], A = (C.length > 1 ? `${C[0]} +${C.length - 1}` : C[0]) ?? U.cardSummary(ne(e.fields ?? [], x)), E = u || T.has(p) || A === "", I = () => k((_) => {
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
          X,
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
function Ic({ field: e, value: t, onChange: n, path: r, errors: o }) {
  const { LanguageTabs: i } = U, a = t ?? {}, l = e.fields ?? [], m = String(e.config?.main ?? l[0]?.handle ?? ""), h = (v) => Object.keys(o).some((y) => y === `${r}.${v}` || y.startsWith(`${r}.${v}.`)), [T, k] = J(() => l.find((v) => h(v.handle))?.handle ?? m), w = (v) => a[v] === null || a[v] === void 0 || a[v] === "";
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
          X,
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
function Ac({ form: e, id: t, storageKey: n, footer: r, onProcessing: o }) {
  const { Button: i, Card: a, CardContent: l, CollapsibleCard: m, CollapsibleCardGroup: h, useUnsavedChanges: T } = F, k = F.cardSummary, { data: w, setData: v, errors: y, processing: L, isDirty: x, ...d } = W.useForm({ values: e.values }), p = D.useRef(!1), S = () => {
    p.current || (p.current = !0, d[e.method](e.action, { preserveScroll: !0, onFinish: () => {
      p.current = !1;
    } }));
  };
  D.useEffect(() => o?.(L), [L, o]), T(x, S);
  const u = e.fields, N = e.sections?.length ? e.sections : [{ title: null, description: null, fields: u.map(($) => $.handle) }], M = Object.keys(y), C = ($, A = null) => /* @__PURE__ */ c(
    X,
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
        summary: k(ne(u.filter((E) => $.fields.includes(E.handle)), w.values)) || void 0,
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
function Ee({ items: e, current: t, label: n = "Sections" }) {
  const { Link: r } = W;
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
function Fc({ sections: e, current: t, title: n, description: r, primary: o, parent: i, children: a }) {
  we();
  const l = i ? { label: i.label, href: B(i.href) } : void 0;
  return oc([{ label: "Shop" }, { label: "Store settings", href: B("commerce/settings") }, ...l ? [l] : [], { label: n }]), /* @__PURE__ */ g("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[12rem_minmax(0,1fr)] cm:lg:items-start", children: [
    /* @__PURE__ */ c(Ee, { items: e, current: t, label: "Store settings" }),
    /* @__PURE__ */ g("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
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
function Rc({ tone: e = "neutral", children: t }) {
  return /* @__PURE__ */ c("span", { className: H("cm:inline-flex cm:items-center cm:rounded-full cm:px-2 cm:py-0.5 cm:text-xs cm:font-medium", me[e] ?? me.neutral), children: t });
}
function jc() {
  Object.assign(G.components, { Chart: Ec, EmptyState: Lc, KpiCard: Mc, MoneyInput: xe, PageHeader: $e, SchemaFormView: Ac, SectionNav: Ee, SettingsLayout: Fc, StatusBadge: Rc });
}
_e();
jc();
kc();
lc();
export {
  ut as $,
  Uc as A,
  Kc as B,
  Ec as C,
  Gc as D,
  Lc as E,
  mc as F,
  cc as G,
  Ze as H,
  Ye as I,
  fc as J,
  Xc as K,
  Qe as L,
  xe as M,
  ot as N,
  Ge as O,
  $e as P,
  Ke as Q,
  D as R,
  Rc as S,
  ke as T,
  ge as U,
  Ct as V,
  ht as W,
  bc as X,
  Y,
  st as Z,
  lt as _,
  B as a,
  gt as a0,
  et as a1,
  Ie as a2,
  Ae as a3,
  je as a4,
  c as b,
  F as c,
  we as d,
  G as e,
  Mc as f,
  Z as g,
  Oc as h,
  W as i,
  g as j,
  Qc as k,
  ee as l,
  Ac as m,
  X as n,
  Te as o,
  H as p,
  Fc as q,
  J as r,
  Vc as s,
  Hc as t,
  oc as u,
  Bc as v,
  zc as w,
  Wc as x,
  qc as y,
  Fe as z
};
