import { API_URL, APP_URL } from "../support/env.js";
import {
  apiRequests,
  captura,
  expect,
  jwtVencido,
  nota,
  test,
  withToken,
} from "../support/fixtures.js";

test.describe("Seguridad", () => {
  test("las cabeceras de seguridad se envían en páginas y recursos", async ({
    request,
  }) => {
    for (const ruta of [
      "/",
      "/login",
      "/admin/login",
      "/admin/dashboard/revision",
      "/img/logo.jpeg",
    ]) {
      await test.step(`GET ${ruta}`, async () => {
        const headers = (await request.get(ruta)).headers();
        const csp = headers["content-security-policy"];
        expect(csp, ruta).toContain("frame-ancestors 'none'");
        expect(csp, ruta).toContain("object-src 'none'");
        expect(csp, ruta).toContain(`connect-src 'self' ${API_URL}`);
        expect(csp, ruta).not.toContain("'unsafe-eval'");
        expect(headers["x-frame-options"], ruta).toBe("DENY");
        expect(headers["x-content-type-options"], ruta).toBe("nosniff");
        expect(headers["referrer-policy"], ruta).toBe("no-referrer");
        expect(headers["x-powered-by"], ruta).toBeUndefined();
        if (ruta === "/admin/login") {
          await nota(
            "Cabeceras recibidas en /admin/login",
            Object.entries(headers)
              .filter(([nombre]) => !["date", "etag", "vary"].includes(nombre))
              .map(([nombre, valor]) => `${nombre}: ${valor}`)
              .join("\n"),
          );
        }
      });
    }
  });

  test(
    "la aplicación no se puede incrustar en un iframe (clickjacking)",
    { tag: "@csp-esperada" },
    async ({ page }) => {
      const bloqueo = page.waitForEvent("console", (message) =>
        message.text().includes("frame-ancestors"),
      );
      await page.setContent(`<iframe src="${APP_URL}/admin/login"></iframe>`);
      await bloqueo;
      await expect(
        page
          .frameLocator("iframe")
          .getByRole("button", { name: "Ingresar al Sistema" }),
      ).toHaveCount(0);
      await captura(
        page,
        "El iframe queda vacío: el navegador bloqueó la página (frame-ancestors 'none')",
      );
    },
  );

  test("un visitante anónimo es enviado al login de administración", async ({
    page,
  }) => {
    const llamadas = apiRequests(page);
    await page.goto("/admin/dashboard/postulante");
    await expect(page).toHaveURL("/admin/login");
    expect(llamadas.filter((url) => url.includes("/postulantes"))).toEqual([]);
  });

  test("un token de postulante no abre el panel de administración", async ({
    page,
    context,
    candidateToken,
  }) => {
    await withToken(context, candidateToken);
    const llamadas = apiRequests(page);
    await page.goto("/admin/dashboard/revision");
    await expect(page).toHaveURL("/admin/login");
    expect(llamadas.filter((url) => url.includes("/revisiones"))).toEqual([]);
  });

  test("un token vencido se trata como sesión cerrada", async ({
    page,
    context,
  }) => {
    await withToken(context, jwtVencido("admin"));
    await page.goto("/admin/dashboard/evaluacion");
    await expect(page).toHaveURL("/admin/login");
  });

  test("un parámetro de ruta manipulado no sale de /respuestas/", async ({
    page,
    context,
    candidateToken,
  }) => {
    await withToken(context, candidateToken);
    const llamadas = apiRequests(page);
    const peticion = page.waitForRequest((req) =>
      req.url().startsWith(`${API_URL}/respuestas/`),
    );
    await page.goto("/evaluacion/..%2F..%2Fpostulantes%3Fdocumento%3D12345678");
    const url = new URL((await peticion).url());
    await nota("Petición enviada a la API", url.href);
    // Next.js passes the param on still percent-encoded: one path segment.
    expect(url.pathname.split("/")).toHaveLength(3);
    expect(url.search).toBe("");
    await expect(page.getByText(/Error 4/).first()).toBeVisible();
    expect(
      llamadas.filter((u) =>
        decodeURIComponent(new URL(u).search).includes("documento="),
      ),
    ).toEqual([]);
  });

  test("el patrón anterior con innerHTML ejecutaba código; DOMParser no", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      new DOMParser().parseFromString(
        '<img src=x onerror="window.__nuevo=1">',
        "text/html",
      );
      document.createElement("div").innerHTML =
        '<img src=x onerror="window.__anterior=1">';
    });
    await page.waitForFunction(() => window.__anterior === 1);
    expect(await page.evaluate(() => window.__nuevo)).toBeUndefined();
  });
});
