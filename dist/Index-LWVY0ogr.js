import { i as k, u as w, a as S, b as a, R as p, j as t, c as r, P as R, d as $, E as D, F as f, S as P } from "./main-wV99lHGN.js";
function B({ status: m, confirmations: d }) {
  const { Card: g, CardContent: x, Button: n, Input: v, Dialog: b, DialogContent: _, DialogFooter: N, DialogHeader: C, DialogTitle: j } = $, { Link: s, router: c } = k;
  w(), S([{ label: "Shop", href: a("commerce") }, { label: "Payments to verify" }]);
  const [i, o] = p.useState(null), [l, u] = p.useState(""), y = (e) => {
    const h = e.expected_amount !== null && e.amount_value < e.expected_amount;
    h && !window.confirm(`${e.amount} is less than the ${e.expected} expected. Approve anyway?`) || c.post(a(`commerce/confirmations/${e.id}/approve`), { anyway: h }, { preserveScroll: !0 });
  };
  return /* @__PURE__ */ t("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ r(R, { title: "Payments to verify", description: "Customers' transfer confirmations. Compare the proof with the amount expected, then approve or reject." }),
    /* @__PURE__ */ r("div", { className: "cm:flex cm:gap-2", children: ["submitted", "approved", "rejected"].map((e) => /* @__PURE__ */ r(n, { size: "sm", variant: e === m ? "default" : "outline", asChild: !0, children: /* @__PURE__ */ r(s, { href: a(`commerce/confirmations?status=${e}`), children: e === "submitted" ? "Waiting" : e[0].toUpperCase() + e.slice(1) }) }, e)) }),
    d.length === 0 && /* @__PURE__ */ r(D, { title: m === "submitted" ? "Nothing to verify" : "None yet" }),
    d.map((e) => /* @__PURE__ */ r(g, { children: /* @__PURE__ */ t(x, { className: "cm:grid cm:gap-4 cm:pt-6 cm:md:grid-cols-[1fr_16rem]", children: [
      /* @__PURE__ */ t("div", { className: "cm:grid cm:content-start cm:gap-1 cm:text-sm", children: [
        /* @__PURE__ */ t("p", { className: "cm:text-base cm:font-medium", children: [
          /* @__PURE__ */ r(s, { href: a(e.order.href), className: "cm:hover:underline", children: e.order.number }),
          " · ",
          e.order.customer
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "Sent ",
          /* @__PURE__ */ r("strong", { children: e.amount }),
          e.expected && /* @__PURE__ */ t(f, { children: [
            " · expected ",
            /* @__PURE__ */ r("strong", { children: e.expected })
          ] }),
          e.expected_amount !== null && e.amount_value < e.expected_amount && /* @__PURE__ */ t(f, { children: [
            " ",
            /* @__PURE__ */ r(P, { tone: "warning", children: "Less than expected" })
          ] })
        ] }),
        /* @__PURE__ */ t("p", { children: [
          "From ",
          e.sender_name,
          e.sender_bank ? ` (${e.sender_bank})` : "",
          " on ",
          e.transferred_at ?? "—"
        ] }),
        e.destination && /* @__PURE__ */ t("p", { children: [
          "Into ",
          e.destination.bank,
          " ",
          e.destination.number,
          " · ",
          e.destination.holder
        ] }),
        e.method && /* @__PURE__ */ r("p", { className: "cm:text-muted-foreground", children: e.method }),
        e.note && /* @__PURE__ */ t("p", { className: "cm:whitespace-pre-line cm:text-muted-foreground", children: [
          "“",
          e.note,
          "”"
        ] }),
        e.review_note && /* @__PURE__ */ t("p", { className: "cm:text-muted-foreground", children: [
          "Rejected: ",
          e.review_note
        ] }),
        e.status === "submitted" && /* @__PURE__ */ t("div", { className: "cm:mt-2 cm:flex cm:gap-2", children: [
          /* @__PURE__ */ r(n, { size: "sm", onClick: () => y(e), children: "Approve" }),
          /* @__PURE__ */ r(n, { size: "sm", variant: "outline", onClick: () => {
            o(e), u("");
          }, children: "Reject" })
        ] })
      ] }),
      /* @__PURE__ */ r("div", { children: e.proof_url ? e.proof_is_pdf ? /* @__PURE__ */ r("a", { href: e.proof_url, target: "_blank", rel: "noreferrer", className: "cm:underline", children: "Open the PDF proof" }) : /* @__PURE__ */ r("a", { href: e.proof_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ r("img", { src: e.proof_url, alt: `Proof for ${e.order.number}`, className: "cm:max-h-72 cm:w-full cm:rounded-md cm:border cm:object-contain" }) }) : /* @__PURE__ */ r("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No proof attached." }) })
    ] }) }, e.id)),
    /* @__PURE__ */ r(b, { open: i !== null, onOpenChange: (e) => !e && o(null), children: /* @__PURE__ */ t(_, { children: [
      /* @__PURE__ */ r(C, { children: /* @__PURE__ */ r(j, { children: "Reject this confirmation?" }) }),
      /* @__PURE__ */ r("p", { className: "cm:text-sm cm:text-muted-foreground", children: "The customer is emailed the reason and can confirm again; the payment deadline resumes." }),
      /* @__PURE__ */ r(v, { "aria-label": "Reason", placeholder: "e.g. We haven't received the transfer yet", value: l, onChange: (e) => u(e.target.value) }),
      /* @__PURE__ */ t(N, { children: [
        /* @__PURE__ */ r(n, { variant: "outline", onClick: () => o(null), children: "Back" }),
        /* @__PURE__ */ r(n, { disabled: l.trim() === "", onClick: () => i && c.post(a(`commerce/confirmations/${i.id}/reject`), { reason: l }, { preserveScroll: !0, onSuccess: () => o(null) }), children: "Reject" })
      ] })
    ] }) })
  ] });
}
export {
  B as default
};
