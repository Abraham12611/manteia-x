"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    TrendUp,
    Wallet,
    Users,
    GearSix,
    Lifebuoy,
    Receipt
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store";
import { SidebarFooter } from "@/components/dashboard/SidebarFooter";

const COMMON_ITEMS = [
    { label: "Profile", href: "/dashboard/profile", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: GearSix },
];

const BORROWER_ITEMS = [
    { label: "Overview", href: "/dashboard", icon: House },
    { label: "Loan History", href: "/dashboard/history", icon: Receipt },
    ...COMMON_ITEMS
];

const LENDER_ITEMS = [
    { label: "Markets", href: "/dashboard/markets", icon: TrendUp },
    { label: "Portfolio", href: "/dashboard/assets", icon: Wallet },
    ...COMMON_ITEMS
];

export function Sidebar() {
    const pathname = usePathname();
    const { userProfile } = useUserStore();

    // Default to borrower if no role yet (or during default state), 
    // though auth guard should prevent this state.
    const navItems = userProfile?.role === 'lender' ? LENDER_ITEMS : BORROWER_ITEMS;

    return (
        <div className="flex flex-col h-full w-[232px] bg-[#17191F] border-r border-[#252931] shrink-0">
            {/* Logo */}
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    {/* Placeholder Logo Icon */}
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                        <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="text-xl font-bold text-white font-serif tracking-tight">Manteia</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-[#6B7280] uppercase px-4 mb-2 tracking-wider">
                    Menu
                </div>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9375rem] font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-[#1E222E] text-white"
                                    : "text-[#9CA3AF] hover:bg-[#1E222E] hover:text-white"
                            )}
                        >
                            <Icon
                                size={20}
                                weight={isActive ? "fill" : "regular"}
                                className={cn(
                                    "transition-colors duration-200",
                                    isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#9CA3AF]"
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="px-4 pb-4">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[0.9375rem] font-medium text-[#9CA3AF] hover:bg-[#1E222E] hover:text-white transition-all duration-200 group">
                    <Lifebuoy size={20} className="text-[#6B7280] group-hover:text-[#9CA3AF]" />
                    Support
                </button>
            </div>

            {/* Footer / Connect Button */}
            <SidebarFooter />
        </div>
    );
}
