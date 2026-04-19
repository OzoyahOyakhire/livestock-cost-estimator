import mongoose from "mongoose";

const estimationSchema = new mongoose.Schema(
  {
    // User who created this estimation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Livestock type selected by the user
    livestockType: {
      type: String,
      enum: ["cattle", "poultry"],
      required: true,
    },

    // Tracks whether the estimation is still being filled or finished
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },

    // Tracks the current wizard step
    currentStep: {
      type: Number,
      default: 1,
    },

    // General production information
    productionSetup: {
      productionType: String,
      productionSystem: String,
      numberOfAnimals: Number,
      cycleDuration: Number,
      location: String,
    },

    // Housing and infrastructure details
    housingInfrastructure: {
      hasHousing: Boolean,
      housingType: String,
      capacity: Number,
      equipment: [String],
    },

    // Feed and operations costs / assumptions
    feedOperations: {
      feedPrice: Number,
      laborCost: Number,
      electricityCost: Number,
    },

    // Health and veterinary details
    healthManagement: {
      mortalityRate: Number,
      vaccinationProgram: String,
      vetServiceFrequency: String,
      medicationIntensity: String,
      diseaseRiskLevel: String,
    },

    // Market-related assumptions
    marketInputs: {
      sellingPricePerKg: Number,
      eggPricePerEgg: Number,
      milkPricePerLiter: Number,
    },

    // Final calculated result
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
  },
  { timestamps: true }
);

const Estimation = mongoose.model("Estimation", estimationSchema);
export default Estimation;