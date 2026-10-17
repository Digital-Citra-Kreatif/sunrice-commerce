import { Sunrice } from '../lib/sunrice';
import type * as ReactTypes from 'react';
import Dashboard from './Dashboard';
import SettingsFeatures from './Settings/Features';
import SettingsSection from './Settings/Section';
import SharedSchemaForm from './Shared/SchemaForm';

type Page = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Inertia page name (Commerce/…) → component; filled by each area. */
const pages: Record<string, Page> = {
    'Commerce/Dashboard': Dashboard,
    'Commerce/Settings/Section': SettingsSection,
    'Commerce/Settings/Features': SettingsFeatures,
    'Commerce/Shared/SchemaForm': SharedSchemaForm,
};

export function definePage(name: string, component: Page): void {
    pages[name] = component;
}

export function registerPages(): void {
    Object.entries(pages).forEach(([name, component]) => Sunrice.registerPage(name, component));
}
