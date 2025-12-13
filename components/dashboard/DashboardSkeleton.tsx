import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-[232px_1fr] min-h-screen bg-[#13161F]">
            {/* Sidebar Skeleton */}
            <div className="border-r border-[#252931] bg-[#17191F] p-4 space-y-4">
                <Skeleton className="h-8 w-32 bg-[#252A36]" />
                <div className="space-y-2 mt-8">
                    <Skeleton className="h-10 w-full bg-[#252A36]" />
                    <Skeleton className="h-10 w-full bg-[#252A36]" />
                    <Skeleton className="h-10 w-full bg-[#252A36]" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 bg-[#1E222E]" />
                        <Skeleton className="h-4 w-64 bg-[#1E222E]" />
                    </div>
                    <Skeleton className="h-10 w-32 bg-[#1E222E]" />
                </div>

                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-[400px] w-full rounded-2xl bg-[#1E222E]" />
                    <Skeleton className="h-[400px] w-full rounded-2xl bg-[#1E222E]" />
                </div>
            </div>
        </div>
    );
}
