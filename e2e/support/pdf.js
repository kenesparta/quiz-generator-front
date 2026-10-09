import { readFileSync } from "node:fs";

// pdfjs warns on import that it cannot render pages without @napi-rs/canvas
// (left out on purpose, see pnpm-workspace.yaml). Reading text does not need
// it, so the warning is muted while the module loads.
const cargarPdfjs = async () => {
  const { log, warn } = console;
  console.log = () => {};
  console.warn = () => {};
  try {
    return await import("pdfjs-dist/legacy/build/pdf.mjs");
  } finally {
    console.log = log;
    console.warn = warn;
  }
};

/** Text of every page of a PDF file, with whitespace collapsed. */
export const textoDelPdf = async (ruta) => {
  const { getDocument } = await cargarPdfjs();
  const tarea = getDocument({
    data: new Uint8Array(readFileSync(ruta)),
    verbosity: 0,
  });
  try {
    const pdf = await tarea.promise;
    const paginas = [];
    for (let numero = 1; numero <= pdf.numPages; numero++) {
      const { items } = await (await pdf.getPage(numero)).getTextContent();
      paginas.push(items.map((item) => item.str ?? "").join(" "));
    }
    return paginas.join("\n").replace(/\s+/g, " ");
  } finally {
    await tarea.destroy();
  }
};
