import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TextLink from '@/components/text-link';
import { dashboard } from '@/routes';
import { edit } from '@/routes/users';

type UserData = {
    uuid: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    gender: string | null;
    role: { id: number; name: string } | null;
};

type Props = {
    user: UserData;
};

function ReadOnlyField({ value }: { value: string }) {
    return (
        <div className="flex h-9 w-full items-center rounded-md bg-transparent px-2 py-1 text-sm text-foreground shadow-xs">
            {value}
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
                        User information
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {user.first_name} {user.last_name}
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>First name</Label>
                            <ReadOnlyField value={user.first_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Last name</Label>
                            <ReadOnlyField value={user.last_name} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Username</Label>
                        <ReadOnlyField value={user.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Email address</Label>
                        <ReadOnlyField value={user.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Gender</Label>
                        <ReadOnlyField value={user.gender ?? '—'} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <ReadOnlyField value={user.role?.name ?? '—'} />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete user
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(user.uuid)}>
                                Edit information
                            </Link>
                        </Button>
                    </div>
                </div>
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