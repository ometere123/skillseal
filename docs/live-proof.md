# Live proof

No live deployment has been made. This file deliberately contains no contract addresses, transaction hashes, blocks, or explorer links.

Verified locally:

- deterministic v4 canonical digest;
- v4 mandate evaluation allows a 20,000-base-unit invocation;
- v4.1 registers as a changed artifact with no capability expansion;
- v5 adds `WALLET_SIGN_TRANSACTION`, returns `CRITICAL_EXPANSION`, makes the v4 seal stale, and blocks the mandate evaluation;
- the fixture payment state remains zero for v5.

Before a live claim, independently verify the BOT Testnet RPC, deployed bytecode, ERC-20 address/symbol/decimals, emitted events, and each explorer transaction.
