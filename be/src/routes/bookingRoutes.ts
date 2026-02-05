import { Router } from "express";
import {
    createBooking,
    cancelBooking,
    getUserBookings,
    getAdminBookings,
    updateBookingStatus,
    checkBookingStatus
} from "../controllers/bookingController";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// User routes
router.post("/", authenticateToken, createBooking);
router.get("/my-bookings", authenticateToken, getUserBookings);
router.get("/check-status/:esimId", authenticateToken, checkBookingStatus);
router.post("/:bookingId/cancel", authenticateToken, cancelBooking);

// Admin routes
router.get("/admin/all", requireAdmin, getAdminBookings);
router.patch("/admin/:bookingId/status", requireAdmin, updateBookingStatus);

export default router;
