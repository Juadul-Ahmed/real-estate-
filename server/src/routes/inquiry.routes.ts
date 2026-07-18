import { Router } from "express";
import { auth, roleGuard } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { inquirySchema, messageSchema } from "../validators";
import * as ctrl from "../controllers/inquiry.controller";

const router = Router();

router.post("/", auth, validateBody(inquirySchema), ctrl.createInquiry);
router.get("/buyer", auth, roleGuard("buyer"), ctrl.listInquiriesForBuyer);
router.get("/broker", auth, roleGuard("broker"), ctrl.listInquiriesForBroker);
router.get("/:id/messages", auth, ctrl.getInquiryMessages);
router.post("/message", auth, validateBody(messageSchema), ctrl.sendMessage);

export default router;
