// Agent-specific dashboard statistics
// Indexed by agentId
export const agentDashboardStats = {
    2: { // Jane Smith
        agentId: 2,
        leads: 24,
        customers: 12,
        conversions: 38, // percentage
        revenue: 65000,
        followUps: 5,
        recentActivity: [
            { id: 1, type: 'lead', action: 'Added new lead', company: 'Tech Solutions Inc', time: '2 hours ago' },
            { id: 2, type: 'customer', action: 'Converted to customer', company: 'Global Logistics', time: '5 hours ago' },
            { id: 3, type: 'followup', action: 'Scheduled follow-up', company: 'Express Freight', time: '1 day ago' },
            { id: 4, type: 'lead', action: 'Updated lead status', company: 'Prime Shipping', time: '2 days ago' },
        ]
    },
    3: { // David Lopez
        agentId: 3,
        leads: 18,
        customers: 9,
        conversions: 42,
        revenue: 52000,
        followUps: 3,
        recentActivity: [
            { id: 1, type: 'customer', action: 'Added new customer', company: 'Metro Transport', time: '1 hour ago' },
            { id: 2, type: 'lead', action: 'Added new lead', company: 'City Logistics', time: '4 hours ago' },
            { id: 3, type: 'followup', action: 'Completed follow-up', company: 'Fast Delivery Co', time: '1 day ago' },
            { id: 4, type: 'lead', action: 'Moved lead to prospects', company: 'Quick Ship LLC', time: '3 days ago' },
        ]
    }
};

// Get stats for a specific agent
export const getAgentStats = (agentId) => {
    return agentDashboardStats[agentId] || {
        agentId,
        leads: 0,
        customers: 0,
        conversions: 0,
        revenue: 0,
        followUps: 0,
        recentActivity: []
    };
};
