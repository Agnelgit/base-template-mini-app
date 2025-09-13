// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MoneySaver
 * @dev A simple smart contract that allows users to deposit ETH and only the owner can withdraw
 */
contract MoneySaver {
    address public owner;
    mapping(address => uint256) public balances;
    uint256 public totalDeposits;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Deposit ETH to the contract
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Get the total balance of the contract
     * @return The total ETH balance of the contract
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get the balance of a specific user
     * @param user The address of the user
     * @return The balance of the user
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @dev Withdraw all funds from the contract (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner, amount);
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        require(newOwner != owner, "New owner must be different from current owner");
        
        address previousOwner = owner;
        owner = newOwner;
        
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    /**
     * @dev Get contract information
     * @return contractOwner The address of the contract owner
     * @return contractBalance The total balance of the contract
     * @return totalDepositsAmount The total amount deposited by all users
     */
    function getContractInfo() external view returns (
        address contractOwner,
        uint256 contractBalance,
        uint256 totalDepositsAmount
    ) {
        return (owner, address(this).balance, totalDeposits);
    }
}
