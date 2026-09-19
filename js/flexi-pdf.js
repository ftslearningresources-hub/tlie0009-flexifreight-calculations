import { buildPdf } from "./pdf.js";

const displayNumber = (value, digits = 3) => Number(value).toLocaleString("en-AU", { maximumFractionDigits: digits });
const displayDate = (value) => new Date(value).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });

export function flexiEvidenceLines({ state, config }) {
  const mass = state.fields.mass || {};
  const volume = state.fields.volume || {};
  return [
    config.title, "Assessment evidence record", "", `Learner: ${state.learner?.name || "Not recorded"}`, `Unit: ${config.unitCode}`, `Assessment task: ${config.task}`, `Completion code: ${state.completion?.code || "Not completed"}`, `Completed: ${state.completion?.completedAt ? displayDate(state.completion.completedAt) : "Not completed"}`, "", "VERIFIED RESULTS", `Load mass: ${mass.result ? `${displayNumber(mass.result, 0)} kg` : "Not recorded"}`, `Load volume: ${volume.result ? `${displayNumber(volume.result)} cubic metres` : "Not recorded"}`, "", "CALCULATION RECORD", `Digital calculator: ${(mass.expression || "Not recorded").replace(/[×*]/g, " x ")} = ${mass.result ? `${displayNumber(mass.result, 0)} kg` : "Not recorded"}`, `Load calculator: ${volume.lengthM || "Not recorded"} m x ${volume.widthM || "Not recorded"} m x ${volume.heightM || "Not recorded"} m = ${volume.result ? `${displayNumber(volume.result)} cubic metres` : "Not recorded"}`, "", "This report is learner-provided evidence only. It is not authenticated evidence and does not make a final competency decision."
  ];
}

export function downloadFlexiEvidencePdf({ state, config }) {
  const url = URL.createObjectURL(buildPdf(flexiEvidenceLines({ state, config })));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${config.slug}-evidence.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
