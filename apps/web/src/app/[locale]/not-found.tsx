export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">404</h2>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    The page you are looking for does not exist or has been moved.
                </p>
            </div>
        </div>
    );
}
