// Agent basic information with commission tracking and contract details
export const agentsData = [
    {
        id: 1,
        name: 'Ozan Akdemir',
        email: 'ozan@adafleet.com',
        phone: '555-0100',
        status: 'Active',
        hireDate: '2023-01-01',
        territory: 'All',
        commission: 20, // Commission rate percentage
        contractType: 'W-2',
        company: '', // Empty for W-2 employees
        loadsClosed: 25,
        totalCommission: 5000,
        notes: 'Owner and Admin'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@brokerflow.com',
        phone: '555-0201',
        status: 'Active',
        hireDate: '2023-06-15',
        territory: 'Northeast',
        commission: 15, // Commission rate percentage
        contractType: '1099',
        company: 'Smith Logistics LLC',
        loadsClosed: 14,
        totalCommission: 2450,
        notes: 'Specializes in reefer freight'
    },
    {
        id: 3,
        name: 'David Lopez',
        email: 'david@brokerflow.com',
        phone: '555-0202',
        status: 'Active',
        hireDate: '2023-09-01',
        territory: 'Southwest',
        commission: 12, // Commission rate percentage
        contractType: '1099',
        company: 'Lopez Freight Solutions',
        loadsClosed: 9,
        totalCommission: 1800,
        notes: 'Focus on flatbed and oversized loads'
    },
];

// Helper to get agent by ID
export const getAgentById = (id) => {
    return agentsData.find(agent => agent.id === id);
};

// Helper to get agent by name
export const getAgentByName = (name) => {
    return agentsData.find(agent => agent.name === name);
};

// Helper to get all active agents
export const getActiveAgents = () => {
    return agentsData.filter(agent => agent.status === 'Active');
};
