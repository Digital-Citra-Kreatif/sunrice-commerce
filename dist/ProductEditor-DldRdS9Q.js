import { c as e, m as W, j as d, d as B, M as Z, R as x, h as E, b as M, g as z, t as ee, S as te, k as ne, u as le, i as ie, e as ae } from "./main-DCDNiEU_.js";
function j() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`).replace(/-/g, "").slice(0, 32);
}
function H(t) {
  return Object.keys(t).sort().map((n) => `${n}=${t[n]}`).join("|");
}
function re(t) {
  let n = [{}];
  for (const a of t) {
    if (a.values.length === 0) return [];
    const s = [];
    for (const r of n)
      for (const l of a.values)
        s.push({ ...r, [a.id]: l.id });
    n = s;
  }
  return t.length === 0 ? [] : n;
}
function se(t, n, a, s = 100) {
  const r = new Map(n.map((l) => [H(l.options), l]));
  return re(t).slice(0, s).map((l) => {
    const i = r.get(H(l));
    return i ? { ...i, options: l } : { ...a, id: j(), sku: null, options: l, active: !0, price: a.price ?? 0 };
  });
}
function X(t, n, a = {}) {
  return t.map((s) => {
    const r = s.values.find((l) => l.id === n.options[s.id]);
    return r ? r.label ?? (r.term_id ? a[r.term_id] ?? `#${r.term_id}` : "?") : "?";
  }).join(" / ");
}
function g({ label: t, hint: n, children: a, htmlFor: s, className: r }) {
  const { Label: l } = B;
  return /* @__PURE__ */ d("div", { className: W("cm:grid cm:content-start cm:gap-1.5", r), children: [
    /* @__PURE__ */ e(l, { htmlFor: s, children: t }),
    a,
    n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
  ] });
}
function L({ children: t, cols: n = 3 }) {
  return /* @__PURE__ */ e("div", { className: W("cm:grid cm:items-start cm:gap-4", { 2: "cm:sm:grid-cols-2", 3: "cm:sm:grid-cols-2 cm:lg:grid-cols-3", 4: "cm:sm:grid-cols-2 cm:lg:grid-cols-4" }[n]), children: t });
}
function S({ id: t, value: n, onChange: a, min: s = 0, placeholder: r }) {
  const { Input: l } = B;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      type: "number",
      inputMode: "numeric",
      min: s,
      value: n ?? "",
      placeholder: r,
      onChange: (i) => a(i.target.value === "" ? null : Math.round(Number(i.target.value)))
    }
  );
}
function U({ id: t, value: n, onChange: a, placeholder: s, onBlur: r }) {
  const { Input: l } = B;
  return /* @__PURE__ */ e(
    l,
    {
      id: t,
      value: n ?? "",
      placeholder: s,
      onBlur: r,
      onChange: (i) => a(i.target.value === "" ? null : i.target.value)
    }
  );
}
function O({ id: t, value: n, onChange: a, nullable: s = !0 }) {
  return /* @__PURE__ */ e(Z, { id: t, value: n, allowNull: s, onChange: a });
}
function R({ id: t, label: n, checked: a, onChange: s, hint: r, disabled: l = !1 }) {
  const { Switch: i, Label: o } = B;
  return /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:gap-3", children: [
    /* @__PURE__ */ e(i, { id: t, disabled: l, checked: a, onCheckedChange: s }),
    /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
      /* @__PURE__ */ e(o, { htmlFor: t, children: n }),
      r && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: r })
    ] })
  ] });
}
const oe = "cm:h-10 cm:w-full cm:rounded-md cm:border cm:border-border cm:bg-background cm:px-3 cm:text-sm";
function I({ id: t, value: n, onChange: a, options: s }) {
  return /* @__PURE__ */ e("select", { id: t, className: oe, value: n, onChange: (r) => a(r.target.value), children: s.map(([r, l]) => /* @__PURE__ */ e("option", { value: r, children: l }, r)) });
}
function A({ title: t, description: n, children: a, actions: s }) {
  return /* @__PURE__ */ d("section", { className: "cm:grid cm:gap-4", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:items-start cm:justify-between cm:gap-3", children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-0.5", children: [
        /* @__PURE__ */ e("h3", { className: "cm:text-sm cm:font-semibold", children: t }),
        n && /* @__PURE__ */ e("p", { className: "cm:text-xs cm:text-muted-foreground", children: n })
      ] }),
      s
    ] }),
    a
  ] });
}
function ce({ value: t, update: n, path: a }) {
  const { Button: s, Input: r } = B, l = t.bundle ?? { pricing: "fixed", value: 0, items: [] }, [i, o] = x.useState({}), [y, N] = x.useState(""), [w, u] = x.useState([]), v = l.items.map((c) => c.variant_id).filter((c) => !!c);
  x.useEffect(() => {
    const c = v.filter((b) => !i[b]);
    c.length !== 0 && E(M(`commerce/api/variants?${c.map((b) => `ids[]=${b}`).join("&")}`)).then((b) => o((p) => ({ ...p, ...Object.fromEntries(b.data.map((k) => [k.id, k])) }))).catch(() => {
    });
  }, [v.join(",")]), x.useEffect(() => {
    if (y.trim().length < 2) return u([]);
    const c = setTimeout(() => E(M(`commerce/api/variants?q=${encodeURIComponent(y)}`)).then((b) => u(b.data)).catch(() => {
    }), 250);
    return () => clearTimeout(c);
  }, [y]);
  const _ = (c) => n({ bundle: { ...l, ...c } }), m = l.items.reduce((c, b) => c + (i[b.variant_id ?? 0]?.price ?? 0) * b.quantity, 0);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(A, { title: "Products in the bundle", description: "Bundles take their stock from these products.", children: [
      l.items.map((c, b) => /* @__PURE__ */ d("div", { className: "cm:flex cm:items-center cm:gap-3", children: [
        /* @__PURE__ */ e("span", { className: "cm:flex-1 cm:text-sm", children: i[c.variant_id ?? 0]?.label ?? `#${c.variant_id}` }),
        /* @__PURE__ */ e("div", { className: "cm:w-24", children: /* @__PURE__ */ e(S, { min: 1, value: c.quantity, onChange: (p) => _({ items: l.items.map((k, F) => F === b ? { ...k, quantity: p ?? 1 } : k) }) }) }),
        /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => _({ items: l.items.filter((p, k) => k !== b) }), children: "Remove" })
      ] }, b)),
      /* @__PURE__ */ d("div", { className: "cm:relative", children: [
        /* @__PURE__ */ e(r, { value: y, placeholder: "Search products or SKUs to add…", "aria-label": "Add a product to the bundle", onChange: (c) => N(c.target.value) }),
        w.length > 0 && /* @__PURE__ */ e("ul", { className: "cm:absolute cm:z-10 cm:mt-1 cm:max-h-64 cm:w-full cm:overflow-auto cm:rounded-md cm:border cm:bg-background cm:shadow", children: w.map((c) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            className: "cm:flex cm:w-full cm:justify-between cm:px-3 cm:py-2 cm:text-left cm:text-sm cm:hover:bg-muted",
            onClick: () => {
              o((b) => ({ ...b, [c.id]: c })), _({ items: [...l.items, { variant_id: c.id, quantity: 1 }] }), N("");
            },
            children: [
              /* @__PURE__ */ d("span", { children: [
                c.label,
                c.sku && /* @__PURE__ */ d("span", { className: "cm:text-muted-foreground", children: [
                  " · ",
                  c.sku
                ] })
              ] }),
              /* @__PURE__ */ e("span", { children: z(c.price) })
            ]
          }
        ) }, c.id)) })
      ] })
    ] }),
    /* @__PURE__ */ e(A, { title: "Bundle price", description: `The products cost ${z(m)} together.`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${a}-bundle-pricing`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${a}-bundle-pricing`,
          value: l.pricing,
          onChange: (c) => _({ pricing: c, value: 0 }),
          options: [["fixed", "Its own price (General tab)"], ["percent_off", "Total minus a percentage"], ["amount_off", "Total minus an amount"]]
        }
      ) }),
      l.pricing === "percent_off" && /* @__PURE__ */ e(g, { label: "Percent off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(S, { id: `${a}-bundle-value`, value: l.value / 100, onChange: (c) => _({ value: Math.round((c ?? 0) * 100) }) }) }),
      l.pricing === "amount_off" && /* @__PURE__ */ e(g, { label: "Amount off", htmlFor: `${a}-bundle-value`, children: /* @__PURE__ */ e(O, { id: `${a}-bundle-value`, value: l.value, nullable: !1, onChange: (c) => _({ value: c ?? 0 }) }) })
    ] }) })
  ] });
}
function de() {
  return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? "");
}
function me({ value: t, update: n, path: a }) {
  const { Button: s } = B, [r, l] = x.useState(!1), i = x.useRef(null), o = t.delivery ?? { modes: ["link", "account"], download_limit: null, expiry_days: null }, y = (u) => n({ delivery: { ...o, ...u } }), N = (u, v) => n({ downloads: t.downloads.map((_, m) => m === u ? { ..._, ...v } : _) }), w = async (u) => {
    if (u?.length) {
      l(!0);
      try {
        const v = [];
        for (const _ of Array.from(u)) {
          const m = new FormData();
          m.append("file", _);
          const c = await fetch(M("commerce/api/downloads"), { method: "POST", body: m, headers: { "X-XSRF-TOKEN": de(), Accept: "application/json" }, credentials: "same-origin" }), b = await c.json();
          if (!c.ok) throw new Error(b.message ?? "Upload failed");
          v.push({ id: j(), type: "file", file_id: b.data.id, url: null, name: _.name.replace(/\.[^.]+$/, ""), file: b.data });
        }
        n({ downloads: [...t.downloads, ...v] });
      } catch (v) {
        ee.error(v instanceof Error ? v.message : "Upload failed");
      } finally {
        l(!1), i.current && (i.current.value = "");
      }
    }
  };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(
      A,
      {
        title: "Files and links",
        description: "Files are stored privately and only served to customers who bought them.",
        actions: /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", disabled: r, onClick: () => i.current?.click(), children: r ? "Uploading…" : "Upload file" }),
          /* @__PURE__ */ e(s, { type: "button", variant: "outline", size: "sm", onClick: () => n({ downloads: [...t.downloads, { id: j(), type: "url", file_id: null, url: null, name: "" }] }), children: "Add link" }),
          /* @__PURE__ */ e("input", { ref: i, type: "file", multiple: !0, hidden: !0, onChange: (u) => w(u.target.files) })
        ] }),
        children: [
          t.downloads.length === 0 && /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "No files yet." }),
          t.downloads.map((u, v) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Name", htmlFor: `${a}-dl-${v}`, children: /* @__PURE__ */ e(U, { id: `${a}-dl-${v}`, value: u.name, onChange: (_) => N(v, { name: _ ?? "" }) }) }),
            u.type === "url" ? /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${a}-dl-${v}-url`, children: /* @__PURE__ */ e(U, { id: `${a}-dl-${v}-url`, value: u.url, placeholder: "https://", onChange: (_) => N(v, { url: _ }) }) }) : /* @__PURE__ */ e(g, { label: "File", children: /* @__PURE__ */ e("p", { className: "cm:truncate cm:text-sm cm:text-muted-foreground", children: u.file?.filename ?? `File #${u.file_id}` }) }),
            /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ downloads: t.downloads.filter((_, m) => m !== v) }), children: "Remove" })
          ] }, u.id ?? v))
        ]
      }
    ),
    /* @__PURE__ */ d(A, { title: "Delivery", children: [
      /* @__PURE__ */ e("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-3", children: [["attachment", "Attach files to the email"], ["link", "Download links in the email"], ["account", "Library in My Account"]].map(([u, v]) => /* @__PURE__ */ e(
        R,
        {
          id: `${a}-mode-${u}`,
          label: v,
          checked: o.modes.includes(u),
          onChange: (_) => y({ modes: _ ? [...o.modes, u] : o.modes.filter((m) => m !== u) })
        },
        u
      )) }),
      /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Downloads per file", htmlFor: `${a}-limit`, hint: "Empty: unlimited.", children: /* @__PURE__ */ e(S, { id: `${a}-limit`, min: 1, value: o.download_limit, onChange: (u) => y({ download_limit: u }) }) }),
        /* @__PURE__ */ e(g, { label: "Links expire after (days)", htmlFor: `${a}-expiry`, hint: "Empty: never.", children: /* @__PURE__ */ e(S, { id: `${a}-expiry`, min: 1, value: o.expiry_days, onChange: (u) => y({ expiry_days: u }) }) })
      ] })
    ] })
  ] });
}
function J({ id: t, value: n, onChange: a, entryId: s }) {
  const [r, l] = x.useState(null);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-1", children: [
    /* @__PURE__ */ e(U, { id: t, value: n, onChange: (o) => {
      l(null), a(o);
    }, onBlur: () => {
      if (!n) return l(null);
      const o = new URLSearchParams({ sku: n, entry: String(s ?? 0) });
      E(M(`commerce/api/sku-check?${o}`)).then((y) => l(y.available ? null : y.product ?? "another product")).catch(() => l(null));
    } }),
    r && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-destructive", children: [
      "Already used by ",
      r,
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
function ue({ value: t, update: n, updateVariant: a, config: s, purchaseDefault: r, entryId: l, path: i }) {
  const { Button: o } = B, y = [["simple", "Simple product"]];
  (s.features.variants || t.type === "variable") && y.push(["variable", "Variable product (sizes, colors…)"]), (s.features.bundles || t.type === "bundle") && y.push(["bundle", "Bundle of other products"]);
  const N = t.variants[0], u = t.external_links.some((p) => p.url) ? r?.with_links : r?.without_links, v = G.find(([p]) => p === u?.type)?.[1], _ = u?.source_name ? `${u.source} settings (${u.source_name})` : `${u?.source ?? "store"} settings`, m = v ? `Default · ${v}` : "Default · Inherit settings", c = t.purchase_mode === "default" ? v ? `Inherited from ${_}.` : "Uses the closest saved setting in brand, category, or store." : "This product overrides the inherited setting.", b = t.purchase_mode === "external" || t.purchase_mode === "default" && r?.with_links.type === "external";
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ d(L, { cols: 2, children: [
      /* @__PURE__ */ e(g, { label: "Product type", htmlFor: `${i}-type`, children: /* @__PURE__ */ e(I, { id: `${i}-type`, value: t.type, options: y, onChange: (p) => n({ type: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Storefront button", htmlFor: `${i}-mode`, hint: c, children: /* @__PURE__ */ e(I, { id: `${i}-mode`, value: t.purchase_mode, options: [["default", m], ...G], onChange: (p) => n({ purchase_mode: p }) }) })
    ] }),
    t.type !== "variable" && N && /* @__PURE__ */ e(A, { title: "Pricing and SKU", children: /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${i}-price`, children: /* @__PURE__ */ e(O, { id: `${i}-price`, value: N.price, nullable: !1, onChange: (p) => a(0, { price: p ?? 0 }) }) }),
      /* @__PURE__ */ e(g, { label: "Compare-at price", htmlFor: `${i}-compare`, hint: "Shown struck through when higher.", children: /* @__PURE__ */ e(O, { id: `${i}-compare`, value: N.compare_at_price, onChange: (p) => a(0, { compare_at_price: p }) }) }),
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${i}-cost`, hint: "For profit reports; never shown.", children: /* @__PURE__ */ e(O, { id: `${i}-cost`, value: N.cost, onChange: (p) => a(0, { cost: p }) }) }),
      /* @__PURE__ */ e(g, { label: "SKU", htmlFor: `${i}-sku`, children: /* @__PURE__ */ e(J, { id: `${i}-sku`, value: N.sku, entryId: l, onChange: (p) => a(0, { sku: p }) }) })
    ] }) }),
    (b || t.external_links.length > 0) && /* @__PURE__ */ e(
      A,
      {
        title: "Links to other shops",
        description: "Buttons such as 'Buy on Tokopedia'.",
        actions: t.external_links.length < 10 && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => n({ external_links: [...t.external_links, { preset: "tokopedia", label: null, url: null }] }), children: "Add link" }),
        children: t.external_links.map((p, k) => {
          const F = (f) => n({ external_links: t.external_links.map((C, h) => h === k ? { ...C, ...f } : C) });
          return /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[10rem_1fr_2fr_auto]", children: [
            /* @__PURE__ */ e(g, { label: "Shop", htmlFor: `${i}-link-${k}-preset`, children: /* @__PURE__ */ e(
              I,
              {
                id: `${i}-link-${k}-preset`,
                value: p.preset ?? "",
                onChange: (f) => F({ preset: f || null }),
                options: [...Object.entries(s.link_presets), ["", "Other…"]]
              }
            ) }),
            /* @__PURE__ */ e(g, { label: "Button label", htmlFor: `${i}-link-${k}-label`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${k}-label`, value: p.label, placeholder: p.preset ? `Buy on ${s.link_presets[p.preset]}` : "", onChange: (f) => F({ label: f }) }) }),
            /* @__PURE__ */ e(g, { label: "Link", htmlFor: `${i}-link-${k}-url`, children: /* @__PURE__ */ e(U, { id: `${i}-link-${k}-url`, value: p.url, placeholder: "https://", onChange: (f) => F({ url: f }) }) }),
            /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ external_links: t.external_links.filter((f, C) => C !== k) }), children: "Remove" })
          ] }, k);
        })
      }
    ),
    /* @__PURE__ */ e(A, { title: "Fulfillment", children: /* @__PURE__ */ d(L, { cols: 2, children: [
      (s.features.digital || t.downloadable) && /* @__PURE__ */ e(R, { id: `${i}-downloadable`, label: "Downloadable", checked: t.downloadable, onChange: (p) => n({ downloadable: p }), hint: "Deliver files or links after payment." }),
      /* @__PURE__ */ e(
        R,
        {
          id: `${i}-shipping`,
          label: "Needs shipping",
          checked: t.requires_shipping,
          disabled: t.downloadable,
          onChange: (p) => n({ requires_shipping: p }),
          hint: t.downloadable ? "Downloads are delivered digitally." : "Turn off for services or other items without delivery."
        }
      )
    ] }) }),
    /* @__PURE__ */ e(A, { title: "Catalog and tax", children: /* @__PURE__ */ d(L, { cols: 2, children: [
      s.features.taxes && /* @__PURE__ */ e(g, { label: "Tax class", htmlFor: `${i}-tax`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${i}-tax`,
          value: t.tax_class ?? "",
          onChange: (p) => n({ tax_class: p || null }),
          options: [["", "Standard"], ...s.tax_classes.filter((p) => p !== "standard").map((p) => [p, p])]
        }
      ) }),
      /* @__PURE__ */ e(R, { id: `${i}-featured`, label: "Featured", checked: t.featured, onChange: (p) => n({ featured: p }), hint: "Shown first when sorting by featured." })
    ] }) })
  ] });
}
function Q({ variantKey: t, tab: n, sku: a }) {
  const s = n.live?.variants[t], r = n.live?.stock_adjustment?.reasons, [l, i] = x.useState(!1), { Button: o } = B;
  return !s || s.stock_quantity === null ? null : /* @__PURE__ */ d(g, { label: "In stock", children: [
    /* @__PURE__ */ d("div", { className: "cm:flex cm:min-h-10 cm:flex-wrap cm:items-center cm:gap-x-3 cm:gap-y-1", children: [
      /* @__PURE__ */ e("strong", { className: "cm:text-lg cm:tabular-nums", "aria-live": "polite", children: s.stock_quantity }),
      r && /* @__PURE__ */ e(o, { type: "button", size: "sm", variant: "outline", onClick: () => i(!0), children: "Adjust stock" })
    ] }),
    l && r && /* @__PURE__ */ e(
      he,
      {
        id: s.id,
        stock: s.stock_quantity,
        sku: a,
        reasons: r,
        onClose: () => i(!1),
        onAdjusted: (y) => n.updateLiveStock(t, s.id, y)
      },
      s.id
    )
  ] });
}
function he({ id: t, stock: n, sku: a, reasons: s, onClose: r, onAdjusted: l }) {
  const { Button: i, Dialog: o, DialogContent: y, DialogDescription: N, DialogFooter: w, DialogHeader: u, DialogTitle: v, Input: _ } = B, [m, c] = x.useState("add"), [b, p] = x.useState(""), [k, F] = x.useState(s[0]), [f, C] = x.useState(null), [h, $] = x.useState(""), [q, P] = x.useState(!1), T = x.useId();
  async function V(D) {
    if (D.preventDefault(), D.stopPropagation(), !(q || h || b === "")) {
      P(!0), $("");
      try {
        const Y = await E(M(`commerce/inventory/${t}/adjust`), {
          method: "POST",
          signal: AbortSignal.timeout(15e3),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: m, quantity: Number(b), reason: k, note: f })
        });
        l(Y.stock_quantity), r();
      } catch {
        $("The adjustment could not be confirmed. Check the current stock in Inventory before retrying.");
      } finally {
        P(!1);
      }
    }
  }
  return /* @__PURE__ */ e(o, { open: !0, onOpenChange: (D) => {
    !D && !q && r();
  }, children: /* @__PURE__ */ d(y, { className: "cm:max-w-lg", children: [
    /* @__PURE__ */ d(u, { children: [
      /* @__PURE__ */ e(v, { children: "Adjust stock" }),
      /* @__PURE__ */ d(N, { children: [
        a ? `${a} · ` : "",
        "Current stock: ",
        n,
        ". This saves immediately and records a stock movement."
      ] })
    ] }),
    /* @__PURE__ */ d("form", { id: T, className: "cm:grid cm:gap-4", onSubmit: V, children: [
      /* @__PURE__ */ d("div", { className: "cm:grid cm:items-start cm:gap-3 cm:sm:grid-cols-2", children: [
        /* @__PURE__ */ e(g, { label: "Adjustment", htmlFor: `${T}-mode`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-mode`,
            value: m,
            onChange: (D) => {
              c(D), p("");
            },
            options: [["add", "Add or remove units"], ["set", "Set total stock"]]
          }
        ) }),
        /* @__PURE__ */ e(g, { label: m === "set" ? "New stock total" : "Units (+/−)", htmlFor: `${T}-quantity`, children: /* @__PURE__ */ e(
          _,
          {
            id: `${T}-quantity`,
            type: "number",
            inputMode: "numeric",
            required: !0,
            min: m === "set" ? 0 : -1e6,
            max: 1e6,
            step: 1,
            value: b,
            onChange: (D) => p(D.target.value)
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Reason", htmlFor: `${T}-reason`, children: /* @__PURE__ */ e(
          I,
          {
            id: `${T}-reason`,
            value: k,
            onChange: F,
            options: s.map((D) => [D, D[0].toUpperCase() + D.slice(1)])
          }
        ) }),
        /* @__PURE__ */ e(g, { label: "Note (optional)", htmlFor: `${T}-note`, children: /* @__PURE__ */ e(_, { id: `${T}-note`, value: f ?? "", maxLength: 255, onChange: (D) => C(D.target.value || null) }) })
      ] }),
      h && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: h })
    ] }),
    /* @__PURE__ */ d(w, { children: [
      /* @__PURE__ */ e(i, { type: "button", variant: "ghost", disabled: q, onClick: r, children: "Cancel" }),
      /* @__PURE__ */ e(i, { type: "submit", form: T, disabled: q || b === "" || !!h, children: q ? "Saving…" : "Save adjustment" })
    ] })
  ] }) });
}
function pe(t) {
  const { value: n, updateVariant: a, live: s, path: r } = t, l = n.variants[0];
  if (!l) return null;
  const i = s?.variants[l.id];
  return /* @__PURE__ */ d(A, { title: "Stock", children: [
    /* @__PURE__ */ e(
      R,
      {
        id: `${r}-track`,
        label: "Track stock",
        checked: l.track_stock,
        onChange: (o) => a(0, { track_stock: o }),
        hint: "Reduce stock when an order is placed and restore it when the order is cancelled."
      }
    ),
    l.track_stock ? /* @__PURE__ */ d(L, { cols: 3, children: [
      i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: l.id, tab: t, sku: l.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${r}-initial`, hint: "Set once, when the product is published.", children: /* @__PURE__ */ e(S, { id: `${r}-initial`, value: l.initial_stock, onChange: (o) => a(0, { initial_stock: o }) }) }),
      /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${r}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${r}-backorders`,
          value: l.backorders,
          onChange: (o) => a(0, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }),
      /* @__PURE__ */ e(g, { label: "Low stock at", htmlFor: `${r}-low`, hint: "Empty: the store's setting.", children: /* @__PURE__ */ e(S, { id: `${r}-low`, value: l.low_stock_threshold, onChange: (o) => a(0, { low_stock_threshold: o }) }) })
    ] }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${r}-status`, children: /* @__PURE__ */ e(
      I,
      {
        id: `${r}-status`,
        value: l.stock_status,
        onChange: (o) => a(0, { stock_status: o }),
        options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
      }
    ) })
  ] });
}
function ge({ value: t, update: n, path: a }) {
  const { Button: s } = B, r = (l, i) => n({ tiers: t.tiers.map((o, y) => y === l ? { ...o, ...i } : o) });
  return /* @__PURE__ */ d(
    A,
    {
      title: "Bulk prices",
      description: "Lower unit prices for larger quantities. The best matching tier applies.",
      actions: t.tiers.length < 20 && /* @__PURE__ */ e(
        s,
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
        t.tiers.map((l, i) => /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[8rem_12rem_1fr_1fr_auto]", children: [
          /* @__PURE__ */ e(g, { label: "From (units)", htmlFor: `${a}-tier-${i}-min`, children: /* @__PURE__ */ e(S, { id: `${a}-tier-${i}-min`, min: 2, value: l.min_qty, onChange: (o) => r(i, { min_qty: o ?? 2 }) }) }),
          /* @__PURE__ */ e(g, { label: "Price", htmlFor: `${a}-tier-${i}-type`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${i}-type`,
              value: l.type,
              onChange: (o) => r(i, { type: o, value: 0 }),
              options: [["percent_off", "Percent off"], ["amount_off", "Amount off per unit"], ["fixed_price", "Fixed unit price"]]
            }
          ) }),
          /* @__PURE__ */ e(g, { label: l.type === "percent_off" ? "Percent" : "Amount", htmlFor: `${a}-tier-${i}-value`, children: l.type === "percent_off" ? /* @__PURE__ */ e(S, { id: `${a}-tier-${i}-value`, value: l.value / 100, onChange: (o) => r(i, { value: Math.round((o ?? 0) * 100) }) }) : /* @__PURE__ */ e(O, { id: `${a}-tier-${i}-value`, value: l.value, nullable: !1, onChange: (o) => r(i, { value: o ?? 0 }) }) }),
          /* @__PURE__ */ e(g, { label: "For", htmlFor: `${a}-tier-${i}-variant`, children: /* @__PURE__ */ e(
            I,
            {
              id: `${a}-tier-${i}-variant`,
              value: l.variant ?? "",
              onChange: (o) => r(i, { variant: o || null }),
              options: [["", "All variants"], ...t.type === "variable" ? t.variants.map((o) => [o.id, X(t.options, o)]) : []]
            }
          ) }),
          /* @__PURE__ */ e(s, { type: "button", variant: "ghost", size: "sm", onClick: () => n({ tiers: t.tiers.filter((o, y) => y !== i) }), children: "Remove" })
        ] }, i))
      ]
    }
  );
}
function fe({ value: t, update: n, updateVariant: a, path: s }) {
  const r = t.variants[0];
  if (!r) return null;
  const l = (i) => t.type === "variable" ? n({ variants: t.variants.map((o) => ({ ...o, ...i })) }) : a(0, i);
  return /* @__PURE__ */ e(A, { title: "Package", description: t.type === "variable" ? "Applies to every variant; a variant can have its own weight under More." : "Used for shipping rates.", children: /* @__PURE__ */ d(L, { cols: 4, children: [
    /* @__PURE__ */ e(g, { label: "Weight (grams)", htmlFor: `${s}-weight`, children: /* @__PURE__ */ e(S, { id: `${s}-weight`, value: r.weight, onChange: (i) => l({ weight: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Length (mm)", htmlFor: `${s}-length`, children: /* @__PURE__ */ e(S, { id: `${s}-length`, value: r.length, onChange: (i) => l({ length: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Width (mm)", htmlFor: `${s}-width`, children: /* @__PURE__ */ e(S, { id: `${s}-width`, value: r.width, onChange: (i) => l({ width: i }) }) }),
    /* @__PURE__ */ e(g, { label: "Height (mm)", htmlFor: `${s}-height`, children: /* @__PURE__ */ e(S, { id: `${s}-height`, value: r.height, onChange: (i) => l({ height: i }) }) })
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
function be({ option: t, onChange: n, onRemove: a, config: s, path: r }) {
  const { Button: l, Input: i, Badge: o } = B, [y, N] = x.useState(""), w = () => {
    const m = y.split(",").map((c) => c.trim()).filter(Boolean).filter((c) => !t.values.some((b) => (b.label ?? "").toLowerCase() === c.toLowerCase()));
    m.length && n({ ...t, values: [...t.values, ...m.map((c) => ({ id: j(), label: c }))] }), N("");
  }, u = s.attribute_taxonomies.find((m) => m.handle === t.taxonomy)?.title.slice(0, 60), v = (m) => {
    const c = s.attribute_taxonomies.find((p) => p.handle === m)?.title.slice(0, 60), b = t.name.trim() === "" || t.name === u;
    n({ ...t, name: b ? c ?? "" : t.name, taxonomy: m || null, values: [] });
  }, _ = t.values.map((m) => m.term_id).filter((m) => !!m);
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-3 cm:rounded-md cm:border cm:p-3", children: [
    /* @__PURE__ */ d("div", { className: "cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_1fr_auto]", children: [
      s.attribute_taxonomies.length > 0 && /* @__PURE__ */ e(g, { label: "Values from", htmlFor: `${r}-source`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${r}-source`,
          value: t.taxonomy ?? "",
          onChange: v,
          options: [["", "Custom values"], ...s.attribute_taxonomies.map((m) => [m.handle, m.title])]
        }
      ) }),
      /* @__PURE__ */ e(g, { label: "Option name", htmlFor: `${r}-name`, children: /* @__PURE__ */ e(
        i,
        {
          id: `${r}-name`,
          value: t.name,
          placeholder: u ?? "e.g. Size",
          onChange: (m) => n({ ...t, name: m.target.value })
        }
      ) }),
      /* @__PURE__ */ e(l, { type: "button", variant: "ghost", size: "sm", onClick: a, children: "Remove option" })
    ] }),
    t.taxonomy ? /* @__PURE__ */ e(
      ne,
      {
        fields: [{ handle: "terms", type: "terms", label: "Values", config: {
          multiple: !0,
          options: (s.attribute_taxonomies.find((m) => m.handle === t.taxonomy)?.terms ?? []).map((m) => ({ value: String(m.id), label: m.title }))
        } }],
        values: { terms: _ },
        pathPrefix: `${r}-terms`,
        onChange: (m) => {
          const c = m.terms ?? [], b = t.values.filter((k) => k.term_id && c.includes(k.term_id)), p = c.filter((k) => !b.some((F) => F.term_id === k)).map((k) => ({ id: j(), term_id: k }));
          n({ ...t, values: [...b, ...p] });
        }
      }
    ) : /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-2", children: [
      /* @__PURE__ */ e("div", { className: "cm:flex cm:flex-wrap cm:gap-1.5", children: t.values.map((m) => /* @__PURE__ */ d(o, { variant: "secondary", className: "cm:gap-1", children: [
        m.label,
        /* @__PURE__ */ e("button", { type: "button", "aria-label": `Remove ${m.label}`, onClick: () => n({ ...t, values: t.values.filter((c) => c.id !== m.id) }), children: "×" })
      ] }, m.id)) }),
      /* @__PURE__ */ d("div", { className: "cm:flex cm:gap-2", children: [
        /* @__PURE__ */ e(
          i,
          {
            value: y,
            placeholder: "S, M, L",
            "aria-label": `Add values to ${t.name || "option"}`,
            onChange: (m) => N(m.target.value),
            onKeyDown: (m) => {
              m.key === "Enter" && (m.preventDefault(), w());
            }
          }
        ),
        /* @__PURE__ */ e(l, { type: "button", variant: "outline", onClick: w, children: "Add" })
      ] })
    ] })
  ] });
}
function ve({ variant: t, index: n, updateVariant: a, tab: s }) {
  const { MediaPickerInput: r } = B, l = `${s.path}-v${n}`, i = s.live?.variants[t.id];
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-4 cm:bg-muted/40 cm:p-4", children: [
    /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(g, { label: "Cost", htmlFor: `${l}-cost`, children: /* @__PURE__ */ e(O, { id: `${l}-cost`, value: t.cost, onChange: (o) => a(n, { cost: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Barcode", htmlFor: `${l}-barcode`, children: /* @__PURE__ */ e(U, { id: `${l}-barcode`, value: t.barcode, onChange: (o) => a(n, { barcode: o }) }) }),
      /* @__PURE__ */ e(g, { label: "Weight (g)", htmlFor: `${l}-weight`, children: /* @__PURE__ */ e(S, { id: `${l}-weight`, value: t.weight, onChange: (o) => a(n, { weight: o }), placeholder: "Product's" }) }),
      /* @__PURE__ */ e(g, { label: "Min / max / step", htmlFor: `${l}-min`, children: /* @__PURE__ */ d("div", { className: "cm:grid cm:grid-cols-3 cm:gap-1", children: [
        /* @__PURE__ */ e(S, { id: `${l}-min`, min: 1, value: t.min_qty, onChange: (o) => a(n, { min_qty: o ?? 1 }) }),
        /* @__PURE__ */ e(S, { min: 1, value: t.max_qty, onChange: (o) => a(n, { max_qty: o }), placeholder: "–" }),
        /* @__PURE__ */ e(S, { min: 1, value: t.qty_step, onChange: (o) => a(n, { qty_step: o ?? 1 }) })
      ] }) })
    ] }),
    s.config.features.inventory && /* @__PURE__ */ d(L, { cols: 4, children: [
      /* @__PURE__ */ e(R, { id: `${l}-track`, label: "Track stock", checked: t.track_stock, onChange: (o) => a(n, { track_stock: o }) }),
      t.track_stock && (i?.track_stock && i.stock_quantity !== null ? /* @__PURE__ */ e(Q, { variantKey: t.id, tab: s, sku: t.sku }) : /* @__PURE__ */ e(g, { label: "Starting stock", htmlFor: `${l}-initial`, children: /* @__PURE__ */ e(S, { id: `${l}-initial`, value: t.initial_stock, onChange: (o) => a(n, { initial_stock: o }) }) })),
      t.track_stock ? /* @__PURE__ */ e(g, { label: "When sold out", htmlFor: `${l}-backorders`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-backorders`,
          value: t.backorders,
          onChange: (o) => a(n, { backorders: o }),
          options: [["no", "Stop selling"], ["allow", "Keep selling (backorder)"], ["notify", "Keep selling, tell customers"]]
        }
      ) }) : /* @__PURE__ */ e(g, { label: "Stock status", htmlFor: `${l}-status`, children: /* @__PURE__ */ e(
        I,
        {
          id: `${l}-status`,
          value: t.stock_status,
          onChange: (o) => a(n, { stock_status: o }),
          options: [["in_stock", "In stock"], ["out_of_stock", "Out of stock"], ["backorder", "On backorder"]]
        }
      ) })
    ] }),
    /* @__PURE__ */ e(g, { label: "Image", htmlFor: `${l}-image`, children: /* @__PURE__ */ e(r, { id: `${l}-image`, value: t.image, types: ["image"], onChange: (o) => a(n, { image: o }) }) })
  ] });
}
function ke(t) {
  const { value: n, update: a, updateVariant: s, config: r, entryId: l, live: i } = t, { Button: o, Table: y, TableBody: N, TableCell: w, TableHead: u, TableHeader: v, TableRow: _, Switch: m } = B, [c, b] = x.useState(null), p = Object.fromEntries(t.config.attribute_taxonomies.flatMap((f) => f.terms.map((C) => [C.id, C.title]))), k = n.variants[0] ?? { ...K, id: j() }, F = (f = n.options) => a({ options: f, variants: se(f, n.variants, { ...k, initial_stock: null, image: null }, r.max_variants) });
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-6", children: [
    /* @__PURE__ */ e(
      A,
      {
        title: "Options",
        description: `Up to ${r.max_options} options, such as size and color. Variants are made for every combination.`,
        actions: n.options.length < r.max_options && /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => a({ options: [...n.options, { id: j(), name: "", taxonomy: null, values: [] }] }), children: "Add option" }),
        children: n.options.map((f, C) => /* @__PURE__ */ e(
          be,
          {
            option: f,
            config: r,
            path: `${t.path}-o${C}`,
            onChange: (h) => F(n.options.map(($, q) => q === C ? h : $)),
            onRemove: () => F(n.options.filter((h, $) => $ !== C))
          },
          f.id
        ))
      }
    ),
    /* @__PURE__ */ d(
      A,
      {
        title: `Variants (${n.variants.length})`,
        description: "Each has its own SKU, price and stock. Switch one off to stop selling it without losing it.",
        actions: /* @__PURE__ */ e(o, { type: "button", variant: "outline", size: "sm", onClick: () => F(), children: "Regenerate" }),
        children: [
          n.options.length === 0 ? /* @__PURE__ */ e("p", { className: "cm:text-sm cm:text-muted-foreground", children: "Add an option with values to create variants." }) : /* @__PURE__ */ e("div", { className: "cm:overflow-x-auto cm:rounded-md cm:border", children: /* @__PURE__ */ d(y, { children: [
            /* @__PURE__ */ e(v, { children: /* @__PURE__ */ d(_, { children: [
              /* @__PURE__ */ e(u, { children: "Variant" }),
              /* @__PURE__ */ e(u, { children: "SKU" }),
              /* @__PURE__ */ e(u, { children: "Price" }),
              /* @__PURE__ */ e(u, { children: "Compare-at" }),
              r.features.inventory && /* @__PURE__ */ e(u, { children: "Stock" }),
              /* @__PURE__ */ e(u, { children: "On sale" }),
              /* @__PURE__ */ e(u, {})
            ] }) }),
            /* @__PURE__ */ e(N, { children: n.variants.map((f, C) => {
              const h = i?.variants[f.id];
              return /* @__PURE__ */ d(x.Fragment, { children: [
                /* @__PURE__ */ d(_, { className: f.active ? "" : "cm:opacity-60", children: [
                  /* @__PURE__ */ e(w, { className: "cm:font-medium cm:whitespace-nowrap", children: X(n.options, f, p) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-36", children: /* @__PURE__ */ e(J, { value: f.sku, entryId: l, onChange: ($) => s(C, { sku: $ }) }) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.price, nullable: !1, onChange: ($) => s(C, { price: $ ?? 0 }) }) }),
                  /* @__PURE__ */ e(w, { className: "cm:min-w-32", children: /* @__PURE__ */ e(O, { value: f.compare_at_price, onChange: ($) => s(C, { compare_at_price: $ }) }) }),
                  r.features.inventory && /* @__PURE__ */ e(w, { className: "cm:whitespace-nowrap cm:text-sm", children: f.track_stock ? h?.stock_quantity ?? f.initial_stock ?? 0 : /* @__PURE__ */ e(te, { children: f.stock_status.replace("_", " ") }) }),
                  /* @__PURE__ */ e(w, { children: /* @__PURE__ */ e(m, { checked: f.active, "aria-label": "Sell this variant", onCheckedChange: ($) => s(C, { active: $ }) }) }),
                  /* @__PURE__ */ e(w, { children: /* @__PURE__ */ e(o, { type: "button", variant: "ghost", size: "sm", "aria-expanded": c === f.id, onClick: () => b(c === f.id ? null : f.id), children: c === f.id ? "Close" : "More" }) })
                ] }),
                c === f.id && /* @__PURE__ */ e(_, { children: /* @__PURE__ */ e(w, { colSpan: 7, className: "cm:p-0", children: /* @__PURE__ */ e(ve, { variant: f, index: C, updateVariant: s, tab: t }) }) })
              ] }, f.id);
            }) })
          ] }) }),
          n.variants.length > 0 && /* @__PURE__ */ d("p", { className: "cm:text-xs cm:text-muted-foreground", children: [
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
  const n = t ?? {}, a = (n.variants?.length ? n.variants : [{ ...K, id: j() }]).map((s) => ({ ...K, ...s, id: s.id ?? j() }));
  return {
    type: n.type ?? "simple",
    purchase_mode: n.purchase_mode ?? "default",
    external_links: n.external_links ?? [],
    requires_shipping: !n.downloadable && (n.requires_shipping ?? !0),
    downloadable: n.downloadable ?? !1,
    featured: n.featured ?? !1,
    tax_class: n.tax_class ?? null,
    options: n.options ?? [],
    variants: a,
    bundle: n.bundle ?? null,
    downloads: n.downloads ?? [],
    delivery: n.delivery ?? null,
    tiers: n.tiers ?? []
  };
}
function $e({ field: t, value: n, onChange: a, errors: s, id: r = "data-product" }) {
  le();
  const l = t.config ?? {}, i = ye(n), { props: o } = ie.usePage(), y = o.entry?.id ?? null, [N, w] = x.useState(), [u, v] = x.useState(null);
  x.useEffect(() => {
    if (!y) return;
    const h = new AbortController();
    return E(M(`commerce/api/products/${y}`), { signal: h.signal }).then(($) => {
      h.signal.aborted || (v($.data), w($.purchase_default));
    }).catch(() => {
    }), () => h.abort();
  }, [y, o.entry]);
  const _ = (h) => {
    const $ = { ...i, ...h };
    $.downloadable && ($.requires_shipping = !1), h.type && h.type !== "variable" && ($.options = [], $.variants = [{ ...$.variants[0], options: {} }]), h.type === "bundle" && !$.bundle && ($.bundle = { pricing: "fixed", value: 0, items: [] }), a($);
  }, m = (h, $) => _({ variants: i.variants.map((q, P) => P === h ? { ...q, ...$ } : q) }), c = [{ key: "general", label: "General", render: (h) => /* @__PURE__ */ e(ue, { ...h }) }];
  i.type === "variable" && c.push({ key: "variants", label: "Variants", render: (h) => /* @__PURE__ */ e(ke, { ...h }) }), i.type === "bundle" && c.push({ key: "bundle", label: "Bundle", render: (h) => /* @__PURE__ */ e(ce, { ...h }) }), i.type !== "variable" && (l.features?.inventory ?? !0) && c.push({ key: "inventory", label: "Inventory", render: (h) => /* @__PURE__ */ e(pe, { ...h }) }), i.requires_shipping && c.push({ key: "shipping", label: "Shipping", render: (h) => /* @__PURE__ */ e(fe, { ...h }) }), (l.features?.pricing_rules !== !1 || i.tiers.length > 0) && c.push({ key: "pricing", label: "Bulk pricing", render: (h) => /* @__PURE__ */ e(ge, { ...h }) }), i.downloadable && c.push({ key: "digital", label: "Digital", render: (h) => /* @__PURE__ */ e(me, { ...h }) });
  for (const [h, $] of Object.entries(ae.productTabs()))
    c.push({ key: `ext-${h}`, label: $.label ?? h, render: (q) => /* @__PURE__ */ e($, { ...q }) });
  const [b, p] = x.useState("general"), k = c.find((h) => h.key === b) ?? c[0], F = s?.[""], f = (h, $, q) => {
    v((P) => {
      const T = P?.variants[h];
      return !P || !T || T.id !== $ ? P : { ...P, variants: { ...P.variants, [h]: { ...T, stock_quantity: q } } };
    });
  }, C = { value: i, update: _, updateVariant: m, config: l, live: u, purchaseDefault: N ?? l.purchase_default, updateLiveStock: f, entryId: y, path: r };
  return /* @__PURE__ */ d("div", { className: "cm:grid cm:gap-5", children: [
    u?.sync_status === "failed" && /* @__PURE__ */ d("div", { role: "alert", className: "cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-3 cm:py-2 cm:text-sm cm:text-destructive", children: [
      "The published version couldn't be applied to the store, so it can't be bought: ",
      u.sync_error,
      ". Fix it and publish again."
    ] }),
    F && /* @__PURE__ */ e("p", { role: "alert", className: "cm:text-sm cm:text-destructive", children: F }),
    /* @__PURE__ */ e("div", { role: "tablist", "aria-label": "Product data", className: "cm:flex cm:flex-wrap cm:gap-x-2 cm:border-b", children: c.map((h) => /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        id: `${r}-tab-${h.key}`,
        role: "tab",
        "aria-controls": `${r}-panel`,
        "aria-selected": h.key === k.key,
        onClick: () => p(h.key),
        className: W("cm:-mb-px cm:border-b-2 cm:px-3 cm:py-2 cm:text-sm", h.key === k.key ? "cm:border-primary cm:font-medium" : "cm:border-transparent cm:text-muted-foreground cm:hover:text-foreground"),
        children: h.label
      },
      h.key
    )) }),
    /* @__PURE__ */ e("div", { id: `${r}-panel`, role: "tabpanel", "aria-labelledby": `${r}-tab-${k.key}`, children: k.render(C) })
  ] });
}
export {
  $e as default
};
