import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {MembershipTypesTable, type MembershipTypeRow} from './components/table';

type Props = {
    membershipTypes: {
        data: MembershipTypeRow[];
    };
};

export default function Index({ membershipTypes }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Delete this membership type? This cannot be undone.')) {
            return;
        }

        router.delete(`/membership-types/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Membership Types" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            Membership Plans
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the plans members can sign up for.
                        </p>
                    </div>
                    <Link
                        href="/membership-types/create"
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        Add plan
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <MembershipTypesTable
                        membershipTypes={membershipTypes.data}
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
        { title: 'Membership Types', href: '/membership-types' },
    ],
};