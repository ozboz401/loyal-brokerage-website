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

    // Ensure we have a user to display preventing crashes
    if (!currentUser) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 h-12 bg-[#111827] border border-gray-800 rounded-full hover:border-gray-700 hover:bg-gray-900 transition-all group shadow-sm"
            >
                {/* Avatar */}
                <div className="w-8 h-8 min-w-[32px] rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white shadow-inner overflow-hidden">
                    {(currentUser.avatar && (currentUser.avatar.startsWith('/') || currentUser.avatar.startsWith('http'))) ? (
                        <img
                            src={currentUser.avatar}
                            alt="User"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide broken image
                                e.target.parentElement.innerText = currentUser.name?.charAt(0) || 'U'; // Fallback to initial
                            }}
                        />
                    ) : (
                        currentUser.avatar || currentUser.name?.charAt(0) || 'U'
                    )}
                </div>

                {/* User Info (Hidden on very small mobile if needed, but keeping for now) */}
                <div className="flex flex-col items-start min-w-[80px] max-w-[120px]">
                    <span className="text-sm font-semibold text-white truncate w-full text-left leading-tight">
                        {currentUser.name || 'User'}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 truncate ${currentUser.role === 'Admin' ? 'text-blue-400' : 'text-green-400'}`}>
                        {currentUser.role || 'Agent'}
                    </span>
                </div>

                {/* Dropdown Icon */}
                <div className={`p-1 rounded-full text-gray-400 group-hover:text-white transition-colors duration-200`}>
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#111827] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

                    {/* Header Section */}
                    <div className="p-4 border-b border-gray-800 bg-gray-900/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden">
                                {(currentUser.avatar && (currentUser.avatar.startsWith('/') || currentUser.avatar.startsWith('http'))) ? (
                                    <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    currentUser.avatar
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                                <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Switch User Section (Demo) */}
                    <div className="p-2 space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                            Switch Account (Demo)
                        </div>
                        {allUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSwitch(user.id)}
                                disabled={user.id === currentUser.id}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${user.id === currentUser.id
                                    ? 'bg-blue-500/10 border border-blue-500/20 cursor-default'
                                    : 'hover:bg-gray-800 border border-transparent hover:border-gray-700'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden ${user.role === 'Admin'
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white'
                                    : 'bg-gradient-to-br from-green-500 to-emerald-400 text-white'
                                    }`}>
                                    {(user.avatar && (user.avatar.startsWith('/') || user.avatar.startsWith('http'))) ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        user.avatar
                                    )}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className={`text-sm font-medium truncate ${user.id === currentUser.id ? 'text-blue-400' : 'text-gray-200'}`}>
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        {user.role} {user.id === currentUser.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1" />}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserHeader;
