import { i as T, u as j, a as B, b as d, R as E, j as c, c as e, P as H, F as p, S as k, d as O, f as a } from "./main-BZm25ssn.js";
import { r as m } from "./marketing-Bya9hWH-.js";
const b = (r) => `${r.toLocaleString()} ${r === 1 ? "person" : "people"}`, s = (r) => r ? new Date(r).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : "—", _ = { sent: "ok", queued: "info", sending: "info", failed: "error", skipped: "neutral", active: "ok", paused: "warning", cancelled: "error", scheduled: "info" };
function F({ campaign: r, stats: n, links: g, recipients: f }) {
  const { Card: x, CardContent: y, CardHeader: w, CardTitle: N, CardDescription: v, Button: u, Table: C, TableBody: S, TableCell: t, TableHead: l, TableHeader: $, TableRow: o } = O, { router: h, Link: L } = T, q = r.type === "automation";
  return j(), B([
    { label: "Shop", href: d("commerce") },
    { label: "Marketing", href: d("commerce/marketing") },
    { label: q ? "Automations" : "Campaigns", href: d(q ? "commerce/marketing/automations" : "commerce/marketing/campaigns") },
    { label: r.name }
  ]), E.useEffect(() => {
    if (n.queued === 0 && r.status !== "sending") return;
    const i = setInterval(() => h.reload({ only: ["campaign", "stats", "links", "recipients"] }), 5e3);
    return () => clearInterval(i);
  }, [n.queued, r.status]), /* @__PURE__ */ c("div", { className: "cm:flex cm:min-w-0 cm:flex-col cm:gap-6", children: [
    /* @__PURE__ */ e(
      H,
      {
        title: r.name,
        description: /* @__PURE__ */ c(p, { children: [
          "Subject: ",
          r.subject,
          r.trigger ? ` · ${r.trigger}` : "",
          r.started_at ? ` · started ${s(r.started_at)}` : "",
          r.finished_at ? `, finished ${s(r.finished_at)}` : ""
        ] }),
        actions: /* @__PURE__ */ c(p, { children: [
          /* @__PURE__ */ e(k, { tone: _[r.status] ?? "neutral", children: r.status }),
          r.status === "sending" && /* @__PURE__ */ e(u, { variant: "outline", onClick: () => window.confirm("Stop sending? Emails not yet sent won't go out.") && h.post(d(`commerce/marketing/${r.id}/cancel`), {}, { preserveScroll: !0 }), children: "Stop sending" }),
          r.editable && /* @__PURE__ */ e(u, { variant: "outline", asChild: !0, children: /* @__PURE__ */ e(L, { href: d(`commerce/marketing/${r.id}/edit`), children: "Edit" }) }),
          /* @__PURE__ */ e(u, { variant: "outline", onClick: () => h.post(d(`commerce/marketing/${r.id}/duplicate`)), children: "Duplicate" })
        ] })
      }
    ),
    r.status === "sending" && n.recipients === 0 && /* @__PURE__ */ e("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: "Finding the recipients. The queue worker does this in the background (php artisan queue:work)." }),
    n.queued > 0 && /* @__PURE__ */ c("p", { role: "status", className: "cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm", children: [
      n.queued.toLocaleString(),
      " ",
      n.queued === 1 ? "email is" : "emails are",
      " waiting to be sent by the queue worker."
    ] }),
    /* @__PURE__ */ c("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2 cm:lg:grid-cols-5", children: [
      /* @__PURE__ */ e(a, { kpi: { key: "sent", label: "Sent", value: n.sent.toLocaleString(), hint: n.failed > 0 ? `${n.failed} failed` : `of ${n.recipients.toLocaleString()} recipients` } }),
      /* @__PURE__ */ e(a, { kpi: { key: "opened", label: "Opened", value: m(n.opened, n.sent), hint: b(n.opened) } }),
      /* @__PURE__ */ e(a, { kpi: { key: "clicked", label: "Clicked", value: m(n.clicked, n.sent), hint: b(n.clicked) } }),
      /* @__PURE__ */ e(a, { kpi: { key: "ctor", label: "Clicked after opening", value: m(n.clicked, n.opened), hint: "Of those who opened" } }),
      /* @__PURE__ */ e(a, { kpi: { key: "unsubscribed", label: "Unsubscribed", value: m(n.unsubscribed, n.sent), hint: b(n.unsubscribed) } })
    ] }),
    /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: "Opens are counted when the email's images load, so they are approximate: some inboxes load images for everyone, others never. A click also counts as an open." }),
    /* @__PURE__ */ c(x, { children: [
      /* @__PURE__ */ c(w, { children: [
        /* @__PURE__ */ e(N, { children: "Links" }),
        /* @__PURE__ */ e(v, { children: "Clicks on each link in the email." })
      ] }),
      /* @__PURE__ */ e(y, { className: "cm:p-0", children: g.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "No clicks yet." }) : /* @__PURE__ */ c(C, { children: [
        /* @__PURE__ */ e($, { children: /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ e(l, { children: "Link" }),
          /* @__PURE__ */ e(l, { className: "cm:text-right", children: "People" }),
          /* @__PURE__ */ e(l, { className: "cm:text-right", children: "Clicks" })
        ] }) }),
        /* @__PURE__ */ e(S, { children: g.map((i) => /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ e(t, { className: "cm:max-w-md cm:truncate", children: /* @__PURE__ */ e("a", { href: i.url, target: "_blank", rel: "noreferrer", className: "cm:hover:underline", children: i.url }) }),
          /* @__PURE__ */ e(t, { className: "cm:text-right cm:tabular-nums", children: i.unique_clicks }),
          /* @__PURE__ */ e(t, { className: "cm:text-right cm:tabular-nums", children: i.clicks })
        ] }, i.url)) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(x, { children: [
      /* @__PURE__ */ c(w, { children: [
        /* @__PURE__ */ e(N, { children: "Latest recipients" }),
        /* @__PURE__ */ e(v, { children: "The 50 most recent." })
      ] }),
      /* @__PURE__ */ e(y, { className: "cm:p-0", children: f.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:px-6 cm:pb-6 cm:text-sm cm:text-muted-foreground", children: "Nobody yet." }) : /* @__PURE__ */ c(C, { children: [
        /* @__PURE__ */ e($, { children: /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ e(l, { children: "Email" }),
          /* @__PURE__ */ e(l, { children: "Status" }),
          /* @__PURE__ */ e(l, { children: "Sent" }),
          /* @__PURE__ */ e(l, { children: "Opened" }),
          /* @__PURE__ */ e(l, { children: "Clicked" })
        ] }) }),
        /* @__PURE__ */ e(S, { children: f.map((i) => /* @__PURE__ */ c(o, { children: [
          /* @__PURE__ */ c(t, { children: [
            i.email,
            i.unsubscribed && /* @__PURE__ */ c(p, { children: [
              " ",
              /* @__PURE__ */ e(k, { tone: "warning", children: "unsubscribed" })
            ] })
          ] }),
          /* @__PURE__ */ e(t, { children: /* @__PURE__ */ e("span", { title: i.error ?? void 0, children: /* @__PURE__ */ e(k, { tone: _[i.status] ?? "neutral", children: i.status }) }) }),
          /* @__PURE__ */ e(t, { className: "cm:whitespace-nowrap", children: s(i.sent_at) }),
          /* @__PURE__ */ e(t, { className: "cm:whitespace-nowrap", children: s(i.opened_at) }),
          /* @__PURE__ */ e(t, { className: "cm:whitespace-nowrap", children: s(i.clicked_at) })
        ] }, `${i.email}-${i.sent_at}`)) })
      ] }) })
    ] })
  ] });
}
export {
  F as default
};
