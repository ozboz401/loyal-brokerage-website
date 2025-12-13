import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { calculateGrossProfit, calculateProfitMargin, aggregateMonthlyProfits, calculateTotalRevenue, calculateTotalCarrierCosts, formatCurrency } from "../lib/finance";
import { DollarSign, TrendingUp, Percent } from "lucide-react";

export default function ProfitAnalytics({ accountingData }) {
    const totalRevenue = calculateTotalRevenue(accountingData);
    const totalCarrierCosts = calculateTotalCarrierCosts(accountingData);
    const grossProfit = calculateGrossProfit(totalRevenue, totalCarrierCosts);
    const profitMargin = calculateProfitMargin(grossProfit, totalRevenue);
    const monthlyProfits = aggregateMonthlyProfits(accountingData);

    return (
        <div className="mt-6 space-y-6">
            {/* Profit Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gross Profit */}
                <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all">
                            <DollarSign className="text-green-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400">Gross Profit</h3>
                            <p className="text-xs text-gray-500">Revenue - Carrier Costs</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-green-400">
                        {formatCurrency(grossProfit)}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                        <span>Revenue: {formatCurrency(totalRevenue)}</span>
                        <br />
                        <span>Costs: {formatCurrency(totalCarrierCosts)}</span>
                    </div>
                </div>

                {/* Profit Margin */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all">
                            <Percent className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400">Profit Margin</h3>
                            <p className="text-xs text-gray-500">Profit / Revenue × 100</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-400">
                        {profitMargin}%
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                        <span>Industry Avg: 15-20%</span>
                    </div>
                </div>

                {/* Average Profit per Load */}
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/10 border border-purple-500/20 p-6 rounded-xl hover:border-purple-500/40 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all">
                            <TrendingUp className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400">Avg Profit/Load</h3>
                            <p className="text-xs text-gray-500">Gross Profit / Total Loads</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">
                        {formatCurrency(accountingData.length > 0 ? grossProfit / accountingData.length : 0)}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                        <span>Total Loads: {accountingData.length}</span>
                    </div>
                </div>
            </div>

            {/* Monthly Profit Trend Chart */}
            <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">Monthly Profit Trend</h3>
                    <p className="text-sm text-gray-400">Gross profit performance over time</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyProfits}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                            }}
                            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                            formatter={(value) => [formatCurrency(value), 'Gross Profit']}
                        />
                        <Line
                            type="monotone"
                            dataKey="grossProfit"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ fill: '#22c55e', r: 5 }}
                            activeDot={{ r: 7, fill: '#16a34a' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
