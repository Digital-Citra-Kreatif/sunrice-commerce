import { R as h, i as R, j as n, c as S, b as e, F as d, a as T } from "./main-D6k1d5P4.js";
function P({ confirmation: t }) {
  const { Button: o, Dialog: g, DialogTrigger: b, DialogContent: x, DialogFooter: v, DialogHeader: y, DialogTitle: k, DialogDescription: w, Label: D, Textarea: N } = S, [_, l] = h.useState(!1), [i, c] = h.useState(!1), [p, m] = h.useState(""), r = R.useForm({ reason: "", anyway: !1 }), s = t.status === "submitted", j = (a) => {
    l(a), a && (c(!1), m(""), r.reset());
  }, u = (a) => {
    m(""), r.post(T(`commerce/confirmations/${t.id}/${a}`), {
      preserveScroll: !0,
      onSuccess: (C) => {
        const f = C.props.flash?.error;
        f ? m(f) : l(!1);
      }
    });
  };
  return /* @__PURE__ */ n(g, { open: _, onOpenChange: j, children: [
    /* @__PURE__ */ e(b, { asChild: !0, children: /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: s ? "default" : "outline", children: s ? "Review" : "View" }) }),
    /* @__PURE__ */ n(x, { className: "cm:max-h-[90dvh] cm:overflow-y-auto cm:sm:max-w-xl", children: [
      /* @__PURE__ */ n(y, { children: [
        /* @__PURE__ */ e(k, { children: i ? "Reject payment confirmation" : "Payment confirmation" }),
        /* @__PURE__ */ n(w, { children: [
          t.order.number,
          " · ",
          t.order.customer
        ] })
      ] }),
      /* @__PURE__ */ n("dl", { className: "cm:grid cm:grid-cols-[auto_1fr] cm:gap-x-4 cm:gap-y-1 cm:text-sm", children: [
        /* @__PURE__ */ e("dt", { children: "Amount sent" }),
        /* @__PURE__ */ e("dd", { className: "cm:font-semibold", children: t.amount }),
        /* @__PURE__ */ e("dt", { children: "Expected" }),
        /* @__PURE__ */ e("dd", { children: t.expected ?? "—" }),
        /* @__PURE__ */ e("dt", { children: "Sender" }),
        /* @__PURE__ */ n("dd", { children: [
          t.sender_name,
          t.sender_bank ? ` · ${t.sender_bank}` : ""
        ] }),
        /* @__PURE__ */ e("dt", { children: "Transfer date" }),
        /* @__PURE__ */ e("dd", { children: t.transferred_at ?? "—" }),
        t.method && /* @__PURE__ */ n(d, { children: [
          /* @__PURE__ */ e("dt", { children: "Method" }),
          /* @__PURE__ */ e("dd", { children: t.method })
        ] }),
        t.destination && /* @__PURE__ */ n(d, { children: [
          /* @__PURE__ */ e("dt", { children: "Destination" }),
          /* @__PURE__ */ e("dd", { children: [t.destination.bank, t.destination.number, t.destination.holder].filter(Boolean).join(" · ") || "—" })
        ] })
      ] }),
      t.note && /* @__PURE__ */ e("p", { className: "cm:whitespace-pre-line cm:text-sm cm:text-muted-foreground", children: t.note }),
      t.review_note && /* @__PURE__ */ n("p", { className: "cm:text-sm", children: [
        "Rejection reason · ",
        t.review_note
      ] }),
      t.proof_url ? /* @__PURE__ */ e("a", { href: t.proof_url, target: "_blank", rel: "noopener noreferrer", className: "cm:text-sm cm:underline", children: t.proof_is_pdf ? "Open PDF proof" : /* @__PURE__ */ e("img", { src: t.proof_url, alt: `Transfer proof for ${t.order.number}`, className: "cm:max-h-56 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }),
      s && i && /* @__PURE__ */ n("label", { className: "cm:grid cm:gap-2 cm:text-sm", children: [
        /* @__PURE__ */ e("span", { children: "Reason sent to the customer" }),
        /* @__PURE__ */ e(N, { value: r.data.reason, maxLength: 255, onChange: (a) => r.setData("reason", a.target.value) }),
        r.errors.reason && /* @__PURE__ */ e("span", { role: "alert", className: "cm:text-destructive", children: r.errors.reason })
      ] }),
      s && !i && t.short && /* @__PURE__ */ n(D, { className: "cm:items-start", children: [
        /* @__PURE__ */ e("input", { type: "checkbox", checked: r.data.anyway, onChange: (a) => r.setData("anyway", a.currentTarget.checked) }),
        /* @__PURE__ */ e("span", { children: "I confirm approval even though the transfer is below the expected amount." })
      ] }),
      p && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: p }),
      /* @__PURE__ */ e(v, { children: s && i ? /* @__PURE__ */ n(d, { children: [
        /* @__PURE__ */ e(o, { type: "button", variant: "outline", onClick: () => c(!1), disabled: r.processing, children: "Back" }),
        /* @__PURE__ */ e(o, { type: "button", variant: "destructive", onClick: () => u("reject"), disabled: r.processing || r.data.reason.trim() === "", children: "Reject confirmation" })
      ] }) : s ? /* @__PURE__ */ n(d, { children: [
        /* @__PURE__ */ e(o, { type: "button", variant: "outline", onClick: () => c(!0), disabled: r.processing, children: "Reject" }),
        /* @__PURE__ */ e(o, { type: "button", onClick: () => u("approve"), disabled: r.processing || t.short && !r.data.anyway, children: "Approve" })
      ] }) : /* @__PURE__ */ e(o, { type: "button", variant: "outline", onClick: () => l(!1), children: "Close" }) })
    ] })
  ] });
}
export {
  P
};
