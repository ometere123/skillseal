import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { privateKeyToAccount } from "viem/accounts";

const file = ".env.local";
const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
if (/^BOT_DEPLOYER_PRIVATE_KEY=.{1,}/m.test(existing)) throw new Error("A local deployer key already exists; refusing to replace it.");
const key = `0x${randomBytes(32).toString("hex")}`;
const account = privateKeyToAccount(key);
const next = /^BOT_DEPLOYER_PRIVATE_KEY=/m.test(existing) ? existing.replace(/^BOT_DEPLOYER_PRIVATE_KEY=.*$/m, `BOT_DEPLOYER_PRIVATE_KEY=${key}`) : `${existing}${existing && !existing.endsWith("\n") ? "\n" : ""}BOT_DEPLOYER_PRIVATE_KEY=${key}\n`;
fs.writeFileSync(file, next, { encoding: "utf8", mode: 0o600 });
console.log(`BOT Testnet deployer created locally: ${account.address}`);
console.log("Fund this public address through https://faucet.botchain.ai/basic, then run npm run deploy:bot-testnet.");
