import { e as o, R as m, b as t, n as c, o as g, c as u } from "./main-DvGXgNMx.js";
function l({ section: e, sections: r, form: a }) {
  const s = o.settingsSections()[e.key], [i, n] = m.useState(!1);
  return /* @__PURE__ */ t(
    c,
    {
      sections: r,
      current: e.key,
      title: `${e.label} settings`,
      primary: s ? void 0 : /* @__PURE__ */ t(u.Button, { type: "submit", form: "commerce-settings-form", disabled: i, children: "Save" }),
      children: s ? /* @__PURE__ */ t(s, { section: e, form: a }, e.key) : /* @__PURE__ */ t(g, { form: a, id: "commerce-settings-form", onProcessing: n, storageKey: `commerce:settings:${e.key}` }, e.key)
    }
  );
}
export {
  l as default
};
