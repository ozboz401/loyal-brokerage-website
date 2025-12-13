// Supabase adapter for Agents module
import { supabase } from '../../lib/supabase';

export const agentsAPI = {
    // Fetch all agents
    async fetchAgents(filters = {}) {
        try {
            let query = supabase
                .from('agents')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.status) {
                query = query.eq('is_active', filters.status === 'Active');
            }


            const { data, error } = await query;
            if (error) throw error;

            // Transform to camelCase
            const transformed = data.map(agent => ({
                id: agent.id,
                name: agent.full_name,
                email: agent.email,
                phone: agent.phone,
                company: agent.company_name,
                commissionRate: agent.commission_percent, // Updated column
                hireDate: agent.created_at,
                status: agent.is_active ? 'Active' : 'Inactive', // Map boolean to string
                createdAt: agent.created_at
            }));

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error fetching agents:', error);
            return { success: false, error: error.message };
        }
    },

    // Create new agent (Note: Primary creation is now via Edge Function in AddAgentModal)
    async createAgent(agentData) {
        // This method might still be used by other parts or legacy tests
        // But for consistency we should warn or point to the edge function
        console.warn("Use create-agent-user Edge Function for full agent creation");

        try {
            const { data, error } = await supabase
                .from('agents')
                .insert([{
                    full_name: agentData.name,
                    email: agentData.email,
                    phone: agentData.phone,
                    commission_percent: agentData.commissionRate, // Updated
                    is_active: agentData.status === 'Active', // Updated
                    company_name: agentData.company || 'Unknown' // Fallback
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update agent
    async updateAgent(id, updates) {
        try {
            // Call Edge Function to handle Auth syncing + DB update
            const { data, error } = await supabase.functions.invoke('update-agent', {
                body: {
                    agentId: id,
                    ...updates
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            // Transform response data to camelCase if needed, or just return data.data
            // The edge function returns clean snake_case DB object in data.data
            const raw = data.data;
            const transformed = {
                id: raw.id,
                name: raw.full_name,
                email: raw.email,
                phone: raw.phone,
                company: raw.company_name,
                commissionRate: raw.commission_percent,
                status: raw.is_active ? 'Active' : 'Inactive',
                createdAt: raw.created_at
            };

            return { success: true, data: transformed };
        } catch (error) {
            console.error('Error updating agent:', error);
            return { success: false, error: error.message };
        }
    },



    // Delete agent
    async deleteAgent(id) {
        try {
            const { error } = await supabase
                .from('agents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting agent:', error);
            return { success: false, error: error.message };
        }
    },

    // Get agent performance (Mocked for now as we don't have load data structure fully defined for new agents table yet)
    async getAgentPerformance(agentId, startDate, endDate) {
        // Implementation depends on loads table linking to 'agents' table via agent_id
        return {
            success: true,
            data: {
                agentId,
                totalLoads: 0,
                totalRevenue: 0,
                totalProfit: 0,
                conversionRate: 0,
                activeOpportunities: 0
            }
        };
    }
};

