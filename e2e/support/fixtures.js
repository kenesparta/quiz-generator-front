import { readFileSync } from "node:fs";
import { test as base, expect } from "@playwright/test";
import { ADMIN, API_URL, SEED_FILE } from "./env.js";
import { login, POSTULANTE, PSICOLOGO } from "./seed.js";

export { expect };

export const test = base.extend({
  // Ids created by the global setup (exam, evaluation, candidate).
  seed: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright reads fixture dependencies from this pattern.
    async ({}, use) => {
      await use({
        ...JSON.parse(readFileSync(SEED_FILE, "utf8")),
        postulante: POSTULANTE,
        psicologo: PSICOLOGO,
      });
    },
    { scope: "worker" },
  ],

  api: [
    async ({ playwright }, use) => {
      const api = await playwright.request.newContext({ baseURL: API_URL });
      await use(api);
      await api.dispose();
    },
    { scope: "worker" },
  ],

  adminToken: [
    async ({ api }, use) => {
      await use(await login(api, ADMIN.documento, ADMIN.password));
    },
    { scope: "worker" },
  ],

  candidateToken: [
    async ({ api }, use) => {
      await use(await login(api, POSTULANTE.documento, POSTULANTE.password));
    },
    { scope: "worker" },
  ],

  // Fails the test on any CSP violation, CSP-blocked request or page error.
  // A test that provokes one on purpose is tagged @csp-esperada.
  cspGuard: [
    async ({ context }, use, testInfo) => {
      const problems = [];
      const watch = (page) => {
        page.on("console", (message) => {
          if (/Content Security Policy|Refused to/.test(message.text())) {
            problems.push(`consola: ${message.text()}`);
          }
        });
        page.on("pageerror", (error) => {
          problems.push(`error de página: ${error.message}`);
        });
        page.on("requestfailed", (req) => {
          if (req.failure()?.errorText.includes("BLOCKED_BY_CSP")) {
            problems.push(`bloqueado por CSP: ${req.url()}`);
          }
        });
      };
      for (const page of context.pages()) watch(page);
      context.on("page", watch);
      await use(problems);
      if (!testInfo.tags.includes("@csp-esperada")) {
        expect(problems, "violaciones de CSP o errores de página").toEqual([]);
      }
    },
    { auto: true },
  ],
});

/** Puts the session token in localStorage before any page script runs. */
export const withToken = (context, token) =>
  context.addInitScript((value) => {
    localStorage.setItem("token", value);
  }, token);

/** Collects the URL of every request the page sends to the API. */
export const apiRequests = (page) => {
  const urls = [];
  page.on("request", (req) => {
    if (req.url().startsWith(API_URL)) urls.push(req.url());
  });
  return urls;
};

/** Screenshot attached as evidence to the HTML and PDF reports. */
export const captura = async (page, nombre) => {
  await test.info().attach(nombre, {
    body: await page.screenshot({ type: "jpeg", quality: 70 }),
    contentType: "image/jpeg",
  });
};

/** Text attached as evidence (for checks that have nothing to show on screen). */
export const nota = async (nombre, texto) => {
  await test.info().attach(nombre, { body: texto, contentType: "text/plain" });
};

/** Unsigned JWT whose `exp` is in the past; the UI must treat it as absent. */
export const jwtVencido = (rol) => {
  const parte = (data) =>
    Buffer.from(JSON.stringify(data)).toString("base64url");
  const payload = {
    sub: crypto.randomUUID(),
    rol,
    exp: Math.floor(Date.now() / 1000) - 60,
  };
  return `${parte({ alg: "HS256", typ: "JWT" })}.${parte(payload)}.firma-invalida`;
};
