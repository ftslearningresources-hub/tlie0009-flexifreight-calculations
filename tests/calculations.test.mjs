import test from "node:test";
import assert from "node:assert/strict";
import { calculateVolume, evaluateExpression, isCorrectMassCalculation, isCorrectVolumeCalculation } from "../js/calculations.js";

import { flexiEvidenceLines } from "../js/flexi-pdf.js";
const massTask = { pallets: 18, palletMassKg: 995, expectedKg: 17910 };
const volumeTask = { lengthM: 9.6, widthM: 2.4, heightM: 1.2, expectedM3: 27.648 };

test("evaluates the prescribed pallet-mass calculation", () => {
  assert.deepEqual(evaluateExpression("18×995"), { left: 18, operation: "*", right: 995, result: 17910 });
  assert.equal(isCorrectMassCalculation("995*18", massTask), true);
  assert.equal(isCorrectMassCalculation("18+995", massTask), false);
});
test("calculates and verifies the prescribed load volume", () => {
  assert.equal(calculateVolume(volumeTask), 27.648);
  assert.equal(isCorrectVolumeCalculation(volumeTask, volumeTask), true);
  assert.equal(isCorrectVolumeCalculation({ ...volumeTask, heightM: 1.3 }, volumeTask), false);
});
test("FlexiFreight evidence report records the learner name", () => {
  const lines = flexiEvidenceLines({ state: { learner: { name: "David Leinen" }, fields: {}, completion: { code: "E0009-DL-1909" } }, config: { title: "Test", unitCode: "TLIE0009", task: "03A" } });
  assert.ok(lines.includes("Learner: David Leinen"));
});
