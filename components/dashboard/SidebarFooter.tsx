"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
    User,
    SignOut,
    Copy,
    Check
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function SidebarFooter() {
    return (
        <div className="p-4 border-t border-[#252931] bg-[#17191F]">
            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                    if (!ready) {
                        return (
                            <div className="w-full h-12 bg-[#252A36] animate-pulse rounded-xl" />
                        );
                    }

                    if (!connected) {
                        return (
                            <Button
                                onClick={openConnectModal}
                                variant="brand"
                                className="w-full shadow-neon"
                            >
                                Connect Wallet
                            </Button>
                        );
                    }

                    if (chain.unsupported) {
                        return (
                            <Button
                                onClick={openChainModal}
                                variant="destructive"
                                className="w-full"
                            >
                                Wrong Network
                            </Button>
                        );
                    }

                    return (
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={openAccountModal}
                                className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-[#252A36] transition-colors group text-left"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4AA] to-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-[#00D4AA]/10 group-hover:scale-105 transition-transform">
                                    {account.ensAvatar ? (
                                        <img
                                            src={account.ensAvatar}
                                            alt="ENS Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User weight="fill" className="text-white w-5 h-5" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-white truncate">
                                            {account.displayName}
                                        </p>
                                    </div>
                                    <p className="text-xs text-[#9CA3AF] truncate font-mono">
                                        {account.displayBalance
                                            ? `(${account.displayBalance})`
                                            : ""}
                                    </p>
                                </div>
                            </button>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </div>
    );
}
