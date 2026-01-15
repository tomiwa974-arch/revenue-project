import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", UserSchema);

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("admin123", 10);

await User.create({
  email: "admin@revenue.com",
  password: hashedPassword,
  role: "admin",
});

console.log("Admin user created");
process.exit();

