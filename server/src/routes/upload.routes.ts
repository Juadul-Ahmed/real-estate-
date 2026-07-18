import { Router } from "express";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import * as ctrl from "../controllers/upload.controller";

const router = Router();

router.post("/", auth, asyncHandler(ctrl.uploadImage));

export default router;
