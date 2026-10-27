import { Router } from "express";
import {
  getSummary,
  getPatientsPerDoctor,
  getTimeline,
  getConditions,
  getSpecializations,
} from "../controllers/analytics.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { analyticsSchemas } from "../schemas/analytics.schema.js";

const router = Router();

// Protected analytics endpoints
router.use(authenticate, authorize("admin"));

router.get("/summary", getSummary);
router.get("/patients-per-doctor", validate(analyticsSchemas.patientsPerDoctor), getPatientsPerDoctor);
router.get("/timeline", validate(analyticsSchemas.timeline), getTimeline);
router.get("/conditions", getConditions);
router.get("/specializations", getSpecializations);

export default router;
