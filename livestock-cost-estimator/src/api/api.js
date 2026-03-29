import axios from "axios";

export const api = axios.create({
  baseURL: "https://livestock-cost-estimator-backend.onrender.com/api/v1",
  withCredentials: true,
});

