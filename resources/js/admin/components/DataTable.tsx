import * as React from 'react';
import { inertia } from '../lib/sunrice';
import { cellText, PER_PAGE, tableQuery, type TableMeta } from '../lib/table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ColumnsIcon, FilterIcon, SearchIcon, XIcon } from './Icons';

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

const ALL = '__all';

/** Filters shown in the toolbar; the rest open from "More filters". */
const INLINE_FILTERS = 3;

/**
 * Commerce's list pages, drawn like the panel's resource lists: a search
 * box, filters, a Columns menu, sortable columns, the table in a card with
 * its pages at the foot, and bulk actions on the rows ticked. Every change
 * visits the page again with the new query (the server filters, sorts and
 * pages); a row opens its page when clicked anywhere.
 */
export function DataTable(props: DataTableProps) {
    const { Input, Button, Card, Checkbox, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
        Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
        DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem,
        Popover, PopoverTrigger, PopoverContent } = ui;
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
    const filters = props.filters ?? [];
    const inline = filters.slice(0, INLINE_FILTERS);
    const more = filters.slice(INLINE_FILTERS);
    const active = (key: string) => (meta.filters?.[key] ?? '') !== '';
    const activeMore = more.filter((f) => active(f.key)).length;
    const anyActive = filters.some((f) => active(f.key)) || !!meta.search;

    const visit = (changes: Partial<TableMeta> & { page?: number }) => {
        setSelected([]);
        router.get(window.location.pathname, tableQuery(meta, changes), { preserveState: true, preserveScroll: true, replace: true });
    };
    const setFilter = (key: string, value: string) => visit({ filters: { ...meta.filters, [key]: value === ALL ? '' : value } });
    const sortBy = (column: Column) => visit({ sort: column.key, direction: meta.sort === column.key && meta.direction === 'asc' ? 'desc' : 'asc' });
    const runBulk = (action: BulkAction) => {
        if (action.confirm && !window.confirm(action.confirm)) return;
        router.post(props.bulkUrl!, { action: action.key, ids: selected }, { preserveScroll: true, onSuccess: () => setSelected([]) });
    };
    const filterSelect = (filter: Filter, className: string) => (
        <Select key={filter.key} value={meta.filters?.[filter.key] || ALL} onValueChange={(value: string) => setFilter(filter.key, value)}>
            <SelectTrigger className={className} aria-label={filter.label}><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL}>{filter.label}: all</SelectItem>
                {filter.options.filter((o) => o.value !== '').map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
        </Select>
    );
    const span = columns.length + (bulk ? 1 : 0);

    return (
        <div className="cm:flex cm:min-w-0 cm:flex-col cm:gap-4">
            <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2">
                <form className="cm:relative cm:w-full cm:max-w-xs" role="search" onSubmit={(e: React.FormEvent) => { e.preventDefault(); visit({ search }); }}>
                    <SearchIcon className="cm:pointer-events-none cm:absolute cm:top-1/2 cm:left-2.5 cm:size-4 cm:-translate-y-1/2 cm:text-muted-foreground" />
                    <Input type="search" className="cm:pl-9" value={search} aria-label="Search" placeholder={props.searchPlaceholder ?? 'Search…'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
                </form>
                {inline.map((filter) => filterSelect(filter, 'cm:w-40'))}
                {more.length > 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline"><FilterIcon /> More filters{activeMore > 0 ? ` (${activeMore})` : ''}</Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="cm:grid cm:w-80 cm:gap-2">
                            {more.map((filter) => (
                                <label key={filter.key} className="cm:grid cm:gap-1 cm:text-sm">
                                    <span className="cm:text-muted-foreground">{filter.label}</span>
                                    {filterSelect(filter, 'cm:w-full')}
                                </label>
                            ))}
                        </PopoverContent>
                    </Popover>
                )}
                {anyActive && (
                    <Button variant="ghost" onClick={() => { setSearch(''); visit({ search: '', filters: {} }); }}><XIcon /> Clear</Button>
                )}
                {choosable && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="cm:ml-auto"><ColumnsIcon /> Columns</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Show columns</DropdownMenuLabel>
                            {props.columns.map((c) => (
                                <DropdownMenuCheckboxItem key={c.key} checked={(shown ?? []).includes(c.key)} onSelect={(e: Event) => e.preventDefault()}
                                    onCheckedChange={(on: boolean) => toggleColumn(c.key, on)}>
                                    {c.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {bulk && selected.length > 0 && (
                <div className="cm:flex cm:flex-wrap cm:items-center cm:gap-2 cm:text-sm" role="region" aria-label="Bulk actions">
                    <span className="cm:text-muted-foreground">{selected.length} selected</span>
                    {props.bulkActions!.map((action) => (
                        <Button key={action.key} type="button" size="sm" variant={action.variant === 'destructive' ? 'destructive' : 'outline'} onClick={() => runBulk(action)}>{action.label}</Button>
                    ))}
                </div>
            )}
            <Card className="cm:gap-0 cm:overflow-hidden cm:py-0">
                <div className="cm:overflow-x-auto">
                    <Table>
                        <TableHeader className="cm:bg-muted/60">
                            <TableRow className="cm:hover:bg-transparent">
                                {bulk && (
                                    <TableHead className="cm:w-8">
                                        <Checkbox aria-label="Select all rows" checked={ids.length > 0 && selected.length === ids.length}
                                            onCheckedChange={(on: boolean) => setSelected(on ? ids : [])} />
                                    </TableHead>
                                )}
                                {columns.map((column) => (
                                    <TableHead key={column.key} aria-sort={meta.sort === column.key ? (meta.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                                        {column.sortable ? (
                                            <button type="button" onClick={() => sortBy(column)}
                                                className="cm:-ml-2 cm:inline-flex cm:h-8 cm:items-center cm:gap-1 cm:rounded-md cm:px-2 cm:hover:bg-accent cm:hover:text-accent-foreground">
                                                {column.label}
                                                {meta.sort === column.key
                                                    ? (meta.direction === 'asc' ? <ArrowUpIcon className="cm:size-3" /> : <ArrowDownIcon className="cm:size-3" />)
                                                    : <ArrowUpDownIcon className="cm:size-3 cm:opacity-40" />}
                                            </button>
                                        ) : column.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.data.length === 0 && (
                                <TableRow className="cm:hover:bg-transparent">
                                    <TableCell colSpan={span} className="cm:h-24 cm:text-center cm:text-muted-foreground">
                                        {anyActive ? 'Nothing matches.' : 'Nothing here yet.'}
                                    </TableCell>
                                </TableRow>
                            )}
                            {rows.data.map((row, index) => {
                                const href = props.rowHref?.(row) ?? null;
                                const id = row.id;
                                const open = props.onRowClick ? () => props.onRowClick!(row) : href ? () => router.visit(href) : undefined;
                                return (
                                    <TableRow key={String(id ?? index)} data-state={id !== undefined && selected.includes(id) ? 'selected' : undefined}
                                        className={open ? 'cm:cursor-pointer' : undefined}
                                        onClick={open ? (e: React.MouseEvent) => {
                                            // Links, buttons and checkboxes inside the row do their own thing.
                                            if ((e.target as HTMLElement).closest('a, button, input, label, [role="checkbox"]')) return;
                                            open();
                                        } : undefined}>
                                        {bulk && (
                                            <TableCell>
                                                {id !== undefined && <Checkbox aria-label="Select row" checked={selected.includes(id)}
                                                    onCheckedChange={(on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)))} />}
                                            </TableCell>
                                        )}
                                        {columns.map((column, i) => {
                                            const drawn = props.renderCell?.(row, column);
                                            const content = drawn === undefined ? cellText(row[column.key]) : drawn;
                                            return (
                                                <TableCell key={column.key} className="cm:whitespace-nowrap">
                                                    {href && i === 0 ? <Link href={href} className="cm:font-medium cm:underline-offset-4 cm:hover:underline">{content}</Link> : content}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className="cm:flex cm:flex-wrap cm:items-center cm:justify-between cm:gap-4 cm:border-t cm:px-6 cm:py-3 cm:text-sm cm:text-muted-foreground">
                    <div className="cm:flex cm:items-center cm:gap-4">
                        <span>{rows.total === 0 ? 'No rows' : `${rows.from}–${rows.to} of ${rows.total}`}</span>
                        {rows.total > PER_PAGE[0]! && (
                            <Select value={String(meta.perPage)} onValueChange={(value: string) => visit({ perPage: Number(value) })}>
                                <SelectTrigger className="cm:h-8 cm:w-auto" aria-label="Rows per page"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {PER_PAGE.map((n) => <SelectItem key={n} value={String(n)}>{n} per page</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {rows.last_page > 1 && (
                        <div className="cm:flex cm:items-center cm:gap-2">
                            <span>Page {rows.current_page} of {rows.last_page}</span>
                            <Button type="button" variant="outline" size="icon" className="cm:size-8" aria-label="Previous page" disabled={rows.current_page <= 1}
                                onClick={() => visit({ page: rows.current_page - 1 })}><ChevronLeftIcon /></Button>
                            <Button type="button" variant="outline" size="icon" className="cm:size-8" aria-label="Next page" disabled={rows.current_page >= rows.last_page}
                                onClick={() => visit({ page: rows.current_page + 1 })}><ChevronRightIcon /></Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
