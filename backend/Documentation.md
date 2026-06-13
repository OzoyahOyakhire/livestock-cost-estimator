# LivestockIQ — Backend API Documentation

## Overview

This document describes the API exposed by the LivestockIQ backend. The system
estimates livestock farm costs, revenue, profit, and ROI for cattle and poultry
operations. The backend (Node.js/Express + MongoDB) runs a rule-based estimation
engine and also calls a separate Python ML service for ML-assisted predictions.

## Base URL

`/api/v1`

## Mounted routers

| Router      | Base path              | Auth required |
| ----------- | ---------------------- | ------------- |
| Auth        | `/api/v1/auth`         | No (except logout) |
| Estimation  | `/api/v1/estimation`   | Yes           |
| User        | `/api/v1/user`         | Yes           |
| Dashboard   | `/api/v1/dashboard`    | Yes           |

> Note: the estimation base path is **singular** (`/api/v1/estimation`), as
> mounted in `server.js`.

## Authentication Method

This backend uses **HTTP-only signed cookies** for authentication:

- `accessToken`
- `refreshToken`

Frontend requests that need cookies should be sent with credentials enabled.
CORS is configured in `server.js` against `process.env.CLIENT_URL` with
`credentials: true`.

---

# Auth API

**Base Path**: `/api/v1/auth`

## 1) Register User

**Endpoint**: `POST /api/v1/auth/register`

### Description

Creates a new user account, generates an email verification token, and sends a
verification email.

### Validation Rules

- `name`: string, required, 3 to 50 characters
- `email`: valid email, required
- `password`: required, minimum 8 characters, must include:
  - uppercase letter
  - lowercase letter
  - number
  - special character from `@$#&!~_`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1@"
}
```

### Success Response

**Status**: `201 Created`

```json
{
  "msg": "Success! Please check your email to verify account"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "validation error message(s)"
}
```

**Status**: `409 Conflict`

```json
{
  "msg": "Email already exists"
}
```

### Notes

- The first registered account is assigned the role `admin`.
- Every other new account is assigned the role `user`.
- The verification link points to the backend route:
  `GET /api/v1/auth/verify-email?token=...&email=...`

---

## 2) Verify Email

**Endpoint**: `GET /api/v1/auth/verify-email`

### Description

Verifies a user's email using the token and email from the query string.

### Query Parameters

- `token` (required)
- `email` (required)

### Example

```http
GET /api/v1/auth/verify-email?token=abc123&email=john@example.com
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Email verified successfully"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Invalid verification link"
}
```

**Status**: `401 Unauthorized`

```json
{
  "msg": "Verification failed"
}
```

---

## 3) Login

**Endpoint**: `POST /api/v1/auth/login`

### Description

Authenticates a verified user, stores refresh token data in the database, and
sets signed auth cookies.

### Validation Rules

- `email`: valid email, required
- `password`: required

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password1@"
}
```

### Success Response

**Status**: `202 Accepted`

```json
{
  "msg": " welcome onboard John Doe "
}
```

### Cookies Set On Success

- `accessToken` (HTTP-only, signed, expires in about 1 day)
- `refreshToken` (HTTP-only, signed, expires in about 30 days)

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "validation error message(s)"
}
```

**Status**: `401 Unauthorized`

```json
{
  "msg": "Email does not exist, try correct email or create account"
}
```

```json
{
  "msg": "Incorrect Credentials"
}
```

```json
{
  "msg": "Please verify your email"
}
```

```json
{
  "msg": "Invalid Credentials"
}
```

### Frontend Note

For browser-based requests, send credentials so cookies are included.

---

## 4) Logout

**Endpoint**: `DELETE /api/v1/auth/logout`

### Description

Deletes the user's refresh token record and clears auth cookies.

### Authentication

Requires authenticated user via signed cookies.

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "user log out"
}
```

### Possible Error Responses

**Status**: `401 Unauthorized`

```json
{
  "msg": "Authenticated Failed"
}
```

### Frontend Note

Send the request with credentials enabled.

---

## 5) Forgot Password

**Endpoint**: `POST /api/v1/auth/forgot-password`

### Description

