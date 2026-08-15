import { capabilityDelta, evaluateMandate, manifestDigest } from '../lib/core.mjs';

export class SkillSealClient {
  verify({ mandate, manifest, seal, invocation, spentTodayBaseUnits = 0n }) { return evaluateMandate({ mandate, manifest, seal, invocation, spentTodayBaseUnits }); }
  compareVersions(previousManifest, candidateManifest) { return capabilityDelta(previousManifest, candidateManifest); }
  manifestDigest(manifest) { return manifestDigest(manifest); }
}
