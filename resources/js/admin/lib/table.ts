/** A list page's state, as TableQuery (src/Admin/Tables/TableQuery.php) reports it in `meta`. */
export interface TableMeta { search: string | null; sort: string | null; direction: 'asc' | 'desc'; filters: Record<string, string>; perPage: number }

export const PER_PAGE = [10, 25, 50, 100, 200];

/** The list's query string from its state (TableQuery reads it: search, filters[key], sort, per_page, page). */
export function tableQuery(meta: TableMeta, changes: Partial<TableMeta> & { page?: number } = {}): Record<string, string | number | Record<string, string>> {
    const next = { ...meta, ...changes };
    const query: Record<string, string | number | Record<string, string>> = {};
    if (next.search) query.search = next.search;
    const filters = Object.fromEntries(Object.entries(next.filters ?? {}).filter(([, v]) => v !== ''));
    if (Object.keys(filters).length > 0) query.filters = filters;
    if (next.sort) query.sort = (next.direction === 'desc' ? '-' : '') + next.sort;
    if (next.perPage) query.per_page = next.perPage;
    if (changes.page && changes.page > 1) query.page = changes.page;

    return query;
}

/** A cell's text when the page doesn't draw it: null as a dash, everything else as text. */
export function cellText(value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    return String(value);
}
