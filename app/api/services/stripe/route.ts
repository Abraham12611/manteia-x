import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { apiKey } = body;

        if (!apiKey || !apiKey.startsWith('sk_')) {
            return NextResponse.json(
                { error: 'Invalid API Key format' },
                { status: 400 }
            );
        }

        // Mock Logic for Demo
        // In production, init Stripe client here: new Stripe(apiKey)
        console.log(`[Mock Stripe] Verifying with key: ${apiKey}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Return Mocked Revenue Data
        return NextResponse.json({
            status: 'success',
            account_id: 'acct_mock_123456',
            period: 'last_12_months',
            revenue: {
                total: 15000000, // $150,000.00
                currency: 'usd',
                transaction_count: 1420
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
