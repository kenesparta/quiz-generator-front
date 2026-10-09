// Playwright reporter that writes a PDF evidence report in Spanish: a cover
// with the run summary and environment (git commits, browser, versions), then
// one section per test with its steps, errors and screenshots. It prints the
// PDF with Playwright's own Chromium, so it needs no extra dependencies.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import {
  API_URL,
  APP_URL,
  BACKEND_DIR,
  E2E_DIR,
  FRONTEND_DIR,
} from "../support/env.js";

const ESTADOS = {
  passed: { texto: "Aprobada", clase: "ok", icono: "✓" },
  flaky: { texto: "Inestable", clase: "inestable", icono: "!" },
  failed: { texto: "Fallida", clase: "error", icono: "✗" },
  timedOut: { texto: "Tiempo agotado", clase: "error", icono: "✗" },
  interrupted: { texto: "Interrumpida", clase: "error", icono: "✗" },
  skipped: { texto: "Omitida", clase: "omitida", icono: "–" },
};

const RESULTADO_GLOBAL = {
  passed: { texto: "APROBADO", clase: "ok" },
  failed: { texto: "FALLIDO", clase: "error" },
  timedout: { texto: "TIEMPO AGOTADO", clase: "error" },
  interrupted: { texto: "INTERRUMPIDO", clase: "error" },
};

// Error messages from Playwright carry terminal color codes.
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

const ENTIDADES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);

const duracion = (ms) =>
  ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;

const fechaHora = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "full",
  timeStyle: "medium",
});
const hora = new Intl.DateTimeFormat("es-PE", { timeStyle: "medium" });

const dos = (n) => String(n).padStart(2, "0");
const sello = (d) =>
  `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}_${dos(d.getHours())}-${dos(d.getMinutes())}-${dos(d.getSeconds())}`;

const infoGit = (dir) => {
  try {
    const git = (...args) =>
      execFileSync("git", ["-C", dir, ...args], {
        encoding: "utf8",
        stdio: "pipe",
      }).trim();
    const cambios =
      git("status", "--porcelain") === "" ? "" : " · con cambios sin confirmar";
    return `${git("rev-parse", "--short", "HEAD")} (rama ${git("rev-parse", "--abbrev-ref", "HEAD")})${cambios}`;
  } catch {
    return "no disponible";
  }
};

const contarVerificaciones = (pasos) =>
  pasos.reduce(
    (total, paso) =>
      total +
      (paso.category === "expect" ? 1 : 0) +
      contarVerificaciones(paso.steps),
    0,
  );

const listaDePasos = (pasos) => {
  const propios = pasos.filter((paso) => paso.category === "test.step");
  if (propios.length === 0) return "";
  const items = propios.map(
    (paso) =>
      `<li class="${paso.error ? "error" : ""}">${paso.error ? "✗" : "✓"} ${escapar(paso.title)} <span class="tenue">${duracion(paso.duration)}</span>${listaDePasos(paso.steps)}</li>`,
  );
  return `<ul class="pasos">${items.join("")}</ul>`;
};

const imagenEnLinea = (adjunto) => {
  const datos =
    adjunto.body ??
    (adjunto.path && existsSync(adjunto.path)
      ? readFileSync(adjunto.path)
      : null);
  return datos
    ? `data:${adjunto.contentType};base64,${Buffer.from(datos).toString("base64")}`
    : null;
};

const NOMBRES_ADJUNTOS = {
  screenshot: "Estado final de la página",
  video: "Video de la prueba",
  trace: "Trace (repetición completa)",
  "error-context": "Contexto del error",
};

class PdfReporter {
  constructor(options = {}) {
    this.outputDir = path.resolve(E2E_DIR, options.outputDir ?? "reports");
    this.resultados = new Map();
    this.erroresGlobales = [];
  }

  printsToStdio() {
    return false;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
    this.inicio = new Date();
  }

  onTestEnd(test, result) {
    this.resultados.set(test.id, result);
  }

  onError(error) {
    this.erroresGlobales.push(error);
  }

  async onEnd(resultado) {
    try {
      const archivo = await this.generar(resultado);
      console.log(`\nInforme PDF: ${path.relative(process.cwd(), archivo)}`);
    } catch (error) {
      console.error(`\nNo se pudo generar el informe PDF: ${error.message}`);
    }
  }

