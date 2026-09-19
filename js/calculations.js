const expressionPattern = /^(\d+(?:\.\d+)?)\s*([+*/-])\s*(\d+(?:\.\d+)?)$/;

export function evaluateExpression(expression) {
  const match = String(expression || "").trim().replace(/[xX×]/g, "*").match(expressionPattern);
  if (!match) return null;
  const left = Number(match[1]);
  const right = Number(match[3]);
  const operation = match[2];
  const result = operation === "+" ? left + right : operation === "-" ? left - right : operation === "*" ? left * right : right === 0 ? null : left / right;
  return Number.isFinite(result) ? { left, operation, right, result } : null;
}

export function isCorrectMassCalculation(expression, task) {
  const calculation = evaluateExpression(expression);
  if (!calculation || calculation.operation !== "*") return false;
  const operands = [calculation.left, calculation.right].sort((a, b) => a - b);
  const expected = [task.pallets, task.palletMassKg].sort((a, b) => a - b);
  return operands[0] === expected[0] && operands[1] === expected[1] && calculation.result === task.expectedKg;
}

export function calculateVolume({ lengthM, widthM, heightM }) {
  const values = [lengthM, widthM, heightM].map(Number);
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null;
  return values[0] * values[1] * values[2];
}

export function isCorrectVolumeCalculation(values, task) {
  const supplied = [Number(values.lengthM), Number(values.widthM), Number(values.heightM)];
  const expected = [task.lengthM, task.widthM, task.heightM];
  if (supplied.some((value, index) => value !== expected[index])) return false;
  const result = calculateVolume(values);
  return result !== null && Math.abs(result - task.expectedM3) < 0.000001;
}
