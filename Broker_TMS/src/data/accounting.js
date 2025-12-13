// Load/Invoice data with carrier costs and agent commission for profit analysis
export const loadsData = [
    {
        id: 'LD-2040',
        customer: 'Walmart',
        customerRate: 2100,
        carrierRate: 1700,
        date: '2025-09-15',
        status: 'Paid',
        origin: 'Dallas, TX',
        destination: 'Phoenix, AZ',
        agentId: 2,
        agentName: 'Jane Smith',
        commission: 15
    },
    {
        id: 'LD-2041',
        customer: 'Target',
        customerRate: 1800,
        carrierRate: 1500,
        date: '2025-10-20',
        status: 'Paid',
        origin: 'Chicago, IL',
        destination: 'Denver, CO',
        agentId: 3,
        agentName: 'David Lopez',
        commission: 12
    },
    {
        id: 'LD-2042',
        customer: 'Costco',
        customerRate: 2200,
        carrierRate: 1850,
        date: '2025-11-05',
        status: 'Pending',
        origin: 'Los Angeles, CA',
        destination: 'Seattle, WA',
        agentId: 2,
        agentName: 'Jane Smith',
        commission: 15
    },
    {
        id: 'LD-2043',
        customer: 'Home Depot',
        customerRate: 1950,
        carrierRate: 1600,
        date: '2025-11-12',
        status: 'Paid',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        agentId: 3,
        agentName: 'David Lopez',
        commission: 12
    },
    {
        id: 'LD-2044',
        customer: 'Lowe\'s',
        customerRate: 2300,
        carrierRate: 1900,
        date: '2025-11-18',
        status: 'Pending',
        origin: 'Houston, TX',
        destination: 'San Antonio, TX',
        agentId: 2,
        agentName: 'Jane Smith',
        commission: 15
    },
    {
        id: 'LD-2045',
        customer: 'Walmart',
        customerRate: 2500,
        carrierRate: 2100,
        date: '2025-09-22',
        status: 'Paid',
        origin: 'New York, NY',
        destination: 'Boston, MA',
        agentId: 2,
        agentName: 'Jane Smith',
        commission: 15
    },
    {
        id: 'LD-2046',
        customer: 'Target',
        customerRate: 1700,
        carrierRate: 1400,
        date: '2025-10-28',
        status: 'Paid',
        origin: 'Portland, OR',
        destination: 'Sacramento, CA',
        agentId: 3,
        agentName: 'David Lopez',
        commission: 12
    },
    {
        id: 'LD-2047',
        customer: 'Costco',
        customerRate: 2400,
        carrierRate: 2000,
        date: '2025-11-25',
        status: 'Pending',
        origin: 'Philadelphia, PA',
        destination: 'Washington, DC',
        agentId: 3,
        agentName: 'David Lopez',
        commission: 12
    },
];

// Original accounting data exports (kept for backward compatibility)
export const invoicesData = [
    { id: 'INV-001', customer: 'Walmart', amount: '$4,500.00', status: 'Paid', dateSent: '2024-03-01' },
    { id: 'INV-002', customer: 'Target', amount: '$3,200.00', status: 'Pending', dateSent: '2024-03-05' },
    { id: 'INV-003', customer: 'Costco', amount: '$5,100.00', status: 'Overdue', dateSent: '2024-02-20' },
    { id: 'INV-004', customer: 'Home Depot', amount: '$2,800.00', status: 'Pending', dateSent: '2024-03-10' },
    { id: 'INV-005', customer: 'Lowe\'s', amount: '$1,900.00', status: 'Paid', dateSent: '2024-02-28' }
];

export const receivablesData = [
    { id: 1, customer: 'Costco', dueAmount: '$5,100.00', daysOutstanding: 45, status: 'Overdue' },
    { id: 2, customer: 'Target', dueAmount: '$3,200.00', daysOutstanding: 10, status: 'Current' },
    { id: 3, customer: 'Home Depot', dueAmount: '$2,800.00', daysOutstanding: 5, status: 'Current' }
];

export const expensesData = [
    { id: 1, category: 'Fuel', description: 'Diesel - Truck 101', amount: '$450.00', truck: '101', date: '2024-03-12' },
    { id: 2, category: 'Maintenance', description: 'Oil Change', amount: '$120.00', truck: '102', date: '2024-03-10' },
    { id: 3, category: 'Dispatch', description: 'Load Board Subscription', amount: '$99.00', truck: 'N/A', date: '2024-03-01' },
    { id: 4, category: 'Insurance', description: 'Monthly Premium', amount: '$1,200.00', truck: 'All', date: '2024-03-01' },
    { id: 5, category: 'Fuel', description: 'Diesel - Truck 103', amount: '$500.00', truck: '103', date: '2024-03-14' }
];
