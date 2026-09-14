import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { update } from '@/routes/users';

type Role = {
    id: number;
    name: string;
};

type UserData = {
    uuid: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    gender: string | null;
    role_id: number | null;
};

type Props = {
    user: UserData;
    roles: Role[];
};

export default function Edit({ user, roles }: Props) {
    return (
        <>
            <Head title="Edit user" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">
                        Edit user
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update {user.first_name} {user.last_name}'s account.
                    </p>
                </div>

                <Form
                    {...update.form(user.uuid)}
                    resetOnSuccess={['password']}
                    disableWhileProcessing
                    className="flex max-w-lg flex-col gap-6"
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
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        name="first_name"
                                        defaultValue={user.first_name}
                                        placeholder="First name"
                                    />
                                    <InputError
                                        message={errors.first_name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">
                                        Last name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        name="last_name"
                                        defaultValue={user.last_name}
                                        placeholder="Last name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    name="username"
                                    defaultValue={user.username}
                                    placeholder="Username"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    name="email"
                                    defaultValue={user.email}
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    name="gender"
                                    required
                                    defaultValue={user.gender ?? undefined}
                                >
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
                                <Label htmlFor="role_id">Role</Label>
                                <Select
                                    name="role_id"
                                    defaultValue={
                                        user.role_id
                                            ? String(user.role_id)
                                            : undefined
                                    }
                                >
                                    <SelectTrigger
                                        id="role_id"
                                        tabIndex={6}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="No role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={String(role.id)}
                                            >
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    New password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    tabIndex={7}
                                    name="password"
                                    placeholder="Leave blank to keep current password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" tabIndex={8}>
                                    {processing && <Spinner />}
                                    Save changes
                                </Button>
                                <TextLink href="/users" tabIndex={9}>
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

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Users', href: '/users' },
        { title: 'Edit user', href: '#' },
    ],
};