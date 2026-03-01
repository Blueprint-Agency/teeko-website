import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getReferralStatus, applyReferralCode, getReferees } from "../controllers/referralController";

const router = Router();

router.get("/status", authenticateToken, getReferralStatus);
router.post("/apply", authenticateToken, applyReferralCode);
router.get("/referees", authenticateToken, getReferees);

export default router;
