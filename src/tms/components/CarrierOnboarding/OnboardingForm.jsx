import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const OnboardingForm = () => {
    const [formData, setFormData] = useState({
        carrier_name: '',
        mc_number: '',
        dot_number: '',
        ein: '',
        phone: '',
        email: '',
        address: '',
        insurance_liability: '',
        insurance_cargo: '',
        insurance_expiration: '',
        agreement_accepted: false
    });

    const [files, setFiles] = useState({
        w9_file: null,
        coi_file: null,
        agreement_file: null
    });

    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setMessage('');

        // Validation
        if (Number(formData.insurance_liability) < 1000000) {
            setStatus('error');
            setMessage('Auto Liability must be at least $1,000,000');
            return;
        }
        if (Number(formData.insurance_cargo) < 100000) {
            setStatus('error');
            setMessage('Cargo Coverage must be at least $100,000');
            return;
        }

        // Check expiration > 30 days
        const expirationDate = new Date(formData.insurance_expiration);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        if (expirationDate < thirtyDaysFromNow) {
            setStatus('error');
            setMessage('Insurance expiration must be at least 30 days from today');
            return;
        }

        if (!formData.agreement_accepted) {
            setStatus('error');
            setMessage('You must accept the Broker-Carrier Agreement');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (files.w9_file) data.append('w9_file', files.w9_file);
        if (files.coi_file) data.append('coi_file', files.coi_file);
        if (files.agreement_file) data.append('agreement_file', files.agreement_file);

        try {
            const response = await fetch('http://localhost:5000/api/carrier/onboard', {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Application submitted successfully! We will review your information shortly.');
            } else {
                setStatus('error');
                setMessage(result.message || 'Submission failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please ensure the backend server is running.');
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h2>
                <p className="text-gray-600">{message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-900 px-8 py-6">
                <h1 className="text-3xl font-bold text-white">Carrier Onboarding</h1>
                <p className="text-blue-200 mt-2">Join our network of trusted carriers</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {status === 'error' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700">{message}</p>
                    </div>
                )}

                {/* Company Info */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Company Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <input required type="text" name="carrier_name" value={formData.carrier_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">EIN</label>
                            <input required type="text" name="ein" value={formData.ein} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">MC Number</label>
                            <input required type="text" name="mc_number" value={formData.mc_number} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">DOT Number</label>
                            <input required type="text" name="dot_number" value={formData.dot_number} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </section>

                {/* Insurance Info */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Insurance Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Auto Liability ($)</label>
                            <input required type="number" name="insurance_liability" placeholder="Min 1,000,000" value={formData.insurance_liability} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            <p className="text-xs text-gray-500 mt-1">Minimum $1,000,000 required</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Coverage ($)</label>
                            <input required type="number" name="insurance_cargo" placeholder="Min 100,000" value={formData.insurance_cargo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            <p className="text-xs text-gray-500 mt-1">Minimum $100,000 required</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                            <input required type="date" name="insurance_expiration" value={formData.insurance_expiration} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </section>

                {/* Documents */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <label className="block text-sm font-medium text-gray-700 mb-2">W9 Form</label>
                            <input required type="file" name="w9_file" accept=".pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate of Insurance</label>
                            <input required type="file" name="coi_file" accept=".pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <label className="block text-sm font-medium text-gray-700 mb-2">Signed Agreement</label>
                            <input required type="file" name="agreement_file" accept=".pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>
                </section>

                {/* Agreement */}
                <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <input
                        type="checkbox"
                        name="agreement_accepted"
                        checked={formData.agreement_accepted}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                        I certify that the information provided is true and accurate. I agree to the Broker-Carrier Agreement and understand that providing false information may result in the rejection of this application.
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all ${status === 'submitting' ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OnboardingForm;
