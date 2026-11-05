import { i as b, c as r, m as x, j as a, d as k, b as s, F as C, S as y } from "./main-BtYEwHjd.js";
function w({ sections: d, emails: i }) {
  const { Card: m, CardContent: o, CardHeader: h, CardTitle: u, Switch: p, Button: c } = k, { Link: f, router: n } = b, g = [["To customers", i.filter((t) => t.audience === "customer")], ["To staff", i.filter((t) => t.audience === "staff")]];
  return /* @__PURE__ */ r(x, { sections: d, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: g.map(([t, l]) => l.length > 0 && /* @__PURE__ */ a(m, { children: [
    /* @__PURE__ */ r(h, { children: /* @__PURE__ */ r(u, { children: t }) }),
    /* @__PURE__ */ r(o, { className: "cm:p-0", children: /* @__PURE__ */ r("ul", { className: "cm:divide-y cm:divide-border", children: l.map((e) => /* @__PURE__ */ a("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
      /* @__PURE__ */ a("div", { className: "cm:min-w-0", children: [
        /* @__PURE__ */ r(f, { href: s(e.edit_url), className: "cm:font-medium cm:hover:underline", children: e.label }),
        e.description && /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: e.description })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
        e.preview_url && /* @__PURE__ */ a(C, { children: [
          /* @__PURE__ */ r(c, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ r("a", { href: e.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
          /* @__PURE__ */ r(c, { size: "sm", variant: "ghost", onClick: () => n.post(s(`commerce/settings/emails/${e.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
        ] }),
        e.locked ? /* @__PURE__ */ r(y, { children: "Always sent" }) : /* @__PURE__ */ r(
          p,
          {
            checked: e.enabled,
            "aria-label": `Send ${e.label}`,
            onCheckedChange: (v) => n.put(s(`commerce/settings/emails/${e.key}/enabled`), { enabled: v }, { preserveScroll: !0 })
          }
        )
      ] })
    ] }, e.key)) }) })
  ] }, t)) });
}
export {
  w as default
};
