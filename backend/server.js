import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS FIX
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://onlgstreets.com",
    "https://www.onlgstreets.com",
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}));

// Routes
app.use("/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });




