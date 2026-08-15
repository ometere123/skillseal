# SkillSeal demo (3 minutes)

1. Open the local app. Point out the **DEMO FIXTURE** label and Mercury FX v4’s `HTTP_READ` capability.
2. Click **Run allowed invocation**, then **Invoke · release 0.02 USDT**. This produces a local receipt only after deterministic allow.
3. Click **Benign update**. The digest changes but the capability delta is `NONE`; reassessment is required, not an automatic malicious verdict.
4. Click **Simulate mutation**. v5 adds `WALLET_SIGN_TRANSACTION`; inspect `CRITICAL_EXPANSION` and `DENY_WALLET_SIGNING`.
5. Point out `SEAL_STALE`, `CAPABILITY_DENIED`, `Invocation blocked`, and `Payment not released`.

Close: **If the tool changes, trust expires. No valid seal, no autonomous payment.**
