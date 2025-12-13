import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/auth';
import { crmAPI } from '../api/crmAPI';
import { Users, TrendingUp, DollarSign, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AgentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        const currentUser = await auth.getCurrentUser();

        if (!currentUser || currentUser.user_metadata?.role !== 'agent') {
            navigate('/tms-login');
            return;
        }

        setUser(currentUser);

        // Fetch only agent's opportunities
        const result = await crmAPI.fetchOpportunities({ created_by: currentUser.id });
        if (result.success) {
            setOpportunities(result.data);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const stats = {
        total: opportunities.length,
        open: opportunities.filter(o => o.status === 'new' || o.status === 'contacted').length,
        closed: opportunities.filter(o => o.status === 'closed-won').length,
        totalValue: opportunities.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0)
    };

    const monthlyData = [
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 0 },
        { month: 'Mar', count: 0 },
        { month: 'Apr', count: 0 },
        { month: 'May', count: 0 },
        { month: 'Jun', count: 0 }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user?.user_metadata?.name || user?.email}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Users className="text-blue-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Total Opportunities</p>
                    </div>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Open Opportunities</p>
                    </div>
                    <p className="text-3xl font-bold">{stats.open}</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Award className="text-purple-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Closed Won</p>
                    </div>
                    <p className="text-3xl font-bold">{stats.closed}</p>
                </div>

                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <DollarSign className="text-yellow-400" size={24} />
                        </div>
                        <p className="text-gray-400 text-sm">Total Value</p>
                    </div>
                    <p className="text-3xl font-bold">${stats.totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-400" />
                    Monthly Performance
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Opportunities */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Your Recent Opportunities</h3>
                {opportunities.length === 0 ? (
                    <p className="text-center py-8 text-gray-400">No opportunities yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Value</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {opportunities.slice(0, 10).map((opp) => (
                                    <tr key={opp.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                                        <td className="py-3 px-4">{opp.title}</td>
                                        <td className="py-3 px-4 text-gray-400">{opp.customer_name || 'N/A'}</td>
                                        <td className="text-center py-3 px-4 text-green-400">
                                            ${parseFloat(opp.value || 0).toLocaleString()}
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${opp.status === 'closed-won' ? 'bg-green-500/20 text-green-400' :
                                                    opp.status === 'closed-lost' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {opp.status}
                                            </span>
                                        </td>
                                        <td className="text-center py-3 px-4 text-gray-400 text-sm">
                                            {new Date(opp.created_at).toLocaleDateString()}
                                        </td>
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

export default AgentDashboard;
