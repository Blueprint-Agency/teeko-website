import { Router } from "express";
import {
    createBooking,
    cancelBooking,
    getUserBookings,
    getAdminBookings,
    updateBookingStatus,
    checkBookingStatus,
    completeBookingByCode
} from "../controllers/bookingController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// User routes
router.post("/", authenticateToken, createBooking);
router.get("/my-bookings", authenticateToken, getUserBookings);
router.get("/check-status/:simId", authenticateToken, checkBookingStatus);
router.post("/:bookingId/cancel", authenticateToken, cancelBooking);

// Admin routes
router.get("/admin/all", authenticateToken, requireAdmin, getAdminBookings);
router.patch("/:bookingId/status", authenticateToken, requireAdmin, updateBookingStatus);
router.post("/complete-by-code", authenticateToken, requireAdmin, completeBookingByCode);

export default router;
