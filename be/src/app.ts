import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from "./routes/authRoutes";
import locationRoutes from "./routes/locationRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/locations", locationRoutes);
app.use("/restaurants", restaurantRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Teeko Advisor API is running" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
