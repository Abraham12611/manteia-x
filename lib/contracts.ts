// Mantle Sepolia (Default from env)
const MANTLE_ADDRESSES = {
    MOCK_USDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS as `0x${string}`,
    LENDING_VAULT: process.env.NEXT_PUBLIC_LENDING_VAULT_ADDRESS as `0x${string}`,
    VERIFIER: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS as `0x${string}`,
    MANTEIA_FACTORY: process.env.NEXT_PUBLIC_MANTEIA_FACTORY_ADDRESS as `0x${string}`,
};

// BSC Testnet (Hardcoded from deployment)
const BSC_TESTNET_ADDRESSES = {
    MOCK_USDC: "0x8a0b9F2e4CcB68DCdEAf30c607240F38E2fbDCA3" as `0x${string}`,
    LENDING_VAULT: "0xfF81024cB70e8e3f1e23C875794bad7FC7D967eD" as `0x${string}`,
    VERIFIER: "0xb4610Ef778F86812667CfdcEcB2137F6c189228A" as `0x${string}`,
    MANTEIA_FACTORY: "0x322EcbFf215ddAf59F4F1A78120e1cEB192D48bD" as `0x${string}`,
};

export const getContractAddresses = (chainId?: number) => {
    if (chainId === 97) return BSC_TESTNET_ADDRESSES;
    return MANTLE_ADDRESSES; // Default
};

// Backward compatibility (deprecated)
export const CONTRACT_ADDRESSES = MANTLE_ADDRESSES;

export const MANTLE_SEPOLIA_CHAIN_ID = 5003;
export const BSC_TESTNET_CHAIN_ID = 97;
