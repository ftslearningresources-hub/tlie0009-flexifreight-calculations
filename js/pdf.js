function ascii(value) { return String(value ?? "").replace(/[^\x20-\x7E]/g, "?"); }
function escapePdf(value) { return ascii(value).replace(/([\\()])/g, "\\$1"); }
function wrap(text, width = 88) { const words = ascii(text).split(/\s+/); const lines = []; let line = ""; for (const word of words) { if (`${line} ${word}`.trim().length > width) { if (line) lines.push(line); line = word; } else line = `${line} ${word}`.trim(); } if (line) lines.push(line); return lines; }
export function evidenceLines({ title, state, config }) { return [title, `Learner: ${state.learner?.name || "Not recorded"}`, `Unit: ${config.unitCode}`, `Task: ${config.task}`, `Completion code: ${state.completion?.code || "Not completed"}`, `Completed: ${state.completion?.completedAt || "Not completed"}`, "", "Activity record:", ...state.events.map((event) => `${event.at} - ${event.type}`), "", "This report is learner-provided evidence only. It is not authenticated evidence and does not make a final competency decision."]; }
export function buildPdf(lines) {
  const wrapped = lines.flatMap((line) => String(line).trim() ? wrap(line) : [""]);
  const content = wrapped.map((line, index) => {
    const title = index === 0;
    const subtitle = line === "Assessment evidence record";
    const section = /^[A-Z][A-Z ]+$/.test(line) && line.length > 3;
    const size = title ? 18 : subtitle ? 12 : section ? 11 : 10;
    const colour = title || subtitle || section ? "0.08 0.19 0.37 rg" : "0.08 0.14 0.17 rg";
    return line ? `BT /F1 ${size} Tf ${colour} 48 ${790 - (index * 16)} Td (${escapePdf(line)}) Tj ET` : "";
  }).join("\n");
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>", `<< /Length ${content.length} >>\nstream\n${content}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
export function downloadEvidencePdf({ title, state, config }) { const url = URL.createObjectURL(buildPdf(evidenceLines({ title, state, config }))); const link = document.createElement("a"); link.href = url; link.download = `${config.slug}-evidence.pdf`; link.click(); URL.revokeObjectURL(url); }
