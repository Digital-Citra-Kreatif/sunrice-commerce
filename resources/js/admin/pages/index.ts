import { Sunrice } from '../lib/sunrice';
import type * as ReactTypes from 'react';

type Page = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Inertia page name (Commerce/…) → component; filled by each area. */
const pages: Record<string, Page> = {};

export function definePage(name: string, component: Page): void {
    pages[name] = component;
}

export function registerPages(): void {
    Object.entries(pages).forEach(([name, component]) => Sunrice.registerPage(name, component));
}
