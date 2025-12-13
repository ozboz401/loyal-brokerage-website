// Loads Mock Data for BrokerFlow Pro
// Represents freight loads with pickup/delivery, rates, and profit tracking

export const loadsData = [
    {
        id: "L-2025-0001",
        customerId: 1,
        customerName: "ABC Manufacturing",
        carrierId: 1,
        carrierName: "Ada Fleet LLC",
        pickupAddress: "1234 Industrial Pkwy, Chicago, IL 60601",
        deliveryAddress: "5678 Commerce Dr, Dallas, TX 75201",
        rate: 2500,
        carrierCost: 1800,
        tripDistance: 967,
        status: "Delivered",
        equipmentType: "Dry Van",
        agentId: 2,
        agentName: "Jane Smith",
        appointmentDate: "2025-01-15",
        referenceNumber: "REF-ABC-001",
        notes: "Fragile items, handle with care",
        createdDate: "2025-01-10"
    },
    {
        id: "L-2025-0002",
        customerId: 2,
        customerName: "Max Steel Inc",
        carrierId: 2,
        carrierName: "Swift Carriers",
        pickupAddress: "789 Steel Ave, Pittsburgh, PA 15222",
        deliveryAddress: "321 Manufacturing Blvd, Detroit, MI 48201",
        rate: 1800,
        carrierCost: 1300,
        tripDistance: 288,
        status: "Booked",
        equipmentType: "Flatbed",
        agentId: 1,
        agentName: "Ozan Akdemir",
        appointmentDate: "2025-01-18",
        referenceNumber: "REF-MAX-002",
        notes: "Steel coils, requires tarps",
        createdDate: "2025-01-12"
    },
    {
        id: "L-2025-0003",
        customerId: 3,
        customerName: "Global Trade Solutions",
        carrierId: 3,
        carrierName: "Reliable Transport",
        pickupAddress: "456 Port St, Los Angeles, CA 90021",
        deliveryAddress: "789 Warehouse Way, Phoenix, AZ 85001",
        rate: 1200,
        carrierCost: 900,
        tripDistance: 373,
        status: "Delivered",
        equipmentType: "Dry Van",
        agentId: 2,
        agentName: "Jane Smith",
        appointmentDate: "2025-01-12",
        referenceNumber: "REF-GLO-003",
        notes: "Standard delivery",
        createdDate: "2025-01-08"
    },
    {
        id: "L-2025-0004",
        customerId: 4,
        customerName: "Metro Freight Services",
        carrierId: 1,
        carrierName: "Ada Fleet LLC",
        pickupAddress: "123 Food Processing Dr, Atlanta, GA 30303",
        deliveryAddress: "456 Distribution Center, Miami, FL 33101",
        rate: 1500,
        carrierCost: 1100,
        tripDistance: 662,
        status: "Booked",
        equipmentType: "Reefer",
        agentId: 3,
        agentName: "David Lopez",
        appointmentDate: "2025-01-20",
        referenceNumber: "REF-MET-004",
        notes: "Temperature controlled, keep at 35°F",
        createdDate: "2025-01-14"
    },
    {
        id: "L-2025-0005",
        customerId: 5,
        customerName: "Fast Freight Co",
        carrierId: 2,
        carrierName: "Swift Carriers",
        pickupAddress: "789 Tech Campus, Seattle, WA 98101",
        deliveryAddress: "321 Innovation Dr, San Francisco, CA 94102",
        rate: 2200,
        carrierCost: 1600,
        tripDistance: 808,
        status: "Pending",
        equipmentType: "Dry Van",
        agentId: 2,
        agentName: "Jane Smith",
        appointmentDate: "2025-01-22",
        referenceNumber: "REF-FST-005",
        notes: "Electronics, signature required",
        createdDate: "2025-01-15"
    },
    {
        id: "L-2025-0006",
        customerId: 6,
        customerName: "Quick Ship LLC",
        carrierId: 3,
        carrierName: "Reliable Transport",
        pickupAddress: "456 Manufacturing St, Houston, TX 77001",
        deliveryAddress: "789 Retail Plaza, New Orleans, LA 70112",
        rate: 1100,
        carrierCost: 800,
        tripDistance: 348,
        status: "Delivered",
        equipmentType: "Dry Van",
        agentId: 1,
        agentName: "Ozan Akdemir",
        appointmentDate: "2025-01-11",
        referenceNumber: "REF-QCK-006",
        notes: "Retail goods",
        createdDate: "2025-01-07"
    },
    {
        id: "L-2025-0007",
        customerId: 7,
        customerName: "Prime Distribution",
        carrierId: 1,
        carrierName: "Ada Fleet LLC",
        pickupAddress: "123 Warehouse Rd, Denver, CO 80201",
        deliveryAddress: "456 Logistics Center, Salt Lake City, UT 84101",
        rate: 1600,
        carrierCost: 1200,
        tripDistance: 525,
        status: "Booked",
        equipmentType: "Dry Van",
        agentId: 3,
        agentName: "David Lopez",
        appointmentDate: "2025-01-19",
        referenceNumber: "REF-PRM-007",
        notes: "Multiple pallets",
        createdDate: "2025-01-13"
    },
    {
        id: "L-2025-0008",
        customerId: 8,
        customerName: "Elite Transport Group",
        carrierId: 2,
        carrierName: "Swift Carriers",
        pickupAddress: "789 Industrial Park, Philadelphia, PA 19019",
        deliveryAddress: "321 Commerce Way, Boston, MA 02101",
        rate: 1300,
        carrierCost: 950,
        tripDistance: 304,
        status: "Cancelled",
        equipmentType: "Dry Van",
        agentId: 2,
        agentName: "Jane Smith",
        appointmentDate: "2025-01-16",
        referenceNumber: "REF-ELT-008",
        notes: "Cancelled by customer",
        createdDate: "2025-01-09"
    },
    {
        id: "L-2025-0009",
        customerId: 9,
        customerName: "Midwest Shipping Co",
        carrierId: 3,
        carrierName: "Reliable Transport",
        pickupAddress: "456 Farm Rd, Des Moines, IA 50301",
        deliveryAddress: "789 Processing Plant, Omaha, NE 68101",
        rate: 900,
        carrierCost: 650,
        tripDistance: 135,
        status: "Delivered",
        equipmentType: "Reefer",
        agentId: 1,
        agentName: "Ozan Akdemir",
        appointmentDate: "2025-01-13",
        referenceNumber: "REF-MID-009",
        notes: "Agricultural products",
        createdDate: "2025-01-10"
    },
    {
        id: "L-2025-0010",
        customerId: 1,
        customerName: "ABC Manufacturing",
        carrierId: 1,
        carrierName: "Ada Fleet LLC",
        pickupAddress: "1234 Industrial Pkwy, Chicago, IL 60601",
        deliveryAddress: "567 Distribution Ave, Indianapolis, IN 46201",
        rate: 1400,
        carrierCost: 1000,
        tripDistance: 185,
        status: "Pending",
        equipmentType: "Dry Van",
        agentId: 3,
        agentName: "David Lopez",
        appointmentDate: "2025-01-21",
        referenceNumber: "REF-ABC-010",
        notes: "Rush delivery",
        createdDate: "2025-01-15"
    },
    {
        id: "L-2025-0011",
        customerId: 10,
        customerName: "City Logistics Hub",
        carrierId: 2,
        carrierName: "Swift Carriers",
        pickupAddress: "123 Port Authority, Portland, OR 97201",
        deliveryAddress: "456 Warehouse District, Boise, ID 83701",
        rate: 1700,
        carrierCost: 1250,
        tripDistance: 428,
        status: "Booked",
        equipmentType: "Flatbed",
        agentId: 3,
        agentName: "David Lopez",
        appointmentDate: "2025-01-23",
        referenceNumber: "REF-CTY-011",
        notes: "Construction materials",
        createdDate: "2025-01-14"
    },
    {
        id: "L-2025-0012",
        customerId: 2,
        customerName: "Max Steel Inc",
        carrierId: 3,
        carrierName: "Reliable Transport",
        pickupAddress: "789 Steel Ave, Pittsburgh, PA 15222",
        deliveryAddress: "321 Construction Site, Cleveland, OH 44101",
        rate: 1000,
        carrierCost: 750,
        tripDistance: 134,
        status: "Delivered",
        equipmentType: "Flatbed",
        agentId: 1,
        agentName: "Ozan Akdemir",
        appointmentDate: "2025-01-14",
        referenceNumber: "REF-MAX-012",
        notes: "I-beams and structural steel",
        createdDate: "2025-01-11"
    }
];

