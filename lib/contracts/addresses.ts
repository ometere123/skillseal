import { getAddress, zeroAddress } from "viem";

export const skillSealAddresses = { registry: getAddress(process.env.NEXT_PUBLIC_SKILLSEAL_REGISTRY || "0x932d254582b4f0b6822e8719f5af08717d872674"), settlement: getAddress(process.env.NEXT_PUBLIC_SKILLSEAL_SETTLEMENT || "0x23d9c5de359378c783378f71fe3f2f2f4fbc4074"), demoUsdt: getAddress(process.env.NEXT_PUBLIC_PAYMENT_TOKEN || "0x9d0232f0cda5708c33fe03fb05759cbee337d655") } as const;
export const liveContractsConfigured = Object.values(skillSealAddresses).every((address) => address !== zeroAddress);
