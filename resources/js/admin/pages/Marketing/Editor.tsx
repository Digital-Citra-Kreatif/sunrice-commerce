import { adminUrl, components, fetchJson, inertia, React, Sunrice, toast, ui } from '../../lib/sunrice';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { useCommerceShared } from '../../lib/store';
import { audienceComplete, defaultValue, groupRules, insertTag, unknownTags, type AudienceValue, type RuleDef } from '../../lib/marketing';
import TargetsField from '../../fields/TargetsField';

type Content = Record<string, { subject: string; preheader: string; body: string; button_label: string; button_url: string }>;

interface TriggerDef {
    key: string;
    label: string;
    description: string;
    delay: { unit: 'hours' | 'days'; label: string; default: number };
    content: Content;
}

interface Template {
    key: string;
    label: string;
    description: string;
    audience: AudienceValue;
    content: Content;
}

interface Props {
    campaign: {
        id: number | null; type: 'campaign' | 'automation'; name: string; status: string; trigger: string | null; delay: number | null;
        voucher_code: string; audience: AudienceValue; content: Content; scheduled_at: string | null; sent_count: number;
    };
    locales: Array<{ code: string; name: string }>;
    mainLocale: string;
    rules: Record<string, RuleDef>;
    tags: Record<string, string>;
    triggers: TriggerDef[];
    templates: Template[];
    reachable: number;
    bodyFields: Array<Record<string, unknown>>;
    currency: string;
}

type TextPart = 'subject' | 'preheader' | 'button_label' | 'button_url';

const statusTone: Record<string, string> = { active: 'ok', paused: 'warning', scheduled: 'info', draft: 'neutral' };

