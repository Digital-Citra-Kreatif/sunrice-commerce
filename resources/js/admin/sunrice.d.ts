/**
 * Types of what the commerce bundle uses from the Sunrice panel: its
 * runtime (window.Sunrice, version 3, as @imajiner/admin-sdk reads it) and
 * the CMS's API for other plugins' bundles (globalThis.SunriceCms).
 */
import type * as ReactTypes from 'react';

type AnyComponent = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface SunriceRuntime {
    version: number;
    modules: Record<string, Record<string, unknown>>;
    registerPage(name: string, component: AnyComponent): void;
    registerPageLoader(name: string, load: () => Promise<AnyComponent | { default: AnyComponent }>): void;
    adminUrl(path?: string): string;
    t(text: string, replace?: Record<string, string | number | null | undefined>): string;
}

/**
 * What a field input gets, in the CMS's editors (registerFieldInput()) and
 * in commerce's own forms (FieldRenderer): errors by path relative to the
 * value, '' for the value itself.
 */
export interface FieldProps<V = unknown> {
    field: { handle: string; label?: string; type: string; required?: boolean; instructions?: string | null; config?: Record<string, unknown>; fields?: unknown[] };
    value: V;
    onChange: (value: V) => void;
    errors?: Record<string, string>;
    /** The input's id, for its label. */
    id?: string;
    describedBy?: string;
}

export interface SunriceCmsApi {
    version: number;
    registerFieldInput(type: string, component: ReactTypes.ComponentType<FieldProps<any>>): void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

declare global {
    interface Window {
        Sunrice: SunriceRuntime;
        SunriceCms?: SunriceCmsApi;
        SunriceCmsQueue?: Array<(cms: SunriceCmsApi) => void>;
        SunriceCommerce: import('./lib/api').SunriceCommerceApi;
        SunriceCommerceQueue?: Array<(api: import('./lib/api').SunriceCommerceApi) => void> & { drained?: boolean };
    }
}
