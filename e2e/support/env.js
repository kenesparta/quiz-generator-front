// Shared settings for the config, the global setup, the tests and the PDF
// reporter. Every value can be overridden with an environment variable.
import path from "node:path";
import { fileURLToPath } from "node:url";

export const E2E_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const FRONTEND_DIR = path.resolve(E2E_DIR, "..");
export const BACKEND_DIR = path.resolve(
  process.env.E2E_BACKEND_DIR ??
    path.join(FRONTEND_DIR, "..", "quiz-generator"),
);

// Logs, generated backend config and seed data of the current run.
export const RUN_DIR = path.join(E2E_DIR, ".run");
export const SEED_FILE = path.join(RUN_DIR, "seed.json");

// The backend's CORS only accepts http://localhost:3000, so the frontend
// port is fixed. The API port is baked into the frontend build.
export const APP_URL = "http://localhost:3000";
export const API_PORT = Number(process.env.E2E_API_PORT ?? 8008);
export const API_URL = `http://localhost:${API_PORT}`;

// Non-default ports so a running development MongoDB/Redis is never touched.
export const MONGO = {
  container: "qg-e2e-mongo",
  image: "mongo:8.0",
  port: Number(process.env.E2E_MONGO_PORT ?? 27118),
  user: "quizz",
};
export const REDIS = {
  container: "qg-e2e-redis",
  image: "redis:7-alpine",
  port: Number(process.env.E2E_REDIS_PORT ?? 6479),
};

// Test-only account for the throwaway database. `hash` is the bcrypt hash of
// `password`, inserted directly because the API cannot create the first admin.
export const ADMIN = {
  id: "0b7e7c5e-6f4a-4d2b-9a51-1c2d3e4f5a6b",
  documento: "90000001",
  password: "AdminE2E#2026",
  hash: "$2y$10$l8OCgor8QdXweuZCzf5bruz/CwjXjFzpE9m/QX9M9u/9os55WosB6",
};
