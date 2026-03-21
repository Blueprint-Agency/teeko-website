import { Router } from "express";
import { login, register, verifyCode, resendCode, googleLogin } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-code", verifyCode);
router.post("/resend-code", resendCode);
router.post("/google-login", googleLogin);

export default router;
