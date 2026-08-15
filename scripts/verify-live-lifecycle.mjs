import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["examples/reference-agent/live.mjs"], { encoding: "utf8" });
if (result.status !== 0) { process.stderr.write(result.stderr || "Live verification failed.\n"); process.exit(result.status || 1); }
process.stdout.write(result.stdout);
