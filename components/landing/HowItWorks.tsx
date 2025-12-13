"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TextScramble from "@/components/ui/text-scramble";
import { useState } from "react";

const founderSteps = [
    {
        number: "01",
        tag: "FOR FOUNDERS",
        title: "Connect & Calculate",
        description: "Connect your Stripe or Shopify read-only API. Our local client calculates your borrowing power instantly based on real recurring revenue data.",
        cta: "CHECK LIMIT",
        link: "#"
    },
    {
        number: "02",
        tag: "ZERO KNOWLEDGE",
        title: "Generate Proof",
        description: "Your device generates a ZK-Proof testifying to your solvency without ever revealing your customer data, margins, or trade secrets.",
        cta: "VIEW DEMO",
        link: "#"
    },
    {
        number: "03",
        tag: "GET FUNDED",
        title: "Receive Liquidity",
        description: "Submit your proof on-chain to mint a FlowNFT. Global liquidity pools fund your position instantly in mUSDC. Fast, fair, and transparent.",
        cta: "START NOW",
        link: "#"
    }
];

const lenderSteps = [
    {
        number: "01",
        tag: "FOR LENDERS",
        title: "Deposit Liquidity",
        description: "Supply USDC or USDY into the protocol's lending pools. Your capital is strictly isolated and managed by audited smart contracts.",
        cta: "START EARNING",
        link: "#"
    },
    {
        number: "02",
        tag: "PROTOCOL SECURITY",
        title: "Auto-Allocation",
        description: "The protocol automatically matches liquidity to FlowNFTs backed by ZK-verified revenue streams and on-chain repayment intercepts.",
        cta: "VIEW AUDITS",
        link: "#"
    },
    {
        number: "03",
        tag: "REAL YIELD",
        title: "Compound Returns",
        description: "Earn sustainable APY derived from real-world business revenue, not inflationary tokens. Withdraw your principal and interest 24/7.",
        cta: "VIEW STRATEGIES",
        link: "#"
    }
];

export default function HowItWorks() {
    const [activeTab, setActiveTab] = useState<'founders' | 'lenders'>('founders');

    const steps = activeTab === 'founders' ? founderSteps : lenderSteps;

    return (
        <section className="py-24 px-4 bg-black relative border-t border-white/10">
            <div className="max-w-[1920px] mx-auto">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 space-y-8">
                    {/* Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-2xl flex justify-center"
                    >
                        <img
                            src="/images/how-it-works-2.png"
                            alt="Manteia Protocol Flow"
                            className="w-auto h-48 md:h-64 object-contain opacity-90"
                        />
                        {/* Glow effect behind image */}
                        <div className="absolute inset-0 bg-brand/20 blur-[100px] z-[-1] rounded-full" />
                    </motion.div>

                    <div className="space-y-6 max-w-4xl mx-auto z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <span className="text-[#00D4AA] font-mono text-sm uppercase tracking-widest">
                                // THE PROTOCOL
                            </span>

                            {/* Toggle Switch */}
                            <div className="flex items-center p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                                <button
                                    onClick={() => setActiveTab('founders')}
                                    className={`px-6 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'founders'
                                            ? 'bg-[#00D4AA] text-black shadow-lg shadow-[#00D4AA]/20'
                                            : 'text-zinc-500 hover:text-white'
                                        }`}
                                >
                                    For Founders
                                </button>
                                <button
                                    onClick={() => setActiveTab('lenders')}
                                    className={`px-6 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'lenders'
                                            ? 'bg-[#00D4AA] text-black shadow-lg shadow-[#00D4AA]/20'
                                            : 'text-zinc-500 hover:text-white'
                                        }`}
                                >
                                    For Lenders
                                </button>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold text-white leading-tight"
                        >
                            {activeTab === 'founders' ? 'Built for Privacy. Designed for Speed.' : 'Institutional Grade. DeFi Native.'}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-zinc-400 font-mono text-sm md:text-base uppercase tracking-wide max-w-xl mx-auto leading-relaxed"
                        >
                            {activeTab === 'founders'
                                ? "FROM API CONNECTION TO CAPITAL IN YOUR WALLET. THE ENTIRE PROCESS RUNS ON-CHAIN, VERIFIED BY MATH, SECURED BY CRYPTOGRAPHY."
                                : "PASSIVE YIELD POWERED BY REAL-WORLD REVENUE. TRANSPARENT ON-CHAIN SETTLEMENT WITH ZERO OPERATIONAL OVERHEAD."}
                        </motion.p>
                    </div>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
                    {steps.map((step, index) => (
                        <StepCard key={`${activeTab}-${index}`} step={step} index={index} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepCard({ step, index, isLast }: { step: any, index: number, isLast: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`
                relative p-8 lg:p-12 flex flex-col justify-between h-full min-h-[400px]
                border-b border-r border-white/10 hover:bg-zinc-950/50 transition-colors duration-300 group
                ${isLast ? 'border-r' : ''}
            `}
        >
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 text-xs font-mono tracking-widest uppercase">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                    <span className="text-zinc-600">» » »</span>
                    <span className="text-white opacity-80">{step.tag}</span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                        {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed px-1">
                        {step.description}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
                <Link href={step.link} className="inline-block w-full">
                    <Button
                        className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-mono font-bold uppercase tracking-widest rounded-none h-12 flex items-center justify-between px-6 group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span><TextScramble trigger={isHovered}>{step.cta}</TextScramble></span>
                        <span className="text-black/30 group-hover:translate-x-1 transition-transform">| {'>'}{'>'}</span>
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
