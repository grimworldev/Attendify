import { Link } from '@inertiajs/react';
import MarkCardLostDialog from '../partials/card-mark-lost-dialog';

export type MembershipCardRow = {
    id: number;
    uid: string;
    status: number;
    issued_at: string | null;
    member: {
        uuid: string;
        first_name: string;
        last_name: string;
    } | null;
    issued_by: { first_name: string; last_name: string } | null;
};

type Props = {
    cards: MembershipCardRow[];
};

export function MembershipCardsTable({ cards }: Props) {
    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
                <p className="text-sm font-medium text-foreground">
                    No cards issued yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Cards assigned from a member's profile will show up
                    here.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full border-collapse text-left text-sm">
            <thead>
                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Card UID
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Member
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Status
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Issued
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Issued by
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card) => {
                    const isActive = card.status === 1;

                    return (
                        <tr
                            key={card.id}
                            className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                        >
                            <td className="px-4 py-3 font-mono text-foreground">
                                {card.uid}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {card.member ? (
                                    <Link
                                        href={`/members/${card.member.uuid}`}
                                        className="hover:underline"
                                    >
                                        {card.member.first_name}{' '}
                                        {card.member.last_name}
                                    </Link>
                                ) : (
                                    'Unassigned'
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        isActive
                                            ? 'text-success'
                                            : 'text-destructive'
                                    }
                                >
                                    {isActive ? 'Active' : 'Lost'}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {card.issued_at
                                    ? new Date(
                                        card.issued_at,
                                    ).toLocaleDateString()
                                    : '—'}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {card.issued_by
                                    ? `${card.issued_by.first_name} ${card.issued_by.last_name}`
                                    : '—'}
                            </td>
                            <td className="px-4 py-3">
                                {isActive && (
                                    <div className="flex items-center justify-end">
                                        <MarkCardLostDialog
                                            cardId={card.id}
                                            cardUid={card.uid}
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}