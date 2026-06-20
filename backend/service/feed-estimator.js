// feed-estimator.js
// Auto-fills realistic feed, labor, and electricity costs when the user leaves
// them blank or zero, calibrated to the training data. Also range-checks
// user-entered values and returns soft warnings.
//
// Place in the backend service/ folder alongside ml-service.js, together with
// the generated feed_calibration.json.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let CALIBRATION = null;
try {
  const raw = fs.readFileSync(
    path.join(__dirname, "feed_calibration.json"),
    "utf-8",
  );
  CALIBRATION = JSON.parse(raw);
} catch {
  CALIBRATION = null;
}

// Coarse built-in fallbacks if the JSON is missing.
const BUILTIN = {
  feedPerAnimal: { broiler: 2480, layer: 2700, beef: 129000 },
  labor: { broiler: 90000, layer: 95000, beef: 250000 },
  electricity: { broiler: 30000, layer: 35000, beef: 30000 },
  refAnimals: { broiler: 1000, layer: 1000, beef: 50 },
};

// Generic year-aware lookup into a {pt: {year: value}} table.
const lookupByYear = (table, pt, year, builtinVal) => {
  if (CALIBRATION && table && table[pt]) {
    const byYear = table[pt];
    const y = String(year);
    if (byYear[y] != null) return byYear[y];
    const years = Object.keys(byYear)
      .map(Number)
      .sort((a, b) => a - b);
    if (years.length) {
      let closest = years[0];
      let best = Math.abs(years[0] - Number(year));
      for (const yr of years) {
        const d = Math.abs(yr - Number(year));
        if (d < best) {
          best = d;
          closest = yr;
        }
      }
      return byYear[String(closest)];
    }
  }
  return builtinVal;
};

// ── FEED: scales directly with animal count ──────────────────────────────────
export const estimateFeedPrice = (productionType, numberOfAnimals, year) => {
  const n = Number(numberOfAnimals) || 0;
  if (n <= 0) return 0;
  const pt = (productionType || "").toLowerCase();
  const perAnimal = lookupByYear(
    CALIBRATION?.feedPerAnimalByYear,
    pt,
    year || new Date().getFullYear(),
    BUILTIN.feedPerAnimal[pt] || 0,
  );
  return Math.round(n * perAnimal);
};

// ── LABOR & ELECTRICITY: typical total + mild size adjustment ─────────────────
// In the data these don't scale linearly with flock size, so we take the typical
// total for the year and nudge it up/down based on how the user's flock compares
// to the reference (median) flock size — using a dampened (square-root) factor so
// a 10x bigger farm doesn't get 10x the labor bill.
const sizeAdjustedTotal = (typicalTotal, userAnimals, refAnimals) => {
  const u = Number(userAnimals) || 0;
  const ref = Number(refAnimals) || 0;
  if (typicalTotal <= 0) return 0;
  if (u <= 0 || ref <= 0) return Math.round(typicalTotal);
  // dampened scaling: factor between ~0.5x and ~2x of the typical total
  let factor = Math.sqrt(u / ref);
  factor = Math.max(0.5, Math.min(2, factor));
  return Math.round(typicalTotal * factor);
};

export const estimateLaborCost = (productionType, numberOfAnimals, year) => {
  const pt = (productionType || "").toLowerCase();
  const y = year || new Date().getFullYear();
  const typical = lookupByYear(
    CALIBRATION?.laborByYear,
    pt,
    y,
    BUILTIN.labor[pt] || 0,
  );
  const ref = lookupByYear(
    CALIBRATION?.refAnimalsByYear,
    pt,
    y,
    BUILTIN.refAnimals[pt] || 0,
  );
  return sizeAdjustedTotal(typical, numberOfAnimals, ref);
};

export const estimateElectricityCost = (
  productionType,
  numberOfAnimals,
  year,
) => {
  const pt = (productionType || "").toLowerCase();
  const y = year || new Date().getFullYear();
  const typical = lookupByYear(
    CALIBRATION?.electricityByYear,
    pt,
    y,
    BUILTIN.electricity[pt] || 0,
  );
  const ref = lookupByYear(
    CALIBRATION?.refAnimalsByYear,
    pt,
    y,
    BUILTIN.refAnimals[pt] || 0,
  );
  return sizeAdjustedTotal(typical, numberOfAnimals, ref);
};

// ── Soft range-check for a user-entered value against an expected figure ──────
const rangeCheck = (label, value, expected, n, productionType) => {
  if (n <= 0 || expected <= 0) {
    return { ok: true, expectedLow: 0, expectedHigh: 0, message: null };
  }
  const low = Math.round(expected * 0.5);
  const high = Math.round(expected * 2);
  if (value < low) {
    return {
      ok: false,
      expectedLow: low,
      expectedHigh: high,
      message:
        `The ${label} entered (₦${Number(value).toLocaleString()}) seems low for ` +
        `${n} ${productionType}(s). A typical range is ₦${low.toLocaleString()}–` +
        `₦${high.toLocaleString()}. Please confirm the figure.`,
    };
  }
  if (value > high) {
    return {
      ok: false,
      expectedLow: low,
      expectedHigh: high,
      message:
        `The ${label} entered (₦${Number(value).toLocaleString()}) seems high for ` +
        `${n} ${productionType}(s). A typical range is ₦${low.toLocaleString()}–` +
        `₦${high.toLocaleString()}. Please confirm the figure.`,
    };
  }
  return { ok: true, expectedLow: low, expectedHigh: high, message: null };
};

export const checkFeedPriceReasonable = (
  feedPrice,
  productionType,
  numberOfAnimals,
  year,
) => {
  const n = Number(numberOfAnimals) || 0;
  return rangeCheck(
    "feed cost",
    feedPrice,
    estimateFeedPrice(productionType, n, year),
    n,
    productionType,
  );
};

export const checkLaborReasonable = (
  laborCost,
  productionType,
  numberOfAnimals,
  year,
) => {
  const n = Number(numberOfAnimals) || 0;
  return rangeCheck(
    "labor cost",
    laborCost,
    estimateLaborCost(productionType, n, year),
    n,
    productionType,
  );
};

export const checkElectricityReasonable = (
  electricityCost,
  productionType,
  numberOfAnimals,
  year,
) => {
  const n = Number(numberOfAnimals) || 0;
  return rangeCheck(
    "electricity cost",
    electricityCost,
    estimateElectricityCost(productionType, n, year),
    n,
    productionType,
  );
};
