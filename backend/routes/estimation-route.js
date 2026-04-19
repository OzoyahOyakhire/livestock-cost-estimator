import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  calculateEstimation,
  createEstimation,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  updateStep6,
} from "../controllers/estimation-controller.js";

const router = express.Router();
router.use(authenticateUser);

router.post("/", createEstimation);
router.patch("/:id/step-2", updateStep2);
router.patch("/:id/step-3", updateStep3);
router.patch("/:id/step-4", updateStep4);
router.patch("/:id/step-5", updateStep5);
router.post("/:id/step-6", updateStep6);
router.post("/:id/calculate", calculateEstimation);

export default router;
