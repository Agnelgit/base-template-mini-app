"use client";

import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from "./Button";

const TARGET_ADDRESS = "0x9A45b64D0B57F8a5C23a277e94779baEcf0330ef";

export function MetaMaskConnector() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  // Find MetaMask connector
  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  const handleConnectMetaMask = async () => {
    if (!metaMaskConnector) {
      setConnectionStatus("MetaMask not available");
      return;
    }

    setIsConnecting(true);
    setConnectionStatus("Connecting to MetaMask...");

    try {
      await connect({ connector: metaMaskConnector });
      setConnectionStatus("Connected successfully!");
    } catch (error) {
      console.error("Failed to connect MetaMask:", error);
      setConnectionStatus("Failed to connect MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setConnectionStatus("");
  };

  useEffect(() => {
    if (isConnected && address) {
      if (address.toLowerCase() === TARGET_ADDRESS.toLowerCase()) {
        setConnectionStatus(`✅ Connected with target address: ${address.slice(0, 6)}...${address.slice(-4)}`);
      } else {
        setConnectionStatus(`⚠️ Connected with different address: ${address.slice(0, 6)}...${address.slice(-4)}`);
      }
    } else {
      setConnectionStatus("");
    }
  }, [isConnected, address]);

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">MetaMask Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Target Address: {TARGET_ADDRESS.slice(0, 6)}...{TARGET_ADDRESS.slice(-4)}
        </p>
      </div>

      {address && (
        <div className="text-xs p-2 bg-muted rounded">
          <strong>Connected Address:</strong> {address}
        </div>
      )}

      {connectionStatus && (
        <div className={`text-sm p-2 rounded ${
          connectionStatus.includes("✅") 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : connectionStatus.includes("⚠️")
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        }`}>
          {connectionStatus}
        </div>
      )}

      {isConnected ? (
        <Button onClick={handleDisconnect} className="w-full" variant="outline">
          Disconnect MetaMask
        </Button>
      ) : (
        <Button 
          onClick={handleConnectMetaMask} 
          className="w-full"
          disabled={isConnecting || !metaMaskConnector}
        >
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      )}

      {!metaMaskConnector && (
        <p className="text-xs text-muted-foreground text-center">
          MetaMask extension not detected. Please install MetaMask to continue.
        </p>
      )}
    </div>
  );
}
