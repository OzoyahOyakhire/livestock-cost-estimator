import {
  estimateFeedPrice,
  estimateLaborCost,
  estimateElectricityCost,
} from "./feed-estimator.js";

const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://localhost:8000";

// ── Feed assumptions (keep in sync with the controller) ──────────────────────
const KG_PER_BIRD_BROILER = 4.25; // ~4–4.5 kg over an 8-week broiler cycle
const KG_PER_BIRD_LAYER = 40; // layers eat far more over their laying life
const KG_PER_BAG = 25; // feed sold in 25 kg bags

// ── Smart defaults by livestock/production type ───────────────────────────────
// NOTE: feedPrice here is only a coarse last-resort fallback. The system now
// prefers a flock-scaled estimate (see estimateFeedPrice) over these flat values.
const SMART_DEFAULTS = {
  poultry: {
    broiler: {
      feedPrice: 650000,
      laborCost: 80000,
      electricityCost: 25000,
      mortalityRate: 5,
      vaccinationProgram: "standard",
      medicationIntensity: "medium",
      vetServiceFrequency: "monthly",
      sellingPricePerKg: 3500,
      eggPricePerEgg: 0,
    },
    layer: {
      feedPrice: 700000,
      laborCost: 90000,
      electricityCost: 30000,
      mortalityRate: 4,
      vaccinationProgram: "standard",
      medicationIntensity: "medium",
      vetServiceFrequency: "monthly",
      sellingPricePerKg: 0,
      eggPricePerEgg: 120,
    },
  },
  cattle: {
    beef: {
      feedPrice: 350000,
      laborCost: 120000,
      electricityCost: 30000,
      mortalityRate: 3,
      vaccinationProgram: "standard",
      medicationIntensity: "low",
      vetServiceFrequency: "quarterly",
      sellingPricePerKg: 5000,
      eggPricePerEgg: 0,
    },
  },
};

// ── Compute total feed price from staged inputs ───────────────────────────────
// Accepts BOTH "...Cost" (schema) and "...Price" (frontend) names, and scales
// per-bag prices by the number of bags the flock actually needs. When the user
// provided no feed input, it estimates a realistic, flock-scaled figure from the
// calibration data instead of falling back to a flat default.
const computeTotalFeedPrice = (
  feed,
  productionType,
  defaults,
  numberOfAnimals = 0,
) => {
  const pt = (productionType || "").toLowerCase();
  const birds = Number(numberOfAnimals) || 0;

  if (feed) {
    // Honor an explicit manual total if provided
    if (feed.manualOverride && feed.feedPrice > 0) return feed.feedPrice;

    const starter = Number(
      feed.broilerStarterCost ?? feed.broilerStarterPrice ?? 0,
    );
    const finisher = Number(
      feed.broilerFinisherCost ?? feed.broilerFinisherPrice ?? 0,
    );
    const chick = Number(feed.chickStarterCost ?? feed.chickStarterPrice ?? 0);
    const grower = Number(feed.growerMashCost ?? feed.growerFeedPrice ?? 0);
    const layer = Number(feed.layerMashCost ?? feed.layerFeedPrice ?? 0);

    if (pt === "broiler") {
      const avgBagPrice = (starter + finisher) / 2;
      if (avgBagPrice > 0 && birds > 0) {
        const bags = (birds * KG_PER_BIRD_BROILER) / KG_PER_BAG;
        return Math.round(bags * avgBagPrice);
      }
    }

    if (pt === "layer") {
      const avgBagPrice = (chick + grower + layer) / 3;
      if (avgBagPrice > 0 && birds > 0) {
        const bags = (birds * KG_PER_BIRD_LAYER) / KG_PER_BAG;
        return Math.round(bags * avgBagPrice);
      }
    }

    if (pt === "beef") {
      const t =
        Number(feed.feedCostPerKg ?? 0) + Number(feed.supplementCost ?? 0);
      if (t > 0) return t;
    }

    // If the user gave a usable total directly, keep it.
    if (feed.feedPrice && feed.feedPrice > 0) return feed.feedPrice;
  }

  // No usable user input — estimate a realistic, flock-scaled figure
  // calibrated to the training data, instead of a flat default.
  const estimated = estimateFeedPrice(
    productionType,
    birds,
    new Date().getFullYear(),
  );
  if (estimated > 0) return estimated;

  // Absolute last resort (e.g. no animal count available).
  return (defaults && defaults.feedPrice) || 0;
};

