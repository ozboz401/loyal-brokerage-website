import { useState, useEffect } from 'react';
import { Save, AlertCircle, Building2, Percent, Palette } from 'lucide-react';
import { settingsAPI } from '../api/settingsAPI';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('company');
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const result = await settingsAPI.fetchSettings();
        if (result.success) {
            setSettings(result.data);
        }
        setLoading(false);
    };

    const handleSave = async (keys) => {
        setSaving(true);
        setMessage(null);

        try {
            for (const key of keys) {
                await settingsAPI.updateSetting(key, settings[key], currentUser?.email || 'system');
            }
            setMessage({ type: 'success', text: 'Settings saved successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings' });
        }

        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-400">Manage system configuration and preferences</p>
            </div>

            {message && (
                <div className={`flex items-center gap-2 p-4 rounded-lg border ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                    <AlertCircle size={18} />
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex gap-2 border-b border-gray-800">
                {[
                    { id: 'company', label: 'Company', icon: Building2 },
                    { id: 'commission', label: 'Commission', icon: Percent },
                    { id: 'preferences', label: 'Preferences', icon: Palette }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 capitalize transition-colors ${activeTab === tab.id
                                ? 'border-b-2 border-blue-500 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'company' && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-blue-400" />
                            Company Information
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Company Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={settings.company_name || ''}
                            onChange={(e) => handleChange('company_name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Enter company name"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">MC Number</label>
                            <input
                                type="text"
                                value={settings.company_mc || ''}
                                onChange={(e) => handleChange('company_mc', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="MC-XXXXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">DOT Number</label>
                            <input
                                type="text"
                                value={settings.company_dot || ''}
                                onChange={(e) => handleChange('company_dot', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="DOT-XXXXXX"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Company Address</label>
                        <textarea
                            value={settings.company_address || ''}
                            onChange={(e) => handleChange('company_address', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            rows="3"
                            placeholder="Enter full company address"
                        />
                    </div>

                    <button
                        onClick={() => handleSave(['company_name', 'company_mc', 'company_dot', 'company_address'])}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {activeTab === 'commission' && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Percent size={20} className="text-green-400" />
                            Default Commission Rate
                        </h3>
                        <p className="text-sm text-gray-400">
                            Set the default commission rate for all agents. Individual agents can have custom rates.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Default Rate (%) <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.default_commission_rate || 10}
                                onChange={(e) => handleChange('default_commission_rate', parseFloat(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 pr-12 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                min="0"
                                max="100"
                                step="0.1"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            This rate applies to all agents unless they have a custom rate set in their profile.
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <p className="text-sm text-blue-400">
                            <strong>Note:</strong> Changes to the default rate will not affect existing agent-specific rates.
                        </p>
                    </div>

                    <button
                        onClick={() => handleSave(['default_commission_rate'])}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}

            {activeTab === 'preferences' && (
                <div className="bg-[#111827] rounded-xl border border-gray-800 p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Palette size={20} className="text-purple-400" />
                            System Preferences
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Currency</label>
                            <select
                                value={settings.currency || 'USD'}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="MXN">MXN - Mexican Peso</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Timezone</label>
                            <select
                                value={settings.timezone || 'America/New_York'}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="America/Phoenix">Arizona Time (MST)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Theme</label>
                        <select
                            value={settings.theme || 'dark'}
                            onChange={(e) => handleChange('theme', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="dark">Dark Mode</option>
                            <option value="light">Light Mode</option>
                            <option value="auto">Auto (System)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            Theme preference (currently only dark mode is fully supported)
                        </p>
                    </div>

                    <button
                        onClick={() => handleSave(['currency', 'timezone', 'theme'])}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;
