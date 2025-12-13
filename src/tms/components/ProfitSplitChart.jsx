import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { formatCurrency } from "../lib/financePro";

export default function ProfitSplitChart({ data }) {
    return (
        <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Profit Split Overview</h3>
                <p className="text-sm text-gray-400">Monthly breakdown of gross profit, agent commissions, and net profit</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
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
                        labelStyle={{ color: '#9CA3AF', marginBottom: '8px', fontWeight: 'bold' }}
                        formatter={(value) => [formatCurrency(value), '']}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Bar
                        dataKey="gross"
                        fill="#22c55e"
                        name="Gross Profit"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="commission"
                        fill="#eab308"
                        name="Agent Commission"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="net"
                        fill="#60a5fa"
                        name="Net Profit"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
