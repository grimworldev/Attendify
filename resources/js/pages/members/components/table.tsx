import { Link } from '@inertiajs/react';

export type MemberRow = {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string | null;
    status: number;
    current_membership: {
        end_date: string;
        membership_type: { name: string } | null;
    } | null;
};

type Props = {
    members: MemberRow[];
    onDelete: (uuid: string) => void;
};

export function MembersTable({ members, onDelete }: Props) {
    if (members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                <p className="text-sm font-medium text-foreground">
                    No members yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Members you register will show up here.
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
                        Contact
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Plan
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Status
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        <span className="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {members.map((member) => (
                    <tr
                        key={member.uuid}
                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                    >
                        <td className="px-4 py-3 text-foreground">
                            {member.first_name} {member.last_name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {member.email ?? member.phone_number ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {member.current_membership?.membership_type
                                ?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3">
                            <span
                                className={
                                    member.status === 1
                                        ? 'text-success'
                                        : 'text-muted-foreground'
                                }
                            >
                                {member.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={`/members/${member.uuid}`}
                                    className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/members/${member.uuid}/edit`}
                                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => onDelete(member.uuid)}
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