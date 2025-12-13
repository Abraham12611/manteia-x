"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Wallet, ArrowRight, Bank, CircleNotch } from "@phosphor-icons/react";
import { formatCurrency } from "@/lib/utils";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { MockUSDCABI } from "@/lib/abis/MockUSDC";
import { LendingVaultABI } from "@/lib/abis/LendingVault";

export function LiquidityManager() {
    const { address, isConnected } = useAccount();
    const [amount, setAmount] = useState<string>("");

    // --- Contract Reads ---

    // 1. USDC Balance
    const { data: usdcBalanceData, refetch: refetchUsdc } = useReadContract({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    // 2. Vault Balance (User Share)
    const { data: vaultBalanceData, refetch: refetchVault } = useReadContract({
        address: CONTRACT_ADDRESSES.LENDING_VAULT,
        abi: LendingVaultABI,
        functionName: 'userDeposits',
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    // 3. Allowance
    const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MockUSDCABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.LENDING_VAULT] : undefined,
        query: { enabled: !!address }
    });

    // 4. Total Vault TVL
    const { data: totalDepositsData } = useReadContract({
        address: CONTRACT_ADDRESSES.LENDING_VAULT,
        abi: LendingVaultABI,
        functionName: 'totalDeposits',
    });


    // --- Contract Writes ---
    const { writeContract: writeApprove, data: approveTxHash, isPending: isApproving, error: approveError } = useWriteContract();
    const { writeContract: writeDeposit, data: depositTxHash, isPending: isDepositing, error: depositError } = useWriteContract();
    const { writeContract: writeMint, data: mintTxHash, isPending: isMinting, error: mintError } = useWriteContract();

    // --- Transaction Waiting ---
    const { isLoading: isWaitingApprove, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveTxHash,
    });

    const { isLoading: isWaitingDeposit, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
        hash: depositTxHash,
    });

    const { isLoading: isWaitingMint, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
        hash: mintTxHash,
    });


    // --- Effects & Logic ---

    // Refetch data after success
    useEffect(() => {
        if (isApproveSuccess) {
            toast.success("USDC Approved!");
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (isDepositSuccess) {
            const logDeposit = async () => {
                const { error } = await supabase.from('transactions').insert({
                    user_address: address,
                    type: 'deposit',
                    amount: Number(amount),
                    tx_hash: depositTxHash,
                    status: 'completed'
                });

                if (error) {
                    console.error("Failed to log deposit:", error);
                    toast.error("Deposit confirmed on-chain but failed to save to history.");
                } else {
                    toast.success("Deposit Successful & Logged!");
                }

                setAmount("");
                refetchUsdc();
                refetchVault();
            };

            logDeposit();
        }
    }, [isDepositSuccess, refetchUsdc, refetchVault, address, amount, depositTxHash]);

    useEffect(() => {
        if (isMintSuccess) {
            toast.success("Faucet: 10,000 USDC Received!");
            refetchUsdc();
        }
    }, [isMintSuccess, refetchUsdc]);

    // Error Handling
    useEffect(() => {
        if (approveError) toast.error(`Approval Failed: ${approveError.shortMessage || approveError.message}`);
        if (depositError) toast.error(`Deposit Failed: ${depositError.shortMessage || depositError.message}`);
        if (mintError) toast.error(`Mint Failed: ${mintError.shortMessage || mintError.message}`);
    }, [approveError, depositError, mintError]);


    // Helper Values
    const usdcBalance = usdcBalanceData ? Number(formatUnits(usdcBalanceData, 6)) : 0;
    const vaultBalance = vaultBalanceData ? Number(formatUnits(vaultBalanceData, 6)) : 0;
    const currentAllowance = allowanceData ? Number(formatUnits(allowanceData, 6)) : 0;
    const tvl = totalDepositsData ? Number(formatUnits(totalDepositsData, 6)) : 0;

    const depositAmount = Number(amount || 0);
    const needsApproval = depositAmount > currentAllowance;
    const isBusy = isApproving || isWaitingApprove || isDepositing || isWaitingDeposit;

    const handleAction = () => {
        if (!address) {
            toast.error("Please connect wallet");
            return;
        }
        if (depositAmount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (needsApproval) {
            writeApprove({
                address: CONTRACT_ADDRESSES.MOCK_USDC,
                abi: MockUSDCABI,
                functionName: 'approve',
                args: [CONTRACT_ADDRESSES.LENDING_VAULT, parseUnits(amount, 6)]
            });
        } else {
            writeDeposit({
                address: CONTRACT_ADDRESSES.LENDING_VAULT,
                abi: LendingVaultABI,
                functionName: 'deposit',
                args: [parseUnits(amount, 6)]
            });
        }
    };

    return (
        <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6 shadow-card h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA]">
                    <Bank size={24} weight="fill" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Liquidity Vault</h3>
                    <p className="text-xs text-[#9CA3AF]">Earn ~12% APY on stablecoins</p>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {/* Input Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-[#D1D5DB]">Deposit Amount (USDC)</label>
                        {usdcBalance < 100 && (
                            <button
                                onClick={() => writeMint({
                                    address: CONTRACT_ADDRESSES.MOCK_USDC,
                                    abi: MockUSDCABI,
                                    functionName: 'mint',
                                    args: [address, parseUnits('10000', 6)]
                                })}
                                disabled={isMinting}
                                className="text-[10px] bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-1 rounded hover:bg-[#00D4AA]/20 transition-colors"
                            >
                                {isMinting ? "Minting..." : "+ Faucet: 10k USDC"}
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={isBusy}
                            className="bg-[#13161F] border-[#252931] text-white pr-16 h-12 text-lg focus:border-[#00D4AA]"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6B7280]">
                            USDC
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-[#6B7280]">
                        <span>Wallet: {formatCurrency(usdcBalance)}</span>
                        <button
                            onClick={() => setAmount(usdcBalance.toString())}
                            className="text-[#00D4AA] hover:underline"
                            disabled={isBusy}
                        >
                            Max
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-[#13161F] rounded-xl p-4 border border-[#252931] space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#9CA3AF]">Your Active Deposit</span>
                        <span className="text-white font-mono">{formatCurrency(vaultBalance)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#9CA3AF]">Protocol TVL</span>
                        <span className="text-white font-mono">{formatCurrency(tvl)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#9CA3AF]">Est. Monthly Yield</span>
                        <span className="text-[#00D4AA] font-mono">
                            {amount ? formatCurrency(Number(amount) * 0.01) : "$0.00"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#252931]">
                <Button
                    variant="brand"
                    className="w-full h-12 text-base shadow-neon font-bold"
                    onClick={handleAction}
                    disabled={isBusy || !amount || Number(amount) <= 0 || !isConnected}
                >
                    {isBusy ? (
                        <div className="flex items-center gap-2">
                            <CircleNotch className="animate-spin" size={20} />
                            {isApproving || isWaitingApprove ? "Approving..." : "Depositing..."}
                        </div>
                    ) : needsApproval ? (
                        "Approve USDC Spend"
                    ) : (
                        "Supply Liquidity"
                    )}
                </Button>
                {needsApproval && !isBusy && amount && (
                    <p className="text-center text-[10px] text-[#6B7280] mt-2">
                        Step 1 of 2: Approve Vault to spend your USDC
                    </p>
                )}
            </div>
        </div>
    );
}
