"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendUp, ArrowDownLeft, ArrowUpRight, Spinner } from "@phosphor-icons/react";
import { useLenderStats } from "@/hooks/useLenderStats";
import { useAccount, useWriteContract } from "wagmi";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { LendingVaultABI } from "@/lib/abis/LendingVault";
import { parseUnits } from "viem";

export default function AssetsPage() {
    const { usdcBalance, vaultBalance, refetchAll } = useLenderStats();
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoadingTx, setIsLoadingTx] = useState(true);

    // Calculate Net Worth
    const netWorth = usdcBalance + vaultBalance;

    // Fetch Transactions
    useEffect(() => {
        if (!address) return;
        const fetchTx = async () => {
            setIsLoadingTx(true);
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_address', address)
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching txs:", error);
            else setTransactions(data || []);
            setIsLoadingTx(false);
        };
        fetchTx();
    }, [address]);

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">My Portfolio</h2>
                    <p className="text-[#9CA3AF]">Track your liquidity positions and earnings.</p>
                </div>
                <div className="bg-[#1E222E] px-4 py-2 rounded-xl border border-[#252931] flex items-center gap-3">
                    <span className="text-sm text-[#9CA3AF]">Net Worth</span>
                    <span className="text-xl font-bold text-white">{formatCurrency(netWorth)}</span>
                </div>
            </header>

            {/* Asset Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AssetCard
                    token="USDC"
                    name="USD Coin"
                    balance={usdcBalance} // Wallet Balance
                    deposited={vaultBalance} // Vault Balance
                    apy={12.4}
                    iconUrl="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026"
                    refetch={refetchAll}
                />
                <AssetCard
                    token="MNT"
                    name="Mantle"
                    balance={0}
                    deposited={0}
                    apy={0}
                    iconUrl="https://cryptologos.cc/logos/mantle-mnt-logo.png?v=029"
                    refetch={refetchAll}
                />
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-[#1E222E] border border-[#252931] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#252931]">
                    <h3 className="text-lg font-bold text-white">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#13161F] text-[#9CA3AF] text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#252931]">
                            {isLoadingTx ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-[#6B7280]">
                                        <Spinner className="animate-spin inline mr-2" /> Loading history...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-[#6B7280]">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <TransactionRow
                                        key={tx.id}
                                        type={tx.type}
                                        asset="USDC"
                                        amount={tx.amount}
                                        date={format(new Date(tx.created_at), "MMM d, yyyy")}
                                        status={tx.status}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AssetCard({ token, name, balance, deposited, apy, iconUrl, refetch }: any) {
    const { writeContractAsync, isPending } = useWriteContract();

    // Simple Withdraw Logic
    const handleWithdraw = async () => {
        if (deposited <= 0) return toast.error("No funds to withdraw");
        const toastId = toast.loading("Withdrawing funds...");
        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESSES.LENDING_VAULT,
                abi: LendingVaultABI,
                functionName: 'withdraw',
                args: [parseUnits(deposited.toString(), 6)]
            });
            toast.success("Withdrawal Successful!", { id: toastId });
            refetch?.();
        } catch (e: any) {
            console.error(e);
            toast.error("Withdrawal Failed", { id: toastId, description: e.shortMessage || e.message });
        }
    };

    return (
        <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6 hover:border-[#00D4AA]/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img src={iconUrl} alt={token} className="w-10 h-10 rounded-full" />
                    <div>
                        <div className="font-bold text-white">{name}</div>
                        <div className="text-xs text-[#9CA3AF]">{token}</div>
                    </div>
                </div>
                {apy > 0 && (
                    <div className="bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <TrendUp weight="bold" /> {apy}% APY
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {/* Wallet Balance */}
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-[#9CA3AF] mb-1">Wallet Balance</div>
                        <div className="text-xl font-bold text-white">{formatCurrency(balance)}</div>
                    </div>
                </div>

                {/* Vault Balance */}
                <div className="p-3 bg-[#13161F] rounded-xl border border-[#252931]">
                    <div className="text-xs text-[#9CA3AF] mb-1">Active in Vault</div>
                    <div className="text-xl font-bold text-[#00D4AA]">{formatCurrency(deposited)}</div>
                    <div className="text-[10px] text-[#6B7280]">Earning Yield</div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#252931] flex gap-2">
                <button
                    onClick={handleWithdraw}
                    disabled={isPending}
                    className="flex-1 py-1.5 text-sm font-medium bg-[#252A36] text-white rounded hover:bg-[#323846] transition-colors disabled:opacity-50"
                >
                    {isPending ? "Withdrawing..." : "Withdraw All"}
                </button>
                {/* Deposit redirects or opens modal (omitted for brevity, assume linked) */}
                <button className="flex-1 py-1.5 text-sm font-medium bg-[#00D4AA] text-black rounded hover:bg-[#00BFA0] transition-colors">
                    Deposit
                </button>
            </div>
        </div>
    )
}

function TransactionRow({ type, asset, amount, date, status }: any) {
    return (
        <tr className="hover:bg-[#252A36]/50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#13161F] border border-[#252931] flex items-center justify-center text-[#9CA3AF]">
                        {type === 'deposit' ? <ArrowDownLeft /> : type === 'withdrawal' ? <ArrowUpRight /> : <TrendUp />}
                    </div>
                    <span className="text-white capitalize">{type.replace('_', ' ')}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-[#D1D5DB]">{asset}</td>
            <td className="px-6 py-4 text-white font-mono">{formatCurrency(amount)}</td>
            <td className="px-6 py-4 text-[#9CA3AF] text-sm">{date}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status === 'completed' || status === 'repaid'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                    {status}
                </span>
            </td>
        </tr>
    )
}
