import { useState } from 'react';
import { Save, User, Building, Radio, Upload } from 'lucide-react';
import Tabs from '../components/Tabs';

const Settings = () => {
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const tabs = [
        {
            label: 'Company Info',
            content: (
                <div className="max-w-2xl space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                            <Building size={32} className="text-gray-500" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 text-sm">
                            <Upload size={16} />
                            <span>Upload Logo</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                            <input type="text" defaultValue="BrokerFlow Logistics" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">EIN</label>
                            <input type="text" defaultValue="12-3456789" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">MC Number</label>
                            <input type="text" defaultValue="MC-123456" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">DOT Number</label>
                            <input type="text" defaultValue="DOT-987654" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <input type="text" defaultValue="123 Logistics Way, Chicago, IL 60601" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20">
                            <Save size={18} />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            )
        },
        {
            label: 'User Management',
            content: (
                <div className="space-y-4">
                    <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden">
                        {[
                            { name: 'Admin User', role: 'Administrator', email: 'admin@brokerflow.com', status: 'Active' },
                            { name: 'John Dispatcher', role: 'Dispatcher', email: 'john@brokerflow.com', status: 'Active' },
                            { name: 'Jane Accountant', role: 'Accountant', email: 'jane@brokerflow.com', status: 'Active' },
                        ].map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{user.name}</h4>
                                        <p className="text-sm text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                                        {user.role}
                                    </span>
                                    <span className="text-green-400 text-sm font-medium">{user.status}</span>
                                    <button className="text-gray-400 hover:text-white transition-colors">Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800/30 transition-all flex items-center justify-center gap-2">
                        <PlusIcon /> Add New User
                    </button>
                </div>
            )
        },
        {
            label: 'Integrations',
            content: (
                <div className="max-w-2xl space-y-6">
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Load Boards</h3>
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">Connected</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">DAT Power API Key</label>
                                <input type="password" value="************************" readOnly className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Truckstop.com Integration ID</label>
                                <input type="password" value="************************" readOnly className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Factoring</h3>
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">Not Connected</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">RTS / OTR Capital API Key</label>
                            <input type="text" placeholder="Enter API Key" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">ELD Integration</h3>
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">Not Connected</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Samsara / Motive API Token</label>
                            <input type="text" placeholder="Enter API Token" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-lg shadow-blue-600/20">
                            <Save size={18} />
                            <span>Save Integrations</span>
                        </button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 z-50 flex items-center gap-2">
                    <Save size={18} />
                    <span>Settings saved successfully!</span>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage company profile, users, and integrations</p>
            </div>

            {/* Tabs */}
            <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                <Tabs tabs={tabs} />
            </div>
        </div>
    );
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

export default Settings;
