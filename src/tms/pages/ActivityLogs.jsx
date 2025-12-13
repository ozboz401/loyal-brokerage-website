import { useState, useEffect } from 'react';
import { Filter, RefreshCw, FileText, Calendar } from 'lucide-react';
import { activityLogsAPI } from '../api/activityLogsAPI';
import Table from '../components/Table';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        module: '',
        action: '',
        userEmail: '',
        startDate: '',
        endDate: ''
    });
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        const result = await activityLogsAPI.fetchLogs({
            ...filters,
            limit: 100
        });
        if (result.success) {
            setLogs(result.data);
        }
        setLoading(false);
    };

    const handleFilter = () => {
        loadLogs();
    };

    const handleReset = () => {
        setFilters({
            module: '',
            action: '',
            userEmail: '',
            startDate: '',
            endDate: ''
        });
        setTimeout(() => loadLogs(), 100);
    };

    const columns = [
        {
            header: 'Timestamp',
            accessor: 'created_at',
            render: (row) => new Date(row.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        {
            header: 'User',
            accessor: 'user_email',
            render: (row) => row.user_email ? (
                <span className="text-blue-400">{row.user_email}</span>
            ) : (
                <span className="text-gray-500">System</span>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.action === 'create' ? 'bg-green-500/20 text-green-400' :
                        row.action === 'update' ? 'bg-blue-500/20 text-blue-400' :
                            row.action === 'delete' ? 'bg-red-500/20 text-red-400' :
                                row.action === 'export' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-gray-500/20 text-gray-400'
                    }`}>
                    {row.action.toUpperCase()}
                </span>
            )
        },
        {
            header: 'Module',
            accessor: 'module',
            render: (row) => (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs capitalize font-medium">
                    {row.module}
                </span>
            )
        },
        {
            header: 'Record ID',
            accessor: 'record_id',
            render: (row) => row.record_id ? (
                <code className="text-xs bg-gray-800 px-2 py-1 rounded">{row.record_id}</code>
            ) : '-'
        },
        {
            header: 'Details',
            accessor: 'details',
            render: (row) => row.details ? (
                <span className="text-xs text-gray-400" title={JSON.stringify(row.details)}>
                    {JSON.stringify(row.details).substring(0, 40)}...
                </span>
            ) : '-'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
                    <p className="text-gray-400">View system audit trail and activity history</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                    <button
                        onClick={loadLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Filter Logs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Module</label>
                            <select
                                value={filters.module}
                                onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">All Modules</option>
                                <option value="load">Load</option>
                                <option value="customer">Customer</option>
                                <option value="carrier">Carrier</option>
                                <option value="agent">Agent</option>
                                <option value="crm">CRM</option>
                                <option value="accounting">Accounting</option>
                                <option value="settings">Settings</option>
                                <option value="dashboard">Dashboard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Action</label>
                            <select
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="">All Actions</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                                <option value="view">View</option>
                                <option value="export">Export</option>
                                <option value="login">Login</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">User Email</label>
                            <input
                                type="text"
                                value={filters.userEmail}
                                onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Filter by email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleFilter}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <Filter size={18} />
                            Apply Filters
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText size={20} className="text-blue-400" />
                        Activity History
                    </h3>
                    <span className="text-sm text-gray-400">
                        Showing {logs.length} {logs.length === 100 ? '(max)' : ''} entries
                    </span>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-400">Loading activity logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
                        <p className="text-gray-400">No activity logs found</p>
                        <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={logs}
                        actions={[]}
                        onAction={() => { }}
                    />
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
