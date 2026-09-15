import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';

const PAYMENT_METHOD_LABELS: Record<number, string> = {
    0: 'Cash',
    1: 'GCash',
    2: 'Bank Transfer',
    3: 'Card',
};

type Transaction = {
    id: number;
    transaction_no: string;
    payment_method: number;
    amount_paid: string;
    paid_at: string;
    membership_detail: {
        member: {
            uuid: string;
            first_name: string;
            last_name: string;
        } | null;
        membership_type: { name: string } | null;
    } | null;
    processed_by: { first_name: string; last_name: string } | null;
};

type Props = {
    transactions: Transaction[];
    totalAmountPaid: string;
};

export default function Index({ transactions, totalAmountPaid }: Props) {
    return (
        <>
            <Head title="Transactions" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Transactions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Every membership payment recorded in the system.
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
                            <p className="text-sm font-medium text-foreground">
                                No transactions yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Payments recorded from member profiles will
                                show up here.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Transaction No.
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Member
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Plan
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Method
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Processed by
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => {
                                    const member =
                                        transaction.membership_detail
                                            ?.member;

                                    return (
                                        <tr
                                            key={transaction.id}
                                            className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                        >
                                            <td className="px-4 py-3 text-foreground">
                                                {transaction.transaction_no}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {member ? (
                                                    <Link
                                                        href={`/members/${member.uuid}`}
                                                        className="hover:underline"
                                                    >
                                                        {member.first_name}{' '}
                                                        {member.last_name}
                                                    </Link>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {transaction.membership_detail
                                                    ?.membership_type?.name ??
                                                    '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {PAYMENT_METHOD_LABELS[
                                                    transaction.payment_method
                                                ] ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-foreground">
                                                ₱
                                                {parseFloat(
                                                    transaction.amount_paid,
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {transaction.processed_by
                                                    ? `${transaction.processed_by.first_name} ${transaction.processed_by.last_name}`
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(
                                                    transaction.paid_at,
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {transactions.length > 0 && (
                        <div className="flex items-center justify-end gap-2 border-t border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
                            <span className="text-sm text-muted-foreground">
                                Total Amount Paid
                            </span>
                            <span className="text-base font-semibold text-success">
                                ₱{parseFloat(totalAmountPaid).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Transactions', href: '/transactions' },
    ],
};