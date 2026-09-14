import { Link } from '@inertiajs/react';

export type UserRow = {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string | null;
    role: { id: number; name: string } | null;
};

type Props = {
    users: UserRow[];
    onDelete: (uuid: string) => void;
};

export function UsersTable({ users, onDelete }: Props) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                <p className="text-sm font-medium text-foreground">
                    No users yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Users you create will show up here.
                </p>
            </div>
        );
    }

    return (
        <table className="w-full border-collapse text-left text-sm">
            <thead>
                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Name
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Email
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Gender
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Role
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr
                        key={user.uuid}
                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                    >
                        <td className="px-4 py-3 text-foreground">
                            {user.first_name} {user.last_name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {user.email}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {user.gender ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {user.role?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={`/users/${user.uuid}`}
                                    className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/users/${user.uuid}/edit`}
                                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => onDelete(user.uuid)}
                                    className="text-sm font-medium text-destructive underline-offset-4 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}