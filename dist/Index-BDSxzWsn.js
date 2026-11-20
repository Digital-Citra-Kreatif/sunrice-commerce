import { i as y, R as h, d as j, u as _, a as g, j as a, b as t, P as D, c as k, k as S, S as q, l as C } from "./main-qm0WOjIH.js";
import { D as $ } from "./DataTable-BobDjl6b.js";
const F = { in_stock: "ok", out_of_stock: "error", backorder: "warning" };
function I({ row: s, reasons: m, onClose: r }) {
  const { Dialog: i, DialogContent: o, DialogHeader: n, DialogTitle: d, DialogDescription: N, DialogFooter: x, Button: p, Input: v, Label: l } = k, c = y.useForm({ mode: "add", quantity: 0, reason: "manual", note: "" }), [u, f] = h.useState(null);
  h.useEffect(() => {
    C(g(`commerce/inventory/${s.id}/history`)).then((e) => f(e.data)).catch(() => f([]));
  }, [s.id]);
  const b = c.data.mode === "set" ? c.data.quantity : (s.stock_quantity ?? 0) + c.data.quantity;
  return /* @__PURE__ */ t(i, { open: !0, onOpenChange: (e) => !e && r(), children: /* @__PURE__ */ a(o, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ a(n, { children: [
      /* @__PURE__ */ t(d, { children: "Adjust stock" }),
      /* @__PURE__ */ a(N, { children: [
        s.product_title,
        s.sku ? ` · ${s.sku}` : "",
        ". Now: ",
        s.track_stock ? s.stock_quantity ?? 0 : "not tracked",
        "."
      ] })
    ] }),
    /* @__PURE__ */ a("form", { id: "adjust-stock", className: "cm:grid cm:gap-3", onSubmit: (e) => {
      e.preventDefault(), c.post(g(`commerce/inventory/${s.id}/adjust`), { preserveScroll: !0, onSuccess: r });
    }, children: [
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(l, { htmlFor: "adjust-mode", children: "Change" }),
          /* @__PURE__ */ a("select", { id: "adjust-mode", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: c.data.mode, onChange: (e) => c.setData("mode", e.target.value), children: [
            /* @__PURE__ */ t("option", { value: "add", children: "Add or remove" }),
            /* @__PURE__ */ t("option", { value: "set", children: "Set to" })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(l, { htmlFor: "adjust-quantity", children: c.data.mode === "set" ? "New stock" : "Units (+/−)" }),
          /* @__PURE__ */ t(v, { id: "adjust-quantity", type: "number", value: c.data.quantity, onChange: (e) => c.setData("quantity", Number(e.target.value)) }),
          c.errors.quantity && /* @__PURE__ */ t("p", { className: "cm:text-xs cm:text-destructive", children: c.errors.quantity })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "cm:grid cm:grid-cols-2 cm:gap-3", children: [
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(l, { htmlFor: "adjust-reason", children: "Reason" }),
          /* @__PURE__ */ t("select", { id: "adjust-reason", className: "cm:h-9 cm:rounded-md cm:border cm:bg-background cm:px-3 cm:text-sm", value: c.data.reason, onChange: (e) => c.setData("reason", e.target.value), children: m.map((e) => /* @__PURE__ */ t("option", { value: e, children: e[0].toUpperCase() + e.slice(1) }, e)) })
        ] }),
        /* @__PURE__ */ a("div", { className: "cm:grid cm:gap-1", children: [
          /* @__PURE__ */ t(l, { htmlFor: "adjust-note", children: "Note" }),
          /* @__PURE__ */ t(v, { id: "adjust-note", value: c.data.note, onChange: (e) => c.setData("note", e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "cm:text-sm", children: [
        "Stock after: ",
        /* @__PURE__ */ t("strong", { children: b })
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "cm:grid cm:max-h-56 cm:gap-1 cm:overflow-auto cm:border-t cm:pt-3 cm:text-sm", children: [
      /* @__PURE__ */ t("p", { className: "cm:font-medium", children: "History" }),
      u === null ? /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "Loading…" }) : u.length === 0 ? /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: "No changes yet." }) : u.map((e) => /* @__PURE__ */ a("div", { className: "cm:flex cm:justify-between cm:gap-3", children: [
        /* @__PURE__ */ a("span", { children: [
          e.delta > 0 ? `+${e.delta}` : e.delta,
          " → ",
          e.quantity_after,
          " · ",
          e.reason,
          e.reference ? ` (${e.reference.type} #${e.reference.id})` : "",
          e.note ? ` · ${e.note}` : ""
        ] }),
        /* @__PURE__ */ a("span", { className: "cm:whitespace-nowrap cm:text-muted-foreground", children: [
          e.user ? `${e.user}, ` : "",
          new Date(e.at).toLocaleString()
        ] })
      ] }, e.id))
    ] }),
    /* @__PURE__ */ a(x, { children: [
      /* @__PURE__ */ t(p, { variant: "outline", type: "button", onClick: r, children: "Cancel" }),
      /* @__PURE__ */ t(p, { type: "submit", form: "adjust-stock", disabled: c.processing, children: "Save" })
    ] })
  ] }) });
}
function B(s) {
  const { Button: m } = k, { Link: r } = y, [i, o] = h.useState(null);
  return j(), _([{ label: "Shop", href: g("commerce") }, { label: "Inventory" }]), /* @__PURE__ */ a("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ t(D, { title: "Inventory", description: "Stock of every product variant. Every change is recorded." }),
    /* @__PURE__ */ t(
      $,
      {
        ...s,
        searchPlaceholder: "Search products or SKUs…",
        onRowClick: s.can.adjust ? (n) => o(n) : void 0,
        renderCell: (n, d) => {
          if (d.key === "product_title" && n.edit_url) return /* @__PURE__ */ a("span", { className: "cm:inline-flex cm:items-center cm:gap-2", children: [
            n.product_title,
            /* @__PURE__ */ t(m, { asChild: !0, variant: "ghost", size: "icon", className: "cm:size-8 cm:shrink-0", children: /* @__PURE__ */ t(r, { href: n.edit_url, title: "Edit product", "aria-label": `Edit product ${n.product_title}`, children: /* @__PURE__ */ t(S, {}) }) })
          ] });
          if (d.key === "status") return /* @__PURE__ */ t(q, { tone: n.low ? "warning" : F[n.status], children: n.low ? "Low" : n.status.replace(/_/g, " ") });
          if (d.key === "stock_quantity") return n.track_stock ? n.stock_quantity : /* @__PURE__ */ t("span", { className: "cm:text-muted-foreground", children: "—" });
        }
      }
    ),
    i && /* @__PURE__ */ t(I, { row: i, reasons: s.reasons, onClose: () => o(null) })
  ] });
}
export {
  B as default
};
