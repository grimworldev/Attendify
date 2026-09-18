import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    MembershipCardsTable,
    type MembershipCardRow,
} from './components/table';

type Props = {
    cards: MembershipCardRow[];
};

export default function Index({ cards }: Props) {
    return (
        <>
            <Head title="Membership Cards" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Membership Cards
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Every RFID card issued, across all members.
                    </p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <MembershipCardsTable cards={cards} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Membership Cards', href: '/membership-cards' },
    ],
};