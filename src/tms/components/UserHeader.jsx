import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserHeader = () => {
  const { currentUser, allUsers, switchUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSwitch = (userId) => {
    switchUser(userId);
    setIsDropdownOpen(false);
  };

  // 🔥 KRİTİK: GÜVENLİ LOGOUT (404 FIX)
  const handleLogout = async () => {
    try {
      await logout(); // auth context logout
    } finally {
      setIsDropdownOpen(false);
      navigate("/", { replace: true }); // ❌ /tms-login YOK
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 pl-2 pr-3 py-1.5 h-12 bg-[#111827] border border-gray-800 rounded-full hover:border-gray-700 hover:bg-gray-900 transition-all group shadow-sm"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white overflow-hidden">
          {currentUser.avatar?.startsWith("http") ? (
            <img
              src={currentUser.avatar}
              alt="User"
              className="w-full h-full object-cover"
            />
          ) : (
            currentUser.name?.charAt(0) || "U"
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col items-start min-w-[80px] max-w-[120px]">
          <span className="text-sm font-semibold text-white truncate">
            {currentUser.name}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400">
            {currentUser.role}
          </span>
        </div>

        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#111827] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* User list */}
          <div className="p-2 max-h-[260px] overflow-y-auto">
            <div className="text-[10px] font-semibold text-gray-500 uppercase px-3 py-2">
              Switch Account (Demo)
            </div>

            {allUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSwitch(user.id)}
                disabled={user.id === currentUser.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  user.id === currentUser.id
                    ? "bg-blue-500/10 cursor-default"
                    : "hover:bg-gray-800"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                  {user.name?.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-gray-200 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-800 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHeader;
