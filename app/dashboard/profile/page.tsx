"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Buildings, Wallet } from "@phosphor-icons/react";

export default function ProfilePage() {
    const { userProfile, updateProfile } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [companyName, setCompanyName] = useState("");
    const [logoUrl, setLogoUrl] = useState("");

    useEffect(() => {
        if (userProfile) {
            setCompanyName(userProfile.company_name || "");
            setLogoUrl(userProfile.logo_url || "");
        }
    }, [userProfile]);

    const handleSave = async () => {
        if (!userProfile) return;
        setIsLoading(true);

        try {
            await updateProfile(userProfile.wallet_address, {
                company_name: companyName,
                logo_url: logoUrl
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h2 className="text-2xl font-bold text-white mb-2">User Profile</h2>
                <p className="text-[#9CA3AF]">Manage your identity and business details on Manteia.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Visual Identity Card */}
                <div className="md:col-span-1">
                    <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#13161F] border-2 border-[#252931] flex items-center justify-center mb-4 overflow-hidden relative group">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-[#6B7280]" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-xs text-white">Change</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                            {companyName || "Anonymous User"}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#252A36] rounded-full text-xs font-mono text-[#9CA3AF]">
                            <Wallet size={12} />
                            {userProfile?.wallet_address
                                ? `${userProfile.wallet_address.slice(0, 6)}...${userProfile.wallet_address.slice(-4)}`
                                : "No Wallet"}
                        </div>
                        <div className="mt-4 w-full">
                            <div className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold mb-2">Role</div>
                            <div className="w-full py-2 bg-[#00D4AA]/10 text-[#00D4AA] rounded-lg border border-[#00D4AA]/20 font-medium capitalize">
                                {userProfile?.role || "Undecided"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-[#1E222E] border border-[#252931] rounded-2xl p-6 space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <GearIcon /> Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#D1D5DB] flex items-center gap-2">
                                    <Buildings size={16} className="text-brand" /> Company / Display Name
                                </label>
                                <Input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    className="bg-[#13161F] border-[#252931]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#D1D5DB]">Logo URL</label>
                                <Input
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="bg-[#13161F] border-[#252931]"
                                />
                                <p className="text-xs text-[#6B7280]">
                                    We support direct image links (PNG, JPG).
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#252931] flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    variant="brand"
                                    disabled={isLoading}
                                    className="shadow-neon"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GearIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32.04,32.04,0,0,1,128,160Z"></path>
        </svg>
    )
}
