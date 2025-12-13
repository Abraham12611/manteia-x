"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';
import TextScramble from '@/components/ui/text-scramble';

export default function Navbar() {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent mix-blend-difference'
                } text-white`}
        >
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group">
                    {/* Logo Image */}
                    <img src="/manteia-1-logo.png" alt="Manteia" className="h-8 w-auto invert transition-transform group-hover:scale-105" />
                    <span className="font-sans text-xl font-bold tracking-tight text-white hidden">Manteia</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400 uppercase">
                <Link href="#borrow" className="hover:text-brand transition-colors">
                    <TextScramble>Borrow</TextScramble>
                </Link>
                <span className="text-zinc-700">|</span>
                <Link href="#lend" className="hover:text-brand transition-colors">
                    <TextScramble>Lend</TextScramble>
                </Link>
                <span className="text-zinc-700">|</span>
                <Link href="#technology" className="hover:text-brand transition-colors">
                    <TextScramble>Technology</TextScramble>
                </Link>
                <span className="text-zinc-700">|</span>
                <Link href="#docs" className="hover:text-brand transition-colors">
                    <TextScramble>Docs</TextScramble>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/onboarding">
                    <HoverButton />
                </Link>
            </div>
        </nav>
    );
}

function HoverButton() {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <Button
            size="lg"
            className="bg-[#00D4AA] hover:bg-[#00BF99] text-black font-mono font-bold uppercase tracking-wider rounded-none px-6 h-10 flex items-center gap-4 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span><TextScramble trigger={isHovered}>Launch App</TextScramble></span>
            <div className="flex items-center gap-3">
                <span className="opacity-40 font-light">|</span>
                <span className="group-hover:translate-x-0.5 transition-transform">{'>>'}</span>
            </div>
        </Button>
    );
}

