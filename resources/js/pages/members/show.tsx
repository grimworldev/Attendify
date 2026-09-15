import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import { dashboard } from '@/routes';

type MembershipDetail = {
    id: number;
    start_date: string;
    end_date: string;
    status: number;
};

type RegisteredBy = {
    first_name: string;
    last_name: string;
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
};

type Props = {
    member: Member;
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

export default function Show({ member }: Props) {
    console.log(member)
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
                        <Button asChild size="sm">
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
                        <Field label="Phone number" value={member.phone_number} />
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