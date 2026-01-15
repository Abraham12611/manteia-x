"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ZKVerificationModal } from "@/components/dashboard/ZKVerificationModal";
import { LoanRequestSlider } from "@/components/dashboard/LoanRequestSlider";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export default function DashboardPage() {
    const { userProfile, isProfileLoading } = useUserStore();
    const router = useRouter();

    // Debugging Role
    useEffect(() => {
        console.log("Dashboard - User Profile:", userProfile);
        console.log("Dashboard - Role:", userProfile?.role);
    }, [userProfile]);

    // Check Role & Redirect Lenders
    useEffect(() => {
        if (!isProfileLoading && userProfile?.role === 'lender') {
            console.log("Redirecting Lender to Markets...");
            router.replace('/dashboard/markets');
        }
    }, [userProfile, isProfileLoading, router]);

    const [isZKModalOpen, setIsZKModalOpen] = useState(false);

    // State for Verification Data
    const [proofData, setProofData] = useState<{ ipfsHash: string, publicSignals: any, proof: any } | null>(null);

    const { writeContractAsync, isPending } = useWriteContract();

    // Add wait logic for the transaction
    /* 
       Note: We can't easily wait for the specific tx hash here unless we store it in state, 
       but writeContractAsync returns the hash. We can wait on that.
    */

    const handleLoanRequest = async (amount: number, purpose: string, sector: string) => {
        if (!proofData) {
            setIsZKModalOpen(true);
            return;
        }

        if (!userProfile?.wallet_address) {
            toast.error("User profile not loaded");
            return;
        }

        const toastId = toast.loading('Initiating Loan Request...');

        try {
            console.log("Submitting Loan Request with Proof:", proofData);

            // 1. Prepare Contract Arguments (Format SnarkJS Proof for Solidity)
            const { proof, publicSignals, ipfsHash } = proofData;

            // Transform Proof to Solidity Format
            // pi_a: [p[0], p[1]]
            // pi_b: [[p[0][1], p[0][0]], [p[1][1], p[1][0]]] (Note the reverse for G2!)
            // pi_c: [p[0], p[1]]

            /* 
               IMPORTANT: Real SnarkJS returns strings. 
               If the mockProof above is used, ensure it is passed correctly.
               For this implementation, we map the mock structure directly.
            */

            const formattedProof = {
                a: [proof.pi_a[0], proof.pi_a[1]] as [bigint, bigint],
                b: [
                    [proof.pi_b[0][1], proof.pi_b[0][0]],
                    [proof.pi_b[1][1], proof.pi_b[1][0]]
                ] as readonly [readonly [bigint, bigint], readonly [bigint, bigint]],
                c: [proof.pi_c[0], proof.pi_c[1]] as [bigint, bigint],
                input: publicSignals as [bigint, bigint]
            };

            // 2. Call Contract
            toast.message("Please confirm transaction in your wallet...", { id: toastId });

            // Import dynamically to avoid circular deps top-level if needed, or use existing imports
            const { ManteiaFactoryABI } = await import("@/lib/abis/ManteiaFactory");
            const { CONTRACT_ADDRESSES } = await import("@/lib/contracts");
            const { parseUnits } = await import("viem");

            const txHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.MANTEIA_FACTORY,
                abi: ManteiaFactoryABI,
                functionName: 'requestLoan',
                args: [
                    formattedProof.a,
                    formattedProof.b,
                    formattedProof.c,
                    formattedProof.input,
                    parseUnits(amount.toString(), 6), // USDC has 6 decimals
                    ipfsHash
                ]
            });

            console.log("Transaction Submitted:", txHash);
            toast.message("Transaction Sent! Waiting for confirmation...", { id: toastId });

            // 3. Insert into Supabase (Optimistic or wait for Indexer)
            // For better UX, we save the intent now. The indexer/listener would update status later.

            // Calculate mocked risk score mostly for UI display in this demo
            const estimatedRevenue = 100000;
            const ratio = (estimatedRevenue * 12) / amount;
            let riskScore = 70;
            if (ratio > 5) riskScore = 98;
            else if (ratio > 3) riskScore = 90;
            else if (ratio > 1.5) riskScore = 80;

            const { error } = await supabase.from('loans').insert({
                borrower_address: userProfile.wallet_address,
                amount: amount,
                purpose: purpose,
                sector: sector,
                risk_score: riskScore,
                ipfs_hash: ipfsHash,
                tx_hash: txHash,
                status: 'pending'
            });

            if (error) throw error;

            // 4. Transaction Record
            await supabase.from('transactions').insert({
                user_address: userProfile.wallet_address,
                type: 'loan_request',
                amount: amount,
                tx_hash: txHash,
                status: 'pending' // Pending confirmation
            });

            toast.success(`Loan Request Submitted!`, {
                id: toastId,
                description: "View status in Recent Activity"
            });

            // Clear proof data to force new verification next time? Maybe keep it.
            // setProofData(null); 

        } catch (err: any) {
            console.error("Loan Request Failed:", err);
            toast.dismiss(toastId);

            if (err.message.includes("User denied")) {
                toast.error("Transaction rejected by user");
            } else {
                toast.error("Failed to submit loan", {
                    description: err.shortMessage || "Check console for details"
                });
            }
        }
    };

    // Show Loading State before redirect logic completes
    if (isProfileLoading || (userProfile?.role === 'lender')) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="loading loading-spinner text-brand"></span>
                {/* Or render DashboardSkeleton */}
                <p className="text-white ml-2">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Top Stats Row Placeholder */}
            {/* <div className="grid grid-cols-3 gap-6"> ... </div> */}

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Action Area */}
                <div className="flex-1 space-y-6">
                    <section className="bg-[#1E222E] border border-[#252931] rounded-2xl p-8 flex items-center justify-between shadow-card">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Revenue Verification</h2>
                            <p className="text-[#9CA3AF] max-w-lg">
                                Generate a ZK Proof of your Stripe revenue to unlock financing.
                                Your data never leaves your device.
                            </p>
                        </div>
                        {proofData ? (
                            <div className="flex items-center gap-2 text-[#00D4AA] bg-[#00D4AA]/10 px-4 py-2 rounded-lg border border-[#00D4AA]/20">
                                <ShieldCheck size={24} weight="fill" />
                                <span className="font-semibold">Verified & Eligible</span>
                            </div>
                        ) : (
                            <Button
                                variant="brand"
                                size="lg"
                                onClick={() => setIsZKModalOpen(true)}
                                className="shadow-neon"
                            >
                                <ShieldCheck size={20} weight="bold" className="mr-2" />
                                Verify Revenue
                            </Button>
                        )}
                    </section>

                    <section>
                        <LoanRequestSlider onRequestLoan={handleLoanRequest} />
                    </section>
                </div>

                {/* Right Column (Recent Activity/Info) Placeholder */}
                <div className="w-full xl:w-[320px] space-y-6">
                    <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6 min-h-[400px]">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <RecentActivity />
                    </div>
                </div>
            </div>

            <ZKVerificationModal
                isOpen={isZKModalOpen}
                onOpenChange={setIsZKModalOpen}
                onSuccess={(data) => setProofData(data)}
            />
        </div>
    );
}
