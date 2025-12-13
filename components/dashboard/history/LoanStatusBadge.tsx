import { Badge } from "@/components/ui/badge";

interface LoanStatusBadgeProps {
    status: string;
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === "active") {
        return (
            <Badge className="bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 hover:bg-[#00D4AA]/20">
                Active
            </Badge>
        );
    }

    if (normalizedStatus === "repaid" || normalizedStatus === "completed") {
        return (
            <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20">
                Repaid
            </Badge>
        );
    }

    if (normalizedStatus === "defaulted" || normalizedStatus === "failed") {
        return (
            <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20">
                {status}
            </Badge>
        );
    }

    // Pending or others
    return (
        <Badge className="bg-[#252A36] text-[#9CA3AF] border border-[#2D3340] hover:bg-[#2B3040]">
            {status}
        </Badge>
    );
}
