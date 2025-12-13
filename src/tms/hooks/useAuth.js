import { useState, useEffect } from 'react';
import { users, defaultUser } from '../data/users';

const STORAGE_KEY = 'brokerflow_current_user';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        // Initialize from localStorage or use default
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return defaultUser;
            }
        }
        return defaultUser;
    });

    // Persist to localStorage whenever user changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    }, [currentUser]);

    const login = (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(defaultUser);
    };

    const switchUser = (userId) => {
        return login(userId);
    };

    const isAdmin = () => {
        return currentUser.role === 'Admin';
    };

    const isAgent = () => {
        return currentUser.role === 'Agent';
    };

    const hasAccess = (module) => {
        if (isAdmin()) return true;

        // Agent access restrictions
        const agentModules = ['dashboard', 'crm', 'customers'];
        return agentModules.includes(module.toLowerCase());
    };

    return {
        currentUser,
        login,
        logout,
        switchUser,
        isAdmin,
        isAgent,
        hasAccess,
        allUsers: users,
    };
};

// Future API placeholders for production implementation
// export const useAgentAuthAPI = () => {
//     // TODO: Implement JWT-based authentication
//     // - Login with credentials
//     // - Token refresh
//     // - Secure session management
//     // - Password reset flow
//     return {};
// };
