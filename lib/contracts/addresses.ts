import { getAddress, zeroAddress } from "viem";

export const skillSealAddresses = { registry: getAddress(process.env.NEXT_PUBLIC_SKILLSEAL_REGISTRY || zeroAddress), settlement: getAddress(process.env.NEXT_PUBLIC_SKILLSEAL_SETTLEMENT || zeroAddress), demoUsdt: getAddress(process.env.NEXT_PUBLIC_PAYMENT_TOKEN || zeroAddress) } as const;
export const liveContractsConfigured = Object.values(skillSealAddresses).every((address) => address !== zeroAddress);
