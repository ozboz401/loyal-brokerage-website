import { useState } from 'react';
import { Plus, Download, FileText, DollarSign, TrendingUp, Edit2, Save, X } from 'lucide-react';
import Tabs from '../components/Tabs';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { invoicesData, receivablesData, expensesData, loadsData } from '../data/accounting';
import { useAuth } from '../hooks/useAuth';
import { calculateGrossProfit, calculateProfitMargin, formatCurrency } from '../lib/finance';
import { calculateAgentPay, calculateNetProfit } from '../lib/financePro';

const Accounting = () => {
    const { isAdmin } = useAuth();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [loads, setLoads] = useState(loadsData);
    const [editingLoadId, setEditingLoadId] = useState(null);
    const [editCarrierRate, setEditCarrierRate] = useState(0);

    // Handle carrier rate edit
    const handleEditCarrierRate = (loadId, currentRate) => {
        setEditingLoadId(loadId);
        setEditCarrierRate(currentRate);
    };

    const handleSaveCarrierRate = (loadId) => {
        setLoads(loads.map(load =>
            load.id === loadId ? { ...load, carrierRate: editCarrierRate } : load
        ));
        setEditingLoadId(null);
    };

    const handleCancelEdit = () => {
        setEditingLoadId(null);
        setEditCarrierRate(0);
    };

    // Columns Configurations
    const invoiceColumns = [
        { header: 'Invoice #', accessor: 'id' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Amount', accessor: 'amount' },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-500/10 text-green-400' :
                    row.status === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Date Sent', accessor: 'dateSent' },
    ];

    const receivableColumns = [
        { header: 'Customer', accessor: 'customer' },
        { header: 'Due Amount', accessor: 'dueAmount' },
        {
            header: 'Days Outstanding',
            accessor: 'daysOutstanding',
            render: (row) => (
                <span className={row.daysOutstanding > 30 ? 'text-red-400 font-bold' : 'text-gray-300'}>
                    {row.daysOutstanding} Days
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Overdue' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
    ];

    // Loads columns with profit and commission calculations
    const loadsColumns = [
        { header: 'Load ID', accessor: 'id' },
        { header: 'Customer', accessor: 'customer' },
        {
            header: 'Customer Rate',
            accessor: 'customerRate',
            render: (row) => (
                <span className="font-semibold text-green-400">
                    {formatCurrency(row.customerRate)}
                </span>
            )
        },
        {
            header: 'Carrier Rate',
            accessor: 'carrierRate',
            render: (row) => (
                isAdmin() && editingLoadId === row.id ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={editCarrierRate}
                            onChange={(e) => setEditCarrierRate(Number(e.target.value))}
                            className="w-24 bg-gray-900 border border-blue-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                            autoFocus
                        />
                        <button
                            onClick={() => handleSaveCarrierRate(row.id)}
                            className="p-1 text-green-400 hover:bg-green-500/10 rounded"
                        >
                            <Save size={16} />
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-400">
                            {formatCurrency(row.carrierRate)}
                        </span>
                        {isAdmin() && (
                            <button
                                onClick={() => handleEditCarrierRate(row.id, row.carrierRate)}
                                className="p-1 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                )
            )
        },
        {
            header: 'Gross Profit',
            accessor: 'grossProfit',
            render: (row) => {
                const profit = calculateGrossProfit(row.customerRate, row.carrierRate);
                return (
                    <span className={`font-semibold ${profit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        {formatCurrency(profit)}
                    </span>
                );
            }
        },
        {
            header: 'Margin',
            accessor: 'margin',
            render: (row) => {
                const profit = calculateGrossProfit(row.customerRate, row.carrierRate);
                const margin = calculateProfitMargin(profit, row.customerRate);
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${parseFloat(margin) >= 20 ? 'bg-green-500/10 text-green-400' :
                        parseFloat(margin) >= 10 ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-red-500/10 text-red-400'
                        }`}>
                        {margin}%
                    </span>
                );
            }
        },
        {
            header: 'Agent',
            accessor: 'agentName',
            render: (row) => (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30">
                    👤 {row.agentName}
                </span>
            )
        },
        {
            header: 'Commission %',
            accessor: 'commission',
            render: (row) => (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                    {row.commission}%
                </span>
            )
        },
        {
            header: 'Agent Pay',
            accessor: 'agentPay',
            render: (row) => {
                const gross = calculateGrossProfit(row.customerRate, row.carrierRate);
                const agentPay = calculateAgentPay(gross, row.commission);
                return (
                    <span className="font-semibold text-yellow-400">
                        {formatCurrency(agentPay)}
                    </span>
                );
            }
        },
        {
            header: 'Net Profit',
            accessor: 'netProfit',
            render: (row) => {
                const { net } = calculateNetProfit(row.customerRate, row.carrierRate, row.commission);
                return (
                    <span className={`font-semibold ${net >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                        {formatCurrency(net)}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                    {row.status}
                </span>
            )
        },
        { header: 'Date', accessor: 'date' },
    ];

    const expenseColumns = [
        { header: 'Category', accessor: 'category' },
        { header: 'Description', accessor: 'description' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Truck #', accessor: 'truck' },
        { header: 'Date', accessor: 'date' },
    ];

    // Tab Contents
    const tabs = [
        {
            label: 'Loads & Profit',
            content: (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                            {isAdmin() ? (
                                <span>💡 View complete profit breakdown with agent commissions and net profit</span>
                            ) : (
                                <span>View load profitability metrics</span>
                            )}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                    <Table columns={loadsColumns} data={loads} actions={['view']} onAction={() => { }} />
                </div>
            )
        },
        {
            label: 'Invoices',
            content: (
                <div className="space-y-4">
                    <div className="flex justify-end gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20">
                            <FileText size={18} />
                            <span>Generate Invoice</span>
                        </button>
                    </div>
                    <Table columns={invoiceColumns} data={invoicesData} actions={['view', 'download']} onAction={() => { }} />
                </div>
            )
        },
        {
            label: 'Receivables',
            content: (
                <div className="space-y-4">
                    <div className="flex justify-end gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                    <Table columns={receivableColumns} data={receivablesData} actions={['view']} onAction={() => { }} />
                </div>
            )
        },
        {
            label: 'Expenses',
            content: (
                <div className="space-y-4">
                    <div className="flex justify-end gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20"
                        >
                            <Plus size={18} />
                            <span>Add Expense</span>
                        </button>
                    </div>
                    <Table columns={expenseColumns} data={expensesData} actions={['edit', 'delete']} onAction={() => { }} />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Accounting</h1>
                <p className="text-gray-400">Track invoices, receivables, and company expenses</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Total Revenue (YTD)</span>
                    </div>
                    <h3 className="text-2xl font-bold">$847,500.00</h3>
                </div>

                <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Outstanding Receivables</span>
                    </div>
                    <h3 className="text-2xl font-bold">$42,300.00</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <FileText size={20} />
                        </div>
                        <span className="text-gray-400 text-sm">Pending Invoices</span>
                    </div>
                    <h3 className="text-2xl font-bold">12</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                <Tabs tabs={tabs} />
            </div>

            {/* Add Expense Modal */}
            <Modal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                title="Add New Expense"
            >
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                            <option>Fuel</option>
                            <option>Maintenance</option>
                            <option>Insurance</option>
                            <option>Dispatch</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                            <input type="number" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                            <input type="date" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsExpenseModalOpen(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExpenseModalOpen(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Save Expense
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Accounting;
