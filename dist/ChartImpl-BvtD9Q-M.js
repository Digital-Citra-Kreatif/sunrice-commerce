import { c as re, j as Do, a as qt, F as ab } from "./main-TrOnz9SF.js";
const sh = window.Sunrice.React, {
  Children: fh,
  Component: dh,
  Fragment: et,
  PureComponent: vh,
  StrictMode: ob,
  Suspense: ub,
  cloneElement: mt,
  createContext: ge,
  createElement: x,
  createRef: lb,
  forwardRef: we,
  isValidElement: ve,
  lazy: cb,
  memo: gt,
  startTransition: sb,
  use: fb,
  useActionState: db,
  useCallback: Q,
  useContext: Ge,
  useDebugValue: vb,
  useDeferredValue: hb,
  useEffect: ce,
  useId: pb,
  useImperativeHandle: ll,
  useInsertionEffect: yb,
  useLayoutEffect: xe,
  useMemo: ht,
  useOptimistic: mb,
  useReducer: gb,
  useRef: Y,
  useState: Se,
  useSyncExternalStore: bb,
  useTransition: xb,
  version: wb
} = sh, hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: fh,
  Component: dh,
  Fragment: et,
  PureComponent: vh,
  StrictMode: ob,
  Suspense: ub,
  cloneElement: mt,
  createContext: ge,
  createElement: x,
  createRef: lb,
  default: sh,
  forwardRef: we,
  isValidElement: ve,
  lazy: cb,
  memo: gt,
  startTransition: sb,
  use: fb,
  useActionState: db,
  useCallback: Q,
  useContext: Ge,
  useDebugValue: vb,
  useDeferredValue: hb,
  useEffect: ce,
  useId: pb,
  useImperativeHandle: ll,
  useInsertionEffect: yb,
  useLayoutEffect: xe,
  useMemo: ht,
  useOptimistic: mb,
  useReducer: gb,
  useRef: Y,
  useState: Se,
  useSyncExternalStore: bb,
  useTransition: xb,
  version: wb
}, Symbol.toStringTag, { value: "Module" }));
var Ab = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];
function cl(e) {
  if (typeof e != "string")
    return !1;
  var t = Ab;
  return t.includes(e);
}
var Ob = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "className",
  "color",
  "height",
  "id",
  "lang",
  "max",
  "media",
  "method",
  "min",
  "name",
  "style",
  /*
   * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
   * that can use it, and it conflicts with the recharts prop 'type'
   * https://github.com/recharts/recharts/pull/3327
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  // 'type',
  "target",
  "width",
  "role",
  "tabIndex",
  "accentHeight",
  "accumulate",
  "additive",
  "alignmentBaseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabicForm",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baselineShift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "capHeight",
  "clip",
  "clipPath",
  "clipPathUnits",
  "clipRule",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorProfile",
  "colorRendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "href",
  "ideographic",
  "imageRendering",
  "in2",
  "in",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "k",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerHeight",
  "markerMid",
  "markerStart",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "paintOrder",
  "panose1",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "values",
  "vectorEffect",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "vHanging",
  "vIdeographic",
  "viewTarget",
  "visibility",
  "vMathematical",
  "widths",
  "wordSpacing",
  "writingMode",
  "x1",
  "x2",
  "x",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlns",
  "xmlnsXlink",
  "xmlSpace",
  "y1",
  "y2",
  "y",
  "yChannelSelector",
  "z",
  "zoomAndPan",
  "ref",
  "key",
  "angle"
], Pb = new Set(Ob);
function ph(e) {
  return typeof e != "string" ? !1 : Pb.has(e);
}
function yh(e) {
  return typeof e == "string" && e.startsWith("data-");
}
function _t(e) {
  if (typeof e != "object" || e === null)
    return {};
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (ph(r) || yh(r)) && (t[r] = e[r]);
  return t;
}
function li(e) {
  if (e == null)
    return null;
  if (/* @__PURE__ */ ve(e) && typeof e.props == "object" && e.props !== null) {
    var t = e.props;
    return _t(t);
  }
  return typeof e == "object" && !Array.isArray(e) ? _t(e) : null;
}
function at(e) {
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) && (ph(r) || yh(r) || cl(r)) && (t[r] = e[r]);
  return t;
}
function Sb(e) {
  return e == null ? null : /* @__PURE__ */ ve(e) ? at(e.props) : typeof e == "object" && !Array.isArray(e) ? at(e) : null;
}
var Ib = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function hu() {
  return hu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, hu.apply(null, arguments);
}
function _b(e, t) {
  if (e == null) return {};
  var r, n, i = kb(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function kb(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var sl = /* @__PURE__ */ we((e, t) => {
  var r = e.children, n = e.width, i = e.height, a = e.viewBox, o = e.className, u = e.style, l = e.title, c = e.desc, s = _b(e, Ib), f = a || {
    width: n,
    height: i,
    x: 0,
    y: 0
  }, d = re("recharts-surface", o);
  return /* @__PURE__ */ x("svg", hu({}, at(s), {
    className: d,
    width: n,
    height: i,
    style: u,
    viewBox: "".concat(f.x, " ").concat(f.y, " ").concat(f.width, " ").concat(f.height),
    ref: t
  }), /* @__PURE__ */ x("title", null, l), /* @__PURE__ */ x("desc", null, c), r);
}), jb = ["children", "className"];
function pu() {
  return pu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, pu.apply(null, arguments);
}
function Cb(e, t) {
  if (e == null) return {};
  var r, n, i = Eb(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function Eb(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var ot = /* @__PURE__ */ we((e, t) => {
  var r = e.children, n = e.className, i = Cb(e, jb), a = re("recharts-layer", n);
  return /* @__PURE__ */ x("g", pu({
    className: a
  }, at(i), {
    ref: t
  }), r);
});
const Tb = window.Sunrice.ReactDOM, { createPortal: fl, flushSync: YR } = Tb;
function yu(e) {
  return e === "__proto__";
}
const Mb = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;
function mh(e) {
  switch (typeof e) {
    case "number":
    case "symbol":
      return !1;
    case "string":
      return e === "" || e.startsWith(".") || e.endsWith(".") ? !1 : Mb.test(e);
    default:
      return !1;
  }
}
function Ua(e) {
  return typeof e == "string" || typeof e == "symbol" ? e : Object.is(e?.valueOf?.(), -0) ? "-0" : String(e);
}
function dl(e) {
  return typeof e == "symbol" || e instanceof Symbol;
}
function Db(e) {
  return e == null ? "" : gh(e);
}
function gh(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return e.map(gh).join(",");
  if (dl(e)) return e.toString();
  const t = e + "";
  return t === "0" && Object.is(Number(e), -0) ? "-0" : t;
}
function vl(e) {
  if (Array.isArray(e)) return e.map(Ua);
  if (typeof e == "symbol") return [e];
  e = Db(e);
  const t = [], r = e.length;
  if (r === 0) return t;
  let n = 0, i = "", a = "", o = !1, u = !1;
  const l = /^-?\d+(?:\.\d+)?$/;
  for (e.charCodeAt(0) === 46 && t.push(""); n < r; ) {
    const c = e[n];
    if (a) c === "\\" && n + 1 < r ? (n++, i += e[n]) : c === a ? a = "" : i += c;
    else if (o) if (c === '"' || c === "'")
      a = c, u = !0;
    else if (c === "]") {
      if (o = !1, !u && i.includes(".") && !l.test(i)) {
        const s = i.split(".");
        for (let f = 0; f < s.length; f++) s[f] !== "" && t.push(s[f]);
      } else t.push(i);
      i = "";
    } else i += c;
    else if (c === "[")
      o = !0, u = !1, i && (t.push(i), i = "");
    else if (c === ".") {
      i && (t.push(i), i = "");
      const s = e[n + 1];
      (s === void 0 || s === ".") && t.push("");
    } else i += c;
    n++;
  }
  return i && t.push(i), t;
}
function tr(e, t, r) {
  if (e == null) return r;
  switch (typeof t) {
    case "string": {
      if (yu(t)) return r;
      const n = e[t];
      return n === void 0 ? mh(t) && !Object.hasOwn(e, t) ? tr(e, vl(t), r) : r : n;
    }
    case "number":
    case "symbol": {
      typeof t == "number" && (t = Ua(t));
      const n = e[t];
      return n === void 0 ? r : n;
    }
    default: {
      if (Array.isArray(t)) return $b(e, t, r);
      if (Object.is(t?.valueOf(), -0) ? t = "-0" : t = String(t), yu(t)) return r;
      const n = e[t];
      return n === void 0 ? r : n;
    }
  }
}
function $b(e, t, r) {
  if (t.length === 0) return r;
  let n = e;
  for (let i = 0; i < t.length; i++) {
    if (n == null || yu(t[i])) return r;
    n = n[t[i]];
  }
  return n === void 0 ? r : n;
}
var Nb = 4;
function Xt(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Nb, r = 10 ** t, n = Math.round(e * r) / r;
  return Object.is(n, -0) ? 0 : n;
}
function $e(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  return e.reduce((i, a, o) => {
    var u = r[o - 1];
    return typeof u == "string" ? i + u + a : u !== void 0 ? i + Xt(u) + a : i + a;
  }, "");
}
var Xe = (e) => e === 0 ? 0 : e > 0 ? 1 : -1, Wt = (e) => typeof e == "number" && e != +e, Rr = (e) => typeof e == "string" && e.length > 1 && e.indexOf("%") === e.length - 1, T = (e) => (typeof e == "number" || e instanceof Number) && !Wt(e), Ft = (e) => T(e) || typeof e == "string", Lb = 0, Xn = (e) => {
  var t = ++Lb;
  return "".concat(e || "").concat(t);
}, kt = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!T(t) && typeof t != "string")
    return n;
  var a;
  if (Rr(t)) {
    if (r == null)
      return n;
    var o = t.indexOf("%");
    a = r * parseFloat(t.slice(0, o)) / 100;
  } else
    a = +t;
  return Wt(a) && (a = n), i && r != null && a > r && (a = r), a;
}, bh = (e) => {
  if (!Array.isArray(e))
    return !1;
  for (var t = e.length, r = {}, n = 0; n < t; n++)
    if (!r[String(e[n])])
      r[String(e[n])] = !0;
    else
      return !0;
  return !1;
};
function me(e, t, r) {
  return T(e) && T(t) ? Xt(e + r * (t - e)) : t;
}
function xh(e, t, r) {
  if (!(!e || !e.length))
    return e.find((n) => n && (typeof t == "function" ? t(n) : tr(n, t)) === r);
}
var se = (e) => e === null || typeof e > "u", ci = (e) => se(e) ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));
function Ze(e) {
  return e != null;
}
function Hr() {
}
function hl(e) {
  if (e)
    return {
      x: e.x,
      y: e.y,
      upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
      lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
      width: e.width,
      height: e.height
    };
}
function es(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Mt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? es(Object(r), !0).forEach(function(n) {
      Rb(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : es(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Rb(e, t, r) {
  return (t = zb(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function zb(e) {
  var t = Bb(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Bb(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wh = (e) => {
  var t = e.viewBox, r = e.position, n = e.offset, i = n === void 0 ? 0 : n, a = e.parentViewBox, o = e.clamp, u = hl(t), l = u.x, c = u.y, s = u.height, f = u.upperWidth, d = u.lowerWidth, v = l, h = l + (f - d) / 2, p = (v + h) / 2, y = (f + d) / 2, m = v + f / 2, b = s >= 0 ? 1 : -1, g = b * i, A = b > 0 ? "end" : "start", O = b > 0 ? "start" : "end", w = f >= 0 ? 1 : -1, S = w * i, _ = w > 0 ? "end" : "start", E = w > 0 ? "start" : "end", j = a;
  if (r === "top") {
    var k = {
      x: v + f / 2,
      y: c - g,
      horizontalAnchor: "middle",
      verticalAnchor: A
    };
    return o && j && (k.height = Math.max(c - j.y, 0), k.width = f), k;
  }
  if (r === "bottom") {
    var I = {
      x: h + d / 2,
      y: c + s + g,
      horizontalAnchor: "middle",
      verticalAnchor: O
    };
    return o && j && (I.height = Math.max(j.y + j.height - (c + s), 0), I.width = d), I;
  }
  if (r === "left") {
    var R = {
      x: p - S,
      y: c + s / 2,
      horizontalAnchor: _,
      verticalAnchor: "middle"
    };
    return o && j && (R.width = Math.max(R.x - j.x, 0), R.height = s), R;
  }
  if (r === "right") {
    var N = {
      x: p + y + S,
      y: c + s / 2,
      horizontalAnchor: E,
      verticalAnchor: "middle"
    };
    return o && j && (N.width = Math.max(j.x + j.width - N.x, 0), N.height = s), N;
  }
  var L = o && j ? {
    width: y,
    height: s
  } : {};
  return r === "insideLeft" ? Mt({
    x: p + S,
    y: c + s / 2,
    horizontalAnchor: E,
    verticalAnchor: "middle"
  }, L) : r === "insideRight" ? Mt({
    x: p + y - S,
    y: c + s / 2,
    horizontalAnchor: _,
    verticalAnchor: "middle"
  }, L) : r === "insideTop" ? Mt({
    x: v + f / 2,
    y: c + g,
    horizontalAnchor: "middle",
    verticalAnchor: O
  }, L) : r === "insideBottom" ? Mt({
    x: h + d / 2,
    y: c + s - g,
    horizontalAnchor: "middle",
    verticalAnchor: A
  }, L) : r === "insideTopLeft" ? Mt({
    x: v + S,
    y: c + g,
    horizontalAnchor: E,
    verticalAnchor: O
  }, L) : r === "insideTopRight" ? Mt({
    x: v + f - S,
    y: c + g,
    horizontalAnchor: _,
    verticalAnchor: O
  }, L) : r === "insideBottomLeft" ? Mt({
    x: h + S,
    y: c + s - g,
    horizontalAnchor: E,
    verticalAnchor: A
  }, L) : r === "insideBottomRight" ? Mt({
    x: h + d - S,
    y: c + s - g,
    horizontalAnchor: _,
    verticalAnchor: A
  }, L) : r && typeof r == "object" && (T(r.x) || Rr(r.x)) && (T(r.y) || Rr(r.y)) ? Mt({
    x: l + kt(r.x, y),
    y: c + kt(r.y, s),
    horizontalAnchor: "end",
    verticalAnchor: "end"
  }, L) : Mt({
    x: m,
    y: c + s / 2,
    horizontalAnchor: "middle",
    verticalAnchor: "middle"
  }, L);
}, Wb = ["top", "left", "right", "bottom"];
function pl(e) {
  return e == null ? !1 : typeof e == "object" ? !0 : Wb.includes(e);
}
var Ah = /* @__PURE__ */ ge(null), Fb = () => Ge(Ah);
function ie(e) {
  return function() {
    return e;
  };
}
const Oh = Math.cos, Zi = Math.sin, Ct = Math.sqrt, Qi = Math.PI, Ha = 2 * Qi, mu = Math.PI, gu = 2 * mu, _r = 1e-6, Kb = gu - _r;
function Ph(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function Ub(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Ph;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let i = 1, a = n.length; i < a; ++i)
      this._ += Math.round(arguments[i] * r) / r + n[i];
  };
}
class Hb {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Ph : Ub(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, n, i) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +i}`;
  }
  bezierCurveTo(t, r, n, i, a, o) {
    this._append`C${+t},${+r},${+n},${+i},${this._x1 = +a},${this._y1 = +o}`;
  }
  arcTo(t, r, n, i, a) {
    if (t = +t, r = +r, n = +n, i = +i, a = +a, a < 0) throw new Error(`negative radius: ${a}`);
    let o = this._x1, u = this._y1, l = n - t, c = i - r, s = o - t, f = u - r, d = s * s + f * f;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (d > _r) if (!(Math.abs(f * l - c * s) > _r) || !a)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let v = n - o, h = i - u, p = l * l + c * c, y = v * v + h * h, m = Math.sqrt(p), b = Math.sqrt(d), g = a * Math.tan((mu - Math.acos((p + d - y) / (2 * m * b))) / 2), A = g / b, O = g / m;
      Math.abs(A - 1) > _r && this._append`L${t + A * s},${r + A * f}`, this._append`A${a},${a},0,0,${+(f * v > s * h)},${this._x1 = t + O * l},${this._y1 = r + O * c}`;
    }
  }
  arc(t, r, n, i, a, o) {
    if (t = +t, r = +r, n = +n, o = !!o, n < 0) throw new Error(`negative radius: ${n}`);
    let u = n * Math.cos(i), l = n * Math.sin(i), c = t + u, s = r + l, f = 1 ^ o, d = o ? i - a : a - i;
    this._x1 === null ? this._append`M${c},${s}` : (Math.abs(this._x1 - c) > _r || Math.abs(this._y1 - s) > _r) && this._append`L${c},${s}`, n && (d < 0 && (d = d % gu + gu), d > Kb ? this._append`A${n},${n},0,1,${f},${t - u},${r - l}A${n},${n},0,1,${f},${this._x1 = c},${this._y1 = s}` : d > _r && this._append`A${n},${n},0,${+(d >= mu)},${f},${this._x1 = t + n * Math.cos(a)},${this._y1 = r + n * Math.sin(a)}`);
  }
  rect(t, r, n, i) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+i}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function yl(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const n = Math.floor(r);
      if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = n;
    }
    return e;
  }, () => new Hb(t);
}
function ml(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Sh(e) {
  this._context = e;
}
Sh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function Ya(e) {
  return new Sh(e);
}
function Ih(e) {
  return e[0];
}
function _h(e) {
  return e[1];
}
function kh(e, t) {
  var r = ie(!0), n = null, i = Ya, a = null, o = yl(u);
  e = typeof e == "function" ? e : e === void 0 ? Ih : ie(e), t = typeof t == "function" ? t : t === void 0 ? _h : ie(t);
  function u(l) {
    var c, s = (l = ml(l)).length, f, d = !1, v;
    for (n == null && (a = i(v = o())), c = 0; c <= s; ++c)
      !(c < s && r(f = l[c], c, l)) === d && ((d = !d) ? a.lineStart() : a.lineEnd()), d && a.point(+e(f, c, l), +t(f, c, l));
    if (v) return a = null, v + "" || null;
  }
  return u.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : ie(+l), u) : e;
  }, u.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : ie(+l), u) : t;
  }, u.defined = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : ie(!!l), u) : r;
  }, u.curve = function(l) {
    return arguments.length ? (i = l, n != null && (a = i(n)), u) : i;
  }, u.context = function(l) {
    return arguments.length ? (l == null ? n = a = null : a = i(n = l), u) : n;
  }, u;
}
function ki(e, t, r) {
  var n = null, i = ie(!0), a = null, o = Ya, u = null, l = yl(c);
  e = typeof e == "function" ? e : e === void 0 ? Ih : ie(+e), t = typeof t == "function" ? t : ie(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? _h : ie(+r);
  function c(f) {
    var d, v, h, p = (f = ml(f)).length, y, m = !1, b, g = new Array(p), A = new Array(p);
    for (a == null && (u = o(b = l())), d = 0; d <= p; ++d) {
      if (!(d < p && i(y = f[d], d, f)) === m)
        if (m = !m)
          v = d, u.areaStart(), u.lineStart();
        else {
          for (u.lineEnd(), u.lineStart(), h = d - 1; h >= v; --h)
            u.point(g[h], A[h]);
          u.lineEnd(), u.areaEnd();
        }
      m && (g[d] = +e(y, d, f), A[d] = +t(y, d, f), u.point(n ? +n(y, d, f) : g[d], r ? +r(y, d, f) : A[d]));
    }
    if (b) return u = null, b + "" || null;
  }
  function s() {
    return kh().defined(i).curve(o).context(a);
  }
  return c.x = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : ie(+f), n = null, c) : e;
  }, c.x0 = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : ie(+f), c) : e;
  }, c.x1 = function(f) {
    return arguments.length ? (n = f == null ? null : typeof f == "function" ? f : ie(+f), c) : n;
  }, c.y = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : ie(+f), r = null, c) : t;
  }, c.y0 = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : ie(+f), c) : t;
  }, c.y1 = function(f) {
    return arguments.length ? (r = f == null ? null : typeof f == "function" ? f : ie(+f), c) : r;
  }, c.lineX0 = c.lineY0 = function() {
    return s().x(e).y(t);
  }, c.lineY1 = function() {
    return s().x(e).y(r);
  }, c.lineX1 = function() {
    return s().x(n).y(t);
  }, c.defined = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : ie(!!f), c) : i;
  }, c.curve = function(f) {
    return arguments.length ? (o = f, a != null && (u = o(a)), c) : o;
  }, c.context = function(f) {
    return arguments.length ? (f == null ? a = u = null : u = o(a = f), c) : a;
  }, c;
}
class jh {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function Yb(e) {
  return new jh(e, !0);
}
function qb(e) {
  return new jh(e, !1);
}
const gl = {
  draw(e, t) {
    const r = Ct(t / Qi);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, Ha);
  }
}, Gb = {
  draw(e, t) {
    const r = Ct(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, Ch = Ct(1 / 3), Vb = Ch * 2, Xb = {
  draw(e, t) {
    const r = Ct(t / Vb), n = r * Ch;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, Zb = {
  draw(e, t) {
    const r = Ct(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, Qb = 0.8908130915292852, Eh = Zi(Qi / 10) / Zi(7 * Qi / 10), Jb = Zi(Ha / 10) * Eh, ex = -Oh(Ha / 10) * Eh, tx = {
  draw(e, t) {
    const r = Ct(t * Qb), n = Jb * r, i = ex * r;
    e.moveTo(0, -r), e.lineTo(n, i);
    for (let a = 1; a < 5; ++a) {
      const o = Ha * a / 5, u = Oh(o), l = Zi(o);
      e.lineTo(l * r, -u * r), e.lineTo(u * n - l * i, l * n + u * i);
    }
    e.closePath();
  }
}, $o = Ct(3), rx = {
  draw(e, t) {
    const r = -Ct(t / ($o * 3));
    e.moveTo(0, r * 2), e.lineTo(-$o * r, -r), e.lineTo($o * r, -r), e.closePath();
  }
}, lt = -0.5, ct = Ct(3) / 2, bu = 1 / Ct(12), nx = (bu / 2 + 1) * 3, ix = {
  draw(e, t) {
    const r = Ct(t / nx), n = r / 2, i = r * bu, a = n, o = r * bu + r, u = -a, l = o;
    e.moveTo(n, i), e.lineTo(a, o), e.lineTo(u, l), e.lineTo(lt * n - ct * i, ct * n + lt * i), e.lineTo(lt * a - ct * o, ct * a + lt * o), e.lineTo(lt * u - ct * l, ct * u + lt * l), e.lineTo(lt * n + ct * i, lt * i - ct * n), e.lineTo(lt * a + ct * o, lt * o - ct * a), e.lineTo(lt * u + ct * l, lt * l - ct * u), e.closePath();
  }
};
function ax(e, t) {
  let r = null, n = yl(i);
  e = typeof e == "function" ? e : ie(e || gl), t = typeof t == "function" ? t : ie(t === void 0 ? 64 : +t);
  function i() {
    let a;
    if (r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a) return r = null, a + "" || null;
  }
  return i.type = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : ie(a), i) : e;
  }, i.size = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : ie(+a), i) : t;
  }, i.context = function(a) {
    return arguments.length ? (r = a ?? null, i) : r;
  }, i;
}
function Ji() {
}
function ea(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function Th(e) {
  this._context = e;
}
Th.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        ea(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        ea(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function ox(e) {
  return new Th(e);
}
function Mh(e) {
  this._context = e;
}
Mh.prototype = {
  areaStart: Ji,
  areaEnd: Ji,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        ea(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function ux(e) {
  return new Mh(e);
}
function Dh(e) {
  this._context = e;
}
Dh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        ea(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function lx(e) {
  return new Dh(e);
}
function $h(e) {
  this._context = e;
}
$h.prototype = {
  areaStart: Ji,
  areaEnd: Ji,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function cx(e) {
  return new $h(e);
}
function ts(e) {
  return e < 0 ? -1 : 1;
}
function rs(e, t, r) {
  var n = e._x1 - e._x0, i = t - e._x1, a = (e._y1 - e._y0) / (n || i < 0 && -0), o = (r - e._y1) / (i || n < 0 && -0), u = (a * i + o * n) / (n + i);
  return (ts(a) + ts(o)) * Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs(u)) || 0;
}
function ns(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function No(e, t, r) {
  var n = e._x0, i = e._y0, a = e._x1, o = e._y1, u = (a - n) / 3;
  e._context.bezierCurveTo(n + u, i + u * t, a - u, o - u * r, a, o);
}
function ta(e) {
  this._context = e;
}
ta.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        No(this, this._t0, ns(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, No(this, ns(this, r = rs(this, e, t)), r);
          break;
        default:
          No(this, this._t0, r = rs(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function Nh(e) {
  this._context = new Lh(e);
}
(Nh.prototype = Object.create(ta.prototype)).point = function(e, t) {
  ta.prototype.point.call(this, t, e);
};
function Lh(e) {
  this._context = e;
}
Lh.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, n, i, a) {
    this._context.bezierCurveTo(t, e, n, r, a, i);
  }
};
function sx(e) {
  return new ta(e);
}
function fx(e) {
  return new Nh(e);
}
function Rh(e) {
  this._context = e;
}
Rh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = is(e), i = is(t), a = 0, o = 1; o < r; ++a, ++o)
          this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function is(e) {
  var t, r = e.length - 1, n, i = new Array(r), a = new Array(r), o = new Array(r);
  for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
  for (i[r - 1] = 2, a[r - 1] = 7, o[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = i[t] / a[t - 1], a[t] -= n, o[t] -= n * o[t - 1];
  for (i[r - 1] = o[r - 1] / a[r - 1], t = r - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
  for (a[r - 1] = (e[r] + i[r - 1]) / 2, t = 0; t < r - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
  return [i, a];
}
function dx(e) {
  return new Rh(e);
}
function qa(e, t) {
  this._context = e, this._t = t;
}
qa.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function vx(e) {
  return new qa(e, 0.5);
}
function hx(e) {
  return new qa(e, 0);
}
function px(e) {
  return new qa(e, 1);
}
function zr(e, t) {
  if ((o = e.length) > 1)
    for (var r = 1, n, i, a = e[t[0]], o, u = a.length; r < o; ++r)
      for (i = a, a = e[t[r]], n = 0; n < u; ++n)
        a[n][1] += a[n][0] = isNaN(i[n][1]) ? i[n][0] : i[n][1];
}
function xu(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function yx(e, t) {
  return e[t];
}
function mx(e) {
  const t = [];
  return t.key = e, t;
}
function gx() {
  var e = ie([]), t = xu, r = zr, n = yx;
  function i(a) {
    var o = Array.from(e.apply(this, arguments), mx), u, l = o.length, c = -1, s;
    for (const f of a)
      for (u = 0, ++c; u < l; ++u)
        (o[u][c] = [0, +n(f, o[u].key, c, a)]).data = f;
    for (u = 0, s = ml(t(o)); u < l; ++u)
      o[s[u]].index = u;
    return r(o, s), o;
  }
  return i.keys = function(a) {
    return arguments.length ? (e = typeof a == "function" ? a : ie(Array.from(a)), i) : e;
  }, i.value = function(a) {
    return arguments.length ? (n = typeof a == "function" ? a : ie(+a), i) : n;
  }, i.order = function(a) {
    return arguments.length ? (t = a == null ? xu : typeof a == "function" ? a : ie(Array.from(a)), i) : t;
  }, i.offset = function(a) {
    return arguments.length ? (r = a ?? zr, i) : r;
  }, i;
}
function bx(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, i = 0, a = e[0].length, o; i < a; ++i) {
      for (o = r = 0; r < n; ++r) o += e[r][i][1] || 0;
      if (o) for (r = 0; r < n; ++r) e[r][i][1] /= o;
    }
    zr(e, t);
  }
}
function xx(e, t) {
  if ((i = e.length) > 0) {
    for (var r = 0, n = e[t[0]], i, a = n.length; r < a; ++r) {
      for (var o = 0, u = 0; o < i; ++o) u += e[o][r][1] || 0;
      n[r][1] += n[r][0] = -u / 2;
    }
    zr(e, t);
  }
}
function wx(e, t) {
  if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, i, a, o; n < a; ++n) {
      for (var u = 0, l = 0, c = 0; u < o; ++u) {
        for (var s = e[t[u]], f = s[n][1] || 0, d = s[n - 1][1] || 0, v = (f - d) / 2, h = 0; h < u; ++h) {
          var p = e[t[h]], y = p[n][1] || 0, m = p[n - 1][1] || 0;
          v += y - m;
        }
        l += f, c += v * f;
      }
      i[n - 1][1] += i[n - 1][0] = r, l && (r -= c / l);
    }
    i[n - 1][1] += i[n - 1][0] = r, zr(e, t);
  }
}
var Ax = ["type", "size", "sizeType"];
function wu() {
  return wu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, wu.apply(null, arguments);
}
function as(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function os(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? as(Object(r), !0).forEach(function(n) {
      Ox(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : as(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ox(e, t, r) {
  return (t = Px(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Px(e) {
  var t = Sx(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Sx(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ix(e, t) {
  if (e == null) return {};
  var r, n, i = _x(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function _x(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var zh = {
  symbolCircle: gl,
  symbolCross: Gb,
  symbolDiamond: Xb,
  symbolSquare: Zb,
  symbolStar: tx,
  symbolTriangle: rx,
  symbolWye: ix
}, kx = Math.PI / 180, jx = (e) => {
  var t = "symbol".concat(ci(e));
  return zh[t] || gl;
}, Cx = (e, t, r) => {
  if (t === "area")
    return e;
  switch (r) {
    case "cross":
      return 5 * e * e / 9;
    case "diamond":
      return 0.5 * e * e / Math.sqrt(3);
    case "square":
      return e * e;
    case "star": {
      var n = 18 * kx;
      return 1.25 * e * e * (Math.tan(n) - Math.tan(n * 2) * Math.tan(n) ** 2);
    }
    case "triangle":
      return Math.sqrt(3) * e * e / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * e * e / 8;
    default:
      return Math.PI * e * e / 4;
  }
}, Ex = (e, t) => {
  zh["symbol".concat(ci(e))] = t;
}, Bh = (e) => {
  var t = e.type, r = t === void 0 ? "circle" : t, n = e.size, i = n === void 0 ? 64 : n, a = e.sizeType, o = a === void 0 ? "area" : a, u = Ix(e, Ax), l = os(os({}, u), {}, {
    type: r,
    size: i,
    sizeType: o
  }), c = "circle";
  typeof r == "string" && (c = r);
  var s = () => {
    var p = jx(c), y = ax().type(p).size(Cx(i, o, c)), m = y();
    if (m !== null)
      return m;
  }, f = l.className, d = l.cx, v = l.cy, h = at(l);
  return T(d) && T(v) && T(i) ? /* @__PURE__ */ x("path", wu({}, h, {
    className: re("recharts-symbols", f),
    transform: "translate(".concat(d, ", ").concat(v, ")"),
    d: s()
  })) : null;
};
Bh.registerSymbol = Ex;
var Wh = (e) => "radius" in e && "startAngle" in e && "endAngle" in e, bl = (e, t) => {
  if (!e || typeof e == "function" || typeof e == "boolean")
    return null;
  var r = e;
  if (/* @__PURE__ */ ve(e) && (r = e.props), typeof r != "object" && typeof r != "function")
    return null;
  var n = {};
  return Object.keys(r).forEach((i) => {
    cl(i) && typeof r[i] == "function" && (n[i] = ((a) => r[i](r, a)));
  }), n;
}, Tx = (e, t, r) => (n) => (e(t, r, n), null), Ga = (e, t, r) => {
  if (e === null || typeof e != "object" && typeof e != "function")
    return null;
  var n = null;
  return Object.keys(e).forEach((i) => {
    var a = e[i];
    cl(i) && typeof a == "function" && (n || (n = {}), n[i] = Tx(a, t, r));
  }), n;
};
function us(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Mx(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? us(Object(r), !0).forEach(function(n) {
      Dx(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : us(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Dx(e, t, r) {
  return (t = $x(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function $x(e) {
  var t = Nx(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Nx(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Fe(e, t) {
  var r = Mx({}, e), n = t, i = Object.keys(t), a = i.reduce((o, u) => (o[u] === void 0 && n[u] !== void 0 && (o[u] = n[u]), o), r);
  return a;
}
function ra() {
  return ra = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ra.apply(null, arguments);
}
function ls(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Fh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ls(Object(r), !0).forEach(function(n) {
      Lx(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ls(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Lx(e, t, r) {
  return (t = Rx(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Rx(e) {
  var t = zx(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function zx(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ft = 32, Bx = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  layout: "horizontal",
  verticalAlign: "middle",
  labelStyle: {}
};
function Wx(e) {
  if (typeof e == "object" && e !== null && "strokeDasharray" in e)
    return String(e.strokeDasharray);
}
function Fx(e) {
  var t = e.data, r = e.iconType, n = e.inactiveColor, i = ft / 2, a = ft / 6, o = ft / 3, u = t.inactive ? n : t.color, l = r ?? t.type;
  if (l === "none")
    return null;
  if (l === "plainline")
    return /* @__PURE__ */ x("line", {
      strokeWidth: 4,
      fill: "none",
      stroke: u,
      strokeDasharray: Wx(t.payload),
      x1: 0,
      y1: i,
      x2: ft,
      y2: i,
      className: "recharts-legend-icon"
    });
  if (l === "line")
    return /* @__PURE__ */ x("path", {
      strokeWidth: 4,
      fill: "none",
      stroke: u,
      d: "M0,".concat(i, "h").concat(o, `
            A`).concat(a, ",").concat(a, ",0,1,1,").concat(2 * o, ",").concat(i, `
            H`).concat(ft, "M").concat(2 * o, ",").concat(i, `
            A`).concat(a, ",").concat(a, ",0,1,1,").concat(o, ",").concat(i),
      className: "recharts-legend-icon"
    });
  if (l === "rect")
    return /* @__PURE__ */ x("path", {
      stroke: "none",
      fill: u,
      d: "M0,".concat(ft / 8, "h").concat(ft, "v").concat(ft * 3 / 4, "h").concat(-ft, "z"),
      className: "recharts-legend-icon"
    });
  if (/* @__PURE__ */ ve(t.legendIcon)) {
    var c = Fh({}, t);
    return delete c.legendIcon, /* @__PURE__ */ mt(t.legendIcon, c);
  }
  return /* @__PURE__ */ x(Bh, {
    fill: u,
    cx: i,
    cy: i,
    size: ft,
    sizeType: "diameter",
    type: l
  });
}
function Kx(e) {
  var t = e.payload, r = e.iconSize, n = e.layout, i = e.formatter, a = e.inactiveColor, o = e.iconType, u = e.labelStyle, l = {
    x: 0,
    y: 0,
    width: ft,
    height: ft
  }, c = {
    display: n === "horizontal" ? "inline-block" : "block",
    marginRight: 10,
    whiteSpace: "nowrap"
  }, s = {
    display: "inline-block",
    verticalAlign: "middle",
    marginRight: 4
  };
  return t.map((f, d) => {
    var v, h, p = f.formatter || i, y = re({
      "recharts-legend-item": !0,
      ["legend-item-".concat(d)]: !0,
      inactive: f.inactive
    });
    if (f.type === "none")
      return null;
    var m = typeof u == "object" ? Fh({}, u) : {};
    m.color = f.inactive ? a : m.color || f.color, (v = m.whiteSpace) !== null && v !== void 0 || (m.whiteSpace = "normal"), (h = m.overflowWrap) !== null && h !== void 0 || (m.overflowWrap = "break-word");
    var b = p ? p(f.value, f, d) : f.value;
    return /* @__PURE__ */ x("li", ra({
      className: y,
      style: c,
      key: "legend-item-".concat(d)
    }, Ga(e, f, d)), /* @__PURE__ */ x(sl, {
      width: r,
      height: r,
      viewBox: l,
      style: s,
      "aria-label": f.value == null ? "legend icon" : "".concat(f.value, " legend icon")
    }, /* @__PURE__ */ x(Fx, {
      data: f,
      iconType: o,
      inactiveColor: a
    })), /* @__PURE__ */ x("span", {
      className: "recharts-legend-item-text",
      style: m
    }, b));
  });
}
var Ux = (e) => {
  var t = Fe(e, Bx), r = t.payload, n = t.layout, i = t.align;
  if (!r || !r.length)
    return null;
  var a = {
    padding: 0,
    margin: 0,
    textAlign: n === "horizontal" ? i : "left"
  };
  return /* @__PURE__ */ x("ul", {
    className: "recharts-default-legend",
    style: a
  }, /* @__PURE__ */ x(Kx, ra({}, t, {
    payload: r
  })));
};
function Hx(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = t(i, n, e);
    r.has(a) || r.set(a, i);
  }
  return Array.from(r.values());
}
function Yx(e, t) {
  return function(...r) {
    return e.apply(this, r.slice(0, t));
  };
}
function Kh(e) {
  return e;
}
function qx(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function xl(e) {
  return e != null && typeof e != "function" && qx(e.length);
}
function Gx(e) {
  return function(t) {
    return tr(t, e);
  };
}
function Uh(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function Vx(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Au(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function dn(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const Hh = "[object RegExp]", wl = "[object String]", Al = "[object Number]", Ol = "[object Boolean]", Yh = "[object Arguments]", qh = "[object Symbol]", Gh = "[object Date]", Vh = "[object Map]", Xh = "[object Set]", Zh = "[object Array]", Xx = "[object Function]", Qh = "[object ArrayBuffer]", Yi = "[object Object]", Zx = "[object Error]", Jh = "[object DataView]", ep = "[object Uint8Array]", tp = "[object Uint8ClampedArray]", rp = "[object Uint16Array]", np = "[object Uint32Array]", Qx = "[object BigUint64Array]", ip = "[object Int8Array]", ap = "[object Int16Array]", op = "[object Int32Array]", Jx = "[object BigInt64Array]", up = "[object Float32Array]", lp = "[object Float64Array]", cs = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function Ou(e) {
  return typeof cs.Buffer < "u" && cs.Buffer.isBuffer(e);
}
function ew(e, t) {
  return Cr(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Cr(e, t, r, n = /* @__PURE__ */ new Map(), i = void 0) {
  const a = i?.(e, t, r, n);
  if (a !== void 0) return a;
  if (Uh(e)) return e;
  if (n.has(e)) return n.get(e);
  if (Array.isArray(e)) {
    const o = new Array(e.length);
    n.set(e, o);
    for (let u = 0; u < e.length; u++) o[u] = Cr(e[u], u, r, n, i);
    return Object.hasOwn(e, "index") && (o.index = e.index), Object.hasOwn(e, "input") && (o.input = e.input), o;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const o = new RegExp(e.source, e.flags);
    return o.lastIndex = e.lastIndex, o;
  }
  if (e instanceof Map) {
    const o = /* @__PURE__ */ new Map();
    n.set(e, o);
    for (const [u, l] of e) o.set(u, Cr(l, u, r, n, i));
    return o;
  }
  if (e instanceof Set) {
    const o = /* @__PURE__ */ new Set();
    n.set(e, o);
    for (const u of e) o.add(Cr(u, void 0, r, n, i));
    return o;
  }
  if (Ou(e)) return e.subarray();
  if (Vx(e)) {
    const o = new (Object.getPrototypeOf(e)).constructor(e.length);
    n.set(e, o);
    for (let u = 0; u < e.length; u++) o[u] = Cr(e[u], u, r, n, i);
    return o;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const o = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (typeof File < "u" && e instanceof File) {
    const o = new File([e], e.name, { type: e.type });
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const o = new Blob([e], { type: e.type });
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (e instanceof Error) {
    const o = structuredClone(e);
    return n.set(e, o), o.message = e.message, o.name = e.name, o.stack = e.stack, o.cause = e.cause, o.constructor = e.constructor, Pt(o, e, r, n, i), o;
  }
  if (e instanceof Boolean) {
    const o = new Boolean(e.valueOf());
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (e instanceof Number) {
    const o = new Number(e.valueOf());
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (e instanceof String) {
    const o = new String(e.valueOf());
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  if (typeof e == "object" && tw(e)) {
    const o = Object.create(Object.getPrototypeOf(e));
    return n.set(e, o), Pt(o, e, r, n, i), o;
  }
  return e;
}
function Pt(e, t, r = e, n, i) {
  const a = [...Object.keys(t), ...Au(t)];
  for (let o = 0; o < a.length; o++) {
    const u = a[o], l = Object.getOwnPropertyDescriptor(e, u);
    (l == null || l.writable) && (e[u] = Cr(t[u], u, r, n, i));
  }
}
function tw(e) {
  switch (dn(e)) {
    case Yh:
    case Zh:
    case Qh:
    case Jh:
    case Ol:
    case Gh:
    case up:
    case lp:
    case ip:
    case ap:
    case op:
    case Vh:
    case Al:
    case Yi:
    case Hh:
    case Xh:
    case wl:
    case qh:
    case ep:
    case tp:
    case rp:
    case np:
      return !0;
    default:
      return !1;
  }
}
function rw(e) {
  return Cr(e, void 0, e, /* @__PURE__ */ new Map(), void 0);
}
function Yn(e, t) {
  return e === t || Number.isNaN(e) && Number.isNaN(t);
}
function cp(e) {
  return e !== null && (typeof e == "object" || typeof e == "function");
}
function sp(e, t, r) {
  return typeof r != "function" ? sp(e, t, () => {
  }) : Pu(e, t, function n(i, a, o, u, l, c) {
    const s = r(i, a, o, u, l, c);
    return s !== void 0 ? !!s : Pu(i, a, n, c, !1);
  }, /* @__PURE__ */ new Map(), !0);
}
function Pu(e, t, r, n, i = !1) {
  if (t === e) return !0;
  switch (typeof t) {
    case "object":
      return nw(e, t, r, n, i);
    case "function":
      return Object.keys(t).length > 0 ? Pu(e, { ...t }, r, n, i) : Yn(e, t);
    default:
      return cp(e) && i ? typeof t == "string" ? t === "" : !0 : Yn(e, t);
  }
}
function nw(e, t, r, n, i = !1) {
  if (t == null) return !0;
  if (Array.isArray(t)) return fp(e, t, r, n);
  if (t instanceof Map) return iw(e, t, r, n);
  if (t instanceof Set) return aw(e, t, r, n);
  const a = Object.keys(t);
  if (e == null) return i && a.length === 0;
  if (i)
    Uh(e) && (e = Object(e));
  else {
    const o = dn(e);
    if (o !== "[object Object]" && o !== "[object Arguments]") return !1;
  }
  if (a.length === 0) return !0;
  if (n?.has(t)) return n.get(t) === e;
  n?.set(t, e);
  try {
    for (let o = 0; o < a.length; o++) {
      const u = a[o];
      if (!(u in e) || t[u] === void 0 && e[u] !== void 0 || t[u] === null && e[u] !== null || !r(e[u], t[u], u, e, t, n)) return !1;
    }
    return !0;
  } finally {
    n?.delete(t);
  }
}
function iw(e, t, r, n) {
  if (t.size === 0) return !0;
  if (!(e instanceof Map)) return !1;
  for (const [i, a] of t.entries()) if (r(e.get(i), a, i, e, t, n) === !1) return !1;
  return !0;
}
function fp(e, t, r, n) {
  if (t.length === 0) return !0;
  if (!Array.isArray(e)) return !1;
  const i = /* @__PURE__ */ new Set();
  for (let a = 0; a < t.length; a++) {
    const o = t[a];
    let u = !1;
    for (let l = 0; l < e.length; l++) {
      if (i.has(l)) continue;
      const c = e[l];
      let s = !1;
      if (r(c, o, a, e, t, n) && (s = !0), s) {
        i.add(l), u = !0;
        break;
      }
    }
    if (!u) return !1;
  }
  return !0;
}
function aw(e, t, r, n) {
  return t.size === 0 ? !0 : e instanceof Set ? fp([...e], [...t], r, n) : !1;
}
function dp(e, t) {
  return sp(e, t, () => {
  });
}
function ow(e) {
  return e = rw(e), (t) => dp(t, e);
}
function uw(e, t) {
  return ew(e, (r, n, i, a) => {
    if (typeof e == "object") {
      if (dn(e) === "[object Object]" && typeof e.constructor != "function") {
        const o = {};
        return a.set(e, o), Pt(o, e, i, a), o;
      }
      switch (Object.prototype.toString.call(e)) {
        case Al:
        case wl:
        case Ol: {
          const o = new e.constructor(e?.valueOf());
          return Pt(o, e), o;
        }
        case Yh: {
          const o = {};
          return Pt(o, e), o.length = e.length, o[Symbol.iterator] = e[Symbol.iterator], o;
        }
        default:
          return;
      }
    }
  });
}
function lw(e) {
  return uw(e);
}
const cw = /^(?:0|[1-9]\d*)$/;
function vp(e, t = Number.MAX_SAFE_INTEGER) {
  switch (typeof e) {
    case "number":
      return Number.isInteger(e) && e >= 0 && e < t;
    case "symbol":
      return !1;
    case "string":
      return cw.test(e);
  }
}
function sw(e) {
  return e !== null && typeof e == "object" && dn(e) === "[object Arguments]";
}
function fw(e, t) {
  let r;
  if (Array.isArray(t) ? r = t : typeof t == "string" && mh(t) && !(t in Object(e)) ? r = vl(t) : r = [t], r.length === 0) return !1;
  let n = e;
  for (let i = 0; i < r.length; i++) {
    const a = Ua(r[i]);
    if ((n == null || !Object.hasOwn(n, a)) && !((Array.isArray(n) || sw(n)) && vp(a) && Number(a) < n.length))
      return !1;
    n = n[a];
  }
  return !0;
}
function dw(e, t) {
  switch (typeof e) {
    case "object":
      Object.is(e?.valueOf(), -0) && (e = "-0");
      break;
    case "number":
      e = Ua(e);
      break;
  }
  return t = lw(t), function(r) {
    const n = tr(r, e);
    return n === void 0 ? fw(r, e) : t === void 0 ? n === void 0 : dp(n, t);
  };
}
function vw(e) {
  if (e == null) return Kh;
  switch (typeof e) {
    case "function":
      return e;
    case "object":
      return Array.isArray(e) && e.length === 2 ? dw(e[0], e[1]) : ow(e);
    default:
      return Gx(e);
  }
}
function hw(e) {
  return e === 0 ? 0 : e;
}
function ss(e, t = Kh) {
  return xl(e) ? Hx(Array.from(e), Yx(vw(t), 1)).map(hw) : [];
}
function hp(e, t, r) {
  return t === !0 ? ss(e, r) : typeof t == "function" ? ss(e, t) : e;
}
function pw(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function yw(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function n() {
      var i = !1;
      try {
        i = this instanceof n;
      } catch {
      }
      return i ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var i = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(r, n, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), r;
}
var Lo = { exports: {} }, Ro = {};
const Pl = /* @__PURE__ */ yw(hh);
var zo = { exports: {} }, Bo = {};
var fs;
function mw() {
  if (fs) return Bo;
  fs = 1;
  var e = Pl;
  function t(f, d) {
    return f === d && (f !== 0 || 1 / f === 1 / d) || f !== f && d !== d;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useState, i = e.useEffect, a = e.useLayoutEffect, o = e.useDebugValue;
  function u(f, d) {
    var v = d(), h = n({ inst: { value: v, getSnapshot: d } }), p = h[0].inst, y = h[1];
    return a(
      function() {
        p.value = v, p.getSnapshot = d, l(p) && y({ inst: p });
      },
      [f, v, d]
    ), i(
      function() {
        return l(p) && y({ inst: p }), f(function() {
          l(p) && y({ inst: p });
        });
      },
      [f]
    ), o(v), v;
  }
  function l(f) {
    var d = f.getSnapshot;
    f = f.value;
    try {
      var v = d();
      return !r(f, v);
    } catch {
      return !0;
    }
  }
  function c(f, d) {
    return d();
  }
  var s = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? c : u;
  return Bo.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : s, Bo;
}
var ds;
function gw() {
  return ds || (ds = 1, zo.exports = mw()), zo.exports;
}
var vs;
function bw() {
  if (vs) return Ro;
  vs = 1;
  var e = Pl, t = gw();
  function r(c, s) {
    return c === s && (c !== 0 || 1 / c === 1 / s) || c !== c && s !== s;
  }
  var n = typeof Object.is == "function" ? Object.is : r, i = t.useSyncExternalStore, a = e.useRef, o = e.useEffect, u = e.useMemo, l = e.useDebugValue;
  return Ro.useSyncExternalStoreWithSelector = function(c, s, f, d, v) {
    var h = a(null);
    if (h.current === null) {
      var p = { hasValue: !1, value: null };
      h.current = p;
    } else p = h.current;
    h = u(
      function() {
        function m(w) {
          if (!b) {
            if (b = !0, g = w, w = d(w), v !== void 0 && p.hasValue) {
              var S = p.value;
              if (v(S, w))
                return A = S;
            }
            return A = w;
          }
          if (S = A, n(g, w)) return S;
          var _ = d(w);
          return v !== void 0 && v(S, _) ? (g = w, S) : (g = w, A = _);
        }
        var b = !1, g, A, O = f === void 0 ? null : f;
        return [
          function() {
            return m(s());
          },
          O === null ? void 0 : function() {
            return m(O());
          }
        ];
      },
      [s, f, d, v]
    );
    var y = i(c, h[0], h[1]);
    return o(
      function() {
        p.hasValue = !0, p.value = y;
      },
      [y]
    ), l(y), y;
  }, Ro;
}
var hs;
function xw() {
  return hs || (hs = 1, Lo.exports = bw()), Lo.exports;
}
var ww = xw(), Sl = /* @__PURE__ */ ge(null), Aw = (e) => e, ae = () => {
  var e = Ge(Sl);
  return e ? e.store.dispatch : Aw;
}, qi = () => {
}, Ow = () => qi, Pw = (e, t) => e === t;
function $(e) {
  var t = Ge(Sl), r = ht(() => t ? (n) => {
    if (n != null)
      return e(n);
  } : qi, [t, e]);
  return ww.useSyncExternalStoreWithSelector(t ? t.subscription.addNestedSub : Ow, t ? t.store.getState : qi, t ? t.store.getState : qi, r, Pw);
}
function Sw(e, t = `expected a function, instead received ${typeof e}`) {
  if (typeof e != "function")
    throw new TypeError(t);
}
function Iw(e, t = "expected all items to be functions, instead received the following types: ") {
  if (!e.every((r) => typeof r == "function")) {
    const r = e.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${t}[${r}]`);
  }
}
var ps = (e) => Array.isArray(e) ? e : [e];
function _w(e) {
  const t = Array.isArray(e[0]) ? e[0] : e;
  return Iw(
    t,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), t;
}
function kw(e, t) {
  const r = [], { length: n } = e;
  for (let i = 0; i < n; i++)
    r.push(e[i].apply(null, t));
  return r;
}
var jw = class {
  constructor(e) {
    this.value = e;
  }
  deref() {
    return this.value;
  }
}, Cw = () => typeof WeakRef > "u" ? jw : WeakRef, pp = /* @__PURE__ */ Cw(), Ew = 0, ys = 1;
function ji() {
  return {
    s: Ew,
    v: void 0,
    o: null,
    p: null
  };
}
function Tw(e) {
  return e instanceof pp ? e.deref() : e;
}
function yp(e, t = {}) {
  let r = ji();
  const { resultEqualityCheck: n } = t;
  let i, a = 0;
  function o() {
    let u = r;
    const { length: l } = arguments;
    for (let f = 0, d = l; f < d; f++) {
      const v = arguments[f];
      if (typeof v == "function" || typeof v == "object" && v !== null) {
        let h = u.o;
        h === null && (u.o = h = /* @__PURE__ */ new WeakMap());
        const p = h.get(v);
        p === void 0 ? (u = ji(), h.set(v, u)) : u = p;
      } else {
        let h = u.p;
        h === null && (u.p = h = /* @__PURE__ */ new Map());
        const p = h.get(v);
        p === void 0 ? (u = ji(), h.set(v, u)) : u = p;
      }
    }
    const c = u;
    let s;
    if (u.s === ys)
      s = u.v;
    else if (s = e.apply(null, arguments), a++, n) {
      const f = Tw(i);
      f != null && n(f, s) && (s = f, a !== 0 && a--), i = typeof s == "object" && s !== null || typeof s == "function" ? /* @__PURE__ */ new pp(s) : s;
    }
    return c.s = ys, c.v = s, s;
  }
  return o.clearCache = () => {
    r = ji(), o.resetResultsCount();
  }, o.resultsCount = () => a, o.resetResultsCount = () => {
    a = 0;
  }, o;
}
function Mw(e, ...t) {
  const r = typeof e == "function" ? {
    memoize: e,
    memoizeOptions: t
  } : e, n = (...i) => {
    let a = 0, o = 0, u, l = {}, c = i.pop();
    typeof c == "object" && (l = c, c = i.pop()), Sw(
      c,
      `createSelector expects an output function after the inputs, but received: [${typeof c}]`
    );
    const s = {
      ...r,
      ...l
    }, {
      memoize: f,
      memoizeOptions: d = [],
      argsMemoize: v = yp,
      argsMemoizeOptions: h = []
    } = s, p = ps(d), y = ps(h), m = _w(i), b = f(function() {
      return a++, c.apply(
        null,
        arguments
      );
    }, ...p), g = v(function() {
      o++;
      const O = kw(
        m,
        arguments
      );
      return u = b.apply(null, O), u;
    }, ...y);
    return Object.assign(g, {
      resultFunc: c,
      memoizedResultFunc: b,
      dependencies: m,
      dependencyRecomputations: () => o,
      resetDependencyRecomputations: () => {
        o = 0;
      },
      lastResult: () => u,
      recomputations: () => a,
      resetRecomputations: () => {
        a = 0;
      },
      memoize: f,
      argsMemoize: v
    });
  };
  return Object.assign(n, {
    withTypes: () => n
  }), n;
}
var P = /* @__PURE__ */ Mw(yp);
function Dw(e, t = 1) {
  const r = [], n = Math.floor(t), i = (a, o) => {
    for (let u = 0; u < a.length; u++) {
      const l = a[u];
      Array.isArray(l) && o < n ? i(l, o + 1) : r.push(l);
    }
  };
  return i(e, 0), r;
}
function Su(e, t, r) {
  return cp(r) && (typeof t == "number" && xl(r) && vp(t) && t < r.length || typeof t == "string" && t in r) ? Yn(r[t], e) : !1;
}
function ms(e) {
  return typeof e == "symbol" ? 1 : e === null ? 2 : e === void 0 ? 3 : e !== e ? 4 : 0;
}
const $w = (e, t, r) => {
  if (e !== t) {
    const n = ms(e), i = ms(t);
    if (n === i && n === 0) {
      if (e < t) return r === "desc" ? 1 : -1;
      if (e > t) return r === "desc" ? -1 : 1;
    }
    return r === "desc" ? i - n : n - i;
  }
  return 0;
}, Nw = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Lw = /^\w*$/;
function Rw(e, t) {
  return Array.isArray(e) ? !1 : typeof e == "number" || typeof e == "boolean" || e == null || dl(e) ? !0 : typeof e == "string" && (Lw.test(e) || !Nw.test(e)) || t != null;
}
function zw(e, t, r, n) {
  if (e == null) return [];
  r = r, Array.isArray(e) || (e = xl(e) ? Array.from(e) : Object.values(e)), Array.isArray(t) || (t = t == null ? [null] : [t]), t.length === 0 && (t = [null]), Array.isArray(r) || (r = r == null ? [] : [r]), r = r.map((u) => String(u));
  const i = (u, l) => {
    let c = u, s = 0;
    for (; s < l.length && c != null; ++s) c = c[l[s]];
    return s > 0 && s === l.length ? c : void 0;
  }, a = (u, l) => {
    if (u == null) return l;
    if (l != null)
      return typeof u == "object" && "key" in u ? Object.hasOwn(l, u.key) ? l[u.key] : i(l, u.path) : typeof u == "function" ? u(l) : Array.isArray(u) ? i(l, u) : l[u];
  }, o = t.map((u) => (Array.isArray(u) && u.length === 1 && (u = u[0]), u == null || typeof u == "function" || Array.isArray(u) || Rw(u) ? u : {
    key: u,
    path: vl(u)
  }));
  return e.map((u) => ({
    original: u,
    criteria: o.map((l) => a(l, u))
  })).slice().sort((u, l) => {
    for (let c = 0; c < o.length; c++) {
      const s = $w(u.criteria[c], l.criteria[c], r[c]);
      if (s !== 0) return s;
    }
    return 0;
  }).map((u) => u.original);
}
function Va(e, ...t) {
  const r = t.length;
  return r > 1 && Su(e, t[0], t[1]) ? t = [] : r > 2 && Su(t[0], t[1], t[2]) && (t = [t[0]]), zw(e, Dw(t), ["asc"]);
}
var mp = (e) => e.legend.settings, Bw = (e) => e.legend.size, Ww = (e) => e.legend.payload, Fw = P([Ww, mp], (e, t) => {
  var r = t.itemSorter, n = e.flat(1);
  return r ? Va(n, r) : n;
});
function Kw() {
  return $(Fw);
}
function Uw(e, t) {
  return Gw(e) || qw(e, t) || Yw(e, t) || Hw();
}
function Hw() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Yw(e, t) {
  if (e) {
    if (typeof e == "string") return gs(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? gs(e, t) : void 0;
  }
}
function gs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qw(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function Gw(e) {
  if (Array.isArray(e)) return e;
}
var Ci = 1;
function bs(e, t) {
  return Math.abs(e.height - t.height) > Ci || Math.abs(e.left - t.left) > Ci || Math.abs(e.top - t.top) > Ci || Math.abs(e.width - t.width) > Ci;
}
function xs(e) {
  var t = e.getBoundingClientRect();
  return {
    height: t.height,
    left: t.left,
    top: t.top,
    width: t.width
  };
}
function gp() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = Se({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  }), r = Uw(t, 2), n = r[0], i = r[1], a = Y(null), o = Y(n);
  o.current = n;
  var u = Q(
    (l) => {
      if (a.current != null && (a.current.disconnect(), a.current = null), l != null) {
        var c = xs(l);
        if (bs(c, o.current) && i(c), typeof ResizeObserver < "u") {
          var s = new ResizeObserver(() => {
            var f = xs(l);
            bs(f, o.current) && i(f);
          });
          s.observe(l), a.current = s;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...e]
  );
  return ce(() => () => {
    var l;
    (l = a.current) === null || l === void 0 || l.disconnect();
  }, []), [n, u];
}
function De(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var Vw = typeof Symbol == "function" && Symbol.observable || "@@observable", ws = Vw, Wo = () => Math.random().toString(36).substring(7).split("").join("."), Xw = {
  INIT: `@@redux/INIT${/* @__PURE__ */ Wo()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ Wo()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${Wo()}`
}, na = Xw;
function Il(e) {
  if (typeof e != "object" || e === null)
    return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t || Object.getPrototypeOf(e) === null;
}
function bp(e, t, r) {
  if (typeof e != "function")
    throw new Error(De(2));
  if (typeof t == "function" && typeof r == "function" || typeof r == "function" && typeof arguments[3] == "function")
    throw new Error(De(0));
  if (typeof t == "function" && typeof r > "u" && (r = t, t = void 0), typeof r < "u") {
    if (typeof r != "function")
      throw new Error(De(1));
    return r(bp)(e, t);
  }
  let n = e, i = t, a = /* @__PURE__ */ new Map(), o = a, u = 0, l = !1;
  function c() {
    o === a && (o = /* @__PURE__ */ new Map(), a.forEach((y, m) => {
      o.set(m, y);
    }));
  }
  function s() {
    if (l)
      throw new Error(De(3));
    return i;
  }
  function f(y) {
    if (typeof y != "function")
      throw new Error(De(4));
    if (l)
      throw new Error(De(5));
    let m = !0;
    c();
    const b = u++;
    return o.set(b, y), function() {
      if (m) {
        if (l)
          throw new Error(De(6));
        m = !1, c(), o.delete(b), a = null;
      }
    };
  }
  function d(y) {
    if (!Il(y))
      throw new Error(De(7));
    if (typeof y.type > "u")
      throw new Error(De(8));
    if (typeof y.type != "string")
      throw new Error(De(17));
    if (l)
      throw new Error(De(9));
    try {
      l = !0, i = n(i, y);
    } finally {
      l = !1;
    }
    return (a = o).forEach((b) => {
      b();
    }), y;
  }
  function v(y) {
    if (typeof y != "function")
      throw new Error(De(10));
    n = y, d({
      type: na.REPLACE
    });
  }
  function h() {
    const y = f;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(m) {
        if (typeof m != "object" || m === null)
          throw new Error(De(11));
        function b() {
          const A = m;
          A.next && A.next(s());
        }
        return b(), {
          unsubscribe: y(b)
        };
      },
      [ws]() {
        return this;
      }
    };
  }
  return d({
    type: na.INIT
  }), {
    dispatch: d,
    subscribe: f,
    getState: s,
    replaceReducer: v,
    [ws]: h
  };
}
function Zw(e) {
  Object.keys(e).forEach((t) => {
    const r = e[t];
    if (typeof r(void 0, {
      type: na.INIT
    }) > "u")
      throw new Error(De(12));
    if (typeof r(void 0, {
      type: na.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(De(13));
  });
}
function xp(e) {
  const t = Object.keys(e), r = {};
  for (let a = 0; a < t.length; a++) {
    const o = t[a];
    typeof e[o] == "function" && (r[o] = e[o]);
  }
  const n = Object.keys(r);
  let i;
  try {
    Zw(r);
  } catch (a) {
    i = a;
  }
  return function(o = {}, u) {
    if (i)
      throw i;
    let l = !1;
    const c = {};
    for (let s = 0; s < n.length; s++) {
      const f = n[s], d = r[f], v = o[f], h = d(v, u);
      if (typeof h > "u")
        throw u && u.type, new Error(De(14));
      c[f] = h, l = l || h !== v;
    }
    return l = l || n.length !== Object.keys(o).length, l ? c : o;
  };
}
function ia(...e) {
  return e.length === 0 ? (t) => t : e.length === 1 ? e[0] : e.reduce((t, r) => (...n) => t(r(...n)));
}
function Qw(...e) {
  return (t) => (r, n) => {
    const i = t(r, n);
    let a = () => {
      throw new Error(De(15));
    };
    const o = {
      getState: i.getState,
      dispatch: (l, ...c) => a(l, ...c)
    }, u = e.map((l) => l(o));
    return a = ia(...u)(i.dispatch), {
      ...i,
      dispatch: a
    };
  };
}
function wp(e) {
  return Il(e) && "type" in e && typeof e.type == "string";
}
var Ap = /* @__PURE__ */ Symbol.for("immer-nothing"), As = /* @__PURE__ */ Symbol.for("immer-draftable"), We = /* @__PURE__ */ Symbol.for("immer-state");
function St(e, ...t) {
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var it = Object, vn = it.getPrototypeOf, aa = "constructor", Xa = "prototype", Iu = "configurable", oa = "enumerable", Gi = "writable", Zn = "value", rr = (e) => !!e && !!e[We];
function pt(e) {
  return e ? Op(e) || Qa(e) || !!e[As] || !!e[aa]?.[As] || Ja(e) || eo(e) : !1;
}
var Jw = it[Xa][aa].toString(), Os = /* @__PURE__ */ new WeakMap();
function Op(e) {
  if (!e || !_l(e))
    return !1;
  const t = vn(e);
  if (t === null || t === it[Xa])
    return !0;
  const r = it.hasOwnProperty.call(t, aa) && t[aa];
  if (r === Object)
    return !0;
  if (!on(r))
    return !1;
  let n = Os.get(r);
  return n === void 0 && (n = Function.toString.call(r), Os.set(r, n)), n === Jw;
}
function Za(e, t, r = !0) {
  si(e) === 0 ? (r ? Reflect.ownKeys(e) : it.keys(e)).forEach((i) => {
    t(i, e[i], e);
  }) : e.forEach((n, i) => t(i, n, e));
}
function si(e) {
  const t = e[We];
  return t ? t.type_ : Qa(e) ? 1 : Ja(e) ? 2 : eo(e) ? 3 : 0;
}
var Fo = (e, t, r = si(e)) => r === 2 ? e.has(t) : it[Xa].hasOwnProperty.call(e, t), _u = (e, t, r = si(e)) => (
  // @ts-ignore
  r === 2 ? e.get(t) : e[t]
), ua = (e, t, r, n = si(e)) => {
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
};
function eA(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Qa = Array.isArray, Ja = (e) => e instanceof Map, eo = (e) => e instanceof Set, _l = (e) => typeof e == "object", on = (e) => typeof e == "function", Ko = (e) => typeof e == "boolean";
function tA(e) {
  const t = +e;
  return Number.isInteger(t) && String(t) === e;
}
var Gt = (e) => e.copy_ || e.base_, kl = (e) => e.modified_ ? e.copy_ : e.base_;
function ku(e, t) {
  if (Ja(e))
    return new Map(e);
  if (eo(e))
    return new Set(e);
  if (Qa(e))
    return Array[Xa].slice.call(e);
  const r = Op(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = it.getOwnPropertyDescriptors(e);
    delete n[We];
    let i = Reflect.ownKeys(n);
    for (let a = 0; a < i.length; a++) {
      const o = i[a], u = n[o];
      u[Gi] === !1 && (u[Gi] = !0, u[Iu] = !0), (u.get || u.set) && (n[o] = {
        [Iu]: !0,
        [Gi]: !0,
        // could live with !!desc.set as well here...
        [oa]: u[oa],
        [Zn]: e[o]
      });
    }
    return it.create(vn(e), n);
  } else {
    const n = vn(e);
    if (n !== null && r)
      return { ...e };
    const i = it.create(n);
    return it.assign(i, e);
  }
}
function jl(e, t = !1) {
  return to(e) || rr(e) || !pt(e) || (si(e) > 1 && it.defineProperties(e, {
    set: Ei,
    add: Ei,
    clear: Ei,
    delete: Ei
  }), it.freeze(e), t && Za(
    e,
    (r, n) => {
      jl(n, !0);
    },
    !1
  )), e;
}
function rA() {
  St(2);
}
var Ei = {
  [Zn]: rA
};
function to(e) {
  return e === null || !_l(e) ? !0 : it.isFrozen(e);
}
var la = "MapSet", ju = "Patches", Ps = "ArrayMethods", Pp = {};
function Br(e) {
  const t = Pp[e];
  return t || St(0, e), t;
}
var Ss = (e) => !!Pp[e], Qn, Sp = () => Qn, nA = (e, t) => ({
  drafts_: [],
  parent_: e,
  immer_: t,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: !0,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: Ss(la) ? Br(la) : void 0,
  arrayMethodsPlugin_: Ss(Ps) ? Br(Ps) : void 0
});
function Is(e, t) {
  t && (e.patchPlugin_ = Br(ju), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function Cu(e) {
  Eu(e), e.drafts_.forEach(iA), e.drafts_ = null;
}
function Eu(e) {
  e === Qn && (Qn = e.parent_);
}
var _s = (e) => Qn = nA(Qn, e);
function iA(e) {
  const t = e[We];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function ks(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  if (e !== void 0 && e !== r) {
    r[We].modified_ && (Cu(t), St(4)), pt(e) && (e = js(t, e));
    const { patchPlugin_: i } = t;
    i && i.generateReplacementPatches_(
      r[We].base_,
      e,
      t
    );
  } else
    e = js(t, r);
  return aA(t, e, !0), Cu(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Ap ? e : void 0;
}
function js(e, t) {
  if (to(t))
    return t;
  const r = t[We];
  if (!r)
    return ca(t, e.handledSet_, e);
  if (!ro(r, e))
    return t;
  if (!r.modified_)
    return r.base_;
  if (!r.finalized_) {
    const { callbacks_: n } = r;
    if (n)
      for (; n.length > 0; )
        n.pop()(e);
    kp(r, e);
  }
  return r.copy_;
}
function aA(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && jl(t, r);
}
function Ip(e) {
  e.finalized_ = !0, e.scope_.unfinalizedDrafts_--;
}
var ro = (e, t) => e.scope_ === t, oA = [];
function _p(e, t, r, n) {
  const i = Gt(e), a = e.type_;
  if (n !== void 0 && _u(i, n, a) === t) {
    ua(i, n, r, a);
    return;
  }
  if (!e.draftLocations_) {
    const u = e.draftLocations_ = /* @__PURE__ */ new Map();
    Za(i, (l, c) => {
      if (rr(c)) {
        const s = u.get(c) || [];
        s.push(l), u.set(c, s);
      }
    });
  }
  const o = e.draftLocations_.get(t) ?? oA;
  for (const u of o)
    ua(i, u, r, a);
}
function uA(e, t, r) {
  e.callbacks_.push(function(i) {
    const a = t;
    if (!a || !ro(a, i))
      return;
    i.mapSetPlugin_?.fixSetContents(a);
    const o = kl(a);
    _p(e, a.draft_ ?? a, o, r), kp(a, i);
  });
}
function kp(e, t) {
  if (e.modified_ && !e.finalized_ && (e.type_ === 3 || e.type_ === 1 && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
    const { patchPlugin_: n } = t;
    if (n) {
      const i = n.getPath(e);
      i && n.generatePatches_(e, i, t);
    }
    Ip(e);
  }
}
function lA(e, t, r) {
  const { scope_: n } = e;
  if (rr(r)) {
    const i = r[We];
    ro(i, n) && i.callbacks_.push(function() {
      Vi(e);
      const o = kl(i);
      _p(e, r, o, t);
    });
  } else pt(r) && e.callbacks_.push(function() {
    const a = Gt(e);
    e.type_ === 3 ? a.has(r) && ca(r, n.handledSet_, n) : _u(a, t, e.type_) === r && n.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && ca(
      _u(e.copy_, t, e.type_),
      n.handledSet_,
      n
    );
  });
}
function ca(e, t, r) {
  return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || rr(e) || t.has(e) || !pt(e) || to(e) || (t.add(e), Za(e, (n, i) => {
    if (rr(i)) {
      const a = i[We];
      if (ro(a, r)) {
        const o = kl(a);
        ua(e, n, o, e.type_), Ip(a);
      }
    } else pt(i) && ca(i, t, r);
  })), e;
}
function cA(e, t) {
  const r = Qa(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : Sp(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: t,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let i = n, a = sa;
  r && (i = [n], a = Jn);
  const { revoke: o, proxy: u } = Proxy.revocable(i, a);
  return n.draft_ = u, n.revoke_ = o, [u, n];
}
var sa = {
  get(e, t) {
    if (t === We)
      return e;
    let r = e.scope_.arrayMethodsPlugin_;
    const n = e.type_ === 1 && typeof t == "string";
    if (n && r?.isArrayOperationMethod(t))
      return r.createMethodInterceptor(e, t);
    const i = Gt(e);
    if (!Fo(i, t, e.type_))
      return fA(e, i, t);
    const a = i[t];
    if (e.finalized_ || !pt(a) || n && e.operationMethod && r?.isMutatingArrayMethod(
      e.operationMethod
    ) && tA(t))
      return a;
    if (a === Uo(e.base_, t) || sA(e, t, a)) {
      Vi(e);
      const o = e.type_ === 1 ? +t : t, u = Mu(e.scope_, a, e, o);
      return e.copy_[o] = u;
    }
    return a;
  },
  has(e, t) {
    return t in Gt(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(Gt(e));
  },
  set(e, t, r) {
    const n = jp(Gt(e), t);
    if (n?.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const i = Uo(Gt(e), t), a = i?.[We];
      if (a && a.base_ === r)
        return e.copy_[t] = r, e.assigned_.delete(t), !0;
      if (eA(r, i) && (r !== void 0 || Fo(e.base_, t, e.type_)))
        return !0;
      Vi(e), Tu(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || Fo(e.copy_, t, e.type_)) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_.set(t, !0), lA(e, t, r)), !0;
  },
  deleteProperty(e, t) {
    return Vi(e), Uo(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_.set(t, !1), Tu(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = Gt(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      [Gi]: !0,
      [Iu]: e.type_ !== 1 || t !== "length",
      [oa]: n[oa],
      [Zn]: r[t]
    };
  },
  defineProperty() {
    St(11);
  },
  getPrototypeOf(e) {
    return vn(e.base_);
  },
  setPrototypeOf() {
    St(12);
  }
}, Jn = {};
for (let e in sa) {
  let t = sa[e];
  Jn[e] = function() {
    const r = arguments;
    return r[0] = r[0][0], t.apply(this, r);
  };
}
Jn.deleteProperty = function(e, t) {
  return Jn.set.call(this, e, t, void 0);
};
Jn.set = function(e, t, r) {
  return sa.set.call(this, e[0], t, r, e[0]);
};
function Uo(e, t) {
  const r = e[We];
  return (r ? Gt(r) : e)[t];
}
function sA(e, t, r) {
  return e.type_ !== 1 || !e.allIndicesReassigned_ || e.assigned_?.get(t) || !pt(r) || r[We] ? !1 : e.baseRefs_.has(r);
}
function fA(e, t, r) {
  const n = jp(t, r);
  return n ? Zn in n ? n[Zn] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(e.draft_)
  ) : void 0;
}
function jp(e, t) {
  if (!(t in e))
    return;
  let r = vn(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = vn(r);
  }
}
function Tu(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && Tu(e.parent_));
}
function Vi(e) {
  e.copy_ || (e.assigned_ = /* @__PURE__ */ new Map(), e.copy_ = ku(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var dA = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (t, r, n) => {
      if (on(t) && !on(r)) {
        const a = r;
        r = t;
        const o = this;
        return function(l = a, ...c) {
          return o.produce(l, (s) => r.call(this, s, ...c));
        };
      }
      on(r) || St(6), n !== void 0 && !on(n) && St(7);
      let i;
      if (pt(t)) {
        const a = _s(this), o = Mu(a, t, void 0);
        let u = !0;
        try {
          i = r(o), u = !1;
        } finally {
          u ? Cu(a) : Eu(a);
        }
        return Is(a, n), ks(i, a);
      } else if (!t || !_l(t)) {
        if (i = r(t), i === void 0 && (i = t), i === Ap && (i = void 0), this.autoFreeze_ && jl(i, !0), n) {
          const a = [], o = [];
          Br(ju).generateReplacementPatches_(t, i, {
            patches_: a,
            inversePatches_: o
          }), n(a, o);
        }
        return i;
      } else
        St(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (on(t))
        return (o, ...u) => this.produceWithPatches(o, (l) => t(l, ...u));
      let n, i;
      return [this.produce(t, r, (o, u) => {
        n = o, i = u;
      }), n, i];
    }, Ko(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze), Ko(e?.useStrictShallowCopy) && this.setUseStrictShallowCopy(e.useStrictShallowCopy), Ko(e?.useStrictIteration) && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    pt(e) || St(8), rr(e) && (e = dt(e));
    const t = _s(this), r = Mu(t, e, void 0);
    return r[We].isManual_ = !0, Eu(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[We];
    (!r || !r.isManual_) && St(9);
    const { scope_: n } = r;
    return Is(n, t), ks(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(e) {
    this.useStrictIteration_ = e;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(e, t) {
    let r;
    for (r = t.length - 1; r >= 0; r--) {
      const i = t[r];
      if (i.path.length === 0 && i.op === "replace") {
        e = i.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = Br(ju).applyPatches_;
    return rr(e) ? n(e, t) : this.produce(
      e,
      (i) => n(i, t)
    );
  }
};
function Mu(e, t, r, n) {
  const [i, a] = Ja(t) ? Br(la).proxyMap_(t, r) : eo(t) ? Br(la).proxySet_(t, r) : cA(t, r);
  return (r?.scope_ ?? Sp()).drafts_.push(i), a.callbacks_ = r?.callbacks_ ?? [], a.key_ = n, r && n !== void 0 ? uA(r, a, n) : a.callbacks_.push(function(l) {
    l.mapSetPlugin_?.fixSetContents(a);
    const { patchPlugin_: c } = l;
    a.modified_ && c && c.generatePatches_(a, [], l);
  }), i;
}
function dt(e) {
  return rr(e) || St(10, e), Cp(e);
}
function Cp(e) {
  if (!pt(e) || to(e))
    return e;
  const t = e[We];
  let r, n = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = ku(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = ku(e, !0);
  return Za(
    r,
    (i, a) => {
      ua(r, i, Cp(a));
    },
    n
  ), t && (t.finalized_ = !1), r;
}
var vA = globalThis.Iterator;
vA?.from;
var hA = new dA(), Ep = hA.produce, X = (e) => e;
function Tp(e) {
  return ({ dispatch: r, getState: n }) => (i) => (a) => typeof a == "function" ? a(r, n, e) : i(a);
}
var pA = Tp(), yA = Tp;
const mA = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? ia : ia.apply(null, arguments);
};
function ut(e, t) {
  function r(...n) {
    if (t) {
      let i = t(...n);
      if (!i) throw new Error(Je(0));
      return {
        type: e,
        payload: i.payload,
        ..."meta" in i && { meta: i.meta },
        ..."error" in i && { error: i.error }
      };
    }
    return {
      type: e,
      payload: n[0]
    };
  }
  return r.toString = () => `${e}`, r.type = e, r.match = (n) => wp(n) && n.type === e, r;
}
var Mp = class Kn extends Array {
  constructor(...t) {
    super(...t), Object.setPrototypeOf(this, Kn.prototype);
  }
  static get [Symbol.species]() {
    return Kn;
  }
  concat(...t) {
    return super.concat.apply(this, t);
  }
  prepend(...t) {
    return t.length === 1 && Array.isArray(t[0]) ? new Kn(...t[0].concat(this)) : new Kn(...t.concat(this));
  }
};
function Cs(e) {
  return pt(e) ? Ep(e, () => {
  }) : e;
}
function Ti(e, t, r) {
  return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t);
}
function gA(e) {
  return typeof e == "boolean";
}
const bA = () => function(t) {
  const { thunk: r = !0, immutableCheck: n = !0, serializableCheck: i = !0, actionCreatorCheck: a = !0 } = t ?? {};
  let o = new Mp();
  return r && (gA(r) ? o.push(pA) : o.push(yA(r.extraArgument))), o;
}, Dp = "RTK_autoBatch", oe = () => (e) => ({
  payload: e,
  meta: { [Dp]: !0 }
}), Es = (e) => (t) => {
  setTimeout(t, e);
}, xA = (e, t) => (r) => {
  let n = !1, i, a;
  const o = () => {
    n || (n = !0, cancelAnimationFrame(i), clearTimeout(a), r());
  };
  i = e(o), a = setTimeout(o, t);
}, $p = (e = { type: "raf" }) => (t) => (...r) => {
  const n = t(...r);
  let i = !0, a = !1, o = !1;
  const u = /* @__PURE__ */ new Set(), l = e.type === "tick" ? queueMicrotask : e.type === "raf" ? typeof window < "u" && window.requestAnimationFrame ? xA(window.requestAnimationFrame, 100) : Es(10) : e.type === "callback" ? e.queueNotification : Es(e.timeout), c = () => {
    o = !1, a && (a = !1, u.forEach((s) => s()));
  };
  return Object.assign({}, n, {
    subscribe(s) {
      const f = () => i && s(), d = n.subscribe(f);
      return u.add(s), () => {
        d(), u.delete(s);
      };
    },
    dispatch(s) {
      try {
        return i = !s?.meta?.[Dp], a = !i, a && (o || (o = !0, l(c))), n.dispatch(s);
      } finally {
        i = !0;
      }
    }
  });
}, wA = (e) => function(r) {
  const { autoBatch: n = !0 } = r ?? {};
  let i = new Mp(e);
  return n && i.push($p(typeof n == "object" ? n : void 0)), i;
};
function AA(e) {
  const t = bA(), { reducer: r = void 0, middleware: n, devTools: i = !0, preloadedState: a = void 0, enhancers: o = void 0 } = e || {};
  let u;
  if (typeof r == "function") u = r;
  else if (Il(r)) u = xp(r);
  else throw new Error(Je(1));
  let l;
  typeof n == "function" ? l = n(t) : l = t();
  let c = ia;
  i && (c = mA({
    trace: !1,
    ...typeof i == "object" && i
  }));
  const s = Qw(...l), f = wA(s);
  let d = typeof o == "function" ? o(f) : f();
  const v = c(...d);
  return bp(u, a, v);
}
function Np(e) {
  const t = {}, r = [];
  let n;
  const i = {
    addCase(a, o) {
      const u = typeof a == "string" ? a : a.type;
      if (!u) throw new Error(Je(28));
      if (u in t) throw new Error(Je(29));
      return t[u] = o, i;
    },
    addAsyncThunk(a, o) {
      return o.pending && (t[a.pending.type] = o.pending), o.rejected && (t[a.rejected.type] = o.rejected), o.fulfilled && (t[a.fulfilled.type] = o.fulfilled), o.settled && r.push({
        matcher: a.settled,
        reducer: o.settled
      }), i;
    },
    addMatcher(a, o) {
      return r.push({
        matcher: a,
        reducer: o
      }), i;
    },
    addDefaultCase(a) {
      return n = a, i;
    }
  };
  return e(i), [
    t,
    r,
    n
  ];
}
function OA(e) {
  return typeof e == "function";
}
function PA(e, t) {
  let [r, n, i] = Np(t), a;
  if (OA(e)) a = () => Cs(e());
  else {
    const u = Cs(e);
    a = () => u;
  }
  function o(u = a(), l) {
    let c = [r[l.type], ...n.filter(({ matcher: s }) => s(l)).map(({ reducer: s }) => s)];
    return c.filter((s) => !!s).length === 0 && (c = [i]), c.reduce((s, f) => {
      if (f)
        if (rr(s)) {
          const d = f(s, l);
          return d === void 0 ? s : d;
        } else {
          if (pt(s))
            return Ep(s, (d) => f(d, l));
          {
            const d = f(s, l);
            if (d === void 0) {
              if (s === null) return s;
              throw new Error(Je(9));
            }
            return d;
          }
        }
      return s;
    }, u);
  }
  return o.getInitialState = a, o;
}
let SA = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", IA = (e = 21) => {
  let t = "", r = e;
  for (; r--; ) t += SA[Math.random() * 64 | 0];
  return t;
};
const _A = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function kA(e, t) {
  return `${e}/${t}`;
}
function jA({ creators: e } = {}) {
  const t = e?.asyncThunk?.[_A];
  return function(n) {
    const { name: i, reducerPath: a = i } = n;
    if (!i) throw new Error(Je(11));
    const o = (typeof n.reducers == "function" ? n.reducers(EA()) : n.reducers) || {}, u = Object.keys(o), l = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, c = {
      addCase(g, A) {
        const O = typeof g == "string" ? g : g.type;
        if (!O) throw new Error(Je(12));
        if (O in l.sliceCaseReducersByType) throw new Error(Je(13));
        return l.sliceCaseReducersByType[O] = A, c;
      },
      addMatcher(g, A) {
        return l.sliceMatchers.push({
          matcher: g,
          reducer: A
        }), c;
      },
      exposeAction(g, A) {
        return l.actionCreators[g] = A, c;
      },
      exposeCaseReducer(g, A) {
        return l.sliceCaseReducersByName[g] = A, c;
      }
    };
    u.forEach((g) => {
      const A = o[g], O = {
        reducerName: g,
        type: kA(i, g),
        createNotation: typeof n.reducers == "function"
      };
      MA(A) ? $A(O, A, c, t) : TA(O, A, c);
    });
    function s() {
      const [g = {}, A = [], O = void 0] = typeof n.extraReducers == "function" ? Np(n.extraReducers) : [n.extraReducers], w = {
        ...g,
        ...l.sliceCaseReducersByType
      };
      return PA(n.initialState, (S) => {
        for (let _ in w) S.addCase(_, w[_]);
        for (let _ of l.sliceMatchers) S.addMatcher(_.matcher, _.reducer);
        for (let _ of A) S.addMatcher(_.matcher, _.reducer);
        O && S.addDefaultCase(O);
      });
    }
    const f = (g) => g, d = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new WeakMap();
    let h;
    function p(g, A) {
      return h || (h = s()), h(g, A);
    }
    function y() {
      return h || (h = s()), h.getInitialState();
    }
    function m(g, A = !1) {
      function O(S) {
        let _ = S[g];
        return typeof _ > "u" && A && (_ = Ti(v, O, y)), _;
      }
      function w(S = f) {
        return Ti(Ti(d, A, () => /* @__PURE__ */ new WeakMap()), S, () => {
          const _ = {};
          for (const [E, j] of Object.entries(n.selectors ?? {})) _[E] = CA(j, S, () => Ti(v, S, y), A);
          return _;
        });
      }
      return {
        reducerPath: g,
        getSelectors: w,
        get selectors() {
          return w(O);
        },
        selectSlice: O
      };
    }
    const b = {
      name: i,
      reducer: p,
      actions: l.actionCreators,
      caseReducers: l.sliceCaseReducersByName,
      getInitialState: y,
      ...m(a),
      injectInto(g, { reducerPath: A, ...O } = {}) {
        const w = A ?? a;
        return g.inject({
          reducerPath: w,
          reducer: p
        }, O), {
          ...b,
          ...m(w, !0)
        };
      }
    };
    return b;
  };
}
function CA(e, t, r, n) {
  function i(a, ...o) {
    let u = t(a);
    return typeof u > "u" && n && (u = r()), e(u, ...o);
  }
  return i.unwrapped = e, i;
}
const Ke = /* @__PURE__ */ jA();
function EA() {
  function e(t, r) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator: t,
      ...r
    };
  }
  return e.withTypes = () => e, {
    reducer(t) {
      return Object.assign({ [t.name](...r) {
        return t(...r);
      } }[t.name], { _reducerDefinitionType: "reducer" });
    },
    preparedReducer(t, r) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare: t,
        reducer: r
      };
    },
    asyncThunk: e
  };
}
function TA({ type: e, reducerName: t, createNotation: r }, n, i) {
  let a, o;
  if ("reducer" in n) {
    if (r && !DA(n)) throw new Error(Je(17));
    a = n.reducer, o = n.prepare;
  } else a = n;
  i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? ut(e, o) : ut(e));
}
function MA(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function DA(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function $A({ type: e, reducerName: t }, r, n, i) {
  if (!i) throw new Error(Je(18));
  const { payloadCreator: a, fulfilled: o, pending: u, rejected: l, settled: c, options: s } = r, f = i(e, a, s);
  n.exposeAction(t, f), o && n.addCase(f.fulfilled, o), u && n.addCase(f.pending, u), l && n.addCase(f.rejected, l), c && n.addMatcher(f.settled, c), n.exposeCaseReducer(t, {
    fulfilled: o || Mi,
    pending: u || Mi,
    rejected: l || Mi,
    settled: c || Mi
  });
}
function Mi() {
}
const NA = "task", Lp = "listener", Rp = "completed", Cl = "cancelled", LA = `task-${Cl}`, RA = `task-${Rp}`, Du = `${Lp}-${Cl}`, zA = `${Lp}-${Rp}`;
var no = class {
  code;
  name = "TaskAbortError";
  message;
  constructor(e) {
    this.code = e, this.message = `${NA} ${Cl} (reason: ${e})`;
  }
};
const El = (e, t) => {
  if (typeof e != "function") throw new TypeError(Je(32));
}, fa = () => {
}, zp = (e, t = fa) => (e.catch(t), e), Bp = (e, t) => (e.addEventListener("abort", t, { once: !0 }), () => e.removeEventListener("abort", t)), $r = (e) => {
  if (e.aborted) throw new no(e.reason);
};
function Wp(e, t) {
  let r = fa;
  return new Promise((n, i) => {
    const a = () => i(new no(e.reason));
    if (e.aborted) {
      a();
      return;
    }
    r = Bp(e, a), t.finally(() => r()).then(n, i);
  }).finally(() => {
    r = fa;
  });
}
const BA = async (e, t) => {
  try {
    return await Promise.resolve(), {
      status: "ok",
      value: await e()
    };
  } catch (r) {
    return {
      status: r instanceof no ? "cancelled" : "rejected",
      error: r
    };
  } finally {
    t?.();
  }
}, da = (e) => (t) => zp(Wp(e, t).then((r) => ($r(e), r))), Fp = (e) => {
  const t = da(e);
  return (r) => t(new Promise((n) => setTimeout(n, r)));
}, { assign: cn } = Object, Ts = {}, io = "listenerMiddleware", WA = (e, t) => {
  const r = (n) => Bp(e, () => n.abort(e.reason));
  return (n, i) => {
    El(n);
    const a = new AbortController();
    r(a);
    const o = BA(async () => {
      $r(e), $r(a.signal);
      const u = await n({
        pause: da(a.signal),
        delay: Fp(a.signal),
        signal: a.signal
      });
      return $r(a.signal), u;
    }, () => a.abort(RA));
    return i?.autoJoin && t.push(o.catch(fa)), {
      result: da(e)(o),
      cancel() {
        a.abort(LA);
      }
    };
  };
}, FA = (e, t) => {
  const r = async (n, i) => {
    $r(t);
    let a = () => {
    };
    const o = [new Promise((u, l) => {
      let c = e({
        predicate: n,
        effect: (s, f) => {
          f.unsubscribe(), u([
            s,
            f.getState(),
            f.getOriginalState()
          ]);
        }
      });
      a = () => {
        c(), l();
      };
    })];
    i != null && o.push(new Promise((u) => setTimeout(u, i, null)));
    try {
      const u = await Wp(t, Promise.race(o));
      return $r(t), u;
    } finally {
      a();
    }
  };
  return ((n, i) => zp(r(n, i)));
}, Kp = (e) => {
  let { type: t, actionCreator: r, matcher: n, predicate: i, effect: a } = e;
  if (t) i = ut(t).match;
  else if (r)
    t = r.type, i = r.match;
  else if (n) i = n;
  else if (!i) throw new Error(Je(21));
  return El(a), {
    predicate: i,
    type: t,
    effect: a
  };
}, Up = /* @__PURE__ */ cn((e) => {
  const { type: t, predicate: r, effect: n } = Kp(e);
  return {
    id: IA(),
    effect: n,
    type: t,
    predicate: r,
    pending: /* @__PURE__ */ new Set(),
    unsubscribe: () => {
      throw new Error(Je(22));
    }
  };
}, { withTypes: () => Up }), Ms = (e, t) => {
  const { type: r, effect: n, predicate: i } = Kp(t);
  return Array.from(e.values()).find((a) => (typeof r == "string" ? a.type === r : a.predicate === i) && a.effect === n);
}, $u = (e) => {
  e.pending.forEach((t) => {
    t.abort(Du);
  });
}, KA = (e, t) => () => {
  for (const r of t.keys()) $u(r);
  e.clear();
}, Ds = (e, t, r) => {
  try {
    e(t, r);
  } catch (n) {
    setTimeout(() => {
      throw n;
    }, 0);
  }
}, Hp = /* @__PURE__ */ cn(/* @__PURE__ */ ut(`${io}/add`), { withTypes: () => Hp }), UA = /* @__PURE__ */ ut(`${io}/removeAll`), Yp = /* @__PURE__ */ cn(/* @__PURE__ */ ut(`${io}/remove`), { withTypes: () => Yp }), HA = (...e) => {
  console.error(`${io}/error`, ...e);
}, fi = (e = {}) => {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), n = (v) => {
    const h = r.get(v) ?? 0;
    r.set(v, h + 1);
  }, i = (v) => {
    const h = r.get(v) ?? 1;
    h === 1 ? r.delete(v) : r.set(v, h - 1);
  }, { extra: a, onError: o = HA } = e;
  El(o);
  const u = (v) => (v.unsubscribe = () => t.delete(v.id), t.set(v.id, v), (h) => {
    v.unsubscribe(), h?.cancelActive && $u(v);
  }), l = ((v) => {
    const h = Ms(t, v) ?? Up(v);
    return u(h);
  });
  cn(l, { withTypes: () => l });
  const c = (v) => {
    const h = Ms(t, v);
    return h && (h.unsubscribe(), v.cancelActive && $u(h)), !!h;
  };
  cn(c, { withTypes: () => c });
  const s = async (v, h, p, y) => {
    const m = new AbortController(), b = FA(l, m.signal), g = [];
    try {
      v.pending.add(m), n(v), await Promise.resolve(v.effect(h, cn({}, p, {
        getOriginalState: y,
        condition: (A, O) => b(A, O).then(Boolean),
        take: b,
        delay: Fp(m.signal),
        pause: da(m.signal),
        extra: a,
        signal: m.signal,
        fork: WA(m.signal, g),
        unsubscribe: v.unsubscribe,
        subscribe: () => {
          t.set(v.id, v);
        },
        cancelActiveListeners: () => {
          v.pending.forEach((A, O, w) => {
            A !== m && (A.abort(Du), w.delete(A));
          });
        },
        cancel: () => {
          m.abort(Du), v.pending.delete(m);
        },
        throwIfCancelled: () => {
          $r(m.signal);
        }
      })));
    } catch (A) {
      A instanceof no || Ds(o, A, { raisedBy: "effect" });
    } finally {
      await Promise.all(g), m.abort(zA), i(v), v.pending.delete(m);
    }
  }, f = KA(t, r);
  return {
    middleware: (v) => (h) => (p) => {
      if (!wp(p)) return h(p);
      if (Hp.match(p)) return l(p.payload);
      if (UA.match(p)) {
        f();
        return;
      }
      if (Yp.match(p)) return c(p.payload);
      let y = v.getState();
      const m = () => {
        if (y === Ts) throw new Error(Je(23));
        return y;
      };
      let b;
      try {
        if (b = h(p), t.size > 0) {
          const g = v.getState(), A = Array.from(t.values());
          for (const O of A) {
            let w = !1;
            try {
              w = O.predicate(p, g, y);
            } catch (S) {
              w = !1, Ds(o, S, { raisedBy: "predicate" });
            }
            w && s(O, p, v, m);
          }
        }
      } finally {
        y = Ts;
      }
      return b;
    },
    startListening: l,
    stopListening: c,
    clearListeners: f
  };
};
function Je(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var YA = {
  layoutType: "horizontal",
  width: 0,
  height: 0,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  scale: 1
}, qp = Ke({
  name: "chartLayout",
  initialState: YA,
  reducers: {
    setLayout(e, t) {
      e.layoutType = t.payload;
    },
    setChartSize(e, t) {
      e.width = t.payload.width, e.height = t.payload.height;
    },
    setMargin(e, t) {
      var r, n, i, a;
      e.margin.top = (r = t.payload.top) !== null && r !== void 0 ? r : 0, e.margin.right = (n = t.payload.right) !== null && n !== void 0 ? n : 0, e.margin.bottom = (i = t.payload.bottom) !== null && i !== void 0 ? i : 0, e.margin.left = (a = t.payload.left) !== null && a !== void 0 ? a : 0;
    },
    setScale(e, t) {
      e.scale = t.payload;
    }
  }
}), ao = qp.actions, qA = ao.setMargin, GA = ao.setLayout, VA = ao.setChartSize, XA = ao.setScale, ZA = qp.reducer;
function Gp(e, t, r) {
  return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e;
}
function V(e) {
  return Number.isFinite(e);
}
function Kt(e) {
  return typeof e == "number" && e > 0 && Number.isFinite(e);
}
function $s(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ve(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $s(Object(r), !0).forEach(function(n) {
      QA(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $s(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function QA(e, t, r) {
  return (t = JA(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function JA(e) {
  var t = e1(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function e1(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function he(e, t, r) {
  return se(e) || se(t) ? r : Ft(t) ? tr(e, t, r) : typeof t == "function" ? t(e) : r;
}
var t1 = (e, t, r) => {
  if (t && r) {
    var n = r.width, i = r.height, a = t.align, o = t.verticalAlign, u = t.layout, l = t.position, c = t.offset, s = c === void 0 ? 0 : c;
    if (l != null) {
      if (pl(l)) {
        if (l === "top" && T(e.top))
          return Ve(Ve({}, e), {}, {
            top: e.top + (i || 0) + s
          });
        if (l === "bottom" && T(e.bottom))
          return Ve(Ve({}, e), {}, {
            bottom: e.bottom + (i || 0) + s
          });
        if (l === "left" && T(e.left))
          return Ve(Ve({}, e), {}, {
            left: e.left + (n || 0) + s
          });
        if (l === "right" && T(e.right))
          return Ve(Ve({}, e), {}, {
            right: e.right + (n || 0) + s
          });
      }
      return e;
    }
    if ((u === "vertical" || u === "horizontal" && o === "middle") && a !== "center" && T(e[a]))
      return Ve(Ve({}, e), {}, {
        [a]: e[a] + (n || 0)
      });
    if ((u === "horizontal" || u === "vertical" && a === "center") && o !== "middle" && T(e[o]))
      return Ve(Ve({}, e), {}, {
        [o]: e[o] + (i || 0)
      });
  }
  return e;
}, or = (e, t) => e === "horizontal" && t === "xAxis" || e === "vertical" && t === "yAxis" || e === "centric" && t === "angleAxis" || e === "radial" && t === "radiusAxis", Vp = (e, t, r, n) => {
  if (n)
    return e.map((u) => u.coordinate);
  var i, a, o = e.map((u) => (u.coordinate === t && (i = !0), u.coordinate === r && (a = !0), u.coordinate));
  return i || o.push(t), a || o.push(r), o;
}, Xp = (e, t, r) => {
  if (!e)
    return null;
  var n = e.duplicateDomain, i = e.type, a = e.range, o = e.scale, u = e.realScaleType, l = e.isCategorical, c = e.categoricalDomain, s = e.tickCount, f = e.ticks, d = e.niceTicks, v = e.axisType;
  if (!o)
    return null;
  var h = u === "scaleBand" && o.bandwidth ? o.bandwidth() / 2 : 2, p = i === "category" && o.bandwidth ? o.bandwidth() / h : 0;
  if (p = v === "angleAxis" && a && a.length >= 2 ? Xe(a[0] - a[1]) * 2 * p : p, f || d) {
    var y = (f || d || []).map((m, b) => {
      var g = n ? n.indexOf(m) : m, A = o.map(g);
      return V(A) ? {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: A + p,
        value: m,
        offset: p,
        index: b
      } : null;
    }).filter(Ze);
    return y;
  }
  return l && c ? c.map((m, b) => {
    var g = o.map(m);
    return V(g) ? {
      coordinate: g + p,
      value: m,
      index: b,
      offset: p
    } : null;
  }).filter(Ze) : o.ticks && s != null ? o.ticks(s).map((m, b) => {
    var g = o.map(m);
    return V(g) ? {
      coordinate: g + p,
      value: m,
      index: b,
      offset: p
    } : null;
  }).filter(Ze) : o.domain().map((m, b) => {
    var g = o.map(m);
    return V(g) ? {
      coordinate: g + p,
      // @ts-expect-error can't use Date as an index
      value: n ? n[m] : m,
      index: b,
      offset: p
    } : null;
  }).filter(Ze);
}, r1 = (e, t) => {
  if (!t || t.length !== 2 || !T(t[0]) || !T(t[1]))
    return e;
  var r = Math.min(t[0], t[1]), n = Math.max(t[0], t[1]), i = [e[0], e[1]];
  return (!T(e[0]) || e[0] < r) && (i[0] = r), (!T(e[1]) || e[1] > n) && (i[1] = n), i[0] > n && (i[0] = n), i[1] < r && (i[1] = r), i;
}, n1 = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var i = 0; i < n; ++i)
        for (var a = 0, o = 0, u = 0; u < r; ++u) {
          var l = e[u], c = l?.[i];
          if (c != null) {
            var s = c[1], f = c[0], d = Wt(s) ? f : s;
            d >= 0 ? (c[0] = a, a += d, c[1] = a) : (c[0] = o, o += d, c[1] = o);
          }
        }
  }
}, i1 = (e) => {
  var t, r = e.length;
  if (!(r <= 0)) {
    var n = (t = e[0]) === null || t === void 0 ? void 0 : t.length;
    if (!(n == null || n <= 0))
      for (var i = 0; i < n; ++i)
        for (var a = 0, o = 0; o < r; ++o) {
          var u = e[o], l = u?.[i];
          if (l != null) {
            var c = Wt(l[1]) ? l[0] : l[1];
            c >= 0 ? (l[0] = a, a += c, l[1] = a) : (l[0] = 0, l[1] = 0);
          }
        }
  }
}, a1 = {
  sign: n1,
  // @ts-expect-error definitelytyped types are incorrect
  expand: bx,
  // @ts-expect-error definitelytyped types are incorrect
  none: zr,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: xx,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: wx,
  positive: i1
}, o1 = (e, t, r) => {
  var n, i = (n = a1[r]) !== null && n !== void 0 ? n : zr, a = gx().keys(t).value((u, l) => Number(he(u, l, 0))).order(xu).offset(i), o = a(e);
  return o.forEach((u, l) => {
    u.forEach((c, s) => {
      var f = he(e[s], t[l], 0);
      Array.isArray(f) && f.length === 2 && T(f[0]) && T(f[1]) && (c[0] = f[0], c[1] = f[1]);
    });
  }), o;
};
function u1(e) {
  return e == null ? void 0 : String(e);
}
function Ns(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, i = e.entry, a = e.index, o = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !se(i[t.dataKey])) {
      var u = xh(r, "value", i[t.dataKey]);
      if (u)
        return u.coordinate + n / 2;
    }
    return r != null && r[a] ? r[a].coordinate + n / 2 : null;
  }
  var l = he(i, se(o) ? t.dataKey : o), c = t.scale.map(l);
  return T(c) ? c : null;
}
var Ls = (e) => {
  var t = e.axis, r = e.ticks, n = e.offset, i = e.bandSize, a = e.entry, o = e.index;
  if (t.type === "category")
    return r[o] ? r[o].coordinate + n : null;
  var u = he(a, t.dataKey, t.scale.domain()[o]);
  if (se(u))
    return null;
  var l = t.scale.map(u);
  return T(l) ? l - i / 2 + n : null;
}, l1 = (e) => {
  var t = e.numericAxis, r = t.scale.domain();
  if (t.type === "number") {
    var n = Math.min(r[0], r[1]), i = Math.max(r[0], r[1]);
    return n <= 0 && i >= 0 ? 0 : i < 0 ? i : n;
  }
  return r[0];
}, c1 = (e) => {
  var t = e.flat(2).filter(T);
  return [Math.min(...t), Math.max(...t)];
}, s1 = (e) => [e[0] === 1 / 0 ? 0 : e[0], e[1] === -1 / 0 ? 0 : e[1]], f1 = (e, t, r) => {
  if (!(e == null || Object.keys(e).length === 0))
    return s1(Object.keys(e).reduce((n, i) => {
      var a = e[i];
      if (!a)
        return n;
      var o = a.stackedData, u = o.reduce((l, c) => {
        var s = Gp(c, t, r), f = c1(s);
        return !V(f[0]) || !V(f[1]) ? l : [Math.min(l[0], f[0]), Math.max(l[1], f[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(u[0], n[0]), Math.max(u[1], n[1])];
    }, [1 / 0, -1 / 0]));
}, Rs = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, zs = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, hn = (e, t, r) => {
  if (e && e.scale && e.scale.bandwidth) {
    var n = e.scale.bandwidth();
    if (!r || n > 0)
      return n;
  }
  if (e && t && t.length >= 2) {
    for (var i = Va(t, (p) => p.coordinate), a = [], o = 0, u = 1, l = i.length; u < l; u++) {
      var c, s, f = (((c = i[u]) === null || c === void 0 ? void 0 : c.coordinate) || 0) - (((s = i[u - 1]) === null || s === void 0 ? void 0 : s.coordinate) || 0);
      a.push(f), o = Math.max(f, o);
    }
    var d = o * 1e-4, v = 1 / 0;
    for (var h of a)
      h > d && (v = Math.min(h, v));
    return v === 1 / 0 ? 0 : v;
  }
  return r ? void 0 : 0;
};
function Bs(e) {
  var t = e.tooltipEntrySettings, r = e.dataKey, n = e.payload, i = e.value, a = e.name;
  return Ve(Ve({}, t), {}, {
    dataKey: r,
    payload: n,
    value: i,
    name: a
  });
}
function oo(e, t) {
  if (e != null)
    return String(e);
  if (typeof t == "string")
    return t;
}
var d1 = (e, t) => {
  if (t === "horizontal")
    return e.relativeX;
  if (t === "vertical")
    return e.relativeY;
}, v1 = (e, t) => t === "centric" ? e.angle : e.radius, Ht = (e) => e.layout.width, Yt = (e) => e.layout.height, h1 = (e) => e.layout.scale, Tl = (e) => e.layout.margin, uo = P((e) => e.cartesianAxis.xAxis, (e) => Object.values(e)), lo = P((e) => e.cartesianAxis.yAxis, (e) => Object.values(e)), p1 = "data-recharts-item-index", y1 = "data-recharts-item-id", di = 60, Ml = 30;
function Ws(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Di(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ws(Object(r), !0).forEach(function(n) {
      m1(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ws(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function m1(e, t, r) {
  return (t = g1(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function g1(e) {
  var t = b1(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function b1(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var x1 = (e) => e.brush.height;
function w1(e) {
  var t = lo(e);
  return t.reduce((r, n) => {
    if (n.orientation === "left" && !n.mirror && !n.hide) {
      var i = typeof n.width == "number" ? n.width : di;
      return r + i;
    }
    return r;
  }, 0);
}
function A1(e) {
  var t = lo(e);
  return t.reduce((r, n) => {
    if (n.orientation === "right" && !n.mirror && !n.hide) {
      var i = typeof n.width == "number" ? n.width : di;
      return r + i;
    }
    return r;
  }, 0);
}
function O1(e) {
  var t = uo(e);
  return t.reduce((r, n) => {
    if (n.orientation === "top" && !n.mirror && !n.hide) {
      var i = typeof n.height == "number" ? n.height : Ml;
      return r + i;
    }
    return r;
  }, 0);
}
function P1(e) {
  var t = uo(e);
  return t.reduce((r, n) => {
    if (n.orientation === "bottom" && !n.mirror && !n.hide) {
      var i = typeof n.height == "number" ? n.height : Ml;
      return r + i;
    }
    return r;
  }, 0);
}
var Ce = P([Ht, Yt, Tl, x1, w1, A1, O1, P1, mp, Bw], (e, t, r, n, i, a, o, u, l, c) => {
  var s = {
    left: (r.left || 0) + i,
    right: (r.right || 0) + a
  }, f = {
    top: (r.top || 0) + o,
    bottom: (r.bottom || 0) + u
  }, d = Di(Di({}, f), s), v = d.bottom;
  d.bottom += n, d = t1(d, l, c);
  var h = e - d.left - d.right, p = t - d.top - d.bottom;
  return Di(Di({
    brushBottom: v
  }, d), {}, {
    // never return negative values for height and width
    width: Math.max(h, 0),
    height: Math.max(p, 0)
  });
}), Zp = P(Ce, (e) => ({
  x: e.left,
  y: e.top,
  width: e.width,
  height: e.height
})), Dl = P(Ht, Yt, (e, t) => ({
  x: 0,
  y: 0,
  width: e,
  height: t
})), S1 = /* @__PURE__ */ ge(null), Ue = () => Ge(S1) != null, co = (e) => e.brush, so = P([co, Ce, Tl], (e, t, r) => ({
  height: e.height,
  x: T(e.x) ? e.x : t.left,
  y: T(e.y) ? e.y : t.top + t.height + t.brushBottom - (r?.bottom || 0),
  width: T(e.width) ? e.width : t.width
}));
function I1(e, t, { signal: r, edges: n } = {}) {
  let i, a = null;
  const o = n != null && n.includes("leading"), u = n == null || n.includes("trailing"), l = () => {
    a !== null && (e.apply(i, a), i = void 0, a = null);
  }, c = () => {
    u && l(), v();
  };
  let s = null;
  const f = () => {
    s != null && clearTimeout(s), s = setTimeout(() => {
      s = null, c();
    }, t);
  }, d = () => {
    s !== null && (clearTimeout(s), s = null);
  }, v = () => {
    d(), i = void 0, a = null;
  }, h = () => {
    l();
  }, p = function(...y) {
    if (r?.aborted) return;
    i = this, a = y;
    const m = s == null;
    f(), o && m && l();
  };
  return p.schedule = f, p.cancel = v, p.flush = h, r?.addEventListener("abort", v, { once: !0 }), p;
}
function _1(e, t = 0, r = {}) {
  typeof r != "object" && (r = {});
  const { leading: n = !1, trailing: i = !0, maxWait: a } = r, o = Array(2);
  n && (o[0] = "leading"), i && (o[1] = "trailing");
  let u, l = null;
  const c = I1(function(...d) {
    u = e.apply(this, d), l = null;
  }, t, { edges: o }), s = function(...d) {
    return a != null && (l === null && (l = Date.now()), Date.now() - l >= a) ? ((n || i) && (u = e.apply(this, d)), l = Date.now(), c.cancel(), c.schedule(), u) : (c.apply(this, d), u);
  }, f = () => (c.flush(), u);
  return s.cancel = c.cancel, s.flush = f, s;
}
function k1(e, t = 0, r = {}) {
  const { leading: n = !0, trailing: i = !0 } = r;
  return _1(e, t, {
    leading: n,
    maxWait: t,
    trailing: i
  });
}
var va = function(t, r) {
  for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
    i[a - 2] = arguments[a];
  if (typeof console < "u" && console.warn && (r === void 0 && console.warn("LogUtils requires an error message argument"), !t))
    if (r === void 0)
      console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    else {
      var o = 0;
      console.warn(r.replace(/%s/g, () => i[o++]));
    }
}, Lt = {
  width: "100%",
  height: "100%",
  debounce: 0,
  minWidth: 0,
  initialDimension: {
    width: -1,
    height: -1
  }
}, Qp = (e, t, r) => {
  var n = r.width, i = n === void 0 ? Lt.width : n, a = r.height, o = a === void 0 ? Lt.height : a, u = r.aspect, l = r.maxHeight, c = Rr(i) ? e : Number(i), s = Rr(o) ? t : Number(o);
  return u && u > 0 && (c ? s = c / u : s && (c = s * u), l && s != null && s > l && (s = l)), {
    calculatedWidth: c,
    calculatedHeight: s
  };
}, j1 = {
  width: 0,
  height: 0,
  overflow: "visible"
}, C1 = {
  width: 0,
  overflowX: "visible"
}, E1 = {
  height: 0,
  overflowY: "visible"
}, T1 = {}, M1 = (e) => {
  var t = e.width, r = e.height, n = Rr(t), i = Rr(r);
  return n && i ? j1 : n ? C1 : i ? E1 : T1;
};
function D1(e) {
  var t = e.width, r = e.height, n = e.aspect, i = t, a = r;
  return i === void 0 && a === void 0 ? (i = Lt.width, a = Lt.height) : i === void 0 ? i = n && n > 0 ? void 0 : Lt.width : a === void 0 && (a = n && n > 0 ? void 0 : Lt.height), {
    width: i,
    height: a
  };
}
var $1 = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];
function ha() {
  return ha = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ha.apply(null, arguments);
}
function Fs(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ks(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fs(Object(r), !0).forEach(function(n) {
      N1(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fs(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function N1(e, t, r) {
  return (t = L1(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function L1(e) {
  var t = R1(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function R1(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function z1(e, t) {
  return K1(e) || F1(e, t) || W1(e, t) || B1();
}
function B1() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function W1(e, t) {
  if (e) {
    if (typeof e == "string") return Us(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Us(e, t) : void 0;
  }
}
function Us(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function F1(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function K1(e) {
  if (Array.isArray(e)) return e;
}
function U1(e, t) {
  if (e == null) return {};
  var r, n, i = H1(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function H1(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Jp = /* @__PURE__ */ ge(Lt.initialDimension);
function Y1(e) {
  return Kt(e.width) && Kt(e.height);
}
function ey(e) {
  var t = e.children, r = e.width, n = e.height, i = ht(() => ({
    width: r,
    height: n
  }), [r, n]);
  return Y1(i) ? /* @__PURE__ */ x(Jp.Provider, {
    value: i
  }, t) : null;
}
var $l = () => Ge(Jp), q1 = /* @__PURE__ */ we((e, t) => {
  var r = e.aspect, n = e.initialDimension, i = n === void 0 ? Lt.initialDimension : n, a = e.width, o = e.height, u = e.minWidth, l = u === void 0 ? Lt.minWidth : u, c = e.minHeight, s = e.maxHeight, f = e.children, d = e.debounce, v = d === void 0 ? Lt.debounce : d, h = e.id, p = e.className, y = e.onResize, m = e.style, b = m === void 0 ? {} : m, g = U1(e, $1), A = Y(null), O = Y();
  O.current = y, ll(t, () => A.current);
  var w = Se({
    containerWidth: i.width,
    containerHeight: i.height
  }), S = z1(w, 2), _ = S[0], E = S[1], j = Q((W, F) => {
    E((z) => {
      var q = Math.round(W), U = Math.round(F);
      return z.containerWidth === q && z.containerHeight === U ? z : {
        containerWidth: q,
        containerHeight: U
      };
    });
  }, []);
  ce(() => {
    if (A.current == null || typeof ResizeObserver > "u")
      return Hr;
    var W = (pe) => {
      var ye, fe = pe[0];
      if (fe != null) {
        var Ye = fe.contentRect, tt = Ye.width, At = Ye.height;
        j(tt, At), (ye = O.current) === null || ye === void 0 || ye.call(O, tt, At);
      }
    };
    v > 0 && (W = k1(W, v, {
      trailing: !0,
      leading: !1
    }));
    var F = new ResizeObserver(W), z = A.current.getBoundingClientRect(), q = z.width, U = z.height;
    return j(q, U), F.observe(A.current), () => {
      F.disconnect();
    };
  }, [j, v]);
  var k = _.containerWidth, I = _.containerHeight;
  va(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
  var R = Qp(k, I, {
    width: a,
    height: o,
    aspect: r,
    maxHeight: s
  }), N = R.calculatedWidth, L = R.calculatedHeight;
  return va(k < 0 || I < 0 || N != null && N > 0 || L != null && L > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, N, L, a, o, l, c, r), /* @__PURE__ */ x("div", ha({
    id: h ? "".concat(h) : void 0,
    className: re("recharts-responsive-container", p),
    style: Ks(Ks({}, b), {}, {
      width: a,
      height: o,
      minWidth: l,
      minHeight: c,
      maxHeight: s
    }),
    ref: A
  }, g), /* @__PURE__ */ x("div", {
    style: M1({
      width: a,
      height: o
    })
  }, /* @__PURE__ */ x(ey, {
    width: N,
    height: L
  }, f)));
}), G1 = /* @__PURE__ */ we((e, t) => {
  var r = $l();
  if (Kt(r.width) && Kt(r.height))
    return e.children;
  var n = D1({
    width: e.width,
    height: e.height,
    aspect: e.aspect
  }), i = n.width, a = n.height, o = Qp(void 0, void 0, {
    width: i,
    height: a,
    aspect: e.aspect,
    maxHeight: e.maxHeight
  }), u = o.calculatedWidth, l = o.calculatedHeight;
  return T(u) && T(l) ? /* @__PURE__ */ x(ey, {
    width: u,
    height: l
  }, e.children) : /* @__PURE__ */ x(q1, ha({}, e, {
    width: i,
    height: a,
    ref: t
  }));
}), fo = () => {
  var e, t = Ue(), r = $(Zp), n = $(so), i = (e = $(co)) === null || e === void 0 ? void 0 : e.padding;
  return !t || !n || !i ? r : {
    width: n.width - i.left - i.right,
    height: n.height - i.top - i.bottom,
    x: i.left,
    y: i.top
  };
}, V1 = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
}, ty = () => {
  var e;
  return (e = $(Ce)) !== null && e !== void 0 ? e : V1;
}, Nl = () => $(Ht), Ll = () => $(Yt), X1 = () => $((e) => e.layout.margin), J = (e) => e.layout.layoutType, Yr = () => $(J), ry = () => {
  var e = Yr();
  if (e === "horizontal" || e === "vertical")
    return e;
}, ny = (e) => {
  var t = e.layout.layoutType;
  if (t === "centric" || t === "radial")
    return t;
}, Z1 = () => {
  var e = Yr();
  return e !== void 0;
}, vi = (e) => {
  var t = ae(), r = Ue(), n = e.width, i = e.height, a = $l(), o = n, u = i;
  return a && (o = a.width > 0 ? a.width : n, u = a.height > 0 ? a.height : i), ce(() => {
    !r && Kt(o) && Kt(u) && t(VA({
      width: o,
      height: u
    }));
  }, [t, r, o, u]), null;
}, Q1 = {
  settings: {
    layout: "horizontal",
    align: "center",
    verticalAlign: "bottom",
    itemSorter: "value",
    position: void 0,
    offset: 0
  },
  size: {
    width: 0,
    height: 0
  },
  payload: []
}, iy = Ke({
  name: "legend",
  initialState: Q1,
  reducers: {
    setLegendSize(e, t) {
      e.size.width = t.payload.width, e.size.height = t.payload.height;
    },
    setLegendSettings(e, t) {
      e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter, e.settings.position = t.payload.position, e.settings.offset = t.payload.offset;
    },
    addLegendPayload: {
      reducer(e, t) {
        e.payload.push(X(t.payload));
      },
      prepare: oe()
    },
    replaceLegendPayload: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next, a = dt(e).payload.indexOf(X(n));
        a > -1 && (e.payload[a] = X(i));
      },
      prepare: oe()
    },
    removeLegendPayload: {
      reducer(e, t) {
        var r = dt(e).payload.indexOf(X(t.payload));
        r > -1 && e.payload.splice(r, 1);
      },
      prepare: oe()
    }
  }
}), hi = iy.actions, Hs = hi.setLegendSize, J1 = hi.setLegendSettings, eO = hi.addLegendPayload, tO = hi.replaceLegendPayload, rO = hi.removeLegendPayload, nO = iy.reducer, Ho = { exports: {} }, Yo = {};
var Ys;
function iO() {
  if (Ys) return Yo;
  Ys = 1;
  var e = Pl;
  function t(l, c) {
    return l === c && (l !== 0 || 1 / l === 1 / c) || l !== l && c !== c;
  }
  var r = typeof Object.is == "function" ? Object.is : t, n = e.useSyncExternalStore, i = e.useRef, a = e.useEffect, o = e.useMemo, u = e.useDebugValue;
  return Yo.useSyncExternalStoreWithSelector = function(l, c, s, f, d) {
    var v = i(null);
    if (v.current === null) {
      var h = { hasValue: !1, value: null };
      v.current = h;
    } else h = v.current;
    v = o(
      function() {
        function y(O) {
          if (!m) {
            if (m = !0, b = O, O = f(O), d !== void 0 && h.hasValue) {
              var w = h.value;
              if (d(w, O))
                return g = w;
            }
            return g = O;
          }
          if (w = g, r(b, O)) return w;
          var S = f(O);
          return d !== void 0 && d(w, S) ? (b = O, w) : (b = O, g = S);
        }
        var m = !1, b, g, A = s === void 0 ? null : s;
        return [
          function() {
            return y(c());
          },
          A === null ? void 0 : function() {
            return y(A());
          }
        ];
      },
      [c, s, f, d]
    );
    var p = n(l, v[0], v[1]);
    return a(
      function() {
        h.hasValue = !0, h.value = p;
      },
      [p]
    ), u(p), p;
  }, Yo;
}
var qs;
function aO() {
  return qs || (qs = 1, Ho.exports = iO()), Ho.exports;
}
aO();
function oO(e) {
  e();
}
function uO() {
  let e = null, t = null;
  return {
    clear() {
      e = null, t = null;
    },
    notify() {
      oO(() => {
        let r = e;
        for (; r; )
          r.callback(), r = r.next;
      });
    },
    get() {
      const r = [];
      let n = e;
      for (; n; )
        r.push(n), n = n.next;
      return r;
    },
    subscribe(r) {
      let n = !0;
      const i = t = {
        callback: r,
        next: null,
        prev: t
      };
      return i.prev ? i.prev.next = i : e = i, function() {
        !n || e === null || (n = !1, i.next ? i.next.prev = i.prev : t = i.prev, i.prev ? i.prev.next = i.next : e = i.next);
      };
    }
  };
}
var Gs = {
  notify() {
  },
  get: () => []
};
function lO(e, t) {
  let r, n = Gs, i = 0, a = !1;
  function o(p) {
    s();
    const y = n.subscribe(p);
    let m = !1;
    return () => {
      m || (m = !0, y(), f());
    };
  }
  function u() {
    n.notify();
  }
  function l() {
    h.onStateChange && h.onStateChange();
  }
  function c() {
    return a;
  }
  function s() {
    i++, r || (r = e.subscribe(l), n = uO());
  }
  function f() {
    i--, r && i === 0 && (r(), r = void 0, n.clear(), n = Gs);
  }
  function d() {
    a || (a = !0, s());
  }
  function v() {
    a && (a = !1, f());
  }
  const h = {
    addNestedSub: o,
    notifyNestedSubs: u,
    handleChangeWrapper: l,
    isSubscribed: c,
    trySubscribe: d,
    tryUnsubscribe: v,
    getListeners: () => n
  };
  return h;
}
var cO = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", sO = /* @__PURE__ */ cO(), fO = () => typeof navigator < "u" && navigator.product === "ReactNative", dO = /* @__PURE__ */ fO(), vO = () => sO || dO ? xe : ce, hO = /* @__PURE__ */ vO();
function Vs(e, t) {
  return e === t ? e !== 0 || t !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function pO(e, t) {
  if (Vs(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Object.keys(e), n = Object.keys(t);
  if (r.length !== n.length) return !1;
  for (let i = 0; i < r.length; i++)
    if (!Object.prototype.hasOwnProperty.call(t, r[i]) || !Vs(e[r[i]], t[r[i]]))
      return !1;
  return !0;
}
var yO = /* @__PURE__ */ Symbol.for("react-redux-context"), mO = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function gO() {
  if (!ge) return {};
  const e = mO[yO] ??= /* @__PURE__ */ new Map();
  let t = e.get(ge);
  return t || (t = ge(
    null
  ), e.set(ge, t)), t;
}
var bO = /* @__PURE__ */ gO();
function xO(e) {
  const { children: t, context: r, serverState: n, store: i } = e, a = ht(() => {
    const l = lO(i);
    return {
      store: i,
      subscription: l,
      getServerState: n ? () => n : void 0
    };
  }, [i, n]), o = ht(() => i.getState(), [i]);
  return hO(() => {
    const { subscription: l } = a;
    return l.onStateChange = l.notifyNestedSubs, l.trySubscribe(), o !== i.getState() && l.notifyNestedSubs(), () => {
      l.tryUnsubscribe(), l.onStateChange = void 0;
    };
  }, [a, o]), /* @__PURE__ */ x((r || bO).Provider, { value: a }, t);
}
var wO = xO, AO = /* @__PURE__ */ new Set([
  "axisLine",
  "tickLine",
  "activeBar",
  "activeDot",
  "activeLabel",
  "activeShape",
  "allowEscapeViewBox",
  "background",
  "cursor",
  "dot",
  "label",
  "line",
  "margin",
  "padding",
  "position",
  "shape",
  "style",
  "tick",
  "wrapperStyle",
  // radius can be an array of 4 numbers, easy to compare shallowly
  "radius",
  "throttledEvents"
]);
function OO(e, t) {
  return e == null && t == null ? !0 : typeof e == "number" && typeof t == "number" ? e === t || e !== e && t !== t : e === t;
}
function wn(e, t) {
  var r = /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)]);
  for (var n of r)
    if (AO.has(n)) {
      if (e[n] == null && t[n] == null)
        continue;
      if (!pO(e[n], t[n]))
        return !1;
    } else if (!OO(e[n], t[n]))
      return !1;
  return !0;
}
var PO = P([Ht, Yt, Tl], (e, t, r) => ({
  x: r.left || 0,
  y: r.top || 0,
  width: Math.max(e - (r.left || 0) - (r.right || 0), 0),
  height: Math.max(t - (r.top || 0) - (r.bottom || 0), 0)
}));
function SO(e, t) {
  var r;
  if (e === "start" && t === "start")
    return "";
  var n = {
    start: "0",
    middle: "-50%",
    end: "-100%"
  }, i = {
    start: "0",
    middle: "-50%",
    end: "-100%"
  }, a = e === "inherit" ? "0" : n[e], o = (r = i[t]) !== null && r !== void 0 ? r : "0";
  return "translate(".concat(a, ", ").concat(o, ")");
}
var IO = ["contextPayload"];
function Nu() {
  return Nu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Nu.apply(null, arguments);
}
function _O(e, t) {
  return EO(e) || CO(e, t) || jO(e, t) || kO();
}
function kO() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jO(e, t) {
  if (e) {
    if (typeof e == "string") return Xs(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Xs(e, t) : void 0;
  }
}
function Xs(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function CO(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function EO(e) {
  if (Array.isArray(e)) return e;
}
function Zs(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function pn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zs(Object(r), !0).forEach(function(n) {
      TO(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zs(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function TO(e, t, r) {
  return (t = MO(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function MO(e) {
  var t = DO(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function DO(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function $O(e, t) {
  if (e == null) return {};
  var r, n, i = NO(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function NO(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function LO(e) {
  return e.value;
}
function RO(e) {
  var t = e.contextPayload, r = $O(e, IO), n = hp(t, e.payloadUniqBy, LO), i = pn(pn({}, r), {}, {
    payload: n
  });
  return /* @__PURE__ */ ve(e.content) ? /* @__PURE__ */ mt(e.content, i) : typeof e.content == "function" ? /* @__PURE__ */ x(e.content, i) : /* @__PURE__ */ x(Ux, i);
}
function zO(e) {
  return e === "left" || e === "right" || e === "insideLeft" || e === "insideRight" ? "vertical" : "horizontal";
}
function BO(e, t) {
  return t == null ? null : pl(t) ? PO(e) : Zp(e);
}
function WO(e, t, r) {
  return e === "top" ? {
    top: r.height + t
  } : e === "bottom" ? {
    top: -r.height - t
  } : e === "left" ? {
    left: r.width + t
  } : e === "right" ? {
    left: -r.width - t
  } : {};
}
function FO(e, t, r, n, i, a) {
  var o = t.layout, u = t.align, l = t.verticalAlign, c, s;
  return (!e || (e.left === void 0 || e.left === null) && (e.right === void 0 || e.right === null)) && (u === "center" && o === "vertical" ? c = {
    left: ((n || 0) - a.width) / 2
  } : c = u === "right" ? {
    right: r && r.right || 0
  } : {
    left: r && r.left || 0
  }), (!e || (e.top === void 0 || e.top === null) && (e.bottom === void 0 || e.bottom === null)) && (l === "middle" ? s = {
    top: ((i || 0) - a.height) / 2
  } : s = l === "bottom" ? {
    bottom: r && r.bottom || 0
  } : {
    top: r && r.top || 0
  }), pn(pn({}, c), s);
}
function KO(e) {
  var t = e.align, r = e.layout, n = e.verticalAlign, i = e.itemSorter, a = e.position, o = e.offset, u = ae();
  return xe(() => {
    u(J1({
      align: t,
      layout: r,
      verticalAlign: n,
      itemSorter: i,
      position: a,
      offset: o
    }));
  }, [u, t, r, n, i, a, o]), null;
}
function UO(e) {
  var t = e.width, r = e.height, n = ae();
  return xe(() => {
    n(Hs({
      width: t,
      height: r
    }));
  }, [n, t, r]), xe(() => () => {
    n(Hs({
      width: 0,
      height: 0
    }));
  }, [n]), null;
}
function HO(e, t, r, n) {
  return e === "vertical" && t != null ? {
    height: t
  } : e === "horizontal" ? {
    width: r || n
  } : null;
}
var YO = {
  align: "center",
  iconSize: 14,
  inactiveColor: "#ccc",
  itemSorter: "value",
  labelStyle: {},
  layout: "auto",
  verticalAlign: "bottom",
  offset: 0
};
function qO(e) {
  var t, r, n, i, a, o, u, l, c = Fe(e, YO), s = e.layout && e.layout !== "auto" ? e.layout : zO(c.position), f = Kw(), d = Fb(), v = X1(), h = $((U) => BO(U, c.position)), p = c.width, y = c.height, m = c.wrapperStyle, b = c.portal, g = b == null && (c.position == null || pl(c.position)), A = gp([f]), O = _O(A, 2), w = O[0], S = O[1], _ = Nl(), E = Ll();
  if (_ == null || E == null || c.position != null && h == null)
    return null;
  var j = _ - (v?.left || 0) - (v?.right || 0), k = HO(s, y, p, j), I = c.position == null ? null : wh({
    /*
     * When calculating the position we use two different view boxes.
     * Inside positions use the plot area; outside positions use the margin-inset
     * chart area, placing the Legend beyond any axes.
     */
    viewBox: h ?? {
      x: 0,
      y: 0,
      width: _,
      height: E
    },
    position: c.position,
    offset: (t = c.offset) !== null && t !== void 0 ? t : 0
  }), R = WO(c.position, (r = c.offset) !== null && r !== void 0 ? r : 0, w), N = s === "vertical" ? ((n = h?.width) !== null && n !== void 0 ? n : 0) / 2 : (i = h?.width) !== null && i !== void 0 ? i : 0, L = s === "horizontal" ? ((a = h?.height) !== null && a !== void 0 ? a : 0) / 2 : (o = h?.height) !== null && o !== void 0 ? o : 0, W = I ? {
    width: "max-content",
    height: "max-content",
    maxWidth: N,
    maxHeight: L,
    overflowY: "auto",
    top: I.y + ((u = R.top) !== null && u !== void 0 ? u : 0),
    left: I.x + ((l = R.left) !== null && l !== void 0 ? l : 0),
    transform: SO(I.horizontalAnchor, I.verticalAnchor)
  } : FO(m, c, v, _, E, w), F = b ? m : pn(pn({
    position: "absolute",
    width: k?.width || p || "auto",
    height: k?.height || y || "auto"
  }, W), m), z = b ?? d;
  if (z == null || f == null)
    return null;
  var q = /* @__PURE__ */ x("div", {
    className: "recharts-legend-wrapper",
    style: F,
    ref: S
  }, /* @__PURE__ */ x(KO, {
    layout: s,
    align: c.align,
    verticalAlign: c.verticalAlign,
    itemSorter: c.itemSorter,
    position: c.position,
    offset: c.offset
  }), g && /* @__PURE__ */ x(UO, w), /* @__PURE__ */ x(RO, Nu({}, c, {
    layout: s
  }, k, {
    margin: v,
    chartWidth: _,
    chartHeight: E,
    contextPayload: f
  })));
  return /* @__PURE__ */ fl(q, z);
}
var ay = /* @__PURE__ */ gt(qO, wn);
ay.displayName = "Legend";
function Lu() {
  return Lu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Lu.apply(null, arguments);
}
function Qs(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Mn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qs(Object(r), !0).forEach(function(n) {
      GO(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Qs(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function GO(e, t, r) {
  return (t = VO(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VO(e) {
  var t = XO(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function XO(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ZO(e, t) {
  return tP(e) || eP(e, t) || JO(e, t) || QO();
}
function QO() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function JO(e, t) {
  if (e) {
    if (typeof e == "string") return Js(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Js(e, t) : void 0;
  }
}
function Js(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function eP(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function tP(e) {
  if (Array.isArray(e)) return e;
}
function rP(e) {
  return Array.isArray(e) && Ft(e[0]) && Ft(e[1]) ? e.join(" ~ ") : e;
}
var Qr = {
  separator: " : ",
  contentStyle: {
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  },
  itemStyle: {
    display: "block",
    paddingTop: 4,
    paddingBottom: 4,
    color: "#000"
  },
  labelStyle: {},
  accessibilityLayer: !1
};
function nP(e, t) {
  return t == null ? e : Va(e, t);
}
var iP = (e) => {
  var t = e.separator, r = t === void 0 ? Qr.separator : t, n = e.contentStyle, i = e.itemStyle, a = e.labelStyle, o = a === void 0 ? Qr.labelStyle : a, u = e.payload, l = e.formatter, c = e.itemSorter, s = e.wrapperClassName, f = e.labelClassName, d = e.label, v = e.labelFormatter, h = e.accessibilityLayer, p = h === void 0 ? Qr.accessibilityLayer : h, y = () => {
    if (u && u.length) {
      var _ = {
        padding: 0,
        margin: 0
      }, E = nP(u, c), j = E.map((k, I) => {
        if (!k || k.type === "none")
          return null;
        var R = k.formatter || l || rP, N = k.value, L = k.name, W = N, F = L;
        if (R) {
          var z = R(N, L, k, I, u);
          if (Array.isArray(z)) {
            var q = ZO(z, 2);
            W = q[0], F = q[1];
          } else if (z != null)
            W = z;
          else
            return null;
        }
        var U = Mn(Mn({}, Qr.itemStyle), {}, {
          color: k.color || Qr.itemStyle.color
        }, i);
        return /* @__PURE__ */ x("li", {
          className: "recharts-tooltip-item",
          key: "tooltip-item-".concat(I),
          style: U
        }, Ft(F) ? /* @__PURE__ */ x("span", {
          className: "recharts-tooltip-item-name"
        }, F) : null, Ft(F) ? /* @__PURE__ */ x("span", {
          className: "recharts-tooltip-item-separator"
        }, r) : null, /* @__PURE__ */ x("span", {
          className: "recharts-tooltip-item-value"
        }, W), /* @__PURE__ */ x("span", {
          className: "recharts-tooltip-item-unit"
        }, k.unit || ""));
      });
      return /* @__PURE__ */ x("ul", {
        className: "recharts-tooltip-item-list",
        style: _
      }, j);
    }
    return null;
  }, m = Mn(Mn({}, Qr.contentStyle), n), b = Mn({
    margin: 0
  }, o), g = !se(d), A = g ? d : "", O = re("recharts-default-tooltip", s), w = re("recharts-tooltip-label", f);
  g && v && u !== void 0 && u !== null && (A = v(d, u));
  var S = p ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ x("div", Lu({
    className: O,
    style: m
  }, S), /* @__PURE__ */ x("p", {
    className: w,
    style: b
  }, /* @__PURE__ */ ve(A) ? A : "".concat(A)), y());
}, Dn = "recharts-tooltip-wrapper", aP = {
  visibility: "hidden"
};
function oP(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return re(Dn, {
    ["".concat(Dn, "-right")]: T(r) && t && T(t.x) && r >= t.x,
    ["".concat(Dn, "-left")]: T(r) && t && T(t.x) && r < t.x,
    ["".concat(Dn, "-bottom")]: T(n) && t && T(t.y) && n >= t.y,
    ["".concat(Dn, "-top")]: T(n) && t && T(t.y) && n < t.y
  });
}
function ef(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, i = e.offset, a = e.position, o = e.reverseDirection, u = e.tooltipDimension, l = e.viewBox, c = e.viewBoxDimension;
  if (a && T(a[n]))
    return a[n];
  var s = r[n] - u - (i > 0 ? i : 0), f = r[n] + i;
  if (t[n])
    return o[n] ? s : f;
  var d = l[n];
  if (d == null)
    return 0;
  if (o[n]) {
    var v = s, h = d;
    return v < h ? Math.max(f, d) : Math.max(s, d);
  }
  if (c == null)
    return 0;
  var p = f + u, y = d + c;
  return p > y ? Math.max(s, d) : Math.max(f, d);
}
function uP(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function lP(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTop, i = e.offsetLeft, a = e.position, o = e.reverseDirection, u = e.tooltipBox, l = e.useTranslate3d, c = e.viewBox, s, f, d;
  return u && u.height > 0 && u.width > 0 && r ? (f = ef({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offset: i,
    position: a,
    reverseDirection: o,
    tooltipDimension: u.width,
    viewBox: c,
    viewBoxDimension: c.width
  }), d = ef({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offset: n,
    position: a,
    reverseDirection: o,
    tooltipDimension: u.height,
    viewBox: c,
    viewBoxDimension: c.height
  }), s = uP({
    translateX: f,
    translateY: d,
    useTranslate3d: l
  })) : s = aP, {
    cssProperties: s,
    cssClasses: oP({
      translateX: f,
      translateY: d,
      coordinate: r
    })
  };
}
var cP = () => !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout), pi = {
  isSsr: cP()
};
function sP(e, t) {
  return hP(e) || vP(e, t) || dP(e, t) || fP();
}
function fP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function dP(e, t) {
  if (e) {
    if (typeof e == "string") return tf(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? tf(e, t) : void 0;
  }
}
function tf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function vP(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function hP(e) {
  if (Array.isArray(e)) return e;
}
function oy() {
  var e = Se(() => pi.isSsr || !window.matchMedia ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches), t = sP(e, 2), r = t[0], n = t[1];
  return ce(() => {
    if (window.matchMedia) {
      var i = window.matchMedia("(prefers-reduced-motion: reduce)"), a = () => {
        n(i.matches);
      };
      return i.addEventListener("change", a), () => {
        i.removeEventListener("change", a);
      };
    }
  }, []), r;
}
function rf(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Jr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? rf(Object(r), !0).forEach(function(n) {
      pP(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : rf(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function pP(e, t, r) {
  return (t = yP(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function yP(e) {
  var t = mP(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function mP(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function gP(e, t) {
  return AP(e) || wP(e, t) || xP(e, t) || bP();
}
function bP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function xP(e, t) {
  if (e) {
    if (typeof e == "string") return nf(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? nf(e, t) : void 0;
  }
}
function nf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function wP(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function AP(e) {
  if (Array.isArray(e)) return e;
}
function OP(e) {
  if (!(e.prefersReducedMotion && e.isAnimationActive === "auto") && e.isAnimationActive && e.active) {
    var t = typeof e.animationEasing == "string" ? e.animationEasing : "ease";
    return "transform ".concat(e.animationDuration, "ms ").concat(t);
  }
}
function PP(e) {
  var t, r, n, i, a, o, u = oy(), l = Se(() => ({
    dismissed: !1,
    dismissedAtCoordinate: {
      x: 0,
      y: 0
    }
  })), c = gP(l, 2), s = c[0], f = c[1];
  ce(() => {
    var m = (b) => {
      if (b.key === "Escape") {
        var g, A, O, w;
        f({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (g = (A = e.coordinate) === null || A === void 0 ? void 0 : A.x) !== null && g !== void 0 ? g : 0,
            y: (O = (w = e.coordinate) === null || w === void 0 ? void 0 : w.y) !== null && O !== void 0 ? O : 0
          }
        });
      }
    };
    return document.addEventListener("keydown", m), () => {
      document.removeEventListener("keydown", m);
    };
  }, [(t = e.coordinate) === null || t === void 0 ? void 0 : t.x, (r = e.coordinate) === null || r === void 0 ? void 0 : r.y]), s.dismissed && (((n = (i = e.coordinate) === null || i === void 0 ? void 0 : i.x) !== null && n !== void 0 ? n : 0) !== s.dismissedAtCoordinate.x || ((a = (o = e.coordinate) === null || o === void 0 ? void 0 : o.y) !== null && a !== void 0 ? a : 0) !== s.dismissedAtCoordinate.y) && f(Jr(Jr({}, s), {}, {
    dismissed: !1
  }));
  var d = lP({
    allowEscapeViewBox: e.allowEscapeViewBox,
    coordinate: e.coordinate,
    offsetLeft: typeof e.offset == "number" ? e.offset : e.offset.x,
    offsetTop: typeof e.offset == "number" ? e.offset : e.offset.y,
    position: e.position,
    reverseDirection: e.reverseDirection,
    tooltipBox: e.lastBoundingBox,
    useTranslate3d: e.useTranslate3d,
    viewBox: e.viewBox
  }), v = d.cssClasses, h = d.cssProperties, p = e.hasPortalFromProps ? {} : Jr(Jr({
    transition: OP({
      prefersReducedMotion: u,
      isAnimationActive: e.isAnimationActive,
      active: e.active,
      animationDuration: e.animationDuration,
      animationEasing: e.animationEasing
    })
  }, h), {}, {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0
  }), y = Jr(Jr({}, p), {}, {
    visibility: !s.dismissed && e.active && e.hasPayload ? "visible" : "hidden"
  }, e.wrapperStyle);
  return /* @__PURE__ */ x("div", {
    // @ts-expect-error TypeScript library does not recognize xmlns attribute, but it's required for an HTML chunk inside SVG.
    xmlns: "http://www.w3.org/1999/xhtml",
    tabIndex: -1,
    className: v,
    style: y,
    ref: e.innerRef
  }, e.children);
}
var SP = /* @__PURE__ */ gt(PP), uy = () => {
  var e;
  return (e = $((t) => t.rootProps.accessibilityLayer)) !== null && e !== void 0 ? e : !0;
};
function Ru() {
  return Ru = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ru.apply(null, arguments);
}
function af(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function of(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? af(Object(r), !0).forEach(function(n) {
      IP(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : af(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function IP(e, t, r) {
  return (t = _P(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _P(e) {
  var t = kP(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function kP(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var uf = {
  curveBasisClosed: ux,
  curveBasisOpen: lx,
  curveBasis: ox,
  curveBumpX: Yb,
  curveBumpY: qb,
  curveLinearClosed: cx,
  curveLinear: Ya,
  curveMonotoneX: sx,
  curveMonotoneY: fx,
  curveNatural: dx,
  curveStep: vx,
  curveStepAfter: px,
  curveStepBefore: hx
}, pa = (e) => V(e.x) && V(e.y), lf = (e) => e.base != null && pa(e.base) && pa(e), $n = (e) => e.x, Nn = (e) => e.y, jP = (e, t) => {
  if (typeof e == "function")
    return e;
  var r = "curve".concat(ci(e));
  if ((r === "curveMonotone" || r === "curveBump") && t) {
    var n = uf["".concat(r).concat(t === "vertical" ? "Y" : "X")];
    if (n)
      return n;
  }
  return uf[r] || Ya;
}, cf = {
  connectNulls: !1,
  type: "linear"
}, CP = (e) => {
  var t = e.type, r = t === void 0 ? cf.type : t, n = e.points, i = n === void 0 ? [] : n, a = e.baseLine, o = e.layout, u = e.connectNulls, l = u === void 0 ? cf.connectNulls : u, c = jP(r, o), s = l ? i.filter(pa) : i;
  if (Array.isArray(a)) {
    var f, d = i.map((m, b) => of(of({}, m), {}, {
      base: a[b]
    }));
    o === "vertical" ? f = ki().y(Nn).x1($n).x0((m) => m.base.x) : f = ki().x($n).y1(Nn).y0((m) => m.base.y);
    var v = f.defined(lf).curve(c), h = l ? d.filter(lf) : d;
    return v(h);
  }
  var p;
  o === "vertical" && T(a) ? p = ki().y(Nn).x1($n).x0(a) : T(a) ? p = ki().x($n).y1(Nn).y0(a) : p = kh().x($n).y(Nn);
  var y = p.defined(pa).curve(c);
  return y(s);
}, ly = (e) => {
  var t = e.className, r = e.points, n = e.path, i = e.pathRef, a = Yr();
  if ((!r || !r.length) && !n)
    return null;
  var o = {
    type: e.type,
    points: e.points,
    baseLine: e.baseLine,
    layout: e.layout || a,
    connectNulls: e.connectNulls
  }, u = r && r.length ? CP(o) : n;
  return /* @__PURE__ */ x("path", Ru({}, _t(e), bl(e), {
    className: re("recharts-curve", t),
    d: u === null ? void 0 : u,
    ref: i
  }));
}, EP = ["x", "y", "top", "left", "width", "height", "className"];
function zu() {
  return zu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, zu.apply(null, arguments);
}
function sf(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function TP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? sf(Object(r), !0).forEach(function(n) {
      MP(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : sf(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function MP(e, t, r) {
  return (t = DP(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function DP(e) {
  var t = $P(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function $P(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function NP(e, t) {
  if (e == null) return {};
  var r, n, i = LP(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function LP(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var RP = (e, t, r, n, i, a) => "M".concat(e, ",").concat(i, "v").concat(n, "M").concat(a, ",").concat(t, "h").concat(r), zP = (e) => {
  var t = e.x, r = t === void 0 ? 0 : t, n = e.y, i = n === void 0 ? 0 : n, a = e.top, o = a === void 0 ? 0 : a, u = e.left, l = u === void 0 ? 0 : u, c = e.width, s = c === void 0 ? 0 : c, f = e.height, d = f === void 0 ? 0 : f, v = e.className, h = NP(e, EP), p = TP({
    x: r,
    y: i,
    top: o,
    left: l,
    width: s,
    height: d
  }, h);
  return !T(r) || !T(i) || !T(s) || !T(d) || !T(o) || !T(l) ? null : /* @__PURE__ */ x("path", zu({}, at(p), {
    className: re("recharts-cross", v),
    d: RP(r, i, s, d, o, l)
  }));
};
function BP(e, t, r, n) {
  var i = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - i : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - i,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n
  };
}
var ya = 1e-4, cy = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1], sy = (e, t) => e.map((r, n) => r * t ** n).reduce((r, n) => r + n), ff = (e, t) => (r) => {
  var n = cy(e, t);
  return sy(n, r);
}, WP = (e, t) => (r) => {
  var n = cy(e, t), i = [...n.map((a, o) => a * o).slice(1), 0];
  return sy(i, r);
}, FP = (e) => {
  var t, r = e.split("(");
  if (r.length !== 2 || r[0] !== "cubic-bezier")
    return null;
  var n = (t = r[1]) === null || t === void 0 || (t = t.split(")")[0]) === null || t === void 0 ? void 0 : t.split(",");
  if (n == null || n.length !== 4)
    return null;
  var i = n.map((a) => parseFloat(a));
  return [i[0], i[1], i[2], i[3]];
}, KP = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  if (r.length === 1)
    switch (r[0]) {
      case "linear":
        return [0, 0, 1, 1];
      case "ease":
        return [0.25, 0.1, 0.25, 1];
      case "ease-in":
        return [0.42, 0, 1, 1];
      case "ease-out":
        return [0.42, 0, 0.58, 1];
      case "ease-in-out":
        return [0, 0, 0.58, 1];
      default: {
        var i = FP(r[0]);
        if (i)
          return i;
      }
    }
  return r.length === 4 ? r : [0, 0, 1, 1];
}, UP = (e, t, r, n) => {
  var i = ff(e, r), a = ff(t, n), o = WP(e, r), u = (c) => c > 1 ? 1 : c < 0 ? 0 : c, l = (c) => {
    for (var s = c > 1 ? 1 : c, f = s, d = 0; d < 8; ++d) {
      var v = i(f) - s, h = o(f);
      if (Math.abs(v - s) < ya || h < ya)
        return a(f);
      f = u(f - v / h);
    }
    return a(f);
  };
  return l.isStepper = !1, l;
}, df = function() {
  return UP(...KP(...arguments));
}, HP = function() {
  for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, i = t.damping, a = i === void 0 ? 8 : i, o = t.dt, u = o === void 0 ? 16.67 : o, l = 1, c = [0], s = 0, f = 0, d = 1e4, v = 0; v < d; ) {
    var h = -(s - l) * n, p = f * a;
    if (f += (h - p) * u / 1e3, s += f * u / 1e3, c.push(s), Math.abs(s - l) < ya && Math.abs(f) < ya)
      break;
    v++;
  }
  c[c.length - 1] = l;
  var y = c.length - 1;
  return (m) => {
    var b, g, A;
    if (m <= 0) return 0;
    if (m >= 1) return l;
    var O = m * y, w = Math.floor(O), S = O - w;
    return ((b = c[w]) !== null && b !== void 0 ? b : 0) + (((g = c[w + 1]) !== null && g !== void 0 ? g : 0) - ((A = c[w]) !== null && A !== void 0 ? A : 0)) * S;
  };
}, YP = (e) => {
  if (typeof e == "string")
    switch (e) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return df(e);
      case "spring":
        return HP();
      default:
        if (e.split("(")[0] === "cubic-bezier")
          return df(e);
    }
  return typeof e == "function" ? e : null;
}, qP = (e, t, r) => {
  var n, i = (a) => {
    var o = t.tick(a);
    if (t.getState() === "active") {
      if (r(t.getInterpolated()), t.getProgress() === 1) {
        t.complete(), n = void 0;
        return;
      }
      n = e.setTimeout(i, o);
      return;
    }
    n = e.setTimeout(i, o);
  };
  return n = e.setTimeout(i, 0), () => {
    var a;
    return (a = n) === null || a === void 0 ? void 0 : a();
  };
}, fy = /* @__PURE__ */ ge(qP);
fy.Provider;
function GP(e) {
  var t = Ge(fy);
  return ht(() => e ?? t, [e, t]);
}
function VP(e, t, r) {
  return (t = XP(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function XP(e) {
  var t = ZP(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ZP(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var vf = "init", hf = "pending", pf = "active", QP = "completed";
function qo(e) {
  return Math.max(0, e);
}
class JP {
  /**
   * Returns the absolute time after the animationBegin delay has been completed,
   * and when the animationDuration started ticking.
   */
  getAnimationStartedTime() {
    return this.animationStartedTime;
  }
  /**
   * Returns the absolute time of when the animation began - now it will wait for {animationBegin} ms before the transition starts
   */
  getBeginStartedTime() {
    return this.beginStartedTime;
  }
  constructor(t) {
    var r;
    VP(this, "state", vf), this.animationId = t.animationId, this.onAnimationEnd = t.onAnimationEnd, this.animationDuration = qo(t.animationDuration), this.animationBegin = qo(t.animationBegin), this.progress = 0, this.from = t.from, this.to = t.to, this.easing = t.easing, (r = t.onAnimationStart) === null || r === void 0 || r.call(t);
  }
  /**
   * Returns the state machine current state
   * - `init`:       animation had just been created. It immediately calls `onAnimationStart`
   * - `pending`:    animation is now paused for `animationBegin` milliseconds until the transition begins
   * - `active`:     animation is transitioning items on screen
   * - `completed`:  animation has completed its transition and executed `onAnimationEnd`.
   *                 This state is final and the animation is no longer allowed to transition to other states.
   */
  getState() {
    return this.state;
  }
  /**
   * Returns the easing input or function
   */
  getEasing() {
    return this.easing;
  }
  /**
   * Returns the configuration - the duration of the transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationDuration() {
    return this.animationDuration;
  }
  /**
   * Sets the current time of the animation. The animation sets its internal state and progress accordingly.
   * This is current, absolute time; not additive!
   * This allows you to essentially "travel back in time" based on the value you pass in here.
   *
   * Returns the (relative) time remaining until the current activity is over.
   * Meaning: if the state is in a middle of a delay, returns the time left until the delay is finished.
   * If the state is in the middle of a transition, returns time left until that transition is complete.
   * This is useful because it's the same number you can take and put into setTimeout(fn, X)
   * as that's how much time we need to wait until the next state transition happens.
   */
  tick(t) {
    if (this.getState() === vf)
      return this.state = hf, this.beginStartedTime = t, this.animationBegin;
    if (this.getState() === hf) {
      if (this.beginStartedTime == null)
        throw new Error();
      var r = t - this.beginStartedTime;
      return r >= this.animationBegin ? (this.state = pf, this.animationStartedTime = t, this.nextAnimationUpdate(0)) : qo(this.animationBegin - r);
    }
    if (this.getState() === pf) {
      if (this.animationStartedTime == null)
        throw new Error();
      var n = t - this.animationStartedTime;
      return this.setProgress(n / this.animationDuration), this.nextAnimationUpdate(n);
    }
    return 0;
  }
  setProgress(t) {
    this.progress = Math.min(1, Math.max(0, t));
  }
  /**
   * Returns an abstract "progress" which is number between 0 and 1 which shows the distance of transition.
   * This progress depends on the animation state:
   * - `init`: 0
   * - `pending`: 0
   * - `active`: transitioning between [0, 1] based on the time elapsed
   * - `completed`: 1
   *
   * The progress is hard-capped to be between 0 and 1 (inclusive) to avoid overshooting caused by coarse timers.
   * For this reason, the easing function must be applied _after_ this animation state,
   * so that one has a chance to construct dynamic "overshoot" animations.
   *
   * The progress is linear with time.
   * If you wish for easing, use `getInterpolated()` instead.
   */
  getProgress() {
    return this.progress;
  }
  /**
   * Completes the animation. Completed animation:
   * - cannot be manipulated anymore
   * - its progress is set to 1
   * - tick function doesn't do anything
   * - getState() always returns 'completed'
   */
  complete() {
    if (this.progress = 1, this.state === "active") {
      var t;
      (t = this.onAnimationEnd) === null || t === void 0 || t.call(this);
    }
    this.state = QP;
  }
  /**
   * Returns the starting value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static starting value
   */
  getFrom() {
    return this.from;
  }
  /**
   * Returns the end value of the animation.
   * Does not include progress, easing, interpolation, none of that - just the static end value
   */
  getTo() {
    return this.to;
  }
  /**
   * Unique identifier of an animation
   */
  getAnimationId() {
    return this.animationId;
  }
  /**
   * Returns the configuration - the duration of delay in between animation initialization, and transition.
   * Does not change in time, does not change when state changes, this is a static value.
   */
  getAnimationBegin() {
    return this.animationBegin;
  }
  /**
   * Returns value of the transition at the current time.
   * The exact details differ based on the animation type
   */
  /**
   * Returns the duration of time of when the controller should ask for the next update
   */
}
class eS extends JP {
  // eslint-disable-next-line class-methods-use-this
  nextAnimationUpdate() {
    return 0;
  }
  /**
   * Returns value of the animation after its easing function had been applied.
   * This value, unlike getProgress(), can escape the [0..1] range
   * because this is entirely within the easing function control. Spring typically does this.
   */
  getInterpolated() {
    return this.easing(me(this.getFrom(), this.getTo(), this.getProgress()));
  }
}
class tS {
  setTimeout(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = performance.now(), i = null, a = (o) => {
      o - n >= r ? t(o) : i = requestAnimationFrame(a);
    };
    return i = requestAnimationFrame(a), () => {
      i != null && cancelAnimationFrame(i);
    };
  }
}
function rS(e, t) {
  return oS(e) || aS(e, t) || iS(e, t) || nS();
}
function nS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function iS(e, t) {
  if (e) {
    if (typeof e == "string") return yf(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? yf(e, t) : void 0;
  }
}
function yf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function aS(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function oS(e) {
  if (Array.isArray(e)) return e;
}
var uS = {
  begin: 0,
  duration: 1e3,
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  onAnimationEnd: () => {
  },
  onAnimationStart: () => {
  }
}, mf = 0, Go = 1;
function dy(e) {
  var t = Fe(e, uS), r = t.animationId, n = t.isActive, i = t.canBegin, a = t.duration, o = t.easing, u = t.begin, l = t.onAnimationEnd, c = t.onAnimationStart, s = t.children, f = oy(), d = n === "auto" ? !pi.isSsr && !f : n, v = GP(t.animationController), h = Se(d ? mf : Go), p = rS(h, 2), y = p[0], m = p[1];
  return ce(() => {
    d || m(Go);
  }, [d]), ce(() => {
    var b = YP(o);
    if (!d || !i || b == null)
      return Hr;
    var g = new tS(), A = new eS({
      animationId: r,
      easing: b,
      animationDuration: a,
      animationBegin: u,
      onAnimationStart: c,
      onAnimationEnd: l,
      from: mf,
      to: Go
    });
    return v(g, A, m);
  }, [v, r, d, i, a, o, u, c, l]), s(Number(y));
}
function vy(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "animation-", r = Y(Xn(t)), n = Y(e);
  return n.current !== e && (r.current = Xn(t), n.current = e), r.current;
}
var lS = (e) => e.replace(/([A-Z])/g, (t) => "-".concat(t.toLowerCase())), cS = (e, t, r) => e.map((n) => "".concat(lS(n), " ").concat(t, "ms ").concat(r)).join(","), sS = ["radius"], fS = ["radius"], gf, bf, xf, wf, Af, Of, Pf, Sf, If, _f;
function kf(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function jf(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? kf(Object(r), !0).forEach(function(n) {
      dS(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kf(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function dS(e, t, r) {
  return (t = vS(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function vS(e) {
  var t = hS(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function hS(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ma() {
  return ma = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ma.apply(null, arguments);
}
function Cf(e, t) {
  if (e == null) return {};
  var r, n, i = pS(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function pS(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function yS(e, t) {
  return xS(e) || bS(e, t) || gS(e, t) || mS();
}
function mS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function gS(e, t) {
  if (e) {
    if (typeof e == "string") return Ef(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Ef(e, t) : void 0;
  }
}
function Ef(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function bS(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function xS(e) {
  if (Array.isArray(e)) return e;
}
function Dt(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Tf = (e, t, r, n, i) => {
  var a = Xt(r), o = Xt(n), u = Math.min(Math.abs(a) / 2, Math.abs(o) / 2), l = o >= 0 ? 1 : -1, c = a >= 0 ? 1 : -1, s = o >= 0 && a >= 0 || o < 0 && a < 0 ? 1 : 0, f;
  if (u > 0 && Array.isArray(i)) {
    for (var d = [0, 0, 0, 0], v = 0, h = 4; v < h; v++) {
      var p, y = (p = i[v]) !== null && p !== void 0 ? p : 0;
      d[v] = y > u ? u : y;
    }
    f = $e(gf || (gf = Dt(["M", ",", ""])), e, t + l * d[0]), d[0] > 0 && (f += $e(bf || (bf = Dt(["A ", ",", ",0,0,", ",", ",", ""])), d[0], d[0], s, e + c * d[0], t)), f += $e(xf || (xf = Dt(["L ", ",", ""])), e + r - c * d[1], t), d[1] > 0 && (f += $e(wf || (wf = Dt(["A ", ",", ",0,0,", `,
        `, ",", ""])), d[1], d[1], s, e + r, t + l * d[1])), f += $e(Af || (Af = Dt(["L ", ",", ""])), e + r, t + n - l * d[2]), d[2] > 0 && (f += $e(Of || (Of = Dt(["A ", ",", ",0,0,", `,
        `, ",", ""])), d[2], d[2], s, e + r - c * d[2], t + n)), f += $e(Pf || (Pf = Dt(["L ", ",", ""])), e + c * d[3], t + n), d[3] > 0 && (f += $e(Sf || (Sf = Dt(["A ", ",", ",0,0,", `,
        `, ",", ""])), d[3], d[3], s, e, t + n - l * d[3])), f += "Z";
  } else if (u > 0 && i === +i && i > 0) {
    var m = Math.min(u, i);
    f = $e(If || (If = Dt(["M ", ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", `
            L `, ",", `
            A `, ",", ",0,0,", ",", ",", " Z"])), e, t + l * m, m, m, s, e + c * m, t, e + r - c * m, t, m, m, s, e + r, t + l * m, e + r, t + n - l * m, m, m, s, e + r - c * m, t + n, e + c * m, t + n, m, m, s, e, t + n - l * m);
  } else
    f = $e(_f || (_f = Dt(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
  return f;
}, Mf = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 0,
  isAnimationActive: !1,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, hy = (e) => {
  var t = Fe(e, Mf), r = Y(null), n = Se(-1), i = yS(n, 2), a = i[0], o = i[1];
  ce(() => {
    if (r.current && r.current.getTotalLength)
      try {
        var z = r.current.getTotalLength();
        z && o(z);
      } catch {
      }
  }, []);
  var u = t.x, l = t.y, c = t.width, s = t.height, f = t.radius, d = t.className, v = t.animationEasing, h = t.animationDuration, p = t.animationBegin, y = t.isAnimationActive, m = t.isUpdateAnimationActive, b = Y(c), g = Y(s), A = Y(u), O = Y(l), w = ht(() => ({
    x: u,
    y: l,
    width: c,
    height: s,
    radius: f
  }), [u, l, c, s, f]), S = vy(w, "rectangle-");
  if (u !== +u || l !== +l || c !== +c || s !== +s || c === 0 || s === 0)
    return null;
  var _ = re("recharts-rectangle", d);
  if (!m) {
    var E = at(t);
    E.radius;
    var j = Cf(E, sS);
    return /* @__PURE__ */ x("path", ma({}, j, {
      x: Xt(u),
      y: Xt(l),
      width: Xt(c),
      height: Xt(s),
      radius: typeof f == "number" ? f : void 0,
      className: _,
      d: Tf(u, l, c, s, f)
    }));
  }
  var k = b.current, I = g.current, R = A.current, N = O.current, L = "0px ".concat(a === -1 ? 1 : a, "px"), W = "".concat(a, "px ").concat(a, "px"), F = cS(["strokeDasharray"], h, typeof v == "string" ? v : Mf.animationEasing);
  return /* @__PURE__ */ x(dy, {
    animationId: S,
    key: S,
    canBegin: a > 0,
    duration: h,
    easing: v,
    isActive: m,
    begin: p
  }, (z) => {
    var q = me(k, c, z), U = me(I, s, z), pe = me(R, u, z), ye = me(N, l, z);
    r.current && (b.current = q, g.current = U, A.current = pe, O.current = ye);
    var fe;
    y ? z > 0 ? fe = {
      transition: F,
      strokeDasharray: W
    } : fe = {
      strokeDasharray: L
    } : fe = {
      strokeDasharray: W
    };
    var Ye = at(t);
    Ye.radius;
    var tt = Cf(Ye, fS);
    return /* @__PURE__ */ x("path", ma({}, tt, {
      radius: typeof f == "number" ? f : void 0,
      className: _,
      d: Tf(pe, ye, q, U, f),
      ref: r,
      style: jf(jf({}, fe), t.style)
    }));
  });
};
function Df(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $f(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Df(Object(r), !0).forEach(function(n) {
      wS(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Df(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wS(e, t, r) {
  return (t = AS(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function AS(e) {
  var t = OS(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function OS(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ga = Math.PI / 180, PS = (e) => e * 180 / Math.PI, Le = (e, t, r, n) => ({
  x: e + Math.cos(-ga * n) * r,
  y: t + Math.sin(-ga * n) * r
}), SS = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(t - (n.left || 0) - (n.right || 0)), Math.abs(r - (n.top || 0) - (n.bottom || 0))) / 2;
}, IS = (e, t) => {
  var r = e.x, n = e.y, i = t.x, a = t.y;
  return Math.sqrt((r - i) ** 2 + (n - a) ** 2);
}, _S = (e, t) => {
  var r = e.x, n = e.y, i = t.cx, a = t.cy, o = IS({
    x: r,
    y: n
  }, {
    x: i,
    y: a
  });
  if (o <= 0)
    return {
      radius: o,
      angle: 0
    };
  var u = (r - i) / o, l = Math.acos(u);
  return n > a && (l = 2 * Math.PI - l), {
    radius: o,
    angle: PS(l),
    angleInRadian: l
  };
}, kS = (e) => {
  var t = e.startAngle, r = e.endAngle, n = Math.floor(t / 360), i = Math.floor(r / 360), a = Math.min(n, i);
  return {
    startAngle: t - a * 360,
    endAngle: r - a * 360
  };
}, jS = (e, t) => {
  var r = t.startAngle, n = t.endAngle, i = Math.floor(r / 360), a = Math.floor(n / 360), o = Math.min(i, a);
  return e + o * 360;
}, CS = (e, t) => {
  var r = e.relativeX, n = e.relativeY, i = _S({
    x: r,
    y: n
  }, t), a = i.radius, o = i.angle, u = t.innerRadius, l = t.outerRadius;
  if (a < u || a > l || a === 0)
    return null;
  var c = kS(t), s = c.startAngle, f = c.endAngle, d = o, v;
  if (s <= f) {
    for (; d > f; )
      d -= 360;
    for (; d < s; )
      d += 360;
    v = d >= s && d <= f;
  } else {
    for (; d > s; )
      d -= 360;
    for (; d < f; )
      d += 360;
    v = d >= f && d <= s;
  }
  return v ? $f($f({}, t), {}, {
    radius: a,
    angle: jS(d, t)
  }) : null;
};
function py(e) {
  var t = e.cx, r = e.cy, n = e.radius, i = e.startAngle, a = e.endAngle, o = Le(t, r, n, i), u = Le(t, r, n, a);
  return {
    points: [o, u],
    cx: t,
    cy: r,
    radius: n,
    startAngle: i,
    endAngle: a
  };
}
var Nf, Lf, Rf, zf, Bf, Wf, Ff;
function Bu() {
  return Bu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Bu.apply(null, arguments);
}
function Er(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var ES = (e, t) => {
  var r = Xe(t - e), n = Math.min(Math.abs(t - e), 359.999);
  return r * n;
}, $i = (e) => {
  var t = e.cx, r = e.cy, n = e.radius, i = e.angle, a = e.sign, o = e.isExternal, u = e.cornerRadius, l = e.cornerIsExternal, c = u * (o ? 1 : -1) + n, s = Math.asin(u / c) / ga, f = l ? i : i + a * s, d = Le(t, r, c, f), v = Le(t, r, n, f), h = l ? i - a * s : i, p = Le(t, r, c * Math.cos(s * ga), h);
  return {
    center: d,
    circleTangency: v,
    lineTangency: p,
    theta: s
  };
}, yy = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, i = e.outerRadius, a = e.startAngle, o = e.endAngle, u = ES(a, o), l = a + u, c = Le(t, r, i, a), s = Le(t, r, i, l), f = $e(Nf || (Nf = Er(["M ", ",", `
    A `, ",", `,0,
    `, ",", `,
    `, ",", `
  `])), c.x, c.y, i, i, +(Math.abs(u) > 180), +(a > l), s.x, s.y);
  if (n > 0) {
    var d = Le(t, r, n, a), v = Le(t, r, n, l);
    f += $e(Lf || (Lf = Er(["L ", ",", `
            A `, ",", `,0,
            `, ",", `,
            `, ",", " Z"])), v.x, v.y, n, n, +(Math.abs(u) > 180), +(a <= l), d.x, d.y);
  } else
    f += $e(Rf || (Rf = Er(["L ", ",", " Z"])), t, r);
  return f;
}, TS = (e) => {
  var t = e.cx, r = e.cy, n = e.innerRadius, i = e.outerRadius, a = e.cornerRadius, o = e.forceCornerRadius, u = e.cornerIsExternal, l = e.startAngle, c = e.endAngle, s = Xe(c - l), f = $i({
    cx: t,
    cy: r,
    radius: i,
    angle: l,
    sign: s,
    cornerRadius: a,
    cornerIsExternal: u
  }), d = f.circleTangency, v = f.lineTangency, h = f.theta, p = $i({
    cx: t,
    cy: r,
    radius: i,
    angle: c,
    sign: -s,
    cornerRadius: a,
    cornerIsExternal: u
  }), y = p.circleTangency, m = p.lineTangency, b = p.theta, g = u ? Math.abs(l - c) : Math.abs(l - c) - h - b;
  if (g < 0)
    return o ? $e(zf || (zf = Er(["M ", ",", `
        a`, ",", ",0,0,1,", `,0
        a`, ",", ",0,0,1,", `,0
      `])), v.x, v.y, a, a, a * 2, a, a, -a * 2) : yy({
      cx: t,
      cy: r,
      innerRadius: n,
      outerRadius: i,
      startAngle: l,
      endAngle: c
    });
  var A = $e(Bf || (Bf = Er(["M ", ",", `
    A`, ",", ",0,0,", ",", ",", `
    A`, ",", ",0,", ",", ",", ",", `
    A`, ",", ",0,0,", ",", ",", `
  `])), v.x, v.y, a, a, +(s < 0), d.x, d.y, i, i, +(g > 180), +(s < 0), y.x, y.y, a, a, +(s < 0), m.x, m.y);
  if (n > 0) {
    var O = $i({
      cx: t,
      cy: r,
      radius: n,
      angle: l,
      sign: s,
      isExternal: !0,
      cornerRadius: a,
      cornerIsExternal: u
    }), w = O.circleTangency, S = O.lineTangency, _ = O.theta, E = $i({
      cx: t,
      cy: r,
      radius: n,
      angle: c,
      sign: -s,
      isExternal: !0,
      cornerRadius: a,
      cornerIsExternal: u
    }), j = E.circleTangency, k = E.lineTangency, I = E.theta, R = u ? Math.abs(l - c) : Math.abs(l - c) - _ - I;
    if (R < 0 && a === 0)
      return "".concat(A, "L").concat(t, ",").concat(r, "Z");
    A += $e(Wf || (Wf = Er(["L", ",", `
      A`, ",", ",0,0,", ",", ",", `
      A`, ",", ",0,", ",", ",", ",", `
      A`, ",", ",0,0,", ",", ",", "Z"])), k.x, k.y, a, a, +(s < 0), j.x, j.y, n, n, +(R > 180), +(s > 0), w.x, w.y, a, a, +(s < 0), S.x, S.y);
  } else
    A += $e(Ff || (Ff = Er(["L", ",", "Z"])), t, r);
  return A;
}, MS = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, DS = (e) => {
  var t = Fe(e, MS), r = t.cx, n = t.cy, i = t.innerRadius, a = t.outerRadius, o = t.cornerRadius, u = t.forceCornerRadius, l = t.cornerIsExternal, c = t.startAngle, s = t.endAngle, f = t.className;
  if (a < i || c === s)
    return null;
  var d = re("recharts-sector", f), v = a - i, h = kt(o, v, 0, !0), p;
  return h > 0 && Math.abs(c - s) < 360 ? p = TS({
    cx: r,
    cy: n,
    innerRadius: i,
    outerRadius: a,
    cornerRadius: Math.min(h, v / 2),
    forceCornerRadius: u,
    cornerIsExternal: l,
    startAngle: c,
    endAngle: s
  }) : p = yy({
    cx: r,
    cy: n,
    innerRadius: i,
    outerRadius: a,
    startAngle: c,
    endAngle: s
  }), /* @__PURE__ */ x("path", Bu({}, at(t), {
    className: d,
    d: p
  }));
};
function $S(e, t, r) {
  if (e === "horizontal")
    return [{
      x: t.x,
      y: r.top
    }, {
      x: t.x,
      y: r.top + r.height
    }];
  if (e === "vertical")
    return [{
      x: r.left,
      y: t.y
    }, {
      x: r.left + r.width,
      y: t.y
    }];
  if (Wh(t)) {
    if (e === "centric") {
      var n = t.cx, i = t.cy, a = t.innerRadius, o = t.outerRadius, u = t.angle, l = Le(n, i, a, u), c = Le(n, i, o, u);
      return [{
        x: l.x,
        y: l.y
      }, {
        x: c.x,
        y: c.y
      }];
    }
    return py(t);
  }
}
function NS(e) {
  return dl(e) ? NaN : Number(e);
}
function Vo(e) {
  return e ? (e = NS(e), e === 1 / 0 || e === -1 / 0 ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e === e ? e : 0) : e === 0 ? e : 0;
}
function my(e, t, r) {
  r && typeof r != "number" && Su(e, t, r) && (t = r = void 0), e = Vo(e), t === void 0 ? (t = e, e = 0) : t = Vo(t), r = r === void 0 ? e < t ? 1 : -1 : Vo(r);
  const n = Math.max(Math.ceil((t - e) / (r || 1)), 0), i = new Array(n);
  for (let a = 0; a < n; a++)
    i[a] = e, e += r;
  return i;
}
var Et = (e) => e.chartData, Rl = P([Et], (e) => {
  var t = e.chartData != null ? e.chartData.length - 1 : 0;
  return {
    chartData: e.chartData,
    computedData: e.computedData,
    dataEndIndex: t,
    dataStartIndex: 0
  };
}), yi = (e, t, r, n) => n ? Rl(e) : Et(e), LS = (e, t, r) => r ? Rl(e) : Et(e), RS = P([yi], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
P([Rl], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
var zS = P([Et], (e) => {
  var t = e.chartData, r = e.dataStartIndex, n = e.dataEndIndex;
  return t != null ? t.slice(r, n + 1) : [];
});
function zl(e, t) {
  return KS(e) || FS(e, t) || WS(e, t) || BS();
}
function BS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function WS(e, t) {
  if (e) {
    if (typeof e == "string") return Kf(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Kf(e, t) : void 0;
  }
}
function Kf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function FS(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function KS(e) {
  if (Array.isArray(e)) return e;
}
function zt(e) {
  if (Array.isArray(e) && e.length === 2) {
    var t = zl(e, 2), r = t[0], n = t[1];
    if (V(r) && V(n))
      return !0;
  }
  return !1;
}
function Uf(e, t, r) {
  return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])];
}
function gy(e, t) {
  if (t && typeof e != "function" && Array.isArray(e) && e.length === 2) {
    var r = zl(e, 2), n = r[0], i = r[1], a, o;
    if (V(n))
      a = n;
    else if (typeof n == "function")
      return;
    if (V(i))
      o = i;
    else if (typeof i == "function")
      return;
    var u = [a, o];
    if (zt(u))
      return u;
  }
}
function US(e, t, r) {
  if (!(!r && t == null)) {
    if (typeof e == "function" && t != null)
      try {
        var n = e(t, r);
        if (zt(n))
          return Uf(n, t, r);
      } catch {
      }
    if (Array.isArray(e) && e.length === 2) {
      var i = zl(e, 2), a = i[0], o = i[1], u, l;
      if (a === "auto")
        t != null && (u = Math.min(...t));
      else if (T(a))
        u = a;
      else if (typeof a == "function")
        try {
          t != null && (u = a(t?.[0]));
        } catch {
        }
      else if (typeof a == "string" && Rs.test(a)) {
        var c = Rs.exec(a);
        if (c == null || c[1] == null || t == null)
          u = void 0;
        else {
          var s = +c[1];
          u = t[0] - s;
        }
      } else
        u = t?.[0];
      if (o === "auto")
        t != null && (l = Math.max(...t));
      else if (T(o))
        l = o;
      else if (typeof o == "function")
        try {
          t != null && (l = o(t?.[1]));
        } catch {
        }
      else if (typeof o == "string" && zs.test(o)) {
        var f = zs.exec(o);
        if (f == null || f[1] == null || t == null)
          l = void 0;
        else {
          var d = +f[1];
          l = t[1] + d;
        }
      } else
        l = t?.[1];
      var v = [u, l];
      if (zt(v))
        return t == null ? v : Uf(v, t, r);
    }
  }
}
var An = 1e9, HS = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed during run-time using `Decimal.config`.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
  // `toFixed`, `toPrecision` and `toSignificantDigits`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -MAX_E
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to MAX_E
  // The natural logarithm of 10.
  // 115 digits
  LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
}, Wl, le = !0, yt = "[DecimalError] ", Nr = yt + "Invalid argument: ", Bl = yt + "Exponent out of range: ", On = Math.floor, kr = Math.pow, YS = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, nt, ke = 1e7, ue = 7, by = 9007199254740991, ba = On(by / ue), D = {};
D.absoluteValue = D.abs = function() {
  var e = new this.constructor(this);
  return e.s && (e.s = 1), e;
};
D.comparedTo = D.cmp = function(e) {
  var t, r, n, i, a = this;
  if (e = new a.constructor(e), a.s !== e.s) return a.s || -e.s;
  if (a.e !== e.e) return a.e > e.e ^ a.s < 0 ? 1 : -1;
  for (n = a.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t)
    if (a.d[t] !== e.d[t]) return a.d[t] > e.d[t] ^ a.s < 0 ? 1 : -1;
  return n === i ? 0 : n > i ^ a.s < 0 ? 1 : -1;
};
D.decimalPlaces = D.dp = function() {
  var e = this, t = e.d.length - 1, r = (t - e.e) * ue;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
D.dividedBy = D.div = function(e) {
  return Jt(this, new this.constructor(e));
};
D.dividedToIntegerBy = D.idiv = function(e) {
  var t = this, r = t.constructor;
  return ne(Jt(t, new r(e), 0, 1), r.precision);
};
D.equals = D.eq = function(e) {
  return !this.cmp(e);
};
D.exponent = function() {
  return be(this);
};
D.greaterThan = D.gt = function(e) {
  return this.cmp(e) > 0;
};
D.greaterThanOrEqualTo = D.gte = function(e) {
  return this.cmp(e) >= 0;
};
D.isInteger = D.isint = function() {
  return this.e > this.d.length - 2;
};
D.isNegative = D.isneg = function() {
  return this.s < 0;
};
D.isPositive = D.ispos = function() {
  return this.s > 0;
};
D.isZero = function() {
  return this.s === 0;
};
D.lessThan = D.lt = function(e) {
  return this.cmp(e) < 0;
};
D.lessThanOrEqualTo = D.lte = function(e) {
  return this.cmp(e) < 1;
};
D.logarithm = D.log = function(e) {
  var t, r = this, n = r.constructor, i = n.precision, a = i + 5;
  if (e === void 0)
    e = new n(10);
  else if (e = new n(e), e.s < 1 || e.eq(nt)) throw Error(yt + "NaN");
  if (r.s < 1) throw Error(yt + (r.s ? "NaN" : "-Infinity"));
  return r.eq(nt) ? new n(0) : (le = !1, t = Jt(ei(r, a), ei(e, a), a), le = !0, ne(t, i));
};
D.minus = D.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? Ay(t, e) : xy(t, (e.s = -e.s, e));
};
D.modulo = D.mod = function(e) {
  var t, r = this, n = r.constructor, i = n.precision;
  if (e = new n(e), !e.s) throw Error(yt + "NaN");
  return r.s ? (le = !1, t = Jt(r, e, 0, 1).times(e), le = !0, r.minus(t)) : ne(new n(r), i);
};
D.naturalExponential = D.exp = function() {
  return wy(this);
};
D.naturalLogarithm = D.ln = function() {
  return ei(this);
};
D.negated = D.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
D.plus = D.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? xy(t, e) : Ay(t, (e.s = -e.s, e));
};
D.precision = D.sd = function(e) {
  var t, r, n, i = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(Nr + e);
  if (t = be(i) + 1, n = i.d.length - 1, r = n * ue + 1, n = i.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = i.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
D.squareRoot = D.sqrt = function() {
  var e, t, r, n, i, a, o, u = this, l = u.constructor;
  if (u.s < 1) {
    if (!u.s) return new l(0);
    throw Error(yt + "NaN");
  }
  for (e = be(u), le = !1, i = Math.sqrt(+u), i == 0 || i == 1 / 0 ? (t = Rt(u.d), (t.length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = On((e + 1) / 2) - (e < 0 || e % 2), i == 1 / 0 ? t = "5e" + e : (t = i.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new l(t)) : n = new l(i.toString()), r = l.precision, i = o = r + 3; ; )
    if (a = n, n = a.plus(Jt(u, a, o + 2)).times(0.5), Rt(a.d).slice(0, o) === (t = Rt(n.d)).slice(0, o)) {
      if (t = t.slice(o - 3, o + 1), i == o && t == "4999") {
        if (ne(a, r + 1, 0), a.times(a).eq(u)) {
          n = a;
          break;
        }
      } else if (t != "9999")
        break;
      o += 4;
    }
  return le = !0, ne(n, r);
};
D.times = D.mul = function(e) {
  var t, r, n, i, a, o, u, l, c, s = this, f = s.constructor, d = s.d, v = (e = new f(e)).d;
  if (!s.s || !e.s) return new f(0);
  for (e.s *= s.s, r = s.e + e.e, l = d.length, c = v.length, l < c && (a = d, d = v, v = a, o = l, l = c, c = o), a = [], o = l + c, n = o; n--; ) a.push(0);
  for (n = c; --n >= 0; ) {
    for (t = 0, i = l + n; i > n; )
      u = a[i] + v[n] * d[i - n - 1] + t, a[i--] = u % ke | 0, t = u / ke | 0;
    a[i] = (a[i] + t) % ke | 0;
  }
  for (; !a[--o]; ) a.pop();
  return t ? ++r : a.shift(), e.d = a, e.e = r, le ? ne(e, f.precision) : e;
};
D.toDecimalPlaces = D.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (Ut(e, 0, An), t === void 0 ? t = n.rounding : Ut(t, 0, 8), ne(r, e + be(r) + 1, t));
};
D.toExponential = function(e, t) {
  var r, n = this, i = n.constructor;
  return e === void 0 ? r = Wr(n, !0) : (Ut(e, 0, An), t === void 0 ? t = i.rounding : Ut(t, 0, 8), n = ne(new i(n), e + 1, t), r = Wr(n, !0, e + 1)), r;
};
D.toFixed = function(e, t) {
  var r, n, i = this, a = i.constructor;
  return e === void 0 ? Wr(i) : (Ut(e, 0, An), t === void 0 ? t = a.rounding : Ut(t, 0, 8), n = ne(new a(i), e + be(i) + 1, t), r = Wr(n.abs(), !1, e + be(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r);
};
D.toInteger = D.toint = function() {
  var e = this, t = e.constructor;
  return ne(new t(e), be(e) + 1, t.rounding);
};
D.toNumber = function() {
  return +this;
};
D.toPower = D.pow = function(e) {
  var t, r, n, i, a, o, u = this, l = u.constructor, c = 12, s = +(e = new l(e));
  if (!e.s) return new l(nt);
  if (u = new l(u), !u.s) {
    if (e.s < 1) throw Error(yt + "Infinity");
    return u;
  }
  if (u.eq(nt)) return u;
  if (n = l.precision, e.eq(nt)) return ne(u, n);
  if (t = e.e, r = e.d.length - 1, o = t >= r, a = u.s, o) {
    if ((r = s < 0 ? -s : s) <= by) {
      for (i = new l(nt), t = Math.ceil(n / ue + 4), le = !1; r % 2 && (i = i.times(u), Yf(i.d, t)), r = On(r / 2), r !== 0; )
        u = u.times(u), Yf(u.d, t);
      return le = !0, e.s < 0 ? new l(nt).div(i) : ne(i, n);
    }
  } else if (a < 0) throw Error(yt + "NaN");
  return a = a < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, u.s = 1, le = !1, i = e.times(ei(u, n + c)), le = !0, i = wy(i), i.s = a, i;
};
D.toPrecision = function(e, t) {
  var r, n, i = this, a = i.constructor;
  return e === void 0 ? (r = be(i), n = Wr(i, r <= a.toExpNeg || r >= a.toExpPos)) : (Ut(e, 1, An), t === void 0 ? t = a.rounding : Ut(t, 0, 8), i = ne(new a(i), e, t), r = be(i), n = Wr(i, e <= r || r <= a.toExpNeg, e)), n;
};
D.toSignificantDigits = D.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (Ut(e, 1, An), t === void 0 ? t = n.rounding : Ut(t, 0, 8)), ne(new n(r), e, t);
};
D.toString = D.valueOf = D.val = D.toJSON = D[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = be(e), r = e.constructor;
  return Wr(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function xy(e, t) {
  var r, n, i, a, o, u, l, c, s = e.constructor, f = s.precision;
  if (!e.s || !t.s)
    return t.s || (t = new s(e)), le ? ne(t, f) : t;
  if (l = e.d, c = t.d, o = e.e, i = t.e, l = l.slice(), a = o - i, a) {
    for (a < 0 ? (n = l, a = -a, u = c.length) : (n = c, i = o, u = l.length), o = Math.ceil(f / ue), u = o > u ? o + 1 : u + 1, a > u && (a = u, n.length = 1), n.reverse(); a--; ) n.push(0);
    n.reverse();
  }
  for (u = l.length, a = c.length, u - a < 0 && (a = u, n = c, c = l, l = n), r = 0; a; )
    r = (l[--a] = l[a] + c[a] + r) / ke | 0, l[a] %= ke;
  for (r && (l.unshift(r), ++i), u = l.length; l[--u] == 0; ) l.pop();
  return t.d = l, t.e = i, le ? ne(t, f) : t;
}
function Ut(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(Nr + e);
}
function Rt(e) {
  var t, r, n, i = e.length - 1, a = "", o = e[0];
  if (i > 0) {
    for (a += o, t = 1; t < i; t++)
      n = e[t] + "", r = ue - n.length, r && (a += dr(r)), a += n;
    o = e[t], n = o + "", r = ue - n.length, r && (a += dr(r));
  } else if (o === 0)
    return "0";
  for (; o % 10 === 0; ) o /= 10;
  return a + o;
}
var Jt = /* @__PURE__ */ (function() {
  function e(n, i) {
    var a, o = 0, u = n.length;
    for (n = n.slice(); u--; )
      a = n[u] * i + o, n[u] = a % ke | 0, o = a / ke | 0;
    return o && n.unshift(o), n;
  }
  function t(n, i, a, o) {
    var u, l;
    if (a != o)
      l = a > o ? 1 : -1;
    else
      for (u = l = 0; u < a; u++)
        if (n[u] != i[u]) {
          l = n[u] > i[u] ? 1 : -1;
          break;
        }
    return l;
  }
  function r(n, i, a) {
    for (var o = 0; a--; )
      n[a] -= o, o = n[a] < i[a] ? 1 : 0, n[a] = o * ke + n[a] - i[a];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, i, a, o) {
    var u, l, c, s, f, d, v, h, p, y, m, b, g, A, O, w, S, _, E = n.constructor, j = n.s == i.s ? 1 : -1, k = n.d, I = i.d;
    if (!n.s) return new E(n);
    if (!i.s) throw Error(yt + "Division by zero");
    for (l = n.e - i.e, S = I.length, O = k.length, v = new E(j), h = v.d = [], c = 0; I[c] == (k[c] || 0); ) ++c;
    if (I[c] > (k[c] || 0) && --l, a == null ? b = a = E.precision : o ? b = a + (be(n) - be(i)) + 1 : b = a, b < 0) return new E(0);
    if (b = b / ue + 2 | 0, c = 0, S == 1)
      for (s = 0, I = I[0], b++; (c < O || s) && b--; c++)
        g = s * ke + (k[c] || 0), h[c] = g / I | 0, s = g % I | 0;
    else {
      for (s = ke / (I[0] + 1) | 0, s > 1 && (I = e(I, s), k = e(k, s), S = I.length, O = k.length), A = S, p = k.slice(0, S), y = p.length; y < S; ) p[y++] = 0;
      _ = I.slice(), _.unshift(0), w = I[0], I[1] >= ke / 2 && ++w;
      do
        s = 0, u = t(I, p, S, y), u < 0 ? (m = p[0], S != y && (m = m * ke + (p[1] || 0)), s = m / w | 0, s > 1 ? (s >= ke && (s = ke - 1), f = e(I, s), d = f.length, y = p.length, u = t(f, p, d, y), u == 1 && (s--, r(f, S < d ? _ : I, d))) : (s == 0 && (u = s = 1), f = I.slice()), d = f.length, d < y && f.unshift(0), r(p, f, y), u == -1 && (y = p.length, u = t(I, p, S, y), u < 1 && (s++, r(p, S < y ? _ : I, y))), y = p.length) : u === 0 && (s++, p = [0]), h[c++] = s, u && p[0] ? p[y++] = k[A] || 0 : (p = [k[A]], y = 1);
      while ((A++ < O || p[0] !== void 0) && b--);
    }
    return h[0] || h.shift(), v.e = l, ne(v, o ? a + be(v) + 1 : a);
  };
})();
function wy(e, t) {
  var r, n, i, a, o, u, l = 0, c = 0, s = e.constructor, f = s.precision;
  if (be(e) > 16) throw Error(Bl + be(e));
  if (!e.s) return new s(nt);
  for (le = !1, u = f, o = new s(0.03125); e.abs().gte(0.1); )
    e = e.times(o), c += 5;
  for (n = Math.log(kr(2, c)) / Math.LN10 * 2 + 5 | 0, u += n, r = i = a = new s(nt), s.precision = u; ; ) {
    if (i = ne(i.times(e), u), r = r.times(++l), o = a.plus(Jt(i, r, u)), Rt(o.d).slice(0, u) === Rt(a.d).slice(0, u)) {
      for (; c--; ) a = ne(a.times(a), u);
      return s.precision = f, t == null ? (le = !0, ne(a, f)) : a;
    }
    a = o;
  }
}
function be(e) {
  for (var t = e.e * ue, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function Xo(e, t, r) {
  if (t > e.LN10.sd())
    throw le = !0, r && (e.precision = r), Error(yt + "LN10 precision limit exceeded");
  return ne(new e(e.LN10), t);
}
function dr(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function ei(e, t) {
  var r, n, i, a, o, u, l, c, s, f = 1, d = 10, v = e, h = v.d, p = v.constructor, y = p.precision;
  if (v.s < 1) throw Error(yt + (v.s ? "NaN" : "-Infinity"));
  if (v.eq(nt)) return new p(0);
  if (t == null ? (le = !1, c = y) : c = t, v.eq(10))
    return t == null && (le = !0), Xo(p, c);
  if (c += d, p.precision = c, r = Rt(h), n = r.charAt(0), a = be(v), Math.abs(a) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      v = v.times(e), r = Rt(v.d), n = r.charAt(0), f++;
    a = be(v), n > 1 ? (v = new p("0." + r), a++) : v = new p(n + "." + r.slice(1));
  } else
    return l = Xo(p, c + 2, y).times(a + ""), v = ei(new p(n + "." + r.slice(1)), c - d).plus(l), p.precision = y, t == null ? (le = !0, ne(v, y)) : v;
  for (u = o = v = Jt(v.minus(nt), v.plus(nt), c), s = ne(v.times(v), c), i = 3; ; ) {
    if (o = ne(o.times(s), c), l = u.plus(Jt(o, new p(i), c)), Rt(l.d).slice(0, c) === Rt(u.d).slice(0, c))
      return u = u.times(2), a !== 0 && (u = u.plus(Xo(p, c + 2, y).times(a + ""))), u = Jt(u, new p(f), c), p.precision = y, t == null ? (le = !0, ne(u, y)) : u;
    u = l, i += 2;
  }
}
function Hf(e, t) {
  var r, n, i;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (i = t.length; t.charCodeAt(i - 1) === 48; ) --i;
  if (t = t.slice(n, i), t) {
    if (i -= n, r = r - n - 1, e.e = On(r / ue), e.d = [], n = (r + 1) % ue, r < 0 && (n += ue), n < i) {
      for (n && e.d.push(+t.slice(0, n)), i -= ue; n < i; ) e.d.push(+t.slice(n, n += ue));
      t = t.slice(n), n = ue - t.length;
    } else
      n -= i;
    for (; n--; ) t += "0";
    if (e.d.push(+t), le && (e.e > ba || e.e < -ba)) throw Error(Bl + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function ne(e, t, r) {
  var n, i, a, o, u, l, c, s, f = e.d;
  for (o = 1, a = f[0]; a >= 10; a /= 10) o++;
  if (n = t - o, n < 0)
    n += ue, i = t, c = f[s = 0];
  else {
    if (s = Math.ceil((n + 1) / ue), a = f.length, s >= a) return e;
    for (c = a = f[s], o = 1; a >= 10; a /= 10) o++;
    n %= ue, i = n - ue + o;
  }
  if (r !== void 0 && (a = kr(10, o - i - 1), u = c / a % 10 | 0, l = t < 0 || f[s + 1] !== void 0 || c % a, l = r < 4 ? (u || l) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : u > 5 || u == 5 && (r == 4 || l || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? i > 0 ? c / kr(10, o - i) : 0 : f[s - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !f[0])
    return l ? (a = be(e), f.length = 1, t = t - a - 1, f[0] = kr(10, (ue - t % ue) % ue), e.e = On(-t / ue) || 0) : (f.length = 1, f[0] = e.e = e.s = 0), e;
  if (n == 0 ? (f.length = s, a = 1, s--) : (f.length = s + 1, a = kr(10, ue - n), f[s] = i > 0 ? (c / kr(10, o - i) % kr(10, i) | 0) * a : 0), l)
    for (; ; )
      if (s == 0) {
        (f[0] += a) == ke && (f[0] = 1, ++e.e);
        break;
      } else {
        if (f[s] += a, f[s] != ke) break;
        f[s--] = 0, a = 1;
      }
  for (n = f.length; f[--n] === 0; ) f.pop();
  if (le && (e.e > ba || e.e < -ba))
    throw Error(Bl + be(e));
  return e;
}
function Ay(e, t) {
  var r, n, i, a, o, u, l, c, s, f, d = e.constructor, v = d.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new d(e), le ? ne(t, v) : t;
  if (l = e.d, f = t.d, n = t.e, c = e.e, l = l.slice(), o = c - n, o) {
    for (s = o < 0, s ? (r = l, o = -o, u = f.length) : (r = f, n = c, u = l.length), i = Math.max(Math.ceil(v / ue), u) + 2, o > i && (o = i, r.length = 1), r.reverse(), i = o; i--; ) r.push(0);
    r.reverse();
  } else {
    for (i = l.length, u = f.length, s = i < u, s && (u = i), i = 0; i < u; i++)
      if (l[i] != f[i]) {
        s = l[i] < f[i];
        break;
      }
    o = 0;
  }
  for (s && (r = l, l = f, f = r, t.s = -t.s), u = l.length, i = f.length - u; i > 0; --i) l[u++] = 0;
  for (i = f.length; i > o; ) {
    if (l[--i] < f[i]) {
      for (a = i; a && l[--a] === 0; ) l[a] = ke - 1;
      --l[a], l[i] += ke;
    }
    l[i] -= f[i];
  }
  for (; l[--u] === 0; ) l.pop();
  for (; l[0] === 0; l.shift()) --n;
  return l[0] ? (t.d = l, t.e = n, le ? ne(t, v) : t) : new d(0);
}
function Wr(e, t, r) {
  var n, i = be(e), a = Rt(e.d), o = a.length;
  return t ? (r && (n = r - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + dr(n) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + dr(-i - 1) + a, r && (n = r - o) > 0 && (a += dr(n))) : i >= o ? (a += dr(i + 1 - o), r && (n = r - i - 1) > 0 && (a = a + "." + dr(n))) : ((n = i + 1) < o && (a = a.slice(0, n) + "." + a.slice(n)), r && (n = r - o) > 0 && (i + 1 === o && (a += "."), a += dr(n))), e.s < 0 ? "-" + a : a;
}
function Yf(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function Oy(e) {
  var t, r, n;
  function i(a) {
    var o = this;
    if (!(o instanceof i)) return new i(a);
    if (o.constructor = i, a instanceof i) {
      o.s = a.s, o.e = a.e, o.d = (a = a.d) ? a.slice() : a;
      return;
    }
    if (typeof a == "number") {
      if (a * 0 !== 0)
        throw Error(Nr + a);
      if (a > 0)
        o.s = 1;
      else if (a < 0)
        a = -a, o.s = -1;
      else {
        o.s = 0, o.e = 0, o.d = [0];
        return;
      }
      if (a === ~~a && a < 1e7) {
        o.e = 0, o.d = [a];
        return;
      }
      return Hf(o, a.toString());
    } else if (typeof a != "string")
      throw Error(Nr + a);
    if (a.charCodeAt(0) === 45 ? (a = a.slice(1), o.s = -1) : o.s = 1, YS.test(a)) Hf(o, a);
    else throw Error(Nr + a);
  }
  if (i.prototype = D, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = Oy, i.config = i.set = qS, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return i.config(e), i;
}
function qS(e) {
  if (!e || typeof e != "object")
    throw Error(yt + "Object expected");
  var t, r, n, i = [
    "precision",
    1,
    An,
    "rounding",
    0,
    8,
    "toExpNeg",
    -1 / 0,
    0,
    "toExpPos",
    0,
    1 / 0
  ];
  for (t = 0; t < i.length; t += 3)
    if ((n = e[r = i[t]]) !== void 0)
      if (On(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(Nr + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(Nr + r + ": " + n);
  return this;
}
var Wl = Oy(HS);
nt = new Wl(1);
const G = Wl;
function Py(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new G(e).abs().log(10).toNumber()) + 1, t;
}
function Sy(e, t, r) {
  for (var n = new G(e), i = 0, a = []; n.lt(t) && i < 1e5; )
    a.push(n.toNumber()), n = n.add(r), i++;
  return a;
}
function ti(e, t) {
  return ZS(e) || XS(e, t) || VS(e, t) || GS();
}
function GS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function VS(e, t) {
  if (e) {
    if (typeof e == "string") return qf(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? qf(e, t) : void 0;
  }
}
function qf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function XS(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function ZS(e) {
  if (Array.isArray(e)) return e;
}
var Iy = (e) => {
  var t = ti(e, 2), r = t[0], n = t[1], i = r, a = n;
  return r > n && (i = n, a = r), [i, a];
}, Fl = (e, t, r) => {
  if (e.lte(0))
    return new G(0);
  var n = Py(e.toNumber()), i = new G(10).pow(n), a = e.div(i), o = n !== 1 ? 0.05 : 0.1, u = new G(Math.ceil(a.div(o).toNumber())).add(r).mul(o), l = u.mul(i);
  return t ? new G(l.toNumber()) : new G(Math.ceil(l.toNumber()));
}, _y = (e, t, r) => {
  var n;
  if (e.lte(0))
    return new G(0);
  var i = [1, 2, 2.5, 5], a = e.toNumber(), o = Math.floor(new G(a).abs().log(10).toNumber()), u = new G(10).pow(o), l = e.div(u).toNumber(), c = i.findIndex((v) => v >= l - 1e-10);
  if (c === -1 && (u = u.mul(10), c = 0), c += r, c >= i.length) {
    var s = Math.floor(c / i.length);
    c %= i.length, u = u.mul(new G(10).pow(s));
  }
  var f = (n = i[c]) !== null && n !== void 0 ? n : 1, d = new G(f).mul(u);
  return t ? d : new G(Math.ceil(d.toNumber()));
}, QS = (e, t, r) => {
  var n = new G(1), i = new G(e);
  if (!i.isint() && r) {
    var a = Math.abs(e);
    a < 1 ? (n = new G(10).pow(Py(e) - 1), i = new G(Math.floor(i.div(n).toNumber())).mul(n)) : a > 1 && (i = new G(Math.floor(e)));
  } else e === 0 ? i = new G(Math.floor((t - 1) / 2)) : r || (i = new G(Math.floor(e)));
  for (var o = Math.floor((t - 1) / 2), u = [], l = 0; l < t; l++)
    u.push(i.add(new G(l - o).mul(n)).toNumber());
  return u;
}, ky = function(t, r, n, i) {
  var a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0, o = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : Fl;
  if (!Number.isFinite((r - t) / (n - 1)))
    return {
      step: new G(0),
      tickMin: new G(0),
      tickMax: new G(0)
    };
  var u = o(new G(r).sub(t).div(n - 1), i, a), l;
  t <= 0 && r >= 0 ? l = new G(0) : (l = new G(t).add(r).div(2), l = l.sub(new G(l).mod(u)));
  var c = Math.ceil(l.sub(t).div(u).toNumber()), s = Math.ceil(new G(r).sub(l).div(u).toNumber()), f = c + s + 1;
  return f > n ? ky(t, r, n, i, a + 1, o) : (f < n && (s = r > 0 ? s + (n - f) : s, c = r > 0 ? c : c + (n - f)), {
    step: u,
    tickMin: l.sub(new G(c).mul(u)),
    tickMax: l.add(new G(s).mul(u))
  });
}, Gf = function(t) {
  var r = ti(t, 2), n = r[0], i = r[1], a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, u = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", l = Math.max(a, 2), c = Iy([n, i]), s = ti(c, 2), f = s[0], d = s[1];
  if (f === -1 / 0 || d === 1 / 0) {
    var v = d === 1 / 0 ? [f, ...Array(a - 1).fill(1 / 0)] : [...Array(a - 1).fill(-1 / 0), d];
    return n > i ? v.reverse() : v;
  }
  if (f === d)
    return QS(f, a, o);
  var h = u === "snap125" ? _y : Fl, p = ky(f, d, l, o, 0, h), y = p.step, m = p.tickMin, b = p.tickMax, g = Sy(m, b.add(new G(0.1).mul(y)), y);
  return n > i ? g.reverse() : g;
}, Vf = function(t, r) {
  var n = ti(t, 2), i = n[0], a = n[1], o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, u = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "auto", l = Iy([i, a]), c = ti(l, 2), s = c[0], f = c[1];
  if (s === -1 / 0 || f === 1 / 0)
    return [i, a];
  if (s === f)
    return [s];
  var d = u === "snap125" ? _y : Fl, v = Math.max(r, 2), h = d(new G(f).sub(s).div(v - 1), o, 0), p = [...Sy(new G(s), new G(f), h), f];
  if (o === !1) {
    p = p.map((m) => Math.round(m));
    var y = p.length - 1;
    y > 0 && p[y] === p[y - 1] && (p = p.slice(0, y));
  }
  return i > a ? p.reverse() : p;
}, jy = (e) => e.rootProps.maxBarSize, JS = (e) => e.rootProps.barGap, Cy = (e) => e.rootProps.barCategoryGap, eI = (e) => e.rootProps.barSize, vo = (e) => e.rootProps.stackOffset, Ey = (e) => e.rootProps.reverseStackOrder, Kl = (e) => e.options.chartName, Ul = (e) => e.rootProps.syncId, Ty = (e) => e.rootProps.syncMethod, Hl = (e) => e.options.eventEmitter, je = {
  /**
   * CartesianGrid and PolarGrid
   */
  grid: -100,
  /**
   * Background of Bar and RadialBar.
   * This is not visible by default but can be enabled by setting background={true} on Bar or RadialBar.
   */
  barBackground: -50,
  /*
   * other chart elements or custom elements without specific zIndex
   * render in here, at zIndex 0
   */
  /**
   * Area, Pie, Radar, and ReferenceArea
   */
  area: 100,
  /**
   * Cursor is embedded inside Tooltip and controlled by it.
   * The Tooltip itself has a separate portal and is not included in the zIndex system;
   * Cursor is the decoration inside the chart area. CursorRectangle is a rectangle box.
   * It renders below bar so that in a stacked bar chart the cursor rectangle does not hide the other bars.
   */
  cursorRectangle: 200,
  /**
   * Bar and RadialBar
   */
  bar: 300,
  /**
   * Line and ReferenceLine, and ErrorBor
   */
  line: 400,
  /**
   * XAxis and YAxis and PolarAngleAxis and PolarRadiusAxis ticks and lines and children
   */
  axis: 500,
  /**
   * Scatter and ReferenceDot,
   * and Dots of Line and Area and Radar if they have dot=true
   */
  scatter: 600,
  /**
   * Hovering over a Bar or RadialBar renders a highlight rectangle
   */
  activeBar: 1e3,
  /**
   * Cursor is embedded inside Tooltip and controlled by it.
   * The Tooltip itself has a separate portal and is not included in the zIndex system;
   * Cursor is the decoration inside the chart area, usually a cross or a box.
   * CursorLine is a line cursor rendered in Line, Area, Scatter, Radar charts.
   * It renders above the Line and Scatter so that it is always visible.
   * It renders below active dot so that the dot is always visible and shows the current point.
   * We're also assuming that the active dot is small enough that it does not fully cover the cursor line.
   *
   * This also applies to the radial cursor in RadialBarChart.
   */
  cursorLine: 1100,
  /**
   * Hovering over a Point in Line, Area, Scatter, Radar renders a highlight dot
   */
  activeDot: 1200,
  /**
   * LabelList and Label, including Axis labels
   */
  label: 2e3
}, Or = {
  allowDecimals: !1,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  allowDataOverflow: !1,
  angleAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  type: "auto"
}, $t = {
  allowDataOverflow: !1,
  allowDecimals: !1,
  allowDuplicatedCategory: !0,
  includeHidden: !1,
  radiusAxisId: 0,
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  type: "auto"
}, ho = (e, t) => {
  if (!(!e || !t))
    return e != null && e.reversed ? [t[1], t[0]] : t;
};
function po(e, t, r) {
  if (r !== "auto")
    return r;
  if (e != null)
    return or(e, t) ? "category" : "number";
}
function Xf(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function xa(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Xf(Object(r), !0).forEach(function(n) {
      tI(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Xf(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function tI(e, t, r) {
  return (t = rI(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function rI(e) {
  var t = nI(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function nI(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Zf = {
  allowDataOverflow: Or.allowDataOverflow,
  allowDecimals: Or.allowDecimals,
  allowDuplicatedCategory: !1,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: void 0,
  domain: void 0,
  id: Or.angleAxisId,
  includeHidden: !1,
  name: void 0,
  reversed: Or.reversed,
  scale: Or.scale,
  tick: Or.tick,
  tickCount: void 0,
  ticks: void 0,
  type: Or.type,
  unit: void 0,
  niceTicks: "auto"
}, Qf = {
  allowDataOverflow: $t.allowDataOverflow,
  allowDecimals: $t.allowDecimals,
  allowDuplicatedCategory: $t.allowDuplicatedCategory,
  dataKey: void 0,
  domain: void 0,
  id: $t.radiusAxisId,
  includeHidden: $t.includeHidden,
  name: void 0,
  reversed: $t.reversed,
  scale: $t.scale,
  tick: $t.tick,
  tickCount: $t.tickCount,
  ticks: void 0,
  type: $t.type,
  unit: void 0,
  niceTicks: "auto"
}, iI = (e, t) => {
  if (t != null)
    return e.polarAxis.angleAxis[t];
}, Yl = P([iI, ny], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = po(t, "angleAxis", Zf.type)) !== null && r !== void 0 ? r : "category";
  return xa(xa({}, Zf), {}, {
    type: n
  });
}), aI = (e, t) => e.polarAxis.radiusAxis[t], ql = P([aI, ny], (e, t) => {
  var r;
  if (e != null)
    return e;
  var n = (r = po(t, "radiusAxis", Qf.type)) !== null && r !== void 0 ? r : "category";
  return xa(xa({}, Qf), {}, {
    type: n
  });
}), yo = (e) => e.polarOptions, Gl = P([Ht, Yt, Ce], SS), My = P([yo, Gl], (e, t) => {
  if (e != null)
    return kt(e.innerRadius, t, 0);
}), Dy = P([yo, Gl], (e, t) => {
  if (e != null)
    return kt(e.outerRadius, t, t * 0.8);
}), oI = (e) => {
  if (e == null)
    return [0, 0];
  var t = e.startAngle, r = e.endAngle;
  return [t, r];
}, $y = P([yo], oI);
P([Yl, $y], ho);
var Ny = P([Gl, My, Dy], (e, t, r) => {
  if (!(e == null || t == null || r == null))
    return [t, r];
});
P([ql, Ny], ho);
var Ly = P([J, yo, My, Dy, Ht, Yt], (e, t, r, n, i, a) => {
  if (!(e !== "centric" && e !== "radial" || t == null || r == null || n == null)) {
    var o = t.cx, u = t.cy, l = t.startAngle, c = t.endAngle;
    return {
      cx: kt(o, i, i / 2),
      cy: kt(u, a, a / 2),
      innerRadius: r,
      outerRadius: n,
      startAngle: l,
      endAngle: c,
      clockWise: !1
      // this property look useful, why not use it?
    };
  }
}), Ee = (e, t) => t, mo = (e, t, r) => r;
function Vl(e) {
  return e?.id;
}
function Ry(e, t, r) {
  var n = t.chartData, i = n === void 0 ? [] : n, a = r.allowDuplicatedCategory, o = r.dataKey, u = /* @__PURE__ */ new Map();
  return e.forEach((l) => {
    var c, s = (c = l.data) !== null && c !== void 0 ? c : i;
    if (!(s == null || s.length === 0)) {
      var f = Vl(l);
      s.forEach((d, v) => {
        var h = o == null || a ? v : String(he(d, o, null)), p = he(d, l.dataKey, 0), y;
        u.has(h) ? y = u.get(h) : y = {}, Object.assign(y, {
          [f]: p
        }), u.set(h, y);
      });
    }
  }), Array.from(u.values());
}
function go(e) {
  return "stackId" in e && e.stackId != null && e.dataKey != null;
}
var mi = (e, t) => e === t ? !0 : e == null || t == null ? !1 : e[0] === t[0] && e[1] === t[1];
function bo(e, t) {
  return Array.isArray(e) && Array.isArray(t) && e.length === 0 && t.length === 0 ? !0 : e === t;
}
function uI(e, t) {
  if (e.length === t.length) {
    for (var r = 0; r < e.length; r++)
      if (e[r] !== t[r])
        return !1;
    return !0;
  }
  return !1;
}
var Te = (e) => {
  var t = J(e);
  return t === "horizontal" ? "xAxis" : t === "vertical" ? "yAxis" : t === "centric" ? "angleAxis" : "radiusAxis";
}, Pn = (e) => e.tooltip.settings.axisId;
function Xl(e) {
  if (e != null) {
    var t = e.ticks, r = e.bandwidth, n = e.range(), i = [Math.min(...n), Math.max(...n)];
    return {
      domain: () => e.domain(),
      range: (function(a) {
        function o() {
          return a.apply(this, arguments);
        }
        return o.toString = function() {
          return a.toString();
        }, o;
      })(() => i),
      rangeMin: () => i[0],
      rangeMax: () => i[1],
      isInRange(a) {
        var o = i[0], u = i[1];
        return o <= u ? a >= o && a <= u : a >= u && a <= o;
      },
      bandwidth: r ? () => r.call(e) : void 0,
      ticks: t ? (a) => t.call(e, a) : void 0,
      map: (a, o) => {
        var u = e(a);
        if (u != null) {
          if (e.bandwidth && o !== null && o !== void 0 && o.position) {
            var l = e.bandwidth();
            switch (o.position) {
              case "middle":
                u += l / 2;
                break;
              case "end":
                u += l;
                break;
            }
          }
          return u;
        }
      }
    };
  }
}
var lI = (e, t) => {
  if (t != null)
    switch (e) {
      case "linear": {
        if (!zt(t)) {
          for (var r, n, i = 0; i < t.length; i++) {
            var a = t[i];
            V(a) && ((r === void 0 || a < r) && (r = a), (n === void 0 || a > n) && (n = a));
          }
          return r !== void 0 && n !== void 0 ? [r, n] : void 0;
        }
        return t;
      }
      default:
        return t;
    }
};
function pr(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function cI(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Zl(e) {
  let t, r, n;
  e.length !== 2 ? (t = pr, r = (u, l) => pr(e(u), l), n = (u, l) => e(u) - l) : (t = e === pr || e === cI ? e : sI, r = e, n = e);
  function i(u, l, c = 0, s = u.length) {
    if (c < s) {
      if (t(l, l) !== 0) return s;
      do {
        const f = c + s >>> 1;
        r(u[f], l) < 0 ? c = f + 1 : s = f;
      } while (c < s);
    }
    return c;
  }
  function a(u, l, c = 0, s = u.length) {
    if (c < s) {
      if (t(l, l) !== 0) return s;
      do {
        const f = c + s >>> 1;
        r(u[f], l) <= 0 ? c = f + 1 : s = f;
      } while (c < s);
    }
    return c;
  }
  function o(u, l, c = 0, s = u.length) {
    const f = i(u, l, c, s - 1);
    return f > c && n(u[f - 1], l) > -n(u[f], l) ? f - 1 : f;
  }
  return { left: i, center: o, right: a };
}
function sI() {
  return 0;
}
function zy(e) {
  return e === null ? NaN : +e;
}
function* fI(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const dI = Zl(pr), gi = dI.right;
Zl(zy).center;
class Jf extends Map {
  constructor(t, r = pI) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, i] of t) this.set(n, i);
  }
  get(t) {
    return super.get(ed(this, t));
  }
  has(t) {
    return super.has(ed(this, t));
  }
  set(t, r) {
    return super.set(vI(this, t), r);
  }
  delete(t) {
    return super.delete(hI(this, t));
  }
}
function ed({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function vI({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function hI({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function pI(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function yI(e = pr) {
  if (e === pr) return By;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function By(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const mI = Math.sqrt(50), gI = Math.sqrt(10), bI = Math.sqrt(2);
function wa(e, t, r) {
  const n = (t - e) / Math.max(0, r), i = Math.floor(Math.log10(n)), a = n / Math.pow(10, i), o = a >= mI ? 10 : a >= gI ? 5 : a >= bI ? 2 : 1;
  let u, l, c;
  return i < 0 ? (c = Math.pow(10, -i) / o, u = Math.round(e * c), l = Math.round(t * c), u / c < e && ++u, l / c > t && --l, c = -c) : (c = Math.pow(10, i) * o, u = Math.round(e / c), l = Math.round(t / c), u * c < e && ++u, l * c > t && --l), l < u && 0.5 <= r && r < 2 ? wa(e, t, r * 2) : [u, l, c];
}
function Wu(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [i, a, o] = n ? wa(t, e, r) : wa(e, t, r);
  if (!(a >= i)) return [];
  const u = a - i + 1, l = new Array(u);
  if (n)
    if (o < 0) for (let c = 0; c < u; ++c) l[c] = (a - c) / -o;
    else for (let c = 0; c < u; ++c) l[c] = (a - c) * o;
  else if (o < 0) for (let c = 0; c < u; ++c) l[c] = (i + c) / -o;
  else for (let c = 0; c < u; ++c) l[c] = (i + c) * o;
  return l;
}
function Fu(e, t, r) {
  return t = +t, e = +e, r = +r, wa(e, t, r)[2];
}
function Ku(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, i = n ? Fu(t, e, r) : Fu(e, t, r);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function td(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function rd(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function Wy(e, t, r = 0, n = 1 / 0, i) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (i = i === void 0 ? By : yI(i); n > r; ) {
    if (n - r > 600) {
      const l = n - r + 1, c = t - r + 1, s = Math.log(l), f = 0.5 * Math.exp(2 * s / 3), d = 0.5 * Math.sqrt(s * f * (l - f) / l) * (c - l / 2 < 0 ? -1 : 1), v = Math.max(r, Math.floor(t - c * f / l + d)), h = Math.min(n, Math.floor(t + (l - c) * f / l + d));
      Wy(e, t, v, h, i);
    }
    const a = e[t];
    let o = r, u = n;
    for (Ln(e, r, t), i(e[n], a) > 0 && Ln(e, r, n); o < u; ) {
      for (Ln(e, o, u), ++o, --u; i(e[o], a) < 0; ) ++o;
      for (; i(e[u], a) > 0; ) --u;
    }
    i(e[r], a) === 0 ? Ln(e, r, u) : (++u, Ln(e, u, n)), u <= t && (r = u + 1), t <= u && (n = u - 1);
  }
  return e;
}
function Ln(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function xI(e, t, r) {
  if (e = Float64Array.from(fI(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return rd(e);
    if (t >= 1) return td(e);
    var n, i = (n - 1) * t, a = Math.floor(i), o = td(Wy(e, a).subarray(0, a + 1)), u = rd(e.subarray(a + 1));
    return o + (u - o) * (i - a);
  }
}
function wI(e, t, r = zy) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, i = (n - 1) * t, a = Math.floor(i), o = +r(e[a], a, e), u = +r(e[a + 1], a + 1, e);
    return o + (u - o) * (i - a);
  }
}
function AI(e, t, r) {
  e = +e, t = +t, r = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +r;
  for (var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, a = new Array(i); ++n < i; )
    a[n] = e + n * r;
  return a;
}
function bt(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function ur(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
      break;
    }
  }
  return this;
}
const Uu = /* @__PURE__ */ Symbol("implicit");
function Ql() {
  var e = new Jf(), t = [], r = [], n = Uu;
  function i(a) {
    let o = e.get(a);
    if (o === void 0) {
      if (n !== Uu) return n;
      e.set(a, o = t.push(a) - 1);
    }
    return r[o % r.length];
  }
  return i.domain = function(a) {
    if (!arguments.length) return t.slice();
    t = [], e = new Jf();
    for (const o of a)
      e.has(o) || e.set(o, t.push(o) - 1);
    return i;
  }, i.range = function(a) {
    return arguments.length ? (r = Array.from(a), i) : r.slice();
  }, i.unknown = function(a) {
    return arguments.length ? (n = a, i) : n;
  }, i.copy = function() {
    return Ql(t, r).unknown(n);
  }, bt.apply(i, arguments), i;
}
function Jl() {
  var e = Ql().unknown(void 0), t = e.domain, r = e.range, n = 0, i = 1, a, o, u = !1, l = 0, c = 0, s = 0.5;
  delete e.unknown;
  function f() {
    var d = t().length, v = i < n, h = v ? i : n, p = v ? n : i;
    a = (p - h) / Math.max(1, d - l + c * 2), u && (a = Math.floor(a)), h += (p - h - a * (d - l)) * s, o = a * (1 - l), u && (h = Math.round(h), o = Math.round(o));
    var y = AI(d).map(function(m) {
      return h + a * m;
    });
    return r(v ? y.reverse() : y);
  }
  return e.domain = function(d) {
    return arguments.length ? (t(d), f()) : t();
  }, e.range = function(d) {
    return arguments.length ? ([n, i] = d, n = +n, i = +i, f()) : [n, i];
  }, e.rangeRound = function(d) {
    return [n, i] = d, n = +n, i = +i, u = !0, f();
  }, e.bandwidth = function() {
    return o;
  }, e.step = function() {
    return a;
  }, e.round = function(d) {
    return arguments.length ? (u = !!d, f()) : u;
  }, e.padding = function(d) {
    return arguments.length ? (l = Math.min(1, c = +d), f()) : l;
  }, e.paddingInner = function(d) {
    return arguments.length ? (l = Math.min(1, d), f()) : l;
  }, e.paddingOuter = function(d) {
    return arguments.length ? (c = +d, f()) : c;
  }, e.align = function(d) {
    return arguments.length ? (s = Math.max(0, Math.min(1, d)), f()) : s;
  }, e.copy = function() {
    return Jl(t(), [n, i]).round(u).paddingInner(l).paddingOuter(c).align(s);
  }, bt.apply(f(), arguments);
}
function Fy(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return Fy(t());
  }, e;
}
function OI() {
  return Fy(Jl.apply(null, arguments).paddingInner(1));
}
function ec(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function Ky(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function bi() {
}
var ri = 0.7, Aa = 1 / ri, sn = "\\s*([+-]?\\d+)\\s*", ni = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Bt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", PI = /^#([0-9a-f]{3,8})$/, SI = new RegExp(`^rgb\\(${sn},${sn},${sn}\\)$`), II = new RegExp(`^rgb\\(${Bt},${Bt},${Bt}\\)$`), _I = new RegExp(`^rgba\\(${sn},${sn},${sn},${ni}\\)$`), kI = new RegExp(`^rgba\\(${Bt},${Bt},${Bt},${ni}\\)$`), jI = new RegExp(`^hsl\\(${ni},${Bt},${Bt}\\)$`), CI = new RegExp(`^hsla\\(${ni},${Bt},${Bt},${ni}\\)$`), nd = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
ec(bi, ii, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: id,
  // Deprecated! Use color.formatHex.
  formatHex: id,
  formatHex8: EI,
  formatHsl: TI,
  formatRgb: ad,
  toString: ad
});
function id() {
  return this.rgb().formatHex();
}
function EI() {
  return this.rgb().formatHex8();
}
function TI() {
  return Uy(this).formatHsl();
}
function ad() {
  return this.rgb().formatRgb();
}
function ii(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = PI.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? od(t) : r === 3 ? new Qe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? Ni(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? Ni(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = SI.exec(e)) ? new Qe(t[1], t[2], t[3], 1) : (t = II.exec(e)) ? new Qe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = _I.exec(e)) ? Ni(t[1], t[2], t[3], t[4]) : (t = kI.exec(e)) ? Ni(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = jI.exec(e)) ? cd(t[1], t[2] / 100, t[3] / 100, 1) : (t = CI.exec(e)) ? cd(t[1], t[2] / 100, t[3] / 100, t[4]) : nd.hasOwnProperty(e) ? od(nd[e]) : e === "transparent" ? new Qe(NaN, NaN, NaN, 0) : null;
}
function od(e) {
  return new Qe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Ni(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new Qe(e, t, r, n);
}
function MI(e) {
  return e instanceof bi || (e = ii(e)), e ? (e = e.rgb(), new Qe(e.r, e.g, e.b, e.opacity)) : new Qe();
}
function Hu(e, t, r, n) {
  return arguments.length === 1 ? MI(e) : new Qe(e, t, r, n ?? 1);
}
function Qe(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
ec(Qe, Hu, Ky(bi, {
  brighter(e) {
    return e = e == null ? Aa : Math.pow(Aa, e), new Qe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ri : Math.pow(ri, e), new Qe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Qe(Lr(this.r), Lr(this.g), Lr(this.b), Oa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ud,
  // Deprecated! Use color.formatHex.
  formatHex: ud,
  formatHex8: DI,
  formatRgb: ld,
  toString: ld
}));
function ud() {
  return `#${Tr(this.r)}${Tr(this.g)}${Tr(this.b)}`;
}
function DI() {
  return `#${Tr(this.r)}${Tr(this.g)}${Tr(this.b)}${Tr((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function ld() {
  const e = Oa(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Lr(this.r)}, ${Lr(this.g)}, ${Lr(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Oa(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Lr(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Tr(e) {
  return e = Lr(e), (e < 16 ? "0" : "") + e.toString(16);
}
function cd(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new It(e, t, r, n);
}
function Uy(e) {
  if (e instanceof It) return new It(e.h, e.s, e.l, e.opacity);
  if (e instanceof bi || (e = ii(e)), !e) return new It();
  if (e instanceof It) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, i = Math.min(t, r, n), a = Math.max(t, r, n), o = NaN, u = a - i, l = (a + i) / 2;
  return u ? (t === a ? o = (r - n) / u + (r < n) * 6 : r === a ? o = (n - t) / u + 2 : o = (t - r) / u + 4, u /= l < 0.5 ? a + i : 2 - a - i, o *= 60) : u = l > 0 && l < 1 ? 0 : o, new It(o, u, l, e.opacity);
}
function $I(e, t, r, n) {
  return arguments.length === 1 ? Uy(e) : new It(e, t, r, n ?? 1);
}
function It(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
ec(It, $I, Ky(bi, {
  brighter(e) {
    return e = e == null ? Aa : Math.pow(Aa, e), new It(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? ri : Math.pow(ri, e), new It(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, i = 2 * r - n;
    return new Qe(
      Zo(e >= 240 ? e - 240 : e + 120, i, n),
      Zo(e, i, n),
      Zo(e < 120 ? e + 240 : e - 120, i, n),
      this.opacity
    );
  },
  clamp() {
    return new It(sd(this.h), Li(this.s), Li(this.l), Oa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Oa(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${sd(this.h)}, ${Li(this.s) * 100}%, ${Li(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function sd(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Li(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Zo(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const tc = (e) => () => e;
function NI(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function LI(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function RI(e) {
  return (e = +e) == 1 ? Hy : function(t, r) {
    return r - t ? LI(t, r, e) : tc(isNaN(t) ? r : t);
  };
}
function Hy(e, t) {
  var r = t - e;
  return r ? NI(e, r) : tc(isNaN(e) ? t : e);
}
const fd = (function e(t) {
  var r = RI(t);
  function n(i, a) {
    var o = r((i = Hu(i)).r, (a = Hu(a)).r), u = r(i.g, a.g), l = r(i.b, a.b), c = Hy(i.opacity, a.opacity);
    return function(s) {
      return i.r = o(s), i.g = u(s), i.b = l(s), i.opacity = c(s), i + "";
    };
  }
  return n.gamma = e, n;
})(1);
function zI(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), i;
  return function(a) {
    for (i = 0; i < r; ++i) n[i] = e[i] * (1 - a) + t[i] * a;
    return n;
  };
}
function BI(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function WI(e, t) {
  var r = t ? t.length : 0, n = e ? Math.min(r, e.length) : 0, i = new Array(n), a = new Array(r), o;
  for (o = 0; o < n; ++o) i[o] = Sn(e[o], t[o]);
  for (; o < r; ++o) a[o] = t[o];
  return function(u) {
    for (o = 0; o < n; ++o) a[o] = i[o](u);
    return a;
  };
}
function FI(e, t) {
  var r = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function Pa(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function KI(e, t) {
  var r = {}, n = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? r[i] = Sn(e[i], t[i]) : n[i] = t[i];
  return function(a) {
    for (i in r) n[i] = r[i](a);
    return n;
  };
}
var Yu = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Qo = new RegExp(Yu.source, "g");
function UI(e) {
  return function() {
    return e;
  };
}
function HI(e) {
  return function(t) {
    return e(t) + "";
  };
}
function YI(e, t) {
  var r = Yu.lastIndex = Qo.lastIndex = 0, n, i, a, o = -1, u = [], l = [];
  for (e = e + "", t = t + ""; (n = Yu.exec(e)) && (i = Qo.exec(t)); )
    (a = i.index) > r && (a = t.slice(r, a), u[o] ? u[o] += a : u[++o] = a), (n = n[0]) === (i = i[0]) ? u[o] ? u[o] += i : u[++o] = i : (u[++o] = null, l.push({ i: o, x: Pa(n, i) })), r = Qo.lastIndex;
  return r < t.length && (a = t.slice(r), u[o] ? u[o] += a : u[++o] = a), u.length < 2 ? l[0] ? HI(l[0].x) : UI(t) : (t = l.length, function(c) {
    for (var s = 0, f; s < t; ++s) u[(f = l[s]).i] = f.x(c);
    return u.join("");
  });
}
function Sn(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean" ? tc(t) : (r === "number" ? Pa : r === "string" ? (n = ii(t)) ? (t = n, fd) : YI : t instanceof ii ? fd : t instanceof Date ? FI : BI(t) ? zI : Array.isArray(t) ? WI : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? KI : Pa)(e, t);
}
function rc(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function qI(e, t) {
  t === void 0 && (t = e, e = Sn);
  for (var r = 0, n = t.length - 1, i = t[0], a = new Array(n < 0 ? 0 : n); r < n; ) a[r] = e(i, i = t[++r]);
  return function(o) {
    var u = Math.max(0, Math.min(n - 1, Math.floor(o *= n)));
    return a[u](o - u);
  };
}
function GI(e) {
  return function() {
    return e;
  };
}
function Sa(e) {
  return +e;
}
var dd = [0, 1];
function qe(e) {
  return e;
}
function qu(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : GI(isNaN(t) ? NaN : 0.5);
}
function VI(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function XI(e, t, r) {
  var n = e[0], i = e[1], a = t[0], o = t[1];
  return i < n ? (n = qu(i, n), a = r(o, a)) : (n = qu(n, i), a = r(a, o)), function(u) {
    return a(n(u));
  };
}
function ZI(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, i = new Array(n), a = new Array(n), o = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < n; )
    i[o] = qu(e[o], e[o + 1]), a[o] = r(t[o], t[o + 1]);
  return function(u) {
    var l = gi(e, u, 1, n) - 1;
    return a[l](i[l](u));
  };
}
function xi(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function xo() {
  var e = dd, t = dd, r = Sn, n, i, a, o = qe, u, l, c;
  function s() {
    var d = Math.min(e.length, t.length);
    return o !== qe && (o = VI(e[0], e[d - 1])), u = d > 2 ? ZI : XI, l = c = null, f;
  }
  function f(d) {
    return d == null || isNaN(d = +d) ? a : (l || (l = u(e.map(n), t, r)))(n(o(d)));
  }
  return f.invert = function(d) {
    return o(i((c || (c = u(t, e.map(n), Pa)))(d)));
  }, f.domain = function(d) {
    return arguments.length ? (e = Array.from(d, Sa), s()) : e.slice();
  }, f.range = function(d) {
    return arguments.length ? (t = Array.from(d), s()) : t.slice();
  }, f.rangeRound = function(d) {
    return t = Array.from(d), r = rc, s();
  }, f.clamp = function(d) {
    return arguments.length ? (o = d ? !0 : qe, s()) : o !== qe;
  }, f.interpolate = function(d) {
    return arguments.length ? (r = d, s()) : r;
  }, f.unknown = function(d) {
    return arguments.length ? (a = d, f) : a;
  }, function(d, v) {
    return n = d, i = v, s();
  };
}
function nc() {
  return xo()(qe, qe);
}
function QI(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Ia(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"), n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function yn(e) {
  return e = Ia(Math.abs(e)), e ? e[1] : NaN;
}
function JI(e, t) {
  return function(r, n) {
    for (var i = r.length, a = [], o = 0, u = e[0], l = 0; i > 0 && u > 0 && (l + u + 1 > n && (u = Math.max(1, n - l)), a.push(r.substring(i -= u, i + u)), !((l += u + 1) > n)); )
      u = e[o = (o + 1) % e.length];
    return a.reverse().join(t);
  };
}
function e_(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var t_ = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function ai(e) {
  if (!(t = t_.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new ic({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
ai.prototype = ic.prototype;
function ic(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
ic.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function r_(e) {
  e: for (var t = e.length, r = 1, n = -1, i; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = i = r;
        break;
      case "0":
        n === 0 && (n = r), i = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e;
}
var _a;
function n_(e, t) {
  var r = Ia(e, t);
  if (!r) return _a = void 0, e.toPrecision(t);
  var n = r[0], i = r[1], a = i - (_a = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, o = n.length;
  return a === o ? n : a > o ? n + new Array(a - o + 1).join("0") : a > 0 ? n.slice(0, a) + "." + n.slice(a) : "0." + new Array(1 - a).join("0") + Ia(e, Math.max(0, t + a - 1))[0];
}
function vd(e, t) {
  var r = Ia(e, t);
  if (!r) return e + "";
  var n = r[0], i = r[1];
  return i < 0 ? "0." + new Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + new Array(i - n.length + 2).join("0");
}
const hd = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: QI,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => vd(e * 100, t),
  r: vd,
  s: n_,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function pd(e) {
  return e;
}
var yd = Array.prototype.map, md = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function i_(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? pd : JI(yd.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", a = e.numerals === void 0 ? pd : e_(yd.call(e.numerals, String)), o = e.percent === void 0 ? "%" : e.percent + "", u = e.minus === void 0 ? "−" : e.minus + "", l = e.nan === void 0 ? "NaN" : e.nan + "";
  function c(f, d) {
    f = ai(f);
    var v = f.fill, h = f.align, p = f.sign, y = f.symbol, m = f.zero, b = f.width, g = f.comma, A = f.precision, O = f.trim, w = f.type;
    w === "n" ? (g = !0, w = "g") : hd[w] || (A === void 0 && (A = 12), O = !0, w = "g"), (m || v === "0" && h === "=") && (m = !0, v = "0", h = "=");
    var S = (d && d.prefix !== void 0 ? d.prefix : "") + (y === "$" ? r : y === "#" && /[boxX]/.test(w) ? "0" + w.toLowerCase() : ""), _ = (y === "$" ? n : /[%p]/.test(w) ? o : "") + (d && d.suffix !== void 0 ? d.suffix : ""), E = hd[w], j = /[defgprs%]/.test(w);
    A = A === void 0 ? 6 : /[gprs]/.test(w) ? Math.max(1, Math.min(21, A)) : Math.max(0, Math.min(20, A));
    function k(I) {
      var R = S, N = _, L, W, F;
      if (w === "c")
        N = E(I) + N, I = "";
      else {
        I = +I;
        var z = I < 0 || 1 / I < 0;
        if (I = isNaN(I) ? l : E(Math.abs(I), A), O && (I = r_(I)), z && +I == 0 && p !== "+" && (z = !1), R = (z ? p === "(" ? p : u : p === "-" || p === "(" ? "" : p) + R, N = (w === "s" && !isNaN(I) && _a !== void 0 ? md[8 + _a / 3] : "") + N + (z && p === "(" ? ")" : ""), j) {
          for (L = -1, W = I.length; ++L < W; )
            if (F = I.charCodeAt(L), 48 > F || F > 57) {
              N = (F === 46 ? i + I.slice(L + 1) : I.slice(L)) + N, I = I.slice(0, L);
              break;
            }
        }
      }
      g && !m && (I = t(I, 1 / 0));
      var q = R.length + I.length + N.length, U = q < b ? new Array(b - q + 1).join(v) : "";
      switch (g && m && (I = t(U + I, U.length ? b - N.length : 1 / 0), U = ""), h) {
        case "<":
          I = R + I + N + U;
          break;
        case "=":
          I = R + U + I + N;
          break;
        case "^":
          I = U.slice(0, q = U.length >> 1) + R + I + N + U.slice(q);
          break;
        default:
          I = U + R + I + N;
          break;
      }
      return a(I);
    }
    return k.toString = function() {
      return f + "";
    }, k;
  }
  function s(f, d) {
    var v = Math.max(-8, Math.min(8, Math.floor(yn(d) / 3))) * 3, h = Math.pow(10, -v), p = c((f = ai(f), f.type = "f", f), { suffix: md[8 + v / 3] });
    return function(y) {
      return p(h * y);
    };
  }
  return {
    format: c,
    formatPrefix: s
  };
}
var Ri, ac, Yy;
a_({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function a_(e) {
  return Ri = i_(e), ac = Ri.format, Yy = Ri.formatPrefix, Ri;
}
function o_(e) {
  return Math.max(0, -yn(Math.abs(e)));
}
function u_(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(yn(t) / 3))) * 3 - yn(Math.abs(e)));
}
function l_(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, yn(t) - yn(e)) + 1;
}
function qy(e, t, r, n) {
  var i = Ku(e, t, r), a;
  switch (n = ai(n ?? ",f"), n.type) {
    case "s": {
      var o = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(a = u_(i, o)) && (n.precision = a), Yy(n, o);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(a = l_(i, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = a - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(a = o_(i)) && (n.precision = a - (n.type === "%") * 2);
      break;
    }
  }
  return ac(n);
}
function xr(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return Wu(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var i = t();
    return qy(i[0], i[i.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), i = 0, a = n.length - 1, o = n[i], u = n[a], l, c, s = 10;
    for (u < o && (c = o, o = u, u = c, c = i, i = a, a = c); s-- > 0; ) {
      if (c = Fu(o, u, r), c === l)
        return n[i] = o, n[a] = u, t(n);
      if (c > 0)
        o = Math.floor(o / c) * c, u = Math.ceil(u / c) * c;
      else if (c < 0)
        o = Math.ceil(o * c) / c, u = Math.floor(u * c) / c;
      else
        break;
      l = c;
    }
    return e;
  }, e;
}
function Gy() {
  var e = nc();
  return e.copy = function() {
    return xi(e, Gy());
  }, bt.apply(e, arguments), xr(e);
}
function Vy(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, Sa), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return Vy(e).unknown(t);
  }, e = arguments.length ? Array.from(e, Sa) : [0, 1], xr(r);
}
function Xy(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, i = e[r], a = e[n], o;
  return a < i && (o = r, r = n, n = o, o = i, i = a, a = o), e[r] = t.floor(i), e[n] = t.ceil(a), e;
}
function gd(e) {
  return Math.log(e);
}
function bd(e) {
  return Math.exp(e);
}
function c_(e) {
  return -Math.log(-e);
}
function s_(e) {
  return -Math.exp(-e);
}
function f_(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function d_(e) {
  return e === 10 ? f_ : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function v_(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function xd(e) {
  return (t, r) => -e(-t, r);
}
function oc(e) {
  const t = e(gd, bd), r = t.domain;
  let n = 10, i, a;
  function o() {
    return i = v_(n), a = d_(n), r()[0] < 0 ? (i = xd(i), a = xd(a), e(c_, s_)) : e(gd, bd), t;
  }
  return t.base = function(u) {
    return arguments.length ? (n = +u, o()) : n;
  }, t.domain = function(u) {
    return arguments.length ? (r(u), o()) : r();
  }, t.ticks = (u) => {
    const l = r();
    let c = l[0], s = l[l.length - 1];
    const f = s < c;
    f && ([c, s] = [s, c]);
    let d = i(c), v = i(s), h, p;
    const y = u == null ? 10 : +u;
    let m = [];
    if (!(n % 1) && v - d < y) {
      if (d = Math.floor(d), v = Math.ceil(v), c > 0) {
        for (; d <= v; ++d)
          for (h = 1; h < n; ++h)
            if (p = d < 0 ? h / a(-d) : h * a(d), !(p < c)) {
              if (p > s) break;
              m.push(p);
            }
      } else for (; d <= v; ++d)
        for (h = n - 1; h >= 1; --h)
          if (p = d > 0 ? h / a(-d) : h * a(d), !(p < c)) {
            if (p > s) break;
            m.push(p);
          }
      m.length * 2 < y && (m = Wu(c, s, y));
    } else
      m = Wu(d, v, Math.min(v - d, y)).map(a);
    return f ? m.reverse() : m;
  }, t.tickFormat = (u, l) => {
    if (u == null && (u = 10), l == null && (l = n === 10 ? "s" : ","), typeof l != "function" && (!(n % 1) && (l = ai(l)).precision == null && (l.trim = !0), l = ac(l)), u === 1 / 0) return l;
    const c = Math.max(1, n * u / t.ticks().length);
    return (s) => {
      let f = s / a(Math.round(i(s)));
      return f * n < n - 0.5 && (f *= n), f <= c ? l(s) : "";
    };
  }, t.nice = () => r(Xy(r(), {
    floor: (u) => a(Math.floor(i(u))),
    ceil: (u) => a(Math.ceil(i(u)))
  })), t;
}
function Zy() {
  const e = oc(xo()).domain([1, 10]);
  return e.copy = () => xi(e, Zy()).base(e.base()), bt.apply(e, arguments), e;
}
function wd(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function Ad(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function uc(e) {
  var t = 1, r = e(wd(t), Ad(t));
  return r.constant = function(n) {
    return arguments.length ? e(wd(t = +n), Ad(t)) : t;
  }, xr(r);
}
function Qy() {
  var e = uc(xo());
  return e.copy = function() {
    return xi(e, Qy()).constant(e.constant());
  }, bt.apply(e, arguments);
}
function Od(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function h_(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function p_(e) {
  return e < 0 ? -e * e : e * e;
}
function lc(e) {
  var t = e(qe, qe), r = 1;
  function n() {
    return r === 1 ? e(qe, qe) : r === 0.5 ? e(h_, p_) : e(Od(r), Od(1 / r));
  }
  return t.exponent = function(i) {
    return arguments.length ? (r = +i, n()) : r;
  }, xr(t);
}
function cc() {
  var e = lc(xo());
  return e.copy = function() {
    return xi(e, cc()).exponent(e.exponent());
  }, bt.apply(e, arguments), e;
}
function y_() {
  return cc.apply(null, arguments).exponent(0.5);
}
function Pd(e) {
  return Math.sign(e) * e * e;
}
function m_(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function Jy() {
  var e = nc(), t = [0, 1], r = !1, n;
  function i(a) {
    var o = m_(e(a));
    return isNaN(o) ? n : r ? Math.round(o) : o;
  }
  return i.invert = function(a) {
    return e.invert(Pd(a));
  }, i.domain = function(a) {
    return arguments.length ? (e.domain(a), i) : e.domain();
  }, i.range = function(a) {
    return arguments.length ? (e.range((t = Array.from(a, Sa)).map(Pd)), i) : t.slice();
  }, i.rangeRound = function(a) {
    return i.range(a).round(!0);
  }, i.round = function(a) {
    return arguments.length ? (r = !!a, i) : r;
  }, i.clamp = function(a) {
    return arguments.length ? (e.clamp(a), i) : e.clamp();
  }, i.unknown = function(a) {
    return arguments.length ? (n = a, i) : n;
  }, i.copy = function() {
    return Jy(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, bt.apply(i, arguments), xr(i);
}
function em() {
  var e = [], t = [], r = [], n;
  function i() {
    var o = 0, u = Math.max(1, t.length);
    for (r = new Array(u - 1); ++o < u; ) r[o - 1] = wI(e, o / u);
    return a;
  }
  function a(o) {
    return o == null || isNaN(o = +o) ? n : t[gi(r, o)];
  }
  return a.invertExtent = function(o) {
    var u = t.indexOf(o);
    return u < 0 ? [NaN, NaN] : [
      u > 0 ? r[u - 1] : e[0],
      u < r.length ? r[u] : e[e.length - 1]
    ];
  }, a.domain = function(o) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let u of o) u != null && !isNaN(u = +u) && e.push(u);
    return e.sort(pr), i();
  }, a.range = function(o) {
    return arguments.length ? (t = Array.from(o), i()) : t.slice();
  }, a.unknown = function(o) {
    return arguments.length ? (n = o, a) : n;
  }, a.quantiles = function() {
    return r.slice();
  }, a.copy = function() {
    return em().domain(e).range(t).unknown(n);
  }, bt.apply(a, arguments);
}
function tm() {
  var e = 0, t = 1, r = 1, n = [0.5], i = [0, 1], a;
  function o(l) {
    return l != null && l <= l ? i[gi(n, l, 0, r)] : a;
  }
  function u() {
    var l = -1;
    for (n = new Array(r); ++l < r; ) n[l] = ((l + 1) * t - (l - r) * e) / (r + 1);
    return o;
  }
  return o.domain = function(l) {
    return arguments.length ? ([e, t] = l, e = +e, t = +t, u()) : [e, t];
  }, o.range = function(l) {
    return arguments.length ? (r = (i = Array.from(l)).length - 1, u()) : i.slice();
  }, o.invertExtent = function(l) {
    var c = i.indexOf(l);
    return c < 0 ? [NaN, NaN] : c < 1 ? [e, n[0]] : c >= r ? [n[r - 1], t] : [n[c - 1], n[c]];
  }, o.unknown = function(l) {
    return arguments.length && (a = l), o;
  }, o.thresholds = function() {
    return n.slice();
  }, o.copy = function() {
    return tm().domain([e, t]).range(i).unknown(a);
  }, bt.apply(xr(o), arguments);
}
function rm() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function i(a) {
    return a != null && a <= a ? t[gi(e, a, 0, n)] : r;
  }
  return i.domain = function(a) {
    return arguments.length ? (e = Array.from(a), n = Math.min(e.length, t.length - 1), i) : e.slice();
  }, i.range = function(a) {
    return arguments.length ? (t = Array.from(a), n = Math.min(e.length, t.length - 1), i) : t.slice();
  }, i.invertExtent = function(a) {
    var o = t.indexOf(a);
    return [e[o - 1], e[o]];
  }, i.unknown = function(a) {
    return arguments.length ? (r = a, i) : r;
  }, i.copy = function() {
    return rm().domain(e).range(t).unknown(r);
  }, bt.apply(i, arguments);
}
const Jo = /* @__PURE__ */ new Date(), eu = /* @__PURE__ */ new Date();
function Ie(e, t, r, n) {
  function i(a) {
    return e(a = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+a)), a;
  }
  return i.floor = (a) => (e(a = /* @__PURE__ */ new Date(+a)), a), i.ceil = (a) => (e(a = new Date(a - 1)), t(a, 1), e(a), a), i.round = (a) => {
    const o = i(a), u = i.ceil(a);
    return a - o < u - a ? o : u;
  }, i.offset = (a, o) => (t(a = /* @__PURE__ */ new Date(+a), o == null ? 1 : Math.floor(o)), a), i.range = (a, o, u) => {
    const l = [];
    if (a = i.ceil(a), u = u == null ? 1 : Math.floor(u), !(a < o) || !(u > 0)) return l;
    let c;
    do
      l.push(c = /* @__PURE__ */ new Date(+a)), t(a, u), e(a);
    while (c < a && a < o);
    return l;
  }, i.filter = (a) => Ie((o) => {
    if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
  }, (o, u) => {
    if (o >= o)
      if (u < 0) for (; ++u <= 0; )
        for (; t(o, -1), !a(o); )
          ;
      else for (; --u >= 0; )
        for (; t(o, 1), !a(o); )
          ;
  }), r && (i.count = (a, o) => (Jo.setTime(+a), eu.setTime(+o), e(Jo), e(eu), Math.floor(r(Jo, eu))), i.every = (a) => (a = Math.floor(a), !isFinite(a) || !(a > 0) ? null : a > 1 ? i.filter(n ? (o) => n(o) % a === 0 : (o) => i.count(0, o) % a === 0) : i)), i;
}
const ka = Ie(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
ka.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? Ie((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : ka);
ka.range;
const Zt = 1e3, vt = Zt * 60, Qt = vt * 60, nr = Qt * 24, sc = nr * 7, Sd = nr * 30, tu = nr * 365, Mr = Ie((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * Zt);
}, (e, t) => (t - e) / Zt, (e) => e.getUTCSeconds());
Mr.range;
const fc = Ie((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * Zt);
}, (e, t) => {
  e.setTime(+e + t * vt);
}, (e, t) => (t - e) / vt, (e) => e.getMinutes());
fc.range;
const dc = Ie((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * vt);
}, (e, t) => (t - e) / vt, (e) => e.getUTCMinutes());
dc.range;
const vc = Ie((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * Zt - e.getMinutes() * vt);
}, (e, t) => {
  e.setTime(+e + t * Qt);
}, (e, t) => (t - e) / Qt, (e) => e.getHours());
vc.range;
const hc = Ie((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * Qt);
}, (e, t) => (t - e) / Qt, (e) => e.getUTCHours());
hc.range;
const wi = Ie(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * vt) / nr,
  (e) => e.getDate() - 1
);
wi.range;
const wo = Ie((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / nr, (e) => e.getUTCDate() - 1);
wo.range;
const nm = Ie((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / nr, (e) => Math.floor(e / nr));
nm.range;
function qr(e) {
  return Ie((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * vt) / sc);
}
const Ao = qr(0), ja = qr(1), g_ = qr(2), b_ = qr(3), mn = qr(4), x_ = qr(5), w_ = qr(6);
Ao.range;
ja.range;
g_.range;
b_.range;
mn.range;
x_.range;
w_.range;
function Gr(e) {
  return Ie((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / sc);
}
const Oo = Gr(0), Ca = Gr(1), A_ = Gr(2), O_ = Gr(3), gn = Gr(4), P_ = Gr(5), S_ = Gr(6);
Oo.range;
Ca.range;
A_.range;
O_.range;
gn.range;
P_.range;
S_.range;
const pc = Ie((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
pc.range;
const yc = Ie((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
yc.range;
const ir = Ie((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
ir.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Ie((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
ir.range;
const ar = Ie((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
ar.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : Ie((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
ar.range;
function im(e, t, r, n, i, a) {
  const o = [
    [Mr, 1, Zt],
    [Mr, 5, 5 * Zt],
    [Mr, 15, 15 * Zt],
    [Mr, 30, 30 * Zt],
    [a, 1, vt],
    [a, 5, 5 * vt],
    [a, 15, 15 * vt],
    [a, 30, 30 * vt],
    [i, 1, Qt],
    [i, 3, 3 * Qt],
    [i, 6, 6 * Qt],
    [i, 12, 12 * Qt],
    [n, 1, nr],
    [n, 2, 2 * nr],
    [r, 1, sc],
    [t, 1, Sd],
    [t, 3, 3 * Sd],
    [e, 1, tu]
  ];
  function u(c, s, f) {
    const d = s < c;
    d && ([c, s] = [s, c]);
    const v = f && typeof f.range == "function" ? f : l(c, s, f), h = v ? v.range(c, +s + 1) : [];
    return d ? h.reverse() : h;
  }
  function l(c, s, f) {
    const d = Math.abs(s - c) / f, v = Zl(([, , y]) => y).right(o, d);
    if (v === o.length) return e.every(Ku(c / tu, s / tu, f));
    if (v === 0) return ka.every(Math.max(Ku(c, s, f), 1));
    const [h, p] = o[d / o[v - 1][2] < o[v][2] / d ? v - 1 : v];
    return h.every(p);
  }
  return [u, l];
}
const [I_, __] = im(ar, yc, Oo, nm, hc, dc), [k_, j_] = im(ir, pc, Ao, wi, vc, fc);
function ru(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function nu(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Rn(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function C_(e) {
  var t = e.dateTime, r = e.date, n = e.time, i = e.periods, a = e.days, o = e.shortDays, u = e.months, l = e.shortMonths, c = zn(i), s = Bn(i), f = zn(a), d = Bn(a), v = zn(o), h = Bn(o), p = zn(u), y = Bn(u), m = zn(l), b = Bn(l), g = {
    a: F,
    A: z,
    b: q,
    B: U,
    c: null,
    d: Ed,
    e: Ed,
    f: J_,
    g: ck,
    G: fk,
    H: X_,
    I: Z_,
    j: Q_,
    L: am,
    m: ek,
    M: tk,
    p: pe,
    q: ye,
    Q: Dd,
    s: $d,
    S: rk,
    u: nk,
    U: ik,
    V: ak,
    w: ok,
    W: uk,
    x: null,
    X: null,
    y: lk,
    Y: sk,
    Z: dk,
    "%": Md
  }, A = {
    a: fe,
    A: Ye,
    b: tt,
    B: At,
    c: null,
    d: Td,
    e: Td,
    f: yk,
    g: Ik,
    G: kk,
    H: vk,
    I: hk,
    j: pk,
    L: um,
    m: mk,
    M: gk,
    p: Ot,
    q: Tn,
    Q: Dd,
    s: $d,
    S: bk,
    u: xk,
    U: wk,
    V: Ak,
    w: Ok,
    W: Pk,
    x: null,
    X: null,
    y: Sk,
    Y: _k,
    Z: jk,
    "%": Md
  }, O = {
    a: j,
    A: k,
    b: I,
    B: R,
    c: N,
    d: jd,
    e: jd,
    f: Y_,
    g: kd,
    G: _d,
    H: Cd,
    I: Cd,
    j: F_,
    L: H_,
    m: W_,
    M: K_,
    p: E,
    q: B_,
    Q: G_,
    s: V_,
    S: U_,
    u: $_,
    U: N_,
    V: L_,
    w: D_,
    W: R_,
    x: L,
    X: W,
    y: kd,
    Y: _d,
    Z: z_,
    "%": q_
  };
  g.x = w(r, g), g.X = w(n, g), g.c = w(t, g), A.x = w(r, A), A.X = w(n, A), A.c = w(t, A);
  function w(M, H) {
    return function(K) {
      var C = [], Re = -1, ee = 0, B = M.length, rt, Ar, Jc;
      for (K instanceof Date || (K = /* @__PURE__ */ new Date(+K)); ++Re < B; )
        M.charCodeAt(Re) === 37 && (C.push(M.slice(ee, Re)), (Ar = Id[rt = M.charAt(++Re)]) != null ? rt = M.charAt(++Re) : Ar = rt === "e" ? " " : "0", (Jc = H[rt]) && (rt = Jc(K, Ar)), C.push(rt), ee = Re + 1);
      return C.push(M.slice(ee, Re)), C.join("");
    };
  }
  function S(M, H) {
    return function(K) {
      var C = Rn(1900, void 0, 1), Re = _(C, M, K += "", 0), ee, B;
      if (Re != K.length) return null;
      if ("Q" in C) return new Date(C.Q);
      if ("s" in C) return new Date(C.s * 1e3 + ("L" in C ? C.L : 0));
      if (H && !("Z" in C) && (C.Z = 0), "p" in C && (C.H = C.H % 12 + C.p * 12), C.m === void 0 && (C.m = "q" in C ? C.q : 0), "V" in C) {
        if (C.V < 1 || C.V > 53) return null;
        "w" in C || (C.w = 1), "Z" in C ? (ee = nu(Rn(C.y, 0, 1)), B = ee.getUTCDay(), ee = B > 4 || B === 0 ? Ca.ceil(ee) : Ca(ee), ee = wo.offset(ee, (C.V - 1) * 7), C.y = ee.getUTCFullYear(), C.m = ee.getUTCMonth(), C.d = ee.getUTCDate() + (C.w + 6) % 7) : (ee = ru(Rn(C.y, 0, 1)), B = ee.getDay(), ee = B > 4 || B === 0 ? ja.ceil(ee) : ja(ee), ee = wi.offset(ee, (C.V - 1) * 7), C.y = ee.getFullYear(), C.m = ee.getMonth(), C.d = ee.getDate() + (C.w + 6) % 7);
      } else ("W" in C || "U" in C) && ("w" in C || (C.w = "u" in C ? C.u % 7 : "W" in C ? 1 : 0), B = "Z" in C ? nu(Rn(C.y, 0, 1)).getUTCDay() : ru(Rn(C.y, 0, 1)).getDay(), C.m = 0, C.d = "W" in C ? (C.w + 6) % 7 + C.W * 7 - (B + 5) % 7 : C.w + C.U * 7 - (B + 6) % 7);
      return "Z" in C ? (C.H += C.Z / 100 | 0, C.M += C.Z % 100, nu(C)) : ru(C);
    };
  }
  function _(M, H, K, C) {
    for (var Re = 0, ee = H.length, B = K.length, rt, Ar; Re < ee; ) {
      if (C >= B) return -1;
      if (rt = H.charCodeAt(Re++), rt === 37) {
        if (rt = H.charAt(Re++), Ar = O[rt in Id ? H.charAt(Re++) : rt], !Ar || (C = Ar(M, K, C)) < 0) return -1;
      } else if (rt != K.charCodeAt(C++))
        return -1;
    }
    return C;
  }
  function E(M, H, K) {
    var C = c.exec(H.slice(K));
    return C ? (M.p = s.get(C[0].toLowerCase()), K + C[0].length) : -1;
  }
  function j(M, H, K) {
    var C = v.exec(H.slice(K));
    return C ? (M.w = h.get(C[0].toLowerCase()), K + C[0].length) : -1;
  }
  function k(M, H, K) {
    var C = f.exec(H.slice(K));
    return C ? (M.w = d.get(C[0].toLowerCase()), K + C[0].length) : -1;
  }
  function I(M, H, K) {
    var C = m.exec(H.slice(K));
    return C ? (M.m = b.get(C[0].toLowerCase()), K + C[0].length) : -1;
  }
  function R(M, H, K) {
    var C = p.exec(H.slice(K));
    return C ? (M.m = y.get(C[0].toLowerCase()), K + C[0].length) : -1;
  }
  function N(M, H, K) {
    return _(M, t, H, K);
  }
  function L(M, H, K) {
    return _(M, r, H, K);
  }
  function W(M, H, K) {
    return _(M, n, H, K);
  }
  function F(M) {
    return o[M.getDay()];
  }
  function z(M) {
    return a[M.getDay()];
  }
  function q(M) {
    return l[M.getMonth()];
  }
  function U(M) {
    return u[M.getMonth()];
  }
  function pe(M) {
    return i[+(M.getHours() >= 12)];
  }
  function ye(M) {
    return 1 + ~~(M.getMonth() / 3);
  }
  function fe(M) {
    return o[M.getUTCDay()];
  }
  function Ye(M) {
    return a[M.getUTCDay()];
  }
  function tt(M) {
    return l[M.getUTCMonth()];
  }
  function At(M) {
    return u[M.getUTCMonth()];
  }
  function Ot(M) {
    return i[+(M.getUTCHours() >= 12)];
  }
  function Tn(M) {
    return 1 + ~~(M.getUTCMonth() / 3);
  }
  return {
    format: function(M) {
      var H = w(M += "", g);
      return H.toString = function() {
        return M;
      }, H;
    },
    parse: function(M) {
      var H = S(M += "", !1);
      return H.toString = function() {
        return M;
      }, H;
    },
    utcFormat: function(M) {
      var H = w(M += "", A);
      return H.toString = function() {
        return M;
      }, H;
    },
    utcParse: function(M) {
      var H = S(M += "", !0);
      return H.toString = function() {
        return M;
      }, H;
    }
  };
}
var Id = { "-": "", _: " ", 0: "0" }, Me = /^\s*\d+/, E_ = /^%/, T_ = /[\\^$*+?|[\]().{}]/g;
function Z(e, t, r) {
  var n = e < 0 ? "-" : "", i = (n ? -e : e) + "", a = i.length;
  return n + (a < r ? new Array(r - a + 1).join(t) + i : i);
}
function M_(e) {
  return e.replace(T_, "\\$&");
}
function zn(e) {
  return new RegExp("^(?:" + e.map(M_).join("|") + ")", "i");
}
function Bn(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function D_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function $_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function N_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function L_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function R_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function _d(e, t, r) {
  var n = Me.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function kd(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function z_(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function B_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function W_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function jd(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function F_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function Cd(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function K_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function U_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function H_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function Y_(e, t, r) {
  var n = Me.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function q_(e, t, r) {
  var n = E_.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function G_(e, t, r) {
  var n = Me.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function V_(e, t, r) {
  var n = Me.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function Ed(e, t) {
  return Z(e.getDate(), t, 2);
}
function X_(e, t) {
  return Z(e.getHours(), t, 2);
}
function Z_(e, t) {
  return Z(e.getHours() % 12 || 12, t, 2);
}
function Q_(e, t) {
  return Z(1 + wi.count(ir(e), e), t, 3);
}
function am(e, t) {
  return Z(e.getMilliseconds(), t, 3);
}
function J_(e, t) {
  return am(e, t) + "000";
}
function ek(e, t) {
  return Z(e.getMonth() + 1, t, 2);
}
function tk(e, t) {
  return Z(e.getMinutes(), t, 2);
}
function rk(e, t) {
  return Z(e.getSeconds(), t, 2);
}
function nk(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function ik(e, t) {
  return Z(Ao.count(ir(e) - 1, e), t, 2);
}
function om(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? mn(e) : mn.ceil(e);
}
function ak(e, t) {
  return e = om(e), Z(mn.count(ir(e), e) + (ir(e).getDay() === 4), t, 2);
}
function ok(e) {
  return e.getDay();
}
function uk(e, t) {
  return Z(ja.count(ir(e) - 1, e), t, 2);
}
function lk(e, t) {
  return Z(e.getFullYear() % 100, t, 2);
}
function ck(e, t) {
  return e = om(e), Z(e.getFullYear() % 100, t, 2);
}
function sk(e, t) {
  return Z(e.getFullYear() % 1e4, t, 4);
}
function fk(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? mn(e) : mn.ceil(e), Z(e.getFullYear() % 1e4, t, 4);
}
function dk(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + Z(t / 60 | 0, "0", 2) + Z(t % 60, "0", 2);
}
function Td(e, t) {
  return Z(e.getUTCDate(), t, 2);
}
function vk(e, t) {
  return Z(e.getUTCHours(), t, 2);
}
function hk(e, t) {
  return Z(e.getUTCHours() % 12 || 12, t, 2);
}
function pk(e, t) {
  return Z(1 + wo.count(ar(e), e), t, 3);
}
function um(e, t) {
  return Z(e.getUTCMilliseconds(), t, 3);
}
function yk(e, t) {
  return um(e, t) + "000";
}
function mk(e, t) {
  return Z(e.getUTCMonth() + 1, t, 2);
}
function gk(e, t) {
  return Z(e.getUTCMinutes(), t, 2);
}
function bk(e, t) {
  return Z(e.getUTCSeconds(), t, 2);
}
function xk(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function wk(e, t) {
  return Z(Oo.count(ar(e) - 1, e), t, 2);
}
function lm(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? gn(e) : gn.ceil(e);
}
function Ak(e, t) {
  return e = lm(e), Z(gn.count(ar(e), e) + (ar(e).getUTCDay() === 4), t, 2);
}
function Ok(e) {
  return e.getUTCDay();
}
function Pk(e, t) {
  return Z(Ca.count(ar(e) - 1, e), t, 2);
}
function Sk(e, t) {
  return Z(e.getUTCFullYear() % 100, t, 2);
}
function Ik(e, t) {
  return e = lm(e), Z(e.getUTCFullYear() % 100, t, 2);
}
function _k(e, t) {
  return Z(e.getUTCFullYear() % 1e4, t, 4);
}
function kk(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? gn(e) : gn.ceil(e), Z(e.getUTCFullYear() % 1e4, t, 4);
}
function jk() {
  return "+0000";
}
function Md() {
  return "%";
}
function Dd(e) {
  return +e;
}
function $d(e) {
  return Math.floor(+e / 1e3);
}
var en, cm, sm;
Ck({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function Ck(e) {
  return en = C_(e), cm = en.format, en.parse, sm = en.utcFormat, en.utcParse, en;
}
function Ek(e) {
  return new Date(e);
}
function Tk(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function mc(e, t, r, n, i, a, o, u, l, c) {
  var s = nc(), f = s.invert, d = s.domain, v = c(".%L"), h = c(":%S"), p = c("%I:%M"), y = c("%I %p"), m = c("%a %d"), b = c("%b %d"), g = c("%B"), A = c("%Y");
  function O(w) {
    return (l(w) < w ? v : u(w) < w ? h : o(w) < w ? p : a(w) < w ? y : n(w) < w ? i(w) < w ? m : b : r(w) < w ? g : A)(w);
  }
  return s.invert = function(w) {
    return new Date(f(w));
  }, s.domain = function(w) {
    return arguments.length ? d(Array.from(w, Tk)) : d().map(Ek);
  }, s.ticks = function(w) {
    var S = d();
    return e(S[0], S[S.length - 1], w ?? 10);
  }, s.tickFormat = function(w, S) {
    return S == null ? O : c(S);
  }, s.nice = function(w) {
    var S = d();
    return (!w || typeof w.range != "function") && (w = t(S[0], S[S.length - 1], w ?? 10)), w ? d(Xy(S, w)) : s;
  }, s.copy = function() {
    return xi(s, mc(e, t, r, n, i, a, o, u, l, c));
  }, s;
}
function Mk() {
  return bt.apply(mc(k_, j_, ir, pc, Ao, wi, vc, fc, Mr, cm).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function Dk() {
  return bt.apply(mc(I_, __, ar, yc, Oo, wo, hc, dc, Mr, sm).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Po() {
  var e = 0, t = 1, r, n, i, a, o = qe, u = !1, l;
  function c(f) {
    return f == null || isNaN(f = +f) ? l : o(i === 0 ? 0.5 : (f = (a(f) - r) * i, u ? Math.max(0, Math.min(1, f)) : f));
  }
  c.domain = function(f) {
    return arguments.length ? ([e, t] = f, r = a(e = +e), n = a(t = +t), i = r === n ? 0 : 1 / (n - r), c) : [e, t];
  }, c.clamp = function(f) {
    return arguments.length ? (u = !!f, c) : u;
  }, c.interpolator = function(f) {
    return arguments.length ? (o = f, c) : o;
  };
  function s(f) {
    return function(d) {
      var v, h;
      return arguments.length ? ([v, h] = d, o = f(v, h), c) : [o(0), o(1)];
    };
  }
  return c.range = s(Sn), c.rangeRound = s(rc), c.unknown = function(f) {
    return arguments.length ? (l = f, c) : l;
  }, function(f) {
    return a = f, r = f(e), n = f(t), i = r === n ? 0 : 1 / (n - r), c;
  };
}
function wr(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function fm() {
  var e = xr(Po()(qe));
  return e.copy = function() {
    return wr(e, fm());
  }, ur.apply(e, arguments);
}
function dm() {
  var e = oc(Po()).domain([1, 10]);
  return e.copy = function() {
    return wr(e, dm()).base(e.base());
  }, ur.apply(e, arguments);
}
function vm() {
  var e = uc(Po());
  return e.copy = function() {
    return wr(e, vm()).constant(e.constant());
  }, ur.apply(e, arguments);
}
function gc() {
  var e = lc(Po());
  return e.copy = function() {
    return wr(e, gc()).exponent(e.exponent());
  }, ur.apply(e, arguments);
}
function $k() {
  return gc.apply(null, arguments).exponent(0.5);
}
function hm() {
  var e = [], t = qe;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((gi(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let i of n) i != null && !isNaN(i = +i) && e.push(i);
    return e.sort(pr), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, i) => t(i / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (i, a) => xI(e, a / n));
  }, r.copy = function() {
    return hm(t).domain(e);
  }, ur.apply(r, arguments);
}
function So() {
  var e = 0, t = 0.5, r = 1, n = 1, i, a, o, u, l, c = qe, s, f = !1, d;
  function v(p) {
    return isNaN(p = +p) ? d : (p = 0.5 + ((p = +s(p)) - a) * (n * p < n * a ? u : l), c(f ? Math.max(0, Math.min(1, p)) : p));
  }
  v.domain = function(p) {
    return arguments.length ? ([e, t, r] = p, i = s(e = +e), a = s(t = +t), o = s(r = +r), u = i === a ? 0 : 0.5 / (a - i), l = a === o ? 0 : 0.5 / (o - a), n = a < i ? -1 : 1, v) : [e, t, r];
  }, v.clamp = function(p) {
    return arguments.length ? (f = !!p, v) : f;
  }, v.interpolator = function(p) {
    return arguments.length ? (c = p, v) : c;
  };
  function h(p) {
    return function(y) {
      var m, b, g;
      return arguments.length ? ([m, b, g] = y, c = qI(p, [m, b, g]), v) : [c(0), c(0.5), c(1)];
    };
  }
  return v.range = h(Sn), v.rangeRound = h(rc), v.unknown = function(p) {
    return arguments.length ? (d = p, v) : d;
  }, function(p) {
    return s = p, i = p(e), a = p(t), o = p(r), u = i === a ? 0 : 0.5 / (a - i), l = a === o ? 0 : 0.5 / (o - a), n = a < i ? -1 : 1, v;
  };
}
function pm() {
  var e = xr(So()(qe));
  return e.copy = function() {
    return wr(e, pm());
  }, ur.apply(e, arguments);
}
function ym() {
  var e = oc(So()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return wr(e, ym()).base(e.base());
  }, ur.apply(e, arguments);
}
function mm() {
  var e = uc(So());
  return e.copy = function() {
    return wr(e, mm()).constant(e.constant());
  }, ur.apply(e, arguments);
}
function bc() {
  var e = lc(So());
  return e.copy = function() {
    return wr(e, bc()).exponent(e.exponent());
  }, ur.apply(e, arguments);
}
function Nk() {
  return bc.apply(null, arguments).exponent(0.5);
}
const gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: Jl,
  scaleDiverging: pm,
  scaleDivergingLog: ym,
  scaleDivergingPow: bc,
  scaleDivergingSqrt: Nk,
  scaleDivergingSymlog: mm,
  scaleIdentity: Vy,
  scaleImplicit: Uu,
  scaleLinear: Gy,
  scaleLog: Zy,
  scaleOrdinal: Ql,
  scalePoint: OI,
  scalePow: cc,
  scaleQuantile: em,
  scaleQuantize: tm,
  scaleRadial: Jy,
  scaleSequential: fm,
  scaleSequentialLog: dm,
  scaleSequentialPow: gc,
  scaleSequentialQuantile: hm,
  scaleSequentialSqrt: $k,
  scaleSequentialSymlog: vm,
  scaleSqrt: y_,
  scaleSymlog: Qy,
  scaleThreshold: rm,
  scaleTime: Mk,
  scaleUtc: Dk,
  tickFormat: qy
}, Symbol.toStringTag, { value: "Module" }));
function Lk(e) {
  var t = gm;
  if (e in t && typeof t[e] == "function")
    return t[e]();
  var r = "scale".concat(ci(e));
  if (r in t && typeof t[r] == "function")
    return t[r]();
}
function Nd(e, t, r) {
  if (typeof e == "function")
    return e.copy().domain(t).range(r);
  if (e != null) {
    var n = Lk(e);
    if (n != null)
      return n.domain(t).range(r), n;
  }
}
function xc(e, t, r, n) {
  if (!(r == null || n == null))
    return typeof e.scale == "function" ? Nd(e.scale, r, n) : Nd(t, r, n);
}
function Rk(e) {
  return "scale".concat(ci(e));
}
function zk(e) {
  return Rk(e) in gm;
}
var bm = (e, t, r) => {
  if (e != null) {
    var n = e.scale, i = e.type;
    if (n === "auto")
      return i === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !t) ? "point" : i === "category" ? "band" : "linear";
    if (typeof n == "string")
      return zk(n) ? n : "point";
  }
};
function Bk(e, t) {
  for (var r = 0, n = e.length, i = e[0] < e[e.length - 1]; r < n; ) {
    var a = Math.floor((r + n) / 2);
    (i ? e[a] < t : e[a] > t) ? r = a + 1 : n = a;
  }
  return r;
}
function xm(e, t) {
  if (e) {
    var r = t ?? e.domain(), n = r.map((a) => {
      var o;
      return (o = e(a)) !== null && o !== void 0 ? o : 0;
    }), i = e.range();
    if (!(r.length === 0 || i.length < 2))
      return (a) => {
        var o, u, l = Bk(n, a);
        if (l <= 0)
          return r[0];
        if (l >= r.length)
          return r[r.length - 1];
        var c = (o = n[l - 1]) !== null && o !== void 0 ? o : 0, s = (u = n[l]) !== null && u !== void 0 ? u : 0;
        return Math.abs(a - c) <= Math.abs(a - s) ? r[l - 1] : r[l];
      };
  }
}
function Wk(e) {
  if (e != null)
    return "invert" in e && typeof e.invert == "function" ? e.invert.bind(e) : xm(e, void 0);
}
function Ld(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ea(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ld(Object(r), !0).forEach(function(n) {
      Fk(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ld(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Fk(e, t, r) {
  return (t = Kk(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Kk(e) {
  var t = Uk(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Uk(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function wm(e, t) {
  return Gk(e) || qk(e, t) || Yk(e, t) || Hk();
}
function Hk() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Yk(e, t) {
  if (e) {
    if (typeof e == "string") return Rd(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Rd(e, t) : void 0;
  }
}
function Rd(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qk(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function Gk(e) {
  if (Array.isArray(e)) return e;
}
var Gu = [0, "auto"], Ae = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: void 0,
  height: 30,
  hide: !0,
  id: 0,
  includeHidden: !1,
  interval: "preserveEnd",
  minTickGap: 5,
  mirror: !1,
  name: void 0,
  orientation: "bottom",
  padding: {
    left: 0,
    right: 0
  },
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  tickFormatter: void 0,
  ticks: void 0,
  type: "category",
  unit: void 0,
  niceTicks: "auto"
}, Am = (e, t) => e.cartesianAxis.xAxis[t], lr = (e, t) => {
  var r = Am(e, t);
  return r ?? Ae;
}, Oe = {
  allowDataOverflow: !1,
  allowDecimals: !0,
  allowDuplicatedCategory: !0,
  angle: 0,
  dataKey: void 0,
  domain: Gu,
  hide: !0,
  id: 0,
  includeHidden: !1,
  interval: "preserveEnd",
  minTickGap: 5,
  mirror: !1,
  name: void 0,
  orientation: "left",
  padding: {
    top: 0,
    bottom: 0
  },
  reversed: !1,
  scale: "auto",
  tick: !0,
  tickCount: 5,
  tickFormatter: void 0,
  ticks: void 0,
  type: "number",
  unit: void 0,
  niceTicks: "auto",
  width: di
}, Om = (e, t) => e.cartesianAxis.yAxis[t], cr = (e, t) => {
  var r = Om(e, t);
  return r ?? Oe;
}, Vk = {
  domain: [0, "auto"],
  includeHidden: !1,
  reversed: !1,
  allowDataOverflow: !1,
  allowDuplicatedCategory: !1,
  dataKey: void 0,
  id: 0,
  name: "",
  range: [64, 64],
  scale: "auto",
  type: "number",
  unit: ""
}, wc = (e, t) => {
  var r = e.cartesianAxis.zAxis[t];
  return r ?? Vk;
}, He = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return lr(e, r);
    case "yAxis":
      return cr(e, r);
    case "zAxis":
      return wc(e, r);
    case "angleAxis":
      return Yl(e, r);
    case "radiusAxis":
      return ql(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, Xk = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return lr(e, r);
    case "yAxis":
      return cr(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, Ai = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return lr(e, r);
    case "yAxis":
      return cr(e, r);
    case "angleAxis":
      return Yl(e, r);
    case "radiusAxis":
      return ql(e, r);
    default:
      throw new Error("Unexpected axis type: ".concat(t));
  }
}, Pm = (e) => e.graphicalItems.cartesianItems.some((t) => t.type === "bar") || e.graphicalItems.polarItems.some((t) => t.type === "radialBar");
function Sm(e, t) {
  return (r) => {
    switch (e) {
      case "xAxis":
        return "xAxisId" in r && r.xAxisId === t;
      case "yAxis":
        return "yAxisId" in r && r.yAxisId === t;
      case "zAxis":
        return "zAxisId" in r && r.zAxisId === t;
      case "angleAxis":
        return "angleAxisId" in r && r.angleAxisId === t;
      case "radiusAxis":
        return "radiusAxisId" in r && r.radiusAxisId === t;
      default:
        return !1;
    }
  };
}
var Io = (e) => e.graphicalItems.cartesianItems, Zk = P([Ee, mo], Sm), Im = (e, t, r) => e.filter(r).filter((n) => t?.includeHidden === !0 ? !0 : !n.hide), In = P([Io, He, Zk], Im, {
  memoizeOptions: {
    resultEqualityCheck: bo
  }
}), _m = P([In], (e) => e.filter((t) => t.type === "area" || t.type === "bar").filter(go)), km = (e) => e.filter((t) => !("stackId" in t) || t.stackId === void 0), Qk = P([In], km), jm = (e) => e.map((t) => t.data).filter(Boolean).flat(1), Jk = P([In], (e) => e.some((t) => !t.data)), Cm = P([In], jm, {
  memoizeOptions: {
    resultEqualityCheck: bo
  }
}), Em = (e, t) => {
  var r = t.chartData, n = r === void 0 ? [] : r, i = t.dataStartIndex, a = t.dataEndIndex;
  return e.length > 0 ? e : n.slice(i, a + 1);
}, Ac = P([Cm, yi], Em), ej = (e, t, r) => t?.dataKey != null ? e.map((n) => ({
  value: he(n, t.dataKey)
})) : r.length > 0 ? r.map((n) => n.dataKey).flatMap((n) => e.map((i) => ({
  value: he(i, n)
}))) : e.map((n) => ({
  value: n
})), Tm = (e, t, r, n, i, a) => {
  var o = n.chartData, u = o === void 0 ? [] : o, l = n.dataStartIndex, c = n.dataEndIndex, s = ej(e, t, r);
  if (i && t?.dataKey != null && a.length > 0) {
    var f = u.slice(l, c + 1), d = f.map((v) => ({
      value: he(v, t.dataKey)
    })).filter((v) => v.value != null);
    return [...d, ...s];
  }
  return s;
}, Oi = P([Ac, He, In, yi, Jk, Cm], Tm);
function fn(e) {
  if (Ft(e) || e instanceof Date) {
    var t = Number(e);
    if (V(t))
      return t;
  }
}
function zd(e) {
  if (Array.isArray(e)) {
    var t = [fn(e[0]), fn(e[1])];
    return zt(t) ? t : void 0;
  }
  var r = fn(e);
  if (r != null)
    return [r, r];
}
function jt(e) {
  return e.map(fn).filter(Ze);
}
function tj(e, t) {
  var r = fn(e), n = fn(t);
  return r == null && n == null ? 0 : r == null ? -1 : n == null ? 1 : r - n;
}
var rj = P([Oi], (e) => e?.map((t) => t.value).sort(tj));
function Mm(e, t) {
  switch (e) {
    case "xAxis":
      return t.direction === "x";
    case "yAxis":
      return t.direction === "y";
    default:
      return !1;
  }
}
function nj(e, t, r) {
  if (!r)
    return [];
  if (!r.length)
    return [];
  var n;
  if (typeof t == "number" && !Wt(t))
    n = t;
  else if (Array.isArray(t)) {
    var i = jt(t);
    i.length > 0 && (n = Math.max(...i));
  }
  return n == null ? [] : jt(r.flatMap((a) => {
    var o = he(e, a.dataKey), u, l;
    if (Array.isArray(o)) {
      var c = wm(o, 2);
      u = c[0], l = c[1];
    } else
      u = l = o;
    if (!(!V(u) || !V(l)))
      return [n - u, n + l];
  }));
}
var _e = (e) => {
  var t = Te(e), r = Pn(e);
  return Ai(e, t, r);
}, bn = P([_e], (e) => e?.dataKey), ij = P([_m, yi, _e], Ry), Dm = (e, t, r, n) => {
  var i = {}, a = t.reduce((o, u) => {
    if (u.stackId == null)
      return o;
    var l = o[u.stackId];
    return l == null && (l = []), l.push(u), o[u.stackId] = l, o;
  }, i);
  return Object.fromEntries(Object.entries(a).map((o) => {
    var u = wm(o, 2), l = u[0], c = u[1], s = n ? [...c].reverse() : c, f = s.map(Vl);
    return [l, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: o1(e, f, r),
      graphicalItems: s
    }];
  }));
}, Vu = P([ij, _m, vo, Ey], Dm), $m = (e, t, r, n) => {
  var i = t.dataStartIndex, a = t.dataEndIndex;
  if (n == null && r !== "zAxis")
    return f1(e, i, a);
}, aj = P([He], (e) => e.allowDataOverflow), Oc = (e) => {
  var t;
  if (e == null || !("domain" in e))
    return Gu;
  if (e.domain != null)
    return e.domain;
  if ("ticks" in e && e.ticks != null) {
    if (e.type === "number") {
      var r = jt(e.ticks);
      return [Math.min(...r), Math.max(...r)];
    }
    if (e.type === "category")
      return e.ticks.map(String);
  }
  return (t = e?.domain) !== null && t !== void 0 ? t : Gu;
}, Nm = P([He], Oc), Lm = P([Nm, aj], gy), oj = P([Vu, Et, Ee, Lm], $m, {
  memoizeOptions: {
    resultEqualityCheck: mi
  }
}), Pc = (e) => e.errorBars, uj = (e, t, r) => e.flatMap((n) => t[n.id]).filter(Boolean).filter((n) => Mm(r, n)), Ta = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var i = r.filter(Boolean);
  if (i.length !== 0) {
    var a = i.flat(), o = Math.min(...a), u = Math.max(...a);
    return [o, u];
  }
}, Rm = function(t, r, n, i, a) {
  var o = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : [], u, l;
  if (n.length > 0 && n.forEach((c) => {
    var s, f = c.data != null ? [...c.data] : o, d = (s = i[c.id]) === null || s === void 0 ? void 0 : s.filter((v) => Mm(a, v));
    f.forEach((v) => {
      var h, p = he(v, (h = r.dataKey) !== null && h !== void 0 ? h : c.dataKey), y = nj(v, p, d);
      if (y.length >= 2) {
        var m = Math.min(...y), b = Math.max(...y);
        (u == null || m < u) && (u = m), (l == null || b > l) && (l = b);
      }
      var g = zd(p);
      g != null && (u = u == null ? g[0] : Math.min(u, g[0]), l = l == null ? g[1] : Math.max(l, g[1]));
    });
  }), r?.dataKey != null && n.length === 0 && t.forEach((c) => {
    var s = zd(he(c, r.dataKey));
    s != null && (u = u == null ? s[0] : Math.min(u, s[0]), l = l == null ? s[1] : Math.max(l, s[1]));
  }), V(u) && V(l))
    return [u, l];
}, lj = P([Ac, He, Qk, Pc, Ee, RS], Rm, {
  memoizeOptions: {
    resultEqualityCheck: mi
  }
});
function cj(e) {
  var t = e.value;
  if (Ft(t) || t instanceof Date)
    return t;
}
var sj = (e, t, r) => {
  var n = e.map(cj).filter((i) => i != null);
  return r && (t.dataKey == null || t.allowDuplicatedCategory && bh(n)) ? my(0, e.length) : t.allowDuplicatedCategory ? n : Array.from(new Set(n));
}, zm = (e) => e.referenceElements.dots, _n = (e, t, r) => e.filter((n) => n.ifOverflow === "extendDomain").filter((n) => t === "xAxis" ? n.xAxisId === r : n.yAxisId === r), fj = P([zm, Ee, mo], _n), Bm = (e) => e.referenceElements.areas, dj = P([Bm, Ee, mo], _n), Wm = (e) => e.referenceElements.lines, vj = P([Wm, Ee, mo], _n), Fm = (e, t) => {
  if (e != null) {
    var r = jt(e.map((n) => t === "xAxis" ? n.x : n.y));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, hj = P(fj, Ee, Fm), Km = (e, t) => {
  if (e != null) {
    var r = jt(e.flatMap((n) => [t === "xAxis" ? n.x1 : n.y1, t === "xAxis" ? n.x2 : n.y2]));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, pj = P([dj, Ee], Km);
function yj(e) {
  var t;
  if (e.x != null)
    return jt([e.x]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.x);
  return r == null || r.length === 0 ? [] : jt(r);
}
function mj(e) {
  var t;
  if (e.y != null)
    return jt([e.y]);
  var r = (t = e.segment) === null || t === void 0 ? void 0 : t.map((n) => n.y);
  return r == null || r.length === 0 ? [] : jt(r);
}
var Um = (e, t) => {
  if (e != null) {
    var r = e.flatMap((n) => t === "xAxis" ? yj(n) : mj(n));
    if (r.length !== 0)
      return [Math.min(...r), Math.max(...r)];
  }
}, gj = P([vj, Ee], Um), bj = P(hj, gj, pj, (e, t, r) => Ta(e, r, t)), Hm = (e, t, r, n, i, a, o, u, l) => {
  if (r != null)
    return r;
  var c = o === "vertical" && u === "xAxis" || o === "horizontal" && u === "yAxis", s = c ? Ta(n, a, i) : Ta(a, i), f = US(t, s, e.allowDataOverflow);
  return f ?? (e.allowDataOverflow && s == null && l != null ? l : f);
}, xj = (e) => {
  if (!(e == null || e.type !== "number" || !("ticks" in e) || e.ticks == null)) {
    var t = jt(e.ticks);
    if (t.length !== 0)
      return [Math.min(...t), Math.max(...t)];
  }
}, wj = P([He], xj, {
  memoizeOptions: {
    resultEqualityCheck: mi
  }
}), Aj = P([He, Nm, Lm, oj, lj, bj, J, Ee, wj], Hm, {
  memoizeOptions: {
    resultEqualityCheck: mi
  }
}), Oj = [0, 1], Ym = (e, t, r, n, i, a, o) => {
  if (!((e == null || r == null || r.length === 0) && o === void 0)) {
    var u = e.dataKey, l = e.type, c = or(t, a);
    if (c && u == null) {
      var s;
      return my(0, (s = r?.length) !== null && s !== void 0 ? s : 0);
    }
    return l === "category" ? sj(n, e, c) : i === "expand" && !c ? Oj : o;
  }
}, Sc = P([He, J, Ac, Oi, vo, Ee, Aj], Ym), kn = P([He, Pm, Kl], bm), qm = (e, t, r) => {
  var n = t.niceTicks;
  if (n !== "none") {
    var i = Oc(t), a = Array.isArray(i) && (i[0] === "auto" || i[1] === "auto");
    if ((n === "snap125" || n === "adaptive") && t != null && t.tickCount && zt(e)) {
      if (a)
        return Gf(e, t.tickCount, t.allowDecimals, n);
      if (t.type === "number")
        return Vf(e, t.tickCount, t.allowDecimals, n);
    }
    if (n === "auto" && r === "linear" && t != null && t.tickCount) {
      if (a && zt(e))
        return Gf(e, t.tickCount, t.allowDecimals, "adaptive");
      if (t.type === "number" && zt(e))
        return Vf(e, t.tickCount, t.allowDecimals, "adaptive");
    }
  }
}, Ic = P([Sc, Ai, kn], qm), Gm = (e, t, r, n) => {
  if (
    /*
     * Angle axis for some reason uses nice ticks when rendering axis tick labels,
     * but doesn't use nice ticks for extending domain like all the other axes do.
     * Not really sure why? Is there a good reason,
     * or is it just because someone added support for nice ticks to the other axes and forgot this one?
     */
    n !== "angleAxis" && e?.type === "number" && zt(t) && Array.isArray(r) && r.length > 0
  ) {
    var i, a, o = t[0], u = (i = r[0]) !== null && i !== void 0 ? i : 0, l = t[1], c = (a = r[r.length - 1]) !== null && a !== void 0 ? a : 0;
    return [Math.min(o, u), Math.max(l, c)];
  }
  return t;
}, Pj = P([He, Sc, Ic, Ee], Gm), Sj = P(Oi, He, (e, t) => {
  if (!(!t || t.type !== "number")) {
    var r = 1 / 0, n = Array.from(jt(e.map((f) => f.value))).sort((f, d) => f - d), i = n[0], a = n[n.length - 1];
    if (i == null || a == null)
      return 1 / 0;
    var o = a - i;
    if (o === 0)
      return 1 / 0;
    for (var u = 0; u < n.length - 1; u++) {
      var l = n[u], c = n[u + 1];
      if (!(l == null || c == null)) {
        var s = c - l;
        r = Math.min(r, s);
      }
    }
    return r / o;
  }
}), Vm = P(Sj, J, Cy, Ce, (e, t, r, n, i) => i, (e, t, r, n, i) => {
  if (!V(e))
    return 0;
  var a = t === "vertical" ? n.height : n.width;
  if (i === "gap")
    return e * a / 2;
  if (i === "no-gap") {
    var o = kt(r, e * a), u = e * a / 2;
    return u - o - (u - o) / a * o;
  }
  return 0;
}), Ij = (e, t, r) => {
  var n = lr(e, t);
  return n == null || typeof n.padding != "string" ? 0 : Vm(e, "xAxis", t, r, n.padding);
}, _j = (e, t, r) => {
  var n = cr(e, t);
  return n == null || typeof n.padding != "string" ? 0 : Vm(e, "yAxis", t, r, n.padding);
}, kj = P(lr, Ij, (e, t) => {
  var r, n;
  if (e == null)
    return {
      left: 0,
      right: 0
    };
  var i = e.padding;
  return typeof i == "string" ? {
    left: t,
    right: t
  } : {
    left: ((r = i.left) !== null && r !== void 0 ? r : 0) + t,
    right: ((n = i.right) !== null && n !== void 0 ? n : 0) + t
  };
}), jj = P(cr, _j, (e, t) => {
  var r, n;
  if (e == null)
    return {
      top: 0,
      bottom: 0
    };
  var i = e.padding;
  return typeof i == "string" ? {
    top: t,
    bottom: t
  } : {
    top: ((r = i.top) !== null && r !== void 0 ? r : 0) + t,
    bottom: ((n = i.bottom) !== null && n !== void 0 ? n : 0) + t
  };
}), Xm = P([Ce, kj, so, co, (e, t, r) => r], (e, t, r, n, i) => {
  var a = n.padding;
  return i ? [a.left, r.width - a.right] : [e.left + t.left, e.left + e.width - t.right];
}), Zm = P([Ce, J, jj, so, co, (e, t, r) => r], (e, t, r, n, i, a) => {
  var o = i.padding;
  return a ? [n.height - o.bottom, o.top] : t === "horizontal" ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom];
}), Pi = (e, t, r, n) => {
  var i;
  switch (t) {
    case "xAxis":
      return Xm(e, r, n);
    case "yAxis":
      return Zm(e, r, n);
    case "zAxis":
      return (i = wc(e, r)) === null || i === void 0 ? void 0 : i.range;
    case "angleAxis":
      return $y(e);
    case "radiusAxis":
      return Ny(e, r);
    default:
      return;
  }
}, Qm = P([He, Pi], ho), Cj = P([kn, Pj], lI), _c = P([He, kn, Cj, Qm], xc), Jm = (e, t, r, n) => {
  if (!(r == null || r.dataKey == null)) {
    var i = r.type, a = r.scale, o = or(e, n);
    if (o && (i === "number" || a !== "auto"))
      return t.map((u) => u.value);
  }
}, kc = P([J, Oi, Ai, Ee], Jm), _o = P([_c], Xl);
P([_c], Wk);
P([_c, rj], xm);
P([In, Pc, Ee], uj);
function eg(e, t) {
  return e.id < t.id ? -1 : e.id > t.id ? 1 : 0;
}
var ko = (e, t) => t, jo = (e, t, r) => r, Ej = P(uo, ko, jo, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(eg)), Tj = P(lo, ko, jo, (e, t, r) => e.filter((n) => n.orientation === t).filter((n) => n.mirror === r).sort(eg)), tg = (e, t) => {
  var r = typeof t.height == "number" ? t.height : Ml;
  return {
    width: e.width,
    height: r
  };
}, Mj = (e, t) => {
  var r = typeof t.width == "number" ? t.width : di;
  return {
    width: r,
    height: e.height
  };
}, rg = P(Ce, lr, tg), Dj = (e, t, r) => {
  switch (t) {
    case "top":
      return e.top;
    case "bottom":
      return r - e.bottom;
    default:
      return 0;
  }
}, $j = (e, t, r) => {
  switch (t) {
    case "left":
      return e.left;
    case "right":
      return r - e.right;
    default:
      return 0;
  }
}, Nj = P(Yt, Ce, Ej, ko, jo, (e, t, r, n, i) => {
  var a = {}, o;
  return r.forEach((u) => {
    var l = tg(t, u);
    o == null && (o = Dj(t, n, e));
    var c = n === "top" && !i || n === "bottom" && i;
    a[u.id] = o - Number(c) * l.height, o += (c ? -1 : 1) * l.height;
  }), a;
}), Lj = P(Ht, Ce, Tj, ko, jo, (e, t, r, n, i) => {
  var a = {}, o;
  return r.forEach((u) => {
    var l = Mj(t, u);
    o == null && (o = $j(t, n, e));
    var c = n === "left" && !i || n === "right" && i;
    a[u.id] = o - Number(c) * l.width, o += (c ? -1 : 1) * l.width;
  }), a;
}), Rj = (e, t) => {
  var r = lr(e, t);
  if (r != null)
    return Nj(e, r.orientation, r.mirror);
}, zj = P([Ce, lr, Rj, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var i = r?.[n];
    return i == null ? {
      x: e.left,
      y: 0
    } : {
      x: e.left,
      y: i
    };
  }
}), Bj = (e, t) => {
  var r = cr(e, t);
  if (r != null)
    return Lj(e, r.orientation, r.mirror);
}, Wj = P([Ce, cr, Bj, (e, t) => t], (e, t, r, n) => {
  if (t != null) {
    var i = r?.[n];
    return i == null ? {
      x: 0,
      y: e.top
    } : {
      x: i,
      y: e.top
    };
  }
}), ng = P(Ce, cr, (e, t) => {
  var r = typeof t.width == "number" ? t.width : di;
  return {
    width: r,
    height: e.height
  };
}), Bd = (e, t, r) => {
  switch (t) {
    case "xAxis":
      return rg(e, r).width;
    case "yAxis":
      return ng(e, r).height;
    default:
      return;
  }
}, ig = (e, t, r, n) => {
  if (r != null) {
    var i = r.allowDuplicatedCategory, a = r.type, o = r.dataKey, u = or(e, n), l = t.map((s) => s.value), c = l.filter((s) => s != null);
    if (o && u && a === "category" && i && bh(c))
      return l;
  }
}, jc = P([J, Oi, He, Ee], ig), Wd = P([J, Xk, kn, _o, jc, kc, Pi, Ic, Ee], (e, t, r, n, i, a, o, u, l) => {
  if (t != null) {
    var c = or(e, l);
    return {
      angle: t.angle,
      interval: t.interval,
      minTickGap: t.minTickGap,
      orientation: t.orientation,
      tick: t.tick,
      tickCount: t.tickCount,
      tickFormatter: t.tickFormatter,
      ticks: t.ticks,
      type: t.type,
      unit: t.unit,
      axisType: l,
      categoricalDomain: a,
      duplicateDomain: i,
      isCategorical: c,
      niceTicks: u,
      range: o,
      realScaleType: r,
      scale: n
    };
  }
}), Fj = (e, t, r, n, i, a, o, u, l) => {
  if (!(t == null || n == null)) {
    var c = or(e, l), s = t.type, f = t.ticks, d = t.tickCount, v = (
      // @ts-expect-error This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
      r === "scaleBand" && typeof n.bandwidth == "function" ? n.bandwidth() / 2 : 2
    ), h = s === "category" && n.bandwidth ? n.bandwidth() / v : 0;
    h = l === "angleAxis" && a != null && a.length >= 2 ? Xe(a[0] - a[1]) * 2 * h : h;
    var p = f || i;
    return p ? p.map((y, m) => {
      var b = o ? o.indexOf(y) : y, g = n.map(b);
      return V(g) ? {
        index: m,
        coordinate: g + h,
        value: y,
        offset: h
      } : null;
    }).filter(Ze) : c && u ? u.map((y, m) => {
      var b = n.map(y);
      return V(b) ? {
        coordinate: b + h,
        value: y,
        index: m,
        offset: h
      } : null;
    }).filter(Ze) : n.ticks ? n.ticks(d).map((y, m) => {
      var b = n.map(y);
      return V(b) ? {
        coordinate: b + h,
        value: y,
        index: m,
        offset: h
      } : null;
    }).filter(Ze) : n.domain().map((y, m) => {
      var b = n.map(y);
      return V(b) ? {
        coordinate: b + h,
        // @ts-expect-error can't use Date as index
        value: o ? o[y] : y,
        index: m,
        offset: h
      } : null;
    }).filter(Ze);
  }
}, ag = P([J, Ai, kn, _o, Ic, Pi, jc, kc, Ee], Fj), Kj = (e, t, r, n, i, a, o) => {
  if (!(t == null || r == null || n == null || n[0] === n[1])) {
    var u = or(e, o), l = t.tickCount, c = 0;
    return c = o === "angleAxis" && n?.length >= 2 ? Xe(n[0] - n[1]) * 2 * c : c, u && a ? a.map((s, f) => {
      var d = r.map(s);
      return V(d) ? {
        coordinate: d + c,
        value: s,
        index: f,
        offset: c
      } : null;
    }).filter(Ze) : r.ticks ? r.ticks(l).map((s, f) => {
      var d = r.map(s);
      return V(d) ? {
        coordinate: d + c,
        value: s,
        index: f,
        offset: c
      } : null;
    }).filter(Ze) : r.domain().map((s, f) => {
      var d = r.map(s);
      return V(d) ? {
        coordinate: d + c,
        // @ts-expect-error can't use unknown as index
        value: i ? i[s] : s,
        index: f,
        offset: c
      } : null;
    }).filter(Ze);
  }
}, mr = P([J, Ai, _o, Pi, jc, kc, Ee], Kj), gr = P(He, _o, (e, t) => {
  if (!(e == null || t == null))
    return Ea(Ea({}, e), {}, {
      scale: t
    });
}), Uj = P([He, kn, Sc, Qm], xc), Hj = P([Uj], Xl);
P((e, t, r) => wc(e, r), Hj, (e, t) => {
  if (!(e == null || t == null))
    return Ea(Ea({}, e), {}, {
      scale: t
    });
});
var Yj = P([J, uo, lo], (e, t, r) => {
  switch (e) {
    case "horizontal":
      return t.some((n) => n.reversed) ? "right-to-left" : "left-to-right";
    case "vertical":
      return r.some((n) => n.reversed) ? "bottom-to-top" : "top-to-bottom";
    // TODO: make this better. For now, right arrow triggers "forward", left arrow "back"
    // however, the tooltip moves an unintuitive direction because of how the indices are rendered
    case "centric":
    case "radial":
      return "left-to-right";
    default:
      return;
  }
}), qj = (e, t, r) => {
  var n;
  return (n = e.renderedTicks[t]) === null || n === void 0 ? void 0 : n[r];
};
P([qj], (e) => {
  if (!(!e || e.length === 0))
    return (t) => {
      var r, n = 1 / 0, i = e[0];
      for (var a of e) {
        var o = Math.abs(a.coordinate - t);
        o < n && (n = o, i = a);
      }
      return (r = i) === null || r === void 0 ? void 0 : r.value;
    };
});
var og = (e) => e.options.defaultTooltipEventType, ug = (e) => e.options.validateTooltipEventTypes;
function lg(e, t, r) {
  if (e == null)
    return t;
  var n = e ? "axis" : "item";
  return r == null ? t : r.includes(n) ? n : t;
}
function Si(e, t) {
  var r = og(e), n = ug(e);
  return lg(t, r, n);
}
function Gj(e) {
  return $((t) => Si(t, e));
}
var cg = (e, t) => {
  var r, n = Number(t);
  if (!(Wt(n) || t == null))
    return n >= 0 ? e == null || (r = e[n]) === null || r === void 0 ? void 0 : r.value : void 0;
}, Vj = (e) => e.tooltip.settings, hr = {
  active: !1,
  index: null,
  dataKey: void 0,
  graphicalItemId: void 0,
  coordinate: void 0
}, Xj = {
  itemInteraction: {
    click: hr,
    hover: hr
  },
  axisInteraction: {
    click: hr,
    hover: hr
  },
  keyboardInteraction: hr,
  syncInteraction: {
    active: !1,
    index: null,
    dataKey: void 0,
    label: void 0,
    coordinate: void 0,
    sourceViewBox: void 0,
    graphicalItemId: void 0
  },
  tooltipItemPayloads: [],
  settings: {
    shared: void 0,
    trigger: "hover",
    axisId: 0,
    active: !1,
    defaultIndex: void 0
  }
}, sg = Ke({
  name: "tooltip",
  initialState: Xj,
  reducers: {
    addTooltipEntrySettings: {
      reducer(e, t) {
        e.tooltipItemPayloads.push(X(t.payload));
      },
      prepare: oe()
    },
    replaceTooltipEntrySettings: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next, a = dt(e).tooltipItemPayloads.indexOf(X(n));
        a > -1 && (e.tooltipItemPayloads[a] = X(i));
      },
      prepare: oe()
    },
    removeTooltipEntrySettings: {
      reducer(e, t) {
        var r = dt(e).tooltipItemPayloads.indexOf(X(t.payload));
        r > -1 && e.tooltipItemPayloads.splice(r, 1);
      },
      prepare: oe()
    },
    setTooltipSettingsState(e, t) {
      e.settings = t.payload;
    },
    setActiveMouseOverItemIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate;
    },
    mouseLeaveChart(e) {
      e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1;
    },
    mouseLeaveItem(e) {
      e.itemInteraction.hover.active = !1;
    },
    setActiveClickItemIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate;
    },
    setMouseOverAxisIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate;
    },
    setMouseClickAxisIndex(e, t) {
      e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate;
    },
    setSyncInteraction(e, t) {
      e.syncInteraction = t.payload;
    },
    setKeyboardInteraction(e, t) {
      e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate;
    }
  }
}), xt = sg.actions, Zj = xt.addTooltipEntrySettings, Qj = xt.replaceTooltipEntrySettings, Jj = xt.removeTooltipEntrySettings, eC = xt.setTooltipSettingsState, fg = xt.setActiveMouseOverItemIndex, tC = xt.mouseLeaveItem, dg = xt.mouseLeaveChart, rC = xt.setActiveClickItemIndex, vg = xt.setMouseOverAxisIndex, nC = xt.setMouseClickAxisIndex, Un = xt.setSyncInteraction, Ma = xt.setKeyboardInteraction, iC = sg.reducer;
function Fd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function zi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Fd(Object(r), !0).forEach(function(n) {
      aC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Fd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function aC(e, t, r) {
  return (t = oC(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oC(e) {
  var t = uC(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function uC(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function lC(e, t, r) {
  return t === "axis" ? r === "click" ? e.axisInteraction.click : e.axisInteraction.hover : r === "click" ? e.itemInteraction.click : e.itemInteraction.hover;
}
function cC(e) {
  return e.index != null;
}
var hg = (e, t, r, n) => {
  if (t == null)
    return hr;
  var i = lC(e, t, r);
  if (i == null)
    return hr;
  if (i.active)
    return i;
  if (e.keyboardInteraction.active)
    return e.keyboardInteraction;
  if (e.syncInteraction.active && e.syncInteraction.index != null)
    return e.syncInteraction;
  var a = e.settings.active === !0;
  if (cC(i)) {
    if (a)
      return zi(zi({}, i), {}, {
        active: !0
      });
  } else if (n != null)
    return {
      active: !0,
      coordinate: void 0,
      dataKey: void 0,
      index: n,
      graphicalItemId: void 0
    };
  return zi(zi({}, hr), {}, {
    coordinate: i.coordinate
  });
};
function sC(e) {
  if (typeof e == "number")
    return Number.isFinite(e) ? e : void 0;
  if (e instanceof Date) {
    var t = e.valueOf();
    return Number.isFinite(t) ? t : void 0;
  }
  var r = Number(e);
  return Number.isFinite(r) ? r : void 0;
}
function fC(e, t) {
  var r = sC(e), n = t[0], i = t[1];
  if (r === void 0)
    return !1;
  var a = Math.min(n, i), o = Math.max(n, i);
  return r >= a && r <= o;
}
function dC(e, t, r) {
  if (r == null || t == null)
    return !0;
  var n = he(e, t);
  return n == null || !zt(r) ? !0 : fC(n, r);
}
var qn = (e, t, r, n) => {
  var i = e?.index;
  if (i == null)
    return null;
  var a = Number(i);
  if (!V(a))
    return i;
  var o = 0, u = 1 / 0;
  t.length > 0 && (u = t.length - 1);
  var l = Math.max(o, Math.min(a, u)), c = t[l];
  return c == null || dC(c, r, n) ? String(l) : null;
}, pg = (e, t, r, n, i, a, o) => {
  if (a != null) {
    var u = o[0], l = u?.getPosition(a);
    if (l != null)
      return l;
    var c = i?.[Number(a)];
    if (c)
      return r === "horizontal" ? {
        x: c.coordinate,
        y: (n.top + t) / 2
      } : {
        x: (n.left + e) / 2,
        y: c.coordinate
      };
  }
}, yg = (e, t, r, n) => {
  if (t === "axis")
    return e.tooltipItemPayloads;
  if (e.tooltipItemPayloads.length === 0)
    return [];
  var i;
  if (r === "hover" ? i = e.itemInteraction.hover.graphicalItemId : i = e.itemInteraction.click.graphicalItemId, e.syncInteraction.active && i == null)
    return e.tooltipItemPayloads;
  if (i == null && (n != null || e.keyboardInteraction.active)) {
    var a = e.tooltipItemPayloads[0];
    return a != null ? [a] : [];
  }
  return e.tooltipItemPayloads.filter((o) => {
    var u;
    return ((u = o.settings) === null || u === void 0 ? void 0 : u.graphicalItemId) === i;
  });
}, mg = (e) => e.options.tooltipPayloadSearcher, jn = (e) => e.tooltip;
function Kd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ud(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kd(Object(r), !0).forEach(function(n) {
      vC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Kd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function vC(e, t, r) {
  return (t = hC(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function hC(e) {
  var t = pC(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function pC(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function yC(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
}
function mC(e) {
  if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
    return e;
}
function gC(e) {
  if (typeof e == "string" || typeof e == "number")
    return e;
  if (typeof e == "function")
    return (t) => e(t);
}
function Hd(e) {
  if (typeof e == "string")
    return e;
}
function bC(e) {
  if (!(e == null || typeof e != "object")) {
    var t = "name" in e ? yC(e.name) : void 0, r = "unit" in e ? mC(e.unit) : void 0, n = "dataKey" in e ? gC(e.dataKey) : void 0, i = "payload" in e ? e.payload : void 0, a = "color" in e ? Hd(e.color) : void 0, o = "fill" in e ? Hd(e.fill) : void 0;
    return {
      name: t,
      unit: r,
      dataKey: n,
      payload: i,
      color: a,
      fill: o
    };
  }
}
function xC(e, t) {
  return e ?? t;
}
var gg = (e, t, r, n, i, a, o) => {
  if (!(t == null || a == null)) {
    var u = r.chartData, l = r.computedData, c = r.dataStartIndex, s = r.dataEndIndex, f = [];
    return e.reduce((d, v) => {
      var h, p = v.dataDefinedOnItem, y = v.settings, m = xC(p, u), b = Array.isArray(m) ? Gp(m, c, s) : m, g = (h = y?.dataKey) !== null && h !== void 0 ? h : n, A = y?.nameKey, O;
      if (n && Array.isArray(b) && /*
       * findEntryInArray won't work for Scatter because Scatter provides an array of arrays
       * as tooltip payloads and findEntryInArray is not prepared to handle that.
       * Sad but also ScatterChart only allows 'item' tooltipEventType
       * and also this is only a problem if there are multiple Scatters and each has its own data array
       * so let's fix that some other time.
       */
      !Array.isArray(b[0]) && /*
       * If the tooltipEventType is 'axis', we should search for the dataKey in the sliced data
       * because thanks to allowDuplicatedCategory=false, the order of elements in the array
       * no longer matches the order of elements in the original data
       * and so we need to search by the active dataKey + label rather than by index.
       *
       * The same happens if multiple graphical items are present in the chart
       * and each of them has its own data array. Those arrays get concatenated
       * and again the tooltip index no longer matches the original data.
       *
       * On the other hand the tooltipEventType 'item' should always search by index
       * because we get the index from interacting over the individual elements
       * which is always accurate, irrespective of the allowDuplicatedCategory setting.
       */
      o === "axis" ? (O = xh(b, n, i), O == null && (O = a(b, t, l, A))) : O = a(b, t, l, A), Array.isArray(O))
        O.forEach((S) => {
          var _, E, j = bC(S), k = j?.name, I = j?.dataKey, R = j?.payload, N = Ud(Ud({}, y), {}, {
            name: k,
            unit: j?.unit,
            // Preserve item-level color/fill from graphical items.
            color: (_ = j?.color) !== null && _ !== void 0 ? _ : y?.color,
            fill: (E = j?.fill) !== null && E !== void 0 ? E : y?.fill
          });
          d.push(Bs({
            tooltipEntrySettings: N,
            dataKey: I,
            payload: R,
            value: he(R, I),
            name: k == null ? void 0 : String(k)
          }));
        });
      else {
        var w;
        d.push(Bs({
          tooltipEntrySettings: y,
          dataKey: g,
          payload: O,
          // getValueByDataKey does not validate the output type
          value: he(O, g),
          // getValueByDataKey does not validate the output type
          name: (w = he(O, A)) !== null && w !== void 0 ? w : y?.name
        }));
      }
      return d;
    }, f);
  }
}, Cc = P([_e, Pm, Kl], bm), wC = P([(e) => e.graphicalItems.cartesianItems, (e) => e.graphicalItems.polarItems], (e, t) => [...e, ...t]), AC = P([Te, Pn], Sm), Vr = P([wC, _e, AC], Im, {
  memoizeOptions: {
    resultEqualityCheck: bo
  }
}), OC = P([Vr], (e) => e.filter(go)), bg = P([Vr], jm, {
  memoizeOptions: {
    resultEqualityCheck: bo
  }
}), PC = P([Vr], (e) => e.some((t) => !t.data)), Fr = P([bg, Et], Em), SC = P([OC, Et, _e], Ry), Ec = P([Fr, _e, Vr, Et, PC, bg], Tm), xg = P([_e], Oc), IC = P([_e], (e) => e.allowDataOverflow), wg = P([xg, IC], gy), _C = P([Vr], (e) => e.filter(go)), kC = P([SC, _C, vo, Ey], Dm), jC = P([kC, Et, Te, wg], $m), CC = P([Vr], km), EC = P([Fr, _e, CC, Pc, Te, zS], Rm, {
  memoizeOptions: {
    resultEqualityCheck: mi
  }
}), TC = P([zm, Te, Pn], _n), MC = P([TC, Te], Fm), DC = P([Bm, Te, Pn], _n), $C = P([DC, Te], Km), NC = P([Wm, Te, Pn], _n), LC = P([NC, Te], Um), RC = P([MC, LC, $C], Ta), zC = P([_e, xg, wg, jC, EC, RC, J, Te], Hm), xn = P([_e, J, Fr, Ec, vo, Te, zC], Ym), BC = P([xn, _e, Cc], qm), WC = P([_e, xn, BC, Te], Gm), Ag = (e) => {
  var t = Te(e), r = Pn(e), n = !1;
  return Pi(e, t, r, n);
}, Og = P([_e, Ag], ho), FC = P([_e, Cc, WC, Og], xc), Pg = P([FC], Xl), KC = P([J, Ec, _e, Te], ig), UC = P([J, Ec, _e, Te], Jm), HC = (e, t, r, n, i, a, o, u) => {
  if (t) {
    var l = t.type, c = or(e, u);
    if (n) {
      var s = r === "scaleBand" && n.bandwidth ? n.bandwidth() / 2 : 2, f = l === "category" && n.bandwidth ? n.bandwidth() / s : 0;
      return f = u === "angleAxis" && i != null && i?.length >= 2 ? Xe(i[0] - i[1]) * 2 * f : f, c && o ? o.map((d, v) => {
        var h = n.map(d);
        return V(h) ? {
          coordinate: h + f,
          value: d,
          index: v,
          offset: f
        } : null;
      }).filter(Ze) : n.domain().map((d, v) => {
        var h = n.map(d);
        return V(h) ? {
          coordinate: h + f,
          // @ts-expect-error can't use Date as an index
          value: a ? a[d] : d,
          index: v,
          offset: f
        } : null;
      }).filter(Ze);
    }
  }
}, sr = P([J, _e, Cc, Pg, Ag, KC, UC, Te], HC), Tc = P([og, ug, Vj], (e, t, r) => lg(r.shared, e, t)), Sg = (e) => e.tooltip.settings.trigger, Mc = (e) => e.tooltip.settings.defaultIndex, Ii = P([jn, Tc, Sg, Mc], hg), Kr = P([Ii, Fr, bn, xn], qn), Ig = P([sr, Kr], cg), _g = P([Ii], (e) => {
  if (e)
    return e.dataKey;
}), YC = P([Ii], (e) => {
  if (e)
    return e.graphicalItemId;
}), kg = P([jn, Tc, Sg, Mc], yg), qC = P([Ht, Yt, J, Ce, sr, Mc, kg], pg), GC = P([Ii, qC], (e, t) => e != null && e.coordinate ? e.coordinate : t), VC = P([Ii], (e) => {
  var t;
  return (t = e?.active) !== null && t !== void 0 ? t : !1;
}), XC = P([kg, Kr, Et, bn, Ig, mg, Tc], gg), ZC = P([XC], (e) => {
  if (e != null) {
    var t = e.map((r) => r.payload).filter((r) => r != null);
    return Array.from(new Set(t));
  }
});
function Yd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function qd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yd(Object(r), !0).forEach(function(n) {
      QC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Yd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function QC(e, t, r) {
  return (t = JC(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function JC(e) {
  var t = eE(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function eE(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var tE = () => $(_e), rE = () => {
  var e = tE(), t = $(sr), r = $(Pg);
  return hn(!e || !r ? void 0 : qd(qd({}, e), {}, {
    scale: r
  }), t);
};
function Gd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function tn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gd(Object(r), !0).forEach(function(n) {
      nE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function nE(e, t, r) {
  return (t = iE(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function iE(e) {
  var t = aE(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function aE(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var oE = (e, t, r, n) => {
  var i = t.find((a) => a && a.index === r);
  if (i) {
    if (e === "horizontal")
      return {
        x: i.coordinate,
        y: n.relativeY
      };
    if (e === "vertical")
      return {
        x: n.relativeX,
        y: i.coordinate
      };
  }
  return {
    x: 0,
    y: 0
  };
}, uE = (e, t, r, n) => {
  var i = t.find((c) => c && c.index === r);
  if (i) {
    if (e === "centric") {
      var a = i.coordinate, o = n.radius;
      return tn(tn(tn({}, n), Le(n.cx, n.cy, o, a)), {}, {
        angle: a,
        radius: o
      });
    }
    var u = i.coordinate, l = n.angle;
    return tn(tn(tn({}, n), Le(n.cx, n.cy, u, l)), {}, {
      angle: l,
      radius: u
    });
  }
  return {
    angle: 0,
    clockWise: !1,
    cx: 0,
    cy: 0,
    endAngle: 0,
    innerRadius: 0,
    outerRadius: 0,
    radius: 0,
    startAngle: 0,
    x: 0,
    y: 0
  };
};
function lE(e, t) {
  var r = e.relativeX, n = e.relativeY;
  return r >= t.left && r <= t.left + t.width && n >= t.top && n <= t.top + t.height;
}
var jg = (e, t, r, n, i) => {
  var a, o = (a = t?.length) !== null && a !== void 0 ? a : 0;
  if (o <= 1 || e == null)
    return 0;
  if (n === "angleAxis" && i != null && Math.abs(Math.abs(i[1] - i[0]) - 360) <= 1e-6)
    for (var u = i[1] - i[0], l = (L, W, F) => [e, e + u, e - u].some((z) => (F ? z >= L : z > L) && z <= W), c = 0; c < o; c++) {
      var s, f, d, v, h, p = c > 0 ? (s = r[c - 1]) === null || s === void 0 ? void 0 : s.coordinate : (f = r[o - 1]) === null || f === void 0 ? void 0 : f.coordinate, y = (d = r[c]) === null || d === void 0 ? void 0 : d.coordinate, m = c >= o - 1 ? (v = r[0]) === null || v === void 0 ? void 0 : v.coordinate : (h = r[c + 1]) === null || h === void 0 ? void 0 : h.coordinate, b = void 0;
      if (!(p == null || y == null || m == null))
        if (Xe(y - p) !== Xe(m - y)) {
          var g = [];
          if (Xe(m - y) === Xe(i[1] - i[0])) {
            b = m;
            var A = y + i[1] - i[0];
            g[0] = Math.min(A, (A + p) / 2), g[1] = Math.max(A, (A + p) / 2);
          } else {
            b = p;
            var O = m + i[1] - i[0];
            g[0] = Math.min(y, (O + y) / 2), g[1] = Math.max(y, (O + y) / 2);
          }
          var w = [Math.min(y, (b + y) / 2), Math.max(y, (b + y) / 2)];
          if (l(w[0], w[1], !1) || l(g[0], g[1], !0)) {
            var S;
            return (S = r[c]) === null || S === void 0 ? void 0 : S.index;
          }
        } else {
          var _ = Math.min(p, m), E = Math.max(p, m);
          if (l((_ + y) / 2, (E + y) / 2, !1)) {
            var j;
            return (j = r[c]) === null || j === void 0 ? void 0 : j.index;
          }
        }
    }
  else if (t)
    for (var k = 0; k < o; k++) {
      var I = t[k];
      if (I != null) {
        var R = t[k + 1], N = t[k - 1];
        if (k === 0 && R != null && e <= (I.coordinate + R.coordinate) / 2 || k === o - 1 && N != null && e > (I.coordinate + N.coordinate) / 2 || k > 0 && k < o - 1 && N != null && R != null && e > (I.coordinate + N.coordinate) / 2 && e <= (I.coordinate + R.coordinate) / 2)
          return I.index;
      }
    }
  return -1;
}, cE = () => $(Kl), Dc = (e, t) => t, Cg = (e, t, r) => r, $c = (e, t, r, n) => n, sE = P(sr, (e) => Va(e, (t) => t.coordinate)), Nc = P([jn, Dc, Cg, $c], hg), Lc = P([Nc, Fr, bn, xn], qn), fE = (e, t, r) => {
  if (t != null) {
    var n = jn(e);
    return t === "axis" ? r === "hover" ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : r === "hover" ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey;
  }
}, Eg = P([jn, Dc, Cg, $c], yg), Da = P([Ht, Yt, J, Ce, sr, $c, Eg], pg), dE = P([Nc, Da], (e, t) => {
  var r;
  return (r = e.coordinate) !== null && r !== void 0 ? r : t;
}), Tg = P([sr, Lc], cg), vE = P([Eg, Lc, Et, bn, Tg, mg, Dc], gg), hE = P([Nc, Lc], (e, t) => ({
  isActive: e.active && t != null,
  activeIndex: t
})), pE = (e, t, r, n, i, a, o) => {
  if (!(!e || !r || !n || !i) && lE(e, o)) {
    var u = d1(e, t), l = jg(u, a, i, r, n), c = oE(t, i, l, e);
    return {
      activeIndex: String(l),
      activeCoordinate: c
    };
  }
}, yE = (e, t, r, n, i, a, o) => {
  if (!(!e || !n || !i || !a || !r)) {
    var u = CS(e, r);
    if (u) {
      var l = v1(u, t), c = jg(l, o, a, n, i), s = uE(t, a, c, u);
      return {
        activeIndex: String(c),
        activeCoordinate: s
      };
    }
  }
}, mE = (e, t, r, n, i, a, o, u) => {
  if (!(!e || !t || !n || !i || !a))
    return t === "horizontal" || t === "vertical" ? pE(e, t, n, i, a, o, u) : yE(e, t, r, n, i, a, o);
}, gE = P((e) => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
  if (t != null) {
    var n = e[t];
    if (n != null)
      return r ? n.panoramaElement : n.element;
  }
}), bE = P((e) => e.zIndex.zIndexMap, (e) => {
  var t = Object.keys(e).map((n) => parseInt(n, 10)).concat(Object.values(je)), r = Array.from(new Set(t));
  return r.sort((n, i) => n - i);
}, {
  memoizeOptions: {
    resultEqualityCheck: uI
  }
});
function Vd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Xd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Vd(Object(r), !0).forEach(function(n) {
      xE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Vd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function xE(e, t, r) {
  return (t = wE(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function wE(e) {
  var t = AE(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function AE(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var OE = {}, PE = {
  zIndexMap: Object.values(je).reduce((e, t) => Xd(Xd({}, e), {}, {
    [t]: {
      element: void 0,
      panoramaElement: void 0,
      consumers: 0
    }
  }), OE)
}, SE = new Set(Object.values(je));
function IE(e) {
  return SE.has(e);
}
var Mg = Ke({
  name: "zIndex",
  initialState: PE,
  reducers: {
    registerZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] ? e.zIndexMap[r].consumers += 1 : e.zIndexMap[r] = {
          consumers: 1,
          element: void 0,
          panoramaElement: void 0
        };
      },
      prepare: oe()
    },
    unregisterZIndexPortal: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !IE(r) && delete e.zIndexMap[r]);
      },
      prepare: oe()
    },
    registerZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload, n = r.zIndex, i = r.element, a = r.isPanorama;
        e.zIndexMap[n] ? a ? e.zIndexMap[n].panoramaElement = X(i) : e.zIndexMap[n].element = X(i) : e.zIndexMap[n] = {
          consumers: 0,
          element: a ? void 0 : X(i),
          panoramaElement: a ? X(i) : void 0
        };
      },
      prepare: oe()
    },
    unregisterZIndexPortalElement: {
      reducer: (e, t) => {
        var r = t.payload.zIndex;
        e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0);
      },
      prepare: oe()
    }
  }
}), Co = Mg.actions, _E = Co.registerZIndexPortal, iu = Co.unregisterZIndexPortal, kE = Co.registerZIndexPortalElement, jE = Co.unregisterZIndexPortalElement, CE = Mg.reducer;
function wt(e) {
  var t = e.zIndex, r = e.children, n = Z1(), i = n && t !== void 0 && t !== 0, a = Ue(), o = Y(void 0), u = Y(/* @__PURE__ */ new Set()), l = ae(), c = $((f) => gE(f, t, a));
  if (xe(() => {
    if (!i) {
      var f = u.current;
      f.forEach((v) => {
        l(iu({
          zIndex: v
        }));
      }), f.clear(), o.current = void 0;
      return;
    }
    if (u.current.has(t) || (l(_E({
      zIndex: t
    })), u.current.add(t)), c) {
      o.current = c;
      var d = u.current;
      d.forEach((v) => {
        v !== t && (l(iu({
          zIndex: v
        })), d.delete(v));
      });
    }
  }, [l, t, i, c]), xe(() => {
    var f = u.current;
    return () => {
      f.forEach((d) => {
        l(iu({
          zIndex: d
        }));
      }), f.clear();
    };
  }, [l]), !i)
    return r;
  var s = c ?? o.current;
  return s ? /* @__PURE__ */ fl(r, s) : null;
}
function Xu() {
  return Xu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xu.apply(null, arguments);
}
function Zd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Bi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zd(Object(r), !0).forEach(function(n) {
      EE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zd(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function EE(e, t, r) {
  return (t = TE(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function TE(e) {
  var t = ME(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ME(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function DE(e) {
  var t = e.cursor, r = e.cursorComp, n = e.cursorProps;
  return /* @__PURE__ */ ve(t) ? /* @__PURE__ */ mt(t, n) : /* @__PURE__ */ x(r, n);
}
function $E(e) {
  var t, r = e.coordinate, n = e.payload, i = e.index, a = e.offset, o = e.tooltipAxisBandSize, u = e.layout, l = e.cursor, c = e.tooltipEventType, s = e.chartName, f = r, d = n, v = i;
  if (!l || !f || s !== "ScatterChart" && c !== "axis")
    return null;
  var h, p, y;
  if (s === "ScatterChart")
    h = f, p = zP, y = je.cursorLine;
  else if (s === "BarChart")
    h = BP(u, f, a, o), p = hy, y = je.cursorRectangle;
  else if (u === "radial" && Wh(f)) {
    var m = py(f), b = m.cx, g = m.cy, A = m.radius, O = m.startAngle, w = m.endAngle;
    h = {
      cx: b,
      cy: g,
      startAngle: O,
      endAngle: w,
      innerRadius: A,
      outerRadius: A
    }, p = DS, y = je.cursorLine;
  } else
    h = {
      points: $S(u, f, a)
    }, p = ly, y = je.cursorLine;
  var S = typeof l == "object" && "className" in l ? l.className : void 0, _ = Bi(Bi(Bi(Bi({
    stroke: "#ccc",
    pointerEvents: "none"
  }, a), h), li(l)), {}, {
    payload: d,
    payloadIndex: v,
    className: re("recharts-tooltip-cursor", S)
  });
  return /* @__PURE__ */ x(wt, {
    zIndex: (t = e.zIndex) !== null && t !== void 0 ? t : y
  }, /* @__PURE__ */ x(DE, {
    cursor: l,
    cursorComp: p,
    cursorProps: _
  }));
}
function NE(e) {
  var t = rE(), r = ty(), n = Yr(), i = cE();
  return t == null || r == null || n == null || i == null ? null : /* @__PURE__ */ x($E, Xu({}, e, {
    offset: r,
    layout: n,
    tooltipAxisBandSize: t,
    chartName: i
  }));
}
var Dg = /* @__PURE__ */ ge(null), LE = () => Ge(Dg), au = { exports: {} }, Qd;
function RE() {
  return Qd || (Qd = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, r = "~";
    function n() {
    }
    Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (r = !1));
    function i(l, c, s) {
      this.fn = l, this.context = c, this.once = s || !1;
    }
    function a(l, c, s, f, d) {
      if (typeof s != "function")
        throw new TypeError("The listener must be a function");
      var v = new i(s, f || l, d), h = r ? r + c : c;
      return l._events[h] ? l._events[h].fn ? l._events[h] = [l._events[h], v] : l._events[h].push(v) : (l._events[h] = v, l._eventsCount++), l;
    }
    function o(l, c) {
      --l._eventsCount === 0 ? l._events = new n() : delete l._events[c];
    }
    function u() {
      this._events = new n(), this._eventsCount = 0;
    }
    u.prototype.eventNames = function() {
      var c = [], s, f;
      if (this._eventsCount === 0) return c;
      for (f in s = this._events)
        t.call(s, f) && c.push(r ? f.slice(1) : f);
      return Object.getOwnPropertySymbols ? c.concat(Object.getOwnPropertySymbols(s)) : c;
    }, u.prototype.listeners = function(c) {
      var s = r ? r + c : c, f = this._events[s];
      if (!f) return [];
      if (f.fn) return [f.fn];
      for (var d = 0, v = f.length, h = new Array(v); d < v; d++)
        h[d] = f[d].fn;
      return h;
    }, u.prototype.listenerCount = function(c) {
      var s = r ? r + c : c, f = this._events[s];
      return f ? f.fn ? 1 : f.length : 0;
    }, u.prototype.emit = function(c, s, f, d, v, h) {
      var p = r ? r + c : c;
      if (!this._events[p]) return !1;
      var y = this._events[p], m = arguments.length, b, g;
      if (y.fn) {
        switch (y.once && this.removeListener(c, y.fn, void 0, !0), m) {
          case 1:
            return y.fn.call(y.context), !0;
          case 2:
            return y.fn.call(y.context, s), !0;
          case 3:
            return y.fn.call(y.context, s, f), !0;
          case 4:
            return y.fn.call(y.context, s, f, d), !0;
          case 5:
            return y.fn.call(y.context, s, f, d, v), !0;
          case 6:
            return y.fn.call(y.context, s, f, d, v, h), !0;
        }
        for (g = 1, b = new Array(m - 1); g < m; g++)
          b[g - 1] = arguments[g];
        y.fn.apply(y.context, b);
      } else {
        var A = y.length, O;
        for (g = 0; g < A; g++)
          switch (y[g].once && this.removeListener(c, y[g].fn, void 0, !0), m) {
            case 1:
              y[g].fn.call(y[g].context);
              break;
            case 2:
              y[g].fn.call(y[g].context, s);
              break;
            case 3:
              y[g].fn.call(y[g].context, s, f);
              break;
            case 4:
              y[g].fn.call(y[g].context, s, f, d);
              break;
            default:
              if (!b) for (O = 1, b = new Array(m - 1); O < m; O++)
                b[O - 1] = arguments[O];
              y[g].fn.apply(y[g].context, b);
          }
      }
      return !0;
    }, u.prototype.on = function(c, s, f) {
      return a(this, c, s, f, !1);
    }, u.prototype.once = function(c, s, f) {
      return a(this, c, s, f, !0);
    }, u.prototype.removeListener = function(c, s, f, d) {
      var v = r ? r + c : c;
      if (!this._events[v]) return this;
      if (!s)
        return o(this, v), this;
      var h = this._events[v];
      if (h.fn)
        h.fn === s && (!d || h.once) && (!f || h.context === f) && o(this, v);
      else {
        for (var p = 0, y = [], m = h.length; p < m; p++)
          (h[p].fn !== s || d && !h[p].once || f && h[p].context !== f) && y.push(h[p]);
        y.length ? this._events[v] = y.length === 1 ? y[0] : y : o(this, v);
      }
      return this;
    }, u.prototype.removeAllListeners = function(c) {
      var s;
      return c ? (s = r ? r + c : c, this._events[s] && o(this, s)) : (this._events = new n(), this._eventsCount = 0), this;
    }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = r, u.EventEmitter = u, e.exports = u;
  })(au)), au.exports;
}
var zE = RE();
const BE = /* @__PURE__ */ pw(zE);
var oi = new BE(), Zu = "recharts.syncEvent.tooltip", Jd = "recharts.syncEvent.brush", $g = (e, t) => {
  if (t && Array.isArray(e)) {
    var r = Number.parseInt(t, 10);
    if (!Wt(r))
      return e[r];
  }
}, WE = {
  chartName: "",
  tooltipPayloadSearcher: () => {
  },
  eventEmitter: void 0,
  defaultTooltipEventType: "axis"
}, Ng = Ke({
  name: "options",
  initialState: WE,
  reducers: {
    createEventEmitter: (e) => {
      e.eventEmitter == null && (e.eventEmitter = /* @__PURE__ */ Symbol("rechartsEventEmitter"));
    }
  }
}), FE = Ng.reducer, KE = Ng.actions.createEventEmitter;
function UE(e) {
  return e.tooltip.syncInteraction;
}
var HE = {
  chartData: void 0,
  computedData: void 0,
  dataStartIndex: 0,
  dataEndIndex: 0
}, Lg = Ke({
  name: "chartData",
  initialState: HE,
  reducers: {
    setChartData(e, t) {
      if (e.chartData = X(t.payload), t.payload == null) {
        e.dataStartIndex = 0, e.dataEndIndex = 0;
        return;
      }
      t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1);
    },
    setComputedData(e, t) {
      e.computedData = t.payload;
    },
    setDataStartEndIndexes(e, t) {
      var r = t.payload, n = r.startIndex, i = r.endIndex;
      n != null && (e.dataStartIndex = n), i != null && (e.dataEndIndex = i);
    }
  }
}), Rc = Lg.actions, ev = Rc.setChartData, YE = Rc.setDataStartEndIndexes;
Rc.setComputedData;
var qE = Lg.reducer, GE = ["x", "y"];
function tv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? tv(Object(r), !0).forEach(function(n) {
      VE(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : tv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function VE(e, t, r) {
  return (t = XE(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function XE(e) {
  var t = ZE(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ZE(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function QE(e, t) {
  if (e == null) return {};
  var r, n, i = JE(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function JE(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function eT() {
  var e = $(Ul), t = $(Hl), r = ae(), n = $(Ty), i = $(sr), a = Yr(), o = fo(), u = $((l) => l.rootProps.className);
  ce(() => {
    if (e == null)
      return Hr;
    var l = (c, s, f) => {
      if (t !== f && e === c) {
        if (s.payload.active === !1) {
          r(Un({
            active: !1,
            coordinate: void 0,
            dataKey: void 0,
            index: null,
            label: void 0,
            sourceViewBox: void 0,
            graphicalItemId: void 0
          }));
          return;
        }
        if (n === "index") {
          var d;
          if (o && s !== null && s !== void 0 && (d = s.payload) !== null && d !== void 0 && d.coordinate && s.payload.sourceViewBox) {
            var v = s.payload.coordinate, h = v.x, p = v.y, y = QE(v, GE), m = s.payload.sourceViewBox, b = m.x, g = m.y, A = m.width, O = m.height, w = rn(rn({}, y), {}, {
              x: o.x + (A ? (h - b) / A : 0) * o.width,
              y: o.y + (O ? (p - g) / O : 0) * o.height
            });
            r(rn(rn({}, s), {}, {
              payload: rn(rn({}, s.payload), {}, {
                coordinate: w
              })
            }));
          } else
            r(s);
          return;
        }
        if (i != null) {
          var S;
          if (typeof n == "function") {
            var _ = {
              activeTooltipIndex: s.payload.index == null ? void 0 : Number(s.payload.index),
              isTooltipActive: s.payload.active,
              activeIndex: s.payload.index == null ? void 0 : Number(s.payload.index),
              activeLabel: s.payload.label,
              activeDataKey: s.payload.dataKey,
              activeCoordinate: s.payload.coordinate
            }, E = n(i, _);
            S = i[E];
          } else n === "value" && (S = i.find((F) => String(F.value) === s.payload.label));
          var j = s.payload.coordinate;
          if (j == null || o == null) {
            r(Un({
              active: !1,
              coordinate: void 0,
              dataKey: void 0,
              index: null,
              label: void 0,
              sourceViewBox: void 0,
              graphicalItemId: void 0
            }));
            return;
          }
          if (S == null) {
            r(Un({
              active: !1,
              coordinate: void 0,
              dataKey: void 0,
              index: null,
              label: void 0,
              sourceViewBox: s.payload.sourceViewBox,
              graphicalItemId: void 0
            }));
            return;
          }
          var k = j.x, I = j.y, R = Math.min(k, o.x + o.width), N = Math.min(I, o.y + o.height), L = {
            x: a === "horizontal" ? S.coordinate : R,
            y: a === "horizontal" ? N : S.coordinate
          }, W = Un({
            active: s.payload.active,
            coordinate: L,
            dataKey: s.payload.dataKey,
            index: String(S.index),
            label: s.payload.label,
            sourceViewBox: s.payload.sourceViewBox,
            graphicalItemId: s.payload.graphicalItemId
          });
          r(W);
        }
      }
    };
    return oi.on(Zu, l), () => {
      oi.off(Zu, l);
    };
  }, [u, r, t, e, n, i, a, o]);
}
function tT() {
  var e = $(Ul), t = $(Hl), r = ae();
  ce(() => {
    if (e == null)
      return Hr;
    var n = (i, a, o) => {
      t !== o && e === i && r(YE(a));
    };
    return oi.on(Jd, n), () => {
      oi.off(Jd, n);
    };
  }, [r, t, e]);
}
function rT() {
  var e = ae();
  ce(() => {
    e(KE());
  }, [e]), eT(), tT();
}
function nT(e, t, r, n, i, a) {
  var o = $((h) => fE(h, e, t)), u = $(YC), l = $(Hl), c = $(Ul), s = $(Ty), f = $(UE), d = f?.sourceViewBox != null, v = fo();
  ce(() => {
    if (!d && c != null && l != null) {
      var h = Un({
        active: a,
        coordinate: r,
        dataKey: o,
        index: i,
        label: typeof n == "number" ? String(n) : n,
        sourceViewBox: v,
        graphicalItemId: u
      });
      oi.emit(Zu, c, h, l);
    }
  }, [d, r, o, u, i, n, l, c, s, a, v]);
}
function rv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function nv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? rv(Object(r), !0).forEach(function(n) {
      iT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : rv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function iT(e, t, r) {
  return (t = aT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function aT(e) {
  var t = oT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function oT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function uT(e, t) {
  return fT(e) || sT(e, t) || cT(e, t) || lT();
}
function lT() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function cT(e, t) {
  if (e) {
    if (typeof e == "string") return iv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? iv(e, t) : void 0;
  }
}
function iv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function sT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function fT(e) {
  if (Array.isArray(e)) return e;
}
function dT(e) {
  return e.dataKey;
}
function vT(e, t) {
  return /* @__PURE__ */ ve(e) ? /* @__PURE__ */ mt(e, t) : /* @__PURE__ */ x(typeof e == "function" ? e : iP, t);
}
var av = [], hT = {
  allowEscapeViewBox: {
    x: !1,
    y: !1
  },
  animationDuration: 400,
  animationEasing: "ease",
  axisId: 0,
  contentStyle: {},
  cursor: !0,
  filterNull: !0,
  includeHidden: !1,
  isAnimationActive: "auto",
  itemSorter: "name",
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: !1,
    y: !1
  },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  wrapperStyle: {}
};
function pT(e) {
  var t, r, n = Fe(e, hT), i = n.active, a = n.allowEscapeViewBox, o = n.animationDuration, u = n.animationEasing, l = n.content, c = n.filterNull, s = n.isAnimationActive, f = n.offset, d = n.payloadUniqBy, v = n.position, h = n.reverseDirection, p = n.useTranslate3d, y = n.wrapperStyle, m = n.cursor, b = n.shared, g = n.trigger, A = n.defaultIndex, O = n.portal, w = n.axisId, S = ae(), _ = typeof A == "number" ? String(A) : A;
  ce(() => {
    S(eC({
      shared: b,
      trigger: g,
      axisId: w,
      active: i,
      defaultIndex: _
    }));
  }, [S, b, g, w, i, _]);
  var E = fo(), j = uy(), k = Gj(b), I = (t = $((K) => hE(K, k, g, _))) !== null && t !== void 0 ? t : {}, R = I.activeIndex, N = I.isActive, L = $((K) => vE(K, k, g, _)), W = $((K) => Tg(K, k, g, _)), F = $((K) => dE(K, k, g, _)), z = L, q = LE(), U = (r = i ?? N) !== null && r !== void 0 ? r : !1, pe = gp([z, U]), ye = uT(pe, 2), fe = ye[0], Ye = ye[1], tt = k === "axis" ? W : void 0;
  nT(k, g, F, tt, R, U);
  var At = O ?? q;
  if (At == null || E == null || k == null)
    return null;
  var Ot = z ?? av;
  U || (Ot = av), c && Ot.length && (Ot = hp(Ot.filter((K) => K.value != null && (K.hide !== !0 || n.includeHidden)), d, dT));
  var Tn = Ot.length > 0, M = nv(nv({}, n), {}, {
    payload: Ot,
    label: tt,
    active: U,
    activeIndex: R,
    coordinate: F,
    accessibilityLayer: j
  }), H = /* @__PURE__ */ x(SP, {
    allowEscapeViewBox: a,
    animationDuration: o,
    animationEasing: u,
    isAnimationActive: s,
    active: U,
    coordinate: F,
    hasPayload: Tn,
    offset: f,
    position: v,
    reverseDirection: h,
    useTranslate3d: p,
    viewBox: E,
    wrapperStyle: y,
    lastBoundingBox: fe,
    innerRef: Ye,
    hasPortalFromProps: !!O
  }, vT(l, M));
  return /* @__PURE__ */ x(et, null, /* @__PURE__ */ fl(H, At), U && /* @__PURE__ */ x(NE, {
    cursor: m,
    tooltipEventType: k,
    coordinate: F,
    payload: Ot,
    index: R
  }));
}
var Rg = (e) => null;
Rg.displayName = "Cell";
function yT(e, t, r) {
  return (t = mT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function mT(e) {
  var t = gT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function gT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
class bT {
  constructor(t) {
    yT(this, "cache", /* @__PURE__ */ new Map()), this.maxSize = t;
  }
  get(t) {
    var r = this.cache.get(t);
    return r !== void 0 && (this.cache.delete(t), this.cache.set(t, r)), r;
  }
  set(t, r) {
    if (this.cache.has(t))
      this.cache.delete(t);
    else if (this.cache.size >= this.maxSize) {
      var n = this.cache.keys().next().value;
      n != null && this.cache.delete(n);
    }
    this.cache.set(t, r);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}
function ov(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function xT(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ov(Object(r), !0).forEach(function(n) {
      wT(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ov(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wT(e, t, r) {
  return (t = AT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function AT(e) {
  var t = OT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function OT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var PT = {
  cacheSize: 2e3,
  enableCache: !0
}, zg = xT({}, PT), uv = new bT(zg.cacheSize), ST = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, lv = "recharts_measurement_span";
function IT(e, t) {
  var r = t.fontSize || "", n = t.fontFamily || "", i = t.fontWeight || "", a = t.fontStyle || "", o = t.letterSpacing || "", u = t.textTransform || "";
  return "".concat(e, "|").concat(r, "|").concat(n, "|").concat(i, "|").concat(a, "|").concat(o, "|").concat(u);
}
var cv = (e, t) => {
  try {
    var r = document.getElementById(lv);
    r || (r = document.createElement("span"), r.setAttribute("id", lv), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, ST, t), r.textContent = "".concat(e);
    var n = r.getBoundingClientRect();
    return {
      width: n.width,
      height: n.height
    };
  } catch {
    return {
      width: 0,
      height: 0
    };
  }
}, Gn = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || pi.isSsr)
    return {
      width: 0,
      height: 0
    };
  if (!zg.enableCache)
    return cv(t, r);
  var n = IT(t, r), i = uv.get(n);
  if (i)
    return i;
  var a = cv(t, r);
  return uv.set(n, a), a;
}, Bg;
function $a(e, t) {
  return CT(e) || jT(e, t) || kT(e, t) || _T();
}
function _T() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function kT(e, t) {
  if (e) {
    if (typeof e == "string") return sv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? sv(e, t) : void 0;
  }
}
function sv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function jT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        l = !1;
      } else for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function CT(e) {
  if (Array.isArray(e)) return e;
}
function ET(e, t, r) {
  return (t = TT(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function TT(e) {
  var t = MT(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function MT(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var fv = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, dv = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, DT = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/, $T = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, NT = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, LT = ["cm", "mm", "pt", "pc", "in", "Q", "px"];
function RT(e) {
  return LT.includes(e);
}
var ln = "NaN";
function zT(e, t) {
  return e * NT[t];
}
class Ne {
  static parse(t) {
    var r, n = (r = $T.exec(t)) !== null && r !== void 0 ? r : [], i = $a(n, 3), a = i[1], o = i[2];
    return a == null ? Ne.NaN : new Ne(parseFloat(a), o ?? "");
  }
  constructor(t, r) {
    this.num = t, this.unit = r, this.num = t, this.unit = r, Wt(t) && (this.unit = ""), r !== "" && !DT.test(r) && (this.num = NaN, this.unit = ""), RT(r) && (this.num = zT(t, r), this.unit = "px");
  }
  add(t) {
    return this.unit !== t.unit ? new Ne(NaN, "") : new Ne(this.num + t.num, this.unit);
  }
  subtract(t) {
    return this.unit !== t.unit ? new Ne(NaN, "") : new Ne(this.num - t.num, this.unit);
  }
  multiply(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Ne(NaN, "") : new Ne(this.num * t.num, this.unit || t.unit);
  }
  divide(t) {
    return this.unit !== "" && t.unit !== "" && this.unit !== t.unit ? new Ne(NaN, "") : new Ne(this.num / t.num, this.unit || t.unit);
  }
  toString() {
    return "".concat(this.num).concat(this.unit);
  }
  isNaN() {
    return Wt(this.num);
  }
}
Bg = Ne;
ET(Ne, "NaN", new Bg(NaN, ""));
function Wg(e) {
  if (e == null || e.includes(ln))
    return ln;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = fv.exec(t)) !== null && r !== void 0 ? r : [], i = $a(n, 4), a = i[1], o = i[2], u = i[3], l = Ne.parse(a ?? ""), c = Ne.parse(u ?? ""), s = o === "*" ? l.multiply(c) : l.divide(c);
    if (s.isNaN())
      return ln;
    t = t.replace(fv, s.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var f, d = (f = dv.exec(t)) !== null && f !== void 0 ? f : [], v = $a(d, 4), h = v[1], p = v[2], y = v[3], m = Ne.parse(h ?? ""), b = Ne.parse(y ?? ""), g = p === "+" ? m.add(b) : m.subtract(b);
    if (g.isNaN())
      return ln;
    t = t.replace(dv, g.toString());
  }
  return t;
}
var vv = /\(([^()]*)\)/;
function BT(e) {
  for (var t = e, r; (r = vv.exec(t)) != null; ) {
    var n = r, i = $a(n, 2), a = i[1];
    t = t.replace(vv, Wg(a));
  }
  return t;
}
function WT(e) {
  var t = e.replace(/\s+/g, "");
  return t = BT(t), t = Wg(t), t;
}
function FT(e) {
  try {
    return WT(e);
  } catch {
    return ln;
  }
}
function ou(e) {
  var t = FT(e.slice(5, -1));
  return t === ln ? "" : t;
}
var KT = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"], UT = ["dx", "dy", "angle", "className", "breakAll"];
function Qu() {
  return Qu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qu.apply(null, arguments);
}
function hv(e, t) {
  if (e == null) return {};
  var r, n, i = HT(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function HT(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function pv(e, t) {
  return VT(e) || GT(e, t) || qT(e, t) || YT();
}
function YT() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qT(e, t) {
  if (e) {
    if (typeof e == "string") return yv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? yv(e, t) : void 0;
  }
}
function yv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function GT(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        l = !1;
      } else for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function VT(e) {
  if (Array.isArray(e)) return e;
}
var Fg = /[ \f\n\r\t\v\u2028\u2029]+/, Kg = (e) => {
  var t = e.children, r = e.breakAll, n = e.style;
  try {
    var i = [];
    se(t) || (r ? i = t.toString().split("") : i = t.toString().split(Fg));
    var a = i.map((u) => ({
      word: u,
      width: Gn(u, n).width
    })), o = r ? 0 : Gn(" ", n).width;
    return {
      wordsWithComputedWidth: a,
      spaceWidth: o
    };
  } catch {
    return null;
  }
};
function Ug(e) {
  return e === "start" || e === "middle" || e === "end" || e === "inherit";
}
function XT(e) {
  return se(e) || typeof e == "string" || typeof e == "number" || typeof e == "boolean";
}
var Hg = (e, t, r, n) => e.reduce((i, a) => {
  var o = a.word, u = a.width, l = i[i.length - 1];
  if (l && u != null && (t == null || n || l.width + u + r < Number(t)))
    l.words.push(o), l.width += u + r;
  else {
    var c = {
      words: [o],
      width: u
    };
    i.push(c);
  }
  return i;
}, []), Yg = (e) => e.reduce((t, r) => t.width > r.width ? t : r), ZT = "…", mv = (e, t, r, n, i, a, o, u) => {
  var l = e.slice(0, t), c = Kg({
    breakAll: r,
    style: n,
    children: l + ZT
  });
  if (!c)
    return [!1, []];
  var s = Hg(c.wordsWithComputedWidth, a, o, u), f = s.length > i || Yg(s).width > Number(a);
  return [f, s];
}, QT = (e, t, r, n, i) => {
  var a = e.maxLines, o = e.children, u = e.style, l = e.breakAll, c = T(a), s = String(o), f = Hg(t, n, r, i);
  if (!c || i)
    return f;
  var d = f.length > a || Yg(f).width > Number(n);
  if (!d)
    return f;
  for (var v = 0, h = s.length - 1, p = 0, y; v <= h && p <= s.length - 1; ) {
    var m = Math.floor((v + h) / 2), b = m - 1, g = mv(s, b, l, u, a, n, r, i), A = pv(g, 2), O = A[0], w = A[1], S = mv(s, m, l, u, a, n, r, i), _ = pv(S, 1), E = _[0];
    if (!O && !E && (v = m + 1), O && E && (h = m - 1), !O && E) {
      y = w;
      break;
    }
    p++;
  }
  return y || f;
}, gv = (e) => {
  var t = se(e) ? [] : e.toString().split(Fg);
  return [{
    words: t,
    width: void 0
  }];
}, JT = (e) => {
  var t = e.width, r = e.scaleToFit, n = e.children, i = e.style, a = e.breakAll, o = e.maxLines;
  if ((t || r) && !pi.isSsr) {
    var u, l, c = Kg({
      breakAll: a,
      children: n,
      style: i
    });
    if (c) {
      var s = c.wordsWithComputedWidth, f = c.spaceWidth;
      u = s, l = f;
    } else
      return gv(n);
    return QT({
      breakAll: a,
      children: n,
      maxLines: o,
      style: i
    }, u, l, t, !!r);
  }
  return gv(n);
}, qg = "#808080", eM = {
  angle: 0,
  breakAll: !1,
  // Magic number from d3
  capHeight: "0.71em",
  fill: qg,
  lineHeight: "1em",
  scaleToFit: !1,
  textAnchor: "start",
  // Maintain compat with existing charts / default SVG behavior
  verticalAnchor: "end",
  x: 0,
  y: 0
}, zc = /* @__PURE__ */ we((e, t) => {
  var r = Fe(e, eM), n = r.x, i = r.y, a = r.lineHeight, o = r.capHeight, u = r.fill, l = r.scaleToFit, c = r.textAnchor, s = r.verticalAnchor, f = hv(r, KT), d = ht(() => JT({
    breakAll: f.breakAll,
    children: f.children,
    maxLines: f.maxLines,
    scaleToFit: l,
    style: f.style,
    width: f.width
  }), [f.breakAll, f.children, f.maxLines, l, f.style, f.width]), v = f.dx, h = f.dy, p = f.angle, y = f.className, m = f.breakAll, b = hv(f, UT);
  if (!Ft(n) || !Ft(i) || d.length === 0)
    return null;
  var g = Number(n) + (T(v) ? v : 0), A = Number(i) + (T(h) ? h : 0);
  if (!V(g) || !V(A))
    return null;
  var O;
  switch (s) {
    case "start":
      O = ou("calc(".concat(o, ")"));
      break;
    case "middle":
      O = ou("calc(".concat((d.length - 1) / 2, " * -").concat(a, " + (").concat(o, " / 2))"));
      break;
    default:
      O = ou("calc(".concat(d.length - 1, " * -").concat(a, ")"));
      break;
  }
  var w = [], S = d[0];
  if (l && S != null) {
    var _ = S.width, E = f.width;
    w.push("scale(".concat(T(E) && T(_) ? E / _ : 1, ")"));
  }
  return p && w.push("rotate(".concat(p, ", ").concat(g, ", ").concat(A, ")")), w.length && (b.transform = w.join(" ")), /* @__PURE__ */ x("text", Qu({}, at(b), {
    ref: t,
    x: g,
    y: A,
    className: re("recharts-text", y),
    textAnchor: c,
    fill: u.includes("url") ? qg : u
  }), d.map((j, k) => {
    var I = j.words.join(m ? "" : " ");
    return (
      // duplicate words will cause duplicate keys which is why we add the array index here
      /* @__PURE__ */ x("tspan", {
        x: g,
        dy: k === 0 ? O : a,
        key: "".concat(I, "-").concat(k)
      }, I)
    );
  }));
});
zc.displayName = "Text";
var tM = ["labelRef"], rM = ["content"];
function bv(e, t) {
  if (e == null) return {};
  var r, n, i = nM(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function nM(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function xv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function jr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? xv(Object(r), !0).forEach(function(n) {
      iM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function iM(e, t, r) {
  return (t = aM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function aM(e) {
  var t = oM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function oM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Vt() {
  return Vt = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Vt.apply(null, arguments);
}
var Gg = /* @__PURE__ */ ge(null), uM = (e) => {
  var t = e.x, r = e.y, n = e.upperWidth, i = e.lowerWidth, a = e.width, o = e.height, u = e.children, l = ht(() => ({
    x: t,
    y: r,
    upperWidth: n,
    lowerWidth: i,
    width: a,
    height: o
  }), [t, r, n, i, a, o]);
  return /* @__PURE__ */ x(Gg.Provider, {
    value: l
  }, u);
}, Vg = () => {
  var e = Ge(Gg), t = fo();
  return e || (t ? hl(t) : void 0);
}, lM = /* @__PURE__ */ ge(null), cM = () => {
  var e = Ge(lM), t = $(Ly);
  return e || t;
}, sM = (e) => {
  var t = e.value, r = e.formatter, n = se(e.children) ? t : e.children;
  return typeof r == "function" ? r(n) : n;
}, Eo = (e) => e != null && typeof e == "function", fM = (e, t) => {
  var r = Xe(t - e), n = Math.min(Math.abs(t - e), 360);
  return r * n;
}, dM = (e, t, r, n, i) => {
  var a = e.offset, o = e.className, u = i.cx, l = i.cy, c = i.innerRadius, s = i.outerRadius, f = i.startAngle, d = i.endAngle, v = i.clockWise, h = (c + s) / 2, p = fM(f, d), y = p >= 0 ? 1 : -1, m, b;
  switch (t) {
    case "insideStart":
      m = f + y * a, b = v;
      break;
    case "insideEnd":
      m = d - y * a, b = !v;
      break;
    case "end":
      m = d + y * a, b = v;
      break;
    default:
      throw new Error("Unsupported position ".concat(t));
  }
  b = p <= 0 ? b : !b;
  var g = Le(u, l, h, m), A = Le(u, l, h, m + (b ? 1 : -1) * 359), O = "M".concat(g.x, ",").concat(g.y, `
    A`).concat(h, ",").concat(h, ",0,1,").concat(b ? 0 : 1, `,
    `).concat(A.x, ",").concat(A.y), w = se(e.id) ? Xn("recharts-radial-line-") : e.id;
  return /* @__PURE__ */ x("text", Vt({}, n, {
    dominantBaseline: "central",
    className: re("recharts-radial-bar-label", o)
  }), /* @__PURE__ */ x("defs", null, /* @__PURE__ */ x("path", {
    id: w,
    d: O
  })), /* @__PURE__ */ x("textPath", {
    xlinkHref: "#".concat(w)
  }, r));
}, vM = (e, t, r) => {
  var n = e.cx, i = e.cy, a = e.innerRadius, o = e.outerRadius, u = e.startAngle, l = e.endAngle, c = (u + l) / 2;
  if (r === "outside") {
    var s = Le(n, i, o + t, c), f = s.x, d = s.y;
    return {
      x: f,
      y: d,
      textAnchor: f >= n ? "start" : "end",
      verticalAnchor: "middle"
    };
  }
  if (r === "center")
    return {
      x: n,
      y: i,
      textAnchor: "middle",
      verticalAnchor: "middle"
    };
  if (r === "centerTop")
    return {
      x: n,
      y: i,
      textAnchor: "middle",
      verticalAnchor: "start"
    };
  if (r === "centerBottom")
    return {
      x: n,
      y: i,
      textAnchor: "middle",
      verticalAnchor: "end"
    };
  var v = (a + o) / 2, h = Le(n, i, v, c), p = h.x, y = h.y;
  return {
    x: p,
    y,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, un = (e) => e != null && "cx" in e && T(e.cx), hM = {
  angle: 0,
  offset: 5,
  zIndex: je.label,
  position: "middle",
  textBreakAll: !1
};
function pM(e) {
  if (!un(e))
    return e;
  var t = e.cx, r = e.cy, n = e.outerRadius, i = n * 2;
  return {
    x: t - n,
    y: r - n,
    width: i,
    upperWidth: i,
    lowerWidth: i,
    height: i
  };
}
function vr(e) {
  var t, r, n = Fe(e, hM), i = n.viewBox, a = n.parentViewBox, o = n.position, u = n.value, l = n.children, c = n.content, s = n.className, f = s === void 0 ? "" : s, d = n.textBreakAll, v = n.labelRef, h = cM(), p = Vg(), y = o === "center" ? p : h ?? p, m, b, g;
  i == null ? m = y : un(i) ? m = i : m = hl(i);
  var A = pM(m);
  if (!m || se(u) && se(l) && !/* @__PURE__ */ ve(c) && typeof c != "function")
    return null;
  var O = un(m) && (o === "insideStart" || o === "insideEnd" || o === "end");
  if (un(m))
    O || (g = vM(m, n.offset, n.position));
  else if (A) {
    var w = wh({
      viewBox: A,
      position: o,
      offset: n.offset,
      parentViewBox: un(a) ? void 0 : a,
      clamp: !0
    });
    g = jr(jr({
      x: w.x,
      y: w.y,
      textAnchor: w.horizontalAnchor,
      verticalAnchor: w.verticalAnchor
    }, w.width !== void 0 ? {
      width: w.width
    } : {}), w.height !== void 0 ? {
      height: w.height
    } : {});
  }
  var S = jr(jr(jr(jr({}, ((t = g) === null || t === void 0 ? void 0 : t.x) !== void 0 ? {
    x: g.x
  } : {}), ((r = g) === null || r === void 0 ? void 0 : r.y) !== void 0 ? {
    y: g.y
  } : {}), n), {}, {
    viewBox: m
  });
  if (/* @__PURE__ */ ve(c)) {
    S.labelRef;
    var _ = bv(S, tM);
    return /* @__PURE__ */ mt(c, _);
  }
  if (typeof c == "function") {
    S.content;
    var E = bv(S, rM);
    if (b = /* @__PURE__ */ x(c, E), /* @__PURE__ */ ve(b))
      return b;
  } else
    b = sM(n);
  var j = at(n);
  return O && un(m) ? dM(n, o, b, j, m) : g == null ? null : /* @__PURE__ */ x(wt, {
    zIndex: n.zIndex
  }, /* @__PURE__ */ x(zc, Vt({
    ref: v,
    className: re("recharts-label", f)
  }, j, g, {
    /*
     * textAnchor is decided by default based on the `position`
     * but we allow overriding via props for precise control.
     */
    textAnchor: Ug(j.textAnchor) ? j.textAnchor : g.textAnchor,
    breakAll: d
  }), b));
}
vr.displayName = "Label";
var yM = (e, t, r) => {
  if (!e)
    return null;
  var n = {
    viewBox: t,
    labelRef: r
  };
  return e === !0 ? /* @__PURE__ */ x(vr, Vt({
    key: "label-implicit"
  }, n)) : Ft(e) ? /* @__PURE__ */ x(vr, Vt({
    key: "label-implicit",
    value: e
  }, n)) : /* @__PURE__ */ ve(e) ? e.type === vr ? /* @__PURE__ */ mt(e, jr({
    key: "label-implicit"
  }, n)) : /* @__PURE__ */ x(vr, Vt({
    key: "label-implicit",
    content: e
  }, n)) : Eo(e) ? /* @__PURE__ */ x(vr, Vt({
    key: "label-implicit",
    content: e
  }, n)) : e && typeof e == "object" ? /* @__PURE__ */ x(vr, Vt({}, e, {
    key: "label-implicit"
  }, n)) : null;
};
function mM(e) {
  var t = e.label, r = e.labelRef, n = Vg();
  return yM(t, n, r) || null;
}
var gM = ["valueAccessor"], bM = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];
function Na() {
  return Na = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Na.apply(null, arguments);
}
function wv(e, t) {
  if (e == null) return {};
  var r, n, i = xM(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function xM(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var wM = (e) => {
  var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
  if (XT(t))
    return t;
}, Xg = /* @__PURE__ */ ge(void 0), Zg = Xg.Provider, Qg = /* @__PURE__ */ ge(void 0);
Qg.Provider;
function AM() {
  return Ge(Xg);
}
function OM() {
  return Ge(Qg);
}
function Xi(e) {
  var t = e.valueAccessor, r = t === void 0 ? wM : t, n = wv(e, gM), i = n.dataKey;
  n.clockWise;
  var a = n.id, o = n.textBreakAll, u = n.zIndex, l = wv(n, bM), c = AM(), s = OM(), f = c || s;
  return !f || !f.length ? null : /* @__PURE__ */ x(wt, {
    zIndex: u ?? je.label
  }, /* @__PURE__ */ x(ot, {
    className: "recharts-label-list"
  }, f.map((d, v) => {
    var h, p = se(i) ? r(d, v) : he(d.payload, i), y = se(a) ? {} : {
      id: "".concat(a, "-").concat(v)
    };
    return /* @__PURE__ */ x(vr, Na({
      key: "label-".concat(v)
    }, at(d), l, y, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (h = n.fill) !== null && h !== void 0 ? h : d.fill,
      parentViewBox: d.parentViewBox,
      value: p,
      textBreakAll: o,
      viewBox: d.viewBox,
      index: v,
      zIndex: 0
    }));
  })));
}
Xi.displayName = "LabelList";
function Jg(e) {
  var t = e.label;
  return t ? t === !0 ? /* @__PURE__ */ x(Xi, {
    key: "labelList-implicit"
  }) : /* @__PURE__ */ ve(t) || Eo(t) ? /* @__PURE__ */ x(Xi, {
    key: "labelList-implicit",
    content: t
  }) : typeof t == "object" ? /* @__PURE__ */ x(Xi, Na({
    key: "labelList-implicit"
  }, t, {
    type: String(t.type)
  })) : null : null;
}
function Ju() {
  return Ju = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ju.apply(null, arguments);
}
var e0 = (e) => {
  var t = e.cx, r = e.cy, n = e.r, i = e.className, a = re("recharts-dot", i);
  return T(t) && T(r) && T(n) ? /* @__PURE__ */ x("circle", Ju({}, _t(e), bl(e), {
    className: a,
    cx: t,
    cy: r,
    r: n
  })) : null;
}, PM = {
  radiusAxis: {},
  angleAxis: {}
}, t0 = Ke({
  name: "polarAxis",
  initialState: PM,
  reducers: {
    addRadiusAxis(e, t) {
      e.radiusAxis[t.payload.id] = X(t.payload);
    },
    removeRadiusAxis(e, t) {
      delete e.radiusAxis[t.payload.id];
    },
    addAngleAxis(e, t) {
      e.angleAxis[t.payload.id] = X(t.payload);
    },
    removeAngleAxis(e, t) {
      delete e.angleAxis[t.payload.id];
    }
  }
}), To = t0.actions;
To.addRadiusAxis;
To.removeRadiusAxis;
To.addAngleAxis;
To.removeAngleAxis;
var SM = t0.reducer;
function IM(e) {
  return e && typeof e == "object" && "className" in e && typeof e.className == "string" ? e.className : "";
}
var uu = { exports: {} }, te = {};
var Av;
function _M() {
  if (Av) return te;
  Av = 1;
  var e = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.portal"), r = /* @__PURE__ */ Symbol.for("react.fragment"), n = /* @__PURE__ */ Symbol.for("react.strict_mode"), i = /* @__PURE__ */ Symbol.for("react.profiler"), a = /* @__PURE__ */ Symbol.for("react.consumer"), o = /* @__PURE__ */ Symbol.for("react.context"), u = /* @__PURE__ */ Symbol.for("react.forward_ref"), l = /* @__PURE__ */ Symbol.for("react.suspense"), c = /* @__PURE__ */ Symbol.for("react.suspense_list"), s = /* @__PURE__ */ Symbol.for("react.memo"), f = /* @__PURE__ */ Symbol.for("react.lazy"), d = /* @__PURE__ */ Symbol.for("react.view_transition"), v = /* @__PURE__ */ Symbol.for("react.client.reference");
  function h(p) {
    if (typeof p == "object" && p !== null) {
      var y = p.$$typeof;
      switch (y) {
        case e:
          switch (p = p.type, p) {
            case r:
            case i:
            case n:
            case l:
            case c:
            case d:
              return p;
            default:
              switch (p = p && p.$$typeof, p) {
                case o:
                case u:
                case f:
                case s:
                  return p;
                case a:
                  return p;
                default:
                  return y;
              }
          }
        case t:
          return y;
      }
    }
  }
  return te.ContextConsumer = a, te.ContextProvider = o, te.Element = e, te.ForwardRef = u, te.Fragment = r, te.Lazy = f, te.Memo = s, te.Portal = t, te.Profiler = i, te.StrictMode = n, te.Suspense = l, te.SuspenseList = c, te.isContextConsumer = function(p) {
    return h(p) === a;
  }, te.isContextProvider = function(p) {
    return h(p) === o;
  }, te.isElement = function(p) {
    return typeof p == "object" && p !== null && p.$$typeof === e;
  }, te.isForwardRef = function(p) {
    return h(p) === u;
  }, te.isFragment = function(p) {
    return h(p) === r;
  }, te.isLazy = function(p) {
    return h(p) === f;
  }, te.isMemo = function(p) {
    return h(p) === s;
  }, te.isPortal = function(p) {
    return h(p) === t;
  }, te.isProfiler = function(p) {
    return h(p) === i;
  }, te.isStrictMode = function(p) {
    return h(p) === n;
  }, te.isSuspense = function(p) {
    return h(p) === l;
  }, te.isSuspenseList = function(p) {
    return h(p) === c;
  }, te.isValidElementType = function(p) {
    return typeof p == "string" || typeof p == "function" || p === r || p === i || p === n || p === l || p === c || p === d || typeof p == "object" && p !== null && (p.$$typeof === f || p.$$typeof === s || p.$$typeof === o || p.$$typeof === a || p.$$typeof === u || p.$$typeof === v || p.getModuleId !== void 0);
  }, te.typeOf = h, te;
}
var Ov;
function kM() {
  return Ov || (Ov = 1, uu.exports = /* @__PURE__ */ _M()), uu.exports;
}
var jM = /* @__PURE__ */ kM(), Pv = (e) => typeof e == "string" ? e : e ? e.displayName || e.name || "Component" : "", Sv = null, lu = null, r0 = (e) => {
  if (e === Sv && Array.isArray(lu))
    return lu;
  var t = [];
  return fh.forEach(e, (r) => {
    se(r) || (jM.isFragment(r) ? t = t.concat(r0(r.props.children)) : t.push(r));
  }), lu = t, Sv = e, t;
};
function CM(e, t) {
  var r = [], n = [];
  return Array.isArray(t) ? n = t.map((i) => Pv(i)) : n = [Pv(t)], r0(e).forEach((i) => {
    var a = tr(i, "type.displayName") || tr(i, "type.name");
    a && n.indexOf(a) !== -1 && r.push(i);
  }), r;
}
var n0 = (e) => e && typeof e == "object" && "clipDot" in e ? !!e.clipDot : !0;
function Iv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _v(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Iv(Object(r), !0).forEach(function(n) {
      EM(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Iv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function EM(e, t, r) {
  return (t = TM(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function TM(e) {
  var t = MM(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function MM(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function i0(e, t) {
  return _v(_v({}, t), e);
}
function DM(e) {
  return /* @__PURE__ */ ve(e) ? e.props : e;
}
function $M(e, t) {
  return /* @__PURE__ */ mt(e, i0(DM(e), t));
}
function NM(e) {
  if ("index" in e) {
    var t = e.index;
    return typeof t == "number" || typeof t == "string" ? t : void 0;
  }
}
function LM(e) {
  return "isActive" in e && e.isActive === !0;
}
function a0(e) {
  var t = e.option, r = e.DefaultShape, n = e.shapeProps, i = e.activeClassName, a = i === void 0 ? "recharts-active-shape" : i, o = e.inActiveClassName, u = o === void 0 ? "recharts-shape" : o, l = NM(n), c;
  return /* @__PURE__ */ ve(t) ? c = $M(t, n) : t === r ? c = /* @__PURE__ */ x(r, n) : typeof t == "function" ? c = t(n, l) : typeof t == "object" ? c = /* @__PURE__ */ x(r, i0(t, n)) : c = /* @__PURE__ */ x(r, n), LM(n) ? /* @__PURE__ */ x(ot, {
    className: a
  }, c) : /* @__PURE__ */ x(ot, {
    className: u
  }, c);
}
var o0 = (e, t, r) => {
  var n = ae();
  return (i, a) => (o) => {
    e?.(i, a, o), n(fg({
      activeIndex: String(a),
      activeDataKey: t,
      activeCoordinate: i.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
}, u0 = (e) => {
  var t = ae();
  return (r, n) => (i) => {
    e?.(r, n, i), t(tC());
  };
}, l0 = (e, t, r) => {
  var n = ae();
  return (i, a) => (o) => {
    e?.(i, a, o), n(rC({
      activeIndex: String(a),
      activeDataKey: t,
      activeCoordinate: i.tooltipPosition,
      activeGraphicalItemId: r
    }));
  };
};
function c0(e) {
  var t = e.tooltipEntrySettings, r = ae(), n = Ue(), i = Y(null);
  return xe(() => {
    n || (i.current === null ? r(Zj(t)) : i.current !== t && r(Qj({
      prev: i.current,
      next: t
    })), i.current = t);
  }, [t, r, n]), xe(() => () => {
    i.current && (r(Jj(i.current)), i.current = null);
  }, [r]), null;
}
function s0(e) {
  var t = e.legendPayload, r = ae(), n = Ue(), i = Y(null);
  return xe(() => {
    n || (i.current === null ? r(eO(t)) : i.current !== t && r(tO({
      prev: i.current,
      next: t
    })), i.current = t);
  }, [r, n, t]), xe(() => () => {
    i.current && (r(rO(i.current)), i.current = null);
  }, [r]), null;
}
function RM(e, t) {
  return FM(e) || WM(e, t) || BM(e, t) || zM();
}
function zM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function BM(e, t) {
  if (e) {
    if (typeof e == "string") return kv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? kv(e, t) : void 0;
  }
}
function kv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function WM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function FM(e) {
  if (Array.isArray(e)) return e;
}
var Bc = "index", f0 = "append";
function Wc(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [], n = [];
  for (var i of r)
    n.push({
      status: "removed",
      prev: i
    });
  for (var a = 0; a < t.length; a++) {
    var o = e[a], u = t[a];
    o != null ? n.push({
      status: "matched",
      prev: o,
      next: u
    }) : n.push({
      status: "added",
      next: u
    });
  }
  return n;
}
function KM(e, t) {
  var r = e.length / t.length, n = t.map((i, a) => e[Math.floor(a * r)]);
  return Wc(n, t);
}
function UM(e, t) {
  var r = t.map((n, i) => e[i]);
  return Wc(r, t);
}
function HM(e, t) {
  for (var r = /* @__PURE__ */ new Map(), n = 0; n < e.length; n++) {
    var i = e[n];
    if (i != null) {
      var a = t(i, n);
      a != null && !r.has(a) && r.set(a, i);
    }
  }
  return r;
}
function YM(e, t, r) {
  var n = HM(e, r), i = /* @__PURE__ */ new Set(), a = t.map((f, d) => {
    var v = r(f, d);
    if (v != null) {
      var h = n.get(v);
      if (h !== void 0)
        return i.add(v), h;
    }
  }), o = [];
  for (var u of n) {
    var l = RM(u, 2), c = l[0], s = l[1];
    i.has(c) || o.push(s);
  }
  return Wc(a, t, o);
}
function qM(e, t, r) {
  return t == null ? null : e == null ? t.map((n) => ({
    status: "added",
    next: n
  })) : r === Bc ? KM(e, t) : r === f0 ? UM(e, t) : YM(e, t, r);
}
function GM(e, t) {
  var r = Y(e), n = Y(t.current), i = Y(!0);
  r.current !== e && (r.current = e, n.current = t.current, i.current = !1);
  var a = Q(function(o, u) {
    var l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
    if (u === 0) {
      i.current = !0;
      return;
    }
    u === 1 && (n.current = o), u > 0 && i.current && l && (t.current = o);
  }, [t]);
  return {
    startValue: n.current,
    syncStepValue: a
  };
}
function VM(e, t) {
  return JM(e) || QM(e, t) || ZM(e, t) || XM();
}
function XM() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ZM(e, t) {
  if (e) {
    if (typeof e == "string") return jv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? jv(e, t) : void 0;
  }
}
function jv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function QM(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function JM(e) {
  if (Array.isArray(e)) return e;
}
function d0(e, t) {
  var r = Se(!1), n = VM(r, 2), i = n[0], a = n[1], o = Q(() => {
    typeof e == "function" && e(), a(!0);
  }, [e]), u = Q(() => {
    typeof t == "function" && t(), a(!1);
  }, [t]);
  return {
    isAnimating: i,
    handleAnimationStart: o,
    handleAnimationEnd: u
  };
}
function v0(e) {
  var t, r = e.animationInput, n = e.animationIdPrefix, i = e.items, a = e.previousItemsRef, o = e.isAnimationActive, u = e.animationBegin, l = e.animationDuration, c = e.animationEasing, s = e.onAnimationStart, f = e.onAnimationEnd, d = e.animationInterpolateFn, v = e.animationMatchBy, h = e.shouldUpdatePreviousRef, p = e.children, y = e.layout, m = vy(r, n), b = GM(m, a), g = (t = b.startValue) !== null && t !== void 0 ? t : null, A = qM(g, i, v ?? Bc);
  return /* @__PURE__ */ x(dy, {
    animationId: m,
    begin: u,
    duration: l,
    isActive: o,
    easing: c,
    onAnimationEnd: f,
    onAnimationStart: s,
    key: m
  }, (O) => {
    var w = g == null, S = i == null ? i : d(A, O, y), _ = h ? h(O) : O > 0;
    return b.syncStepValue(S, O, _), S == null ? null : p(S, O, w);
  });
}
var cu;
function eD(e, t) {
  return iD(e) || nD(e, t) || rD(e, t) || tD();
}
function tD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rD(e, t) {
  if (e) {
    if (typeof e == "string") return Cv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Cv(e, t) : void 0;
  }
}
function Cv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function nD(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function iD(e) {
  if (Array.isArray(e)) return e;
}
var aD = () => {
  var e = Se(() => Xn("uid-")), t = eD(e, 1), r = t[0];
  return r;
}, oD = (cu = hh.useId) !== null && cu !== void 0 ? cu : aD;
function uD(e, t) {
  var r = oD();
  return t || (e ? "".concat(e, "-").concat(r) : r);
}
var lD = /* @__PURE__ */ ge(void 0), h0 = (e) => {
  var t = e.id, r = e.type, n = e.children, i = uD("recharts-".concat(r), t);
  return /* @__PURE__ */ x(lD.Provider, {
    value: i
  }, n(i));
}, cD = {
  cartesianItems: [],
  polarItems: []
}, p0 = Ke({
  name: "graphicalItems",
  initialState: cD,
  reducers: {
    addCartesianGraphicalItem: {
      reducer(e, t) {
        e.cartesianItems.push(X(t.payload));
      },
      prepare: oe()
    },
    replaceCartesianGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next, a = dt(e).cartesianItems.indexOf(X(n));
        a > -1 && (e.cartesianItems[a] = X(i));
      },
      prepare: oe()
    },
    removeCartesianGraphicalItem: {
      reducer(e, t) {
        var r = dt(e).cartesianItems.indexOf(X(t.payload));
        r > -1 && e.cartesianItems.splice(r, 1);
      },
      prepare: oe()
    },
    addPolarGraphicalItem: {
      reducer(e, t) {
        e.polarItems.push(X(t.payload));
      },
      prepare: oe()
    },
    removePolarGraphicalItem: {
      reducer(e, t) {
        var r = dt(e).polarItems.indexOf(X(t.payload));
        r > -1 && e.polarItems.splice(r, 1);
      },
      prepare: oe()
    },
    replacePolarGraphicalItem: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next, a = dt(e).polarItems.indexOf(X(n));
        a > -1 && (e.polarItems[a] = X(i));
      },
      prepare: oe()
    }
  }
}), Cn = p0.actions, sD = Cn.addCartesianGraphicalItem, fD = Cn.replaceCartesianGraphicalItem, dD = Cn.removeCartesianGraphicalItem;
Cn.addPolarGraphicalItem;
Cn.removePolarGraphicalItem;
Cn.replacePolarGraphicalItem;
var vD = p0.reducer, hD = (e) => {
  var t = ae(), r = Y(null);
  return xe(() => {
    r.current === null ? t(sD(e)) : r.current !== e && t(fD({
      prev: r.current,
      next: e
    })), r.current = e;
  }, [t, e]), xe(() => () => {
    r.current && (t(dD(r.current)), r.current = null);
  }, [t]), null;
}, y0 = /* @__PURE__ */ gt(hD), pD = ["points"];
function Ev(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function su(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ev(Object(r), !0).forEach(function(n) {
      yD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Ev(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function yD(e, t, r) {
  return (t = mD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function mD(e) {
  var t = gD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function gD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function La() {
  return La = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, La.apply(null, arguments);
}
function bD(e, t) {
  if (e == null) return {};
  var r, n, i = xD(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function xD(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function wD(e) {
  var t = e.option, r = e.dotProps, n = e.className;
  if (/* @__PURE__ */ ve(t))
    return /* @__PURE__ */ mt(t, r);
  if (typeof t == "function")
    return t(r);
  var i = re(n, typeof t != "boolean" ? t.className : ""), a = r ?? {};
  a.points;
  var o = bD(a, pD);
  return /* @__PURE__ */ x(e0, La({}, o, {
    className: i
  }));
}
function AD(e, t) {
  return e == null ? !1 : t ? !0 : e.length === 1;
}
function OD(e) {
  var t = e.points, r = e.dot, n = e.className, i = e.dotClassName, a = e.dataKey, o = e.baseProps, u = e.needClip, l = e.clipPathId, c = e.zIndex, s = c === void 0 ? je.scatter : c;
  if (!AD(t, r))
    return null;
  var f = n0(r), d = Sb(r), v = t.map((p, y) => {
    var m, b, g = su(su(su({
      r: 3
    }, o), d), {}, {
      index: y,
      cx: (m = p.x) !== null && m !== void 0 ? m : void 0,
      cy: (b = p.y) !== null && b !== void 0 ? b : void 0,
      dataKey: a,
      value: p.value,
      payload: p.payload,
      points: t
    });
    return /* @__PURE__ */ x(wD, {
      key: "dot-".concat(y),
      option: r,
      dotProps: g,
      className: i
    });
  }), h = {};
  return u && l != null && (h.clipPath = "url(#clipPath-".concat(f ? "" : "dots-").concat(l, ")")), /* @__PURE__ */ x(wt, {
    zIndex: s
  }, /* @__PURE__ */ x(ot, La({
    className: n
  }, h), v));
}
function Tv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Wi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Tv(Object(r), !0).forEach(function(n) {
      PD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Tv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function PD(e, t, r) {
  return (t = SD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function SD(e) {
  var t = ID(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function ID(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var m0 = 0, _D = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
}, g0 = Ke({
  name: "cartesianAxis",
  initialState: _D,
  reducers: {
    addXAxis: {
      reducer(e, t) {
        e.xAxis[t.payload.id] = X(t.payload);
      },
      prepare: oe()
    },
    replaceXAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next;
        e.xAxis[n.id] !== void 0 && (n.id !== i.id && delete e.xAxis[n.id], e.xAxis[i.id] = X(i));
      },
      prepare: oe()
    },
    removeXAxis: {
      reducer(e, t) {
        delete e.xAxis[t.payload.id];
      },
      prepare: oe()
    },
    addYAxis: {
      reducer(e, t) {
        e.yAxis[t.payload.id] = X(t.payload);
      },
      prepare: oe()
    },
    replaceYAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next;
        e.yAxis[n.id] !== void 0 && (n.id !== i.id && delete e.yAxis[n.id], e.yAxis[i.id] = X(i));
      },
      prepare: oe()
    },
    removeYAxis: {
      reducer(e, t) {
        delete e.yAxis[t.payload.id];
      },
      prepare: oe()
    },
    addZAxis: {
      reducer(e, t) {
        e.zAxis[t.payload.id] = X(t.payload);
      },
      prepare: oe()
    },
    replaceZAxis: {
      reducer(e, t) {
        var r = t.payload, n = r.prev, i = r.next;
        e.zAxis[n.id] !== void 0 && (n.id !== i.id && delete e.zAxis[n.id], e.zAxis[i.id] = X(i));
      },
      prepare: oe()
    },
    removeZAxis: {
      reducer(e, t) {
        delete e.zAxis[t.payload.id];
      },
      prepare: oe()
    },
    updateYAxisWidth(e, t) {
      var r = t.payload, n = r.id, i = r.width, a = e.yAxis[n];
      if (a) {
        var o, u = a.widthHistory || [];
        if (u.length === 3 && u[0] === u[2] && i === u[1] && i !== a.width && Math.abs(i - ((o = u[0]) !== null && o !== void 0 ? o : 0)) <= 1)
          return;
        var l = [...u, i].slice(-3);
        e.yAxis[n] = Wi(Wi({}, a), {}, {
          width: i,
          widthHistory: l
        });
      }
    },
    updateXAxisHeight(e, t) {
      var r = t.payload, n = r.id, i = r.height, a = e.xAxis[n];
      if (a) {
        var o, u = a.heightHistory || [];
        if (u.length === 3 && u[0] === u[2] && i === u[1] && i !== a.height && Math.abs(i - ((o = u[0]) !== null && o !== void 0 ? o : 0)) <= 1)
          return;
        var l = [...u, i].slice(-3);
        e.xAxis[n] = Wi(Wi({}, a), {}, {
          height: i,
          heightHistory: l
        });
      }
    }
  }
}), Tt = g0.actions, kD = Tt.addXAxis, jD = Tt.replaceXAxis, CD = Tt.removeXAxis, ED = Tt.addYAxis, TD = Tt.replaceYAxis, MD = Tt.removeYAxis;
Tt.addZAxis;
Tt.replaceZAxis;
Tt.removeZAxis;
var DD = Tt.updateYAxisWidth, $D = Tt.updateXAxisHeight, ND = g0.reducer, LD = P([Ce], (e) => ({
  top: e.top,
  bottom: e.bottom,
  left: e.left,
  right: e.right
})), RD = P([LD, Ht, Yt], (e, t, r) => {
  if (!(!e || t == null || r == null))
    return {
      x: e.left,
      y: e.top,
      width: Math.max(0, t - e.left - e.right),
      height: Math.max(0, r - e.top - e.bottom)
    };
}), Fc = () => $(RD), zD = () => $(ZC);
function Mv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function fu(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Mv(Object(r), !0).forEach(function(n) {
      BD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Mv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function BD(e, t, r) {
  return (t = WD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function WD(e) {
  var t = FD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function FD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var KD = (e) => {
  var t = e.point, r = e.childIndex, n = e.mainColor, i = e.activeDot, a = e.dataKey, o = e.clipPath;
  if (i === !1 || t.x == null || t.y == null)
    return null;
  var u = {
    index: r,
    dataKey: a,
    cx: t.x,
    cy: t.y,
    r: 4,
    fill: n ?? "none",
    strokeWidth: 2,
    stroke: "#fff",
    payload: t.payload,
    value: t.value
  }, l = fu(fu(fu({}, u), li(i)), bl(i)), c;
  return /* @__PURE__ */ ve(i) ? c = /* @__PURE__ */ mt(i, l) : typeof i == "function" ? c = i(l) : c = /* @__PURE__ */ x(e0, l), /* @__PURE__ */ x(ot, {
    className: "recharts-active-dot",
    clipPath: o
  }, c);
};
function UD(e) {
  var t = e.points, r = e.mainColor, n = e.activeDot, i = e.itemDataKey, a = e.clipPath, o = e.zIndex, u = o === void 0 ? je.activeDot : o, l = $(Kr), c = zD();
  if (t == null || c == null)
    return null;
  var s = t.find((f) => c.includes(f.payload));
  return se(s) ? null : /* @__PURE__ */ x(wt, {
    zIndex: u
  }, /* @__PURE__ */ x(KD, {
    point: s,
    childIndex: Number(l),
    mainColor: r,
    dataKey: i,
    activeDot: n,
    clipPath: a
  }));
}
function HD(e, t) {
  return VD(e) || GD(e, t) || qD(e, t) || YD();
}
function YD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function qD(e, t) {
  if (e) {
    if (typeof e == "string") return Dv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Dv(e, t) : void 0;
  }
}
function Dv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function GD(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function VD(e) {
  if (Array.isArray(e)) return e;
}
var $v = (e, t, r) => {
  var n = r ?? e;
  if (!se(n))
    return kt(n, t, 0);
}, XD = (e, t, r) => {
  var n = {}, i = e.filter(go), a = e.filter((c) => c.stackId == null), o = i.reduce((c, s) => {
    var f = c[s.stackId];
    return f == null && (f = []), f.push(s), c[s.stackId] = f, c;
  }, n), u = Object.entries(o).map((c) => {
    var s, f = HD(c, 2), d = f[0], v = f[1], h = v.map((y) => y.dataKey), p = $v(t, r, (s = v[0]) === null || s === void 0 ? void 0 : s.barSize);
    return {
      stackId: d,
      dataKeys: h,
      barSize: p
    };
  }), l = a.map((c) => {
    var s = [c.dataKey].filter((d) => d != null), f = $v(t, r, c.barSize);
    return {
      stackId: void 0,
      dataKeys: s,
      barSize: f
    };
  });
  return [...u, ...l];
};
function Nv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Fi(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Nv(Object(r), !0).forEach(function(n) {
      ZD(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Nv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ZD(e, t, r) {
  return (t = QD(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function QD(e) {
  var t = JD(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function JD(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function e$(e, t, r, n, i) {
  var a, o = n.length;
  if (!(o < 1)) {
    var u = kt(e, r, 0, !0), l, c = [];
    if (V((a = n[0]) === null || a === void 0 ? void 0 : a.barSize)) {
      var s = !1, f = r / o, d = n.reduce((b, g) => b + (g.barSize || 0), 0);
      d += (o - 1) * u, d >= r && (d -= (o - 1) * u, u = 0), d >= r && f > 0 && (s = !0, f *= 0.9, d = o * f);
      var v = Math.round((r - d) / 2), h = {
        offset: v - u,
        size: 0
      };
      l = n.reduce((b, g) => {
        var A, O = {
          stackId: g.stackId,
          dataKeys: g.dataKeys,
          position: {
            offset: h.offset + h.size + u,
            size: s ? f : (A = g.barSize) !== null && A !== void 0 ? A : 0
          }
        }, w = [...b, O];
        return h = O.position, w;
      }, c);
    } else {
      var p = kt(t, r, 0, !0);
      r - 2 * p - (o - 1) * u <= 0 && (u = 0);
      var y = (r - 2 * p - (o - 1) * u) / o;
      y > 1 && (y = Math.round(y));
      var m = V(i) ? Math.min(y, i) : y;
      l = n.reduce((b, g, A) => [...b, {
        stackId: g.stackId,
        dataKeys: g.dataKeys,
        position: {
          offset: p + o * (y - m) / 2 + (m + u) * A,
          size: m
        }
      }], c);
    }
    return l;
  }
}
var t$ = (e, t, r, n, i, a, o) => {
  var u = se(o) ? t : o, l = e$(r, n, i !== a ? i : a, e, u);
  return i !== a && l != null && (l = l.map((c) => Fi(Fi({}, c), {}, {
    position: Fi(Fi({}, c.position), {}, {
      offset: c.position.offset - i / 2
    })
  }))), l;
}, r$ = (e, t) => {
  var r = Vl(t);
  if (!(!e || r == null || t == null)) {
    var n = t.stackId;
    if (n != null) {
      var i = e[n];
      if (i) {
        var a = i.stackedData;
        if (a)
          return a.find((o) => o.key === r);
      }
    }
  }
}, n$ = (e, t) => {
  if (!(e == null || t == null)) {
    var r = e.find((n) => n.stackId === t.stackId && t.dataKey != null && n.dataKeys.includes(t.dataKey));
    if (r != null)
      return r.position;
  }
};
function i$(e, t) {
  return e && typeof e == "object" && "zIndex" in e && typeof e.zIndex == "number" && V(e.zIndex) ? e.zIndex : t;
}
var a$ = (e) => {
  var t = e.chartData, r = ae(), n = Ue();
  return ce(() => n ? () => {
  } : (r(ev(t)), () => {
    r(ev(void 0));
  }), [t, r, n]), null;
}, Lv = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}, b0 = Ke({
  name: "brush",
  initialState: Lv,
  reducers: {
    setBrushSettings(e, t) {
      return t.payload == null ? Lv : t.payload;
    }
  }
});
b0.actions.setBrushSettings;
var o$ = b0.reducer;
function u$(e) {
  return (e % 180 + 180) % 180;
}
var l$ = function(t) {
  var r = t.width, n = t.height, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, a = u$(i), o = a * Math.PI / 180, u = Math.atan(n / r), l = o > u && o < Math.PI - u ? n / Math.sin(o) : r / Math.cos(o);
  return Math.abs(l);
}, c$ = {
  dots: [],
  areas: [],
  lines: []
}, x0 = Ke({
  name: "referenceElements",
  initialState: c$,
  reducers: {
    addDot: (e, t) => {
      e.dots.push(t.payload);
    },
    removeDot: (e, t) => {
      var r = dt(e).dots.findIndex((n) => n === t.payload);
      r !== -1 && e.dots.splice(r, 1);
    },
    addArea: (e, t) => {
      e.areas.push(t.payload);
    },
    removeArea: (e, t) => {
      var r = dt(e).areas.findIndex((n) => n === t.payload);
      r !== -1 && e.areas.splice(r, 1);
    },
    addLine: (e, t) => {
      e.lines.push(X(t.payload));
    },
    removeLine: (e, t) => {
      var r = dt(e).lines.findIndex((n) => n === t.payload);
      r !== -1 && e.lines.splice(r, 1);
    }
  }
}), En = x0.actions;
En.addDot;
En.removeDot;
En.addArea;
En.removeArea;
En.addLine;
En.removeLine;
var s$ = x0.reducer;
function f$(e, t) {
  return p$(e) || h$(e, t) || v$(e, t) || d$();
}
function d$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function v$(e, t) {
  if (e) {
    if (typeof e == "string") return Rv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Rv(e, t) : void 0;
  }
}
function Rv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function h$(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function p$(e) {
  if (Array.isArray(e)) return e;
}
var y$ = /* @__PURE__ */ ge(void 0), m$ = (e) => {
  var t = e.children, r = Se("".concat(Xn("recharts"), "-clip")), n = f$(r, 1), i = n[0], a = Fc();
  if (a == null)
    return null;
  var o = a.x, u = a.y, l = a.width, c = a.height;
  return /* @__PURE__ */ x(y$.Provider, {
    value: i
  }, /* @__PURE__ */ x("defs", null, /* @__PURE__ */ x("clipPath", {
    id: i
  }, /* @__PURE__ */ x("rect", {
    x: o,
    y: u,
    height: c,
    width: l
  }))), t);
};
function g$() {
}
function zv(e) {
  if (!e || typeof e != "object") return !1;
  const t = Object.getPrototypeOf(e);
  return t === null || t === Object.prototype || Object.getPrototypeOf(t) === null ? Object.prototype.toString.call(e) === "[object Object]" : !1;
}
function b$(e, t, r) {
  return Hn(e, t, void 0, void 0, void 0, void 0, r);
}
function Hn(e, t, r, n, i, a, o) {
  const u = o(e, t, r, n, i, a);
  if (u !== void 0) return u;
  if (typeof e == typeof t) switch (typeof e) {
    case "bigint":
    case "string":
    case "boolean":
    case "symbol":
    case "undefined":
      return e === t;
    case "number":
      return e === t || Object.is(e, t);
    case "function":
      return e === t;
    case "object":
      return Vn(e, t, a, o);
  }
  return Vn(e, t, a, o);
}
function Vn(e, t, r, n) {
  if (Object.is(e, t)) return !0;
  let i = dn(e), a = dn(t);
  if (i === "[object Arguments]" && (i = Yi), a === "[object Arguments]" && (a = Yi), i !== a) return !1;
  switch (i) {
    case wl:
      return e.toString() === t.toString();
    case Al:
      return Yn(e.valueOf(), t.valueOf());
    case Ol:
    case Gh:
    case qh:
      return Object.is(e.valueOf(), t.valueOf());
    case Hh:
      return e.source === t.source && e.flags === t.flags;
    case Xx:
      return e === t;
  }
  r = r ?? /* @__PURE__ */ new Map();
  const o = r.get(e), u = r.get(t);
  if (o != null && u != null) return o === t;
  r.set(e, t), r.set(t, e);
  try {
    switch (i) {
      case Vh:
        if (e.size !== t.size) return !1;
        for (const [l, c] of e.entries()) if (!t.has(l) || !Hn(c, t.get(l), l, e, t, r, n)) return !1;
        return !0;
      case Xh: {
        if (e.size !== t.size) return !1;
        const l = Array.from(e.values()), c = Array.from(t.values());
        for (let s = 0; s < l.length; s++) {
          const f = l[s], d = c.findIndex((v) => Hn(f, v, void 0, e, t, r, n));
          if (d === -1) return !1;
          c.splice(d, 1);
        }
        return !0;
      }
      case Zh:
      case ep:
      case tp:
      case rp:
      case np:
      case Qx:
      case ip:
      case ap:
      case op:
      case Jx:
      case up:
      case lp:
        if (Ou(e) !== Ou(t) || e.length !== t.length) return !1;
        for (let l = 0; l < e.length; l++) if (!Hn(e[l], t[l], l, e, t, r, n)) return !1;
        return !0;
      case Qh:
        return e.byteLength !== t.byteLength ? !1 : Vn(new Uint8Array(e), new Uint8Array(t), r, n);
      case Jh:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : Vn(new Uint8Array(e), new Uint8Array(t), r, n);
      case Zx:
        return e.name === t.name && e.message === t.message;
      case Yi: {
        if (!(Vn(e.constructor, t.constructor, r, n) || zv(e) && zv(t))) return !1;
        const l = [...Object.keys(e), ...Au(e)], c = [...Object.keys(t), ...Au(t)];
        if (l.length !== c.length) return !1;
        for (let s = 0; s < l.length; s++) {
          const f = l[s], d = e[f];
          if (!Object.hasOwn(t, f)) return !1;
          const v = t[f];
          if (!Hn(d, v, f, e, t, r, n)) return !1;
        }
        return !0;
      }
      default:
        return !1;
    }
  } finally {
    r.delete(e), r.delete(t);
  }
}
function x$(e, t) {
  return b$(e, t, g$);
}
function w0(e, t) {
  if (t < 1)
    return [];
  if (t === 1)
    return e;
  for (var r = [], n = 0; n < e.length; n += t) {
    var i = e[n];
    i !== void 0 && r.push(i);
  }
  return r;
}
function w$(e, t, r) {
  var n = {
    width: e.width + t.width,
    height: e.height + t.height
  };
  return l$(n, r);
}
function A$(e, t, r) {
  var n = r === "width", i = e.x, a = e.y, o = e.width, u = e.height;
  return t === 1 ? {
    start: n ? i : a,
    end: n ? i + o : a + u
  } : {
    start: n ? i + o : a + u,
    end: n ? i : a
  };
}
function ui(e, t, r, n, i) {
  if (e * t < e * n || e * t > e * i)
    return !1;
  var a = r();
  return e * (t - e * a / 2 - n) >= 0 && e * (t + e * a / 2 - i) <= 0;
}
function O$(e, t) {
  return w0(e, t + 1);
}
function P$(e, t, r, n, i) {
  for (var a = (n || []).slice(), o = t.start, u = t.end, l = 0, c = 1, s = o, f = function() {
    var h = n?.[l];
    if (h === void 0)
      return {
        v: w0(n, c)
      };
    var p = l, y, m = () => (y === void 0 && (y = r(h, p)), y), b = h.coordinate, g = l === 0 || ui(e, b, m, s, u);
    g || (l = 0, s = o, c += 1), g && (s = b + e * (m() / 2 + i), l += c);
  }, d; c <= a.length; )
    if (d = f(), d) return d.v;
  return [];
}
function S$(e, t, r, n, i) {
  var a = (n || []).slice(), o = a.length;
  if (o === 0)
    return [];
  for (var u = t.start, l = t.end, c = 1; c <= o; c++) {
    for (var s = (o - 1) % c, f = u, d = !0, v = function() {
      var A = n[p];
      if (A == null)
        return 0;
      var O = p, w, S = () => (w === void 0 && (w = r(A, O)), w), _ = A.coordinate, E = p === s || ui(e, _, S, f, l);
      if (!E)
        return d = !1, 1;
      E && (f = _ + e * (S() / 2 + i));
    }, h, p = s; p < o && (h = v(), !(h !== 0 && h === 1)); p += c)
      ;
    if (d) {
      for (var y = [], m = s; m < o; m += c) {
        var b = n[m];
        b != null && y.push(b);
      }
      return y;
    }
  }
  return [];
}
function Bv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ze(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Bv(Object(r), !0).forEach(function(n) {
      I$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Bv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function I$(e, t, r) {
  return (t = _$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _$(e) {
  var t = k$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function k$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function j$(e, t, r, n, i) {
  for (var a = (n || []).slice(), o = a.length, u = t.start, l = t.end, c = function(d) {
    var v = a[d];
    if (v == null)
      return 1;
    var h = v, p, y = () => (p === void 0 && (p = r(v, d)), p);
    if (d === o - 1) {
      var m = e * (h.coordinate + e * y() / 2 - l);
      a[d] = h = ze(ze({}, h), {}, {
        tickCoord: m > 0 ? h.coordinate - m * e : h.coordinate
      });
    } else
      a[d] = h = ze(ze({}, h), {}, {
        tickCoord: h.coordinate
      });
    if (h.tickCoord != null) {
      var b = ui(e, h.tickCoord, y, u, l);
      b && (l = h.tickCoord - e * (y() / 2 + i), a[d] = ze(ze({}, h), {}, {
        isShow: !0
      }));
    }
  }, s = o - 1; s >= 0; s--)
    c(s);
  return a;
}
function C$(e, t, r, n, i, a) {
  var o = (n || []).slice(), u = o.length, l = t.start, c = t.end;
  if (a) {
    var s = n[u - 1];
    if (s != null) {
      var f = r(s, u - 1), d = e * (s.coordinate + e * f / 2 - c);
      if (o[u - 1] = s = ze(ze({}, s), {}, {
        tickCoord: d > 0 ? s.coordinate - d * e : s.coordinate
      }), s.tickCoord != null) {
        var v = ui(e, s.tickCoord, () => f, l, c);
        v && (c = s.tickCoord - e * (f / 2 + i), o[u - 1] = ze(ze({}, s), {}, {
          isShow: !0
        }));
      }
    }
  }
  for (var h = a ? u - 1 : u, p = function(b) {
    var g = o[b];
    if (g == null)
      return 1;
    var A = g, O, w = () => (O === void 0 && (O = r(g, b)), O);
    if (b === 0) {
      var S = e * (A.coordinate - e * w() / 2 - l);
      o[b] = A = ze(ze({}, A), {}, {
        tickCoord: S < 0 ? A.coordinate - S * e : A.coordinate
      });
    } else
      o[b] = A = ze(ze({}, A), {}, {
        tickCoord: A.coordinate
      });
    if (A.tickCoord != null) {
      var _ = ui(e, A.tickCoord, w, l, c);
      _ && (l = A.tickCoord + e * (w() / 2 + i), o[b] = ze(ze({}, A), {}, {
        isShow: !0
      }));
    }
  }, y = 0; y < h; y++)
    p(y);
  return o;
}
function Kc(e, t, r) {
  var n = e.tick, i = e.ticks, a = e.viewBox, o = e.minTickGap, u = e.orientation, l = e.interval, c = e.tickFormatter, s = e.unit, f = e.angle;
  if (!i || !i.length || !n)
    return [];
  if (T(l) || pi.isSsr) {
    var d;
    return (d = O$(i, T(l) ? l : 0)) !== null && d !== void 0 ? d : [];
  }
  var v = [], h = u === "top" || u === "bottom" ? "width" : "height", p = s && h === "width" ? Gn(s, {
    fontSize: t,
    letterSpacing: r
  }) : {
    width: 0,
    height: 0
  }, y = (O, w) => {
    var S = typeof c == "function" ? c(O.value, w) : O.value;
    return h === "width" ? w$(Gn(S, {
      fontSize: t,
      letterSpacing: r
    }), p, f) : Gn(S, {
      fontSize: t,
      letterSpacing: r
    })[h];
  }, m = i[0], b = i[1], g = i.length >= 2 && m != null && b != null ? Xe(b.coordinate - m.coordinate) : 1, A = A$(a, g, h);
  return l === "equidistantPreserveStart" ? P$(g, A, y, i, o) : l === "equidistantPreserveEnd" ? S$(g, A, y, i, o) : (l === "preserveStart" || l === "preserveStartEnd" ? v = C$(g, A, y, i, o, l === "preserveStartEnd") : v = j$(g, A, y, i, o), v.filter((O) => O.isShow));
}
var E$ = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, i = n, a = e.tickSize, o = a === void 0 ? 0 : a, u = e.tickMargin, l = u === void 0 ? 0 : u, c = 0;
  if (t) {
    Array.from(t).forEach((v) => {
      if (v) {
        var h = v.getBoundingClientRect();
        h.width > c && (c = h.width);
      }
    });
    var s = r ? r.getBoundingClientRect().width : 0, f = o + l, d = c + f + s + (r ? i : 0);
    return Math.round(d);
  }
  return 0;
}, T$ = (e) => {
  var t = e.ticks, r = e.label, n = e.labelGapWithTick, i = n, a = e.tickSize, o = a === void 0 ? 0 : a, u = e.tickMargin, l = u === void 0 ? 0 : u, c = 0;
  if (t) {
    Array.from(t).forEach((v) => {
      if (v) {
        var h = v.getBoundingClientRect();
        h.height > c && (c = h.height);
      }
    });
    var s = r ? r.getBoundingClientRect().height : 0, f = o + l, d = c + f + s + (r ? i : 0);
    return Math.round(d);
  }
  return 0;
}, M$ = {
  xAxis: {},
  yAxis: {}
}, A0 = Ke({
  name: "renderedTicks",
  initialState: M$,
  reducers: {
    setRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, i = r.axisId, a = r.ticks;
      e[n][i] = X(a);
    },
    removeRenderedTicks: (e, t) => {
      var r = t.payload, n = r.axisType, i = r.axisId;
      delete e[n][i];
    }
  }
}), O0 = A0.actions, D$ = O0.setRenderedTicks, $$ = O0.removeRenderedTicks, N$ = A0.reducer, L$ = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];
function Wv(e, t) {
  return W$(e) || B$(e, t) || z$(e, t) || R$();
}
function R$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function z$(e, t) {
  if (e) {
    if (typeof e == "string") return Fv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Fv(e, t) : void 0;
  }
}
function Fv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function B$(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function W$(e) {
  if (Array.isArray(e)) return e;
}
function F$(e, t) {
  if (e == null) return {};
  var r, n, i = K$(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function K$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Ur() {
  return Ur = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ur.apply(null, arguments);
}
function Kv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function de(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kv(Object(r), !0).forEach(function(n) {
      U$(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Kv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function U$(e, t, r) {
  return (t = H$(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function H$(e) {
  var t = Y$(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Y$(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var er = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: "bottom",
  // The ticks
  ticks: [],
  stroke: "#666",
  tickLine: !0,
  axisLine: !0,
  tick: !0,
  mirror: !1,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: "preserveEnd",
  zIndex: je.axis
};
function q$(e) {
  var t = e.x, r = e.y, n = e.width, i = e.height, a = e.orientation, o = e.mirror, u = e.axisLine, l = e.otherSvgProps;
  if (!u)
    return null;
  var c = de(de(de({}, l), _t(u)), {}, {
    fill: "none"
  });
  if (a === "top" || a === "bottom") {
    var s = +(a === "top" && !o || a === "bottom" && o);
    c = de(de({}, c), {}, {
      x1: t,
      y1: r + s * i,
      x2: t + n,
      y2: r + s * i
    });
  } else {
    var f = +(a === "left" && !o || a === "right" && o);
    c = de(de({}, c), {}, {
      x1: t + f * n,
      y1: r,
      x2: t + f * n,
      y2: r + i
    });
  }
  return /* @__PURE__ */ x("line", Ur({}, c, {
    className: re("recharts-cartesian-axis-line", tr(u, "className"))
  }));
}
function G$(e, t, r, n, i, a, o, u, l) {
  var c, s, f, d, v, h, p = u ? -1 : 1, y = e.tickSize || o, m = T(e.tickCoord) ? e.tickCoord : e.coordinate;
  switch (a) {
    case "top":
      c = s = e.coordinate, d = r + +!u * i, f = d - p * y, h = f - p * l, v = m;
      break;
    case "left":
      f = d = e.coordinate, s = t + +!u * n, c = s - p * y, v = c - p * l, h = m;
      break;
    case "right":
      f = d = e.coordinate, s = t + +u * n, c = s + p * y, v = c + p * l, h = m;
      break;
    default:
      c = s = e.coordinate, d = r + +u * i, f = d + p * y, h = f + p * l, v = m;
      break;
  }
  return {
    line: {
      x1: c,
      y1: f,
      x2: s,
      y2: d
    },
    tick: {
      x: v,
      y: h
    }
  };
}
function V$(e, t) {
  switch (e) {
    case "left":
      return t ? "start" : "end";
    case "right":
      return t ? "end" : "start";
    default:
      return "middle";
  }
}
function X$(e, t) {
  switch (e) {
    case "left":
    case "right":
      return "middle";
    case "top":
      return t ? "start" : "end";
    default:
      return t ? "end" : "start";
  }
}
function Z$(e) {
  var t = e.option, r = e.tickProps, n = e.value, i, a = re(r.className, "recharts-cartesian-axis-tick-value");
  if (/* @__PURE__ */ ve(t))
    i = /* @__PURE__ */ mt(t, de(de({}, r), {}, {
      className: a
    }));
  else if (typeof t == "function")
    i = t(de(de({}, r), {}, {
      className: a
    }));
  else {
    var o = "recharts-cartesian-axis-tick-value";
    typeof t != "boolean" && (o = re(o, IM(t))), i = /* @__PURE__ */ x(zc, Ur({}, r, {
      className: o
    }), n);
  }
  return i;
}
function Q$(e) {
  var t = e.ticks, r = e.axisType, n = e.axisId, i = ae(), a = Y(null);
  return ce(() => {
    if (!(n == null || r == null)) {
      var o = t.map((l) => ({
        value: l.value,
        coordinate: l.coordinate,
        offset: l.offset,
        index: l.index
      })), u = a.current;
      u != null && u.axisId === n && u.axisType === r && x$(u.ticks, o) || (a.current = {
        ticks: o,
        axisId: n,
        axisType: r
      }, i(D$({
        ticks: o,
        axisId: n,
        axisType: r
      })));
    }
  }, [i, t, n, r]), ce(() => n == null || r == null ? Hr : () => {
    i($$({
      axisId: n,
      axisType: r
    }));
  }, [i, n, r]), null;
}
var J$ = /* @__PURE__ */ we((e, t) => {
  var r = e.ticks, n = r === void 0 ? [] : r, i = e.tick, a = e.tickLine, o = e.stroke, u = e.tickFormatter, l = e.unit, c = e.padding, s = e.tickTextProps, f = e.orientation, d = e.mirror, v = e.x, h = e.y, p = e.width, y = e.height, m = e.tickSize, b = e.tickMargin, g = e.fontSize, A = e.letterSpacing, O = e.getTicksConfig, w = e.events, S = e.axisType, _ = e.axisId, E = Kc(de(de({}, O), {}, {
    ticks: n
  }), g, A), j = _t(O), k = li(i), I = Ug(j.textAnchor) ? j.textAnchor : V$(f, d), R = X$(f, d), N = {};
  typeof a == "object" && (N = a);
  var L = de(de({}, j), {}, {
    fill: "none"
  }, N), W = E.map((q) => de({
    entry: q
  }, G$(q, v, h, p, y, f, m, d, b))), F = W.map((q) => {
    var U = q.entry, pe = q.line;
    return /* @__PURE__ */ x(ot, {
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(U.value, "-").concat(U.coordinate, "-").concat(U.tickCoord)
    }, a && /* @__PURE__ */ x("line", Ur({}, L, pe, {
      className: re("recharts-cartesian-axis-tick-line", tr(a, "className"))
    })));
  }), z = W.map((q, U) => {
    var pe, ye, fe = q.entry, Ye = q.tick, tt = de(de(de(de({
      verticalAnchor: R
    }, j), {}, {
      textAnchor: I,
      stroke: "none",
      fill: o
    }, Ye), {}, {
      index: U,
      payload: fe,
      visibleTicksCount: E.length,
      tickFormatter: u,
      padding: c
    }, s), {}, {
      angle: (pe = (ye = s?.angle) !== null && ye !== void 0 ? ye : j.angle) !== null && pe !== void 0 ? pe : 0
    }), At = de(de({}, tt), k);
    return /* @__PURE__ */ x(ot, Ur({
      className: "recharts-cartesian-axis-tick-label",
      key: "tick-label-".concat(fe.value, "-").concat(fe.coordinate, "-").concat(fe.tickCoord)
    }, Ga(w, fe, U)), i && /* @__PURE__ */ x(Z$, {
      option: i,
      tickProps: At,
      value: "".concat(typeof u == "function" ? u(fe.value, U) : fe.value).concat(l || "")
    }));
  });
  return /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-axis-ticks recharts-".concat(S, "-ticks")
  }, /* @__PURE__ */ x(Q$, {
    ticks: E,
    axisId: _,
    axisType: S
  }), z.length > 0 && /* @__PURE__ */ x(wt, {
    zIndex: je.label
  }, /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-axis-tick-labels recharts-".concat(S, "-tick-labels"),
    ref: t
  }, z)), F.length > 0 && /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-axis-tick-lines recharts-".concat(S, "-tick-lines")
  }, F));
}), eN = /* @__PURE__ */ we((e, t) => {
  var r = e.axisLine, n = e.width, i = e.height, a = e.className, o = e.hide, u = e.ticks, l = e.axisType, c = e.axisId, s = F$(e, L$), f = Se(""), d = Wv(f, 2), v = d[0], h = d[1], p = Se(""), y = Wv(p, 2), m = y[0], b = y[1], g = Y(null);
  ll(t, () => ({
    getCalculatedWidth: () => {
      var O;
      return E$({
        ticks: g.current,
        label: (O = e.labelRef) === null || O === void 0 ? void 0 : O.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    },
    getCalculatedHeight: () => {
      var O;
      return T$({
        ticks: g.current,
        label: (O = e.labelRef) === null || O === void 0 ? void 0 : O.current,
        labelGapWithTick: 5,
        tickSize: e.tickSize,
        tickMargin: e.tickMargin
      });
    }
  }));
  var A = Q((O) => {
    if (O) {
      var w = O.getElementsByClassName("recharts-cartesian-axis-tick-value");
      g.current = w;
      var S = w[0];
      if (S) {
        var _ = window.getComputedStyle(S), E = _.fontSize, j = _.letterSpacing;
        (E !== v || j !== m) && (h(E), b(j));
      }
    }
  }, [v, m]);
  return o || n != null && n <= 0 || i != null && i <= 0 ? null : /* @__PURE__ */ x(wt, {
    zIndex: e.zIndex
  }, /* @__PURE__ */ x(ot, {
    className: re("recharts-cartesian-axis", a)
  }, /* @__PURE__ */ x(q$, {
    x: e.x,
    y: e.y,
    width: n,
    height: i,
    orientation: e.orientation,
    mirror: e.mirror,
    axisLine: r,
    otherSvgProps: _t(e)
  }), /* @__PURE__ */ x(J$, {
    ref: A,
    axisType: l,
    events: s,
    fontSize: v,
    getTicksConfig: e,
    height: e.height,
    letterSpacing: m,
    mirror: e.mirror,
    orientation: e.orientation,
    padding: e.padding,
    stroke: e.stroke,
    tick: e.tick,
    tickFormatter: e.tickFormatter,
    tickLine: e.tickLine,
    tickMargin: e.tickMargin,
    tickSize: e.tickSize,
    tickTextProps: e.tickTextProps,
    ticks: u,
    unit: e.unit,
    width: e.width,
    x: e.x,
    y: e.y,
    axisId: c
  }), /* @__PURE__ */ x(uM, {
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    lowerWidth: e.width,
    upperWidth: e.width
  }, /* @__PURE__ */ x(mM, {
    label: e.label,
    labelRef: e.labelRef
  }), e.children)));
}), Uc = /* @__PURE__ */ we((e, t) => {
  var r = Fe(e, er);
  return /* @__PURE__ */ x(eN, Ur({}, r, {
    ref: t
  }));
});
Uc.displayName = "CartesianAxis";
var tN = {
  grid: {
    stroke: "#ccc",
    fill: "none"
  }
}, P0 = /* @__PURE__ */ ge(tN);
P0.Provider;
var rN = () => Ge(P0), nN = ["x1", "y1", "x2", "y2", "key"], iN = ["offset"], aN = ["xAxisId", "yAxisId"], oN = ["xAxisId", "yAxisId"];
function Uv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Be(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Uv(Object(r), !0).forEach(function(n) {
      uN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Uv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function uN(e, t, r) {
  return (t = lN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function lN(e) {
  var t = cN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function cN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Dr() {
  return Dr = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Dr.apply(null, arguments);
}
function Ra(e, t) {
  if (e == null) return {};
  var r, n, i = sN(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function sN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var fN = (e) => {
  var t = e.fill;
  if (!t || t === "none")
    return null;
  var r = e.fillOpacity, n = e.x, i = e.y, a = e.width, o = e.height, u = e.ry;
  return /* @__PURE__ */ x("rect", {
    x: n,
    y: i,
    ry: u,
    width: a,
    height: o,
    stroke: "none",
    fill: t,
    fillOpacity: r,
    className: "recharts-cartesian-grid-bg"
  });
};
function S0(e) {
  var t = e.option, r = e.lineItemProps, n;
  if (/* @__PURE__ */ ve(t))
    n = /* @__PURE__ */ mt(t, r);
  else if (typeof t == "function")
    n = t(r);
  else {
    var i, a = r.x1, o = r.y1, u = r.x2, l = r.y2, c = r.key, s = Ra(r, nN), f = (i = _t(s)) !== null && i !== void 0 ? i : {};
    f.offset;
    var d = Ra(f, iN), v = Array.isArray(d.strokeDasharray) ? d.strokeDasharray.join(",") : d.strokeDasharray;
    n = /* @__PURE__ */ x("line", Dr({}, d, {
      strokeDasharray: v,
      x1: a,
      y1: o,
      x2: u,
      y2: l,
      fill: "none",
      key: c
    }));
  }
  return n;
}
function dN(e) {
  var t = e.x, r = e.width, n = e.horizontal, i = n === void 0 ? !0 : n, a = e.horizontalPoints;
  if (!i || !a || !a.length)
    return null;
  e.xAxisId, e.yAxisId;
  var o = Ra(e, aN), u = a.map((l, c) => {
    var s = Be(Be({}, o), {}, {
      x1: t,
      y1: l,
      x2: t + r,
      y2: l,
      key: "line-".concat(c),
      index: c
    });
    return /* @__PURE__ */ x(S0, {
      key: "line-".concat(c),
      option: i,
      lineItemProps: s
    });
  });
  return /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, u);
}
function vN(e) {
  var t = e.y, r = e.height, n = e.vertical, i = n === void 0 ? !0 : n, a = e.verticalPoints;
  if (!i || !a || !a.length)
    return null;
  e.xAxisId, e.yAxisId;
  var o = Ra(e, oN), u = a.map((l, c) => {
    var s = Be(Be({}, o), {}, {
      x1: l,
      y1: t,
      x2: l,
      y2: t + r,
      key: "line-".concat(c),
      index: c
    });
    return /* @__PURE__ */ x(S0, {
      option: i,
      lineItemProps: s,
      key: "line-".concat(c)
    });
  });
  return /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-grid-vertical"
  }, u);
}
function hN(e) {
  var t = e.horizontalFill, r = e.fillOpacity, n = e.x, i = e.y, a = e.width, o = e.height, u = e.horizontalPoints, l = e.horizontal, c = l === void 0 ? !0 : l;
  if (!c || !t || !t.length || u == null)
    return null;
  var s = u.map((d) => Math.round(d + i - i)).sort((d, v) => d - v);
  i !== s[0] && s.unshift(0);
  var f = s.map((d, v) => {
    var h = s[v + 1], p = h == null, y = p ? i + o - d : h - d;
    if (y <= 0)
      return null;
    var m = v % t.length;
    return /* @__PURE__ */ x("rect", {
      key: "react-".concat(v),
      y: d,
      x: n,
      height: y,
      width: a,
      stroke: "none",
      fill: t[m],
      fillOpacity: r,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, f);
}
function pN(e) {
  var t = e.vertical, r = t === void 0 ? !0 : t, n = e.verticalFill, i = e.fillOpacity, a = e.x, o = e.y, u = e.width, l = e.height, c = e.verticalPoints;
  if (!r || !n || !n.length)
    return null;
  var s = c.map((d) => Math.round(d + a - a)).sort((d, v) => d - v);
  a !== s[0] && s.unshift(0);
  var f = s.map((d, v) => {
    var h = s[v + 1], p = h == null, y = p ? a + u - d : h - d;
    if (y <= 0)
      return null;
    var m = v % n.length;
    return /* @__PURE__ */ x("rect", {
      key: "react-".concat(v),
      x: d,
      y: o,
      width: y,
      height: l,
      stroke: "none",
      fill: n[m],
      fillOpacity: i,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, f);
}
var yN = (e, t) => {
  var r = e.xAxis, n = e.width, i = e.height, a = e.offset;
  return Vp(Kc(Be(Be(Be({}, er), r), {}, {
    ticks: Xp(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: i
    }
  })), a.left, a.left + a.width, t);
}, mN = (e, t) => {
  var r = e.yAxis, n = e.width, i = e.height, a = e.offset;
  return Vp(Kc(Be(Be(Be({}, er), r), {}, {
    ticks: Xp(r),
    viewBox: {
      x: 0,
      y: 0,
      width: n,
      height: i
    }
  })), a.top, a.top + a.height, t);
}, gN = {
  horizontal: !0,
  vertical: !0,
  // The ordinates of horizontal grid lines
  horizontalPoints: [],
  // The abscissas of vertical grid lines
  verticalPoints: [],
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: [],
  xAxisId: 0,
  yAxisId: 0,
  syncWithTicks: !1,
  zIndex: je.grid
};
function I0(e) {
  var t, r, n, i, a, o, u = Nl(), l = Ll(), c = ty(), s = Be(Be({}, Fe(e, gN)), {}, {
    x: T(e.x) ? e.x : c.left,
    y: T(e.y) ? e.y : c.top,
    width: T(e.width) ? e.width : c.width,
    height: T(e.height) ? e.height : c.height
  }), f = s.xAxisId, d = s.yAxisId, v = s.x, h = s.y, p = s.width, y = s.height, m = s.syncWithTicks, b = s.horizontalValues, g = s.verticalValues, A = Ue(), O = $((F) => Wd(F, "xAxis", f, A)), w = $((F) => Wd(F, "yAxis", d, A)), S = rN(), _ = {
    stroke: (t = s.stroke) !== null && t !== void 0 ? t : S.grid.stroke,
    strokeWidth: (r = s.strokeWidth) !== null && r !== void 0 ? r : S.grid.strokeWidth,
    strokeOpacity: (n = s.strokeOpacity) !== null && n !== void 0 ? n : S.grid.strokeOpacity,
    strokeDasharray: (i = s.strokeDasharray) !== null && i !== void 0 ? i : S.grid.strokeDasharray
  };
  if (!Kt(p) || !Kt(y) || !T(v) || !T(h))
    return null;
  var E = s.verticalCoordinatesGenerator || yN, j = s.horizontalCoordinatesGenerator || mN, k = s.horizontalPoints, I = s.verticalPoints;
  if ((!k || !k.length) && typeof j == "function") {
    var R = b && b.length, N = j({
      yAxis: w ? Be(Be({}, w), {}, {
        ticks: R ? b : w.ticks
      }) : void 0,
      width: u ?? p,
      height: l ?? y,
      offset: c
    }, R ? !0 : m);
    va(Array.isArray(N), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof N, "]")), Array.isArray(N) && (k = N);
  }
  if ((!I || !I.length) && typeof E == "function") {
    var L = g && g.length, W = E({
      xAxis: O ? Be(Be({}, O), {}, {
        ticks: L ? g : O.ticks
      }) : void 0,
      width: u ?? p,
      height: l ?? y,
      offset: c
    }, L ? !0 : m);
    va(Array.isArray(W), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof W, "]")), Array.isArray(W) && (I = W);
  }
  return /* @__PURE__ */ x(wt, {
    zIndex: s.zIndex
  }, /* @__PURE__ */ x("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ x(fN, {
    fill: (a = s.fill) !== null && a !== void 0 ? a : S.grid.fill,
    fillOpacity: (o = s.fillOpacity) !== null && o !== void 0 ? o : S.grid.fillOpacity,
    x: s.x,
    y: s.y,
    width: s.width,
    height: s.height,
    ry: s.ry
  }), /* @__PURE__ */ x(hN, Dr({}, s, {
    horizontalPoints: k
  })), /* @__PURE__ */ x(pN, Dr({}, s, {
    verticalPoints: I
  })), /* @__PURE__ */ x(dN, Dr({}, s, _, {
    offset: c,
    horizontalPoints: k,
    xAxis: O,
    yAxis: w
  })), /* @__PURE__ */ x(vN, Dr({}, s, _, {
    offset: c,
    verticalPoints: I,
    xAxis: O,
    yAxis: w
  }))));
}
I0.displayName = "CartesianGrid";
var bN = ["animationElapsedTime", "isAnimating", "isEntrance", "visibleLength", "strokeDasharray", "connectNulls"];
function el() {
  return el = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, el.apply(null, arguments);
}
function xN(e, t) {
  if (e == null) return {};
  var r, n, i = wN(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function wN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function AN(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function _0(e, t) {
  return "".concat(t, "px ").concat(e, "px");
}
function ON(e) {
  return e.length % 2 !== 0 ? [...e, ...e] : e;
}
function PN(e, t) {
  for (var r = [], n = 0; n < t; ++n)
    r.push(...e);
  return r;
}
function SN(e, t, r) {
  var n = ON(r), i = n.reduce((v, h) => v + h, 0);
  if (!i)
    return _0(t, e);
  for (var a = Math.floor(e / i), o = e % i, u = [], l = 0, c = 0; l < n.length; c += (s = n[l]) !== null && s !== void 0 ? s : 0, ++l) {
    var s, f = n[l];
    if (f != null && c + f > o) {
      u = [...n.slice(0, l), o - c];
      break;
    }
  }
  var d = u.length % 2 === 0 ? [0, t] : [t];
  return [...PN(n, a), ...u, ...d].map((v) => "".concat(v, "px")).join(", ");
}
function IN(e, t, r) {
  if (e) {
    var n = "".concat(e).split(/[,\s]+/gim).map((i) => parseFloat(i));
    return SN(r, t, n);
  }
  return _0(t, r);
}
function _N(e) {
  e.animationElapsedTime, e.isAnimating, e.isEntrance;
  var t = e.visibleLength, r = e.strokeDasharray, n = e.connectNulls, i = xN(e, bN), a = n ?? !1, o;
  if (t != null) {
    var u, l = i.pathRef, c = AN((u = l?.current) !== null && u !== void 0 ? u : null);
    o = IN(r, c, t);
  } else r != null && (o = String(r));
  return /* @__PURE__ */ x(ly, el({}, i, {
    connectNulls: a,
    strokeDasharray: o
  }));
}
function kN(e) {
  var t = Y(0), r = Y(0), n = Y(!1), i = Y(e);
  return i.current !== e && (t.current = r.current, i.current = e), Q((a, o) => {
    if (n.current)
      return null;
    var u = Math.min(Xt(t.current + a * o), o);
    return a > 0 && o > 0 && (r.current = Math.max(r.current, u), u >= o) ? (n.current = !0, null) : u;
  }, []);
}
var jN = {}, k0 = Ke({
  name: "errorBars",
  initialState: jN,
  reducers: {
    addErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, i = r.errorBar;
      e[n] || (e[n] = []), e[n].push(i);
    },
    replaceErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, i = r.prev, a = r.next;
      e[n] && (e[n] = e[n].map((o) => o.dataKey === i.dataKey && o.direction === i.direction ? a : o));
    },
    removeErrorBar: (e, t) => {
      var r = t.payload, n = r.itemId, i = r.errorBar;
      e[n] && (e[n] = e[n].filter((a) => a.dataKey !== i.dataKey || a.direction !== i.direction));
    }
  }
}), Hc = k0.actions;
Hc.addErrorBar;
Hc.replaceErrorBar;
Hc.removeErrorBar;
var CN = k0.reducer, EN = ["children"];
function TN(e, t) {
  if (e == null) return {};
  var r, n, i = MN(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function MN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var DN = {
  data: [],
  xAxisId: "xAxis-0",
  yAxisId: "yAxis-0",
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
}, $N = /* @__PURE__ */ ge(DN);
function j0(e) {
  var t = e.children, r = TN(e, EN);
  return /* @__PURE__ */ x($N.Provider, {
    value: r
  }, t);
}
function Yc(e, t) {
  var r, n, i = $((c) => lr(c, e)), a = $((c) => cr(c, t)), o = (r = i?.allowDataOverflow) !== null && r !== void 0 ? r : Ae.allowDataOverflow, u = (n = a?.allowDataOverflow) !== null && n !== void 0 ? n : Oe.allowDataOverflow, l = o || u;
  return {
    needClip: l,
    needClipX: o,
    needClipY: u
  };
}
function C0(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.clipPathId, i = Fc(), a = Yc(t, r), o = a.needClipX, u = a.needClipY, l = a.needClip, c = $((g) => Xm(g, t, !1)), s = $((g) => Zm(g, r, !1));
  if (!l || !i)
    return null;
  var f = i.x, d = i.y, v = i.width, h = i.height, p = o && c ? Math.min(c[0], c[1]) : f - v / 2, y = u && s ? Math.min(s[0], s[1]) : d - h / 2, m = o && c ? Math.abs(c[1] - c[0]) : v * 2, b = u && s ? Math.abs(s[1] - s[0]) : h * 2;
  return /* @__PURE__ */ x("clipPath", {
    id: "clipPath-".concat(n)
  }, /* @__PURE__ */ x("rect", {
    x: p,
    y,
    width: m,
    height: b
  }));
}
var E0 = (e, t, r, n) => gr(e, "xAxis", t, n), T0 = (e, t, r, n) => mr(e, "xAxis", t, n), M0 = (e, t, r, n) => gr(e, "yAxis", r, n), D0 = (e, t, r, n) => mr(e, "yAxis", r, n), NN = P([J, E0, M0, T0, D0], (e, t, r, n, i) => or(e, "xAxis") ? hn(t, n, !1) : hn(r, i, !1)), LN = (e, t, r, n, i) => i;
function RN(e) {
  return e.type === "line";
}
var zN = P([Io, LN], (e, t) => e.filter(RN).find((r) => r.id === t)), BN = P([J, E0, M0, T0, D0, zN, NN, yi], (e, t, r, n, i, a, o, u) => {
  var l = u.chartData, c = u.dataStartIndex, s = u.dataEndIndex;
  if (!(a == null || t == null || r == null || n == null || i == null || n.length === 0 || i.length === 0 || o == null || e !== "horizontal" && e !== "vertical")) {
    var f = a.dataKey, d = a.data, v;
    if (d != null && d.length > 0 ? v = d : v = l?.slice(c, s + 1), v != null)
      return l2({
        layout: e,
        xAxis: t,
        yAxis: r,
        xAxisTicks: n,
        yAxisTicks: i,
        dataKey: f,
        bandSize: o,
        displayedData: v
      });
  }
});
function WN(e) {
  var t = li(e), r = 3, n = 2;
  if (t != null) {
    var i = t.r, a = t.strokeWidth, o = Number(i), u = Number(a);
    return (Number.isNaN(o) || o < 0) && (o = r), (Number.isNaN(u) || u < 0) && (u = n), {
      r: o,
      strokeWidth: u
    };
  }
  return {
    r,
    strokeWidth: n
  };
}
var FN = ["id"], KN = ["type", "layout", "connectNulls", "needClip", "shape", "strokeDasharray"], UN = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function za() {
  return za = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, za.apply(null, arguments);
}
function qc(e, t) {
  if (e == null) return {};
  var r, n, i = HN(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function HN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Hv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Nt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Hv(Object(r), !0).forEach(function(n) {
      YN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Hv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function YN(e, t, r) {
  return (t = qN(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function qN(e) {
  var t = GN(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function GN(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function VN(e) {
  try {
    return e && e.getTotalLength && e.getTotalLength() || 0;
  } catch {
    return 0;
  }
}
function XN(e) {
  var t = 0, r = 0;
  for (var n of e)
    n.status === "matched" && n.prev.x != null && n.next.x != null && (t += n.next.x - n.prev.x, r++);
  return r > 0 ? t / r : 0;
}
var ZN = (e, t) => {
  if (e == null)
    return [];
  if (t === 1) return e.flatMap((u) => u.status === "removed" ? [] : [u.next]);
  var r = XN(e), n = [];
  for (var i of e)
    if (i.status === "matched")
      n.push(Nt(Nt({}, i.next), {}, {
        x: me(i.prev.x, i.next.x, t),
        y: me(i.prev.y, i.next.y, t)
      }));
    else if (i.status === "added")
      if (i.next.x != null) {
        var a = i.next.x - r;
        n.push(Nt(Nt({}, i.next), {}, {
          x: me(a, i.next.x, t),
          y: i.next.y
        }));
      } else
        n.push(i.next);
    else if (i.status === "removed" && i.prev.x != null) {
      var o = i.prev.x + r;
      n.push(Nt(Nt({}, i.prev), {}, {
        x: me(i.prev.x, o, t),
        y: i.prev.y
      }));
    }
  return n;
}, Gc = {
  activeDot: !0,
  animateNewValues: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  animationInterpolateFn: ZN,
  animationMatchBy: Bc,
  connectNulls: !1,
  dot: !0,
  fill: "#fff",
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "line",
  shape: _N,
  stroke: "#3182bd",
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: je.line,
  type: "linear"
}, QN = (e) => {
  var t = e.dataKey, r = e.name, n = e.stroke, i = e.legendType, a = e.hide;
  return [{
    inactive: a,
    dataKey: t,
    type: i,
    color: n,
    value: oo(r, t),
    payload: e
  }];
}, JN = /* @__PURE__ */ gt((e) => {
  var t = e.dataKey, r = e.data, n = e.stroke, i = e.strokeWidth, a = e.fill, o = e.name, u = e.hide, l = e.unit, c = e.formatter, s = e.tooltipType, f = e.id, d = {
    dataDefinedOnItem: r,
    getPosition: Hr,
    settings: {
      stroke: n,
      strokeWidth: i,
      fill: a,
      dataKey: t,
      nameKey: void 0,
      name: oo(o, t),
      hide: u,
      type: s,
      color: n,
      unit: l,
      formatter: c,
      graphicalItemId: f
    }
  };
  return /* @__PURE__ */ x(c0, {
    tooltipEntrySettings: d
  });
});
function e2(e) {
  var t = e.clipPathId, r = e.points, n = e.props, i = n.dot, a = n.dataKey, o = n.needClip;
  n.id;
  var u = qc(n, FN), l = _t(u);
  return /* @__PURE__ */ x(OD, {
    points: r,
    dot: i,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey: a,
    baseProps: l,
    needClip: o,
    clipPathId: t
  });
}
function t2(e) {
  var t = e.showLabels, r = e.children, n = e.points, i = ht(() => n?.map((a) => {
    var o, u, l = {
      x: (o = a.x) !== null && o !== void 0 ? o : 0,
      y: (u = a.y) !== null && u !== void 0 ? u : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return Nt(Nt({}, l), {}, {
      value: a.value,
      payload: a.payload,
      viewBox: l,
      /*
       * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
       * Or should this just be the root chart viewBox?
       */
      parentViewBox: void 0,
      fill: void 0
    });
  }), [n]);
  return /* @__PURE__ */ x(Zg, {
    value: t ? i : void 0
  }, r);
}
function r2(e) {
  var t = e.clipPathId, r = e.pathRef, n = e.points, i = e.props, a = e.animationElapsedTime, o = e.isAnimating, u = e.isEntrance, l = e.visibleLength, c = i.type, s = i.layout, f = i.connectNulls, d = i.needClip, v = i.shape, h = i.strokeDasharray, p = qc(i, KN), y = Nt(Nt({}, at(p)), {}, {
    fill: "none",
    className: "recharts-line-curve",
    clipPath: d ? "url(#clipPath-".concat(t, ")") : void 0,
    points: n,
    type: c,
    layout: s,
    connectNulls: f,
    strokeDasharray: h ?? i.strokeDasharray,
    pathRef: r,
    animationElapsedTime: a,
    isAnimating: o,
    isEntrance: i.animateNewValues ? u : !1,
    visibleLength: l
  });
  return /* @__PURE__ */ x(et, null, n?.length > 1 && /* @__PURE__ */ x(a0, {
    option: v,
    DefaultShape: Gc.shape,
    shapeProps: y
  }), /* @__PURE__ */ x(e2, {
    points: n,
    clipPathId: t,
    props: i
  }));
}
function n2(e) {
  var t = e.clipPathId, r = e.props, n = e.pathRef, i = e.previousPointsRef, a = r.points, o = r.isAnimationActive, u = r.animationBegin, l = r.animationDuration, c = r.animationEasing, s = r.animationMatchBy, f = r.animationInterpolateFn, d = r.layout, v = VN(n.current), h = d0(r.onAnimationStart, r.onAnimationEnd), p = h.isAnimating, y = h.handleAnimationStart, m = h.handleAnimationEnd, b = !p, g = kN(a), A = Q((O) => O > 0 && v > 0, [v]);
  return /* @__PURE__ */ x(t2, {
    points: a,
    showLabels: b
  }, r.children, /* @__PURE__ */ x(v0, {
    animationInput: a,
    animationIdPrefix: "recharts-line-",
    items: a,
    previousItemsRef: i,
    isAnimationActive: o,
    animationBegin: u,
    animationDuration: l,
    animationEasing: c,
    onAnimationStart: y,
    onAnimationEnd: m,
    animationInterpolateFn: f,
    animationMatchBy: s,
    shouldUpdatePreviousRef: A,
    layout: d
  }, (O, w, S) => {
    var _ = p || w < 1, E = _ ? g(w, v) : null;
    return /* @__PURE__ */ x(r2, {
      props: r,
      points: O,
      clipPathId: t,
      pathRef: n,
      animationElapsedTime: w,
      isAnimating: _,
      isEntrance: S,
      visibleLength: E
    });
  }), /* @__PURE__ */ x(Jg, {
    label: r.label
  }));
}
function i2(e) {
  var t = e.clipPathId, r = e.props, n = Y(null), i = Y(null);
  return /* @__PURE__ */ x(n2, {
    props: r,
    clipPathId: t,
    previousPointsRef: n,
    pathRef: i
  });
}
var a2 = (e, t) => {
  var r, n;
  return {
    x: (r = e.x) !== null && r !== void 0 ? r : void 0,
    y: (n = e.y) !== null && n !== void 0 ? n : void 0,
    value: e.value,
    // getValueByDataKey does not validate the output type
    errorVal: he(e.payload, t)
  };
};
class o2 extends dh {
  render() {
    var t = this.props, r = t.hide, n = t.dot, i = t.points, a = t.className, o = t.xAxisId, u = t.yAxisId, l = t.top, c = t.left, s = t.width, f = t.height, d = t.id, v = t.needClip, h = t.zIndex;
    if (r)
      return null;
    var p = re("recharts-line", a), y = d, m = WN(n), b = m.r, g = m.strokeWidth, A = n0(n), O = b * 2 + g, w = v ? "url(#clipPath-".concat(A ? "" : "dots-").concat(y, ")") : void 0;
    return /* @__PURE__ */ x(wt, {
      zIndex: h
    }, /* @__PURE__ */ x(ot, {
      className: p
    }, v && /* @__PURE__ */ x("defs", null, /* @__PURE__ */ x(C0, {
      clipPathId: y,
      xAxisId: o,
      yAxisId: u
    }), !A && /* @__PURE__ */ x("clipPath", {
      id: "clipPath-dots-".concat(y)
    }, /* @__PURE__ */ x("rect", {
      x: c - O / 2,
      y: l - O / 2,
      width: s + O,
      height: f + O
    }))), /* @__PURE__ */ x(j0, {
      xAxisId: o,
      yAxisId: u,
      data: i,
      dataPointFormatter: a2,
      errorBarOffset: 0
    }, /* @__PURE__ */ x(i2, {
      props: this.props,
      clipPathId: y
    }))), /* @__PURE__ */ x(UD, {
      activeDot: this.props.activeDot,
      points: i,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: w
    }));
  }
}
function u2(e) {
  var t = Fe(e, Gc), r = t.activeDot, n = t.animateNewValues, i = t.animationBegin, a = t.animationDuration, o = t.animationEasing, u = t.connectNulls, l = t.dot, c = t.hide, s = t.isAnimationActive, f = t.label, d = t.legendType, v = t.xAxisId, h = t.yAxisId, p = t.id, y = qc(t, UN), m = Yc(v, h), b = m.needClip, g = Fc(), A = Yr(), O = Ue(), w = $((k) => BN(k, v, h, O, p));
  if (A !== "horizontal" && A !== "vertical" || w == null || g == null)
    return null;
  var S = g.height, _ = g.width, E = g.x, j = g.y;
  return /* @__PURE__ */ x(o2, za({}, y, {
    id: p,
    connectNulls: u,
    dot: l,
    activeDot: r,
    animateNewValues: n,
    animationBegin: i,
    animationDuration: a,
    animationEasing: o,
    isAnimationActive: s,
    hide: c,
    label: f,
    legendType: d,
    xAxisId: v,
    yAxisId: h,
    points: w,
    layout: A,
    height: S,
    width: _,
    left: E,
    top: j,
    needClip: b
  }));
}
function l2(e) {
  var t = e.layout, r = e.xAxis, n = e.yAxis, i = e.xAxisTicks, a = e.yAxisTicks, o = e.dataKey, u = e.bandSize, l = e.displayedData;
  return l.map((c, s) => {
    var f = he(c, o);
    if (t === "horizontal") {
      var d = Ns({
        axis: r,
        ticks: i,
        bandSize: u,
        entry: c,
        index: s
      }), v = se(f) ? null : n.scale.map(f);
      return {
        x: d,
        y: v ?? null,
        value: f,
        payload: c
      };
    }
    var h = se(f) ? null : r.scale.map(f), p = Ns({
      axis: n,
      ticks: a,
      bandSize: u,
      entry: c,
      index: s
    });
    return h == null || p == null ? null : {
      x: h,
      y: p,
      value: f,
      payload: c
    };
  }).filter(Boolean);
}
function c2(e) {
  var t = Fe(e, Gc), r = Ue();
  return /* @__PURE__ */ x(h0, {
    id: t.id,
    type: "line"
  }, (n) => /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(s0, {
    legendPayload: QN(t)
  }), /* @__PURE__ */ x(JN, {
    dataKey: t.dataKey,
    data: t.data,
    stroke: t.stroke,
    strokeWidth: t.strokeWidth,
    fill: t.fill,
    name: t.name,
    hide: t.hide,
    unit: t.unit,
    formatter: t.formatter,
    tooltipType: t.tooltipType,
    id: n
  }), /* @__PURE__ */ x(y0, {
    type: "line",
    id: n,
    data: t.data,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    dataKey: t.dataKey,
    hide: t.hide,
    isPanorama: r
  }), /* @__PURE__ */ x(u2, za({}, t, {
    id: n
  }))));
}
var $0 = /* @__PURE__ */ gt(c2, wn);
$0.displayName = "Line";
function Xr(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((i) => i.id === t)) === null || n === void 0 ? void 0 : n.xAxisId) !== null && r !== void 0 ? r : m0;
}
function Zr(e, t) {
  var r, n;
  return (r = (n = e.graphicalItems.cartesianItems.find((i) => i.id === t)) === null || n === void 0 ? void 0 : n.yAxisId) !== null && r !== void 0 ? r : m0;
}
var s2 = "Invariant failed";
function f2(e, t) {
  throw new Error(s2);
}
var d2 = ["option"];
function v2(e, t) {
  if (e == null) return {};
  var r, n, i = h2(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function h2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Vc = hy;
function Xc(e) {
  var t = e.option, r = v2(e, d2);
  return /* @__PURE__ */ x(a0, {
    option: t,
    DefaultShape: Vc,
    shapeProps: r,
    activeClassName: "recharts-active-bar",
    inActiveClassName: "recharts-inactive-bar"
  });
}
var p2 = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return (n, i) => {
    if (T(t)) return t;
    var a = T(n) || se(n);
    return a ? t(n, i) : (a || f2(), r);
  };
}, y2 = (e, t, r) => r, m2 = (e, t) => t, _i = P([Io, m2], (e, t) => e.filter((r) => r.type === "bar").find((r) => r.id === t)), g2 = P([_i], (e) => e?.maxBarSize), b2 = (e, t, r, n) => n, x2 = P([J, Io, Xr, Zr, y2], (e, t, r, n, i) => t.filter((a) => e === "horizontal" ? a.xAxisId === r : a.yAxisId === n).filter((a) => a.isPanorama === i).filter((a) => a.hide === !1).filter((a) => a.type === "bar")), w2 = (e, t, r) => {
  var n = J(e), i = Xr(e, t), a = Zr(e, t);
  if (!(i == null || a == null))
    return n === "horizontal" ? Vu(e, "yAxis", a, r) : Vu(e, "xAxis", i, r);
}, A2 = (e, t) => {
  var r = J(e), n = Xr(e, t), i = Zr(e, t);
  if (!(n == null || i == null))
    return r === "horizontal" ? Bd(e, "xAxis", n) : Bd(e, "yAxis", i);
}, O2 = P([x2, eI, A2], XD), P2 = (e, t, r) => {
  var n, i, a = _i(e, t);
  if (a == null)
    return 0;
  var o = Xr(e, t), u = Zr(e, t);
  if (o == null || u == null)
    return 0;
  var l = J(e), c = jy(e), s = a.maxBarSize, f = se(s) ? c : s, d, v;
  return l === "horizontal" ? (d = gr(e, "xAxis", o, r), v = mr(e, "xAxis", o, r)) : (d = gr(e, "yAxis", u, r), v = mr(e, "yAxis", u, r)), (n = (i = hn(d, v, !0)) !== null && i !== void 0 ? i : f) !== null && n !== void 0 ? n : 0;
}, N0 = (e, t, r) => {
  var n = J(e), i = Xr(e, t), a = Zr(e, t);
  if (!(i == null || a == null)) {
    var o, u;
    return n === "horizontal" ? (o = gr(e, "xAxis", i, r), u = mr(e, "xAxis", i, r)) : (o = gr(e, "yAxis", a, r), u = mr(e, "yAxis", a, r)), hn(o, u);
  }
}, S2 = P([O2, jy, JS, Cy, P2, N0, g2], t$), I2 = (e, t, r) => {
  var n = Xr(e, t);
  if (n != null)
    return gr(e, "xAxis", n, r);
}, _2 = (e, t, r) => {
  var n = Zr(e, t);
  if (n != null)
    return gr(e, "yAxis", n, r);
}, k2 = (e, t, r) => {
  var n = Xr(e, t);
  if (n != null)
    return mr(e, "xAxis", n, r);
}, j2 = (e, t, r) => {
  var n = Zr(e, t);
  if (n != null)
    return mr(e, "yAxis", n, r);
}, C2 = P([S2, _i], n$), E2 = P([w2, _i], r$), T2 = P([Ce, Dl, I2, _2, k2, j2, C2, J, LS, N0, E2, _i, b2], (e, t, r, n, i, a, o, u, l, c, s, f, d) => {
  var v = l.chartData, h = l.dataStartIndex, p = l.dataEndIndex;
  if (!(f == null || o == null || t == null || u !== "horizontal" && u !== "vertical" || r == null || n == null || i == null || a == null || c == null)) {
    var y = f.data, m;
    if (y != null && y.length > 0 ? m = y : m = v?.slice(h, p + 1), m != null)
      return fL({
        layout: u,
        barSettings: f,
        pos: o,
        parentViewBox: t,
        bandSize: c,
        xAxis: r,
        yAxis: n,
        xAxisTicks: i,
        yAxisTicks: a,
        stackedData: s,
        displayedData: m,
        offset: e,
        cells: d,
        dataStartIndex: h
      });
  }
}), M2 = ["index"];
function tl() {
  return tl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, tl.apply(null, arguments);
}
function D2(e, t) {
  if (e == null) return {};
  var r, n, i = $2(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function $2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var L0 = /* @__PURE__ */ ge(void 0), N2 = (e) => {
  var t = Ge(L0);
  if (t != null)
    return t.stackId;
  if (e != null)
    return u1(e);
}, L2 = (e, t) => "recharts-bar-stack-clip-path-".concat(e, "-").concat(t), R2 = (e) => {
  var t = Ge(L0);
  if (t != null) {
    var r = t.stackId;
    return "url(#".concat(L2(r, e), ")");
  }
}, R0 = (e) => {
  var t = e.index, r = D2(e, M2), n = R2(t);
  return /* @__PURE__ */ x(ot, tl({
    className: "recharts-bar-stack-layer",
    clipPath: n
  }, r));
}, z2 = ["onMouseEnter", "onMouseLeave", "onClick"], B2 = ["value", "background", "tooltipPosition"], W2 = ["id"], F2 = ["onMouseEnter", "onClick", "onMouseLeave"];
function Yv(e, t) {
  return Y2(e) || H2(e, t) || U2(e, t) || K2();
}
function K2() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function U2(e, t) {
  if (e) {
    if (typeof e == "string") return qv(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? qv(e, t) : void 0;
  }
}
function qv(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function H2(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function Y2(e) {
  if (Array.isArray(e)) return e;
}
function br() {
  return br = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, br.apply(null, arguments);
}
function Gv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Pe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gv(Object(r), !0).forEach(function(n) {
      q2(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Gv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function q2(e, t, r) {
  return (t = G2(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function G2(e) {
  var t = V2(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function V2(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ba(e, t) {
  if (e == null) return {};
  var r, n, i = X2(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function X2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var Z2 = (e) => {
  var t = e.dataKey, r = e.name, n = e.fill, i = e.legendType, a = e.hide;
  return [{
    inactive: a,
    dataKey: t,
    type: i,
    color: n,
    value: oo(r, t),
    payload: e
  }];
}, Q2 = /* @__PURE__ */ gt((e) => {
  var t = e.dataKey, r = e.stroke, n = e.strokeWidth, i = e.fill, a = e.name, o = e.hide, u = e.unit, l = e.formatter, c = e.tooltipType, s = e.id, f = {
    dataDefinedOnItem: void 0,
    getPosition: Hr,
    settings: {
      stroke: r,
      strokeWidth: n,
      fill: i,
      dataKey: t,
      nameKey: void 0,
      name: oo(a, t),
      hide: o,
      type: c,
      color: i,
      unit: u,
      formatter: l,
      graphicalItemId: s
    }
  };
  return /* @__PURE__ */ x(c0, {
    tooltipEntrySettings: f
  });
});
function J2(e) {
  var t = $(Kr), r = e.data, n = e.dataKey, i = e.background, a = e.allOtherBarProps, o = a.onMouseEnter, u = a.onMouseLeave, l = a.onClick, c = Ba(a, z2), s = o0(o, n, a.id), f = u0(u), d = l0(l, n, a.id);
  if (!i || r == null)
    return null;
  var v = li(i);
  return /* @__PURE__ */ x(wt, {
    zIndex: i$(i, je.barBackground)
  }, r.map((h, p) => {
    h.value;
    var y = h.background;
    h.tooltipPosition;
    var m = Ba(h, B2);
    if (!y)
      return null;
    var b = s(h, h.originalDataIndex), g = f(h, h.originalDataIndex), A = d(h, h.originalDataIndex), O = Pe(Pe(Pe(Pe(Pe({
      option: i,
      isActive: String(h.originalDataIndex) === t
    }, m), {}, {
      // @ts-expect-error backgroundProps is contributing unknown props
      fill: "#eee"
    }, y), v), Ga(c, h, p)), {}, {
      onMouseEnter: b,
      onMouseLeave: g,
      onClick: A,
      dataKey: n,
      index: p,
      className: "recharts-bar-background-rectangle"
    });
    return /* @__PURE__ */ x(Xc, br({
      key: "background-bar-".concat(p)
    }, O));
  }));
}
function eL(e) {
  var t = e.showLabels, r = e.children, n = e.rects, i = n?.map((a) => {
    var o = {
      x: a.x,
      y: a.y,
      width: a.width,
      lowerWidth: a.width,
      upperWidth: a.width,
      height: a.height
    };
    return Pe(Pe({}, o), {}, {
      value: a.value,
      payload: a.payload,
      parentViewBox: a.parentViewBox,
      viewBox: o,
      fill: a.fill
    });
  });
  return /* @__PURE__ */ x(Zg, {
    value: t ? i : void 0
  }, r);
}
function tL(e) {
  var t = e.shape, r = e.activeBar, n = e.baseProps, i = e.entry, a = e.index, o = e.dataKey, u = $(Kr), l = $(_g), c = r && String(i.originalDataIndex) === u && (l == null || o === l), s = u != null && (String(i.originalDataIndex) !== u || l != null && o !== l), f = Se(!1), d = Yv(f, 2), v = d[0], h = d[1], p = Se(!1), y = Yv(p, 2), m = y[0], b = y[1];
  ce(() => {
    var _;
    return c ? (h(!0), _ = requestAnimationFrame(() => {
      b(!0);
    })) : (b(!1), s && h(!1)), () => {
      cancelAnimationFrame(_);
    };
  }, [c, s]);
  var g = Q(() => {
    c || h(!1);
  }, [c]), A = c && m, O = c || v, w;
  c ? r === !0 ? w = t : w = r : w = t;
  var S = /* @__PURE__ */ x(Xc, br({}, n, {
    name: String(n.name)
  }, i, {
    isActive: A,
    option: w,
    index: a,
    dataKey: o,
    animationElapsedTime: e.animationElapsedTime,
    isAnimating: e.isAnimating,
    isEntrance: e.isEntrance,
    onTransitionEnd: g
  }));
  return O ? /* @__PURE__ */ x(wt, {
    zIndex: je.activeBar
  }, /* @__PURE__ */ x(R0, {
    index: i.originalDataIndex
  }, S)) : S;
}
function rL(e) {
  var t = e.shape, r = e.baseProps, n = e.entry, i = e.index, a = e.dataKey;
  return /* @__PURE__ */ x(Xc, br({}, r, {
    name: String(r.name)
  }, n, {
    isActive: !1,
    option: t,
    index: i,
    dataKey: a,
    animationElapsedTime: e.animationElapsedTime,
    isAnimating: e.isAnimating,
    isEntrance: e.isEntrance
  }));
}
function nL(e) {
  var t, r = e.data, n = e.props, i = e.animationElapsedTime, a = e.isAnimating, o = e.isEntrance, u = (t = _t(n)) !== null && t !== void 0 ? t : {}, l = u.id, c = Ba(u, W2), s = n.shape, f = n.dataKey, d = n.activeBar, v = n.onMouseEnter, h = n.onClick, p = n.onMouseLeave, y = Ba(n, F2), m = o0(v, f, l), b = u0(p), g = l0(h, f, l);
  return r ? /* @__PURE__ */ x(et, null, r.map((A, O) => /* @__PURE__ */ x(R0, br({
    index: A.originalDataIndex,
    key: "rectangle-".concat(A?.x, "-").concat(A?.y, "-").concat(A?.value, "-").concat(O),
    className: "recharts-bar-rectangle"
  }, Ga(y, A, O), {
    onMouseEnter: m(A, A.originalDataIndex),
    onMouseLeave: b(A, A.originalDataIndex),
    onClick: g(A, A.originalDataIndex)
  }), d ? /* @__PURE__ */ x(tL, {
    shape: s,
    activeBar: d,
    baseProps: c,
    entry: A,
    index: O,
    dataKey: f,
    animationElapsedTime: i,
    isAnimating: a,
    isEntrance: o
  }) : (
    /*
     * If the `activeBar` prop is falsy, then let's call the variant without hooks.
     * Using the `selectActiveTooltipIndex` selector is usually fast
     * but in charts with large-ish amount of data even the few nanoseconds add up to a noticeable jank.
     * If the activeBar is false then we don't need to know which index is active - because we won't use it anyway.
     * So let's just skip the hooks altogether. That way, React can skip rendering the component,
     * and can skip the tree reconciliation for its children too.
     * Because we can't call hooks conditionally, we need to have a separate component for that.
     */
    /* @__PURE__ */ x(rL, {
      shape: s,
      baseProps: c,
      entry: A,
      index: O,
      dataKey: f,
      animationElapsedTime: i,
      isAnimating: a,
      isEntrance: o
    })
  )))) : null;
}
var iL = (e, t, r) => e == null ? [] : t === 1 ? e.flatMap((n) => n.status === "removed" ? [] : [n.next]) : e.flatMap((n) => {
  if (n.status === "removed")
    return r === "horizontal" ? [Pe(Pe({}, n.prev), {}, {
      height: me(n.prev.height, 0, t),
      y: me(n.prev.y, n.prev.y + n.prev.height, t)
    })] : [Pe(Pe({}, n.prev), {}, {
      width: me(n.prev.width, 0, t)
    })];
  if (n.status === "matched")
    return [Pe(Pe({}, n.next), {}, {
      x: me(n.prev.x, n.next.x, t),
      y: me(n.prev.y, n.next.y, t),
      width: me(n.prev.width, n.next.width, t),
      height: me(n.prev.height, n.next.height, t)
    })];
  var i = n.next;
  return r === "horizontal" ? [Pe(Pe({}, i), {}, {
    height: me(0, i.height, t),
    y: me(i.stackedBarStart, i.y, t)
  })] : [Pe(Pe({}, i), {}, {
    width: me(0, i.width, t),
    x: me(i.stackedBarStart, i.x, t)
  })];
});
function aL(e) {
  var t = e.props, r = e.previousRectanglesRef, n = t.data, i = t.isAnimationActive, a = t.animationBegin, o = t.animationDuration, u = t.animationEasing, l = t.animationInterpolateFn, c = t.layout, s = d0(t.onAnimationStart, t.onAnimationEnd), f = s.isAnimating, d = s.handleAnimationStart, v = s.handleAnimationEnd;
  return /* @__PURE__ */ x(eL, {
    showLabels: !f,
    rects: n
  }, /* @__PURE__ */ x(v0, {
    animationInput: n,
    animationIdPrefix: "recharts-bar-",
    items: n,
    previousItemsRef: r,
    isAnimationActive: i,
    animationBegin: a,
    animationDuration: o,
    animationEasing: u,
    onAnimationStart: d,
    onAnimationEnd: v,
    animationInterpolateFn: l,
    animationMatchBy: t.animationMatchBy,
    layout: c
  }, (h, p, y) => /* @__PURE__ */ x(ot, null, /* @__PURE__ */ x(nL, {
    props: t,
    data: h,
    animationElapsedTime: p,
    isAnimating: f || p < 1,
    isEntrance: y
  }))), /* @__PURE__ */ x(Jg, {
    label: t.label
  }), t.children);
}
function oL(e) {
  var t = Y(null);
  return /* @__PURE__ */ x(aL, {
    previousRectanglesRef: t,
    props: e
  });
}
var z0 = 0, uL = (e, t) => {
  var r = Array.isArray(e.value) ? e.value[1] : e.value;
  return {
    x: e.x,
    y: e.y,
    value: r,
    // getValueByDataKey does not validate the output type
    errorVal: he(e, t)
  };
};
class lL extends vh {
  render() {
    var t = this.props, r = t.hide, n = t.data, i = t.dataKey, a = t.className, o = t.xAxisId, u = t.yAxisId, l = t.needClip, c = t.background, s = t.id;
    if (r || n == null)
      return null;
    var f = re("recharts-bar", a), d = s;
    return /* @__PURE__ */ x(ot, {
      className: f,
      id: s
    }, l && /* @__PURE__ */ x("defs", null, /* @__PURE__ */ x(C0, {
      clipPathId: d,
      xAxisId: o,
      yAxisId: u
    })), /* @__PURE__ */ x(ot, {
      className: "recharts-bar-rectangles",
      clipPath: l ? "url(#clipPath-".concat(d, ")") : void 0
    }, /* @__PURE__ */ x(J2, {
      data: n,
      dataKey: i,
      background: c,
      allOtherBarProps: this.props
    }), /* @__PURE__ */ x(oL, this.props)));
  }
}
var cL = {
  activeBar: !1,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease",
  animationInterpolateFn: iL,
  animationMatchBy: f0,
  background: !1,
  hide: !1,
  isAnimationActive: "auto",
  label: !1,
  legendType: "rect",
  minPointSize: z0,
  shape: Vc,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: je.bar
};
function sL(e) {
  var t = e.xAxisId, r = e.yAxisId, n = e.hide, i = e.legendType, a = e.minPointSize, o = e.activeBar, u = e.animationBegin, l = e.animationDuration, c = e.animationEasing, s = e.isAnimationActive, f = Yc(t, r), d = f.needClip, v = Yr(), h = Ue(), p = CM(e.children, Rg), y = $((g) => T2(g, e.id, h, p));
  if (v !== "vertical" && v !== "horizontal")
    return null;
  var m, b = y?.[0];
  return b == null || b.height == null || b.width == null ? m = 0 : m = v === "vertical" ? b.height / 2 : b.width / 2, /* @__PURE__ */ x(j0, {
    xAxisId: t,
    yAxisId: r,
    data: y,
    dataPointFormatter: uL,
    errorBarOffset: m
  }, /* @__PURE__ */ x(lL, br({}, e, {
    layout: v,
    needClip: d,
    data: y,
    xAxisId: t,
    yAxisId: r,
    hide: n,
    legendType: i,
    minPointSize: a,
    activeBar: o,
    animationBegin: u,
    animationDuration: l,
    animationEasing: c,
    isAnimationActive: s
  })));
}
function fL(e) {
  var t = e.layout, r = e.barSettings, n = r.dataKey, i = r.minPointSize, a = r.hasCustomShape, o = e.pos, u = e.bandSize, l = e.xAxis, c = e.yAxis, s = e.xAxisTicks, f = e.yAxisTicks, d = e.stackedData, v = e.displayedData, h = e.offset, p = e.cells, y = e.parentViewBox, m = e.dataStartIndex, b = t === "horizontal" ? c : l, g = d ? b.scale.domain() : null, A = l1({
    numericAxis: b
  }), O = b.scale.map(A);
  return v.map((w, S) => {
    var _, E, j, k, I, R;
    if (d) {
      var N = d[S + m];
      if (N == null)
        return null;
      _ = r1(N, g);
    } else
      _ = he(w, n), Array.isArray(_) || (_ = [A, _]);
    var L = p2(i, z0)(_[1], S);
    if (t === "horizontal") {
      var W, F = c.scale.map(_[0]), z = c.scale.map(_[1]);
      if (F == null || z == null)
        return null;
      E = Ls({
        axis: l,
        ticks: s,
        bandSize: u,
        offset: o.offset,
        entry: w,
        index: S
      }), j = (W = z ?? F) !== null && W !== void 0 ? W : void 0, k = o.size;
      var q = F - z;
      if (I = Wt(q) ? 0 : q, R = {
        x: E,
        y: h.top,
        width: k,
        height: h.height
      }, Math.abs(L) > 0 && Math.abs(I) < Math.abs(L)) {
        var U = Xe(I || L) * (Math.abs(L) - Math.abs(I));
        j -= U, I += U;
      }
    } else {
      var pe = l.scale.map(_[0]), ye = l.scale.map(_[1]);
      if (pe == null || ye == null)
        return null;
      if (E = pe, j = Ls({
        axis: c,
        ticks: f,
        bandSize: u,
        offset: o.offset,
        entry: w,
        index: S
      }), k = ye - pe, I = o.size, R = {
        x: h.left,
        y: j,
        width: h.width,
        height: I
      }, Math.abs(L) > 0 && Math.abs(k) < Math.abs(L)) {
        var fe = Xe(k || L) * (Math.abs(L) - Math.abs(k));
        k += fe;
      }
    }
    if (E == null || j == null || k == null || I == null || !a && (k === 0 || I === 0))
      return null;
    var Ye = Pe(Pe({}, w), {}, {
      stackedBarStart: O,
      x: E,
      y: j,
      width: k,
      height: I,
      value: d ? _ : _[1],
      payload: w,
      background: R,
      tooltipPosition: {
        x: E + k / 2,
        y: j + I / 2
      },
      parentViewBox: y,
      originalDataIndex: S
    }, p && p[S] && p[S].props);
    return Ye;
  }).filter(Boolean);
}
function dL(e) {
  var t = Fe(e, cL), r = N2(t.stackId), n = Ue();
  return /* @__PURE__ */ x(h0, {
    id: t.id,
    type: "bar"
  }, (i) => /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(s0, {
    legendPayload: Z2(t)
  }), /* @__PURE__ */ x(Q2, {
    dataKey: t.dataKey,
    stroke: t.stroke,
    strokeWidth: t.strokeWidth,
    fill: t.fill,
    name: t.name,
    hide: t.hide,
    unit: t.unit,
    formatter: t.formatter,
    tooltipType: t.tooltipType,
    id: i
  }), /* @__PURE__ */ x(y0, {
    type: "bar",
    id: i,
    data: void 0,
    xAxisId: t.xAxisId,
    yAxisId: t.yAxisId,
    zAxisId: 0,
    dataKey: t.dataKey,
    stackId: r,
    hide: t.hide,
    barSize: t.barSize,
    minPointSize: t.minPointSize,
    maxBarSize: t.maxBarSize,
    isPanorama: n,
    hasCustomShape: t.shape != null && t.shape !== Vc
  }), /* @__PURE__ */ x(wt, {
    zIndex: t.zIndex
  }, /* @__PURE__ */ x(sL, br({}, t, {
    id: i
  })))));
}
var B0 = /* @__PURE__ */ gt(dL, wn);
B0.displayName = "Bar";
var vL = ["domain", "range"], hL = ["domain", "range"];
function Vv(e, t) {
  if (e == null) return {};
  var r, n, i = pL(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function pL(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Xv(e, t) {
  return e === t ? !0 : Array.isArray(e) && e.length === 2 && Array.isArray(t) && t.length === 2 ? e[0] === t[0] && e[1] === t[1] : !1;
}
function W0(e, t) {
  if (e === t)
    return !0;
  var r = e.domain, n = e.range, i = Vv(e, vL), a = t.domain, o = t.range, u = Vv(t, hL);
  return !Xv(r, a) || !Xv(n, o) ? !1 : wn(i, u);
}
var yL = ["type"], mL = ["dangerouslySetInnerHTML", "ticks", "scale"], gL = ["id", "scale"];
function rl() {
  return rl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, rl.apply(null, arguments);
}
function Zv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Qv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Zv(Object(r), !0).forEach(function(n) {
      bL(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Zv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function bL(e, t, r) {
  return (t = xL(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function xL(e) {
  var t = wL(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function wL(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function nl(e, t) {
  if (e == null) return {};
  var r, n, i = AL(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function AL(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function OL(e) {
  var t = ae(), r = Y(null), n = ry(), i = e.type, a = nl(e, yL), o = po(n, "xAxis", i), u = ht(() => {
    if (o != null)
      return Qv(Qv({}, a), {}, {
        type: o
      });
  }, [a, o]);
  return xe(() => {
    u != null && (r.current === null ? t(kD(u)) : r.current !== u && t(jD({
      prev: r.current,
      next: u
    })), r.current = u);
  }, [u, t]), xe(() => () => {
    r.current && (t(CD(r.current)), r.current = null);
  }, [t]), null;
}
var PL = (e) => {
  var t = e.xAxisId, r = e.className, n = e.height, i = e.label, a = Y(null), o = Y(null), u = $(Dl), l = Ue(), c = ae(), s = "xAxis", f = $((m) => ag(m, s, t, l)), d = $((m) => rg(m, t)), v = $((m) => zj(m, t)), h = $((m) => Am(m, t));
  if (xe(() => {
    if (!(n !== "auto" || !d || Eo(i) || /* @__PURE__ */ ve(i) || h == null)) {
      var m = a.current;
      if (m) {
        var b = m.getCalculatedHeight();
        Math.round(d.height) !== Math.round(b) && c($D({
          id: t,
          height: b
        }));
      }
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    f,
    d,
    c,
    i,
    t,
    n,
    h
  ]), d == null || v == null || h == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var p = nl(e, mL);
  h.id, h.scale;
  var y = nl(h, gL);
  return /* @__PURE__ */ x(Uc, rl({}, p, y, {
    ref: a,
    labelRef: o,
    x: v.x,
    y: v.y,
    width: d.width,
    height: d.height,
    className: re("recharts-".concat(s, " ").concat(s), r),
    viewBox: u,
    ticks: f,
    axisType: s,
    axisId: t
  }));
}, SL = {
  allowDataOverflow: Ae.allowDataOverflow,
  allowDecimals: Ae.allowDecimals,
  allowDuplicatedCategory: Ae.allowDuplicatedCategory,
  angle: Ae.angle,
  axisLine: er.axisLine,
  height: Ae.height,
  hide: !1,
  includeHidden: Ae.includeHidden,
  interval: Ae.interval,
  label: !1,
  minTickGap: Ae.minTickGap,
  mirror: Ae.mirror,
  orientation: Ae.orientation,
  padding: Ae.padding,
  reversed: Ae.reversed,
  scale: Ae.scale,
  tick: Ae.tick,
  tickCount: Ae.tickCount,
  tickLine: er.tickLine,
  tickSize: er.tickSize,
  type: Ae.type,
  niceTicks: Ae.niceTicks,
  xAxisId: 0
}, IL = (e) => {
  var t = Fe(e, SL);
  return /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(OL, {
    allowDataOverflow: t.allowDataOverflow,
    allowDecimals: t.allowDecimals,
    allowDuplicatedCategory: t.allowDuplicatedCategory,
    angle: t.angle,
    dataKey: t.dataKey,
    domain: t.domain,
    height: t.height,
    hide: t.hide,
    id: t.xAxisId,
    includeHidden: t.includeHidden,
    interval: t.interval,
    minTickGap: t.minTickGap,
    mirror: t.mirror,
    name: t.name,
    orientation: t.orientation,
    padding: t.padding,
    reversed: t.reversed,
    scale: t.scale,
    tick: t.tick,
    tickCount: t.tickCount,
    tickFormatter: t.tickFormatter,
    ticks: t.ticks,
    type: t.type,
    unit: t.unit,
    niceTicks: t.niceTicks
  }), /* @__PURE__ */ x(PL, t));
}, F0 = /* @__PURE__ */ gt(IL, W0);
F0.displayName = "XAxis";
var _L = ["type"], kL = ["dangerouslySetInnerHTML", "ticks", "scale"], jL = ["id", "scale"];
function il() {
  return il = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, il.apply(null, arguments);
}
function Jv(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function eh(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jv(Object(r), !0).forEach(function(n) {
      CL(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jv(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function CL(e, t, r) {
  return (t = EL(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function EL(e) {
  var t = TL(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function TL(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function al(e, t) {
  if (e == null) return {};
  var r, n, i = ML(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function ML(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function DL(e) {
  var t = ae(), r = Y(null), n = ry(), i = e.type, a = al(e, _L), o = po(n, "yAxis", i), u = ht(() => {
    if (o != null)
      return eh(eh({}, a), {}, {
        type: o
      });
  }, [o, a]);
  return xe(() => {
    u != null && (r.current === null ? t(ED(u)) : r.current !== u && t(TD({
      prev: r.current,
      next: u
    })), r.current = u);
  }, [u, t]), xe(() => () => {
    r.current && (t(MD(r.current)), r.current = null);
  }, [t]), null;
}
function $L(e) {
  var t = e.yAxisId, r = e.className, n = e.width, i = e.label, a = Y(null), o = Y(null), u = $(Dl), l = Ue(), c = ae(), s = "yAxis", f = $((m) => ng(m, t)), d = $((m) => Wj(m, t)), v = $((m) => ag(m, s, t, l)), h = $((m) => Om(m, t));
  if (xe(() => {
    if (!(n !== "auto" || !f || Eo(i) || /* @__PURE__ */ ve(i) || h == null)) {
      var m = a.current;
      if (m) {
        var b = m.getCalculatedWidth();
        Math.round(f.width) !== Math.round(b) && c(DD({
          id: t,
          width: b
        }));
      }
    }
  }, [
    // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
    // The ref will be populated by then.
    // To re-run this effect when ticks change, we can depend on the ticks array from the store.
    v,
    f,
    c,
    i,
    t,
    n,
    h
  ]), f == null || d == null || h == null)
    return null;
  e.dangerouslySetInnerHTML, e.ticks, e.scale;
  var p = al(e, kL);
  h.id, h.scale;
  var y = al(h, jL);
  return /* @__PURE__ */ x(Uc, il({}, p, y, {
    ref: a,
    labelRef: o,
    x: d.x,
    y: d.y,
    tickTextProps: n === "auto" ? {
      width: void 0
    } : {
      width: n
    },
    width: f.width,
    height: f.height,
    className: re("recharts-".concat(s, " ").concat(s), r),
    viewBox: u,
    ticks: v,
    axisType: s,
    axisId: t
  }));
}
var NL = {
  allowDataOverflow: Oe.allowDataOverflow,
  allowDecimals: Oe.allowDecimals,
  allowDuplicatedCategory: Oe.allowDuplicatedCategory,
  angle: Oe.angle,
  axisLine: er.axisLine,
  hide: !1,
  includeHidden: Oe.includeHidden,
  interval: Oe.interval,
  label: !1,
  minTickGap: Oe.minTickGap,
  mirror: Oe.mirror,
  orientation: Oe.orientation,
  padding: Oe.padding,
  reversed: Oe.reversed,
  scale: Oe.scale,
  tick: Oe.tick,
  tickCount: Oe.tickCount,
  tickLine: er.tickLine,
  tickSize: er.tickSize,
  type: Oe.type,
  niceTicks: Oe.niceTicks,
  width: Oe.width,
  yAxisId: 0
}, LL = (e) => {
  var t = Fe(e, NL);
  return /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(DL, {
    interval: t.interval,
    id: t.yAxisId,
    scale: t.scale,
    type: t.type,
    domain: t.domain,
    allowDataOverflow: t.allowDataOverflow,
    dataKey: t.dataKey,
    allowDuplicatedCategory: t.allowDuplicatedCategory,
    allowDecimals: t.allowDecimals,
    tickCount: t.tickCount,
    padding: t.padding,
    includeHidden: t.includeHidden,
    reversed: t.reversed,
    ticks: t.ticks,
    width: t.width,
    orientation: t.orientation,
    mirror: t.mirror,
    hide: t.hide,
    unit: t.unit,
    name: t.name,
    angle: t.angle,
    minTickGap: t.minTickGap,
    tick: t.tick,
    tickFormatter: t.tickFormatter,
    niceTicks: t.niceTicks
  }), /* @__PURE__ */ x($L, t));
}, K0 = /* @__PURE__ */ gt(LL, W0);
K0.displayName = "YAxis";
var RL = (e, t) => t, Zc = P([RL, J, Ly, Te, Og, sr, sE, Ce], mE);
function zL(e) {
  return "getBBox" in e.currentTarget && typeof e.currentTarget.getBBox == "function";
}
function Qc(e) {
  var t = e.currentTarget.getBoundingClientRect(), r, n;
  if (zL(e)) {
    var i = e.currentTarget.getBBox();
    r = i.width > 0 ? t.width / i.width : 1, n = i.height > 0 ? t.height / i.height : 1;
  } else {
    var a = e.currentTarget;
    r = a.offsetWidth > 0 ? t.width / a.offsetWidth : 1, n = a.offsetHeight > 0 ? t.height / a.offsetHeight : 1;
  }
  var o = (u, l) => ({
    /*
     * Here it's important to use:
     * - event.clientX and event.clientY to get the mouse position relative to the viewport, including scroll.
     * - pageX and pageY are not used because they are relative to the whole document, and ignore scroll.
     * - rect.left and rect.top are used to get the position of the chart relative to the viewport.
     * - offsetX and offsetY are not used because they are relative to the offset parent
     *  which may or may not be the same as the clientX and clientY, depending on the position of the chart in the DOM
     *  and surrounding element styles. CSS position: relative, absolute, fixed, will change the offset parent.
     * - scaleX and scaleY are necessary for when the chart element is scaled using CSS `transform: scale(N)`.
     */
    relativeX: Math.round((u - t.left) / r),
    relativeY: Math.round((l - t.top) / n)
  });
  return "touches" in e ? Array.from(e.touches).map((u) => o(u.clientX, u.clientY)) : o(e.clientX, e.clientY);
}
var U0 = ut("mouseClick"), H0 = fi();
H0.startListening({
  actionCreator: U0,
  effect: (e, t) => {
    var r = e.payload, n = Zc(t.getState(), Qc(r));
    n?.activeIndex != null && t.dispatch(nC({
      activeIndex: n.activeIndex,
      activeDataKey: void 0,
      activeCoordinate: n.activeCoordinate
    }));
  }
});
var ol = ut("mouseMove"), Y0 = fi(), nn = null, Pr = null, du = null;
Y0.startListening({
  actionCreator: ol,
  effect: (e, t) => {
    var r = e.payload, n = t.getState(), i = n.eventSettings, a = i.throttleDelay, o = i.throttledEvents, u = o === "all" || o?.includes("mousemove");
    nn !== null && (cancelAnimationFrame(nn), nn = null), Pr !== null && (typeof a != "number" || !u) && (clearTimeout(Pr), Pr = null), du = Qc(r);
    var l = () => {
      var c = t.getState(), s = Si(c, c.tooltip.settings.shared);
      if (!du) {
        nn = null, Pr = null;
        return;
      }
      if (s === "axis") {
        var f = Zc(c, du);
        f?.activeIndex != null ? t.dispatch(vg({
          activeIndex: f.activeIndex,
          activeDataKey: void 0,
          activeCoordinate: f.activeCoordinate
        })) : t.dispatch(dg());
      }
      nn = null, Pr = null;
    };
    if (!u) {
      l();
      return;
    }
    a === "raf" ? nn = requestAnimationFrame(l) : typeof a == "number" && Pr === null && (Pr = setTimeout(l, a));
  }
});
function BL(e, t) {
  return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : e === "children" && typeof t == "object" && t !== null ? "<<CHILDREN>>" : t;
}
var th = {
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  barSize: void 0,
  className: void 0,
  maxBarSize: void 0,
  stackOffset: "none",
  syncId: void 0,
  syncMethod: "index",
  baseValue: void 0,
  reverseStackOrder: !1
}, q0 = Ke({
  name: "rootProps",
  initialState: th,
  reducers: {
    updateOptions: (e, t) => {
      var r;
      e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = (r = t.payload.barGap) !== null && r !== void 0 ? r : th.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder;
    }
  }
}), WL = q0.reducer, FL = q0.actions.updateOptions, KL = null, UL = {
  updatePolarOptions: (e, t) => e === null ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e)
}, G0 = Ke({
  name: "polarOptions",
  initialState: KL,
  reducers: UL
});
G0.actions.updatePolarOptions;
var HL = G0.reducer, V0 = ut("keyDown"), X0 = ut("focus"), Z0 = ut("blur"), Mo = fi(), an = null, Sr = null, Ki = null;
Mo.startListening({
  actionCreator: V0,
  effect: (e, t) => {
    Ki = e.payload, an !== null && (cancelAnimationFrame(an), an = null);
    var r = t.getState(), n = r.eventSettings, i = n.throttleDelay, a = n.throttledEvents, o = a === "all" || a.includes("keydown");
    Sr !== null && (typeof i != "number" || !o) && (clearTimeout(Sr), Sr = null);
    var u = () => {
      try {
        var l = t.getState(), c = l.rootProps.accessibilityLayer !== !1;
        if (!c)
          return;
        var s = l.tooltip.keyboardInteraction, f = Ki;
        if (f !== "ArrowRight" && f !== "ArrowLeft" && f !== "Enter")
          return;
        var d = qn(s, Fr(l), bn(l), xn(l)), v = d == null ? -1 : Number(d), h = !Number.isFinite(v) || v < 0, p = sr(l), y = Fr(l), m = Si(l, l.tooltip.settings.shared);
        if (f === "Enter") {
          if (h)
            return;
          var b = Da(l, m, "hover", String(s.index));
          t.dispatch(Ma({
            active: !s.active,
            activeIndex: s.index,
            activeCoordinate: b
          }));
          return;
        }
        var g = Yj(l), A = g === "left-to-right" ? 1 : -1, O = f === "ArrowRight" ? 1 : -1, w;
        if (h) {
          var S = bn(l), _ = xn(l), E = O * A, j = (L) => ({
            active: !1,
            index: String(L),
            dataKey: void 0,
            graphicalItemId: void 0,
            coordinate: void 0
          });
          if (w = -1, E > 0) {
            for (var k = 0; k < y.length; k++)
              if (qn(j(k), y, S, _) != null) {
                w = k;
                break;
              }
          } else
            for (var I = y.length - 1; I >= 0; I--)
              if (qn(j(I), y, S, _) != null) {
                w = I;
                break;
              }
          if (w < 0)
            return;
        } else {
          w = v + O * A;
          var R = p?.length || y.length;
          if (R === 0 || w >= R || w < 0)
            return;
        }
        var N = Da(l, m, "hover", String(w));
        t.dispatch(Ma({
          active: !0,
          activeIndex: w.toString(),
          activeCoordinate: N
        }));
      } finally {
        an = null, Sr = null;
      }
    };
    if (!o) {
      u();
      return;
    }
    i === "raf" ? an = requestAnimationFrame(u) : typeof i == "number" && Sr === null && (u(), Ki = null, Sr = setTimeout(() => {
      Ki ? u() : (Sr = null, an = null);
    }, i));
  }
});
Mo.startListening({
  actionCreator: X0,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var i = r.tooltip.keyboardInteraction;
      if (!i.active && i.index == null) {
        var a = "0", o = Si(r, r.tooltip.settings.shared), u = Da(r, o, "hover", String(a));
        t.dispatch(Ma({
          active: !0,
          activeIndex: a,
          activeCoordinate: u
        }));
      }
    }
  }
});
Mo.startListening({
  actionCreator: Z0,
  effect: (e, t) => {
    var r = t.getState(), n = r.rootProps.accessibilityLayer !== !1;
    if (n) {
      var i = r.tooltip.keyboardInteraction;
      i.active && t.dispatch(Ma({
        active: !1,
        activeIndex: i.index,
        activeCoordinate: i.coordinate
      }));
    }
  }
});
function Q0(e) {
  e.persist();
  var t = e.currentTarget;
  return new Proxy(e, {
    get: (r, n) => {
      if (n === "currentTarget")
        return t;
      var i = Reflect.get(r, n);
      return typeof i == "function" ? i.bind(r) : i;
    }
  });
}
var st = ut("externalEvent"), J0 = fi(), Ui = /* @__PURE__ */ new Map(), Wn = /* @__PURE__ */ new Map(), vu = /* @__PURE__ */ new Map();
J0.startListening({
  actionCreator: st,
  effect: (e, t) => {
    var r = e.payload, n = r.handler, i = r.reactEvent;
    if (n != null) {
      var a = i.type, o = Q0(i);
      vu.set(a, {
        handler: n,
        reactEvent: o
      });
      var u = Ui.get(a);
      u !== void 0 && (cancelAnimationFrame(u), Ui.delete(a));
      var l = t.getState(), c = l.eventSettings, s = c.throttleDelay, f = c.throttledEvents, d = f, v = d === "all" || d?.includes(a), h = Wn.get(a);
      h !== void 0 && (typeof s != "number" || !v) && (clearTimeout(h), Wn.delete(a));
      var p = () => {
        var b = vu.get(a);
        try {
          if (!b)
            return;
          var g = b.handler, A = b.reactEvent, O = t.getState(), w = {
            activeCoordinate: GC(O),
            activeDataKey: _g(O),
            activeIndex: Kr(O),
            activeLabel: Ig(O),
            activeTooltipIndex: Kr(O),
            isTooltipActive: VC(O)
          };
          g && g(w, A);
        } finally {
          Ui.delete(a), Wn.delete(a), vu.delete(a);
        }
      };
      if (!v) {
        p();
        return;
      }
      if (s === "raf") {
        var y = requestAnimationFrame(p);
        Ui.set(a, y);
      } else if (typeof s == "number") {
        if (!Wn.has(a)) {
          p();
          var m = setTimeout(p, s);
          Wn.set(a, m);
        }
      } else
        p();
    }
  }
});
var YL = P([jn], (e) => e.tooltipItemPayloads), qL = P([YL, (e, t) => t, (e, t, r) => r], (e, t, r) => {
  if (t != null) {
    var n = e.find((a) => a.settings.graphicalItemId === r);
    if (n != null) {
      var i = n.getPosition;
      if (i != null)
        return i(t);
    }
  }
}), eb = ut("touchMove"), tb = fi(), Ir = null, fr = null, rh = null, Fn = null;
tb.startListening({
  actionCreator: eb,
  effect: (e, t) => {
    var r = e.payload;
    if (!(r.touches == null || r.touches.length === 0)) {
      Fn = Q0(r);
      var n = t.getState(), i = n.eventSettings, a = i.throttleDelay, o = i.throttledEvents, u = o === "all" || o.includes("touchmove");
      Ir !== null && (cancelAnimationFrame(Ir), Ir = null), fr !== null && (typeof a != "number" || !u) && (clearTimeout(fr), fr = null), rh = Array.from(r.touches).map((c) => Qc({
        clientX: c.clientX,
        clientY: c.clientY,
        currentTarget: r.currentTarget
      }));
      var l = () => {
        if (Fn != null) {
          var c = t.getState(), s = Si(c, c.tooltip.settings.shared);
          if (s === "axis") {
            var f, d = (f = rh) === null || f === void 0 ? void 0 : f[0];
            if (d == null) {
              Ir = null, fr = null;
              return;
            }
            var v = Zc(c, d);
            v?.activeIndex != null && t.dispatch(vg({
              activeIndex: v.activeIndex,
              activeDataKey: void 0,
              activeCoordinate: v.activeCoordinate
            }));
          } else if (s === "item") {
            var h, p = Fn.touches[0];
            if (document.elementFromPoint == null || p == null)
              return;
            var y = document.elementFromPoint(p.clientX, p.clientY);
            if (!y || !y.getAttribute)
              return;
            var m = y.getAttribute(p1), b = (h = y.getAttribute(y1)) !== null && h !== void 0 ? h : void 0, g = Vr(c).find((w) => w.id === b);
            if (m == null || g == null || b == null)
              return;
            var A = g.dataKey, O = qL(c, m, b);
            t.dispatch(fg({
              activeDataKey: A,
              activeIndex: m,
              activeCoordinate: O,
              activeGraphicalItemId: b
            }));
          }
          Ir = null, fr = null;
        }
      };
      if (!u) {
        l();
        return;
      }
      a === "raf" ? Ir = requestAnimationFrame(l) : typeof a == "number" && fr === null && (l(), Fn = null, fr = setTimeout(() => {
        Fn ? l() : (fr = null, Ir = null);
      }, a));
    }
  }
});
var rb = {
  throttleDelay: "raf",
  throttledEvents: ["mousemove", "touchmove", "pointermove", "scroll", "wheel"]
}, nb = Ke({
  name: "eventSettings",
  initialState: rb,
  reducers: {
    setEventSettings: (e, t) => {
      t.payload.throttleDelay != null && (e.throttleDelay = t.payload.throttleDelay), t.payload.throttledEvents != null && (e.throttledEvents = X(t.payload.throttledEvents));
    }
  }
}), GL = nb.actions.setEventSettings, VL = nb.reducer, XL = xp({
  brush: o$,
  cartesianAxis: ND,
  chartData: qE,
  errorBars: CN,
  eventSettings: VL,
  graphicalItems: vD,
  layout: ZA,
  legend: nO,
  options: FE,
  polarAxis: SM,
  polarOptions: HL,
  referenceElements: s$,
  renderedTicks: N$,
  rootProps: WL,
  tooltip: iC,
  zIndex: CE
}), ZL = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Chart";
  return AA({
    reducer: XL,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: t,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: (n) => {
      var i;
      return n({
        serializableCheck: !1,
        immutableCheck: !["commonjs", "es6", "production"].includes((i = "es6") !== null && i !== void 0 ? i : "")
      }).concat([H0.middleware, Y0.middleware, Mo.middleware, J0.middleware, tb.middleware]);
    },
    /*
     * I can't find out how to satisfy typescript here.
     * We return `EnhancerArray<[StoreEnhancer<{}, {}>, StoreEnhancer]>` from this function,
     * but the types say we should return `EnhancerArray<StoreEnhancer<{}, {}>`.
     * Looks like it's badly inferred generics, but it won't allow me to provide the correct type manually either.
     * So let's just ignore the error for now.
     */
    // @ts-expect-error mismatched generics
    enhancers: (n) => {
      var i = n;
      return typeof n == "function" && (i = n()), i.concat($p({
        type: "raf"
      }));
    },
    devTools: {
      serialize: {
        replacer: BL
      },
      name: "recharts-".concat(r)
    }
  });
};
function QL(e) {
  var t = e.preloadedState, r = e.children, n = e.reduxStoreName, i = Ue(), a = Y(null);
  if (i)
    return r;
  a.current == null && (a.current = ZL(t, n));
  var o = Sl;
  return /* @__PURE__ */ x(wO, {
    context: o,
    store: a.current
  }, r);
}
function JL(e) {
  var t = e.layout, r = e.margin, n = ae(), i = Ue();
  return ce(() => {
    i || (n(GA(t)), n(qA(r)));
  }, [n, i, t, r]), null;
}
var eR = /* @__PURE__ */ gt(JL, wn);
function tR(e) {
  var t = ae();
  return ce(() => {
    t(FL(e));
  }, [t, e]), null;
}
var rR = (e) => {
  var t = ae();
  return ce(() => {
    t(GL(e));
  }, [t, e]), null;
}, nR = /* @__PURE__ */ gt(rR, wn);
function nh(e) {
  var t = e.zIndex, r = e.isPanorama, n = Y(null), i = ae();
  return xe(() => (n.current && i(kE({
    zIndex: t,
    element: n.current,
    isPanorama: r
  })), () => {
    i(jE({
      zIndex: t,
      isPanorama: r
    }));
  }), [i, t, r]), /* @__PURE__ */ x("g", {
    tabIndex: -1,
    ref: n,
    className: "recharts-zIndex-layer_".concat(t)
  });
}
function ih(e) {
  var t = e.children, r = e.isPanorama, n = $(bE);
  if (!n || n.length === 0)
    return t;
  var i = n.filter((o) => o < 0), a = n.filter((o) => o > 0);
  return /* @__PURE__ */ x(et, null, i.map((o) => /* @__PURE__ */ x(nh, {
    key: o,
    zIndex: o,
    isPanorama: r
  })), t, a.map((o) => /* @__PURE__ */ x(nh, {
    key: o,
    zIndex: o,
    isPanorama: r
  })));
}
var iR = ["children"];
function aR(e, t) {
  if (e == null) return {};
  var r, n, i = oR(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function oR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
function Wa() {
  return Wa = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Wa.apply(null, arguments);
}
var uR = {
  width: "100%",
  height: "100%",
  /*
   * display: block is necessary here because the default for an SVG is display: inline,
   * which in some browsers (Chrome) adds a little bit of extra space above and below the SVG
   * to make space for the descender of letters like "g" and "y". This throws off the height calculation
   * and causes the container to grow indefinitely on each render with responsive=true.
   * Display: block removes that extra space.
   *
   * Interestingly, Firefox does not have this problem, but it doesn't hurt to add the style anyway.
   */
  display: "block"
}, lR = /* @__PURE__ */ we((e, t) => {
  var r = Nl(), n = Ll(), i = uy();
  if (!Kt(r) || !Kt(n))
    return null;
  var a = e.children, o = e.otherAttributes, u = e.title, l = e.desc, c, s;
  return o != null && (typeof o.tabIndex == "number" ? c = o.tabIndex : c = i ? 0 : void 0, typeof o.role == "string" ? s = o.role : s = i ? "application" : void 0), /* @__PURE__ */ x(sl, Wa({}, o, {
    title: u,
    desc: l,
    role: s,
    tabIndex: c,
    width: r,
    height: n,
    style: uR,
    ref: t
  }), a);
}), cR = (e) => {
  var t = e.children, r = $(so);
  if (!r)
    return null;
  var n = r.width, i = r.height, a = r.y, o = r.x;
  return /* @__PURE__ */ x(sl, {
    width: n,
    height: i,
    x: o,
    y: a
  }, t);
}, ah = /* @__PURE__ */ we((e, t) => {
  var r = e.children, n = aR(e, iR), i = Ue();
  return i ? /* @__PURE__ */ x(cR, null, /* @__PURE__ */ x(ih, {
    isPanorama: !0
  }, r)) : /* @__PURE__ */ x(lR, Wa({
    ref: t
  }, n), /* @__PURE__ */ x(ih, {
    isPanorama: !1
  }, r));
});
function sR(e, t) {
  return hR(e) || vR(e, t) || dR(e, t) || fR();
}
function fR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function dR(e, t) {
  if (e) {
    if (typeof e == "string") return oh(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? oh(e, t) : void 0;
  }
}
function oh(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function vR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function hR(e) {
  if (Array.isArray(e)) return e;
}
function pR() {
  var e = ae(), t = Se(null), r = sR(t, 2), n = r[0], i = r[1], a = $(h1);
  return ce(() => {
    if (n != null) {
      var o = n.getBoundingClientRect(), u = o.width / n.offsetWidth;
      V(u) && u !== a && e(XA(u));
    }
  }, [n, e, a]), i;
}
function uh(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function yR(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? uh(Object(r), !0).forEach(function(n) {
      mR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : uh(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function mR(e, t, r) {
  return (t = gR(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function gR(e) {
  var t = bR(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function bR(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function yr() {
  return yr = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, yr.apply(null, arguments);
}
function Fa(e, t) {
  return OR(e) || AR(e, t) || wR(e, t) || xR();
}
function xR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wR(e, t) {
  if (e) {
    if (typeof e == "string") return lh(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? lh(e, t) : void 0;
  }
}
function lh(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function AR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, i, a, o, u = [], l = !0, c = !1;
    try {
      if (a = (r = r.call(e)).next, t !== 0) for (; !(l = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); l = !0) ;
    } catch (s) {
      c = !0, i = s;
    } finally {
      try {
        if (!l && r.return != null && (o = r.return(), Object(o) !== o)) return;
      } finally {
        if (c) throw i;
      }
    }
    return u;
  }
}
function OR(e) {
  if (Array.isArray(e)) return e;
}
var PR = () => (rT(), null);
function Ka(e) {
  if (typeof e == "number")
    return e;
  if (typeof e == "string") {
    var t = parseFloat(e);
    if (!Number.isNaN(t))
      return t;
  }
  return 0;
}
var SR = /* @__PURE__ */ we((e, t) => {
  var r, n, i = Y(null), a = Se({
    containerWidth: Ka((r = e.style) === null || r === void 0 ? void 0 : r.width),
    containerHeight: Ka((n = e.style) === null || n === void 0 ? void 0 : n.height)
  }), o = Fa(a, 2), u = o[0], l = o[1], c = Q((f, d) => {
    l((v) => {
      var h = Math.round(f), p = Math.round(d);
      return v.containerWidth === h && v.containerHeight === p ? v : {
        containerWidth: h,
        containerHeight: p
      };
    });
  }, []), s = Q((f) => {
    if (typeof t == "function" && t(f), i.current != null && (i.current.disconnect(), i.current = null), f != null && typeof ResizeObserver < "u") {
      var d = f.getBoundingClientRect(), v = d.width, h = d.height;
      c(v, h);
      var p = (m) => {
        var b = m[0];
        if (b != null) {
          var g = b.contentRect, A = g.width, O = g.height;
          c(A, O);
        }
      }, y = new ResizeObserver(p);
      y.observe(f), i.current = y;
    }
  }, [t, c]);
  return ce(() => () => {
    var f = i.current;
    f?.disconnect();
  }, [c]), /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(vi, {
    width: u.containerWidth,
    height: u.containerHeight
  }), /* @__PURE__ */ x("div", yr({
    ref: s
  }, e)));
}), IR = /* @__PURE__ */ we((e, t) => {
  var r = e.width, n = e.height, i = Se({
    containerWidth: Ka(r),
    containerHeight: Ka(n)
  }), a = Fa(i, 2), o = a[0], u = a[1], l = Q((s, f) => {
    u((d) => {
      var v = Math.round(s), h = Math.round(f);
      return d.containerWidth === v && d.containerHeight === h ? d : {
        containerWidth: v,
        containerHeight: h
      };
    });
  }, []), c = Q((s) => {
    if (typeof t == "function" && t(s), s != null) {
      var f = s.getBoundingClientRect(), d = f.width, v = f.height;
      l(d, v);
    }
  }, [t, l]);
  return /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(vi, {
    width: o.containerWidth,
    height: o.containerHeight
  }), /* @__PURE__ */ x("div", yr({
    ref: c
  }, e)));
}), _R = /* @__PURE__ */ we((e, t) => {
  var r = e.width, n = e.height;
  return /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(vi, {
    width: r,
    height: n
  }), /* @__PURE__ */ x("div", yr({
    ref: t
  }, e)));
}), kR = /* @__PURE__ */ we((e, t) => {
  var r = e.width, n = e.height;
  return typeof r == "string" || typeof n == "string" ? /* @__PURE__ */ x(IR, yr({}, e, {
    ref: t
  })) : typeof r == "number" && typeof n == "number" ? /* @__PURE__ */ x(_R, yr({}, e, {
    width: r,
    height: n,
    ref: t
  })) : /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(vi, {
    width: r,
    height: n
  }), /* @__PURE__ */ x("div", yr({
    ref: t
  }, e)));
});
function jR(e) {
  return e ? SR : kR;
}
var CR = /* @__PURE__ */ we((e, t) => {
  var r = e.children, n = e.className, i = e.height, a = e.onClick, o = e.onContextMenu, u = e.onDoubleClick, l = e.onMouseDown, c = e.onMouseEnter, s = e.onMouseLeave, f = e.onMouseMove, d = e.onMouseUp, v = e.onTouchEnd, h = e.onTouchMove, p = e.onTouchStart, y = e.style, m = e.width, b = e.responsive, g = e.dispatchTouchEvents, A = g === void 0 ? !0 : g, O = Y(null), w = ae(), S = Se(null), _ = Fa(S, 2), E = _[0], j = _[1], k = Se(null), I = Fa(k, 2), R = I[0], N = I[1], L = pR(), W = $l(), F = W?.width > 0 ? W.width : m, z = W?.height > 0 ? W.height : i, q = Q((B) => {
    L(B), typeof t == "function" && t(B), j(B), N(B), B != null && (O.current = B);
  }, [L, t, j, N]), U = Q((B) => {
    w(U0(B)), w(st({
      handler: a,
      reactEvent: B
    }));
  }, [w, a]), pe = Q((B) => {
    w(ol(B)), w(st({
      handler: c,
      reactEvent: B
    }));
  }, [w, c]), ye = Q((B) => {
    w(dg()), w(st({
      handler: s,
      reactEvent: B
    }));
  }, [w, s]), fe = Q((B) => {
    w(ol(B)), w(st({
      handler: f,
      reactEvent: B
    }));
  }, [w, f]), Ye = Q(() => {
    w(X0());
  }, [w]), tt = Q(() => {
    w(Z0());
  }, [w]), At = Q((B) => {
    w(V0(B.key));
  }, [w]), Ot = Q((B) => {
    w(st({
      handler: o,
      reactEvent: B
    }));
  }, [w, o]), Tn = Q((B) => {
    w(st({
      handler: u,
      reactEvent: B
    }));
  }, [w, u]), M = Q((B) => {
    w(st({
      handler: l,
      reactEvent: B
    }));
  }, [w, l]), H = Q((B) => {
    w(st({
      handler: d,
      reactEvent: B
    }));
  }, [w, d]), K = Q((B) => {
    w(st({
      handler: p,
      reactEvent: B
    }));
  }, [w, p]), C = Q((B) => {
    A && w(eb(B)), w(st({
      handler: h,
      reactEvent: B
    }));
  }, [w, A, h]), Re = Q((B) => {
    w(st({
      handler: v,
      reactEvent: B
    }));
  }, [w, v]), ee = jR(b);
  return /* @__PURE__ */ x(Dg.Provider, {
    value: E
  }, /* @__PURE__ */ x(Ah.Provider, {
    value: R
  }, /* @__PURE__ */ x(ee, {
    width: F ?? y?.width,
    height: z ?? y?.height,
    className: re("recharts-wrapper", n),
    style: yR({
      position: "relative",
      cursor: "default",
      width: F,
      height: z
    }, y),
    onClick: U,
    onContextMenu: Ot,
    onDoubleClick: Tn,
    onFocus: Ye,
    onBlur: tt,
    onKeyDown: At,
    onMouseDown: M,
    onMouseEnter: pe,
    onMouseLeave: ye,
    onMouseMove: fe,
    onMouseUp: H,
    onTouchEnd: Re,
    onTouchMove: C,
    onTouchStart: K,
    ref: q
  }, /* @__PURE__ */ x(PR, null), r)));
}), ER = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"];
function TR(e, t) {
  if (e == null) return {};
  var r, n, i = MR(e, t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) === -1 && {}.propertyIsEnumerable.call(e, r) && (i[r] = e[r]);
  }
  return i;
}
function MR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) !== -1) continue;
    r[n] = e[n];
  }
  return r;
}
var DR = /* @__PURE__ */ we((e, t) => {
  var r = e.width, n = e.height, i = e.responsive, a = e.children, o = e.className, u = e.style, l = e.compact, c = e.title, s = e.desc, f = TR(e, ER), d = _t(f);
  return l ? /* @__PURE__ */ x(et, null, /* @__PURE__ */ x(vi, {
    width: r,
    height: n
  }), /* @__PURE__ */ x(ah, {
    otherAttributes: d,
    title: c,
    desc: s
  }, a)) : /* @__PURE__ */ x(CR, {
    className: o,
    style: u,
    width: r,
    height: n,
    responsive: i ?? !1,
    onClick: e.onClick,
    onMouseLeave: e.onMouseLeave,
    onMouseEnter: e.onMouseEnter,
    onMouseMove: e.onMouseMove,
    onMouseDown: e.onMouseDown,
    onMouseUp: e.onMouseUp,
    onContextMenu: e.onContextMenu,
    onDoubleClick: e.onDoubleClick,
    onTouchStart: e.onTouchStart,
    onTouchMove: e.onTouchMove,
    onTouchEnd: e.onTouchEnd
  }, /* @__PURE__ */ x(ah, {
    otherAttributes: d,
    title: c,
    desc: s,
    ref: t
  }, /* @__PURE__ */ x(m$, null, a)));
});
function ul() {
  return ul = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ul.apply(null, arguments);
}
function ch(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(i) {
      return Object.getOwnPropertyDescriptor(e, i).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function $R(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? ch(Object(r), !0).forEach(function(n) {
      NR(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ch(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function NR(e, t, r) {
  return (t = LR(t)) in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function LR(e) {
  var t = RR(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function RR(e, t) {
  if (typeof e != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zR = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
}, BR = $R({
  accessibilityLayer: !0,
  barCategoryGap: "10%",
  barGap: 4,
  layout: "horizontal",
  margin: zR,
  responsive: !1,
  reverseStackOrder: !1,
  stackOffset: "none",
  syncMethod: "index"
}, rb), ib = /* @__PURE__ */ we(function(t, r) {
  var n, i = Fe(t.categoricalChartProps, BR), a = t.chartName, o = t.defaultTooltipEventType, u = t.validateTooltipEventTypes, l = t.tooltipPayloadSearcher, c = t.categoricalChartProps, s = {
    chartName: a,
    defaultTooltipEventType: o,
    validateTooltipEventTypes: u,
    tooltipPayloadSearcher: l,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ x(QL, {
    preloadedState: {
      options: s
    },
    reduxStoreName: (n = c.id) !== null && n !== void 0 ? n : a
  }, /* @__PURE__ */ x(a$, {
    chartData: c.data
  }), /* @__PURE__ */ x(eR, {
    layout: i.layout,
    margin: i.margin
  }), /* @__PURE__ */ x(nR, {
    throttleDelay: i.throttleDelay,
    throttledEvents: i.throttledEvents
  }), /* @__PURE__ */ x(tR, {
    baseValue: i.baseValue,
    accessibilityLayer: i.accessibilityLayer,
    barCategoryGap: i.barCategoryGap,
    maxBarSize: i.maxBarSize,
    stackOffset: i.stackOffset,
    barGap: i.barGap,
    barSize: i.barSize,
    syncId: i.syncId,
    syncMethod: i.syncMethod,
    className: i.className,
    reverseStackOrder: i.reverseStackOrder
  }), /* @__PURE__ */ x(DR, ul({}, i, {
    ref: r
  })));
}), WR = ["axis"], FR = /* @__PURE__ */ we((e, t) => /* @__PURE__ */ x(ib, {
  chartName: "LineChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: WR,
  tooltipPayloadSearcher: $g,
  categoricalChartProps: e,
  ref: t
})), KR = ["axis", "item"], UR = /* @__PURE__ */ we((e, t) => /* @__PURE__ */ x(ib, {
  chartName: "BarChart",
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: KR,
  tooltipPayloadSearcher: $g,
  categoricalChartProps: e,
  ref: t
}));
const Hi = ["var(--chart-1, var(--primary))", "var(--chart-2, var(--muted-foreground))", "var(--chart-3, #f59e0b)", "var(--chart-4, #10b981)"];
function qR({ data: e, xKey: t, series: r, kind: n = "line", height: i = 260, format: a, formatX: o, label: u }) {
  const l = { stroke: "var(--muted-foreground)", fontSize: 12, tickLine: !1, axisLine: !1 }, c = /* @__PURE__ */ qt(
    pT,
    {
      formatter: (f) => a && typeof f == "number" ? a(f) : String(f),
      labelFormatter: (f) => o ? o(String(f)) : String(f),
      contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }
    }
  ), s = /* @__PURE__ */ Do(ab, { children: [
    /* @__PURE__ */ qt(I0, { stroke: "var(--border)", vertical: !1 }),
    /* @__PURE__ */ qt(F0, { dataKey: t, ...l, tickFormatter: o, minTickGap: 16 }),
    /* @__PURE__ */ qt(K0, { ...l, width: 72, tickFormatter: a }),
    c,
    r.length > 1 && /* @__PURE__ */ qt(ay, { wrapperStyle: { fontSize: 12 } })
  ] });
  return /* @__PURE__ */ qt("div", { role: "img", "aria-label": u, style: { width: "100%", height: i }, children: /* @__PURE__ */ qt(G1, { width: "100%", height: "100%", children: n === "bar" ? /* @__PURE__ */ Do(UR, { data: e, children: [
    s,
    r.map((f, d) => /* @__PURE__ */ qt(B0, { dataKey: f.key, name: f.label, fill: f.color ?? Hi[d % Hi.length], radius: [4, 4, 0, 0] }, f.key))
  ] }) : /* @__PURE__ */ Do(FR, { data: e, children: [
    s,
    r.map((f, d) => /* @__PURE__ */ qt(
      $0,
      {
        type: "monotone",
        dataKey: f.key,
        name: f.label,
        stroke: f.color ?? Hi[d % Hi.length],
        strokeWidth: 2,
        strokeDasharray: f.dashed ? "4 4" : void 0,
        dot: !1,
        isAnimationActive: !1
      },
      f.key
    ))
  ] }) }) });
}
export {
  qR as default
};
