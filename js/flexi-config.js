export const simulator = {
  slug: "tlie0009-flexifreight-calculations",
  title: "FlexiFreight Digital Calculation Tools Simulator",
  unitCode: "TLIE0009",
  task: "03A Activity 2.4",
  systemName: "FlexiFreight Operations",
  systemType: "Digital calculation tools",
  kitVersion: "1.0.0",
  completionPrefix: "E0009",
  stages: [
    { id: "mass", label: "1. Load mass", prompt: "Use the digital calculator", instruction: "Check the mass of 18 loaded pallets at 995 kg each." },
    { id: "volume", label: "2. Load volume", prompt: "Use the load calculator", instruction: "Calculate the cubic volume from the supplied load dimensions." }
  ],
  massTask: { pallets: 18, palletMassKg: 995, expectedKg: 17910 },
  volumeTask: { lengthM: 9.6, widthM: 2.4, heightM: 1.2, expectedM3: 27.648 },
  evidence: {
    mode: "learner-provided",
    pdfReport: true,
    localStorageOnly: true
  }
};
