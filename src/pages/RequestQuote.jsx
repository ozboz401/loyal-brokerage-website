import { useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RequestQuote() {
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        pickup_city: "",
        pickup_state: "",
        delivery_city: "",
        delivery_state: "",
        pickup_date: "",
        delivery_date: "",
        equipment_type: "Dry Van",
        commodity: "",
        weight: "",
        pallets: "",
        special_notes: ""
    });

    const [attachment, setAttachment] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let attachment_url = null;

        try {
            // 1. Upload file to Supabase Storage (if exists)
            if (attachment) {
                showToast("Uploading attachment...", "info");
                const fileExt = attachment.name.split(".").pop();
                const fileName = `${crypto.randomUUID()}.${fileExt}`;
                const filePath = `quote_attachments/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("attachments")
                    .upload(filePath, attachment);

                if (uploadError) throw new Error("File upload failed: " + uploadError.message);

                const { data: publicURL } = supabase.storage
                    .from("attachments")
                    .getPublicUrl(filePath);

                attachment_url = publicURL.publicUrl;
            }

            // 2. Insert into database (quotes)
            const payload = {
                company_name: formData.company_name,
                contact_name: formData.contact_name,
                email: formData.email,
                phone: formData.phone,
                pickup_city: formData.pickup_city,
                pickup_state: formData.pickup_state,
                delivery_city: formData.delivery_city,
                delivery_state: formData.delivery_state,
                weight: formData.weight,
                pallets: formData.pallets,
                equipment_type: formData.equipment_type,
                special_notes: formData.special_notes,
                attachment_url: attachment_url,
                commodity: formData.commodity,
                pickup_date: formData.pickup_date,
                delivery_date: formData.delivery_date
            };

            const { error: insertError } = await supabase
                .from("quotes")
                .insert([payload]);

            if (insertError) throw new Error("Submission failed: Please try again or contact support.");

            // 3. Send Notifications
            try {
                await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/send-notifications`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "quote",
                        customerEmail: formData.email,
                        slackWebhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL,
                        discordWebhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
                        data: formData
                    })
                });
            } catch (notifyError) {
                console.error("Notification failed:", notifyError);
            }

            // Success
            showToast("Quote request submitted successfully.", "success");

            // Reset Form 
            setFormData({
                company_name: "",
                contact_name: "",
                email: "",
                phone: "",
                pickup_city: "",
                pickup_state: "",
                delivery_city: "",
                delivery_state: "",
                pickup_date: "",
                delivery_date: "",
                equipment_type: "Dry Van",
                commodity: "",
                weight: "",
                pallets: "",
                special_notes: ""
            });
            setAttachment(null);

        } catch (err) {
            console.error("Submission error:", err);
            showToast(err.message || "Something went wrong, please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-10 right-10 px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-600' :
                    toast.type === 'info' ? 'bg-blue-600' : 'bg-green-600'
                    } text-white`}>
                    <span className="text-2xl">{toast.type === 'error' ? '⚠️' : '✅'}</span>
                    <span className="font-bold">{toast.message}</span>
                </div>
            )}

            <div className="pt-32 pb-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">

                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
                            Request a Freight Quote
                        </h1>
                        <p className="text-gray-600 text-lg">Get a fast, professional, and competitive quote for your shipment.</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-8 md:p-12 rounded-3xl shadow-lg relative overflow-hidden">

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">

                            {/* A. SHIPPER INFO */}
                            <Section title="A. Shipper Information">
                                <Input label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} required />
                                <Input label="Contact Name" name="contact_name" value={formData.contact_name} onChange={handleChange} required />
                                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                                <Input label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                            </Section>

                            {/* B. LOAD DETAILS */}
                            <Section title="B. Load Details">
                                <Input label="Pickup City" name="pickup_city" value={formData.pickup_city} onChange={handleChange} required />
                                <Input label="Pickup State" name="pickup_state" value={formData.pickup_state} onChange={handleChange} required />

                                <Input label="Delivery City" name="delivery_city" value={formData.delivery_city} onChange={handleChange} required />
                                <Input label="Delivery State" name="delivery_state" value={formData.delivery_state} onChange={handleChange} required />

                                <Input label="Pickup Date" type="date" name="pickup_date" value={formData.pickup_date} onChange={handleChange} required />
                                <Input label="Delivery Date (Optional)" type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} />

                                <Select label="Equipment Type" name="equipment_type" value={formData.equipment_type} onChange={handleChange}>
                                    <option>Dry Van</option>
                                    <option>Reefer</option>
                                    <option>Flatbed</option>
                                    <option>Stepdeck</option>
                                </Select>

                                <Input label="Commodity" name="commodity" value={formData.commodity} onChange={handleChange} required />
                                <Input label="Weight (lbs)" type="text" name="weight" value={formData.weight} onChange={handleChange} required />
                                <Input label="Pallets / Pieces" type="text" name="pallets" value={formData.pallets} onChange={handleChange} required />
                            </Section>

                            {/* C. NOTES */}
                            <Section title="C. Additional Notes">
                                <div className="col-span-2">
                                    <label className="text-sm font-bold text-gray-700 mb-2 block">Special Requirements</label>
                                    <textarea
                                        name="special_notes"
                                        value={formData.special_notes}
                                        onChange={handleChange}
                                        rows="4"
                                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-3 shadow-sm border border-gray-300"
                                        placeholder="Hazmat, team drivers, tarps, fragile cargo, etc..."
                                    ></textarea>
                                </div>
                            </Section>

                            {/* D. ATTACHMENT */}
                            <Section title="D. Optional Attachment">
                                <div className="col-span-2">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 hover:border-blue-500 transition group cursor-pointer relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 cursor-pointer">Upload Load Sheet / Rate Con</label>
                                        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer" />

                                        {attachment && (
                                            <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg inline-block border border-green-200">
                                                <span>📎 {attachment.name}</span>
                                                <span className="text-xs font-bold uppercase tracking-wider">Attached</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Section>

                            {/* SUBMIT BUTTON */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 text-xl font-bold text-white rounded-lg shadow-md bg-blue-700 hover:bg-blue-600 transition-all duration-300  ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? "Processing..." : "Submit Quote Request"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

// --- REUSABLE COMPONENTS ---

function Section({ title, children }) {
    return (
        <div className="bg-white border-b border-gray-100 pb-8 last:border-0">
            <h3 className="text-xl font-bold text-blue-800 mb-6 border-l-4 border-blue-600 pl-4">{title}</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <input
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-3 shadow-sm border border-gray-300 transition-all font-medium"
                {...props}
            />
        </div>
    );
}

function Select({ label, children, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <select
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-3 shadow-sm border border-gray-300 font-medium"
                {...props}
            >
                {children}
            </select>
        </div>
    );
}
