import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    console.log("user:",user)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    const getUserInitials = () => {
        if (!user) return 'US';
        const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || 'U';
        const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || 'S';
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">CL</span>
                    </div>
                    <Link to='/'>
                    <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">CLMSystem</h1>
                    </Link>
                </div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    <Link to="/dashboard" className="hover:text-blue-200 transition-colors">Dashboard</Link>
                    <Link to="/links" className="hover:text-blue-200 transition-colors">Links</Link>
                    <Link to="/analytics" className="hover:text-blue-200 transition-colors">Analytics</Link>
                    <Link to="/logs" className="hover:text-blue-200 transition-colors">Logs</Link>
                    <Link to="/settings" className="hover:text-blue-200 transition-colors">Settings</Link>
                </nav>
                
                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-4 relative">
                    <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={toggleUserMenu}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold focus:outline-none"
                        >
                            {getUserInitials()}
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <Link 
                                    to="/settings" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Mobile Menu Button */}
                <button 
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors relative z-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-700 border-t border-blue-500">
                    <nav className="flex flex-col space-y-4 p-4">
                        <Link 
                            to="/dashboard" 
                            className="hover:text-blue-200 transition-colors py-2" 
                            onClick={toggleMobileMenu}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/links" 
                            className="hover:text-blue-200 transition-colors py-2" 
                            onClick={toggleMobileMenu}
                        >
                            Links
                        </Link>
                        <Link 
                            to="/analytics" 
                            className="hover:text-blue-200 transition-colors py-2" 
                            onClick={toggleMobileMenu}
                        >
                            Analytics
                        </Link>
                        <Link 
                            to="/logs" 
                            className="hover:text-blue-200 transition-colors py-2" 
                            onClick={toggleMobileMenu}
                        >
                            Logs
                        </Link>
                        <Link 
                            to="/settings" 
                            className="hover:text-blue-200 transition-colors py-2" 
                            onClick={toggleMobileMenu}
                        >
                            Settings
                        </Link>
                        <div className="flex items-center space-x-4 pt-4 border-t border-blue-400">
                            <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                            <div 
                                onClick={toggleUserMenu}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm cursor-pointer"
                            >
                                {getUserInitials()}
                            </div>
                            {isUserMenuOpen && (
                                <div className="absolute top-20 right-4 bg-white rounded-md shadow-lg py-1 z-50 w-48">
                                    <Link 
                                        to="/settings" 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            toggleMobileMenu();
                                        }}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 mt-auto">
            <div className="container mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4 flex-wrap">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">CL</span>
                            </div>
                            <h3 className="text-white font-bold text-base sm:text-lg">Communication Link Management System</h3>
                        </div>
                        <p className="text-sm opacity-75 leading-relaxed">Streamlining your communication infrastructure with secure, scalable link management.</p>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/dashboard" className="hover:text-white transition-colors block py-1">Dashboard</Link></li>
                            <li><Link to="/links" className="hover:text-white transition-colors block py-1">Manage Links</Link></li>
                            <li><Link to="/analytics" className="hover:text-white transition-colors block py-1">Analytics</Link></li>
                            <li><a href="#support" className="hover:text-white transition-colors block py-1">Support</a></li>
                        </ul>
                    </div>
                    
                    {/* Resources */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#docs" className="hover:text-white transition-colors block py-1">Documentation</a></li>
                            <li><a href="#api" className="hover:text-white transition-colors block py-1">API Reference</a></li>
                            <li><a href="#blog" className="hover:text-white transition-colors block py-1">Blog</a></li>
                            <li><a href="#community" className="hover:text-white transition-colors block py-1">Community</a></li>
                        </ul>
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2 py-1">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="break-all">support@clms.com</span>
                            </li>
                            <li className="flex items-center space-x-2 py-1">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-6 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center text-sm opacity-75 space-y-2 sm:space-y-0">
                    <p className="text-center sm:text-left">&copy; 2025 Communication Link Management System. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Header, Footer };