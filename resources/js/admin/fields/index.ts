import type { FieldProps } from '../sunrice';
import type * as ReactTypes from 'react';
import DateTimeRangeField from './DateTimeRangeField';
import MoneyField from './MoneyField';
import RegionField from './RegionField';
import TargetsField from './TargetsField';
import { React } from '../lib/sunrice';

// The product editor is large: its own chunk, loaded when an editor first shows it.
const LazyProductEditor = React.lazy(() => import('./product/ProductEditor'));
const ProductEditor = (props: FieldProps<any>) => React.createElement(React.Suspense, { fallback: null }, React.createElement(LazyProductEditor, props)); // eslint-disable-line @typescript-eslint/no-explicit-any

type Field = ReactTypes.ComponentType<FieldProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Field type → admin control; filled by each area. */
const fields: Record<string, Field> = {
    commerce_money: MoneyField,
    commerce_datetime_range: DateTimeRangeField,
    commerce_region: RegionField,
    commerce_targets: TargetsField,
    commerce_product: ProductEditor,
};

/**
 * Commerce's field types' inputs in the CMS's editors (entries, terms,
 * globals): the bundle loads on the CMS's pages too (PluginBundle::extends('Cms/')).
 */
export function registerFields(): void {
    // Queued until the CMS's bundle runs (a Commerce/ page may load this bundle first).
    (window.SunriceCmsQueue ??= []).push((cms) => Object.entries(fields).forEach(([type, component]) => cms.registerFieldInput(type, component)));
}
