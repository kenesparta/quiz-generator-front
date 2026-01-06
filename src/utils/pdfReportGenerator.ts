"use client";

import jsPDF from "jspdf";
import type { EvaluationResponse } from "@/types/evaluacion";

interface PostulanteData {
  documento: string;
  nombre: string;
}

interface RevisionData {
  resultado: "apto" | "no_apto" | "evaluacion_especializada";
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8008";

export const generatePDFReport = async (
  revisionId: string,
  postulanteId: string,
  postulante?: PostulanteData,
): Promise<void> => {
  try {
    const [respuestaResponse, revisionResponse] = await Promise.all([
      fetch(`${BASE_URL}/respuesta/${revisionId}/postulante/${postulanteId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`${BASE_URL}/revision/${revisionId}/postulante/${postulanteId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    if (!respuestaResponse.ok) {
      throw new Error("Error al obtener los datos de la evaluación");
    }

    const data: EvaluationResponse = await respuestaResponse.json();
    let revisionData: RevisionData | undefined;

    if (revisionResponse.ok) {
      revisionData = await revisionResponse.json();
    }

    createPDF(data, postulante, revisionData);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error al generar el reporte PDF");
  }
};

const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
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

const createPDF = (
  data: EvaluationResponse,
  postulante?: PostulanteData,
  revisionData?: RevisionData,
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 15;

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 275) {
      doc.addPage();
      yPosition = 15;
    }
  };

  const drawHeader = () => {
    doc.setFillColor(41, 65, 114);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE EVALUACION", pageWidth / 2, 18, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(data.evaluacion.nombre, pageWidth / 2, 30, { align: "center" });

    doc.setTextColor(0, 0, 0);
    yPosition = 50;
  };

  const drawResultadoBadge = () => {
    if (!revisionData?.resultado) return;

    const { label, color } = getResultadoLabel(revisionData.resultado);

    addNewPageIfNeeded(25);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(pageWidth / 2 - 40, yPosition, 80, 14, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
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
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 114);
    doc.text(title, margin + 5, yPosition + 3);

    doc.setTextColor(0, 0, 0);
    yPosition += 14;
  };

  const drawInfoRow = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text(label, margin + 5, yPosition);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(value, margin + 55, yPosition);

    yPosition += 7;
  };

  drawHeader();

  drawResultadoBadge();

  drawSectionTitle("Informacion del Postulante");

  if (postulante) {
    drawInfoRow("Nombre:", postulante.nombre);
    drawInfoRow("Documento:", postulante.documento);
  }
  yPosition += 5;

  drawSectionTitle("Informacion de la Evaluacion");

  const fechaInicio = new Date(data.fecha_tiempo_inicio).toLocaleString("es-PE");
  drawInfoRow("Fecha Inicio:", fechaInicio);

  if (data.fecha_tiempo_fin) {
    const fechaFin = new Date(data.fecha_tiempo_fin).toLocaleString("es-PE");
    drawInfoRow("Fecha Fin:", fechaFin);
  }

  const tiempoHoras = Math.floor(data.fecha_tiempo_transcurrido / 3600);
  const tiempoMin = Math.floor((data.fecha_tiempo_transcurrido % 3600) / 60);
  const tiempoSeg = data.fecha_tiempo_transcurrido % 60;
  drawInfoRow("Tiempo:", `${tiempoHoras}h ${tiempoMin}m ${tiempoSeg}s`);
  drawInfoRow("Resultado Final:", data.resultado);
  yPosition += 10;

  for (let examIndex = 0; examIndex < data.evaluacion.examenes.length; examIndex++) {
    const exam = data.evaluacion.examenes[examIndex];
    const observacion = exam.observacion;

    addNewPageIfNeeded(35);

    doc.setFillColor(41, 65, 114);
    doc.rect(margin, yPosition, contentWidth, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`EXAMEN ${examIndex + 1}: ${exam.titulo.toUpperCase()}`, margin + 5, yPosition + 8);

    doc.setTextColor(0, 0, 0);
    yPosition += 18;

    if (observacion) {
      addNewPageIfNeeded(25);

      doc.setFillColor(255, 248, 225);
      doc.setDrawColor(255, 193, 7);
      doc.setLineWidth(0.3);

      const obsLines = doc.splitTextToSize(observacion, contentWidth - 20);
      const obsHeight = obsLines.length * 5 + 12;

      doc.rect(margin, yPosition, contentWidth, obsHeight, "FD");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(156, 110, 0);
      doc.text("OBSERVACION DEL EVALUADOR:", margin + 5, yPosition + 6);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 60, 0);
      doc.text(obsLines, margin + 5, yPosition + 14);

      doc.setTextColor(0, 0, 0);
      yPosition += obsHeight + 8;
    }

    if (exam.descripcion) {
      addNewPageIfNeeded(15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const descripcionLines = doc.splitTextToSize(exam.descripcion, contentWidth - 10);
      doc.text(descripcionLines, margin + 5, yPosition);
      yPosition += descripcionLines.length * 4 + 5;
      doc.setTextColor(0, 0, 0);
    }

    for (let qIndex = 0; qIndex < exam.preguntas.length; qIndex++) {
      const pregunta = exam.preguntas[qIndex];

      addNewPageIfNeeded(30);

      doc.setFillColor(248, 249, 250);
      doc.rect(margin, yPosition - 2, contentWidth, 8, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(41, 65, 114);
      doc.text(`Pregunta ${qIndex + 1}`, margin + 3, yPosition + 4);
      doc.setTextColor(0, 0, 0);
      yPosition += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const contenidoClean = stripHtml(pregunta.contenido);
      const contenidoLines = doc.splitTextToSize(contenidoClean, contentWidth - 10);
      doc.text(contenidoLines, margin + 5, yPosition);
      yPosition += contenidoLines.length * 5 + 4;

      if (
        pregunta.tipo_de_pregunta === "alternativa_unica" ||
        pregunta.tipo_de_pregunta === "alternativa_peso"
      ) {
        doc.setFontSize(9);
        for (const [key, value] of Object.entries(pregunta.alternativas)) {
          addNewPageIfNeeded(10);
          const isSelected = pregunta.respuestas.includes(key);

          if (isSelected) {
            doc.setFillColor(232, 245, 233);
            doc.rect(margin + 8, yPosition - 3, contentWidth - 16, 6, "F");
            doc.setTextColor(46, 125, 50);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(80, 80, 80);
            doc.setFont("helvetica", "normal");
          }

          const marker = isSelected ? "[X]" : "[  ]";
          const alternativaText = `${marker} ${key}: ${value}`;
          const altLines = doc.splitTextToSize(alternativaText, contentWidth - 20);
          doc.text(altLines, margin + 10, yPosition);
          yPosition += altLines.length * 4 + 3;

          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
      } else if (pregunta.tipo_de_pregunta === "sola_respuesta") {
        addNewPageIfNeeded(15);

        doc.setFillColor(232, 245, 233);
        doc.rect(margin + 5, yPosition - 2, contentWidth - 10, 12, "F");

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(46, 125, 50);
        doc.text("Respuesta:", margin + 8, yPosition + 4);

        doc.setFont("helvetica", "normal");
        const respuestaText =
          pregunta.respuestas.length > 0
            ? pregunta.respuestas.join(", ")
            : "(Sin respuesta)";
        const respLines = doc.splitTextToSize(respuestaText, contentWidth - 40);
        doc.text(respLines, margin + 35, yPosition + 4);
        yPosition += 15;

        doc.setTextColor(0, 0, 0);
      }

      yPosition += 5;
    }

    yPosition += 10;
  }

  addNewPageIfNeeded(20);
  doc.setDrawColor(200, 200, 200);
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

  const fileName = `reporte_evaluacion_${postulante?.documento || data.postulante_id}.pdf`;
  doc.save(fileName);
};
