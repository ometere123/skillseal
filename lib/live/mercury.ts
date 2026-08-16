import { createPublicClient, http, keccak256, toBytes } from "viem";
import { erc20Abi, registryAbi, settlementAbi } from "@/lib/contracts/abis";
import { skillSealAddresses } from "@/lib/contracts/addresses";

const chain = { id: 968, name: "BOT Testnet", nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 }, rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_BOT_RPC_URL || "https://rpc.bohr.life"] } } } as const;
export const mercuryToolId = keccak256(toBytes("mercury-fx"));
export const mercuryReceiptId = keccak256(toBytes("mercury-v4-receipt"));
export const mercuryProvider = "0x48c835fdEA358F24b0673f0b57708A2fB2d5930a" as const;
export async function getLiveMercury() { const client = createPublicClient({ chain, transport: http() }); const [tool, current, historical, seal, receipt, providerBalance] = await Promise.all([client.readContract({ address: skillSealAddresses.registry, abi: registryAbi, functionName: "tools", args: [mercuryToolId] }), client.readContract({ address: skillSealAddresses.registry, abi: registryAbi, functionName: "versions", args: [mercuryToolId, 2n] }), client.readContract({ address: skillSealAddresses.registry, abi: registryAbi, functionName: "versions", args: [mercuryToolId, 1n] }), client.readContract({ address: skillSealAddresses.registry, abi: registryAbi, functionName: "seals", args: [mercuryToolId, 1n] }), client.readContract({ address: skillSealAddresses.settlement, abi: settlementAbi, functionName: "usedReceipts", args: [mercuryReceiptId] }), client.readContract({ address: skillSealAddresses.demoUsdt, abi: erc20Abi, functionName: "balanceOf", args: [mercuryProvider] })]); return { tool, current, historical, seal, receipt, providerBalance }; }
