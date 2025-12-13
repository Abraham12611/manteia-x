"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { CircleNotch } from "@phosphor-icons/react";

interface Loan {
    id: number;
    title: string;
    category: string;
    amount: number;
    apy: number;
    duration: number;
    risk_score: string;
    status: string;
}

export function LoanExplorerTable() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLoans() {
            setLoading(true);
            const { data, error } = await supabase
                .from('loans')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setLoans(data);
            if (error) console.error("Error fetching loans:", error);
            setLoading(false);
        }
        fetchLoans();
    }, []);

    const getRiskBadge = (score: number) => {
        let grade = 'C';
        let colorClass = "bg-[#FF5370]/10 text-[#FF5370] border-[#FF5370]/20";

        if (score >= 95) { grade = 'A+'; colorClass = "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20"; }
        else if (score >= 85) { grade = 'A'; colorClass = "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20"; }
        else if (score >= 70) { grade = 'B'; colorClass = "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"; }

        return (
            <Badge variant="outline" className={`rounded-md px-2 py-0.5 border ${colorClass} hover:bg-transparent`}>
                {grade} ({score})
            </Badge>
        );
    };

    return (
        <div className="bg-[#1E222E] border border-[#252931] rounded-2xl overflow-hidden shadow-card">
            <div className="p-6 border-b border-[#252931]">
                <h3 className="text-lg font-semibold text-white">Active Protocol Loans</h3>
                <p className="text-sm text-[#6B7280]">Browse loans currently backed by the liquidity pool.</p>
            </div>

            <div className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#252931] hover:bg-transparent">
                            <TableHead className="text-[#6B7280] font-medium pl-6">Sector / Purpose</TableHead>
                            <TableHead className="text-[#6B7280] font-medium">Amount</TableHead>
                            <TableHead className="text-[#6B7280] font-medium">Risk Score</TableHead>
                            <TableHead className="text-[#6B7280] font-medium">Status</TableHead>
                            <TableHead className="text-right pr-6">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center"><CircleNotch size={24} className="animate-spin text-[#00D4AA]" /></div>
                                </TableCell>
                            </TableRow>
                        ) : loans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-[#6B7280]">
                                    No active loans found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            loans.map((loan) => (
                                <TableRow key={loan.id} className="border-b border-[#252931] hover:bg-[#252A36] transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="font-medium text-white">{loan.sector}</div>
                                        <div className="text-xs text-[#6B7280] truncate max-w-[200px]">{loan.purpose}</div>
                                    </TableCell>
                                    <TableCell className="text-white font-medium">
                                        {formatCurrency(loan.amount)}
                                    </TableCell>
                                    <TableCell>
                                        {getRiskBadge(loan.risk_score)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-medium capitalize ${loan.status === 'active' || loan.status === 'pending' ? 'text-[#00D4AA]' : 'text-[#6B7280]'}`}>
                                            {loan.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button size="sm" variant="secondary" className="h-8 bg-[#252A36] border-[#3D4454] hover:bg-[#2B3040] text-white">
                                            View Proof
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
