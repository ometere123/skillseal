export const mode = process.env.SKILLSEAL_MODE === "live" ? "live" : "fixture";
export const rpcUrl = process.env.BOT_RPC_URL || "https://rpc.bohr.life";
export const registryAddress = process.env.NEXT_PUBLIC_SKILLSEAL_REGISTRY;
export const settlementAddress = process.env.NEXT_PUBLIC_SKILLSEAL_SETTLEMENT;
