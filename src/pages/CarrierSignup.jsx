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
        w9: null,
        coi: null,
        insurance_doc: null,
        authority_letter: null,
        agreement: null,
        ach: null
    });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.compliance_1 ||
            !formData.compliance_2 ||
            !formData.compliance_3 ||
            !formData.compliance_4
        ) {
            alert("Please agree to all legal compliance statements.");
            return;
        }

        setLoading(true);
        showToast("Uploading documents...");

        const result = await submitCarrierApplication(formData, files);

        if (result.success) {
            showToast("Form Submitted Successfully!");
            navigate("/carrier-success");
        } else {
            alert("Submission Failed: " + result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />

            {toast && (
                <div className="fixed top-24 right-5 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-xl z-50">
                    {toast}
                </div>
            )}

            <div className="pt-32 pb-20 px-4">
                <form onSubmit={handleSubmit}>
                    {/* form içeriği aynı */}
                </form>
            </div>

            <Footer />
        </div>
    );
}
