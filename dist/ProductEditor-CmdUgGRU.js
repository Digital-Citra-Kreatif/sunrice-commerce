import { c as e, m as W, j as m, d as D, M as Z, R as x, h as E, b as R, g as z, t as ee, S as te, k as ne, u as le, i as ie, e as re } from "./main-UjOiT65M.js";
function j() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function H(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function ae(t) {
  let n = [{}];
  for (const r of t) {
    if (r.values.length === 0) return [];
    const a = [];
    for (const s of n)
      for (const l of r.values)
        a.push({ ...s, [r.id]: l.id });
    n = a;
  }
  return t.length === 0 ? [] : n;
}
function se(t, n, r, a = 100) {
  const s = new Map(n.map((l) => [H(l.options), l]));
  return ae(t).slice(0, a).map((l) => {
    const i = s.get(H(l));
    return i ? { ...i, options: l } : { ...r, id: j(), sku: null, options: l, active: !0, price: r.price ?? 0 };
  });
}
function X(t, n, r = {}) {
  return t.map((a) => {
    const s = a.values.find((l) => l.id === n.options[a.id]);
    return s ? s.label ?? (s.term_id ? r[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function g({ label: t, hint: n, children: r, htmlFor: a, className: s }) {
  const { Label: l } = D;
  return /* @__PURE__ */ m("div", { className: W("cm:grid cm:content-start cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(l, { htmlFor: a, children: t }),
    r,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function M({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: W("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function S({ id: t, value: n, onChange: r, min: a = 0, placeholder: s }) {
  const { Input: l } = D;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: n ?? "",
      placeholder: s,
      onChange: (i) => r(i.target.value === "" ? null : Math.round(Number(i.target.value)))
    }
  );
}
function U({ id: t, value: n, onChange: r, placeholder: a, onBlur: s }) {
  const { Input: l } = D;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: a,
      onBlur: s,
      onChange: (i) => r(i.target.value === "" ? null : i.target.value)
    }
  );
}
function O({ id: t, value: n, onChange: r, nullable: a = !0 }) {
  return /* @__PURE__ */ e(Z, { id: t, value: n, allowNull: a, onChange: r });
}
function L({ id: t, label: n, checked: r, onChange: a, hint: s }) {
  const { Switch: l, Label: i } = D;
  return /* @__PURE__ */ m("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: t, checked: r, onCheckedChange: a }),
    /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(i, { htmlFor: t, children: n }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const oe = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function A({ id: t, value: n, onChange: r, options: a }) {
  return /* @__PURE__ */ e("select", { id: t, className: oe, value: n, onChange: (s) => r(s.target.value), children: a.map(([s, l]) => /* @__PURE__ */ e("option", { value: s, children: l }, s)) });
}
function B({ title: t, description: n, children: r, actions: a }) {
  return /* @__PURE__ */ m("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ m("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      a
    ] }),
    r
  ] });
}
function ce({ value: t, update: n, path: r }) {
  const { Button: a, Input: s } = D, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [i, o] = x.useState({}), [k, N] = x.useState(""), [w, u] = x.useState([]), c = l.items.map((d) => d.variant_id).filter((d) => !!d);
  x.useEffect(() => {
    const d = c.filter((v) => !i[v]);
    d.length !== 0 && E(R(`commerce/api/variants?${d.map((v) => `ids[]=${v}`).join("&")}`)).then((v) => o((p) => ({ ...p, ...Object.fromEntries(v.data.map(($) => [$.id, $])) }))).catch(() => {
    });
  }, [c.join(",")]), x.useEffect(() => {
    if (k.trim().length < 2) return u([]);
    const d = setTimeout(() => E(R(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((v) => u(v.data)).catch(() => {
    }), 250);
    return () => clearTimeout(d);
  }, [k]);
  const b = (d) => n({ bundle: { ...l, ...d } }), _ = l.items.reduce((d, v) => d + (i[v.variant_id ?? 0]?.price ?? 0) * v.quantity, 0);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(B, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((d, v) => /* @__PURE__ */ m("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: i[d.variant_id ?? 0]?.label ?? `#${d.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(S, { min: 1, value: d.quantity, onChange: (p) => b({ items: l.items.map(($, F) => F === v ? { ...$, quantity: p ?? 1 } : $) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => b({ items: l.items.filter((p, $) => $ !== v) }), children: "Remove" })
      ] }, v)),
      /* @__PURE__ */ m("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (d) => N(d.target.value) }),
        w.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: w.map((d) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((v) => ({ ...v, [d.id]: d })), b({ items: [...l.items, { variant_id: d.id, quantity: 1 }] }), N("");
            },
            children: [
              /* @__PURE__ */ m("span", { children: [
                d.label,
                d.sku && /* @__PURE__ */ m("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  d.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: z(d.price) })
            ]
          }
        ) }, d.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(B, { title: "Bundle price", description: `The products cost ${z(_)} together.`, children: /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${r}-bundle-pricing`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${r}-bundle-pricing`,
          value: l.pricing,
          onChange: (d) => b({ pricing: d, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(g, { label: "Percent off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(S, { id: `${r}-bundle-value`, value: l.value / 100, onChange: (d) => b({ value: Math.round((d ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(g, { label: "Amount off", htmlFor: `${r}-bundle-value`, children: /* @__PURE__ */ e(O, { id: `${r}-bundle-value`, value: l.value, nullable: !1, onChange: (d) => b({ value: d ?? 0 }) }) })
    ] }) })
  ] });
}
function de() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function me({ value: t, update: n, path: r }) {
  const { Button: a } = D, [s, l] = x.useState(!1), i = x.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (u) => n({ delivery: { ...o, ...u } }), N = (u, c) => n({ downloads: t.downloads.map((b, _) => _ === u ? { ...b, ...c } : b) }), w = async (u) => {
    if (u?.length) {
      l(!0);
      try {
        const c = [];
        for (const b of Array.from(u)) {
          const _ = new FormData();
          _.append("file", b);
          const d = await fetch(R("commerce/api/downloads"), { method: "POST", body: _, headers: { "X-XSRF-TOKEN": de(), Accept: "application/json" }, credentials: "same-origin" }), v = await d.json();
          if (!d.ok) throw new Error(v.message ?? "Upload failed");
          c.push({ id: j(), type: "file", file_id: v.data.id, url: null, name: b.name.replace(/\.[^.]+$/, ""), file: v.data });
        }
        n({ downloads: [...t.downloads, ...c] });
      } catch (c) {
        ee.error(c instanceof Error ? c.message : "Upload failed");
      } finally {
        l(!1), i.current && (i.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(
      B,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ m("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => i.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: j(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: i, type: "file", multiple: !0, hidden: !0, onChange: (u) => w(u.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((u, c) => /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Name", htmlFor: `${r}-dl-${c}`, children: /* @__PURE__ */ e(U, { id: `${r}-dl-${c}`, value: u.name, onChange: (b) => N(c, { name: b ?? "" }) }) }),
            u.type === "url" ? /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${r}-dl-${c}-url`, children: /* @__PURE__ */ e(U, { id: `${r}-dl-${c}-url`, value: u.url, placeholder: "https://", onChange: (b) => N(c, { url: b }) }) }) : /* @__PURE__ */ e(g, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: u.file?.filename ?? `File #${u.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((b, _) => _ !== c) }), children: "Remove" })
          ] }, u.id ?? c))
        ]
      }
    ),
    /* @__PURE__ */ m(B, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([u, c]) => /* @__PURE__ */ e(
        L,
        {
          id: `${r}-mode-${u}`,
          label: c,
          checked: o.modes.includes(u),
          onChange: (b) => k({ modes: b ? [...o.modes, u] : o.modes.filter((_) => _ !== u) })
        },
        u
      )) }),
      /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Downloads per file", htmlFor: `${r}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(S, { id: `${r}-limit`, min: 1, value: o.download_limit, onChange: (u) => k({ download_limit: u }) }) }),
        /* @__PURE__ */ e(g, { label: "Links expire after (days)", htmlFor: `${r}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(S, { id: `${r}-expiry`, min: 1, value: o.expiry_days, onChange: (u) => k({ expiry_days: u }) }) })
      ] })
    ] })
  ] });
}
function J({ id: t, value: n, onChange: r, entryId: a }) {
  const [s, l] = x.useState(null);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(U, { id: t, value: n, onChange: (o) => {
      l(null), r(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(a ?? 0) });
      E(R(`commerce/api/sku-check?${o}`)).then((k) => l(k.available ? null : k.product ?? "another product")).catch(() => l(null));
    } }),
    s && /* @__PURE__ */ m("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const G = [
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button"]
];
function ue({ value: t, update: n, updateVariant: r, config: a, purchaseDefault: s, entryId: l, path: i }) {
  const { Button: o } = D, k = [["simple", "Simple product"]];
  (a.features.variants || t.type === "variable") && k.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || t.type === "bundle") && k.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], u = t.external_links.some((p) => p.url) ? s?.with_links : s?.without_links, c = G.find(([p]) => p === u?.type)?.[1], b = u?.source_name ? `${u.source} settings (${u.source_name})` : `${u?.source ?? "store"} settings`, _ = c ? `Default · ${c}` : "Default · Inherit settings", d = t.purchase_mode === "default" ? c ? `Inherited from ${b}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", v = t.purchase_mode === "external" || t.purchase_mode === "default" && s?.with_links.type === "external";
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ m(M, { cols: 2, children: [
      /* @__PURE__ */ e(g, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(A, { id: `${i}-type`, value: t.type, options: k, onChange: (p) => n({ type: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Storefront button", htmlFor: `${i}-mode`, hint: d, children: /* @__PURE__ */ e(A, { id: `${i}-mode`, value: t.purchase_mode, options: [["default", _], ...G], onChange: (p) => n({ purchase_mode: p }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(B, { title: "Pricing and SKU", children: /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(O, { id: `${i}-price`, value: N.price, nullable: !1, onChange: (p) => r(0, { price: p ?? 0 }) }) }),
      /* @__PURE__ */ e(g, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(O, { id: `${i}-compare`, value: N.compare_at_price, onChange: (p) => r(0, { compare_at_price: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(O, { id: `${i}-cost`, value: N.cost, onChange: (p) => r(0, { cost: p }) }) }),
      /* @__PURE__ */ e(g, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e(J, { id: `${i}-sku`, value: N.sku, entryId: l, onChange: (p) => r(0, { sku: p }) }) })
    ] }) }),
    (v || t.external_links.length > 0) && /* @__PURE__ */ e(
      B,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((p, $) => {
          const F = (f) => n({ external_links: t.external_links.map((C, h) => h === $ ? { ...C, ...f } : C) });
          return /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Shop", htmlFor: `${i}-link-${$}-preset`, children: /* @__PURE__ */ e(
              A,
              {
                id: `${i}-link-${$}-preset`,
                value: p.preset ?? "",
                onChange: (f) => F({ preset: f || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(g, { label: "Button label", htmlFor: `${i}-link-${$}-label`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${$}-label`, value: p.label, placeholder: p.preset ? `Buy on ${a.link_presets[p.preset]}` : "", onChange: (f) => F({ label: f }) }) }),
            /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${i}-link-${$}-url`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${$}-url`, value: p.url, placeholder: "https://", onChange: (f) => F({ url: f }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((f, C) => C !== $) }), children: "Remove" })
          ] }, $);
        })
      }
    ),
    /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(L, { id: `${i}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (p) => n({ requires_shipping: p }), hint: "Off for services and digital products." }),
      (a.features.digital || t.downloadable) && /* @__PURE__ */ e(L, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (p) => n({ downloadable: p }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(L, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (p) => n({ featured: p }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(g, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
      A,
      {
        id: `${i}-tax`,
        value: t.tax_class ?? "",
        onChange: (p) => n({ tax_class: p || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((p) => p !== "standard").map((p) => [p, p])]
      }
    ) })
  ] });
}
function Q({ variantKey: t, tab: n, sku: r }) {
  const a = n.live?.variants[t], s = n.live?.stock_adjustment?.reasons, [l, i] = x.useState(!1), { Button: o } = D;
  return !a || a.stock_quantity === null ? null : /* @__PURE__ */ m(g, { label: "In stock", children: [
    /* @__PURE__ */ m("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: a.stock_quantity }),
      s && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => i(!0), children: "Adjust stock" })
    ] }),
    l && s && /* @__PURE__ */ e(
      he,
      {
        id: a.id,
        stock: a.stock_quantity,
        sku: r,
        reasons: s,
        onClose: () => i(!1),
        onAdjusted: (k) => n.updateLiveStock(t, a.id, k)
      },
      a.id
    )
  ] });
}
function he({ id: t, stock: n, sku: r, reasons: a, onClose: s, onAdjusted: l }) {
  const { Button: i, Dialog: o, DialogContent: k, DialogDescription: N, DialogFooter: w, DialogHeader: u, DialogTitle: c, Input: b } = D, [_, d] = x.useState("add"), [v, p] = x.useState(""), [$, F] = x.useState(a[0]), [f, C] = x.useState(null), [h, y] = x.useState(""), [q, P] = x.useState(!1), T = x.useId();
  async function V(I) {
    if (I.preventDefault(), I.stopPropagation(), !(q || h || v === "")) {
      P(!0), y("");
      try {
        const Y = await E(R(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: _, quantity: Number(v), reason: $, note: f })
        });
        l(Y.stock_quantity), s();
      } catch {
        y("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        P(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (I) => {
    !I && !q && s();
  }, children: /* @__PURE__ */ m(k, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ m(u, { children: [
      /* @__PURE__ */ e(c, { children: "Adjust stock" }),
      /* @__PURE__ */ m(N, { children: [
        r ? `${r} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ m("form", { id: T, className: "cm:grid cm:gap-4", onSubmit: V, children: [
      /* @__PURE__ */ m("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Adjustment", htmlFor: `${T}-mode`, children: /* @__PURE__ */ e(
          A,
          {
            id: `${T}-mode`,
            value: _,
            onChange: (I) => {
              d(I), p("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(g, { label: _ === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${T}-quantity`, children: /* @__PURE__ */ e(
          b,
          {
            id: `${T}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: _ === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: v,
            onChange: (I) => p(I.target.value)
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Reason", htmlFor: `${T}-reason`, children: /* @__PURE__ */ e(
          A,
          {
            id: `${T}-reason`,
            value: $,
            onChange: F,
            options: a.map((I) => [I, I[0].toUpperCase() + I.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Note (optional)", htmlFor: `${T}-note`, children: /* @__PURE__ */ e(b, { id: `${T}-note`, value: f ?? "", maxLength: 255, onChange: (I) => C(I.target.value || null) }) })
      ] }),
      h && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: h })
    ] }),
    /* @__PURE__ */ m(w, { children: [
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", disabled: q, onClick: s, children: "Cancel" }),
      /* @__PURE__ */ e(i, { type: "submit", form: T, disabled: q || v === "" || !!h, children: q ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function pe(t) {
  const { value: n, updateVariant: r, live: a, path: s } = t, l = n.variants[0];
  if (!l) return null;
  const i = a?.variants[l.id];
  return /* @__PURE__ */ m(B, { title: "Stock", children: [
    /* @__PURE__ */ e(
      L,
      {
        id: `${s}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => r(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    l.track_stock ? /* @__PURE__ */ m(M, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: l.id, tab: t, sku: l.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${s}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(S, { id: `${s}-initial`, value: l.initial_stock, onChange: (o) => r(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${s}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${s}-backorders`,
          value: l.backorders,
          onChange: (o) => r(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(g, { label: "Low stock at", htmlFor: `${s}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(S, { id: `${s}-low`, value: l.low_stock_threshold, onChange: (o) => r(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${s}-status`, children: /* @__PURE__ */ e(
      A,
      {
        id: `${s}-status`,
        value: l.stock_status,
        onChange: (o) => r(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ge({ value: t, update: n, path: r }) {
  const { Button: a } = D, s = (l, i) => n({ tiers: t.tiers.map((o, k) => k === l ? { ...o, ...i } : o) });
  return /* @__PURE__ */ m(
    B,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        a,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => n({ tiers: [...t.tiers, { min_qty: (t.tiers.at(-1)?.min_qty ?? 1) + 9, type: "percent_off", value: 500, variant: null }] }),
          children: "Add tier"
        }
      ),
      children: [
        t.tiers.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No bulk prices." }),
        t.tiers.map((l, i) => /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(g, { label: "From (units)", htmlFor: `${r}-tier-${i}-min`, children: /* @__PURE__ */ e(S, { id: `${r}-tier-${i}-min`, min: 2, value: l.min_qty, onChange: (o) => s(i, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${r}-tier-${i}-type`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${r}-tier-${i}-type`,
              value: l.type,
              onChange: (o) => s(i, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(g, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${r}-tier-${i}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(S, { id: `${r}-tier-${i}-value`, value: l.value / 100, onChange: (o) => s(i, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(O, { id: `${r}-tier-${i}-value`, value: l.value, nullable: !1, onChange: (o) => s(i, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(g, { label: "For", htmlFor: `${r}-tier-${i}-variant`, children: /* @__PURE__ */ e(
            A,
            {
              id: `${r}-tier-${i}-variant`,
              value: l.variant ?? "",
              onChange: (o) => s(i, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, X(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, k) => k !== i) }), children: "Remove" })
        ] }, i))
      ]
    }
  );
}
function fe({ value: t, update: n, updateVariant: r, path: a }) {
  const s = t.variants[0];
  if (!s) return null;
  const l = (i) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...i })) }) : r(0, i);
  return /* @__PURE__ */ e(B, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ m(M, { cols: 4, children: [
    /* @__PURE__ */ e(g, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(S, { id: `${a}-weight`, value: s.weight, onChange: (i) => l({ weight: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(S, { id: `${a}-length`, value: s.length, onChange: (i) => l({ length: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(S, { id: `${a}-width`, value: s.width, onChange: (i) => l({ width: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(S, { id: `${a}-height`, value: s.height, onChange: (i) => l({ height: i }) }) })
  ] }) });
}
const K = {
  options: {},
  sku: null,
  barcode: null,
  price: 0,
  compare_at_price: null,
  cost: null,
  weight: null,
  length: null,
  width: null,
  height: null,
  image: null,
  requires_shipping: null,
  downloadable: null,
  track_stock: !1,
  initial_stock: null,
  backorders: "no",
  low_stock_threshold: null,
  stock_status: "in_stock",
  min_qty: 1,
  max_qty: null,
  qty_step: 1,
  active: !0,
  downloads: []
};
function be({ option: t, onChange: n, onRemove: r, config: a, path: s }) {
  const { Button: l, Input: i, Badge: o } = D, [k, N] = x.useState(""), w = () => {
    const c = k.split(",").map((b) => b.trim()).filter(Boolean).filter((b) => !t.values.some((_) => (_.label ?? "").toLowerCase() === b.toLowerCase()));
    c.length && n({ ...t, values: [...t.values, ...c.map((b) => ({ id: j(), label: b }))] }), N("");
  }, u = t.values.map((c) => c.term_id).filter((c) => !!c);
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ m("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(g, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(i, { id: `${s}-name`, value: t.name, placeholder: "Size", onChange: (c) => n({ ...t, name: c.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(g, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${s}-source`,
          value: t.taxonomy ?? "",
          onChange: (c) => n({ ...t, taxonomy: c || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((c) => [c.handle, c.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: r, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      ne,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (a.attribute_taxonomies.find((c) => c.handle === t.taxonomy)?.terms ?? []).map((c) => ({ value: String(c.id), label: c.title }))
        } }],
        values: { terms: u },
        pathPrefix: `${s}-terms`,
        onChange: (c) => {
          const b = c.terms ?? [], _ = t.values.filter((v) => v.term_id && b.includes(v.term_id)), d = b.filter((v) => !_.some((p) => p.term_id === v)).map((v) => ({ id: j(), term_id: v }));
          n({ ...t, values: [..._, ...d] });
        }
      }
    ) : /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((c) => /* @__PURE__ */ m(o, { variant: "secondary", className: "cm:gap-1", children: [
        c.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${c.label}`, onClick: () => n({ ...t, values: t.values.filter((b) => b.id !== c.id) }), children: "×" })
      ] }, c.id)) }),
      /* @__PURE__ */ m("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          i,
          {
            value: k,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (c) => N(c.target.value),
            onKeyDown: (c) => {
              c.key === "Enter" && (c.preventDefault(), w());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: w, children: "Add" })
      ] })
    ] })
  ] });
}
function ve({ variant: t, index: n, updateVariant: r, tab: a }) {
  const { MediaPickerInput: s } = D, l = `${a.path}-v${n}`, i = a.live?.variants[t.id];
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(O, { id: `${l}-cost`, value: t.cost, onChange: (o) => r(n, { cost: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(U, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => r(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(S, { id: `${l}-weight`, value: t.weight, onChange: (o) => r(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(g, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ m("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(S, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => r(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(S, { min: 1, value: t.max_qty, onChange: (o) => r(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(S, { min: 1, value: t.qty_step, onChange: (o) => r(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ m(M, { cols: 4, children: [
      /* @__PURE__ */ e(L, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => r(n, { track_stock: o }) }),
      t.track_stock && (i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: t.id, tab: a, sku: t.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(S, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => r(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => r(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        A,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => r(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(g, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(s, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => r(n, { image: o }) }) })
  ] });
}
function ke(t) {
  const { value: n, update: r, updateVariant: a, config: s, entryId: l, live: i } = t, { Button: o, Table: k, TableBody: N, TableCell: w, TableHead: u, TableHeader: c, TableRow: b, Switch: _ } = D, [d, v] = x.useState(null), p = Object.fromEntries(t.config.attribute_taxonomies.flatMap((f) => f.terms.map((C) => [C.id, C.title]))), $ = n.variants[0] ?? { ...K, id: j() }, F = (f = n.options) => r({ options: f, variants: se(f, n.variants, { ...$, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      B,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < s.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => r({ options: [...n.options, { id: j(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((f, C) => /* @__PURE__ */ e(
          be,
          {
            option: f,
            config: s,
            path: `${t.path}-o${C}`,
            onChange: (h) => F(n.options.map((y, q) => q === C ? h : y)),
            onRemove: () => F(n.options.filter((h, y) => y !== C))
          },
          f.id
        ))
      }
    ),
    /* @__PURE__ */ m(
      B,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => F(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ m(k, { children: [
            /* @__PURE__ */ e(c, { children: /* @__PURE__ */ m(b, { children: [
              /* @__PURE__ */ e(u, { children: "Variant" }),
              /* @__PURE__ */ e(u, { children: "SKU" }),
              /* @__PURE__ */ e(u, { children: "Price" }),
              /* @__PURE__ */ e(u, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(u, { children: "Stock" }),
              /* @__PURE__ */ e(u, { children: "On sale" }),
              /* @__PURE__ */ e(u, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((f, C) => {
              const h = i?.variants[f.id];
              return /* @__PURE__ */ m(x.Fragment, { children: [
                /* @__PURE__ */ m(b, { className: f.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(w, { className: "cm:font-medium cm:whitespace-nowrap", children: X(n.options, f, p) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-36", children: /* @__PURE__ */ e(J, { value: f.sku, entryId: l, onChange: (y) => a(C, { sku: y }) }) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.price, nullable: !1, onChange: (y) => a(C, { price: y ?? 0 }) }) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.compare_at_price, onChange: (y) => a(C, { compare_at_price: y }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(w, { className: "cm:whitespace-nowrap cm:text-sm", children: f.track_stock ? h?.stock_quantity ?? f.initial_stock ?? 0 : /* @__PURE__ */ e(te, { children: f.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(w, { children: /* @__PURE__ */ e(_, { checked: f.active, "aria-label": "Sell this variant", onCheckedChange: (y) => a(C, { active: y }) }) }),
                  /* @__PURE__ */ e(w, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": d === f.id, onClick: () => v(d === f.id ? null : f.id), children: d === f.id ? "Close" : "More" }) })
                ] }),
                d === f.id && /* @__PURE__ */ e(b, { children: /* @__PURE__ */ e(w, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(ve, { variant: f, index: C, updateVariant: a, tab: t }) }) })
              ] }, f.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ m("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            z(Math.min(...n.variants.map((f) => f.price))),
            " to ",
            z(Math.max(...n.variants.map((f) => f.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function ye(t) {
  const n = t ?? {}, r = (n.variants?.length ? n.variants : [{ ...K, id: j() }]).map((a) => ({ ...K, ...a, id: a.id ?? j() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: n.requires_shipping ?? !0,
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: r,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function $e({ field: t, value: n, onChange: r, errors: a, id: s = "data-product" }) {
  le();
  const l = t.config ?? {}, i = ye(n), { props: o } = ie.usePage(), k = o.entry?.id ?? null, [N, w] = x.useState(), [u, c] = x.useState(null);
  x.useEffect(() => {
    if (!k) return;
    const h = new AbortController();
    return E(R(`commerce/api/products/${k}`), { signal: h.signal }).then((y) => {
      h.signal.aborted || (c(y.data), w(y.purchase_default));
    }).catch(() => {
    }), () => h.abort();
  }, [k, o.entry]);
  const b = (h) => {
    const y = { ...i, ...h };
    h.type && h.type !== "variable" && (y.options = [], y.variants = [{ ...y.variants[0], options: {} }]), h.type === "bundle" && !y.bundle && (y.bundle = { pricing: "fixed", value: 0, items: [] }), r(y);
  }, _ = (h, y) => b({ variants: i.variants.map((q, P) => P === h ? { ...q, ...y } : q) }), d = [{ key: "general", label: "General", render: (h) => /* @__PURE__ */ e(ue, { ...h }) }];
  i.type === "variable" && d.push({ key: "variants", label: "Variants", render: (h) => /* @__PURE__ */ e(ke, { ...h }) }), i.type === "bundle" && d.push({ key: "bundle", label: "Bundle", render: (h) => /* @__PURE__ */ e(ce, { ...h }) }), i.type !== "variable" && (l.features?.inventory ?? !0) && d.push({ key: "inventory", label: "Inventory", render: (h) => /* @__PURE__ */ e(pe, { ...h }) }), i.requires_shipping && d.push({ key: "shipping", label: "Shipping", render: (h) => /* @__PURE__ */ e(fe, { ...h }) }), (l.features?.pricing_rules !== !1 || i.tiers.length > 0) && d.push({ key: "pricing", label: "Bulk pricing", render: (h) => /* @__PURE__ */ e(ge, { ...h }) }), i.downloadable && d.push({ key: "digital", label: "Digital", render: (h) => /* @__PURE__ */ e(me, { ...h }) });
  for (const [h, y] of Object.entries(re.productTabs()))
    d.push({ key: `ext-${h}`, label: y.label ?? h, render: (q) => /* @__PURE__ */ e(y, { ...q }) });
  const [v, p] = x.useState("general"), $ = d.find((h) => h.key === v) ?? d[0], F = a?.[""], f = (h, y, q) => {
    c((P) => {
      const T = P?.variants[h];
      return !P || !T || T.id !== y ? P : { ...P, variants: { ...P.variants, [h]: { ...T, stock_quantity: q } } };
    });
  }, C = { value: i, update: b, updateVariant: _, config: l, live: u, purchaseDefault: N ?? l.purchase_default, updateLiveStock: f, entryId: k, path: s };
  return /* @__PURE__ */ m("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ m("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    F && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: F }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: d.map((h) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": h.key === $.key,
        onClick: () => p(h.key),
        className: W("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", h.key === $.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: h.label
      },
      h.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: $.render(C) })
  ] });
}
export {
  $e as default
};
