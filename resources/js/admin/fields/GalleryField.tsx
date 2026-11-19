import { React, adminUrl, fetchJson, ui } from '../lib/sunrice';
import type { FieldProps } from '../sunrice';

type MediaItem = { id: number; title?: string; filename: string; thumbnail: string | null; alt?: string };

export default function GalleryField({ field, id, value, errors, onChange }: FieldProps<number[] | null>) {
    const { Button, MediaPickerInput, SortableList, SortableHandle } = ui;
    const ids = Array.isArray(value) ? value : [];
    const [files, setFiles] = React.useState<Record<number, MediaItem>>({});
    const [loadFailed, setLoadFailed] = React.useState(false);
    const missing = ids.filter((fileId) => !files[fileId]).join(',');
    const max = typeof field.config?.max === 'number' ? field.config.max : null;

    React.useEffect(() => {
        if (!missing) return;
        const request = new AbortController();
        const query = new URLSearchParams();
        missing.split(',').forEach((fileId) => query.append('ids[]', fileId));
        fetchJson<{ items: MediaItem[] }>(`${adminUrl('media/picker')}?${query}`, { signal: request.signal })
            .then(({ items }) => {
                if (request.signal.aborted) return;
                setFiles((current) => ({ ...current, ...Object.fromEntries(items.map((item) => [item.id, item])) }));
                setLoadFailed(false);
            })
            .catch(() => { if (!request.signal.aborted) setLoadFailed(true); });

        return () => request.abort();
    }, [missing]);

    const nameOf = (fileId: number) => files[fileId]?.title || files[fileId]?.filename || `Image #${fileId}`;

    return (
        <div id={id} className="cm:grid cm:gap-3">
            {ids.length > 0 && (
                <SortableList items={ids} getId={String} getLabel={nameOf} onReorder={onChange} className="cm:grid cm:gap-2">
                    {(fileId: number, { handle }: { handle: Record<string, unknown> }) => (
                        <div className="cm:flex cm:min-w-0 cm:items-center cm:gap-3 cm:rounded-md cm:border cm:bg-card cm:p-2">
                            <SortableHandle {...handle} label={`Move ${nameOf(fileId)}`} />
                            {files[fileId]?.thumbnail && <img src={files[fileId].thumbnail} alt="" className="cm:size-10 cm:rounded cm:object-cover" />}
                            <span className="cm:min-w-0 cm:flex-1 cm:truncate cm:text-sm">{nameOf(fileId)}</span>
                            {ids[0] === fileId && <span className="cm:text-xs cm:text-muted-foreground">Cover</span>}
                            <Button type="button" variant="ghost" size="sm" aria-label={`Remove ${nameOf(fileId)}`}
                                onClick={() => onChange(ids.filter((other) => other !== fileId))}>Remove</Button>
                        </div>
                    )}
                </SortableList>
            )}
            {(max === null || ids.length < max) && <MediaPickerInput id={id ? `${id}-picker` : undefined} value={null} multiple
                max={max === null ? null : max - ids.length} types={['image']} invalid={Boolean(errors?.[''])}
                onChange={(selected: number[] | null) => onChange(Array.from(new Set([...ids, ...(selected ?? [])])))} />}
            {loadFailed && <p role="status" className="cm:text-sm cm:text-muted-foreground">Image previews could not be loaded.</p>}
        </div>
    );
}