/** Commerce/Marketing/Editor: a campaign or automation, its audience, its email in each language, a preview. */
export default function Editor({ campaign, locales, mainLocale, rules, tags, triggers, templates, reachable, bodyFields, currency }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Switch, Tabs, TabsList, TabsTrigger, TabsContent,
        Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } = ui;
    const { FieldRenderer, InputError } = components;
    const { router } = inertia;
    const automation = campaign.type === 'automation';
    const listPath = automation ? 'commerce/marketing/automations' : 'commerce/marketing/campaigns';
    useCommerceShared();
    Sunrice.useBreadcrumbs([
        { label: 'Shop', href: adminUrl('commerce') },
        { label: 'Marketing', href: adminUrl('commerce/marketing') },
        { label: automation ? 'Automations' : 'Campaigns', href: adminUrl(listPath) },
        { label: campaign.id ? campaign.name : 'New' },
    ]);

    const form = inertia.useForm({
        name: campaign.name,
        trigger: campaign.trigger ?? '',
        delay: campaign.delay ?? '',
        voucher_code: campaign.voucher_code,
        audience: campaign.audience,
        content: campaign.content,
    });
    const { data, setData, errors, processing, isDirty } = form;
    const [locale, setLocale] = React.useState(mainLocale);
    const [count, setCount] = React.useState<{ count: number; sample: Array<{ name: string | null; email: string }> } | null>(null);
    const [counting, setCounting] = React.useState(false);
    const [preview, setPreview] = React.useState<{ subject: string; html: string; to: string } | null>(null);
    const [previewing, setPreviewing] = React.useState(false);
    // One object URL per preview, released when it is replaced.
    const previewUrl = React.useMemo(() => (preview ? URL.createObjectURL(new Blob([preview.html], { type: 'text/html' })) : null), [preview]);
    React.useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
    const [sendOpen, setSendOpen] = React.useState(false);
    const [sendAt, setSendAt] = React.useState('');
    const lastText = React.useRef<{ part: TextPart; el: HTMLInputElement } | null>(null);
    const trigger = triggers.find((t) => t.key === data.trigger);
    const canSend = campaign.id !== null && !isDirty;

    // The live count, once every rule has its value.
    const audienceKey = JSON.stringify(data.audience);
    React.useEffect(() => {
        if (!audienceComplete(data.audience, rules)) return;
        setCounting(true);
        const timer = setTimeout(() => {
            fetchJson<{ count: number; sample: Array<{ name: string | null; email: string }> }>(adminUrl('commerce/marketing/audience'), {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audience: data.audience }),
            }).then(setCount).catch(() => setCount(null)).finally(() => setCounting(false));
        }, 400);

        return () => clearTimeout(timer);
    }, [audienceKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const setAudience = (audience: AudienceValue) => setData('audience', audience);
    const setRule = (i: number, patch: { rule?: string; value?: unknown }) => setAudience({
        ...data.audience,
        rules: data.audience.rules.map((r, j) => (j === i ? (patch.rule !== undefined ? { rule: patch.rule, value: defaultValue(rules[patch.rule]) } : { ...r, ...patch }) : r)),
    });
    const setPart = (part: keyof Content[string], value: string) => setData('content', { ...data.content, [locale]: { ...data.content[locale], [part]: value } });

    const insertSmartTag = (tag: string) => {
        const target = lastText.current;
        if (target && document.body.contains(target.el)) {
            const { text, cursor } = insertTag(target.el.value, tag, target.el.selectionStart, target.el.selectionEnd);
            setPart(target.part, text);
            requestAnimationFrame(() => { target.el.focus(); target.el.setSelectionRange(cursor, cursor); });

            return;
        }
        navigator.clipboard?.writeText(`{${tag}}`).then(() => toast.success(`Copied {${tag}}. Paste it into the text.`), () => toast.error(`Type {${tag}} into the text.`));
    };

    const save = () => {
        const options = { preserveScroll: true, onError: () => toast.error('Check the highlighted fields.') };
        if (campaign.id) {
            form.put(adminUrl(`commerce/marketing/${campaign.id}`), options);
        } else {
            form.post(adminUrl(automation ? 'commerce/marketing/automations' : 'commerce/marketing/campaigns'), options);
        }
    };

    const draftPayload = () => ({ content: data.content, audience: data.audience, voucher_code: data.voucher_code, locale });
    const loadPreview = () => {
        setPreviewing(true);
        fetchJson<{ subject: string; html: string; to: string }>(adminUrl('commerce/marketing/preview'), {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draftPayload()),
        }).then(setPreview).catch(() => toast.error('The preview couldn\'t be made.')).finally(() => setPreviewing(false));
    };
    const sendTest = () => router.post(adminUrl('commerce/marketing/test'), draftPayload(), { preserveScroll: true });

    const applyTemplate = (key: string) => {
        const template = templates.find((t) => t.key === key);
        if (!template) return;
        if (isDirty && !window.confirm('Replace the audience and texts with this template?')) return;
        setData({ ...data, audience: template.audience, content: { ...data.content, ...template.content }, name: data.name || template.label });
    };

    const changeTrigger = (key: string) => {
        const next = triggers.find((t) => t.key === key);
        if (!next) return;
        const keepTexts = isDirty && !window.confirm(`Start from the "${next.label}" texts?`);
        setData({ ...data, trigger: key, delay: next.delay.default, content: keepTexts ? data.content : { ...data.content, ...next.content } });
    };

    const content = data.content[locale] ?? { subject: '', preheader: '', body: '', button_label: '', button_url: '' };
    const allText = Object.values(data.content).map((c) => `${c.subject} ${c.preheader} ${c.body} ${c.button_label} ${c.button_url}`).join(' ');
    const typos = unknownTags(allText, Object.keys(tags));
    const err = (key: string) => errors[key];
    const textInput = (part: TextPart, label: string, placeholder?: string, hint?: string) => {
        const key = `content.${locale}.${part}`;

        return (
            <div className="cm:grid cm:gap-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} value={content[part]} placeholder={placeholder} aria-invalid={err(key) ? true : undefined}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => { lastText.current = { part, el: e.target }; }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPart(part, e.target.value)} />
                {hint && <p className="cm:text-xs cm:text-muted-foreground">{hint}</p>}
                <InputError message={err(key)} />
            </div>
        );
    };

    return (
        <div className="cm:mx-auto cm:grid cm:w-full cm:max-w-6xl cm:gap-6 cm:p-4 cm:md:p-6">
            <PageHeader
                title={campaign.id ? campaign.name : automation ? 'New automation' : 'New campaign'}
                description={automation
                    ? 'Sent by itself to each customer the trigger finds, while it is on.'
                    : 'Sent once, to the customers who match the audience and accept marketing.'}
                actions={<>
                    {campaign.id && <StatusBadge tone={statusTone[campaign.status] ?? 'neutral'}>{campaign.status}</StatusBadge>}
                    {campaign.id && automation && (
                        <label className="cm:flex cm:items-center cm:gap-2 cm:text-sm">
                            <Switch checked={campaign.status === 'active'} disabled={isDirty} aria-label="Automation on"
                                onCheckedChange={(on: boolean) => router.post(adminUrl(`commerce/marketing/${campaign.id}/status`), { active: on }, { preserveScroll: true })} />
                            {campaign.status === 'active' ? 'On' : 'Off'}
                        </label>
                    )}
                    {campaign.id && campaign.sent_count > 0 && <Button variant="outline" asChild><inertia.Link href={adminUrl(`commerce/marketing/${campaign.id}`)}>Results</inertia.Link></Button>}
                    <Button variant="outline" onClick={sendTest}>Send me a test</Button>
                    <Button onClick={save} disabled={processing}>{processing ? 'Saving…' : 'Save'}</Button>
                    {!automation && (
                        <Button variant="default" disabled={!canSend} title={canSend ? undefined : 'Save first'} onClick={() => setSendOpen(true)}>Send…</Button>
                    )}
                </>}
            />

            {campaign.status === 'scheduled' && campaign.scheduled_at && (
                <div role="status" className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:rounded-md cm:border cm:border-sky-500/30 cm:bg-sky-500/5 cm:px-4 cm:py-3 cm:text-sm">
                    <span>Scheduled for {new Date(campaign.scheduled_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}. Changes you save go out with it.</span>
                    <Button size="sm" variant="outline" onClick={() => router.post(adminUrl(`commerce/marketing/${campaign.id}/unschedule`), {}, { preserveScroll: true })}>Back to draft</Button>
                </div>
            )}
            {errors.campaign && <div role="alert" className="cm:rounded-md cm:border cm:border-destructive/40 cm:bg-destructive/5 cm:px-4 cm:py-3 cm:text-sm cm:text-destructive">{errors.campaign}</div>}

            <div className="cm:grid cm:gap-6 cm:lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="cm:grid cm:content-start cm:gap-6">
                    {templates.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Start from</CardTitle>
                                <CardDescription>A template fills in the audience and the texts. You can change everything.</CardDescription>
                            </CardHeader>
                            <CardContent className="cm:grid cm:gap-2 cm:sm:grid-cols-2">
                                {templates.map((t) => (
                                    <button key={t.key} type="button" onClick={() => applyTemplate(t.key)}
                                        className="cm:rounded-md cm:border cm:p-3 cm:text-left cm:transition-colors cm:hover:bg-muted">
                                        <span className="cm:block cm:text-sm cm:font-medium">{t.label}</span>
                                        <span className="cm:block cm:text-xs cm:text-muted-foreground">{t.description}</span>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="cm:grid cm:gap-4">
                            <div className="cm:grid cm:gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} placeholder={automation ? 'Abandoned cart reminder' : 'May newsletter'}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)} />
                                <p className="cm:text-xs cm:text-muted-foreground">Only staff see it.</p>
                                <InputError message={err('name')} />
                            </div>
                            {automation && (
                                <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2">
                                    <div className="cm:grid cm:gap-1.5">
                                        <Label htmlFor="trigger">When</Label>
                                        <Select value={data.trigger} onValueChange={changeTrigger}>
                                            <SelectTrigger id="trigger"><SelectValue placeholder="Choose a trigger" /></SelectTrigger>
                                            <SelectContent>{triggers.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                        {trigger && <p className="cm:text-xs cm:text-muted-foreground">{trigger.description}</p>}
                                        <InputError message={err('trigger')} />
                                    </div>
                                    <div className="cm:grid cm:gap-1.5">
                                        <Label htmlFor="delay">{trigger?.delay.label ?? 'Delay'}</Label>
                                        <Input id="delay" type="number" min={0} value={data.delay} className="cm:max-w-32"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('delay', e.target.value)} />
                                        <InputError message={err('delay')} />
                                    </div>
                                </div>
                            )}
                            <div className="cm:grid cm:gap-1.5">
                                <Label htmlFor="voucher_code">Voucher code (optional)</Label>
                                <Input id="voucher_code" value={data.voucher_code} className="cm:max-w-60" placeholder="WELCOME10"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('voucher_code', e.target.value)} />
                                <p className="cm:text-xs cm:text-muted-foreground">Shown where the text has {'{voucher_code}'}. Create the voucher in Shop → Vouchers.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Audience</CardTitle>
                            <CardDescription>
                                {automation
                                    ? 'Optional: only customers who also match these rules get it.'
                                    : `Customers who accept marketing (${reachable.toLocaleString()}), narrowed by these rules.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="cm:grid cm:gap-3">
                            {data.audience.rules.length > 1 && (
                                <div className="cm:flex cm:items-center cm:gap-2 cm:text-sm">
                                    Match
                                    <Select value={data.audience.match} onValueChange={(v: 'all' | 'any') => setAudience({ ...data.audience, match: v })}>
                                        <SelectTrigger className="cm:w-28" aria-label="Match"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="all">all rules</SelectItem><SelectItem value="any">any rule</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            )}
                            {data.audience.rules.length === 0 && (
                                <p className="cm:text-sm cm:text-muted-foreground">{automation ? 'No extra rules: everyone the trigger finds.' : 'No rules: everyone who accepts marketing.'}</p>
                            )}
                            {data.audience.rules.map((r, i) => {
                                const def = rules[r.rule];

                                return (
                                    <div key={i} className="cm:grid cm:gap-2 cm:rounded-md cm:border cm:p-3 cm:sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] cm:sm:items-start">
                                        <Select value={r.rule} onValueChange={(v: string) => setRule(i, { rule: v })}>
                                            <SelectTrigger aria-label="Rule"><SelectValue placeholder="Choose a rule" /></SelectTrigger>
                                            <SelectContent>
                                                {groupRules(rules).map(([group, items]) => (
                                                    <React.Fragment key={group}>
                                                        <div className="cm:px-2 cm:pt-2 cm:pb-1 cm:text-xs cm:font-medium cm:text-muted-foreground">{group}</div>
                                                        {items.map(([key, d]) => <SelectItem key={key} value={key}>{d.label}</SelectItem>)}
                                                    </React.Fragment>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="cm:grid cm:gap-1">
                                            <RuleValue def={def} value={r.value} currency={currency} path={`audience.rules.${i}.value`} onChange={(value) => setRule(i, { value })} />
                                            <InputError message={err(`audience.rules.${i}.value`) ?? err(`audience.rules.${i}.rule`)} />
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" aria-label="Remove rule"
                                            onClick={() => setAudience({ ...data.audience, rules: data.audience.rules.filter((_, j) => j !== i) })}>Remove</Button>
                                    </div>
                                );
                            })}
                            <div className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-3">
                                <Button type="button" variant="outline" size="sm"
                                    onClick={() => setAudience({ ...data.audience, rules: [...data.audience.rules, { rule: 'no_order_for_days', value: defaultValue(rules.no_order_for_days) }] })}>
                                    Add rule
                                </Button>
                                <p className="cm:text-sm" aria-live="polite">
                                    {automation && data.audience.rules.length === 0 ? null : !audienceComplete(data.audience, rules)
                                        ? <span className="cm:text-muted-foreground">Fill in the rules to see who matches.</span>
                                        : counting || count === null
                                            ? <span className="cm:text-muted-foreground">Counting…</span>
                                            : <><strong>{count.count.toLocaleString()}</strong> {count.count === 1 ? 'customer matches' : 'customers match'}{automation ? ' these rules now' : ''}</>}
                                </p>
                            </div>
                            {count && count.sample.length > 0 && audienceComplete(data.audience, rules) && !(automation && data.audience.rules.length === 0) && (
                                <p className="cm:text-xs cm:text-muted-foreground">For example: {count.sample.map((s) => s.name || s.email).join(', ')}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Email</CardTitle>
                            <CardDescription>Each customer gets it in their language; empty parts use {locales.find((l) => l.code === mainLocale)?.name ?? mainLocale}.</CardDescription>
                        </CardHeader>
                        <CardContent className="cm:grid cm:gap-4">
                            <Tabs value={locale} onValueChange={setLocale}>
                                {locales.length > 1 && (
                                    <TabsList>{locales.map((l) => <TabsTrigger key={l.code} value={l.code}>{l.name}{l.code === mainLocale ? ' (main)' : ''}</TabsTrigger>)}</TabsList>
                                )}
                                {locales.map((l) => (
                                    <TabsContent key={l.code} value={l.code} className="cm:grid cm:gap-4 cm:pt-2">
                                        {l.code === locale && <>
                                            {textInput('subject', 'Subject', 'Hi {first_name|there}, something new for you')}
                                            {textInput('preheader', 'Preview text', 'Shown after the subject in the inbox', 'Optional. Most inboxes show it next to the subject.')}
                                            <div className="cm:grid cm:gap-1.5">
                                                <FieldRenderer fields={bodyFields} values={{ body: content.body }} errors={errors} pathPrefix={`content.${locale}`}
                                                    onChange={(values: Record<string, unknown>) => setPart('body', String(values.body ?? ''))} />
                                            </div>
                                            <div className="cm:grid cm:gap-4 cm:sm:grid-cols-2">
                                                {textInput('button_label', 'Button text', 'Shop now', 'Optional. Leave empty for no button.')}
                                                {textInput('button_url', 'Button link', '{store_url}', 'https://…, /a-page, or a smart tag like {cart_url}.')}
                                            </div>
                                        </>}
                                    </TabsContent>
                                ))}
                            </Tabs>
                            {typos.length > 0 && (
                                <p role="alert" className="cm:text-sm cm:text-amber-700 cm:dark:text-amber-400">
                                    Unknown smart {typos.length === 1 ? 'tag' : 'tags'}: {typos.map((t) => `{${t}}`).join(', ')}. They will be sent as typed.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="cm:grid cm:content-start cm:gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Smart tags</CardTitle>
                            <CardDescription>Replaced for each customer. Click one to put it in the subject, preview text or button you were editing (or to copy it for the text). Add a fallback after a bar: {'{first_name|there}'}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="cm:grid cm:gap-1">
                                {Object.entries(tags).map(([tag, description]) => (
                                    <li key={tag}>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertSmartTag(tag)}
                                            className="cm:flex cm:w-full cm:items-baseline cm:justify-between cm:gap-2 cm:rounded cm:px-2 cm:py-1 cm:text-left cm:hover:bg-muted">
                                            <code className="cm:text-xs">{`{${tag}}`}</code>
                                            <span className="cm:text-xs cm:text-muted-foreground">{description}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>With the first matching customer{preview ? ` (${preview.to})` : ''}, in the language you are editing.</CardDescription>
                        </CardHeader>
                        <CardContent className="cm:grid cm:gap-3">
                            <Button type="button" variant="outline" onClick={loadPreview} disabled={previewing}>{previewing ? 'Rendering…' : preview ? 'Refresh preview' : 'Show preview'}</Button>
                            {preview && <>
                                <p className="cm:text-sm"><span className="cm:text-muted-foreground">Subject:</span> {preview.subject}</p>
                                <a className="cm:text-xs cm:underline cm:text-muted-foreground" target="_blank" rel="noreferrer"
                                    href={previewUrl ?? undefined}>Open full size</a>
                                <iframe title="Email preview" srcDoc={preview.html} sandbox="" className="cm:h-[32rem] cm:w-full cm:rounded-md cm:border cm:bg-white" />
                            </>}
                        </CardContent>
                    </Card>

                    {campaign.id && (
                        <div className="cm:flex cm:flex-wrap cm:gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => router.post(adminUrl(`commerce/marketing/${campaign.id}/duplicate`))}>Duplicate</Button>
                            <Button type="button" variant="ghost" size="sm" className="cm:text-destructive"
                                onClick={() => window.confirm(`Delete "${campaign.name}"? Its results go too.`) && router.delete(adminUrl(`commerce/marketing/${campaign.id}`))}>Delete</Button>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={sendOpen} onOpenChange={setSendOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send "{campaign.name}"</DialogTitle>
                        <DialogDescription>
                            {count ? `${count.count.toLocaleString()} ${count.count === 1 ? 'customer' : 'customers'} match now.` : ''} The audience is counted again when sending starts; each customer gets it once.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="cm:grid cm:gap-1.5">
                        <Label htmlFor="send_at">Send at (optional)</Label>
                        <Input id="send_at" type="datetime-local" value={sendAt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendAt(e.target.value)} />
                        <p className="cm:text-xs cm:text-muted-foreground">Empty: now. Emails go out in the background, in batches.</p>
                        <InputError message={err('at')} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSendOpen(false)}>Not yet</Button>
                        <Button onClick={() => router.post(adminUrl(`commerce/marketing/${campaign.id}/send`), sendAt ? { at: new Date(sendAt).toISOString() } : {}, {
                            preserveScroll: true, onSuccess: () => setSendOpen(false),
                        })}>{sendAt ? 'Schedule' : 'Send now'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/** The value control of one audience rule, by its input. */
function RuleValue({ def, value, currency, path, onChange }: { def: RuleDef | undefined; value: unknown; currency: string; path: string; onChange: (value: unknown) => void }) {
    const { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = ui;
    if (!def || def.input === 'none') return <span className="cm:self-center cm:text-sm cm:text-muted-foreground">—</span>;
    if (def.input === 'select') {
        return (
            <Select value={String(value ?? '')} onValueChange={onChange}>
                <SelectTrigger aria-label={def.label}><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>{(def.options ?? []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
        );
    }
    if (def.input === 'products' || def.input === 'categories') {
        const field = { handle: path, type: 'commerce_targets', config: { api: adminUrl('commerce/api/targets'), types: def.input === 'products' ? ['product'] : ['term'] } };
        const targets = (Array.isArray(value) ? value : []).map((v: { id: number; label: string }) => ({ ...v, type: def.input === 'products' ? 'product' as const : 'term' as const }));

        return <TargetsField field={field} value={targets} pathPrefix={path} onChange={(list) => onChange((list ?? []).map((t) => ({ id: t.id, label: t.label })))} />;
    }
    const numeric = def.input === 'days' || def.input === 'number' || def.input === 'money';

    return (
        <div className="cm:flex cm:items-center cm:gap-2">
            {def.input === 'money' && <span className="cm:text-sm cm:text-muted-foreground">{currency}</span>}
            <Input aria-label={def.label} type={numeric ? 'number' : 'text'} min={numeric ? 0 : undefined} value={String(value ?? '')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(numeric && e.target.value !== '' ? Number(e.target.value) : e.target.value)} />
            {def.input === 'days' && <span className="cm:text-sm cm:text-muted-foreground">days</span>}
        </div>
    );
}
