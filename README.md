# SkillSeal

**Trust what your agents use.**

SkillSeal is BOT Chain trust infrastructure for autonomous agents. It binds external tools to versioned capability manifests, security seals and agent mandates so a tool cannot silently gain new privileges and continue receiving autonomous authority or payment.

## The demo

Mercury FX v4 declares `HTTP_READ` and receives a low-risk seal. Treasury Agent permits the bounded `0.02 USDT` invocation. When Mercury FX v5 adds `WALLET_SIGN_TRANSACTION`, its digest changes; the prior seal is stale, `DENY_WALLET_SIGNING` applies, and payment is not released.

The included UI is an explicit **local deterministic fixture**, not a live deployment or token transfer.

## Run locally

The workspace uses the bundled Node runtime. With Node on your PATH:

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Open `http://localhost:3000`. Connect Wallet uses EIP-1193 and targets BOT Testnet `968`; no transaction is created by the fixture.

## Structure

- `lib/core.mjs` — canonicalization, SHA-256 digest, capability delta, mandate evaluation.
- `fixtures/` — reproducible Mercury FX scenarios and Treasury Agent mandate.
- `contracts/SkillSeal.sol` — review-required EVM reference contract, not deployed.
- `sdk/` — minimal deterministic verification client.
- `docs/` — architecture, BOT research, and security models.

## Security boundary

SkillSeal verifies declared state. Hashing does not prove benign behavior; an assessment does not guarantee safety. AI may assist an assessment, but deterministic policy and settlement must decide authority/payment.

## BOT Chain

BOT Chain’s official developer guide documents EVM compatibility, testnet chain ID 968, BO Wallet and MetaMask support. See [BOT grounding](docs/research/bot-chain-grounding.md). No contract address, USDT address, payment transaction, paymaster sponsor, or production URL is claimed.
