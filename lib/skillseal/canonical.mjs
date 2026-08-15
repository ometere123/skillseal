import { getAddress, isAddress, keccak256, stringToHex } from "viem";
const stable = (value) => Array.isArray(value) ? `[${value.map(stable).join(",")}]` : value && typeof value === "object" ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}` : JSON.stringify(value);
const key = (capability) => `${capability.name}|${capability.scope}|${capability.target}`;
export const normalizeManifest = (manifest) => ({ ...manifest, operator: getAddress(manifest.operator).toLowerCase(), payment: { ...manifest.payment, destination: getAddress(manifest.payment.destination).toLowerCase() }, capabilities: [...manifest.capabilities].sort((a,b) => key(a).localeCompare(key(b))) });
export const canonicalizeManifest = (manifest) => stable(normalizeManifest(manifest));
export const manifestDigest = (manifest) => keccak256(stringToHex(canonicalizeManifest(manifest)));
