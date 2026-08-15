import { createHash } from 'node:crypto';

export const CAPABILITIES = Object.freeze({
  HTTP_READ: 'HTTP_READ', HTTP_WRITE: 'HTTP_WRITE', FILESYSTEM_READ: 'FILESYSTEM_READ', FILESYSTEM_WRITE: 'FILESYSTEM_WRITE',
  SECRET_READ: 'SECRET_READ', SECRET_EXPORT: 'SECRET_EXPORT', WALLET_READ: 'WALLET_READ', WALLET_SIGN_MESSAGE: 'WALLET_SIGN_MESSAGE',
  WALLET_SIGN_TRANSACTION: 'WALLET_SIGN_TRANSACTION', WALLET_SEND_TRANSACTION: 'WALLET_SEND_TRANSACTION', TOKEN_TRANSFER: 'TOKEN_TRANSFER',
  ARBITRARY_CODE_EXECUTION: 'ARBITRARY_CODE_EXECUTION', SHELL_EXECUTION: 'SHELL_EXECUTION', DATABASE_READ: 'DATABASE_READ', DATABASE_WRITE: 'DATABASE_WRITE'
});
export const RISK = Object.freeze({ LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4, UNKNOWN: 5 });
const critical = new Set([CAPABILITIES.WALLET_SIGN_TRANSACTION, CAPABILITIES.WALLET_SEND_TRANSACTION, CAPABILITIES.TOKEN_TRANSFER, CAPABILITIES.SECRET_EXPORT, CAPABILITIES.SHELL_EXECUTION, CAPABILITIES.ARBITRARY_CODE_EXECUTION]);

export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).sort().join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export function manifestDigest(manifest) { return `0x${createHash('sha256').update(canonicalize(manifest)).digest('hex')}`; }
const identity = (cap) => `${cap.name}|${cap.scope || '*'}|${cap.target || '*'}`;
export function capabilityDelta(previous, candidate) {
  const before = new Map(previous.capabilities.map((cap) => [identity(cap), cap]));
  const after = new Map(candidate.capabilities.map((cap) => [identity(cap), cap]));
  const added = [...after.entries()].filter(([key]) => !before.has(key)).map(([, cap]) => cap);
  const removed = [...before.entries()].filter(([key]) => !after.has(key)).map(([, cap]) => cap);
  const previousDomains = new Set(previous.capabilities.filter((cap) => cap.target && cap.target !== '*').map((cap) => cap.target));
  const candidateDomains = new Set(candidate.capabilities.filter((cap) => cap.target && cap.target !== '*').map((cap) => cap.target));
  const domainsAdded = [...candidateDomains].filter((domain) => !previousDomains.has(domain));
  const priceIncreased = BigInt(candidate.payment.maxAmountBaseUnits) > BigInt(previous.payment.maxAmountBaseUnits);
  const destinationChanged = candidate.payment.destination.toLowerCase() !== previous.payment.destination.toLowerCase();
  const criticalAdded = added.filter((cap) => critical.has(cap.name));
  const reasons = [
    ...criticalAdded.map((cap) => `${cap.name}_ADDED`),
    ...(priceIncreased ? ['PAYMENT_LIMIT_INCREASED'] : []),
    ...(destinationChanged ? ['PAYMENT_DESTINATION_CHANGED'] : []),
    ...(domainsAdded.length ? ['DOMAIN_SCOPE_EXPANDED'] : [])
  ];
  const material = added.length || removed.length || priceIncreased || destinationChanged || domainsAdded.length;
  const classification = reasons.length ? (criticalAdded.length || destinationChanged ? 'CRITICAL_EXPANSION' : 'EXPANDED') : material ? (removed.length ? 'REDUCED' : 'EQUIVALENT') : 'NONE';
  return { classification, added, removed, domainsAdded, priceIncreased, destinationChanged, privilegeExpansion: reasons.length > 0, reasons };
}
export function evaluateMandate({ mandate, manifest, seal, invocation, spentTodayBaseUnits = 0n }) {
  const reasons = [];
  if (!seal) reasons.push('SEAL_MISSING');
  else {
    if (seal.manifestDigest !== manifestDigest(manifest)) reasons.push('SEAL_STALE', 'MANIFEST_CHANGED');
    if (Date.parse(seal.expiresAt) <= Date.now()) reasons.push('ASSESSMENT_EXPIRED');
    if (RISK[seal.risk] > RISK[mandate.maxRisk]) reasons.push('RISK_TOO_HIGH');
  }
  const denied = new Set(mandate.deniedCapabilities);
  const capabilityNames = manifest.capabilities.map((cap) => cap.name);
  if (capabilityNames.some((name) => denied.has(name))) reasons.push('CAPABILITY_DENIED');
  if (mandate.allowedCapabilities.length && capabilityNames.some((name) => !mandate.allowedCapabilities.includes(name))) reasons.push('CAPABILITY_DENIED');
  if (mandate.allowedDomains.length && manifest.capabilities.some((cap) => cap.target && cap.target !== '*' && !mandate.allowedDomains.includes(cap.target))) reasons.push('DOMAIN_NOT_ALLOWED');
  const amount = BigInt(invocation.amountBaseUnits);
  if (amount > BigInt(mandate.maxPerInvocationBaseUnits) || amount > BigInt(manifest.payment.maxAmountBaseUnits)) reasons.push('PRICE_TOO_HIGH');
  if (amount + spentTodayBaseUnits > BigInt(mandate.maxPerDayBaseUnits)) reasons.push('DAILY_LIMIT_EXCEEDED');
  if (manifest.payment.destination.toLowerCase() !== invocation.recipient.toLowerCase()) reasons.push('PAYMENT_DESTINATION_CHANGED');
  return { allowed: reasons.length === 0, reasons: [...new Set(reasons)], checkedDigest: manifestDigest(manifest) };
}
