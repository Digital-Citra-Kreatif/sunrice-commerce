import { Sunrice } from '../lib/sunrice';
import type * as ReactTypes from 'react';
import CustomerShow from './Customers/Show';
import Dashboard from './Dashboard';
import InventoryIndex from './Inventory/Index';
import OrderEditor from './Orders/Editor';
import OrderShow from './Orders/Show';
import ProductsIndex from './Products/Index';
import SettingsFeatures from './Settings/Features';
import SettingsSection from './Settings/Section';
import SettingsShipping from './Settings/Shipping';
import SharedSchemaForm from './Shared/SchemaForm';
import SharedResourceIndex from './Shared/ResourceIndex';

type Page = ReactTypes.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Inertia page name (Commerce/…) → component; filled by each area. */
const pages: Record<string, Page> = {
    'Commerce/Customers/Show': CustomerShow,
    'Commerce/Dashboard': Dashboard,
    'Commerce/Inventory/Index': InventoryIndex,
    'Commerce/Orders/Editor': OrderEditor,
    'Commerce/Orders/Show': OrderShow,
    'Commerce/Products/Index': ProductsIndex,
    'Commerce/Settings/Section': SettingsSection,
    'Commerce/Settings/Features': SettingsFeatures,
    'Commerce/Settings/Shipping': SettingsShipping,
    'Commerce/Shared/SchemaForm': SharedSchemaForm,
    'Commerce/Shared/ResourceIndex': SharedResourceIndex,
};

export function definePage(name: string, component: Page): void {
    pages[name] = component;
}

export function registerPages(): void {
    Object.entries(pages).forEach(([name, component]) => Sunrice.registerPage(name, component));
}