If the email exists, generates a reset token, stores a hashed token plus expiry,
and sends a reset email.

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Please check your email for reset password link"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Please provide a valid email"
}
```

### Notes

- This endpoint returns the same success message whether the email exists or not.
- Reset token expiry is set to about 10 minutes.
- The email link points to the backend reset-password path with `token` and
  `email` in the URL.

---

## 6) Reset Password

**Endpoint**: `POST /api/v1/auth/reset-password`

### Description

Resets a user's password using the reset token, email, and new password.

### Request Body

```json
{
  "email": "john@example.com",
  "token": "reset_token_here",
  "newPassword": "NewPassword1@"
}
```

### Success Response

**Status**: `200 OK`

```json
{
  "msg": "Password reset successful"
}
```

### Possible Error Responses

**Status**: `400 Bad Request`

```json
{
  "msg": "Please provide email, token and new password"
}
```

```json
{
  "msg": "Invalid or expired reset link"
}
```

---

## Auth Frontend Integration Notes

### Base Axios Example

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});
```

### Example Calls

```js
await api.post("/auth/register", {
  name: "John Doe",
  email: "john@example.com",
  password: "Password1@",
});

await api.post("/auth/login", {
  email: "john@example.com",
  password: "Password1@",
});

await api.delete("/auth/logout");
```

---

# 🐄 Estimation API

- **Base Path**: `/api/v1/estimation`
- **Auth Required**: ✅ Yes (all routes)

The estimation flow is a 5-step wizard. Step 1 creates the estimation; steps 2–5
update it in place; `calculate` finalizes it. A step guard enforces that steps are
completed in order. Market inputs (`sellingPricePerKg`, `eggPricePerEgg`) are
captured as part of **Step 4 (Feed & Operations)** — there is no separate market
step.

## 1) Create Estimation (Step 1)

**Endpoint**: `POST /api/v1/estimation`

### Description

Initializes a new estimation with the livestock type and starts the wizard.

### Request Body

```json
{
  "livestockType": "cattle"
}
```

- `livestockType`: required, one of `cattle`, `poultry`

### Success Response

**Status**: `201 Created`

```json
{
  "success": true,
  "estimation": {
    "_id": "estimation_id",
    "livestockType": "cattle",
    "currentStep": 1,
    "status": "draft"
  }
}
```

## 2) Production Setup (Step 2)

**Endpoint**: `PATCH /api/v1/estimation/:id/step-2`

### Request Body

```json
{
  "productionType": "beef",
  "productionSystem": "intensive",
  "numberOfAnimals": 100,
  "cycleDuration": 6,
  "location": "Lagos",
  "coordinates": { "latitude": 6.5244, "longitude": 3.3792 }
}
```

- `productionType`: required, one of `broiler`, `layer`, `beef`
- `productionSystem`: required, one of `intensive`, `semi-intensive`,
  `extensive`, `deep litter`, `battery cage`, `mixed`
- `numberOfAnimals`: required, min 1
- `cycleDuration`: required, min 1
- `location`: required
- `coordinates`: optional `{ latitude, longitude }`

### Success Response

**Status**: `200 OK` — returns `{ "success": true, "estimation": { ... } }`

## 3) Housing & Infrastructure (Step 3)

**Endpoint**: `PATCH /api/v1/estimation/:id/step-3`

### Request Body

```json
{
  "housingStatus": "need-to-build",
  "housingType": "block-concrete",
  "requiredSpace": 200,
  "farmSize": 500,
  "waterSource": "borehole",
  "buildingMaterial": "concrete",
  "fencingType": "barbed-wire",
  "equipment": ["feeder", "drinkers"],
  "capacity": 120
}
```

- `housingStatus`: required, one of `existing`, `need-to-build`, `not-required`
- `housingType`: required **only when** `housingStatus` is `need-to-build`; one of
  `wooden`, `block-concrete`, `steel-structure`, `basic`, `standard`, `premium`
- `requiredSpace`, `farmSize`, `capacity`: optional numbers (min 0)
- `waterSource`, `buildingMaterial`, `fencingType`: optional strings
- `equipment`: optional array of strings (defaults to `[]`)

> The backend derives `hasHousing` automatically: `true` when `housingStatus` is
> `existing` or `not-required`, otherwise `false`.

### Success Response

**Status**: `200 OK` — returns `{ "success": true, "estimation": { ... } }`

## 4) Feed & Operations (Step 4 — includes market inputs)

**Endpoint**: `PATCH /api/v1/estimation/:id/step-4`

Feed costs can be supplied either as staged sub-costs (which the backend sums into
`feedPrice`) or as a manual override. Required fields are `laborCost` and
`electricityCost`.

