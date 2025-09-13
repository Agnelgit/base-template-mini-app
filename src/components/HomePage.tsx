"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const TARGET_ADDRESS = "0x9A45b64D0B57F8a5C23a277e94779baEcf0330ef";

interface HomePageProps {
  onLoginSuccess: () => void;
}

export default function HomePage({ onLoginSuccess }: HomePageProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Find MetaMask connector
  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  const handleConnectMetaMask = async () => {
    if (!metaMaskConnector) {
      setLoginError("MetaMask not available. Please install MetaMask extension.");
      return;
    }

    setIsConnecting(true);
    setLoginError("");

    try {
      await connect({ connector: metaMaskConnector });
      setIsWalletConnected(true);
    } catch (error) {
      console.error("Failed to connect MetaMask:", error);
      setLoginError("Failed to connect MetaMask. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    if (!isConnected || !address) {
      setLoginError("Please connect your MetaMask wallet first");
      return;
    }

    if (address.toLowerCase() !== TARGET_ADDRESS.toLowerCase()) {
      setLoginError("Wallet address does not match the required address");
      return;
    }

    // Simulate login validation
    if (email.includes("@") && password.length >= 6) {
      setLoginError("");
      onLoginSuccess();
    } else {
      setLoginError("Invalid email or password");
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setIsWalletConnected(true);
      if (address.toLowerCase() === TARGET_ADDRESS.toLowerCase()) {
        setLoginError("");
      } else {
        setLoginError("Connected wallet address does not match the required address");
      }
    } else {
      setIsWalletConnected(false);
    }
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            💰 Money Saver
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet and start saving today
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            Login to Continue
          </h2>

          {/* MetaMask Connection Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
              Step 1: Connect MetaMask Wallet
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Required Address: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                  {TARGET_ADDRESS.slice(0, 6)}...{TARGET_ADDRESS.slice(-4)}
                </code>
              </p>
              
              {address && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connected: <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </code>
                </p>
              )}
            </div>

            {isWalletConnected ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <span className="text-green-600 dark:text-green-400 text-lg mr-2">✅</span>
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    Wallet Connected
                  </span>
                </div>
                <Button 
                  onClick={() => disconnect()} 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnectMetaMask}
                disabled={isConnecting || !metaMaskConnector}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-4"
              >
                {isConnecting ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}

            {!metaMaskConnector && (
              <p className="text-xs text-red-600 dark:text-red-400 text-center">
                MetaMask extension not detected. Please install MetaMask to continue.
              </p>
            )}
          </div>

          {/* Login Form */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
              Step 2: Login Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{loginError}</p>
            </div>
          )}

          {/* Login Button */}
          <Button 
            onClick={handleLogin}
            disabled={!isWalletConnected || !email || !password}
            className="w-full bg-[#7C65C1] hover:bg-[#6952A3] text-white"
          >
            Login & Enter App
          </Button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Demo Credentials:
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Email: demo@moneysaver.com<br />
              Password: password123
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secure login powered by MetaMask
          </p>
        </div>
      </div>
    </div>
  );
}
