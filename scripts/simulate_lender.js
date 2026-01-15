const hre = require("hardhat");
require("dotenv").config();

async function main() {
    console.log("🚀 Starting Lender Simulation");

    // 1. Setup Wallet
    const privateKey = process.env.LENDER_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error("Missing LENDER_PRIVATE_KEY or PRIVATE_KEY in .env");

    const provider = new hre.ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
    const wallet = new hre.ethers.Wallet(privateKey, provider);

    console.log("💼 Using Lender Wallet:", wallet.address);
    console.log("   Balance:", hre.ethers.formatEther(await provider.getBalance(wallet.address)), "MNT");

    // 2. Load Contracts
    const fs = require("fs");
    // Try upgrade addresses first, then fallback
    let addresses;
    try {
        addresses = JSON.parse(fs.readFileSync("deployed_addresses_upgrade.json"));
    } catch {
        addresses = JSON.parse(fs.readFileSync("deployed_addresses.json"));
    }

    const USDC_ADDRESS = addresses.MOCK_USDC || process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS;
    const VAULT_ADDRESS = addresses.LENDING_VAULT || process.env.NEXT_PUBLIC_LENDING_VAULT_ADDRESS;

    if (!USDC_ADDRESS || !VAULT_ADDRESS) throw new Error("Missing Contract Addresses");

    const MockUSDC = await hre.ethers.getContractAt("MockUSDC", USDC_ADDRESS, wallet);
    const LendingVault = await hre.ethers.getContractAt("LendingVault", VAULT_ADDRESS, wallet);

    // 3. Ensure Funds (Mint if low)
    const usdcBal = await MockUSDC.balanceOf(wallet.address);
    if (usdcBal < 1000n * 10n ** 6n) {
        console.log("💧 Minting 5,000 mUSDC to lender...");
        // Note: Mint might fail if not owner, but public mint is enabled in MockUSDC
        try {
            const tx = await MockUSDC.mint(wallet.address, 5000n * 10n ** 6n);
            await tx.wait();
            console.log("   Minted!");
        } catch (e) {
            console.warn("   Mint failed (likely not enabled/authorized):", e.message);
        }
    }

    // 4. Approve
    const depositAmount = 500n * 10n ** 6n; // 500 USDC
    console.log(`🔓 Approving ${hre.ethers.formatUnits(depositAmount, 6)} USDC...`);
    const approveTx = await MockUSDC.approve(VAULT_ADDRESS, depositAmount);
    await approveTx.wait();
    console.log("   Approved! Tx:", approveTx.hash);

    // 5. Deposit
    console.log(`💰 Depositing...`);
    const depositTx = await LendingVault.deposit(depositAmount);
    await depositTx.wait();
    console.log("   Deposited! Tx:", depositTx.hash);

    const vaultBal = await LendingVault.userDeposits(wallet.address);
    console.log(`   New Vault Balance: ${hre.ethers.formatUnits(vaultBal, 6)} USDC`);

    // 6. Withdraw Half
    const withdrawAmount = depositAmount / 2n;
    console.log(`💸 Withdrawing ${hre.ethers.formatUnits(withdrawAmount, 6)} USDC...`);
    const withdrawTx = await LendingVault.withdraw(withdrawAmount);
    await withdrawTx.wait();
    console.log("   Withdrawn! Tx:", withdrawTx.hash);

    const finalBal = await LendingVault.userDeposits(wallet.address);
    console.log(`✅ Simulation Complete. Final Vault Balance: ${hre.ethers.formatUnits(finalBal, 6)} USDC`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
