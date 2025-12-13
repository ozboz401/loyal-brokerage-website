/**
 * Financial Calculation Utilities
 * Provides functions for profit analysis and financial metrics
 */

/**
 * Calculate gross profit from customer and carrier rates
 * @param {number} customerRate - Revenue from customer
 * @param {number} carrierRate - Cost paid to carrier
 * @returns {number} Gross profit
 */
export function calculateGrossProfit(customerRate, carrierRate) {
    return customerRate - carrierRate;
}

/**
 * Calculate profit margin percentage
 * @param {number} grossProfit - Gross profit amount
 * @param {number} revenue - Total revenue
 * @returns {string} Profit margin as percentage string
 */
export function calculateProfitMargin(grossProfit, revenue) {
    if (!revenue || revenue === 0) return "0.00";
    return ((grossProfit / revenue) * 100).toFixed(2);
}

/**
 * Aggregate monthly profits from accounting data
 * @param {Array} accountingData - Array of accounting records
 * @returns {Array} Array of monthly profit objects
 */
export function aggregateMonthlyProfits(accountingData) {
    const months = {};

    accountingData.forEach(row => {
        // Extract month from date (YYYY-MM format)
        const month = row.date?.slice(0, 7) || "2025-11";
        const profit = calculateGrossProfit(row.customerRate || 0, row.carrierRate || 0);

        if (!months[month]) {
            months[month] = 0;
        }
        months[month] += profit;
    });

    // Convert to array and sort by month
    return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, value]) => ({
            month,
            grossProfit: value
        }));
}

/**
 * Calculate total revenue from accounting data
 * @param {Array} accountingData - Array of accounting records
 * @returns {number} Total revenue
 */
export function calculateTotalRevenue(accountingData) {
    return accountingData.reduce((sum, row) => sum + (row.customerRate || 0), 0);
}

/**
 * Calculate total carrier costs from accounting data
 * @param {Array} accountingData - Array of accounting records
 * @returns {number} Total carrier costs
 */
export function calculateTotalCarrierCosts(accountingData) {
    return accountingData.reduce((sum, row) => sum + (row.carrierRate || 0), 0);
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
