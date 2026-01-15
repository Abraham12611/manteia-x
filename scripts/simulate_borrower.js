const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Starting Borrower Simulation");

    // 1. Setup Wallet
    const privateKey = process.env.BORROWER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error("Missing BORROWER_PRIVATE_KEY or PRIVATE_KEY in .env");

    // Connect to network
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
    const wallet = new hre.ethers.Wallet(privateKey, provider);

    console.log("💼 Using Borrower Wallet:", wallet.address);
    console.log("   Balance:", hre.ethers.formatEther(await provider.getBalance(wallet.address)), "MNT");

    // 2. Load Contracts
    const fs = require("fs");
    let addresses;
    try {
        addresses = JSON.parse(fs.readFileSync("deployed_addresses_upgrade.json"));
    } catch {
        addresses = JSON.parse(fs.readFileSync("deployed_addresses.json"));
    }

    const USDC_ADDRESS = addresses.MOCK_USDC || process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS;
    const FACTORY_ADDRESS = addresses.MANTEIA_FACTORY || process.env.NEXT_PUBLIC_MANTEIA_FACTORY_ADDRESS;

    if (!USDC_ADDRESS || !FACTORY_ADDRESS) throw new Error("Missing Contract Addresses");

    const ManteiaFactory = await hre.ethers.getContractAt("ManteiaFactory", FACTORY_ADDRESS, wallet);
    const MockUSDC = await hre.ethers.getContractAt("MockUSDC", USDC_ADDRESS, wallet);

    // 3. Mock Stripe Verification
    console.log("🔍 [MOCK] Verifying Stripe Revenue...");
    await new Promise(r => setTimeout(r, 1000));
    console.log("✅ [MOCK] Revenue Verified: $150,000/yr (> $50k threshold)");

    // 4. Construct Mock ZK Proof
    // Note: Factory currently bypasses verification for Demo/Dev
    const a = [0, 0];
    const b = [[0, 0], [0, 0]];
    const c = [0, 0];
    const input = [1, 12345]; // [isQualified, publicSignal]

    // 5. IPFS Hash
    const ipfsHash = "QmMockHash1234567890abcdef";
    console.log("📦 [MOCK] Uploaded encrypted data to IPFS:", ipfsHash);

    // 6. Request Loan
    const loanAmount = 1000n * 10n ** 6n; // 1,000 USDC
    console.log(`💸 Requesting Loan: ${hre.ethers.formatUnits(loanAmount, 6)} USDC...`);

    const preBalance = await MockUSDC.balanceOf(wallet.address);

    try {
        const tx = await ManteiaFactory.requestLoan(
            a, b, c, input,
            loanAmount,
            ipfsHash
        );
        console.log("   Tx Submitted:", tx.hash);
        console.log("   Waiting for confirmation...");

        await tx.wait();
        console.log("✅ Loan Processed!");

        // 7. Verify Funds
        const postBalance = await MockUSDC.balanceOf(wallet.address);
        console.log(`   Previous Balance: ${hre.ethers.formatUnits(preBalance, 6)} USDC`);
        console.log(`   New Balance:      ${hre.ethers.formatUnits(postBalance, 6)} USDC`);

        if (postBalance > preBalance) {
            console.log("🎉 Loan Successfully Funded!");
        } else {
            console.warn("⚠️ Balance did not increase. Vault might be empty?");
        }

    } catch (e) {
        console.error("❌ Loan Request Failed:", e.message);
        if (e.message.includes("Insufficient liquidity")) {
            console.log("💡 Tip: Run simulate_lender.js first to fund the vault!");
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
