import * as React from 'react';
import { inertia } from '../lib/sunrice';
import { cellText, PER_PAGE, tableQuery, type TableMeta } from '../lib/table';

const { router, Link } = inertia;
import * as Ui from '../shims/ui';

type AnyComponent = React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const ui = Ui as unknown as Record<string, AnyComponent>;
/** The panel's saved table choices (GET/PUT admin/preferences/{key}). */
const useTablePreferences = (Ui as unknown as { useTablePreferences: (key: string, initial?: { columns?: string[] | null } | null) => { setColumns: (columns: string[] | null) => Promise<unknown> } }).useTablePreferences;

export interface Column { key: string; label: string; sortable?: boolean; type?: string }
export interface Filter { key: string; label: string; type: 'select'; options: Array<{ value: string; label: string }> }
export interface BulkAction { key: string; label: string; variant?: 'destructive'; confirm?: string }
export interface Paginator<R> { data: R[]; current_page: number; last_page: number; total: number; from: number | null; to: number | null; per_page: number }

type Row = Record<string, unknown> & { id?: number | string };

export interface DataTableProps {
    tableKey?: string;
    columns: Column[];
    rows: Paginator<Row>;
    meta: TableMeta;
    filters?: Filter[];
    bulkActions?: BulkAction[];
    bulkUrl?: string;
    visibleColumns?: string[];
    searchPlaceholder?: string;
    rowHref?: (row: any) => string | null; // eslint-disable-line @typescript-eslint/no-explicit-any
    onRowClick?: (row: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    renderCell?: (row: any, column: Column) => React.ReactNode | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Commerce's list pages: a search box, filters, sortable columns, pages,
 * and bulk actions on the rows ticked. Every change visits the page again
 * with the new query (the server filters, sorts and pages).
 */
export function DataTable(props: DataTableProps) {
    const { Input, Button, Checkbox, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } = ui;
    const { meta, rows } = props;
    const [search, setSearch] = React.useState(meta.search ?? '');
    const [selected, setSelected] = React.useState<Array<number | string>>([]);
    // With visibleColumns, the user picks the columns (Columns menu), kept per user under tableKey.
    const choosable = props.visibleColumns !== undefined && props.tableKey !== undefined;
    const [shown, setShown] = React.useState<string[] | undefined>(props.visibleColumns);
    const preferences = useTablePreferences(props.tableKey ?? 'commerce-table', choosable ? { columns: props.visibleColumns } : null);
    const toggleColumn = (key: string, on: boolean) => {
        const next = props.columns.map((c) => c.key).filter((k) => (k === key ? on : (shown ?? []).includes(k)));
        if (next.length === 0) return;
        setShown(next);
        void preferences.setColumns(next);
    };
    const columns = shown ? props.columns.filter((c) => shown.includes(c.key)) : props.columns;
    const bulk = (props.bulkActions ?? []).length > 0 && props.bulkUrl !== undefined;
    const ids = rows.data.map((r) => r.id).filter((id): id is number | string => id !== undefined);

    const visit = (changes: Partial<TableMeta> & { page?: number }) => {
        setSelected([]);
        router.get(window.location.pathname, tableQuery(meta, changes), { preserveState: true, preserveScroll: true, replace: true });
    };
    const sortBy = (column: Column) => visit({ sort: column.key, direction: meta.sort === column.key && meta.direction === 'asc' ? 'desc' : 'asc' });
    const runBulk = (action: BulkAction) => {
        if (action.confirm && !window.confirm(action.confirm)) return;
        router.post(props.bulkUrl!, { action: action.key, ids: selected }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };

    return (
        <div className="cm:grid cm:gap-3">
            <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">
                <form className="cm:min-w-48 cm:flex-1" role="search" onSubmit={(e: React.FormEvent) => { e.preventDefault(); visit({ search }); }}>
                    <Input type="search" value={search} aria-label="Search" placeholder={props.searchPlaceholder ?? 'Search…'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
                </form>
                {choosable && (
                    <details className="cm:relative cm:text-sm">
                        <summary className="cm:cursor-pointer cm:rounded-md cm:border cm:border-input cm:px-3 cm:py-1.5">Columns</summary>
                        <div className="cm:absolute cm:right-0 cm:z-10 cm:mt-1 cm:grid cm:min-w-48 cm:gap-1.5 cm:rounded-md cm:border cm:bg-background cm:p-3 cm:shadow-md" role="group" aria-label="Columns">
                            {props.columns.map((c) => (
                                <label key={c.key} className="cm:flex cm:items-center cm:gap-2">
                                    <input type="checkbox" checked={(shown ?? []).includes(c.key)} onChange={(e) => toggleColumn(c.key, e.target.checked)} />
                                    {c.label}
                                </label>
                            ))}
                        </div>
                    </details>
                )}
                {(props.filters ?? []).map((filter) => (
                    <label key={filter.key} className="cm:flex cm:items-center cm:gap-1.5 cm:text-sm">
                        <span className="cm:text-muted-foreground">{filter.label}</span>
                        <select className="cm:h-9 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2 cm:text-sm" value={meta.filters?.[filter.key] ?? ''}
                            onChange={(e) => visit({ filters: { ...meta.filters, [filter.key]: e.target.value } })}>
                            <option value="">All</option>
                            {filter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </label>
                ))}
            </div>
            {bulk && selected.length > 0 && (
                <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:rounded-md cm:bg-muted/50 cm:px-3 cm:py-2 cm:text-sm" role="region" aria-label="Bulk actions">
                    <span>{selected.length} selected</span>
                    {props.bulkActions!.map((action) => (
                        <Button key={action.key} type="button" size="sm" variant={action.variant === 'destructive' ? 'destructive' : 'outline'} onClick={() => runBulk(action)}>{action.label}</Button>
                    ))}
                </div>
            )}
            <div className="cm:overflow-x-auto cm:rounded-lg cm:border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {bulk && (
                                <TableHead className="cm:w-10">
                                    <Checkbox aria-label="Select all" checked={ids.length > 0 && selected.length === ids.length}
                                        onCheckedChange={(on: boolean) => setSelected(on ? ids : [])} />
                                </TableHead>
                            )}
                            {columns.map((column) => (
                                <TableHead key={column.key} aria-sort={meta.sort === column.key ? (meta.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                                    {column.sortable ? (
                                        <button type="button" className="cm:inline-flex cm:items-center cm:gap-1 cm:font-medium cm:hover:text-foreground" onClick={() => sortBy(column)}>
                                            {column.label}{meta.sort === column.key ? (meta.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                                        </button>
                                    ) : column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.data.length === 0 && (
                            <TableRow><TableCell colSpan={columns.length + (bulk ? 1 : 0)} className="cm:py-10 cm:text-center cm:text-muted-foreground">Nothing here yet.</TableCell></TableRow>
                        )}
                        {rows.data.map((row, index) => {
                            const href = props.rowHref?.(row) ?? null;
                            const id = row.id;
                            return (
                                <TableRow key={String(id ?? index)} className={href || props.onRowClick ? 'cm:cursor-pointer cm:hover:bg-muted/40' : undefined}
                                    onClick={props.onRowClick ? () => props.onRowClick!(row) : undefined}>
                                    {bulk && (
                                        <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            {id !== undefined && <Checkbox aria-label="Select row" checked={selected.includes(id)}
                                                onCheckedChange={(on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)))} />}
                                        </TableCell>
                                    )}
                                    {columns.map((column, i) => {
                                        const drawn = props.renderCell?.(row, column);
                                        const content = drawn === undefined ? cellText(row[column.key]) : drawn;
                                        return (
                                            <TableCell key={column.key}>
                                                {href && i === 0 ? <Link href={href} className="cm:font-medium cm:hover:underline">{content}</Link> : content}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-2 cm:text-sm cm:text-muted-foreground">
                <span>{rows.total === 0 ? 'No results' : `${rows.from}–${rows.to} of ${rows.total}`}</span>
                <div className="cm:flex cm:items-center cm:gap-2">
                    <label className="cm:flex cm:items-center cm:gap-1.5">
                        <span>Per page</span>
                        <select className="cm:h-8 cm:rounded-md cm:border cm:border-input cm:bg-background cm:px-2" value={meta.perPage} onChange={(e) => visit({ perPage: Number(e.target.value) })}>
                            {PER_PAGE.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </label>
                    <Button type="button" size="sm" variant="outline" disabled={rows.current_page <= 1} onClick={() => visit({ page: rows.current_page - 1 })}>Previous</Button>
                    <span>Page {rows.current_page} of {Math.max(1, rows.last_page)}</span>
                    <Button type="button" size="sm" variant="outline" disabled={rows.current_page >= rows.last_page} onClick={() => visit({ page: rows.current_page + 1 })}>Next</Button>
                </div>
            </div>
        </div>
    );
}
