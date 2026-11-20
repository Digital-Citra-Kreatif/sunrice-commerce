import { e as o, R as c, b as t, q as g, m as u, c as y } from "./main-qm0WOjIH.js";
function d({ section: e, sections: r, form: a, parent: i }) {
  const s = o.settingsSections()[e.key], [m, n] = c.useState(!1);
  return /* @__PURE__ */ t(
    g,
    {
      sections: r,
      current: e.key,
      title: `${e.label} settings`,
      parent: i,
      primary: s ? void 0 : /* @__PURE__ */ t(y.Button, { type: "submit", form: "commerce-settings-form", disabled: m, children: "Save" }),
      children: s ? /* @__PURE__ */ t(s, { section: e, form: a }, e.key) : /* @__PURE__ */ t(u, { form: a, id: "commerce-settings-form", onProcessing: n, storageKey: `commerce:settings:${e.key}` }, e.key)
    }
  );
}
export {
  d as default
};
