export const runEstimation = (estimation) => {
  const livestockType = estimation.livestockType;

  if (livestockType === "poultry") {
    return runPoultryEstimation(estimation);
  }

  if (livestockType === "cattle") {
    return runCattleEstimation(estimation);
  }

  throw new Error("Unsupported livestock type");
};

const runPoultryEstimation = (estimation) => {
  const productionSetup = estimation.productionSetup || {};
  const housingInfrastructure = estimation.housingInfrastructure || {};
  const feedOperations = estimation.feedOperations || {};
  const healthManagement = estimation.healthManagement || {};
  const marketInputs = estimation.marketInputs || {};

  const numberOfAnimals = productionSetup.numberOfAnimals || 0;
  const cycleDuration = productionSetup.cycleDuration || 0;

  // Manual costs from user input
  const feedPrice = feedOperations.feedPrice || 0;
  const laborCost = feedOperations.laborCost || 0;
  const electricityCost = feedOperations.electricityCost || 0;

  const mortalityRate = healthManagement.mortalityRate || 0;

  const sellingPricePerKg = marketInputs.sellingPricePerKg || 0;
  const eggPricePerEgg = marketInputs.eggPricePerEgg || 0;

  // Optional derived/default costs
  const housingCost = getPoultryHousingCost(
    numberOfAnimals,
    housingInfrastructure
  );

  const equipmentCost = getEquipmentCost(
    numberOfAnimals,
    housingInfrastructure.equipment
  );

  const vaccinationCost = getVaccinationCost(
    numberOfAnimals,
    healthManagement.vaccinationProgram
  );

  const medicationCost = getMedicationCost(
    numberOfAnimals,
    healthManagement.medicationIntensity
  );

  const vetServiceCost = getVetServiceCost(
    numberOfAnimals,
    healthManagement.vetServiceFrequency
  );

  const totalCostEstimation =
    feedPrice +
    laborCost +
    electricityCost +
    housingCost +
    equipmentCost +
    vaccinationCost +
    medicationCost +
    vetServiceCost;

  const survivingAnimals = numberOfAnimals * (1 - mortalityRate / 100);

  let projectedRevenue = 0;

  // Poultry revenue rule
  if (productionSetup.productionType === "broiler") {
    const averageWeightPerBird = 2; // placeholder rule
    projectedRevenue =
      survivingAnimals * averageWeightPerBird * sellingPricePerKg;
  } else if (productionSetup.productionType === "layer") {
    const eggsPerBird = cycleDuration * 5; // placeholder rule
    projectedRevenue = survivingAnimals * eggsPerBird * eggPricePerEgg;
  }

  const projectedProfit = projectedRevenue - totalCostEstimation;
  const roi =
    totalCostEstimation > 0
      ? (projectedProfit / totalCostEstimation) * 100
      : 0;

  return {
    totalCostEstimation,
    projectedRevenue,
    projectedProfit,
    roi,
    costBreakdown: {
      feedPrice,
      laborCost,
      electricityCost,
      housingCost,
      equipmentCost,
      vaccinationCost,
      medicationCost,
      vetServiceCost,
    },
  };
};

