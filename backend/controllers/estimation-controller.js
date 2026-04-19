import Estimation from "../models/estimation.js";
import { StatusCodes } from "http-status-codes";
import {runEstimation} from "../service/estimation-service.js";

const createEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.create({
      user: req.user.id,
      livestockType: req.body.livestockType,
      currentStep: 1,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      estimation,
    });
  } catch (error) {
    next(error);
  }
};

const updateStep2 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { productionSetup: req.body, currentStep: 2 } },
      { new: true, runValidators: true },
    );
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

const updateStep3 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { housingInfrastructure: req.body, currentStep: 3 } },
      { new: true, runValidators: true },
    );
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

const updateStep4 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { feedOperations: req.body, currentStep: 4 } },
      { new: true, runValidators: true },
    );
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

const updateStep5 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { healthManagement: req.body, currentStep: 5 } },
      { new: true, runValidators: true },
    );
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

const updateStep6 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const estimation = await Estimation.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: { marketInputs: req.body, currentStep: 6 } },
      { new: true, runValidators: true },
    );

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

const calculateEstimation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const estimation = await Estimation.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!estimation) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Estimation not found",
      });
    }

    const results = runEstimation(estimation);

    estimation.results = {
      totalCostEstimation: results.totalCostEstimation,
      projectedRevenue: results.projectedRevenue,
      projectedProfit: results.projectedProfit,
      roi: results.roi,
    };

    estimation.status = "completed";

    await estimation.save();

    res.status(StatusCodes.OK).json({
      success: true,
      estimation,
      costBreakdown: results.costBreakdown,
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
  updateStep6,
  calculateEstimation,
};
