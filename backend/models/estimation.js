import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema(
  {
    // 🔗 User who created this estimation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🐄 Livestock category
    livestockType: {
      type: String,
      enum: ["cattle", "poultry"],
      required: true,
    },

    // 📌 Draft or completed
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },

    // 📍 Track wizard progress
    currentStep: {
      type: Number,
      default: 1,
    },

    // =========================
    // 🏗️ PRODUCTION SETUP
    // =========================
    productionSetup: {
      productionType: {
        type: String,
        enum: ["broiler", "layer", "beef", "dairy"],
      },

      productionSystem: {
        type: String,
        enum: ["intensive", "semi-intensive", "extensive", "deep litter", "battery cage"],
      },

      numberOfAnimals: {
        type: Number,
        min: 1,
      },

      cycleDuration: {
        type: Number,
        min: 1,
      },

      location: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // 🏠 HOUSING
    // =========================
    housingInfrastructure: {
      hasHousing: {
        type: Boolean,
        default: false,
      },

      housingType: {
        type: String,
        enum: ["basic", "standard", "premium"],
      },

      capacity: {
        type: Number,
        min: 0,
      },

      equipment: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    // =========================
    // 🌽 FEED & OPERATIONS
    // =========================
    feedOperations: {
      feedPrice: {
        type: Number,
        min: 0,
      },

      laborCost: {
        type: Number,
        min: 0,
      },

      electricityCost: {
        type: Number,
        min: 0,
      },
    },

    // =========================
    // 💉 HEALTH MANAGEMENT
    // =========================
    healthManagement: {
      mortalityRate: {
        type: Number,
        min: 0,
        max: 100,
      },

      vaccinationProgram: {
        type: String,
        enum: ["minimal", "standard", "intensive"],
      },

      vetServiceFrequency: {
        type: String,
        enum: ["weekly", "monthly", "quarterly"],
      },

      medicationIntensity: {
        type: String,
        enum: ["low", "medium", "high"],
      },

      diseaseRiskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
      },
    },

    // =========================
    // 💰 MARKET INPUTS
    // =========================
    marketInputs: {
      sellingPricePerKg: {
        type: Number,
        min: 0,
      },

      eggPricePerEgg: {
        type: Number,
        min: 0,
      },

      milkPricePerLiter: {
        type: Number,
        min: 0,
      },
    },

    // =========================
    // 📊 FINAL RESULTS
    // =========================
    results: {
      totalCostEstimation: {
        type: Number,
        default: 0,
      },

      projectedRevenue: {
        type: Number,
        default: 0,
      },

      projectedProfit: {
        type: Number,
        default: 0,
      },

      roi: {
        type: Number,
        default: 0,
      },
    },

    // =========================
    // 🤖 ML OUTPUT (for later)
    // =========================
    modelOutput: {
      predictedFeedCost: {
        type: Number,
        default: 0,
      },

      predictedLaborCost: {
        type: Number,
        default: 0,
      },

      predictedElectricityCost: {
        type: Number,
        default: 0,
      },

      confidenceScore: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Estimation = mongoose.model("Estimation", estimationSchema);

export default Estimation;