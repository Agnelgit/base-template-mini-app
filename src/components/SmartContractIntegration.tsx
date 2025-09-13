"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "./ui/Button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// Money Saver Contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractInfo",
    "outputs": [
      {"internalType": "address", "name": "contractOwner", "type": "address"},
      {"internalType": "uint256", "name": "contractBalance", "type": "uint256"},
      {"internalType": "uint256", "name": "totalDepositsAmount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdrawal",
    "type": "event"
  }
] as const;

// Contract address - Update this with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x742d35Cc6634C0532925a3b8D0C5C4E4e4B8C4E4" as const;

interface SmartContractIntegrationProps {
  isVisible?: boolean;
}

export default function SmartContractIntegration({ isVisible = true }: SmartContractIntegrationProps) {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Read contract balance
  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getBalance",
    query: {
      enabled: isConnected && isVisible,
    },
  });

  // Read contract owner
  const { data: contractOwner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "owner",
    query: {
      enabled: isConnected && isVisible,
    },
  });

  // Write contract for deposit
  const { writeContract: writeDeposit, data: depositHash } = useWriteContract();
  
  // Write contract for withdraw
  const { writeContract: writeWithdraw, data: withdrawHash } = useWriteContract();

  // Wait for deposit transaction
  const { isLoading: isDepositLoading, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Wait for withdraw transaction
  const { isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const handleDeposit = async () => {
    if (!depositAmount || !isConnected) return;
    
    setIsProcessing(true);
    try {
      const amount = parseFloat(depositAmount);
      if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      // Convert to wei (assuming 18 decimals)
      const amountInWei = BigInt(Math.floor(amount * 1e18));
      
      await writeDeposit({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "deposit",
        value: amountInWei,
      });
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) return;
    
    setIsProcessing(true);
    try {
      await writeWithdraw({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "withdraw",
      });
    } catch (error) {
      console.error("Withdraw failed:", error);
      alert("Withdraw failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Refetch balance when transactions complete
  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess) {
      refetchBalance();
    }
  }, [isDepositSuccess, isWithdrawSuccess, refetchBalance]);

  if (!isVisible || !isConnected) {
    return null;
  }

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return (Number(balance) / 1e18).toFixed(4);
  };

  const isOwner = contractOwner && address && 
    contractOwner.toLowerCase() === address.toLowerCase();

  return (
    <div className="bg-card p-4 rounded-lg border border-border mb-4">
      <h3 className="text-lg font-semibold mb-3 text-foreground">
        🏦 Smart Contract Integration
      </h3>
      
      <div className="space-y-4">
        {/* Contract Info */}
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Balance:</span>
              <span className="font-medium">{formatBalance(contractBalance)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Address:</span>
              <span className="font-mono text-xs">
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </span>
            </div>
            {isOwner && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Role:</span>
                <span className="text-green-600 font-medium">Owner</span>
              </div>
            )}
          </div>
        </div>

        {/* Deposit Section */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Deposit Amount (ETH)</Label>
          <div className="flex gap-2">
            <Input
              id="deposit-amount"
              type="number"
              step="0.001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.001"
              className="flex-1"
            />
            <Button
              onClick={handleDeposit}
              disabled={!depositAmount || isProcessing || isDepositLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4"
            >
              {isDepositLoading ? "Depositing..." : "Deposit"}
            </Button>
          </div>
        </div>

        {/* Withdraw Section (Owner only) */}
        {isOwner && (
          <div className="space-y-2">
            <Label>Withdraw All Funds</Label>
            <Button
              onClick={handleWithdraw}
              disabled={!contractBalance || contractBalance === 0n || isProcessing || isWithdrawLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isWithdrawLoading ? "Withdrawing..." : "Withdraw All"}
            </Button>
          </div>
        )}

        {/* Transaction Status */}
        {(isDepositSuccess || isWithdrawSuccess) && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Transaction successful! Balance updated.
            </p>
          </div>
        )}

        {/* Demo Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-yellow-800 dark:text-yellow-200 text-xs">
            ⚠️ This is a demo contract. Make sure to deploy your own contract for production use.
          </p>
        </div>
      </div>
    </div>
  );
}
