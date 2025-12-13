import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Filter, ChevronUp, ChevronDown, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { crmAPI } from '../api/crmAPI';
import { agentsData } from '../data/agents';

const STAGES = ['Prospect', 'Lead', 'Qualified', 'Customer', 'Repeat'];
const stageAllowsCarrierAndLoad = (stage) => stage === 'Customer' || stage === 'Repeat';
const stageAllowsRate = (stage) => stage === 'Qualified' || stage === 'Customer' || stage === 'Repeat';

const CRM = () => {
    const { currentUser, isAdmin } = useAuth();

    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllAgents, setShowAllAgents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('All');
    const [agentFilter, setAgentFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showNewModal, setShowNewModal] = useState(false);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Load opportunities
    useEffect(() => {
        loadOpportunities();
    }, [currentUser, showAllAgents]);

    const loadOpportunities = async () => {
        setLoading(true);
        const filters = {};

        // Role-based filtering
        if (!isAdmin() || !showAllAgents) {
            filters.agentId = currentUser.id;
        }

        const result = await crmAPI.fetchOpportunities(filters);
        if (result.success) {
            setOpportunities(result.data);
        }
        setLoading(false);
    };

    // Filter and sort opportunities
    const filteredOpportunities = useMemo(() => {
        let filtered = [...opportunities];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(opp =>
                opp.customerName.toLowerCase().includes(searchLower) ||
                opp.contactEmail.toLowerCase().includes(searchLower)
            );
        }

        // Stage filter
        if (stageFilter !== 'All') {
            filtered = filtered.filter(opp => opp.stage === stageFilter);
        }

        // Agent filter
        if (agentFilter !== 'All') {
            filtered = filtered.filter(opp => opp.agent === agentFilter);
        }

        // Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle null/empty values
                if (!aVal) aVal = '';
                if (!bVal) bVal = '';

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [opportunities, searchTerm, stageFilter, agentFilter, sortConfig]);

    // Get stage counts
    const stageCounts = useMemo(() => {
        const counts = {};
        STAGES.forEach(stage => {
            counts[stage] = opportunities.filter(opp => opp.stage === stage).length;
        });
        return counts;
    }, [opportunities]);

    // Handle sorting
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Handle inline edit
    const startEdit = (oppId, field, currentValue) => {
        setEditingCell({ oppId, field });
        setEditValue(currentValue || '');
    };

    const saveEdit = async (oppId) => {
        if (!editingCell) return;

        // Get current opportunity for full data
        const currentOpp = opportunities.find(o => o.id === oppId);
        const updates = { ...currentOpp, [editingCell.field]: editValue };
        const result = await crmAPI.updateOpportunity(oppId, updates);

        if (result.success) {
            setOpportunities(prev =>
                prev.map(opp => opp.id === oppId ? result.data : opp)
            );
        }

        setEditingCell(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    // Handle delete
    const handleDelete = async (oppId) => {
        if (!confirm('Are you sure you want to delete this opportunity?')) return;

        const result = await crmAPI.deleteOpportunity(oppId);
        if (result.success) {
            setOpportunities(prev => prev.filter(opp => opp.id !== oppId));
        }
    };

    // Get unique agents for filter
    const uniqueAgents = useMemo(() => {
        return [...new Set(opportunities.map(opp => opp.agent))];
    }, [opportunities]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-50" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">CRM - Opportunities</h1>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <span>Total: <strong className="text-white">{filteredOpportunities.length}</strong></span>
                        <span>Prospect: <strong className="text-blue-400">{stageCounts.Prospect || 0}</strong></span>
                        <span>Lead: <strong className="text-yellow-400">{stageCounts.Lead || 0}</strong></span>
                        <span>Qualified: <strong className="text-purple-400">{stageCounts.Qualified || 0}</strong></span>
                        <span>Customer: <strong className="text-green-400">{stageCounts.Customer || 0}</strong></span>
                        <span>Repeat: <strong className="text-cyan-400">{stageCounts.Repeat || 0}</strong></span>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {isAdmin() && (
                        <button
                            onClick={() => setShowAllAgents(!showAllAgents)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${showAllAgents
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <Filter size={18} />
                            <span>{showAllAgents ? 'All Agents' : 'My Opportunities'}</span>
                        </button>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search opportunities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>New Opportunity</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="All">All Stages</option>
                    {STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                    ))}
                </select>
                <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="All">All Agents</option>
                    {uniqueAgents.map(agent => (
                        <option key={agent} value={agent}>{agent}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-900/50">
                                <th
                                    onClick={() => handleSort('customerName')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Customer Name
                                        <SortIcon column="customerName" />
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort('contactEmail')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Contact Email
                                        <SortIcon column="contactEmail" />
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Carrier</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Load ID</th>
                                <th
                                    onClick={() => handleSort('stage')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Stage
                                        <SortIcon column="stage" />
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort('rate')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Rate
                                        <SortIcon column="rate" />
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort('agent')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Agent
                                        <SortIcon column="agent" />
                                    </div>
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-400">
                                        Loading opportunities...
                                    </td>
                                </tr>
                            ) : filteredOpportunities.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-400">
                                        No opportunities found
                                    </td>
                                </tr>
                            ) : (
                                filteredOpportunities.map((opp) => (
                                    <OpportunityRow
                                        key={opp.id}
                                        opportunity={opp}
                                        editingCell={editingCell}
                                        editValue={editValue}
                                        onStartEdit={startEdit}
                                        onSaveEdit={saveEdit}
                                        onCancelEdit={cancelEdit}
                                        onEditValueChange={setEditValue}
                                        onDelete={handleDelete}
                                        canEdit={isAdmin() || opp.agentId === currentUser.id}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Opportunity Modal */}
            {showNewModal && (
                <NewOpportunityModal
                    onClose={() => setShowNewModal(false)}
                    onSave={(newOpp) => {
                        setOpportunities(prev => [...prev, newOpp]);
                        setShowNewModal(false);
                    }}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

// Opportunity Row Component
const OpportunityRow = ({
    opportunity,
    editingCell,
    editValue,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onEditValueChange,
    onDelete,
    canEdit
}) => {
    const isEditing = (field) => editingCell?.oppId === opportunity.id && editingCell?.field === field;
    const showCarrierLoad = stageAllowsCarrierAndLoad(opportunity.stage);
    const showRate = stageAllowsRate(opportunity.stage);

    const handleKeyDown = (e, oppId) => {
        if (e.key === 'Enter') {
            onSaveEdit(oppId);
        } else if (e.key === 'Escape') {
            onCancelEdit();
        }
    };

    const getStageColor = (stage) => {
        const colors = {
            Prospect: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            Lead: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            Qualified: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            Customer: 'bg-green-500/20 text-green-400 border-green-500/30',
            Repeat: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        };
        return colors[stage] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    return (
        <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group">
            <td className="py-3 px-4 text-white font-medium">{opportunity.customerName}</td>
            <td className="py-3 px-4 text-gray-400">{opportunity.contactEmail}</td>
            <td className="py-3 px-4">
                {showCarrierLoad ? (
                    isEditing('carrier') ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            onBlur={() => onSaveEdit(opportunity.id)}
                            onKeyDown={(e) => handleKeyDown(e, opportunity.id)}
                            className="bg-gray-800 border border-blue-500 rounded px-2 py-1 text-white text-sm w-full focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => canEdit && onStartEdit(opportunity.id, 'carrier', opportunity.carrier)}
                            className={`text-gray-300 ${canEdit ? 'cursor-pointer hover:text-white' : ''}`}
                        >
                            {opportunity.carrier || '-'}
                        </span>
                    )
                ) : (
                    <span className="text-gray-600">-</span>
                )}
            </td>
            <td className="py-3 px-4">
                {showCarrierLoad ? (
                    isEditing('loadId') ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            onBlur={() => onSaveEdit(opportunity.id)}
                            onKeyDown={(e) => handleKeyDown(e, opportunity.id)}
                            className="bg-gray-800 border border-blue-500 rounded px-2 py-1 text-white text-sm w-full focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => canEdit && onStartEdit(opportunity.id, 'loadId', opportunity.loadId)}
                            className={`text-gray-300 ${canEdit ? 'cursor-pointer hover:text-white' : ''}`}
                        >
                            {opportunity.loadId || '-'}
                        </span>
                    )
                ) : (
                    <span className="text-gray-600">-</span>
                )}
            </td>
            <td className="py-3 px-4">
                {isEditing('stage') ? (
                    <select
                        value={editValue}
                        onChange={(e) => onEditValueChange(e.target.value)}
                        onBlur={() => onSaveEdit(opportunity.id)}
                        className="bg-gray-800 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                        autoFocus
                    >
                        {STAGES.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                ) : (
                    <span
                        onClick={() => canEdit && onStartEdit(opportunity.id, 'stage', opportunity.stage)}
                        className={`inline-block px-2 py-1 rounded text-xs border ${getStageColor(opportunity.stage)} ${canEdit ? 'cursor-pointer' : ''}`}
                    >
                        {opportunity.stage}
                    </span>
                )}
            </td>
            <td className="py-3 px-4">
                {showRate ? (
                    isEditing('rate') ? (
                        <input
                            type="number"
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            onBlur={() => onSaveEdit(opportunity.id)}
                            onKeyDown={(e) => handleKeyDown(e, opportunity.id)}
                            className="bg-gray-800 border border-blue-500 rounded px-2 py-1 text-white text-sm w-24 focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => canEdit && onStartEdit(opportunity.id, 'rate', opportunity.rate)}
                            className={`text-green-400 font-medium ${canEdit ? 'cursor-pointer hover:text-green-300' : ''}`}
                        >
                            {opportunity.rate ? `$${opportunity.rate.toLocaleString()}` : '-'}
                        </span>
                    )
                ) : (
                    <span className="text-gray-600">-</span>
                )}
            </td>
            <td className="py-3 px-4 text-gray-300">{opportunity.agent}</td>
            <td className="py-3 px-4 text-right">
                {canEdit && (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onDelete(opportunity.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

// New Opportunity Modal Component
const NewOpportunityModal = ({ onClose, onSave, currentUser }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        contactEmail: '',
        stage: 'Prospect',
        carrier: '',
        loadId: '',
        rate: '',
        agentId: currentUser.id,
        agent: currentUser.name
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const showCarrierLoad = stageAllowsCarrierAndLoad(formData.stage);
    const showRate = stageAllowsRate(formData.stage);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Handle agent selection
        if (field === 'agentId') {
            const selectedAgent = agentsData.find(a => a.id === parseInt(value));
            if (selectedAgent) {
                setFormData(prev => ({ ...prev, agentId: selectedAgent.id, agent: selectedAgent.name }));
            }
        }

        // Clear conditional fields when stage changes
        if (field === 'stage') {
            if (!stageAllowsCarrierAndLoad(value)) {
                setFormData(prev => ({ ...prev, carrier: '', loadId: '' }));
            }
            if (!stageAllowsRate(value)) {
                setFormData(prev => ({ ...prev, rate: '' }));
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Invalid email format';
        }
        if (!formData.stage) newErrors.stage = 'Stage is required';
        if (!formData.agentId) newErrors.agent = 'Agent is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        const submitData = {
            customerName: formData.customerName,
            contactEmail: formData.contactEmail,
            stage: formData.stage,
            carrierName: formData.carrier || '',
            loadId: formData.loadId || null,
            rate: formData.rate ? parseFloat(formData.rate) : null,
            agentId: formData.agentId,
            agentName: formData.agent
        };

        const result = await crmAPI.createOpportunity(submitData);
        setSaving(false);

        if (result.success) {
            onSave(result.data);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#111827]">
                    <h2 className="text-2xl font-bold">New Opportunity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Customer Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => handleChange('customerName', e.target.value)}
                            className={`w-full bg-gray-900 border ${errors.customerName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                        />
                        {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Contact Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className={`w-full bg-gray-900 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                        />
                        {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Stage <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.stage}
                            onChange={(e) => handleChange('stage', e.target.value)}
                            className={`w-full bg-gray-900 border ${errors.stage ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                        >
                            {STAGES.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                        {errors.stage && <p className="text-red-400 text-sm mt-1">{errors.stage}</p>}
                    </div>

                    {showCarrierLoad && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Carrier</label>
                                <input
                                    type="text"
                                    value={formData.carrier}
                                    onChange={(e) => handleChange('carrier', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Load ID</label>
                                <input
                                    type="text"
                                    value={formData.loadId}
                                    onChange={(e) => handleChange('loadId', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {showRate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Rate ($)</label>
                            <input
                                type="number"
                                value={formData.rate}
                                onChange={(e) => handleChange('rate', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Agent <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.agentId}
                            onChange={(e) => handleChange('agentId', e.target.value)}
                            className={`w-full bg-gray-900 border ${errors.agent ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                        >
                            {agentsData.filter(a => a.status === 'Active').map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                        {errors.agent && <p className="text-red-400 text-sm mt-1">{errors.agent}</p>}
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
                            {saving ? 'Saving...' : 'Save Opportunity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CRM;
