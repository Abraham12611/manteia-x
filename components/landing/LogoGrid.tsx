"use client";

import { motion } from "framer-motion";
import { Brain, Columns, Infinity, CurrencyEth, Polygon } from "@phosphor-icons/react";

const logos = [
    {
        id: "mantle",
        name: "Mantle",
        url: "https://cdn.brandfetch.io/mantle.xyz/w/512/h/135/theme/light/logo?c=1idWq6mDhXrfUctv-2O",
        className: "h-10 w-auto"
    },
    {
        id: "stripe",
        name: "Stripe",
        url: "https://cdn.brandfetch.io/stripe.com/w/512/h/243/theme/light/logo?c=1idWq6mDhXrfUctv-2O",
        className: "h-12 w-auto"
    },
    {
        id: "shopify",
        name: "Shopify",
        url: "https://cdn.brandfetch.io/shopify.com/w/512/h/146/theme/light/logo?c=1idWq6mDhXrfUctv-2O",
        className: "h-10 w-auto"
    },
    {
        id: "ondo",
        name: "Ondo",
        url: "https://cdn.brandfetch.io/ondo.finance/w/512/h/151/theme/light/logo?c=1idWq6mDhXrfUctv-2O",
        className: "h-8 w-auto"
    },
    {
        id: "eigen",
        name: "EigenLayer",
        url: "https://cdn.brandfetch.io/eigencloud.xyz/w/416/h/198/logo?c=1idWq6mDhXrfUctv-2O",
        className: "h-10 w-auto"
    }
];

export default function LogoGrid() {
    return (
        <section className="bg-black border-b border-white/10 relative z-20">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {logos.map((logo, index) => (
                        <div
                            key={logo.id}
                            className={`
                                h-24 flex items-center justify-center 
                                border-b lg:border-b-0 border-white/10
                                ${index !== logos.length - 1 ? 'lg:border-r' : ''}
                                ${(index + 1) % 2 === 0 ? 'md:border-r-0 lg:border-r' : 'border-r'} 
                                ${index === logos.length - 1 ? 'border-b-0 md:col-span-1 md:border-r-0 lg:col-auto col-span-2' : ''}
                                group cursor-default transition-colors hover:bg-white/5
                            `}
                        >
                            <img
                                src={logo.url}
                                alt={logo.name}
                                className={`
                                    ${logo.className}
                                    object-contain
                                    opacity-50 brightness-0 invert
                                    group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0
                                    transition-all duration-300 transform group-hover:scale-110
                                `}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
