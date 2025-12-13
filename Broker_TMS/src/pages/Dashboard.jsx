import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import KPIBox from '../components/KPIBox';
import CRMWidget from '../components/CRMWidget';
import ProfitAnalytics from '../components/ProfitAnalytics';
import ProfitSplitChart from '../components/ProfitSplitChart';
import { DollarSign, TrendingUp, Truck, Users, Phone, Target, BarChart3, TrendingDown, Briefcase, PiggyBank } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { revenueData, expenseBreakdownData, loadVolumeData } from '../data/analytics';
import { loadsData } from '../data/accounting';
import { calculateGrossProfit, calculateAgentPay, aggregateProfitSplit, formatCurrency } from '../lib/financePro';

const Dashboard = () => {
    const { isAgent, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Redirect agents to their portal
    useEffect(() => {
        if (isAgent()) {
            navigate('/agent-portal');
        }
    }, [isAgent, navigate]);
    // KPI Data
    const kpiData = [
        { title: 'Total Revenue', value: '$847K', icon: DollarSign, trend: 12.5, color: 'blue' },
        { title: 'Active Loads', value: '156', icon: TrendingUp, trend: 8.3, color: 'green' },
        { title: 'Fleet Size', value: '89', icon: Truck, trend: -2.1, color: 'purple' },
        { title: 'Customers', value: '234', icon: Users, trend: 15.7, color: 'orange' },
    ];

    // Calculate commission-based profit metrics
    const totalGross = loadsData.reduce((sum, load) => {
        return sum + calculateGrossProfit(load.customerRate, load.carrierRate);
    }, 0);

    const totalCommission = loadsData.reduce((sum, load) => {
        const gross = calculateGrossProfit(load.customerRate, load.carrierRate);
        return sum + calculateAgentPay(gross, load.commission);
    }, 0);

    const totalNet = totalGross - totalCommission;

    // Profit split data for chart
    const profitSplitData = aggregateProfitSplit(loadsData);

    // CRM Analytics Data
    const crmData = [
        { title: 'Active Leads', value: '47', icon: Target, color: 'blue' },
        { title: 'Follow-Ups', value: '28', icon: Phone, color: 'green' },
        { title: 'Prospects', value: '63', icon: BarChart3, color: 'purple' },
        { title: 'Conversion Rate', value: '34%', icon: TrendingDown, color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome to BrokerFlow Pro TMS & CRM</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiData.map((kpi, index) => (
                    <KPIBox key={index} {...kpi} />
                ))}
            </div>

            {/* Admin-Only Profit Analytics */}
            {isAdmin() && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Financial Intelligence</h2>
                    <ProfitAnalytics accountingData={loadsData} />
                </div>
            )}

            {/* Admin-Only Commission & Net Profit KPIs */}
            {isAdmin() && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Commission & Net Profit Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Gross Profit */}
                        <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <DollarSign className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-400">Gross Profit</h3>
                                    <p className="text-xs text-gray-500">Before Commissions</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-green-400">
                                {formatCurrency(totalGross)}
                            </p>
                        </div>

                        {/* Agent Commissions */}
                        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/10 border border-yellow-500/20 p-6 rounded-xl hover:border-yellow-500/40 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-yellow-500/20 rounded-lg">
                                    <Briefcase className="text-yellow-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-400">Agent Commissions</h3>
                                    <p className="text-xs text-gray-500">Total Paid to Agents</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-yellow-400">
                                {formatCurrency(totalCommission)}
                            </p>
                        </div>

                        {/* Net Profit */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <PiggyBank className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-gray-400">Net Profit</h3>
                                    <p className="text-xs text-gray-500">After Commissions</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-blue-400">
                                {formatCurrency(totalNet)}
                            </p>
                        </div>
                    </div>

                    {/* Profit Split Chart */}
                    <ProfitSplitChart data={profitSplitData} />
                </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-6">Revenue Trend (6 Months)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expense Breakdown */}
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdownData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {expenseBreakdownData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Load Volume & CRM Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Load Volume */}
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-6">Weekly Load Volume</h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={loadVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#374151', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="loads" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CRM Analytics Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">CRM Analytics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {crmData.map((crm, index) => (
                            <CRMWidget key={index} {...crm} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
