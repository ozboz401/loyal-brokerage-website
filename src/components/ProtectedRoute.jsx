import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../lib/auth';
import { Loader } from 'lucide-react';

export default function ProtectedRoute({ requireAdmin = true }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser();

        // Subscribe to auth changes
        const { data: authListener } = auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (event === 'SIGNED_IN' && session) {
                setUser(session.user);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    // Logged in but not admin when admin is required
    if (requireAdmin && !auth.isAdmin(user)) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
                    <p className="text-gray-300 mb-6">
                        You do not have permission to access this resource. Admin privileges required.
                    </p>
                    <button
                        onClick={() => auth.signOut().then(() => window.location.href = '/admin')}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
}
