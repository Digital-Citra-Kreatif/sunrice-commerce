import { c as e, m as D, j as d, d as q, M as G, R as w, h as E, b as O, g as U, t as H, S as X, k as J, u as Q, i as Y, e as Z } from "./main-BZm25ssn.js";
function I() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function z(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function V(t) {
  let n = [{}];
  for (const i of t) {
    if (i.values.length === 0) return [];
    const a = [];
    for (const s of n)
      for (const l of i.values)
        a.push({ ...s, [i.id]: l.id });
    n = a;
  }
  return t.length === 0 ? [] : n;
}
function ee(t, n, i, a = 100) {
  const s = new Map(n.map((l) => [z(l.options), l]));
  return V(t).slice(0, a).map((l) => {
    const r = s.get(z(l));
    return r ? { ...r, options: l } : { ...i, id: I(), sku: null, options: l, active: !0, price: i.price ?? 0 };
  });
}
function L(t, n, i = {}) {
  return t.map((a) => {
    const s = a.values.find((l) => l.id === n.options[a.id]);
    return s ? s.label ?? (s.term_id ? i[s.term_id] ?? `#${s.term_id}` : "?") : "?";
  }).join(" / ");
}
function g({ label: t, hint: n, children: i, htmlFor: a, className: s }) {
  const { Label: l } = q;
  return /* @__PURE__ */ d("div", { className: D("cm:grid cm:gap-1.5", s), children: [
    /* @__PURE__ */ e(l, { htmlFor: a, children: t }),
    i,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function R({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: D("cm:grid cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function x({ id: t, value: n, onChange: i, min: a = 0, placeholder: s }) {
  const { Input: l } = q;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: a,
      value: n ?? "",
      placeholder: s,
      onChange: (r) => i(r.target.value === "" ? null : Math.round(Number(r.target.value)))
    }
  );
}
function M({ id: t, value: n, onChange: i, placeholder: a, onBlur: s }) {
  const { Input: l } = q;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: a,
      onBlur: s,
      onChange: (r) => i(r.target.value === "" ? null : r.target.value)
    }
  );
}
function B({ id: t, value: n, onChange: i, nullable: a = !0 }) {
  return /* @__PURE__ */ e(G, { id: t, value: n, allowNull: a, onChange: i });
}
function A({ id: t, label: n, checked: i, onChange: a, hint: s }) {
  const { Switch: l, Label: r } = q;
  return /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(l, { id: t, checked: i, onCheckedChange: a }),
    /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(r, { htmlFor: t, children: n }),
      s && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: s })
    ] })
  ] });
}
const te = "cm:h-9 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function C({ id: t, value: n, onChange: i, options: a }) {
  return /* @__PURE__ */ e("select", { id: t, className: te, value: n, onChange: (s) => i(s.target.value), children: a.map(([s, l]) => /* @__PURE__ */ e("option", { value: s, children: l }, s)) });
}
function T({ title: t, description: n, children: i, actions: a }) {
  return /* @__PURE__ */ d("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      a
    ] }),
    i
  ] });
}
function ne({ value: t, update: n, path: i }) {
  const { Button: a, Input: s } = q, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [r, o] = w.useState({}), [k, u] = w.useState(""), [y, h] = w.useState([]), c = l.items.map((p) => p.variant_id).filter((p) => !!p);
  w.useEffect(() => {
    const p = c.filter((v) => !r[v]);
    p.length !== 0 && E(O(`commerce/api/variants?${p.map((v) => `ids[]=${v}`).join("&")}`)).then((v) => o((N) => ({ ...N, ...Object.fromEntries(v.data.map((F) => [F.id, F])) }))).catch(() => {
    });
  }, [c.join(",")]), w.useEffect(() => {
    if (k.trim().length < 2) return h([]);
    const p = setTimeout(() => E(O(`commerce/api/variants?q=${encodeURIComponent(k)}`)).then((v) => h(v.data)).catch(() => {
    }), 250);
    return () => clearTimeout(p);
  }, [k]);
  const m = (p) => n({ bundle: { ...l, ...p } }), _ = l.items.reduce((p, v) => p + (r[v.variant_id ?? 0]?.price ?? 0) * v.quantity, 0);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(T, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((p, v) => /* @__PURE__ */ d("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: r[p.variant_id ?? 0]?.label ?? `#${p.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(x, { min: 1, value: p.quantity, onChange: (N) => m({ items: l.items.map((F, b) => b === v ? { ...F, quantity: N ?? 1 } : F) }) }) }),
        /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => m({ items: l.items.filter((N, F) => F !== v) }), children: "Remove" })
      ] }, v)),
      /* @__PURE__ */ d("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(s, { value: k, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (p) => u(p.target.value) }),
        y.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: y.map((p) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((v) => ({ ...v, [p.id]: p })), m({ items: [...l.items, { variant_id: p.id, quantity: 1 }] }), u("");
            },
            children: [
              /* @__PURE__ */ d("span", { children: [
                p.label,
                p.sku && /* @__PURE__ */ d("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  p.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: U(p.price) })
            ]
          }
        ) }, p.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(T, { title: "Bundle price", description: `The products cost ${U(_)} together.`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${i}-bundle-pricing`, children: /* @__PURE__ */ e(
        C,
        {
          id: `${i}-bundle-pricing`,
          value: l.pricing,
          onChange: (p) => m({ pricing: p, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(g, { label: "Percent off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(x, { id: `${i}-bundle-value`, value: l.value / 100, onChange: (p) => m({ value: Math.round((p ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(g, { label: "Amount off", htmlFor: `${i}-bundle-value`, children: /* @__PURE__ */ e(B, { id: `${i}-bundle-value`, value: l.value, nullable: !1, onChange: (p) => m({ value: p ?? 0 }) }) })
    ] }) })
  ] });
}
function le() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function ie({ value: t, update: n, path: i }) {
  const { Button: a } = q, [s, l] = w.useState(!1), r = w.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, k = (h) => n({ delivery: { ...o, ...h } }), u = (h, c) => n({ downloads: t.downloads.map((m, _) => _ === h ? { ...m, ...c } : m) }), y = async (h) => {
    if (h?.length) {
      l(!0);
      try {
        const c = [];
        for (const m of Array.from(h)) {
          const _ = new FormData();
          _.append("file", m);
          const p = await fetch(O("commerce/api/downloads"), { method: "POST", body: _, headers: { "X-XSRF-TOKEN": le(), Accept: "application/json" }, credentials: "same-origin" }), v = await p.json();
          if (!p.ok) throw new Error(v.message ?? "Upload failed");
          c.push({ id: I(), type: "file", file_id: v.data.id, url: null, name: m.name.replace(/\.[^.]+$/, ""), file: v.data });
        }
        n({ downloads: [...t.downloads, ...c] });
      } catch (c) {
        H.error(c instanceof Error ? c.message : "Upload failed");
      } finally {
        l(!1), r.current && (r.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(
      T,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", disabled: s, onClick: () => r.current?.click(), children: s ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(a, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: I(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: r, type: "file", multiple: !0, hidden: !0, onChange: (h) => y(h.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((h, c) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Name", htmlFor: `${i}-dl-${c}`, children: /* @__PURE__ */ e(M, { id: `${i}-dl-${c}`, value: h.name, onChange: (m) => u(c, { name: m ?? "" }) }) }),
            h.type === "url" ? /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${i}-dl-${c}-url`, children: /* @__PURE__ */ e(M, { id: `${i}-dl-${c}-url`, value: h.url, placeholder: "https://", onChange: (m) => u(c, { url: m }) }) }) : /* @__PURE__ */ e(g, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: h.file?.filename ?? `File #${h.file_id}` }) }),
            /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((m, _) => _ !== c) }), children: "Remove" })
          ] }, h.id ?? c))
        ]
      }
    ),
    /* @__PURE__ */ d(T, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([h, c]) => /* @__PURE__ */ e(
        A,
        {
          id: `${i}-mode-${h}`,
          label: c,
          checked: o.modes.includes(h),
          onChange: (m) => k({ modes: m ? [...o.modes, h] : o.modes.filter((_) => _ !== h) })
        },
        h
      )) }),
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Downloads per file", htmlFor: `${i}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(x, { id: `${i}-limit`, min: 1, value: o.download_limit, onChange: (h) => k({ download_limit: h }) }) }),
        /* @__PURE__ */ e(g, { label: "Links expire after (days)", htmlFor: `${i}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(x, { id: `${i}-expiry`, min: 1, value: o.expiry_days, onChange: (h) => k({ expiry_days: h }) }) })
      ] })
    ] })
  ] });
}
function K({ id: t, value: n, onChange: i, entryId: a }) {
  const [s, l] = w.useState(null);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(M, { id: t, value: n, onChange: (o) => {
      l(null), i(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(a ?? 0) });
      E(O(`commerce/api/sku-check?${o}`)).then((k) => l(k.available ? null : k.product ?? "another product")).catch(() => l(null));
    } }),
    s && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      s,
      "."
    ] })
  ] });
}
const re = [
  ["default", "Follow the store (selling mode)"],
  ["cart", "Add to cart"],
  ["inquiry", "Inquiry form"],
  ["whatsapp", "Ask on WhatsApp"],
  ["external", "Links to other shops"],
  ["none", "No button (display only)"]
];
function ae({ value: t, update: n, updateVariant: i, config: a, entryId: s, path: l }) {
  const { Button: r } = q, o = [["simple", "Simple product"]];
  (a.features.variants || t.type === "variable") && o.push(["variable", "Variable product (sizes, colors…)"]), (a.features.bundles || t.type === "bundle") && o.push(["bundle", "Bundle of other products"]);
  const k = t.variants[0];
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(R, { cols: 2, children: [
      /* @__PURE__ */ e(g, { label: "Product type", htmlFor: `${l}-type`, children: /* @__PURE__ */ e(C, { id: `${l}-type`, value: t.type, options: o, onChange: (u) => n({ type: u }) }) }),
      /* @__PURE__ */ e(g, { label: "Button on the product page", htmlFor: `${l}-mode`, hint: "'Follow the store' uses the selling mode set in Settings → Store.", children: /* @__PURE__ */ e(C, { id: `${l}-mode`, value: t.purchase_mode, options: re, onChange: (u) => n({ purchase_mode: u }) }) })
    ] }),
    t.type !== "variable" && k && /* @__PURE__ */ e(T, { title: "Price", children: /* @__PURE__ */ d(R, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${l}-price`, children: /* @__PURE__ */ e(B, { id: `${l}-price`, value: k.price, nullable: !1, onChange: (u) => i(0, { price: u ?? 0 }) }) }),
      /* @__PURE__ */ e(g, { label: "Compare-at price", htmlFor: `${l}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(B, { id: `${l}-compare`, value: k.compare_at_price, onChange: (u) => i(0, { compare_at_price: u }) }) }),
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${l}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(B, { id: `${l}-cost`, value: k.cost, onChange: (u) => i(0, { cost: u }) }) }),
      /* @__PURE__ */ e(g, { label: "SKU", htmlFor: `${l}-sku`, children: /* @__PURE__ */ e(K, { id: `${l}-sku`, value: k.sku, entryId: s, onChange: (u) => i(0, { sku: u }) }) })
    ] }) }),
    (t.purchase_mode === "external" || t.external_links.length > 0) && /* @__PURE__ */ e(
      T,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(r, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((u, y) => {
          const h = (c) => n({ external_links: t.external_links.map((m, _) => _ === y ? { ...m, ...c } : m) });
          return /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Shop", htmlFor: `${l}-link-${y}-preset`, children: /* @__PURE__ */ e(
              C,
              {
                id: `${l}-link-${y}-preset`,
                value: u.preset ?? "",
                onChange: (c) => h({ preset: c || null }),
                options: [...Object.entries(a.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(g, { label: "Button label", htmlFor: `${l}-link-${y}-label`, children: /* @__PURE__ */ e(M, { id: `${l}-link-${y}-label`, value: u.label, placeholder: u.preset ? `Buy on ${a.link_presets[u.preset]}` : "", onChange: (c) => h({ label: c }) }) }),
            /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${l}-link-${y}-url`, children: /* @__PURE__ */ e(M, { id: `${l}-link-${y}-url`, value: u.url, placeholder: "https://", onChange: (c) => h({ url: c }) }) }),
            /* @__PURE__ */ e(r, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((c, m) => m !== y) }), children: "Remove" })
          ] }, y);
        })
      }
    ),
    /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(A, { id: `${l}-shipping`, label: "Needs shipping", checked: t.requires_shipping, onChange: (u) => n({ requires_shipping: u }), hint: "Off for services and digital products." }),
      (a.features.digital || t.downloadable) && /* @__PURE__ */ e(A, { id: `${l}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (u) => n({ downloadable: u }), hint: "Customers get files or links after paying." }),
      /* @__PURE__ */ e(A, { id: `${l}-featured`, label: "Featured", checked: t.featured, onChange: (u) => n({ featured: u }), hint: "Shown first when sorting by featured." })
    ] }),
    a.features.taxes && /* @__PURE__ */ e(g, { label: "Tax class", htmlFor: `${l}-tax`, children: /* @__PURE__ */ e(
      C,
      {
        id: `${l}-tax`,
        value: t.tax_class ?? "",
        onChange: (u) => n({ tax_class: u || null }),
        options: [["", "Standard"], ...a.tax_classes.filter((u) => u !== "standard").map((u) => [u, u])]
      }
    ) })
  ] });
}
function se({ value: t, updateVariant: n, live: i, path: a }) {
  const s = t.variants[0];
  if (!s) return null;
  const l = i?.variants[s.id];
  return /* @__PURE__ */ d(T, { title: "Stock", children: [
    /* @__PURE__ */ e(
      A,
      {
        id: `${a}-track`,
        label: "Track stock",
        checked: s.track_stock,
        onChange: (r) => n(0, { track_stock: r }),
        hint: "Count units: orders take them, cancellations give them back."
      }
    ),
    s.track_stock ? /* @__PURE__ */ d(R, { cols: 3, children: [
      l?.track_stock && l.stock_quantity !== null ? /* @__PURE__ */ e(g, { label: "In stock", hint: "Change it in Shop → Inventory, so every change is recorded.", children: /* @__PURE__ */ e("p", { className: "cm:text-2xl cm:font-semibold", children: l.stock_quantity }) }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${a}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(x, { id: `${a}-initial`, value: s.initial_stock, onChange: (r) => n(0, { initial_stock: r }) }) }),
      /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${a}-backorders`, children: /* @__PURE__ */ e(
        C,
        {
          id: `${a}-backorders`,
          value: s.backorders,
          onChange: (r) => n(0, { backorders: r }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(g, { label: "Low stock at", htmlFor: `${a}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(x, { id: `${a}-low`, value: s.low_stock_threshold, onChange: (r) => n(0, { low_stock_threshold: r }) }) })
    ] }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${a}-status`, children: /* @__PURE__ */ e(
      C,
      {
        id: `${a}-status`,
        value: s.stock_status,
        onChange: (r) => n(0, { stock_status: r }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function oe({ value: t, update: n, path: i }) {
  const { Button: a } = q, s = (l, r) => n({ tiers: t.tiers.map((o, k) => k === l ? { ...o, ...r } : o) });
  return /* @__PURE__ */ d(
    T,
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
        t.tiers.map((l, r) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(g, { label: "From (units)", htmlFor: `${i}-tier-${r}-min`, children: /* @__PURE__ */ e(x, { id: `${i}-tier-${r}-min`, min: 2, value: l.min_qty, onChange: (o) => s(r, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${i}-tier-${r}-type`, children: /* @__PURE__ */ e(
            C,
            {
              id: `${i}-tier-${r}-type`,
              value: l.type,
              onChange: (o) => s(r, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(g, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${i}-tier-${r}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(x, { id: `${i}-tier-${r}-value`, value: l.value / 100, onChange: (o) => s(r, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(B, { id: `${i}-tier-${r}-value`, value: l.value, nullable: !1, onChange: (o) => s(r, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(g, { label: "For", htmlFor: `${i}-tier-${r}-variant`, children: /* @__PURE__ */ e(
            C,
            {
              id: `${i}-tier-${r}-variant`,
              value: l.variant ?? "",
              onChange: (o) => s(r, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, L(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(a, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, k) => k !== r) }), children: "Remove" })
        ] }, r))
      ]
    }
  );
}
function ce({ value: t, update: n, updateVariant: i, path: a }) {
  const s = t.variants[0];
  if (!s) return null;
  const l = (r) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...r })) }) : i(0, r);
  return /* @__PURE__ */ e(T, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ d(R, { cols: 4, children: [
    /* @__PURE__ */ e(g, { label: "Weight (grams)", htmlFor: `${a}-weight`, children: /* @__PURE__ */ e(x, { id: `${a}-weight`, value: s.weight, onChange: (r) => l({ weight: r }) }) }),
    /* @__PURE__ */ e(g, { label: "Length (mm)", htmlFor: `${a}-length`, children: /* @__PURE__ */ e(x, { id: `${a}-length`, value: s.length, onChange: (r) => l({ length: r }) }) }),
    /* @__PURE__ */ e(g, { label: "Width (mm)", htmlFor: `${a}-width`, children: /* @__PURE__ */ e(x, { id: `${a}-width`, value: s.width, onChange: (r) => l({ width: r }) }) }),
    /* @__PURE__ */ e(g, { label: "Height (mm)", htmlFor: `${a}-height`, children: /* @__PURE__ */ e(x, { id: `${a}-height`, value: s.height, onChange: (r) => l({ height: r }) }) })
  ] }) });
}
const j = {
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
function de({ option: t, onChange: n, onRemove: i, config: a, path: s }) {
  const { Button: l, Input: r, Badge: o } = q, [k, u] = w.useState(""), y = () => {
    const c = k.split(",").map((m) => m.trim()).filter(Boolean).filter((m) => !t.values.some((_) => (_.label ?? "").toLowerCase() === m.toLowerCase()));
    c.length && n({ ...t, values: [...t.values, ...c.map((m) => ({ id: I(), label: m }))] }), u("");
  }, h = t.values.map((c) => c.term_id).filter((c) => !!c);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      /* @__PURE__ */ e(g, { label: "Option name", htmlFor: `${s}-name`, children: /* @__PURE__ */ e(r, { id: `${s}-name`, value: t.name, placeholder: "Size", onChange: (c) => n({ ...t, name: c.target.value }) }) }),
      a.attribute_taxonomies.length > 0 ? /* @__PURE__ */ e(g, { label: "Values from", htmlFor: `${s}-source`, children: /* @__PURE__ */ e(
        C,
        {
          id: `${s}-source`,
          value: t.taxonomy ?? "",
          onChange: (c) => n({ ...t, taxonomy: c || null, values: [] }),
          options: [["", "Custom values"], ...a.attribute_taxonomies.map((c) => [c.handle, c.title])]
        }
      ) }) : /* @__PURE__ */ e("div", {}),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: i, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      J,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (a.attribute_taxonomies.find((c) => c.handle === t.taxonomy)?.terms ?? []).map((c) => ({ value: String(c.id), label: c.title }))
        } }],
        values: { terms: h },
        pathPrefix: `${s}-terms`,
        onChange: (c) => {
          const m = c.terms ?? [], _ = t.values.filter((v) => v.term_id && m.includes(v.term_id)), p = m.filter((v) => !_.some((N) => N.term_id === v)).map((v) => ({ id: I(), term_id: v }));
          n({ ...t, values: [..._, ...p] });
        }
      }
    ) : /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((c) => /* @__PURE__ */ d(o, { variant: "secondary", className: "cm:gap-1", children: [
        c.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${c.label}`, onClick: () => n({ ...t, values: t.values.filter((m) => m.id !== c.id) }), children: "×" })
      ] }, c.id)) }),
      /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          r,
          {
            value: k,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (c) => u(c.target.value),
            onKeyDown: (c) => {
              c.key === "Enter" && (c.preventDefault(), y());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: y, children: "Add" })
      ] })
    ] })
  ] });
}
function me({ variant: t, index: n, updateVariant: i, tab: a }) {
  const { MediaPickerInput: s } = q, l = `${a.path}-v${n}`, r = a.live?.variants[t.id];
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ d(R, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(B, { id: `${l}-cost`, value: t.cost, onChange: (o) => i(n, { cost: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(M, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => i(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(x, { id: `${l}-weight`, value: t.weight, onChange: (o) => i(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(g, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(x, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => i(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(x, { min: 1, value: t.max_qty, onChange: (o) => i(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(x, { min: 1, value: t.qty_step, onChange: (o) => i(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    a.config.features.inventory && /* @__PURE__ */ d(R, { cols: 4, children: [
      /* @__PURE__ */ e(A, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => i(n, { track_stock: o }) }),
      t.track_stock && (r?.track_stock && r.stock_quantity !== null ? /* @__PURE__ */ e(g, { label: "In stock", children: /* @__PURE__ */ d("p", { className: "cm:text-sm", children: [
        r.stock_quantity,
        " ",
        /* @__PURE__ */ e("span", { className: "cm:text-muted-foreground", children: "(change it in Shop → Inventory)" })
      ] }) }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(x, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => i(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        C,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => i(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        C,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => i(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(g, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(s, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => i(n, { image: o }) }) })
  ] });
}
function ue(t) {
  const { value: n, update: i, updateVariant: a, config: s, entryId: l, live: r } = t, { Button: o, Table: k, TableBody: u, TableCell: y, TableHead: h, TableHeader: c, TableRow: m, Switch: _ } = q, [p, v] = w.useState(null), N = Object.fromEntries(t.config.attribute_taxonomies.flatMap((f) => f.terms.map(($) => [$.id, $.title]))), F = n.variants[0] ?? { ...j, id: I() }, b = (f = n.options) => i({ options: f, variants: ee(f, n.variants, { ...F, initial_stock: null, image: null }, s.max_variants) });
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      T,
      {
        title: "Options",
        description: `Up to ${s.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < s.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => i({ options: [...n.options, { id: I(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((f, $) => /* @__PURE__ */ e(
          de,
          {
            option: f,
            config: s,
            path: `${t.path}-o${$}`,
            onChange: (P) => b(n.options.map((S, W) => W === $ ? P : S)),
            onRemove: () => b(n.options.filter((P, S) => S !== $))
          },
          f.id
        ))
      }
    ),
    /* @__PURE__ */ d(
      T,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => b(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ d(k, { children: [
            /* @__PURE__ */ e(c, { children: /* @__PURE__ */ d(m, { children: [
              /* @__PURE__ */ e(h, { children: "Variant" }),
              /* @__PURE__ */ e(h, { children: "SKU" }),
              /* @__PURE__ */ e(h, { children: "Price" }),
              /* @__PURE__ */ e(h, { children: "Compare-at" }),
              s.features.inventory && /* @__PURE__ */ e(h, { children: "Stock" }),
              /* @__PURE__ */ e(h, { children: "On sale" }),
              /* @__PURE__ */ e(h, {})
            ] }) }),
            /* @__PURE__ */ e(u, { children: n.variants.map((f, $) => {
              const P = r?.variants[f.id];
              return /* @__PURE__ */ d(w.Fragment, { children: [
                /* @__PURE__ */ d(m, { className: f.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(y, { className: "cm:font-medium cm:whitespace-nowrap", children: L(n.options, f, N) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-36", children: /* @__PURE__ */ e(K, { value: f.sku, entryId: l, onChange: (S) => a($, { sku: S }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(B, { value: f.price, nullable: !1, onChange: (S) => a($, { price: S ?? 0 }) }) }),
                  /* @__PURE__ */ e(y, { className: "cm:min-w-32", children: /* @__PURE__ */ e(B, { value: f.compare_at_price, onChange: (S) => a($, { compare_at_price: S }) }) }),
                  s.features.inventory && /* @__PURE__ */ e(y, { className: "cm:whitespace-nowrap cm:text-sm", children: f.track_stock ? P?.stock_quantity ?? f.initial_stock ?? 0 : /* @__PURE__ */ e(X, { children: f.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(_, { checked: f.active, "aria-label": "Sell this variant", onCheckedChange: (S) => a($, { active: S }) }) }),
                  /* @__PURE__ */ e(y, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": p === f.id, onClick: () => v(p === f.id ? null : f.id), children: p === f.id ? "Close" : "More" }) })
                ] }),
                p === f.id && /* @__PURE__ */ e(m, { children: /* @__PURE__ */ e(y, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(me, { variant: f, index: $, updateVariant: a, tab: t }) }) })
              ] }, f.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
            "Prices from ",
            U(Math.min(...n.variants.map((f) => f.price))),
            " to ",
            U(Math.max(...n.variants.map((f) => f.price))),
            "."
          ] })
        ]
      }
    )
  ] });
}
function he(t) {
  const n = t ?? {}, i = (n.variants?.length ? n.variants : [{ ...j, id: I() }]).map((a) => ({ ...j, ...a, id: a.id ?? I() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: n.requires_shipping ?? !0,
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: i,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function ge({ field: t, value: n, onChange: i, errors: a, id: s = "data-product" }) {
  Q();
  const l = t.config ?? {}, r = he(n), { props: o } = Y.usePage(), k = o.entry?.id ?? null, [u, y] = w.useState(null);
  w.useEffect(() => {
    k && E(O(`commerce/api/products/${k}`)).then((b) => y(b.data)).catch(() => {
    });
  }, [k, o.entry]);
  const h = (b) => {
    const f = { ...r, ...b };
    b.type && b.type !== "variable" && (f.options = [], f.variants = [{ ...f.variants[0], options: {} }]), b.type === "bundle" && !f.bundle && (f.bundle = { pricing: "fixed", value: 0, items: [] }), i(f);
  }, c = (b, f) => h({ variants: r.variants.map(($, P) => P === b ? { ...$, ...f } : $) }), m = [{ key: "general", label: "General", render: (b) => /* @__PURE__ */ e(ae, { ...b }) }];
  r.type === "variable" && m.push({ key: "variants", label: "Variants", render: (b) => /* @__PURE__ */ e(ue, { ...b }) }), r.type === "bundle" && m.push({ key: "bundle", label: "Bundle", render: (b) => /* @__PURE__ */ e(ne, { ...b }) }), r.type !== "variable" && (l.features?.inventory ?? !0) && m.push({ key: "inventory", label: "Inventory", render: (b) => /* @__PURE__ */ e(se, { ...b }) }), r.requires_shipping && m.push({ key: "shipping", label: "Shipping", render: (b) => /* @__PURE__ */ e(ce, { ...b }) }), (l.features?.pricing_rules !== !1 || r.tiers.length > 0) && m.push({ key: "pricing", label: "Bulk prices", render: (b) => /* @__PURE__ */ e(oe, { ...b }) }), r.downloadable && m.push({ key: "digital", label: "Digital", render: (b) => /* @__PURE__ */ e(ie, { ...b }) });
  for (const [b, f] of Object.entries(Z.productTabs()))
    m.push({ key: `ext-${b}`, label: f.label ?? b, render: ($) => /* @__PURE__ */ e(f, { ...$ }) });
  const [_, p] = w.useState("general"), v = m.find((b) => b.key === _) ?? m[0], N = a?.[""], F = { value: r, update: h, updateVariant: c, config: l, live: u, entryId: k, path: s };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:rounded-lg cm:border cm:p-4", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ d("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    N && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: N }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-1 cm:border-b", children: m.map((b) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": b.key === v.key,
        onClick: () => p(b.key),
        className: D("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", b.key === v.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: b.label
      },
      b.key
    )) }),
    /* @__PURE__ */ e("div", { role: "tabpanel", children: v.render(F) })
  ] });
}
export {
  ge as default
};
