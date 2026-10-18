import { React, ui } from '../lib/sunrice';
import { formatMoney, parseMoney } from '../lib/money';

/**
 * An amount in minor units, typed as the store writes it ("150.000");
 * shown formatted, without the symbol, when not focused.
 */
export function MoneyInput({
    value,
    onChange,
    id,
    placeholder,
    allowNull = true,
    invalid,
}: {
    value: number | null | undefined;
    onChange: (value: number | null) => void;
    id?: string;
    placeholder?: string;
    allowNull?: boolean;
    invalid?: boolean;
}) {
    const { Input } = ui;
    const display = (v: number | null | undefined) => (v === null || v === undefined ? '' : formatMoney(v).replace(/^[^\d-]+|[^\d]+$/g, ''));
    const [text, setText] = React.useState(display(value));
    const [focused, setFocused] = React.useState(false);

    React.useEffect(() => {
        if (!focused) setText(display(value));
    }, [value, focused]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Input
            id={id}
            inputMode="decimal"
            value={text}
            placeholder={placeholder}
            aria-invalid={invalid || undefined}
            onFocus={() => setFocused(true)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setText(e.target.value);
                const parsed = e.target.value.trim() === '' ? (allowNull ? null : 0) : parseMoney(e.target.value);
                if (parsed !== null || e.target.value.trim() === '') onChange(parsed);
            }}
            onBlur={() => {
                setFocused(false);
                setText(display(value));
            }}
        />
    );
}
