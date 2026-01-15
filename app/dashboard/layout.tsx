"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { userProfile, isProfileLoading, fetchProfile, resetProfile } = useUserStore();
    const { isConnected, address } = useAccount();

    // Fetch Profile on Connect
    useEffect(() => {
        if (isConnected && address) {
            console.log("DashboardLayout: Fetching profile for", address);
            fetchProfile(address);
        } else if (!isConnected) {
            resetProfile();
        }
    }, [isConnected, address, fetchProfile, resetProfile]);

    // Role Guard
    useEffect(() => {
        if (isConnected && !isProfileLoading && userProfile && !userProfile.role) {
            console.log("DashboardLayout: No role found, redirecting to onboarding");
            router.push('/onboarding');
        }
    }, [isConnected, isProfileLoading, userProfile, router]);

    return (
        <div className="flex h-screen bg-[#13161F] text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Placeholder (Search, Notif, Profile) */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-[#252931] bg-[#13161F] shrink-0">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {/* Search Bar / Profile / Notifs would go here */}
                        <span className="text-sm text-gray-500">Search Placeholder</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
