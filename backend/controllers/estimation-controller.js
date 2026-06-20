import Estimation from "../models/estimation.js";
import { StatusCodes } from "http-status-codes";
import { runEstimation } from "../service/estimation-service.js";
import { getMLPrediction, applySmartDefaults } from "../service/ml-service.js";
import {
  estimateFeedPrice,
  checkFeedPriceReasonable,
} from "../service/feed-estimator.js";

// ── Feed assumptions (tune to your context) ──────────────────────────────────
const KG_PER_BIRD_BROILER = 4.25; // ~4–4.5 kg over an 8-week broiler cycle
const KG_PER_BIRD_LAYER = 40; // layers eat far more over their laying life
const KG_PER_BAG = 25; // feed sold in 25 kg bags

// ── Compute total feedPrice from staged inputs ────────────────────────────────
// Accepts BOTH the frontend's "...Price" names and the schema's "...Cost" names,
// scales per-bag prices by flock size, and — when no usable input is given —
// estimates a realistic, flock-scaled figure from calibration data.
const computeTotalFeedPrice = (feed, productionType, numberOfAnimals = 0) => {
  const pt = (productionType || "").toLowerCase();
  const birds = Number(numberOfAnimals) || 0;

  if (feed) {
    // Honor an explicit manual total if the user overrode it
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
      const total =
        Number(feed.feedCostPerKg ?? 0) + Number(feed.supplementCost ?? 0);
      if (total > 0) return total;
    }

    if (feed.feedPrice && feed.feedPrice > 0) return feed.feedPrice;
  }

  // No usable input — estimate from flock size + year (calibrated).
  const estimated = estimateFeedPrice(
    productionType,
    birds,
    new Date().getFullYear(),
  );
  if (estimated > 0) return estimated;

  return 0;
};

// Normalize incoming feed body: map frontend "...Price" names onto the schema's
// "...Cost" names so Mongoose actually persists them (it silently drops unknown keys).
const normalizeFeedBody = (b = {}) => ({
  // Poultry broiler staged feed
  broilerStarterCost: Number(
    b.broilerStarterCost ?? b.broilerStarterPrice ?? 0,
  ),
  broilerFinisherCost: Number(
    b.broilerFinisherCost ?? b.broilerFinisherPrice ?? 0,
  ),

  // Poultry layer staged feed
  chickStarterCost: Number(b.chickStarterCost ?? b.chickStarterPrice ?? 0),
  growerMashCost: Number(b.growerMashCost ?? b.growerFeedPrice ?? 0),
  layerMashCost: Number(b.layerMashCost ?? b.layerFeedPrice ?? 0),

  // Cattle feed
  feedCostPerKg: Number(b.feedCostPerKg ?? 0),
  supplementCost: Number(b.supplementCost ?? 0),
  grazingAvailability: b.grazingAvailability ?? false,

  // Manual override (frontend calls it overrideFeedPrice)
  manualOverride: b.manualOverride ?? b.overrideFeedPrice ?? false,

  // Shared operating costs
  laborCost: Number(b.laborCost ?? 0),
  electricityCost: Number(b.electricityCost ?? 0),

  // Market inputs
  sellingPricePerKg: Number(b.sellingPricePerKg ?? 0),
  eggPricePerEgg: Number(b.eggPricePerEgg ?? 0),
});

// Did the user actually enter any feed value? (controls whether we range-check)
const userEnteredFeed = (b = {}) =>
  Number(b.broilerStarterCost ?? b.broilerStarterPrice ?? 0) > 0 ||
  Number(b.broilerFinisherCost ?? b.broilerFinisherPrice ?? 0) > 0 ||
  Number(b.chickStarterCost ?? b.chickStarterPrice ?? 0) > 0 ||
  Number(b.growerMashCost ?? b.growerFeedPrice ?? 0) > 0 ||
  Number(b.layerMashCost ?? b.layerFeedPrice ?? 0) > 0 ||
  Number(b.feedCostPerKg ?? 0) > 0 ||
  Number(b.feedPrice ?? 0) > 0;

// ── Step controllers ──────────────────────────────────────────────────────────

const createEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.create({
      user: req.user.id,
      livestockType: req.body.livestockType,
      currentStep: 1,
    });
    res.status(StatusCodes.CREATED).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

// Step 2 — Production setup
const updateStep2 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.productionSetup = req.body;
    estimation.currentStep = 2;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

