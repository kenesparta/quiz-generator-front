"use client";

import jsPDF from "jspdf";
import { BASE_URL } from "@/config/api";
import type { EvaluationResponse } from "@/types/evaluacion";

const CLINIC_NAME = "Policlínico Wari SAC";

interface PostulanteData {
  documento: string;
  nombre: string;
  nombre_completo: string;
  fecha_nacimiento: string;
  grado_instruccion: string;
}

interface PsicologoData {
  nombre_completo: string;
  colegiatura: string;
}

interface RevisionData {
  resultado: "apto" | "no_apto" | "evaluacion_especializada";
  psicologo?: PsicologoData;
}

const showErrorDialog = (message: string) => {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `
    <form method="dialog" style="font-family:system-ui;padding:1.5rem;max-width:400px;border-radius:8px;">
      <h3 style="margin:0 0 0.75rem;color:#dc3545;">Error</h3>
      <p style="margin:0 0 1.25rem;color:#333;">${message}</p>
      <button style="padding:0.5rem 1.25rem;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;float:right;">Cerrar</button>
    </form>
  `;
  dialog.addEventListener("close", () => dialog.remove());
  document.body.appendChild(dialog);
  dialog.showModal();
};

export const generatePDFReport = async (
  revisionId: string,
  _postulanteId: string,
  postulante?: PostulanteData,
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${BASE_URL}/revisiones/${revisionId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      showErrorDialog("Error al obtener los datos de la revisión");
      return;
    }

    const data = (await response.json()) as EvaluationResponse &
      RevisionData & { psicologo?: PsicologoData };
    const revisionData: RevisionData | undefined = data.resultado
      ? {
          resultado: data.resultado as RevisionData["resultado"],
          psicologo: data.psicologo,
        }
      : undefined;

    await createPDF(data, postulante, revisionData);
  } catch (error) {
    console.error("Error generating PDF:", error);
    showErrorDialog("Error al generar el reporte PDF");
  }
};

const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
};

const getResultadoLabel = (
  resultado: string,
): { label: string; color: [number, number, number] } => {
  switch (resultado) {
    case "apto":
      return { label: "APTO", color: [34, 139, 34] };
    case "no_apto":
      return { label: "NO APTO", color: [220, 53, 69] };
    case "evaluacion_especializada":
      return { label: "EVALUACION ESPECIALIZADA", color: [255, 140, 0] };
    default:
      return { label: "PENDIENTE", color: [128, 128, 128] };
  }
};

const loadAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const loadFontAsBinary = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return null;
  }
};

const registerRobotoFonts = async (doc: jsPDF): Promise<boolean> => {
  const [regular, bold, italic] = await Promise.all([
    loadFontAsBinary("/fonts/Roboto-Regular.ttf"),
    loadFontAsBinary("/fonts/Roboto-Bold.ttf"),
    loadFontAsBinary("/fonts/Roboto-Italic.ttf"),
  ]);

  if (!regular || !bold || !italic) return false;

  doc.addFileToVFS("Roboto-Regular.ttf", regular);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

  doc.addFileToVFS("Roboto-Bold.ttf", bold);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

  doc.addFileToVFS("Roboto-Italic.ttf", italic);
  doc.addFont("Roboto-Italic.ttf", "Roboto", "italic");

  return true;
};

