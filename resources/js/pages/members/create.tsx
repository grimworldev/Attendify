import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
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
import { dashboard } from '@/routes';
import { store } from '@/routes/members';

export default function Create() {
    return (
        <>
            <Head title="Member Registration" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Register Member
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create a profile for a new member and assign
                        membership details.
                    </p>
                </div>

                <Form
                    {...store.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        name="first_name"
                                        placeholder="First name"
                                    />
                                    <InputError
                                        message={errors.first_name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">
                                        Last name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        tabIndex={2}
                                        name="last_name"
                                        placeholder="Last name"
                                    />
                                    <InputError
                                        message={errors.last_name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={3}
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">
                                    Phone number
                                </Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    tabIndex={4}
                                    name="phone_number"
                                    placeholder="09XX XXX XXXX"
                                />
                                <InputError message={errors.phone_number} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender">
                                        <SelectTrigger
                                            id="gender"
                                            tabIndex={5}
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="Female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="Others">
                                                Others
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birthdate">
                                        Birthdate
                                    </Label>
                                    <Input
                                        id="birthdate"
                                        type="date"
                                        tabIndex={6}
                                        name="birthdate"
                                    />
                                    <InputError message={errors.birthdate} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    tabIndex={7}
                                    name="address"
                                    placeholder="House no., street, barangay, city"
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <TextLink href="/members" tabIndex={10}>
                                    Cancel
                                </TextLink>
                                <Button type="submit" tabIndex={9}>
                                    {processing && <Spinner />}
                                    Save
                                </Button>
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
        { title: 'Register Member', href: '/members/create' },
    ],
};