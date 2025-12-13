import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { customersAPI } from '../api/customersAPI';
import { useAuth } from '../hooks/useAuth';

const Customers = () => {
    const { currentUser, isAdmin } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterPayment, setFilterPayment] = useState('All');
    const [showAllAgents, setShowAllAgents] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        paymentTerms: 'Net 30',
    });

    // Load customers on mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        const result = await customersAPI.fetchCustomers({});
        if (result.success) {
            setData(result.data);
        }
        setLoading(false);
    };

    // Filter Data
    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.contactName && item.contactName.toLowerCase().includes(search.toLowerCase()));
        const matchesPayment =
            filterPayment === 'All' || item.paymentTerms === filterPayment;
        return matchesSearch && matchesPayment;
    });

    // Columns Configuration
    const columns = [
        { header: 'Customer', accessor: 'name' },
        { header: 'Primary Contact', accessor: 'contactName' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
        {
            header: 'Payment Terms',
            accessor: 'paymentTerms',
            render: (row) => (
                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                    {row.paymentTerms}
                </span>
            )
        },
        {
            header: 'Credit Status',
            accessor: 'creditStatus',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs border ${row.creditStatus === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    row.creditStatus === 'Review' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                    {row.creditStatus}
                </span>
            )
        },
    ];

    // Handlers
    const handleAddCustomer = async (e) => {
        e.preventDefault();

        const result = await customersAPI.createCustomer(newCustomer);
        if (result.success) {
            setData([...data, result.data]);
            setIsModalOpen(false);
            setNewCustomer({ name: '', contactName: '', email: '', phone: '', address: '', paymentTerms: 'Net 30' });
        } else {
            alert('Error creating customer: ' + result.error);
        }
    };

    const handleAction = async (type, row) => {
        if (type === 'view') {
            alert(`Viewing loads for ${row.name}`);
        } else if (type === 'edit') {
            console.log('Edit customer:', row);
        } else if (type === 'delete') {
            if (confirm(`Delete customer ${row.name}?`)) {
                const result = await customersAPI.deleteCustomer(row.id);
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
                    <h1 className="text-3xl font-bold mb-2">Customers</h1>
                    <p className="text-gray-400">Manage customer relationships and load history</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin() && (
                        <button
                            onClick={() => setShowAllAgents(!showAllAgents)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border ${showAllAgents
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <Filter size={18} />
                            <span>{showAllAgents ? 'All Agents' : 'My Customers'}</span>
                        </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                        <Eye size={18} />
                        <span>View All Loads</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={18} />
                        <span>Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Customer or Contact..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={20} />
                    <select
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                        <option value="All">All Terms</option>
                        <option value="Net 30">Net 30</option>
                        <option value="Net 45">Net 45</option>
                        <option value="Net 60">Net 60</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-12 text-center">
                    <p className="text-gray-400">Loading customers...</p>
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={filteredData}
                    actions={['view', 'edit', 'delete']}
                    onAction={handleAction}
                />
            )}

            {/* Add Customer Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Customer"
            >
                <form onSubmit={handleAddCustomer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
                        <input
                            required
                            type="text"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Primary Contact</label>
                            <input
                                required
                                type="text"
                                value={newCustomer.contactName}
                                onChange={(e) => setNewCustomer({ ...newCustomer, contactName: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input
                                required
                                type="tel"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Payment Terms</label>
                            <select
                                value={newCustomer.paymentTerms}
                                onChange={(e) => setNewCustomer({ ...newCustomer, paymentTerms: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="Net 30">Net 30</option>
                                <option value="Net 45">Net 45</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Quick Pay">Quick Pay</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <input
                            type="text"
                            value={newCustomer.address}
                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="123 Main St, City, State"
                        />
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
                            Add Customer
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
