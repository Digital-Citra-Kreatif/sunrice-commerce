import { i as l, u as o, a as u, b as r, j as s, c as e, P as m, d as h, S as a } from "./main-BtYEwHjd.js";
import { D as p } from "./DataTable-wHP2fYK-.js";
const f = { published: "ok", draft: "neutral", scheduled: "info", trashed: "error" };
function b(n) {
  const { Button: c } = h, { Link: i } = l;
  return o(), u([{ label: "Shop", href: r("commerce") }, { label: "Products" }]), /* @__PURE__ */ s("div", { className: "cm:grid cm:gap-6 cm:p-4 cm:md:p-6", children: [
    /* @__PURE__ */ e(
      m,
      {
        title: "Products",
        description: "Products are entries: opening one goes to the editor.",
        actions: /* @__PURE__ */ s("div", { className: "cm:flex cm:flex-wrap cm:gap-2", children: [
          /* @__PURE__ */ e(c, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e("a", { href: r("commerce/products/export"), children: "Export CSV" }) }),
          /* @__PURE__ */ e(c, { asChild: !0, variant: "outline", children: /* @__PURE__ */ e(i, { href: r("commerce/products/import"), children: "Import CSV" }) }),
          /* @__PURE__ */ e(c, { asChild: !0, children: /* @__PURE__ */ e(i, { href: r(n.createUrl), children: "New product" }) })
        ] })
      }
    ),
    /* @__PURE__ */ e(
      p,
      {
        ...n,
        searchPlaceholder: "Search titles or SKUs…",
        rowHref: (t) => r(t.href),
        renderCell: (t, d) => {
          switch (d.key) {
            case "product_title":
              return /* @__PURE__ */ s("span", { className: "cm:flex cm:flex-wrap cm:items-center cm:gap-2", children: [
                /* @__PURE__ */ e("span", { className: "cm:font-medium", children: t.product_title }),
                t.featured && /* @__PURE__ */ e(a, { tone: "info", children: "Featured" }),
                t.sync_failed && /* @__PURE__ */ e("span", { title: t.sync_error ?? "", children: /* @__PURE__ */ e(a, { tone: "error", children: "Can't be bought" }) })
              ] });
            case "state":
              return /* @__PURE__ */ e(a, { tone: f[t.state], children: t.state });
            case "stock":
              return t.stock === null ? "—" : /* @__PURE__ */ e("span", { className: t.in_stock === !1 ? "cm:text-destructive" : "", children: t.stock });
            case "type":
              return /* @__PURE__ */ e(a, { children: t.type });
            default:
              return;
          }
        }
      }
    )
  ] });
}
export {
  b as default
};
