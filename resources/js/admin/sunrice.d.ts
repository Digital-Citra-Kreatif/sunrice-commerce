/**
 * Types of window.Sunrice, the admin's extension API (Sunrice CMS
 * resources/js/lib/plugin-api.ts, API version 2). Only what the commerce
 * bundle uses is typed precisely.
 */
import type * as ReactTypes from 'react';
import type * as ReactDOMTypes from 'react-dom';

type AnyComponent = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface InertiaRouter {
    visit(url: string, options?: Record<string, unknown>): void;
    get(url: string, data?: Record<string, unknown>, options?: Record<string, unknown>): void;
    post(url: string, data?: unknown, options?: Record<string, unknown>): void;
    put(url: string, data?: unknown, options?: Record<string, unknown>): void;
    patch(url: string, data?: unknown, options?: Record<string, unknown>): void;
    delete(url: string, options?: Record<string, unknown>): void;
    reload(options?: Record<string, unknown>): void;
}

export interface FieldProps<V = unknown> {
    field: { handle: string; label?: string; type: string; required?: boolean; instructions?: string | null; config?: Record<string, unknown> };
    value: V;
    onChange: (value: V) => void;
    errors?: Record<string, string>;
    pathPrefix?: string;
}

export interface SunriceApi {
    version: number;
    React: typeof ReactTypes;
    ReactDOM: typeof ReactDOMTypes;
    registerField(type: string, component: ReactTypes.ComponentType<FieldProps<any>>): void; // eslint-disable-line @typescript-eslint/no-explicit-any
    registerPage(name: string, component: AnyComponent): void;
    inertia: {
        router: InertiaRouter;
        Link: AnyComponent;
        Head: AnyComponent;
        usePage: <P = Record<string, unknown>>() => { props: P & Record<string, unknown>; url: string };
        useForm: <T extends Record<string, unknown>>(data: T) => {
            data: T;
            setData: (key: keyof T | T, value?: unknown) => void;
            errors: Partial<Record<string, string>>;
            processing: boolean;
            isDirty: boolean;
            post: (url: string, options?: Record<string, unknown>) => void;
            put: (url: string, options?: Record<string, unknown>) => void;
            patch: (url: string, options?: Record<string, unknown>) => void;
            delete: (url: string, options?: Record<string, unknown>) => void;
            reset: (...fields: string[]) => void;
            transform: (callback: (data: T) => Record<string, unknown>) => void;
        };
    };
    adminUrl(path?: string): string;
    useBreadcrumbs(crumbs: Array<{ label: string; href?: string }>): void;
    ui: Record<string, AnyComponent>;
    components: Record<string, AnyComponent>;
    fetchJson<T = unknown>(url: string, init?: RequestInit): Promise<T>;
    toast: { success(message: string): void; error(message: string): void };
}

declare global {
    interface Window {
        Sunrice: SunriceApi;
        SunriceCommerce: import('./lib/api').SunriceCommerceApi;
        SunriceCommerceQueue?: Array<(api: import('./lib/api').SunriceCommerceApi) => void> & { drained?: boolean };
    }
}
