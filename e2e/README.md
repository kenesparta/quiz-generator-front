# Pruebas end-to-end (Playwright)

12 pruebas de seguridad y de los flujos principales que corren contra el frontend
real (build de producción) y el backend real (`../quiz-generator`), con MongoDB y
Redis temporales en Docker. Cada ejecución genera un informe PDF con evidencias.

## Requisitos

- Node.js >= 22.19 y pnpm
- Docker en ejecución
- Rust (`cargo`) para compilar el backend
- El backend en `../../quiz-generator` respecto a esta carpeta (o `E2E_BACKEND_DIR`)
- Puertos libres: `3000` (frontend) y `8008` (API). Detén `pnpm dev` y el backend
  de desarrollo antes de ejecutar.

## Instalación (una vez)

```bash
cd e2e
pnpm install
pnpm install-browsers   # descarga el Chromium de Playwright
```

## Ejecutar

```bash
pnpm test
```

`pnpm test` hace todo y deja el entorno limpio:

1. Compila y levanta el frontend en modo producción en `http://localhost:3000`.
2. Inicia MongoDB y Redis temporales en Docker (puertos `27118` y `6479`), sin
   tocar los de desarrollo.
3. Compila el backend y lo levanta con una configuración generada (secretos
   aleatorios) en `.run/backend/`.
4. Crea el administrador y los datos de prueba: un examen con una pregunta que
   contiene HTML malicioso y una imagen en base64, una evaluación publicada, un
   postulante asignado y un psicólogo.
5. Ejecuta las pruebas y genera los reportes.
6. Detiene el backend y elimina los contenedores.

## Cómo confirmar que las pruebas se ejecutaron

| Evidencia | Cómo verla |
| --- | --- |
| Consola | Cada prueba aparece con ✓ o ✘ y su duración |
| Ver el navegador | `pnpm test:headed` abre una ventana real |
| Modo interactivo | `pnpm test:ui`: ejecuta paso a paso con línea de tiempo |
| Reporte HTML | `pnpm report`: pasos, capturas, video y trace de cada prueba |
| Trace | `pnpm exec playwright show-trace test-results/<prueba>/trace.zip`: repetición con DOM, red y consola |
| Informe PDF | `reports/informe-e2e-<fecha>_<hora>.pdf` |

### Prueba de cordura: romper algo a propósito

Una prueba que no puede fallar no prueba nada. Para comprobarlo:

1. En `src/utils/pdfReportGenerator.ts`, dentro de `stripHtml`, reemplaza la
   asignación de `text` (las dos líneas con `DOMParser`) por la versión anterior:

   ```ts
   const tmp = document.createElement("div");
   tmp.innerHTML = html;
   const text = tmp.textContent ?? "";
   ```

2. Ejecuta `pnpm test`: la prueba «la revisión y el informe PDF no ejecutan el
   HTML de la pregunta» falla con `Received: 1` (el código de la pregunta se
   ejecutó).
3. Revierte el cambio: `git checkout -- src/utils/pdfReportGenerator.ts`.

## Informe PDF

Lo genera `reporters/pdf-reporter.js` con el mismo Chromium de Playwright:

- **Portada:** resultado global, totales (aprobadas, fallidas, inestables,
  omitidas), duración, número de verificaciones `expect`, entorno (commits del
  frontend y del backend, navegador, versiones) e índice de pruebas.
- **Una sección por prueba:** pasos con su duración, el error si falló,
  capturas tomadas durante la ejecución, evidencias en texto (cabeceras,
  peticiones, IDs) y la ruta de su video y trace.

## Variables de entorno

| Variable | Por defecto | Uso |
| --- | --- | --- |
| `E2E_BACKEND_DIR` | `../../quiz-generator` | Ruta del backend |
| `E2E_SKIP_BACKEND_BUILD` | — | `1` usa el último binario compilado, útil si el backend está a medio cambiar |
| `E2E_API_PORT` | `8008` | Puerto de la API |
| `E2E_MONGO_PORT` / `E2E_REDIS_PORT` | `27118` / `6479` | Puertos de los contenedores |

## Estructura

```
e2e/
├── playwright.config.js     webServer, reportes y evidencias (captura, video y trace)
├── support/
│   ├── env.js               rutas, puertos y credenciales de prueba
│   ├── global-setup.js      contenedores, backend, datos y limpieza
│   ├── seed.js              datos creados por la API
│   ├── fixtures.js          sesión, guardia de CSP y evidencias
│   └── pdf.js               lectura del PDF que genera la aplicación
├── tests/
│   ├── flows.spec.js        flujos principales (en serie)
│   └── security.spec.js     cabeceras, iframe, accesos y XSS
└── reporters/
    └── pdf-reporter.js      informe PDF en español
```

## Notas

- Toda prueba falla si el navegador reporta una violación de CSP o un error de
  JavaScript en la página (`fixtures.js`).
- Los datos dependen de reglas actuales del backend; por ejemplo, la contraseña
  inicial del postulante son los últimos 4 dígitos del DNI. Si cambian, actualiza
  `support/seed.js`.
- `pnpm test` reemplaza la carpeta `.next` del frontend, igual que `pnpm build`.
- Los logs del backend de la última ejecución quedan en `.run/backend.log`.
