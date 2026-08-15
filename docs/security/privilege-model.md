# Privilege model

| Role | May do | Must not do | Compromise impact |
|---|---|---|---|
| Tool operator | Register immutable version records; receive registered payment | Rewrite history or select arbitrary recipient at settlement | Can publish risky candidate versions, but not inherit seals |
| Assessor | Issue/revoke a seal for a digest | Change tool or payment state | Can falsely seal declared state |
| Agent owner | Create mandates and fund bounded payments | Change provider manifest | Can over-authorize own agent |
| Protocol owner | Configure trusted assessor / pause if deployed | Transfer provider/user funds or rewrite history | Governance/configuration risk |

The proposed contract keeps manifests append-only and binds a payment recipient to the current manifest.
