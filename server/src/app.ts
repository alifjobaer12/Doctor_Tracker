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

const app = express();

// Trust reverse proxy (Next.js rewrite proxy, Render/Railway/Vercel)
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
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

// Mount REST API v1
app.use("/api/v1", apiRouter);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

export default app;
