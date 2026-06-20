"""
calibrate_feed_prices.py

Run this ONCE, locally, against your training CSV.
It computes the average feed-cost-per-animal for each (productionType, year)
from your real data, and writes the result to feed_calibration.json.

The Node backend then uses that JSON to auto-fill a realistic feedPrice
when the user does not provide one, scaled by the number of animals.

Usage:
    python calibrate_feed_prices.py
"""

import pandas as pd
import json
import os

DATA_PATH = "dataset/livestock_training_data.csv"   # adjust path if needed
OUT_PATH = "feed_calibration.json"

df = pd.read_csv(DATA_PATH)

# feed cost per animal for each row
df = df[df["numberOfAnimals"] > 0].copy()
df["feedPerAnimal"] = df["feedPrice"] / df["numberOfAnimals"]

# Average feed-per-animal grouped by production type and year.
# Median is used instead of mean so a few extreme rows don't skew it.
grouped = (
    df.groupby(["productionType", "year"])["feedPerAnimal"]
    .median()
    .reset_index()
)

calibration = {}
for _, row in grouped.iterrows():
    pt = row["productionType"]
    yr = int(row["year"])
    calibration.setdefault(pt, {})[str(yr)] = round(float(row["feedPerAnimal"]), 2)

# Also store an overall latest-year fallback per production type
latest_year = str(int(df["year"].max()))
fallbacks = {}
for pt in calibration:
    if latest_year in calibration[pt]:
        fallbacks[pt] = calibration[pt][latest_year]
    else:
        # use the highest year available for that type
        yrs = sorted(calibration[pt].keys())
        fallbacks[pt] = calibration[pt][yrs[-1]]

output = {
    "feedPerAnimalByYear": calibration,
    "latestYearFallback": fallbacks,
    "latestYear": latest_year,
}

with open(OUT_PATH, "w") as f:
    json.dump(output, f, indent=2)

print(f"Wrote {OUT_PATH}")
print(json.dumps(output, indent=2))
