// feed-estimator.js
// Provides a realistic feedPrice when the user does not enter one,
// scaled by the number of animals and calibrated to the training data.
// Also range-checks user-entered values and returns a soft warning.
//
// Place this file in the same backend folder as ml-service.js and import from there.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the calibration produced by calibrate_feed_prices.py.
// Falls back to rough built-in figures if the file is missing.
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

// Rough built-in fallback per-animal feed cost (used only if the JSON is absent).
// These are coarse; the JSON from your real data is preferred.
const BUILTIN_PER_ANIMAL = {
  broiler: 3000, // ~2025–2026 era ₦ per bird per cycle
  layer: 4500,
  beef: 120000, // ₦ per head
};

// Look up a per-animal feed cost for a given production type and year.
const getFeedPerAnimal = (productionType, year) => {
  const pt = (productionType || "").toLowerCase();

  if (CALIBRATION) {
    const byYear = CALIBRATION.feedPerAnimalByYear?.[pt];
    if (byYear) {
      const y = String(year);
      if (byYear[y] != null) return byYear[y];
      // No exact year — use the closest available year, preferring the latest.
      const years = Object.keys(byYear)
        .map(Number)
        .sort((a, b) => a - b);
      if (years.length) {
        // closest year to the requested one
        let closest = years[0];
        let bestDiff = Math.abs(years[0] - Number(year));
        for (const yr of years) {
          const d = Math.abs(yr - Number(year));
          if (d < bestDiff) {
            bestDiff = d;
            closest = yr;
          }
        }
        return byYear[String(closest)];
      }
    }
    if (CALIBRATION.latestYearFallback?.[pt] != null) {
      return CALIBRATION.latestYearFallback[pt];
    }
  }

  return BUILTIN_PER_ANIMAL[pt] || 0;
};

/**
 * Estimate a realistic total feed price when the user gave none.
 * Scales with the number of animals.
 */
export const estimateFeedPrice = (productionType, numberOfAnimals, year) => {
  const n = Number(numberOfAnimals) || 0;
  if (n <= 0) return 0;
  const perAnimal = getFeedPerAnimal(
    productionType,
    year || new Date().getFullYear(),
  );
  return Math.round(n * perAnimal);
};

/**
 * Range-check a user-entered feed price against what is realistic for the
 * flock size. Returns { ok, expectedLow, expectedHigh, message }.
 * This is a SOFT check — it advises, it does not overwrite the user's value.
 */
export const checkFeedPriceReasonable = (
  feedPrice,
  productionType,
  numberOfAnimals,
  year,
) => {
  const n = Number(numberOfAnimals) || 0;
  const expected = estimateFeedPrice(productionType, n, year);

  if (n <= 0 || expected <= 0) {
    return { ok: true, expectedLow: 0, expectedHigh: 0, message: null };
  }

  // Accept anything within roughly half to double the expected figure.
  const low = Math.round(expected * 0.5);
  const high = Math.round(expected * 2);

  if (feedPrice < low) {
    return {
      ok: false,
      expectedLow: low,
      expectedHigh: high,
      message:
        `The feed cost entered (₦${Number(feedPrice).toLocaleString()}) seems low ` +
        `for ${n} ${productionType}(s). A typical range is ` +
        `₦${low.toLocaleString()}–₦${high.toLocaleString()}. ` +
        `Please confirm you entered the total feed cost for the whole cycle.`,
    };
  }

  if (feedPrice > high) {
    return {
      ok: false,
      expectedLow: low,
      expectedHigh: high,
      message:
        `The feed cost entered (₦${Number(feedPrice).toLocaleString()}) seems high ` +
        `for ${n} ${productionType}(s). A typical range is ` +
        `₦${low.toLocaleString()}–₦${high.toLocaleString()}. ` +
        `Please confirm the figure.`,
    };
  }

  return { ok: true, expectedLow: low, expectedHigh: high, message: null };
};
