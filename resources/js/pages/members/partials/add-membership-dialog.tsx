import { useState } from 'react';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/members/membership-details';

// Mirrors MembershipDetail::TYPE_* / MembershipPayment::METHOD_* constants.
const TRANSACTION_TYPE = { NEW: '0', RENEWAL: '1' } as const;
const PAYMENT_METHOD = {
    CASH: '0',
    GCASH: '1',
    BANK_TRANSFER: '2',
    CARD: '3',
} as const;

type MembershipType = {
    id: number;
    name: string;
    price: string | number;
    duration_in_days: number;
};

type Props = {
    memberUuid: string;
    membershipTypes: MembershipType[];
    // Determines the default transaction type — a member with no current
    // membership is signing up new, one with an existing record is renewing.
    hasExistingMembership: boolean;
};

function todayIso(): string {
    return new Date().toISOString().split('T')[0];
}

function addDaysIso(dateIso: string, days: number): string {
    const date = new Date(dateIso);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export default function AddMembershipDialog({
    memberUuid,
    membershipTypes,
    hasExistingMembership,
}: Props) {
    const [open, setOpen] = useState(false);
    // Defaults to Cash — the most common front-desk payment method.
    const [paymentMethod, setPaymentMethod] = useState<string>(
        PAYMENT_METHOD.CASH,
    );
    const [membershipTypeId, setMembershipTypeId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(todayIso());
    const [endDate, setEndDate] = useState<string>('');
    // Amount payable is locked to the selected plan's price — not
    // something staff can freely type in.
    const [amountPayable, setAmountPayable] = useState<string>('');

    const isCash = paymentMethod === PAYMENT_METHOD.CASH;

    // Recompute the end date from a given start date + the currently
    // selected plan's duration. Called whenever the plan or start date
    // changes — but the user can still type over the result afterward,
    // since endDate is just regular state, not derived on every render.
    const recomputeEndDate = (typeId: string, fromStartDate: string) => {
        const selected = membershipTypes.find(
            (type) => String(type.id) === typeId,
        );

        if (selected && fromStartDate) {
            setEndDate(addDaysIso(fromStartDate, selected.duration_in_days));
        }
    };

    const handleMembershipTypeChange = (value: string) => {
        setMembershipTypeId(value);
        recomputeEndDate(value, startDate);

        const selected = membershipTypes.find(
            (type) => String(type.id) === value,
        );
        setAmountPayable(selected ? String(selected.price) : '');
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        recomputeEndDate(membershipTypeId, value);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    {hasExistingMembership
                        ? 'Renew Membership'
                        : 'Add Membership'}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {hasExistingMembership
                            ? 'Renew Membership'
                            : 'Add Membership'}
                    </DialogTitle>
                    <DialogDescription>
                        Record the membership plan and the payment taken for
                        it. The end date and amount payable fill in
                        automatically based on the selected plan.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...store.form(memberUuid)}
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="type"
                                value={
                                    hasExistingMembership
                                        ? TRANSACTION_TYPE.RENEWAL
                                        : TRANSACTION_TYPE.NEW
                                }
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="membership_type_id">
                                    Membership plan
                                </Label>
                                <Select
                                    name="membership_type_id"
                                    value={membershipTypeId}
                                    onValueChange={handleMembershipTypeChange}
                                >
                                    <SelectTrigger
                                        id="membership_type_id"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {membershipTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={String(type.id)}
                                            >
                                                {type.name} — ₱{type.price} (
                                                {type.duration_in_days} days)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.membership_type_id}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        Start date
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        value={startDate}
                                        onChange={(e) =>
                                            handleStartDateChange(
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">
                                        End date
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        name="end_date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="payment_method">
                                    Payment method
                                </Label>
                                <Select
                                    name="payment_method"
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                >
                                    <SelectTrigger
                                        id="payment_method"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={PAYMENT_METHOD.CASH}>
                                            Cash
                                        </SelectItem>
                                        <SelectItem value={PAYMENT_METHOD.GCASH}>
                                            GCash
                                        </SelectItem>
                                        <SelectItem
                                            value={PAYMENT_METHOD.BANK_TRANSFER}
                                        >
                                            Bank Transfer
                                        </SelectItem>
                                        <SelectItem value={PAYMENT_METHOD.CARD}>
                                            Card
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.payment_method} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount_paid">
                                        Amount Payable
                                    </Label>
                                    <Input
                                        id="amount_paid"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="amount_paid"
                                        value={amountPayable}
                                        readOnly
                                        placeholder="Select a plan first"
                                        className="cursor-not-allowed bg-muted text-muted-foreground"
                                    />
                                    <InputError message={errors.amount_paid} />
                                </div>

                                {isCash ? (
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount_tendered">
                                            Amount Received
                                        </Label>
                                        <Input
                                            id="amount_tendered"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="amount_tendered"
                                            placeholder="0.00"
                                        />
                                        <InputError
                                            message={errors.amount_tendered}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label htmlFor="reference_no">
                                            Reference no.
                                        </Label>
                                        <Input
                                            id="reference_no"
                                            type="text"
                                            name="reference_no"
                                            placeholder="Transaction / receipt no."
                                        />
                                        <InputError
                                            message={errors.reference_no}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    rows={2}
                                    placeholder="Optional notes about this membership"
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {processing && <Spinner />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}