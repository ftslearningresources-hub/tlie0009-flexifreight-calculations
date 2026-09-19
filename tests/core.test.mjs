import test from "node:test";
import assert from "node:assert/strict";
import { SimulatorStore, canOpenStage, completeStage, completionCode, finishAttempt, freshState, learnerInitials } from "../js/core.js";
import { buildPdf, evidenceLines } from "../js/pdf.js";

const config = { slug: "test-sim", completionPrefix: "TST", stages: [{ id: "one" }, { id: "two" }] };
function memory(value = null) { return { value, getItem() { return this.value; }, setItem(key, next) { this.value = next; } }; }
test("malformed stored state returns a fresh attempt", () => { const store = new SimulatorStore(config, memory("not json")); assert.equal(store.load().activeStage, "one"); });
test("saved state persists learner evidence events", () => { const storage = memory(); const store = new SimulatorStore(config, storage); const state = freshState(config); state.events.push({ type: "attempt_started" }); store.save(state); assert.equal(store.load().events[0].type, "attempt_started"); });
test("workflow prevents skipped stages and records a learner-initials completion code", () => { const state = freshState(config); state.learner = { name: "Ava Brown", initials: learnerInitials("Ava Brown") }; assert.equal(canOpenStage(config, state, "two"), false); assert.throws(() => completeStage(config, state, "two", { response: "x" })); completeStage(config, state, "one", { response: "x" }); completeStage(config, state, "two", { response: "y" }); finishAttempt(config, state); assert.match(state.completion.code, /^TST-AB-\d{4}$/); });
test("completion code combines unit prefix, learner initials and day/month", () => { assert.equal(completionCode({ prefix: "K2010", initials: "ab", date: new Date(2026, 8, 15) }), "K2010-AB-1509"); });
test("evidence PDF contains the assessment disclaimer", async () => { const state = freshState(config); state.completion = { code: "TST-A-1509", completedAt: "2026-09-15T00:00:00Z" }; const lines = evidenceLines({ title: "Test activity", state, config }); assert.match(lines.at(-1), /learner-provided evidence/i); const bytes = await buildPdf(lines).text(); assert.match(bytes, /^%PDF-1\.4/); });
