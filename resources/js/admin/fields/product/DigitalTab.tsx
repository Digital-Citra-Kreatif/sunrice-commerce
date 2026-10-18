import { adminUrl, React, toast, ui } from '../../lib/sunrice';
import { newId } from '../../lib/variants';
import { NumberInput, Row, Section, TextInput, Toggle } from './controls';
import type { Download, TabProps } from './types';

function csrf(): string {
    return decodeURIComponent(document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
}

/** Files and links customers get after paying, and how they are delivered. */
export function DigitalTab({ value, update, path }: TabProps) {
    const { Button } = ui;
    const [uploading, setUploading] = React.useState(false);
    const input = React.useRef<HTMLInputElement>(null);
    const delivery = value.delivery ?? { modes: ['link', 'account'], download_limit: null, expiry_days: null };
    const setDelivery = (patch: Partial<typeof delivery>) => update({ delivery: { ...delivery, ...patch } });
    const setDownload = (i: number, patch: Partial<Download>) => update({ downloads: value.downloads.map((d, j) => (j === i ? { ...d, ...patch } : d)) });

    const upload = async (files: FileList | null) => {
        if (!files?.length) return;
        setUploading(true);
        try {
            const added: Download[] = [];
            for (const file of Array.from(files)) {
                const body = new FormData();
                body.append('file', file);
                const response = await fetch(adminUrl('commerce/api/downloads'), { method: 'POST', body, headers: { 'X-XSRF-TOKEN': csrf(), Accept: 'application/json' }, credentials: 'same-origin' });
                const json = await response.json();
                if (!response.ok) throw new Error(json.message ?? 'Upload failed');
                added.push({ id: newId(), type: 'file', file_id: json.data.id, url: null, name: file.name.replace(/\.[^.]+$/, ''), file: json.data });
            }
            update({ downloads: [...value.downloads, ...added] });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setUploading(false);
            if (input.current) input.current.value = '';
        }
    };

    return (
        <div className="cm:grid cm:gap-6">
            <Section title="Files and links" description="Files are stored privately and only served to customers who bought them."
                actions={<div className="cm:flex cm:gap-2">
                    <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => input.current?.click()}>{uploading ? 'Uploading…' : 'Upload file'}</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => update({ downloads: [...value.downloads, { id: newId(), type: 'url', file_id: null, url: null, name: '' }] })}>Add link</Button>
                    <input ref={input} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
                </div>}>
                {value.downloads.length === 0 && <p className="cm:text-sm cm:text-muted-foreground">No files yet.</p>}
                {value.downloads.map((d, i) => (
                    <div key={d.id ?? i} className="cm:grid cm:items-end cm:gap-3 cm:sm:grid-cols-[1fr_2fr_auto]">
                        <Row label="Name" htmlFor={`${path}-dl-${i}`}><TextInput id={`${path}-dl-${i}`} value={d.name} onChange={(name) => setDownload(i, { name: name ?? '' })} /></Row>
                        {d.type === 'url'
                            ? <Row label="Link" htmlFor={`${path}-dl-${i}-url`}><TextInput id={`${path}-dl-${i}-url`} value={d.url} placeholder="https://" onChange={(url) => setDownload(i, { url })} /></Row>
                            : <Row label="File"><p className="cm:truncate cm:text-sm cm:text-muted-foreground">{d.file?.filename ?? `File #${d.file_id}`}</p></Row>}
                        <Button type="button" variant="ghost" size="sm" onClick={() => update({ downloads: value.downloads.filter((_, j) => j !== i) })}>Remove</Button>
                    </div>
                ))}
            </Section>
            <Section title="Delivery">
                <div className="cm:grid cm:gap-3 cm:sm:grid-cols-3">
                    {([['attachment', 'Attach files to the email'], ['link', 'Download links in the email'], ['account', 'Library in My Account']] as const).map(([mode, label]) => (
                        <Toggle key={mode} id={`${path}-mode-${mode}`} label={label} checked={delivery.modes.includes(mode)}
                            onChange={(on) => setDelivery({ modes: on ? [...delivery.modes, mode] : delivery.modes.filter((m) => m !== mode) })} />
                    ))}
                </div>
                <div className="cm:grid cm:gap-3 cm:sm:grid-cols-2">
                    <Row label="Downloads per file" htmlFor={`${path}-limit`} hint="Empty: unlimited."><NumberInput id={`${path}-limit`} min={1} value={delivery.download_limit} onChange={(download_limit) => setDelivery({ download_limit })} /></Row>
                    <Row label="Links expire after (days)" htmlFor={`${path}-expiry`} hint="Empty: never."><NumberInput id={`${path}-expiry`} min={1} value={delivery.expiry_days} onChange={(expiry_days) => setDelivery({ expiry_days })} /></Row>
                </div>
            </Section>
        </div>
    );
}
