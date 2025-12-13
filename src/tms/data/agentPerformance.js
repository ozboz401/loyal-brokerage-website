// Agent performance metrics for admin monitoring
export const agentPerformanceData = [
    {
        agentId: 2,
        agentName: 'Jane Smith',
        loadsBooked: 45,
        customersAdded: 12,
        leadsAdded: 24,
        conversions: 38, // percentage
        avgRevenuePerCustomer: 5417,
        followUpRate: 92, // percentage
        totalRevenue: 65000,
        activeCustomers: 12,
        activeLeads: 24,
    },
    {
        agentId: 3,
        agentName: 'David Lopez',
        loadsBooked: 38,
        customersAdded: 9,
        leadsAdded: 18,
        conversions: 42, // percentage
        avgRevenuePerCustomer: 5778,
        followUpRate: 88, // percentage
        totalRevenue: 52000,
        activeCustomers: 9,
        activeLeads: 18,
    },
];

// Get performance for a specific agent
export const getAgentPerformance = (agentId) => {
    return agentPerformanceData.find(perf => perf.agentId === agentId) || null;
};

// Get all agent performance sorted by a metric
export const getLeaderboard = (sortBy = 'totalRevenue') => {
    return [...agentPerformanceData].sort((a, b) => b[sortBy] - a[sortBy]);
};
