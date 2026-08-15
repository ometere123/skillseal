# SkillSeal engineering guide

Use npm only. Run `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before handoff.

The production app is Next.js App Router. Core deterministic security logic lives in `lib/skillseal`; keep it independent of React and AI. Fixture mode is explicitly local and must never present fictitious transactions or explorer links. Live BOT data must originate from contracts/RPC.

Security invariants: only a registered operator can publish a new version; seals are digest/version bound; settlement rechecks current state; recipients are manifest-bound; amounts/epochs/nonces are contract-enforced; AI never authorizes payment.

Do not read, log, or commit `.env.local`. Do not fabricate addresses, chain receipts, deployments, assessments, or payment results.

## Delivery posture

Continue until the requested work is done properly. Treat every run as a success-oriented learning step: investigate failures, consult the best authoritative information before proceeding, fix root causes, and move forward with confidence that the result will succeed. Do not plan for failure. Do not limit work to what is already present in the repository; implement what the request actually requires.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
