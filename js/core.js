export const KIT_VERSION = "1.0.0";

export function safeParse(value, fallback) { try { return JSON.parse(value); } catch { return fallback; } }
export function dateStamp(date = new Date()) { return `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}`; }
export function learnerInitials(name) { return String(name || "").trim().split(/\s+/).filter(Boolean).map((word) => word[0]).join("").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4); }
export function completionCode({ prefix, initials, date = new Date() }) { const marker = String(initials || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4); if (marker.length < 2) throw new Error("Enter the learner's first and last name before finalising."); return `${String(prefix).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}-${marker}-${dateStamp(date)}`; }
export function freshState(config) { const attemptId = globalThis.crypto?.randomUUID?.() || `attempt-${Date.now()}`; const createdAt = new Date().toISOString(); return { schemaVersion: 1, attemptId, createdAt, learner: null, activeStage: config.stages[0].id, completedStages: [], fields: {}, events: [{ type: "attempt_started", detail: {}, at: createdAt }], completion: null }; }
export class SimulatorStore {
  constructor(config, storage = globalThis.localStorage) { this.config = config; this.storage = storage; this.key = `fts:sim:${config.slug}:v1`; }
  load() { const candidate = safeParse(this.storage?.getItem(this.key), null); return candidate && candidate.schemaVersion === 1 && Array.isArray(candidate.events) ? candidate : freshState(this.config); }
  save(state) { this.storage?.setItem(this.key, JSON.stringify(state)); return state; }
  reset() { const state = freshState(this.config); this.save(state); return state; }
}
export function recordEvent(state, type, detail = {}) { state.events.push({ type, detail, at: new Date().toISOString() }); return state; }
export function canOpenStage(config, state, stageId) { const index = config.stages.findIndex((stage) => stage.id === stageId); return index >= 0 && (index === 0 || state.completedStages.includes(config.stages[index - 1].id)); }
export function completeStage(config, state, stageId, fields) { if (!canOpenStage(config, state, stageId)) throw new Error("Stage is not available yet."); if (Object.values(fields).some((value) => !String(value || "").trim())) throw new Error("Complete the required field before continuing."); state.fields[stageId] = fields; if (!state.completedStages.includes(stageId)) state.completedStages.push(stageId); recordEvent(state, "stage_completed", { stageId }); const next = config.stages[config.stages.findIndex((stage) => stage.id === stageId) + 1]; state.activeStage = next?.id || stageId; return state; }
export function finishAttempt(config, state) { if (state.completedStages.length !== config.stages.length) throw new Error("Complete every stage before finishing."); if (!state.learner?.initials) throw new Error("Enter the learner's first and last name before finalising."); if (!state.completion) { state.completion = { code: completionCode({ prefix: config.completionPrefix, initials: state.learner.initials }), completedAt: new Date().toISOString() }; recordEvent(state, "attempt_completed", state.completion); } return state; }
