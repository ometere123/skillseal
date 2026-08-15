import fs from "node:fs";
import path from "node:path";
import solc from "solc";

const root = process.cwd();
const sources = Object.fromEntries(fs.readdirSync(path.join(root, "contracts/src")).filter((name) => name.endsWith(".sol")).map((name) => [`contracts/src/${name}`, { content: fs.readFileSync(path.join(root, "contracts/src", name), "utf8") }]));
const result = JSON.parse(solc.compile(JSON.stringify({ language: "Solidity", sources, settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } } }), { import: (name) => { const file = path.join(root, "node_modules", name); return fs.existsSync(file) ? { contents: fs.readFileSync(file, "utf8") } : { error: `Missing import ${name}` }; } }));
const errors = (result.errors ?? []).filter((item) => item.severity === "error"); if (errors.length) throw new Error(errors.map((item) => item.formattedMessage).join("\n"));
console.log(`Compiled ${Object.values(result.contracts).flatMap((contracts) => Object.keys(contracts)).length} contracts`);
