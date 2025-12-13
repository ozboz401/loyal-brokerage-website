// Activity Logs API
import { supabase } from '../../lib/supabase';

export const activityLogsAPI = {
    // Create a log entry
    async createLog(logData) {
        try {
            const { data, error } = await supabase
                .from('activity_logs')
                .insert([{
                    user_id: logData.userId || null,
                    user_email: logData.userEmail || null,
                    action: logData.action,
                    module: logData.module,
                    record_id: logData.recordId || null,
                    details: logData.details || null,
                    ip_address: logData.ipAddress || null
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error creating activity log:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch logs with filters
    async fetchLogs(filters = {}) {
        try {
            let query = supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(filters.limit || 100);

            if (filters.userEmail) {
                query = query.eq('user_email', filters.userEmail);
            }

            if (filters.module) {
                query = query.eq('module', filters.module);
            }

            if (filters.action) {
                query = query.eq('action', filters.action);
            }

            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate);
            }

            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate);
            }

            const { data, error } = await query;
            if (error) throw error;

            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            return { success: false, error: error.message };
        }
    }
};

// Helper to log actions automatically
export const logAction = async (action, module, recordId, userEmail, details = null) => {
    await activityLogsAPI.createLog({
        action,
        module,
        recordId,
        userEmail,
        details
    });
};
