const hre = require("hardhat");

async function main() {
    try {
        console.log("🚀 Starting UPGRADE Deployment");

        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying with account:", deployer.address);

        // EXISTING ADDRESSES (From .env.local)
        const MOCK_USDC_ADDRESS = "0xa2B590289B67993c1Ab1d7bf0ac8BCD612F43589";
        const VERIFIER_ADDRESS = "0xD405994e7D44eDD6A1CB45A19629D9E0F41a9400";

        console.log("Using Existing MockUSDC:", MOCK_USDC_ADDRESS);
        console.log("Using Existing Verifier:", VERIFIER_ADDRESS);

        // 1. Deploy NEW LendingVault
        const LendingVault = await hre.ethers.getContractFactory("LendingVault");
        const vault = await LendingVault.deploy(MOCK_USDC_ADDRESS);
        await vault.waitForDeployment();
        const vaultAddress = await vault.getAddress();
        console.log("✅ NEW LendingVault deployed to:", vaultAddress);

        // 2. Deploy NEW ManteiaFactory
        const ManteiaFactory = await hre.ethers.getContractFactory("ManteiaFactory");
        const factory = await ManteiaFactory.deploy(VERIFIER_ADDRESS, vaultAddress);
        await factory.waitForDeployment();
        const factoryAddress = await factory.getAddress();
        console.log("✅ NEW ManteiaFactory deployed to:", factoryAddress);

        // 3. Setup Permissions
        console.log("⚙️ Setting up permissions...");
        const tx = await vault.setFactory(factoryAddress);
        await tx.wait();
        console.log("✅ Vault Factory set to new Factory.");

        // 4. Output for .env.local
        console.log("\nCopy these to .env.local:");
        console.log(`NEXT_PUBLIC_LENDING_VAULT_ADDRESS=${vaultAddress}`);
        console.log(`NEXT_PUBLIC_MANTEIA_FACTORY_ADDRESS=${factoryAddress}`);

        const fs = require("fs");
        const addresses = {
            LENDING_VAULT: vaultAddress,
            MANTEIA_FACTORY: factoryAddress
        };
        fs.writeFileSync("deployed_addresses_upgrade.json", JSON.stringify(addresses, null, 2));
        console.log("✅ Addresses written to deployed_addresses_upgrade.json");

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
