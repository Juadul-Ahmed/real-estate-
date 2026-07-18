import { Router } from "express";
import { auth, roleGuard } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { userUpdateSchema, statusSchema } from "../validators";
import * as ctrl from "../controllers/admin.controller";

const router = Router();

router.use(auth, roleGuard("admin"));

router.get("/users", ctrl.listUsers);
router.get("/users/:id", ctrl.getUser);
router.put("/users/:id", validateBody(userUpdateSchema), ctrl.updateUser);
router.delete("/users/:id", ctrl.deleteUser);

router.get("/properties/pending", ctrl.listPendingProperties);
router.put("/properties/:id/status", validateBody(statusSchema), ctrl.setPropertyStatus);
router.delete("/properties/:id", ctrl.adminDeleteProperty);

router.get("/analytics", ctrl.analytics);

export default router;
