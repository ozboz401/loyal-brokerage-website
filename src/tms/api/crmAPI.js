// Supabase adapter for CRM module
import { supabase } from '../../lib/supabase';

export const crmAPI = {
    // ===== OPPORTUNITIES =====

    // Fetch all opportunities with optional filters
    async fetchOpportunities(filters = {}) {
        try {
            let query = supabase
                .from('crm_opportunities')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.agentId) {
                query = query.eq('agent_id', filters.agentId);
            }
            if (filters.stage) {
                query = query.eq('stage', filters.stage);
            }
            if (filters.search) {
                query = query.or(`customer_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Transform to camelCase
            const transformed = data.map(opp => ({
                id: opp.id,
                customerName: opp.customer_name,
                contactEmail: opp.contact_email,
                contactPhone: opp.contact_phone,
                companyName: opp.company_name,
                carrierName: opp.carrier_name,
                loadId: opp.load_id,
                stage: opp.stage,
                rate: opp.estimated_rate,
                agentId: opp.agent_id,
                agent: opp.agent_name,
                agentName: opp.agent_name,
                notes: opp.notes,
                nextFollowUp: opp.next_follow_up,
                createdDate: opp.created_at?.split('T')[0]
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new opportunity
    async createOpportunity(oppData) {
        try {
            // Generate ID
            const { data: idData, error: idError } = await supabase.rpc('generate_opportunity_id');
            if (idError) throw idError;

            const insertData = {
                id: idData,
                customer_name: oppData.customerName,
                contact_email: oppData.contactEmail || null,
                contact_phone: oppData.contactPhone || null,
                company_name: oppData.companyName || null,
                carrier_name: oppData.carrierName || '',
                load_id: oppData.loadId || null,
                stage: oppData.stage || 'Prospect',
                estimated_rate: oppData.rate || null,
                agent_id: oppData.agentId,
                agent_name: oppData.agentName,
                notes: oppData.notes || null,
                next_follow_up: oppData.nextFollowUp || null
            };

            const { data, error } = await supabase
                .from('crm_opportunities')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            // Transform back
            const transformed = {
                id: data.id,
                customerName: data.customer_name,
                contactEmail: data.contact_email,
                contactPhone: data.contact_phone,
                companyName: data.company_name,
                carrierName: data.carrier_name,
                loadId: data.load_id,
                stage: data.stage,
                rate: data.estimated_rate,
                agentId: data.agent_id,
                agent: data.agent_name,
                agentName: data.agent_name,
                notes: data.notes,
                nextFollowUp: data.next_follow_up,
                createdDate: data.created_at?.split('T')[0]
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error creating opportunity:', error);
            return { success: false, error: error.message };
        }
    },

    // Update opportunity
    async updateOpportunity(id, updates) {
        try {
            const updateData = {
                customer_name: updates.customerName,
                contact_email: updates.contactEmail || null,
                contact_phone: updates.contactPhone || null,
                company_name: updates.companyName || null,
                carrier_name: updates.carrierName || '',
                load_id: updates.loadId || null,
                stage: updates.stage,
                estimated_rate: updates.rate || null,
                agent_id: updates.agentId,
                agent_name: updates.agentName,
                notes: updates.notes || null,
                next_follow_up: updates.nextFollowUp || null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('crm_opportunities')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                customerName: data.customer_name,
                contactEmail: data.contact_email,
                contactPhone: data.contact_phone,
                companyName: data.company_name,
                carrierName: data.carrier_name,
                loadId: data.load_id,
                stage: data.stage,
                rate: data.estimated_rate,
                agentId: data.agent_id,
                agent: data.agent_name,
                agentName: data.agent_name,
                notes: data.notes,
                nextFollowUp: data.next_follow_up,
                createdDate: data.created_at?.split('T')[0]
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error updating opportunity:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete opportunity
    async deleteOpportunity(id) {
        try {
            const { error } = await supabase
                .from('crm_opportunities')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== ACTIVITIES =====

    // Fetch activities for an opportunity
    async fetchActivities(opportunityId) {
        try {
            const { data, error } = await supabase
                .from('crm_activities')
                .select('*')
                .eq('opportunity_id', opportunityId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformed = data.map(activity => ({
                id: activity.id,
                opportunityId: activity.opportunity_id,
                activityType: activity.activity_type,
                description: activity.description,
                agentId: activity.agent_id,
                createdAt: activity.created_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching activities:', error);
            return { success: false, error: error.message };
        }
    },

    // Add activity
    async addActivity(activityData) {
        try {
            const insertData = {
                opportunity_id: activityData.opportunityId,
                activity_type: activityData.activityType,
                description: activityData.description,
                agent_id: activityData.agentId
            };

            const { data, error } = await supabase
                .from('crm_activities')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;

            const transformed = {
                id: data.id,
                opportunityId: data.opportunity_id,
                activityType: data.activity_type,
                description: data.description,
                agentId: data.agent_id,
                createdAt: data.created_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error adding activity:', error);
            return { success: false, error: error.message };
        }
    },

    // ===== HELPER FUNCTIONS =====

    // Get stage counts
    async getStageCounts() {
        try {
            const { data, error } = await supabase
                .from('crm_opportunities')
                .select('stage');

            if (error) throw error;

            const counts = {
                Prospect: 0,
                Lead: 0,
                Qualified: 0,
                Customer: 0,
                Repeat: 0
            };

            data.forEach(opp => {
                if (counts.hasOwnProperty(opp.stage)) {
                    counts[opp.stage]++;
                }
            });

            return { success: true, data: counts };
        } catch (error) {
            console.error('Error getting stage counts:', error);
            return { success: false, error: error.message };
        }
    }
};
