import { i as m, u as p, a as f, b as t, j as n, c as r, P as g, d as b, S as c } from "./main-wV99lHGN.js";
import { D as x } from "./DataTable-CGaXgN4e.js";
const C = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function P(a) {
  const { Button: l, DropdownMenu: d, DropdownMenuTrigger: i, DropdownMenuContent: o, DropdownMenuItem: u } = b, { Link: s } = m;
  return p(), f([{ label: "Shop", href: t("commerce") }, { label: "Products" }]), /* @__PURE__ */ n("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ r(
      g,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        primary: a.create.length === 1 ? /* @__PURE__ */ r(l, { asChild: !0, children: /* @__PURE__ */ r(s, { href: t(a.create[0].url), children: "New product" }) }) : a.create.length > 1 ? (
          // Several product collections: choose which the product goes in.
          /* @__PURE__ */ n(d, { children: [
            /* @__PURE__ */ r(i, { asChild: !0, children: /* @__PURE__ */ r(l, { children: "New product" }) }),
            /* @__PURE__ */ r(o, { align: "end", children: a.create.map((e) => /* @__PURE__ */ r(u, { asChild: !0, children: /* @__PURE__ */ r(s, { href: t(e.url), children: e.label }) }, e.url)) })
          ] })
        ) : void 0,
        menu: [
          { label: "Export CSV", href: t("commerce/products/export"), download: !0 },
          { label: "Import CSV", href: t("commerce/products/import") }
        ]
      }
    ),
    /* @__PURE__ */ r(
      x,
      {
        ...a,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (e) => t(e.href),
        renderCell: (e, h) => {
          switch (h.key) {
            case "product_title":
              return /* @__PURE__ */ n("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ r("span", { className: "cm:font-medium", children: e.product_title }),
                e.featured && /* @__PURE__ */ r(c, { tone: "info", children: "Featured" }),
                e.sync_failed && /* @__PURE__ */ r("span", { title: e.sync_error ?? "", children: /* @__PURE__ */ r(c, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ r(c, { tone: C[e.state], children: e.state });
            case "stock":
              return e.stock === null ? "—" : /* @__PURE__ */ r("span", { className: e.in_stock === !1 ? "cm:text-destructive" : "", children: e.stock });
            case "type":
              return /* @__PURE__ */ r(c, { children: e.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
export {
  P as default
};
