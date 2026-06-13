//dotenv configuration
import dotenv from "dotenv";
dotenv.config();

//express
import express from "express";
const app = express();

//rest of the packages
import cookieParser from "cookie-parser";
import cors from "cors";

//database
import connectDB from "./db/connect.js";

//routes
import authRouter from "./routes/auth-route.js";
import estimationRouter from "./routes/estimation-route.js";
import userRouter from "./routes/user-route.js";
import dashboardRouter from "./routes/dashboard-route.js";

//middlewares
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import { checkMLHealth } from "./service/ml-service.js";  // optional health check

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/estimation", estimationRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

//starting program
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await checkMLHealth(); // warns in console if ML server is down, doesn't crash
    app.listen(port, () => console.log(`app is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();