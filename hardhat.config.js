require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    networks: {
        mantleTest: {
            url: "https://rpc.sepolia.mantle.xyz",
            accounts: [PRIVATE_KEY],
            chainId: 5003
        },
        mantleMain: {
            url: "https://rpc.mantle.xyz",
            accounts: [PRIVATE_KEY],
            chainId: 5000
        },
        hardhat: {
            chainId: 1337
        }
    }
};