### Request Body (example — broiler)

```json
{
  "broilerStarterCost": 300000,
  "broilerFinisherCost": 350000,
  "laborCost": 80000,
  "electricityCost": 25000,
  "sellingPricePerKg": 3500,
  "eggPricePerEgg": 0
}
```

### Accepted Fields

- Poultry broiler staged feed: `broilerStarterCost`, `broilerFinisherCost`
- Poultry layer staged feed: `chickStarterCost`, `growerMashCost`, `layerMashCost`
- Cattle feed: `feedCostPerKg`, `supplementCost`, `grazingAvailability` (bool)
- Manual override: `feedPrice`, `manualOverride` (bool)
- Shared (required): `laborCost`, `electricityCost`
- Market inputs (optional): `sellingPricePerKg`, `eggPricePerEgg`

> `feedPrice` is computed and stored server-side from the staged inputs based on
> `productionType`, unless `manualOverride` is `true` and `feedPrice > 0`.

### Success Response

**Status**: `200 OK` — returns `{ "success": true, "estimation": { ... } }`

## 5) Health Management (Step 5 — final step)

**Endpoint**: `PATCH /api/v1/estimation/:id/step-5`

### Request Body

```json
{
  "mortalityRate": 5,
  "vaccinationProgram": "standard",
  "vetServiceFrequency": "monthly",
  "medicationIntensity": "medium",
  "diseaseRiskLevel": "medium",
  "parasiteControl": "occasional"
}
```

- `mortalityRate`: required, 0–100
- `vaccinationProgram`: required, one of `minimal`, `basic`, `standard`, `intensive`
- `vetServiceFrequency`: required, one of `weekly`, `monthly`, `quarterly`
- `medicationIntensity`: required, one of `low`, `medium`, `high`
- `diseaseRiskLevel`: optional, one of `low`, `medium`, `high`
- `parasiteControl`: optional, one of `none`, `occasional`, `regular`

### Success Response

**Status**: `200 OK` — returns `{ "success": true, "estimation": { ... } }`

## 6) Calculate Estimation

**Endpoint**: `POST /api/v1/estimation/:id/calculate`

### Description

Applies smart defaults for any missing/zero fields, runs the rule-based estimation
engine, then calls the ML service. The rule-based result is always returned; the ML
result is included only when the ML server responds successfully (the backend falls
back gracefully if it is down).

### Success Response

**Status**: `200 OK`

```json
{
  "success": true,
  "estimation": {
    "status": "completed",
    "results": {
      "totalCostEstimation": 220000,
      "projectedRevenue": 350000,
      "projectedProfit": 130000,
      "roi": 59.1
    },
    "costBreakdown": { "...": "..." },
    "modelOutput": {
      "predictedFeedCost": 150000,
      "predictedLaborCost": 50000,
      "predictedElectricityCost": 20000,
      "confidenceScore": 0.92
    }
  },
  "costBreakdown": {
    "feedPrice": 150000,
    "laborCost": 50000,
    "electricityCost": 20000,
    "housingCost": 30000,
    "equipmentCost": 10000,
    "vaccinationCost": 5000,
    "medicationCost": 7000,
    "vetServiceCost": 4000
  },
  "mlResults": {
    "totalCostEstimation": 218500,
    "projectedRevenue": 352000,
    "projectedProfit": 133500,
    "roi": 61.1,
    "confidenceNote": "ML-assisted estimate. Actual costs may vary based on local market conditions.",
    "defaultsApplied": {
      "feedPrice": false,
      "laborCost": false,
      "electricityCost": false,
      "mortalityRate": false,
      "sellingPricePerKg": false,
      "eggPricePerEgg": false
    }
  }
}
```

> `mlResults` is omitted entirely if the ML server is unavailable. The
> `defaultsApplied` flags tell the frontend which inputs were auto-filled with
> smart defaults so it can surface that to the user.

### Possible Error Responses

**Status**: `404 Not Found`

```json
{
  "success": false,
  "message": "Estimation not found"
}
```

---

# 📊 Dashboard API

- **Base Path**: `/api/v1/dashboard`
- **Auth Required**: ✅ Yes

All dashboard endpoints aggregate over the current user's estimations. Summary,
cost-breakdown, and analytics only include estimations with `status: "completed"`.

## 1) Dashboard Summary

**Endpoint**: `GET /api/v1/dashboard/summary`

