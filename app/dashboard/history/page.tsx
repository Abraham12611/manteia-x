"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Spinner } from "@phosphor-icons/react";

import { LoanHistoryTable } from "@/components/dashboard/history/LoanHistoryTable";

// Define basic types based on Schema
interface Loan {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    tx_hash: string;
    chain_loan_id: string;
}

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    created_at: string;
    tx_hash?: string;
}

export default function LoanHistoryPage() {
    const { address } = useAccount();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { writeContractAsync } = useWriteContract();

    // Repayment Handler
    const handleRepay = async (loanId: string, amount: number) => {
        const toastId = toast.loading("Processing Repayment...");
        try {
            console.log("Repaying Loan:", loanId, "Amount:", amount);

            // 1. Send USDC Transfer Transaction
            const { CONTRACT_ADDRESSES } = await import("@/lib/contracts");
            const { parseUnits } = await import("viem");

            // Standard ERC20 Transfer ABI
            const erc20Abi = [
                {
                    constant: false,
                    inputs: [
                        { name: "to", type: "address" },
                        { name: "amount", type: "uint256" }
                    ],
                    name: "transfer",
                    outputs: [{ name: "", type: "bool" }],
                    type: "function"
                }
            ];

            const txHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.MOCK_USDC,
                abi: erc20Abi,
                functionName: "transfer",
                args: [
                    CONTRACT_ADDRESSES.LENDING_VAULT,
                    parseUnits(amount.toString(), 6) // USDC 6 decimals
                ]
            });

            console.log("Repayment TX:", txHash);
            toast.message("Transaction sent! Waiting for confirmation...", { id: toastId });

            // 2. Update Supabase (Optimistic update for Demo)
            // In production, we'd wait for chain confirmation or indexer.

            // Update Loan Status
            const { error: loanError } = await supabase
                .from('loans')
                .update({ status: 'repaid' }) // Mark full loan as repaid for MVP
                .eq('id', loanId);

            if (loanError) throw loanError;

            // Log Transaction
            const { error: txError } = await supabase.from('transactions').insert({
                user_address: address, // Ensure address is defined in component scope
                type: 'repayment',
                amount: amount,
                tx_hash: txHash,
                status: 'pending'
            });

            if (txError) throw txError;

            // 3. Success Feedback
            toast.success("Repayment Successful!", { id: toastId });

            // 4. Refresh Data
            // refetch logic (could be cleaner with SWR/React Query later)
            setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: 'repaid' } : l));
            setTransactions(prev => [{
                id: `temp-${Date.now()}`,
                type: 'repayment',
                amount: amount,
                status: 'pending',
                created_at: new Date().toISOString(),
                tx_hash: txHash
            }, ...prev]);

        } catch (err: any) {
            console.error("Repayment Failed:", err);
            toast.dismiss(toastId);
            toast.error(err.shortMessage || "Repayment failed");
        }
    };

    useEffect(() => {
        if (!address) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Fetch Loans
                const { data: loansData, error: loansError } = await supabase
                    .from('loans')
                    .select('*')
                    .eq('borrower_address', address)
                    .order('created_at', { ascending: false });

                if (loansError) throw new Error(`Loans Error: ${loansError.message}`);
                setLoans(loansData || []);

                // 2. Fetch Transactions (Related to history)
                const { data: txData, error: txError } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_address', address)
                    .order('created_at', { ascending: false });

                if (txError) throw new Error(`Transactions Error: ${txError.message}`);
                setTransactions(txData || []);

            } catch (err: any) {
                console.error("Error fetching history:", err);
                setError(err.message);
                toast.error("Failed to load history data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [address]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Loan History</h1>
                <p className="text-[#9CA3AF]">
                    Track your financing requests, active loans, and repayment history.
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 text-[#6B7280]">
                    <Spinner className="animate-spin mr-2" size={20} /> Loading records...
                </div>
            ) : (
                <div className="grid gap-6">
                    {/* Active & Past Loans Table */}
                    <div className="space-y-4">
                        <LoanHistoryTable
                            loans={loans}
                            onRepay={handleRepay}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
