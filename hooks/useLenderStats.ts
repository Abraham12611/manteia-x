"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { MockUSDCABI } from "@/lib/abis/MockUSDC";
import { LendingVaultABI } from "@/lib/abis/LendingVault";

export function useLenderStats() {
    const { address } = useAccount();

    const { data: usdcBalanceData, refetch: refetchUsdc } = useReadContract({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    const { data: vaultBalanceData, refetch: refetchVault } = useReadContract({
        address: CONTRACT_ADDRESSES.LENDING_VAULT,
        abi: LendingVaultABI,
        functionName: 'userDeposits',
        args: address ? [address] : undefined,
        query: { enabled: !!address }
    });

    const { data: totalDepositsData, refetch: refetchTVL } = useReadContract({
        address: CONTRACT_ADDRESSES.LENDING_VAULT,
        abi: LendingVaultABI,
        functionName: 'totalDeposits',
    });

    // Helper to format 6 decimals to number safely
    const formatUSDC = (data: any) => data ? Number(formatUnits(data, 6)) : 0;

    return {
        usdcBalance: formatUSDC(usdcBalanceData),
        vaultBalance: formatUSDC(vaultBalanceData), // 1:1 for MVP
        tvl: formatUSDC(totalDepositsData),
        refetchAll: () => {
            refetchUsdc();
            refetchVault();
            refetchTVL();
        }
    };
}
