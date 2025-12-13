import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Carriers from './pages/Carriers';
import Customers from './pages/Customers';
import CRM from './pages/CRM';
import Accounting from './pages/Accounting';
import Settings from './pages/Settings';
import AgentPortal from './pages/AgentPortal';
import Agents from './pages/Agents';
import Loads from './pages/Loads';
import CarrierOnboardingPage from './pages/CarrierOnboardingPage';
import AdminCarrierPage from './pages/AdminCarrierPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/carrier-onboarding" element={<CarrierOnboardingPage />} />
        <Route path="/" element={<Layout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
