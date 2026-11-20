import { React, ui } from '../lib/sunrice';
import { cn } from '../lib/cn';

type AnyComponent = React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Token = { value: string; label: string };

/** The text with `token` put where the selection was (replacing it), and where the caret goes after it. */
export function insertToken(text: string, token: string, start: number, end: number): { text: string; caret: number } {
    const before = text.slice(0, start);
    const after = text.slice(end);
    // A space keeps it apart from a word right before or after it.
    const lead = before !== '' && !/\s$/.test(before) ? ' ' : '';
    const trail = after !== '' && !/^[\s.,!?;:)]/.test(after) ? ' ' : '';
    const inserted = `${lead}${token}${trail}`;

    return { text: before + inserted + after, caret: before.length + inserted.length };
}

/**
 * A text or textarea whose placeholders (config.tokens: [{value: ':number', label}])
 * are chips under it: a click puts one where the caret is; the ones the
 * text already uses are marked.
 */
export function TokenText({ id, value, onChange, tokens, multiline, invalid, describedBy, maxLength }: {
    id: string; value: string; onChange: (value: string) => void; tokens: Token[]; multiline: boolean; invalid: boolean; describedBy?: string; maxLength?: number;
}) {
    const { Input, Textarea } = ui as unknown as Record<string, AnyComponent>;
    const ref = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
    const insert = (token: string) => {
        const el = ref.current;
        const start = el?.selectionStart ?? value.length;
        const end = el?.selectionEnd ?? value.length;
        const next = insertToken(value, token, start, end);
        onChange(next.text);
        requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(next.caret, next.caret); });
    };
    const Field = multiline ? Textarea : Input;

    return (
        <div className="cm:grid cm:gap-2">
            <Field ref={ref} id={id} value={value} rows={multiline ? 4 : undefined} maxLength={maxLength} aria-invalid={invalid} aria-describedby={describedBy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
            <div role="group" aria-label="Insert a placeholder" className="cm:flex cm:flex-wrap cm:items-center cm:gap-1.5">
                <span className="cm:text-xs cm:text-muted-foreground">Insert:</span>
                {tokens.map((t) => {
                    const used = value.includes(t.value);
                    return (
                        <button key={t.value} type="button" title={t.value} aria-pressed={used}
                            // Keeps the caret where it is in the text.
                            onMouseDown={(e) => e.preventDefault()} onClick={() => insert(t.value)}
                            className={cn('cm:inline-flex cm:items-center cm:gap-1 cm:rounded-full cm:border cm:px-2.5 cm:py-0.5 cm:text-xs cm:transition-colors cm:focus-visible:outline-none cm:focus-visible:ring-2 cm:focus-visible:ring-ring',
                                used ? 'cm:border-foreground/20 cm:bg-muted cm:font-medium' : 'cm:border-dashed cm:text-muted-foreground cm:hover:bg-muted cm:hover:text-foreground')}>
                            {used && <svg aria-hidden="true" viewBox="0 0 24 24" className="cm:size-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
