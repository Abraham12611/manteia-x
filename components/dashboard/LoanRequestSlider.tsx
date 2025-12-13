"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Info } from "@phosphor-icons/react";

interface LoanRequestSliderProps {
    min?: number;
    max?: number;
    step?: number;
    onRequestLoan: (amount: number, purpose: string, sector: string) => void;
}

export function LoanRequestSlider({
    min = 1000,
    max = 50000,
    step = 500,
    onRequestLoan
}: LoanRequestSliderProps) {
    const [amount, setAmount] = useState<number>(10000);
    const [purpose, setPurpose] = useState("");
    const [sector, setSector] = useState("");

    const interestRate = 0.05; // 5% fixed for MVP
    const repayment = amount * (1 + interestRate);

    const handleSliderChange = (value: number[]) => {
        setAmount(value[0]);
    };

    return (
        <div className="w-full max-w-2xl bg-[#1E222E] border border-[#252931] rounded-2xl p-8 shadow-card">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-white">Request Financing</h2>
                    <p className="text-[#6B7280] text-sm mt-1">Adjust the amount you wish to borrow against your revenue.</p>
                </div>
                <div className="bg-[#252A36] px-3 py-1 rounded-full text-xs font-medium text-[#00D4AA] border border-[#00D4AA]/20">
                    Limit: $50,000
                </div>
            </div>

            {/* Amount Display */}
            <div className="mb-8 text-center">
                <div className="text-5xl font-bold text-white tracking-tight font-serif mb-2">
                    {formatCurrency(amount)}
                </div>
                <div className="text-[#9CA3AF] font-medium">USDC Requested</div>
            </div>

            {/* Slider */}
            <div className="mb-8 px-2">
                <Slider
                    defaultValue={[amount]}
                    max={max}
                    min={min}
                    step={step}
                    onValueChange={handleSliderChange}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-2 font-mono">
                    <span>{formatCurrency(min)}</span>
                    <span>{formatCurrency(max)}</span>
                </div>
            </div>

            {/* Metadata Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">Loan Purpose</label>
                    <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g. Marketing"
                        className="w-full bg-[#13161F] border border-[#252931] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] placeholder:text-[#4B5563]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">Business Sector</label>
                    <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-[#13161F] border border-[#252931] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D4AA] appearance-none"
                    >
                        <option value="" disabled>Select Sector</option>
                        <option value="SaaS">SaaS</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="DeFi">DeFi Infrastructure</option>
                        <option value="Consumer">Consumer App</option>
                        <option value="Agency">Agency / Service</option>
                    </select>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#13161F] p-4 rounded-xl border border-[#252931]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Interest Rate</span>
                        <Info size={14} className="text-[#6B7280]" />
                    </div>
                    <div className="text-lg font-bold text-white">5.00%</div>
                </div>
                <div className="bg-[#13161F] p-4 rounded-xl border border-[#252931]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">Total Repayment</span>
                    </div>
                    <div className="text-lg font-bold text-[#00D4AA]">
                        {formatCurrency(repayment)}
                    </div>
                </div>
            </div>

            {/* Action */}
            <Button
                variant="brand"
                size="lg"
                className="w-full text-lg font-bold shadow-neon h-14"
                disabled={!purpose || !sector}
                onClick={() => {
                    onRequestLoan(amount, purpose, sector);
                }}
            >
                Confirm Request
            </Button>

            <p className="text-center text-xs text-[#4B5563] mt-4">
                By confirming, you agree to the Repayment Terms and Smart Contract interaction.
            </p>
        </div>
    );
}
