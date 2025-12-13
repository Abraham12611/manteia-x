"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";

interface RepaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    loanId: string;
    amountDue: number;
    onRepay: (amount: number) => Promise<void>;
}

export function RepaymentModal({ isOpen, onClose, loanId, amountDue, onRepay }: RepaymentModalProps) {
    const [amount, setAmount] = useState<string>(amountDue.toString());
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRepay = async () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error("Invalid amount");
            return;
        }
        if (val > amountDue) {
            toast.error("Amount exceeds due balance");
            return;
        }

        setIsProcessing(true);
        try {
            await onRepay(val);
            onClose();
        } catch (error) {
            console.error("Repayment failed", error);
            // Toast handling should be in parent or here? Parent likely handles the logic.
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1E222E] border-[#2D3340] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Repay Loan</DialogTitle>
                    <DialogDescription className="text-[#9CA3AF]">
                        Enter the amount you wish to repay for Loan #{loanId.slice(0, 8)}...
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#9CA3AF]">Amount (USDC)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-[#13161F] border-[#252931] text-white pl-8 focus:border-[#00D4AA]"
                                placeholder="0.00"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">
                            Total Due: <span className="text-[#00D4AA]">${amountDue.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-[#9CA3AF] hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRepay}
                        disabled={isProcessing}
                        className="bg-[#00D4AA] hover:bg-[#00A884] text-white font-semibold"
                    >
                        {isProcessing ? (
                            <>
                                <Spinner className="animate-spin mr-2" /> Processing
                            </>
                        ) : (
                            "Confirm Repayment"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
