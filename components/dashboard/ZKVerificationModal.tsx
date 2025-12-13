"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, LockKey, StripeLogo, Spinner } from "@phosphor-icons/react"; // Assuming StripeLogo doesn't exist in phosphor, using generic or text
import { motion, AnimatePresence } from "framer-motion";
import { encryptData, generateKey, exportKey } from '@/lib/crypto';

type VerificationStatus = 'idle' | 'fetching' | 'generating' | 'uploading' | 'success' | 'error';

interface ZKVerificationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (uploadResult: { ipfsHash: string, publicSignals: any, proof: any }) => void;
}

export function ZKVerificationModal({ isOpen, onOpenChange, onSuccess }: ZKVerificationModalProps) {
    const [status, setStatus] = useState<VerificationStatus>('idle');
    const [stripeKey, setStripeKey] = useState("");
    const [progress, setProgress] = useState(0);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setStripeKey("");
            setProgress(0);
        }
    }, [isOpen]);

    const handleVerify = async () => {
        if (!stripeKey.startsWith("sk_")) {
            toast.error("Invalid Stripe Key", { description: "Must start with 'sk_'" });
            return;
        }

        try {
            // 1. Fetch Stripe Data
            setStatus('fetching');
            const stripeRes = await fetch('/api/services/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: stripeKey })
            });

            if (!stripeRes.ok) throw new Error("Failed to fetch Stripe data");
            const stripeData = await stripeRes.json();

            // 2. Generate ZK Proof (Mocked for now as we lack client-side circom)
            setStatus('generating');
            let p = 0;
            const proofInterval = setInterval(() => {
                p += 10;
                setProgress(p);
                if (p >= 100) clearInterval(proofInterval);
            }, 200);

            await new Promise(r => setTimeout(r, 2000)); // Simulate calculation time

            // Mock SnarkJS Proof Structure (Groth16)
            // In a real app, this would come from snarkjs.groth16.fullProve()
            const mockProof = {
                pi_a: ["0x1", "0x2", "0x3"],
                pi_b: [["0x4", "0x5"], ["0x6", "0x7"], ["0x8", "0x9"]],
                pi_c: ["0xA", "0xB", "0xC"],
                protocol: "groth16",
                curve: "bn128"
            };

            // Mock Signals: [revenueThreshold, revenueCommitment]
            // These must match the circuit public outputs
            const mockPublicSignals = [
                "100000", // Minimum Revenue Threshold
                "0x1234567890abcdef1234567890abcdef12345678" // Commitment Hash
            ];


            // 3. Encrypt & Upload to IPFS
            setStatus('uploading');

            // Generate a fresh symmetric key for this session
            const key = await generateKey();
            const keyString = await exportKey(key);
            console.log("Encryption Key (Save this to decrypt):", keyString); // For demo purposes

            // Encrypt the sensitive proof data
            const encryptionResult = await encryptData({
                revenueData: stripeData,
                proof: mockProof,
                timestamp: new Date().toISOString()
            }, key);

            // Upload the Encrypted Payload
            const ipfsRes = await fetch('/api/services/ipfs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    encryptedData: encryptionResult, // Sends { encrypted: "...", iv: "..." }
                    metadata: {
                        keyHint: "Symmetric Key generated in browser" // Don't send the actual key!
                    }
                })
            });

            if (!ipfsRes.ok) throw new Error("IPFS Upload failed");
            const { ipfsHash } = await ipfsRes.json();

            // 4. Success
            setStatus('success');
            setTimeout(() => {
                onSuccess({ ipfsHash, publicSignals: mockPublicSignals, proof: mockProof });
                onOpenChange(false);
            }, 1000);

        } catch (error: any) {
            console.error(error);
            setStatus('error');
            toast.error("Verification Failed", { description: error.message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#1E222E] border border-[#252931] text-white p-0 overflow-hidden">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-semibold text-white">Revenue Verification</DialogTitle>
                        <DialogDescription className="text-[#9CA3AF]">
                            Connect your Stripe account to generate a private Zero-Knowledge Proof.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center py-4 space-y-6 min-h-[200px]">
                        <AnimatePresence mode="wait">
                            {status === 'idle' && (
                                <motion.div
                                    className="w-full space-y-4"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                >
                                    <div className="bg-[#252A36] p-4 rounded-xl border border-[#252931] flex items-center gap-3">
                                        <div className="bg-[#635BFF] p-2 rounded-lg">
                                            <span className="font-bold text-white">S</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">Stripe Read-Only</p>
                                            <p className="text-xs text-[#9CA3AF]">We only read balance & transaction history.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#D1D5DB]">Stripe Secret Key</label>
                                        <Input
                                            placeholder="sk_test_..."
                                            value={stripeKey}
                                            onChange={(e) => setStripeKey(e.target.value)}
                                            className="bg-[#13161F] border-[#252931] text-white focus:border-[#00D4AA]"
                                            type="password"
                                        />
                                        <p className="text-xs text-[#6B7280]">
                                            Use a restricted key with read-only permissions for safety.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {(status !== 'idle' && status !== 'error') && (
                                <motion.div
                                    className="flex flex-col items-center text-center space-y-4"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                >
                                    {status === 'success' ? (
                                        <CheckCircle size={64} className="text-[#00D4AA]" weight="fill" />
                                    ) : (
                                        <div className="relative w-16 h-16">
                                            <Spinner size={64} className="text-[#00D4AA] animate-spin" />
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-medium text-white capitalize">
                                            {status === 'fetching' && "Fetching Revenue Data..."}
                                            {status === 'generating' && "Generating ZK Proof..."}
                                            {status === 'uploading' && "Securing Proof on IPFS..."}
                                            {status === 'success' && "Verification Complete"}
                                        </h3>
                                        {status === 'generating' && (
                                            <div className="w-48 h-1 bg-[#252931] rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#00D4AA] transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="p-6 bg-[#17191F] border-t border-[#252931] flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={status !== 'idle' && status !== 'error'}>
                        Cancel
                    </Button>
                    <Button
                        variant="brand"
                        onClick={handleVerify}
                        disabled={status !== 'idle' || !stripeKey}
                        className="min-w-[120px]"
                    >
                        Verify Now
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
