import { Router } from "express";
import authRoutes from "./auth.routes.js";
import doctorRoutes from "./doctor.routes.js";
import patientRoutes from "./patient.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/doctors", doctorRoutes);
apiRouter.use("/patients", patientRoutes);
apiRouter.use("/analytics", analyticsRoutes);

export default apiRouter;
