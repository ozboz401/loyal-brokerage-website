/**
 * Advanced Financial Calculation Utilities with Agent Commission
 * Provides functions for profit sharing and commission calculations
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
 * Calculate agent commission payout
 * @param {number} grossProfit - Gross profit amount
 * @param {number} commissionRate - Agent's commission percentage
 * @returns {number} Agent commission amount
 */
export function calculateAgentPay(grossProfit, commissionRate) {
    return grossProfit * (commissionRate / 100);
}

/**
 * Calculate net profit after agent commission
 * @param {number} customerRate - Revenue from customer
 * @param {number} carrierRate - Cost paid to carrier
 * @param {number} commissionRate - Agent's commission percentage
 * @returns {object} Object with gross, agentPay, and net profit
 */
export function calculateNetProfit(customerRate, carrierRate, commissionRate) {
    const gross = calculateGrossProfit(customerRate, carrierRate);
    const agentPay = calculateAgentPay(gross, commissionRate);
    return {
        gross,
        agentPay,
        net: gross - agentPay
    };
}

/**
 * Aggregate profit split data by month
 * @param {Array} accountingData - Array of accounting records with agent commission
 * @returns {Array} Monthly profit split data
 */
export function aggregateProfitSplit(accountingData) {
    const months = {};

    accountingData.forEach(row => {
        const month = row.date?.slice(0, 7) || "2025-11";
        const gross = calculateGrossProfit(row.customerRate || 0, row.carrierRate || 0);
        const commission = calculateAgentPay(gross, row.commission || 0);
        const net = gross - commission;

        if (!months[month]) {
            months[month] = { gross: 0, commission: 0, net: 0 };
        }

        months[month].gross += gross;
        months[month].commission += commission;
        months[month].net += net;
    });

    return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, values]) => ({
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
            ...values
        }));
}

/**
 * Calculate total commission for a specific agent
 * @param {Array} accountingData - Array of accounting records
 * @param {string} agentId - Agent ID to calculate for
 * @returns {number} Total commission earned
 */
export function calculateAgentTotalCommission(accountingData, agentId) {
    return accountingData
        .filter(row => row.agentId === agentId)
        .reduce((total, row) => {
            const gross = calculateGrossProfit(row.customerRate || 0, row.carrierRate || 0);
            return total + calculateAgentPay(gross, row.commission || 0);
        }, 0);
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
