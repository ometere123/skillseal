import { defineConfig } from "@playwright/test";

export default defineConfig({ testDir: "./e2e", testMatch: "**/*.spec.ts", use: { baseURL: "http://127.0.0.1:3012" }, webServer: { command: "npm run dev -- --port 3012", url: "http://127.0.0.1:3012", reuseExistingServer: true } });
