import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setSubmitStatus(null);

        try {
            // Step 1: Insert into Supabase (database record)
            const { error: dbError } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || null,
                    message: formData.message.trim()
                }]);

            if (dbError) {
                console.error('Supabase error:', dbError);
                throw new Error('Failed to save message.');
            }

            // Step 2: Call Edge Function to send emails
            const { data: funcData, error: funcError } = await supabase.functions.invoke('send-contact-email', {
                body: {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || null,
                    message: formData.message.trim()
                }
            });

            if (funcError) {
                console.error('Edge Function Error:', funcError);
                throw new Error('Failed to send email.');
            }

            // Success!
            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setErrors({});

            setTimeout(() => setSubmitStatus(null), 5000);

        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />
            <div className="pt-32 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Send us a message and our team will reach out shortly.
                        </p>
                    </div>

                    {submitStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                        >
                            <CheckCircle className="text-green-600" size={24} />
                            <p className="text-green-700 font-semibold">Your message has been sent!</p>
                        </motion.div>
                    )}

                    {submitStatus === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                        >
                            <AlertCircle className="text-red-600" size={24} />
                            <p className="text-red-700 font-semibold">Something went wrong. Please try again.</p>
                        </motion.div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Full Name <span className="text-blue-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    autoComplete="name"
                                    className={`w-full bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                    placeholder="John Doe"
                                    disabled={submitting}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address <span className="text-blue-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    autoComplete="email"
                                    className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                                    placeholder="john@example.com"
                                    disabled={submitting}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    autoComplete="tel"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="561-288-0528"
                                    disabled={submitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Message <span className="text-blue-600">*</span>
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    rows="6"
                                    className={`w-full bg-white border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none`}
                                    placeholder="Tell us how we can help..."
                                    disabled={submitting}
                                />
                                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                                {submitting ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-gray-500 text-sm">
                        <p>We typically respond within 24 business hours.</p>
                        <p className="mt-2">For urgent matters, please call us directly at <span className="text-blue-600 font-bold">561-288-0528</span></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
