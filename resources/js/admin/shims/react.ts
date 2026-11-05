/**
 * `react` for the commerce bundle: the panel's own copy, from
 * window.Sunrice.modules (the panel's runtime, version 3), so the bundle
 * shares the admin's single React, Inertia and UI. Generated from
 * @imajiner/admin-sdk's SHARED_MODULES (tests/Frontend checks the list).
 */
const m = (globalThis as { Sunrice?: { modules?: Record<string, Record<string, any>> } }).Sunrice?.modules?.["react"]; // eslint-disable-line @typescript-eslint/no-explicit-any
if (!m) {
    throw new Error('[commerce] This script needs the Sunrice admin panel (window.Sunrice.modules is missing).');
}

export default m;
export const Activity = m.Activity;
export const Children = m.Children;
export const Component = m.Component;
export const Fragment = m.Fragment;
export const Profiler = m.Profiler;
export const PureComponent = m.PureComponent;
export const StrictMode = m.StrictMode;
export const Suspense = m.Suspense;
export const ViewTransition = m.ViewTransition;
export const act = m.act;
export const addTransitionType = m.addTransitionType;
export const cache = m.cache;
export const cacheSignal = m.cacheSignal;
export const captureOwnerStack = m.captureOwnerStack;
export const cloneElement = m.cloneElement;
export const createContext = m.createContext;
export const createElement = m.createElement;
export const createRef = m.createRef;
export const forwardRef = m.forwardRef;
export const isValidElement = m.isValidElement;
export const lazy = m.lazy;
export const memo = m.memo;
export const startTransition = m.startTransition;
export const unstable_useCacheRefresh = m.unstable_useCacheRefresh;
export const use = m.use;
export const useActionState = m.useActionState;
export const useCallback = m.useCallback;
export const useContext = m.useContext;
export const useDebugValue = m.useDebugValue;
export const useDeferredValue = m.useDeferredValue;
export const useEffect = m.useEffect;
export const useEffectEvent = m.useEffectEvent;
export const useId = m.useId;
export const useImperativeHandle = m.useImperativeHandle;
export const useInsertionEffect = m.useInsertionEffect;
export const useLayoutEffect = m.useLayoutEffect;
export const useMemo = m.useMemo;
export const useOptimistic = m.useOptimistic;
export const useReducer = m.useReducer;
export const useRef = m.useRef;
export const useState = m.useState;
export const useSyncExternalStore = m.useSyncExternalStore;
export const useTransition = m.useTransition;
export const version = m.version;
