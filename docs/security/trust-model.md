# Trust model

SkillSeal verifies a tool **against declared state**. It does not prove external software behavior or guarantee safety.

- A manifest publisher truthfully declares normalized capabilities and endpoint scope.
- The operator wallet identifies who published a version, not who controls every dependency.
- An assessor can classify declared state; the assessment is fallible and must bind to the digest/version.
- RPC, wallet, token contract and frontend must be trusted for their respective interactions.
- The agent owner is responsible for selecting a mandate.
- A bond is economic collateral, not proof of honesty.

Integrity answers whether the canonical declared artifact changed. Semantic assessment explains declared capability risk. The mandate is deterministic policy. Settlement must revalidate the sealed state before funds move.
