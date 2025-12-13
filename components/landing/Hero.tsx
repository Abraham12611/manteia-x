"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import TextScramble from "@/components/ui/text-scramble";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center bg-black overflow-hidden pt-20">
            {/* Grid Background Pattern (Optional / Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT COLUMN: Text Content */}
                <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12 relative z-10 border-r border-white/10">
                    <div className="space-y-12 max-w-2xl">

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="font-sans text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.05] relative -top-60"
                        >
                            Turn Revenue into Capital. <br />
                            <span className="text-[#00D4AA]">Private. Instant.</span>
                        </motion.h1>

                        {/* Description / Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="font-mono text-sm md:text-base text-zinc-400 uppercase tracking-wide leading-relaxed max-w-lg"
                        >
                            The first Zero-Knowledge RWA protocol. Verify your SaaS revenue locally. Get funded on-chain without revealing your data.
                        </motion.p>
                    </div>

                    {/* Bottom Action Area (pinned to bottom logic handled by flex/padding usually, but here inline) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-16 lg:mt-24 w-full"
                    >
                        <Link href="/onboarding" className="block w-full">
                            <HeroButton />
                        </Link>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Visual / Image */}
                <div className="relative w-full h-[50vh] lg:h-auto flex items-stretch justify-center bg-black overflow-hidden lg:border-l border-white/10 p-0">
                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative w-full h-full flex"
                    >
                        <img
                            src="/images/manteia-hero-vertical.png"
                            alt="Evolution of Money"
                            className="w-full h-full object-cover object-center opacity-90 block"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
import { useState } from "react";

function HeroButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Button
            className="w-full h-14 bg-[#00D4AA] hover:bg-[#00BF99] text-black text-lg font-mono font-bold uppercase tracking-widest rounded-none flex items-center justify-between px-6 transition-all group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span><TextScramble trigger={isHovered}>Launch App</TextScramble></span>
            <div className="flex items-center gap-4">
                <span className="text-black/40 text-xl font-light">|</span>
                <span className="group-hover:translate-x-1 transition-transform text-xl">{'>>'}</span>
            </div>
        </Button>
    );
}
