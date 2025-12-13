import { supabase } from './supabase';

export const auth = {
    // Get current authenticated user
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error getting current user:', error);
                return null;
            }

            return user;
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            return null;
        }
    },

    // Get user session
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
                return null;
            }

            return session;
        } catch (error) {
            console.error('Error in getSession:', error);
            return null;
        }
    },

    // Sign in with email/password
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            console.error('Error in signIn:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            console.error('Error in signOut:', error);
            return { success: false, error: error.message };
        }
    },

    // Check if user is admin
    isAdmin(user) {
        if (!user) return false;
        return user.user_metadata?.role === 'admin';
    },

    // Check if user is agent
    isAgent(user) {
        if (!user) return false;
        return user.user_metadata?.role === 'agent';
    },

    // Subscribe to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

export default auth;
