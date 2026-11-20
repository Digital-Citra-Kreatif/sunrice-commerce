import { React, ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';
import { optionsOf } from '../lib/fields';
import { cn } from '../lib/cn';
import { XIcon } from '../components/Icons';

type AnyComponent = React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** What a typed value becomes: trimmed, in capitals when the field says so. */
export function choiceValue(text: string, uppercase: boolean): string {
    const value = text.trim();

    return uppercase ? value.toUpperCase() : value;
}

/** A list value, from an array or (saved before) a comma-separated string. */
export function choiceList(value: unknown): string[] {
    const list = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];

    return list.map((v) => String(v).trim()).filter((v) => v !== '');
}

/**
 * commerce_choices: several values from a searchable list (config.options),
 * each a chip that can be removed; a value the list doesn't have can be
 * added as typed (unless config.creatable is false).
 */
export default function ChoicesField({ field, value, onChange, errors, id, describedBy }: FieldProps<string[] | string | null>) {
    const { Button, Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Command, CommandEmpty, CommandInput, CommandItem, CommandList } = ui as unknown as Record<string, AnyComponent>;
    const config = field.config ?? {};
    const options = optionsOf(field as never);
    const creatable = config.creatable !== false;
    const uppercase = config.uppercase === true;
    const chosen = choiceList(value);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
    const typed = choiceValue(query, uppercase);
    const known = typed === '' || options.some((o) => o.value.toLowerCase() === typed.toLowerCase() || o.label.toLowerCase() === typed.toLowerCase());

    const toggle = (v: string) => onChange(chosen.includes(v) ? chosen.filter((c) => c !== v) : [...chosen, v]);
    const add = () => {
        if (typed !== '' && !chosen.includes(typed)) onChange([...chosen, typed]);
        setQuery('');
    };

    return (
        <div className="cm:grid cm:gap-2">
            <Popover open={open} onOpenChange={(next: boolean) => { setOpen(next); if (!next) setQuery(''); }}>
                {/* The box: chips (each with its own remove button) and the trigger filling the rest; the list opens under the whole box. */}
                <PopoverAnchor asChild>
                    <div className={cn('cm:flex cm:min-h-10 cm:w-full cm:flex-wrap cm:items-center cm:gap-1.5 cm:rounded-md cm:border cm:border-input/80 cm:bg-card cm:px-2 cm:py-1.5 cm:text-sm cm:shadow-xs',
                        'cm:focus-within:ring-2 cm:focus-within:ring-ring', errors?.[''] && 'cm:border-destructive')}>
                        {chosen.map((v) => (
                            <span key={v} className="cm:inline-flex cm:items-center cm:gap-1 cm:rounded cm:bg-muted cm:py-0.5 cm:pr-1 cm:pl-2 cm:text-xs cm:font-medium">
                                {labelOf(v)}
                                <button type="button" aria-label={`Remove ${labelOf(v)}`} className="cm:rounded cm:p-0.5 cm:hover:bg-background cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring"
                                    onClick={() => toggle(v)}>
                                    <XIcon className="cm:size-3" />
                                </button>
                            </span>
                        ))}
                        <PopoverTrigger asChild>
                            <button id={id} type="button" role="combobox" aria-expanded={open} aria-invalid={!!errors?.['']} aria-describedby={describedBy}
                                className="cm:flex cm:min-w-24 cm:flex-1 cm:items-center cm:justify-between cm:gap-2 cm:self-stretch cm:px-1 cm:text-left cm:focus-visible:outline-none">
                                <span className="cm:text-muted-foreground">{chosen.length === 0 ? String(config.placeholder ?? 'Choose…') : 'Add…'}</span>
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="cm:size-4 cm:shrink-0 cm:opacity-50" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5M7 9l5-5 5 5" /></svg>
                            </button>
                        </PopoverTrigger>
                    </div>
                </PopoverAnchor>
                <PopoverContent className="cm:w-(--radix-popover-trigger-width) cm:min-w-64 cm:p-0" align="start">
                    <Command>
                        <CommandInput placeholder={typeof config.input_placeholder === 'string' ? config.input_placeholder : creatable ? 'Search or add…' : 'Search…'} value={query} onValueChange={setQuery} />
                        <CommandList>
                            <CommandEmpty>{creatable && options.length === 0 ? 'Type to add.' : creatable && typed !== '' ? 'Not in the list.' : 'Nothing found.'}</CommandEmpty>
                            {creatable && !known && !chosen.includes(typed) && (
                                <CommandItem value={`__add ${typed}`} keywords={[query]} onSelect={add}>
                                    <span className="cm:truncate">Add “{typed}”</span>
                                </CommandItem>
                            )}
                            {[...options, ...chosen.filter((v) => !options.some((o) => o.value === v)).map((v) => ({ value: v, label: v }))].map((o) => (
                                <CommandItem key={o.value} value={`${o.label} ${o.value}`} onSelect={() => { toggle(o.value); setQuery(''); }}>
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn('cm:size-4', chosen.includes(o.value) ? 'cm:opacity-100' : 'cm:opacity-0')} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                    <span className="cm:truncate">{o.label}</span>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {chosen.length > 1 && (
                <div><Button type="button" variant="ghost" size="sm" className="cm:h-7 cm:px-2 cm:text-xs" onClick={() => onChange([])}>Clear all</Button></div>
            )}
        </div>
    );
}
