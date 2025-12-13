import { useState } from 'react';
import { Plus, Search, Filter, Download, Mail } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { carriersData } from '../data/carriers';

const Carriers = () => {
    const [data, setData] = useState(carriersData);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCarrier, setNewCarrier] = useState({
        name: '',
        mc: '',
        dot: '',
        contact: '',
        email: '',
    });

    // Filter Data
    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.mc.includes(search);
        const matchesStatus =
            filterStatus === 'All' || item.credit === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Columns Configuration
    const columns = [
        { header: 'Carrier Name', accessor: 'name' },
        { header: 'MC Number', accessor: 'mc' },
        { header: 'DOT', accessor: 'dot' },
        { header: 'Contact', accessor: 'contact' },
        { header: 'Email', accessor: 'email' },
        { header: 'Insurance Expiry', accessor: 'insurance' },
        {
            header: 'Credit Status',
            accessor: 'credit',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.credit === 'Approved'
                            ? 'bg-green-500/10 text-green-400'
                            : row.credit === 'Review'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-red-500/10 text-red-400'
                        }`}
                >
                    {row.credit}
                </span>
            ),
        },
    ];

    // Handlers
    const handleAddCarrier = (e) => {
        e.preventDefault();
        const id = data.length + 1;
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);

        setData([
            ...data,
            {
                id,
                ...newCarrier,
                insurance: date.toISOString().split('T')[0],
                status: 'Active',
                credit: 'Review',
            },
        ]);
        setIsModalOpen(false);
        setNewCarrier({ name: '', mc: '', dot: '', contact: '', email: '' });
    };

    const handleAction = (type, row) => {
        console.log(`${type} action on carrier:`, row.name);
        if (type === 'delete') {
            if (confirm('Are you sure you want to delete this carrier?')) {
                setData(data.filter(item => item.id !== row.id));
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
            <Table
                columns={columns}
                data={filteredData}
                actions={['view', 'edit', 'delete']}
                onAction={handleAction}
            />

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
                                value={newCarrier.mc}
                                onChange={(e) => setNewCarrier({ ...newCarrier, mc: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">DOT Number</label>
                            <input
                                required
                                type="text"
                                value={newCarrier.dot}
                                onChange={(e) => setNewCarrier({ ...newCarrier, dot: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
                            <input
                                required
                                type="text"
                                value={newCarrier.contact}
                                onChange={(e) => setNewCarrier({ ...newCarrier, contact: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
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