// Step 3 — Housing & infrastructure
const updateStep3 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.housingInfrastructure = req.body;

    const status = req.body.housingStatus;
    estimation.housingInfrastructure.hasHousing =
      status === "existing" || status === "not-required";

    estimation.currentStep = 3;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

// Step 4 — Feed & operations (includes sellingPricePerKg, eggPricePerEgg)
const updateStep4 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    // Map the frontend's field names onto the schema's field names so the
    // starter/finisher values actually get saved (Mongoose drops unknown keys).
    const mapped = normalizeFeedBody(req.body);
    estimation.feedOperations = mapped;

    const pt = estimation.productionSetup?.productionType;
    const birds = estimation.productionSetup?.numberOfAnimals;
    estimation.feedOperations.feedPrice = computeTotalFeedPrice(
      mapped,
      pt,
      birds,
    );

    estimation.currentStep = 4;
    await estimation.save();

    // Soft range-check ONLY if the user actually entered a feed value.
    let feedWarning = null;
    if (userEnteredFeed(req.body)) {
      const check = checkFeedPriceReasonable(
        estimation.feedOperations.feedPrice,
        pt,
        birds,
        new Date().getFullYear(),
      );
      if (!check.ok) feedWarning = check.message;
    }

    res.status(StatusCodes.OK).json({ success: true, estimation, feedWarning });
  } catch (error) {
    next(error);
  }
};

// Step 5 — Health management (final step)
const updateStep5 = async (req, res, next) => {
  const estimation = req.estimation;
  try {
    estimation.healthManagement = req.body;
    estimation.currentStep = 5;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

// ── Calculate — rule-based + ML ───────────────────────────────────────────────
const calculateEstimation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const estimation = await Estimation.findOne({ _id: id, user: req.user.id });

    if (!estimation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Estimation not found",
      });
    }

    // 1. Apply smart defaults for missing/zero fields
    const filled = applySmartDefaults(estimation);

    estimation.feedOperations.feedPrice = filled.feedPrice;
    estimation.feedOperations.laborCost = filled.laborCost;
    estimation.feedOperations.electricityCost = filled.electricityCost;
    estimation.feedOperations.sellingPricePerKg = filled.sellingPricePerKg;
    estimation.feedOperations.eggPricePerEgg = filled.eggPricePerEgg;
    estimation.healthManagement.mortalityRate = filled.mortalityRate;

    // 2. Run rule-based engine
    const ruleResults = runEstimation(estimation);

    estimation.results = {
      totalCostEstimation: ruleResults.totalCostEstimation,
      projectedRevenue: ruleResults.projectedRevenue,
      projectedProfit: ruleResults.projectedProfit,
      roi: ruleResults.roi,
    };

    estimation.costBreakdown = ruleResults.costBreakdown;
    estimation.status = "completed";

    // 3. Call ML server
    const mlOutput = await getMLPrediction(estimation);

    if (mlOutput) {
      estimation.modelOutput = {
        predictedFeedCost: mlOutput.predictedFeedCost,
        predictedLaborCost: mlOutput.predictedLaborCost,
        predictedElectricityCost: mlOutput.predictedElectricityCost,
        confidenceScore: mlOutput.confidenceScore,
      };
    }

    await estimation.save();

    // 4. Build response
    const responsePayload = {
      success: true,
      estimation,
      costBreakdown: ruleResults.costBreakdown,
    };

    if (mlOutput) {
      responsePayload.mlResults = {
        totalCostEstimation: mlOutput.mlTotalCostEstimation,
        projectedRevenue: mlOutput.mlProjectedRevenue,
        projectedProfit: mlOutput.mlProjectedProfit,
        roi: mlOutput.mlRoi,
        confidenceNote: mlOutput.confidenceNote,
        defaultsApplied: mlOutput.defaultsApplied,
      };
    }

    res.status(StatusCodes.OK).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

const getUserEstimations = async (req, res, next) => {
  try {
    const estimations = await Estimation.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });

    if (estimations.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        estimations: [],
        message: "No estimation yet",
      });
    }

    return res.status(200).json({ success: true, estimations });
  } catch (error) {
    next(error);
  }
};

const getEstimation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const estimation = await Estimation.findOne({ _id: id, user: req.user.id });

    if (!estimation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Estimation not found",
      });
    }

    res.status(StatusCodes.OK).json({ success: true, estimation });
  } catch (error) {
    next(error);
  }
};

export {
  createEstimation,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  calculateEstimation,
  getUserEstimations,
  getEstimation,
};