// Load status types
export const LOAD_STATUSES = ["Pending", "Booked", "Delivered", "Cancelled"];

// Equipment types
export const EQUIPMENT_TYPES = ["Dry Van", "Reefer", "Flatbed", "Power Only"];

// Helper function to get loads by agent
export const getLoadsByAgent = (agentId) => {
    return loadsData.filter(load => load.agentId === agentId);
};

// Helper function to get loads by status
export const getLoadsByStatus = (status) => {
    return loadsData.filter(load => load.status === status);
};

// Helper function to calculate gross profit
export const calculateGrossProfit = (rate, carrierCost) => {
    return rate - carrierCost;
};

// Helper function to calculate profit margin percentage
export const calculateProfitMargin = (rate, carrierCost) => {
    if (rate === 0) return 0;
    return ((rate - carrierCost) / rate) * 100;
};

// Helper function to calculate agent commission
export const calculateAgentCommission = (grossProfit, commissionRate) => {
    return grossProfit * (commissionRate / 100);
};

// Helper function to generate next load ID
export const generateLoadId = () => {
    const year = new Date().getFullYear();
    const maxId = loadsData.reduce((max, load) => {
        const num = parseInt(load.id.split('-')[2]);
        return num > max ? num : max;
    }, 0);
    const nextNum = String(maxId + 1).padStart(4, '0');
    return `L-${year}-${nextNum}`;
};

// Helper function to get status counts
export const getStatusCounts = () => {
    return {
        Pending: loadsData.filter(l => l.status === "Pending").length,
        Booked: loadsData.filter(l => l.status === "Booked").length,
        Delivered: loadsData.filter(l => l.status === "Delivered").length,
        Cancelled: loadsData.filter(l => l.status === "Cancelled").length,
    };
};
