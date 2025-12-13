import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Mail } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { carriersAPI } from '../api/carriersAPI';

const Carriers = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCarrier, setNewCarrier] = useState({
        name: '',
        mcNumber: '',
        dotNumber: '',
        contactName: '',
        email: '',
        phone: '',
        insuranceExpiry: '',
    });

    // Load carriers on mount
    useEffect(() => {
        loadCarriers();
    }, []);

    const loadCarriers = async () => {
        setLoading(true);
        const result = await carriersAPI.fetchCarriers({});
        if (result.success) {
            setData(result.data);
        }
        setLoading(false);
    };

    // Filter Data
    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.mcNumber && item.mcNumber.includes(search)) ||
            (item.dotNumber && item.dotNumber.includes(search));
        const matchesStatus =
            filterStatus === 'All' || item.creditStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Columns Configuration
    const columns = [
        { header: 'Carrier Name', accessor: 'name' },
        { header: 'MC Number', accessor: 'mcNumber' },
        { header: 'DOT', accessor: 'dotNumber' },
        { header: 'Contact', accessor: 'contactName' },
        { header: 'Email', accessor: 'email' },
        {
            header: 'Insurance Expiry',
            accessor: 'insuranceExpiry',
            render: (row) => row.insuranceExpiry ? new Date(row.insuranceExpiry).toLocaleDateString() : '-'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs border ${row.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    row.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Credit Status',
            accessor: 'creditStatus',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.creditStatus === 'Approved'
                        ? 'bg-green-500/10 text-green-400'
                        : row.creditStatus === 'Review'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                >
                    {row.creditStatus}
                </span>
            ),
        },
    ];

    // Handlers
    const handleAddCarrier = async (e) => {
        e.preventDefault();

        const result = await carriersAPI.createCarrier(newCarrier);
        if (result.success) {
            setData([...data, result.data]);
            setIsModalOpen(false);
            setNewCarrier({
                name: '',
                mcNumber: '',
                dotNumber: '',
                contactName: '',
                email: '',
                phone: '',
                insuranceExpiry: ''
            });
        } else {
            alert('Error creating carrier: ' + result.error);
        }
    };

    const handleAction = async (type, row) => {
        if (type === 'view') {
            alert(`Viewing loads for ${row.name}`);
        } else if (type === 'edit') {
            console.log('Edit carrier:', row);
        } else if (type === 'delete') {
            if (confirm(`Delete carrier ${row.name}?`)) {
                const result = await carriersAPI.deleteCarrier(row.id);
                if (result.success) {
                    setData(data.filter(c => c.id !== row.id));
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Carriers Overview</h1>
                    <p className="text-gray-400">Manage your carrier network and compliance</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                        <Mail size={18} />
                        <span>Send Setup</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>Add Carrier</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Carrier Name or MC#..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={20} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="Review">Review</option>
                        <option value="Denied">Denied</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-12 text-center">
                    <p className="text-gray-400">Loading carriers...</p>
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={filteredData}
                    actions={['view', 'edit', 'delete']}
                    onAction={handleAction}
                />
            )}

            {/* Add Carrier Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Carrier"
            >
                <form onSubmit={handleAddCarrier} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Carrier Name</label>
                        <input
                            required
                            type="text"
                            value={newCarrier.name}
                            onChange={(e) => setNewCarrier({ ...newCarrier, name: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">MC Number</label>
                            <input
                                required
                                type="text"
                                value={newCarrier.mcNumber}
                                onChange={(e) => setNewCarrier({ ...newCarrier, mcNumber: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="MC123456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">DOT Number</label>
                            <input
                                required
                                type="text"
                                value={newCarrier.dotNumber}
                                onChange={(e) => setNewCarrier({ ...newCarrier, dotNumber: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="DOT789012"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
                            <input
                                required
                                type="text"
                                value={newCarrier.contactName}
                                onChange={(e) => setNewCarrier({ ...newCarrier, contactName: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={newCarrier.phone}
                                onChange={(e) => setNewCarrier({ ...newCarrier, phone: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="555-1234"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                value={newCarrier.email}
                                onChange={(e) => setNewCarrier({ ...newCarrier, email: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Insurance Expiry</label>
                            <input
                                type="date"
                                value={newCarrier.insuranceExpiry}
                                onChange={(e) => setNewCarrier({ ...newCarrier, insuranceExpiry: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Add Carrier
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Carriers;
