"use client";

import { formatCurrency } from "@/lib/utils";
import { useLenderStats } from "@/hooks/useLenderStats";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LenderCharts } from "@/components/dashboard/LenderCharts";
import { LoanExplorerTable } from "@/components/dashboard/LoanExplorerTable";
import { LiquidityManager } from "@/components/dashboard/LiquidityManager";

export default function MarketsPage() {
    const { tvl } = useLenderStats();
    const [totalBorrows, setTotalBorrows] = useState(0);

    // Fetch Total Borrows from Active Loans
    useEffect(() => {
        const fetchBorrows = async () => {
            const { data, error } = await supabase
                .from('loans')
                .select('amount')
                .eq('status', 'funded'); // 'funded' means active loan

            if (error) {
                console.error("Error fetching borrows:", error);
                return;
            }

            // Sum up amounts
            const total = data?.reduce((acc, loan) => acc + (Number(loan.amount) || 0), 0) || 0;
            setTotalBorrows(total);
        };

        fetchBorrows();
    }, []);

    const utilizationRate = tvl > 0 ? (totalBorrows / tvl) * 100 : 0;

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white">Lending Markets</h2>
                <p className="text-[#9CA3AF]">Analyze protocol liquidity and find high-yield loan opportunities.</p>
            </header>

            {/* Layout follows Design System Grid/Column structure */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area - Spans 2 cols on Large screens */}
                <div className="lg:col-span-2 space-y-8">
                    <LenderCharts />
                    <LoanExplorerTable />
                </div>

                {/* Side Stats / Info - Spans 1 col */}
                <div className="space-y-6">
                    <LiquidityManager />

                    <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Market Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[#9CA3AF]">Total Supply (TVL)</span>
                                <span className="text-white font-mono">{formatCurrency(tvl)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#9CA3AF]">Total Borrows</span>
                                <span className="text-white font-mono">{formatCurrency(totalBorrows)}</span>
                            </div>
                            <div className="border-t border-[#252931] pt-4 flex justify-between items-center">
                                <span className="text-[#9CA3AF]">Utilization Rate</span>
                                <span className="text-[#00D4AA] font-bold">{utilizationRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#00D4AA]/20 to-[#00A884]/5 border border-[#00D4AA]/30 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-[#00D4AA] mb-2">Lender Pro Tip</h3>
                        <p className="text-sm text-[#9CA3AF] leading-relaxed">
                            Verified "Grade A" loans are backed by real-time Stripe revenue data, offering lower risk but stable 10-12% APY.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
