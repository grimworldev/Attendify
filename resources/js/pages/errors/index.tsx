import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

type Props = {
    status: number;
};

type ErrorContent = {
    title: string;
    description: string;
};

const messages: Record<number, ErrorContent> = {
    401: {
        title: 'Not logged in',
        description: 'You need to sign in before you can view this page.',
    },
    403: {
        title: 'Access denied',
        description: "You don't have permission to view this page.",
    },
    404: {
        title: 'Page not found',
        description: "The page you're looking for doesn't exist or has moved.",
    },
    405: {
        title: 'Method not allowed',
        description: "That action isn't supported for this page.",
    },
    408: {
        title: 'Request timed out',
        description: 'The request took too long. Please try again.',
    },
    419: {
        title: 'Session expired',
        description: 'Your session expired. Please refresh and try again.',
    },
    422: {
        title: 'Invalid request',
        description: 'Some of the submitted information could not be processed.',
    },
    429: {
        title: 'Too many requests',
        description: "You've made too many requests. Please slow down and try again shortly.",
    },
    500: {
        title: 'Something went wrong',
        description: 'An unexpected error occurred on our end.',
    },
    502: {
        title: 'Bad gateway',
        description: 'The server received an invalid response. Please try again shortly.',
    },
    503: {
        title: 'Under maintenance',
        description: "We're performing maintenance. Please check back shortly.",
    },
    504: {
        title: 'Gateway timeout',
        description: 'The server took too long to respond. Please try again.',
    },
};

const fallback: ErrorContent = {
    title: 'Unexpected error',
    description: 'Something went wrong. Please try again.',
};

export default function Index({ status }: Props) {
    const { title, description } = messages[status] ?? fallback;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Error {status}
                    </p>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {title}
                    </h1>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <Button asChild>
                    <Link href={dashboard()}>Back to dashboard</Link>
                </Button>
            </div>
        </>
    );
}