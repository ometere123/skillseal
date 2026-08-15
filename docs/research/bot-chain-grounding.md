# BOT Chain grounding

Researched 2026-08-15 from the [official BOT Chain quick guide](https://dev-docs.botchain.ai/docs/Developers/quick-guide/) and [EOA Paymaster documentation](https://dev-docs.botchain.ai/docs/Developers/eoa-paymaster/).

| Integration | Status | Evidence / decision |
|---|---|---|
| BOT Testnet | VERIFIED AND USED | EVM-compatible; chain ID `968`, RPC `https://rpc.bohr.life`, explorer `https://scan.bohr.life/`, native token BOT. Configured as the wallet target. |
| BOT Mainnet | VERIFIED BUT OPTIONAL | Chain ID `677`, RPC `https://rpc.botchain.ai`, explorer `https://scan.botchain.ai`. Not used without a deployment review. |
| BO Wallet / MetaMask | VERIFIED AND USED | Official guide lists both. UI uses EIP-1193 `eth_requestAccounts` and explicit testnet switch. |
| EOA Paymaster | VERIFIED BUT OPTIONAL | Official docs describe `pm_isSponsorable` and signed-tx submission to a paymaster. No sponsor endpoint or policy was verified for this project, so it is not enabled. |
| USDT/test-token | UNKNOWN | No official current token address, bytecode, symbol and decimals were independently verified. No token transfer is claimed. |
| x402 | RESEARCHED, NOT REQUIRED | No official BOT Chain x402 integration was verified. |
| ERC-8004 / agent identity | NOT PUBLICLY READY | No official BOT-specific integration was verified during this build. |
| B DEX | VERIFIED BUT OPTIONAL | The official guide links B DEX; it is not in the critical trust path. |

The local interface is labeled **DEMO FIXTURE**. It does not claim contract deployment, assessment issuance, token transfer, or paymaster sponsorship.
