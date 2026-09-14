import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { edit } from '@/routes/users';

type UserData = {
    uuid: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    gender: string | null;
    email_verified_at: string | null;
    created_at: string;
    role: { id: number; name: string } | null;
};

type Props = {
    user: UserData;
};

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-foreground">{value}</dd>
        </div>
    );
}

export default function Show({ user }: Props) {
    const handleDelete = () => {
        if (!confirm('Delete this user? This cannot be undone.')) {
            return;
        }

        router.delete(`/users/${user.uuid}`);
    };

    return (
        <>
            <Head title={`${user.first_name} ${user.last_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {user.email}
                    </p>
                </div>

                <dl className="grid max-w-lg grid-cols-2 gap-6 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <Field label="First name" value={user.first_name} />
                    <Field label="Last name" value={user.last_name} />
                    <Field label="Username" value={user.username} />
                    <Field label="Email" value={user.email} />
                    <Field label="Gender" value={user.gender ?? '—'} />
                    <Field label="Role" value={user.role?.name ?? '—'} />
                    <Field
                        label="Email verified"
                        value={user.email_verified_at ? 'Yes' : 'No'}
                    />
                </dl>

                <div className="flex max-w-lg flex-col gap-4 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Edit information
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Update this account's details, role, or password.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button asChild>
                            <Link href={edit.url(user.uuid)}>
                                Edit information
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete user
                        </Button>
                    </div>
                </div>

                <Link
                    href="/users"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to users
                </Link>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Users', href: '/users' },
        { title: 'Details', href: '#' },
    ],
};