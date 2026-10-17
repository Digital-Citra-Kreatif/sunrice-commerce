import { Sunrice } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';
import type * as ReactTypes from 'react';

type Field = ReactTypes.ComponentType<FieldProps<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Field type → admin control; filled by each area. */
const fields: Record<string, Field> = {};

export function defineField(type: string, component: Field): void {
    fields[type] = component;
}

export function registerFields(): void {
    Object.entries(fields).forEach(([type, component]) => Sunrice.registerField(type, component));
}
