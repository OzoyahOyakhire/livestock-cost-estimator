import axios from "axios";

// Use environment-specific variables when available.
// - In development, prefer `VITE_API_URL_DEV` (if set) then fallback to localhost.
// - In production, prefer `VITE_API_URL` (set via Vercel) then fallback to the configured production URL.
const DEFAULT_DEV = "http://localhost:3000/api/v1";
const DEFAULT_PROD =
  "https://livestock-cost-estimator-backend.onrender.com/api/v1";

const envUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL;
const BASE_URL = envUrl || (import.meta.env.DEV ? DEFAULT_DEV : DEFAULT_PROD);

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
