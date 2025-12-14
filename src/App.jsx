import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import CarrierSignup from "./pages/CarrierSignup";
import CarrierSuccess from "./pages/CarrierSuccess";
import RequestQuote from "./pages/RequestQuote";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import TMSLogin from "./pages/TMSLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import AgentRoute from "./components/AgentRoute";

// TMS Layout & Pages
import TMSLayout from "./tms/components/Layout";
import Dashboard from "./tms/pages/Dashboard";
import Carriers from "./tms/pages/Carriers";
import Customers from "./tms/pages/Customers";
import CRM from "./tms/pages/CRM";
import Accounting from "./tms/pages/Accounting";
import Settings from "./tms/pages/Settings";
import ActivityLogs from "./tms/pages/ActivityLogs";
import AgentPortal from "./tms/pages/AgentPortal";
import Agents from "./tms/pages/Agents";
import Loads from "./tms/pages/Loads";
import CarrierOnboardingPage from "./tms/pages/CarrierOnboardingPage";
import AdminCarrierPage from "./tms/pages/AdminCarrierPage";
import AgentDashboard from "./tms/pages/AgentDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ===================== */}
          {/* PUBLIC ROUTES */}
          {/* ===================== */}
          <Route path="/" element={<Home />} />
          <Route path="/carrier-signup" element={<CarrierSignup />} />
          <Route path="/carrier-success" element={<CarrierSuccess />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tms-login" element={<TMSLogin />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Admin dashboard (kendi içinde auth kontrolü var) */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* ===================== */}
          {/* ADMIN TMS ROUTES */}
          {/* ===================== */}
          <Route element={<AdminRoute />}>
            <Route path="/tms" element={<TMSLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="agent-portal" element={<AgentPortal />} />
              <Route path="loads" element={<Loads />} />
              <Route path="carriers" element={<Carriers />} />
              <Route path="admin/carriers" element={<AdminCarrierPage />} />
              <Route path="customers" element={<Customers />} />
              <Route path="crm" element={<CRM />} />
              <Route path="accounting" element={<Accounting />} />
              <Route path="agents" element={<Agents />} />
              <Route path="settings" element={<Settings />} />
              <Route path="activity-logs" element={<ActivityLogs />} />
            </Route>

            <Route
              path="/carrier-onboarding"
              element={<CarrierOnboardingPage />}
            />
          </Route>

          {/* ===================== */}
          {/* AGENT TMS ROUTES */}
          {/* ===================== */}
          <Route element={<AgentRoute />}>
            <Route path="/tms" element={<TMSLayout />}>
              <Route path="agent-dashboard" element={<AgentDashboard />} />
              <Route path="crm" element={<CRM />} />
            </Route>
          </Route>

          {/* ===================== */}
          {/* 🔥 CATCH-ALL (404 FIX) */}
          {/* ===================== */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
