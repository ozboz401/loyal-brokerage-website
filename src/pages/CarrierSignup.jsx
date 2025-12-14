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
    company_name: "",
    dba: "",
    business_type: "LLC",

    address_street: "",
    address_city: "",
    address_state: "",
    address_zip: "",

    mc_number: "",
    dot_number: "",
    ein: "",
    years_in_business: "",

    primary_contact: "",
    primary_phone: "",
    primary_email: "",

    dispatch_contact: "",
    dispatch_phone: "",
    billing_email: "",
    after_hours_phone: "",

    truck_count: "",
    driver_count: "",

    equipment_types: [],
    operating_states: [],

    hazmat: false,
    safety_rating: "Satisfactory",

    liability_amount: "",
    cargo_amount: "",

    insurance_company: "",
    agent_name: "",
    agent_email: "",
    agent_phone: "",
    policy_expiration: "",

    compliance_1: false,
    compliance_2: false,
    compliance_3: false,
    compliance_4: false,
  });

  const [files, setFiles] = useState({
    w9: null,
    coi: null,
    insurance_doc: null,
    authority_letter: null,
    agreement: null,
    ach: null,
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
    showToast("Submitting application...");

    // ✅ NORMALIZE FORM DATA (DATE alanları NULL olmalı)
    const normalizedFormData = {
      ...formData,
      policy_expiration:
        formData.policy_expiration && formData.policy_expiration !== ""
          ? formData.policy_expiration
          : null,
    };

    // 1️⃣ DB + file upload
    const result = await submitCarrierApplication(normalizedFormData, files);

    if (!result.success) {
      alert("Submission failed: " + result.message);
      setLoading(false);
      return;
    }

    // 2️⃣ EMAIL EDGE FUNCTION
    try {
      await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/carrier-signup-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: normalizedFormData,
          }),
        }
      );
    } catch (err) {
      console.error("Carrier email failed:", err);
    }

    showToast("Application submitted successfully!");
    navigate("/carrier-success");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {toast && (
        <div className="fixed top-24 right-5 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-xl z-50">
          {toast}
        </div>
      )}

      <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Carrier Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
            required
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Primary Email"
            type="email"
            value={formData.primary_email}
            onChange={(e) =>
              setFormData({ ...formData, primary_email: e.target.value })
            }
            required
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="MC Number"
            value={formData.mc_number}
            onChange={(e) =>
              setFormData({ ...formData, mc_number: e.target.value })
            }
            required
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="DOT Number"
            value={formData.dot_number}
            onChange={(e) =>
              setFormData({ ...formData, dot_number: e.target.value })
            }
            required
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Number of Trucks"
            type="number"
            value={formData.truck_count}
            onChange={(e) =>
              setFormData({ ...formData, truck_count: e.target.value })
            }
            className="w-full p-3 border rounded"
          />

          <input
            placeholder="Number of Drivers"
            type="number"
            value={formData.driver_count}
            onChange={(e) =>
              setFormData({ ...formData, driver_count: e.target.value })
            }
            className="w-full p-3 border rounded"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.compliance_1}
              onChange={(e) =>
                setFormData({ ...formData, compliance_1: e.target.checked })
              }
            />
            I certify the information is accurate
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.compliance_2}
              onChange={(e) =>
                setFormData({ ...formData, compliance_2: e.target.checked })
              }
            />
            I allow verification
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.compliance_3}
              onChange={(e) =>
                setFormData({ ...formData, compliance_3: e.target.checked })
              }
            />
            I agree to FMCSA regulations
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.compliance_4}
              onChange={(e) =>
                setFormData({ ...formData, compliance_4: e.target.checked })
              }
            />
            I accept the carrier agreement
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded font-bold disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
