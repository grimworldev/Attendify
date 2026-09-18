import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Attendify — Membership & Attendance Tracking" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Header */}
                <header className="border-b border-border">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M2 10H22" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M6 14.5H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </span>
                            <span className="text-[15px] font-medium tracking-tight">Attendify</span>
                        </div>

                        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
                            <a href="#features" className="hover:text-foreground">Features</a>
                            <a href="#how-it-works" className="hover:text-foreground">How it works</a>
                        </nav>

                        <div className="flex items-center gap-3 text-sm">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()} className="px-2 py-2 text-muted-foreground hover:text-foreground">
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <div className="grid items-center gap-14 md:grid-cols-2">
                        <div>
                            <h1 className="text-[2.25rem] leading-[1.15] font-medium tracking-tight md:text-[2.75rem]">
                                Every member, tracked the moment they walk in.
                            </h1>
                            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                                Attendify pairs RFID check-in with membership, subscription, and
                                transaction records — so your front desk always knows who's in the
                                gym, who's due for renewal, and who needs a follow-up.
                            </p>
                            <div className="mt-8 flex items-center gap-3">
                                <Link
                                    href={register()}
                                    className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                                >
                                    Get started
                                </Link>
                                <a
                                    href="#features"
                                    className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
                                >
                                    See what it does
                                </a>
                            </div>
                        </div>

                        {/* Live check-in mock */}
                        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <span className="text-sm font-medium">Front desk — live feed</span>
                                <span className="flex items-center gap-1.5 text-xs text-success">
                                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                    Scanning
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-3 rounded-md bg-secondary p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                    MR
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Mia Reyes</p>
                                    <p className="text-xs text-muted-foreground">Premium plan · Card #04821</p>
                                </div>
                                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                                    Checked in
                                </span>
                            </div>

                            <div className="mt-4 space-y-2.5">
                                {[
                                    { name: 'Jordan Cruz', time: 'Time out · 7:42 AM', status: 'Complete', tone: 'muted' },
                                    { name: 'Ana Bautista', time: 'Time in · 7:38 AM', status: 'Active', tone: 'success' },
                                    { name: 'Leo Santos', time: 'Renewal due in 2 days', status: 'Expiring', tone: 'warning' },
                                ].map((row) => (
                                    <div key={row.name} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p>{row.name}</p>
                                            <p className="text-xs text-muted-foreground">{row.time}</p>
                                        </div>
                                        <span
                                            className={
                                                row.tone === 'success'
                                                    ? 'rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success'
                                                    : row.tone === 'warning'
                                                        ? 'rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning-foreground'
                                                        : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
                                            }
                                        >
                                            {row.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="border-t border-border bg-secondary/40">
                    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                        <h2 className="text-2xl font-medium tracking-tight">Everything the front desk needs, in one place</h2>
                        <p className="mt-2 max-w-lg text-[15px] text-muted-foreground">
                            Four systems that used to live in separate spreadsheets, now running off the same member record.
                        </p>

                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title: 'Member profiles',
                                    body: 'Contact details, plan type, photo ID, and RFID card assignment, all on one record.',
                                    icon: (
                                        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    ),
                                },
                                {
                                    title: 'Subscriptions',
                                    body: 'Track plan tiers, renewal dates, and status — active, expiring, or lapsed — at a glance.',
                                    icon: (
                                        <path d="M4 5h16v5H4V5zM4 14h10M4 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    ),
                                },
                                {
                                    title: 'Transactions',
                                    body: 'Every payment logged against the member and plan it belongs to, ready for reconciliation.',
                                    icon: (
                                        <path d="M12 3v18M8 7.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5-1.8 2.5-4 2.5-4 1.1-4 2.5 1.8 2.5 4 2.5 4-1.1 4-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    ),
                                },
                                {
                                    title: 'RFID attendance',
                                    body: 'A tap at the door logs time-in and time-out automatically — no sign-in sheet required.',
                                    icon: (
                                        <path d="M3 10l9-6 9 6v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    ),
                                },
                            ].map((f) => (
                                <div key={f.title} className="rounded-lg border border-border bg-card p-5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {f.icon}
                                        </svg>
                                    </span>
                                    <h3 className="mt-4 text-sm font-medium">{f.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                    <h2 className="text-2xl font-medium tracking-tight">From tap to record, in three steps</h2>

                    <div className="mt-10 grid gap-8 md:grid-cols-3">
                        {[
                            {
                                step: '1',
                                title: 'Member taps their card',
                                body: 'An RFID reader at the entrance reads the member\'s card as they walk in.',
                            },
                            {
                                step: '2',
                                title: 'Attendify checks the account',
                                body: 'Time-in is logged instantly, and the subscription status is verified against it.',
                            },
                            {
                                step: '3',
                                title: 'The dashboard updates',
                                body: 'Staff see who\'s in the gym right now, and who needs a renewal reminder, in real time.',
                            },
                        ].map((s, i, arr) => (
                            <div key={s.step} className="relative pl-0">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary text-sm font-medium text-primary">
                                        {s.step}
                                    </span>
                                    {i < arr.length - 1 && <span className="hidden h-px flex-1 bg-border md:block" />}
                                </div>
                                <h3 className="mt-4 text-sm font-medium">{s.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-t border-border">
                    <div className="mx-auto max-w-6xl px-6 py-16 text-center md:py-20">
                        <h2 className="text-2xl font-medium tracking-tight">Set up your front desk in an afternoon</h2>
                        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
                            Connect a reader, import your member list, and start logging attendance today.
                        </p>
                        <div className="mt-7">
                            <Link
                                href={register()}
                                className="inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-muted-foreground">
                        <span>© {new Date().getFullYear()} Attendify</span>
                        <span>IoT-enabled membership & attendance tracking</span>
                    </div>
                </footer>
            </div>
        </>
    );
}