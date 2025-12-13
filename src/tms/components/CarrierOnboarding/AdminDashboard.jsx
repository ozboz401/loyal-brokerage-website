import React, { useState, useEffect } from 'react';
import { Check, X, FileText, AlertTriangle, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const [carriers, setCarriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Pending, Approved, Rejected
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCarriers();
    }, []);

    const fetchCarriers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/carrier/admin/all');
            const data = await response.json();
            setCarriers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching carriers:', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const endpoint = newStatus === 'Approved' ? '/approve' : '/reject';
        try {
            const response = await fetch(`http://localhost:5000/api/carrier${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                // Optimistic update
                setCarriers(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
            }
        } catch (error) {
            console.error(`Error marking carrier as ${newStatus}:`, error);
        }
    };

    const filteredCarriers = carriers.filter(carrier => {
        const matchesFilter = filter === 'All' || carrier.status === filter;
        const matchesSearch = carrier.carrier_name.toLowerCase().includes(search.toLowerCase()) ||
            carrier.mc_number.includes(search) ||
            carrier.dot_number.includes(search);
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Carrier Applications</h2>
                    <p className="text-sm text-gray-500">Manage onboarding requests and compliance</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search MC, DOT, Name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                        />
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Carrier</th>
                            <th className="px-6 py-3">MC / DOT</th>
                            <th className="px-6 py-3">Insurance</th>
                            <th className="px-6 py-3">Documents</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center">Loading carriers...</td></tr>
                        ) : filteredCarriers.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-8 text-center">No carriers found.</td></tr>
                        ) : (
                            filteredCarriers.map((carrier) => (
                                <tr key={carrier._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{carrier.carrier_name}</div>
                                        <div className="text-xs text-gray-500">{carrier.email}</div>
                                        <div className="text-xs text-gray-500">{carrier.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>MC: {carrier.mc_number}</div>
                                        <div className="text-xs text-gray-500">DOT: {carrier.dot_number}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>Liab: ${carrier.insurance_liability.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Cargo: ${carrier.insurance_cargo.toLocaleString()}</div>
                                        <div className={`text-xs mt-1 flex items-center ${new Date(carrier.insurance_expiration) < new Date() ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                            {new Date(carrier.insurance_expiration) < new Date() && <AlertTriangle className="w-3 h-3 mr-1" />}
                                            Exp: {new Date(carrier.insurance_expiration).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {carrier.w9_file_url && (
                                                <a href={`http://localhost:5000${carrier.w9_file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="View W9">
                                                    <FileText className="w-4 h-4" />
                                                </a>
                                            )}
                                            {carrier.coi_file_url && (
                                                <a href={`http://localhost:5000${carrier.coi_file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title="View COI">
                                                    <FileText className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(carrier.status)}`}>
                                            {carrier.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {carrier.status === 'Pending' && (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleStatusChange(carrier._id, 'Approved')}
                                                    className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(carrier._id, 'Rejected')}
                                                    className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
