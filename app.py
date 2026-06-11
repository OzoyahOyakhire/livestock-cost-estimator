from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime
import pandas as pd
import joblib, json, os

# ── Load models on startup ────────────────────────────────────────────────────
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
    raise RuntimeError("Models not found. Run train_model.py first.")


# ── Request schema ────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    # Step 1
    livestockType: Literal["cattle", "poultry"]

    # Step 2 — production setup
    productionType: Literal["broiler", "layer", "beef"]
    productionSystem: Literal[
        "intensive", "semi-intensive", "extensive",
        "deep litter", "battery cage", "mixed"
    ]
    numberOfAnimals: int = Field(ge=1)
    cycleDuration: int   = Field(ge=1)
    location: str

    # Step 3 — housing
    housingStatus: Optional[Literal["existing", "need-to-build", "not-required"]] = "existing"
    hasHousing: Optional[bool] = True  # backward compatibility
    housingType: Optional[Literal[
        "wooden", "block-concrete", "steel-structure",
        "basic", "standard", "premium"
    ]] = "basic"
    capacity: int     = Field(ge=0, default=0)
    equipmentCount: int = Field(ge=0, default=0)

    # Step 4 — feed & operations
    feedPrice: float       = Field(ge=0)
    laborCost: float       = Field(ge=0)
    electricityCost: float = Field(ge=0)

    # Step 5 — health management
    mortalityRate: float = Field(ge=0, le=100)
    vaccinationProgram: Literal["minimal", "basic", "standard", "intensive"]
    vetServiceFrequency: Literal["weekly", "monthly", "quarterly"]
    medicationIntensity: Literal["low", "medium", "high"]
    diseaseRiskLevel: Literal["low", "medium", "high"] = "medium"
    parasiteControl: Optional[Literal["none", "occasional", "regular"]] = "none"

    # Market inputs (now part of feed step on frontend)
    sellingPricePerKg: float = Field(ge=0, default=0)
    eggPricePerEgg: float    = Field(ge=0, default=0)
    milkPricePerLiter: float = Field(ge=0, default=0)  # kept for backward compat

    # Price trend
    year: Optional[int]  = Field(default=2025)
    month: Optional[int] = Field(ge=1, le=12, default=None)


class PredictResponse(BaseModel):
    totalCostEstimation: float
    projectedRevenue: float
    projectedProfit: float
    roi: float
    confidenceNote: str


# ── Vaccine helper ────────────────────────────────────────────────────────────
def _get_vaccines(program: str, livestock_type: str) -> str:
    poultry_map = {
        "minimal":   "LaSota (Newcastle)",
        "basic":     "LaSota (Newcastle)",
        "standard":  "LaSota + Gumboro (IBD)",
        "intensive": "LaSota + Gumboro + Marek's + IB",
    }
    cattle_map = {
        "minimal":   "CBPP vaccine only",
        "basic":     "CBPP vaccine only",
        "standard":  "CBPP + FMD (Foot & Mouth)",
        "intensive": "CBPP + FMD + Brucellosis + Anthrax",
    }
    if livestock_type == "poultry":
        return poultry_map.get(program, "LaSota (Newcastle)")
    return cattle_map.get(program, "CBPP vaccine only")


# ── Build feature row ─────────────────────────────────────────────────────────
def build_feature_row(req: PredictRequest) -> pd.DataFrame:
    n = req.numberOfAnimals

    # Resolve housingStatus from hasHousing if not provided
    housing_status = req.housingStatus
    if housing_status is None:
        housing_status = "existing" if req.hasHousing else "need-to-build"

    row = {
        # categorical
        "livestockType":       req.livestockType,
        "productionType":      req.productionType,
        "productionSystem":    req.productionSystem,
        "location":            req.location,
        "housingStatus":       housing_status,
        "housingType":         req.housingType or "basic",
        "vaccinationProgram":  req.vaccinationProgram,
        "vaccinesUsed":        _get_vaccines(req.vaccinationProgram, req.livestockType),
        "vetServiceFrequency": req.vetServiceFrequency,
        "medicationIntensity": req.medicationIntensity,
        "diseaseRiskLevel":    req.diseaseRiskLevel,
        "parasiteControl":     req.parasiteControl or "none",
        # numeric
        "year":                req.year or 2025,
        "month":               req.month or datetime.now().month,
        "numberOfAnimals":     n,
        "cycleDuration":       req.cycleDuration,
        "equipmentCount":      req.equipmentCount,
        "feedPrice":           req.feedPrice,
        "laborCost":           req.laborCost,
        "electricityCost":     req.electricityCost,
        "mortalityRate":       req.mortalityRate,
        "sellingPricePerKg":   req.sellingPricePerKg,
        "eggPricePerEgg":      req.eggPricePerEgg,
        "milkPricePerLiter":   req.milkPricePerLiter,
        # derived
        "feedPerAnimal":       req.feedPrice      / max(n, 1),
        "laborPerAnimal":      req.laborCost      / max(n, 1),
        "electricPerAnimal":   req.electricityCost / max(n, 1),
    }

    ordered_cols = FEATURE_META["all_features"]
    return pd.DataFrame([row])[ordered_cols]


# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="LivestockIQ ML Inference API",
    description="Predicts livestock farm costs, revenue, profit and ROI",
    version="4.0.0",
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
