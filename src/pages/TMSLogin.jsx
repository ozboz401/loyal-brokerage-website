import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/auth';
import { activityLogsAPI } from '../tms/api/activityLogsAPI';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

const TMSLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await auth.signIn(email, password);

            if (!result.success) {
                setError(result.error || 'Login failed');
                setLoading(false);
                return;
            }

            //Get user role
            const userRole = result.user.user_metadata?.role;

            if (!userRole || (userRole !== 'admin' && userRole !== 'agent')) {
                setError('Invalid user role. Contact administrator.');
                await auth.signOut();
                setLoading(false);
                return;
            }

            // Log auth event
            await activityLogsAPI.createLog({
                userEmail: result.user.email,
                action: 'login',
                module: 'auth',
                recordId: result.user.id,
                details: { login_type: 'password', role: userRole }
            });

            // Role-based redirect
            if (userRole === 'admin') {
                // SYNC WITH MOCK AUTH STATE (Critical for UI access)
                const mockUser = {
                    id: result.user.id,
                    name: 'Admin User',
                    email: result.user.email,
                    role: 'Admin', // Capitalized to match useAuth expectation
                    avatar: '/avatars/default.png'
                };
                localStorage.setItem('brokerflow_current_user', JSON.stringify(mockUser));

                navigate('/tms');
            } else if (userRole === 'agent') {
                // SYNC WITH MOCK AUTH STATE
                const mockUser = {
                    id: result.user.id,
                    name: 'Agent User',
                    email: result.user.email,
                    role: 'Agent',
                    avatar: '/avatars/default.png'
                };
                localStorage.setItem('brokerflow_current_user', JSON.stringify(mockUser));

                navigate('/tms/agent-dashboard');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0D0D0D] to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                        BrokerFlow Pro
                    </h1>
                    <p className="text-gray-400 text-sm">TMS & CRM System - Portal Login</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <LogIn className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">TMS Login</h2>
                            <p className="text-sm text-gray-400">Enter your credentials</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="you@loyalbrokerage.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? (
                                <>
                                    <Loader className="animate-spin" size={18} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                        <Link
                            to="/"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-gray-500">
                    © 2024 BrokerFlow Pro. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default TMSLogin;
