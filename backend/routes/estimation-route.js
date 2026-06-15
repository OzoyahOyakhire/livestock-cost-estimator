import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  calculateEstimation,
  createEstimation,
  getEstimation,
  getUserEstimations,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
} from "../controllers/estimation-controller.js";
import {
  createEstimatorValidator,
  productionSetupValidator,
  housingInfrastructureValidator,
  feedOperationsValidator,
  healthManagementValidator,
} from "../validators/estimator-validator.js";
import validator from "../middleware/validator.js";
import stepGuard from "../middleware/step-guard.js";

const router = express.Router();
router.use(authenticateUser);

// Step 1 — Create estimation (livestock type)
router.post("/", validator(createEstimatorValidator), createEstimation);

// Step 2 — Production setup
router.patch(
  "/:id/step-2",
  stepGuard(2),
  validator(productionSetupValidator),
  updateStep2,
);

// Step 3 — Housing & infrastructure
router.patch(
  "/:id/step-3",
  stepGuard(3),
  validator(housingInfrastructureValidator),
  updateStep3,
);

// Step 4 — Feed & operations (includes market inputs)
router.patch(
  "/:id/step-4",
  stepGuard(4),
  validator(feedOperationsValidator),
  updateStep4,
);

// Step 5 — Health management (final step before calculate)
router.patch(
  "/:id/step-5",
  stepGuard(5),
  validator(healthManagementValidator),
  updateStep5,
);

// Calculate — triggers rule-based engine + ML prediction
router.post("/:id/calculate", calculateEstimation);
router.get("/user-estimation", getUserEstimations);
router.get("/:id", getEstimation);

export default router;
