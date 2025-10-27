import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                
                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">Loading Communication Links...</p>
                    <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your data.</p>
                </div>
                
                {/* Optional Progress Bar */}
                <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;