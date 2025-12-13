import { useAuth } from '../hooks/useAuth';
import { getAgentStats } from '../data/agentDashboard';
import { Target, Users, TrendingUp, DollarSign, Bell, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentPortal = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const stats = getAgentStats(currentUser.id);

    const kpiCards = [
        {
            title: 'My Leads',
            value: stats.leads,
            icon: Target,
            color: 'blue',
            bgGradient: 'from-blue-500/20 to-blue-600/20',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-400'
        },
        {
            title: 'My Customers',
            value: stats.customers,
            icon: Users,
            color: 'green',
            bgGradient: 'from-green-500/20 to-green-600/20',
            iconBg: 'bg-green-500/20',
            iconColor: 'text-green-400'
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversions}%`,
            icon: TrendingUp,
            color: 'purple',
            bgGradient: 'from-purple-500/20 to-purple-600/20',
            iconBg: 'bg-purple-500/20',
            iconColor: 'text-purple-400'
        },
        {
            title: 'Revenue Generated',
            value: `$${(stats.revenue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: 'orange',
            bgGradient: 'from-orange-500/20 to-orange-600/20',
            iconBg: 'bg-orange-500/20',
            iconColor: 'text-orange-400'
        },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lead': return '🎯';
            case 'customer': return '👥';
            case 'followup': return '📞';
            default: return '📋';
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {currentUser.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-400">Here's your performance overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiCards.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${kpi.bgGradient} p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${kpi.iconBg} p-3 rounded-lg`}>
                                    <Icon className={kpi.iconColor} size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">{kpi.title}</p>
                                <p className="text-3xl font-bold text-white">{kpi.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Follow-Ups & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Follow-Ups Due */}
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-500/20 p-2 rounded-lg">
                            <Bell className="text-yellow-400" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Follow-Ups Due</h3>
                            <p className="text-xs text-gray-400">Pending actions</p>
                        </div>
                    </div>
                    <div className="text-center py-6">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.followUps}</div>
                        <p className="text-sm text-gray-400">Customers need attention</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors border border-yellow-600/30">
                        View Follow-Ups
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/crm')}
                            className="flex items-center gap-3 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-lg transition-all group"
                        >
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <Plus className="text-blue-400" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-white">Add New Lead</div>
                                <div className="text-xs text-gray-400">Create a new prospect</div>
                            </div>
                            <ArrowRight className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </button>

                        <button
                            onClick={() => navigate('/customers')}
                            className="flex items-center gap-3 p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-600/30 rounded-lg transition-all group"
                        >
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <Plus className="text-green-400" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-white">Add Customer</div>
                                <div className="text-xs text-gray-400">Onboard new client</div>
                            </div>
                            <ArrowRight className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </button>

                        <button
                            onClick={() => navigate('/crm')}
                            className="flex items-center gap-3 p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-600/30 rounded-lg transition-all group"
                        >
                            <div className="bg-purple-500/20 p-3 rounded-lg">
                                <Target className="text-purple-400" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-white">View CRM Pipeline</div>
                                <div className="text-xs text-gray-400">Manage your leads</div>
                            </div>
                            <ArrowRight className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </button>

                        <button
                            onClick={() => navigate('/customers')}
                            className="flex items-center gap-3 p-4 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-600/30 rounded-lg transition-all group"
                        >
                            <div className="bg-orange-500/20 p-3 rounded-lg">
                                <Users className="text-orange-400" size={20} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-white">My Customers</div>
                                <div className="text-xs text-gray-400">View customer list</div>
                            </div>
                            <ArrowRight className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-white">{activity.action}</div>
                                <div className="text-xs text-gray-400">{activity.company}</div>
                            </div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentPortal;
