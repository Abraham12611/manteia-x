"use client";

import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ArrowUpRight, ArrowDownLeft, Spinner } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
    id: string;
    type: 'loan_request' | 'repayment' | 'funding' | 'withdrawal';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    tx_hash?: string;
}

export function RecentActivity() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!address) return;

        const fetchTransactions = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_address', address)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) throw error;
                if (data) setTransactions(data as Transaction[]);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [address]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[200px] text-[#6B7280]">
                <Spinner className="animate-spin mr-2" /> Loading activity...
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[200px] text-[#6B7280] text-sm">
                <div className="bg-[#252A36] p-3 rounded-full mb-3">
                    <ArrowUpRight size={24} className="opacity-50" />
                </div>
                No recent activity found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#252A36]/50 hover:bg-[#252A36] transition-colors border border-transparent hover:border-[#252931]"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'loan_request' || tx.type === 'withdrawal'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-[#00D4AA]/10 text-[#00D4AA]'
                            }`}>
                            {tx.type === 'loan_request' || tx.type === 'withdrawal' ? (
                                <ArrowUpRight weight="bold" />
                            ) : (
                                <ArrowDownLeft weight="bold" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white capitalize">
                                {tx.type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                                {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`text-sm font-bold ${tx.type === 'loan_request' || tx.type === 'withdrawal'
                                ? 'text-white'
                                : 'text-[#00D4AA]'
                            }`}>
                            {tx.type === 'loan_request' || tx.type === 'withdrawal' ? '-' : '+'}
                            ${tx.amount.toLocaleString()}
                        </p>
                        <p className={`text-[10px] uppercase font-bold tracking-wider ${tx.status === 'completed' ? 'text-[#00D4AA]' :
                                tx.status === 'failed' ? 'text-red-500' : 'text-yellow-500'
                            }`}>
                            {tx.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
