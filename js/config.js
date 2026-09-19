export const simulator = {
  slug: "tlie0009-flexifreight-calculations",
  title: "FlexiFreight Digital Calculation Tools Simulator",
  unitCode: "TLIE0009",
  task: "03A Activity 2.4",
  systemName: "Workplace Operations System",
  systemType: "Guided scenario",
  kitVersion: "1.0.0",
  completionPrefix: "E0009",
  stages: [
    { id: "review", label: "Review job", prompt: "Open the current workplace job", instruction: "Review the job details and identify the record you need to work with.", field: { id: "reference", label: "Job reference", hint: "Enter the relevant reference from the task materials." } },
    { id: "action", label: "Update system", prompt: "Process the workplace update", instruction: "Use the simulated system to record the workplace action required for this job.", field: { id: "action", label: "System update", hint: "Use the supplied procedure and workplace terminology." } },
    { id: "confirm", label: "Finalise job", prompt: "Confirm the completed job", instruction: "Check the system record, then finalise the job in line with the workplace procedure.", field: { id: "confirmation", label: "Final check", hint: "Briefly state what you checked before finalising." } }
  ]
};
