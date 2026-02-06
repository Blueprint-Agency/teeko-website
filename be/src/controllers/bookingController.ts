import { Request, Response } from "express";
import { db } from "../db";
import { simBookings, simPackages, users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { sendBookingConfirmation, sendCancellationEmail } from "../utils/email";
import crypto from "crypto";

interface AuthRequest extends Request {
    user?: any;
}

export const createBooking = async (req: AuthRequest, res: Response) => {
    const { simId, quantity } = req.body;
    const userId = req.user.id;

    try {
        // Check if user already has an active booking for this SIM
        const existingBooking = await db.select()
            .from(simBookings)
            .where(
                and(
                    eq(simBookings.userId, userId),
                    eq(simBookings.simId, simId),
                    eq(simBookings.status, "booked")
                )
            )
            .limit(1);

        if (existingBooking.length > 0) {
            res.status(400).json({ message: "You already have an active booking for this SIM." });
            return;
        }

        const sim = await db.select().from(simPackages).where(eq(simPackages.id, simId)).limit(1);
        if (sim.length === 0) {
            res.status(404).json({ message: "SIM package not found." });
            return;
        }

        let newBooking;
        await db.transaction(async (tx) => {
            const verificationCode = crypto.randomBytes(6).toString('hex').toUpperCase();

            const [insertedBooking] = await tx.insert(simBookings).values({
                userId,
                simId,
                quantity: quantity.toString(),
                status: "booked",
                verificationCode
            }).returning();
            newBooking = insertedBooking;

            // Send confirmation email within transaction
            await sendBookingConfirmation(req.user.email, sim[0].packageName, quantity.toString(), sim[0].price || "Contact for Price", verificationCode);
        });

        res.status(201).json(newBooking);
    } catch (error: any) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    try {
        const bookingResult = await db.select({
            booking: simBookings,
            sim: simPackages
        })
            .from(simBookings)
            .innerJoin(simPackages, eq(simBookings.simId, simPackages.id))
            .where(and(eq(simBookings.id, bookingId as string), eq(simBookings.userId, userId)))
            .limit(1);

        if (bookingResult.length === 0) {
            res.status(404).json({ message: "Booking not found." });
            return;
        }

        const booking = bookingResult[0].booking;

        if (booking.status !== "booked") {
            res.status(400).json({ message: "Only active bookings can be cancelled." });
            return;
        }

        await db.transaction(async (tx) => {
            await tx.update(simBookings)
                .set({ status: "cancelled", updatedAt: new Date() })
                .where(eq(simBookings.id, bookingId as string));

            // Send cancellation email within transaction
            await sendCancellationEmail(req.user.email, bookingResult[0].sim.packageName);
        });

        res.json({ message: "Booking cancelled successfully." });
    } catch (error: any) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    try {
        const bookings = await db.select({
            id: simBookings.id,
            quantity: simBookings.quantity,
            status: simBookings.status,
            createdAt: simBookings.createdAt,
            packageName: simPackages.packageName,
            price: simPackages.price,
            featureImage: simPackages.featureImage,
            verificationCode: simBookings.verificationCode
        })
            .from(simBookings)
            .innerJoin(simPackages, eq(simBookings.simId, simPackages.id))
            .where(eq(simBookings.userId, userId));

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAdminBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await db.select({
            id: simBookings.id,
            quantity: simBookings.quantity,
            status: simBookings.status,
            createdAt: simBookings.createdAt,
            packageName: simPackages.packageName,
            userEmail: users.email,
            verificationCode: simBookings.verificationCode
        })
            .from(simBookings)
            .innerJoin(simPackages, eq(simBookings.simId, simPackages.id))
            .innerJoin(users, eq(simBookings.userId, users.id));

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkBookingStatus = async (req: AuthRequest, res: Response) => {
    const { simId } = req.params;
    const userId = req.user.id;

    try {
        const booking = await db.select()
            .from(simBookings)
            .where(
                and(
                    eq(simBookings.userId, userId),
                    eq(simBookings.simId, simId as string),
                    eq(simBookings.status, "booked")
                )
            )
            .limit(1);

        res.json({ isBooked: booking.length > 0 });
    } catch (error) {
        console.error("Error checking booking status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["completed", "expired", "rejected"].includes(status)) {
        res.status(400).json({ message: "Invalid status." });
        return;
    }

    try {
        const bookingResult = await db.select({
            status: simBookings.status,
            userEmail: users.email,
            packageName: simPackages.packageName
        })
            .from(simBookings)
            .innerJoin(users, eq(simBookings.userId, users.id))
            .innerJoin(simPackages, eq(simBookings.simId, simPackages.id))
            .where(eq(simBookings.id, bookingId as string))
            .limit(1);

        if (bookingResult.length === 0) {
            res.status(404).json({ message: "Booking not found." });
            return;
        }

        await db.transaction(async (tx) => {
            await tx.update(simBookings)
                .set({ status: status as any, updatedAt: new Date() })
                .where(eq(simBookings.id, bookingId as string));

            // If rejected, send email within transaction
            if (status === "rejected") {
                await sendCancellationEmail(bookingResult[0].userEmail, bookingResult[0].packageName);
            }
        });

        res.json({ message: `Booking status updated to ${status}.` });
    } catch (error: any) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const completeBookingByCode = async (req: AuthRequest, res: Response) => {
    const { code } = req.body;

    if (!code) {
        res.status(400).json({ message: "Verification code is required." });
        return;
    }

    try {
        // Join with simPackages and users to get full details
        const bookingResult = await db.select({
            id: simBookings.id,
            quantity: simBookings.quantity,
            status: simBookings.status,
            verificationCode: simBookings.verificationCode,
            createdAt: simBookings.createdAt,
            packageName: simPackages.packageName,
            price: simPackages.price,
            userEmail: users.email
        })
            .from(simBookings)
            .leftJoin(simPackages, eq(simBookings.simId, simPackages.id))
            .leftJoin(users, eq(simBookings.userId, users.id))
            .where(eq(simBookings.verificationCode, code.toUpperCase()))
            .limit(1);

        if (bookingResult.length === 0) {
            res.status(404).json({ message: "Invalid verification code." });
            return;
        }

        const targetBooking = bookingResult[0];

        if (targetBooking.status !== "booked") {
            res.status(400).json({ message: `This booking is already ${targetBooking.status}.` });
            return;
        }

        await db.update(simBookings)
            .set({ status: "completed", updatedAt: new Date() })
            .where(eq(simBookings.id, targetBooking.id));

        res.json({
            message: "Booking completed successfully.",
            bookingId: targetBooking.id,
            booking: {
                id: targetBooking.id,
                packageName: targetBooking.packageName,
                quantity: targetBooking.quantity,
                price: targetBooking.price,
                userEmail: targetBooking.userEmail,
                verificationCode: targetBooking.verificationCode,
                createdAt: targetBooking.createdAt
            }
        });
    } catch (error: any) {
        console.error("Error completing booking by code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
