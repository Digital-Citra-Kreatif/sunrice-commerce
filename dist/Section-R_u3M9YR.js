import { e as n, R as o, b as t, p as c, l as g, c as u } from "./main-CbiNZeRv.js";
function y({ section: e, sections: r, form: a }) {
  const s = n.settingsSections()[e.key], [i, m] = o.useState(!1);
  return /* @__PURE__ */ t(
    c,
    {
      sections: r,
      current: e.key,
      title: `${e.label} settings`,
      primary: s ? void 0 : /* @__PURE__ */ t(u.Button, { type: "submit", form: "commerce-settings-form", disabled: i, children: "Save" }),
      children: s ? /* @__PURE__ */ t(s, { section: e, form: a }, e.key) : /* @__PURE__ */ t(g, { form: a, id: "commerce-settings-form", onProcessing: m, storageKey: `commerce:settings:${e.key}` }, e.key)
    }
  );
}
export {
  y as default
};
