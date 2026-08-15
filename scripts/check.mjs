import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const mode = process.argv[2] || 'lint';
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  return entry.isDirectory() ? walk(path) : path.endsWith('.js') || path.endsWith('.mjs') ? [path] : [];
});
const files = [...walk('app'), ...walk('lib'), ...walk('scripts')];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status) throw new Error(`${file}: ${result.stderr}`);
  if (readFileSync(file, 'utf8').includes('console.log') && !file.includes('server.mjs') && !file.includes('check.mjs')) throw new Error(`No debug console.log in ${file}`);
}
if (mode === 'build') {
  for (const file of ['index.html', 'app/app.js', 'app/styles.css', 'fixtures/tools/mercury-fx-v4.json', 'fixtures/tools/mercury-fx-v5-malicious.json']) {
    if (!statSync(file).isFile()) throw new Error(`Missing build input: ${file}`);
  }
}
console.log(`${mode}: passed (${files.length} JavaScript modules checked)`);
