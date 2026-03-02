'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    An unexpected error occurred in the application.
                </p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
