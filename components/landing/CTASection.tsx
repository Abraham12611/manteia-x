"use client";

import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import TextScramble from "@/components/ui/text-scramble";

export default function CTASection() {
    const [isHovered, setIsHovered] = useState<string | null>(null);

    return (
        <section className="py-24 px-4 bg-black relative border-t border-white/10 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.9] tracking-tight"
                        >
                            Traditional financing <br /> is obsolete.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-zinc-400 font-mono text-lg max-w-xl leading-relaxed uppercase"
                        >
                            MANTEIA CREATES LIQUID CAPITAL FROM REVENUE STREAMS WHILE PRESERVING COMPLETE PRIVACY. CHOOSE YOUR STRATEGY, KEEP FULL CONTROL, SCALE FOREVER.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-8 pt-4"
                        >
                            <Link href="#" className="group">
                                <span className="text-[#00D4AA] font-mono font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                    <TextScramble trigger={isHovered === 'launch'}>LAUNCH APP</TextScramble>
                                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">»</span>
                                </span>
                            </Link>

                            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />

                            <Link href="#" className="group">
                                <span className="text-white hover:text-[#00D4AA] font-mono font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors">
                                    <TextScramble trigger={isHovered === 'docs'}>READ DOCS</TextScramble>
                                </span>
                            </Link>

                            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block" />

                            <Link href="#" className="group">
                                <span className="text-white hover:text-[#00D4AA] font-mono font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors">
                                    <TextScramble trigger={isHovered === 'community'}>JOIN COMMUNITY</TextScramble>
                                </span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <img
                            src="/images/Coins.avif"
                            alt="Visualizing Liquid Capital"
                            className="w-full max-w-md md:max-w-lg lg:max-w-xl object-contain relative z-10 drop-shadow-2xl"
                        />
                        {/* Glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#00D4AA]/10 blur-[120px] rounded-full z-0" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
