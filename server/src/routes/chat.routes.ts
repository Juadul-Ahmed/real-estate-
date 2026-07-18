import { Router } from "express";
import { auth } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import * as ctrl from "../controllers/chat.controller";

const router = Router();

router.post("/stream", auth, asyncHandler(ctrl.chatStream));
router.get("/history", asyncHandler(ctrl.getChatHistory));

export default router;
