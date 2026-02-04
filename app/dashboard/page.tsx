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
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

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

    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
    const { writeContractAsync, isPending } = useWriteContract();

    // Watch for transaction confirmation
    const { isSuccess: isConfirmed, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Handle Confirmation Success
    useEffect(() => {
        if (isConfirmed && txHash) {
            console.log("Transaction Confirmed on Chain!", txHash);

            // 1. Update Database Status to 'active' (or 'funded')
            const updateStatus = async () => {
                const { error } = await supabase
                    .from('loans')
                    .update({ status: 'active' }) // or 'funded' depending on schema
                    .eq('tx_hash', txHash);

                if (error) console.error("Failed to update loan status:", error);

                // Update transaction record too if needed
                await supabase
                    .from('transactions')
                    .update({ status: 'completed' })
                    .eq('tx_hash', txHash);
            };
            updateStatus();

            // 2. Success Notification with Explorer Link
            toast.success("Lesson Funded Successfully!", {
                description: (
                    <a
                        href={`https://sepolia.mantlescan.xyz/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-400 hover:text-blue-300"
                    >
                        View on Mantle Explorer
                    </a>
                ),
                duration: 8000,
            });

            // Reset state
            setTxHash(undefined);
            setProofData(null);
            setIsZKModalOpen(false);
        }
    }, [isConfirmed, txHash]);

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

            // 1. Prepare Contract Arguments
            const { proof, publicSignals, ipfsHash } = proofData;

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

            const { ManteiaFactoryABI } = await import("@/lib/abis/ManteiaFactory");
            const { CONTRACT_ADDRESSES } = await import("@/lib/contracts");
            const { parseUnits } = await import("viem");

            const hash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.MANTEIA_FACTORY,
                abi: ManteiaFactoryABI,
                functionName: 'requestLoan',
                args: [
                    formattedProof.a,
                    formattedProof.b,
                    formattedProof.c,
                    formattedProof.input,
                    parseUnits(amount.toString(), 6),
                    ipfsHash
                ]
            });

            console.log("Transaction Submitted:", hash);
            setTxHash(hash); // Triggers the useWaitForTransactionReceipt hook

            toast.message("Transaction Sent! Waiting for confirmation...", {
                id: toastId,
                description: "This may take a few seconds..."
            });

            // 3. Insert Pending Record
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
                tx_hash: hash,
                status: 'pending'
            });

            if (error) throw error;

            await supabase.from('transactions').insert({
                user_address: userProfile.wallet_address,
                type: 'loan_request',
                amount: amount,
                tx_hash: hash,
                status: 'pending'
            });

            // Keep toast loading until confirmation...
            // or dismiss it now and let the success effect handle the final toast.
            // We'll leave it as a message for now.

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
