import React from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router is used; adjust if needed

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Error Icon */}
                <div className="mx-auto h-24 w-24">
                    <svg
                        className="h-full w-full text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Error Title */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-gray-900 tracking-tight">404</h1>
                    <p className="text-xl text-gray-500">
                        Oops! Page not found.
                    </p>
                    <p className="text-gray-400">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Back to Home Button */}
                <div className="pt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;