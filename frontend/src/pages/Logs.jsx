import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar is imported
import { getAllLinks, getAllLogs } from '../services/api'; // Assuming the exported functions are in a separate api file

const Logs = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [logsData, linksData] = await Promise.all([
                    getAllLogs(),
                    getAllLinks()
                ]);
                setLogs(logsData.data);
                setLinks(linksData.data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mock data if API not available - replace with real data from useEffect
    const mockLogs = [
        {
            id: 1,
            timestamp: '2025-10-27 14:30:22',
            link_id: 1,
            level: 'info',
            message: 'Link established successfully. Bandwidth allocated: 100 Mbps.'
        },
        {
            id: 2,
            timestamp: '2025-10-27 13:45:10',
            link_id: 2,
            level: 'warn',
            message: 'High latency detected: 45 ms. Monitoring initiated.'
        },
        {
            id: 3,
            timestamp: '2025-10-27 12:20:05',
            link_id: 3,
            level: 'error',
            message: 'Connection timeout. Retrying in 30 seconds.'
        },
        {
            id: 4,
            timestamp: '2025-10-27 11:55:33',
            link_id: 4,
            level: 'info',
            message: 'Maintenance mode activated. Scheduled downtime: 15 min.'
        },
        {
            id: 5,
            timestamp: '2025-10-27 10:10:47',
            link_id: 5,
            level: 'info',
            message: 'Signal strength optimal at 85%. No issues detected.'
        },
        {
            id: 6,
            timestamp: '2025-10-27 09:30:15',
            link_id: 1,
            level: 'error',
            message: 'Packet loss detected: 2%. Alert sent to admin.'
        },
        {
            id: 7,
            timestamp: '2025-10-27 08:45:29',
            link_id: 2,
            level: 'info',
            message: 'Firmware update completed successfully.'
        },
        {
            id: 8,
            timestamp: '2025-10-27 07:20:11',
            link_id: 3,
            level: 'warn',
            message: 'Temperature threshold exceeded. Cooling activated.'
        }
    ];

    const mockLinks = [
        { id: 1, client_name: 'Primary VoIP Link' },
        { id: 2, client_name: 'Secondary Data Link' },
        { id: 3, client_name: 'Backup Fiber Optic' },
        { id: 4, client_name: 'Wireless Bridge' },
        { id: 5, client_name: 'Satellite Uplink' }
    ];

    // Use mock data for demo; replace with real data from state
    const allLogs = logs.length > 0 ? logs : mockLogs;
    const allLinks = links.length > 0 ? links : mockLinks;

    // Map logs with linkName
    const enrichedLogs = allLogs.map(log => ({
        ...log,
        linkName: allLinks.find(l => l.id === log.link_id)?.client_name || 'System'
    }));

    const filteredLogs = enrichedLogs.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) &&
        log.linkName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedLevel === 'all' || log.level === selectedLevel) &&
        (!startDate || new Date(log.timestamp) >= new Date(startDate + 'T00:00:00')) &&
        (!endDate || new Date(log.timestamp) <= new Date(endDate + 'T23:59:59.999Z'))
    );

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedLevel('all');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            case 'warn': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Pagination items logic
    const getPaginationItems = () => {
        const items = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            items.push(1);
            if (currentPage > 3) {
                items.push('...');
            }
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) {
                items.push(i);
            }
            if (currentPage < totalPages - 2) {
                items.push('...');
            }
            items.push(totalPages);
        }
        return items;
    };

    const paginationItems = getPaginationItems();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="flex flex-1">
                    <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                    <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-lg font-semibold text-gray-700">Loading logs...</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            <div className="flex flex-1">
                <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                
                <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
                                <p className="text-gray-600 mt-1">View and filter detailed logs for all communication links.</p>
                            </div>
                            <div className="flex space-x-3">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                                    Download Logs
                                </button>
                                <button 
                                    onClick={clearFilters}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Logs</label>
                                <input
                                    type="text"
                                    placeholder="Search by message or link name..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => {
                                        setSelectedLevel(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="success">Success</option>
                                    <option value="info">Info</option>
                                    <option value="warn">Warn</option>
                                    <option value="error">Error</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        handleFilterChange();
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(log.timestamp)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{log.linkName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(log.level)}`}>
                                                    {log.level.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{log.message}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900">View Details</button>
                                                <button className="text-green-600 hover:text-green-900">Share</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredLogs.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredLogs.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 mt-0 rounded-b-xl">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(indexOfLastLog, filteredLogs.length)}</span> of{' '}
                                        <span className="font-medium">{filteredLogs.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {paginationItems.map((pageNum, index) => (
                                            <React.Fragment key={index}>
                                                {pageNum === '...' ? (
                                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            currentPage === pageNum
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            
        </div>
    );
};

export default Logs;