import { adminUrl, inertia, ui } from '../lib/sunrice';

interface Props {
    sales?: string;
    orders?: number;
    todo?: Array<{ key: string; label: string; count: number; href: string }>;
}

/** The Store card on Sunrice's own dashboard: today's sales and the store's to-dos. */
export function StoreCard({ sales, orders, todo }: Props) {
    const { Card, CardContent, CardHeader, CardTitle, CardDescription } = ui;
    const { Link } = inertia;

    return (
        <Card>
            <CardHeader>
                <CardTitle><Link href={adminUrl('commerce')} className="cm:hover:underline">Store</Link></CardTitle>
                <CardDescription>Today</CardDescription>
            </CardHeader>
            <CardContent className="cm:grid cm:gap-3">
                {sales === undefined ? (
                    <div className="cm:h-12 cm:animate-pulse cm:rounded-md cm:bg-muted" />
                ) : (
                    <div className="cm:flex cm:items-baseline cm:justify-between">
                        <span className="cm:text-2xl cm:font-semibold cm:tabular-nums">{sales}</span>
                        <span className="cm:text-sm cm:text-muted-foreground">{orders} {orders === 1 ? 'order' : 'orders'}</span>
                    </div>
                )}
                {todo && todo.length > 0 && (
                    <ul className="cm:grid cm:gap-1 cm:text-sm">
                        {todo.map((t) => (
                            <li key={t.key}>
                                <Link href={adminUrl(t.href)} className="cm:flex cm:justify-between cm:hover:underline">
                                    <span>{t.label}</span>
                                    <span className="cm:font-semibold">{t.count}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
