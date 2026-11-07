import { e as a, c as t, n as i, o, d as n } from "./main-Zvb9Pf3Y.js";
function u({ section: e, sections: m, form: s }) {
  const r = a.settingsSections()[e.key];
  return /* @__PURE__ */ t(
    i,
    {
      sections: m,
      current: e.key,
      title: `${e.label} settings`,
      primary: r ? void 0 : /* @__PURE__ */ t(n.Button, { type: "submit", form: "commerce-settings-form", children: "Save" }),
      children: r ? /* @__PURE__ */ t(r, { section: e, form: s }, e.key) : /* @__PURE__ */ t(o, { form: s, id: "commerce-settings-form", storageKey: `commerce:settings:${e.key}` }, e.key)
    }
  );
}
export {
  u as default
};
