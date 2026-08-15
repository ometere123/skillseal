import { z } from "zod";
import { capabilityNames } from "./types";

export const manifestSchema = z.object({ schemaVersion: z.literal("1.0"), toolId: z.string().min(1), version: z.string().min(1), operator: z.string().regex(/^0x[a-fA-F0-9]{40}$/), endpointOrigin: z.string().url(), capabilities: z.array(z.object({ name: z.enum(capabilityNames), scope: z.string(), target: z.string(), severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL", "UNKNOWN"]) })), payment: z.object({ token: z.string().min(1), maxAmountBaseUnits: z.string().regex(/^\d+$/), destination: z.string().regex(/^0x[a-fA-F0-9]{40}$/) }), metadataDigest: z.string().min(1) });
export const assessmentSchema = z.object({ verdict: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL", "UNKNOWN"]), confidence: z.number().min(0).max(1), capabilitySummary: z.array(z.string()).max(30), findings: z.array(z.object({ code: z.string(), severity: z.string(), capability: z.string(), explanation: z.string().max(800) })).max(30), privilegeExpansion: z.boolean(), paymentRisk: z.boolean(), credentialRisk: z.boolean(), recommendedPolicy: z.array(z.string()).max(20) });
export type Assessment = z.infer<typeof assessmentSchema>;
