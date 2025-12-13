import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCarrierApplication } from "../api/submitCarrierApplication";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CarrierSignup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        company_name: "", dba: "", business_type: "LLC",
        address_street: "", address_city: "", address_state: "", address_zip: "",
        mc_number: "", dot_number: "", ein: "", years_in_business: "",
        primary_contact: "", primary_phone: "", primary_email: "",
        dispatch_contact: "", dispatch_phone: "", billing_email: "", after_hours_phone: "",
        truck_count: "", driver_count: "",
        equipment_types: [], operating_states: [],
        hazmat: false, safety_rating: "Satisfactory",
        liability_amount: "", cargo_amount: "",
        insurance_company: "", agent_name: "", agent_email: "", agent_phone: "",
        policy_expiration: "",
        compliance_1: false, compliance_2: false, compliance_3: false, compliance_4: false
    });

    const [files, setFiles] = useState({
        w9: null, coi: null, insurance_doc: null,
        authority_letter: null, agreement: null, ach: null
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[field];
            if (checked) return { ...prev, [field]: [...list, value] };
            return { ...prev, [field]: list.filter(item => item !== value) };
        });
    };

    const handleFileChange = (e, key) => {
        setFiles({ ...files, [key]: e.target.files[0] });
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const allStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

    const handleSelectAll = () => {
        setFormData(prev => {
            if (prev.operating_states.length === allStates.length) return { ...prev, operating_states: [] };
            return { ...prev, operating_states: [...allStates] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // *** LEGAL COMPLIANCE ZORUNLULUĞU ***
        if (!formData.compliance_1 || !formData.compliance_2 || !formData.compliance_3 || !formData.compliance_4) {
            alert("Please agree to all legal compliance statements.");
            return;
        }

        setLoading(true);
        showToast("Uploading documents...");

        const result = await submitCarrierApplication(formData, files);

        if (result.success) {
            try {
                await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/send-notifications`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "carrier",
                        customerEmail: formData.primary_email,
                        slackWebhookUrl: import.meta.env.VITE_SLACK_WEBHOOK_URL,
                        discordWebhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
                        data: formData
                    })
                });
            } catch (notifyError) {
                console.error("Notification failed:", notifyError);
            }

            showToast("Form Submitted Successfully!");
            navigate("/carrier-success");
        } else {
            alert("Submission Failed: " + result.message);
            setLoading(false);
        }
    };

    const complianceRequired =
        !formData.compliance_1 ||
        !formData.compliance_2 ||
        !formData.compliance_3 ||
        !formData.compliance_4;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />

            {toast && (
                <div className="fixed top-24 right-5 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
                    {toast}
                </div>
            )}

            <div className="pt-32 pb-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
                            Carrier Registration
                        </h1>
                        <p className="text-gray-600 text-lg">Complete our FMCSA-compliant onboarding to start hauling.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* A. BUSINESS INFO */}
                        <Section title="A. Business Information">
                            <Input label="Company Legal Name" name="company_name" value={formData.company_name} onChange={handleChange} required />
                            <Input label="DBA (Optional)" name="dba" value={formData.dba} onChange={handleChange} />

                            <Select label="Business Type" name="business_type" value={formData.business_type} onChange={handleChange}>
                                <option>LLC</option>
                                <option>Corporation</option>
                                <option>Sole Proprietor</option>
                                <option>Partnership</option>
                            </Select>

                            <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Input label="Street Address" name="address_street" value={formData.address_street} onChange={handleChange} containerClass="col-span-2 lg:col-span-1" required />
                                <Input label="City" name="address_city" value={formData.address_city} onChange={handleChange} required />
                                <Input label="State" name="address_state" value={formData.address_state} onChange={handleChange} required />
                                <Input label="ZIP Code" name="address_zip" value={formData.address_zip} onChange={handleChange} required />
                            </div>

                            <Input label="MC Number" name="mc_number" value={formData.mc_number} onChange={handleChange} required />
                            <Input label="DOT Number" name="dot_number" value={formData.dot_number} onChange={handleChange} required />
                            <Input label="EIN" name="ein" value={formData.ein} onChange={handleChange} required />
                            <Input label="Years in Business" name="years_in_business" type="number" value={formData.years_in_business} onChange={handleChange} required />
                        </Section>

                        {/* B. CONTACT INFO */}
                        <Section title="B. Contact Information">
                            <Input label="Primary Contact Name" name="primary_contact" value={formData.primary_contact} onChange={handleChange} required />
                            <Input label="Primary Phone" name="primary_phone" value={formData.primary_phone} onChange={handleChange} required />
                            <Input label="Primary Email" name="primary_email" type="email" value={formData.primary_email} onChange={handleChange} required />
                            <Input label="Dispatch Contact" name="dispatch_contact" value={formData.dispatch_contact} onChange={handleChange} />
                            <Input label="Dispatch Phone" name="dispatch_phone" value={formData.dispatch_phone} onChange={handleChange} />
                            <Input label="After Hours Phone" name="after_hours_phone" value={formData.after_hours_phone} onChange={handleChange} />
                            <Input label="Billing Email" name="billing_email" type="email" value={formData.billing_email} onChange={handleChange} required />
                        </Section>

                        {/* C. FLEET & OPS */}
                        <Section title="C. Fleet & Operations">
                            <Input label="Number of Trucks" name="truck_count" type="number" value={formData.truck_count} onChange={handleChange} required />
                            <Input label="Number of Drivers" name="driver_count" type="number" value={formData.driver_count} onChange={handleChange} required />

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Types</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    {['Dry Van', 'Reefer', 'Flatbed', 'Stepdeck', 'Power Only', 'Box Truck'].map(type => (
                                        <Checkbox key={type} label={type} value={type} onChange={(e) => handleArrayChange(e, 'equipment_types')} />
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Operating States ({formData.operating_states.length} Selected)</label>
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition border border-gray-300 font-semibold"
                                    >
                                        {formData.operating_states.length === allStates.length ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="h-40 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {allStates.map(state => (
                                        <Checkbox
                                            key={state}
                                            label={state}
                                            value={state}
                                            checked={formData.operating_states.includes(state)}
                                            onChange={(e) => handleArrayChange(e, 'operating_states')}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Select label="Hazmat Certified?" name="hazmat" value={formData.hazmat} onChange={(e) => setFormData({ ...formData, hazmat: e.target.value === 'true' })}>
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </Select>

                            <Select label="Safety Rating" name="safety_rating" value={formData.safety_rating} onChange={handleChange}>
                                <option>Satisfactory</option>
                                <option>Conditional</option>
                                <option>Unsatisfactory</option>
                                <option>Not Rated</option>
                            </Select>
                        </Section>

                        {/* D. INSURANCE */}
                        <Section title="D. Insurance Details">
                            <Input label="Liability Coverage $" name="liability_amount" value={formData.liability_amount} onChange={handleChange} required />
                            <Input label="Cargo Coverage $" name="cargo_amount" value={formData.cargo_amount} onChange={handleChange} required />
                            <Input label="Insurance Company" name="insurance_company" value={formData.insurance_company} onChange={handleChange} required />
                            <Input label="Agent Name" name="agent_name" value={formData.agent_name} onChange={handleChange} required />
                            <Input label="Agent Phone" name="agent_phone" value={formData.agent_phone} onChange={handleChange} required />
                            <Input label="Agent Email" name="agent_email" value={formData.agent_email} onChange={handleChange} required />
                            <Input label="Policy Expiration" type="date" name="policy_expiration" value={formData.policy_expiration} onChange={handleChange} required />
                        </Section>

                        {/* E. DOCUMENTS */}
                        <Section title="E. Required Documents">
                            <div className="col-span-2 grid md:grid-cols-2 gap-6">
                                <FileUploader label="W9 Form" file={files.w9} onChange={(e) => handleFileChange(e, 'w9')} />
                                <FileUploader label="Certificate of Insurance (COI)" file={files.coi} onChange={(e) => handleFileChange(e, 'coi')} />
                                <FileUploader label="Insurance Coverage Doc" file={files.insurance_doc} onChange={(e) => handleFileChange(e, 'insurance_doc')} />
                                <FileUploader label="MC Authority Letter" file={files.authority_letter} onChange={(e) => handleFileChange(e, 'authority_letter')} />
                                <FileUploader label="Signed Carrier Agreement" file={files.agreement} onChange={(e) => handleFileChange(e, 'agreement')} />
                                <FileUploader label="ACH / Voided Check" file={files.ach} onChange={(e) => handleFileChange(e, 'ach')} />
                            </div>
                        </Section>

                        {/* F. LEGAL COMPLIANCE */}
                        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-xl font-bold text-red-600 mb-6 border-b border-gray-100 pb-2">F. Legal Compliance</h3>
                            <div className="space-y-4">
                                <ComplianceCheck name="compliance_1" checked={formData.compliance_1} onChange={handleChange} label="I certify all information provided is accurate." />
                                <ComplianceCheck name="compliance_2" checked={formData.compliance_2} onChange={handleChange} label="I acknowledge Loyal Brokerage LLC may verify insurance, safety rating, and authority." />
                                <ComplianceCheck name="compliance_3" checked={formData.compliance_3} onChange={handleChange} label="I agree to abide by FMCSA regulations (49 CFR Parts 350–399)." />
                                <ComplianceCheck name="compliance_4" checked={formData.compliance_4} onChange={handleChange} label="I have read and accepted the Loyal Brokerage LLC Carrier Agreement." />
                            </div>
                            <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100 italic">
                                Submission of this application does not constitute a contractual relationship. Carrier Agreement will be provided upon approval.
                            </p>
                        </div>

                        {/* SUBMIT */}
                        <div className="pt-4 pb-20">
                            <p className="text-sm text-gray-500 mb-4 text-center">
                                Submission of this application does not constitute a contractual relationship. Carrier Agreement will be provided upon approval.
                            </p>
                            <button
                                type="submit"
                                disabled={loading || complianceRequired}
                                className={`w-full py-5 text-xl font-bold text-white rounded-xl transition shadow-lg ${loading || complianceRequired
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-700 hover:bg-blue-600 transform hover:scale-[1.01]"
                                    }`}
                            >
                                {loading ? "Processing Application..." : "Submit Application"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-blue-800 mb-6 border-b border-gray-100 pb-2">{title}</h3>
            <div className="grid md:grid-cols-2 gap-6">{children}</div>
        </div>
    );
}

function Input({ label, containerClass = "", ...props }) {
    return (
        <div className={`flex flex-col gap-2 ${containerClass}`}>
            <label className="text-sm font-bold text-gray-700">{label}</label>
            <input
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full p-3 shadow-sm border border-gray-300 font-medium"
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

function Checkbox({ label, ...props }) {
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" {...props} />
            <span className="text-sm text-gray-700 font-medium">{label}</span>
        </label>
    );
}

function ComplianceCheck({ label, ...props }) {
    return (
        <label className="flex items-start space-x-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition">
            <input type="checkbox" className="w-5 h-5 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" {...props} />
            <span className="text-sm text-gray-700 font-medium leading-relaxed">{label}</span>
        </label>
    );
}

function FileUploader({ label, file, onChange }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col gap-2 group hover:border-blue-500 transition">
            <label className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{label}</label>
            <div className="flex items-center justify-between">
                <input
                    type="file"
                    onChange={onChange}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
                {file && (
                    <span className="text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded border border-green-200">
                        Uploaded ✔
                    </span>
                )}
            </div>
        </div>
    );
}
