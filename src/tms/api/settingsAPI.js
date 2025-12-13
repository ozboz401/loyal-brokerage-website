// Settings API
import { supabase } from '../../lib/supabase';

export const settingsAPI = {
    // Fetch all settings
    async fetchSettings(category = null) {
        try {
            let query = supabase
                .from('tms_settings')
                .select('*')
                .order('category', { ascending: true });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Transform to key-value object
            const settings = {};
            data.forEach(setting => {
                settings[setting.key] = setting.value.value;
            });

            return { success: true, data: settings, raw: data };
        } catch (error) {
            console.error('Error fetching settings:', error);
            return { success: false, error: error.message };
        }
    },

    // Update a setting
    async updateSetting(key, value, userEmail) {
        try {
            const { data, error } = await supabase
                .from('tms_settings')
                .update({
                    value: { value },
                    updated_by: userEmail,
                    updated_at: new Date().toISOString()
                })
                .eq('key', key)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error updating setting:', error);
            return { success: false, error: error.message };
        }
    },

    // Create a new setting
    async createSetting(key, value, category, userEmail) {
        try {
            const { data, error } = await supabase
                .from('tms_settings')
                .insert([{
                    key,
                    value: { value },
                    category,
                    updated_by: userEmail
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Error creating setting:', error);
            return { success: false, error: error.message };
        }
    }
};
