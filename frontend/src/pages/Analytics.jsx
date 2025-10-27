import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is imported
import { getAllLinks, getAllLogs } from '../services/api'; // Import API functions
import Loader from '../components/Loader';

const Analytics = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [links, setLinks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('7d'); // 7d, 30d, 90d

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [linksData, logsData] = await Promise.all([
                    getAllLinks(),
                    getAllLogs()
                ]);
                setLinks(linksData.data);
                setLogs(logsData.data);
                console.log("logs",logsData.data)
            } catch (error) {
                console.error('Failed to fetch analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter logs based on selected period
    const getDateRange = () => {
        const now = new Date();
        let fromDate;
        switch (selectedPeriod) {
            case '7d':
                fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                fromDate = new Date(0);
        }
        return fromDate;
    };

    const filteredLogs = logs.filter(log => new Date(log.timestamp) >= getDateRange());

    // Compute analytics metrics
    const computeMetrics = () => {
        if (loading || links.length === 0) return { average: 0, total: 0, trend: 0, uniqueClients: 0 };

        const activeCount = links.filter(link => link.status === 'active').length;
        const totalCount = links.length;
        const availability = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
        const uniqueClients = new Set(links.map(link => link.client_name)).size;
        const trend = Math.random() * 5 - 2.5; // Simulated trend

        // Group by client for top performers
        const clientGroups = links.reduce((acc, link) => {
            acc[link.client_name] = (acc[link.client_name] || 0) + 1;
            return acc;
        }, {});
        const topClients = Object.entries(clientGroups)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([client, count], index) => ({ client, count, rank: index + 1 }));

        return {
            average: availability.toFixed(1),
            total: totalCount,
            trend: trend.toFixed(1),
            uniqueClients,
            topClients
        };
    };

    const metrics = computeMetrics();

    if (loading) {
        return (
           <Loader/>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                
                <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 overflow-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                                <p className="text-gray-600 mt-1">In-depth insights into your communication links performance.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="90d">Last 90 Days</option>
                                </select>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Availability</h3>
                            <p className="text-3xl font-bold text-blue-600 mb-1">{metrics.average}%</p>
                            <p className={`text-sm ${metrics.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {metrics.trend >= 0 ? '+' : ''}{metrics.trend}% trend
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Contacts</h3>
                            <p className="text-3xl font-bold text-green-600 mb-1">{metrics.total}</p>
                            <p className="text-sm text-gray-600">Across all clients</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clients Analyzed</h3>
                            <p className="text-3xl font-bold text-purple-600 mb-1">{metrics.uniqueClients}</p>
                            <p className="text-sm text-gray-600">Unique clients</p>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Trend Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacts Trend Over Time</h2>
                            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-lg font-medium">Interactive Chart</p>
                                    <p className="text-sm">Line graph showing contacts fluctuations</p>
                                    {/* In real app: <LineChart data={chartData} /> */}
                                </div>
                            </div>
                        </div>

                        {/* Top Performers Table */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Clients by Contacts</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Count</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {metrics.topClients.map(({ client, count, rank }) => (
                                            <tr key={client} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{client}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{count}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{rank}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Log Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Log Insights</h2>
                            <div className="space-y-3">
                                {filteredLogs.slice(-5).reverse().map((log) => (
                                    <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <span className={`px-2 py-1 rounded-full text-xs ${log.level === 'error' ? 'bg-red-100 text-red-800' : log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {log.level.toUpperCase()}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">{log.message}</p>
                                            <p className="text-xs text-gray-500">{log.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Breakdown</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Active Links</span>
                                    <span className="font-semibold text-green-600">{links.filter(l => l.status === 'active').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">In Maintenance</span>
                                    <span className="font-semibold text-yellow-600">{links.filter(l => l.status === 'maintenance').length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Offline</span>
                                    <span className="font-semibold text-red-600">{links.filter(l => l.status === 'idle').length}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Overall Health</span>
                                    <span className="font-semibold text-blue-600">{((links.filter(l => l.status === 'active').length / links.length) * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
        </div>
    );
};

export default Analytics;