import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getAllLinks } from '../services/api';
import Loader from '../components/Loader';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [recentLinks, setRecentLinks] = useState([]);
    const [stats, setStats] = useState({
        activeLinks: 0,
        uptime: '99.9%',
        dataTransferred: '2.3M'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllLinks();
                const links = data.data || [];
                const activeLinks = links.filter(link => link.status === 'active').length;
                const recent = links.slice(0, 3).map(link => ({
                    name: link.client_name,
                    status: link.status,
                    type: link.link_type
                }));
                setRecentLinks(recent);
                setStats({
                    activeLinks,
                    uptime: '99.9%', // Could compute from logs if available
                    dataTransferred: '2.3M' // Placeholder, compute if data available
                });
            } catch (error) {
                console.error('Failed to fetch home data:', error);
                // Fallback to mock
                setRecentLinks([
                    { name: 'Primary VoIP Link', status: 'active', type: 'VoIP' },
                    { name: 'Secondary Data Link', status: 'maintenance', type: 'Ethernet' },
                    { name: 'Backup Fiber Optic', status: 'idle', type: 'Fiber' }
                ]);
                setStats({
                    activeLinks: 1247,
                    uptime: '99.9%',
                    dataTransferred: '2.3M'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'idle': return 'bg-gray-100 text-gray-800';
            default: return 'bg-red-100 text-red-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Online';
            case 'maintenance': return 'Pending';
            case 'idle': return 'Offline';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <Loader/>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                <main className="flex-1 ml-0 md:ml-64 py-12 px-4 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Banner */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Welcome to Communication Link Management System
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Streamline your communication infrastructure with secure, scalable link management. Monitor, analyze, and optimize your network links in real-time.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/links" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                    Get Started
                                </Link>
                                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.activeLinks.toLocaleString()}</div>
                                <div className="text-gray-600">Active Links</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">{stats.uptime}</div>
                                <div className="text-gray-600">Uptime</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.dataTransferred}</div>
                                <div className="text-gray-600">Data Transferred</div>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Links */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Links</h2>
                                <div className="space-y-4">
                                    {recentLinks.map((link) => (
                                        <div key={link.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{link.name}</p>
                                                <p className="text-sm text-gray-500">Status: {link.status.charAt(0).toUpperCase() + link.status.slice(1)}</p>
                                            </div>
                                            <span className={`px-3 py-1 ${getStatusBadge(link.status)} rounded-full text-sm`}>
                                                {getStatusLabel(link.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/links" className="mt-6 w-full block bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition-colors">
                                    View All Links
                                </Link>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link to="/links" className="w-full flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Link
                                    </Link>
                                    <button className="w-full flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Run Diagnostics
                                    </button>
                                    <Link to="/analytics" className="w-full flex items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        View Analytics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;