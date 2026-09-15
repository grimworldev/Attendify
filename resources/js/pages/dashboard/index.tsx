import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';

type Stats = {
    totalMembers: number;
    activeMemberships: number;
    expiringSoon: number;
    incomeThisMonth: string;
};

type Transaction = {
    id: number;
    transaction_no: string;
    amount_paid: string;
    paid_at: string;
    membership_detail: {
        member: {
            uuid: string;
            first_name: string;
            last_name: string;
        } | null;
    } | null;
};

type Props = {
    stats: Stats;
    recentTransactions: Transaction[];
};

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string | number;
    accent?: 'success' | 'warning';
}) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p
                className={`mt-1 text-2xl font-semibold ${accent === 'success'
                        ? 'text-success'
                        : accent === 'warning'
                            ? 'text-warning'
                            : 'text-foreground'
                    }`}
            >
                {value}
            </p>
        </div>
    );
}

export default function Dashboard({ stats, recentTransactions }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <StatCard
                        label="Total Members"
                        value={stats.totalMembers}
                    />
                    <StatCard
                        label="Active Memberships"
                        value={stats.activeMemberships}
                        accent="success"
                    />
                    <StatCard
                        label="Expiring in 7 Days"
                        value={stats.expiringSoon}
                        accent="warning"
                    />
                    <StatCard
                        label="Income This Month"
                        value={`₱${parseFloat(stats.incomeThisMonth).toFixed(2)}`}
                        accent="success"
                    />
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">
                            Recent Transactions
                        </h2>
                        <Link
                            href="/transactions"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No transactions recorded yet.
                        </p>
                    ) : (
                        <div className="flex flex-col divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {recentTransactions.map((transaction) => {
                                const member =
                                    transaction.membership_detail?.member;

                                return (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between py-2 text-sm"
                                    >
                                        <div>
                                            <p className="text-foreground">
                                                {member
                                                    ? `${member.first_name} ${member.last_name}`
                                                    : 'Unknown member'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.transaction_no} •{' '}
                                                {new Date(
                                                    transaction.paid_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="font-medium text-success">
                                            ₱
                                            {parseFloat(
                                                transaction.amount_paid,
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};