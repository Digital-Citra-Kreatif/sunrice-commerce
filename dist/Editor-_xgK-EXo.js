import { i as te, u as Ue, a as ze, b as o, R as u, h as he, j as c, c as e, P as He, F as U, S as Je, d as pe, k as We, t as z, T as qe } from "./main-BZm25ssn.js";
import { I as O } from "./InputError-Ah7nZD43.js";
import { a as ce, u as Ke, g as Ye, d as ge, i as Ge } from "./marketing-Bya9hWH-.js";
const Qe = { active: "ok", paused: "warning", scheduled: "info", draft: "neutral" };
function ct({ campaign: n, locales: p, mainLocale: C, rules: h, tags: _, triggers: D, templates: R, reachable: H, bodyFields: J, currency: W }) {
  const {
    Card: x,
    CardContent: g,
    CardHeader: i,
    CardTitle: y,
    CardDescription: v,
    Button: s,
    Input: F,
    Label: T,
    Switch: ve,
    Tabs: fe,
    TabsList: be,
    TabsTrigger: xe,
    TabsContent: ye,
    Select: q,
    SelectContent: K,
    SelectItem: P,
    SelectTrigger: Y,
    SelectValue: G,
    Dialog: Se,
    DialogContent: we,
    DialogHeader: Ne,
    DialogTitle: ke,
    DialogDescription: Ce,
    DialogFooter: _e
  } = pe, { router: $ } = te, d = n.type === "automation", Te = d ? "commerce/marketing/automations" : "commerce/marketing/campaigns";
  Ue(), ze([
    { label: "Shop", href: o("commerce") },
    { label: "Marketing", href: o("commerce/marketing") },
    { label: d ? "Automations" : "Campaigns", href: o(Te) },
    { label: n.id ? n.name : "New" }
  ]);
  const Q = te.useForm({
    name: n.name,
    trigger: n.trigger ?? "",
    delay: n.delay ?? "",
    voucher_code: n.voucher_code,
    audience: n.audience,
    content: n.content
  }), { data: a, setData: k, errors: A, processing: ne, isDirty: E } = Q, [S, $e] = u.useState(C), [f, re] = u.useState(null), [je, ae] = u.useState(!1), [b, Oe] = u.useState(null), [le, ie] = u.useState(!1), L = u.useMemo(() => b ? URL.createObjectURL(new Blob([b.html], { type: "text/html" })) : null, [b]);
  u.useEffect(() => () => {
    L && URL.revokeObjectURL(L);
  }, [L]);
  const [De, V] = u.useState(!1), [I, Re] = u.useState(""), se = u.useRef(null), X = D.find((t) => t.key === a.trigger), oe = n.id !== null && !E, Fe = JSON.stringify(a.audience);
  u.useEffect(() => {
    if (!ce(a.audience, h)) return;
    ae(!0);
    const t = setTimeout(() => {
      he(o("commerce/marketing/audience"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience: a.audience })
      }).then(re).catch(() => re(null)).finally(() => ae(!1));
    }, 400);
    return () => clearTimeout(t);
  }, [Fe]);
  const M = (t) => k("audience", t), de = (t, r) => M({
    ...a.audience,
    rules: a.audience.rules.map((m, l) => l === t ? r.rule !== void 0 ? { rule: r.rule, value: ge(h[r.rule]) } : { ...m, ...r } : m)
  }), Z = (t, r) => k("content", { ...a.content, [S]: { ...a.content[S], [t]: r } }), Pe = (t) => {
    const r = se.current;
    if (r && document.body.contains(r.el)) {
      const { text: m, cursor: l } = Ge(r.el.value, t, r.el.selectionStart, r.el.selectionEnd);
      Z(r.part, m), requestAnimationFrame(() => {
        r.el.focus(), r.el.setSelectionRange(l, l);
      });
      return;
    }
    navigator.clipboard?.writeText(`{${t}}`).then(() => z.success(`Copied {${t}}. Paste it into the text.`), () => z.error(`Type {${t}} into the text.`));
  }, Ae = () => {
    const t = { preserveScroll: !0, onError: () => z.error("Check the highlighted fields.") };
    n.id ? Q.put(o(`commerce/marketing/${n.id}`), t) : Q.post(o(d ? "commerce/marketing/automations" : "commerce/marketing/campaigns"), t);
  }, me = () => ({ content: a.content, audience: a.audience, voucher_code: a.voucher_code, locale: S }), Ee = () => {
    ie(!0), he(o("commerce/marketing/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(me())
    }).then(Oe).catch(() => z.error("The preview couldn't be made.")).finally(() => ie(!1));
  }, Le = () => $.post(o("commerce/marketing/test"), me(), { preserveScroll: !0 }), Ve = (t) => {
    const r = R.find((m) => m.key === t);
    r && (E && !window.confirm("Replace the audience and texts with this template?") || k({ ...a, audience: r.audience, content: { ...a.content, ...r.content }, name: a.name || r.label }));
  }, Ie = (t) => {
    const r = D.find((l) => l.key === t);
    if (!r) return;
    const m = E && !window.confirm(`Start from the "${r.label}" texts?`);
    k({ ...a, trigger: t, delay: r.delay.default, content: m ? a.content : { ...a.content, ...r.content } });
  }, ue = a.content[S] ?? { subject: "", preheader: "", body: "", button_label: "", button_url: "" }, Me = Object.values(a.content).map((t) => `${t.subject} ${t.preheader} ${t.body} ${t.button_label} ${t.button_url}`).join(" "), ee = Ke(Me, Object.keys(_)), w = (t) => A[t], B = (t, r, m, l) => {
    const N = `content.${S}.${t}`;
    return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
      /* @__PURE__ */ e(T, { htmlFor: N, children: r }),
      /* @__PURE__ */ e(
        F,
        {
          id: N,
          value: ue[t],
          placeholder: m,
          "aria-invalid": w(N) ? !0 : void 0,
          onFocus: (j) => {
            se.current = { part: t, el: j.target };
          },
          onChange: (j) => Z(t, j.target.value)
        }
      ),
      l && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: l }),
      /* @__PURE__ */ e(O, { message: w(N) })
    ] });
  };
  return /* @__PURE__ */ c("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6 cm:max-w-5xl", children: [
    /* @__PURE__ */ e(
      He,
      {
        title: n.id ? n.name : d ? "New automation" : "New campaign",
        description: d ? "Sent by itself to each customer the trigger finds, while it is on." : "Sent once, to the customers who match the audience and accept marketing.",
        actions: /* @__PURE__ */ c(U, { children: [
          n.id && /* @__PURE__ */ e(Je, { tone: Qe[n.status] ?? "neutral", children: n.status }),
          n.id && d && /* @__PURE__ */ c("label", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
            /* @__PURE__ */ e(
              ve,
              {
                checked: n.status === "active",
                disabled: E,
                "aria-label": "Automation on",
                onCheckedChange: (t) => $.post(o(`commerce/marketing/${n.id}/status`), { active: t }, { preserveScroll: !0 })
              }
            ),
            n.status === "active" ? "On" : "Off"
          ] }),
          n.id && n.sent_count > 0 && /* @__PURE__ */ e(s, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(te.Link, { href: o(`commerce/marketing/${n.id}`), children: "Results" }) }),
          /* @__PURE__ */ e(s, { variant: "outline", onClick: Le, children: "Send me a test" }),
          /* @__PURE__ */ e(s, { onClick: Ae, disabled: ne, children: ne ? "Saving…" : "Save" }),
          !d && /* @__PURE__ */ e(s, { variant: "default", disabled: !oe, title: oe ? void 0 : "Save first", onClick: () => V(!0), children: "Send…" })
        ] })
      }
    ),
    n.status === "scheduled" && n.scheduled_at && /* @__PURE__ */ c("div", { role: "status", className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      /* @__PURE__ */ c("span", { children: [
        "Scheduled for ",
        new Date(n.scheduled_at).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }),
        ". Changes you save go out with it."
      ] }),
      /* @__PURE__ */ e(s, { size: "sm", variant: "outline", onClick: () => $.post(o(`commerce/marketing/${n.id}/unschedule`), {}, { preserveScroll: !0 }), children: "Back to draft" })
    ] }),
    A.campaign && /* @__PURE__ */ e("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-4 cm:py-3 cm:text-sm cm:text-destructive", children: A.campaign }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-6 cm:lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ c("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        R.length > 0 && /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ c(i, { children: [
            /* @__PURE__ */ e(y, { children: "Start from" }),
            /* @__PURE__ */ e(v, { children: "A template fills in the audience and the texts. You can change everything." })
          ] }),
          /* @__PURE__ */ e(g, { className: "cm:grid cm:gap-2 cm:sm:grid-cols-2", children: R.map((t) => /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: () => Ve(t.key),
              className: "cm:rounded-md cm:border cm:p-3 cm:text-left cm:transition-colors cm:hover:bg-muted",
              children: [
                /* @__PURE__ */ e("span", { className: "cm:block cm:text-sm cm:font-medium", children: t.label }),
                /* @__PURE__ */ e("span", { className: "cm:block cm:text-xs cm:text-muted-foreground", children: t.description })
              ]
            },
            t.key
          )) })
        ] }),
        /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ e(i, { children: /* @__PURE__ */ e(y, { children: "Details" }) }),
          /* @__PURE__ */ c(g, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e(T, { htmlFor: "name", children: "Name" }),
              /* @__PURE__ */ e(
                F,
                {
                  id: "name",
                  value: a.name,
                  placeholder: d ? "Abandoned cart reminder" : "May newsletter",
                  onChange: (t) => k("name", t.target.value)
                }
              ),
              /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Only staff see it." }),
              /* @__PURE__ */ e(O, { message: w("name") })
            ] }),
            d && /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
              /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
                /* @__PURE__ */ e(T, { htmlFor: "trigger", children: "When" }),
                /* @__PURE__ */ c(q, { value: a.trigger, onValueChange: Ie, children: [
                  /* @__PURE__ */ e(Y, { id: "trigger", children: /* @__PURE__ */ e(G, { placeholder: "Choose a trigger" }) }),
                  /* @__PURE__ */ e(K, { children: D.map((t) => /* @__PURE__ */ e(P, { value: t.key, children: t.label }, t.key)) })
                ] }),
                X && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: X.description }),
                /* @__PURE__ */ e(O, { message: w("trigger") })
              ] }),
              /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
                /* @__PURE__ */ e(T, { htmlFor: "delay", children: X?.delay.label ?? "Delay" }),
                /* @__PURE__ */ e(
                  F,
                  {
                    id: "delay",
                    type: "number",
                    min: 0,
                    value: a.delay,
                    className: "cm:max-w-32",
                    onChange: (t) => k("delay", t.target.value)
                  }
                ),
                /* @__PURE__ */ e(O, { message: w("delay") })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
              /* @__PURE__ */ e(T, { htmlFor: "voucher_code", children: "Voucher code (optional)" }),
              /* @__PURE__ */ e(
                F,
                {
                  id: "voucher_code",
                  value: a.voucher_code,
                  className: "cm:max-w-60",
                  placeholder: "WELCOME10",
                  onChange: (t) => k("voucher_code", t.target.value)
                }
              ),
              /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
                "Shown where the text has ",
                "{voucher_code}",
                ". Create the voucher in Shop → Vouchers."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ c(i, { children: [
            /* @__PURE__ */ e(y, { children: "Audience" }),
            /* @__PURE__ */ e(v, { children: d ? "Optional: only customers who also match these rules get it." : `Customers who accept marketing (${H.toLocaleString()}), narrowed by these rules.` })
          ] }),
          /* @__PURE__ */ c(g, { className: "cm:grid cm:gap-3", children: [
            a.audience.rules.length > 1 && /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-2 cm:text-sm", children: [
              "Match",
              /* @__PURE__ */ c(q, { value: a.audience.match, onValueChange: (t) => M({ ...a.audience, match: t }), children: [
                /* @__PURE__ */ e(Y, { className: "cm:w-28", "aria-label": "Match", children: /* @__PURE__ */ e(G, {}) }),
                /* @__PURE__ */ c(K, { children: [
                  /* @__PURE__ */ e(P, { value: "all", children: "all rules" }),
                  /* @__PURE__ */ e(P, { value: "any", children: "any rule" })
                ] })
              ] })
            ] }),
            a.audience.rules.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: d ? "No extra rules: everyone the trigger finds." : "No rules: everyone who accepts marketing." }),
            a.audience.rules.map((t, r) => {
              const m = h[t.rule];
              return /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-2 cm:rounded-md cm:border cm:p-3 cm:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] cm:sm:items-start", children: [
                /* @__PURE__ */ c(q, { value: t.rule, onValueChange: (l) => de(r, { rule: l }), children: [
                  /* @__PURE__ */ e(Y, { "aria-label": "Rule", children: /* @__PURE__ */ e(G, { placeholder: "Choose a rule" }) }),
                  /* @__PURE__ */ e(K, { children: Ye(h).map(([l, N]) => /* @__PURE__ */ c(u.Fragment, { children: [
                    /* @__PURE__ */ e("div", { className: "cm:px-2 cm:pt-2 cm:pb-1 cm:text-xs cm:font-medium cm:text-muted-foreground", children: l }),
                    N.map(([j, Be]) => /* @__PURE__ */ e(P, { value: j, children: Be.label }, j))
                  ] }, l)) })
                ] }),
                /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1", children: [
                  /* @__PURE__ */ e(Xe, { def: m, value: t.value, currency: W, path: `audience.rules.${r}.value`, onChange: (l) => de(r, { value: l }) }),
                  /* @__PURE__ */ e(O, { message: w(`audience.rules.${r}.value`) ?? w(`audience.rules.${r}.rule`) })
                ] }),
                /* @__PURE__ */ e(
                  s,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    "aria-label": "Remove rule",
                    onClick: () => M({ ...a.audience, rules: a.audience.rules.filter((l, N) => N !== r) }),
                    children: "Remove"
                  }
                )
              ] }, r);
            }),
            /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3", children: [
              /* @__PURE__ */ e(
                s,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => M({ ...a.audience, rules: [...a.audience.rules, { rule: "no_order_for_days", value: ge(h.no_order_for_days) }] }),
                  children: "Add rule"
                }
              ),
              /* @__PURE__ */ e("p", { className: "cm:text-sm", "aria-live": "polite", children: d && a.audience.rules.length === 0 ? null : ce(a.audience, h) ? je || f === null ? /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Counting…" }) : /* @__PURE__ */ c(U, { children: [
                /* @__PURE__ */ e("strong", { children: f.count.toLocaleString() }),
                " ",
                f.count === 1 ? "customer matches" : "customers match",
                d ? " these rules now" : ""
              ] }) : /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Fill in the rules to see who matches." }) })
            ] }),
            f && f.sample.length > 0 && ce(a.audience, h) && !(d && a.audience.rules.length === 0) && /* @__PURE__ */ c("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
              "For example: ",
              f.sample.map((t) => t.name || t.email).join(", ")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ c(i, { children: [
            /* @__PURE__ */ e(y, { children: "Email" }),
            /* @__PURE__ */ c(v, { children: [
              "Each customer gets it in their language; empty parts use ",
              p.find((t) => t.code === C)?.name ?? C,
              "."
            ] })
          ] }),
          /* @__PURE__ */ c(g, { className: "cm:grid cm:gap-4", children: [
            /* @__PURE__ */ c(fe, { value: S, onValueChange: $e, children: [
              p.length > 1 && /* @__PURE__ */ e(be, { children: p.map((t) => /* @__PURE__ */ c(xe, { value: t.code, children: [
                t.name,
                t.code === C ? " (main)" : ""
              ] }, t.code)) }),
              p.map((t) => /* @__PURE__ */ e(ye, { value: t.code, className: "cm:grid cm:gap-4 cm:pt-2", children: t.code === S && /* @__PURE__ */ c(U, { children: [
                B("subject", "Subject", "Hi {first_name|there}, something new for you"),
                B("preheader", "Preview text", "Shown after the subject in the inbox", "Optional. Most inboxes show it next to the subject."),
                /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-1.5", children: /* @__PURE__ */ e(
                  We,
                  {
                    fields: J,
                    values: { body: ue.body },
                    errors: A,
                    pathPrefix: `content.${S}`,
                    onChange: (r) => Z("body", String(r.body ?? ""))
                  }
                ) }),
                /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
                  B("button_label", "Button text", "Shop now", "Optional. Leave empty for no button."),
                  B("button_url", "Button link", "{store_url}", "https://…, /a-page, or a smart tag like {cart_url}.")
                ] })
              ] }) }, t.code))
            ] }),
            ee.length > 0 && /* @__PURE__ */ c("p", { role: "alert", className: "cm:text-sm cm:text-amber-700 cm:dark:text-amber-400", children: [
              "Unknown smart ",
              ee.length === 1 ? "tag" : "tags",
              ": ",
              ee.map((t) => `{${t}}`).join(", "),
              ". They will be sent as typed."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c("div", { className: "cm:grid cm:content-start cm:gap-6", children: [
        /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ c(i, { children: [
            /* @__PURE__ */ e(y, { children: "Smart tags" }),
            /* @__PURE__ */ c(v, { children: [
              "Replaced for each customer. Click one to put it in the subject, preview text or button you were editing (or to copy it for the text). Add a fallback after a bar: ",
              "{first_name|there}",
              "."
            ] })
          ] }),
          /* @__PURE__ */ e(g, { children: /* @__PURE__ */ e("ul", { className: "cm:grid cm:gap-1", children: Object.entries(_).map(([t, r]) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onMouseDown: (m) => m.preventDefault(),
              onClick: () => Pe(t),
              className: "cm:flex cm:w-full cm:items-baseline cm:justify-between cm:gap-2 cm:rounded cm:px-2 cm:py-1 cm:text-left cm:hover:bg-muted",
              children: [
                /* @__PURE__ */ e("code", { className: "cm:text-xs", children: `{${t}}` }),
                /* @__PURE__ */ e("span", { className: "cm:text-xs cm:text-muted-foreground", children: r })
              ]
            }
          ) }, t)) }) })
        ] }),
        /* @__PURE__ */ c(x, { children: [
          /* @__PURE__ */ c(i, { children: [
            /* @__PURE__ */ e(y, { children: "Preview" }),
            /* @__PURE__ */ c(v, { children: [
              "With the first matching customer",
              b ? ` (${b.to})` : "",
              ", in the language you are editing."
            ] })
          ] }),
          /* @__PURE__ */ c(g, { className: "cm:grid cm:gap-3", children: [
            /* @__PURE__ */ e(s, { type: "button", variant: "outline", onClick: Ee, disabled: le, children: le ? "Rendering…" : b ? "Refresh preview" : "Show preview" }),
            b && /* @__PURE__ */ c(U, { children: [
              /* @__PURE__ */ c("p", { className: "cm:text-sm", children: [
                /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "Subject:" }),
                " ",
                b.subject
              ] }),
              /* @__PURE__ */ e(
                "a",
                {
                  className: "cm:text-xs cm:underline cm:text-muted-foreground",
                  target: "_blank",
                  rel: "noreferrer",
                  href: L ?? void 0,
                  children: "Open full size"
                }
              ),
              /* @__PURE__ */ e("iframe", { title: "Email preview", srcDoc: b.html, sandbox: "", className: "cm:h-[32rem] cm:w-full cm:rounded-md cm:border cm:bg-white" })
            ] })
          ] })
        ] }),
        n.id && /* @__PURE__ */ c("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => $.post(o(`commerce/marketing/${n.id}/duplicate`)), children: "Duplicate" }),
          /* @__PURE__ */ e(
            s,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "cm:text-destructive",
              onClick: () => window.confirm(`Delete "${n.name}"? Its results go too.`) && $.delete(o(`commerce/marketing/${n.id}`)),
              children: "Delete"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e(Se, { open: De, onOpenChange: V, children: /* @__PURE__ */ c(we, { children: [
      /* @__PURE__ */ c(Ne, { children: [
        /* @__PURE__ */ c(ke, { children: [
          'Send "',
          n.name,
          '"'
        ] }),
        /* @__PURE__ */ c(Ce, { children: [
          f ? `${f.count.toLocaleString()} ${f.count === 1 ? "customer" : "customers"} match now.` : "",
          " The audience is counted again when sending starts; each customer gets it once."
        ] })
      ] }),
      /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-1.5", children: [
        /* @__PURE__ */ e(T, { htmlFor: "send_at", children: "Send at (optional)" }),
        /* @__PURE__ */ e(F, { id: "send_at", type: "datetime-local", value: I, onChange: (t) => Re(t.target.value) }),
        /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Empty: now. Emails go out in the background, in batches." }),
        /* @__PURE__ */ e(O, { message: w("at") })
      ] }),
      /* @__PURE__ */ c(_e, { children: [
        /* @__PURE__ */ e(s, { variant: "outline", onClick: () => V(!1), children: "Not yet" }),
        /* @__PURE__ */ e(s, { onClick: () => $.post(o(`commerce/marketing/${n.id}/send`), I ? { at: new Date(I).toISOString() } : {}, {
          preserveScroll: !0,
          onSuccess: () => V(!1)
        }), children: I ? "Schedule" : "Send now" })
      ] })
    ] }) })
  ] });
}
function Xe({ def: n, value: p, currency: C, path: h, onChange: _ }) {
  const { Input: D, Select: R, SelectContent: H, SelectItem: J, SelectTrigger: W, SelectValue: x } = pe;
  if (!n || n.input === "none") return /* @__PURE__ */ e("span", { className: "cm:self-center cm:text-sm cm:text-muted-foreground", children: "—" });
  if (n.input === "select")
    return /* @__PURE__ */ c(R, { value: String(p ?? ""), onValueChange: _, children: [
      /* @__PURE__ */ e(W, { "aria-label": n.label, children: /* @__PURE__ */ e(x, { placeholder: "Choose" }) }),
      /* @__PURE__ */ e(H, { children: (n.options ?? []).map((i) => /* @__PURE__ */ e(J, { value: i.value, children: i.label }, i.value)) })
    ] });
  if (n.input === "products" || n.input === "categories") {
    const i = { handle: h, type: "commerce_targets", config: { api: o("commerce/api/targets"), types: n.input === "products" ? ["product"] : ["term"] } }, y = (Array.isArray(p) ? p : []).map((v) => ({ ...v, type: n.input === "products" ? "product" : "term" }));
    return /* @__PURE__ */ e(qe, { field: i, value: y, id: h.replace(/\W+/g, "-"), onChange: (v) => _((v ?? []).map((s) => ({ id: s.id, label: s.label }))) });
  }
  const g = n.input === "days" || n.input === "number" || n.input === "money";
  return /* @__PURE__ */ c("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
    n.input === "money" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: C }),
    /* @__PURE__ */ e(
      D,
      {
        "aria-label": n.label,
        type: g ? "number" : "text",
        min: g ? 0 : void 0,
        value: String(p ?? ""),
        onChange: (i) => _(g && i.target.value !== "" ? Number(i.target.value) : i.target.value)
      }
    ),
    n.input === "days" && /* @__PURE__ */ e("span", { className: "cm:text-sm cm:text-muted-foreground", children: "days" })
  ] });
}
export {
  ct as default
};
