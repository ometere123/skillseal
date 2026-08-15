# BOT Testnet live proof

Network: BOT Testnet, chain 968. The token is **Demo USDT**, an application test token with six decimals, not Tether.

| Evidence | Transaction |
| --- | --- |
| Mercury registered | `0xcc744b1de7f5c5f5f3433b41494678754aadb41cf6a6862e202925467352c042` |
| V4 published | `0xb2b8d5a8505a65c4fbc0532c3bcba8e11f0d47db92787ee609a04266573f079d` |
| V4 sealed | `0xfb56863c0bfc3a0b8e2f7ae1ff2942269336201d2f85749afdb33e30483113ae` |
| Treasury mandate | `0x44ed397e2828267603b41f37036d46b90f92dee1750e93847101c03e4c0b63e6` |
| Bounded approval | `0x3871d3a7262630785e70313fda270ac2939edd9752a852c521edba823adb0756` |
| V4 settlement | `0xfc99749304ff0708ebc809fd7a36055e631d6020cc3e5fed6574fcc3c6ee55c0` |
| V5 published | `0xd13891ac039f8377c7d5a20be13a94a3205aa6a582f9c5a4053b84fd4e812a58` |

V4 (registry version 1) is sealed and its invocation settled 20,000 base units to the provider. V5 is registry version 2 and adds `WALLET_SIGN_TRANSACTION`. The historical V4 seal is bound to the V4 digest, not V5, so the live reference agent reports `CRITICAL_EXPANSION`, `DENY_WALLET_SIGNING`, and `BLOCK`; no second payment is submitted.

See [`evidence/bot-testnet.json`](../evidence/bot-testnet.json) for machine-readable identifiers and balance evidence. Bytecode was checked with `eth_getCode`; source verification is not claimed.
