# PRD compliance

This matrix is maintained against the canonical product requirements supplied in `SkillSeal_PRD.md` (to be committed as `PRD.md`).

| Requirement ID | Requirement | Initial status | Evidence | Gap | Action | Final status |
| --- | --- | --- | --- | --- | --- | --- |
| P0-Protocol | Version-bound registry, seals, mandates, ERC-20 settlement | LIVE-PROVEN | `contracts/src`, Foundry suite, BOT evidence | None | Maintain regression coverage | LIVE-PROVEN |
| P0-Live proof | V4 settlement then V5 fails closed | IMPLEMENTED | `evidence/bot-testnet.json`, `npm run verify:live` | Stale simulation must be made explicit | Extend read-only verifier | IMPLEMENTED |
| P0-Domain | Separate registry and manifest versions | MISSING | Current types use `version` | Ambiguous domain model | Refactor adapters/types | MISSING |
| P0-Canonicalization | One normalization/digest implementation | IMPLEMENTED | `lib/skillseal/canonical.mjs` | Legacy scripts require retirement | Remove duplicate writers | IMPLEMENTED |
| P1-Agent | Fixture and chain-backed agent | IMPLEMENTED | `agent:v4`, `agent:v5`, `agent:live` | Live output needs full settlement reads | Extend live verifier | IMPLEMENTED |
| P1-SDK | One extractable SDK | MISSING | `sdk/index.mjs` is obsolete | Multiple entrypoints | Consolidate SDK | MISSING |
| P1-Live app | Read-only live UI, Activity and Verify | MISSING | Placeholder routes exist | No shared data layer | Implement live services/routes | MISSING |
| P1-Documentation | PRD, evidence, architecture, security, demo, submission | STALE | Partial docs | Live evidence and product docs incomplete | Rewrite from verified evidence | STALE |
| P1-Production | Hosted, tested frontend | EXTERNAL-BLOCKED | No Vercel authenticated session identified | Hosting access unknown | Deploy after app completion | EXTERNAL-BLOCKED |
