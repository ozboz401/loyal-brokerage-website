import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../lib/auth';
import { Loader } from 'lucide-react';

export default function AdminRoute() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!user || user.user_metadata?.role !== 'admin') {
        return <Navigate to="/tms-login" replace />;
    }

    return <Outlet />;
}
