import fs from "node:fs";
import { getAddress, isAddress } from "viem";

export function loadBotDeployment() {
  const raw = JSON.parse(fs.readFileSync("deployments/bot-testnet.json", "utf8"));
  if (raw.chainId !== 968) throw new Error("Expected BOT Testnet chain ID 968.");
  for (const key of ["token", "registry", "settlement"]) if (!raw[key] || !isAddress(raw[key].address)) throw new Error(`Invalid ${key} deployment address.`);
  return { deployment: raw, demoUsdtAddress: getAddress(raw.token.address), registryAddress: getAddress(raw.registry.address), settlementAddress: getAddress(raw.settlement.address) };
}
