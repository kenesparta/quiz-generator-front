// One-command environment. Playwright's webServer has already built and
// started the frontend when this runs. Here: throwaway MongoDB and Redis
// containers, the backend built from E2E_BACKEND_DIR with a generated config,
// and the seed data. The returned function is the global teardown.
import { execFileSync, spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  openSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import net from "node:net";
import path from "node:path";
import { request } from "@playwright/test";
import {
  ADMIN,
  API_PORT,
  API_URL,
  BACKEND_DIR,
  MONGO,
  REDIS,
  RUN_DIR,
  SEED_FILE,
} from "./env.js";
import { seedData } from "./seed.js";

const log = (message) => console.log(`[e2e] ${message}`);

const docker = (...args) =>
  execFileSync("docker", args, { encoding: "utf8", stdio: "pipe" }).trim();

const removeContainers = () => {
  for (const name of [MONGO.container, REDIS.container]) {
    try {
      // -v also deletes the anonymous volumes the images declare.
      docker("rm", "-f", "-v", name);
    } catch {
      // Not running.
    }
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Polls `check` until it returns true; errors count as "not ready yet". */
const waitFor = async (what, check, timeoutMs = 90_000) => {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      lastError = error;
    }
    await delay(500);
  }
  throw new Error(
    `Tiempo agotado esperando ${what}${lastError ? `: ${lastError.message}` : ""}`,
  );
};

const isListening = (port, host) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });

export default async function globalSetup() {
  if (!existsSync(path.join(BACKEND_DIR, "Cargo.toml"))) {
    throw new Error(
      `No se encontró el backend en ${BACKEND_DIR}. Indica la ruta con E2E_BACKEND_DIR.`,
    );
  }
  // Otherwise the tests would silently run against that other server.
  if (
    (await isListening(API_PORT, "127.0.0.1")) ||
    (await isListening(API_PORT, "::1"))
  ) {
    throw new Error(
      `El puerto ${API_PORT} ya está en uso: detén el backend de desarrollo o usa E2E_API_PORT.`,
    );
  }

  rmSync(RUN_DIR, { recursive: true, force: true });
  const backendRunDir = path.join(RUN_DIR, "backend");
  mkdirSync(backendRunDir, { recursive: true });

  const mongoPassword = randomBytes(16).toString("hex");
  const redisPassword = randomBytes(16).toString("hex");
  let backend;

  const teardown = async () => {
    if (backend && backend.exitCode === null && backend.signalCode === null) {
      const exited = new Promise((resolve) => backend.once("exit", resolve));
      backend.kill("SIGTERM");
      await exited;
    }
    removeContainers();
    log(`Entorno eliminado. Logs: ${path.relative(process.cwd(), RUN_DIR)}/`);
  };
  process.once("exit", () => backend?.kill("SIGKILL"));

  try {
    removeContainers(); // leftovers from an interrupted run
    log("Iniciando MongoDB y Redis temporales…");
    docker(
      "run",
      "-d",
      "--rm",
      "--name",
      MONGO.container,
      "-p",
      `127.0.0.1:${MONGO.port}:27017`,
      "-e",
      `MONGO_INITDB_ROOT_USERNAME=${MONGO.user}`,
      "-e",
      `MONGO_INITDB_ROOT_PASSWORD=${mongoPassword}`,
      "-e",
      "MONGO_INITDB_DATABASE=quizz",
      MONGO.image,
    );
    docker(
      "run",
      "-d",
      "--rm",
      "--name",
      REDIS.container,
      "-p",
      `127.0.0.1:${REDIS.port}:6379`,
      REDIS.image,
      "redis-server",
      "--requirepass",
      redisPassword,
    );

    const mongosh = (script) =>
      docker(
        "exec",
        MONGO.container,
        "mongosh",
        "--quiet",
        "-u",
        MONGO.user,
        "-p",
        mongoPassword,
        "--authenticationDatabase",
        "admin",
        "quizz",
        "--eval",
        script,
      );
    await waitFor(
      "MongoDB",
      () => mongosh("db.runCommand({ ping: 1 }).ok") === "1",
    );
    await waitFor(
      "Redis",
      () =>
        docker(
          "exec",
          REDIS.container,
          "redis-cli",
          "-a",
          redisPassword,
          "--no-auth-warning",
          "ping",
        ) === "PONG",
    );
    // The API cannot create the first admin, so it goes straight into MongoDB.
    const admin = {
      _id: ADMIN.id,
      nombre: "Ana",
      primer_apellido: "Admin",
      segundo_apellido: "E2E",
      documento: ADMIN.documento,
      password: ADMIN.hash,
    };
    await waitFor(
      "el usuario administrador",
      () =>
        mongosh(
          `db.admin.replaceOne({ _id: "${ADMIN.id}" }, ${JSON.stringify(admin)}, { upsert: true }).acknowledged`,
        ) === "true",
    );

    if (process.env.E2E_SKIP_BACKEND_BUILD) {
      log("Usando el binario existente del backend (E2E_SKIP_BACKEND_BUILD).");
    } else {
      log(`Compilando el backend en ${BACKEND_DIR}…`);
      // --locked: never rewrite the backend's Cargo.lock.
      const locked = existsSync(path.join(BACKEND_DIR, "Cargo.lock"))
        ? ["--locked"]
        : [];
      try {
        execFileSync(
          "cargo",
          ["build", "-p", "quizz-api", "--bin", "quizz", ...locked],
          { cwd: BACKEND_DIR, stdio: "inherit" },
        );
      } catch {
        throw new Error(
          "No se pudo compilar el backend (el error de cargo está arriba). Si el backend está a medio cambiar, E2E_SKIP_BACKEND_BUILD=1 usa el último binario compilado.",
        );
      }
    }
    const binario = path.join(BACKEND_DIR, "target", "debug", "quizz");
    if (!existsSync(binario)) {
      throw new Error(`No existe el binario del backend: ${binario}`);
    }

    writeFileSync(
      path.join(backendRunDir, "configuration.yaml"),
      [
        `application_port: ${API_PORT}`,
        'application_host: "127.0.0.1"',
        "database:",
        '  host: "127.0.0.1"',
        `  port: ${MONGO.port}`,
        `  username: "${MONGO.user}"`,
        `  password: "${mongoPassword}"`,
        '  database_name: "quizz"',
        "redis:",
        '  host: "127.0.0.1"',
        `  port: ${REDIS.port}`,
        '  username: "default"',
        `  password: "${redisPassword}"`,
        "jwt:",
        `  secret: "${randomBytes(32).toString("hex")}"`,
        "  expiration_seconds: 3600",
        "",
      ].join("\n"),
    );
    // The backend reads configuration.yaml and rbac/ from its working directory.
    cpSync(path.join(BACKEND_DIR, "rbac"), path.join(backendRunDir, "rbac"), {
      recursive: true,
    });

    log(`Iniciando el backend en ${API_URL}…`);
    const backendLog = openSync(path.join(RUN_DIR, "backend.log"), "w");
    backend = spawn(binario, [], {
      cwd: backendRunDir,
      env: { ...process.env, RUST_LOG: "info" },
      stdio: ["ignore", backendLog, backendLog],
    });
    const deadline = Date.now() + 60_000;
    while (
      !(await fetch(`${API_URL}/health-check`).then(
        (response) => response.ok,
        () => false,
      ))
    ) {
      if (backend.exitCode !== null || Date.now() > deadline) {
        throw new Error(
          "El backend no respondió en /health-check; revisa .run/backend.log",
        );
      }
      await delay(500);
    }

    log("Creando los datos de prueba…");
    const api = await request.newContext({ baseURL: API_URL });
    const seed = await seedData(api);
    await api.dispose();
    writeFileSync(SEED_FILE, JSON.stringify(seed, null, 2));
    log("Entorno listo.");
  } catch (error) {
    await teardown();
    throw error;
  }

  return teardown;
}
