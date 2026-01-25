import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from "./routes/authRoutes";
import locationRoutes from "./routes/locationRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import adminRoutes from "./routes/adminRoutes";
import esimRoutes from "./routes/esimRoutes";
import blogRoutes from "./routes/blogRoutes";
import { seedAdmin } from "./db/seedAdmin";

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/locations", locationRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/admin", adminRoutes);
app.use("/esim", esimRoutes);
app.use("/blog", blogRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Teeko API is running" });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await seedAdmin();
});
