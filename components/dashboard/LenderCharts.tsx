"use client";

import React from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
    { date: "Jan", tvl: 4000 },
    { date: "Feb", tvl: 3000 },
    { date: "Mar", tvl: 5000 },
    { date: "Apr", tvl: 4500 },
    { date: "May", tvl: 6000 },
    { date: "Jun", tvl: 5500 },
    { date: "Jul", tvl: 7000 },
];


const chartConfig_lender = {
    tvl: {
        label: "TVL",
        color: "#00D4AA",
    },
}

export function LenderCharts() {
    return (
        <div className="w-full bg-[#1E222E] border border-[#252931] rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="text-sm text-[#9CA3AF] mb-1">Total Value Locked</div>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                        $22,193.05
                        <span className="text-sm font-semibold text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded">+47.3%</span>
                    </div>
                </div>
                <div className="flex bg-[#13161F] p-1 rounded-lg border border-[#252931]">
                    {['1D', '7D', '1M', '1Y'].map((p) => (
                        <button key={p} className="px-3 py-1 text-sm font-medium text-[#6B7280] hover:text-white rounded-md transition-colors">
                            {p}
                        </button>
                    ))}
                    <button className="px-3 py-1 text-sm font-bold text-[#13161F] bg-white rounded-md shadow-sm">1Y</button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ChartContainer config={chartConfig_lender} className="h-full w-full">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#252931" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                        <Tooltip
                            content={<ChartTooltipContent />}
                            cursor={{ stroke: '#252931', strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="tvl"
                            stroke="#00D4AA"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTvl)"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
}
