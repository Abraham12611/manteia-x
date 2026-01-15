"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Bank, CoinVertical, ArrowRight, Wallet } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function OnboardingPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { setRole } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'lender' | 'borrower' | null>(null);

    // Auto-process if wallet connects after role selection
    useEffect(() => {
        if (isConnected && address && selectedRole) {
            handleSaveRole(selectedRole);
        }
    }, [isConnected, address, selectedRole]);

    const handleSaveRole = async (role: 'lender' | 'borrower') => {
        setIsLoading(true);
        try {
            // Update Supabase
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    wallet_address: address,
                    role: role
                }, { onConflict: 'wallet_address' });

            if (error) throw error;

            // Update Local Store
            setRole(role);

            toast.success(`Welcome, ${role === 'lender' ? 'Lender' : 'Borrower'}!`);
            router.push('/dashboard');

        } catch (e: any) {
            console.error(e);
            toast.error("Failed to save role: " + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#13161F] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <AnimatePresence mode="wait">
                    {!selectedRole ? (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center">
                                <h1 className="text-4xl font-serif text-white mb-4">Choose Your Path</h1>
                                <p className="text-[#9CA3AF] text-lg">How would you like to interact with the Manteia Protocol?</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Borrower Card */}
                                <motion.button
                                    whileHover={{ scale: 1.02, borderColor: '#00D4AA' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedRole('borrower')}
                                    className="group relative bg-[#1E222E] border border-[#252931] rounded-2xl p-8 text-left hover:shadow-neon transition-all duration-300"
                                >
                                    <div className="bg-[#252A36] w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 transition-colors">
                                        <CoinVertical size={32} className="text-[#00D4AA]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Borrow Revenue</h3>
                                    <p className="text-[#9CA3AF] mb-8">
                                        Convert your future revenue streams into upfront capital. Non-dilutive financing with Zero-Knowledge verification.
                                    </p>
                                    <div className="flex items-center text-[#00D4AA] font-medium">
                                        Get Funded <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.button>

                                {/* Lender Card */}
                                <motion.button
                                    whileHover={{ scale: 1.02, borderColor: '#A855F7' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedRole('lender')}
                                    className="group relative bg-[#1E222E] border border-[#252931] rounded-2xl p-8 text-left hover:shadow-purple transition-all duration-300"
                                >
                                    <div className="bg-[#252A36] w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#A855F7]/20 transition-colors">
                                        <Bank size={32} className="text-[#A855F7]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Earn Yield</h3>
                                    <p className="text-[#9CA3AF] mb-8">
                                        Provide liquidity to vetted authentic businesses. Earn high APY backed by validated real-world revenue.
                                    </p>
                                    <div className="flex items-center text-[#A855F7] font-medium">
                                        Start Earning <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="wallet-connection"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#1E222E] border border-[#252931] rounded-2xl p-12 max-w-lg mx-auto text-center space-y-8 shadow-2xl"
                        >
                            <div className="mx-auto bg-[#252A36] w-20 h-20 rounded-full flex items-center justify-center">
                                <Wallet size={40} className="text-white" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Connect Wallet</h2>
                                <p className="text-[#9CA3AF]">
                                    to continue as a <span className="text-white font-semibold capitalize">{selectedRole}</span>
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <ConnectButton label="Connect Wallet" />
                            </div>

                            <button
                                onClick={() => setSelectedRole(null)}
                                className="text-sm text-[#6B7280] hover:text-white transition-colors mt-4"
                            >
                                ← Back to Role Selection
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
