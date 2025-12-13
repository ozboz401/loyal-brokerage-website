import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Download, ChevronUp, ChevronDown, Pencil, Trash2, X, Truck, DollarSign, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loadsAPI } from '../api/loadsAPI';
import { LOAD_STATUSES, EQUIPMENT_TYPES, calculateGrossProfit, calculateProfitMargin } from '../data/loads';
import { agentsData } from '../data/agents';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { calculateTripDistance } from '../utils/calculateDistance';

const Loads = () => {
    const { currentUser, isAdmin } = useAuth();

    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllAgents, setShowAllAgents] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [equipmentFilter, setEquipmentFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingLoad, setEditingLoad] = useState(null);

    // Load loads data
    useEffect(() => {
        loadLoads();
    }, [currentUser, showAllAgents]);

    const loadLoads = async () => {
        setLoading(true);
        const filters = {};

        // Role-based filtering
        if (!isAdmin() || !showAllAgents) {
            filters.agentId = currentUser.id;
        }

        const result = await loadsAPI.fetchLoads(filters);
        if (result.success) {
            setLoads(result.data);
        }
        setLoading(false);
    };

    // Filter and sort loads
    const filteredLoads = useMemo(() => {
        let filtered = [...loads];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(load =>
                load.customerName.toLowerCase().includes(searchLower) ||
                load.carrierName.toLowerCase().includes(searchLower) ||
                load.id.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (statusFilter !== 'All') {
            filtered = filtered.filter(load => load.status === statusFilter);
        }

        // Equipment filter
        if (equipmentFilter !== 'All') {
            filtered = filtered.filter(load => load.equipmentType === equipmentFilter);
        }

        // Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

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
    }, [loads, searchTerm, statusFilter, equipmentFilter, sortConfig]);

    // Get status counts
    const statusCounts = useMemo(() => {
        const counts = {};
        LOAD_STATUSES.forEach(status => {
            counts[status] = loads.filter(load => load.status === status).length;
        });
        return counts;
    }, [loads]);

    // Handle sorting
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Handle delete
    const handleDelete = async (loadId) => {
        if (!confirm('Are you sure you want to delete this load?')) return;

        const result = await loadsAPI.deleteLoad(loadId);
        if (result.success) {
            setLoads(prev => prev.filter(load => load.id !== loadId));
        }
    };

    // Handle edit
    const handleEdit = (load) => {
        setEditingLoad(load);
        setShowAddModal(true);
    };

    // Handle CSV export (Admin only)
    const handleExportCSV = () => {
        const headers = ['Load ID', 'Customer', 'Carrier', 'Pickup', 'Delivery', 'Rate', 'Carrier Cost', 'Gross Profit', 'Distance (mi)', 'Status', 'Equipment', 'Agent', 'Date'];
        const rows = filteredLoads.map(load => [
            load.id,
            load.customerName,
            load.carrierName,
            load.pickupAddress,
            load.deliveryAddress,
            load.rate,
            load.carrierCost,
            calculateGrossProfit(load.rate, load.carrierCost),
            load.tripDistance,
            load.status,
            load.equipmentType,
            load.agentName,
            load.createdDate
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loads_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-50" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            Booked: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            Delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
            Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const getEquipmentColor = (equipment) => {
        const colors = {
            'Dry Van': 'bg-blue-500/20 text-blue-400',
            'Reefer': 'bg-cyan-500/20 text-cyan-400',
            'Flatbed': 'bg-orange-500/20 text-orange-400',
            'Power Only': 'bg-purple-500/20 text-purple-400',
        };
        return colors[equipment] || 'bg-gray-500/20 text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Truck size={32} className="text-blue-400" />
                        Loads Management
                    </h1>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <span>Total: <strong className="text-white">{filteredLoads.length}</strong></span>
                        <span>Pending: <strong className="text-gray-400">{statusCounts.Pending || 0}</strong></span>
                        <span>Booked: <strong className="text-blue-400">{statusCounts.Booked || 0}</strong></span>
                        <span>Delivered: <strong className="text-green-400">{statusCounts.Delivered || 0}</strong></span>
                        <span>Cancelled: <strong className="text-red-400">{statusCounts.Cancelled || 0}</strong></span>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {isAdmin() && (
                        <>
                            <button
                                onClick={() => setShowAllAgents(!showAllAgents)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${showAllAgents
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <span>{showAllAgents ? 'All Loads' : 'My Loads'}</span>
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <Download size={18} />
                                <span>Export CSV</span>
                            </button>
                        </>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search loads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingLoad(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>Add Load</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="All">All Statuses</option>
                    {LOAD_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                    <option value="All">All Equipment</option>
                    {EQUIPMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
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
                                    onClick={() => handleSort('id')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Load ID
                                        <SortIcon column="id" />
                                    </div>
                                </th>
                                <th
                                    onClick={() => handleSort('customerName')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Customer
                                        <SortIcon column="customerName" />
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Carrier</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pickup</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Delivery</th>
                                <th
                                    onClick={() => handleSort('rate')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Rate
                                        <SortIcon column="rate" />
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Distance</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Equipment</th>
                                <th
                                    onClick={() => handleSort('status')}
                                    className="text-left py-3 px-4 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        <SortIcon column="status" />
                                    </div>
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Agent</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-8 text-gray-400">
                                        Loading loads...
                                    </td>
                                </tr>
                            ) : filteredLoads.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-8 text-gray-400">
                                        No loads found
                                    </td>
                                </tr>
                            ) : (
                                filteredLoads.map((load) => (
                                    <tr key={load.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group">
                                        <td className="py-3 px-4 text-blue-400 font-medium">{load.id}</td>
                                        <td className="py-3 px-4 text-white font-medium">{load.customerName}</td>
                                        <td className="py-3 px-4 text-gray-400">{load.carrierName}</td>
                                        <td className="py-3 px-4 text-gray-400 text-xs max-w-xs truncate" title={load.pickupAddress}>
                                            {load.pickupAddress}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400 text-xs max-w-xs truncate" title={load.deliveryAddress}>
                                            {load.deliveryAddress}
                                        </td>
                                        <td className="py-3 px-4 text-green-400 font-medium">
                                            ${load.rate.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">
                                            {load.tripDistance} mi
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 rounded text-xs ${getEquipmentColor(load.equipmentType)}`}>
                                                {load.equipmentType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 rounded text-xs border ${getStatusColor(load.status)}`}>
                                                {load.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">{load.agentName}</td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">{load.createdDate}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(load)}
                                                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(load.id)}
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

            {/* Add/Edit Load Modal */}
            {showAddModal && (
                <AddLoadModal
                    load={editingLoad}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingLoad(null);
                    }}
                    onSave={(savedLoad) => {
                        if (editingLoad) {
                            setLoads(prev => prev.map(l => l.id === savedLoad.id ? savedLoad : l));
                        } else {
                            setLoads(prev => [...prev, savedLoad]);
                        }
                        setShowAddModal(false);
                        setEditingLoad(null);
                    }}
                    currentUser={currentUser}
                    isAdmin={isAdmin()}
                />
            )}
        </div>
    );
};

// Add Load Modal Component
const AddLoadModal = ({ load, onClose, onSave, currentUser, isAdmin }) => {
    const [formData, setFormData] = useState({
        id: load?.id || '',
        customerId: load?.customerId || '',
        customerName: load?.customerName || '',
        carrierId: load?.carrierId || '',
        carrierName: load?.carrierName || '',
        pickupAddress: load?.pickupAddress || '',
        deliveryAddress: load?.deliveryAddress || '',
        rate: load?.rate || '',
        carrierCost: load?.carrierCost || '',
        tripDistance: load?.tripDistance || 0,
        status: load?.status || 'Pending',
        equipmentType: load?.equipmentType || 'Dry Van',
        agentId: load?.agentId || currentUser.id,
        agentName: load?.agentName || currentUser.name,
        appointmentDate: load?.appointmentDate || '',
        referenceNumber: load?.referenceNumber || '',
        notes: load?.notes || ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [calculatingDistance, setCalculatingDistance] = useState(false);

    // Calculate distance when both addresses are filled
    useEffect(() => {
        if (formData.pickupAddress && formData.deliveryAddress && !load) {
            calculateDistance();
        }
    }, [formData.pickupAddress, formData.deliveryAddress]);

    const calculateDistance = async () => {
        setCalculatingDistance(true);
        try {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            const distance = await calculateTripDistance(
                formData.pickupAddress,
                formData.deliveryAddress,
                apiKey
            );
            setFormData(prev => ({ ...prev, tripDistance: distance }));
        } catch (error) {
            console.error('Error calculating distance:', error);
        }
        setCalculatingDistance(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Handle agent selection
        if (field === 'agentId') {
            const selectedAgent = agentsData.find(a => a.id === parseInt(value));
            if (selectedAgent) {
                setFormData(prev => ({ ...prev, agentId: selectedAgent.id, agentName: selectedAgent.name }));
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!formData.carrierName.trim()) newErrors.carrierName = 'Carrier name is required';
        if (!formData.rate) newErrors.rate = 'Rate is required';
        if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
        if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
        if (!formData.agentId) newErrors.agent = 'Agent is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        const submitData = {
            ...formData,
            rate: parseFloat(formData.rate),
            carrierCost: formData.carrierCost ? parseFloat(formData.carrierCost) : 0,
            tripDistance: formData.tripDistance || 0
        };

        let result;
        if (load) {
            result = await loadsAPI.updateLoad(load.id, submitData);
        } else {
            result = await loadsAPI.createLoad(submitData);
        }

        setSaving(false);

        if (result.success) {
            onSave(result.data);
        }
    };

    // Calculate financial metrics
    const grossProfit = formData.rate && formData.carrierCost
        ? calculateGrossProfit(parseFloat(formData.rate), parseFloat(formData.carrierCost))
        : 0;
    const profitMargin = formData.rate && formData.carrierCost
        ? calculateProfitMargin(parseFloat(formData.rate), parseFloat(formData.carrierCost))
        : 0;
    const selectedAgent = agentsData.find(a => a.id === formData.agentId);
    const agentCommission = selectedAgent && grossProfit
        ? (grossProfit * selectedAgent.commission) / 100
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] rounded-xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#111827] z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Truck size={28} className="text-blue-400" />
                        {load ? 'Edit Load' : 'Add New Load'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="off">
                    {/* Section 1: General Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-blue-400" />
                            General Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Load ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.id}
                                    disabled
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Status <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                >
                                    {LOAD_STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Customer Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.customerName}
                                    onChange={(e) => handleChange('customerName', e.target.value)}
                                    autoComplete="off"
                                    className={`w-full bg-gray-900 border ${errors.customerName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                />
                                {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Carrier Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.carrierName}
                                    onChange={(e) => handleChange('carrierName', e.target.value)}
                                    className={`w-full bg-gray-900 border ${errors.carrierName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                />
                                {errors.carrierName && <p className="text-red-400 text-sm mt-1">{errors.carrierName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Rate ($) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="number"
                                        value={formData.rate}
                                        onChange={(e) => handleChange('rate', e.target.value)}
                                        className={`w-full bg-gray-900 border ${errors.rate ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.rate && <p className="text-red-400 text-sm mt-1">{errors.rate}</p>}
                            </div>

                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Carrier Cost ($)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="number"
                                            value={formData.carrierCost}
                                            onChange={(e) => handleChange('carrierCost', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Equipment Type <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.equipmentType}
                                    onChange={(e) => handleChange('equipmentType', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                >
                                    {EQUIPMENT_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Assigned Agent <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.agentId}
                                    onChange={(e) => handleChange('agentId', e.target.value)}
                                    className={`w-full bg-gray-900 border ${errors.agent ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                    disabled={!isAdmin}
                                >
                                    {agentsData.filter(a => a.status === 'Active').map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                                    ))}
                                </select>
                                {errors.agent && <p className="text-red-400 text-sm mt-1">{errors.agent}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Pickup & Delivery */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Truck size={20} className="text-blue-400" />
                            Pickup & Delivery
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <AddressAutocomplete
                                    label="Pickup Address"
                                    value={formData.pickupAddress}
                                    onChange={(address) => handleChange('pickupAddress', address)}
                                    required
                                />
                                {errors.pickupAddress && <p className="text-red-400 text-sm mt-1">{errors.pickupAddress}</p>}
                            </div>

                            <div className="col-span-2">
                                <AddressAutocomplete
                                    label="Delivery Address"
                                    value={formData.deliveryAddress}
                                    onChange={(address) => handleChange('deliveryAddress', address)}
                                    required
                                />
                                {errors.deliveryAddress && <p className="text-red-400 text-sm mt-1">{errors.deliveryAddress}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Appointment Date <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="date"
                                        value={formData.appointmentDate}
                                        onChange={(e) => handleChange('appointmentDate', e.target.value)}
                                        className={`w-full bg-gray-900 border ${errors.appointmentDate ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500`}
                                    />
                                </div>
                                {errors.appointmentDate && <p className="text-red-400 text-sm mt-1">{errors.appointmentDate}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Reference Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.referenceNumber}
                                    onChange={(e) => handleChange('referenceNumber', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="REF-XXX-XXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Trip Distance (miles)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.tripDistance}
                                        disabled
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                                    />
                                    {calculatingDistance && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Auto-calculated from addresses</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                rows="3"
                                placeholder="Optional notes about this load"
                            />
                        </div>
                    </div>

                    {/* Section 3: Financial Summary (Admin only) */}
                    {isAdmin && formData.carrierCost && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <DollarSign size={20} className="text-green-400" />
                                Financial Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Gross Profit</p>
                                    <p className="text-2xl font-bold text-green-400">
                                        ${grossProfit.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Profit Margin</p>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {profitMargin.toFixed(2)}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Agent Commission</p>
                                    <p className="text-2xl font-bold text-purple-400">
                                        ${agentCommission.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {selectedAgent?.commission}% of gross profit
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                            disabled={saving || calculatingDistance}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : load ? 'Update Load' : 'Create Load'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Loads;
