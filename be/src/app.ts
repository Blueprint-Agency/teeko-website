import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from "./routes/authRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import adminRoutes from "./routes/adminRoutes";
import esimRoutes from "./routes/esimRoutes";
import blogRoutes from "./routes/blogRoutes";
import locationRoutes from "./routes/locationRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { seedAdmin } from "./db/seedAdmin";

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3010'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/admin", adminRoutes);
app.use("/esim", esimRoutes);
app.use("/blog", blogRoutes);
app.use("/locations", locationRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Teeko API is running!" });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await seedAdmin();
});
