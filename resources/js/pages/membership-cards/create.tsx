import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { store } from '@/routes/members/membership-cards';

type Member = {
    uuid: string;
    first_name: string;
    last_name: string;
};

type Props = {
    member: Member;
};

export default function Create({ member }: Props) {
    return (
        <>
            <Head title="Assign Card" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Assign Card
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Link an RFID card to {member.first_name}{' '}
                        {member.last_name}.
                    </p>
                </div>

                <Form
                    {...store.form(member.uuid)}
                    disableWhileProcessing
                    className="flex max-w-lg flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="uid">Card UID</Label>
                                <Input
                                    id="uid"
                                    type="text"
                                    name="uid"
                                    autoFocus
                                    placeholder="Tap the card on the scanner or type the UID"
                                />
                                <InputError message={errors.uid} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit">
                                    {processing && <Spinner />}
                                    Assign card
                                </Button>
                                <TextLink href={`/members/${member.uuid}`}>
                                    Cancel
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Members', href: '/members' },
        { title: 'Assign Card', href: '#' },
    ],
};