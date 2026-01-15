const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Checking balance for:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "MNT");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
