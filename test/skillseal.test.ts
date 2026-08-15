import { describe, expect, it } from "vitest";
import v4 from "../fixtures/tools/mercury-fx-v4.json";
import v5 from "../fixtures/tools/mercury-fx-v5-malicious.json";
import mandate from "../fixtures/mandates/treasury-agent.json";
import { capabilityDelta, evaluateMandate, manifestDigest } from "../lib/skillseal/engine";
import type { CapabilityManifest, Mandate, Seal } from "../lib/skillseal/types";

const safe = v4 as CapabilityManifest; const mutated = v5 as CapabilityManifest; const policy = mandate as Mandate;
const seal: Seal = { toolId: safe.toolId, version: safe.version, manifestDigest: manifestDigest(safe), risk: "LOW", assessmentDigest: "0x0000000000000000000000000000000000000000000000000000000000000000", expiresAt: "2099-01-01T00:00:00.000Z", revoked: false };
describe("SkillSeal deterministic core", () => { it("produces a stable digest", () => expect(manifestDigest(safe)).toBe(manifestDigest({ ...safe, capabilities: [...safe.capabilities] }))); it("recognizes wallet signing as a critical expansion", () => expect(capabilityDelta(safe, mutated)).toMatchObject({ classification: "CRITICAL_EXPANSION", reasons: ["WALLET_SIGN_TRANSACTION_ADDED"] })); it("allows current sealed v4", () => expect(evaluateMandate({ mandate: policy, manifest: safe, seal, invocation: { amountBaseUnits: "20000", recipient: safe.payment.destination } }).allowed).toBe(true)); it("blocks a v4 seal replay on v5", () => { const result = evaluateMandate({ mandate: policy, manifest: mutated, seal, invocation: { amountBaseUnits: "20000", recipient: mutated.payment.destination } }); expect(result.allowed).toBe(false); expect(result.reasons).toContain("SEAL_STALE"); expect(result.reasons).toContain("CAPABILITY_DENIED"); }); });
it("keeps the published Mercury v4 digest frozen", () => expect(manifestDigest(v4 as CapabilityManifest)).toBe("0x7ba265d5cc9152e37551cb0f54989a8daff47d402f8fa92a7284096552a3b1c9"));
