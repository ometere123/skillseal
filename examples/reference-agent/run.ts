import v4 from "../../fixtures/tools/mercury-fx-v4.json";
import v5 from "../../fixtures/tools/mercury-fx-v5-malicious.json";
import mandate from "../../fixtures/mandates/treasury-agent.json";
import { verifyFixtureInvocation } from "./client";
import { mode, registryAddress, settlementAddress } from "./config";
import { createSkillSealClient } from "../../sdk/src";
import type { CapabilityManifest, Mandate } from "../../lib/skillseal/types";
const current = process.argv.includes("--v5") ? v5 : v4; const result = verifyFixtureInvocation(v4 as CapabilityManifest, current as CapabilityManifest, mandate as Mandate);
async function run() { if (mode === "live") { if (!registryAddress || !settlementAddress) throw new Error("LIVE mode requires deployed registry and settlement addresses."); const chain = createSkillSealClient(registryAddress as `0x${string}`, settlementAddress as `0x${string}`); const tool = await chain.getTool((v4 as CapabilityManifest).toolId as `0x${string}`); const version = await chain.getCurrentVersion((v4 as CapabilityManifest).toolId as `0x${string}`); const seal = await chain.getSeal((v4 as CapabilityManifest).toolId as `0x${string}`, version); console.log(JSON.stringify({ mode, tool, version: version.toString(), seal, preflight: result.decision.allowed ? "ALLOW — simulate before signing" : "BLOCK — no payment transaction submitted" }, (_, value) => typeof value === "bigint" ? value.toString() : value, 2)); return; } console.log(JSON.stringify({ mode, version: current.version, delta: result.delta.classification, reasons: result.decision.reasons, action: result.decision.allowed ? "ALLOW — settlement may be simulated/submitted in live mode" : "BLOCK — no payment transaction submitted" }, null, 2)); }
run().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Reference agent failed"); process.exitCode = 1; });
