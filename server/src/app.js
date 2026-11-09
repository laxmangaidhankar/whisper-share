import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env.js";
import instantShareRoutes from "./routes/instantShare.routes.js";

const app = express();

// Security
app.disable("x-powered-by");
app.use(helmet());


// CORS
app.use(cors({
    origin: env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "X-Share-Token"]
}));

// Request parsing
app.use(express.json({ limit: "16kb" }));

app.use("/api/v1/instant-share", instantShareRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WhisperShare API is running"
    });
});

export default app;