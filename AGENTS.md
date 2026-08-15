# SkillSeal engineering guide

Use npm only. Run `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before handoff.

The production app is Next.js App Router. Core deterministic security logic lives in `lib/skillseal`; keep it independent of React and AI. Fixture mode is explicitly local and must never present fictitious transactions or explorer links. Live BOT data must originate from contracts/RPC.

Security invariants: only a registered operator can publish a new version; seals are digest/version bound; settlement rechecks current state; recipients are manifest-bound; amounts/epochs/nonces are contract-enforced; AI never authorizes payment.

Do not read, log, or commit `.env.local`. Do not fabricate addresses, chain receipts, deployments, assessments, or payment results.
