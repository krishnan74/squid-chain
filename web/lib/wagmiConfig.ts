import { mainnet, sepolia, baseSepolia, hardhat } from "viem/chains";
import { http } from "wagmi";
import { injected, metaMask, safe } from "wagmi/connectors";
import { createConfig } from "@privy-io/wagmi";
import { chainConfig } from "viem/op-stack";
import { defineChain } from "viem";

const squidChain = defineChain({
  id: 1313161589, // Aurora Virtual Chain ID
  name: "Squid Chain",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc-0x4e454175.aurora-cloud.dev/"] },
  },
  blockExplorers: {
    default: {
      name: "Squid Explorer",
      url: "https://explorer.0x4e454175.aurora-cloud.dev/",
    },
  },
});

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat, baseSepolia, squidChain],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [baseSepolia.id]: http(),
    [squidChain.id]: http(),
  },
});
