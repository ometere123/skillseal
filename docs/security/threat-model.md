# Threat model

| Attack | Consequence | Mitigation | Residual risk |
|---|---|---|---|
| Supply-chain mutation | New authority inherits trust | Digest/version-bound seal; stale-seal check | Manifest can still understate behavior |
| Wallet-signing insertion | Agent gains signing authority | Deny-list policy and critical delta | Unknown/unmodeled capability |
| Manifest substitution/replay | Old approval used for new state | Canonical digest binding and version checks | Hash algorithm implementation must be reviewed |
| Endpoint/domain expansion | Data exfiltration | Target/domain delta and allowlist | DNS/runtime behavior is off-chain |
| Payment destination mutation | Funds diverted | Destination bound to invocation | Operator can publish a new destination, requiring reassessment |
| Overpayment/replay | Excess/double payment | Integer caps and one-time nonce in settlement contract | Token implementation risk |
| Unauthorized seal | False authority | Assessor role gating | Assessor compromise |
| Stale frontend | UI displays invalid state | Contract/preflight revalidation, not UI authority | RPC freshness |
| Reentrancy / bond drain | Fund loss | CEI, reentrancy guard, per-provider balances | Contract bug |
| AI failure | Unsafe permissive fallback | Schema validation and fail-closed assessment requirement | False negatives in valid AI output |

The frontend is never a settlement authority. A live implementation must repeat critical checks on-chain.
