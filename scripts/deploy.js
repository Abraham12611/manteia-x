const hre = require("hardhat");

async function main() {
    try {
        console.log("DEBUG: Starting main function");
        console.log("DEBUG: Available HRE keys:", Object.keys(hre));

        if (!hre.ethers) {
            throw new Error("hre.ethers is undefined. Hardhat-toolbox might not be loaded.");
        }

        const networkName = hre.network.name;
        console.log("🚀 Starting Deployment to", networkName);

        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);

        // 1. Deploy MockUSDC
        const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
        const usdc = await MockUSDC.deploy();
        await usdc.waitForDeployment();
        console.log("✅ MockUSDC deployed to:", await usdc.getAddress());

        // 2. Deploy Verifier
        const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");
        const verifier = await Verifier.deploy();
        await verifier.waitForDeployment();
        console.log("✅ Verifier deployed to:", await verifier.getAddress());

        // 3. Deploy LendingVault
        const LendingVault = await hre.ethers.getContractFactory("LendingVault");
        const vault = await LendingVault.deploy(await usdc.getAddress());
        await vault.waitForDeployment();
        console.log("✅ LendingVault deployed to:", await vault.getAddress());

        // 4. Deploy ManteiaFactory
        const ManteiaFactory = await hre.ethers.getContractFactory("ManteiaFactory");
        const factory = await ManteiaFactory.deploy(await verifier.getAddress(), await vault.getAddress());
        await factory.waitForDeployment();
        console.log("✅ ManteiaFactory deployed to:", await factory.getAddress());

        // 5. Setup Permissions
        console.log("⚙️ Setting up permissions...");
        await vault.setFactory(await factory.getAddress());
        console.log("✅ Vault Factory set.");

        const fs = require("fs");
        const addresses = {
            MOCK_USDC: await usdc.getAddress(),
            VERIFIER: await verifier.getAddress(),
            LENDING_VAULT: await vault.getAddress(),
            MANTEIA_FACTORY: await factory.getAddress()
        };
        console.table(addresses);
        fs.writeFileSync("deployed_addresses.json", JSON.stringify(addresses, null, 2));
        console.log("✅ Addresses written to deployed_addresses.json");

    } catch (error) {
        console.error("__________________DEPLOYMENT_ERROR__________________");
        console.error(error);
        console.error(error.stack);
        console.error("____________________________________________________");
        process.exit(1);
    }
}

main();
