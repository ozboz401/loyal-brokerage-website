import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, DollarSign, Settings, UserCircle, UsersRound, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { isAdmin } = useAuth();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Agent'] },
        { path: '/carriers', icon: Truck, label: 'Carriers', roles: ['Admin'] },
        { path: '/admin/carriers', icon: FileText, label: 'Carrier Admin', roles: ['Admin'] },
        { path: '/loads', icon: Truck, label: 'Loads', roles: ['Admin', 'Agent'] },
        { path: '/customers', icon: Users, label: 'Customers', roles: ['Admin', 'Agent'] },
        { path: '/crm', icon: UserCircle, label: 'CRM', roles: ['Admin', 'Agent'] },
        { path: '/accounting', icon: DollarSign, label: 'Accounting', roles: ['Admin'] },
        { path: '/agents', icon: UsersRound, label: 'Agents', roles: ['Admin'] },
        { path: '/settings', icon: Settings, label: 'Settings', roles: ['Admin'] },
    ];

    // Filter navigation items based on user role
    const visibleNavItems = navItems.filter(item => {
        if (isAdmin()) return true;
        return item.roles.includes('Agent');
    });

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
                {visibleNavItems.map((item) => {
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
                © 2024 BrokerFlow Pro
            </div>
        </aside>
    );
};

export default Sidebar;
