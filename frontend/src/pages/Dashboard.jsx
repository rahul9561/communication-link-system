import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for dashboard metrics
    const metrics = [
        {
            title: 'Active Links',
            value: '5',
            change: '+2',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Total Bandwidth',
            value: '11.65 Gbps',
            change: '+0.5',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Average Uptime',
            value: '99.3%',
            change: '-0.1',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-purple-600 bg-purple-100'
        },
        {
            title: 'Alerts',
            value: '2',
            change: '+1',
            icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
            color: 'text-red-600 bg-red-100'
        }
    ];

    // Mock recent activity
    const recentActivity = [
        {
            id: 1,
            title: 'Primary VoIP Link - Status Change',
            time: '2 min ago',
            type: 'status',
            status: 'active'
        },
        {
            id: 2,
            title: 'Secondary Data Link - Maintenance Scheduled',
            time: '1 hour ago',
            type: 'maintenance',
            status: 'maintenance'
        },
        {
            id: 3,
            title: 'Wireless Bridge - High Latency Alert',
            time: '3 hours ago',
            type: 'alert',
            status: 'warn'
        },
        {
            id: 4,
            title: 'Backup Fiber Optic - Diagnostics Passed',
            time: '5 hours ago',
            type: 'diagnostic',
            status: 'success'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'warn': return 'bg-orange-100 text-orange-800';
            case 'success': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                
                <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 overflow-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your communication links today.</p>
                            </div>
                            <div className="flex space-x-3">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                    Quick Scan
                                </button>
                                <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                                        <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {metric.change} from yesterday
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${metric.color}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Uptime Chart Placeholder */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uptime Over Last 7 Days</h2>
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-lg font-medium">Chart Placeholder</p>
                                    <p className="text-sm">99.3% average</p>
                                </div>
                            </div>
                        </div>

                        {/* Bandwidth Usage Chart Placeholder */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bandwidth Usage</h2>
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-lg font-medium">Chart Placeholder</p>
                                    <p className="text-sm">Peak: 1.2 Gbps</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                        {activity.type.toUpperCase()}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                            View All Activity
                        </button>
                    </div>
                </main>
            </div>
            
        </div>
    );
};

export default Dashboard;