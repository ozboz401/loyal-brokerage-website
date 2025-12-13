import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AgentModal({ isOpen, onClose, onSuccess, mode = 'add', agent = null }) {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const isEdit = mode === 'edit';

    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        phone: '',
        password: '',

        // Business
        companyName: '',
        ein: '',
        address: '',
        city: '',
        state: '',
        zip: '',

        // Commission
        commission: 50,
        bonus: '',

        // Status
        status: 'Active'
    });

    // Populate data regarding Edit Mode
    useEffect(() => {
        if (isOpen && isEdit && agent) {
            setFormData({
                fullName: agent.name || '',
                email: agent.email || '',
                phone: agent.phone || '',
                password: '', // Leave empty unless changing
                companyName: agent.company || '',
                ein: agent.ein || '', // Ensure these fields exist in transformed agent object or fetch them
                address: agent.address || '',
                city: agent.city || '',
                state: agent.state || '',
                zip: agent.zip || '',
                commission: agent.commissionRate || 50,
                bonus: agent.bonus || '',
                status: agent.status || 'Active'
            });
        } else if (isOpen && !isEdit) {
            // Reset for Add Mode
            setFormData({
                fullName: '', email: '', phone: '', password: '',
                companyName: '', ein: '', address: '', city: '', state: '', zip: '',
                commission: 50, bonus: '', status: 'Active'
            });
        }
    }, [isOpen, isEdit, agent]);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitch = () => {
        setFormData(prev => ({
            ...prev,
            status: prev.status === 'Active' ? 'Inactive' : 'Active'
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...formData };
            if (payload.commission) payload.commission = parseFloat(payload.commission);

            // Determine Function and Body
            let functionName = 'create-agent-user';
            let body = payload;

            if (isEdit) {
                functionName = 'update-agent';
                body = {
                    ...payload,
                    agentId: agent.id, // Must pass ID
                    // Password only included if provided
                    password: payload.password?.trim() || undefined
                };
            }

            console.log(`Submitting [${mode}] payload:`, body);

            const { data, error } = await supabase.functions.invoke(functionName, {
                body: body
            });

            console.log("Edge Response:", data, error);

            if (error) throw new Error(error.message || "Function invocation failed");
            if (data && !data.success) throw new Error(data.error || "Operation failed");

            // Success
            showToast(`Agent ${isEdit ? 'updated' : 'created'} successfully!`, "success");

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);

        } catch (err) {
            console.error('Submission Error:', err);
            showToast(err.message || "Unknown error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white relative">

                {/* Toast */}
                {toast && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-400' : 'bg-green-500/10 border border-green-500/50 text-green-400'}`}>
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0a0a0a]">
                    <h2 className="text-xl font-semibold">{isEdit ? 'Edit Agent' : 'Add New Agent'}</h2>
                    <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-800">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Full Name *</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Email *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Phone</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">
                                        {isEdit ? 'New Password (Optional)' : 'Temporary Password *'}
                                    </label>
                                    <input
                                        required={!isEdit}
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none font-mono"
                                        placeholder={isEdit ? "Leave blank to keep current" : "Secure password"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-800">
                                Business Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Company Name *</label>
                                    <input required name="companyName" value={formData.companyName} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">EIN</label>
                                    <input name="ein" value={formData.ein} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-medium text-gray-300">Address</label>
                                    <input name="address" value={formData.address} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">City</label>
                                    <input name="city" value={formData.city} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-300">State</label>
                                        <input name="state" value={formData.state} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-300">Zip</label>
                                        <input name="zip" value={formData.zip} onChange={handleChange} className="input-field w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Commission */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-800">
                                Commission & Status
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Commission %</label>
                                    <div className="relative">
                                        <input type="number" name="commission" value={formData.commission} onChange={handleChange} className="w-full h-10 pl-3 pr-8 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                        <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Status</label>
                                    <div onClick={handleSwitch} className="h-10 px-3 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-700">
                                        <span className={`text-sm ${formData.status === 'Active' ? 'text-green-400' : 'text-gray-500'}`}>{formData.status}</span>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.status === 'Active' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.status === 'Active' ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-medium text-gray-300">Notes</label>
                                    <textarea name="bonus" value={formData.bonus} onChange={handleChange} rows="2" className="w-full p-3 rounded-md bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 pt-4 border-t border-gray-800">
                            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg font-medium border border-gray-800">Cancel</button>
                            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                                {loading ? <Loader2 size={16} className="animate-spin" /> : (isEdit ? 'Update Agent' : 'Create Agent')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
