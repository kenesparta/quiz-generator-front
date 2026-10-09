// Test data created through the API before the tests run. Every run starts
// from an empty database, so fixed values keep the report readable.
import { randomUUID } from "node:crypto";
import { crc32, deflateSync } from "node:zlib";
import { ADMIN } from "./env.js";

// Runs if the question content is ever parsed into the live DOM.
export const XSS_PAYLOAD =
  '<img src=x onerror="window.__xss=(window.__xss||0)+1">';

// The backend sets a candidate's password to the last 4 digits of the DNI.
export const POSTULANTE = {
  documento: "70001234",
  password: "1234",
  nombre: "Carla",
  primer_apellido: "Candidata",
  segundo_apellido: "Prueba",
};

export const PSICOLOGO = {
  documento: "60001234",
  password: "PsicoE2E#2026",
  nombre: "Pablo",
  primer_apellido: "Psico",
  segundo_apellido: "Prueba",
};

// Solid-color PNG as a base64 data URL, like the images the app stores.
const pngDataUrl = (width, height) => {
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 2, 0, 0, 0], 8); // 8-bit RGB
  const row = Buffer.concat([
    Buffer.from([0]),
    Buffer.alloc(width * 3, Buffer.from([22, 119, 255])),
  ]);
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(Array(height).fill(row)))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  return `data:image/png;base64,${png.toString("base64")}`;
};

const call = async (api, method, url, token, data) => {
  const response = await api.fetch(url, {
    method,
    data,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok()) {
    throw new Error(
      `${method} ${url} -> ${response.status()} ${await response.text()}`,
    );
  }
  return response;
};

export const login = async (api, documento, password) => {
  const response = await call(api, "POST", "/login", null, {
    documento,
    password,
  });
  return (await response.json()).token;
};

/** Creates the exam, evaluation and users the tests rely on. */
export const seedData = async (api) => {
  const token = await login(api, ADMIN.documento, ADMIN.password);
  const examenId = randomUUID();
  const evaluacionId = randomUUID();
  const postulanteId = randomUUID();

  await call(api, "POST", `/examenes/${examenId}`, token, {
    titulo: "Examen de seguridad",
    descripcion: "Preguntas para las pruebas end-to-end",
    instrucciones: "Responda todas las preguntas",
  });
  await call(api, "PUT", `/examenes/${examenId}`, token, {
    preguntas: [
      {
        etiqueta: "no",
        tipo_de_pregunta: "alternativa_unica",
        imagen_ref: "",
        contenido: `Pregunta **segura** ${XSS_PAYLOAD}`,
        alternativas: { A: "Uno", B: "Dos" },
        puntaje: { A: 1, B: 0 },
      },
      {
        etiqueta: "no",
        tipo_de_pregunta: "sola_respuesta",
        imagen_ref: pngDataUrl(40, 30),
        contenido: "Pregunta con imagen",
        alternativas: {},
        puntaje: { 10: 1 },
      },
    ],
  });
  await call(api, "POST", `/evaluaciones/${evaluacionId}`, token, {
    titulo: "Evaluación de seguridad",
    descripcion: "Pruebas end-to-end",
  });
  await call(api, "PUT", `/evaluaciones/${evaluacionId}`, token, {
    examenes: [examenId],
  });
  await call(api, "PATCH", `/evaluaciones/${evaluacionId}`, token, {});

  const { password: _clave, ...postulante } = POSTULANTE;
  await call(api, "POST", `/postulantes/${postulanteId}`, token, {
    ...postulante,
    fecha_nacimiento: "1990-05-10",
    grado_instruccion: "secundaria",
    genero: "femenino",
  });
  await call(api, "POST", `/evaluaciones/${evaluacionId}/respuestas`, token, {
    postulante_id: postulanteId,
  });
  await call(api, "POST", `/psicologos/${randomUUID()}`, token, {
    ...PSICOLOGO,
    especialidad: "Clínica",
    colegiatura: "CPP-123",
  });

  return { examenId, evaluacionId, postulanteId };
};
