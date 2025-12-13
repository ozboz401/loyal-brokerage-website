import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserHeader = () => {
    const { currentUser, allUsers, switchUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUserSwitch = (userId) => {
        switchUser(userId);
        setIsDropdownOpen(false);
    };

    const getRoleBadgeColor = (role) => {
        return role === 'Admin'
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : 'bg-green-500/20 text-green-400 border-green-500/30';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-[#111827] border border-gray-800 rounded-lg hover:border-gray-700 transition-all group"
            >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-semibold text-sm">
                    {currentUser.avatar}
                </div>

                {/* User Info */}
                <div className="text-left">
                    <div className="text-sm font-medium text-white">{currentUser.name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded border inline-block ${getRoleBadgeColor(currentUser.role)}`}>
                        {currentUser.role}
                    </div>
                </div>

                {/* Dropdown Icon */}
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#111827] border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Current User Info */}
                    <div className="p-3 border-b border-gray-800 bg-gray-900/50">
                        <div className="text-xs text-gray-400 mb-1">Signed in as</div>
                        <div className="text-sm font-medium text-white">{currentUser.email}</div>
                    </div>

                    {/* Switch User Section (Demo Only) */}
                    <div className="p-2">
                        <div className="text-xs text-gray-500 px-2 py-1 mb-1">Switch User (Demo)</div>
                        {allUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSwitch(user.id)}
                                disabled={user.id === currentUser.id}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${user.id === currentUser.id
                                        ? 'bg-blue-600/20 border border-blue-600/30 cursor-default'
                                        : 'hover:bg-gray-800 border border-transparent'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${user.role === 'Admin'
                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
                                        : 'bg-gradient-to-br from-green-500 to-emerald-400'
                                    }`}>
                                    {user.avatar}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                    <div className="text-xs text-gray-400">{user.role}</div>
                                </div>
                                {user.id === currentUser.id && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHeader;
