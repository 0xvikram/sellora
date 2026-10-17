import { defineConfig, devices } from "@playwright/test";

// Smoke tests against the production server on port 3457 (`next start`).
// Run `npm run build` first; the config starts the server if one is not
// already running there, and reuses it if it is. Never `next dev`.
const PORT = 3457;

export default defineConfig({
  testDir: "./tests",
  timeout: 20_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
