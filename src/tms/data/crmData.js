// CRM Opportunities Mock Data
// Stages: Prospect, Lead, Qualified, Customer, Repeat
// Conditional fields:
// - Carrier & Load ID: only for Customer and Repeat stages
// - Rate: only for Qualified, Customer, and Repeat stages

export const crmOpportunities = [
    {
        id: "OPP-001",
        customerName: "ABC Manufacturing",
        contactEmail: "john@abcmfg.com",
        carrier: "Ada Fleet LLC",
        loadId: "213-ABC",
        stage: "Customer",
        rate: 2000,
        agent: "Jane Smith",
        agentId: 2,
        createdDate: "2024-11-15"
    },
    {
        id: "OPP-002",
        customerName: "Max Steel Inc",
        contactEmail: "fred@maxsteel.com",
        carrier: "",
        loadId: "",
        stage: "Lead",
        rate: null,
        agent: "Ozan Akdemir",
        agentId: 1,
        createdDate: "2024-11-20"
    },
    {
        id: "OPP-003",
        customerName: "Global Trade Solutions",
        contactEmail: "contact@globaltrade.com",
        carrier: "",
        loadId: "",
        stage: "Qualified",
        rate: 1500,
        agent: "Jane Smith",
        agentId: 2,
        createdDate: "2024-11-18"
    },
    {
        id: "OPP-004",
        customerName: "Metro Freight Services",
        contactEmail: "alex@metrofreight.com",
        carrier: "Swift Carriers",
        loadId: "214-MET",
        stage: "Repeat",
        rate: 2500,
        agent: "David Lopez",
        agentId: 3,
        createdDate: "2024-10-05"
    },
    {
        id: "OPP-005",
        customerName: "City Logistics Hub",
        contactEmail: "maria@citylogistics.com",
        carrier: "",
        loadId: "",
        stage: "Prospect",
        rate: null,
        agent: "David Lopez",
        agentId: 3,
        createdDate: "2024-11-25"
    },
    {
        id: "OPP-006",
        customerName: "Fast Freight Co",
        contactEmail: "sarah@fastfreight.com",
        carrier: "Reliable Transport",
        loadId: "215-FFR",
        stage: "Customer",
        rate: 1800,
        agent: "Jane Smith",
        agentId: 2,
        createdDate: "2024-11-10"
    },
    {
        id: "OPP-007",
        customerName: "Quick Ship LLC",
        contactEmail: "robert@quickship.com",
        carrier: "",
        loadId: "",
        stage: "Qualified",
        rate: 2200,
        agent: "Ozan Akdemir",
        agentId: 1,
        createdDate: "2024-11-22"
    },
    {
        id: "OPP-008",
        customerName: "Prime Distribution",
        contactEmail: "info@primedist.com",
        carrier: "National Freight",
        loadId: "216-PRM",
        stage: "Repeat",
        rate: 3000,
        agent: "David Lopez",
        agentId: 3,
        createdDate: "2024-09-15"
    },
    {
        id: "OPP-009",
        customerName: "Elite Transport Group",
        contactEmail: "contact@elitetransport.com",
        carrier: "",
        loadId: "",
        stage: "Lead",
        rate: null,
        agent: "Jane Smith",
        agentId: 2,
        createdDate: "2024-11-28"
    },
    {
        id: "OPP-010",
        customerName: "Midwest Shipping Co",
        contactEmail: "ops@midwestship.com",
        carrier: "Central Carriers",
        loadId: "217-MWS",
        stage: "Customer",
        rate: 1750,
        agent: "Ozan Akdemir",
        agentId: 1,
        createdDate: "2024-11-12"
    }
];

// Helper function to get opportunities by agent
export const getOpportunitiesByAgent = (agentId) => {
    return crmOpportunities.filter(opp => opp.agentId === agentId);
};

// Helper function to get opportunities by stage
export const getOpportunitiesByStage = (stage) => {
    return crmOpportunities.filter(opp => opp.stage === stage);
};

// Helper function to get stage counts
export const getStageCounts = () => {
    return {
        Prospect: crmOpportunities.filter(opp => opp.stage === "Prospect").length,
        Lead: crmOpportunities.filter(opp => opp.stage === "Lead").length,
        Qualified: crmOpportunities.filter(opp => opp.stage === "Qualified").length,
        Customer: crmOpportunities.filter(opp => opp.stage === "Customer").length,
        Repeat: crmOpportunities.filter(opp => opp.stage === "Repeat").length,
    };
};

// Available stages for dropdown
export const STAGES = ["Prospect", "Lead", "Qualified", "Customer", "Repeat"];

// Helper to check if stage allows carrier/load ID
export const stageAllowsCarrierAndLoad = (stage) => {
    return stage === "Customer" || stage === "Repeat";
};

// Helper to check if stage allows rate
export const stageAllowsRate = (stage) => {
    return stage === "Qualified" || stage === "Customer" || stage === "Repeat";
};
