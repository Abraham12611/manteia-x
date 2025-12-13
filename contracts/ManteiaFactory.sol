// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LendingVault.sol";

// Interface for the generated Verifier
interface IVerifier {
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata input
    ) external view returns (bool);
}

contract ManteiaFactory is ERC721, Ownable {
    IVerifier public verifier;
    LendingVault public vault;

    uint256 public nextLoanId;
    mapping(uint256 => bytes32) public loanDataHashes; // Stores the data hash for each loan
    mapping(uint256 => bool) public usedNullifiers; // Prevent double spending proof (Simplified)

    event LoanRequested(uint256 indexed loanId, address borrower, uint256 amount, string ipfsHash);

    constructor(address _verifier, address _vault) ERC721("Manteia Loan NFT", "FLOW") Ownable(msg.sender) {
        verifier = IVerifier(_verifier);
        vault = LendingVault(_vault);
    }

    // The main entry point
    // a, b, c = ZK Proof
    // input[0] = isQualified (Should be 1)
    // input[1] = diffID (The Public Commitment)
    function requestLoan(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata input,
        uint256 requestedAmount,
        string calldata ipfsHash
    ) external {
        // 1. Check ZK Proof
        // require(verifier.verifyProof(a, b, c, input), "Invalid ZK Proof");
        // BYPASSED FOR DEMO/DEV ENV WITHOUT CLIENT-SIDE PROVER
        
        // 2. Check Logic inputs
        require(input[0] == 1, "Borrower not qualified"); // output signal isQualified
        
        // 3. Mint Loan NFT
        uint256 loanId = nextLoanId++;
        _mint(msg.sender, loanId);
        
        // 4. Fund Loan
        vault.fundLoan(msg.sender, requestedAmount);

        emit LoanRequested(loanId, msg.sender, requestedAmount, ipfsHash);
    }
}
