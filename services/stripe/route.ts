import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Deterministic mock data for dev/hackathons
const MOCK_REVENUE = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 15200 },
    { month: "Mar", revenue: 14100 },
    { month: "Apr", revenue: 18500 },
    { month: "May", revenue: 21000 },
    { month: "Jun", revenue: 19800 },
    { month: "Jul", revenue: 25400 },
    { month: "Aug", revenue: 24100 },
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { apiKey, mock } = body;

        // 1. Handle Mock Mode
        if (mock || process.env.NEXT_PUBLIC_USE_MOCK_STRIPE === "true") {
            return NextResponse.json({
                success: true,
                data: MOCK_REVENUE,
                source: "mock"
            });
        }

        // 2. Validate API Key
        if (!apiKey) {
            return NextResponse.json({ error: "Missing Stripe API Key" }, { status: 400 });
        }

        // 3. Initialize Stripe
        const stripe = new Stripe(apiKey, {
            apiVersion: "2024-12-18.acacia" as any, // Cast to any to avoid strict version check conflicts during dev
            typescript: true,
        });

        // 4. Fetch Balance Transactions (Last 100 Charges)
        // In a real app, we'd paginate back 12 months.
        const transactions = await stripe.balanceTransactions.list({
            limit: 100,
            type: 'charge'
        });

        // 5. Aggregate Data by Month (Simplified)
        const revenueMap: Record<string, number> = {};

        transactions.data.forEach((txn) => {
            const date = new Date(txn.created * 1000);
            const month = date.toLocaleString('default', { month: 'short' });

            // Only count positive net amounts (revenue)
            if (txn.net > 0) {
                // net is in cents usually, so divide by 100
                revenueMap[month] = (revenueMap[month] || 0) + (txn.net / 100);
            }
        });

        // Convert to array format expected by ZK/UI
        const revenueData = Object.entries(revenueMap).map(([month, revenue]) => ({
            month,
            revenue
        }));

        // If no data (e.g. new account), return empty structure or mock structure for stability
        if (revenueData.length === 0) {
            return NextResponse.json({ success: true, data: [], message: "No revenue found" });
        }

        return NextResponse.json({ success: true, data: revenueData });

    } catch (error: any) {
        console.error("Stripe Fetch Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch stripe data" }, { status: 500 });
    }
}
