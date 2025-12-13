import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();

        // Subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
        setIsOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return null;
        const role = user.user_metadata?.role;

        if (role === 'admin') {
            return { path: '/tms', label: 'Dashboard' };
        } else if (role === 'agent') {
            return { path: '/tms/agent-dashboard', label: 'Agent Dashboard' };
        }
        return null;
    };

    const dashboardLink = getDashboardLink();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-white tracking-wide">
                    Loyal Brokerage LLC
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 items-center text-gray-300">
                    <Link to="/" className="hover:text-blue-400 transition">Home</Link>
                    <a href="/#services" className="hover:text-blue-400 transition">Services</a>
                    <Link to="/carrier-signup" className="hover:text-blue-400 transition">Join Our Carrier Network</Link>
                    <Link to="/request-quote" className="hover:text-blue-400 transition">Request a Quote</Link>
                    <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>

                    {/* Auth Buttons */}
                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    {dashboardLink && (
                                        <Link
                                            to={dashboardLink.path}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 transition-all font-semibold text-white shadow-md border border-blue-600/50"
                                        >
                                            <LayoutDashboard size={18} />
                                            {dashboardLink.label}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-all text-red-400 border border-red-500/30"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/tms-login"
                                    className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 transition-all font-semibold text-white shadow-md border border-blue-600/50"
                                >
                                    TMS Login
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-300 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-4 flex flex-col gap-4 text-gray-300">
                    <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Home</Link>
                    <a href="/#services" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Services</a>
                    <Link to="/carrier-signup" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Join Our Carrier Network</Link>
                    <Link to="/request-quote" onClick={() => setIsOpen(false)} className="text-left hover:text-blue-400">Request a Quote</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="text-left hover:text-blue-400">Contact</Link>

                    {/* Mobile Auth Buttons */}
                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    {dashboardLink && (
                                        <Link
                                            to={dashboardLink.path}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold text-center justify-center border border-blue-600/50"
                                        >
                                            <LayoutDashboard size={18} />
                                            {dashboardLink.label}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-lg text-red-400 border border-red-500/30 justify-center"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-blue-700 rounded-lg text-white font-semibold text-center border border-blue-600/50"
                                >
                                    TMS Login
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
