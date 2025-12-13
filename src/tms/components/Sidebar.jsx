import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, DollarSign, Settings, UserCircle, UsersRound, FileText, LogOut } from 'lucide-react';
import { auth } from '../../lib/auth';
import { activityLogsAPI } from '../api/activityLogsAPI';

const Sidebar = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
    };

    const userRole = user?.user_metadata?.role;

    // Role-based navigation
    const navItems = userRole === 'agent' ? [
        { path: '/tms/agent-dashboard', icon: LayoutDashboard, label: 'Agent Dashboard' },
        { path: '/tms/crm', icon: UserCircle, label: 'CRM' },
    ] : [
        { path: '/tms', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/tms/loads', icon: Truck, label: 'Loads' },
        { path: '/tms/customers', icon: Users, label: 'Customers' },
        { path: '/tms/carriers', icon: Truck, label: 'Carriers' },
        { path: '/tms/crm', icon: UserCircle, label: 'CRM' },
        { path: '/tms/agents', icon: UsersRound, label: 'Agents' },
        { path: '/tms/accounting', icon: DollarSign, label: 'Accounting' },
        { path: '/tms/settings', icon: Settings, label: 'Settings' },
        { path: '/tms/activity-logs', icon: FileText, label: 'Activity Logs' },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-[#111827] to-[#0D0D0D] border-r border-gray-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    BrokerFlow Pro
                </h1>
                <p className="text-xs text-gray-400 mt-1">TMS & CRM System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={async () => {
                        const user = await auth.getCurrentUser();
                        if (user) {
                            await activityLogsAPI.createLog({
                                userEmail: user.email,
                                action: 'logout',
                                module: 'auth',
                                recordId: user.id
                            });
                        }
                        await auth.signOut();
                        window.location.href = '/tms-login';
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all duration-200 border border-red-500/30"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