const createPDF = async (
  data: EvaluationResponse,
  postulante?: PostulanteData,
  revisionData?: RevisionData,
): Promise<void> => {
  const doc = new jsPDF({ format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 8;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  const useRoboto = await registerRobotoFonts(doc);
  const fontFamily = useRoboto ? "Roboto" : "helvetica";
  doc.setFont(fontFamily, "normal");

  const logoBase64 = await loadAsBase64("/img/logo_reporte.png");

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  const drawHeader = () => {
    const headerHeight = 50;

    doc.setFillColor(41, 65, 114);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    if (logoBase64) {
      const logoSize = 22;
      doc.addImage(logoBase64, "PNG", margin, 14, logoSize, logoSize);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(fontFamily, "bold");
    doc.text(CLINIC_NAME, pageWidth / 2, 16, { align: "center" });

    doc.setFontSize(13);
    doc.setFont(fontFamily, "normal");
    doc.text("REPORTE DE EVALUACION", pageWidth / 2, 28, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont(fontFamily, "normal");
    doc.text(data.evaluacion.nombre, pageWidth / 2, 40, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
    yPosition = headerHeight + 10;
  };

  const drawResultadoBadge = () => {
    if (!revisionData?.resultado) return;

    const { label, color } = getResultadoLabel(revisionData.resultado);

    addNewPageIfNeeded(25);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(pageWidth / 2 - 40, yPosition, 80, 14, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(fontFamily, "bold");
    doc.text(label, pageWidth / 2, yPosition + 9, { align: "center" });

    doc.setTextColor(0, 0, 0);
    yPosition += 25;
  };

  const drawSectionTitle = (title: string) => {
    addNewPageIfNeeded(20);

    doc.setFillColor(240, 244, 248);
    doc.rect(margin, yPosition - 4, contentWidth, 10, "F");

    doc.setDrawColor(41, 65, 114);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 4, margin, yPosition + 6);

    doc.setFontSize(11);
    doc.setFont(fontFamily, "bold");
    doc.setTextColor(41, 65, 114);
    doc.text(title, margin + 5, yPosition + 3);

    doc.setTextColor(0, 0, 0);
    yPosition += 14;
  };

  const drawInfoRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont(fontFamily, "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label, margin + 5, yPosition);

    doc.setFont(fontFamily, "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin + 55, yPosition);

    yPosition += 7;
  };

  drawHeader();

  drawResultadoBadge();

  drawSectionTitle("Informacion del Postulante");

  if (postulante) {
    drawInfoRow("Nombre:", postulante.nombre_completo);
    drawInfoRow("Documento:", postulante.documento);
    drawInfoRow("Fecha Nacimiento:", postulante.fecha_nacimiento);
    drawInfoRow("Grado Instrucción:", postulante.grado_instruccion);
  }
  yPosition += 5;

  drawSectionTitle("Informacion de la Evaluacion");

  const fechaInicio = new Date(data.fecha_tiempo_inicio).toLocaleString(
    "es-PE",
  );
  drawInfoRow("Fecha Inicio:", fechaInicio);

  if (data.fecha_tiempo_fin) {
    const fechaFin = new Date(data.fecha_tiempo_fin).toLocaleString("es-PE");
    drawInfoRow("Fecha Fin:", fechaFin);
  }

  if (data.fecha_tiempo_inicio && data.fecha_tiempo_fin) {
    const diffMs =
      new Date(data.fecha_tiempo_fin).getTime() -
      new Date(data.fecha_tiempo_inicio).getTime();
    const diffSeg = Math.floor(diffMs / 1000);
    const tiempoHoras = Math.floor(diffSeg / 3600);
    const tiempoMin = Math.floor((diffSeg % 3600) / 60);
    const tiempoSeg = diffSeg % 60;
    drawInfoRow("Tiempo:", `${tiempoHoras}h ${tiempoMin}m ${tiempoSeg}s`);
  }
  yPosition += 10;

  for (
    let examIndex = 0;
    examIndex < data.evaluacion.examenes.length;
    examIndex++
  ) {
    const exam = data.evaluacion.examenes[examIndex];
    const observacion = exam.observacion;

    if (examIndex > 0) {
      doc.addPage();
      yPosition = margin;
    } else {
      addNewPageIfNeeded(35);
    }

    doc.setFillColor(41, 65, 114);
    doc.rect(margin, yPosition, contentWidth, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(fontFamily, "bold");
    doc.text(
      `EXAMEN ${examIndex + 1}: ${exam.titulo.toUpperCase()}`,
      margin + 5,
      yPosition + 8,
    );

    doc.setTextColor(0, 0, 0);
    yPosition += 18;

    // Exam score
    addNewPageIfNeeded(12);
    doc.setFillColor(230, 240, 250);
    doc.rect(margin, yPosition, contentWidth, 10, "F");
    doc.setFontSize(10);
    doc.setFont(fontFamily, "bold");
    doc.setTextColor(41, 65, 114);
    doc.text(
      `Puntaje del examen: ${exam.puntos_obtenidos}`,
      margin + 5,
      yPosition + 7,
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 14;

    if (observacion) {
      addNewPageIfNeeded(25);

      doc.setFillColor(255, 248, 225);
      doc.setDrawColor(255, 193, 7);
      doc.setLineWidth(0.3);

      const obsLines = doc.splitTextToSize(observacion, contentWidth - 20);
      const obsHeight = obsLines.length * 5 + 12;

      doc.rect(margin, yPosition, contentWidth, obsHeight, "FD");

      doc.setFontSize(9);
      doc.setFont(fontFamily, "bold");
      doc.setTextColor(156, 110, 0);
      doc.text("OBSERVACION DEL EVALUADOR:", margin + 5, yPosition + 6);

      doc.setFont(fontFamily, "normal");
      doc.setTextColor(80, 60, 0);
      doc.text(obsLines, margin + 5, yPosition + 14);

      doc.setTextColor(0, 0, 0);
      yPosition += obsHeight + 8;
    }

    if (exam.descripcion) {
      addNewPageIfNeeded(15);
      doc.setFontSize(9);
      doc.setFont(fontFamily, "italic");
      doc.setTextColor(100, 100, 100);
      const descripcionLines = doc.splitTextToSize(
        exam.descripcion,
        contentWidth - 10,
      );
      doc.text(descripcionLines, margin + 5, yPosition);
      yPosition += descripcionLines.length * 4 + 5;
      doc.setTextColor(0, 0, 0);
    }

    for (let qIndex = 0; qIndex < exam.preguntas.length; qIndex++) {
      const pregunta = exam.preguntas[qIndex];

      addNewPageIfNeeded(30);

      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPosition, contentWidth, 8, "F");

      doc.setFontSize(10);
      doc.setFont(fontFamily, "bold");
      doc.setTextColor(41, 65, 114);
      doc.text(`Pregunta ${qIndex + 1}`, margin + 3, yPosition + 6);

      doc.setFontSize(9);
      doc.setFont(fontFamily, "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Puntaje: ${pregunta.puntos}`,
        pageWidth - margin - 3,
        yPosition + 6,
        { align: "right" },
      );
      doc.setTextColor(0, 0, 0);
      yPosition += 12;

      doc.setFont(fontFamily, "normal");
      doc.setFontSize(10);
      const contenidoClean = stripHtml(pregunta.contenido);
      const contenidoLines = doc.splitTextToSize(
        contenidoClean,
        contentWidth - 10,
      );
      doc.text(contenidoLines, margin + 5, yPosition);
      yPosition += contenidoLines.length * 4 + 1;

      if (
        pregunta.tipo_de_pregunta === "alternativa_unica" ||
        pregunta.tipo_de_pregunta === "alternativa_peso"
      ) {
        doc.setFontSize(9);
        for (const [key, value] of Object.entries(pregunta.alternativas)) {
          addNewPageIfNeeded(10);
          const isSelected = pregunta.respuestas.includes(key);

          const marker = isSelected ? "[X]" : "[  ]";
          const alternativaText = `${marker} ${key}: ${value}`;
          const altLines = doc.splitTextToSize(
            alternativaText,
            contentWidth - 20,
          );
          const altHeight = altLines.length * 4 + 2;

          if (isSelected) {
            doc.setFillColor(232, 245, 233);
            doc.rect(margin + 8, yPosition, contentWidth - 16, altHeight, "F");
            doc.setTextColor(46, 125, 50);
            doc.setFont(fontFamily, "bold");
          } else {
            doc.setTextColor(80, 80, 80);
            doc.setFont(fontFamily, "normal");
          }

          doc.text(altLines, margin + 10, yPosition + altHeight * 0.6);
          yPosition += altHeight;

          doc.setTextColor(0, 0, 0);
          doc.setFont(fontFamily, "normal");
        }
      } else if (pregunta.tipo_de_pregunta === "sola_respuesta") {
        addNewPageIfNeeded(15);

        doc.setFillColor(232, 245, 233);
        doc.rect(margin + 5, yPosition, contentWidth - 10, 10, "F");

        doc.setFontSize(9);
        doc.setFont(fontFamily, "bold");
        doc.setTextColor(46, 125, 50);
        doc.text("Respuesta:", margin + 6, yPosition + 6);

        doc.setFont(fontFamily, "normal");
        const respuestaText =
          pregunta.respuestas.length > 0
            ? pregunta.respuestas.join(", ")
            : "(Sin respuesta)";
        const respLines = doc.splitTextToSize(respuestaText, contentWidth - 40);
        doc.text(respLines, margin + 35, yPosition + 7);
        yPosition += 14;

        doc.setTextColor(0, 0, 0);
      }

      yPosition += 5;
    }

    yPosition += 10;
  }

  // Signature box
  addNewPageIfNeeded(55);
  yPosition += 10;

  const boxWidth = 80;
  const boxX = (pageWidth - boxWidth) / 2;
  const psicologo = revisionData?.psicologo;

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.rect(boxX, yPosition, boxWidth, 45);

  doc.setFontSize(8);
  doc.setFont(fontFamily, "bold");
  doc.setTextColor(41, 65, 114);

  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(boxX + 10, yPosition + 28, boxX + boxWidth - 10, yPosition + 28);

  if (psicologo) {
    doc.setFontSize(8);
    doc.setFont(fontFamily, "bold");
    doc.setTextColor(60, 60, 60);
    doc.text(psicologo.nombre_completo, pageWidth / 2, yPosition + 34, {
      align: "center",
    });

    doc.setFontSize(7);
    doc.setFont(fontFamily, "normal");
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Colegiatura: ${psicologo.colegiatura}`,
      pageWidth / 2,
      yPosition + 40,
      { align: "center" },
    );
  } else {
    doc.setFontSize(8);
    doc.setFont(fontFamily, "normal");
    doc.setTextColor(128, 128, 128);
    doc.text("Nombre y Sello", pageWidth / 2, yPosition + 34, {
      align: "center",
    });
  }

  yPosition += 50;

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Documento generado el ${new Date().toLocaleString("es-PE")}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  const fileName = `reporte_evaluacion_${crypto.randomUUID()}.pdf`;
  doc.save(fileName);
};
