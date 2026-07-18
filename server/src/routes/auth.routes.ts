import { Router } from "express";
import { auth, roleGuard } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators";
import * as ctrl from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateBody(registerSchema), ctrl.register);
router.post("/login", validateBody(loginSchema), ctrl.login);
router.get("/me", auth, ctrl.me);
router.put("/profile", auth, validateBody(updateProfileSchema), ctrl.updateProfile);
router.post("/favorites/:id", auth, ctrl.toggleFavorite);

export default router;
