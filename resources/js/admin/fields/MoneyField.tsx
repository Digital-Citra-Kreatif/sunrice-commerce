import { MoneyInput } from '../components/MoneyInput';
import { useCommerceShared } from '../lib/store';
import type { FieldProps } from '../sunrice';

/** commerce_money: an amount in minor units. */
export default function MoneyField({ field, value, onChange, errors, id }: FieldProps<number | null>) {
    useCommerceShared();

    return (
        <MoneyInput
            id={id}
            value={value}
            onChange={onChange}
            allowNull={field.config?.allow_null !== false}
            invalid={!!(errors?.[''])}
        />
    );
}
