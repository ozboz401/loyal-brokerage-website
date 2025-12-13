import React from 'react';
import AdminDashboard from '../components/CarrierOnboarding/AdminDashboard';

const AdminCarrierPage = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Carrier Management</h1>
                <p className="text-gray-500">Oversee carrier onboarding and compliance status.</p>
            </div>
            <AdminDashboard />
        </div>
    );
};

export default AdminCarrierPage;
