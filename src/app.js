import express from "express";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";

export const app = express();

// Trust the reverse proxy when running on Render.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Allow requests from the deployed and local React frontend.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.use(requestLogger);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

// Handle unknown routes.
app.use(notFound);

// Handle errors from application routes and middleware.
app.use(errorHandler);
