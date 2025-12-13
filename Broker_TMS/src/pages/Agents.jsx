import { useState, useEffect } from 'react';
import { agentPerformanceData, getLeaderboard } from '../data/agentPerformance';
import { Users, TrendingUp, DollarSign, Target, Award, BarChart3, Plus, Pencil, Trash2, X, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useAPIPlaceholder } from '../hooks/useAPIPlaceholder';

const Agents = () => {
    const { isAdmin } = useAuth();
    const api = useAPIPlaceholder();

    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [sortBy, setSortBy] = useState('totalRevenue');

    const leaderboard = getLeaderboard(sortBy);

    // Load agents
    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        const result = await api.fetchAgents({ status: 'Active' });
        if (result.success) {
            setAgents(result.data);
        }
        setLoading(false);
    };

    // Prepare data for comparison chart
    const chartData = agentPerformanceData.map(agent => ({
        name: agent.agentName.split(' ')[0],
        Revenue: agent.totalRevenue / 1000, // Convert to K
        Customers: agent.customersAdded,
        Leads: agent.leadsAdded,
        Loads: agent.loadsBooked,
    }));

    const performanceMetrics = [
        { label: 'Total Revenue', key: 'totalRevenue', icon: DollarSign, color: 'blue' },
        { label: 'Conversions', key: 'conversions', icon: TrendingUp, color: 'green' },
        { label: 'Customers Added', key: 'customersAdded', icon: Users, color: 'purple' },
        { label: 'Leads Added', key: 'leadsAdded', icon: Target, color: 'orange' },
    ];

    const handleEdit = (agent) => {
        setEditingAgent(agent);
    };

    const handleDelete = async (agent) => {
        const result = await api.deleteAgent(agent.id);
        if (result.success) {
            setAgents(prev => prev.filter(a => a.id !== agent.id));
        } else {
            alert(result.error);
        }
    };

    const handleSaveAgent = (savedAgent) => {
        if (editingAgent) {
            setAgents(prev => prev.map(a => a.id === savedAgent.id ? savedAgent : a));
        } else {
            setAgents(prev => [...prev, savedAgent]);
        }
        setShowAddModal(false);
        setEditingAgent(null);
    };

    // If not admin, show access restricted message
    if (!isAdmin()) {
        return (
            <div className="space-y-6">
                {/* Access Restricted Message */}
                <div className="bg-[#111827] p-12 rounded-xl border border-gray-800 text-center">
                    <ShieldAlert size={64} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-4">
                        Agent Management is only accessible to administrators.
                    </p>
                    <p className="text-sm text-gray-500">
                        Please contact your administrator for agent-related requests.
                    </p>
                </div>

                {/* Performance Charts (Agents can still see their own performance) */}
                <PerformanceCharts
                    chartData={chartData}
                    leaderboard={leaderboard}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    performanceMetrics={performanceMetrics}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Agent Management</h1>
                <p className="text-gray-400">Manage agents, commission settings, and performance tracking</p>
            </div>

            {/* Agent Management Table */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Agents</h3>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>Add New Agent</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Phone</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Contract Type</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Commission</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-400">
                                        Loading agents...
                                    </td>
                                </tr>
                            ) : agents.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-400">
                                        No agents found
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr key={agent.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
                                                    {agent.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-medium text-white">{agent.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{agent.email}</td>
                                        <td className="py-3 px-4 text-gray-400">{agent.phone}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${agent.contractType === 'W-2'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                {agent.contractType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">
                                            {agent.company || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-green-400 font-medium">
                                            {agent.commission}%
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs ${agent.status === 'Active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(agent)}
                                                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(agent)}
                                                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Charts */}
            <PerformanceCharts
                chartData={chartData}
                leaderboard={leaderboard}
                sortBy={sortBy}
                setSortBy={setSortBy}
                performanceMetrics={performanceMetrics}
            />

            {/* Add/Edit Agent Modal */}
            {(showAddModal || editingAgent) && (
                <AgentModal
                    agent={editingAgent}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingAgent(null);
                    }}
                    onSave={handleSaveAgent}
                />
            )}
        </div>
    );
};

// Performance Charts Component (extracted for reuse)
const PerformanceCharts = ({ chartData, leaderboard, sortBy, setSortBy, performanceMetrics }) => {
    return (
        <>
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {agentPerformanceData.map((agent) => (
                    <div
                        key={agent.agentId}
                        className="bg-[#111827] p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white">
                                {agent.agentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{agent.agentName}</h3>
                                <p className="text-xs text-gray-400">{agent.activeCustomers} Active Customers</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Revenue</span>
                                <span className="text-white font-semibold">${(agent.totalRevenue / 1000).toFixed(0)}K</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Conversion</span>
                                <span className="text-green-400 font-semibold">{agent.conversions}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Follow-Up Rate</span>
                                <span className="text-blue-400 font-semibold">{agent.followUpRate}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Comparison Chart */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-6">Agent Performance Comparison</h3>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                            />
                            <Bar dataKey="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Customers" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Leads" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Loads" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-sm text-gray-400">Revenue ($K)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span className="text-sm text-gray-400">Customers</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-orange-500"></div>
                        <span className="text-sm text-gray-400">Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-purple-500"></div>
                        <span className="text-sm text-gray-400">Loads</span>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Performance Leaderboard</h3>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="totalRevenue">Total Revenue</option>
                        <option value="conversions">Conversion Rate</option>
                        <option value="customersAdded">Customers Added</option>
                        <option value="leadsAdded">Leads Added</option>
                        <option value="loadsBooked">Loads Booked</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {leaderboard.map((agent, index) => (
                        <div
                            key={agent.agentId}
                            className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
                        >
                            {/* Rank Badge */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50' :
                                    index === 1 ? 'bg-gray-400/20 text-gray-300 border-2 border-gray-400/50' :
                                        'bg-gray-700 text-gray-400'
                                }`}>
                                {index === 0 ? '🏆' : index + 1}
                            </div>

                            {/* Agent Info */}
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">{agent.agentName}</h4>
                                <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                    <span>💰 ${(agent.totalRevenue / 1000).toFixed(0)}K</span>
                                    <span>👥 {agent.customersAdded} Customers</span>
                                    <span>🎯 {agent.leadsAdded} Leads</span>
                                    <span>📦 {agent.loadsBooked} Loads</span>
                                </div>
                            </div>

                            {/* Metric Value */}
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                    {sortBy === 'totalRevenue' ? `$${(agent[sortBy] / 1000).toFixed(0)}K` :
                                        sortBy === 'conversions' || sortBy === 'followUpRate' ? `${agent[sortBy]}%` :
                                            agent[sortBy]}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {performanceMetrics.find(m => m.key === sortBy)?.label || sortBy}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Metrics Table */}
            <div className="bg-[#111827] p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-6">Detailed Performance Metrics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Loads</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Customers</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Leads</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Conversion</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Avg Revenue</th>
                                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Follow-Up</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentPerformanceData.map((agent) => (
                                <tr key={agent.agentId} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
                                                {agent.agentName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-medium text-white">{agent.agentName}</span>
                                        </div>
                                    </td>
                                    <td className="text-center py-3 px-4 text-white">{agent.loadsBooked}</td>
                                    <td className="text-center py-3 px-4 text-white">{agent.customersAdded}</td>
                                    <td className="text-center py-3 px-4 text-white">{agent.leadsAdded}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                                            {agent.conversions}%
                                        </span>
                                    </td>
                                    <td className="text-center py-3 px-4 text-white">${agent.avgRevenuePerCustomer.toLocaleString()}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                            {agent.followUpRate}%
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4 font-semibold text-white">
                                        ${(agent.totalRevenue / 1000).toFixed(0)}K
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

// Agent Modal Component
const AgentModal = ({ agent, onClose, onSave }) => {
    const api = useAPIPlaceholder();
    const [formData, setFormData] = useState({
        name: agent?.name || '',
        email: agent?.email || '',
        phone: agent?.phone || '',
        contractType: agent?.contractType || 'W-2',
        company: agent?.company || '',
        commission: agent?.commission || '',
        status: agent?.status || 'Active',
        territory: agent?.territory || '',
        notes: agent?.notes || ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Clear company field when switching to W-2
        if (field === 'contractType' && value === 'W-2') {
            setFormData(prev => ({ ...prev, company: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.commission) newErrors.commission = 'Commission rate is required';
        else if (formData.commission < 0 || formData.commission > 100) {
            newErrors.commission = 'Commission must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        const submitData = {
            ...formData,
            commission: parseFloat(formData.commission)
        };

        let result;
        if (agent) {
            result = await api.updateAgent(agent.id, submitData);
        } else {
            result = await api.createAgent(submitData);
        }

        setSaving(false);

        if (result.success) {
            onSave(result.data);
        }
    };

    const showCompanyField = formData.contractType === '1099';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#111827]">
                    <h2 className="text-2xl font-bold">{agent ? 'Edit Agent' : 'Add New Agent'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                            />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Phone <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className={`w-full bg-gray-900 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                            />
                            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Contract Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.contractType}
                                onChange={(e) => handleChange('contractType', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="W-2">W-2</option>
                                <option value="1099">1099</option>
                            </select>
                        </div>
                    </div>

                    {showCompanyField && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="Company name for 1099 contractors"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Commission Rate (%) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.commission}
                                onChange={(e) => handleChange('commission', e.target.value)}
                                className={`w-full bg-gray-900 border ${errors.commission ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                min="0"
                                max="100"
                                step="0.1"
                            />
                            {errors.commission && <p className="text-red-400 text-sm mt-1">{errors.commission}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Territory</label>
                        <input
                            type="text"
                            value={formData.territory}
                            onChange={(e) => handleChange('territory', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g., Northeast, Southwest, All"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            rows="3"
                            placeholder="Optional notes about this agent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : agent ? 'Update Agent' : 'Add Agent'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Agents;
