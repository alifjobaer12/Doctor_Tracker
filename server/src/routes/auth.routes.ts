import { Router } from "express";
import { login, logout, getMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginLimiter } from "../middlewares/rateLimit.js";
import { loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;
