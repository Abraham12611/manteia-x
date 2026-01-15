pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

/*
    RevenueCheck Circuit
    Proves that:
    1. The sum of 12 monthly revenue figures >= 'threshold'.
    2. The 'hashed_data_id' matches the hash of the inputs (integrity check).
*/
template RevenueCheck() {
    // ---------------------------------------------------------
    // 1. Private Inputs (The proprietary financial data)
    // ---------------------------------------------------------
    signal input monthlyRevenue[12]; // 12 Months of revenue
    signal input threshold;          // Minimum revenue required (e.g. 50000)
    signal input dataSalt;           // Random salt to prevent brute-forcing the hash

    // ---------------------------------------------------------
    // 2. Public Inputs (The on-chain anchor)
    // ---------------------------------------------------------
    signal input diffID;             // Public commitment to the data (A hash we verify against)
    
    // ---------------------------------------------------------
    // 3. Output
    // ---------------------------------------------------------
    signal output isQualified;       // 1 if sum >= threshold, 0 otherwise

    // Variable to hold the sum (Circom 2.0 supports var for logic generation)
    var sum = 0;
    for (var i = 0; i < 12; i++) {
        sum += monthlyRevenue[i];
    }

    // ---------------------------------------------------------
    // Logic A: Threshold Check
    // ---------------------------------------------------------
    // Convert Sum and Threshold to signals to work with Comparators
    component greaterThan = GreaterEqThan(64); // Assuming amounts fit in 64 bits
    greaterThan.in[0] <== sum;
    greaterThan.in[1] <== threshold;

    isQualified <== greaterThan.out;

    // ---------------------------------------------------------
    // Logic B: Data Integrity (Poseidon Hash)
    // ---------------------------------------------------------
    // We hash: [ ...monthlyRevenue, threshold, dataSalt ]
    // This ensures the user isn't using different data than what they claim to own.
    
    component hasher = Poseidon(14); // 12 months + 1 threshold + 1 salt
    
    for (var j = 0; j < 12; j++) {
        hasher.inputs[j] <== monthlyRevenue[j];
    }
    hasher.inputs[12] <== threshold;
    hasher.inputs[13] <== dataSalt;

    // Constraint: The calculated hash MUST match the public diffID
    diffID === hasher.out;
}

component main {public [diffID]} = RevenueCheck();
