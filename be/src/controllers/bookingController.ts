import { Request, Response } from "express";
import { db } from "../db";
import { esimBookings, esimPackages, users } from "../db/schema";
import { eq, and, ne } from "drizzle-orm";
import { sendBookingConfirmation, sendCancellationEmail } from "../utils/email";

interface AuthRequest extends Request {
    user?: any;
}

export const createBooking = async (req: AuthRequest, res: Response) => {
    const { esimId, quantity } = req.body;
    const userId = req.user.id;

    try {
        // Check if user already has an active booking for this eSIM
        const existingBooking = await db.select()
            .from(esimBookings)
            .where(
                and(
                    eq(esimBookings.userId, userId),
                    eq(esimBookings.esimId, esimId),
                    eq(esimBookings.status, "booked")
                )
            )
            .limit(1);

        if (existingBooking.length > 0) {
            res.status(400).json({ message: "You already have an active booking for this eSIM." });
            return;
        }

        const esim = await db.select().from(esimPackages).where(eq(esimPackages.id, esimId)).limit(1);
        if (esim.length === 0) {
            res.status(404).json({ message: "eSIM package not found." });
            return;
        }

        let newBooking;
        await db.transaction(async (tx) => {
            const [insertedBooking] = await tx.insert(esimBookings).values({
                userId,
                esimId,
                quantity: quantity.toString(),
                status: "booked"
            }).returning();
            newBooking = insertedBooking;

            // Send confirmation email within transaction
            await sendBookingConfirmation(req.user.email, esim[0].packageName, quantity.toString(), esim[0].price || "Contact for Price");
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
            booking: esimBookings,
            esim: esimPackages
        })
            .from(esimBookings)
            .innerJoin(esimPackages, eq(esimBookings.esimId, esimPackages.id))
            .where(and(eq(esimBookings.id, bookingId as string), eq(esimBookings.userId, userId)))
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
            await tx.update(esimBookings)
                .set({ status: "cancelled", updatedAt: new Date() })
                .where(eq(esimBookings.id, bookingId as string));

            // Send cancellation email within transaction
            await sendCancellationEmail(req.user.email, bookingResult[0].esim.packageName);
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
            id: esimBookings.id,
            quantity: esimBookings.quantity,
            status: esimBookings.status,
            createdAt: esimBookings.createdAt,
            packageName: esimPackages.packageName,
            price: esimPackages.price,
            featureImage: esimPackages.featureImage
        })
            .from(esimBookings)
            .innerJoin(esimPackages, eq(esimBookings.esimId, esimPackages.id))
            .where(eq(esimBookings.userId, userId));

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAdminBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await db.select({
            id: esimBookings.id,
            quantity: esimBookings.quantity,
            status: esimBookings.status,
            createdAt: esimBookings.createdAt,
            packageName: esimPackages.packageName,
            userEmail: users.email
        })
            .from(esimBookings)
            .innerJoin(esimPackages, eq(esimBookings.esimId, esimPackages.id))
            .innerJoin(users, eq(esimBookings.userId, users.id));

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching admin bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkBookingStatus = async (req: AuthRequest, res: Response) => {
    const { esimId } = req.params;
    const userId = req.user.id;

    try {
        const booking = await db.select()
            .from(esimBookings)
            .where(
                and(
                    eq(esimBookings.userId, userId),
                    eq(esimBookings.esimId, esimId as string),
                    eq(esimBookings.status, "booked")
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
            status: esimBookings.status,
            userEmail: users.email,
            packageName: esimPackages.packageName
        })
            .from(esimBookings)
            .innerJoin(users, eq(esimBookings.userId, users.id))
            .innerJoin(esimPackages, eq(esimBookings.esimId, esimPackages.id))
            .where(eq(esimBookings.id, bookingId as string))
            .limit(1);

        if (bookingResult.length === 0) {
            res.status(404).json({ message: "Booking not found." });
            return;
        }

        await db.transaction(async (tx) => {
            await tx.update(esimBookings)
                .set({ status: status as any, updatedAt: new Date() })
                .where(eq(esimBookings.id, bookingId as string));

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
