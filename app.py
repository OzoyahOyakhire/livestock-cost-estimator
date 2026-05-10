from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

# 1. Load the Wizard-aligned model and encoders
# Using absolute paths or ensuring we are in the root directory
MODEL_PATH = "saved_model/livestock_model.pkl"
ENCODER_PATH = "saved_model/all_encoders.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
else:
    print("Warning: Model files not found. Please run train_model.py first.")

# 2. Input Structure matching your Mongoose Schema
class LivestockData(BaseModel):
    animal_type: str
    number_of_animals: int
    cycle_duration: int
    feed_cost: float
    labor_cost: float
    electricity_cost: float
    mortality_rate: float
    selling_price_per_kg: float
    medication_cost: float

@app.get("/")
def home():
    return {"message": "Livestock AI (Wizard-Aligned) is live!"}

@app.post("/predict")
def predict(data: LivestockData):

    try:

        # Encode animal type
        animal_encoded = encoders["animal_type"].transform(
            [data.animal_type]
        )[0]

        # Create dataframe
        input_df = pd.DataFrame([{
            "animal_type": animal_encoded,
            "number_of_animals": data.number_of_animals,
            "cycle_duration": data.cycle_duration,
            "feed_cost": data.feed_cost,
            "labor_cost": data.labor_cost,
            "electricity_cost": data.electricity_cost,
            "mortality_rate": data.mortality_rate,
            "selling_price_per_kg": data.selling_price_per_kg,
            "medication_cost": data.medication_cost
        }])

        # Predict
        prediction = model.predict(input_df)[0]

        return {
            "predicted_total_cost": round(float(prediction), 2)
        }

    except ValueError as e:

        return {
            "error": f"Prediction failed: {str(e)}"
        }