import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimit.js";
import apiRouter from "./routes/index.js";
import { swaggerDocument } from "./config/swagger.js";
import { connectDB } from "./config/db.js";

const app = express();

// Trust reverse proxy (Next.js rewrite proxy, Render/Railway/Vercel)
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// Parse configured origins (supports comma-separated list and automatically strips trailing slashes)
const configuredOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

const allowedOriginsSet = new Set([
  ...configuredOrigins,
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (Next.js server rewrite proxy, curl, uptime probes)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      // Allow if exactly in allowed list
      if (allowedOriginsSet.has(normalizedOrigin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments if main client is on vercel.app
      if (
        configuredOrigins.some((o) => o.includes("vercel.app")) &&
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      // Allow any localhost port in development or test
      if (
        (env.NODE_ENV === "development" || env.NODE_ENV === "test") &&
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Global rate limiting
app.use("/api", generalLimiter);

// Health probe (unauthenticated)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Interactive Swagger UI documentation
const swaggerOptions: swaggerUi.SwaggerOptions = {
  customSiteTitle: "Doctor Tracker API Documentation",
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js",
  ],
};

app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Ensure MongoDB connection before handling REST API requests (essential for serverless / Vercel)
app.use("/api/v1", async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Mount REST API v1
app.use("/api/v1", apiRouter);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
