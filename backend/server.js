import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// admin routes
app.use("/admin", adminRoutes);

// user routes
app.use("/api", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


