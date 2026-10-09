import { defineConfig, devices } from "@playwright/test";
import { API_URL, APP_URL, FRONTEND_DIR } from "./support/env.js";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  // The tests share one seeded database and the flows depend on each other.
  workers: 1,
  fullyParallel: false,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60_000,
  expect: { timeout: 10_000 },

  globalSetup: "./support/global-setup.js",

  // Production build, so the CSP is the one users get (no 'unsafe-eval').
  // Runs before globalSetup; the frontend does not need the API to start.
  webServer: {
    command: "pnpm build && pnpm start",
    cwd: FRONTEND_DIR,
    url: APP_URL,
    timeout: 300_000,
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_API_BASE_URL: API_URL, NEXT_TELEMETRY_DISABLED: "1" },
  },

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["./reporters/pdf-reporter.js", { outputDir: "reports" }],
  ],

  // Full evidence for every test: final screenshot, video and trace.
  use: {
    baseURL: APP_URL,
    screenshot: "on",
    video: "on",
    trace: "on",
    locale: "es-PE",
    timezoneId: "America/Lima",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
