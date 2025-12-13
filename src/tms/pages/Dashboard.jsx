import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Package, Users, RefreshCw } from 'lucide-react';
import { dashboardAPI } from '../api/dashboardAPI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        loadsThisMonth: { total_count: 0, total_revenue: 0 },
        receivables: { total_outstanding: 0, count_pending: 0 },
        topCustomers: [],
        topCarriers: [],
        agentLeaderboard: [],
        weeklyRevenue: [],
        loadStatus: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const [loads, receivables, customers, carriers, agents, weekly, status] = await Promise.all([
                dashboardAPI.getLoadsThisMonth(),
                dashboardAPI.getOutstandingReceivables(),
                dashboardAPI.getTopCustomers(5),
                dashboardAPI.getTopCarriers(5),
                dashboardAPI.getAgentLeaderboard(),
                dashboardAPI.getWeeklyRevenue(12),
                dashboardAPI.getLoadStatusBreakdown()
            ]);

            setMetrics({
                loadsThisMonth: loads.data || { total_count: 0, total_revenue: 0 },
                receivables: receivables.data || { total_outstanding: 0, count_pending: 0 },
                topCustomers: customers.data || [],
                topCarriers: carriers.data || [],
                agentLeaderboard: agents.data || [],
                weeklyRevenue: weekly.data || [],
                loadStatus: status.data || []
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
        setLoading(false);
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">Real-time business metrics and analytics</p>
                </div>
                <button
                    onClick={loadDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Package className="text-blue-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Loads This Month</p>
                    </div>
                    <p className="text-3xl font-bold">{metrics.loadsThisMonth.total_count}</p>
                    <p className="text-xs text-gray-500 mt-1">Active shipments</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <DollarSign className="text-green-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Revenue This Month</p>
                    </div>
                    <p className="text-3xl font-bold">${parseFloat(metrics.loadsThisMonth.total_revenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Total billing</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <TrendingUp className="text-yellow-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Outstanding AR</p>
                    </div>
                    <p className="text-3xl font-bold">${parseFloat(metrics.receivables.total_outstanding || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Accounts receivable</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Users className="text-purple-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Pending Invoices</p>
                    </div>
                    <p className="text-3xl font-bold">{metrics.receivables.count_pending}</p>
                    <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Weekly Revenue (Last 12 Weeks)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={metrics.weeklyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="week_label"
                                stroke="#9CA3AF"
                                tickLine={false}
                                axisLine={false}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tickLine={false}
                                axisLine={false}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Load Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={metrics.loadStatus}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.status}: ${entry.count}`}
                                labelLine={false}
                            >
                                {metrics.loadStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Top Customers by Revenue</h3>
                    <div className="space-y-2">
                        {metrics.topCustomers.length === 0 ? (
                            <p className="text-center py-8 text-gray-400">No customer data available</p>
                        ) : (
                            metrics.topCustomers.map((customer, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-blue-400 font-bold text-sm">{idx + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{customer.customer_name}</p>
                                            <p className="text-xs text-gray-500">{customer.load_count} loads</p>
                                        </div>
                                    </div>
                                    <span className="text-green-400 font-semibold">
                                        ${parseFloat(customer.total_revenue || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4">Top Carriers by Volume</h3>
                    <div className="space-y-2">
                        {metrics.topCarriers.length === 0 ? (
                            <p className="text-center py-8 text-gray-400">No carrier data available</p>
                        ) : (
                            metrics.topCarriers.map((carrier, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                            <span className="text-purple-400 font-bold text-sm">{idx + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{carrier.carrier_name}</p>
                                            <p className="text-xs text-gray-500">${parseFloat(carrier.total_cost || 0).toLocaleString()} cost</p>
                                        </div>
                                    </div>
                                    <span className="text-blue-400 font-semibold">
                                        {carrier.load_count} loads
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Agent Leaderboard</h3>
                {metrics.agentLeaderboard.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">No agent data available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Rank</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Loads</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Revenue</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Profit</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Commission %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.agentLeaderboard.map((agent, idx) => (
                                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-blue-400 font-bold text-xs">{idx + 1}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{agent.agent_name}</td>
                                        <td className="text-center py-3 px-4">{agent.total_loads}</td>
                                        <td className="text-center py-3 px-4 text-green-400">
                                            ${parseFloat(agent.total_revenue || 0).toLocaleString()}
                                        </td>
                                        <td className="text-center py-3 px-4 text-blue-400">
                                            ${parseFloat(agent.total_profit || 0).toLocaleString()}
                                        </td>
                                        <td className="text-center py-3 px-4">{agent.commission_rate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
