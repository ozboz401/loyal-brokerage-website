// Dashboard Analytics API
import { supabase } from '../../lib/supabase';

export const dashboardAPI = {
    // Get loads this month
    async getLoadsThisMonth() {
        try {
            const { data, error } = await supabase.rpc('get_loads_this_month');
            if (error) throw error;

            return {
                success: true,
                data: data[0] || { total_count: 0, total_revenue: 0 }
            };
        } catch (error) {
            console.error('Error fetching loads this month:', error);
            return { success: false, error: error.message };
        }
    },

    // Get outstanding receivables
    async getOutstandingReceivables() {
        try {
            const { data, error } = await supabase.rpc('get_outstanding_receivables');
            if (error) throw error;

            return {
                success: true,
                data: data[0] || { total_outstanding: 0, count_pending: 0 }
            };
        } catch (error) {
            console.error('Error fetching receivables:', error);
            return { success: false, error: error.message };
        }
    },

    // Get aged receivables
    async getAgedReceivables() {
        try {
            const { data, error } = await supabase.rpc('get_aged_receivables');
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching aged receivables:', error);
            return { success: false, error: error.message };
        }
    },

    // Get top customers
    async getTopCustomers(limit = 5) {
        try {
            const { data, error } = await supabase.rpc('get_top_customers', { limit_count: limit });
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching top customers:', error);
            return { success: false, error: error.message };
        }
    },

    // Get top carriers
    async getTopCarriers(limit = 5) {
        try {
            const { data, error } = await supabase.rpc('get_top_carriers', { limit_count: limit });
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching top carriers:', error);
            return { success: false, error: error.message };
        }
    },

    // Get agent leaderboard
    async getAgentLeaderboard() {
        try {
            const { data, error } = await supabase.rpc('get_agent_leaderboard');
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching agent leaderboard:', error);
            return { success: false, error: error.message };
        }
    },

    // Get weekly revenue
    async getWeeklyRevenue(weeks = 12) {
        try {
            const { data, error } = await supabase.rpc('get_weekly_revenue', { weeks_count: weeks });
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching weekly revenue:', error);
            return { success: false, error: error.message };
        }
    },

    // Get load status breakdown
    async getLoadStatusBreakdown() {
        try {
            const { data, error } = await supabase.rpc('get_load_status_breakdown');
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching load status breakdown:', error);
            return { success: false, error: error.message };
        }
    },

    // Get carrier payables
    async getCarrierPayables() {
        try {
            const { data, error } = await supabase.rpc('get_carrier_payables');
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching carrier payables:', error);
            return { success: false, error: error.message };
        }
    }
};
