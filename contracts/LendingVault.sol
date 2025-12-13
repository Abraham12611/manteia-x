// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public usdc;
    address public factory;

    uint256 public totalDeposits;
    mapping(address => uint256) public userDeposits;

    event Deposited(address indexed user, uint256 amount);
    event LoanFunded(address indexed borrower, uint256 amount);
    event RepaymentReceived(address indexed borrower, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    function setFactory(address _factory) external onlyOwner {
        factory = _factory;
    }

    // LPs deposit USDC to earn yield
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        
        userDeposits[msg.sender] += amount;
        totalDeposits += amount;

        emit Deposited(msg.sender, amount);
    }

    // LPs withdraw USDC
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(userDeposits[msg.sender] >= amount, "Insufficient deposit balance");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient vault liquidity");

        userDeposits[msg.sender] -= amount;
        totalDeposits -= amount;

        usdc.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    // Called by ManteiaFactory when a ZK proof is verified
    function fundLoan(address borrower, uint256 amount) external {
        require(msg.sender == factory, "Only Factory can fund loans");
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient liquidity");

        usdc.safeTransfer(borrower, amount);
        emit LoanFunded(borrower, amount);
    }

    // Repayments enter the vault to be distributed (Simplified for MVP)
    function repay() external {
        // Logic would likely be handled by a split payment, but here we just accept funds
        // In a real version, we'd update share prices here.
    }
}
