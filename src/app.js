import express from "express";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";

export const app = express();

// Allow requests from the React frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);