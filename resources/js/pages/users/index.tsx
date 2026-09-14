import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { UsersTable, type UserRow } from './components/table';

type Props = {
    users: {
        data: UserRow[];
    };
};

export default function Index({ users }: Props) {
    const handleDelete = (uuid: string) => {
        if (!confirm('Delete this user? This cannot be undone.')) {
            return;
        }

        router.delete(`/users/${uuid}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage accounts and roles.
                        </p>
                    </div>
                    <Link
                        href="/users/create"
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                        Add user
                    </Link>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <UsersTable users={users.data} onDelete={handleDelete} />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: '/users',
        },
    ],
};