### Response

```json
{
  "success": true,
  "data": {
    "totalEstimationCost": 425000,
    "ProjectedRevenue": 580000,
    "ProjectedProfit": 155000,
    "roi": 36.4
  }
}
```

> `roi` is computed as `(totalProfit / totalCost) * 100`, or `0` when total cost is `0`.

## 2) Cost Breakdown

**Endpoint**: `GET /api/v1/dashboard/cost-breakdown`

### Response

```json
{
  "success": true,
  "data": {
    "feedingNutrition": 250000,
    "vetinary": 0,
    "operations": 120000,
    "others": 0
  }
}
```

## 3) Recent Estimations

**Endpoint**: `GET /api/v1/dashboard/recent`

### Description

Returns the user's 5 most recently updated estimations (any status), newest first.

### Response (with data)

```json
{
  "success": true,
  "estimations": [ { "_id": "...", "livestockType": "cattle", "status": "completed" } ]
}
```

### Response (none yet)

```json
{
  "success": true,
  "estimations": [],
  "message": "No estimation yet"
}
```

## 4) Analytics

**Endpoint**: `GET /api/v1/dashboard/analytics`

### Description

Returns completed-estimation totals grouped by month (keyed as e.g. `"Jun 2026"`).

### Response

```json
{
  "success": true,
  "data": {
    "Jun 2026": { "cost": 1400000, "revenue": 9500000, "profit": 8000000 }
  }
}
```

---

# 🤖 ML Inference Service

The backend depends on a separate Python (FastAPI) service for ML-assisted
predictions. Its location is configured via `ML_SERVER_URL` (default
`http://localhost:8000`). If it is unavailable, the backend logs a warning and
returns rule-based results only.

## Health Check

**Endpoint**: `GET {ML_SERVER_URL}/health`

```json
{ "status": "ok", "models_loaded": ["totalCostEstimation", "projectedRevenue", "projectedProfit", "roi"] }
```

The backend calls this on startup (non-fatal warning if it fails).

## Predict

**Endpoint**: `POST {ML_SERVER_URL}/predict`

The backend builds the payload from the saved estimation (see `ml-service.js`).
Key fields: `livestockType`, `productionType`, `productionSystem`,
`numberOfAnimals`, `cycleDuration`, `location`, `hasHousing`, `housingType`,
`capacity`, `equipmentCount`, `feedPrice`, `laborCost`, `electricityCost`,
`mortalityRate`, `vaccinationProgram`, `medicationIntensity`,
`vetServiceFrequency`, `diseaseRiskLevel`, `sellingPricePerKg`, `eggPricePerEgg`,
`milkPricePerLiter`, `year`, `month`.

### Response

```json
{
  "totalCostEstimation": 218500.0,
  "projectedRevenue": 352000.0,
  "projectedProfit": 133500.0,
  "roi": 61.1,
  "confidenceNote": "ML-assisted estimate. Actual costs may vary based on local market conditions."
}
```

> The ML service must have trained models present (`saved_model/*.pkl`). These are
> git-ignored, so on a fresh checkout run `python model/train_model.py` before
> starting the service, otherwise it raises `RuntimeError: Models not found`.

---

# Running the Backend

## Environment Variables

The backend reads the following (see `server.js` and `config/env.js`):

```
PORT=5000
MONGO_URL=<mongodb connection string>
JWT_SECRET=<secret used to sign cookies and tokens>
CLIENT_URL=http://localhost:5173
ML_SERVER_URL=http://localhost:8000

# Email (config/env.js)
EMAIL_PROVIDER=
MAIL_FROM=
BREVO_API_KEY=
MAILTRAP_HOST=
MAILTRAP_PORT=
MAILTRAP_USER=
MAILTRAP_PASS=
```

## Install & Start

```bash
npm install
npm run dev     # nodemon (development)
npm start       # node server.js (production)
```

---

## Summary for Frontend Dev

The frontend dev should not need to read backend source code to discover
endpoints. This document is the API contract to integrate against. Key points:

- Estimation base path is **singular**: `/api/v1/estimation`.
- The wizard is **5 steps**; market inputs live in step 4, not a separate step.
- `calculate` is a **POST**, and `mlResults` may be absent if the ML server is down.
- Dashboard responses are wrapped in `{ "success": true, "data": ... }` (except
  `/recent`, which uses `{ "success": true, "estimations": [...] }`).