  async generar(resultado) {
    const inicio = this.inicio ?? resultado.startTime;
    const pruebas = (this.suite?.allTests() ?? []).map((test) => {
      const ultimo = this.resultados.get(test.id);
      const estado =
        test.outcome() === "flaky" ? "flaky" : (ultimo?.status ?? "skipped");
      return { test, ultimo, estado };
    });
    const cuenta = (...estados) =>
      pruebas.filter((p) => estados.includes(p.estado)).length;
    const verificaciones = pruebas.reduce(
      (total, p) => total + contarVerificaciones(p.ultimo?.steps ?? []),
      0,
    );

    const navegador = await chromium.launch();
    try {
      const html = this.html({
        resultado,
        inicio,
        pruebas,
        verificaciones,
        navegador: `Chromium ${navegador.version()}`,
        resumen: {
          total: pruebas.length,
          aprobadas: cuenta("passed"),
          fallidas: cuenta("failed", "timedOut", "interrupted"),
          inestables: cuenta("flaky"),
          omitidas: cuenta("skipped"),
        },
      });
      // The report needs no scripts; keep them off while rendering it.
      const contexto = await navegador.newContext({ javaScriptEnabled: false });
      const pagina = await contexto.newPage();
      await pagina.setContent(html, { waitUntil: "load" });
      mkdirSync(this.outputDir, { recursive: true });
      const archivo = path.join(
        this.outputDir,
        `informe-e2e-${sello(inicio)}.pdf`,
      );
      await pagina.pdf({
        path: archivo,
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: `<div style="font-size:8px;color:#8c8c8c;width:100%;padding:0 14mm;display:flex;justify-content:space-between;font-family:Arial,sans-serif"><span>Informe de pruebas end-to-end · Quiz Generator · ${escapar(fechaHora.format(inicio))}</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>`,
        margin: { top: "14mm", bottom: "16mm", left: "14mm", right: "14mm" },
      });
      return archivo;
    } finally {
      await navegador.close();
    }
  }

