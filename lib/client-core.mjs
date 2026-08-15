export const RISK = Object.freeze({ LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4, UNKNOWN: 5 });
const critical = new Set(['WALLET_SIGN_TRANSACTION', 'WALLET_SEND_TRANSACTION', 'TOKEN_TRANSFER', 'SECRET_EXPORT', 'SHELL_EXECUTION', 'ARBITRARY_CODE_EXECUTION']);
const identity = (cap) => `${cap.name}|${cap.scope || '*'}|${cap.target || '*'}`;
export function capabilityDelta(previous, candidate) {
  const before = new Map(previous.capabilities.map((cap) => [identity(cap), cap])); const after = new Map(candidate.capabilities.map((cap) => [identity(cap), cap]));
  const added = [...after.entries()].filter(([key]) => !before.has(key)).map(([, cap]) => cap); const removed = [...before.entries()].filter(([key]) => !after.has(key)).map(([, cap]) => cap);
  const domainsAdded = [...new Set(candidate.capabilities.filter((cap) => cap.target && cap.target !== '*').map((cap) => cap.target))].filter((domain) => !new Set(previous.capabilities.filter((cap) => cap.target && cap.target !== '*').map((cap) => cap.target)).has(domain));
  const priceIncreased = BigInt(candidate.payment.maxAmountBaseUnits) > BigInt(previous.payment.maxAmountBaseUnits); const destinationChanged = candidate.payment.destination.toLowerCase() !== previous.payment.destination.toLowerCase();
  const criticalAdded = added.filter((cap) => critical.has(cap.name)); const reasons = [...criticalAdded.map((cap) => `${cap.name}_ADDED`), ...(priceIncreased ? ['PAYMENT_LIMIT_INCREASED'] : []), ...(destinationChanged ? ['PAYMENT_DESTINATION_CHANGED'] : []), ...(domainsAdded.length ? ['DOMAIN_SCOPE_EXPANDED'] : [])];
  const material = added.length || removed.length || priceIncreased || destinationChanged || domainsAdded.length;
  return { classification: reasons.length ? (criticalAdded.length || destinationChanged ? 'CRITICAL_EXPANSION' : 'EXPANDED') : material ? (removed.length ? 'REDUCED' : 'EQUIVALENT') : 'NONE', added, removed, domainsAdded, priceIncreased, destinationChanged, reasons };
}
export function evaluateMandate({ mandate, manifest, seal, invocation, currentDigest }) {
  const reasons = []; if (!seal) reasons.push('SEAL_MISSING'); else { if (seal.manifestDigest !== currentDigest) reasons.push('SEAL_STALE', 'MANIFEST_CHANGED'); if (Date.parse(seal.expiresAt) <= Date.now()) reasons.push('ASSESSMENT_EXPIRED'); if (RISK[seal.risk] > RISK[mandate.maxRisk]) reasons.push('RISK_TOO_HIGH'); }
  const names = manifest.capabilities.map((cap) => cap.name); if (names.some((name) => mandate.deniedCapabilities.includes(name)) || (mandate.allowedCapabilities.length && names.some((name) => !mandate.allowedCapabilities.includes(name)))) reasons.push('CAPABILITY_DENIED');
  if (mandate.allowedDomains.length && manifest.capabilities.some((cap) => cap.target && cap.target !== '*' && !mandate.allowedDomains.includes(cap.target))) reasons.push('DOMAIN_NOT_ALLOWED');
  const amount = BigInt(invocation.amountBaseUnits); if (amount > BigInt(mandate.maxPerInvocationBaseUnits) || amount > BigInt(manifest.payment.maxAmountBaseUnits)) reasons.push('PRICE_TOO_HIGH'); if (manifest.payment.destination.toLowerCase() !== invocation.recipient.toLowerCase()) reasons.push('PAYMENT_DESTINATION_CHANGED');
  return { allowed: reasons.length === 0, reasons: [...new Set(reasons)] };
}
