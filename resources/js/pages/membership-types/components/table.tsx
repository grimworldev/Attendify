import { Link } from '@inertiajs/react';

export type MembershipTypeRow = {
    id: number;
    name: string;
    duration_in_days: number;
    price: string;
    status: number;
};

type Props = {
    membershipTypes: MembershipTypeRow[];
    onDelete: (id: number) => void;
};

export function MembershipTypesTable({ membershipTypes, onDelete }: Props) {
    if (membershipTypes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-sidebar-border/70 py-16 text-center dark:border-sidebar-border">
                <p className="text-sm font-medium text-foreground">
                    No membership types yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Plans you create will show up here.
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
                        Duration
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                        Price
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
                {membershipTypes.map((type) => (
                    <tr
                        key={type.id}
                        className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                    >
                        <td className="px-4 py-3 text-foreground">
                            {type.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            {type.duration_in_days} days
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                            ₱{type.price}
                        </td>
                        <td className="px-4 py-3">
                            <span
                                className={
                                    type.status === 1
                                        ? 'text-success'
                                        : 'text-muted-foreground'
                                }
                            >
                                {type.status === 1 ? 'Available' : 'Discontinued'}
                            </span>
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href={`/membership-types/${type.id}/edit`}
                                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => onDelete(type.id)}
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