/**
 * useAPIPlaceholder
 * 
 * This is a placeholder hook to simulate API calls.
 * Replace this with actual API integration when backend is ready.
 */

import { crmOpportunities } from '../data/crmData';
import { agentsData } from '../data/agents';
import { loadsData } from '../data/loads';

// In-memory storage for mock data (simulates database)
let opportunitiesStore = [...crmOpportunities];
let agentsStore = [...agentsData];
let loadsStore = [...loadsData];

export const useAPIPlaceholder = () => {
    const fetchData = async (endpoint) => {
        console.log(`[API Placeholder] Fetching from: ${endpoint}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, data: [] };
    };

    // ===== OPPORTUNITIES CRUD =====

    const fetchOpportunities = async (filters = {}) => {
        console.log('[API Placeholder] Fetching opportunities', filters);
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...opportunitiesStore];

        if (filters.agentId) {
            filtered = filtered.filter(opp => opp.agentId === filters.agentId);
        }
        if (filters.stage) {
            filtered = filtered.filter(opp => opp.stage === filters.stage);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(opp =>
                opp.customerName.toLowerCase().includes(searchLower) ||
                opp.contactEmail.toLowerCase().includes(searchLower)
            );
        }

        return { success: true, data: filtered };
    };

    const createOpportunity = async (opportunityData) => {
        console.log('[API Placeholder] Creating opportunity', opportunityData);
        await new Promise(resolve => setTimeout(resolve, 400));

        const newOpportunity = {
            id: `OPP-${String(opportunitiesStore.length + 1).padStart(3, '0')}`,
            ...opportunityData,
            createdDate: new Date().toISOString().split('T')[0]
        };

        opportunitiesStore.push(newOpportunity);
        return { success: true, data: newOpportunity };
    };

    const updateOpportunity = async (id, updates) => {
        console.log('[API Placeholder] Updating opportunity', id, updates);
        await new Promise(resolve => setTimeout(resolve, 350));

        const index = opportunitiesStore.findIndex(opp => opp.id === id);
        if (index === -1) {
            return { success: false, error: 'Opportunity not found' };
        }

        opportunitiesStore[index] = { ...opportunitiesStore[index], ...updates };
        return { success: true, data: opportunitiesStore[index] };
    };

    const deleteOpportunity = async (id) => {
        console.log('[API Placeholder] Deleting opportunity', id);
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = opportunitiesStore.findIndex(opp => opp.id === id);
        if (index === -1) {
            return { success: false, error: 'Opportunity not found' };
        }

        opportunitiesStore.splice(index, 1);
        return { success: true };
    };

    // ===== AGENTS CRUD =====

    const fetchAgents = async (filters = {}) => {
        console.log('[API Placeholder] Fetching agents', filters);
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...agentsStore];

        if (filters.status) {
            filtered = filtered.filter(agent => agent.status === filters.status);
        }

        return { success: true, data: filtered };
    };

    const createAgent = async (agentData) => {
        console.log('[API Placeholder] Creating agent', agentData);
        await new Promise(resolve => setTimeout(resolve, 400));

        const newAgent = {
            id: Math.max(...agentsStore.map(a => a.id), 0) + 1,
            ...agentData,
            hireDate: new Date().toISOString().split('T')[0],
            loadsClosed: 0,
            totalCommission: 0
        };

        agentsStore.push(newAgent);
        return { success: true, data: newAgent };
    };

    const updateAgent = async (id, updates) => {
        console.log('[API Placeholder] Updating agent', id, updates);
        await new Promise(resolve => setTimeout(resolve, 350));

        const index = agentsStore.findIndex(agent => agent.id === id);
        if (index === -1) {
            return { success: false, error: 'Agent not found' };
        }

        agentsStore[index] = { ...agentsStore[index], ...updates };

        // Update agent name in all opportunities if name changed
        if (updates.name) {
            opportunitiesStore = opportunitiesStore.map(opp =>
                opp.agentId === id ? { ...opp, agent: updates.name } : opp
            );
        }

        return { success: true, data: agentsStore[index] };
    };

    const deleteAgent = async (id) => {
        console.log('[API Placeholder] Deleting agent', id);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if agent has assigned opportunities
        const assignedOpportunities = opportunitiesStore.filter(opp => opp.agentId === id);
        if (assignedOpportunities.length > 0) {
            return {
                success: false,
                error: `Agent has ${assignedOpportunities.length} assigned opportunities. Please reassign them before deleting.`
            };
        }

        const index = agentsStore.findIndex(agent => agent.id === id);
        if (index === -1) {
            return { success: false, error: 'Agent not found' };
        }

        agentsStore.splice(index, 1);
        return { success: true };
    };

    // Get current store state (for debugging)
    const getStoreState = () => {
        return {
            opportunities: opportunitiesStore,
            agents: agentsStore,
            loads: loadsStore
        };
    };

    // ===== LOADS CRUD =====

    const fetchLoads = async (filters = {}) => {
        console.log('[API Placeholder] Fetching loads', filters);
        await new Promise(resolve => setTimeout(resolve, 300));

        let filtered = [...loadsStore];

        if (filters.agentId) {
            filtered = filtered.filter(load => load.agentId === filters.agentId);
        }
        if (filters.status) {
            filtered = filtered.filter(load => load.status === filters.status);
        }
        if (filters.equipmentType) {
            filtered = filtered.filter(load => load.equipmentType === filters.equipmentType);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(load =>
                load.customerName.toLowerCase().includes(searchLower) ||
                load.carrierName.toLowerCase().includes(searchLower) ||
                load.id.toLowerCase().includes(searchLower)
            );
        }

        return { success: true, data: filtered };
    };

    const createLoad = async (loadData) => {
        console.log('[API Placeholder] Creating load', loadData);
        await new Promise(resolve => setTimeout(resolve, 400));

        const newLoad = {
            ...loadData,
            createdDate: new Date().toISOString().split('T')[0]
        };

        loadsStore.push(newLoad);

        // Auto-sync to CRM: Create opportunity for this load
        if (loadData.status === 'Booked' || loadData.status === 'Delivered') {
            const crmOpportunity = {
                id: `OPP-${String(opportunitiesStore.length + 1).padStart(3, '0')}`,
                customerName: loadData.customerName,
                contactEmail: '', // Would need to be provided or looked up
                carrier: loadData.carrierName,
                loadId: loadData.id,
                stage: 'Customer',
                rate: loadData.rate,
                agent: loadData.agentName,
                agentId: loadData.agentId,
                createdDate: new Date().toISOString().split('T')[0]
            };
            opportunitiesStore.push(crmOpportunity);
            console.log('[API Placeholder] Auto-created CRM opportunity:', crmOpportunity.id);
        }

        return { success: true, data: newLoad };
    };

    const updateLoad = async (id, updates) => {
        console.log('[API Placeholder] Updating load', id, updates);
        await new Promise(resolve => setTimeout(resolve, 350));

        const index = loadsStore.findIndex(load => load.id === id);
        if (index === -1) {
            return { success: false, error: 'Load not found' };
        }

        loadsStore[index] = { ...loadsStore[index], ...updates };

        // Update corresponding CRM opportunity if exists
        const oppIndex = opportunitiesStore.findIndex(opp => opp.loadId === id);
        if (oppIndex !== -1 && updates.rate) {
            opportunitiesStore[oppIndex].rate = updates.rate;
        }

        return { success: true, data: loadsStore[index] };
    };

    const deleteLoad = async (id) => {
        console.log('[API Placeholder] Deleting load', id);
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = loadsStore.findIndex(load => load.id === id);
        if (index === -1) {
            return { success: false, error: 'Load not found' };
        }

        loadsStore.splice(index, 1);
        return { success: true };
    };

    return {
        fetchData,
        // Opportunities
        fetchOpportunities,
        createOpportunity,
        updateOpportunity,
        deleteOpportunity,
        // Agents
        fetchAgents,
        createAgent,
        updateAgent,
        deleteAgent,
        // Loads
        fetchLoads,
        createLoad,
        updateLoad,
        deleteLoad,
        // Utilities
        getStoreState
    };
};

// ===== AGENT PORTAL API PLACEHOLDERS =====
// Future API hooks for production implementation

// export const useAgentAuthAPI = () => {
//     /**
//      * Handles secure agent authentication with JWT tokens
//      * - Login with email/password credentials
//      * - Token refresh and session management
//      * - Secure logout and token invalidation
//      * - Password reset flow
//      * - Multi-factor authentication support
//      */
//     return {};
// };

// export const useCRMActivityAPI = () => {
//     /**
//      * Tracks and retrieves CRM actions by agent
//      * - Log lead creation, updates, and conversions
//      * - Track agent interactions (calls, emails, meetings)
//      * - Retrieve activity timeline for specific agent
//      * - Generate activity reports and analytics
//      * - Real-time activity notifications
//      */
//     return {};
// };

// export const useAgentPerformanceAPI = () => {
//     /**
//      * Retrieves aggregated performance metrics for agents
//      * - Fetch individual agent performance data
//      * - Generate comparative analytics across agents
//      * - Calculate conversion rates and revenue metrics
//      * - Track KPIs over time periods
//      * - Export performance reports
//      */
//     return {};
// };

// export const useCustomerOwnershipAPI = () => {
//     /**
//      * Enforces lead and customer ownership rules
//      * - Assign leads/customers to specific agents
//      * - Transfer ownership between agents
//      * - Validate agent permissions for customer access
//      * - Handle ownership conflicts and reassignments
//      * - Track ownership history and audit trail
//      */
//     return {};
// };

