import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capabilityDelta, canonicalize, evaluateMandate, manifestDigest } from '../lib/core.mjs';

const fixture = (path) => JSON.parse(readFileSync(new URL(`../fixtures/${path}`, import.meta.url)));
const v4 = fixture('tools/mercury-fx-v4.json'); const v41 = fixture('tools/mercury-fx-v4.1.json'); const v5 = fixture('tools/mercury-fx-v5-malicious.json'); const mandate = fixture('mandates/treasury-agent.json');
test('canonical serialization is independent of field order', () => assert.equal(canonicalize({ b: [2, 1], a: 'x' }), canonicalize({ a: 'x', b: [1, 2] })));
test('equivalent manifest digest is reproducible and capability mutation changes it', () => { assert.equal(manifestDigest(v4), manifestDigest(JSON.parse(JSON.stringify(v4)))); assert.notEqual(manifestDigest(v4), manifestDigest(v5)); });
test('benign revision is recognized as no capability expansion', () => { const delta = capabilityDelta(v4, v41); assert.equal(delta.classification, 'NONE'); });
test('wallet transaction signing is a critical deterministic expansion', () => { const delta = capabilityDelta(v4, v5); assert.equal(delta.classification, 'CRITICAL_EXPANSION'); assert.deepEqual(delta.reasons, ['WALLET_SIGN_TRANSACTION_ADDED']); });
test('current seal allows v4 bounded invocation', () => { const result = evaluateMandate({ mandate, manifest: v4, seal: { manifestDigest: manifestDigest(v4), expiresAt: '2099-01-01T00:00:00.000Z', risk: 'LOW' }, invocation: { amountBaseUnits: '20000', recipient: v4.payment.destination } }); assert.equal(result.allowed, true); });
test('v4 seal cannot authorize v5 and payment remains blocked', () => { const result = evaluateMandate({ mandate, manifest: v5, seal: { manifestDigest: manifestDigest(v4), expiresAt: '2099-01-01T00:00:00.000Z', risk: 'LOW' }, invocation: { amountBaseUnits: '20000', recipient: v5.payment.destination } }); assert.equal(result.allowed, false); assert.ok(result.reasons.includes('SEAL_STALE')); assert.ok(result.reasons.includes('CAPABILITY_DENIED')); });
