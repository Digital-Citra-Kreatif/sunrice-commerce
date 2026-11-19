import { i as d, u as l, a, j as n, b as r, P as f, c as u, S as h } from "./main-DxgJLs0v.js";
import { D as p } from "./DataTable-CJ5NlHrt.js";
import { P as x } from "./PaymentConfirmationDialog-BEE0PaqT.js";
const o = { submitted: "Waiting", approved: "Approved", rejected: "Rejected" };
function y({ status: s, ...c }) {
  const { Button: m } = u, { Link: i } = d;
  return l([{ label: "Shop", href: a("commerce") }, { label: "Payments to verify" }]), /* @__PURE__ */ n("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ r(f, { title: "Payments to verify", description: "Customers’ transfer confirmations. Review the proof and the amount expected." }),
    /* @__PURE__ */ r("nav", { className: "cm:flex cm:flex-wrap cm:gap-2", "aria-label": "Confirmation status", children: Object.entries(o).map(([e, t]) => /* @__PURE__ */ r(m, { size: "sm", variant: e === s ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ r(i, { href: a(`commerce/confirmations?status=${e}`), "aria-current": e === s ? "page" : void 0, children: t }) }, e)) }),
    /* @__PURE__ */ r(
      p,
      {
        ...c,
        searchPlaceholder: "Search order number or sender…",
        renderCell: (e, t) => {
          if (t.key === "order") return /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ r(i, { href: a(e.order.href), className: "cm:font-medium cm:hover:underline", children: e.order.number }),
            /* @__PURE__ */ r("p", { className: "cm:text-xs cm:text-muted-foreground", children: e.order.customer })
          ] });
          if (t.key === "status") return /* @__PURE__ */ r(h, { tone: e.status === "approved" ? "ok" : e.status === "rejected" ? "error" : "warning", children: o[e.status] ?? e.status });
          if (t.key === "actions") return /* @__PURE__ */ r(x, { confirmation: e });
        }
      }
    )
  ] });
}
export {
  y as default
};
