import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserHeader from './UserHeader';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#0D0D0D] text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                {/* User Header */}
                <div className="p-4 border-b border-gray-800 flex justify-end">
                    <UserHeader />
                </div>
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
