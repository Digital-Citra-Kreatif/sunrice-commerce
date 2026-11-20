import { i as f, b as t, q as b, c as v, j as r, a as c, F as k, S as x } from "./main-txcRj4Ln.js";
function C({ sections: m, emails: i }) {
  const { CollapsibleCard: d, CollapsibleCardGroup: o, Switch: h, Button: n } = v, { Link: u, router: l } = f, p = [["To customers", i.filter((a) => a.audience === "customer")], ["To staff", i.filter((a) => a.audience === "staff")]];
  return /* @__PURE__ */ t(b, { sections: m, current: "emails", title: "Emails", description: "What the store sends, and to whom. Open an email to change its texts, recipients and attachments.", children: /* @__PURE__ */ t(o, { className: "cm:gap-6", children: p.map(([a, s]) => s.length > 0 && // Folds away, remembered per browser; folded, it says how many are sent.
  /* @__PURE__ */ t(
    d,
    {
      title: a,
      storageKey: `commerce:settings:emails:${a}`,
      contentClassName: "cm:p-0",
      summary: `${s.filter((e) => e.locked || e.enabled).length} of ${s.length} sent`,
      children: /* @__PURE__ */ t("ul", { className: "cm:divide-y cm:divide-border", children: s.map((e) => /* @__PURE__ */ r("li", { className: "cm:flex cm:items-center cm:justify-between cm:gap-3 cm:px-6 cm:py-3", children: [
        /* @__PURE__ */ r("div", { className: "cm:min-w-0", children: [
          /* @__PURE__ */ t(u, { href: c(e.edit_url), className: "cm:font-medium cm:hover:underline", children: e.label }),
          e.description && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-muted-foreground", children: e.description })
        ] }),
        /* @__PURE__ */ r("div", { className: "cm:flex cm:items-center cm:gap-2", children: [
          e.preview_url && /* @__PURE__ */ r(k, { children: [
            /* @__PURE__ */ t(n, { size: "sm", variant: "ghost", asChild: !0, children: /* @__PURE__ */ t("a", { href: e.preview_url, target: "_blank", rel: "noreferrer", children: "Preview" }) }),
            /* @__PURE__ */ t(n, { size: "sm", variant: "ghost", onClick: () => l.post(c(`commerce/settings/emails/${e.key}/test`), {}, { preserveScroll: !0 }), children: "Send test" })
          ] }),
          e.locked ? /* @__PURE__ */ t(x, { children: "Always sent" }) : /* @__PURE__ */ t(
            h,
            {
              checked: e.enabled,
              "aria-label": `Send ${e.label}`,
              onCheckedChange: (g) => l.put(c(`commerce/settings/emails/${e.key}/enabled`), { enabled: g }, { preserveScroll: !0 })
            }
          )
        ] })
      ] }, e.key)) })
    },
    a
  )) }) });
}
export {
  C as default
};
