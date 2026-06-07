"""
LivestockIQ — ML Inference Server
===================================
A lightweight FastAPI server the Node.js/Express backend calls
after the user completes the wizard.

Setup:
    pip install fastapi uvicorn scikit-learn pandas joblib

Run:
    uvicorn inference_server:app --host 0.0.0.0 --port 8000 --reload

The Express backend calls  POST http://localhost:8000/predict
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional
import pandas as pd
import joblib, json, os

# ── Load models & feature metadata on startup ─────────────────────────────────
MODEL_DIR = "saved_model"

try:
    with open(os.path.join(MODEL_DIR, "feature_meta.json")) as f:
        FEATURE_META = json.load(f)

    MODELS = {
        target: joblib.load(os.path.join(MODEL_DIR, f"{target}_model.pkl"))
        for target in FEATURE_META["targets"]
    }
    print("✅ All models loaded successfully")
except FileNotFoundError:
    raise RuntimeError(
        "Models not found. Run train_model.py first to generate .pkl files."
    )


# ── Request Schema (mirrors the Mongoose Estimation model exactly) ─────────────
class PredictRequest(BaseModel):
    # Step 1 – livestock type
    livestockType: Literal["cattle", "poultry"]

    # Step 2 – production setup
    productionType: Literal["broiler", "layer", "beef", "dairy"]
    productionSystem: Literal[
        "intensive", "semi-intensive", "extensive", "deep litter", "battery cage"
    ]
    numberOfAnimals: int = Field(ge=1)
    cycleDuration: int   = Field(ge=1)
    location: str

    # Step 3 – housing
    hasHousing: bool
    housingType: Optional[Literal["basic", "standard", "premium"]] = "basic"
    capacity: int = Field(ge=0)
    equipmentCount: int = Field(ge=0, default=0)   # len(equipment[])

    # Step 4 – feed & operations
    feedPrice: float       = Field(ge=0)
    laborCost: float       = Field(ge=0)
    electricityCost: float = Field(ge=0)

    # Step 5 – health management
    mortalityRate: float = Field(ge=0, le=100)
    vaccinationProgram: Literal["minimal", "standard", "intensive"]
    vetServiceFrequency: Literal["weekly", "monthly", "quarterly"]
    medicationIntensity: Literal["low", "medium", "high"]
    diseaseRiskLevel: Literal["low", "medium", "high"]

    # Step 6 – market inputs (optional depending on livestock/production type)
    sellingPricePerKg: float = Field(ge=0, default=0)
    eggPricePerEgg: float    = Field(ge=0, default=0)
    milkPricePerLiter: float = Field(ge=0, default=0)


class PredictResponse(BaseModel):
    totalCostEstimation: float
    projectedRevenue: float
    projectedProfit: float
    roi: float
    confidenceNote: str


# ── Helper: build DataFrame row the models expect ────────────────────────────
def build_feature_row(req: PredictRequest) -> pd.DataFrame:
    n = req.numberOfAnimals

    row = {
        # categorical
        "livestockType":       req.livestockType,
        "productionType":      req.productionType,
        "productionSystem":    req.productionSystem,
        "location":            req.location,
        "housingType":         req.housingType or "basic",
        "vaccinationProgram":  req.vaccinationProgram,
        "vetServiceFrequency": req.vetServiceFrequency,
        "medicationIntensity": req.medicationIntensity,
        "diseaseRiskLevel":    req.diseaseRiskLevel,
        # numeric
        "numberOfAnimals":     n,
        "cycleDuration":       req.cycleDuration,
        "hasHousing":          int(req.hasHousing),
        "capacity":            req.capacity,
        "equipmentCount":      req.equipmentCount,
        "feedPrice":           req.feedPrice,
        "laborCost":           req.laborCost,
        "electricityCost":     req.electricityCost,
        "mortalityRate":       req.mortalityRate,
        "sellingPricePerKg":   req.sellingPricePerKg,
        "eggPricePerEgg":      req.eggPricePerEgg,
        "milkPricePerLiter":   req.milkPricePerLiter,
        # derived features (must match train_model.py)
        "feedPerAnimal":       req.feedPrice     / max(n, 1),
        "laborPerAnimal":      req.laborCost     / max(n, 1),
        "electricPerAnimal":   req.electricityCost / max(n, 1),
    }

    # Keep column order identical to training
    ordered_cols = FEATURE_META["all_features"]
    return pd.DataFrame([row])[ordered_cols]


# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LivestockIQ ML Inference API",
    description="Predicts livestock farm costs, revenue, profit and ROI",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": list(MODELS.keys())}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        X = build_feature_row(req)

        predictions = {
            target: float(model.predict(X)[0])
            for target, model in MODELS.items()
        }

        return PredictResponse(
            totalCostEstimation = round(predictions["totalCostEstimation"], 2),
            projectedRevenue    = round(predictions["projectedRevenue"],    2),
            projectedProfit     = round(predictions["projectedProfit"],     2),
            roi                 = round(predictions["roi"],                 2),
            confidenceNote=(
                "ML-assisted estimate. Actual costs may vary based on "
                "local market conditions."
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
