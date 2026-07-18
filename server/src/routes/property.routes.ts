import { Router } from "express";
import { auth, roleGuard } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { propertySchema } from "../validators";
import * as ctrl from "../controllers/property.controller";

const router = Router();

router.get("/", ctrl.listProperties);
router.get("/:id", ctrl.getProperty);

router.post("/", auth, roleGuard("broker", "admin"), validateBody(propertySchema), ctrl.createProperty);
router.put("/:id", auth, roleGuard("broker", "admin"), validateBody(propertySchema), ctrl.updateProperty);
router.delete("/:id", auth, roleGuard("broker", "admin"), ctrl.deleteProperty);
router.get("/broker/stats", auth, roleGuard("broker"), ctrl.brokerStats);

export default router;
