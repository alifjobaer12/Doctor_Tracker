import { Router } from "express";
import authRoutes from "./auth.routes.js";
import doctorRoutes from "./doctor.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/doctors", doctorRoutes);

export default apiRouter;