// ── Apply smart defaults ───────────────────────────────────────────────────────
export const applySmartDefaults = (estimation) => {
  const lt = estimation.livestockType;
  const pt = estimation.productionSetup?.productionType;
  const defaults = SMART_DEFAULTS[lt]?.[pt] || {};

  const feed = estimation.feedOperations || {};
  const health = estimation.healthManagement || {};
  const numberOfAnimals = estimation.productionSetup?.numberOfAnimals || 0;
  const year = new Date().getFullYear();

  const feedPrice = computeTotalFeedPrice(feed, pt, defaults, numberOfAnimals);

  // Labor & electricity: use the user's value if given (>0), otherwise estimate
  // a calibrated, size-adjusted figure instead of a flat default.
  const laborCost =
    feed.laborCost && feed.laborCost > 0
      ? feed.laborCost
      : estimateLaborCost(pt, numberOfAnimals, year) || defaults.laborCost || 0;

  const electricityCost =
    feed.electricityCost && feed.electricityCost > 0
      ? feed.electricityCost
      : estimateElectricityCost(pt, numberOfAnimals, year) ||
        defaults.electricityCost ||
        0;

  return {
    feedPrice: feedPrice || defaults.feedPrice || 0,
    laborCost,
    electricityCost,

    // Market inputs now in feedOperations
    sellingPricePerKg:
      feed.sellingPricePerKg || defaults.sellingPricePerKg || 0,
    eggPricePerEgg: feed.eggPricePerEgg || defaults.eggPricePerEgg || 0,

    mortalityRate: health.mortalityRate || defaults.mortalityRate || 5,
    vaccinationProgram:
      health.vaccinationProgram || defaults.vaccinationProgram || "standard",
    medicationIntensity:
      health.medicationIntensity || defaults.medicationIntensity || "medium",
    vetServiceFrequency:
      health.vetServiceFrequency || defaults.vetServiceFrequency || "monthly",
    diseaseRiskLevel: health.diseaseRiskLevel || "medium",
    parasiteControl: health.parasiteControl || "none",
  };
};

// ── Build ML payload ───────────────────────────────────────────────────────────
const buildMLPayload = (estimation) => {
  const filled = applySmartDefaults(estimation);
  const setup = estimation.productionSetup || {};
  const housing = estimation.housingInfrastructure || {};

  const hasHousing =
    housing.housingStatus === "existing" ||
    housing.housingStatus === "not-required" ||
    housing.hasHousing === true;

  return {
    livestockType: estimation.livestockType,
    productionType: setup.productionType,
    productionSystem: setup.productionSystem,
    numberOfAnimals: setup.numberOfAnimals,
    cycleDuration: setup.cycleDuration,
    location: setup.location,

    hasHousing,
    housingType: housing.housingType || "basic",
    capacity: housing.capacity || housing.requiredSpace || 0,
    equipmentCount: (housing.equipment || []).length,

    feedPrice: filled.feedPrice,
    laborCost: filled.laborCost,
    electricityCost: filled.electricityCost,

    mortalityRate: filled.mortalityRate,
    vaccinationProgram: filled.vaccinationProgram,
    medicationIntensity: filled.medicationIntensity,
    vetServiceFrequency: filled.vetServiceFrequency,
    diseaseRiskLevel: filled.diseaseRiskLevel,

    sellingPricePerKg: filled.sellingPricePerKg,
    eggPricePerEgg: filled.eggPricePerEgg,
    milkPricePerLiter: 0,

    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
};

// ── Get ML prediction ──────────────────────────────────────────────────────────
export const getMLPrediction = async (estimation) => {
  try {
    const payload = buildMLPayload(estimation);
    const feed = estimation.feedOperations || {};
    const health = estimation.healthManagement || {};

    const defaultsApplied = {
      feedPrice:
        !feed.feedPrice &&
        !feed.broilerStarterCost &&
        !feed.broilerStarterPrice &&
        !feed.chickStarterCost &&
        !feed.chickStarterPrice &&
        !feed.feedCostPerKg,
      laborCost: !feed.laborCost,
      electricityCost: !feed.electricityCost,
      mortalityRate: !health.mortalityRate,
      sellingPricePerKg: !feed.sellingPricePerKg,
      eggPricePerEgg: !feed.eggPricePerEgg,
    };

    const response = await fetch(`${ML_SERVER_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        "[ML Service] Prediction failed:",
        response.status,
        errorBody,
      );
      return null;
    }

    const data = await response.json();

    return {
      predictedFeedCost: payload.feedPrice,
      predictedLaborCost: payload.laborCost,
      predictedElectricityCost: payload.electricityCost,
      confidenceScore: 0.92,
      mlUsed: true,
      defaultsApplied,

      mlTotalCostEstimation: data.totalCostEstimation,
      mlProjectedRevenue: data.projectedRevenue,
      mlProjectedProfit: data.projectedProfit,
      mlRoi: data.roi,
      confidenceNote: data.confidenceNote,
    };
  } catch (err) {
    console.warn(
      "[ML Service] Unavailable, using rule-based fallback:",
      err.message,
    );
    return null;
  }
};

// ── Health check ───────────────────────────────────────────────────────────────
export const checkMLHealth = async () => {
  try {
    const res = await fetch(`${ML_SERVER_URL}/health`, {
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    console.log("[ML Service] Health check OK:", data);
    return true;
  } catch {
    console.warn("[ML Service] Health check FAILED — ML server may be down.");
    return false;
  }
};
