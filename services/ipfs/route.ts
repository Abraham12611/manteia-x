import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { encryptedData, metadata } = body;

        if (!process.env.PINATA_JWT) {
            return NextResponse.json({ error: "Server Configuration Error: Missing PINATA_JWT" }, { status: 500 });
        }

        if (!encryptedData) {
            return NextResponse.json({ error: "Missing encryptedData" }, { status: 400 });
        }

        // Construct payload for Pinata
        const payload = {
            pinataContent: {
                encryptedData,
                timestamp: new Date().toISOString(),
                ...metadata // Optional extra metadata
            },
            pinataMetadata: {
                name: `manteia_loan_${Date.now()}`,
            }
        };

        const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.PINATA_JWT}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Pinata API Error: ${res.status} - ${errorText}`);
        }

        const data = await res.json();

        return NextResponse.json({
            success: true,
            ipfsHash: data.IpfsHash,
            timestamp: data.Timestamp
        });

    } catch (error: any) {
        console.error("IPFS Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload to IPFS" }, { status: 500 });
    }
}
