"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, ShieldWarning, Moon, Translate } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAccount, useDisconnect } from "wagmi";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { disconnect } = useDisconnect();
    const { resetProfile } = useUserStore();
    const router = useRouter();

    const handleLogout = () => {
        disconnect();
        resetProfile();
        router.push('/');
        toast.info("Logged out successfully");
    };

    return (
        <div className="max-w-3xl space-y-8">
            <header>
                <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                <p className="text-[#9CA3AF]">Manage application preferences and security.</p>
            </header>

            {/* General Preferences */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white">General</h3>
                <div className="bg-[#1E222E] border border-[#252931] rounded-2xl divide-y divide-[#252931]">

                    {/* Appearance */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#13161F] flex items-center justify-center text-[#9CA3AF]">
                                <Moon size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-white">Appearance</div>
                                <div className="text-xs text-[#6B7280]">Currently Dark Mode (System)</div>
                            </div>
                        </div>
                        <div className="bg-[#252A36] px-3 py-1 rounded text-xs text-[#9CA3AF]">Locked</div>
                    </div>

                    {/* Language */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#13161F] flex items-center justify-center text-[#9CA3AF]">
                                <Translate size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-white">Language</div>
                                <div className="text-xs text-[#6B7280]">English (US)</div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#252931] hover:bg-[#252A36] text-white">
                            Change
                        </Button>
                    </div>

                    {/* Notifications */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#13161F] flex items-center justify-center text-[#9CA3AF]">
                                <Bell size={20} />
                            </div>
                            <div>
                                <div className="font-medium text-white">Notifications</div>
                                <div className="text-xs text-[#6B7280]">Loan updates and rewards</div>
                            </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="toggle toggle-success" defaultChecked />
                            <div className="w-11 h-6 bg-[#252A36] rounded-full border border-[#252931] relative flex items-center px-1">
                                <div className="w-4 h-4 bg-[#00D4AA] rounded-full shadow-md translate-x-5 transition-transform"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-8">
                <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
                <div className="bg-[#1E222E] border border-red-900/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <ShieldWarning size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Disconnect Wallet & Clear Session</h4>
                                <p className="text-sm text-[#9CA3AF]">
                                    This will safely disconnect your wallet and clear local data.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
