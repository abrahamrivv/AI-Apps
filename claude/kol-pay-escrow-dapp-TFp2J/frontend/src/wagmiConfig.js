import { createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { injected, walletConnect } from "@wagmi/connectors";
import { QueryClient } from "@tanstack/react-query";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] }
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" }
  },
  testnet: true
});

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo";

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId })
  ],
  transports: {
    [monadTestnet.id]: http()
  }
});

export const queryClient = new QueryClient();
