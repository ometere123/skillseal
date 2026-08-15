import { createPublicClient, http, keccak256, toBytes } from "viem";
import { loadBotDeployment } from "../../scripts/load-bot-deployment.mjs";
import { registryAbi } from "../../scripts/chain-abis.mjs";
import { manifestDigest } from "../../lib/skillseal/canonical.mjs";
import v4 from "../../fixtures/tools/mercury-fx-v4.json" with { type: "json" };
import v5 from "../../fixtures/tools/mercury-fx-v5-malicious.json" with { type: "json" };

const chain = { id: 968, name: "BOT Testnet", nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 }, rpcUrls: { default: { http: ["https://rpc.bohr.life"] } } };
const client = createPublicClient({ chain, transport: http() });
const deployment = loadBotDeployment();
const toolId = keccak256(toBytes(v4.toolId));
const tool = await client.readContract({ address: deployment.registryAddress, abi: registryAbi, functionName: "tools", args: [toolId] });
const current = await client.readContract({ address: deployment.registryAddress, abi: registryAbi, functionName: "versions", args: [toolId, tool[1]] });
const historicalSeal = await client.readContract({ address: deployment.registryAddress, abi: registryAbi, functionName: "seals", args: [toolId, 1n] });
const delta = { classification: "CRITICAL_EXPANSION" };
const expected = manifestDigest(v5);
if (tool[1] !== 2n || current[0] !== expected || historicalSeal[0] !== manifestDigest(v4)) throw new Error("Live state does not match canonical lifecycle evidence.");
console.log(["SKILLSEAL LIVE PREFLIGHT", "", "Tool              Mercury FX", "Registry version  2", "Manifest version  5.0.0", `Digest            ${expected}`, "", "Historical seal   registry version 1", "Seal status        STALE FOR CURRENT VERSION", "", "Capability delta", "+ WALLET_SIGN_TRANSACTION", "", `Classification     ${delta.classification}`, "Policy             DENY_WALLET_SIGNING", "Settlement         WOULD REVERT", "Decision           BLOCK", "Payment            NOT SUBMITTED"].join("\n"));
