import { defineChain } from "viem";

export const botTestnet = defineChain({ id: 968, name: "BOT Testnet", nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 }, rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BOT_RPC_URL || "https://rpc.bohr.life"] } }, blockExplorers: { default: { name: "BOTScan", url: process.env.NEXT_PUBLIC_BOT_EXPLORER_URL || "https://scan.bohr.life" } }, testnet: true });
