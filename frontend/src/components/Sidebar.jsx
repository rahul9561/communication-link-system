import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen = true, onToggle }) => {
    const [isExpanded, setIsExpanded] = useState(isOpen);

    const toggleSidebar = () => {
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        if (onToggle) onToggle(newExpanded);
    };

    return (
        <aside className={`bg-white shadow-lg transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-40 w-54 md:w-64 transform ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Overlay for mobile */}
            {!isExpanded && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
            
            <div className="flex flex-col h-full">
                {/* Logo and Toggle */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">CL</span>
                        </div>
                        <span className={`text-xl font-bold text-gray-900 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                            CLMS
                        </span>
                    </div>
                    <button 
                        onClick={toggleSidebar}
                        className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <svg className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                    <Link 
                        to="/dashboard" 
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className={`transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>Dashboard</span>
                    </Link>
                    <Link 
                        to="/links" 
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className={`transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>Links</span>
                    </Link>
                    <Link 
                        to="/analytics" 
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className={`transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>Analytics</span>
                    </Link>
                    <Link 
                        to="/logs" 
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className={`transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>Logs</span>
                    </Link>
                    <Link 
                        to="/settings" 
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className={`transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>Settings</span>
                    </Link>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">JD</span>
                        </div>
                        <div className={`space-y-1 ${isExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                            <p className="text-sm font-medium text-gray-900">John Doe</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                    <Link 
                        to="/settings" 
                        className="mt-2 w-full flex items-center text-sm text-gray-600 hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Manage Account
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;