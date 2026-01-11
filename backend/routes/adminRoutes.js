import express from "express";
import { adminLogin, getPeople, addPerson, updatePerson, deletePerson } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Protected routes
router.get("/people", verifyToken, getPeople);
router.post("/people", verifyToken, addPerson);
router.put("/people/:id", verifyToken, updatePerson);
router.delete("/people/:id", verifyToken, deletePerson);

export default router;


