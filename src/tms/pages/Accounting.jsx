import { useState, useEffect } from 'react';
import { DollarSign, FileText, CreditCard, Download, Plus, Search } from 'lucide-react';
import { accountingAPI } from '../api/accountingAPI';
import { dashboardAPI } from '../api/dashboardAPI';
import Table from '../components/Table';

const Accounting = () => {
    const [activeTab, setActiveTab] = useState('invoices');
    const [invoices, setInvoices] = useState([]);
    const [agedReceivables, setAgedReceivables] = useState([]);
    const [carrierPayables, setCarrierPayables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        if (activeTab === 'invoices') {
            const result = await accountingAPI.fetchInvoices({});
            if (result.success) setInvoices(result.data);
        } else if (activeTab === 'receivables') {
            const result = await dashboardAPI.getAgedReceivables();
            if (result.success) setAgedReceivables(result.data);
        } else if (activeTab === 'payables') {
            const result = await dashboardAPI.getCarrierPayables();
            if (result.success) setCarrierPayables(result.data);
        }
        setLoading(false);
    };

    const invoiceColumns = [
        { header: 'Invoice #', accessor: 'id' },
        { header: 'Customer', accessor: 'customer_name' },
        {
            header: 'Amount',
            accessor: 'amount',
            render: (row) => `$${parseFloat(row.amount || 0).toLocaleString()}`
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                        row.status === 'Overdue' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Date Sent',
            accessor: 'date_sent',
            render: (row) => row.date_sent ? new Date(row.date_sent).toLocaleDateString() : '-'
        },
        {
            header: 'Due Date',
            accessor: 'due_date',
            render: (row) => row.due_date ? new Date(row.due_date).toLocaleDateString() : '-'
        }
    ];

    const payablesColumns = [
        { header: 'Carrier', accessor: 'carrier_name' },
        {
            header: 'Total Owed',
            accessor: 'total_owed',
            render: (row) => `$${parseFloat(row.total_owed || 0).toLocaleString()}`
        },
        {
            header: 'Unpaid Loads',
            accessor: 'unpaid_count'
        },
        {
            header: 'Oldest Unpaid',
            accessor: 'oldest_unpaid_date',
            render: (row) => row.oldest_unpaid_date ? new Date(row.oldest_unpaid_date).toLocaleDateString() : '-'
        }
    ];

    const filteredInvoices = invoices.filter(inv =>
        !searchTerm ||
        inv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id?.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Accounting</h1>
                <p className="text-gray-400">Manage invoices, payments, and receivables</p>
            </div>

            <div className="flex gap-2 border-b border-gray-800">
                {['invoices', 'receivables', 'payables'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize transition-colors ${activeTab === tab
                                ? 'border-b-2 border-blue-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'invoices' && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                <Download size={18} />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                <Plus size={18} />
                                Create Invoice
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="text-gray-400 mt-4">Loading invoices...</p>
                        </div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                            <p className="text-gray-400">No invoices found</p>
                        </div>
                    ) : (
                        <Table
                            columns={invoiceColumns}
                            data={filteredInvoices}
                            actions={['view', 'edit']}
                            onAction={(type, row) => console.log(type, row)}
                        />
                    )}
                </div>
            )}

            {activeTab === 'receivables' && (
                <div className="space-y-4">
                    <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                        <h3 className="text-lg font-semibold mb-4">Aged Receivables</h3>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <p className="text-gray-400 mt-4">Loading receivables...</p>
                            </div>
                        ) : agedReceivables.length === 0 ? (
                            <div className="text-center py-12">
                                <DollarSign className="mx-auto text-gray-600 mb-4" size={48} />
                                <p className="text-gray-400">No outstanding receivables</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {agedReceivables.map((bucket, idx) => (
                                    <div key={idx} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                                        <p className="text-sm text-gray-400 mb-2">{bucket.bucket}</p>
                                        <p className="text-3xl font-bold text-white mb-1">
                                            ${parseFloat(bucket.amount || 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {bucket.count} invoice{bucket.count !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'payables' && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4">Carrier Payables</h3>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="text-gray-400 mt-4">Loading payables...</p>
                        </div>
                    ) : carrierPayables.length === 0 ? (
                        <div className="text-center py-12">
                            <CreditCard className="mx-auto text-gray-600 mb-4" size={48} />
                            <p className="text-gray-400">No outstanding payables</p>
                        </div>
                    ) : (
                        <Table
                            columns={payablesColumns}
                            data={carrierPayables}
                            actions={[]}
                            onAction={() => { }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Accounting;
