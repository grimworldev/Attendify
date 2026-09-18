import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import MarkCardLostDialog from './partials/card-mark-lost-dialog';
type MembershipPayment = {
    id: number;
    transaction_no: string;
    payment_method: number;
    amount_paid: string;
    amount_tendered: string | null;
    change: string | null;
    reference_no: string | null;
    paid_at: string;
};

type MembershipDetail = {
    id: number;
    start_date: string;
    end_date: string;
    status: number;
    type: number;
    membership_type: { id: number; name: string } | null;
    payments?: MembershipPayment[];
};

type RegisteredBy = {
    id: number;
    first_name: string;
    last_name: string;
};

type MembershipType = {
    id: number;
    name: string;
    price: string | number;
};

type Member = {
    uuid: string;
    first_name: string;
    last_name: string;
    name: string;
    email: string | null;
    phone_number: string | null;
    gender: string | null;
    birthdate: string | null;
    address: string | null;
    status: number;
    registered_by: RegisteredBy | null;
    current_membership?: MembershipDetail | null;
    active_membership_card?: {
        id: number;
        uid: string;
        status: number;
        issued_at: string | null;
    } | null;
};

type Props = {
    member: Member;
    membershipHistory: MembershipDetail[];
    membershipTypes: MembershipType[];
};

function Field({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="grid gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">
                {value ?? '—'}
            </span>
        </div>
    );
}

export default function Show({ member, membershipHistory, membershipTypes }: Props) {
    const isActive = member.status === 1;

    const hasValidMembership =
        member.current_membership?.status === 1 &&
        member.current_membership?.end_date &&
        new Date(member.current_membership.end_date) > new Date();

    return (
        <>
            <Head title={member.name} />
            <div className="flex h-full flex-1 flex-col gap-3 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">
                            {member.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Member profile and membership details.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button asChild size="sm" variant="outline">
                            <Link href={`/members/${member.uuid}/edit`}>
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 rounded-xl border p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="First name" value={member.first_name} />
                        <Field label="Last name" value={member.last_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="Email address" value={member.email} />
                        <Field
                            label="Phone number"
                            value={member.phone_number}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="Gender" value={member.gender} />
                        <Field
                            label="Birthdate"
                            value={
                                member.birthdate
                                    ? new Date(
                                        member.birthdate,
                                    ).toLocaleDateString()
                                    : null
                            }
                        />
                    </div>

                    <Field label="Address" value={member.address} />
                </div>

                <div className="grid gap-4 rounded-xl border p-6">
                    <h2 className="text-sm font-semibold text-foreground">
                        Current Membership
                    </h2>
                    {member.current_membership ? (
                        <div className="grid grid-cols-3 gap-6">
                            <Field
                                label="Start date"
                                value={new Date(
                                    member.current_membership.start_date,
                                ).toLocaleDateString()}
                            />
                            <Field
                                label="End date"
                                value={new Date(
                                    member.current_membership.end_date,
                                ).toLocaleDateString()}
                            />
                            <Field
                                label="Status"
                                value={
                                    <Badge
                                        variant={
                                            hasValidMembership
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {hasValidMembership
                                            ? 'Valid'
                                            : 'Expired / Cancelled'}
                                    </Badge>
                                }
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No membership record yet.
                        </p>
                    )}
                </div>

                <div className="grid gap-4 rounded-xl border p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-foreground">
                            Membership Card
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                                <Link
                                    href={`/members/${member.uuid}/membership-cards/create`}
                                >
                                    {member.active_membership_card
                                        ? 'Reissue Card'
                                        : 'Assign Card'}
                                </Link>
                            </Button>
                            {member.active_membership_card && (
                                <MarkCardLostDialog
                                    cardId={member.active_membership_card.id}
                                    cardUid={member.active_membership_card.uid}
                                />
                            )}
                        </div>
                    </div>

                    {member.active_membership_card ? (
                        <div className="grid grid-cols-2 gap-6">
                            <Field
                                label="Card UID"
                                value={member.active_membership_card.uid}
                            />
                            <Field
                                label="Issued"
                                value={
                                    member.active_membership_card.issued_at
                                        ? new Date(
                                            member.active_membership_card.issued_at,
                                        ).toLocaleDateString()
                                        : '—'
                                }
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No active card assigned.
                        </p>
                    )}
                </div>

                <div className="grid gap-4 rounded-xl border p-6">
                    <h2 className="text-sm font-semibold text-foreground">
                        Membership History
                    </h2>

                    {membershipHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No membership transactions yet.
                        </p>
                    ) : (
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 dark:border-sidebar-border">
                                    <th className="py-2 pr-4 font-medium text-muted-foreground">
                                        Plan
                                    </th>
                                    <th className="py-2 pr-4 font-medium text-muted-foreground">
                                        Start
                                    </th>
                                    <th className="py-2 pr-4 font-medium text-muted-foreground">
                                        End
                                    </th>
                                    <th className="py-2 pr-4 font-medium text-muted-foreground">
                                        Amount
                                    </th>
                                    <th className="py-2 font-medium text-muted-foreground">
                                        Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {membershipHistory.map((record) => {
                                    const totalPaid = (
                                        record.payments ?? []
                                    ).reduce(
                                        (sum, p) =>
                                            sum + parseFloat(p.amount_paid),
                                        0,
                                    );

                                    return (
                                        <tr
                                            key={record.id}
                                            className="border-b border-sidebar-border/70 last:border-b-0 dark:border-sidebar-border"
                                        >
                                            <td className="py-2 pr-4 text-foreground">
                                                {record.membership_type
                                                    ?.name ?? '—'}
                                            </td>
                                            <td className="py-2 pr-4 text-muted-foreground">
                                                {new Date(
                                                    record.start_date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 pr-4 text-muted-foreground">
                                                {new Date(
                                                    record.end_date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 pr-4 text-muted-foreground">
                                                ₱{totalPaid.toFixed(2)}
                                            </td>
                                            <td className="py-2">
                                                <Badge
                                                    variant={
                                                        record.type === 1
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {record.type === 1
                                                        ? 'Renewal'
                                                        : 'New'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {member.registered_by && (
                    <p className="text-sm text-muted-foreground">
                        Registered by{' '}
                        {member.registered_by.first_name}{' '}
                        {member.registered_by.last_name}
                    </p>
                )}
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Members', href: '/members' },
        { title: 'Profile', href: '#' },
    ],
};