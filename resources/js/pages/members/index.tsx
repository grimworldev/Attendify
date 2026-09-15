import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { MembersTable, type MemberRow } from './components/table';

type Props = {
    members: {
        data: MemberRow[];
    };
};

export default function Index({ members }: Props) {
    const handleDelete = (uuid: string) => {
        if (!confirm('Delete this member? This cannot be undone.')) {
            return;
        }

        router.delete(`/members/${uuid}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            Members
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage gym members and their plans.
                        </p>
                    </div>
                    <Link
                        href="/members/create"
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        Register member
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <MembersTable
                        members={members.data}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Members', href: '/members' },
    ],
};