const runCattleEstimation = (estimation) => {
  const productionSetup = estimation.productionSetup || {};
  const housingInfrastructure = estimation.housingInfrastructure || {};
  const feedOperations = estimation.feedOperations || {};
  const healthManagement = estimation.healthManagement || {};
  const marketInputs = estimation.marketInputs || {};

  const numberOfAnimals = productionSetup.numberOfAnimals || 0;
  const cycleDuration = productionSetup.cycleDuration || 0;

  const feedPrice = feedOperations.feedPrice || 0;
  const laborCost = feedOperations.laborCost || 0;
  const electricityCost = feedOperations.electricityCost || 0;

  const mortalityRate = healthManagement.mortalityRate || 0;

  const sellingPricePerKg = marketInputs.sellingPricePerKg || 0;
  const milkPricePerLiter = marketInputs.milkPricePerLiter || 0;

  const housingCost = getCattleHousingCost(
    numberOfAnimals,
    housingInfrastructure
  );

  const equipmentCost = getEquipmentCost(
    numberOfAnimals,
    housingInfrastructure.equipment
  );

  const vaccinationCost = getVaccinationCost(
    numberOfAnimals,
    healthManagement.vaccinationProgram
  );

  const medicationCost = getMedicationCost(
    numberOfAnimals,
    healthManagement.medicationIntensity
  );

  const vetServiceCost = getVetServiceCost(
    numberOfAnimals,
    healthManagement.vetServiceFrequency
  );

  const totalCostEstimation =
    feedPrice +
    laborCost +
    electricityCost +
    housingCost +
    equipmentCost +
    vaccinationCost +
    medicationCost +
    vetServiceCost;

  const survivingAnimals = numberOfAnimals * (1 - mortalityRate / 100);

  let projectedRevenue = 0;

  // Cattle revenue rule
  if (productionSetup.productionType === "beef") {
    const averageWeightPerCattle = 250; // placeholder rule
    projectedRevenue =
      survivingAnimals * averageWeightPerCattle * sellingPricePerKg;
  } else if (productionSetup.productionType === "dairy") {
    const milkProductionPerCowPerMonth = 120; // placeholder rule
    projectedRevenue =
      survivingAnimals *
      milkProductionPerCowPerMonth *
      cycleDuration *
      milkPricePerLiter;
  }

  const projectedProfit = projectedRevenue - totalCostEstimation;
  const roi =
    totalCostEstimation > 0
      ? (projectedProfit / totalCostEstimation) * 100
      : 0;

  return {
    totalCostEstimation,
    projectedRevenue,
    projectedProfit,
    roi,
    costBreakdown: {
      feedPrice,
      laborCost,
      electricityCost,
      housingCost,
      equipmentCost,
      vaccinationCost,
      medicationCost,
      vetServiceCost,
    },
  };
};

const getPoultryHousingCost = (numberOfAnimals, housingInfrastructure) => {
  if (housingInfrastructure?.hasHousing) return 0;

  const housingType = housingInfrastructure?.housingType || "basic";

  if (housingType === "standard") return numberOfAnimals * 2500;
  if (housingType === "premium") return numberOfAnimals * 4000;

  return numberOfAnimals * 1500;
};

const getCattleHousingCost = (numberOfAnimals, housingInfrastructure) => {
  if (housingInfrastructure?.hasHousing) return 0;

  const housingType = housingInfrastructure?.housingType || "basic";

  if (housingType === "standard") return numberOfAnimals * 80000;
  if (housingType === "premium") return numberOfAnimals * 150000;

  return numberOfAnimals * 50000;
};

const getEquipmentCost = (numberOfAnimals, equipment = []) => {
  if (!equipment || equipment.length === 0) return 0;

  return equipment.length * numberOfAnimals * 50;
};

const getVaccinationCost = (numberOfAnimals, vaccinationProgram) => {
  if (vaccinationProgram === "intensive") return numberOfAnimals * 500;
  if (vaccinationProgram === "standard") return numberOfAnimals * 250;
  if (vaccinationProgram === "minimal") return numberOfAnimals * 100;

  return 0;
};

const getMedicationCost = (numberOfAnimals, medicationIntensity) => {
  if (medicationIntensity === "high") return numberOfAnimals * 400;
  if (medicationIntensity === "medium") return numberOfAnimals * 200;
  if (medicationIntensity === "low") return numberOfAnimals * 100;

  return 0;
};

const getVetServiceCost = (numberOfAnimals, vetServiceFrequency) => {
  if (vetServiceFrequency === "weekly") return numberOfAnimals * 300;
  if (vetServiceFrequency === "monthly") return numberOfAnimals * 150;
  if (vetServiceFrequency === "quarterly") return numberOfAnimals * 75;

  return 0;
};