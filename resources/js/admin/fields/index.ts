import { Sunrice } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';
import type * as ReactTypes from 'react';
import DateTimeRangeField from './DateTimeRangeField';
import MoneyField from './MoneyField';
import RegionField from './RegionField';
import TargetsField from './TargetsField';
import ProductEditor from './product/ProductEditor';

type Field = ReactTypes.ComponentType<FieldProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Field type → admin control; filled by each area. */
const fields: Record<string, Field> = {
    commerce_money: MoneyField,
    commerce_datetime_range: DateTimeRangeField,
    commerce_region: RegionField,
    commerce_targets: TargetsField,
    commerce_product: ProductEditor,
};

export function defineField(type: string, component: Field): void {
    fields[type] = component;
}

export function registerFields(): void {
    Object.entries(fields).forEach(([type, component]) => Sunrice.registerField(type, component));
}
