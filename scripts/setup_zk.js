const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CIRCUITS_DIR = path.join(__dirname, '../circuits');
const PTAU_DIR = path.join(__dirname, '../circuits/ptau');
const BUILD_DIR = path.join(__dirname, '../circuits/build');

// 1. Define Powers of Tau file (Need a large one for real prod, 12-14 is fine for dev)
const PTAU_URL = "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_14.ptau";
const PTAU_FILE = path.join(PTAU_DIR, "powersOfTau28_hez_final_14.ptau");

function run(cmd) {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
}

async function main() {
    // Ensure dirs exist
    if (!fs.existsSync(PTAU_DIR)) fs.mkdirSync(PTAU_DIR, { recursive: true });
    if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true });

    // 2. Download Ptau
    if (!fs.existsSync(PTAU_FILE)) {
        console.log("Downloading Powers of Tau...");
        run(`curl -o "${PTAU_FILE}" "${PTAU_URL}"`);
    }

    // 3. Compile Circuit
    console.log("Compiling Circuit...");
    run(`circom "${path.join(CIRCUITS_DIR, 'revenue_check.circom')}" --r1cs --wasm --sym --output "${BUILD_DIR}"`);

    // 4. Setup (Groth16)
    const r1csFile = path.join(BUILD_DIR, "revenue_check.r1cs");
    const zkeyFile = path.join(BUILD_DIR, "revenue_check_0000.zkey");
    const finalZkey = path.join(BUILD_DIR, "revenue_check_final.zkey");

    // Phase 2 Setup
    console.log("Starting Groth16 Setup...");
    run(`npx snarkjs groth16 setup "${r1csFile}" "${PTAU_FILE}" "${zkeyFile}"`);

    // Contribute random entropy
    console.log("Contributing entropy...");
    run(`npx snarkjs zkey contribute "${zkeyFile}" "${finalZkey}" --name="1st Contributor" -v -e="randomEntropy123"`);

    // Export Verification Key
    console.log("Exporting Verification Key...");
    run(`npx snarkjs zkey export verificationkey "${finalZkey}" "${path.join(BUILD_DIR, "verification_key.json")}"`);

    // Export Solidity Verifier
    console.log("Exporting Solidity Verifier...");
    const verifierPath = path.join(__dirname, '../contracts/Verifier.sol');
    run(`npx snarkjs zkey export solidityverifier "${finalZkey}" "${verifierPath}"`);

    console.log("✅ ZK Setup Complete!");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
