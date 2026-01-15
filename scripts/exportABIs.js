const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.join(__dirname, '../artifacts/contracts');
const DEST_DIR = path.join(__dirname, '../lib/abis');

const CONTRACTS = [
    { name: 'MockUSDC', path: 'MockUSDC.sol/MockUSDC.json' },
    { name: 'LendingVault', path: 'LendingVault.sol/LendingVault.json' },
    { name: 'ManteiaFactory', path: 'ManteiaFactory.sol/ManteiaFactory.json' },
    { name: 'Groth16Verifier', path: 'Verifier.sol/Groth16Verifier.json' }
];

async function main() {
    console.log(`Starting ABI Export to ${DEST_DIR}...`);

    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    for (const contract of CONTRACTS) {
        const artifactPath = path.join(ARTIFACTS_DIR, contract.path);

        if (!fs.existsSync(artifactPath)) {
            console.error(`❌ Artifact not found: ${artifactPath}`);
            continue;
        }

        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        const abi = artifact.abi;

        const fileContent = `export const ${contract.name}ABI = ${JSON.stringify(abi, null, 2)} as const;`;

        const destPath = path.join(DEST_DIR, `${contract.name}.ts`);
        fs.writeFileSync(destPath, fileContent);

        console.log(`✅ Exported ${contract.name} to ${destPath}`);
    }
}

main();
