import { ADMIN } from "../support/env.js";
import {
  apiRequests,
  captura,
  expect,
  nota,
  test,
  withToken,
} from "../support/fixtures.js";
import { textoDelPdf } from "../support/pdf.js";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// The candidate must submit the exam before the review and the report.
test.describe.configure({ mode: "serial" });

test.describe("Flujos principales", () => {
  test("el administrador inicia sesión y recorre todas las páginas del panel", async ({
    page,
  }) => {
    await test.step("inicia sesión en /admin/login", async () => {
      await page.goto("/admin/login");
      await page.getByLabel("DNI").fill(ADMIN.documento);
      await page.getByLabel("Contraseña").fill(ADMIN.password);
      await page.getByRole("button", { name: "Ingresar al Sistema" }).click();
      await expect(page).toHaveURL("/admin/dashboard/evaluacion");
      await expect(page.getByText("Evaluación de seguridad")).toBeVisible();
    });
    await captura(page, "Panel: evaluaciones");

    for (const [ruta, enlace, contenido] of [
      ["examen", "Examen", page.getByText("Examen de seguridad")],
      [
        "postulante",
        "Postulante",
        page.getByRole("cell", { name: "Carla Candidata Prueba" }),
      ],
      [
        "asignaciones",
        "Asignaciones",
        page.getByRole("cell", { name: "Evaluación de seguridad" }),
      ],
      [
        "revision",
        "Revisión",
        page.getByRole("heading", { name: "Lista de Evaluaciones" }),
      ],
      [
        "psicologo",
        "Psicólogo",
        page.getByRole("cell", { name: "Pablo Psico Prueba" }),
      ],
    ]) {
      await test.step(`abre la página ${enlace}`, async () => {
        await page
          .getByRole("link", { name: enlace, exact: true })
          .first()
          .click();
        await expect(page).toHaveURL(`/admin/dashboard/${ruta}`);
        await expect(contenido).toBeVisible();
      });
    }

    await test.step("las asignaciones muestran la etiqueta de su estado", async () => {
      // The API sends "creado"; the page used to expect "Creado" and showed the raw value.
      await page
        .getByRole("link", { name: "Asignaciones", exact: true })
        .first()
        .click();
      await expect(
        page.getByRole("cell", { name: "Creado", exact: true }),
      ).toBeVisible();
    });
  });

  test("el psicólogo no ve ni abre la página de psicólogos", async ({
    page,
    seed,
  }) => {
    await test.step("inicia sesión como psicólogo", async () => {
      await page.goto("/admin/login");
      await page.getByLabel("DNI").fill(seed.psicologo.documento);
      await page.getByLabel("Contraseña").fill(seed.psicologo.password);
      await page.getByRole("button", { name: "Ingresar al Sistema" }).click();
      await expect(page).toHaveURL("/admin/dashboard/evaluacion");
    });
    await test.step("el menú no muestra Psicólogo", async () => {
      await expect(
        page.getByRole("link", { name: "Postulante" }),
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "Psicólogo" })).toHaveCount(
        0,
      );
    });
    await captura(page, "Menú del psicólogo");
    await test.step("la URL directa lo devuelve al panel", async () => {
      await page.goto("/admin/dashboard/psicologo");
      await expect(page).toHaveURL("/admin/dashboard/evaluacion");
    });
  });

  test("el administrador registra psicólogo y postulante con IDs seguros", async ({
    page,
    context,
    adminToken,
  }) => {
    await withToken(context, adminToken);
    const llamadas = apiRequests(page);

    await test.step("registra un psicólogo", async () => {
      await page.goto("/admin/dashboard/psicologo");
      await page.getByRole("button", { name: "Agregar Psicólogo" }).click();
      const dialogo = page.getByRole("dialog");
      for (const [etiqueta, valor] of [
        ["Documento *", "61112222"],
        ["Nombre *", "Rosa"],
        ["Primer Apellido *", "Nueva"],
        ["Segundo Apellido *", "Psicóloga"],
        ["Especialidad *", "Clínica"],
        ["Colegiatura *", "CPP-999"],
        ["Contraseña *", "OtraClave#2026"],
      ]) {
        await dialogo.getByLabel(etiqueta, { exact: true }).fill(valor);
      }
      await captura(page, "Formulario de psicólogo");
      await dialogo.getByRole("button", { name: "Crear Psicólogo" }).click();
      await expect(
        page.getByText("El psicólogo se ha creado correctamente."),
      ).toBeVisible();
    });

    await test.step("la búsqueda por documento codifica el valor", async () => {
      await page.goto("/admin/dashboard/postulante");
      await page.getByRole("button", { name: "Agregar Postulante" }).click();
      const dialogo = page.getByRole("dialog");
      await dialogo
        .getByLabel("Documento *", { exact: true })
        .fill("8123&id=x");
      const busqueda = page.waitForRequest((req) =>
        req.url().includes("/postulantes?"),
      );
      await dialogo.getByTitle("Buscar postulante por documento").click();
      const url = (await busqueda).url();
      await nota("Búsqueda enviada a la API", url);
      expect(new URL(url).search).toBe("?documento=8123%26id%3Dx");
    });

    await test.step("registra un postulante", async () => {
      const dialogo = page.getByRole("dialog");
      await dialogo.getByLabel("Documento *", { exact: true }).fill("81234567");
      await dialogo.getByLabel("Nombre *", { exact: true }).fill("Luis");
      await dialogo
        .getByLabel("Primer Apellido *", { exact: true })
        .fill("Nuevo");
      await dialogo
        .getByLabel("Segundo Apellido *", { exact: true })
        .fill("Postulante");
      await dialogo
        .getByLabel("Fecha de Nacimiento *", { exact: true })
        .fill("1991-01-02");
      await dialogo.getByRole("button", { name: "Crear Postulante" }).click();
      await expect(
        page.getByText("El postulante se ha guardado correctamente."),
      ).toBeVisible();
    });

    await test.step("los IDs enviados son UUID v4", async () => {
      const ids = new Set(
        llamadas
          .filter((url) => /\/(psicologos|postulantes)\/[^/?]+$/.test(url))
          .map((url) => new URL(url).pathname.split("/").pop()),
      );
      await nota("IDs generados por el navegador", [...ids].join("\n"));
      expect(ids.size).toBe(2);
      for (const id of ids) expect(id).toMatch(UUID_V4);
    });
  });

  test("el postulante rinde la evaluación y el HTML de la pregunta no se ejecuta", async ({
    page,
    seed,
  }) => {
    await test.step("inicia sesión como postulante", async () => {
      await page.goto("/login");
      await page.getByLabel("DNI").fill(seed.postulante.documento);
      await page.getByLabel("Contraseña").fill(seed.postulante.password);
      await page
        .getByRole("button", { name: "Comenzar la Evaluación" })
        .click();
      await expect(page).toHaveURL("/evaluacion");
    });

    await test.step("inicia la evaluación asignada", async () => {
      await page.getByRole("button", { name: "Iniciar" }).click();
      await expect(page).toHaveURL(/\/evaluacion\/[0-9a-f-]{36}$/);
    });

    await test.step("la evaluación iniciada se puede continuar", async () => {
      // The API sends "en_proceso"; the card used to expect "en_progreso".
      await page.goto("/evaluacion");
      await expect(page.getByText("En Progreso")).toBeVisible();
      await page.getByRole("button", { name: "Continuar" }).click();
      await expect(page).toHaveURL(/\/evaluacion\/[0-9a-f-]{36}$/);
    });

    await test.step("el HTML de la pregunta se muestra como texto", async () => {
      await expect(page.getByText("segura")).toBeVisible();
      await expect(page.getByText('onerror="window.__xss')).toBeVisible();
    });

    await test.step("la imagen en base64 carga con la CSP activa", async () => {
      const imagen = page.getByAltText("Imagen de la pregunta");
      await expect(imagen).toBeVisible();
      expect(await imagen.evaluate((img) => img.naturalWidth)).toBe(40);
    });
    await captura(page, "Evaluación en curso");

    await test.step("responde las preguntas", async () => {
      // Controlled input: it only shows as checked once the answer is saved.
      await page.getByRole("radio", { name: "Uno" }).click();
      await expect(page.getByRole("radio", { name: "Uno" })).toBeChecked();
      await page.getByPlaceholder("Escriba su respuesta aquí...").fill("10");
      await expect(page.getByText("Respondida")).toHaveCount(2);
    });

    await test.step("envía la evaluación", async () => {
      await page.getByRole("button", { name: "Finalizar" }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: /^Enviar/ })
        .click();
      await expect(page.getByText("¡Evaluación Enviada!")).toBeVisible();
    });
    await captura(page, "Evaluación enviada");

    await test.step("el código de la pregunta nunca se ejecutó", async () => {
      expect(await page.evaluate(() => window.__xss)).toBeUndefined();
    });
  });

  test("la revisión y el informe PDF no ejecutan el HTML de la pregunta", async ({
    page,
    context,
    adminToken,
    seed,
  }, testInfo) => {
    await withToken(context, adminToken);

    await test.step("abre la revisión del postulante", async () => {
      await page.goto("/admin/dashboard/revision");
      // The candidate's data comes from following the API's HATEOAS link.
      await expect(page.getByText("Carla Candidata Prueba")).toBeVisible();
      await page.getByRole("link", { name: "Revisar" }).click();
      await expect(page).toHaveURL(
        new RegExp(`/admin/dashboard/revision/.+/${seed.postulanteId}$`),
      );
      await expect(page.getByAltText("Imagen de la pregunta")).toBeVisible();
    });
    await captura(page, "Revisión de la evaluación");

    await test.step("finaliza la revisión como Apto", async () => {
      await page.getByRole("button", { name: "Apto", exact: true }).click();
      await page.getByRole("button", { name: "Finalizar" }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Finalizar" })
        .click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Aceptar" })
        .click();
      await expect(page).toHaveURL("/admin/dashboard/revision");
    });

    const ruta = testInfo.outputPath("informe-postulante.pdf");
    await test.step("genera y descarga el informe PDF", async () => {
      const descarga = page.waitForEvent("download");
      await page
        .getByRole("button", { name: "Generar Informe" })
        .first()
        .click();
      await (await descarga).saveAs(ruta);
      await testInfo.attach("Informe PDF generado por la aplicación", {
        path: ruta,
        contentType: "application/pdf",
      });
    });
    await captura(page, "Informe generado");

    await test.step("el código de la pregunta nunca se ejecutó", async () => {
      expect(await page.evaluate(() => window.__xss)).toBeUndefined();
    });

    await test.step("el PDF contiene la pregunta sin el HTML", async () => {
      const texto = await textoDelPdf(ruta);
      expect(texto).toContain("Pregunta segura");
      expect(texto).not.toContain("onerror");
    });
  });
});
