"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { RepaymentModal } from "./RepaymentModal";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight } from "@phosphor-icons/react";

interface Loan {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    tx_hash: string;
    chain_loan_id: string; // "Token ID"
}

interface LoanHistoryTableProps {
    loans: Loan[];
    onRepay: (loanId: string, amount: number) => Promise<void>;
}

export function LoanHistoryTable({ loans, onRepay }: LoanHistoryTableProps) {
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

    const handleRepayClick = (loan: Loan) => {
        setSelectedLoan(loan);
        setIsRepayModalOpen(true);
    };

    const handleRepaySubmit = async (amount: number) => {
        if (!selectedLoan) return;
        await onRepay(selectedLoan.id, amount);
    };

    return (
        <div className="rounded-xl border border-[#252931] bg-[#1E222E] overflow-hidden">
            <Table>
                <TableHeader className="bg-[#252A36]/50">
                    <TableRow className="border-[#252931] hover:bg-transparent">
                        <TableHead className="text-[#9CA3AF] font-medium">Date</TableHead>
                        <TableHead className="text-[#9CA3AF] font-medium">Loan ID</TableHead>
                        <TableHead className="text-[#9CA3AF] font-medium">Amount</TableHead>
                        <TableHead className="text-[#9CA3AF] font-medium">Status</TableHead>
                        <TableHead className="text-[#9CA3AF] font-medium text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loans.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-[#6B7280]">
                                No loans found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        loans.map((loan) => (
                            <TableRow key={loan.id} className="border-[#252931] hover:bg-[#252A36]/50 transition-colors">
                                <TableCell className="text-white font-medium">
                                    {new Date(loan.created_at).toLocaleDateString()}
                                    <div className="text-xs text-[#6B7280] font-normal">
                                        {formatDistanceToNow(new Date(loan.created_at), { addSuffix: true })}
                                    </div>
                                </TableCell>
                                <TableCell className="text-[#9CA3AF] font-mono text-xs">
                                    #{loan.chain_loan_id || loan.id.slice(0, 6)}
                                </TableCell>
                                <TableCell className="text-white font-bold">
                                    ${loan.amount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <LoanStatusBadge status={loan.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {loan.status.toLowerCase() === 'active' || loan.status.toLowerCase() === 'pending' ? (
                                        // Usually Repay only for Active, but for demo we might allow mock actions
                                        <Button
                                            size="sm"
                                            className="bg-[#252A36] hover:bg-[#2B3040] text-[#00D4AA] border border-[#00D4AA]/20 h-8 text-xs font-semibold"
                                            onClick={() => handleRepayClick(loan)}
                                        >
                                            Repay
                                        </Button>
                                    ) : (
                                        <a
                                            href={`https://sepolia.mantlescan.xyz/tx/${loan.tx_hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs text-[#6B7280] hover:text-[#00D4AA]"
                                        >
                                            View TX <ArrowUpRight className="ml-1" />
                                        </a>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {selectedLoan && (
                <RepaymentModal
                    isOpen={isRepayModalOpen}
                    onClose={() => setIsRepayModalOpen(false)}
                    loanId={selectedLoan.chain_loan_id || selectedLoan.id}
                    amountDue={selectedLoan.amount} // Simplified: Principal only for now
                    onRepay={handleRepaySubmit}
                />
            )}
        </div>
    );
}
