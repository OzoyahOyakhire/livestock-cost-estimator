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

//middlewares
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

//starting program
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`app is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