  html({ resultado, inicio, pruebas, verificaciones, navegador, resumen }) {
    const global =
      RESULTADO_GLOBAL[resultado.status] ?? RESULTADO_GLOBAL.failed;
    const logoRuta = path.join(FRONTEND_DIR, "public", "img", "logo.jpeg");
    const logo = existsSync(logoRuta)
      ? `<img class="logo" src="data:image/jpeg;base64,${readFileSync(logoRuta).toString("base64")}" alt="">`
      : "";
    const fin = new Date(inicio.getTime() + resultado.duration);
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const entorno = [
      ["Fecha de ejecución", `${fechaHora.format(inicio)} (${zona})`],
      ["Inicio y fin", `${hora.format(inicio)} — ${hora.format(fin)}`],
      ["Frontend", `${APP_URL} · commit ${infoGit(FRONTEND_DIR)}`],
      ["Backend", `${API_URL} · commit ${infoGit(BACKEND_DIR)}`],
      ["Navegador", navegador],
      ["Playwright", this.config?.version ?? "desconocido"],
      ["Node.js", process.version],
      ["Sistema operativo", `${os.type()} ${os.release()} (${os.arch()})`],
    ];

    const indice = pruebas.map(({ test, ultimo, estado }, i) => {
      const e = ESTADOS[estado];
      return `<tr><td>${i + 1}</td><td>${escapar(test.title)}</td><td class="tenue">${escapar(test.parent.title)}</td><td><span class="insignia ${e.clase}">${e.icono} ${e.texto}</span></td><td>${duracion(ultimo?.duration ?? 0)}</td></tr>`;
    });

    const errores = this.erroresGlobales.map(
      (error) =>
        `<pre class="error">${escapar((error.message ?? String(error)).replace(ANSI, "").slice(0, 4000))}</pre>`,
    );

    const secciones = pruebas.map((prueba, i) => this.seccion(prueba, i + 1));

    return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Informe de pruebas end-to-end</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1f1f1f; font-size: 10pt; line-height: 1.45; }
  h1 { font-size: 22pt; margin: 0; color: #001529; }
  h2 { font-size: 13pt; margin: 22px 0 8px; color: #001529; border-bottom: 2px solid #1677ff; padding-bottom: 4px; }
  h3 { font-size: 10.5pt; margin: 14px 0 6px; color: #262626; break-after: avoid; }
  .bloque { break-inside: avoid; }
  .cabecera { display: flex; align-items: center; gap: 16px; padding-bottom: 14px; border-bottom: 1px solid #f0f0f0; }
  .logo { width: 64px; height: 64px; border-radius: 10px; object-fit: contain; }
  .subtitulo { color: #595959; margin-top: 2px; }
  .veredicto { margin: 18px 0; padding: 14px 18px; border-radius: 8px; font-size: 15pt; font-weight: 700; }
  .veredicto.ok { background: #f6ffed; border: 1px solid #b7eb8f; color: #237804; }
  .veredicto.error { background: #fff1f0; border: 1px solid #ffa39e; color: #a8071a; }
  .kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
  .kpi { border: 1px solid #f0f0f0; border-radius: 8px; padding: 8px 10px; }
  .kpi b { display: block; font-size: 17pt; }
  .kpi span { color: #8c8c8c; font-size: 8.5pt; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 5px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  th { background: #fafafa; font-weight: 600; color: #434343; }
  td.clave { width: 32%; color: #595959; }
  .tenue { color: #8c8c8c; }
  .ok { color: #237804; } .error { color: #a8071a; } .inestable { color: #ad6800; } .omitida { color: #8c8c8c; }
  .insignia { display: inline-block; white-space: nowrap; padding: 1px 8px; border-radius: 10px; font-size: 8.5pt; font-weight: 600; border: 1px solid; }
  .insignia.ok { background: #f6ffed; border-color: #b7eb8f; }
  .insignia.error { background: #fff1f0; border-color: #ffa39e; }
  .insignia.inestable { background: #fffbe6; border-color: #ffe58f; }
  .insignia.omitida { background: #fafafa; border-color: #d9d9d9; }
  .nota { background: #f0f5ff; border: 1px solid #adc6ff; border-radius: 8px; padding: 10px 14px; margin-top: 18px; }
  .nota code, td code { font-family: Menlo, Consolas, monospace; font-size: 8.5pt; background: #fff; padding: 0 3px; border-radius: 3px; }
  .prueba { break-before: page; }
  .prueba-cabecera { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .prueba-cabecera h2 { flex: 1; border: 0; margin: 0; }
  .meta { color: #8c8c8c; font-size: 8.5pt; margin: 4px 0 10px; border-bottom: 2px solid #1677ff; padding-bottom: 6px; }
  ul.pasos { margin: 4px 0; padding-left: 18px; list-style: none; }
  ul.pasos > li { margin: 2px 0; }
  ul.pasos li.error { color: #a8071a; font-weight: 600; }
  pre.error { white-space: pre-wrap; word-break: break-word; background: #fff1f0; border: 1px solid #ffa39e; border-radius: 6px; padding: 8px 10px; font-size: 8pt; color: #5c0011; }
  figure { break-inside: avoid; margin: 10px 0 14px; }
  figure img { display: block; max-width: 100%; max-height: 92mm; border: 1px solid #d9d9d9; border-radius: 6px; }
  figcaption { color: #595959; font-size: 8.5pt; margin-top: 4px; }
  figure.texto pre { margin: 0; white-space: pre-wrap; word-break: break-all; background: #fafafa; border: 1px solid #d9d9d9; border-radius: 6px; padding: 8px 10px; font-family: Menlo, Consolas, monospace; font-size: 8pt; }
  .adjuntos td { font-size: 8.5pt; }
</style></head>
<body>
  <section>
    <div class="cabecera">${logo}<div><h1>Informe de pruebas end-to-end</h1><div class="subtitulo">Quiz Generator · Plataforma de Evaluaciones — Policlínico WARI</div></div></div>
    <div class="veredicto ${global.clase}">Resultado de la ejecución: ${global.texto}</div>
    <div class="kpis">
      <div class="kpi"><b>${resumen.total}</b><span>Pruebas</span></div>
      <div class="kpi ok"><b>${resumen.aprobadas}</b><span>Aprobadas</span></div>
      <div class="kpi error"><b>${resumen.fallidas}</b><span>Fallidas</span></div>
      <div class="kpi inestable"><b>${resumen.inestables}</b><span>Inestables</span></div>
      <div class="kpi omitida"><b>${resumen.omitidas}</b><span>Omitidas</span></div>
      <div class="kpi"><b>${duracion(resultado.duration)}</b><span>Duración total</span></div>
    </div>
    <p class="tenue">Se ejecutaron ${verificaciones} verificaciones (<code>expect</code>) en total.</p>
    ${errores.length ? `<h2>Errores fuera de las pruebas</h2>${errores.join("")}` : ""}
    <h2>Entorno</h2>
    <table>${entorno.map(([clave, valor]) => `<tr><td class="clave">${escapar(clave)}</td><td>${escapar(valor)}</td></tr>`).join("")}</table>
    <h2>Índice de pruebas</h2>
    <table><tr><th>#</th><th>Prueba</th><th>Grupo</th><th>Estado</th><th>Duración</th></tr>${indice.join("")}</table>
    <div class="nota"><b>Cómo verificar esta ejecución.</b> Cada prueba guarda un video y un trace (repetición con DOM, red y consola) en <code>e2e/test-results/</code>. Abre el reporte interactivo con <code>pnpm report</code> o un trace con <code>pnpm exec playwright show-trace &lt;ruta&gt;/trace.zip</code>. Las capturas de las páginas siguientes se tomaron durante esta ejecución.</div>
  </section>
  ${secciones.join("")}
</body></html>`;
  }

  seccion({ test, ultimo, estado }, numero) {
    const e = ESTADOS[estado];
    const archivo = `${path.relative(E2E_DIR, test.location.file)}:${test.location.line}`;
    const adjuntos = ultimo?.attachments ?? [];
    const esImagen = (a) => a.contentType.startsWith("image/");
    const esTexto = (a) => a.contentType.startsWith("text/") && a.body;
    // The automatic final screenshot repeats the test's last capture when it
    // passes; keep it for failures and for tests without captures of their own.
    const mostrarFinal =
      estado !== "passed" ||
      !adjuntos.some((a) => esImagen(a) && a.name !== "screenshot");
    const imagenes = adjuntos
      .filter(
        (a) =>
          esTexto(a) ||
          (esImagen(a) && (a.name !== "screenshot" || mostrarFinal)),
      )
      .map((a) => {
        const titulo = `<figcaption>${escapar(NOMBRES_ADJUNTOS[a.name] ?? a.name)}</figcaption>`;
        if (esTexto(a)) {
          return `<figure class="texto"><pre>${escapar(a.body.toString("utf8").slice(0, 4000))}</pre>${titulo}</figure>`;
        }
        const src = imagenEnLinea(a);
        return src ? `<figure><img src="${src}" alt="">${titulo}</figure>` : "";
      });
    const archivos = adjuntos
      .filter((a) => !a.contentType.startsWith("image/") && a.path)
      .map(
        (a) =>
          `<tr><td>${escapar(NOMBRES_ADJUNTOS[a.name] ?? a.name)}</td><td><code>${escapar(path.relative(E2E_DIR, a.path))}</code></td></tr>`,
      );
    const errores = (ultimo?.errors ?? []).map(
      (error) =>
        `<pre class="error">${escapar((error.message ?? "").replace(ANSI, "").slice(0, 4000))}</pre>`,
    );
    const inicio = ultimo?.startTime ? hora.format(ultimo.startTime) : "—";

    return `<section class="prueba">
    <div class="prueba-cabecera"><h2>${numero}. ${escapar(test.title)}</h2><span class="insignia ${e.clase}">${e.icono} ${e.texto}</span></div>
    <div class="meta">${escapar(test.parent.title)} · ${escapar(archivo)} · inicio ${escapar(inicio)} · duración ${duracion(ultimo?.duration ?? 0)} · ${contarVerificaciones(ultimo?.steps ?? [])} verificaciones${ultimo?.retry ? ` · reintento ${ultimo.retry}` : ""}</div>
    ${listaDePasos(ultimo?.steps ?? []) ? `<h3>Pasos</h3>${listaDePasos(ultimo.steps)}` : ""}
    ${errores.length ? `<h3>Error</h3>${errores.join("")}` : ""}
    ${imagenes.length ? `<h3>Evidencias</h3>${imagenes.join("")}` : ""}
    ${archivos.length ? `<div class="bloque"><h3>Archivos de la ejecución</h3><table class="adjuntos">${archivos.join("")}</table></div>` : ""}
  </section>`;
  }
}

export default PdfReporter;
