import Estimation from "../models/estimation.js";
import { StatusCodes } from "http-status-codes";
import { runEstimation } from "../service/estimation-service.js";
import { getMLPrediction, applySmartDefaults } from "../service/ml-service.js";

// ── Compute total feedPrice from staged inputs ────────────────────────────────
const computeTotalFeedPrice = (feedOperations, productionType) => {
  if (!feedOperations) return 0;

  if (feedOperations.manualOverride && feedOperations.feedPrice > 0) {
    return feedOperations.feedPrice;
  }

  if (productionType === "broiler") {
    const total =
      (feedOperations.broilerStarterCost || 0) +
      (feedOperations.broilerFinisherCost || 0);
    if (total > 0) return total;
  }
  if (productionType === "layer") {
    const total =
      (feedOperations.chickStarterCost || 0) +
      (feedOperations.growerMashCost || 0) +
      (feedOperations.layerMashCost || 0);
    if (total > 0) return total;
  }
  if (productionType === "beef") {
    const total =
      (feedOperations.feedCostPerKg || 0) +
      (feedOperations.supplementCost || 0);
    if (total > 0) return total;
  }

  return feedOperations.feedPrice || 0;
};

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

    // Sync hasHousing with housingStatus for backward compatibility
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
    estimation.feedOperations = req.body;

    // Compute and store total feedPrice from staged inputs
    const pt = estimation.productionSetup?.productionType;
    estimation.feedOperations.feedPrice = computeTotalFeedPrice(req.body, pt);

    estimation.currentStep = 4;
    await estimation.save();
    res.status(StatusCodes.OK).json({ success: true, estimation });
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

    // Save structured cost breakdown to database
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
    const estimations = await Estimation.find({ user: req.user.id })
      .sort({ updatedAt: -1 })

    if (estimations.length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        estimations: [],
        message: "No estimation yet",
      });
    }

    return res.status(200).json({
      success: true,
      estimations,
    });
  } catch (error) {
    next(error);
  }
};

const getEstimation = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Scope to the logged-in user so one user can't read another's estimation.
    const estimation = await Estimation.findOne({ _id: id, user: req.user.id });

    if (!estimation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Estimation not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
    });
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
  getEstimation
};
