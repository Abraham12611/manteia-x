"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import TextScramble from "@/components/ui/text-scramble";
import { useState } from "react";

const features = [
    {
        number: "01",
        tag: "FOR BUSINESSES",
        title: "Revenue to Capital, <span class='text-[#00D4AA]'>Instantly</span>",
        description: "TURN YOUR RECURRING REVENUE INTO WORKING CAPITAL IN MINUTES. NO EQUITY DILUTION. NO PERSONAL GUARANTEES. JUST CONNECT YOUR STRIPE OR SHOPIFY AND GET FUNDED BASED ON YOUR PROVEN TRACK RECORD.",
        cta: "GET FUNDED",
        link: "#borrow"
    },
    {
        number: "02",
        tag: "FOR LENDERS",
        title: "<span class='text-[#00D4AA]'>High-Yield</span> RWA Exposure",
        description: "EARN INSTITUTIONAL RETURNS BY PROVIDING LIQUIDITY TO VERIFIED REVENUE STREAMS. DIVERSIFIED PORTFOLIO OF REAL BUSINESS CASH FLOWS. TRANSPARENT ON-CHAIN SETTLEMENT. BACKED BY CRYPTOGRAPHIC PROOF.",
        cta: "PROVIDE LIQUIDITY",
        link: "#lend"
    },
    {
        number: "03",
        tag: "ZERO-KNOWLEDGE PRIVACY",
        title: "Prove Solvency, <span class='text-[#00D4AA]'>Keep Secrets</span>",
        description: "YOUR REVENUE DATA NEVER LEAVES YOUR DEVICE. GENERATE ZK PROOFS LOCALLY TO VERIFY EARNINGS WITHOUT EXPOSING CUSTOMER LISTS, TRANSACTION DETAILS, OR TRADE SECRETS. PRIVACY-NATIVE RWA.",
        cta: "LEARN TECHNOLOGY",
        link: "#technology"
    }
];

export default function Features() {
    return (
        <section className="bg-black relative">
            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto">
                {/* LEFT SIDE - Sticky Content */}
                <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-between p-8 lg:p-16 border-r border-white/10 overflow-hidden bg-black z-10">
                    <div className="relative z-10 space-y-8 flex flex-col h-full justify-center">
                        {/* Top Label */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="mb-4"
                        >
                            <span className="text-[#00D4AA] font-mono text-xs uppercase tracking-widest border-l-2 border-[#00D4AA] pl-4">
                                // CAPITAL EFFICIENCY
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tight">
                                Revenue is the new <br /> collateral.
                            </h2>

                            <p className="text-zinc-400 font-mono text-sm uppercase tracking-wide max-w-md leading-relaxed">
                                TRADITIONAL LENDERS DEMAND PHYSICAL ASSETS. WEB3 PROTOCOLS REQUIRE OVERCOLLATERALIZATION. MANTEIA UNLOCKS CAPITAL BASED ON YOUR PROVEN REVENUE STREAM—PRIVATELY VERIFIED, INSTANTLY FUNDED.
                            </p>
                        </div>
                    </div>

                    {/* Background Image - Absolute to the left container */}
                    <div className="absolute inset-0 z-0 mt-32 md:-mt-10 lg:mt-0">
                        <img
                            src="/images/Flying-Stablecoin.avif"
                            alt="Flying Stablecoin"
                            className="w-full h-full object-contain md:object-cover opacity-60 mix-blend-screen"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </div>
                </div>

                {/* RIGHT SIDE - Scrollable Feature Cards */}
                <div className="lg:w-1/2 flex flex-col bg-black">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                    {/* Spacer to allow the last card to scroll up nicely if needed, or rely on padding */}
                    <div className="h-[20vh] hidden lg:block" />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: any, index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-h-[80vh] flex flex-col justify-center p-8 lg:p-20 border-b border-white/10 last:border-b-0 hover:bg-zinc-950/30 transition-colors duration-500"
        >
            <div className="space-y-12">
                {/* Header: Number and Tag */}
                <div className="flex items-center gap-6 text-zinc-500 font-mono tracking-widest uppercase text-sm">
                    <span className="text-white text-base">{feature.number}</span>
                    <span className="text-xs tracking-widest text-[#666666]">» » »</span>
                    <span className="text-white">{feature.tag}</span>
                </div>

                {/* Content */}
                <div className="space-y-6 max-w-lg">
                    <h3
                        className="text-4xl md:text-5xl font-bold text-white leading-tight"
                        dangerouslySetInnerHTML={{ __html: feature.title }}
                    />

                    <p className="text-zinc-400 font-mono text-xs md:text-sm uppercase tracking-wide leading-relaxed">
                        {feature.description}
                    </p>
                </div>

                {/* CTA Button */}
                <Link href={feature.link} className="inline-block mt-8 w-full md:w-auto">
                    <Button
                        className="h-14 bg-white hover:bg-zinc-200 text-black text-sm font-mono font-bold uppercase tracking-widest rounded-none pr-6 pl-6 flex items-center justify-between gap-8 min-w-[240px] group transition-all"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span><TextScramble trigger={isHovered}>{feature.cta}</TextScramble></span>
                        <div className="flex items-center gap-4">
                            <span className="text-black/20 text-lg font-light">|</span>
                            <span className="group-hover:translate-x-1 transition-transform text-lg">{'>>'}</span>
                        </div>
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
